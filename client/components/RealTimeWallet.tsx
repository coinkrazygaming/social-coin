import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {
  Coins,
  Star,
  Plus,
  Minus,
  TrendingUp,
  RefreshCw,
  Wallet as WalletIcon,
  DollarSign,
  Activity,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuth } from './AuthContext';
import { DatabaseService, subscribeToWalletUpdates, Wallet, Transaction } from '@shared/database';

interface RealTimeWalletProps {
  compact?: boolean;
  showDetails?: boolean;
}

export function RealTimeWallet({ compact = false, showDetails = true }: RealTimeWalletProps) {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showBalances, setShowBalances] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load wallet data
  useEffect(() => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    loadWalletData();
    
    // Subscribe to real-time updates
    const subscription = subscribeToWalletUpdates(user.id, (updatedWallet) => {
      setWallet(updatedWallet);
      setLastUpdate(new Date());
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [user?.id]);

  const loadWalletData = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const walletData = await DatabaseService.getUserWallet(user.id);
      setWallet(walletData);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error loading wallet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadWalletData();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const formatBalance = (amount: number): string => {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  if (!user) {
    return (
      <div className="flex items-center space-x-2">
        <Badge variant="outline" className="text-gray-400">
          <WalletIcon className="h-3 w-3 mr-1" />
          Sign in to view wallet
        </Badge>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <RefreshCw className="h-4 w-4 animate-spin text-gray-400" />
        <span className="text-sm text-gray-400">Loading wallet...</span>
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="flex items-center space-x-2">
        <Badge variant="outline" className="text-red-400 border-red-400">
          <WalletIcon className="h-3 w-3 mr-1" />
          Wallet not found
        </Badge>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex items-center space-x-4">
        {/* Gold Coins */}
        <div className="flex items-center space-x-2 bg-gold/10 border border-gold/20 rounded-lg px-3 py-1">
          <Coins className="h-4 w-4 text-gold" />
          <span className="text-sm font-bold text-gold">
            {showBalances ? formatBalance(wallet.gold_coins) : '••••••'}
          </span>
          <span className="text-xs text-gold/70">GC</span>
        </div>

        {/* Sweeps Coins */}
        <div className="flex items-center space-x-2 bg-purple-600/10 border border-purple-600/20 rounded-lg px-3 py-1">
          <Star className="h-4 w-4 text-purple-400" />
          <span className="text-sm font-bold text-purple-400">
            {showBalances ? formatBalance(wallet.sweeps_coins) : '••••••'}
          </span>
          <span className="text-xs text-purple-400/70">SC</span>
        </div>

        {/* Toggle visibility */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowBalances(!showBalances)}
          className="h-8 w-8 p-0"
        >
          {showBalances ? (
            <Eye className="h-4 w-4 text-gray-400" />
          ) : (
            <EyeOff className="h-4 w-4 text-gray-400" />
          )}
        </Button>
      </div>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex items-center space-x-4 cursor-pointer hover:bg-gray-800/50 rounded-lg p-2 transition-colors">
          {/* Gold Coins */}
          <div className="flex items-center space-x-2 bg-gold/10 border border-gold/20 rounded-lg px-3 py-2">
            <Coins className="h-4 w-4 text-gold" />
            <div className="text-right">
              <div className="text-sm font-bold text-gold">
                {showBalances ? formatBalance(wallet.gold_coins) : '••••••'}
              </div>
              <div className="text-xs text-gold/70">Gold Coins</div>
            </div>
          </div>

          {/* Sweeps Coins */}
          <div className="flex items-center space-x-2 bg-purple-600/10 border border-purple-600/20 rounded-lg px-3 py-2">
            <Star className="h-4 w-4 text-purple-400" />
            <div className="text-right">
              <div className="text-sm font-bold text-purple-400">
                {showBalances ? formatBalance(wallet.sweeps_coins) : '••••••'}
              </div>
              <div className="text-xs text-purple-400/70">Sweeps Coins</div>
            </div>
          </div>

          {/* Live indicator */}
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-gray-400">LIVE</span>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <WalletIcon className="h-5 w-5 text-gold" />
            <span className="text-gold">CoinKrazy</span> Wallet
          </DialogTitle>
          <DialogDescription>
            Real-time balance updates • Last updated {formatTimeAgo(lastUpdate)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Wallet Overview */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-gold/10 to-yellow-400/5 border-gold/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Coins className="h-5 w-5 text-gold" />
                    <span className="font-medium text-gold">Gold Coins</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowBalances(!showBalances)}
                    className="h-6 w-6 p-0"
                  >
                    {showBalances ? (
                      <Eye className="h-3 w-3 text-gold" />
                    ) : (
                      <EyeOff className="h-3 w-3 text-gold" />
                    )}
                  </Button>
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {showBalances ? formatBalance(wallet.gold_coins) : '••••••••'}
                </div>
                <div className="text-sm text-gray-400">
                  Entertainment value only
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-600/10 to-violet-600/5 border-purple-600/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-purple-400" />
                    <span className="font-medium text-purple-400">Sweeps Coins</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowBalances(!showBalances)}
                    className="h-6 w-6 p-0"
                  >
                    {showBalances ? (
                      <Eye className="h-3 w-3 text-purple-400" />
                    ) : (
                      <EyeOff className="h-3 w-3 text-purple-400" />
                    )}
                  </Button>
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {showBalances ? formatBalance(wallet.sweeps_coins) : '••••••••'}
                </div>
                <div className="text-sm text-gray-400">
                  Redeemable for prizes
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center bg-gray-800/50 rounded-lg p-3">
              <DollarSign className="h-4 w-4 text-green-400 mx-auto mb-1" />
              <div className="text-sm font-bold text-green-400">
                ${wallet.total_deposits.toLocaleString()}
              </div>
              <div className="text-xs text-gray-400">Total Deposits</div>
            </div>
            <div className="text-center bg-gray-800/50 rounded-lg p-3">
              <TrendingUp className="h-4 w-4 text-blue-400 mx-auto mb-1" />
              <div className="text-sm font-bold text-blue-400">
                ${wallet.total_withdrawals.toLocaleString()}
              </div>
              <div className="text-xs text-gray-400">Total Withdrawals</div>
            </div>
            <div className="text-center bg-gray-800/50 rounded-lg p-3">
              <Activity className="h-4 w-4 text-purple-400 mx-auto mb-1" />
              <div className="text-sm font-bold text-purple-400">
                ${wallet.pending_withdrawals.toLocaleString()}
              </div>
              <div className="text-xs text-gray-400">Pending</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button className="flex-1 bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Funds
            </Button>
            <Button variant="outline" className="flex-1 border-purple-600 text-purple-400 hover:bg-purple-600/10">
              <Minus className="h-4 w-4 mr-2" />
              Withdraw
            </Button>
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>

          {/* Real-time Status */}
          <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-700 pt-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>Real-time updates active</span>
            </div>
            <div>
              Last update: {formatTimeAgo(lastUpdate)}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Wallet balance display for other components
export function WalletBalance({ 
  currency, 
  amount, 
  size = 'sm' 
}: { 
  currency: 'GC' | 'SC'; 
  amount: number; 
  size?: 'xs' | 'sm' | 'md' | 'lg' 
}) {
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const iconSizes = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  return (
    <div className={`flex items-center space-x-1 ${currency === 'GC' ? 'text-gold' : 'text-purple-400'}`}>
      {currency === 'GC' ? (
        <Coins className={iconSizes[size]} />
      ) : (
        <Star className={iconSizes[size]} />
      )}
      <span className={`font-bold ${sizeClasses[size]}`}>
        {amount.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
      <span className={`${sizeClasses[size]} opacity-70`}>
        {currency}
      </span>
    </div>
  );
}
