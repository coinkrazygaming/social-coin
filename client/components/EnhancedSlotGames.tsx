import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  Settings,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Star,
  Trophy,
  Coins,
  DollarSign,
  Zap,
  Crown,
  Gamepad2,
  ExternalLink,
  Loader2,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { RealTimeWallet, useWalletUpdate } from './RealTimeWallet';
import { useAuth } from './AuthContext';

interface SlotGame {
  id: string;
  name: string;
  provider: 'coinkrazy' | 'pragmatic' | 'evolution' | 'netent' | 'microgaming';
  type: 'in-house' | 'api';
  category: 'classic' | 'video' | 'progressive' | 'megaways' | 'feature';
  thumbnail: string;
  rtp: number;
  volatility: 'low' | 'medium' | 'high';
  maxWin: number;
  minBet: number;
  maxBet: number;
  paylines: number;
  reels: number;
  features: string[];
  description: string;
  isActive: boolean;
  popularity: number;
  apiUrl?: string;
  gameUrl?: string;
}

interface GameSession {
  id: string;
  gameId: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  totalBets: number;
  totalWins: number;
  netResult: number;
  spinsCount: number;
  currency: 'GC' | 'SC';
  isActive: boolean;
  lastActivity: Date;
}

interface SpinResult {
  id: string;
  symbols: string[][];
  winLines: number[];
  totalWin: number;
  multiplier: number;
  isBonus: boolean;
  freeSpins?: number;
  features?: string[];
}

interface EnhancedSlotGamesProps {
  className?: string;
  selectedGameId?: string;
  onGameSelect?: (gameId: string) => void;
}

