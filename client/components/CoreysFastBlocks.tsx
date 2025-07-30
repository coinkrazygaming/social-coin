import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Timer, Trophy, Play, RotateCcw, ArrowLeft, ArrowRight, ArrowDown, RotateCw } from "lucide-react";

interface CoreysFastBlocksProps {
  userId: string;
  username: string;
  onGameComplete: (score: number, scEarned: number) => void;
}

interface Block {
  x: number;
  y: number;
  color: string;
}

interface Piece {
  blocks: Block[];
  type: string;
  color: string;
}

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const BLOCK_SIZE = 20;

const TETRIS_PIECES = [
  // I-piece
  { blocks: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }], type: 'I', color: '#00f0f0' },
  // O-piece
  { blocks: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }], type: 'O', color: '#f0f000' },
  // T-piece
  { blocks: [{ x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }], type: 'T', color: '#a000f0' },
  // S-piece
  { blocks: [{ x: 1, y: 0 }, { x: 2, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }], type: 'S', color: '#00f000' },
  // Z-piece
  { blocks: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }], type: 'Z', color: '#f00000' },
  // J-piece
  { blocks: [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }], type: 'J', color: '#0000f0' },
  // L-piece
  { blocks: [{ x: 2, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }], type: 'L', color: '#f0a000' },
];

