import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Timer, Target, Trophy, Play, RotateCcw } from "lucide-react";

interface JoseysQuackAttackProps {
  userId: string;
  username: string;
  onGameComplete: (score: number, scEarned: number) => void;
}

interface Duck {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  alive: boolean;
  size: number;
}

interface Shot {
  id: number;
  x: number;
  y: number;
  hit: boolean;
}

export function JoseysQuackAttack({ userId, username, onGameComplete }: JoseysQuackAttackProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [shots, setShots] = useState(0);
  const [hits, setHits] = useState(0);
  const [ducks, setDucks] = useState<Duck[]>([]);
  const [shotMarkers, setShotMarkers] = useState<Shot[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [crosshairPosition, setCrosshairPosition] = useState({ x: 400, y: 300 });

  const gameAreaRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const duckSpawnRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<number>();

  const GAME_DURATION = 60;
  const MAX_DUCKS = 25;
  const DUCK_SPAWN_INTERVAL = 2000;

  const spawnDuck = useCallback(() => {
    if (!gameAreaRef.current || ducks.length >= MAX_DUCKS) return;

    const rect = gameAreaRef.current.getBoundingClientRect();
    const edge = Math.floor(Math.random() * 4);
    let x, y, vx, vy;

    switch (edge) {
      case 0: // Top
        x = Math.random() * rect.width;
        y = -50;
        vx = (Math.random() - 0.5) * 4;
        vy = Math.random() * 3 + 1;
        break;
      case 1: // Right
        x = rect.width + 50;
        y = Math.random() * rect.height;
        vx = -(Math.random() * 3 + 1);
        vy = (Math.random() - 0.5) * 4;
        break;
      case 2: // Bottom
        x = Math.random() * rect.width;
        y = rect.height + 50;
        vx = (Math.random() - 0.5) * 4;
        vy = -(Math.random() * 3 + 1);
        break;
      default: // Left
        x = -50;
        y = Math.random() * rect.height;
        vx = Math.random() * 3 + 1;
        vy = (Math.random() - 0.5) * 4;
    }

    const newDuck: Duck = {
      id: Date.now() + Math.random(),
      x,
      y,
      vx,
      vy,
      alive: true,
      size: 30 + Math.random() * 20,
    };

    setDucks(prev => [...prev, newDuck]);
  }, [ducks.length]);

  const updateDucks = useCallback(() => {
    if (!gameAreaRef.current) return;

    const rect = gameAreaRef.current.getBoundingClientRect();
    
    setDucks(prev => prev.map(duck => {
      if (!duck.alive) return duck;

      let newX = duck.x + duck.vx;
      let newY = duck.y + duck.vy;

      // Remove ducks that fly off screen
      if (newX < -100 || newX > rect.width + 100 || newY < -100 || newY > rect.height + 100) {
        return { ...duck, alive: false };
      }

      return { ...duck, x: newX, y: newY };
    }).filter(duck => duck.alive));
  }, []);

  const shootDuck = useCallback((x: number, y: number) => {
    if (!isPlaying) return;

    setShots(prev => prev + 1);
    
    const shotMarker: Shot = {
      id: Date.now(),
      x,
      y,
      hit: false,
    };

    let hit = false;
    setDucks(prev => prev.map(duck => {
      if (!duck.alive) return duck;
      
      const distance = Math.sqrt((duck.x - x) ** 2 + (duck.y - y) ** 2);
      if (distance < duck.size / 2) {
        hit = true;
        setScore(s => s + 1);
        setHits(h => h + 1);
        return { ...duck, alive: false };
      }
      return duck;
    }));

    shotMarker.hit = hit;
    setShotMarkers(prev => [...prev, shotMarker]);

    // Remove shot markers after animation
    setTimeout(() => {
      setShotMarkers(prev => prev.filter(s => s.id !== shotMarker.id));
    }, 1000);
  }, [isPlaying]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (!gameAreaRef.current) return;
    
    const rect = gameAreaRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setCrosshairPosition({ x, y });
    shootDuck(x, y);
  }, [shootDuck]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!gameAreaRef.current) return;
    
    const rect = gameAreaRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setCrosshairPosition({ x, y });
  }, []);

  const startGame = () => {
    setGameStarted(true);
    setIsPlaying(true);
    setTimeLeft(GAME_DURATION);
    setScore(0);
    setShots(0);
    setHits(0);
    setDucks([]);
    setShotMarkers([]);
    setGameCompleted(false);

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    duckSpawnRef.current = setInterval(spawnDuck, DUCK_SPAWN_INTERVAL);
  };

  const endGame = useCallback(() => {
    setIsPlaying(false);
    setGameCompleted(true);

    if (timerRef.current) clearInterval(timerRef.current);
    if (duckSpawnRef.current) clearInterval(duckSpawnRef.current);
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
    setShots(0);
    setHits(0);
    setDucks([]);
    setShotMarkers([]);

    if (timerRef.current) clearInterval(timerRef.current);
    if (duckSpawnRef.current) clearInterval(duckSpawnRef.current);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  };

  useEffect(() => {
    const animate = () => {
      if (isPlaying) {
        updateDucks();
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
  }, [isPlaying, updateDucks]);

  const accuracy = shots > 0 ? Math.round((hits / shots) * 100) : 0;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="overflow-hidden">
        <CardHeader className="text-center bg-gradient-to-r from-gold/20 to-sweep/20">
          <div className="flex items-center justify-center mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-gold to-yellow-400 rounded-full flex items-center justify-center mr-3">
              🦆
            </div>
            <div>
              <CardTitle className="text-2xl">Josey's Quack Attack</CardTitle>
              <CardDescription>Hunt ducks to earn Sweeps Coins!</CardDescription>
            </div>
          </div>

          <div className="flex justify-center space-x-6 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-casino-green">{score}</div>
              <div className="text-sm text-muted-foreground">Ducks Hit</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-casino-red">{shots}</div>
              <div className="text-sm text-muted-foreground">Shots Fired</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gold">{accuracy}%</div>
              <div className="text-sm text-muted-foreground">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{timeLeft}s</div>
              <div className="text-sm text-muted-foreground">Time Left</div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <Progress value={(timeLeft / GAME_DURATION) * 100} className="h-2" />
            <div className="text-xs text-muted-foreground">
              Ducks Spawned: {ducks.filter(d => d.alive).length}/{MAX_DUCKS}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div
            ref={gameAreaRef}
            className="relative w-full h-96 bg-gradient-to-b from-sky-300 via-sky-200 to-green-300 overflow-hidden cursor-crosshair"
            onClick={handleClick}
            onMouseMove={handleMouseMove}
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.3) 1px, transparent 1px),
                radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: "100px 100px",
            }}
          >
            {/* Flying Ducks */}
            {ducks.map(duck => duck.alive && (
              <div
                key={duck.id}
                className="absolute transition-all duration-100"
                style={{
                  left: duck.x - duck.size / 2,
                  top: duck.y - duck.size / 2,
                  width: duck.size,
                  height: duck.size,
                }}
              >
                <div className="text-4xl animate-bounce" style={{ 
                  transform: `rotate(${Math.atan2(duck.vy, duck.vx)}rad)`,
                  filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
                }}>
                  🦆
                </div>
              </div>
            ))}

            {/* Shot Markers */}
            {shotMarkers.map(shot => (
              <div
                key={shot.id}
                className={`absolute w-4 h-4 rounded-full ${shot.hit ? 'bg-casino-green' : 'bg-casino-red'} animate-ping`}
                style={{
                  left: shot.x - 8,
                  top: shot.y - 8,
                }}
              />
            ))}

            {/* Crosshair */}
            {isPlaying && (
              <div
                className="absolute pointer-events-none"
                style={{
                  left: crosshairPosition.x - 20,
                  top: crosshairPosition.y - 20,
                  width: 40,
                  height: 40,
                }}
              >
                <div className="relative w-full h-full">
                  <div className="absolute top-0 left-1/2 w-0.5 h-4 bg-red-500 transform -translate-x-0.5"></div>
                  <div className="absolute bottom-0 left-1/2 w-0.5 h-4 bg-red-500 transform -translate-x-0.5"></div>
                  <div className="absolute left-0 top-1/2 w-4 h-0.5 bg-red-500 transform -translate-y-0.5"></div>
                  <div className="absolute right-0 top-1/2 w-4 h-0.5 bg-red-500 transform -translate-y-0.5"></div>
                  <div className="absolute top-1/2 left-1/2 w-2 h-2 border border-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2">
                    <div className="absolute inset-1 bg-red-500 rounded-full opacity-50"></div>
                  </div>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 text-xs font-bold text-white bg-black/50 px-2 py-1 rounded">
                    CoinKrazy.com
                  </div>
                </div>
              </div>
            )}

            {/* Game Instructions */}
            {!gameStarted && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <div className="text-center text-white space-y-4 p-6 bg-black/50 rounded-lg">
                  <h3 className="text-xl font-bold">Josey's Quack Attack</h3>
                  <div className="space-y-2 text-sm">
                    <p>🦆 Click to shoot flying ducks</p>
                    <p>🎯 Each duck hit earns 0.01 SC</p>
                    <p>⏱️ You have 60 seconds to hunt</p>
                    <p>🎯 Better accuracy = better rewards!</p>
                    <p>💰 Max reward: 0.25 SC</p>
                  </div>
                </div>
              </div>
            )}

            {/* Game Over Screen */}
            {gameCompleted && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                <div className="text-center text-white space-y-4 p-6 bg-black/70 rounded-lg">
                  <Trophy className="w-16 h-16 mx-auto text-gold" />
                  <h3 className="text-2xl font-bold">Hunt Complete!</h3>
                  <div className="space-y-2">
                    <p className="text-lg">
                      Ducks Hit: <span className="text-gold font-bold">{score}</span>
                    </p>
                    <p className="text-lg">
                      Accuracy: <span className="text-sweep font-bold">{accuracy}%</span>
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
          </div>

          <div className="p-6 bg-card/50">
            {!gameStarted ? (
              <Button
                onClick={startGame}
                className="w-full bg-gradient-to-r from-gold to-yellow-400 text-gold-foreground hover:from-yellow-400 hover:to-gold text-lg py-6"
                size="lg"
              >
                <Play className="h-5 w-5 mr-2" />
                Start Duck Hunt
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
                <p className="text-lg font-semibold">Click to shoot the ducks!</p>
                <p className="text-sm text-muted-foreground">
                  Tip: Lead your shots - ducks are moving targets!
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
