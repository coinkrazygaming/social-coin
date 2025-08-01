import { RequestHandler } from "express";
import { realTimeDB } from '../utils/realTimeDatabase';
import { aiEmployeeManager } from '../utils/aiEmployeeManager';

// Get user wallet with real-time balances
export const handleGetUserWallet: RequestHandler = (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ success: false, error: 'User ID is required' });
    }
    
    const wallet = realTimeDB.getUserWallet(userId);
    const analytics = realTimeDB.getCurrentAnalytics();
    
    // Get recent wallet transactions
    const allTransactions = realTimeDB.getAllTransactions();
    const userTransactions = Array.from(allTransactions.values())
      .filter(tx => tx.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);
    
    // Calculate user statistics
    const userStats = calculateUserStats(userId, userTransactions);
    
    res.json({
      success: true,
      wallet: {
        userId,
        goldCoins: wallet.goldCoins,
        sweepsCoins: parseFloat(wallet.sweepsCoins.toFixed(2)),
        vipPoints: wallet.vipPoints,
        lastUpdated: wallet.lastUpdated,
        totalValue: (wallet.goldCoins * 0.01) + wallet.sweepsCoins
      },
      recentTransactions: userTransactions.map(tx => ({
        id: tx.id,
        type: tx.type || 'game_result',
        amount: tx.amount,
        currency: tx.currency || 'GC',
        description: tx.description || 'Game activity',
        timestamp: tx.timestamp,
        status: tx.status,
        gameId: tx.gameId,
        gameName: tx.gameName
      })),
      statistics: userStats,
      systemInfo: {
        usersOnline: analytics.realTime.usersOnlineNow,
        totalWalletValue: analytics.performance.totalWalletValue,
        serverTime: new Date()
      }
    });
  } catch (error) {
    console.error('Error fetching user wallet:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch wallet data' });
  }
};

// Update user wallet with real-time processing
export const handleUpdateUserWallet: RequestHandler = (req, res) => {
  try {
    const { userId } = req.params;
    const { goldCoins, sweepsCoins, vipPoints, reason, gameId, gameName } = req.body;
    
    if (!userId) {
      return res.status(400).json({ success: false, error: 'User ID is required' });
    }
    
    // Validate the update request
    const validation = validateWalletUpdate(goldCoins, sweepsCoins, vipPoints);
    if (!validation.valid) {
      return res.status(400).json({ success: false, error: validation.error });
    }
    
    // Get current wallet
    const currentWallet = realTimeDB.getUserWallet(userId);
    
    // Calculate new balances
    const newGoldCoins = goldCoins !== undefined ? currentWallet.goldCoins + goldCoins : currentWallet.goldCoins;
    const newSweepsCoins = sweepsCoins !== undefined ? currentWallet.sweepsCoins + sweepsCoins : currentWallet.sweepsCoins;
    const newVipPoints = vipPoints !== undefined ? currentWallet.vipPoints + vipPoints : currentWallet.vipPoints;
    
    // Ensure no negative balances
    if (newGoldCoins < 0 || newSweepsCoins < 0 || newVipPoints < 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Insufficient balance for this operation',
        currentBalance: {
          goldCoins: currentWallet.goldCoins,
          sweepsCoins: currentWallet.sweepsCoins,
          vipPoints: currentWallet.vipPoints
        }
      });
    }
    
    // Update wallet through real-time database
    const updateResult = realTimeDB.updateUserWallet(userId, newGoldCoins, newSweepsCoins, newVipPoints);
    
    // Record transaction
    const transactionId = realTimeDB.recordTransaction({
      userId,
      type: reason || 'manual_adjustment',
      amount: goldCoins || sweepsCoins || 0,
      currency: goldCoins ? 'GC' : 'SC',
      description: generateTransactionDescription(reason, goldCoins, sweepsCoins, vipPoints),
      gameId,
      gameName,
      previousBalance: {
        goldCoins: currentWallet.goldCoins,
        sweepsCoins: currentWallet.sweepsCoins,
        vipPoints: currentWallet.vipPoints
      },
      newBalance: {
        goldCoins: newGoldCoins,
        sweepsCoins: newSweepsCoins,
        vipPoints: newVipPoints
      },
      metadata: {
        source: 'api_update',
        reason: reason || 'manual_adjustment'
      }
    });
    
    // Create AI task for significant transactions
    if (Math.abs(goldCoins || 0) > 10000 || Math.abs(sweepsCoins || 0) > 100) {
      aiEmployeeManager.createTask({
        title: 'Large Wallet Transaction Review',
        description: `Significant wallet update for user ${userId}: ${goldCoins ? goldCoins + ' GC' : ''} ${sweepsCoins ? sweepsCoins + ' SC' : ''}`,
        type: 'wallet_review',
        priority: 'high',
        category: 'financial',
        data: {
          userId,
          transactionId,
          changes: { goldCoins, sweepsCoins, vipPoints },
          reason
        },
        requiresHumanApproval: true
      }, 'system');
    }
    
    // Log security event for monitoring
    if (Math.abs(sweepsCoins || 0) > 50) {
      realTimeDB.logSecurityEvent({
        type: 'large_sc_transaction',
        userId,
        amount: sweepsCoins,
        severity: 'medium',
        description: `Large Sweeps Coins transaction: ${sweepsCoins} SC`,
        source: 'wallet_update'
      });
    }
    
    res.json({
      success: true,
      message: 'Wallet updated successfully',
      wallet: updateResult.wallet,
      changes: updateResult.changes,
      transaction: {
        id: transactionId,
        type: reason || 'manual_adjustment',
        amount: goldCoins || sweepsCoins || 0,
        currency: goldCoins ? 'GC' : 'SC'
      },
      systemInfo: {
        timestamp: new Date(),
        serverTime: new Date(),
        processingTime: '< 100ms'
      }
    });
  } catch (error) {
    console.error('Error updating user wallet:', error);
    res.status(500).json({ success: false, error: 'Failed to update wallet' });
  }
};