export function CoreysFastBlocks({ userId, username, onGameComplete }: CoreysFastBlocksProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [linesCleared, setLinesCleared] = useState(0);
  const [scEarned, setScEarned] = useState(0);
  const [board, setBoard] = useState<(string | null)[][]>(() => 
    Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null))
  );
  const [currentPiece, setCurrentPiece] = useState<Piece | null>(null);
  const [currentPosition, setCurrentPosition] = useState({ x: 4, y: 0 });
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  const gameAreaRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const dropTimerRef = useRef<NodeJS.Timeout | null>(null);

  const GAME_DURATION = 60;
  const DROP_INTERVAL = 500; // Faster dropping for 60-second game

  const getRandomPiece = (): Piece => {
    const piece = TETRIS_PIECES[Math.floor(Math.random() * TETRIS_PIECES.length)];
    return {
      blocks: piece.blocks.map(b => ({ ...b })),
      type: piece.type,
      color: piece.color
    };
  };

  const isValidPosition = (piece: Piece, position: { x: number; y: number }, testBoard?: (string | null)[][]): boolean => {
    const gameBoard = testBoard || board;
    
    return piece.blocks.every(block => {
      const newX = position.x + block.x;
      const newY = position.y + block.y;
      
      return newX >= 0 && 
             newX < BOARD_WIDTH && 
             newY >= 0 && 
             newY < BOARD_HEIGHT && 
             !gameBoard[newY][newX];
    });
  };

  const rotatePiece = (piece: Piece): Piece => {
    if (piece.type === 'O') return piece; // O-piece doesn't rotate
    
    const rotated = piece.blocks.map(block => ({
      x: -block.y,
      y: block.x,
      color: block.color
    }));

    return { ...piece, blocks: rotated };
  };

  const placePiece = useCallback(() => {
    if (!currentPiece) return;

    const newBoard = board.map(row => [...row]);
    currentPiece.blocks.forEach(block => {
      const x = currentPosition.x + block.x;
      const y = currentPosition.y + block.y;
      if (y >= 0) {
        newBoard[y][x] = currentPiece.color;
      }
    });

    setBoard(newBoard);

    // Check for completed lines
    const completedLines: number[] = [];
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      if (newBoard[y].every(cell => cell !== null)) {
        completedLines.push(y);
      }
    }

    if (completedLines.length > 0) {
      // Remove completed lines and add new ones at top
      const clearedBoard = newBoard.filter((_, index) => !completedLines.includes(index));
      const newLines = Array(completedLines.length).fill(null).map(() => Array(BOARD_WIDTH).fill(null));
      const finalBoard = [...newLines, ...clearedBoard];
      
      setBoard(finalBoard);
      setLinesCleared(prev => prev + completedLines.length);
      setScEarned(prev => prev + (completedLines.length * 0.01));
    }

    // Spawn new piece
    const newPiece = getRandomPiece();
    const newPosition = { x: 4, y: 0 };

    if (!isValidPosition(newPiece, newPosition, newBoard)) {
      // Game over
      endGame();
      return;
    }

    setCurrentPiece(newPiece);
    setCurrentPosition(newPosition);
  }, [currentPiece, currentPosition, board]);

  const dropPiece = useCallback(() => {
    if (!currentPiece) return;

    const newPosition = { x: currentPosition.x, y: currentPosition.y + 1 };
    
    if (isValidPosition(currentPiece, newPosition)) {
      setCurrentPosition(newPosition);
    } else {
      placePiece();
    }
  }, [currentPiece, currentPosition, placePiece]);

  const movePiece = useCallback((direction: 'left' | 'right' | 'down') => {
    if (!currentPiece || !isPlaying) return;

    let newPosition = { ...currentPosition };
    
    switch (direction) {
      case 'left':
        newPosition.x -= 1;
        break;
      case 'right':
        newPosition.x += 1;
        break;
      case 'down':
        newPosition.y += 1;
        break;
    }

    if (isValidPosition(currentPiece, newPosition)) {
      setCurrentPosition(newPosition);
    } else if (direction === 'down') {
      placePiece();
    }
  }, [currentPiece, currentPosition, isPlaying, placePiece]);

  const rotatePieceHandler = useCallback(() => {
    if (!currentPiece || !isPlaying) return;

    const rotated = rotatePiece(currentPiece);
    if (isValidPosition(rotated, currentPosition)) {
      setCurrentPiece(rotated);
    }
  }, [currentPiece, currentPosition, isPlaying]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isPlaying) return;

      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          movePiece('left');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          movePiece('right');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          movePiece('down');
          break;
        case 'ArrowUp':
        case 'w':
        case 'W':
        case ' ':
          e.preventDefault();
          rotatePieceHandler();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, movePiece, rotatePieceHandler]);

  const startGame = () => {
    setGameStarted(true);
    setIsPlaying(true);
    setTimeLeft(GAME_DURATION);
    setLinesCleared(0);
    setScEarned(0);
    setBoard(Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null)));
    setGameCompleted(false);

    const newPiece = getRandomPiece();
    setCurrentPiece(newPiece);
    setCurrentPosition({ x: 4, y: 0 });

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    dropTimerRef.current = setInterval(dropPiece, DROP_INTERVAL);
  };

  const endGame = useCallback(() => {
    setIsPlaying(false);
    setGameCompleted(true);

    if (timerRef.current) clearInterval(timerRef.current);
    if (dropTimerRef.current) clearInterval(dropTimerRef.current);

    const finalSC = Math.min(0.25, scEarned);
    onGameComplete(linesCleared, finalSC);
  }, [scEarned, linesCleared, onGameComplete]);

  const resetGame = () => {
    setGameStarted(false);
    setIsPlaying(false);
    setGameCompleted(false);
    setTimeLeft(GAME_DURATION);
    setLinesCleared(0);
    setScEarned(0);
    setBoard(Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null)));
    setCurrentPiece(null);
    setCurrentPosition({ x: 4, y: 0 });

    if (timerRef.current) clearInterval(timerRef.current);
    if (dropTimerRef.current) clearInterval(dropTimerRef.current);
  };

  const renderBoard = () => {
    const displayBoard = board.map(row => [...row]);

    // Add current piece to display
    if (currentPiece && isPlaying) {
      currentPiece.blocks.forEach(block => {
        const x = currentPosition.x + block.x;
        const y = currentPosition.y + block.y;
        if (x >= 0 && x < BOARD_WIDTH && y >= 0 && y < BOARD_HEIGHT) {
          displayBoard[y][x] = currentPiece.color;
        }
      });
    }

    return displayBoard.map((row, y) => (
      <div key={y} className="flex">
        {row.map((cell, x) => (
          <div
            key={`${x}-${y}`}
            className="border border-gray-600"
            style={{
              width: BLOCK_SIZE,
              height: BLOCK_SIZE,
              backgroundColor: cell || '#1a1a1a',
            }}
          />
        ))}
      </div>
    ));
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="overflow-hidden">
        <CardHeader className="text-center bg-gradient-to-r from-gold/20 to-sweep/20">
          <div className="flex items-center justify-center mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-gold to-yellow-400 rounded-full flex items-center justify-center mr-3">
              🧩
            </div>
            <div>
              <CardTitle className="text-2xl">Corey's Fast Blocks</CardTitle>
              <CardDescription>Clear lines to earn Sweeps Coins!</CardDescription>
            </div>
          </div>

          <div className="flex justify-center space-x-6 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-casino-green">{linesCleared}</div>
              <div className="text-sm text-muted-foreground">Lines Cleared</div>
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
            <div className="text-xs text-muted-foreground">
              0.01 SC per line cleared
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <div className="flex justify-center items-start space-x-8">
            {/* Game Board */}
            <div
              ref={gameAreaRef}
              className="relative bg-black border-4 border-gold rounded-lg p-2"
              style={{
                width: BOARD_WIDTH * BLOCK_SIZE + 16,
                height: BOARD_HEIGHT * BLOCK_SIZE + 16,
              }}
            >
              {renderBoard()}
              
              {/* Game Instructions Overlay */}
              {!gameStarted && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded">
                  <div className="text-center text-white space-y-4 p-4">
                    <h3 className="text-lg font-bold">Corey's Fast Blocks</h3>
                    <div className="space-y-2 text-sm">
                      <p>🧩 Clear horizontal lines to earn SC</p>
                      <p>💰 Each line = 0.01 SC</p>
                      <p>⏱️ 60 seconds fast-paced gameplay</p>
                      <p>🎮 Arrow keys or WASD to control</p>
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
                      <p>Lines: <span className="text-gold font-bold">{linesCleared}</span></p>
                      <p>SC: <span className="text-casino-green font-bold">{Math.min(0.25, scEarned).toFixed(2)}</span></p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      You will be credited after admin approval
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Controls and Info */}
            <div className="space-y-4">
              {/* Next Piece Preview */}
              <div className="bg-card rounded-lg p-4 border">
                <h4 className="font-semibold mb-2">Current Piece</h4>
                <div className="w-16 h-16 bg-black rounded border flex items-center justify-center">
                  {currentPiece && (
                    <div style={{ color: currentPiece.color, fontSize: '24px' }}>
                      {currentPiece.type === 'I' ? '▬' : currentPiece.type === 'O' ? '⬛' : '🧩'}
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile Controls */}
              <div className="bg-card rounded-lg p-4 border">
                <h4 className="font-semibold mb-4">Controls</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div></div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={rotatePieceHandler}
                    disabled={!isPlaying}
                  >
                    <RotateCw className="h-4 w-4" />
                  </Button>
                  <div></div>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => movePiece('left')}
                    disabled={!isPlaying}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => movePiece('down')}
                    disabled={!isPlaying}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => movePiece('right')}
                    disabled={!isPlaying}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground mt-2 text-center">
                  Or use arrow keys / WASD
                </div>
              </div>

              {/* Game Stats */}
              <div className="bg-card rounded-lg p-4 border">
                <h4 className="font-semibold mb-2">Stats</h4>
                <div className="space-y-1 text-sm">
                  <div>Lines: {linesCleared}</div>
                  <div>SC Rate: 0.01 per line</div>
                  <div>Max SC: 0.25</div>
                </div>
              </div>
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
                Start Fast Blocks
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
                <p className="text-lg font-semibold">Clear those lines!</p>
                <p className="text-sm text-muted-foreground">
                  Use arrow keys or touch controls to play
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
