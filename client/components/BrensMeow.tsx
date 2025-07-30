import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Timer, Trophy, Play, RotateCcw, Crown } from "lucide-react";

interface BrensMeowProps {
  userId: string;
  username: string;
  onGameComplete: (score: number, scEarned: number) => void;
}

interface Dog {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  speed: number;
  caught: boolean;
}

interface Cage {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface LeaderboardEntry {
  username: string;
  score: number;
  scEarned: number;
  date: string;
}

export function BrensMeow({ userId, username, onGameComplete }: BrensMeowProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [cage, setCage] = useState<Cage>({ x: 300, y: 300, width: 60, height: 60 });
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [coinAnimations, setCoinAnimations] = useState<{id: number, x: number, y: number}[]>([]);

  const gameAreaRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const dogSpawnRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<number>();

  const GAME_DURATION = 60;
  const MAX_DOGS = 15;
  const DOG_SPAWN_INTERVAL = 1500;
  const CAGE_SPEED = 5;

  const spawnDog = useCallback(() => {
    if (!gameAreaRef.current || dogs.length >= MAX_DOGS) return;

    const rect = gameAreaRef.current.getBoundingClientRect();
    const edge = Math.floor(Math.random() * 4);
    let x, y;

    switch (edge) {
      case 0: // Top
        x = Math.random() * rect.width;
        y = -30;
        break;
      case 1: // Right
        x = rect.width + 30;
        y = Math.random() * rect.height;
        break;
      case 2: // Bottom
        x = Math.random() * rect.width;
        y = rect.height + 30;
        break;
      default: // Left
        x = -30;
        y = Math.random() * rect.height;
    }

    const newDog: Dog = {
      id: Date.now() + Math.random(),
      x,
      y,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      size: 25 + Math.random() * 15,
      speed: 1 + Math.random() * 2,
      caught: false,
    };

    setDogs(prev => [...prev, newDog]);
  }, [dogs.length]);

  const updateDogs = useCallback(() => {
    if (!gameAreaRef.current) return;

    const rect = gameAreaRef.current.getBoundingClientRect();
    
    setDogs(prev => prev.map(dog => {
      if (dog.caught) return dog;

      // Calculate distance to cage (for avoidance behavior)
      const dx = cage.x - dog.x;
      const dy = cage.y - dog.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      let newVx = dog.vx;
      let newVy = dog.vy;

      // Smart avoidance: dogs run away from cage when it gets close
      if (distance < 100) {
        const avoidanceStrength = (100 - distance) / 100;
        newVx -= (dx / distance) * avoidanceStrength * 3;
        newVy -= (dy / distance) * avoidanceStrength * 3;
      }

      // Add some randomness to movement
      newVx += (Math.random() - 0.5) * 0.5;
      newVy += (Math.random() - 0.5) * 0.5;

      // Limit speed
      const speed = Math.sqrt(newVx * newVx + newVy * newVy);
      if (speed > dog.speed) {
        newVx = (newVx / speed) * dog.speed;
        newVy = (newVy / speed) * dog.speed;
      }

      let newX = dog.x + newVx;
      let newY = dog.y + newVy;

      // Bounce off walls
      if (newX < 0 || newX > rect.width) {
        newVx = -newVx;
        newX = Math.max(0, Math.min(rect.width, newX));
      }
      if (newY < 0 || newY > rect.height) {
        newVy = -newVy;
        newY = Math.max(0, Math.min(rect.height, newY));
      }

      return { ...dog, x: newX, y: newY, vx: newVx, vy: newVy };
    }).filter(dog => !dog.caught));
  }, [cage]);

  const checkCollisions = useCallback(() => {
    setDogs(prev => prev.map(dog => {
      if (dog.caught) return dog;

      // Check if dog is inside cage
      if (dog.x >= cage.x && 
          dog.x <= cage.x + cage.width &&
          dog.y >= cage.y && 
          dog.y <= cage.y + cage.height) {
        
        // Dog caught!
        setScore(s => s + 1);
        
        // Add coin animation
        setCoinAnimations(coins => [...coins, {
          id: Date.now(),
          x: dog.x,
          y: dog.y
        }]);

        // Remove coin animation after delay
        setTimeout(() => {
          setCoinAnimations(coins => coins.filter(coin => coin.id !== Date.now()));
        }, 1000);

        return { ...dog, caught: true };
      }

      return dog;
    }));
  }, [cage]);

  const moveCage = useCallback(() => {
    if (!gameAreaRef.current) return;

    const rect = gameAreaRef.current.getBoundingClientRect();
    let newX = cage.x;
    let newY = cage.y;

    if (keysPressed.has('ArrowLeft') || keysPressed.has('a') || keysPressed.has('A')) {
      newX -= CAGE_SPEED;
    }
    if (keysPressed.has('ArrowRight') || keysPressed.has('d') || keysPressed.has('D')) {
      newX += CAGE_SPEED;
    }
    if (keysPressed.has('ArrowUp') || keysPressed.has('w') || keysPressed.has('W')) {
      newY -= CAGE_SPEED;
    }
    if (keysPressed.has('ArrowDown') || keysPressed.has('s') || keysPressed.has('S')) {
      newY += CAGE_SPEED;
    }

    // Keep cage within bounds
    newX = Math.max(0, Math.min(rect.width - cage.width, newX));
    newY = Math.max(0, Math.min(rect.height - cage.height, newY));

    setCage(prev => ({ ...prev, x: newX, y: newY }));
  }, [cage, keysPressed]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeysPressed(prev => new Set([...prev, e.key]));
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
  }, []);

