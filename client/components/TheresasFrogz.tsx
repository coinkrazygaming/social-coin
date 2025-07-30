import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Timer, Trophy, Play, RotateCcw, ArrowUp } from "lucide-react";

interface TheresasFrogzProps {
  userId: string;
  username: string;
  onGameComplete: (score: number, scEarned: number) => void;
}

interface Frog {
  x: number;
  y: number;
  vx: number;
  vy: number;
  onLilyPad: boolean;
  width: number;
  height: number;
}

interface LilyPad {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  points: number;
  visited: boolean;
}

interface Fly {
  id: number;
  x: number;
  y: number;
  caught: boolean;
}

export function TheresasFrogz({ userId, username, onGameComplete }: TheresasFrogzProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [jumps, setJumps] = useState(0);
  const [fliesCaught, setFliesCaught] = useState(0);
  const [frog, setFrog] = useState<Frog>({
    x: 50,
    y: 300,
    vx: 0,
    vy: 0,
    onLilyPad: true,
    width: 40,
    height: 30,
  });
  const [lilyPads, setLilyPads] = useState<LilyPad[]>([]);
  const [flies, setFlies] = useState<Fly[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [isCharging, setIsCharging] = useState(false);
  const [jumpPower, setJumpPower] = useState(0);
  const [jumpDirection, setJumpDirection] = useState(0);

  const gameAreaRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<number>();
  const powerTimerRef = useRef<NodeJS.Timeout | null>(null);

  const GAME_DURATION = 60;
  const GRAVITY = 0.5;
  const WATER_LEVEL = 350;

  const generateLevel = useCallback(() => {
    const pads: LilyPad[] = [];
    const gameFlies: Fly[] = [];
    
    // Starting lily pad
    pads.push({
      id: 0,
      x: 20,
      y: 320,
      width: 60,
      height: 20,
      points: 0,
      visited: true,
    });

    // Generate lily pads across the pond
    for (let i = 1; i < 15; i++) {
      const x = 100 + (i * 80) + (Math.random() - 0.5) * 40;
      const y = 280 + Math.random() * 60;
      const points = Math.floor(Math.random() * 3) + 1; // 1-3 points
      
      pads.push({
        id: i,
        x,
        y,
        width: 50 + Math.random() * 20,
        height: 15 + Math.random() * 10,
        points,
        visited: false,
      });
    }

    // Generate flies
    for (let i = 0; i < 8; i++) {
      gameFlies.push({
        id: i,
        x: 150 + Math.random() * 800,
        y: 100 + Math.random() * 150,
        caught: false,
      });
    }

    setLilyPads(pads);
    setFlies(gameFlies);
  }, []);

  const startCharging = useCallback(() => {
    if (!frog.onLilyPad || !isPlaying) return;

    setIsCharging(true);
    setJumpPower(0);

    powerTimerRef.current = setInterval(() => {
      setJumpPower(prev => {
        if (prev >= 100) return 100;
        return prev + 2;
      });
    }, 20);
  }, [frog.onLilyPad, isPlaying]);

  const jump = useCallback(() => {
    if (!isCharging || !isPlaying) return;

    setIsCharging(false);
    if (powerTimerRef.current) clearInterval(powerTimerRef.current);

    const power = jumpPower / 100;
    const angle = (jumpDirection * Math.PI) / 180;
    const speed = 8 + power * 12; // Max speed of 20

    setFrog(prev => ({
      ...prev,
      vx: Math.cos(angle) * speed,
      vy: -Math.sin(angle) * speed,
      onLilyPad: false,
    }));

    setJumps(prev => prev + 1);
    setJumpPower(0);
  }, [isCharging, jumpPower, jumpDirection, isPlaying]);

  const updateFrog = useCallback(() => {
    setFrog(prev => {
      if (prev.onLilyPad) return prev;

      let newX = prev.x + prev.vx;
      let newY = prev.y + prev.vy;
      let newVy = prev.vy + GRAVITY;
      let newVx = prev.vx * 0.99; // Air resistance
      let onLilyPad = false;

      // Check lily pad collisions
      lilyPads.forEach(pad => {
        if (newX + prev.width > pad.x &&
            newX < pad.x + pad.width &&
            newY + prev.height > pad.y &&
            newY + prev.height < pad.y + pad.height + 20 &&
            newVy > 0) {
          
          newY = pad.y - prev.height;
          newVy = 0;
          newVx = 0;
          onLilyPad = true;

          // Score points for new lily pad
          if (!pad.visited) {
            setScore(s => s + pad.points * 10);
            setLilyPads(pads => pads.map(p => 
              p.id === pad.id ? { ...p, visited: true } : p
            ));
          }
        }
      });

      // Check fly collisions
      flies.forEach(fly => {
        if (!fly.caught &&
            newX + prev.width > fly.x &&
            newX < fly.x + 20 &&
            newY + prev.height > fly.y &&
            newY < fly.y + 20) {
          
          setFliesCaught(f => f + 1);
          setScore(s => s + 25);
          setFlies(fs => fs.map(f => 
            f.id === fly.id ? { ...f, caught: true } : f
          ));
        }
      });

      // Check if fell in water
      if (newY + prev.height > WATER_LEVEL && !onLilyPad) {
        // Respawn on last lily pad or starting pad
        const lastVisitedPad = lilyPads.filter(p => p.visited).pop() || lilyPads[0];
        newX = lastVisitedPad.x + lastVisitedPad.width / 2 - prev.width / 2;
        newY = lastVisitedPad.y - prev.height;
        newVx = 0;
        newVy = 0;
        onLilyPad = true;
        setScore(s => Math.max(0, s - 10)); // Penalty for falling
      }

      // Keep frog in bounds
      if (newX < 0) newX = 0;
      if (newX + prev.width > (gameAreaRef.current?.clientWidth || 1000)) {
        newX = (gameAreaRef.current?.clientWidth || 1000) - prev.width;
      }

      return {
        ...prev,
        x: newX,
        y: newY,
        vx: newVx,
        vy: newVy,
        onLilyPad,
      };
    });
  }, [lilyPads, flies]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return;

      switch (e.key) {
        case ' ':
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          if (!isCharging) {
            startCharging();
          }
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          setJumpDirection(prev => Math.max(0, prev - 5));
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          setJumpDirection(prev => Math.min(90, prev + 5));
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!isPlaying) return;

      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        jump();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPlaying, isCharging, startCharging, jump]);

  const startGame = () => {
    setGameStarted(true);
    setIsPlaying(true);
    setTimeLeft(GAME_DURATION);
    setScore(0);
    setJumps(0);
    setFliesCaught(0);
    setGameCompleted(false);
    setJumpDirection(45);

    setFrog({
      x: 50,
      y: 300,
      vx: 0,
      vy: 0,
      onLilyPad: true,
      width: 40,
      height: 30,
    });

    generateLevel();

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
    if (powerTimerRef.current) clearInterval(powerTimerRef.current);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);

    const scEarned = Math.min(0.25, score * 0.01);
    onGameComplete(score, scEarned);
  }, [score, onGameComplete]);

  const resetGame = () => {
    setGameStarted(false);
    setIsPlaying(false);
    setGameCompleted(false);
    setTimeLeft(GAME_DURATION);
    setScore(0);
    setJumps(0);
    setFliesCaught(0);
    setIsCharging(false);
    setJumpPower(0);
    setJumpDirection(45);

    if (timerRef.current) clearInterval(timerRef.current);
    if (powerTimerRef.current) clearInterval(powerTimerRef.current);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  };

  useEffect(() => {
    const animate = () => {
      if (isPlaying) {
        updateFrog();
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, updateFrog]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="overflow-hidden">
        <CardHeader className="text-center bg-gradient-to-r from-gold/20 to-sweep/20">
          <div className="flex items-center justify-center mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-gold to-yellow-400 rounded-full flex items-center justify-center mr-3">
              🐸
            </div>
            <div>
              <CardTitle className="text-2xl">Theresa's Frogz</CardTitle>
              <CardDescription>Hop across lily pads and catch flies!</CardDescription>
            </div>
          </div>

          <div className="flex justify-center space-x-6 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-casino-green">{score}</div>
              <div className="text-sm text-muted-foreground">Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-sweep">{jumps}</div>
              <div className="text-sm text-muted-foreground">Jumps</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gold">{fliesCaught}</div>
              <div className="text-sm text-muted-foreground">Flies</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{timeLeft}s</div>
              <div className="text-sm text-muted-foreground">Time Left</div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <Progress value={(timeLeft / GAME_DURATION) * 100} className="h-2" />
            {isCharging && (
              <div className="space-y-1">
                <Progress value={jumpPower} className="h-3 bg-blue-900" />
                <div className="text-xs text-muted-foreground">
                  Power: {jumpPower}% • Direction: {jumpDirection}°
                </div>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div
            ref={gameAreaRef}
            className="relative w-full h-96 bg-gradient-to-b from-sky-400 via-blue-500 to-blue-800 overflow-hidden"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: "80px 80px",
            }}
          >
            {/* Water */}
            <div 
              className="absolute w-full bg-blue-600 opacity-60"
              style={{ 
                top: WATER_LEVEL,
                height: 50,
              }}
            />

            {/* Lily Pads */}
            {lilyPads.map(pad => (
              <div
                key={pad.id}
                className={`absolute rounded-full border-2 ${
                  pad.visited ? 'bg-green-400 border-green-600' : 'bg-green-500 border-green-700'
                }`}
                style={{
                  left: pad.x,
                  top: pad.y,
                  width: pad.width,
                  height: pad.height,
                }}
              >
                <div className="w-full h-full flex items-center justify-center text-xs font-bold text-white">
                  {pad.points > 0 && !pad.visited && `+${pad.points * 10}`}
                </div>
              </div>
            ))}

            {/* Flies */}
            {flies.map(fly => !fly.caught && (
              <div
                key={fly.id}
                className="absolute w-5 h-5 text-lg animate-bounce"
                style={{
                  left: fly.x,
                  top: fly.y,
                }}
              >
                🪰
              </div>
            ))}

            {/* Frog */}
            <div
              className={`absolute transition-all duration-100 ${!frog.onLilyPad ? 'animate-pulse' : ''}`}
              style={{
                left: frog.x,
                top: frog.y,
                width: frog.width,
                height: frog.height,
                transform: `rotate(${jumpDirection}deg)`,
              }}
            >
              <div className="w-full h-full flex items-center justify-center text-3xl">
                🐸
              </div>
            </div>

            {/* Jump Direction Indicator */}
            {isCharging && frog.onLilyPad && (
              <div
                className="absolute pointer-events-none"
                style={{
                  left: frog.x + frog.width / 2,
                  top: frog.y + frog.height / 2,
                }}
              >
                <div
                  className="w-16 h-1 bg-yellow-400 origin-left"
                  style={{
                    transform: `rotate(-${jumpDirection}deg) scaleX(${jumpPower / 100})`,
                  }}
                />
              </div>
            )}

            {/* Game Instructions */}
            {!gameStarted && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <div className="text-center text-white space-y-4 p-6 bg-black/50 rounded-lg">
                  <h3 className="text-xl font-bold">Theresa's Frogz</h3>
                  <div className="space-y-2 text-sm">
                    <p>🐸 Hold SPACE/UP to charge jump power</p>
                    <p>🏹 Use LEFT/RIGHT arrows to aim</p>
                    <p>🪷 Land on lily pads to score points</p>
                    <p>🪰 Catch flies for bonus points (+25)</p>
                    <p>💧 Don't fall in the water (-10 points)</p>
                    <p>⏱️ 60 seconds of froggy fun!</p>
                  </div>
                </div>
              </div>
            )}

            {/* Game Over Screen */}
            {gameCompleted && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                <div className="text-center text-white space-y-4 p-6 bg-black/70 rounded-lg">
                  <Trophy className="w-16 h-16 mx-auto text-gold" />
                  <h3 className="text-2xl font-bold">Hopping Complete!</h3>
                  <div className="space-y-2">
                    <p className="text-lg">
                      Final Score: <span className="text-gold font-bold">{score}</span>
                    </p>
                    <p className="text-lg">
                      Jumps: <span className="text-sweep font-bold">{jumps}</span>
                    </p>
                    <p className="text-lg">
                      Flies Caught: <span className="text-casino-green font-bold">{fliesCaught}</span>
                    </p>
                    <p className="text-lg">
                      SC Earned: <span className="text-casino-green font-bold">{Math.min(0.25, score * 0.01).toFixed(2)}</span>
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

            {/* CoinKrazy Branding */}
            <div className="absolute bottom-2 right-2 text-xs font-bold text-white opacity-70">
              CoinKrazy.com
            </div>
          </div>

          <div className="p-6 bg-card/50">
            {!gameStarted ? (
              <Button
                onClick={startGame}
                className="w-full bg-gradient-to-r from-gold to-yellow-400 text-gold-foreground hover:from-yellow-400 hover:to-gold text-lg py-6"
                size="lg"
              >
                <Play className="h-5 w-5 mr-2" />
                Start Frog Hopping
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
                <div className="flex justify-center space-x-2 mb-2">
                  <Button
                    onMouseDown={startCharging}
                    onMouseUp={jump}
                    onTouchStart={startCharging}
                    onTouchEnd={jump}
                    disabled={!frog.onLilyPad}
                    className="bg-casino-green hover:bg-casino-green/80"
                    size="sm"
                  >
                    <ArrowUp className="h-4 w-4 mr-2" />
                    Jump
                  </Button>
                </div>
                <p className="text-lg font-semibold">Hop across the pond!</p>
                <p className="text-sm text-muted-foreground">
                  Hold SPACE to charge, LEFT/RIGHT to aim, release to jump
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
