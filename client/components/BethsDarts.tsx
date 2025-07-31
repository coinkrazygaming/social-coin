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
  region: string;
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
  const [score, setScore] = useState(0);
  const [throws, setThrows] = useState(0);
  const [dartThrows, setDartThrows] = useState<DartThrow[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [aimX, setAimX] = useState(0);
  const [aimY, setAimY] = useState(0);
  const [showingResult, setShowingResult] = useState(false);
  const [lastThrowResult, setLastThrowResult] = useState<DartThrow | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameTimerRef = useRef<NodeJS.Timeout>();

  // Dartboard dimensions
  const CANVAS_WIDTH = 600;
  const CANVAS_HEIGHT = 600;
  const CENTER_X = CANVAS_WIDTH / 2;
  const CENTER_Y = CANVAS_HEIGHT / 2;
  const DARTBOARD_RADIUS = 250;

  // Dartboard regions (from outside to inside)
  const REGIONS = {
    OUTER_SINGLE: 170,
    TRIPLE: 150,
    INNER_SINGLE: 100,
    DOUBLE: 80,
    OUTER_BULL: 30,
    BULLSEYE: 15,
  };

  const DARTBOARD_NUMBERS = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];

  const startGame = useCallback(() => {
    setIsPlaying(true);
    setGameStarted(true);
    setGameEnded(false);
    setTimeLeft(60);
    setScore(0);
    setThrows(0);
    setDartThrows([]);
    setShowingResult(false);
    setLastThrowResult(null);

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

    // Calculate SC earned based on score
    let scEarned = 0;
    if (score >= 1000) scEarned = 0.25;
    else if (score >= 800) scEarned = 0.20;
    else if (score >= 600) scEarned = 0.15;
    else if (score >= 400) scEarned = 0.10;
    else if (score >= 200) scEarned = 0.05;

    setTimeout(() => {
      onGameComplete(score, scEarned);
    }, 2000);
  }, [score, onGameComplete]);

  const getDistanceFromCenter = (x: number, y: number): number => {
    return Math.sqrt((x - CENTER_X) ** 2 + (y - CENTER_Y) ** 2);
  };

  const getAngleFromCenter = (x: number, y: number): number => {
    let angle = Math.atan2(y - CENTER_Y, x - CENTER_X) * (180 / Math.PI);
    angle = (angle + 450) % 360; // Normalize to 0-360, starting from top
    return angle;
  };

  const getDartboardNumber = (angle: number): number => {
    const sectionAngle = 360 / 20;
    const index = Math.floor(angle / sectionAngle);
    return DARTBOARD_NUMBERS[index];
  };

  const calculateDartScore = (x: number, y: number): DartThrow => {
    const distance = getDistanceFromCenter(x, y);
    const angle = getAngleFromCenter(x, y);
    const number = getDartboardNumber(angle);
    
    let points = 0;
    let region = 'miss';
    
    if (distance <= REGIONS.BULLSEYE) {
      points = 50;
      region = 'bullseye';
    } else if (distance <= REGIONS.OUTER_BULL) {
      points = 25;
      region = 'outer-bull';
    } else if (distance <= REGIONS.DOUBLE) {
      points = number * 2;
      region = 'double';
    } else if (distance <= REGIONS.INNER_SINGLE) {
      points = number;
      region = 'single';
    } else if (distance <= REGIONS.TRIPLE) {
      points = number * 3;
      region = 'triple';
    } else if (distance <= REGIONS.OUTER_SINGLE) {
      points = number;
      region = 'single';
    }

    return {
      id: Date.now(),
      x,
      y,
      points,
      region,
      timestamp: Date.now(),
    };
  };

  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPlaying || showingResult) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    // Add some randomness to simulate throw accuracy
    const randomX = x + (Math.random() - 0.5) * 40;
    const randomY = y + (Math.random() - 0.5) * 40;

    const dartThrow = calculateDartScore(randomX, randomY);
    
    setDartThrows(prev => [...prev, dartThrow]);
    setThrows(prev => prev + 1);
    setScore(prev => prev + dartThrow.points);
    setLastThrowResult(dartThrow);
    setShowingResult(true);

    setTimeout(() => {
      setShowingResult(false);
      setLastThrowResult(null);
    }, 1500);
  }, [isPlaying, showingResult]);

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPlaying) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    setAimX((event.clientX - rect.left) * scaleX);
    setAimY((event.clientY - rect.top) * scaleY);
  }, [isPlaying]);

  const drawDartboard = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw dartboard sections
    const sectionAngle = (2 * Math.PI) / 20;
    
    for (let i = 0; i < 20; i++) {
      const startAngle = i * sectionAngle - Math.PI / 2;
      const endAngle = (i + 1) * sectionAngle - Math.PI / 2;
      const isEven = i % 2 === 0;
      
      // Outer single
      ctx.beginPath();
      ctx.arc(CENTER_X, CENTER_Y, REGIONS.OUTER_SINGLE, startAngle, endAngle);
      ctx.arc(CENTER_X, CENTER_Y, REGIONS.TRIPLE, endAngle, startAngle, true);
      ctx.fillStyle = isEven ? '#f4f4f4' : '#1a1a1a';
      ctx.fill();
      ctx.strokeStyle = '#666';
      ctx.stroke();
      
      // Triple
      ctx.beginPath();
      ctx.arc(CENTER_X, CENTER_Y, REGIONS.TRIPLE, startAngle, endAngle);
      ctx.arc(CENTER_X, CENTER_Y, REGIONS.INNER_SINGLE, endAngle, startAngle, true);
      ctx.fillStyle = isEven ? '#dc2626' : '#16a34a';
      ctx.fill();
      ctx.stroke();
      
      // Inner single
      ctx.beginPath();
      ctx.arc(CENTER_X, CENTER_Y, REGIONS.INNER_SINGLE, startAngle, endAngle);
      ctx.arc(CENTER_X, CENTER_Y, REGIONS.DOUBLE, endAngle, startAngle, true);
      ctx.fillStyle = isEven ? '#f4f4f4' : '#1a1a1a';
      ctx.fill();
      ctx.stroke();
      
      // Double
      ctx.beginPath();
      ctx.arc(CENTER_X, CENTER_Y, REGIONS.DOUBLE, startAngle, endAngle);
      ctx.arc(CENTER_X, CENTER_Y, REGIONS.OUTER_BULL, endAngle, startAngle, true);
      ctx.fillStyle = isEven ? '#dc2626' : '#16a34a';
      ctx.fill();
      ctx.stroke();

      // Draw numbers
      const numberAngle = startAngle + sectionAngle / 2;
      const numberRadius = REGIONS.OUTER_SINGLE + 20;
      const numberX = CENTER_X + Math.cos(numberAngle) * numberRadius;
      const numberY = CENTER_Y + Math.sin(numberAngle) * numberRadius;
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(DARTBOARD_NUMBERS[i].toString(), numberX, numberY);
    }

    // Outer bull
    ctx.beginPath();
    ctx.arc(CENTER_X, CENTER_Y, REGIONS.OUTER_BULL, 0, 2 * Math.PI);
    ctx.fillStyle = '#16a34a';
    ctx.fill();
    ctx.strokeStyle = '#666';
    ctx.stroke();

    // Bullseye
    ctx.beginPath();
    ctx.arc(CENTER_X, CENTER_Y, REGIONS.BULLSEYE, 0, 2 * Math.PI);
    ctx.fillStyle = '#dc2626';
    ctx.fill();
    ctx.stroke();

    // Draw dartboard border
    ctx.beginPath();
    ctx.arc(CENTER_X, CENTER_Y, DARTBOARD_RADIUS, 0, 2 * Math.PI);
    ctx.strokeStyle = '#8b4513';
    ctx.lineWidth = 20;
    ctx.stroke();

    // Draw thrown darts
    dartThrows.forEach((dart, index) => {
      ctx.beginPath();
      ctx.arc(dart.x, dart.y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = index === dartThrows.length - 1 ? '#ffd700' : '#ff6b6b';
      ctx.fill();
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Draw dart shaft
      ctx.beginPath();
      ctx.moveTo(dart.x - 8, dart.y);
      ctx.lineTo(dart.x + 8, dart.y);
      ctx.strokeStyle = '#654321';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Draw crosshair when aiming
    if (isPlaying && !showingResult) {
      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(aimX - 10, aimY);
      ctx.lineTo(aimX + 10, aimY);
      ctx.moveTo(aimX, aimY - 10);
      ctx.lineTo(aimX, aimY + 10);
      ctx.stroke();
    }

    // Show throw result
    if (showingResult && lastThrowResult) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      ctx.fillStyle = lastThrowResult.points > 0 ? '#00ff00' : '#ff0000';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(
        lastThrowResult.points > 0 ? `${lastThrowResult.points} POINTS!` : 'MISS!',
        CENTER_X,
        CENTER_Y - 50
      );
      
      if (lastThrowResult.points > 0) {
        ctx.font = 'bold 24px Arial';
        ctx.fillText(
          lastThrowResult.region.toUpperCase(),
          CENTER_X,
          CENTER_Y + 20
        );
      }
    }
  }, [dartThrows, isPlaying, aimX, aimY, showingResult, lastThrowResult]);

  useEffect(() => {
    drawDartboard();
  }, [drawDartboard]);

  useEffect(() => {
    return () => {
      if (gameTimerRef.current) {
        clearInterval(gameTimerRef.current);
      }
    };
  }, []);

  const averageScore = throws > 0 ? Math.round(score / throws) : 0;

  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] space-y-6">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center space-x-2">
              <span className="text-4xl">🎯</span>
              <span>Beth's Darts</span>
            </CardTitle>
            <CardDescription>
              Hit the dartboard targets - bullseyes and special spots earn SC!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground space-y-2">
              <p>• Click on the dartboard to throw darts</p>
              <p>• Bullseye = 50 points, Outer Bull = 25 points</p>
              <p>• Hit triples and doubles for multiplied scores</p>
              <p>• Higher scores = more Sweeps Coins!</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-muted p-3 rounded-lg">
                <div className="text-gold font-semibold">1000+ Points</div>
                <div className="text-xs">0.25 SC</div>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <div className="text-yellow-400 font-semibold">800+ Points</div>
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
            <div className="text-sm text-muted-foreground">Total Score</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{throws}</div>
            <div className="text-sm text-muted-foreground">Darts Thrown</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-sweep">{averageScore}</div>
            <div className="text-sm text-muted-foreground">Avg/Dart</div>
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
              className="border border-border rounded-lg cursor-crosshair"
              onClick={handleCanvasClick}
              onMouseMove={handleMouseMove}
              style={{ maxWidth: '100%', height: 'auto' }}
            />
            
            {isPlaying && (
              <div className="text-center space-y-2">
                <div className="text-lg font-semibold">
                  Click on the dartboard to throw darts!
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
                    <div className="text-xl font-bold text-sweep">{averageScore}</div>
                    <div className="text-muted-foreground">Average/Dart</div>
                  </div>
                </div>
                <div className="text-lg">
                  You earned{" "}
                  <span className="text-gold font-bold">
                    {score >= 1000 ? "0.25" : score >= 800 ? "0.20" : score >= 600 ? "0.15" : score >= 400 ? "0.10" : score >= 200 ? "0.05" : "0.00"} SC
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