  const startGame = () => {
    setGameStarted(true);
    setIsPlaying(true);
    setTimeLeft(GAME_DURATION);
    setScore(0);
    setDogs([]);
    setCoinAnimations([]);
    setGameCompleted(false);

    // Reset cage position
    if (gameAreaRef.current) {
      const rect = gameAreaRef.current.getBoundingClientRect();
      setCage({ x: rect.width / 2 - 30, y: rect.height / 2 - 30, width: 60, height: 60 });
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

    dogSpawnRef.current = setInterval(spawnDog, DOG_SPAWN_INTERVAL);
    
    // Spawn initial dogs
    setTimeout(spawnDog, 500);
    setTimeout(spawnDog, 1000);
  };

  const endGame = useCallback(() => {
    setIsPlaying(false);
    setGameCompleted(true);

    if (timerRef.current) clearInterval(timerRef.current);
    if (dogSpawnRef.current) clearInterval(dogSpawnRef.current);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);

    const scEarned = Math.min(0.25, score * 0.01);
    
    // Add to leaderboard
    const newEntry: LeaderboardEntry = {
      username: username || 'Anonymous',
      score,
      scEarned,
      date: new Date().toLocaleDateString(),
    };

    setLeaderboard(prev => {
      const updated = [...prev, newEntry].sort((a, b) => b.score - a.score).slice(0, 10);
      localStorage.setItem('brens-meow-leaderboard', JSON.stringify(updated));
      return updated;
    });

    onGameComplete(score, scEarned);
  }, [score, username, onGameComplete]);

  const resetGame = () => {
    setGameStarted(false);
    setIsPlaying(false);
    setGameCompleted(false);
    setTimeLeft(GAME_DURATION);
    setScore(0);
    setDogs([]);
    setCoinAnimations([]);
    setKeysPressed(new Set());

    if (timerRef.current) clearInterval(timerRef.current);
    if (dogSpawnRef.current) clearInterval(dogSpawnRef.current);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  };

