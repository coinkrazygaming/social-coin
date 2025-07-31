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
import {
  Timer,
  Target,
  Trophy,
  Star,
  RotateCcw,
  Play,
  Pause,
} from "lucide-react";

interface ColinShotsProps {
  userId: string;
  username: string;
  onGameComplete: (score: number, scEarned: number) => void;
}

interface ShotAttempt {
  id: number;
  x: number;
  y: number;
  made: boolean;
  timestamp: number;
}

interface Ball {
  id: number;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  active: boolean;
  trail: { x: number; y: number }[];
}

export function ColinShots({ userId, username, onGameComplete }: ColinShotsProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [shots, setShots] = useState(0);
  const [shotAttempts, setShotAttempts] = useState<ShotAttempt[]>([]);
  const [currentBall, setCurrentBall] = useState<Ball | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [powerLevel, setPowerLevel] = useState(0);
  const [isCharging, setIsCharging] = useState(false);
  const [showingShotResult, setShowingShotResult] = useState(false);
  const [lastShotMade, setLastShotMade] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const gameTimerRef = useRef<NodeJS.Timeout>();
  const powerChargeRef = useRef<NodeJS.Timeout>();

  // Game dimensions
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;
  const HOOP_X = CANVAS_WIDTH * 0.75;
  const HOOP_Y = CANVAS_HEIGHT * 0.3;
  const HOOP_WIDTH = 80;
  const HOOP_HEIGHT = 15;
  const BALL_RADIUS = 12;
  const GRAVITY = 0.4;
  const SHOT_START_X = CANVAS_WIDTH * 0.2;
  const SHOT_START_Y = CANVAS_HEIGHT * 0.8;

  const startGame = useCallback(() => {
    setIsPlaying(true);
    setGameStarted(true);
    setGameEnded(false);
    setTimeLeft(60);
    setScore(0);
    setShots(0);
    setShotAttempts([]);
    setCurrentBall(null);
    setPowerLevel(0);
    setIsCharging(false);
    setShowingShotResult(false);

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
    setIsCharging(false);
    
    if (gameTimerRef.current) {
      clearInterval(gameTimerRef.current);
    }
    if (powerChargeRef.current) {
      clearTimeout(powerChargeRef.current);
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    // Calculate SC earned based on score
    const percentage = shots > 0 ? (score / shots) * 100 : 0;
    let scEarned = 0;
    
    if (percentage >= 80) scEarned = 0.25;
    else if (percentage >= 60) scEarned = 0.20;
    else if (percentage >= 40) scEarned = 0.15;
    else if (percentage >= 20) scEarned = 0.10;
    else if (score > 0) scEarned = 0.05;

    setTimeout(() => {
      onGameComplete(score, scEarned);
    }, 2000);
  }, [score, shots, onGameComplete]);

  const handleMouseDown = useCallback(() => {
    if (!isPlaying || currentBall || isCharging) return;
    
    setIsCharging(true);
    setPowerLevel(0);
    
    const chargePower = () => {
      setPowerLevel((prev) => {
        const newPower = prev + 2;
        if (newPower >= 100) {
          // Auto-shoot at max power
          shootBall(100);
          return 100;
        }
        powerChargeRef.current = setTimeout(chargePower, 50);
        return newPower;
      });
    };
    
    chargePower();
  }, [isPlaying, currentBall, isCharging]);

  const handleMouseUp = useCallback(() => {
    if (!isCharging) return;
    
    setIsCharging(false);
    if (powerChargeRef.current) {
      clearTimeout(powerChargeRef.current);
    }
    
    shootBall(powerLevel);
  }, [isCharging, powerLevel]);

  const shootBall = useCallback((power: number) => {
    if (!isPlaying || currentBall) return;

    setShots(prev => prev + 1);
    setIsCharging(false);
    setPowerLevel(0);

    // Calculate velocity based on power and angle
    const angle = -45 * (Math.PI / 180); // 45 degrees upward
    const maxVelocity = 15;
    const velocity = (power / 100) * maxVelocity;
    
    const velocityX = Math.cos(angle) * velocity;
    const velocityY = Math.sin(angle) * velocity;

    const newBall: Ball = {
      id: Date.now(),
      x: SHOT_START_X,
      y: SHOT_START_Y,
      velocityX,
      velocityY,
      active: true,
      trail: [],
    };

    setCurrentBall(newBall);
  }, [isPlaying, currentBall]);

  const checkHoopCollision = useCallback((ball: Ball): boolean => {
    const ballCenterX = ball.x;
    const ballCenterY = ball.y;
    
    // Check if ball is going through the hoop
    if (
      ballCenterX >= HOOP_X - HOOP_WIDTH / 2 &&
      ballCenterX <= HOOP_X + HOOP_WIDTH / 2 &&
      ballCenterY >= HOOP_Y - 10 &&
      ballCenterY <= HOOP_Y + 10 &&
      ball.velocityY > 0 // Ball must be falling down
    ) {
      return true;
    }
    
    return false;
  }, []);

  const updateBall = useCallback(() => {
    setCurrentBall((prevBall) => {
      if (!prevBall || !prevBall.active) return null;

      const newBall = { ...prevBall };
      
      // Update position
      newBall.x += newBall.velocityX;
      newBall.y += newBall.velocityY;
      
      // Apply gravity
      newBall.velocityY += GRAVITY;
      
      // Update trail
      newBall.trail.push({ x: newBall.x, y: newBall.y });
      if (newBall.trail.length > 10) {
        newBall.trail.shift();
      }

      // Check hoop collision
      if (checkHoopCollision(newBall)) {
        setScore(prev => prev + 1);
        setLastShotMade(true);
        setShowingShotResult(true);
        newBall.active = false;
        
        setTimeout(() => {
          setShowingShotResult(false);
          setCurrentBall(null);
        }, 1000);
        
        return newBall;
      }

      // Check bounds
      if (
        newBall.x < -BALL_RADIUS ||
        newBall.x > CANVAS_WIDTH + BALL_RADIUS ||
        newBall.y > CANVAS_HEIGHT + BALL_RADIUS
      ) {
        setLastShotMade(false);
        setShowingShotResult(true);
        newBall.active = false;
        
        setTimeout(() => {
          setShowingShotResult(false);
          setCurrentBall(null);
        }, 1000);
      }

      return newBall;
    });
  }, [checkHoopCollision]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw court
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, CANVAS_HEIGHT - 100, CANVAS_WIDTH, 100);
    
    // Draw court lines
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(SHOT_START_X, CANVAS_HEIGHT - 50, 60, 0, Math.PI * 2);
    ctx.stroke();

    // Draw backboard
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(HOOP_X + HOOP_WIDTH / 2, HOOP_Y - 40, 10, 60);

    // Draw hoop
    ctx.strokeStyle = '#FF6600';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(HOOP_X, HOOP_Y, HOOP_WIDTH / 2, 0, Math.PI);
    ctx.stroke();

    // Draw net
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    for (let i = 0; i < 8; i++) {
      const angle = i * (Math.PI / 7);
      const startX = HOOP_X - HOOP_WIDTH / 2 + i * (HOOP_WIDTH / 7);
      const startY = HOOP_Y;
      const endX = startX + Math.sin(angle) * 20;
      const endY = startY + 30;
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }

    // Draw ball trail
    if (currentBall && currentBall.trail.length > 1) {
      ctx.strokeStyle = '#FF6600';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(currentBall.trail[0].x, currentBall.trail[0].y);
      
      for (let i = 1; i < currentBall.trail.length; i++) {
        ctx.lineTo(currentBall.trail[i].x, currentBall.trail[i].y);
      }
      ctx.stroke();
    }

    // Draw ball
    if (currentBall && currentBall.active) {
      ctx.fillStyle = '#FF6600';
      ctx.beginPath();
      ctx.arc(currentBall.x, currentBall.y, BALL_RADIUS, 0, Math.PI * 2);
      ctx.fill();
      
      // Ball lines
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(currentBall.x, currentBall.y, BALL_RADIUS, 0, Math.PI * 2);
      ctx.stroke();
      
      // Ball curves
      ctx.beginPath();
      ctx.moveTo(currentBall.x - BALL_RADIUS, currentBall.y);
      ctx.lineTo(currentBall.x + BALL_RADIUS, currentBall.y);
      ctx.moveTo(currentBall.x, currentBall.y - BALL_RADIUS);
      ctx.lineTo(currentBall.x, currentBall.y + BALL_RADIUS);
      ctx.stroke();
    }

    // Draw shooting position indicator
    if (isPlaying && !currentBall) {
      ctx.fillStyle = isCharging ? '#FF6600' : '#FFFFFF';
      ctx.beginPath();
      ctx.arc(SHOT_START_X, SHOT_START_Y, 15, 0, Math.PI * 2);
      ctx.fill();
      
      if (isCharging) {
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(SHOT_START_X, SHOT_START_Y, 20 + (powerLevel / 5), 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // Draw power meter
    if (isCharging) {
      const meterWidth = 200;
      const meterHeight = 20;
      const meterX = CANVAS_WIDTH / 2 - meterWidth / 2;
      const meterY = CANVAS_HEIGHT - 150;
      
      ctx.fillStyle = '#333333';
      ctx.fillRect(meterX, meterY, meterWidth, meterHeight);
      
      ctx.fillStyle = powerLevel > 80 ? '#FF0000' : powerLevel > 50 ? '#FFD700' : '#00FF00';
      ctx.fillRect(meterX, meterY, (meterWidth * powerLevel) / 100, meterHeight);
      
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.strokeRect(meterX, meterY, meterWidth, meterHeight);
    }

    // Draw shot result
    if (showingShotResult) {
      ctx.fillStyle = lastShotMade ? '#00FF00' : '#FF0000';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(
        lastShotMade ? 'SWISH!' : 'MISS!',
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT / 2
      );
    }
  }, [currentBall, isPlaying, isCharging, powerLevel, showingShotResult, lastShotMade]);

  const animate = useCallback(() => {
    updateBall();
    draw();
    animationRef.current = requestAnimationFrame(animate);
  }, [updateBall, draw]);

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
      if (powerChargeRef.current) {
        clearTimeout(powerChargeRef.current);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const accuracy = shots > 0 ? Math.round((score / shots) * 100) : 0;

  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] space-y-6">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center space-x-2">
              <span className="text-4xl">🏀</span>
              <span>Colin Shots</span>
            </CardTitle>
            <CardDescription>
              Basketball free throw challenge - score as many shots as possible in 60 seconds!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground space-y-2">
              <p>• Hold mouse button to charge your shot power</p>
              <p>• Release to shoot the basketball</p>
              <p>• Score through the hoop to earn points</p>
              <p>• Higher accuracy = more Sweeps Coins!</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-muted p-3 rounded-lg">
                <div className="text-gold font-semibold">80%+ Accuracy</div>
                <div className="text-xs">0.25 SC</div>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <div className="text-yellow-400 font-semibold">60%+ Accuracy</div>
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
            <div className="text-sm text-muted-foreground">Shots Made</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{shots}</div>
            <div className="text-sm text-muted-foreground">Total Shots</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-sweep">{accuracy}%</div>
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

      {/* Game Canvas */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center space-y-4">
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              className="border border-border rounded-lg cursor-pointer"
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{ maxWidth: '100%', height: 'auto' }}
            />
            
            {isPlaying && !currentBall && (
              <div className="text-center space-y-2">
                <div className="text-lg font-semibold">
                  {isCharging ? 'Release to Shoot!' : 'Hold Mouse Button to Charge Shot'}
                </div>
                <Progress value={powerLevel} className="w-64" />
              </div>
            )}

            {gameEnded && (
              <div className="text-center space-y-4 p-6 bg-card/50 rounded-lg">
                <Trophy className="h-16 w-16 text-gold mx-auto" />
                <h3 className="text-2xl font-bold">Game Complete!</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-xl font-bold text-gold">{score}</div>
                    <div className="text-muted-foreground">Shots Made</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-sweep">{accuracy}%</div>
                    <div className="text-muted-foreground">Accuracy</div>
                  </div>
                </div>
                <div className="text-lg">
                  You earned{" "}
                  <span className="text-gold font-bold">
                    {accuracy >= 80 ? "0.25" : accuracy >= 60 ? "0.20" : accuracy >= 40 ? "0.15" : accuracy >= 20 ? "0.10" : score > 0 ? "0.05" : "0.00"} SC
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