// Process game result with real-time wallet updates
export const handleProcessGameResult: RequestHandler = (req, res) => {
  try {
    const { userId, gameId, gameName, betAmount, winAmount, currency, spinResult, sessionId } = req.body;
    
    if (!userId || !gameId || betAmount === undefined) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: userId, gameId, betAmount' 
      });
    }
    
    const currentWallet = realTimeDB.getUserWallet(userId);
    const netAmount = (winAmount || 0) - betAmount;
    
    // Validate sufficient balance for bet
    if (currency === 'SC' && currentWallet.sweepsCoins < betAmount) {
      return res.status(400).json({
        success: false,
        error: 'Insufficient Sweeps Coins balance',
        requiredAmount: betAmount,
        currentBalance: currentWallet.sweepsCoins
      });
    } else if (currency === 'GC' && currentWallet.goldCoins < betAmount) {
      return res.status(400).json({
        success: false,
        error: 'Insufficient Gold Coins balance',
        requiredAmount: betAmount,
        currentBalance: currentWallet.goldCoins
      });
    }
    
    // Process the game result
    let goldCoinsChange = 0;
    let sweepsCoinsChange = 0;
    
    if (currency === 'GC') {
      goldCoinsChange = netAmount;
    } else {
      sweepsCoinsChange = netAmount;
    }
    
    // Update wallet
    const newGoldCoins = currentWallet.goldCoins + goldCoinsChange;
    const newSweepsCoins = parseFloat((currentWallet.sweepsCoins + sweepsCoinsChange).toFixed(2));
    
    const updateResult = realTimeDB.updateUserWallet(userId, newGoldCoins, newSweepsCoins, currentWallet.vipPoints);
    
    // Update game session if provided
    if (sessionId) {
      realTimeDB.updateGameSession(sessionId, {
        spins: 1,
        totalBet: betAmount,
        totalWin: winAmount || 0,
        lastSpin: {
          bet: betAmount,
          win: winAmount || 0,
          result: spinResult,
          timestamp: new Date()
        }
      });
    }
    
    // Record detailed transaction
    const transactionId = realTimeDB.recordTransaction({
      userId,
      type: 'game_result',
      amount: netAmount,
      currency,
      description: `${gameName || gameId}: ${winAmount > 0 ? 'Win' : 'Bet'} ${Math.abs(netAmount)} ${currency}`,
      gameId,
      gameName,
      betAmount,
      winAmount: winAmount || 0,
      spinResult,
      sessionId,
      previousBalance: {
        goldCoins: currentWallet.goldCoins,
        sweepsCoins: currentWallet.sweepsCoins
      },
      newBalance: {
        goldCoins: newGoldCoins,
        sweepsCoins: newSweepsCoins
      }
    });
    
    // Check for big wins and create alerts
    if (winAmount && winAmount > 1000) {
      realTimeDB.createAlert({
        type: 'big_win',
        title: 'Big Win Alert',
        message: `Player won ${winAmount} ${currency} on ${gameName || gameId}!`,
        severity: winAmount > 5000 ? 'high' : 'medium',
        source: 'game_system',
        data: {
          userId,
          gameId,
          gameName,
          winAmount,
          currency,
          transactionId
        }
      });
      
      // Create AI task for win verification if very large
      if (winAmount > 2500) {
        aiEmployeeManager.createTask({
          title: 'Large Win Verification',
          description: `Verify large win of ${winAmount} ${currency} for user ${userId}`,
          type: 'win_verification',
          priority: 'high',
          category: 'security',
          data: {
            userId,
            gameId,
            winAmount,
            currency,
            transactionId,
            spinResult
          },
          requiresHumanApproval: winAmount > 10000
        }, 'josey-ai');
      }
    }
    
    res.json({
      success: true,
      message: 'Game result processed successfully',
      gameResult: {
        netAmount,
        betAmount,
        winAmount: winAmount || 0,
        currency,
        isWin: (winAmount || 0) > betAmount
      },
      wallet: updateResult.wallet,
      transaction: {
        id: transactionId,
        type: 'game_result',
        amount: netAmount,
        currency
      },
      session: sessionId ? {
        id: sessionId,
        updated: true
      } : null
    });
  } catch (error) {
    console.error('Error processing game result:', error);
    res.status(500).json({ success: false, error: 'Failed to process game result' });
  }
};

