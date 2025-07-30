import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Timer, Trophy, Play, RotateCcw, Zap } from "lucide-react";

interface DeeDeeFunRunProps {
  userId: string;
  username: string;
  onGameComplete: (score: number, scEarned: number) => void;
}

interface Player {
  x: number;
  y: number;
  vx: number;
  vy: number;
  onGround: boolean;
  width: number;
  height: number;
}

interface Obstacle {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'block' | 'spike' | 'gap';
}

interface Coin {
  id: number;
  x: number;
  y: number;
  collected: boolean;
}

export function DeeDeeFunRun({ userId, username, onGameComplete }: DeeDeeFunRunProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [distance, setDistance] = useState(0);
  const [coins, setCoins] = useState(0);
  const [player, setPlayer] = useState<Player>({
    x: 100,
    y: 300,
    vx: 0,
    vy: 0,
    onGround: true,
    width: 30,
    height: 40,
  });
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [gameCoins, setGameCoins] = useState<Coin[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(3);
  const [isJumping, setIsJumping] = useState(false);
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());

  const gameAreaRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<number>();
  const obstacleIdCounter = useRef(0);
  const coinIdCounter = useRef(0);

  const GAME_DURATION = 60;
  const GROUND_Y = 340;
  const GRAVITY = 0.8;
  const JUMP_POWER = -15;

  const spawnObstacle = useCallback(() => {
    if (!gameAreaRef.current) return;

    const rect = gameAreaRef.current.getBoundingClientRect();
    const types: ('block' | 'spike' | 'gap')[] = ['block', 'spike', 'gap'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    let obstacle: Obstacle;
    
    switch (type) {
      case 'block':
        obstacle = {
          id: obstacleIdCounter.current++,
          x: rect.width + 50,
          y: GROUND_Y - 40,
          width: 40,
          height: 40,
          type: 'block',
        };
        break;
      case 'spike':
        obstacle = {
          id: obstacleIdCounter.current++,
          x: rect.width + 50,
          y: GROUND_Y - 30,
          width: 30,
          height: 30,
          type: 'spike',
        };
        break;
      case 'gap':
        obstacle = {
          id: obstacleIdCounter.current++,
          x: rect.width + 50,
          y: GROUND_Y,
          width: 80,
          height: 60,
          type: 'gap',
        };
        break;
    }

    setObstacles(prev => [...prev, obstacle]);
  }, []);

  const spawnCoin = useCallback(() => {
    if (!gameAreaRef.current) return;

    const rect = gameAreaRef.current.getBoundingClientRect();
    const coin: Coin = {
      id: coinIdCounter.current++,
      x: rect.width + 50,
      y: GROUND_Y - 60 - Math.random() * 100,
      collected: false,
    };

    setGameCoins(prev => [...prev, coin]);
  }, []);

  const jump = useCallback(() => {
    if (player.onGround && isPlaying) {
      setPlayer(prev => ({
        ...prev,
        vy: JUMP_POWER,
        onGround: false,
      }));
      setIsJumping(true);
      setTimeout(() => setIsJumping(false), 200);
    }
  }, [player.onGround, isPlaying]);

  const updatePlayer = useCallback(() => {
    setPlayer(prev => {
      let newY = prev.y + prev.vy;
      let newVy = prev.vy + GRAVITY;
      let onGround = false;

      // Ground collision
      if (newY >= GROUND_Y - prev.height) {
        newY = GROUND_Y - prev.height;
        newVy = 0;
        onGround = true;
      }

      return {
        ...prev,
        y: newY,
        vy: newVy,
        onGround,
      };
    });
  }, []);

  const updateObstacles = useCallback(() => {
    setObstacles(prev => prev.map(obstacle => ({
      ...obstacle,
      x: obstacle.x - gameSpeed,
    })).filter(obstacle => obstacle.x > -100));
  }, [gameSpeed]);

  const updateCoins = useCallback(() => {
    setGameCoins(prev => prev.map(coin => ({
      ...coin,
      x: coin.x - gameSpeed,
    })).filter(coin => coin.x > -50 && !coin.collected));
  }, [gameSpeed]);

  const checkCollisions = useCallback(() => {
    // Check obstacle collisions
    obstacles.forEach(obstacle => {
      if (obstacle.x < player.x + player.width &&
          obstacle.x + obstacle.width > player.x &&
          obstacle.y < player.y + player.height &&
          obstacle.y + obstacle.height > player.y) {
        
        if (obstacle.type === 'gap' && player.y + player.height >= GROUND_Y) {
          // Fell into gap
          endGame();
        } else if (obstacle.type !== 'gap') {
          // Hit obstacle
          endGame();
        }
      }
    });

    // Check coin collisions
    setGameCoins(prev => prev.map(coin => {
      if (!coin.collected &&
          coin.x < player.x + player.width &&
          coin.x + 20 > player.x &&
          coin.y < player.y + player.height &&
          coin.y + 20 > player.y) {
        
        setCoins(c => c + 1);
        setScore(s => s + 10);
        return { ...coin, collected: true };
      }
      return coin;
    }));
  }, [obstacles, gameCoins, player]);

  const endGame = useCallback(() => {
    setIsPlaying(false);
    setGameCompleted(true);

    if (timerRef.current) clearInterval(timerRef.current);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);

    // Score calculation: distance + coins
    const finalScore = Math.floor(distance / 10) + coins * 10;
    const scEarned = Math.min(0.25, finalScore * 0.001);
    
    setScore(finalScore);
    onGameComplete(finalScore, scEarned);
  }, [distance, coins, onGameComplete]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeysPressed(prev => new Set([...prev, e.key]));
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        jump();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeysPressed(prev => {
        const newSet = new Set(prev);
        newSet.delete(e.key);
        return newSet;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [jump]);

  const startGame = () => {
    setGameStarted(true);
    setIsPlaying(true);
    setTimeLeft(GAME_DURATION);
    setScore(0);
    setDistance(0);
    setCoins(0);
    setObstacles([]);
    setGameCoins([]);
    setGameCompleted(false);
    setGameSpeed(3);
    setPlayer({
      x: 100,
      y: GROUND_Y - 40,
      vx: 0,
      vy: 0,
      onGround: true,
      width: 30,
      height: 40,
    });

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Spawn obstacles and coins
    const obstacleInterval = setInterval(() => {
      if (Math.random() < 0.7) spawnObstacle();
    }, 2000);

    const coinInterval = setInterval(() => {
      if (Math.random() < 0.8) spawnCoin();
    }, 1500);

    // Increase speed over time
    const speedInterval = setInterval(() => {
      setGameSpeed(prev => Math.min(prev + 0.1, 8));
    }, 5000);

    return () => {
      clearInterval(obstacleInterval);
      clearInterval(coinInterval);
      clearInterval(speedInterval);
    };
  };

  const resetGame = () => {
    setGameStarted(false);
    setIsPlaying(false);
    setGameCompleted(false);
    setTimeLeft(GAME_DURATION);
    setScore(0);
    setDistance(0);
    setCoins(0);
    setObstacles([]);
    setGameCoins([]);
    setGameSpeed(3);
    setKeysPressed(new Set());

    if (timerRef.current) clearInterval(timerRef.current);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  };

  useEffect(() => {
    const animate = () => {
      if (isPlaying) {
        updatePlayer();
        updateObstacles();
        updateCoins();
        checkCollisions();
        setDistance(prev => prev + gameSpeed);
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
  }, [isPlaying, updatePlayer, updateObstacles, updateCoins, checkCollisions, gameSpeed]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="overflow-hidden">
        <CardHeader className="text-center bg-gradient-to-r from-gold/20 to-sweep/20">
          <div className="flex items-center justify-center mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-gold to-yellow-400 rounded-full flex items-center justify-center mr-3">
              🏃‍♀️
            </div>
            <div>
              <CardTitle className="text-2xl">DeeDee's Fun Run</CardTitle>
              <CardDescription>Endless runner - jump and collect coins!</CardDescription>
            </div>
          </div>

          <div className="flex justify-center space-x-6 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-casino-green">{Math.floor(distance / 10)}</div>
              <div className="text-sm text-muted-foreground">Distance</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gold">{coins}</div>
              <div className="text-sm text-muted-foreground">Coins</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-sweep">{score}</div>
              <div className="text-sm text-muted-foreground">Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{timeLeft}s</div>
              <div className="text-sm text-muted-foreground">Time Left</div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <Progress value={(timeLeft / GAME_DURATION) * 100} className="h-2" />
            <div className="text-xs text-muted-foreground">
              Speed: {gameSpeed.toFixed(1)}x • Distance + Coins = SC
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div
            ref={gameAreaRef}
            className="relative w-full h-96 bg-gradient-to-b from-sky-400 via-sky-300 to-green-400 overflow-hidden"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
              animation: isPlaying ? 'scrollBackground 1s linear infinite' : 'none',
            }}
          >
            {/* Ground */}
            <div 
              className="absolute w-full bg-green-600 border-t-4 border-green-700"
              style={{ 
                bottom: 0, 
                height: 60,
              }}
            />

            {/* Player */}
            <div
              className={`absolute transition-all duration-100 ${isJumping ? 'animate-pulse' : ''}`}
              style={{
                left: player.x,
                top: player.y,
                width: player.width,
                height: player.height,
              }}
            >
              <div className="w-full h-full flex items-center justify-center text-2xl">
                🏃‍♀️
              </div>
            </div>

            {/* Obstacles */}
            {obstacles.map(obstacle => (
              <div
                key={obstacle.id}
                className={`absolute ${
                  obstacle.type === 'block' ? 'bg-red-600 border-2 border-red-800' :
                  obstacle.type === 'spike' ? 'bg-gray-600 border-2 border-gray-800' :
                  'bg-black'
                }`}
                style={{
                  left: obstacle.x,
                  top: obstacle.y,
                  width: obstacle.width,
                  height: obstacle.height,
                }}
              >
                {obstacle.type === 'block' && (
                  <div className="w-full h-full flex items-center justify-center text-white font-bold">
                    ⬛
                  </div>
                )}
                {obstacle.type === 'spike' && (
                  <div className="w-full h-full flex items-center justify-center text-white">
                    ⚠️
                  </div>
                )}
              </div>
            ))}

            {/* Coins */}
            {gameCoins.map(coin => !coin.collected && (
              <div
                key={coin.id}
                className="absolute w-5 h-5 text-2xl animate-spin"
                style={{
                  left: coin.x,
                  top: coin.y,
                }}
              >
                🪙
              </div>
            ))}

            {/* Game Instructions */}
            {!gameStarted && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <div className="text-center text-white space-y-4 p-6 bg-black/50 rounded-lg">
                  <h3 className="text-xl font-bold">DeeDee's Fun Run</h3>
                  <div className="space-y-2 text-sm">
                    <p>🏃‍♀️ Endless runner challenge!</p>
                    <p>⬆️ Press SPACE or UP arrow to jump</p>
                    <p>🪙 Collect coins for bonus points</p>
                    <p>🚫 Avoid obstacles and gaps</p>
                    <p>⚡ Speed increases over time</p>
                    <p>💰 Distance + coins = SC earned</p>
                  </div>
                </div>
              </div>
            )}

            {/* Game Over Screen */}
            {gameCompleted && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                <div className="text-center text-white space-y-4 p-6 bg-black/70 rounded-lg">
                  <Trophy className="w-16 h-16 mx-auto text-gold" />
                  <h3 className="text-2xl font-bold">Run Complete!</h3>
                  <div className="space-y-2">
                    <p className="text-lg">
                      Distance: <span className="text-gold font-bold">{Math.floor(distance / 10)}</span>
                    </p>
                    <p className="text-lg">
                      Coins: <span className="text-gold font-bold">{coins}</span>
                    </p>
                    <p className="text-lg">
                      Final Score: <span className="text-sweep font-bold">{score}</span>
                    </p>
                    <p className="text-lg">
                      SC Earned: <span className="text-casino-green font-bold">{Math.min(0.25, score * 0.001).toFixed(3)}</span>
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
            <div className="absolute top-2 right-2 text-xs font-bold text-white opacity-70">
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
                Start Fun Run
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
                <p className="text-lg font-semibold">Keep running!</p>
                <p className="text-sm text-muted-foreground">
                  Press SPACE or UP arrow to jump over obstacles
                </p>
                <Button
                  onClick={jump}
                  className="mt-2 bg-casino-green hover:bg-casino-green/80"
                  size="sm"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Jump
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <style jsx>{`
        @keyframes scrollBackground {
          from { background-position-x: 0; }
          to { background-position-x: 50px; }
        }
      `}</style>
    </div>
  );
}
