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
  success: boolean;
  timestamp: number;
}

export function ColinShots({
  userId,
  username,
  onGameComplete,
}: ColinShotsProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [shots, setShots] = useState<ShotAttempt[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [ballPosition, setBallPosition] = useState({ x: 400, y: 500 });
  const [isShootingAnimation, setIsShootingAnimation] = useState(false);
  const [power, setPower] = useState(0);
  const [isPowerBuilding, setIsPowerBuilding] = useState(false);

  const gameAreaRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const powerTimerRef = useRef<NodeJS.Timeout | null>(null);

  const GAME_DURATION = 60; // seconds
  const MAX_ATTEMPTS = 25;
  const HOOP_POSITION = { x: 400, y: 120 };
  const HOOP_RADIUS = 40;

  // Initialize ball position
  useEffect(() => {
    if (gameAreaRef.current) {
      const rect = gameAreaRef.current.getBoundingClientRect();
      setBallPosition({ x: rect.width / 2, y: rect.height - 80 });
    }
  }, []);

  const startGame = () => {
    setGameStarted(true);
    setIsPlaying(true);
    setTimeLeft(GAME_DURATION);
    setScore(0);
    setAttempts(0);
    setShots([]);
    setGameCompleted(false);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const endGame = useCallback(() => {
    setIsPlaying(false);
    setGameCompleted(true);
    setIsPowerBuilding(false);
    setPower(0);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (powerTimerRef.current) {
      clearInterval(powerTimerRef.current);
    }

    // Calculate SC earned (max 0.25 SC)
    const scorePercentage = score / MAX_ATTEMPTS;
    const scEarned = Math.min(
      0.25,
      Math.round(scorePercentage * 0.25 * 100) / 100,
    );

    onGameComplete(score, scEarned);
  }, [score, onGameComplete]);

  // Handle game completion when max attempts reached
  useEffect(() => {
    if (attempts >= MAX_ATTEMPTS && isPlaying) {
      endGame();
    }
  }, [attempts, isPlaying, endGame]);

  const startPowerBuilding = () => {
    if (!isPlaying || isPowerBuilding || attempts >= MAX_ATTEMPTS) return;

    setIsPowerBuilding(true);
    setPower(0);

    powerTimerRef.current = setInterval(() => {
      setPower((prev) => {
        const newPower = prev + 2;
        if (newPower >= 100) {
          return 100;
        }
        return newPower;
      });
    }, 20);
  };

  const shootBall = () => {
    if (!isPowerBuilding || !isPlaying) return;

    setIsPowerBuilding(false);
    if (powerTimerRef.current) {
      clearInterval(powerTimerRef.current);
    }

    setIsShootingAnimation(true);
    setAttempts((prev) => prev + 1);

    // Calculate shot success based on power (sweet spot around 70-85)
    const accuracy = power >= 65 && power <= 90 ? 0.8 : 0.3;
    const randomFactor = Math.random();
    const isSuccess = randomFactor < accuracy;

    if (isSuccess) {
      setScore((prev) => prev + 1);
    }

    const newShot: ShotAttempt = {
      id: Date.now(),
      x: ballPosition.x,
      y: ballPosition.y,
      success: isSuccess,
      timestamp: Date.now(),
    };

    setShots((prev) => [...prev, newShot]);

    // Reset for next shot
    setTimeout(() => {
      setIsShootingAnimation(false);
      setPower(0);
      // Reset ball position
      if (gameAreaRef.current) {
        const rect = gameAreaRef.current.getBoundingClientRect();
        setBallPosition({ x: rect.width / 2, y: rect.height - 80 });
      }
    }, 1000);
  };

  const resetGame = () => {
    setGameStarted(false);
    setIsPlaying(false);
    setGameCompleted(false);
    setTimeLeft(GAME_DURATION);
    setScore(0);
    setAttempts(0);
    setShots([]);
    setPower(0);
    setIsPowerBuilding(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (powerTimerRef.current) {
      clearInterval(powerTimerRef.current);
    }
  };

  const getScoreColor = () => {
    const percentage = score / MAX_ATTEMPTS;
    if (percentage >= 0.8) return "text-casino-green";
    if (percentage >= 0.6) return "text-gold";
    if (percentage >= 0.4) return "text-yellow-400";
    return "text-muted-foreground";
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="overflow-hidden">
        <CardHeader className="text-center bg-gradient-to-r from-gold/20 to-sweep/20">
          <div className="flex items-center justify-center mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-gold to-yellow-400 rounded-full flex items-center justify-center mr-3">
              🏀
            </div>
            <div>
              <CardTitle className="text-2xl">Colin Shots</CardTitle>
              <CardDescription>
                Make free throws to earn Sweeps Coins!
              </CardDescription>
            </div>
          </div>

          {/* Game Stats */}
          <div className="flex justify-center space-x-6 mt-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${getScoreColor()}`}>
                {score}
              </div>
              <div className="text-sm text-muted-foreground">Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-sweep">{attempts}</div>
              <div className="text-sm text-muted-foreground">Attempts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {timeLeft}s
              </div>
              <div className="text-sm text-muted-foreground">Time Left</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 space-y-2">
            <Progress value={(attempts / MAX_ATTEMPTS) * 100} className="h-2" />
            <div className="text-xs text-muted-foreground">
              Attempts: {attempts}/{MAX_ATTEMPTS}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Game Area */}
          <div
            ref={gameAreaRef}
            className="relative w-full h-96 bg-gradient-to-b from-blue-900 via-blue-800 to-green-800 overflow-hidden"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: "100px 100px",
            }}
          >
            {/* Basketball Hoop */}
            <div
              className="absolute"
              style={{
                left: HOOP_POSITION.x - HOOP_RADIUS,
                top: HOOP_POSITION.y - 10,
                width: HOOP_RADIUS * 2,
                height: 20,
              }}
            >
              <div className="w-full h-full bg-orange-500 rounded-full border-4 border-orange-600 relative">
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-1 h-6 bg-orange-600"></div>
                <div className="absolute -bottom-6 left-1/4 w-1 h-6 bg-orange-600"></div>
                <div className="absolute -bottom-6 right-1/4 w-1 h-6 bg-orange-600"></div>
              </div>
            </div>

            {/* Basketball */}
            <div
              className={`absolute transition-all duration-1000 ${isShootingAnimation ? "animate-bounce" : ""}`}
              style={{
                left: ballPosition.x - 15,
                top: isShootingAnimation
                  ? HOOP_POSITION.y + 10
                  : ballPosition.y - 15,
                transition: isShootingAnimation
                  ? "all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
                  : "none",
              }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-700 rounded-full relative border-2 border-orange-800">
                <div className="absolute inset-0 rounded-full">
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-black transform -translate-y-0.5"></div>
                  <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-black transform -translate-x-0.5"></div>
                </div>
              </div>
            </div>

            {/* Shot Trail Effects */}
            {shots.slice(-5).map((shot, index) => (
              <div
                key={shot.id}
                className={`absolute w-2 h-2 rounded-full ${shot.success ? "bg-casino-green" : "bg-casino-red"} opacity-50`}
                style={{
                  left: shot.x,
                  top: shot.y + index * 10,
                  animation: "fadeOut 2s ease-out forwards",
                }}
              />
            ))}

            {/* Power Meter */}
            {isPowerBuilding && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-48 bg-black/50 rounded-lg p-3">
                <div className="text-white text-sm mb-2 text-center">
                  Power: {power}%
                </div>
                <div className="w-full bg-gray-700 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full transition-all duration-75 ${
                      power >= 65 && power <= 90
                        ? "bg-casino-green"
                        : "bg-casino-red"
                    }`}
                    style={{ width: `${power}%` }}
                  ></div>
                </div>
                <div className="text-xs text-white mt-1 text-center">
                  {power >= 65 && power <= 90
                    ? "Perfect Zone!"
                    : "Adjust Power"}
                </div>
              </div>
            )}

            {/* Game Instructions */}
            {!gameStarted && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <div className="text-center text-white space-y-4 p-6 bg-black/50 rounded-lg">
                  <h3 className="text-xl font-bold">How to Play Colin Shots</h3>
                  <div className="space-y-2 text-sm">
                    <p>🏀 Click and hold to build power</p>
                    <p>🎯 Release when in the green zone for best accuracy</p>
                    <p>⏱️ You have 60 seconds to score as many as possible</p>
                    <p>🪙 Earn up to 0.25 SC based on your performance</p>
                    <p>🔄 Play once every 24 hours</p>
                  </div>
                </div>
              </div>
            )}

            {/* Game Over Screen */}
            {gameCompleted && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                <div className="text-center text-white space-y-4 p-6 bg-black/70 rounded-lg">
                  <Trophy className="w-16 h-16 mx-auto text-gold" />
                  <h3 className="text-2xl font-bold">Game Complete!</h3>
                  <div className="space-y-2">
                    <p className="text-lg">
                      Final Score:{" "}
                      <span className="text-gold font-bold">
                        {score}/{MAX_ATTEMPTS}
                      </span>
                    </p>
                    <p className="text-lg">
                      Accuracy:{" "}
                      <span className="text-sweep font-bold">
                        {Math.round((score / attempts) * 100) || 0}%
                      </span>
                    </p>
                    <p className="text-lg">
                      SC Earned:{" "}
                      <span className="text-casino-green font-bold">
                        {Math.min(
                          0.25,
                          Math.round((score / MAX_ATTEMPTS) * 0.25 * 100) / 100,
                        )}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Game Controls */}
          <div className="p-6 bg-card/50">
            {!gameStarted ? (
              <Button
                onClick={startGame}
                className="w-full bg-gradient-to-r from-gold to-yellow-400 text-gold-foreground hover:from-yellow-400 hover:to-gold text-lg py-6"
                size="lg"
              >
                <Play className="h-5 w-5 mr-2" />
                Start Colin Shots
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
              <div className="space-y-4">
                <Button
                  onMouseDown={startPowerBuilding}
                  onMouseUp={shootBall}
                  onTouchStart={startPowerBuilding}
                  onTouchEnd={shootBall}
                  disabled={attempts >= MAX_ATTEMPTS || isShootingAnimation}
                  className="w-full bg-gradient-to-r from-casino-green to-green-600 text-white hover:from-green-600 hover:to-casino-green text-lg py-6"
                  size="lg"
                >
                  {isPowerBuilding ? (
                    <>
                      <Pause className="h-5 w-5 mr-2" />
                      Release to Shoot!
                    </>
                  ) : (
                    <>
                      <Target className="h-5 w-5 mr-2" />
                      Hold to Build Power
                    </>
                  )}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  Shots Remaining: {MAX_ATTEMPTS - attempts}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <style>{`
        @keyframes fadeOut {
          from { opacity: 0.5; }
          to { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
