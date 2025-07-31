import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Timer, Target, Trophy, Play, RotateCcw } from "lucide-react";

interface DeeDeeFunRunProps {
  userId: string;
  username: string;
  onGameComplete: (score: number, scEarned: number) => void;
}

interface Player {
  x: number;
  y: number;
  velocityY: number;
  isJumping: boolean;
  isOnGround: boolean;
}

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'cactus' | 'rock' | 'pit';
}

interface Coin {
  x: number;
  y: number;
  collected: boolean;
}

export function DeeDeeFunRun({ userId, username, onGameComplete }: DeeDeeFunRunProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [distance, setDistance] = useState(0);
  const [coinsCollected, setCoinsCollected] = useState(0);
  const [player, setPlayer] = useState<Player>({ x: 100, y: 400, velocityY: 0, isJumping: false, isOnGround: true });
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(5);
  const [isGameOver, setIsGameOver] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const gameTimerRef = useRef<NodeJS.Timeout>();
  const keysRef = useRef<Set<string>>(new Set());

  // Game dimensions
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 400;
  const GROUND_Y = 350;
  const PLAYER_WIDTH = 40;
  const PLAYER_HEIGHT = 60;
  const GRAVITY = 0.8;
  const JUMP_FORCE = -15;

  const startGame = useCallback(() => {
    setIsPlaying(true);
    setGameStarted(true);
    setGameEnded(false);
    setTimeLeft(60);
    setScore(0);
    setDistance(0);
    setCoinsCollected(0);
    setGameSpeed(5);
    setIsGameOver(false);
    setPlayer({ x: 100, y: GROUND_Y - PLAYER_HEIGHT, velocityY: 0, isJumping: false, isOnGround: true });
    setObstacles([]);
    setCoins([]);

    gameTimerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const endGame = useCallback(() => {
    setIsPlaying(false);
    setGameEnded(true);
    
    if (gameTimerRef.current) {
      clearInterval(gameTimerRef.current);
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    // Calculate SC earned based on score
    let scEarned = 0;
    if (score >= 2500) scEarned = 0.25;
    else if (score >= 2000) scEarned = 0.20;
    else if (score >= 1500) scEarned = 0.15;
    else if (score >= 1000) scEarned = 0.10;
    else if (score >= 500) scEarned = 0.05;

    setTimeout(() => {
      onGameComplete(score, scEarned);
    }, 2000);
  }, [score, onGameComplete]);

  const generateObstacle = useCallback((x: number): Obstacle => {
    const types: ('cactus' | 'rock' | 'pit')[] = ['cactus', 'rock', 'pit'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    let width, height, y;
    
    switch (type) {
      case 'cactus':
        width = 30;
        height = 60;
        y = GROUND_Y - height;
        break;
      case 'rock':
        width = 50;
        height = 40;
        y = GROUND_Y - height;
        break;
      case 'pit':
        width = 80;
        height = 30;
        y = GROUND_Y;
        break;
    }
    
    return { x, y, width, height, type };
  }, []);

  const generateCoin = useCallback((x: number): Coin => {
    const y = GROUND_Y - 80 - Math.random() * 100;
    return { x, y, collected: false };
  }, []);

  const updateGame = useCallback(() => {
    if (!isPlaying || isGameOver) return;

    // Update distance and speed
    setDistance(prev => prev + gameSpeed);
    setGameSpeed(prev => Math.min(prev + 0.002, 12)); // Gradually increase speed

    // Update player physics
    setPlayer(prev => {
      let newY = prev.y + prev.velocityY;
      let newVelocityY = prev.velocityY + GRAVITY;
      let newIsOnGround = false;
      let newIsJumping = prev.isJumping;

      // Ground collision
      if (newY >= GROUND_Y - PLAYER_HEIGHT) {
        newY = GROUND_Y - PLAYER_HEIGHT;
        newVelocityY = 0;
        newIsOnGround = true;
        newIsJumping = false;
      }

      // Jump input
      if (keysRef.current.has(' ') || keysRef.current.has('ArrowUp')) {
        if (newIsOnGround && !newIsJumping) {
          newVelocityY = JUMP_FORCE;
          newIsJumping = true;
          newIsOnGround = false;
        }
      }

      return {
        ...prev,
        y: newY,
        velocityY: newVelocityY,
        isOnGround: newIsOnGround,
        isJumping: newIsJumping,
      };
    });

    // Generate obstacles and coins
    setObstacles(prev => {
      let newObstacles = [...prev];
      
      // Remove off-screen obstacles
      newObstacles = newObstacles.filter(obstacle => obstacle.x > -100);
      
      // Add new obstacles
      const lastObstacle = newObstacles[newObstacles.length - 1];
      const lastX = lastObstacle ? lastObstacle.x : 0;
      
      if (lastX < CANVAS_WIDTH + 200) {
        const newX = Math.max(CANVAS_WIDTH, lastX + 200 + Math.random() * 300);
        newObstacles.push(generateObstacle(newX));
      }
      
      // Move obstacles
      return newObstacles.map(obstacle => ({
        ...obstacle,
        x: obstacle.x - gameSpeed,
      }));
    });

    setCoins(prev => {
      let newCoins = [...prev];
      
      // Remove off-screen coins
      newCoins = newCoins.filter(coin => coin.x > -50);
      
      // Add new coins
      const lastCoin = newCoins[newCoins.length - 1];
      const lastX = lastCoin ? lastCoin.x : 0;
      
      if (lastX < CANVAS_WIDTH + 100 && Math.random() < 0.3) {
        const newX = Math.max(CANVAS_WIDTH, lastX + 150 + Math.random() * 200);
        newCoins.push(generateCoin(newX));
      }
      
      // Move coins
      return newCoins.map(coin => ({
        ...coin,
        x: coin.x - gameSpeed,
      }));
    });
  }, [isPlaying, isGameOver, gameSpeed, generateObstacle, generateCoin]);

  const checkCollisions = useCallback(() => {
    // Check obstacle collisions
    obstacles.forEach(obstacle => {
      if (
        player.x < obstacle.x + obstacle.width &&
        player.x + PLAYER_WIDTH > obstacle.x &&
        player.y < obstacle.y + obstacle.height &&
        player.y + PLAYER_HEIGHT > obstacle.y
      ) {
        setIsGameOver(true);
        setTimeout(endGame, 1000);
      }
    });

    // Check coin collisions
    setCoins(prevCoins =>
      prevCoins.map(coin => {
        if (
          !coin.collected &&
          player.x < coin.x + 20 &&
          player.x + PLAYER_WIDTH > coin.x &&
          player.y < coin.y + 20 &&
          player.y + PLAYER_HEIGHT > coin.y
        ) {
          setCoinsCollected(prev => prev + 1);
          setScore(prev => prev + 50);
          return { ...coin, collected: true };
        }
        return coin;
      })
    );

    // Distance points
    setScore(prev => prev + Math.floor(gameSpeed / 2));
  }, [player, obstacles, endGame]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with sky gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#E0F6FF');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (let i = 0; i < 5; i++) {
      const cloudX = (i * 200 + distance * 0.2) % (CANVAS_WIDTH + 100) - 50;
      const cloudY = 50 + i * 20;
      
      ctx.beginPath();
      ctx.arc(cloudX, cloudY, 20, 0, Math.PI * 2);
      ctx.arc(cloudX + 20, cloudY, 25, 0, Math.PI * 2);
      ctx.arc(cloudX + 40, cloudY, 20, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw ground
    ctx.fillStyle = '#8B7355';
    ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_Y);
    
    // Ground texture
    ctx.fillStyle = '#A0895A';
    for (let x = 0; x < CANVAS_WIDTH; x += 20) {
      ctx.fillRect(x, GROUND_Y, 10, 2);
    }

    // Draw obstacles
    obstacles.forEach(obstacle => {
      switch (obstacle.type) {
        case 'cactus':
          ctx.fillStyle = '#228B22';
          ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
          
          // Cactus spikes
          ctx.fillStyle = '#32CD32';
          for (let i = 0; i < 5; i++) {
            const spikeY = obstacle.y + i * 12;
            ctx.fillRect(obstacle.x - 5, spikeY, 10, 3);
            ctx.fillRect(obstacle.x + obstacle.width - 5, spikeY, 10, 3);
          }
          break;
          
        case 'rock':
          ctx.fillStyle = '#696969';
          ctx.beginPath();
          ctx.ellipse(
            obstacle.x + obstacle.width / 2,
            obstacle.y + obstacle.height / 2,
            obstacle.width / 2,
            obstacle.height / 2,
            0, 0, Math.PI * 2
          );
          ctx.fill();
          break;
          
        case 'pit':
          ctx.fillStyle = '#000000';
          ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
          
          // Pit edges
          ctx.strokeStyle = '#654321';
          ctx.lineWidth = 3;
          ctx.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
          break;
      }
    });

    // Draw coins
    coins.forEach(coin => {
      if (!coin.collected) {
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(coin.x + 10, coin.y + 10, 10, 0, Math.PI * 2);
        ctx.fill();
        
        // Coin shine
        ctx.fillStyle = '#FFFF00';
        ctx.beginPath();
        ctx.arc(coin.x + 7, coin.y + 7, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // $ symbol
        ctx.fillStyle = '#DAA520';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('$', coin.x + 10, coin.y + 15);
      }
    });

    // Draw player (DeeDee)
    ctx.fillStyle = isGameOver ? '#FF0000' : '#FF69B4';
    
    // Body
    ctx.fillRect(player.x + 10, player.y + 20, 20, 30);
    
    // Head
    ctx.beginPath();
    ctx.arc(player.x + 20, player.y + 15, 15, 0, Math.PI * 2);
    ctx.fill();
    
    // Hair
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(player.x + 8, player.y, 24, 10);
    
    // Eyes
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(player.x + 15, player.y + 12, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(player.x + 25, player.y + 12, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Arms
    ctx.fillStyle = '#FF69B4';
    ctx.fillRect(player.x + 5, player.y + 25, 8, 20);
    ctx.fillRect(player.x + 27, player.y + 25, 8, 20);
    
    // Legs (animated running)
    const legOffset = Math.sin(distance * 0.3) * 3;
    ctx.fillRect(player.x + 12, player.y + 50, 6, 10 + legOffset);
    ctx.fillRect(player.x + 22, player.y + 50, 6, 10 - legOffset);

    // Game over effect
    if (isGameOver) {
      ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    }
  }, [player, obstacles, coins, distance, isGameOver]);

  const animate = useCallback(() => {
    updateGame();
    checkCollisions();
    draw();
    animationRef.current = requestAnimationFrame(animate);
  }, [updateGame, checkCollisions, draw]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    keysRef.current.add(event.key);
  }, []);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    keysRef.current.delete(event.key);
  }, []);

  useEffect(() => {
    if (gameStarted && !gameEnded) {
      animate();
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameStarted, gameEnded, animate]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  useEffect(() => {
    return () => {
      if (gameTimerRef.current) {
        clearInterval(gameTimerRef.current);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] space-y-6">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center space-x-2">
              <span className="text-4xl">🏃‍♀️</span>
              <span>DeeDee's Fun Run</span>
            </CardTitle>
            <CardDescription>
              Endless runner adventure - jump over obstacles and collect coins!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground space-y-2">
              <p>• Press SPACEBAR or UP ARROW to jump</p>
              <p>• Avoid cacti, rocks, and pits</p>
              <p>• Collect golden coins for bonus points</p>
              <p>• Game speed increases over time</p>
              <p>• Survive as long as possible!</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-muted p-3 rounded-lg">
                <div className="text-gold font-semibold">2500+ Points</div>
                <div className="text-xs">0.25 SC</div>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <div className="text-yellow-400 font-semibold">2000+ Points</div>
                <div className="text-xs">0.20 SC</div>
              </div>
            </div>
            <Button 
              onClick={startGame} 
              className="w-full bg-gradient-to-r from-gold to-yellow-400 text-gold-foreground"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Game
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Game Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gold">{score}</div>
            <div className="text-sm text-muted-foreground">Score</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-sweep">{Math.floor(distance / 10)}m</div>
            <div className="text-sm text-muted-foreground">Distance</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{coinsCollected}</div>
            <div className="text-sm text-muted-foreground">Coins</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-casino-red">{timeLeft}s</div>
            <div className="text-sm text-muted-foreground">Time Left</div>
          </CardContent>
        </Card>
      </div>

      {/* Game Canvas */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center space-y-4">
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              className="border border-border rounded-lg"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
            
            {isPlaying && !isGameOver && (
              <div className="text-center space-y-2">
                <div className="text-lg font-semibold">
                  Press SPACEBAR or ↑ to jump!
                </div>
                <Progress value={(60 - timeLeft) / 60 * 100} className="w-64" />
                <div className="flex space-x-4 text-sm">
                  <Badge variant="outline">Speed: {gameSpeed.toFixed(1)}</Badge>
                  <Badge variant="outline">Distance: {Math.floor(distance / 10)}m</Badge>
                </div>
              </div>
            )}

            {gameEnded && (
              <div className="text-center space-y-4 p-6 bg-card/50 rounded-lg">
                <Trophy className="h-16 w-16 text-gold mx-auto" />
                <h3 className="text-2xl font-bold">Game Complete!</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-xl font-bold text-gold">{score}</div>
                    <div className="text-muted-foreground">Final Score</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-sweep">{Math.floor(distance / 10)}m</div>
                    <div className="text-muted-foreground">Distance Run</div>
                  </div>
                </div>
                <div className="text-lg">
                  You earned{" "}
                  <span className="text-gold font-bold">
                    {score >= 2500 ? "0.25" : score >= 2000 ? "0.20" : score >= 1500 ? "0.15" : score >= 1000 ? "0.10" : score >= 500 ? "0.05" : "0.00"} SC
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
