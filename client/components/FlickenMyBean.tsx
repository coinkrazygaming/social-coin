import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Timer, Trophy, Play, RotateCcw, Target } from "lucide-react";

interface FlickenMyBeanProps {
  userId: string;
  username: string;
  onGameComplete: (score: number, scEarned: number) => void;
}

interface Bean {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  moving: boolean;
  vx?: number;
  vy?: number;
}

interface Flick {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  power: number;
}

export function FlickenMyBean({ userId, username, onGameComplete }: FlickenMyBeanProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [beans, setBeans] = useState<Bean[]>([]);
  const [flicks, setFlicks] = useState<Flick[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [isFlicking, setIsFlicking] = useState(false);
  const [flickStart, setFlickStart] = useState<{x: number, y: number} | null>(null);
  const [currentFlick, setCurrentFlick] = useState<{x: number, y: number} | null>(null);

  const gameAreaRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<number>();

  const GAME_DURATION = 60;
  const MAX_BEANS = 20;

  const spawnBean = useCallback(() => {
    if (!gameAreaRef.current || beans.length >= MAX_BEANS) return;

    const rect = gameAreaRef.current.getBoundingClientRect();
    const colors = ['#8B4513', '#654321', '#A0522D', '#D2691E'];
    
    const newBean: Bean = {
      id: Date.now() + Math.random(),
      x: Math.random() * (rect.width - 40) + 20,
      y: Math.random() * (rect.height - 40) + 20,
      size: 15 + Math.random() * 25,
      color: colors[Math.floor(Math.random() * colors.length)],
      moving: false,
    };

    setBeans(prev => [...prev, newBean]);
  }, [beans.length]);

  const updateBeans = useCallback(() => {
    setBeans(prev => prev.map(bean => {
      if (!bean.moving || !bean.vx || !bean.vy) return bean;

      const newX = bean.x + bean.vx;
      const newY = bean.y + bean.vy;

      // Friction
      const friction = 0.98;
      let newVx = bean.vx * friction;
      let newVy = bean.vy * friction;

      // Bounce off walls
      if (newX <= bean.size/2 || newX >= (gameAreaRef.current?.clientWidth || 600) - bean.size/2) {
        newVx = -newVx * 0.8;
      }
      if (newY <= bean.size/2 || newY >= (gameAreaRef.current?.clientHeight || 400) - bean.size/2) {
        newVy = -newVy * 0.8;
      }

      // Stop if moving too slowly
      if (Math.abs(newVx) < 0.1 && Math.abs(newVy) < 0.1) {
        return {
          ...bean,
          x: Math.max(bean.size/2, Math.min((gameAreaRef.current?.clientWidth || 600) - bean.size/2, newX)),
          y: Math.max(bean.size/2, Math.min((gameAreaRef.current?.clientHeight || 400) - bean.size/2, newY)),
          moving: false,
          vx: 0,
          vy: 0,
        };
      }

      return {
        ...bean,
        x: Math.max(bean.size/2, Math.min((gameAreaRef.current?.clientWidth || 600) - bean.size/2, newX)),
        y: Math.max(bean.size/2, Math.min((gameAreaRef.current?.clientHeight || 400) - bean.size/2, newY)),
        vx: newVx,
        vy: newVy,
      };
    }));
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!gameAreaRef.current || !isPlaying) return;

    const rect = gameAreaRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsFlicking(true);
    setFlickStart({ x, y });
    setCurrentFlick({ x, y });
  }, [isPlaying]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isFlicking || !flickStart || !gameAreaRef.current) return;

    const rect = gameAreaRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCurrentFlick({ x, y });
  }, [isFlicking, flickStart]);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    if (!isFlicking || !flickStart || !gameAreaRef.current) return;

    const rect = gameAreaRef.current.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;

    const dx = endX - flickStart.x;
    const dy = endY - flickStart.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const power = Math.min(distance / 5, 20); // Max power of 20

    // Find beans near the flick start point
    setBeans(prev => prev.map(bean => {
      const beanDx = bean.x - flickStart.x;
      const beanDy = bean.y - flickStart.y;
      const beanDistance = Math.sqrt(beanDx * beanDx + beanDy * beanDy);

      if (beanDistance < bean.size + 20) { // Hit detection radius
        // Flick the bean
        const angle = Math.atan2(dy, dx);
        const vx = Math.cos(angle) * power;
        const vy = Math.sin(angle) * power;

        // Score based on power and accuracy
        setScore(s => s + Math.ceil(power / 5));

        return {
          ...bean,
          moving: true,
          vx,
          vy,
        };
      }

      return bean;
    }));

    // Add flick visual effect
    const newFlick: Flick = {
      id: Date.now(),
      startX: flickStart.x,
      startY: flickStart.y,
      endX,
      endY,
      power,
    };

    setFlicks(prev => [...prev, newFlick]);

    // Remove flick effect after animation
    setTimeout(() => {
      setFlicks(prev => prev.filter(f => f.id !== newFlick.id));
    }, 500);

    setIsFlicking(false);
    setFlickStart(null);
    setCurrentFlick(null);
  }, [isFlicking, flickStart]);

  const startGame = () => {
    setGameStarted(true);
    setIsPlaying(true);
    setTimeLeft(GAME_DURATION);
    setScore(0);
    setBeans([]);
    setFlicks([]);
    setGameCompleted(false);

    // Spawn initial beans
    for (let i = 0; i < 8; i++) {
      setTimeout(() => spawnBean(), i * 200);
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Spawn new beans periodically
    const spawnInterval = setInterval(() => {
      if (beans.length < MAX_BEANS) {
        spawnBean();
      }
    }, 3000);

    return () => clearInterval(spawnInterval);
  };

  const endGame = useCallback(() => {
    setIsPlaying(false);
    setGameCompleted(true);

    if (timerRef.current) clearInterval(timerRef.current);
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
    setBeans([]);
    setFlicks([]);
    setIsFlicking(false);
    setFlickStart(null);
    setCurrentFlick(null);

    if (timerRef.current) clearInterval(timerRef.current);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  };

  useEffect(() => {
    const animate = () => {
      if (isPlaying) {
        updateBeans();
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
  }, [isPlaying, updateBeans]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="overflow-hidden">
        <CardHeader className="text-center bg-gradient-to-r from-gold/20 to-sweep/20">
          <div className="flex items-center justify-center mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-gold to-yellow-400 rounded-full flex items-center justify-center mr-3">
              🫘
            </div>
            <div>
              <CardTitle className="text-2xl">Flicken' My Bean</CardTitle>
              <CardDescription>Flick beans around to score points!</CardDescription>
            </div>
          </div>

          <div className="flex justify-center space-x-6 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-casino-green">{score}</div>
              <div className="text-sm text-muted-foreground">Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gold">{(score * 0.01).toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">SC Earned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-sweep">{beans.length}</div>
              <div className="text-sm text-muted-foreground">Beans</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{timeLeft}s</div>
              <div className="text-sm text-muted-foreground">Time Left</div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <Progress value={(timeLeft / GAME_DURATION) * 100} className="h-2" />
            <div className="text-xs text-muted-foreground">
              Click and drag to flick beans • Bigger flicks = more points
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div
            ref={gameAreaRef}
            className="relative w-full h-96 bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-100 overflow-hidden cursor-crosshair select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 80%, rgba(245, 158, 11, 0.2) 1px, transparent 1px),
                radial-gradient(circle at 80% 20%, rgba(245, 158, 11, 0.2) 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
            }}
          >
            {/* Beans */}
            {beans.map(bean => (
              <div
                key={bean.id}
                className="absolute rounded-full border-2 border-amber-800 transition-all duration-100"
                style={{
                  left: bean.x - bean.size / 2,
                  top: bean.y - bean.size / 2,
                  width: bean.size,
                  height: bean.size,
                  backgroundColor: bean.color,
                  boxShadow: bean.moving 
                    ? '0 0 10px rgba(245, 158, 11, 0.8)' 
                    : '0 2px 4px rgba(0,0,0,0.3)',
                }}
              >
                <div className="w-full h-full rounded-full flex items-center justify-center text-xs font-bold text-white">
                  🫘
                </div>
              </div>
            ))}

            {/* Flick Trail */}
            {isFlicking && flickStart && currentFlick && (
              <svg className="absolute inset-0 pointer-events-none">
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                    refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#f59e0b" />
                  </marker>
                </defs>
                <line
                  x1={flickStart.x}
                  y1={flickStart.y}
                  x2={currentFlick.x}
                  y2={currentFlick.y}
                  stroke="#f59e0b"
                  strokeWidth="3"
                  markerEnd="url(#arrowhead)"
                  strokeDasharray="5,5"
                />
              </svg>
            )}

            {/* Flick Effects */}
            {flicks.map(flick => (
              <svg key={flick.id} className="absolute inset-0 pointer-events-none">
                <line
                  x1={flick.startX}
                  y1={flick.startY}
                  x2={flick.endX}
                  y2={flick.endY}
                  stroke="#f59e0b"
                  strokeWidth={Math.max(2, flick.power / 5)}
                  opacity="0.8"
                  className="animate-pulse"
                />
              </svg>
            ))}

            {/* Game Instructions */}
            {!gameStarted && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <div className="text-center text-white space-y-4 p-6 bg-black/50 rounded-lg">
                  <h3 className="text-xl font-bold">Flicken' My Bean</h3>
                  <div className="space-y-2 text-sm">
                    <p>🫘 Click and drag to flick beans around</p>
                    <p>💪 Bigger flicks = more points and movement</p>
                    <p>🎯 Aim for combo moves and trick shots</p>
                    <p>💰 Points convert to SC (0.01 SC per point)</p>
                    <p>⏱️ 60 seconds of bean-flicking fun!</p>
                  </div>
                </div>
              </div>
            )}

            {/* Game Over Screen */}
            {gameCompleted && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                <div className="text-center text-white space-y-4 p-6 bg-black/70 rounded-lg">
                  <Trophy className="w-16 h-16 mx-auto text-gold" />
                  <h3 className="text-2xl font-bold">Bean Flicking Complete!</h3>
                  <div className="space-y-2">
                    <p className="text-lg">
                      Final Score: <span className="text-gold font-bold">{score}</span>
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
            <div className="absolute bottom-2 right-2 text-xs font-bold text-gold opacity-70">
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
                Start Bean Flicking
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
                <p className="text-lg font-semibold">Click and drag to flick beans!</p>
                <p className="text-sm text-muted-foreground">
                  The longer your drag, the more powerful the flick
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
