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
  velocityX: number;
  velocityY: number;
  type: 'normal' | 'golden' | 'red';
  size: number;
  active: boolean;
  flightPattern: 'straight' | 'zigzag' | 'sine';
  spawnTime: number;
}

interface Shot {
  id: number;
  x: number;
  y: number;
  timestamp: number;
}

export function JoseysQuackAttack({ userId, username, onGameComplete }: JoseysQuackAttackProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [shots, setShots] = useState(0);
  const [hits, setHits] = useState(0);
  const [ducks, setDucks] = useState<Duck[]>([]);
  const [shotsFired, setShotsFired] = useState<Shot[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [crosshairX, setCrosshairX] = useState(0);
  const [crosshairY, setCrosshairY] = useState(0);
  const [reloading, setReloading] = useState(false);
  const [ammo, setAmmo] = useState(6);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const gameTimerRef = useRef<NodeJS.Timeout>();
  const duckSpawnerRef = useRef<NodeJS.Timeout>();

  // Game dimensions
  const CANVAS_WIDTH = 900;
  const CANVAS_HEIGHT = 600;

  const startGame = useCallback(() => {
    setIsPlaying(true);
    setGameStarted(true);
    setGameEnded(false);
    setTimeLeft(60);
    setScore(0);
    setShots(0);
    setHits(0);
    setDucks([]);
    setShotsFired([]);
    setAmmo(6);
    setReloading(false);

    gameTimerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Start spawning ducks
    spawnDuck();
    duckSpawnerRef.current = setInterval(spawnDuck, 2000);
  }, []);

  const endGame = useCallback(() => {
    setIsPlaying(false);
    setGameEnded(true);
    
    if (gameTimerRef.current) {
      clearInterval(gameTimerRef.current);
    }
    if (duckSpawnerRef.current) {
      clearInterval(duckSpawnerRef.current);
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    // Calculate SC earned based on score
    let scEarned = 0;
    if (score >= 1500) scEarned = 0.25;
    else if (score >= 1200) scEarned = 0.20;
    else if (score >= 900) scEarned = 0.15;
    else if (score >= 600) scEarned = 0.10;
    else if (score >= 300) scEarned = 0.05;

    setTimeout(() => {
      onGameComplete(score, scEarned);
    }, 2000);
  }, [score, onGameComplete]);

  const spawnDuck = useCallback(() => {
    if (!isPlaying) return;

    const duckTypes = ['normal', 'normal', 'normal', 'golden', 'red'] as const;
    const type = duckTypes[Math.floor(Math.random() * duckTypes.length)];
    
    const patterns = ['straight', 'zigzag', 'sine'] as const;
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    
    const startSide = Math.random() > 0.5 ? 'left' : 'right';
    const startY = 50 + Math.random() * (CANVAS_HEIGHT - 200);
    
    const size = type === 'golden' ? 35 : type === 'red' ? 25 : 30;
    const speed = type === 'red' ? 4 : type === 'golden' ? 2 : 3;
    
    const newDuck: Duck = {
      id: Date.now() + Math.random(),
      x: startSide === 'left' ? -50 : CANVAS_WIDTH + 50,
      y: startY,
      velocityX: startSide === 'left' ? speed : -speed,
      velocityY: (Math.random() - 0.5) * 2,
      type,
      size,
      active: true,
      flightPattern: pattern,
      spawnTime: Date.now(),
    };

    setDucks(prev => [...prev, newDuck]);
  }, [isPlaying]);

  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPlaying || reloading || ammo <= 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const clickX = (event.clientX - rect.left) * scaleX;
    const clickY = (event.clientY - rect.top) * scaleY;

    setShots(prev => prev + 1);
    setAmmo(prev => prev - 1);

    // Add shot effect
    const newShot: Shot = {
      id: Date.now(),
      x: clickX,
      y: clickY,
      timestamp: Date.now(),
    };
    setShotsFired(prev => [...prev, newShot]);

    // Check for duck hits
    const hitDuck = ducks.find(duck => {
      if (!duck.active) return false;
      
      const distance = Math.sqrt(
        (duck.x - clickX) ** 2 + (duck.y - clickY) ** 2
      );
      return distance <= duck.size;
    });

    if (hitDuck) {
      setHits(prev => prev + 1);
      setDucks(prev => prev.map(duck => 
        duck.id === hitDuck.id ? { ...duck, active: false } : duck
      ));

      // Score based on duck type
      let points = 0;
      switch (hitDuck.type) {
        case 'normal':
          points = 100;
          break;
        case 'golden':
          points = 500;
          break;
        case 'red':
          points = 200;
          break;
      }
      setScore(prev => prev + points);
    }

    // Auto-reload when out of ammo
    if (ammo <= 1) {
      setReloading(true);
      setTimeout(() => {
        setAmmo(6);
        setReloading(false);
      }, 1500);
    }

    // Clear shot effect after a short time
    setTimeout(() => {
      setShotsFired(prev => prev.filter(shot => shot.id !== newShot.id));
    }, 300);
  }, [isPlaying, reloading, ammo, ducks]);

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPlaying) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    setCrosshairX((event.clientX - rect.left) * scaleX);
    setCrosshairY((event.clientY - rect.top) * scaleY);
  }, [isPlaying]);

  const updateDucks = useCallback(() => {
    setDucks(prev => prev.map(duck => {
      if (!duck.active) return duck;

      const timeSinceSpawn = Date.now() - duck.spawnTime;
      let newX = duck.x + duck.velocityX;
      let newY = duck.y + duck.velocityY;

      // Apply flight pattern
      switch (duck.flightPattern) {
        case 'zigzag':
          if (Math.floor(timeSinceSpawn / 1000) % 2 === 0) {
            newY += Math.sin(timeSinceSpawn / 200) * 2;
          } else {
            newY -= Math.sin(timeSinceSpawn / 200) * 2;
          }
          break;
        case 'sine':
          newY += Math.sin(timeSinceSpawn / 300) * 3;
          break;
      }

      // Keep ducks within vertical bounds
      if (newY < 50) newY = 50;
      if (newY > CANVAS_HEIGHT - 100) newY = CANVAS_HEIGHT - 100;

      // Remove ducks that fly off screen
      if (newX < -100 || newX > CANVAS_WIDTH + 100) {
        return { ...duck, active: false };
      }

      return { ...duck, x: newX, y: newY };
    }).filter(duck => duck.active || duck.x > -100 && duck.x < CANVAS_WIDTH + 100));
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with sky gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#98FB98');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (let i = 0; i < 5; i++) {
      const cloudX = (i * 200) + 50;
      const cloudY = 80;
      
      ctx.beginPath();
      ctx.arc(cloudX, cloudY, 30, 0, Math.PI * 2);
      ctx.arc(cloudX + 25, cloudY, 35, 0, Math.PI * 2);
      ctx.arc(cloudX + 50, cloudY, 30, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw ground
    ctx.fillStyle = '#228B22';
    ctx.fillRect(0, CANVAS_HEIGHT - 100, CANVAS_WIDTH, 100);

    // Draw trees
    ctx.fillStyle = '#8B4513';
    for (let i = 0; i < 8; i++) {
      const treeX = i * 120 + 50;
      ctx.fillRect(treeX, CANVAS_HEIGHT - 150, 20, 50);
      
      ctx.fillStyle = '#228B22';
      ctx.beginPath();
      ctx.arc(treeX + 10, CANVAS_HEIGHT - 150, 25, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#8B4513';
    }

    // Draw ducks
    ducks.forEach(duck => {
      if (!duck.active) return;

      ctx.save();
      ctx.translate(duck.x, duck.y);
      
      // Duck body
      ctx.fillStyle = duck.type === 'golden' ? '#FFD700' : 
                     duck.type === 'red' ? '#DC143C' : '#8B4513';
      
      ctx.beginPath();
      ctx.ellipse(0, 0, duck.size * 0.8, duck.size * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Duck head
      ctx.beginPath();
      ctx.arc(-duck.size * 0.3, -duck.size * 0.2, duck.size * 0.4, 0, Math.PI * 2);
      ctx.fill();
      
      // Duck beak
      ctx.fillStyle = '#FFA500';
      ctx.beginPath();
      ctx.ellipse(-duck.size * 0.6, -duck.size * 0.2, duck.size * 0.2, duck.size * 0.1, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Duck wing
      ctx.fillStyle = duck.type === 'golden' ? '#B8860B' :
                     duck.type === 'red' ? '#8B0000' : '#654321';
      ctx.beginPath();
      ctx.ellipse(duck.size * 0.2, 0, duck.size * 0.3, duck.size * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Duck eye
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(-duck.size * 0.4, -duck.size * 0.3, duck.size * 0.08, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    });

    // Draw shot effects
    shotsFired.forEach(shot => {
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(shot.x, shot.y, 8, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.strokeStyle = '#FFA500';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(shot.x - 15, shot.y);
      ctx.lineTo(shot.x + 15, shot.y);
      ctx.moveTo(shot.x, shot.y - 15);
      ctx.lineTo(shot.x, shot.y + 15);
      ctx.stroke();
    });

    // Draw crosshair
    if (isPlaying && !reloading) {
      ctx.strokeStyle = '#FF0000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(crosshairX, crosshairY, 20, 0, Math.PI * 2);
      ctx.moveTo(crosshairX - 30, crosshairY);
      ctx.lineTo(crosshairX + 30, crosshairY);
      ctx.moveTo(crosshairX, crosshairY - 30);
      ctx.lineTo(crosshairX, crosshairY + 30);
      ctx.stroke();
    }

    // Draw reload indicator
    if (reloading) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('RELOADING...', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    }
  }, [ducks, shotsFired, isPlaying, crosshairX, crosshairY, reloading]);

  const animate = useCallback(() => {
    updateDucks();
    draw();
    animationRef.current = requestAnimationFrame(animate);
  }, [updateDucks, draw]);

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
    return () => {
      if (gameTimerRef.current) {
        clearInterval(gameTimerRef.current);
      }
      if (duckSpawnerRef.current) {
        clearInterval(duckSpawnerRef.current);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const accuracy = shots > 0 ? Math.round((hits / shots) * 100) : 0;

  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] space-y-6">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center space-x-2">
              <span className="text-4xl">🦆</span>
              <span>Josey's Quack Attack</span>
            </CardTitle>
            <CardDescription>
              Duck hunting challenge - shoot flying ducks to earn SC!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground space-y-2">
              <p>• Click on flying ducks to shoot them</p>
              <p>• Normal ducks = 100 points</p>
              <p>• Red ducks = 200 points (fast)</p>
              <p>• Golden ducks = 500 points (rare)</p>
              <p>• 6 shots per reload, reload takes 1.5 seconds</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-muted p-3 rounded-lg">
                <div className="text-gold font-semibold">1500+ Points</div>
                <div className="text-xs">0.25 SC</div>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <div className="text-yellow-400 font-semibold">1200+ Points</div>
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
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gold">{score}</div>
            <div className="text-sm text-muted-foreground">Score</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-sweep">{hits}</div>
            <div className="text-sm text-muted-foreground">Ducks Hit</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{shots}</div>
            <div className="text-sm text-muted-foreground">Shots Fired</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{accuracy}%</div>
            <div className="text-sm text-muted-foreground">Accuracy</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-casino-red">{timeLeft}s</div>
            <div className="text-sm text-muted-foreground">Time Left</div>
          </CardContent>
        </Card>
      </div>

      {/* Ammo Display */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-center space-x-4">
            <span className="text-lg font-semibold">Ammo:</span>
            <div className="flex space-x-1">
              {Array.from({ length: 6 }, (_, i) => (
                <div
                  key={i}
                  className={`w-4 h-8 rounded-sm ${
                    i < ammo ? 'bg-gold' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            {reloading && (
              <Badge variant="secondary" className="animate-pulse">
                Reloading...
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Game Canvas */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center space-y-4">
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              className="border border-border rounded-lg cursor-crosshair"
              onClick={handleCanvasClick}
              onMouseMove={handleMouseMove}
              style={{ maxWidth: '100%', height: 'auto' }}
            />
            
            {isPlaying && (
              <div className="text-center space-y-2">
                <div className="text-lg font-semibold">
                  Click on the ducks to shoot them!
                </div>
                <Progress value={(60 - timeLeft) / 60 * 100} className="w-64" />
              </div>
            )}

            {gameEnded && (
              <div className="text-center space-y-4 p-6 bg-card/50 rounded-lg">
                <Trophy className="h-16 w-16 text-gold mx-auto" />
                <h3 className="text-2xl font-bold">Game Complete!</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-xl font-bold text-gold">{score}</div>
                    <div className="text-muted-foreground">Total Score</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-sweep">{accuracy}%</div>
                    <div className="text-muted-foreground">Accuracy</div>
                  </div>
                </div>
                <div className="text-lg">
                  You earned{" "}
                  <span className="text-gold font-bold">
                    {score >= 1500 ? "0.25" : score >= 1200 ? "0.20" : score >= 900 ? "0.15" : score >= 600 ? "0.10" : score >= 300 ? "0.05" : "0.00"} SC
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