// Get wallet transaction history
export const handleGetWalletTransactions: RequestHandler = (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50, offset = 0, type, currency, dateFrom, dateTo } = req.query;
    
    if (!userId) {
      return res.status(400).json({ success: false, error: 'User ID is required' });
    }
    
    const allTransactions = realTimeDB.getAllTransactions();
    let userTransactions = Array.from(allTransactions.values())
      .filter(tx => tx.userId === userId);
    
    // Apply filters
    if (type) {
      userTransactions = userTransactions.filter(tx => tx.type === type);
    }
    
    if (currency) {
      userTransactions = userTransactions.filter(tx => tx.currency === currency);
    }
    
    if (dateFrom) {
      const fromDate = new Date(dateFrom as string);
      userTransactions = userTransactions.filter(tx => new Date(tx.timestamp) >= fromDate);
    }
    
    if (dateTo) {
      const toDate = new Date(dateTo as string);
      userTransactions = userTransactions.filter(tx => new Date(tx.timestamp) <= toDate);
    }
    
    // Sort by timestamp (newest first)
    userTransactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    // Apply pagination
    const paginatedTransactions = userTransactions.slice(Number(offset), Number(offset) + Number(limit));
    
    // Calculate summary statistics
    const summary = calculateTransactionSummary(userTransactions);
    
    res.json({
      success: true,
      transactions: paginatedTransactions,
      pagination: {
        total: userTransactions.length,
        limit: Number(limit),
        offset: Number(offset),
        hasMore: Number(offset) + Number(limit) < userTransactions.length
      },
      summary,
      filters: {
        type: type || 'all',
        currency: currency || 'all',
        dateFrom: dateFrom || null,
        dateTo: dateTo || null
      }
    });
  } catch (error) {
    console.error('Error fetching wallet transactions:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch transactions' });
  }
};

