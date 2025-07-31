import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useAuth } from "./AuthContext";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Settings,
  Home,
  Plus,
  Minus,
  Coins,
  Star,
  Trophy,
  Zap,
  Crown,
  Diamond,
  Heart,
  Spade,
  Club,
  X,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  RotateCcw,
  Target,
  Gift,
  Sparkles,
  DollarSign,
} from "lucide-react";

interface SlotGameProps {
  gameId: string;
  gameName: string;
  theme: string;
  onClose: () => void;
}

interface GameStats {
  totalSpins: number;
  totalWon: number;
  totalWagered: number;
  biggestWin: number;
  winRate: number;
  currentSession: {
    spins: number;
    won: number;
    wagered: number;
  };
}

interface SpinResult {
  symbols: string[][];
  winLines: number[];
  winAmount: number;
  isWin: boolean;
  multiplier: number;
  bonusTriggered: boolean;
}

export const EnhancedSlotGame: React.FC<SlotGameProps> = ({
  gameId,
  gameName,
  theme,
  onClose,
}) => {
  const { user, balance, updateBalance } = useAuth();
  const [gameMode, setGameMode] = useState<"GC" | "SC" | null>(null);
  const [betAmount, setBetAmount] = useState(1);
  const [autoPlay, setAutoPlay] = useState(false);
  const [autoSpinsLeft, setAutoSpinsLeft] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showAgreement, setShowAgreement] = useState(true);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [gameBalance, setGameBalance] = useState({ GC: 0, SC: 0 });
  const [currentSymbols, setCurrentSymbols] = useState<string[][]>([
    ["🍋", "🍒", "⭐"],
    ["🍊", "💎", "🍋"],
    ["⭐", "🍒", "🍊"],
    ["💎", "⭐", "🍒"],
    ["🍒", "🍋", "💎"],
  ]);

  const [lastWin, setLastWin] = useState<SpinResult | null>(null);
  const [gameStats, setGameStats] = useState<GameStats>({
    totalSpins: 0,
    totalWon: 0,
    totalWagered: 0,
    biggestWin: 0,
    winRate: 0,
    currentSession: {
      spins: 0,
      won: 0,
      wagered: 0,
    },
  });

  const [showSettings, setShowSettings] = useState(false);
  const [spinHistory, setSpinHistory] = useState<SpinResult[]>([]);

  const spinTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Available symbols with different weights for realistic RTP
  const symbols = [
    { symbol: "🍒", weight: 25, value: 2 }, // Cherry - common, low value
    { symbol: "🍋", weight: 20, value: 3 }, // Lemon - common, low value
    { symbol: "🍊", weight: 18, value: 4 }, // Orange - common, low value
    { symbol: "⭐", weight: 15, value: 8 }, // Star - medium, medium value
    { symbol: "💎", weight: 12, value: 15 }, // Diamond - rare, high value
    { symbol: "👑", weight: 8, value: 25 }, // Crown - very rare, very high value
    { symbol: "🎰", weight: 2, value: 100 }, // Jackpot - extremely rare, jackpot
  ];

  const paylines = [
    [0, 0, 0, 0, 0], // Top row
    [1, 1, 1, 1, 1], // Middle row
    [2, 2, 2, 2, 2], // Bottom row
    [0, 1, 2, 1, 0], // V shape
    [2, 1, 0, 1, 2], // Inverted V
    [0, 0, 1, 2, 2], // Diagonal down
    [2, 2, 1, 0, 0], // Diagonal up
    [1, 0, 0, 0, 1], // W shape
    [1, 2, 2, 2, 1], // Inverted W
  ];

  useEffect(() => {
    if (user && balance) {
      setGameBalance({
        GC: balance.goldCoins,
        SC: balance.sweepsCoins,
      });
    }
  }, [user, balance]);

  useEffect(() => {
    if (autoPlay && autoSpinsLeft > 0 && !isSpinning && gameMode) {
      autoPlayRef.current = setTimeout(() => {
        handleSpin();
      }, 2000);
    }

    return () => {
      if (autoPlayRef.current) {
        clearTimeout(autoPlayRef.current);
      }
    };
  }, [autoPlay, autoSpinsLeft, isSpinning, gameMode]);

  const generateRandomSymbol = (): string => {
    const totalWeight = symbols.reduce((sum, s) => sum + s.weight, 0);
    const random = Math.random() * totalWeight;
    let currentWeight = 0;

    for (const symbol of symbols) {
      currentWeight += symbol.weight;
      if (random <= currentWeight) {
        return symbol.symbol;
      }
    }

    return symbols[0].symbol;
  };

  const generateReels = (): string[][] => {
    const reels: string[][] = [];
    for (let reel = 0; reel < 5; reel++) {
      const reelSymbols: string[] = [];
      for (let row = 0; row < 3; row++) {
        reelSymbols.push(generateRandomSymbol());
      }
      reels.push(reelSymbols);
    }
    return reels;
  };

  const calculateWinnings = (reels: string[][]): SpinResult => {
    let totalWin = 0;
    const winLines: number[] = [];
    let multiplier = 1;
    let bonusTriggered = false;

    // Check each payline
    paylines.forEach((payline, lineIndex) => {
      const lineSymbols = payline.map((row, reel) => reels[reel][row]);
      const firstSymbol = lineSymbols[0];

      // Count consecutive matching symbols from left
      let consecutiveCount = 1;
      for (let i = 1; i < lineSymbols.length; i++) {
        if (lineSymbols[i] === firstSymbol) {
          consecutiveCount++;
        } else {
          break;
        }
      }

      // Calculate win for this line (need at least 3 consecutive)
      if (consecutiveCount >= 3) {
        const symbolData = symbols.find((s) => s.symbol === firstSymbol);
        if (symbolData) {
          let lineWin = symbolData.value * betAmount;

          // Bonus multipliers for 4 or 5 of a kind
          if (consecutiveCount === 4) lineWin *= 3;
          if (consecutiveCount === 5) lineWin *= 10;

          // Special jackpot symbol
          if (firstSymbol === "🎰" && consecutiveCount >= 3) {
            lineWin *= 50;
            bonusTriggered = true;
          }

          totalWin += lineWin;
          winLines.push(lineIndex);
        }
      }
    });

    // Bonus features
    const scatterCount = reels
      .flat()
      .filter((symbol) => symbol === "⭐").length;
    if (scatterCount >= 3) {
      totalWin += betAmount * scatterCount * 5;
      multiplier = scatterCount;
      bonusTriggered = true;
    }

    return {
      symbols: reels,
      winLines,
      winAmount: totalWin,
      isWin: totalWin > 0,
      multiplier,
      bonusTriggered,
    };
  };

  const handleSpin = async () => {
    if (!gameMode || isSpinning) return;

    const currentBalance = gameMode === "GC" ? gameBalance.GC : gameBalance.SC;
    if (currentBalance < betAmount) {
      alert(`Insufficient ${gameMode} balance!`);
      return;
    }

    setIsSpinning(true);

    // Deduct bet amount immediately
    const newBalance = currentBalance - betAmount;
    setGameBalance((prev) => ({
      ...prev,
      [gameMode]: newBalance,
    }));

    // Update user's actual balance
    if (updateBalance) {
      const balanceUpdate =
        gameMode === "GC"
          ? { goldCoins: -betAmount, sweepsCoins: 0 }
          : { goldCoins: 0, sweepsCoins: -betAmount };
      updateBalance(balanceUpdate);
    }

    // Animate spinning
    const spinDuration = 2000 + Math.random() * 1000;

    // Generate intermediate spinning frames
    let spinFrames = 0;
    const maxFrames = 20;

    const spinInterval = setInterval(() => {
      setCurrentSymbols(generateReels());
      spinFrames++;

      if (spinFrames >= maxFrames) {
        clearInterval(spinInterval);

        // Generate final result
        const result = calculateWinnings(generateReels());
        setCurrentSymbols(result.symbols);
        setLastWin(result);

        // Handle winnings
        if (result.isWin) {
          const newBalanceAfterWin = newBalance + result.winAmount;
          setGameBalance((prev) => ({
            ...prev,
            [gameMode]: newBalanceAfterWin,
          }));

          // Update user's actual balance with winnings
          if (updateBalance) {
            const balanceUpdate =
              gameMode === "GC"
                ? { goldCoins: result.winAmount, sweepsCoins: 0 }
                : { goldCoins: 0, sweepsCoins: result.winAmount };
            updateBalance(balanceUpdate);
          }
        }

        // Update stats
        setGameStats((prev) => {
          const newStats = {
            ...prev,
            totalSpins: prev.totalSpins + 1,
            totalWagered: prev.totalWagered + betAmount,
            totalWon: prev.totalWon + result.winAmount,
            biggestWin: Math.max(prev.biggestWin, result.winAmount),
            currentSession: {
              spins: prev.currentSession.spins + 1,
              wagered: prev.currentSession.wagered + betAmount,
              won: prev.currentSession.won + result.winAmount,
            },
          };
          newStats.winRate =
            newStats.totalSpins > 0
              ? (newStats.totalWon / newStats.totalWagered) * 100
              : 0;
          return newStats;
        });

        setSpinHistory((prev) => [result, ...prev.slice(0, 9)]);
        setIsSpinning(false);

        // Handle auto-play
        if (autoPlay && autoSpinsLeft > 0) {
          setAutoSpinsLeft((prev) => prev - 1);
          if (autoSpinsLeft <= 1) {
            setAutoPlay(false);
          }
        }
      }
    }, spinDuration / maxFrames);
  };

  const handleStartGame = () => {
    if (!agreedToTerms || !gameMode) return;
    setShowAgreement(false);
  };

  const handleAutoPlay = (spins: number) => {
    setAutoSpinsLeft(spins);
    setAutoPlay(true);
  };

  if (!user) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-bold mb-4">Login Required</h3>
            <p className="text-gray-600 mb-4">
              Please login to play slot games.
            </p>
            <Button onClick={onClose}>Close</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showAgreement) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-2xl bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-center">
              Welcome to {gameName}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Game Mode Selection */}
            <div className="space-y-4">
              <h3 className="text-white font-bold text-lg">Select Game Mode</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setGameMode("GC")}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    gameMode === "GC"
                      ? "border-yellow-500 bg-yellow-500/20"
                      : "border-gray-600 hover:border-yellow-500/50"
                  }`}
                >
                  <div className="text-center">
                    <Coins className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                    <div className="text-white font-bold">Gold Coins (GC)</div>
                    <div className="text-gray-400 text-sm">For Fun Play</div>
                    <div className="text-yellow-500 font-bold mt-2">
                      Balance: {gameBalance.GC.toLocaleString()} GC
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setGameMode("SC")}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    gameMode === "SC"
                      ? "border-green-500 bg-green-500/20"
                      : "border-gray-600 hover:border-green-500/50"
                  }`}
                >
                  <div className="text-center">
                    <Star className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <div className="text-white font-bold">
                      Sweeps Coins (SC)
                    </div>
                    <div className="text-gray-400 text-sm">For Real Prizes</div>
                    <div className="text-green-500 font-bold mt-2">
                      Balance: {gameBalance.SC.toFixed(2)} SC
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Bet Selection */}
            {gameMode && (
              <div className="space-y-4">
                <h3 className="text-white font-bold">Select Bet Amount</h3>
                <div className="flex items-center gap-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setBetAmount(Math.max(1, betAmount - 1))}
                    disabled={betAmount <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {betAmount} {gameMode}
                    </div>
                    <div className="text-gray-400 text-sm">Per Spin</div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setBetAmount(betAmount + 1)}
                    disabled={
                      betAmount >=
                      (gameMode === "GC" ? gameBalance.GC : gameBalance.SC)
                    }
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex gap-2 justify-center">
                  {[1, 5, 10, 25, 50].map((amount) => (
                    <Button
                      key={amount}
                      size="sm"
                      variant={betAmount === amount ? "default" : "outline"}
                      onClick={() => setBetAmount(amount)}
                      disabled={
                        amount >
                        (gameMode === "GC" ? gameBalance.GC : gameBalance.SC)
                      }
                    >
                      {amount}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Sweepstakes Agreement */}
            <div className="space-y-4 border-t border-gray-700 pt-4">
              <h3 className="text-white font-bold">
                Sweepstakes Rules & Agreement
              </h3>
              <div className="bg-gray-800 p-4 rounded-lg max-h-32 overflow-y-auto text-sm text-gray-300">
                <p className="mb-2">
                  <strong>
                    SWEEPSTAKES GAMING RULES - Howes Networks, LLC
                  </strong>
                </p>
                <p className="mb-2">
                  1. You must be 18+ years old to participate in sweepstakes
                  gaming.
                </p>
                <p className="mb-2">
                  2. No purchase necessary to play. Gold Coins are for
                  entertainment only and have no cash value.
                </p>
                <p className="mb-2">
                  3. Sweeps Coins can be redeemed for cash prizes subject to
                  terms and conditions.
                </p>
                <p className="mb-2">
                  4. {gameMode === "GC" ? "Gold Coins" : "Sweeps Coins"} mode
                  selected. You can only win{" "}
                  {gameMode === "GC" ? "Gold Coins" : "Sweeps Coins"} in this
                  mode.
                </p>
                <p className="mb-2">
                  5. Results are determined by random number generation and are
                  not influenced by previous results.
                </p>
                <p className="mb-2">
                  6. Responsible gaming tools are available. Set limits and play
                  responsibly.
                </p>
                <p className="mb-2">
                  7. Contact: coinkrazy00@gmail.com | Address: 228 Blondeau St,
                  Keokuk IA 52632
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="agree-terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="agree-terms" className="text-white text-sm">
                  I agree to the Sweepstakes Rules and Conditions and confirm I
                  am 18+ years old
                </label>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={handleStartGame}
                disabled={!gameMode || !agreedToTerms}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Playing
              </Button>
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-6xl h-full max-h-[90vh] bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-black/30 p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-white">{gameName}</h1>
            <Badge
              className={`${gameMode === "GC" ? "bg-yellow-600" : "bg-green-600"}`}
            >
              {gameMode} Mode
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="text-white"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowSettings(!showSettings)}
              className="text-white"
            >
              <Settings className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onClose}
              className="text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex h-full">
          {/* Main Game Area */}
          <div className="flex-1 p-6 flex flex-col items-center justify-center">
            {/* Balance Display */}
            <div className="mb-6 flex items-center gap-8">
              <div className="text-center">
                <div className="text-white text-sm">Balance</div>
                <div
                  className={`text-2xl font-bold ${gameMode === "GC" ? "text-yellow-500" : "text-green-500"}`}
                >
                  {gameMode === "GC"
                    ? `${gameBalance.GC.toLocaleString()} GC`
                    : `${gameBalance.SC.toFixed(2)} SC`}
                </div>
              </div>
              <div className="text-center">
                <div className="text-white text-sm">Bet</div>
                <div className="text-xl font-bold text-white">
                  {betAmount} {gameMode}
                </div>
              </div>
              {lastWin && lastWin.isWin && (
                <div className="text-center">
                  <div className="text-white text-sm">Last Win</div>
                  <div className="text-xl font-bold text-yellow-400">
                    +{lastWin.winAmount} {gameMode}
                  </div>
                </div>
              )}
            </div>

            {/* Slot Machine */}
            <div className="bg-black/50 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-5 gap-2 mb-4">
                {currentSymbols.map((reel, reelIndex) => (
                  <div key={reelIndex} className="space-y-2">
                    {reel.map((symbol, symbolIndex) => (
                      <motion.div
                        key={`${reelIndex}-${symbolIndex}`}
                        className={`w-16 h-16 bg-white rounded-lg flex items-center justify-center text-2xl ${
                          lastWin?.winLines.some(
                            (line) =>
                              paylines[line] &&
                              paylines[line][reelIndex] === symbolIndex,
                          )
                            ? "ring-4 ring-yellow-400 bg-yellow-100"
                            : ""
                        }`}
                        animate={
                          isSpinning
                            ? {
                                rotateX: [0, 360, 720, 1080],
                                scale: [1, 1.1, 1, 1.1, 1],
                              }
                            : {}
                        }
                        transition={{ duration: 0.5, delay: reelIndex * 0.1 }}
                      >
                        {symbol}
                      </motion.div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Win Display */}
              {lastWin && lastWin.isWin && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center"
                >
                  <div className="text-yellow-400 text-xl font-bold">
                    YOU WIN! +{lastWin.winAmount} {gameMode}
                  </div>
                  {lastWin.bonusTriggered && (
                    <div className="text-purple-400 font-bold">
                      BONUS TRIGGERED!
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setBetAmount(Math.max(1, betAmount - 1))}
                  disabled={betAmount <= 1 || isSpinning}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <div className="w-20 text-center">
                  <div className="text-white font-bold">
                    {betAmount} {gameMode}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setBetAmount(betAmount + 1)}
                  disabled={
                    betAmount >=
                      (gameMode === "GC" ? gameBalance.GC : gameBalance.SC) ||
                    isSpinning
                  }
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <Button
                size="lg"
                onClick={handleSpin}
                disabled={
                  isSpinning ||
                  (gameMode === "GC" ? gameBalance.GC : gameBalance.SC) <
                    betAmount
                }
                className="bg-green-600 hover:bg-green-700 text-white font-bold px-8"
              >
                {isSpinning ? (
                  <RotateCcw className="w-5 h-5 animate-spin" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
                {isSpinning ? "Spinning..." : "SPIN"}
              </Button>

              <div className="flex items-center gap-2">
                <Select
                  value={autoSpinsLeft.toString()}
                  onValueChange={(value) => handleAutoPlay(parseInt(value))}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Auto Play" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Manual</SelectItem>
                    <SelectItem value="10">10 Spins</SelectItem>
                    <SelectItem value="25">25 Spins</SelectItem>
                    <SelectItem value="50">50 Spins</SelectItem>
                    <SelectItem value="100">100 Spins</SelectItem>
                  </SelectContent>
                </Select>
                {autoPlay && (
                  <div className="text-white text-sm">{autoSpinsLeft} left</div>
                )}
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="w-80 bg-black/30 p-4 space-y-4">
            {/* Game Stats */}
            <Card className="bg-black/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-sm">
                  Session Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Spins:</span>
                  <span className="text-white">
                    {gameStats.currentSession.spins}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Wagered:</span>
                  <span className="text-white">
                    {gameStats.currentSession.wagered} {gameMode}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Won:</span>
                  <span className="text-green-400">
                    {gameStats.currentSession.won} {gameMode}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Net:</span>
                  <span
                    className={
                      gameStats.currentSession.won -
                        gameStats.currentSession.wagered >=
                      0
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    {gameStats.currentSession.won -
                      gameStats.currentSession.wagered >
                    0
                      ? "+"
                      : ""}
                    {gameStats.currentSession.won -
                      gameStats.currentSession.wagered}{" "}
                    {gameMode}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Spins */}
            <Card className="bg-black/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-sm">
                  Recent Spins
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {spinHistory.slice(0, 5).map((spin, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center text-sm"
                  >
                    <div className="flex items-center gap-1">
                      {spin.symbols[0].slice(0, 3).map((symbol, i) => (
                        <span key={i} className="text-xs">
                          {symbol}
                        </span>
                      ))}
                    </div>
                    <div
                      className={`font-bold ${spin.isWin ? "text-green-400" : "text-gray-400"}`}
                    >
                      {spin.isWin ? `+${spin.winAmount}` : "0"} {gameMode}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Paytable */}
            <Card className="bg-black/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-sm">Paytable</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-xs">
                {symbols.map((symbol) => (
                  <div key={symbol.symbol} className="flex justify-between">
                    <span>{symbol.symbol} x3</span>
                    <span className="text-yellow-400">
                      {symbol.value * betAmount} {gameMode}
                    </span>
                  </div>
                ))}
                <div className="border-t border-gray-600 pt-1 mt-2">
                  <div className="flex justify-between">
                    <span>⭐ Scatter x3+</span>
                    <span className="text-purple-400">Bonus</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
