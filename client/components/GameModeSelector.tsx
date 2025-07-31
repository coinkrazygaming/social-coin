import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Coins, DollarSign, Lock, AlertTriangle, Info, Zap } from 'lucide-react';
import { useAuth } from './AuthContext';
import { RealTimeWalletService } from '@shared/realTimeWallet';
import { RealTimeWallet } from '@shared/socialCasinoTypes';

interface GameModeSelectorProps {
  gameId: string;
  gameName: string;
  minBetGC: number;
  maxBetGC: number;
  minBetSC: number;
  maxBetSC: number;
  supportedModes: ('GC' | 'SC')[];
  onModeSelect: (mode: 'GC' | 'SC', betAmount: number) => void;
  className?: string;
}

export function GameModeSelector({
  gameId,
  gameName,
  minBetGC,
  maxBetGC,
  minBetSC,
  maxBetSC,
  supportedModes,
  onModeSelect,
  className = ''
}: GameModeSelectorProps) {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<RealTimeWallet | null>(null);
  const [selectedMode, setSelectedMode] = useState<'GC' | 'SC' | null>(null);
  const [betAmount, setBetAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [canPlayGC, setCanPlayGC] = useState(false);
  const [canPlaySC, setCanPlaySC] = useState(false);
  const [playRestrictions, setPlayRestrictions] = useState<{
    GC?: string;
    SC?: string;
  }>({});

  useEffect(() => {
    if (user) {
      loadWalletData();
      checkPlayRestrictions();
    }
  }, [user, gameId]);

  useEffect(() => {
    if (selectedMode) {
      const minBet = selectedMode === 'GC' ? minBetGC : minBetSC;
      setBetAmount(minBet);
    }
  }, [selectedMode, minBetGC, minBetSC]);

  const loadWalletData = async () => {
    if (!user) return;
    
    try {
      const walletData = await RealTimeWalletService.getWallet(user.id);
      setWallet(walletData);
      
      // Subscribe to real-time wallet updates
      const unsubscribe = RealTimeWalletService.subscribeToWallet(user.id, (updatedWallet) => {
        setWallet(updatedWallet);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error loading wallet:', error);
    }
  };

  const checkPlayRestrictions = async () => {
    if (!user) return;

    try {
      // Check GC restrictions
      if (supportedModes.includes('GC')) {
        const gcCheck = await RealTimeWalletService.canUserPlay(user.id, 'GC', minBetGC);
        setCanPlayGC(gcCheck.canPlay);
        if (!gcCheck.canPlay) {
          setPlayRestrictions(prev => ({ ...prev, GC: gcCheck.reason }));
        }
      }

      // Check SC restrictions
      if (supportedModes.includes('SC')) {
        const scCheck = await RealTimeWalletService.canUserPlay(user.id, 'SC', minBetSC);
        setCanPlaySC(scCheck.canPlay);
        if (!scCheck.canPlay) {
          setPlayRestrictions(prev => ({ ...prev, SC: scCheck.reason }));
        }
      }
    } catch (error) {
      console.error('Error checking play restrictions:', error);
    }
  };

  const handleModeSelect = (mode: 'GC' | 'SC') => {
    if (!user) return;
    
    if (mode === 'GC' && !canPlayGC) return;
    if (mode === 'SC' && !canPlaySC) return;
    
    setSelectedMode(mode);
  };

  const handlePlay = async () => {
    if (!selectedMode || !user || !wallet) return;

    setIsLoading(true);
    try {
      // Final balance check before playing
      const finalCheck = await RealTimeWalletService.canUserPlay(user.id, selectedMode, betAmount);
      
      if (!finalCheck.canPlay) {
        alert(finalCheck.reason);
        setIsLoading(false);
        return;
      }

      // Proceed with game
      onModeSelect(selectedMode, betAmount);
    } catch (error) {
      console.error('Error starting game:', error);
      alert('Error starting game. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const adjustBetAmount = (change: number) => {
    if (!selectedMode) return;
    
    const minBet = selectedMode === 'GC' ? minBetGC : minBetSC;
    const maxBet = selectedMode === 'GC' ? maxBetGC : maxBetSC;
    const maxAllowed = wallet ? 
      (selectedMode === 'GC' ? wallet.gold_coins : wallet.sweeps_coins) : 0;
    
    const newAmount = Math.max(minBet, Math.min(maxBet, Math.min(maxAllowed, betAmount + change)));
    setBetAmount(newAmount);
  };

  if (!user) {
    return (
      <Card className={`border-dashed border-muted ${className}`}>
        <CardContent className="p-6 text-center">
          <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Login Required</h3>
          <p className="text-muted-foreground mb-4">
            Please log in to play {gameName}
          </p>
          <Button>Login to Play</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Choose Game Mode</span>
          {wallet && (
            <div className="flex gap-2 text-sm">
              <Badge variant="outline" className="text-gold">
                <Coins className="h-3 w-3 mr-1" />
                {wallet.gold_coins.toLocaleString()} GC
              </Badge>
              <Badge variant="outline" className="text-sweep">
                <DollarSign className="h-3 w-3 mr-1" />
                {wallet.sweeps_coins.toFixed(2)} SC
              </Badge>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedMode || 'none'} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            {supportedModes.includes('GC') && (
              <TabsTrigger 
                value="GC" 
                onClick={() => handleModeSelect('GC')}
                disabled={!canPlayGC}
                className="relative"
              >
                <Coins className="h-4 w-4 mr-2" />
                Gold Coins
                {!canPlayGC && <Lock className="h-3 w-3 ml-1" />}
              </TabsTrigger>
            )}
            {supportedModes.includes('SC') && (
              <TabsTrigger 
                value="SC" 
                onClick={() => handleModeSelect('SC')}
                disabled={!canPlaySC}
                className="relative"
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Sweeps Coins
                {!canPlaySC && <Lock className="h-3 w-3 ml-1" />}
              </TabsTrigger>
            )}
          </TabsList>

          {/* Gold Coins Mode */}
          {supportedModes.includes('GC') && (
            <TabsContent value="GC" className="space-y-4">
              {canPlayGC ? (
                <div className="space-y-4">
                  <div className="bg-gold/10 border border-gold/30 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Coins className="h-5 w-5 text-gold mr-2" />
                      <h4 className="font-semibold text-gold">Gold Coins Mode</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Play for fun with Gold Coins. No cash value, pure entertainment!
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Bet Amount:</span>
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => adjustBetAmount(-minBetGC)}
                            disabled={betAmount <= minBetGC}
                          >
                            -
                          </Button>
                          <span className="min-w-[80px] text-center font-mono">
                            {betAmount.toLocaleString()} GC
                          </span>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => adjustBetAmount(minBetGC)}
                            disabled={betAmount >= Math.min(maxBetGC, wallet?.gold_coins || 0)}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Min: {minBetGC.toLocaleString()} GC</span>
                        <span>Max: {Math.min(maxBetGC, wallet?.gold_coins || 0).toLocaleString()} GC</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <AlertTriangle className="h-5 w-5 text-destructive mr-2" />
                    <h4 className="font-semibold text-destructive">Cannot Play GC Mode</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {playRestrictions.GC || 'Insufficient Gold Coins balance'}
                  </p>
                </div>
              )}
            </TabsContent>
          )}

          {/* Sweeps Coins Mode */}
          {supportedModes.includes('SC') && (
            <TabsContent value="SC" className="space-y-4">
              {canPlaySC ? (
                <div className="space-y-4">
                  <div className="bg-sweep/10 border border-sweep/30 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <DollarSign className="h-5 w-5 text-sweep mr-2" />
                      <h4 className="font-semibold text-sweep">Sweeps Coins Mode</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Play with Sweeps Coins for a chance to win redeemable prizes!
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Bet Amount:</span>
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => adjustBetAmount(-minBetSC)}
                            disabled={betAmount <= minBetSC}
                          >
                            -
                          </Button>
                          <span className="min-w-[80px] text-center font-mono">
                            {betAmount.toFixed(2)} SC
                          </span>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => adjustBetAmount(minBetSC)}
                            disabled={betAmount >= Math.min(maxBetSC, wallet?.sweeps_coins || 0)}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Min: {minBetSC.toFixed(2)} SC</span>
                        <span>Max: {Math.min(maxBetSC, wallet?.sweeps_coins || 0).toFixed(2)} SC</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <AlertTriangle className="h-5 w-5 text-destructive mr-2" />
                    <h4 className="font-semibold text-destructive">Cannot Play SC Mode</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {playRestrictions.SC || 'Insufficient Sweeps Coins balance'}
                  </p>
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>

        {selectedMode && (selectedMode === 'GC' ? canPlayGC : canPlaySC) && (
          <div className="mt-6 space-y-4">
            <Button 
              onClick={handlePlay}
              disabled={isLoading}
              className="w-full relative"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Zap className="h-4 w-4 mr-2 animate-spin" />
                  Starting Game...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Play {gameName} ({betAmount.toLocaleString()} {selectedMode})
                </>
              )}
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full">
                  <Info className="h-4 w-4 mr-2" />
                  Game Mode Information
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Game Mode Information</DialogTitle>
                  <DialogDescription>
                    Understanding Gold Coins vs Sweeps Coins
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="bg-gold/10 border border-gold/30 rounded-lg p-4">
                    <h4 className="font-semibold text-gold mb-2 flex items-center">
                      <Coins className="h-4 w-4 mr-2" />
                      Gold Coins (GC)
                    </h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Free-to-play entertainment currency</li>
                      <li>• No cash value or redemption option</li>
                      <li>• Unlimited gameplay for fun</li>
                      <li>• Safe and legal in all jurisdictions</li>
                    </ul>
                  </div>
                  
                  <div className="bg-sweep/10 border border-sweep/30 rounded-lg p-4">
                    <h4 className="font-semibold text-sweep mb-2 flex items-center">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Sweeps Coins (SC)
                    </h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Premium gaming currency</li>
                      <li>• Can be redeemed for cash prizes</li>
                      <li>• Subject to terms and conditions</li>
                      <li>• Regulated sweepstakes model</li>
                    </ul>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
