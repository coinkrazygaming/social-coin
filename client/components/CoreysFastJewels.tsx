import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Timer, Trophy, Play, RotateCcw, Gem } from "lucide-react";

interface CoreysFastJewelsProps {
  userId: string;
  username: string;
  onGameComplete: (score: number, scEarned: number) => void;
}

interface Jewel {
  id: string;
  type: number;
  color: string;
  emoji: string;
  x: number;
  y: number;
}

interface Match {
  jewels: Jewel[];
  direction: 'horizontal' | 'vertical';
}

const BOARD_SIZE = 8;
const JEWEL_TYPES = [
  { type: 0, color: '#ff0000', emoji: '💎' },
  { type: 1, color: '#00ff00', emoji: '🟢' },
  { type: 2, color: '#0000ff', emoji: '🔵' },
  { type: 3, color: '#ffff00', emoji: '🟡' },
  { type: 4, color: '#ff00ff', emoji: '🟣' },
  { type: 5, color: '#00ffff', emoji: '🔷' },
];

export function CoreysFastJewels({ userId, username, onGameComplete }: CoreysFastJewelsProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [matches, setMatches] = useState(0);
  const [badMoves, setBadMoves] = useState(0);
  const [scEarned, setScEarned] = useState(0);
  const [board, setBoard] = useState<Jewel[][]>([]);
  const [selectedJewel, setSelectedJewel] = useState<{x: number, y: number} | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [lastAction, setLastAction] = useState<string>("");
  const [isAnimating, setIsAnimating] = useState(false);

  const gameAreaRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const GAME_DURATION = 60;

  const createJewel = (x: number, y: number): Jewel => {
    const type = Math.floor(Math.random() * JEWEL_TYPES.length);
    const jewelType = JEWEL_TYPES[type];
    return {
      id: `${x}-${y}-${Date.now()}-${Math.random()}`,
      type,
      color: jewelType.color,
      emoji: jewelType.emoji,
      x,
      y,
    };
  };

  const initializeBoard = (): Jewel[][] => {
    const newBoard: Jewel[][] = [];
    
    for (let y = 0; y < BOARD_SIZE; y++) {
      newBoard[y] = [];
      for (let x = 0; x < BOARD_SIZE; x++) {
        newBoard[y][x] = createJewel(x, y);
      }
    }
    
    return newBoard;
  };

  const findMatches = (gameBoard: Jewel[][]): Match[] => {
    const matches: Match[] = [];
    
    // Check horizontal matches
    for (let y = 0; y < BOARD_SIZE; y++) {
      let currentMatch: Jewel[] = [gameBoard[y][0]];
      
      for (let x = 1; x < BOARD_SIZE; x++) {
        if (gameBoard[y][x].type === currentMatch[0].type) {
          currentMatch.push(gameBoard[y][x]);
        } else {
          if (currentMatch.length >= 3) {
            matches.push({ jewels: currentMatch, direction: 'horizontal' });
          }
          currentMatch = [gameBoard[y][x]];
        }
      }
      
      if (currentMatch.length >= 3) {
        matches.push({ jewels: currentMatch, direction: 'horizontal' });
      }
    }
    
    // Check vertical matches
    for (let x = 0; x < BOARD_SIZE; x++) {
      let currentMatch: Jewel[] = [gameBoard[0][x]];
      
      for (let y = 1; y < BOARD_SIZE; y++) {
        if (gameBoard[y][x].type === currentMatch[0].type) {
          currentMatch.push(gameBoard[y][x]);
        } else {
          if (currentMatch.length >= 3) {
            matches.push({ jewels: currentMatch, direction: 'vertical' });
          }
          currentMatch = [gameBoard[y][x]];
        }
      }
      
      if (currentMatch.length >= 3) {
        matches.push({ jewels: currentMatch, direction: 'vertical' });
      }
    }
    
    return matches;
  };

  const removeMatches = (gameBoard: Jewel[][], matchesToRemove: Match[]): Jewel[][] => {
    const newBoard = gameBoard.map(row => [...row]);
    
    matchesToRemove.forEach(match => {
      match.jewels.forEach(jewel => {
        newBoard[jewel.y][jewel.x] = null as any;
      });
    });
    
    return newBoard;
  };

  const applyGravity = (gameBoard: Jewel[][]): Jewel[][] => {
    const newBoard = gameBoard.map(row => [...row]);
    
    for (let x = 0; x < BOARD_SIZE; x++) {
      // Get all non-null jewels in this column
      const column = [];
      for (let y = BOARD_SIZE - 1; y >= 0; y--) {
        if (newBoard[y][x]) {
          column.push(newBoard[y][x]);
        }
      }
      
      // Clear the column
      for (let y = 0; y < BOARD_SIZE; y++) {
        newBoard[y][x] = null as any;
      }
      
      // Place jewels from bottom up
      for (let i = 0; i < column.length; i++) {
        const jewel = column[i];
        jewel.y = BOARD_SIZE - 1 - i;
        newBoard[BOARD_SIZE - 1 - i][x] = jewel;
      }
      
      // Fill empty spaces with new jewels
      for (let y = 0; y < BOARD_SIZE - column.length; y++) {
        newBoard[y][x] = createJewel(x, y);
      }
    }
    
    return newBoard;
  };

  const isValidMove = (board1: Jewel[][], x1: number, y1: number, x2: number, y2: number): boolean => {
    // Check if positions are adjacent
    const dx = Math.abs(x1 - x2);
    const dy = Math.abs(y1 - y2);
    if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
      // Temporarily swap jewels
      const tempBoard = board1.map(row => [...row]);
      const temp = tempBoard[y1][x1];
      tempBoard[y1][x1] = tempBoard[y2][x2];
      tempBoard[y2][x2] = temp;
      
      // Check if this creates any matches
      const matches = findMatches(tempBoard);
      return matches.length > 0;
    }
    return false;
  };

  const processMatches = useCallback(async (gameBoard: Jewel[][]): Promise<Jewel[][]> => {
    let currentBoard = gameBoard;
    let totalMatches = 0;
    
    while (true) {
      const matches = findMatches(currentBoard);
      if (matches.length === 0) break;
      
      totalMatches += matches.reduce((sum, match) => sum + match.jewels.length, 0);
      currentBoard = removeMatches(currentBoard, matches);
      currentBoard = applyGravity(currentBoard);
      
      // Small delay for animation effect
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    if (totalMatches > 0) {
      setMatches(prev => prev + Math.floor(totalMatches / 3));
      setScEarned(prev => prev + Math.floor(totalMatches / 3) * 0.01);
      setLastAction(`+${Math.floor(totalMatches / 3)} matches! +${(Math.floor(totalMatches / 3) * 0.01).toFixed(2)} SC`);
    }
    
    return currentBoard;
  }, []);

  const handleJewelClick = useCallback(async (x: number, y: number) => {
    if (!isPlaying || isAnimating) return;

    if (!selectedJewel) {
      setSelectedJewel({ x, y });
      return;
    }

    if (selectedJewel.x === x && selectedJewel.y === y) {
      setSelectedJewel(null);
      return;
    }

    setIsAnimating(true);

    if (isValidMove(board, selectedJewel.x, selectedJewel.y, x, y)) {
      // Valid move - swap jewels
      const newBoard = board.map(row => [...row]);
      const temp = newBoard[selectedJewel.y][selectedJewel.x];
      newBoard[selectedJewel.y][selectedJewel.x] = newBoard[y][x];
      newBoard[y][x] = temp;
      
      // Update positions
      newBoard[selectedJewel.y][selectedJewel.x].x = selectedJewel.x;
      newBoard[selectedJewel.y][selectedJewel.x].y = selectedJewel.y;
      newBoard[y][x].x = x;
      newBoard[y][x].y = y;
      
      setBoard(newBoard);
      
      // Process matches
      const finalBoard = await processMatches(newBoard);
      setBoard(finalBoard);
    } else {
      // Invalid move
      setBadMoves(prev => prev + 1);
      setLastAction("Invalid move! -0.01 SC penalty");
      setScEarned(prev => Math.max(0, prev - 0.01));
    }

    setSelectedJewel(null);
    setIsAnimating(false);
  }, [isPlaying, isAnimating, selectedJewel, board, processMatches]);

  const startGame = () => {
    setGameStarted(true);
    setIsPlaying(true);
    setTimeLeft(GAME_DURATION);
    setMatches(0);
    setBadMoves(0);
    setScEarned(0);
    setGameCompleted(false);
    setSelectedJewel(null);
    setLastAction("");

    const newBoard = initializeBoard();
    setBoard(newBoard);

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
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

    if (timerRef.current) clearInterval(timerRef.current);

    const finalSC = Math.min(0.25, Math.max(0, scEarned));
    onGameComplete(matches, finalSC);
  }, [matches, scEarned, onGameComplete]);

  const resetGame = () => {
    setGameStarted(false);
    setIsPlaying(false);
    setGameCompleted(false);
    setTimeLeft(GAME_DURATION);
    setMatches(0);
    setBadMoves(0);
    setScEarned(0);
    setBoard([]);
    setSelectedJewel(null);
    setLastAction("");

    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    if (gameStarted && board.length === 0) {
      const newBoard = initializeBoard();
      setBoard(newBoard);
    }
  }, [gameStarted, board]);

  const netScore = matches - badMoves;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="overflow-hidden">
        <CardHeader className="text-center bg-gradient-to-r from-gold/20 to-sweep/20">
          <div className="flex items-center justify-center mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-gold to-yellow-400 rounded-full flex items-center justify-center mr-3">
              💎
            </div>
            <div>
              <CardTitle className="text-2xl">Corey's Fast Jewels</CardTitle>
              <CardDescription>Match gems to earn Sweeps Coins!</CardDescription>
            </div>
          </div>

          <div className="flex justify-center space-x-6 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-casino-green">{matches}</div>
              <div className="text-sm text-muted-foreground">Matches</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-casino-red">{badMoves}</div>
              <div className="text-sm text-muted-foreground">Bad Moves</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gold">{scEarned.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">SC Earned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{timeLeft}s</div>
              <div className="text-sm text-muted-foreground">Time Left</div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <Progress value={(timeLeft / GAME_DURATION) * 100} className="h-2" />
            {lastAction && (
              <div className="text-sm font-semibold text-gold animate-pulse">
                {lastAction}
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <div className="flex justify-center">
            <div
              ref={gameAreaRef}
              className="relative bg-gradient-to-br from-purple-900 to-blue-900 border-4 border-gold rounded-lg p-4"
              style={{
                width: BOARD_SIZE * 50 + 32,
                height: BOARD_SIZE * 50 + 32,
              }}
            >
              {/* Game Board */}
              <div className="grid grid-cols-8 gap-1">
                {board.map((row, y) =>
                  row.map((jewel, x) => (
                    <div
                      key={`${x}-${y}`}
                      className={`
                        w-12 h-12 flex items-center justify-center text-2xl cursor-pointer
                        border-2 rounded-lg transition-all duration-200 hover:scale-110
                        ${selectedJewel?.x === x && selectedJewel?.y === y 
                          ? 'border-gold bg-gold/20 scale-110' 
                          : 'border-white/20 bg-black/20'
                        }
                        ${isAnimating ? 'pointer-events-none' : ''}
                      `}
                      onClick={() => handleJewelClick(x, y)}
                      style={{
                        backgroundColor: jewel ? `${jewel.color}20` : '#1a1a1a',
                      }}
                    >
                      {jewel?.emoji}
                    </div>
                  ))
                )}
              </div>

              {/* Game Instructions Overlay */}
              {!gameStarted && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded">
                  <div className="text-center text-white space-y-4 p-4">
                    <h3 className="text-lg font-bold">Corey's Fast Jewels</h3>
                    <div className="space-y-2 text-sm">
                      <p>💎 Click two adjacent gems to swap them</p>
                      <p>✨ Match 3+ in a row to score</p>
                      <p>💰 Each match = 0.01 SC</p>
                      <p>❌ Bad moves = -0.01 SC penalty</p>
                      <p>⏱️ 60 seconds of fast matching!</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Game Over Overlay */}
              {gameCompleted && (
                <div className="absolute inset-0 bg-black/90 flex items-center justify-center rounded">
                  <div className="text-center text-white space-y-4 p-4">
                    <Trophy className="w-12 h-12 mx-auto text-gold" />
                    <h3 className="text-xl font-bold">Time's Up!</h3>
                    <div className="space-y-2">
                      <p>Matches: <span className="text-casino-green font-bold">{matches}</span></p>
                      <p>Bad Moves: <span className="text-casino-red font-bold">{badMoves}</span></p>
                      <p>Net Score: <span className="text-gold font-bold">{netScore}</span></p>
                      <p>SC Earned: <span className="text-casino-green font-bold">{Math.min(0.25, Math.max(0, scEarned)).toFixed(2)}</span></p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">
                      You will be credited after admin approval
                    </p>
                    <p className="text-xs text-gold">
                      Come Back Tomorrow and do it again!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Game Stats */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card rounded-lg p-3 text-center border">
              <div className="text-lg font-bold text-casino-green">{matches}</div>
              <div className="text-xs text-muted-foreground">Successful Matches</div>
            </div>
            <div className="bg-card rounded-lg p-3 text-center border">
              <div className="text-lg font-bold text-casino-red">{badMoves}</div>
              <div className="text-xs text-muted-foreground">Penalty Moves</div>
            </div>
            <div className="bg-card rounded-lg p-3 text-center border">
              <div className="text-lg font-bold text-gold">{netScore}</div>
              <div className="text-xs text-muted-foreground">Net Score</div>
            </div>
            <div className="bg-card rounded-lg p-3 text-center border">
              <div className="text-lg font-bold text-sweep">{scEarned.toFixed(2)}</div>
              <div className="text-xs text-muted-foreground">SC Total</div>
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
                Start Jewel Matching
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
                <p className="text-lg font-semibold">Match those gems!</p>
                <p className="text-sm text-muted-foreground">
                  Click two adjacent gems to swap them and create matches
                </p>
                {selectedJewel && (
                  <p className="text-sm text-gold">
                    Selected gem at ({selectedJewel.x + 1}, {selectedJewel.y + 1}) - click an adjacent gem to swap
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
