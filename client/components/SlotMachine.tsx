import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Slider } from "./ui/slider";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Settings,
  Trophy,
  Coins,
  Zap,
  Star,
  Crown,
} from "lucide-react";
import {
  SlotMachine as SlotMachineType,
  SlotSymbol,
  SlotSpin,
} from "@shared/slotTypes";

interface SlotMachineProps {
  slot: SlotMachineType;
  userId: string;
  userBalance: number;
  currency: "GC" | "SC";
  onSpin: (bet: number, currency: "GC" | "SC") => Promise<SlotSpin>;
  onBalanceUpdate: (newBalance: number) => void;
  realTimeMode?: boolean;
  onWalletUpdate?: (gcBalance: number, scBalance: number) => void;
}

interface ReelState {
  symbols: string[];
  spinning: boolean;
  animationOffset: number;
  finalPosition: number;
}

export function SlotMachine({
  slot,
  userId,
  userBalance,
  currency,
  onSpin,
  onBalanceUpdate,
  realTimeMode = false,
  onWalletUpdate,
}: SlotMachineProps) {
  const [reels, setReels] = useState<ReelState[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentBet, setCurrentBet] = useState(slot.minBet);
  const [lastWin, setLastWin] = useState(0);
  const [totalWins, setTotalWins] = useState(0);
  const [spinCount, setSpinCount] = useState(0);
  const [winLines, setWinLines] = useState<any[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoPlay, setAutoPlay] = useState(false);
  const [showWinAnimation, setShowWinAnimation] = useState(false);

  const reelRefs = useRef<HTMLDivElement[]>([]);
  const spinSoundRef = useRef<HTMLAudioElement | null>(null);
  const winSoundRef = useRef<HTMLAudioElement | null>(null);

  // Initialize reels
  useEffect(() => {
    const initialReels: ReelState[] = slot.reels.map((reel, index) => ({
      symbols: generateReelStrip(reel.symbols, 20), // Generate longer strip for animation
      spinning: false,
      animationOffset: 0,
      finalPosition: 0,
    }));
    setReels(initialReels);
  }, [slot]);

  const generateReelStrip = (symbolIds: string[], length: number): string[] => {
    const strip: string[] = [];
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * symbolIds.length);
      strip.push(symbolIds[randomIndex]);
    }
    return strip;
  };

  const getSymbolById = (symbolId: string): SlotSymbol | undefined => {
    return slot.symbols.find((symbol) => symbol.id === symbolId);
  };

  const calculateWin = (
    result: string[][],
  ): { amount: number; lines: any[] } => {
    let totalWin = 0;
    const winningLines: any[] = [];

    slot.paylines.forEach((payline) => {
      if (!payline.active) return;

      const lineSymbols: string[] = [];
      payline.positions.forEach((pos) => {
        if (result[pos.row] && result[pos.row][pos.reel]) {
          lineSymbols.push(result[pos.row][pos.reel]);
        }
      });

      // Check for winning combinations
      slot.winConditions.forEach((condition) => {
        const matchingSymbols = lineSymbols.filter(
          (symbol) =>
            symbol === condition.symbolId ||
            slot.symbols.find((s) => s.id === symbol)?.name === "Wild",
        );

        if (matchingSymbols.length >= condition.count) {
          const winAmount = condition.payout * currentBet;
          totalWin += winAmount;

          winningLines.push({
            paylineId: payline.id,
            symbols: matchingSymbols,
            payout: winAmount,
            symbolId: condition.symbolId,
          });
        }
      });
    });

    return { amount: totalWin, lines: winningLines };
  };

  const generateSpinResult = (): string[][] => {
    const result: string[][] = [];

    for (let row = 0; row < slot.rows; row++) {
      result[row] = [];
      for (let reel = 0; reel < slot.reels.length; reel++) {
        const reelSymbols = slot.reels[reel].symbols;
        const weights = slot.reels[reel].weight;

        // Weighted random selection
        const totalWeight = Object.values(weights).reduce(
          (sum, weight) => sum + weight,
          0,
        );
        let random = Math.random() * totalWeight;

        let selectedSymbol = reelSymbols[0];
        for (const symbolId of reelSymbols) {
          random -= weights[symbolId] || 1;
          if (random <= 0) {
            selectedSymbol = symbolId;
            break;
          }
        }

        result[row][reel] = selectedSymbol;
      }
    }

    return result;
  };

  const spinReels = async (): Promise<string[][]> => {
    if (isSpinning || currentBet > userBalance) return [];

    setIsSpinning(true);
    setLastWin(0);
    setWinLines([]);
    setShowWinAnimation(false);

    // Play spin sound
    if (soundEnabled && spinSoundRef.current) {
      spinSoundRef.current.play().catch(() => {});
    }

    // Generate result
    const result = generateSpinResult();

    // Animate reels
    const spinPromises = reels.map((_, index) =>
      animateReel(index, result[0]?.[index] || slot.reels[index].symbols[0]),
    );

    await Promise.all(spinPromises);

    // Calculate wins
    const { amount, lines } = calculateWin(result);

    setLastWin(amount);
    setWinLines(lines);
    setTotalWins((prev) => prev + amount);
    setSpinCount((prev) => prev + 1);

    // Update balance
    const newBalance = userBalance - currentBet + amount;
    onBalanceUpdate(newBalance);

    // Show win animation if won
    if (amount > 0) {
      setShowWinAnimation(true);
      if (soundEnabled && winSoundRef.current) {
        winSoundRef.current.play().catch(() => {});
      }
      setTimeout(() => setShowWinAnimation(false), 3000);
    }

    setIsSpinning(false);
    return result;
  };

  const animateReel = (
    reelIndex: number,
    finalSymbol: string,
  ): Promise<void> => {
    return new Promise((resolve) => {
      const reel = reelRefs.current[reelIndex];
      if (!reel) {
        resolve();
        return;
      }

      const spinDuration =
        slot.animations.spinDuration + reelIndex * slot.animations.reelDelay;
      const symbolHeight = 80; // Height of each symbol

      // Update reel state
      setReels((prev) =>
        prev.map((r, i) =>
          i === reelIndex
            ? {
                ...r,
                spinning: true,
                animationOffset: 0,
              }
            : r,
        ),
      );

      // Animate spinning
      let startTime: number;
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / spinDuration, 1);

        // Easing function for natural spin feeling
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const offset = easeOut * symbolHeight * 20; // Spin through many symbols

        setReels((prev) =>
          prev.map((r, i) =>
            i === reelIndex
              ? {
                  ...r,
                  animationOffset: offset,
                }
              : r,
          ),
        );

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Stop spinning and show final symbol
          setReels((prev) =>
            prev.map((r, i) =>
              i === reelIndex
                ? {
                    ...r,
                    spinning: false,
                    animationOffset: 0,
                    finalPosition: 0,
                  }
                : r,
            ),
          );
          resolve();
        }
      };

      requestAnimationFrame(animate);
    });
  };

  const handleSpin = async () => {
    if (currentBet > userBalance) return;

    try {
      const result = await spinReels();
      if (result.length > 0) {
        // Record spin in backend
        await onSpin(currentBet);
      }
    } catch (error) {
      console.error("Spin error:", error);
      setIsSpinning(false);
    }
  };

  const adjustBet = (newBet: number) => {
    if (!isSpinning) {
      setCurrentBet(Math.max(slot.minBet, Math.min(slot.maxBet, newBet)));
    }
  };

  const maxBet = () => {
    adjustBet(Math.min(slot.maxBet, userBalance));
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="overflow-hidden bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-gold/30">
        <CardHeader className="text-center bg-gradient-to-r from-gold/10 to-purple/10 border-b border-gold/20">
          <div className="flex items-center justify-center mb-2">
            <img
              src={slot.thumbnail || "/slot-placeholder.png"}
              alt={slot.name}
              className="w-16 h-16 rounded-lg border-2 border-gold/50 mr-4"
            />
            <div>
              <CardTitle className="text-2xl flex items-center">
                {slot.name}
                <Badge
                  variant="outline"
                  className="ml-2 border-gold/50 text-gold"
                >
                  <Crown className="h-3 w-3 mr-1" />
                  {slot.provider}
                </Badge>
              </CardTitle>
              <CardDescription>{slot.description}</CardDescription>
            </div>
          </div>

          {/* Game Stats */}
          <div className="flex justify-center space-x-6 mt-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                currency === "GC" ? "text-gold" : "text-purple-400"
              }`}>
                {userBalance.toLocaleString()} {currency}
              </div>
              <div className="text-sm text-muted-foreground">Balance</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {currentBet.toLocaleString()} {currency}
              </div>
              <div className="text-sm text-muted-foreground">Play Amount</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-casino-green">
                {lastWin.toLocaleString()} {currency}
              </div>
              <div className="text-sm text-muted-foreground">Last Win</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {spinCount}
              </div>
              <div className="text-sm text-muted-foreground">Spins</div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Slot Machine Display */}
          <div
            className="relative rounded-lg border-4 border-gold/50 p-4 mb-6"
            style={{
              backgroundImage: `url(${slot.backgroundImage || "/slot-bg.jpg"})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Paylines overlay */}
            {winLines.length > 0 && (
              <div className="absolute inset-0 pointer-events-none">
                {winLines.map((line, index) => (
                  <div key={index} className="absolute inset-0">
                    <svg className="w-full h-full">
                      <path
                        d={`M 0 ${50 + index * 20} L ${400} ${50 + index * 20}`}
                        stroke="#FFD700"
                        strokeWidth="3"
                        fill="none"
                        className="animate-pulse"
                      />
                    </svg>
                  </div>
                ))}
              </div>
            )}

            {/* Reels */}
            <div
              className="grid gap-2"
              style={{
                gridTemplateColumns: `repeat(${slot.reels.length}, 1fr)`,
              }}
            >
              {reels.map((reel, reelIndex) => (
                <div key={reelIndex} className="relative">
                  <div
                    ref={(el) => (reelRefs.current[reelIndex] = el!)}
                    className="h-64 overflow-hidden rounded border-2 border-gold/30 bg-black/50"
                  >
                    <div
                      className="transition-transform duration-100"
                      style={{
                        transform: `translateY(-${reel.animationOffset}px)`,
                      }}
                    >
                      {/* Show current symbols */}
                      {Array.from({ length: slot.rows }, (_, rowIndex) => {
                        const symbolIndex =
                          Math.floor(reel.animationOffset / 80) + rowIndex;
                        const symbolId =
                          reel.symbols[symbolIndex % reel.symbols.length];
                        const symbol = getSymbolById(symbolId);

                        return (
                          <div
                            key={`${reelIndex}-${rowIndex}`}
                            className={`h-20 flex items-center justify-center border-b border-gold/20 ${
                              showWinAnimation &&
                              winLines.some((line) =>
                                line.symbols.includes(symbolId),
                              )
                                ? "animate-pulse bg-gold/20"
                                : ""
                            }`}
                          >
                            {symbol ? (
                              <div className="text-center">
                                <div className="text-4xl mb-1">
                                  {symbol.image ? (
                                    <img
                                      src={symbol.image}
                                      alt={symbol.name}
                                      className="w-12 h-12 mx-auto"
                                    />
                                  ) : (
                                    <span style={{ color: symbol.color }}>
                                      {symbol.name[0]}
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-white/80">
                                  {symbol.name}
                                </div>
                              </div>
                            ) : (
                              <div className="text-2xl text-white">?</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Reel number */}
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gold font-bold">
                    Reel {reelIndex + 1}
                  </div>
                </div>
              ))}
            </div>

            {/* Win Animation Overlay */}
            {showWinAnimation && lastWin > 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="text-center text-white">
                  <Trophy className="w-20 h-20 mx-auto text-gold animate-bounce mb-4" />
                  <div className="text-4xl font-bold text-gold animate-pulse">
                    YOU WIN!
                  </div>
                  <div className="text-2xl font-bold text-casino-green mt-2">
                    {lastWin.toLocaleString()} {currency}
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    {winLines.length} winning line
                    {winLines.length !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>
            )}

            {/* CoinKrazy Branding */}
            <div className="absolute bottom-2 right-2 text-xs font-bold text-gold opacity-70">
              CoinKrazy.com
            </div>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Betting Controls */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Coins className="h-5 w-5 mr-2 text-gold" />
                Betting
              </h3>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Play Amount: {currentBet.toLocaleString()} {currency}
                </label>
                <Slider
                  value={[currentBet]}
                  onValueChange={(value) => adjustBet(value[0])}
                  min={slot.minBet}
                  max={Math.min(slot.maxBet, userBalance)}
                  step={0.01}
                  disabled={isSpinning}
                  className="mb-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Min: {slot.minBet} {currency}</span>
                  <span>Max: {slot.maxBet} {currency}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={() => adjustBet(currentBet / 2)}
                  disabled={isSpinning}
                  variant="outline"
                  size="sm"
                >
                  1/2 Play
                </Button>
                <Button
                  onClick={() => adjustBet(currentBet * 2)}
                  disabled={isSpinning}
                  variant="outline"
                  size="sm"
                >
                  2x Play
                </Button>
                <Button
                  onClick={maxBet}
                  disabled={isSpinning}
                  variant="outline"
                  size="sm"
                >
                  Max Play
                </Button>
              </div>
            </div>

            {/* Game Controls */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Settings className="h-5 w-5 mr-2 text-gold" />
                Controls
              </h3>

              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  variant="outline"
                  size="sm"
                >
                  {soundEnabled ? (
                    <Volume2 className="h-4 w-4" />
                  ) : (
                    <VolumeX className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  onClick={() => setAutoPlay(!autoPlay)}
                  variant="outline"
                  size="sm"
                  disabled={isSpinning}
                >
                  {autoPlay ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  Auto
                </Button>
                <Button
                  onClick={() => {
                    setSpinCount(0);
                    setTotalWins(0);
                    setLastWin(0);
                    setWinLines([]);
                  }}
                  variant="outline"
                  size="sm"
                  disabled={isSpinning}
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
              </div>

              <div className="text-sm text-muted-foreground space-y-1">
                <div>RTP: {slot.rtp}%</div>
                <div>Volatility: {slot.volatility}</div>
                <div>Total Wins: {totalWins.toLocaleString()} {currency}</div>
                <div className="flex items-center mt-2">
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    currency === "GC" ? "bg-gold" : "bg-purple-400"
                  }`}></div>
                  <span className="text-xs">
                    Playing with {currency === "GC" ? "Gold Coins" : "Sweeps Coins"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Spin Button */}
          <div className="mt-6">
            <Button
              onClick={handleSpin}
              disabled={isSpinning || currentBet > userBalance}
              className="w-full bg-gradient-to-r from-gold to-yellow-400 text-gold-foreground hover:from-yellow-400 hover:to-gold text-xl py-8"
              size="lg"
            >
              {isSpinning ? (
                <div className="flex items-center">
                  <div className="w-6 h-6 border-4 border-gold-foreground border-t-transparent rounded-full animate-spin mr-3"></div>
                  SPINNING...
                </div>
              ) : (
                <div className="flex items-center">
                  <Play className="h-6 w-6 mr-3" />
                  SPIN ${currentBet.toFixed(2)}
                </div>
              )}
            </Button>

            {currentBet > userBalance && (
              <p className="text-casino-red text-center mt-2">
                Insufficient balance for this bet
              </p>
            )}
          </div>

          {/* Paytable */}
          <div className="mt-6 p-4 bg-card/50 rounded border">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Star className="h-5 w-5 mr-2 text-gold" />
              Paytable
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              {slot.symbols.map((symbol) => (
                <div
                  key={symbol.id}
                  className="flex items-center space-x-2 p-2 bg-muted/50 rounded"
                >
                  <div style={{ color: symbol.color }} className="font-bold">
                    {symbol.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold">{symbol.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {symbol.value}x
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audio Elements */}
      <audio ref={spinSoundRef} preload="auto">
        <source src="/sounds/slot-spin.mp3" type="audio/mpeg" />
      </audio>
      <audio ref={winSoundRef} preload="auto">
        <source src="/sounds/slot-win.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
}
