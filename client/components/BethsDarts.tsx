import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Timer, Target, Trophy, Play, RotateCcw } from "lucide-react";

interface BethsDartsProps {
  userId: string;
  username: string;
  onGameComplete: (score: number, scEarned: number) => void;
}

interface DartThrow {
  id: number;
  x: number;
  y: number;
  points: number;
  timestamp: number;
}

interface DartboardRegion {
  type: 'bullseye' | 'outer-bull' | 'single' | 'double' | 'triple' | 'miss';
  value: number;
  scValue: number;
}

export function BethsDarts({ userId, username, onGameComplete }: BethsDartsProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [totalSC, setTotalSC] = useState(0);
  const [currentWin, setCurrentWin] = useState(0);
  const [throws, setThrows] = useState<DartThrow[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [lastThrowResult, setLastThrowResult] = useState<string>("");
  const [dartPosition, setDartPosition] = useState({ x: 300, y: 300 });
  const [isThrowing, setIsThrowing] = useState(false);

  const gameAreaRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const GAME_DURATION = 60;
  const DARTBOARD_CENTER = { x: 300, y: 300 };
  const DARTBOARD_RADIUS = 150;

  const getDartboardRegion = (x: number, y: number): DartboardRegion => {
    const dx = x - DARTBOARD_CENTER.x;
    const dy = y - DARTBOARD_CENTER.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > DARTBOARD_RADIUS) {
      return { type: 'miss', value: 0, scValue: 0 };
    }

    // Bullseye (innermost circle)
    if (distance <= 12) {
      return { type: 'bullseye', value: 50, scValue: 0.05 };
    }

    // Outer bull
    if (distance <= 25) {
      return { type: 'outer-bull', value: 25, scValue: 0.02 };
    }

    // Calculate angle for segments
    const angle = Math.atan2(dy, dx);
    let degrees = (angle * 180 / Math.PI + 360) % 360;
    degrees = (degrees + 9) % 360; // Offset for dartboard layout

    const segment = Math.floor(degrees / 18);
    const segmentValues = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];
    const segmentValue = segmentValues[segment];

    // Triple ring
    if (distance >= 95 && distance <= 107) {
      return { type: 'triple', value: segmentValue * 3, scValue: 0.02 };
    }

    // Double ring  
    if (distance >= 157 && distance <= 170) {
      return { type: 'double', value: segmentValue * 2, scValue: 0.015 };
    }

    // Single regions
    if (distance >= 25) {
      // Special 0.01 SC spots (8 random segments)
      const scSpots = [0, 2, 5, 7, 10, 13, 16, 18];
      if (scSpots.includes(segment)) {
        return { type: 'single', value: segmentValue, scValue: 0.01 };
      }
      return { type: 'single', value: segmentValue, scValue: 0 };
    }

    return { type: 'miss', value: 0, scValue: 0 };
  };

  const throwDart = useCallback((x: number, y: number) => {
    if (!isPlaying || isThrowing) return;

    setIsThrowing(true);
    const region = getDartboardRegion(x, y);
    
    const newThrow: DartThrow = {
      id: Date.now(),
      x,
      y,
      points: region.value,
      timestamp: Date.now(),
    };

    setThrows(prev => [...prev, newThrow]);

    if (region.scValue > 0) {
      setCurrentWin(prev => prev + region.scValue);
      setTotalSC(prev => prev + region.scValue);
      setLastThrowResult(`+${region.scValue.toFixed(2)} SC! ${region.type.toUpperCase()}`);
    } else {
      // Bust - reset current win
      if (region.type === 'miss') {
        setCurrentWin(0);
        setLastThrowResult("BUST! Current win reset to 0.00 SC");
      } else {
        setLastThrowResult(`${region.value} points - No SC earned`);
      }
    }

    // Reset throwing animation
    setTimeout(() => {
      setIsThrowing(false);
      setDartPosition({ x: 300, y: 500 });
    }, 1000);
  }, [isPlaying, isThrowing]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (!gameAreaRef.current) return;
    
    const rect = gameAreaRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setDartPosition({ x, y });
    throwDart(x, y);
  }, [throwDart]);

  const startGame = () => {
    setGameStarted(true);
    setIsPlaying(true);
    setTimeLeft(GAME_DURATION);
    setTotalSC(0);
    setCurrentWin(0);
    setThrows([]);
    setGameCompleted(false);
    setLastThrowResult("");
    setDartPosition({ x: 300, y: 500 });

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const endGame = useCallback(() => {
    setIsPlaying(false);
    setGameCompleted(true);

    if (timerRef.current) clearInterval(timerRef.current);

    const finalSC = Math.min(0.25, totalSC);
    onGameComplete(throws.length, finalSC);
  }, [throws.length, totalSC, onGameComplete]);

  const resetGame = () => {
    setGameStarted(false);
    setIsPlaying(false);
    setGameCompleted(false);
    setTimeLeft(GAME_DURATION);
    setTotalSC(0);
    setCurrentWin(0);
    setThrows([]);
    setLastThrowResult("");
    setDartPosition({ x: 300, y: 500 });

    if (timerRef.current) clearInterval(timerRef.current);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="overflow-hidden">
        <CardHeader className="text-center bg-gradient-to-r from-gold/20 to-sweep/20">
          <div className="flex items-center justify-center mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-gold to-yellow-400 rounded-full flex items-center justify-center mr-3">
              🎯
            </div>
            <div>
              <CardTitle className="text-2xl">Beth's Darts</CardTitle>
              <CardDescription>Hit the target to earn Sweeps Coins!</CardDescription>
            </div>
          </div>

          <div className="flex justify-center space-x-6 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-casino-green">{totalSC.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Total SC</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gold">{currentWin.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Current Win</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-sweep">{throws.length}</div>
              <div className="text-sm text-muted-foreground">Throws</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{timeLeft}s</div>
              <div className="text-sm text-muted-foreground">Time Left</div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <Progress value={(timeLeft / GAME_DURATION) * 100} className="h-2" />
            {lastThrowResult && (
              <div className="text-sm font-semibold text-gold animate-pulse">
                {lastThrowResult}
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div
            ref={gameAreaRef}
            className="relative w-full h-96 bg-gradient-to-b from-slate-800 to-slate-900 overflow-hidden cursor-crosshair"
            onClick={handleClick}
            style={{
              backgroundImage: `
                radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: "20px 20px",
            }}
          >
            {/* Dartboard */}
            <div
              className="absolute rounded-full border-4 border-yellow-400"
              style={{
                left: DARTBOARD_CENTER.x - DARTBOARD_RADIUS,
                top: DARTBOARD_CENTER.y - DARTBOARD_RADIUS,
                width: DARTBOARD_RADIUS * 2,
                height: DARTBOARD_RADIUS * 2,
              }}
            >
              {/* Dartboard background */}
              <div className="w-full h-full rounded-full bg-gradient-to-br from-red-800 via-green-800 to-red-800 relative overflow-hidden">
                
                {/* Outer ring (doubles) */}
                <div className="absolute inset-2 rounded-full border-2 border-white/30">
                  
                  {/* Inner scoring area */}
                  <div className="absolute inset-8 rounded-full bg-gradient-to-br from-green-700 via-red-700 to-green-700">
                    
                    {/* Triple ring */}
                    <div className="absolute inset-12 rounded-full border-2 border-white/50">
                      
                      {/* Single scoring area */}
                      <div className="absolute inset-4 rounded-full bg-gradient-to-br from-red-600 via-green-600 to-red-600">
                        
                        {/* Outer bull */}
                        <div className="absolute inset-16 rounded-full bg-green-500 border-2 border-white">
                          
                          {/* Inner bull (bullseye) */}
                          <div className="absolute inset-3 rounded-full bg-red-500 border-2 border-white">
                            <div className="w-full h-full flex items-center justify-center text-white font-bold text-xs">
                              BULL
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Score markers */}
                <div className="absolute inset-0 text-white text-xs font-bold">
                  {[20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5].map((num, i) => {
                    const angle = (i * 18 - 90) * Math.PI / 180;
                    const radius = DARTBOARD_RADIUS - 15;
                    const x = Math.cos(angle) * radius + DARTBOARD_RADIUS;
                    const y = Math.sin(angle) * radius + DARTBOARD_RADIUS;
                    return (
                      <div
                        key={i}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2"
                        style={{ left: x, top: y }}
                      >
                        {num}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CoinKrazy.com branding */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-gold font-bold text-sm">
                CoinKrazy.com
              </div>
            </div>

            {/* Dart */}
            <div
              className={`absolute transition-all duration-500 ${isThrowing ? 'animate-pulse' : ''}`}
              style={{
                left: dartPosition.x - 10,
                top: dartPosition.y - 10,
                width: 20,
                height: 20,
              }}
            >
              <div className="text-2xl transform rotate-45">🎯</div>
            </div>

            {/* Dart throws markers */}
            {throws.slice(-10).map((dart, index) => (
              <div
                key={dart.id}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full border border-white animate-ping"
                style={{
                  left: dart.x - 4,
                  top: dart.y - 4,
                  animationDelay: `${index * 100}ms`,
                }}
              />
            ))}

            {/* Game Instructions */}
            {!gameStarted && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <div className="text-center text-white space-y-4 p-6 bg-black/50 rounded-lg">
                  <h3 className="text-xl font-bold">Beth's Darts</h3>
                  <div className="space-y-2 text-sm">
                    <p>🎯 Click to throw darts at the board</p>
                    <p>🔥 Bullseye = 0.05 SC</p>
                    <p>💰 8 special spots = 0.01 SC each</p>
                    <p>❌ Miss 4 spots = BUST (current win resets to 0)</p>
                    <p>⏱️ You have 60 seconds to score</p>
                  </div>
                </div>
              </div>
            )}

            {/* Game Over Screen */}
            {gameCompleted && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                <div className="text-center text-white space-y-4 p-6 bg-black/70 rounded-lg">
                  <Trophy className="w-16 h-16 mx-auto text-gold" />
                  <h3 className="text-2xl font-bold">Darts Complete!</h3>
                  <div className="space-y-2">
                    <p className="text-lg">
                      Total Throws: <span className="text-gold font-bold">{throws.length}</span>
                    </p>
                    <p className="text-lg">
                      SC Earned: <span className="text-casino-green font-bold">{Math.min(0.25, totalSC).toFixed(2)}</span>
                    </p>
                    <p className="text-sm text-muted-foreground mt-4">
                      You will be credited after admin approval
                    </p>
                    <p className="text-sm text-gold">
                      Come Back Tomorrow and do it again!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 bg-card/50">
            {!gameStarted ? (
              <Button
                onClick={startGame}
                className="w-full bg-gradient-to-r from-gold to-yellow-400 text-gold-foreground hover:from-yellow-400 hover:to-gold text-lg py-6"
                size="lg"
              >
                <Play className="h-5 w-5 mr-2" />
                Start Dart Game
              </Button>
            ) : gameCompleted ? (
              <Button
                onClick={resetGame}
                variant="outline"
                className="w-full border-gold text-gold hover:bg-gold/10 text-lg py-6"
                size="lg"
              >
                <RotateCcw className="h-5 w-5 mr-2" />
                Play Again Tomorrow
              </Button>
            ) : (
              <div className="text-center space-y-2">
                <p className="text-lg font-semibold">Click on the dartboard to throw!</p>
                <p className="text-sm text-muted-foreground">
                  Aim for the bullseye or special SC spots. Avoid missing 4 throws!
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