// Get real-time wallet statistics
export const handleGetWalletStats: RequestHandler = (req, res) => {
  try {
    const { userId } = req.params;
    const { timeframe = '7d' } = req.query;
    
    if (!userId) {
      return res.status(400).json({ success: false, error: 'User ID is required' });
    }
    
    const wallet = realTimeDB.getUserWallet(userId);
    const allTransactions = realTimeDB.getAllTransactions();
    const userTransactions = Array.from(allTransactions.values())
      .filter(tx => tx.userId === userId);
    
    // Filter by timeframe
    const timeframeDays = getTimeframeDays(timeframe as string);
    const cutoffDate = new Date(Date.now() - timeframeDays * 24 * 60 * 60 * 1000);
    const recentTransactions = userTransactions.filter(tx => new Date(tx.timestamp) >= cutoffDate);
    
    // Calculate statistics
    const stats = {
      currentBalance: {
        goldCoins: wallet.goldCoins,
        sweepsCoins: wallet.sweepsCoins,
        vipPoints: wallet.vipPoints,
        totalValue: (wallet.goldCoins * 0.01) + wallet.sweepsCoins
      },
      periodStats: {
        timeframe,
        totalTransactions: recentTransactions.length,
        totalDeposited: calculateTotalDeposited(recentTransactions),
        totalWithdrawn: calculateTotalWithdrawn(recentTransactions),
        netChange: calculateNetChange(recentTransactions),
        gamesPlayed: calculateGamesPlayed(recentTransactions),
        biggestWin: calculateBiggestWin(recentTransactions),
        totalWagered: calculateTotalWagered(recentTransactions)
      },
      gameBreakdown: calculateGameBreakdown(recentTransactions),
      trends: calculateWalletTrends(userTransactions, timeframeDays),
      achievements: calculateWalletAchievements(wallet, userTransactions)
    };
    
    res.json({
      success: true,
      userId,
      timeframe,
      statistics: stats,
      lastUpdated: new Date()
    });
  } catch (error) {
    console.error('Error fetching wallet statistics:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch wallet statistics' });
  }
};

// Helper functions

function validateWalletUpdate(goldCoins?: number, sweepsCoins?: number, vipPoints?: number): { valid: boolean; error?: string } {
  if (goldCoins !== undefined && (typeof goldCoins !== 'number' || !isFinite(goldCoins))) {
    return { valid: false, error: 'Invalid goldCoins value' };
  }
  
  if (sweepsCoins !== undefined && (typeof sweepsCoins !== 'number' || !isFinite(sweepsCoins))) {
    return { valid: false, error: 'Invalid sweepsCoins value' };
  }
  
  if (vipPoints !== undefined && (typeof vipPoints !== 'number' || !isFinite(vipPoints))) {
    return { valid: false, error: 'Invalid vipPoints value' };
  }
  
  // Check for reasonable limits
  if (goldCoins !== undefined && Math.abs(goldCoins) > 1000000) {
    return { valid: false, error: 'goldCoins change exceeds maximum limit' };
  }
  
  if (sweepsCoins !== undefined && Math.abs(sweepsCoins) > 10000) {
    return { valid: false, error: 'sweepsCoins change exceeds maximum limit' };
  }
  
  return { valid: true };
}

function generateTransactionDescription(reason?: string, goldCoins?: number, sweepsCoins?: number, vipPoints?: number): string {
  if (reason) return reason;
  
  const changes = [];
  if (goldCoins) changes.push(`${goldCoins > 0 ? '+' : ''}${goldCoins} GC`);
  if (sweepsCoins) changes.push(`${sweepsCoins > 0 ? '+' : ''}${sweepsCoins} SC`);
  if (vipPoints) changes.push(`${vipPoints > 0 ? '+' : ''}${vipPoints} VIP`);
  
  return `Wallet adjustment: ${changes.join(', ')}`;
}

function calculateUserStats(userId: string, transactions: any[]): any {
  const totalTransactions = transactions.length;
  const totalWagered = transactions
    .filter(tx => tx.betAmount)
    .reduce((sum, tx) => sum + tx.betAmount, 0);
  
  const totalWon = transactions
    .filter(tx => tx.winAmount)
    .reduce((sum, tx) => sum + tx.winAmount, 0);
  
  const gamesPlayed = new Set(transactions.map(tx => tx.gameId)).size;
  
  return {
    totalTransactions,
    totalWagered: parseFloat(totalWagered.toFixed(2)),
    totalWon: parseFloat(totalWon.toFixed(2)),
    netAmount: parseFloat((totalWon - totalWagered).toFixed(2)),
    gamesPlayed,
    averageBet: totalTransactions > 0 ? parseFloat((totalWagered / totalTransactions).toFixed(2)) : 0,
    winRate: totalWagered > 0 ? parseFloat(((totalWon / totalWagered) * 100).toFixed(1)) : 0
  };
}

function getTimeframeDays(timeframe: string): number {
  const timeframes: { [key: string]: number } = {
    '1d': 1,
    '7d': 7,
    '30d': 30,
    '90d': 90,
    '1y': 365
  };
  return timeframes[timeframe] || 7;
}

