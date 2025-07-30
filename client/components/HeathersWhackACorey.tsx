import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Timer, Trophy, Play, RotateCcw } from "lucide-react";

interface HeathersWhackACoreyProps {
  userId: string;
  username: string;
  onGameComplete: (score: number, scEarned: number) => void;
}

interface Mole {
  id: number;
  position: number;
  isUp: boolean;
  timeUp: number;
  type: 'corey' | 'bonus' | 'bomb';
}

export function HeathersWhackACorey({ userId, username, onGameComplete }: HeathersWhackACoreyProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [moles, setMoles] = useState<Mole[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [lastHit, setLastHit] = useState<string>("");

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const moleSpawnRef = useRef<NodeJS.Timeout | null>(null);

  const GAME_DURATION = 60;
  const MOLE_POSITIONS = 9; // 3x3 grid

  const spawnMole = useCallback(() => {
    if (!isPlaying) return;

    const availablePositions = Array.from({length: MOLE_POSITIONS}, (_, i) => i)
      .filter(pos => !moles.some(mole => mole.position === pos && mole.isUp));

    if (availablePositions.length === 0) return;

    const position = availablePositions[Math.floor(Math.random() * availablePositions.length)];
    const types: ('corey' | 'bonus' | 'bomb')[] = ['corey', 'corey', 'corey', 'bonus', 'bomb'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    const timeUp = type === 'bonus' ? 800 : type === 'bomb' ? 1200 : 1000 + Math.random() * 500;

    const newMole: Mole = {
      id: Date.now() + Math.random(),
      position,
      isUp: true,
      timeUp,
      type,
    };

    setMoles(prev => [...prev, newMole]);

    // Auto-hide mole after timeUp
    setTimeout(() => {
      setMoles(prev => prev.filter(mole => mole.id !== newMole.id));
    }, timeUp);
  }, [isPlaying, moles]);

  const whackMole = useCallback((position: number) => {
    if (!isPlaying) return;

    const mole = moles.find(m => m.position === position && m.isUp);
    
    if (mole) {
      setMoles(prev => prev.filter(m => m.id !== mole.id));
      setHits(prev => prev + 1);

      switch (mole.type) {
        case 'corey':
          setScore(prev => prev + 10);
          setLastHit("+10 points! Good whack!");
          break;
        case 'bonus':
          setScore(prev => prev + 25);
          setLastHit("+25 points! BONUS Corey!");
          break;
        case 'bomb':
          setScore(prev => Math.max(0, prev - 15));
          setLastHit("-15 points! You hit a bomb!");
          break;
      }
    } else {
      setMisses(prev => prev + 1);
      setScore(prev => Math.max(0, prev - 2));
      setLastHit("-2 points! Missed!");
    }

    // Clear hit message after delay
    setTimeout(() => setLastHit(""), 1000);
  }, [isPlaying, moles]);

  const startGame = () => {
    setGameStarted(true);
    setIsPlaying(true);
    setTimeLeft(GAME_DURATION);
    setScore(0);
    setHits(0);
    setMisses(0);
    setMoles([]);
    setGameCompleted(false);
    setLastHit("");

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Spawn moles periodically
    moleSpawnRef.current = setInterval(() => {
      if (Math.random() < 0.8) { // 80% chance to spawn
        spawnMole();
      }
    }, 800);
  };

  const endGame = useCallback(() => {
    setIsPlaying(false);
    setGameCompleted(true);

    if (timerRef.current) clearInterval(timerRef.current);
    if (moleSpawnRef.current) clearInterval(moleSpawnRef.current);

    const scEarned = Math.min(0.25, score * 0.01);
    onGameComplete(score, scEarned);
  }, [score, onGameComplete]);

  const resetGame = () => {
    setGameStarted(false);
    setIsPlaying(false);
    setGameCompleted(false);
    setTimeLeft(GAME_DURATION);
    setScore(0);
    setHits(0);
    setMisses(0);
    setMoles([]);
    setLastHit("");

    if (timerRef.current) clearInterval(timerRef.current);
    if (moleSpawnRef.current) clearInterval(moleSpawnRef.current);
  };

  const accuracy = hits + misses > 0 ? Math.round((hits / (hits + misses)) * 100) : 0;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="overflow-hidden">
        <CardHeader className="text-center bg-gradient-to-r from-gold/20 to-sweep/20">
          <div className="flex items-center justify-center mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-gold to-yellow-400 rounded-full flex items-center justify-center mr-3">
              🔨
            </div>
            <div>
              <CardTitle className="text-2xl">Heather's Whack a Corey</CardTitle>
              <CardDescription>Whack the Coreys but avoid the bombs!</CardDescription>
            </div>
          </div>

          <div className="flex justify-center space-x-6 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-casino-green">{score}</div>
              <div className="text-sm text-muted-foreground">Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-sweep">{hits}</div>
              <div className="text-sm text-muted-foreground">Hits</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-casino-red">{misses}</div>
              <div className="text-sm text-muted-foreground">Misses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{timeLeft}s</div>
              <div className="text-sm text-muted-foreground">Time Left</div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <Progress value={(timeLeft / GAME_DURATION) * 100} className="h-2" />
            {lastHit && (
              <div className="text-sm font-semibold text-gold animate-pulse">
                {lastHit}
              </div>
            )}
            <div className="text-xs text-muted-foreground">
              Accuracy: {accuracy}% • Corey: +10 • Bonus: +25 • Bomb: -15
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="relative w-full max-w-lg mx-auto">
            {/* Game Board */}
            <div className="grid grid-cols-3 gap-4 bg-gradient-to-br from-green-800 to-green-900 p-6 rounded-lg border-4 border-brown-600">
              {Array.from({length: MOLE_POSITIONS}, (_, i) => {
                const mole = moles.find(m => m.position === i && m.isUp);
                
                return (
                  <div
                    key={i}
                    className="relative w-20 h-20 bg-gradient-to-br from-brown-400 to-brown-700 rounded-full border-4 border-brown-800 cursor-pointer hover:scale-105 transition-transform duration-100"
                    onClick={() => whackMole(i)}
                  >
                    {/* Hole */}
                    <div className="absolute inset-2 bg-black rounded-full shadow-inner">
                      {mole && (
                        <div className={`absolute inset-0 flex items-center justify-center text-3xl animate-bounce ${
                          mole.type === 'bomb' ? 'animate-pulse' : ''
                        }`}>
                          {mole.type === 'corey' && '👨'}
                          {mole.type === 'bonus' && '🤴'}
                          {mole.type === 'bomb' && '💣'}
                        </div>
                      )}
                    </div>
                    
                    {/* Hole number */}
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs font-bold text-white bg-black/50 px-1 rounded">
                      {i + 1}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Game Instructions */}
            {!gameStarted && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-lg">
                <div className="text-center text-white space-y-4 p-6 bg-black/50 rounded-lg">
                  <h3 className="text-xl font-bold">Heather's Whack a Corey</h3>
                  <div className="space-y-2 text-sm">
                    <p>🔨 Click holes to whack the Coreys!</p>
                    <p>👨 Regular Corey = +10 points</p>
                    <p>🤴 Bonus Corey = +25 points</p>
                    <p>💣 Bombs = -15 points (avoid!)</p>
                    <p>❌ Missing = -2 points</p>
                    <p>⏱️ 60 seconds of whacking madness!</p>
                  </div>
                </div>
              </div>
            )}

            {/* Game Over Screen */}
            {gameCompleted && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-lg">
                <div className="text-center text-white space-y-4 p-6 bg-black/70 rounded-lg">
                  <Trophy className="w-16 h-16 mx-auto text-gold" />
                  <h3 className="text-2xl font-bold">Whacking Complete!</h3>
                  <div className="space-y-2">
                    <p className="text-lg">
                      Final Score: <span className="text-gold font-bold">{score}</span>
                    </p>
                    <p className="text-lg">
                      Hits: <span className="text-casino-green font-bold">{hits}</span> 
                      / Misses: <span className="text-casino-red font-bold">{misses}</span>
                    </p>
                    <p className="text-lg">
                      Accuracy: <span className="text-sweep font-bold">{accuracy}%</span>
                    </p>
                    <p className="text-lg">
                      SC Earned: <span className="text-casino-green font-bold">{Math.min(0.25, score * 0.01).toFixed(2)}</span>
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
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="bg-card rounded-lg p-3 text-center border">
              <div className="text-lg font-bold text-casino-green">{score}</div>
              <div className="text-xs text-muted-foreground">Total Score</div>
            </div>
            <div className="bg-card rounded-lg p-3 text-center border">
              <div className="text-lg font-bold text-sweep">{accuracy}%</div>
              <div className="text-xs text-muted-foreground">Accuracy</div>
            </div>
            <div className="bg-card rounded-lg p-3 text-center border">
              <div className="text-lg font-bold text-gold">{(score * 0.01).toFixed(2)}</div>
              <div className="text-xs text-muted-foreground">SC Earned</div>
            </div>
          </div>

          {/* Main Game Button */}
          <div className="mt-6">
            {!gameStarted ? (
              <Button
                onClick={startGame}
                className="w-full bg-gradient-to-r from-gold to-yellow-400 text-gold-foreground hover:from-yellow-400 hover:to-gold text-lg py-6"
                size="lg"
              >
                <Play className="h-5 w-5 mr-2" />
                Start Whacking
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
                <p className="text-lg font-semibold">Whack those Coreys!</p>
                <p className="text-sm text-muted-foreground">
                  Click on the holes when Coreys pop up. Avoid the bombs!
                </p>
              </div>
            )}
          </div>

          {/* CoinKrazy Branding */}
          <div className="text-center mt-4 text-xs font-bold text-gold opacity-70">
            CoinKrazy.com
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
