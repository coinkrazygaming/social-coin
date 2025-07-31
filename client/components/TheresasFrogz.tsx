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

interface TheresasFrogzProps {
  userId: string;
  username: string;
  onGameComplete: (score: number, scEarned: number) => void;
}

interface Frog {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  isJumping: boolean;
  jumpProgress: number;
  onPad: boolean;
}

interface LilyPad {
  x: number;
  y: number;
  size: number;
  occupied: boolean;
  sinking: boolean;
  sinkProgress: number;
}

interface Fly {
  x: number;
  y: number;
  caught: boolean;
  points: number;
  type: "normal" | "golden" | "big";
}

interface Ripple {
  x: number;
  y: number;
  size: number;
  timestamp: number;
}

export function TheresasFrogz({
  userId,
  username,
  onGameComplete,
}: TheresasFrogzProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [fliesCaught, setFliesCaught] = useState(0);
  const [jumps, setJumps] = useState(0);
  const [frog, setFrog] = useState<Frog>({
    x: 100,
    y: 500,
    targetX: 100,
    targetY: 500,
    isJumping: false,
    jumpProgress: 0,
    onPad: false,
  });
  const [lilyPads, setLilyPads] = useState<LilyPad[]>([]);
  const [flies, setFlies] = useState<Fly[]>([]);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const gameTimerRef = useRef<NodeJS.Timeout>();
  const flySpawnerRef = useRef<NodeJS.Timeout>();

  // Game dimensions
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;
  const WATER_LEVEL = 550;

  const generateLilyPads = useCallback(() => {
    const pads: LilyPad[] = [];

    // Starting pad
    pads.push({
      x: 100,
      y: 500,
      size: 60,
      occupied: true,
      sinking: false,
      sinkProgress: 0,
    });

    // Generate random lily pads
    for (let i = 0; i < 12; i++) {
      let x, y;
      let validPosition = false;
      let attempts = 0;

      do {
        x = 150 + Math.random() * (CANVAS_WIDTH - 300);
        y = 100 + Math.random() * 350;

        validPosition = true;
        // Check distance from other pads
        for (const pad of pads) {
          const distance = Math.sqrt((x - pad.x) ** 2 + (y - pad.y) ** 2);
          if (distance < 80) {
            validPosition = false;
            break;
          }
        }
        attempts++;
      } while (!validPosition && attempts < 50);

      if (validPosition) {
        pads.push({
          x,
          y,
          size: 40 + Math.random() * 30,
          occupied: false,
          sinking: false,
          sinkProgress: 0,
        });
      }
    }

    return pads;
  }, []);

  const generateFly = useCallback(() => {
    const types: ("normal" | "golden" | "big")[] = [
      "normal",
      "normal",
      "normal",
      "golden",
      "big",
    ];
    const type = types[Math.floor(Math.random() * types.length)];

    let points = 50;
    if (type === "golden") points = 200;
    else if (type === "big") points = 100;

    return {
      x: 50 + Math.random() * (CANVAS_WIDTH - 100),
      y: 50 + Math.random() * 400,
      caught: false,
      points,
      type,
    };
  }, []);

  const startGame = useCallback(() => {
    setIsPlaying(true);
    setGameStarted(true);
    setGameEnded(false);
    setGameOver(false);
    setTimeLeft(60);
    setScore(0);
    setFliesCaught(0);
    setJumps(0);
    setFrog({
      x: 100,
      y: 500,
      targetX: 100,
      targetY: 500,
      isJumping: false,
      jumpProgress: 0,
      onPad: true,
    });
    setRipples([]);

    const pads = generateLilyPads();
    setLilyPads(pads);

    // Generate initial flies
    const initialFlies = Array.from({ length: 5 }, generateFly);
    setFlies(initialFlies);

    gameTimerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Spawn flies periodically
    flySpawnerRef.current = setInterval(() => {
      setFlies((prev) => {
        const activeFlies = prev.filter((f) => !f.caught);
        if (activeFlies.length < 6) {
          return [...prev, generateFly()];
        }
        return prev;
      });
    }, 2000);
  }, [generateLilyPads, generateFly]);

  const endGame = useCallback(() => {
    setIsPlaying(false);
    setGameEnded(true);

    if (gameTimerRef.current) {
      clearInterval(gameTimerRef.current);
    }
    if (flySpawnerRef.current) {
      clearInterval(flySpawnerRef.current);
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

  const handleCanvasClick = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isPlaying || frog.isJumping || gameOver) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      const clickX = (event.clientX - rect.left) * scaleX;
      const clickY = (event.clientY - rect.top) * scaleY;

      // Check if clicking on a lily pad
      const targetPad = lilyPads.find((pad) => {
        if (pad.sinking) return false;
        const distance = Math.sqrt(
          (clickX - pad.x) ** 2 + (clickY - pad.y) ** 2,
        );
        return distance <= pad.size / 2;
      });

      if (targetPad) {
        // Start jump to lily pad
        setJumps((prev) => prev + 1);
        setFrog((prev) => ({
          ...prev,
          targetX: targetPad.x,
          targetY: targetPad.y,
          isJumping: true,
          jumpProgress: 0,
          onPad: false,
        }));

        // Mark current pad as unoccupied
        setLilyPads((prev) =>
          prev.map((pad) =>
            pad.x === frog.x && pad.y === frog.y
              ? { ...pad, occupied: false }
              : pad,
          ),
        );
      }
    },
    [isPlaying, frog, gameOver, lilyPads],
  );

  const updateFrog = useCallback(() => {
    if (frog.isJumping) {
      setFrog((prev) => {
        const newProgress = prev.jumpProgress + 0.08;

        if (newProgress >= 1) {
          // Jump completed
          const targetPad = lilyPads.find(
            (pad) =>
              Math.abs(pad.x - prev.targetX) < 10 &&
              Math.abs(pad.y - prev.targetY) < 10,
          );

          if (targetPad && !targetPad.sinking) {
            // Landed on pad successfully
            setLilyPads((prevPads) =>
              prevPads.map((pad) =>
                pad === targetPad
                  ? { ...pad, occupied: true, sinking: true }
                  : pad.x === prev.x && pad.y === prev.y
                    ? { ...pad, occupied: false }
                    : pad,
              ),
            );

            // Check for flies to catch
            setFlies((prevFlies) =>
              prevFlies.map((fly) => {
                if (!fly.caught) {
                  const distance = Math.sqrt(
                    (fly.x - prev.targetX) ** 2 + (fly.y - prev.targetY) ** 2,
                  );
                  if (distance <= 40) {
                    setFliesCaught((prev) => prev + 1);
                    setScore((prevScore) => prevScore + fly.points);
                    return { ...fly, caught: true };
                  }
                }
                return fly;
              }),
            );

            return {
              ...prev,
              x: prev.targetX,
              y: prev.targetY,
              isJumping: false,
              jumpProgress: 0,
              onPad: true,
            };
          } else {
            // Missed lily pad - fall in water (game over)
            setGameOver(true);
            setTimeout(endGame, 1500);

            // Add splash ripple
            setRipples((prevRipples) => [
              ...prevRipples,
              {
                x: prev.targetX,
                y: prev.targetY,
                size: 0,
                timestamp: Date.now(),
              },
            ]);

            return {
              ...prev,
              x: prev.targetX,
              y: prev.targetY,
              isJumping: false,
              jumpProgress: 0,
              onPad: false,
            };
          }
        }

        // Interpolate position during jump with arc
        const t = newProgress;
        const jumpHeight = Math.sin(t * Math.PI) * 100;

        return {
          ...prev,
          x: prev.x + (prev.targetX - prev.x) * t,
          y: prev.y + (prev.targetY - prev.y) * t - jumpHeight,
          jumpProgress: newProgress,
        };
      });
    }
  }, [frog, lilyPads, endGame]);

  const updateLilyPads = useCallback(() => {
    setLilyPads((prev) =>
      prev.map((pad) => {
        if (pad.sinking && pad.occupied && !frog.isJumping) {
          const newSinkProgress = pad.sinkProgress + 0.01;

          if (newSinkProgress >= 1) {
            // Pad fully sunk - game over if frog is on it
            if (pad.x === frog.x && pad.y === frog.y) {
              setGameOver(true);
              setTimeout(endGame, 1500);
            }
          }

          return { ...pad, sinkProgress: Math.min(newSinkProgress, 1) };
        }
        return pad;
      }),
    );
  }, [frog, endGame]);

  const updateRipples = useCallback(() => {
    const currentTime = Date.now();
    setRipples((prev) =>
      prev
        .map((ripple) => ({
          ...ripple,
          size: ripple.size + 2,
        }))
        .filter((ripple) => currentTime - ripple.timestamp < 2000),
    );
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas with water background
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, "#87CEEB");
    gradient.addColorStop(0.8, "#4682B4");
    gradient.addColorStop(1, "#2F4F4F");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw water ripples
    ripples.forEach((ripple) => {
      ctx.strokeStyle = `rgba(255, 255, 255, ${1 - ripple.size / 100})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(ripple.x, ripple.y, ripple.size, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Draw lily pads
    lilyPads.forEach((pad) => {
      const sinkOffset = pad.sinkProgress * 20;

      // Lily pad shadow in water
      if (pad.sinkProgress > 0) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
        ctx.beginPath();
        ctx.arc(pad.x, pad.y + sinkOffset, pad.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Lily pad
      ctx.fillStyle = pad.sinking
        ? `rgba(34, 139, 34, ${1 - pad.sinkProgress * 0.7})`
        : "#228B22";
      ctx.beginPath();
      ctx.arc(pad.x, pad.y + sinkOffset, pad.size / 2, 0, Math.PI * 2);
      ctx.fill();

      // Lily pad details
      if (pad.sinkProgress < 0.8) {
        ctx.strokeStyle = "#006400";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Notch in lily pad
        ctx.strokeStyle = "#4682B4";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(pad.x, pad.y + sinkOffset - pad.size / 2);
        ctx.lineTo(pad.x, pad.y + sinkOffset);
        ctx.stroke();
      }
    });

    // Draw flies
    flies.forEach((fly) => {
      if (fly.caught) return;

      const time = Date.now() * 0.01;
      const bobOffset = Math.sin(time + fly.x * 0.01) * 3;

      // Fly body
      let flyColor = "#000000";
      let flySize = 4;

      if (fly.type === "golden") {
        flyColor = "#FFD700";
        flySize = 5;
      } else if (fly.type === "big") {
        flyColor = "#4169E1";
        flySize = 7;
      }

      ctx.fillStyle = flyColor;
      ctx.beginPath();
      ctx.arc(fly.x, fly.y + bobOffset, flySize, 0, Math.PI * 2);
      ctx.fill();

      // Fly wings
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.beginPath();
      ctx.ellipse(
        fly.x - 3,
        fly.y + bobOffset - 2,
        3,
        1,
        Math.sin(time * 10) * 0.2,
        0,
        Math.PI * 2,
      );
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(
        fly.x + 3,
        fly.y + bobOffset - 2,
        3,
        1,
        -Math.sin(time * 10) * 0.2,
        0,
        Math.PI * 2,
      );
      ctx.fill();

      // Golden fly sparkle
      if (fly.type === "golden") {
        ctx.fillStyle = "#FFFF00";
        ctx.beginPath();
        ctx.arc(
          fly.x + Math.sin(time * 5) * 8,
          fly.y + bobOffset + Math.cos(time * 5) * 8,
          2,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }
    });

    // Draw frog
    ctx.save();
    ctx.translate(frog.x, frog.y);

    // Frog body
    ctx.fillStyle = gameOver ? "#8B0000" : "#228B22";
    ctx.beginPath();
    ctx.ellipse(0, 0, 25, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    // Frog spots
    ctx.fillStyle = "#006400";
    ctx.beginPath();
    ctx.arc(-8, -5, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(8, -5, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, 8, 3, 0, Math.PI * 2);
    ctx.fill();

    // Frog eyes
    ctx.fillStyle = "#32CD32";
    ctx.beginPath();
    ctx.arc(-10, -15, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(10, -15, 6, 0, Math.PI * 2);
    ctx.fill();

    // Eye pupils
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.arc(-10, -15, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(10, -15, 3, 0, Math.PI * 2);
    ctx.fill();

    // Frog legs (when jumping)
    if (frog.isJumping) {
      ctx.strokeStyle = "#228B22";
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(-15, 10);
      ctx.lineTo(-25, 25);
      ctx.moveTo(15, 10);
      ctx.lineTo(25, 25);
      ctx.stroke();
    }

    ctx.restore();

    // Game over overlay
    if (gameOver) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      ctx.fillStyle = "#FF0000";
      ctx.font = "bold 48px Arial";
      ctx.textAlign = "center";
      ctx.fillText("SPLASHED!", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "24px Arial";
      ctx.fillText(
        "The frog fell in the water!",
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT / 2 + 50,
      );
    }
  }, [frog, lilyPads, flies, ripples, gameOver]);

  const animate = useCallback(() => {
    updateFrog();
    updateLilyPads();
    updateRipples();
    draw();
    animationRef.current = requestAnimationFrame(animate);
  }, [updateFrog, updateLilyPads, updateRipples, draw]);

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
      if (flySpawnerRef.current) {
        clearInterval(flySpawnerRef.current);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const efficiency = jumps > 0 ? Math.round((fliesCaught / jumps) * 100) : 0;

  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] space-y-6">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center space-x-2">
              <span className="text-4xl">🐸</span>
              <span>Theresa's Frogz</span>
            </CardTitle>
            <CardDescription>
              Hop across lily pads and catch flies for points!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground space-y-2">
              <p>• Click on lily pads to jump to them</p>
              <p>• Catch flies by landing near them</p>
              <p>• Lily pads sink after you land on them</p>
              <p>• Don't fall in the water!</p>
              <p>• Golden flies = 200 points, Big flies = 100 points</p>
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
            <div className="text-2xl font-bold text-sweep">{fliesCaught}</div>
            <div className="text-sm text-muted-foreground">Flies Caught</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{jumps}</div>
            <div className="text-sm text-muted-foreground">Jumps</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {efficiency}%
            </div>
            <div className="text-sm text-muted-foreground">Efficiency</div>
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
              className="border border-border rounded-lg cursor-pointer"
              onClick={handleCanvasClick}
              style={{ maxWidth: "100%", height: "auto" }}
            />

            {isPlaying && !gameOver && (
              <div className="text-center space-y-2">
                <div className="text-lg font-semibold">
                  {frog.isJumping
                    ? "Jumping..."
                    : "Click on a lily pad to jump to it!"}
                </div>
                <Progress
                  value={((60 - timeLeft) / 60) * 100}
                  className="w-64"
                />
                <div className="flex space-x-4 text-sm">
                  <Badge
                    variant="outline"
                    className="bg-green-500/20 text-green-400"
                  >
                    Normal Fly: +50
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-blue-500/20 text-blue-400"
                  >
                    Big Fly: +100
                  </Badge>
                  <Badge variant="outline" className="bg-gold/20 text-gold">
                    Golden Fly: +200
                  </Badge>
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
                    <div className="text-xl font-bold text-sweep">
                      {fliesCaught}
                    </div>
                    <div className="text-muted-foreground">Flies Caught</div>
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
