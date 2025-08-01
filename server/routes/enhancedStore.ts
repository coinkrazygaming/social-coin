import express from 'express';
import { Request, Response } from 'express';

const router = express.Router();

// Mock user wallets and transaction storage
const userWallets = new Map<string, { goldCoins: number; sweepsCoins: number; vipPoints: number }>();
const transactions = new Map<string, any>();
const userPurchaseHistory = new Map<string, any>();

// Initialize some sample wallets
userWallets.set('user1', { goldCoins: 5000, sweepsCoins: 25.50, vipPoints: 120 });
userWallets.set('admin', { goldCoins: 100000, sweepsCoins: 500.00, vipPoints: 5000 });

// Sample packages
const packages = [
  {
    id: 'starter-pack',
    name: 'Starter Pack',
    description: 'Perfect for new players',
    goldCoins: 1000,
    bonusSweepsCoins: 5,
    price: 4.99,
    originalPrice: 5.99,
    features: ['1,000 Gold Coins', '5 Bonus Sweeps Coins', 'Instant delivery'],
    isActive: true,
    popular: false,
    bestValue: false
  },
  {
    id: 'value-pack',
    name: 'Value Pack',
    description: 'Most popular choice',
    goldCoins: 5000,
    bonusSweepsCoins: 25,
    price: 19.99,
    originalPrice: 24.99,
    features: ['5,000 Gold Coins', '25 Bonus Sweeps Coins', 'VIP bonus', 'Priority support'],
    isActive: true,
    popular: true,
    bestValue: false
  },
  {
    id: 'premium-pack',
    name: 'Premium Pack',
    description: 'Maximum value package',
    goldCoins: 15000,
    bonusSweepsCoins: 100,
    price: 49.99,
    originalPrice: 69.99,
    features: ['15,000 Gold Coins', '100 Bonus Sweeps Coins', 'VIP status upgrade', 'Exclusive bonuses'],
    isActive: true,
    popular: false,
    bestValue: true
  },
  {
    id: 'mega-pack',
    name: 'Mega Pack',
    description: 'For serious players',
    goldCoins: 35000,
    bonusSweepsCoins: 250,
    price: 99.99,
    originalPrice: 139.99,
    features: ['35,000 Gold Coins', '250 Bonus Sweeps Coins', 'Platinum VIP status', 'Personal account manager'],
    isActive: true,
    popular: false,
    bestValue: false
  }
];

// Get user wallet balance
router.get('/wallet/:userId', (req: Request, res: Response) => {
  const { userId } = req.params;
  const wallet = userWallets.get(userId) || { goldCoins: 0, sweepsCoins: 0, vipPoints: 0 };
  
  res.json({
    success: true,
    wallet
  });
});

// Get available packages
router.get('/packages', (req: Request, res: Response) => {
  const activeOnly = req.query.active === 'true';
  const filteredPackages = activeOnly ? packages.filter(pkg => pkg.isActive) : packages;
  
  res.json(filteredPackages);
});

// Process purchase with enhanced checkout data
router.post('/purchase', (req: Request, res: Response) => {
  try {
    const { userId, username, transactionData } = req.body;
    
    if (!userId || !transactionData) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Find the package
    const selectedPackage = packages.find(pkg => pkg.id === transactionData.packageId);
    if (!selectedPackage) {
      return res.status(404).json({
        success: false,
        error: 'Package not found'
      });
    }

    // Validate payment amount
    if (transactionData.summary.total < selectedPackage.price * 0.95) { // Allow for minor discounts
      return res.status(400).json({
        success: false,
        error: 'Invalid payment amount'
      });
    }

    // Get or create user wallet
    let userWallet = userWallets.get(userId);
    if (!userWallet) {
      userWallet = { goldCoins: 0, sweepsCoins: 0, vipPoints: 0 };
      userWallets.set(userId, userWallet);
    }

    // Update wallet balances
    userWallet.goldCoins += transactionData.goldCoinsAwarded;
    userWallet.sweepsCoins += transactionData.sweepsCoinsBonus;
    userWallet.vipPoints += transactionData.vipPointsEarned;

    // Store transaction
    const enhancedTransaction = {
      ...transactionData,
      userId,
      username,
      packageData: selectedPackage,
      walletAfter: { ...userWallet },
      processedAt: new Date().toISOString(),
      status: 'completed'
    };
    
    transactions.set(transactionData.id, enhancedTransaction);

    // Update purchase history
    let history = userPurchaseHistory.get(userId);
    if (!history) {
      history = {
        userId,
        username,
        transactions: [],
        totalSpent: 0,
        totalGoldCoins: 0,
        totalSweepsCoins: 0,
        vipStatus: 'bronze',
        vipPoints: 0
      };
    }

    history.transactions.unshift(enhancedTransaction);
    history.totalSpent += transactionData.summary.total;
    history.totalGoldCoins += transactionData.goldCoinsAwarded;
    history.totalSweepsCoins += transactionData.sweepsCoinsBonus;
    history.vipPoints = userWallet.vipPoints;

    // Update VIP status based on total spent
    if (history.totalSpent >= 500) history.vipStatus = 'platinum';
    else if (history.totalSpent >= 200) history.vipStatus = 'gold';
    else if (history.totalSpent >= 50) history.vipStatus = 'silver';
    else history.vipStatus = 'bronze';

    userPurchaseHistory.set(userId, history);

    // Log transaction for admin
    console.log(`🛒 Purchase completed: ${username} bought ${selectedPackage.name} for $${transactionData.summary.total}`);
    console.log(`💰 Wallet updated: ${userWallet.goldCoins} GC, ${userWallet.sweepsCoins} SC, ${userWallet.vipPoints} VIP`);

    res.json({
      success: true,
      transaction: enhancedTransaction,
      wallet: userWallet,
      message: 'Purchase completed successfully'
    });

  } catch (error) {
    console.error('Purchase error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process purchase'
    });
  }
});

