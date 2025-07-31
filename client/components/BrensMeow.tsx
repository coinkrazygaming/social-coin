import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Timer, Target, Trophy, Play, RotateCcw } from "lucide-react";

interface BrensMeowProps {
  userId: string;
  username: string;
  onGameComplete: (score: number, scEarned: number) => void;
}

interface Cat {
  id: number;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  type: 'normal' | 'fast' | 'sneaky' | 'golden';
  size: number;
  active: boolean;
  escaping: boolean;
  caught: boolean;
  spawnTime: number;
  lastDirectionChange: number;
}

interface Cage {
  x: number;
  y: number;
  size: number;
  active: boolean;
  catchRadius: number;
}

export function BrensMeow({ userId, username, onGameComplete }: BrensMeowProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [catsEscaped, setCatsEscaped] = useState(0);
  const [catsCaught, setCatsCaught] = useState(0);
  const [cats, setCats] = useState<Cat[]>([]);
  const [cage, setCage] = useState<Cage>({ x: 0, y: 0, size: 40, active: false, catchRadius: 60 });
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const gameTimerRef = useRef<NodeJS.Timeout>();
  const catSpawnerRef = useRef<NodeJS.Timeout>();

  // Game dimensions
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;

  const startGame = useCallback(() => {
    setIsPlaying(true);
    setGameStarted(true);
    setGameEnded(false);
    setTimeLeft(60);
    setScore(0);
    setCatsEscaped(0);
    setCatsCaught(0);
    setCats([]);
    setCage({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2, size: 40, active: false, catchRadius: 60 });

    gameTimerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Start spawning cats
    spawnCat();
    catSpawnerRef.current = setInterval(spawnCat, 1500);
  }, []);

  const endGame = useCallback(() => {
    setIsPlaying(false);
    setGameEnded(true);
    
    if (gameTimerRef.current) {
      clearInterval(gameTimerRef.current);
    }
    if (catSpawnerRef.current) {
      clearInterval(catSpawnerRef.current);
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

  const spawnCat = useCallback(() => {
    if (!isPlaying) return;

    const catTypes = ['normal', 'normal', 'normal', 'fast', 'sneaky', 'golden'] as const;
    const type = catTypes[Math.floor(Math.random() * catTypes.length)];
    
    // Spawn from edges
    const spawnSide = Math.floor(Math.random() * 4);
    let x, y, velocityX, velocityY;
    
    switch (spawnSide) {
      case 0: // Top
        x = Math.random() * CANVAS_WIDTH;
        y = -30;
        velocityX = (Math.random() - 0.5) * 2;
        velocityY = 1 + Math.random() * 2;
        break;
      case 1: // Right
        x = CANVAS_WIDTH + 30;
        y = Math.random() * CANVAS_HEIGHT;
        velocityX = -(1 + Math.random() * 2);
        velocityY = (Math.random() - 0.5) * 2;
        break;
      case 2: // Bottom
        x = Math.random() * CANVAS_WIDTH;
        y = CANVAS_HEIGHT + 30;
        velocityX = (Math.random() - 0.5) * 2;
        velocityY = -(1 + Math.random() * 2);
        break;
      default: // Left
        x = -30;
        y = Math.random() * CANVAS_HEIGHT;
        velocityX = 1 + Math.random() * 2;
        velocityY = (Math.random() - 0.5) * 2;
        break;
    }

    // Adjust speed based on cat type
    const speedMultiplier = type === 'fast' ? 2 : type === 'sneaky' ? 0.7 : type === 'golden' ? 1.2 : 1;
    velocityX *= speedMultiplier;
    velocityY *= speedMultiplier;

    const size = type === 'golden' ? 35 : type === 'sneaky' ? 20 : 25;

    const newCat: Cat = {
      id: Date.now() + Math.random(),
      x,
      y,
      velocityX,
      velocityY,
      type,
      size,
      active: true,
      escaping: false,
      caught: false,
      spawnTime: Date.now(),
      lastDirectionChange: Date.now(),
    };

    setCats(prev => [...prev, newCat]);
  }, [isPlaying]);

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPlaying) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const newMouseX = (event.clientX - rect.left) * scaleX;
    const newMouseY = (event.clientY - rect.top) * scaleY;
    
    setMouseX(newMouseX);
    setMouseY(newMouseY);
    
    setCage(prev => ({
      ...prev,
      x: newMouseX,
      y: newMouseY,
    }));
  }, [isPlaying]);

  const handleMouseDown = useCallback(() => {
    if (!isPlaying) return;
    
    setCage(prev => ({ ...prev, active: true }));
    
    // Check for cat catches
    setCats(prevCats => prevCats.map(cat => {
      if (cat.active && !cat.caught) {
        const distance = Math.sqrt((cat.x - cage.x) ** 2 + (cat.y - cage.y) ** 2);
        
        if (distance <= cage.catchRadius) {
          // Cat caught!
          setCatsCaught(prev => prev + 1);
          
          let points = 0;
          switch (cat.type) {
            case 'normal':
              points = 100;
              break;
            case 'fast':
              points = 200;
              break;
            case 'sneaky':
              points = 150;
              break;
            case 'golden':
              points = 500;
              break;
          }
          
          setScore(prev => prev + points);
          return { ...cat, caught: true, active: false };
        }
      }
      return cat;
    }));
  }, [isPlaying, cage]);

  const handleMouseUp = useCallback(() => {
    setCage(prev => ({ ...prev, active: false }));
  }, []);

  const updateCats = useCallback(() => {
    const currentTime = Date.now();
    
    setCats(prevCats => prevCats.map(cat => {
      if (!cat.active || cat.caught) return cat;

      let newX = cat.x + cat.velocityX;
      let newY = cat.y + cat.velocityY;
      let newVelocityX = cat.velocityX;
      let newVelocityY = cat.velocityY;

      // Cat AI behavior
      const timeSinceSpawn = currentTime - cat.spawnTime;
      const timeSinceDirectionChange = currentTime - cat.lastDirectionChange;

      // Make cats run away from the cage
      const distanceToCage = Math.sqrt((newX - cage.x) ** 2 + (newY - cage.y) ** 2);
      const fleeDistance = cat.type === 'sneaky' ? 120 : 80;

      if (distanceToCage < fleeDistance) {
        // Run away from cage
        const fleeX = newX - cage.x;
        const fleeY = newY - cage.y;
        const fleeLength = Math.sqrt(fleeX ** 2 + fleeY ** 2);
        
        if (fleeLength > 0) {
          const fleeForce = cat.type === 'fast' ? 3 : cat.type === 'sneaky' ? 2 : 2.5;
          newVelocityX += (fleeX / fleeLength) * fleeForce;
          newVelocityY += (fleeY / fleeLength) * fleeForce;
        }
      }

      // Random direction changes
      if (timeSinceDirectionChange > 2000 + Math.random() * 3000) {
        const randomForce = cat.type === 'sneaky' ? 1 : 0.5;
        newVelocityX += (Math.random() - 0.5) * randomForce;
        newVelocityY += (Math.random() - 0.5) * randomForce;
        cat.lastDirectionChange = currentTime;
      }

      // Limit velocity
      const maxSpeed = cat.type === 'fast' ? 5 : cat.type === 'sneaky' ? 3 : 4;
      const currentSpeed = Math.sqrt(newVelocityX ** 2 + newVelocityY ** 2);
      if (currentSpeed > maxSpeed) {
        newVelocityX = (newVelocityX / currentSpeed) * maxSpeed;
        newVelocityY = (newVelocityY / currentSpeed) * maxSpeed;
      }

      // Bounce off walls
      if (newX <= cat.size || newX >= CANVAS_WIDTH - cat.size) {
        newVelocityX = -newVelocityX * 0.8;
        newX = Math.max(cat.size, Math.min(CANVAS_WIDTH - cat.size, newX));
      }
      if (newY <= cat.size || newY >= CANVAS_HEIGHT - cat.size) {
        newVelocityY = -newVelocityY * 0.8;
        newY = Math.max(cat.size, Math.min(CANVAS_HEIGHT - cat.size, newY));
      }

      // Check if cat escaped (been on screen too long)
      if (timeSinceSpawn > 15000) {
        setCatsEscaped(prev => prev + 1);
        return { ...cat, active: false, escaping: true };
      }

      return {
        ...cat,
        x: newX,
        y: newY,
        velocityX: newVelocityX,
        velocityY: newVelocityY,
      };
    }).filter(cat => cat.active || (Date.now() - cat.spawnTime < 16000)));
  }, [cage]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with grass background
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(0.3, '#98FB98');
    gradient.addColorStop(1, '#228B22');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw grass texture
    ctx.fillStyle = 'rgba(34, 139, 34, 0.3)';
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * CANVAS_WIDTH;
      const y = CANVAS_HEIGHT * 0.3 + Math.random() * CANVAS_HEIGHT * 0.7;
      ctx.fillRect(x, y, 2, 8);
    }

    // Draw trees/bushes
    ctx.fillStyle = '#228B22';
    for (let i = 0; i < 8; i++) {
      const treeX = (i * CANVAS_WIDTH / 8) + 50;
      const treeY = CANVAS_HEIGHT * 0.2;
      
      ctx.beginPath();
      ctx.arc(treeX, treeY, 30, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw cats
    cats.forEach(cat => {
      if (!cat.active && !cat.escaping) return;

      ctx.save();
      ctx.translate(cat.x, cat.y);
      
      // Cat body
      let catColor = '#8B4513';
      if (cat.type === 'golden') catColor = '#FFD700';
      else if (cat.type === 'fast') catColor = '#FF6B6B';
      else if (cat.type === 'sneaky') catColor = '#666666';
      
      ctx.fillStyle = catColor;
      ctx.beginPath();
      ctx.ellipse(0, 0, cat.size * 0.8, cat.size * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Cat head
      ctx.beginPath();
      ctx.arc(-cat.size * 0.5, -cat.size * 0.3, cat.size * 0.5, 0, Math.PI * 2);
      ctx.fill();
      
      // Cat ears
      ctx.beginPath();
      ctx.moveTo(-cat.size * 0.8, -cat.size * 0.6);
      ctx.lineTo(-cat.size * 0.6, -cat.size * 0.9);
      ctx.lineTo(-cat.size * 0.4, -cat.size * 0.6);
      ctx.fill();
      
      ctx.beginPath();
      ctx.moveTo(-cat.size * 0.6, -cat.size * 0.6);
      ctx.lineTo(-cat.size * 0.4, -cat.size * 0.9);
      ctx.lineTo(-cat.size * 0.2, -cat.size * 0.6);
      ctx.fill();
      
      // Cat eyes
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(-cat.size * 0.7, -cat.size * 0.4, cat.size * 0.08, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(-cat.size * 0.3, -cat.size * 0.4, cat.size * 0.08, 0, Math.PI * 2);
      ctx.fill();
      
      // Cat tail
      ctx.strokeStyle = catColor;
      ctx.lineWidth = cat.size * 0.2;
      ctx.beginPath();
      ctx.moveTo(cat.size * 0.8, 0);
      ctx.quadraticCurveTo(cat.size * 1.2, -cat.size * 0.5, cat.size * 0.9, -cat.size * 0.8);
      ctx.stroke();
      
      // Speed indicator for fast cats
      if (cat.type === 'fast') {
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.moveTo(-cat.size - 10 - i * 5, -5 + i * 3);
          ctx.lineTo(-cat.size - 20 - i * 5, -5 + i * 3);
          ctx.stroke();
        }
      }
      
      // Stealth indicator for sneaky cats
      if (cat.type === 'sneaky') {
        ctx.globalAlpha = 0.7;
        ctx.strokeStyle = '#666666';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(0, 0, cat.size + 10, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;
      }
      
      ctx.restore();
    });

    // Draw cage/net
    ctx.strokeStyle = cage.active ? '#FFD700' : '#8B4513';
    ctx.lineWidth = cage.active ? 4 : 2;
    
    // Cage circle
    ctx.beginPath();
    ctx.arc(cage.x, cage.y, cage.catchRadius, 0, Math.PI * 2);
    ctx.stroke();
    
    // Net pattern
    if (cage.active) {
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = '#FFD700';
      ctx.fill();
      ctx.globalAlpha = 1;
      
      // Net grid
      const gridSize = 20;
      ctx.beginPath();
      for (let x = cage.x - cage.catchRadius; x <= cage.x + cage.catchRadius; x += gridSize) {
        ctx.moveTo(x, cage.y - cage.catchRadius);
        ctx.lineTo(x, cage.y + cage.catchRadius);
      }
      for (let y = cage.y - cage.catchRadius; y <= cage.y + cage.catchRadius; y += gridSize) {
        ctx.moveTo(cage.x - cage.catchRadius, y);
        ctx.lineTo(cage.x + cage.catchRadius, y);
      }
      ctx.stroke();
    }

    // Draw cage center
    ctx.fillStyle = cage.active ? '#FFD700' : '#8B4513';
    ctx.beginPath();
    ctx.arc(cage.x, cage.y, 8, 0, Math.PI * 2);
    ctx.fill();
  }, [cats, cage]);

  const animate = useCallback(() => {
    updateCats();
    draw();
    animationRef.current = requestAnimationFrame(animate);
  }, [updateCats, draw]);

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
      if (catSpawnerRef.current) {
        clearInterval(catSpawnerRef.current);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const catchRate = (catsCaught + catsEscaped) > 0 ? Math.round((catsCaught / (catsCaught + catsEscaped)) * 100) : 0;

  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] space-y-6">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center space-x-2">
              <span className="text-4xl">🐱</span>
              <span>Bren's Meow</span>
            </CardTitle>
            <CardDescription>
              Catch the smart cats with your cage - they'll try to escape!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground space-y-2">
              <p>• Move your mouse to control the cage</p>
              <p>• Click and hold to activate the cage</p>
              <p>• Cats will run away from you - be strategic!</p>
              <p>• Different cat types have different behaviors</p>
              <p>• Golden cats = 500 points, Fast cats = 200 points</p>
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
            <div className="text-2xl font-bold text-sweep">{catsCaught}</div>
            <div className="text-sm text-muted-foreground">Cats Caught</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-casino-red">{catsEscaped}</div>
            <div className="text-sm text-muted-foreground">Escaped</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{catchRate}%</div>
            <div className="text-sm text-muted-foreground">Catch Rate</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{timeLeft}s</div>
            <div className="text-sm text-muted-foreground">Time Left</div>
          </CardContent>
        </Card>
      </div>

      {/* Cat Legend */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-amber-600"></div>
              <span>Normal Cat (100 pts)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span>Fast Cat (200 pts)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-gray-600"></div>
              <span>Sneaky Cat (150 pts)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-gold"></div>
              <span>Golden Cat (500 pts)</span>
            </div>
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
              className="border border-border rounded-lg cursor-none"
              onMouseMove={handleMouseMove}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{ maxWidth: '100%', height: 'auto' }}
            />
            
            {isPlaying && (
              <div className="text-center space-y-2">
                <div className="text-lg font-semibold">
                  Move mouse to position cage, click to catch cats!
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
                    <div className="text-xl font-bold text-sweep">{catchRate}%</div>
                    <div className="text-muted-foreground">Catch Rate</div>
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