export const EnhancedSlotGames: React.FC<EnhancedSlotGamesProps> = ({
  className = '',
  selectedGameId,
  onGameSelect
}) => {
  const [games, setGames] = useState<SlotGame[]>([]);
  const [currentGame, setCurrentGame] = useState<SlotGame | null>(null);
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [betAmount, setBetAmount] = useState(100);
  const [currency, setCurrency] = useState<'GC' | 'SC'>('GC');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('popularity');
  const [lastSpinResult, setLastSpinResult] = useState<SpinResult | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [autoSpinsRemaining, setAutoSpinsRemaining] = useState(0);
  const gameIframeRef = useRef<HTMLIFrameElement>(null);
  const autoPlayIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { user } = useAuth();
  const { updateBalance } = useWalletUpdate();

  useEffect(() => {
    loadSlotGames();
    if (selectedGameId) {
      const game = games.find(g => g.id === selectedGameId);
      if (game) {
        selectGame(game);
      }
    }
  }, [selectedGameId, games]);

  useEffect(() => {
    // Handle game session expiry
    if (gameSession && gameSession.isActive) {
      const checkSessionActivity = setInterval(() => {
        const timeSinceActivity = Date.now() - gameSession.lastActivity.getTime();
        if (timeSinceActivity > 300000) { // 5 minutes of inactivity
          endGameSession();
        }
      }, 60000); // Check every minute

      return () => clearInterval(checkSessionActivity);
    }
  }, [gameSession]);

  const loadSlotGames = () => {
    const slotGames: SlotGame[] = [
      // In-house CoinKrazy games
      {
        id: 'ck_lucky_sevens',
        name: 'Lucky Sevens Deluxe',
        provider: 'coinkrazy',
        type: 'in-house',
        category: 'classic',
        thumbnail: '/games/lucky-sevens.jpg',
        rtp: 96.5,
        volatility: 'medium',
        maxWin: 250000,
        minBet: 1,
        maxBet: 500,
        paylines: 25,
        reels: 5,
        features: ['Wild Symbols', 'Scatter Pays', '7x Multiplier', 'Lucky Bonus'],
        description: 'Classic slot with modern features and lucky seven symbols',
        isActive: true,
        popularity: 95
      },
      {
        id: 'ck_diamond_fortune',
        name: 'Diamond Fortune',
        provider: 'coinkrazy',
        type: 'in-house',
        category: 'video',
        thumbnail: '/games/diamond-fortune.jpg',
        rtp: 97.2,
        volatility: 'high',
        maxWin: 500000,
        minBet: 10,
        maxBet: 1000,
        paylines: 50,
        reels: 5,
        features: ['Expanding Wilds', 'Free Spins', 'Diamond Multiplier', 'Progressive Bonus'],
        description: 'Luxury-themed slot with sparkling diamonds and massive wins',
        isActive: true,
        popularity: 98
      },
      {
        id: 'ck_royal_riches',
        name: 'Royal Riches Megaways',
        provider: 'coinkrazy',
        type: 'in-house',
        category: 'megaways',
        thumbnail: '/games/royal-riches.jpg',
        rtp: 96.8,
        volatility: 'high',
        maxWin: 1000000,
        minBet: 20,
        maxBet: 2000,
        paylines: 117649,
        reels: 6,
        features: ['Megaways', 'Cascading Reels', 'Royal Free Spins', 'Crown Multipliers'],
        description: 'Royal-themed megaways slot with unlimited win potential',
        isActive: true,
        popularity: 92
      },
      // API Provider Games
      {
        id: 'api_gates_olympus',
        name: 'Gates of Olympus',
        provider: 'pragmatic',
        type: 'api',
        category: 'video',
        thumbnail: '/games/gates-olympus.jpg',
        rtp: 96.5,
        volatility: 'high',
        maxWin: 5000000,
        minBet: 20,
        maxBet: 12500,
        paylines: 20,
        reels: 6,
        features: ['Tumble Feature', 'Multiplier Symbols', 'Free Spins', 'Zeus Power'],
        description: 'Epic mythological slot with Zeus multipliers and tumbling reels',
        isActive: true,
        popularity: 89,
        apiUrl: 'https://api.pragmaticplay.net/games/gates-olympus',
        gameUrl: 'https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol=vs20olympgate&websiteUrl=https://www.pragmaticplay.com'
      },
      {
        id: 'api_sweet_bonanza',
        name: 'Sweet Bonanza',
        provider: 'pragmatic',
        type: 'api',
        category: 'video',
        thumbnail: '/games/sweet-bonanza.jpg',
        rtp: 96.48,
        volatility: 'medium',
        maxWin: 2100000,
        minBet: 20,
        maxBet: 12500,
        paylines: 0,
        reels: 6,
        features: ['Tumble Feature', 'Multiplier Bombs', 'Free Spins', 'Ante Bet'],
        description: 'Sweet candy-themed slot with tumbling reels and bomb multipliers',
        isActive: true,
        popularity: 94,
        apiUrl: 'https://api.pragmaticplay.net/games/sweet-bonanza',
        gameUrl: 'https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol=vs20fruitsw&websiteUrl=https://www.pragmaticplay.com'
      },
      {
        id: 'api_starburst',
        name: 'Starburst',
        provider: 'netent',
        type: 'api',
        category: 'classic',
        thumbnail: '/games/starburst.jpg',
        rtp: 96.09,
        volatility: 'low',
        maxWin: 50000,
        minBet: 10,
        maxBet: 1000,
        paylines: 10,
        reels: 5,
        features: ['Expanding Wilds', 'Re-spins', 'Both Ways Wins', 'Starburst Wild'],
        description: 'The classic space gem slot with expanding wilds',
        isActive: true,
        popularity: 87,
        apiUrl: 'https://api.netent.com/games/starburst',
        gameUrl: 'https://www.netent.com/games/starburst'
      }
    ];

    setGames(slotGames);
  };

  const selectGame = async (game: SlotGame) => {
    setCurrentGame(game);
    if (onGameSelect) {
      onGameSelect(game.id);
    }

    // Start new game session
    const newSession: GameSession = {
      id: `session_${Date.now()}`,
      gameId: game.id,
      userId: user?.id || 'guest',
      startTime: new Date(),
      totalBets: 0,
      totalWins: 0,
      netResult: 0,
      spinsCount: 0,
      currency,
      isActive: true,
      lastActivity: new Date()
    };

    setGameSession(newSession);
    
    // For API games, set up iframe
    if (game.type === 'api' && game.gameUrl) {
      setupAPIGame(game);
    }
  };

  const setupAPIGame = (game: SlotGame) => {
    if (!game.gameUrl || !gameIframeRef.current) return;

    // Customize API game URL with CoinKrazy branding
    const customUrl = new URL(game.gameUrl);
    customUrl.searchParams.set('currency', currency);
    customUrl.searchParams.set('balance', currency === 'GC' ? '25000' : '150');
    customUrl.searchParams.set('brand', 'coinkrazy');
    customUrl.searchParams.set('lang', 'en');
    customUrl.searchParams.set('sound', soundEnabled ? '1' : '0');

    gameIframeRef.current.src = customUrl.toString();
  };

  const spinReels = async () => {
    if (!currentGame || isSpinning) return;

    setIsSpinning(true);
    setLastSpinResult(null);

    // Update session activity
    if (gameSession) {
      setGameSession(prev => prev ? {
        ...prev,
        lastActivity: new Date(),
        totalBets: prev.totalBets + betAmount,
        spinsCount: prev.spinsCount + 1
      } : null);
    }

    // Place bet - update wallet
    updateBalance({
      type: 'bet',
      amount: -betAmount,
      currency,
      gameId: currentGame.id,
      gameName: currentGame.name
    });

    try {
      // Simulate spin result
      await new Promise(resolve => setTimeout(resolve, 2000)); // Spin animation time

      const spinResult = generateSpinResult();
      setLastSpinResult(spinResult);

      // If win, update wallet
      if (spinResult.totalWin > 0) {
        updateBalance({
          type: 'win',
          amount: spinResult.totalWin,
          currency,
          gameId: currentGame.id,
          gameName: currentGame.name,
          metadata: {
            multiplier: spinResult.multiplier,
            winLines: spinResult.winLines.length,
            isBonus: spinResult.isBonus
          }
        });

        // Update session
        if (gameSession) {
          setGameSession(prev => prev ? {
            ...prev,
            totalWins: prev.totalWins + spinResult.totalWin,
            netResult: prev.netResult + spinResult.totalWin - betAmount
          } : null);
        }
      } else {
        // Update session for loss
        if (gameSession) {
          setGameSession(prev => prev ? {
            ...prev,
            netResult: prev.netResult - betAmount
          } : null);
        }
      }

    } catch (error) {
      console.error('Spin error:', error);
    } finally {
      setIsSpinning(false);
      
      // Continue auto-play if enabled
      if (autoPlay && autoSpinsRemaining > 0) {
        setAutoSpinsRemaining(prev => prev - 1);
        if (autoSpinsRemaining > 1) {
          setTimeout(() => spinReels(), 1000);
        } else {
          setAutoPlay(false);
        }
      }
    }
  };

  const generateSpinResult = (): SpinResult => {
    const symbols = ['7', '💎', '👑', '⭐', '🍒', '🔔', '🍀', 'BAR'];
    const reels: string[][] = [];
    
    // Generate random symbols for each reel
    for (let i = 0; i < currentGame!.reels; i++) {
      const reel: string[] = [];
      for (let j = 0; j < 3; j++) {
        reel.push(symbols[Math.floor(Math.random() * symbols.length)]);
      }
      reels.push(reel);
    }

    // Calculate wins (simplified)
    const winChance = 0.3; // 30% chance of win
    const isWin = Math.random() < winChance;
    let totalWin = 0;
    let multiplier = 1;
    const winLines: number[] = [];

    if (isWin) {
      // Generate win amount based on volatility
      const baseWin = betAmount * (0.5 + Math.random() * 4); // 0.5x to 4.5x bet
      
      if (currentGame!.volatility === 'high') {
        multiplier = Math.random() < 0.1 ? 10 + Math.floor(Math.random() * 90) : 1 + Math.floor(Math.random() * 9);
      } else if (currentGame!.volatility === 'medium') {
        multiplier = 1 + Math.floor(Math.random() * 10);
      } else {
        multiplier = 1 + Math.floor(Math.random() * 5);
      }

      totalWin = Math.floor(baseWin * multiplier);
      winLines.push(1, 5, 9); // Mock winning lines
    }

    return {
      id: `spin_${Date.now()}`,
      symbols: reels,
      winLines,
      totalWin,
      multiplier,
      isBonus: false,
      features: isWin ? ['LINE_WIN'] : []
    };
  };

  const startAutoPlay = (spins: number) => {
    setAutoPlay(true);
    setAutoSpinsRemaining(spins);
    spinReels();
  };

  const stopAutoPlay = () => {
    setAutoPlay(false);
    setAutoSpinsRemaining(0);
    if (autoPlayIntervalRef.current) {
      clearInterval(autoPlayIntervalRef.current);
    }
  };

  const endGameSession = () => {
    if (gameSession) {
      setGameSession(prev => prev ? {
        ...prev,
        endTime: new Date(),
        isActive: false
      } : null);

      // Trigger final wallet update
      updateBalance({
        type: 'bet',
        amount: 0,
        currency,
        gameId: currentGame!.id,
        gameName: currentGame!.name,
        metadata: { sessionEnd: true, finalBalance: true }
      });
    }
  };

  const filteredGames = games.filter(game => {
    if (filter === 'all') return true;
    if (filter === 'in-house') return game.type === 'in-house';
    if (filter === 'api') return game.type === 'api';
    return game.category === filter;
  });

  const sortedGames = [...filteredGames].sort((a, b) => {
    switch (sortBy) {
      case 'popularity': return b.popularity - a.popularity;
      case 'rtp': return b.rtp - a.rtp;
      case 'maxWin': return b.maxWin - a.maxWin;
      case 'name': return a.name.localeCompare(b.name);
      default: return 0;
    }
  });

  const getProviderBadgeColor = (provider: string) => {
    switch (provider) {
      case 'coinkrazy': return 'bg-gold text-black';
      case 'pragmatic': return 'bg-red-600 text-white';
      case 'evolution': return 'bg-green-600 text-white';
      case 'netent': return 'bg-blue-600 text-white';
      case 'microgaming': return 'bg-purple-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Game Player Interface */}
      {currentGame && (
        <div className="mb-6">
          <Card className="w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-gold to-yellow-500 flex items-center justify-center">
                    <Gamepad2 className="h-6 w-6 text-black" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{currentGame.name}</CardTitle>
                    <p className="text-sm text-gray-400">
                      {currentGame.provider.toUpperCase()} • RTP: {currentGame.rtp}% • Max Win: {currentGame.maxWin.toLocaleString()}x
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getProviderBadgeColor(currentGame.provider)}>
                    {currentGame.type === 'in-house' ? 'CoinKrazy Original' : 'API Provider'}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                  >
                    {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSettings(true)}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Game Display */}
                <div className="lg:col-span-2">
                  <div className={`relative bg-black rounded-lg overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50' : 'aspect-video'}`}>
                    {currentGame.type === 'api' ? (
                      <iframe
                        ref={gameIframeRef}
                        className="w-full h-full border-0"
                        title={currentGame.name}
                        allowFullScreen
                        allow="fullscreen"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
                        {/* In-house game display */}
                        <div className="text-center">
                          <div className="grid grid-cols-5 gap-2 mb-6">
                            {lastSpinResult ? (
                              lastSpinResult.symbols.map((reel, i) => (
                                <div key={i} className="space-y-1">
                                  {reel.map((symbol, j) => (
                                    <div key={j} className="w-16 h-16 bg-black/30 rounded border-2 border-gold/50 flex items-center justify-center text-2xl">
                                      {symbol}
                                    </div>
                                  ))}
                                </div>
                              ))
                            ) : (
                              Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="space-y-1">
                                  {Array.from({ length: 3 }).map((_, j) => (
                                    <div key={j} className={`w-16 h-16 bg-black/30 rounded border-2 border-gold/50 flex items-center justify-center text-2xl ${isSpinning ? 'animate-pulse' : ''}`}>
                                      ?
                                    </div>
                                  ))}
                                </div>
                              ))
                            )}
                          </div>

                          {lastSpinResult && lastSpinResult.totalWin > 0 && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="text-center mb-4"
                            >
                              <div className="text-4xl font-bold text-gold mb-2">
                                🎉 BIG WIN! 🎉
                              </div>
                              <div className="text-2xl text-green-400">
                                +{lastSpinResult.totalWin.toLocaleString()} {currency}
                              </div>
                              {lastSpinResult.multiplier > 1 && (
                                <div className="text-lg text-yellow-400">
                                  {lastSpinResult.multiplier}x Multiplier!
                                </div>
                              )}
                            </motion.div>
                          )}

                          <div className="text-white/60">
                            <p>{currentGame.description}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {isSpinning && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <Loader2 className="h-12 w-12 animate-spin text-gold" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Game Controls */}
                <div className="space-y-4">
                  {/* Wallet Display */}
                  <RealTimeWallet compact={true} showHistory={false} />

                  {/* Bet Controls */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Bet Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">Currency</label>
                        <Select value={currency} onValueChange={(value: 'GC' | 'SC') => setCurrency(value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="GC">Gold Coins (GC)</SelectItem>
                            <SelectItem value="SC">Sweep Coins (SC)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">
                          Bet Amount: {betAmount.toLocaleString()} {currency}
                        </label>
                        <Slider
                          value={[betAmount]}
                          onValueChange={(value) => setBetAmount(value[0])}
                          max={currentGame.maxBet}
                          min={currentGame.minBet}
                          step={currency === 'GC' ? 25 : 1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                          <span>{currentGame.minBet}</span>
                          <span>{currentGame.maxBet}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setBetAmount(Math.max(currentGame.minBet, betAmount / 2))}
                        >
                          1/2
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setBetAmount(Math.min(currentGame.maxBet, betAmount * 2))}
                        >
                          2x
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Spin Controls */}
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <Button
                          onClick={spinReels}
                          disabled={isSpinning || autoPlay}
                          className="w-full h-12 text-lg font-bold bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-500 hover:to-gold"
                        >
                          {isSpinning ? (
                            <>
                              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                              Spinning...
                            </>
                          ) : (
                            <>
                              <Play className="h-5 w-5 mr-2" />
                              SPIN ({betAmount} {currency})
                            </>
                          )}
                        </Button>

                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant="outline"
                            onClick={() => autoPlay ? stopAutoPlay() : startAutoPlay(10)}
                            disabled={isSpinning}
                          >
                            {autoPlay ? (
                              <>
                                <Pause className="h-4 w-4 mr-1" />
                                Stop ({autoSpinsRemaining})
                              </>
                            ) : (
                              <>
                                <Play className="h-4 w-4 mr-1" />
                                Auto x10
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => startAutoPlay(50)}
                            disabled={isSpinning || autoPlay}
                          >
                            Auto x50
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Game Stats */}
                  {gameSession && (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Session Stats</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Spins:</span>
                          <span>{gameSession.spinsCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Total Bet:</span>
                          <span>{gameSession.totalBets.toLocaleString()} {currency}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Total Win:</span>
                          <span className="text-green-400">{gameSession.totalWins.toLocaleString()} {currency}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Net Result:</span>
                          <span className={gameSession.netResult >= 0 ? 'text-green-400' : 'text-red-400'}>
                            {gameSession.netResult >= 0 ? '+' : ''}{gameSession.netResult.toLocaleString()} {currency}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Game Library */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Slot Games Library
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter games" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Games</SelectItem>
                  <SelectItem value="in-house">CoinKrazy Original</SelectItem>
                  <SelectItem value="api">API Providers</SelectItem>
                  <SelectItem value="classic">Classic Slots</SelectItem>
                  <SelectItem value="video">Video Slots</SelectItem>
                  <SelectItem value="megaways">Megaways</SelectItem>
                  <SelectItem value="progressive">Progressive</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="rtp">RTP</SelectItem>
                  <SelectItem value="maxWin">Max Win</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sortedGames.map((game) => (
              <motion.div
                key={game.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative overflow-hidden rounded-lg border-2 cursor-pointer transition-all ${
                  currentGame?.id === game.id 
                    ? 'border-gold shadow-lg shadow-gold/20' 
                    : 'border-border hover:border-gold/50'
                }`}
                onClick={() => selectGame(game)}
              >
                <div className="aspect-video bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Gamepad2 className="h-12 w-12 text-white/30" />
                  </div>
                  
                  <div className="absolute top-2 left-2">
                    <Badge className={getProviderBadgeColor(game.provider)}>
                      {game.provider.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="absolute top-2 right-2">
                    {game.type === 'api' && (
                      <Badge variant="outline">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        API
                      </Badge>
                    )}
                  </div>
                  
                  <div className="absolute bottom-2 right-2">
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star className="h-3 w-3 fill-current" />
                      <span className="text-xs">{game.popularity}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3">
                  <h3 className="font-semibold text-white mb-1 truncate">{game.name}</h3>
                  <p className="text-xs text-gray-400 mb-2 line-clamp-2">{game.description}</p>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">RTP:</span>
                      <span className="text-green-400 ml-1">{game.rtp}%</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Max Win:</span>
                      <span className="text-gold ml-1">{game.maxWin.toLocaleString()}x</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Volatility:</span>
                      <span className={`ml-1 ${
                        game.volatility === 'high' ? 'text-red-400' :
                        game.volatility === 'medium' ? 'text-yellow-400' :
                        'text-green-400'
                      }`}>
                        {game.volatility.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Lines:</span>
                      <span className="text-blue-400 ml-1">{game.paylines}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {game.features.slice(0, 2).map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {game.features.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{game.features.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>

                {currentGame?.id === game.id && (
                  <div className="absolute inset-0 bg-gold/20 border-2 border-gold rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-gold" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {sortedGames.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Gamepad2 className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No games found</p>
              <p className="text-sm">Try adjusting your filters</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Game Settings Modal */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Game Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Sound Effects</label>
              <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Auto-Play on Wins</label>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Show Advanced Stats</label>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Fast Spin Mode</label>
              <Switch />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
