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
import { Timer, Target, Trophy, Play, RotateCcw } from "lucide-react";

interface FlickenMyBeanProps {
  userId: string;
  username: string;
  onGameComplete: (score: number, scEarned: number) => void;
}

interface Bean {
  id: number;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  color: string;
  size: number;
  active: boolean;
  scored: boolean;
}

interface Target {
  x: number;
  y: number;
  size: number;
  points: number;
  color: string;
  hit: boolean;
}

export function FlickenMyBean({
  userId,
  username,
  onGameComplete,
}: FlickenMyBeanProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [beansFlicked, setBeansFlicked] = useState(0);
  const [targetsHit, setTargetsHit] = useState(0);
  const [beans, setBeans] = useState<Bean[]>([]);
  const [targets, setTargets] = useState<Target[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragEnd, setDragEnd] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const gameTimerRef = useRef<NodeJS.Timeout>();
  const targetSpawnerRef = useRef<NodeJS.Timeout>();

  // Game dimensions
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;
  const BEAN_START_X = 100;
  const BEAN_START_Y = CANVAS_HEIGHT - 100;

  const BEAN_COLORS = ["#8B4513", "#654321", "#A0522D", "#D2691E", "#CD853F"];

  const generateTargets = useCallback(() => {
    const newTargets: Target[] = [];

    // Generate targets in different areas
    for (let i = 0; i < 8; i++) {
      const x = 200 + Math.random() * (CANVAS_WIDTH - 400);
      const y = 50 + Math.random() * (CANVAS_HEIGHT - 200);
      const size = 30 + Math.random() * 40;

      // Points based on size (smaller = more points)
      let points = Math.round(150 - size * 2);
      let color = "#00FF00";

      if (points > 100) {
        color = "#FFD700"; // Gold for high value
      } else if (points > 70) {
        color = "#FF6B00"; // Orange for medium value
      }

      newTargets.push({
        x,
        y,
        size,
        points: Math.max(points, 20),
        color,
        hit: false,
      });
    }

    return newTargets;
  }, []);

  const startGame = useCallback(() => {
    setIsPlaying(true);
    setGameStarted(true);
    setGameEnded(false);
    setTimeLeft(60);
    setScore(0);
    setBeansFlicked(0);
    setTargetsHit(0);
    setBeans([]);
    setIsDragging(false);

    const newTargets = generateTargets();
    setTargets(newTargets);

    gameTimerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Respawn targets periodically
    targetSpawnerRef.current = setInterval(() => {
      setTargets((prev) => {
        const activeTargets = prev.filter((t) => !t.hit);
        if (activeTargets.length < 3) {
          return generateTargets();
        }
        return prev;
      });
    }, 5000);
  }, [generateTargets]);

  const endGame = useCallback(() => {
    setIsPlaying(false);
    setGameEnded(true);

    if (gameTimerRef.current) {
      clearInterval(gameTimerRef.current);
    }
    if (targetSpawnerRef.current) {
      clearInterval(targetSpawnerRef.current);
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    // Calculate SC earned based on score
    let scEarned = 0;
    if (score >= 2000) scEarned = 0.25;
    else if (score >= 1600) scEarned = 0.2;
    else if (score >= 1200) scEarned = 0.15;
    else if (score >= 800) scEarned = 0.1;
    else if (score >= 400) scEarned = 0.05;

    setTimeout(() => {
      onGameComplete(score, scEarned);
    }, 2000);
  }, [score, onGameComplete]);

  const flickBean = useCallback(
    (startX: number, startY: number, endX: number, endY: number) => {
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

      if (distance < 20) return; // Minimum flick distance

      const power = Math.min(distance / 10, 15); // Limit max power
      const angle = Math.atan2(deltaY, deltaX);

      const velocityX = Math.cos(angle) * power;
      const velocityY = Math.sin(angle) * power;

      const newBean: Bean = {
        id: Date.now(),
        x: BEAN_START_X,
        y: BEAN_START_Y,
        velocityX,
        velocityY,
        color: BEAN_COLORS[Math.floor(Math.random() * BEAN_COLORS.length)],
        size: 8 + Math.random() * 4,
        active: true,
        scored: false,
      };

      setBeans((prev) => [...prev, newBean]);
      setBeansFlicked((prev) => prev + 1);
    },
    [],
  );

  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isPlaying) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      const x = (event.clientX - rect.left) * scaleX;
      const y = (event.clientY - rect.top) * scaleY;

      // Check if starting near the bean launching area
      if (Math.abs(x - BEAN_START_X) < 50 && Math.abs(y - BEAN_START_Y) < 50) {
        setIsDragging(true);
        setDragStart({ x, y });
        setDragEnd({ x, y });
      }
    },
    [isPlaying],
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      const x = (event.clientX - rect.left) * scaleX;
      const y = (event.clientY - rect.top) * scaleY;

      setMousePos({ x, y });

      if (isDragging) {
        setDragEnd({ x, y });
      }
    },
    [isDragging],
  );

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      flickBean(dragStart.x, dragStart.y, dragEnd.x, dragEnd.y);
      setIsDragging(false);
    }
  }, [isDragging, dragStart, dragEnd, flickBean]);

  const updateBeans = useCallback(() => {
    setBeans((prevBeans) =>
      prevBeans
        .map((bean) => {
          if (!bean.active) return bean;

          let newX = bean.x + bean.velocityX;
          let newY = bean.y + bean.velocityY;

          // Apply gravity
          bean.velocityY += 0.3;

          // Apply air resistance
          bean.velocityX *= 0.995;
          bean.velocityY *= 0.995;

          // Bounce off walls
          if (newX <= bean.size || newX >= CANVAS_WIDTH - bean.size) {
            bean.velocityX = -bean.velocityX * 0.7;
            newX = Math.max(
              bean.size,
              Math.min(CANVAS_WIDTH - bean.size, newX),
            );
          }

          // Bounce off floor
          if (newY >= CANVAS_HEIGHT - bean.size) {
            bean.velocityY = -bean.velocityY * 0.6;
            newY = CANVAS_HEIGHT - bean.size;

            // Stop bouncing if velocity is too low
            if (Math.abs(bean.velocityY) < 1 && Math.abs(bean.velocityX) < 1) {
              bean.active = false;
            }
          }

          // Remove beans that go off screen
          if (newX < -50 || newX > CANVAS_WIDTH + 50 || newY < -50) {
            bean.active = false;
          }

          // Check collision with targets
          if (!bean.scored) {
            targets.forEach((target) => {
              if (!target.hit) {
                const distance = Math.sqrt(
                  (newX - target.x) ** 2 + (newY - target.y) ** 2,
                );
                if (distance <= bean.size + target.size / 2) {
                  // Hit!
                  target.hit = true;
                  bean.scored = true;
                  setScore((prev) => prev + target.points);
                  setTargetsHit((prev) => prev + 1);
                }
              }
            });
          }

          return { ...bean, x: newX, y: newY };
        })
        .filter((bean) => bean.active || Date.now() - bean.id < 10000),
    );
  }, [targets]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas with sky gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, "#87CEEB");
    gradient.addColorStop(1, "#98FB98");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw ground
    ctx.fillStyle = "#8B7355";
    ctx.fillRect(0, CANVAS_HEIGHT - 50, CANVAS_WIDTH, 50);

    // Draw launching area
    ctx.fillStyle = "#654321";
    ctx.beginPath();
    ctx.arc(BEAN_START_X, BEAN_START_Y, 30, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#8B4513";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.fillText("START", BEAN_START_X, BEAN_START_Y + 4);

    // Draw targets
    targets.forEach((target) => {
      if (target.hit) {
        // Hit target with explosion effect
        ctx.fillStyle = "#FFD700";
        ctx.globalAlpha = 0.5;
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2;
          const x = target.x + Math.cos(angle) * target.size;
          const y = target.y + Math.sin(angle) * target.size;
          ctx.beginPath();
          ctx.arc(x, y, 8, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      } else {
        // Active target
        ctx.fillStyle = target.color;
        ctx.beginPath();
        ctx.arc(target.x, target.y, target.size / 2, 0, Math.PI * 2);
        ctx.fill();

        // Target rings
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(target.x, target.y, target.size / 2, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(target.x, target.y, target.size / 4, 0, Math.PI * 2);
        ctx.stroke();

        // Points text
        ctx.fillStyle = "#000000";
        ctx.font = "bold 12px Arial";
        ctx.textAlign = "center";
        ctx.fillText(target.points.toString(), target.x, target.y + 4);
      }
    });

    // Draw beans
    beans.forEach((bean) => {
      if (!bean.active) return;

      ctx.fillStyle = bean.color;
      ctx.beginPath();
      ctx.arc(bean.x, bean.y, bean.size, 0, Math.PI * 2);
      ctx.fill();

      // Bean highlight
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      ctx.beginPath();
      ctx.arc(
        bean.x - bean.size * 0.3,
        bean.y - bean.size * 0.3,
        bean.size * 0.3,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    });

    // Draw trajectory line when dragging
    if (isDragging) {
      const deltaX = dragEnd.x - dragStart.x;
      const deltaY = dragEnd.y - dragStart.y;
      const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

      if (distance > 20) {
        // Draw trajectory line
        ctx.strokeStyle = "#FFD700";
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(BEAN_START_X, BEAN_START_Y);

        // Extend line to show trajectory
        const multiplier = 3;
        const endX = BEAN_START_X + deltaX * multiplier;
        const endY = BEAN_START_Y + deltaY * multiplier;
        ctx.lineTo(endX, endY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Power indicator
        const power = Math.min(distance / 10, 15);
        const powerPercent = (power / 15) * 100;

        ctx.fillStyle =
          powerPercent > 80
            ? "#FF0000"
            : powerPercent > 50
              ? "#FFD700"
              : "#00FF00";
        ctx.fillRect(BEAN_START_X - 30, BEAN_START_Y - 60, 60, 10);

        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(
          BEAN_START_X - 30,
          BEAN_START_Y - 60,
          (60 * powerPercent) / 100,
          10,
        );

        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 1;
        ctx.strokeRect(BEAN_START_X - 30, BEAN_START_Y - 60, 60, 10);
      }
    }

    // Draw aim helper (crosshair at mouse)
    if (isPlaying && !isDragging) {
      ctx.strokeStyle = "#FF0000";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(mousePos.x - 10, mousePos.y);
      ctx.lineTo(mousePos.x + 10, mousePos.y);
      ctx.moveTo(mousePos.x, mousePos.y - 10);
      ctx.lineTo(mousePos.x, mousePos.y + 10);
      ctx.stroke();
    }
  }, [beans, targets, isDragging, dragStart, dragEnd, mousePos, isPlaying]);

  const animate = useCallback(() => {
    updateBeans();
    draw();
    animationRef.current = requestAnimationFrame(animate);
  }, [updateBeans, draw]);

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
      if (targetSpawnerRef.current) {
        clearInterval(targetSpawnerRef.current);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const accuracy =
    beansFlicked > 0 ? Math.round((targetsHit / beansFlicked) * 100) : 0;

  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] space-y-6">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center space-x-2">
              <span className="text-4xl">🫘</span>
              <span>Flicken' My Bean</span>
            </CardTitle>
            <CardDescription>
              Fast-paced bean flicking action - click and drag to score!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground space-y-2">
              <p>• Click and drag from the start area to flick beans</p>
              <p>• Aim for targets to score points</p>
              <p>• Smaller targets = more points</p>
              <p>• Longer drags = more power</p>
              <p>• Physics-based gameplay with bouncing!</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-muted p-3 rounded-lg">
                <div className="text-gold font-semibold">2000+ Points</div>
                <div className="text-xs">0.25 SC</div>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <div className="text-yellow-400 font-semibold">
                  1600+ Points
                </div>
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
            <div className="text-2xl font-bold text-sweep">{targetsHit}</div>
            <div className="text-sm text-muted-foreground">Targets Hit</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">
              {beansFlicked}
            </div>
            <div className="text-sm text-muted-foreground">Beans Flicked</div>
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
            <div className="text-2xl font-bold text-casino-red">
              {timeLeft}s
            </div>
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
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{ maxWidth: "100%", height: "auto" }}
            />

            {isPlaying && (
              <div className="text-center space-y-2">
                <div className="text-lg font-semibold">
                  {isDragging
                    ? "Release to flick!"
                    : "Click and drag from START to flick beans at targets!"}
                </div>
                <Progress
                  value={((60 - timeLeft) / 60) * 100}
                  className="w-64"
                />
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
                    <div className="text-xl font-bold text-sweep">
                      {accuracy}%
                    </div>
                    <div className="text-muted-foreground">Accuracy</div>
                  </div>
                </div>
                <div className="text-lg">
                  You earned{" "}
                  <span className="text-gold font-bold">
                    {score >= 2000
                      ? "0.25"
                      : score >= 1600
                        ? "0.20"
                        : score >= 1200
                          ? "0.15"
                          : score >= 800
                            ? "0.10"
                            : score >= 400
                              ? "0.05"
                              : "0.00"}{" "}
                    SC
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