function calculateTotalDeposited(transactions: any[]): number {
  return transactions
    .filter(tx => tx.type === 'purchase' || tx.type === 'deposit')
    .reduce((sum, tx) => sum + (tx.amount > 0 ? tx.amount : 0), 0);
}

function calculateTotalWithdrawn(transactions: any[]): number {
  return transactions
    .filter(tx => tx.type === 'withdrawal' || tx.type === 'redemption')
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
}

function calculateNetChange(transactions: any[]): number {
  return transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);
}

function calculateGamesPlayed(transactions: any[]): number {
  return new Set(transactions.filter(tx => tx.gameId).map(tx => tx.gameId)).size;
}

function calculateBiggestWin(transactions: any[]): number {
  return Math.max(0, ...transactions.map(tx => tx.winAmount || 0));
}

function calculateTotalWagered(transactions: any[]): number {
  return transactions
    .filter(tx => tx.betAmount)
    .reduce((sum, tx) => sum + tx.betAmount, 0);
}

function calculateGameBreakdown(transactions: any[]): any {
  const breakdown: { [key: string]: any } = {};
  
  transactions.forEach(tx => {
    if (tx.gameId) {
      if (!breakdown[tx.gameId]) {
        breakdown[tx.gameId] = {
          gameName: tx.gameName || tx.gameId,
          totalWagered: 0,
          totalWon: 0,
          spins: 0
        };
      }
      
      breakdown[tx.gameId].totalWagered += tx.betAmount || 0;
      breakdown[tx.gameId].totalWon += tx.winAmount || 0;
      breakdown[tx.gameId].spins += 1;
    }
  });
  
  return Object.values(breakdown);
}

function calculateWalletTrends(transactions: any[], days: number): any {
  const dailyData: { [key: string]: any } = {};
  
  transactions.forEach(tx => {
    const date = new Date(tx.timestamp).toDateString();
    if (!dailyData[date]) {
      dailyData[date] = { deposits: 0, withdrawals: 0, gameActivity: 0 };
    }
    
    if (tx.amount > 0) {
      dailyData[date].deposits += tx.amount;
    } else {
      dailyData[date].withdrawals += Math.abs(tx.amount);
    }
    
    if (tx.type === 'game_result') {
      dailyData[date].gameActivity += 1;
    }
  });
  
  return Object.entries(dailyData)
    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
    .slice(-days)
    .map(([date, data]) => ({ date, ...data }));
}

function calculateWalletAchievements(wallet: any, transactions: any[]): any[] {
  const achievements = [];
  
  if (wallet.goldCoins > 100000) {
    achievements.push({ name: 'Gold Collector', description: 'Accumulated over 100,000 Gold Coins' });
  }
  
  if (wallet.sweepsCoins > 500) {
    achievements.push({ name: 'Sweeps Master', description: 'Accumulated over 500 Sweeps Coins' });
  }
  
  if (transactions.length > 1000) {
    achievements.push({ name: 'Active Player', description: 'Completed over 1,000 transactions' });
  }
  
  const bigWins = transactions.filter(tx => (tx.winAmount || 0) > 1000).length;
  if (bigWins > 10) {
    achievements.push({ name: 'Big Winner', description: 'Won big 10+ times' });
  }
  
  return achievements;
}

function calculateTransactionSummary(transactions: any[]): any {
  const total = transactions.length;
  const deposits = transactions.filter(tx => tx.type === 'purchase' || tx.type === 'deposit').length;
  const withdrawals = transactions.filter(tx => tx.type === 'withdrawal' || tx.type === 'redemption').length;
  const gameResults = transactions.filter(tx => tx.type === 'game_result').length;
  
  const totalAmount = transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);
  const totalWagered = transactions.filter(tx => tx.betAmount).reduce((sum, tx) => sum + tx.betAmount, 0);
  const totalWon = transactions.filter(tx => tx.winAmount).reduce((sum, tx) => sum + tx.winAmount, 0);
  
  return {
    totalTransactions: total,
    transactionTypes: {
      deposits,
      withdrawals,
      gameResults,
      other: total - deposits - withdrawals - gameResults
    },
    amounts: {
      netAmount: parseFloat(totalAmount.toFixed(2)),
      totalWagered: parseFloat(totalWagered.toFixed(2)),
      totalWon: parseFloat(totalWon.toFixed(2)),
      winLossRatio: totalWagered > 0 ? parseFloat((totalWon / totalWagered).toFixed(3)) : 0
    }
  };
}
