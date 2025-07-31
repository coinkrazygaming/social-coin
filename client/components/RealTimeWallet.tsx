import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet,
  DollarSign,
  Coins,
  TrendingUp,
  TrendingDown,
  Clock,
  History,
  Eye,
  EyeOff,
  RefreshCw,
  Calendar,
  Filter,
  Download,
  AlertCircle
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useAuth } from './AuthContext';

interface WalletBalance {
  goldCoins: number;
  sweepCoins: number;
  lastUpdated: Date;
  pendingTransactions: number;
}

interface Transaction {
  id: string;
  type: 'bet' | 'win' | 'purchase' | 'bonus' | 'redemption' | 'adjustment';
  currency: 'GC' | 'SC';
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  description: string;
  gameId?: string;
  gameName?: string;
  timestamp: Date;
  status: 'completed' | 'pending' | 'failed';
  metadata?: Record<string, any>;
}

interface SweepCoinDetails {
  amount: number;
  purchaseDate: Date;
  expirationDate: Date;
  daysRemaining: number;
  isExpiring: boolean;
  source: 'purchase' | 'bonus' | 'promotion';
}

interface RealTimeWalletProps {
  className?: string;
  compact?: boolean;
  showHistory?: boolean;
}

export const RealTimeWallet: React.FC<RealTimeWalletProps> = ({ 
  className = '', 
  compact = false,
  showHistory = true 
}) => {
  const [balance, setBalance] = useState<WalletBalance>({
    goldCoins: 0,
    sweepCoins: 0,
    lastUpdated: new Date(),
    pendingTransactions: 0
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [sweepCoinDetails, setSweepCoinDetails] = useState<SweepCoinDetails[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [lastTransactionId, setLastTransactionId] = useState<string>('');
  const [filter, setFilter] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('24h');
  const [showExpirationWarnings, setShowExpirationWarnings] = useState(true);
  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { user } = useAuth();

  // Real-time balance updates
  useEffect(() => {
    if (!user?.id) return;

    loadWalletData();
    startRealTimeUpdates();

    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, [user?.id]);

  const loadWalletData = async () => {
    setIsLoading(true);
    try {
      // Simulate initial wallet data
      const initialBalance: WalletBalance = {
        goldCoins: 25000,
        sweepCoins: 150.50,
        lastUpdated: new Date(),
        pendingTransactions: 0
      };

      const initialTransactions: Transaction[] = [
        {
          id: 'txn_001',
          type: 'purchase',
          currency: 'GC',
          amount: 10000,
          balanceBefore: 15000,
          balanceAfter: 25000,
          description: 'Gold Coin Package Purchase',
          timestamp: new Date(Date.now() - 3600000),
          status: 'completed',
          metadata: { packageId: 'gc_10k', bonusGC: 2000 }
        },
        {
          id: 'txn_002',
          type: 'purchase',
          currency: 'SC',
          amount: 100,
          balanceBefore: 50.50,
          balanceAfter: 150.50,
          description: 'Sweep Coins Purchase',
          timestamp: new Date(Date.now() - 3600000),
          status: 'completed',
          metadata: { packageId: 'sc_100', bonusSC: 25 }
        },
        {
          id: 'txn_003',
          type: 'bet',
          currency: 'GC',
          amount: -250,
          balanceBefore: 25000,
          balanceAfter: 24750,
          description: 'Bet placed on Lucky Sevens',
          gameId: 'lucky_sevens',
          gameName: 'Lucky Sevens',
          timestamp: new Date(Date.now() - 1800000),
          status: 'completed'
        },
        {
          id: 'txn_004',
          type: 'win',
          currency: 'GC',
          amount: 1250,
          balanceBefore: 24750,
          balanceAfter: 26000,
          description: 'Win on Lucky Sevens - 5x multiplier',
          gameId: 'lucky_sevens',
          gameName: 'Lucky Sevens',
          timestamp: new Date(Date.now() - 1795000),
          status: 'completed',
          metadata: { multiplier: 5, baseWin: 250 }
        }
      ];

      const initialSweepDetails: SweepCoinDetails[] = [
        {
          amount: 75,
          purchaseDate: new Date(Date.now() - 3600000),
          expirationDate: new Date(Date.now() + 89 * 24 * 60 * 60 * 1000),
          daysRemaining: 89,
          isExpiring: false,
          source: 'purchase'
        },
        {
          amount: 50,
          purchaseDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          expirationDate: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000),
          daysRemaining: 75,
          isExpiring: false,
          source: 'purchase'
        },
        {
          amount: 25.50,
          purchaseDate: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000),
          expirationDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
          daysRemaining: 10,
          isExpiring: true,
          source: 'bonus'
        }
      ];

      setBalance(initialBalance);
      setTransactions(initialTransactions);
      setSweepCoinDetails(initialSweepDetails);
    } catch (error) {
      console.error('Error loading wallet data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startRealTimeUpdates = () => {
    // Check for balance updates every 3 seconds
    updateIntervalRef.current = setInterval(async () => {
      await checkForUpdates();
    }, 3000);
  };

  const checkForUpdates = async () => {
    try {
      // Simulate random balance changes from gameplay
      if (Math.random() < 0.1) { // 10% chance per check
        const isWin = Math.random() > 0.6; // 40% chance of win
        const isGoldCoins = Math.random() > 0.3; // 70% chance of GC transaction
        
        const amount = isWin 
          ? Math.floor(Math.random() * 1000) + 100 // Win: 100-1100
          : -(Math.floor(Math.random() * 500) + 50); // Bet: -50 to -550

        const currency = isGoldCoins ? 'GC' : 'SC';
        const currentBalance = currency === 'GC' ? balance.goldCoins : balance.sweepCoins;
        
        // Don't allow negative balances
        if (amount < 0 && Math.abs(amount) > currentBalance) {
          return;
        }

        const newTransaction: Transaction = {
          id: `txn_${Date.now()}`,
          type: isWin ? 'win' : 'bet',
          currency,
          amount,
          balanceBefore: currentBalance,
          balanceAfter: currentBalance + amount,
          description: isWin 
            ? `Win on ${getRandomGame()} - ${getRandomMultiplier()}x multiplier`
            : `Bet placed on ${getRandomGame()}`,
          gameId: getRandomGameId(),
          gameName: getRandomGame(),
          timestamp: new Date(),
          status: 'completed',
          metadata: isWin ? { multiplier: getRandomMultiplier() } : {}
        };

        // Update balance and add transaction
        setBalance(prev => ({
          ...prev,
          goldCoins: currency === 'GC' ? prev.goldCoins + amount : prev.goldCoins,
          sweepCoins: currency === 'SC' ? prev.sweepCoins + amount : prev.sweepCoins,
          lastUpdated: new Date()
        }));

        setTransactions(prev => [newTransaction, ...prev.slice(0, 99)]); // Keep last 100 transactions
        setLastTransactionId(newTransaction.id);
      }
    } catch (error) {
      console.error('Error checking for updates:', error);
    }
  };

  const getRandomGame = () => {
    const games = ['Lucky Sevens', 'Diamond Fortune', 'Royal Riches', 'Mega Millions', 'Gold Rush', 'Crystal Quest'];
    return games[Math.floor(Math.random() * games.length)];
  };

  const getRandomGameId = () => {
    const gameIds = ['lucky_sevens', 'diamond_fortune', 'royal_riches', 'mega_millions', 'gold_rush', 'crystal_quest'];
    return gameIds[Math.floor(Math.random() * gameIds.length)];
  };

  const getRandomMultiplier = () => {
    const multipliers = [2, 3, 5, 10, 15, 25, 50, 100];
    return multipliers[Math.floor(Math.random() * multipliers.length)];
  };

  const updateBalanceFromGame = useCallback((gameData: {
    type: 'bet' | 'win';
    amount: number;
    currency: 'GC' | 'SC';
    gameId: string;
    gameName: string;
    metadata?: Record<string, any>;
  }) => {
    const currentBalance = gameData.currency === 'GC' ? balance.goldCoins : balance.sweepCoins;
    
    const newTransaction: Transaction = {
      id: `txn_${Date.now()}`,
      type: gameData.type,
      currency: gameData.currency,
      amount: gameData.amount,
      balanceBefore: currentBalance,
      balanceAfter: currentBalance + gameData.amount,
      description: gameData.type === 'win' 
        ? `Win on ${gameData.gameName}`
        : `Bet placed on ${gameData.gameName}`,
      gameId: gameData.gameId,
      gameName: gameData.gameName,
      timestamp: new Date(),
      status: 'completed',
      metadata: gameData.metadata
    };

    setBalance(prev => ({
      ...prev,
      goldCoins: gameData.currency === 'GC' ? prev.goldCoins + gameData.amount : prev.goldCoins,
      sweepCoins: gameData.currency === 'SC' ? prev.sweepCoins + gameData.amount : prev.sweepCoins,
      lastUpdated: new Date()
    }));

    setTransactions(prev => [newTransaction, ...prev]);
    setLastTransactionId(newTransaction.id);
  }, [balance]);

  const filteredTransactions = transactions.filter(txn => {
    const timeFilter = () => {
      const now = Date.now();
      const txnTime = txn.timestamp.getTime();
      switch (timeRange) {
        case '1h': return now - txnTime < 60 * 60 * 1000;
        case '24h': return now - txnTime < 24 * 60 * 60 * 1000;
        case '7d': return now - txnTime < 7 * 24 * 60 * 60 * 1000;
        case '30d': return now - txnTime < 30 * 24 * 60 * 60 * 1000;
        default: return true;
      }
    };

    const typeFilter = filter === 'all' || txn.type === filter;
    return typeFilter && timeFilter();
  });

  const expiringCoins = sweepCoinDetails.filter(sc => sc.daysRemaining <= 14);
  const totalExpiring = expiringCoins.reduce((sum, sc) => sum + sc.amount, 0);

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-4 ${className}`}>
        <div className="flex items-center gap-2">
          <Coins className="h-4 w-4 text-gold" />
          <span className="text-gold font-semibold">
            {isVisible ? balance.goldCoins.toLocaleString() : '••••••'} GC
          </span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-green-400" />
          <span className="text-green-400 font-semibold">
            {isVisible ? balance.sweepCoins.toFixed(2) : '••••••'} SC
          </span>
          {totalExpiring > 0 && showExpirationWarnings && (
            <Badge variant="destructive" className="text-xs">
              {totalExpiring.toFixed(2)} SC expiring
            </Badge>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={() => setIsVisible(!isVisible)}>
          {isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        </Button>
      </div>
    );
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Real-Time Wallet
            {isLoading && <RefreshCw className="h-4 w-4 animate-spin" />}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setIsVisible(!isVisible)}>
              {isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={loadWalletData}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Balance Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div 
            className="p-4 rounded-lg bg-gradient-to-r from-gold/20 to-gold/10 border border-gold/30"
            animate={lastTransactionId && transactions.find(t => t.id === lastTransactionId)?.currency === 'GC' ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Gold Coins</p>
                <p className="text-2xl font-bold text-gold">
                  {isVisible ? balance.goldCoins.toLocaleString() : '••••••••'}
                </p>
              </div>
              <Coins className="h-8 w-8 text-gold" />
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Last updated: {balance.lastUpdated.toLocaleTimeString()}
            </p>
          </motion.div>

          <motion.div 
            className="p-4 rounded-lg bg-gradient-to-r from-green-500/20 to-green-500/10 border border-green-500/30"
            animate={lastTransactionId && transactions.find(t => t.id === lastTransactionId)?.currency === 'SC' ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Sweep Coins</p>
                <p className="text-2xl font-bold text-green-400">
                  {isVisible ? balance.sweepCoins.toFixed(2) : '••••••'}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-400" />
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Redeemable for prizes & cash
            </p>
          </motion.div>
        </div>

        {/* Expiration Warnings */}
        {totalExpiring > 0 && showExpirationWarnings && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-orange-500/20 border border-orange-500/30"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-400" />
              <div>
                <p className="text-orange-400 font-semibold">SC Expiration Warning</p>
                <p className="text-sm text-gray-300">
                  {totalExpiring.toFixed(2)} SC expiring within 14 days
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Transaction History */}
        {showHistory && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
              <div className="flex items-center gap-2">
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="bet">Bets</SelectItem>
                    <SelectItem value="win">Wins</SelectItem>
                    <SelectItem value="purchase">Purchases</SelectItem>
                    <SelectItem value="bonus">Bonuses</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1h">1h</SelectItem>
                    <SelectItem value="24h">24h</SelectItem>
                    <SelectItem value="7d">7d</SelectItem>
                    <SelectItem value="30d">30d</SelectItem>
                    <SelectItem value="all">All</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <ScrollArea className="h-80">
              <div className="space-y-2">
                <AnimatePresence>
                  {filteredTransactions.map((txn) => (
                    <motion.div
                      key={txn.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={`p-3 rounded-lg border ${
                        txn.id === lastTransactionId ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                      } ${
                        txn.type === 'win' ? 'bg-green-500/10 border-green-500/30' :
                        txn.type === 'bet' ? 'bg-red-500/10 border-red-500/30' :
                        'bg-blue-500/10 border-blue-500/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-1 rounded ${
                            txn.type === 'win' ? 'bg-green-500' :
                            txn.type === 'bet' ? 'bg-red-500' :
                            'bg-blue-500'
                          }`}>
                            {txn.type === 'win' ? <TrendingUp className="h-4 w-4" /> :
                             txn.type === 'bet' ? <TrendingDown className="h-4 w-4" /> :
                             <DollarSign className="h-4 w-4" />}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{txn.description}</p>
                            <p className="text-xs text-gray-400">
                              {txn.timestamp.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-semibold ${
                            txn.amount > 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {txn.amount > 0 ? '+' : ''}{txn.amount.toLocaleString()} {txn.currency}
                          </p>
                          <p className="text-xs text-gray-400">
                            Balance: {txn.balanceAfter.toLocaleString()} {txn.currency}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {filteredTransactions.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No transactions found</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Hook for game components to update wallet
export const useWalletUpdate = () => {
  const updateBalance = useCallback((gameData: {
    type: 'bet' | 'win';
    amount: number;
    currency: 'GC' | 'SC';
    gameId: string;
    gameName: string;
    metadata?: Record<string, any>;
  }) => {
    // This would typically dispatch to a global state or call an API
    console.log('Wallet update:', gameData);
    
    // Trigger custom event for wallet components to listen to
    window.dispatchEvent(new CustomEvent('walletUpdate', { detail: gameData }));
  }, []);

  return { updateBalance };
};