  useEffect(() => {
    const animate = () => {
      if (isPlaying) {
        moveCage();
        updateDogs();
        checkCollisions();
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
  }, [isPlaying, moveCage, updateDogs, checkCollisions]);

  // Load leaderboard on component mount
  useEffect(() => {
    const saved = localStorage.getItem('brens-meow-leaderboard');
    if (saved) {
      setLeaderboard(JSON.parse(saved));
    }
  }, []);

  const handleMobileControl = (direction: string) => {
    if (!gameAreaRef.current) return;

    const rect = gameAreaRef.current.getBoundingClientRect();
    let newX = cage.x;
    let newY = cage.y;

    switch (direction) {
      case 'up':
        newY -= CAGE_SPEED * 3;
        break;
      case 'down':
        newY += CAGE_SPEED * 3;
        break;
      case 'left':
        newX -= CAGE_SPEED * 3;
        break;
      case 'right':
        newX += CAGE_SPEED * 3;
        break;
    }

    newX = Math.max(0, Math.min(rect.width - cage.width, newX));
    newY = Math.max(0, Math.min(rect.height - cage.height, newY));

    setCage(prev => ({ ...prev, x: newX, y: newY }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="overflow-hidden">
        <CardHeader className="text-center bg-gradient-to-r from-gold/20 to-sweep/20">
          <div className="flex items-center justify-center mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-gold to-yellow-400 rounded-full flex items-center justify-center mr-3">
              🐱
            </div>
            <div>
              <CardTitle className="text-2xl">Bren's Meow</CardTitle>
              <CardDescription>Catch the dogs with your cage!</CardDescription>
            </div>
          </div>

          <div className="flex justify-center space-x-6 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-casino-green">{score}</div>
              <div className="text-sm text-muted-foreground">Dogs Caught</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gold">{(score * 0.01).toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">SC Earned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-sweep">{dogs.filter(d => !d.caught).length}</div>
              <div className="text-sm text-muted-foreground">Dogs Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{timeLeft}s</div>
              <div className="text-sm text-muted-foreground">Time Left</div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <Progress value={(timeLeft / GAME_DURATION) * 100} className="h-2" />
            <div className="text-xs text-muted-foreground">
              0.01 SC per dog caught • Max 0.25 SC
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="flex">
            {/* Game Area */}
            <div
              ref={gameAreaRef}
              className="relative flex-1 h-96 bg-gradient-to-br from-green-200 via-green-100 to-yellow-100 overflow-hidden"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 20% 80%, rgba(34, 197, 94, 0.3) 1px, transparent 1px),
                  radial-gradient(circle at 80% 20%, rgba(34, 197, 94, 0.3) 1px, transparent 1px)
                `,
                backgroundSize: "50px 50px",
              }}
            >
              {/* Dogs */}
              {dogs.map(dog => !dog.caught && (
                <div
                  key={dog.id}
                  className="absolute transition-all duration-100"
                  style={{
                    left: dog.x - dog.size / 2,
                    top: dog.y - dog.size / 2,
                    width: dog.size,
                    height: dog.size,
                  }}
                >
                  <div className="text-2xl animate-bounce" style={{ 
                    filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
                  }}>
                    🐕
                  </div>
                </div>
              ))}

              {/* Cage */}
              <div
                className="absolute border-4 border-yellow-600 bg-yellow-400/30 rounded-lg transition-all duration-75"
                style={{
                  left: cage.x,
                  top: cage.y,
                  width: cage.width,
                  height: cage.height,
                }}
              >
                <div className="w-full h-full flex items-center justify-center text-xs font-bold text-yellow-800">
                  CAGE
                </div>
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gold">
                  CoinKrazy.com
                </div>
              </div>

              {/* Coin Animations */}
              {coinAnimations.map(coin => (
                <div
                  key={coin.id}
                  className="absolute text-2xl animate-ping pointer-events-none"
                  style={{
                    left: coin.x - 15,
                    top: coin.y - 15,
                  }}
                >
                  🪙
                </div>
              ))}

              {/* Game Instructions */}
              {!gameStarted && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <div className="text-center text-white space-y-4 p-6 bg-black/50 rounded-lg">
                    <h3 className="text-xl font-bold">Bren's Meow</h3>
                    <div className="space-y-2 text-sm">
                      <p>🐕 Use arrow keys or WASD to move the cage</p>
                      <p>🎯 Catch the dogs by trapping them in your cage</p>
                      <p>🧠 Dogs are smart and will try to avoid you!</p>
                      <p>💰 Each dog caught = 0.01 SC</p>
                      <p>⏱️ You have 60 seconds to catch as many as possible</p>
                      <p>🏆 Top scores go on the leaderboard!</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Game Over Screen */}
              {gameCompleted && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                  <div className="text-center text-white space-y-4 p-6 bg-black/70 rounded-lg">
                    <Trophy className="w-16 h-16 mx-auto text-gold" />
                    <h3 className="text-2xl font-bold">Meow Complete!</h3>
                    <div className="space-y-2">
                      <p className="text-lg">
                        🎉 You caught <span className="text-gold font-bold">{score}</span> dogs and earned <span className="text-casino-green font-bold">{(score * 0.01).toFixed(2)}</span> SC!
                      </p>
                      <Button
                        onClick={() => setShowLeaderboard(!showLeaderboard)}
                        variant="outline"
                        size="sm"
                        className="border-gold text-gold hover:bg-gold/10"
                      >
                        <Crown className="h-4 w-4 mr-2" />
                        View Leaderboard
                      </Button>
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
            </div>

            {/* Leaderboard */}
            <div className="w-64 bg-card/50 border-l p-4">
              <div className="flex items-center mb-4">
                <Crown className="h-5 w-5 text-gold mr-2" />
                <h3 className="font-bold">Leaderboard</h3>
              </div>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {leaderboard.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center">
                    No scores yet. Be the first!
                  </p>
                ) : (
                  leaderboard.map((entry, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded text-sm ${
                        index === 0 ? 'bg-gold/20 border border-gold/30' :
                        index === 1 ? 'bg-gray-400/20 border border-gray-400/30' :
                        index === 2 ? 'bg-orange-600/20 border border-orange-600/30' :
                        'bg-muted/50'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="font-bold mr-2">#{index + 1}</span>
                          <span className="truncate text-xs">{entry.username}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-casino-green">{entry.score}</div>
                          <div className="text-xs text-muted-foreground">{entry.scEarned.toFixed(2)} SC</div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {entry.date}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Mobile Controls */}
          <div className="p-4 bg-card/50 border-t">
            <div className="grid grid-cols-3 gap-2 max-w-48 mx-auto mb-4">
              <div></div>
              <Button
                size="sm"
                variant="outline"
                onMouseDown={() => handleMobileControl('up')}
                disabled={!isPlaying}
              >
                ↑
              </Button>
              <div></div>
              
              <Button
                size="sm"
                variant="outline"
                onMouseDown={() => handleMobileControl('left')}
                disabled={!isPlaying}
              >
                ←
              </Button>
              <div className="flex items-center justify-center text-xs text-muted-foreground">
                MOVE
              </div>
              <Button
                size="sm"
                variant="outline"
                onMouseDown={() => handleMobileControl('right')}
                disabled={!isPlaying}
              >
                →
              </Button>

              <div></div>
              <Button
                size="sm"
                variant="outline"
                onMouseDown={() => handleMobileControl('down')}
                disabled={!isPlaying}
              >
                ↓
              </Button>
              <div></div>
            </div>

            {/* Main Game Button */}
            {!gameStarted ? (
              <Button
                onClick={startGame}
                className="w-full bg-gradient-to-r from-gold to-yellow-400 text-gold-foreground hover:from-yellow-400 hover:to-gold text-lg py-6"
                size="lg"
              >
                <Play className="h-5 w-5 mr-2" />
                Start Dog Catching
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
                <p className="text-lg font-semibold">Catch those dogs!</p>
                <p className="text-sm text-muted-foreground">
                  Use arrow keys, WASD, or touch controls to move the cage
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