// Get user purchase history
router.get('/users/:userId/purchases', (req: Request, res: Response) => {
  const { userId } = req.params;
  const history = userPurchaseHistory.get(userId);
  
  if (!history) {
    return res.json({
      userId,
      transactions: [],
      totalSpent: 0,
      totalGoldCoins: 0,
      totalSweepsCoins: 0,
      vipStatus: 'bronze',
      vipPoints: 0
    });
  }
  
  res.json(history);
});

// Get transaction by ID
router.get('/transactions/:transactionId', (req: Request, res: Response) => {
  const { transactionId } = req.params;
  const transaction = transactions.get(transactionId);
  
  if (!transaction) {
    return res.status(404).json({
      success: false,
      error: 'Transaction not found'
    });
  }
  
  res.json({
    success: true,
    transaction
  });
});

// Validate promo code
router.post('/promo/validate', (req: Request, res: Response) => {
  const { code } = req.body;
  
  const promoCodes = {
    'WELCOME10': { discount: 0.10, description: '10% off your first purchase' },
    'NEWPLAYER': { discount: 0.15, description: '15% off for new players' },
    'VIP20': { discount: 0.20, description: '20% VIP member discount' },
    'LUCKY25': { discount: 0.25, description: '25% lucky discount' },
    'WEEKEND': { discount: 0.12, description: '12% weekend special' }
  };
  
  const promoData = promoCodes[code.toUpperCase() as keyof typeof promoCodes];
  
  if (promoData) {
    res.json({
      success: true,
      valid: true,
      discount: promoData.discount,
      description: promoData.description
    });
  } else {
    res.json({
      success: false,
      valid: false,
      error: 'Invalid promo code'
    });
  }
});

// Update wallet (for admin or game results)
router.post('/wallet/:userId/update', (req: Request, res: Response) => {
  const { userId } = req.params;
  const { goldCoins, sweepsCoins, vipPoints, reason } = req.body;
  
  let userWallet = userWallets.get(userId);
  if (!userWallet) {
    userWallet = { goldCoins: 0, sweepsCoins: 0, vipPoints: 0 };
    userWallets.set(userId, userWallet);
  }
  
  // Apply changes
  if (goldCoins !== undefined) userWallet.goldCoins = Math.max(0, userWallet.goldCoins + goldCoins);
  if (sweepsCoins !== undefined) userWallet.sweepsCoins = Math.max(0, userWallet.sweepsCoins + sweepsCoins);
  if (vipPoints !== undefined) userWallet.vipPoints = Math.max(0, userWallet.vipPoints + vipPoints);
  
  console.log(`💱 Wallet updated for ${userId}: ${goldCoins ? `${goldCoins > 0 ? '+' : ''}${goldCoins} GC` : ''} ${sweepsCoins ? `${sweepsCoins > 0 ? '+' : ''}${sweepsCoins} SC` : ''} (${reason || 'Manual update'})`);
  
  res.json({
    success: true,
    wallet: userWallet,
    reason: reason || 'Manual update'
  });
});

// Get payment methods status
router.get('/payment-methods', (req: Request, res: Response) => {
  res.json({
    paypal: { enabled: true, fee: 'No fees', processingTime: 'Instant' },
    card: { enabled: true, fee: '2.9% + $0.30', processingTime: 'Instant' },
    applePay: { enabled: true, fee: 'No fees', processingTime: 'Instant' },
    googlePay: { enabled: true, fee: 'No fees', processingTime: 'Instant' },
    crypto: { enabled: false, fee: 'Network fees', processingTime: '10-30 minutes' }
  });
});

// Admin: Get all transactions
router.get('/admin/transactions', (req: Request, res: Response) => {
  const adminId = req.headers.adminid as string;
  const adminUsername = req.headers.adminusername as string;
  
  if (!adminId || !adminUsername) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  
  const allTransactions = Array.from(transactions.values())
    .sort((a, b) => new Date(b.processedAt).getTime() - new Date(a.processedAt).getTime());
  
  const stats = {
    totalTransactions: allTransactions.length,
    totalRevenue: allTransactions.reduce((sum, t) => sum + t.summary.total, 0),
    totalGoldCoinsIssued: allTransactions.reduce((sum, t) => sum + t.goldCoinsAwarded, 0),
    totalSweepsCoinsIssued: allTransactions.reduce((sum, t) => sum + t.sweepsCoinsBonus, 0),
    averageTransactionValue: allTransactions.length > 0 ? 
      allTransactions.reduce((sum, t) => sum + t.summary.total, 0) / allTransactions.length : 0
  };
  
  res.json({
    transactions: allTransactions,
    stats
  });
});

export default router;
