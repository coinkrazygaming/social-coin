import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Timer, Target, Trophy, Play, RotateCcw } from "lucide-react";

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
  shape: number[][];
  x: number;
  y: number;
  color: string;
}

const TETROMINOES = [
  { shape: [[1, 1, 1, 1]], color: '#00FFFF' }, // I
  { shape: [[1, 1], [1, 1]], color: '#FFFF00' }, // O
  { shape: [[0, 1, 0], [1, 1, 1]], color: '#800080' }, // T
  { shape: [[0, 1, 1], [1, 1, 0]], color: '#00FF00' }, // S
  { shape: [[1, 1, 0], [0, 1, 1]], color: '#FF0000' }, // Z
  { shape: [[1, 0, 0], [1, 1, 1]], color: '#0000FF' }, // J
  { shape: [[0, 0, 1], [1, 1, 1]], color: '#FFA500' }, // L
];

export function CoreysFastBlocks({ userId, username, onGameComplete }: CoreysFastBlocksProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [grid, setGrid] = useState<(string | null)[][]>([]);
  const [currentPiece, setCurrentPiece] = useState<Piece | null>(null);
  const [nextPiece, setNextPiece] = useState<Piece | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [dropTime, setDropTime] = useState(500);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const gameTimerRef = useRef<NodeJS.Timeout>();
  const dropTimerRef = useRef<NodeJS.Timeout>();

  // Game dimensions
  const CANVAS_WIDTH = 400;
  const CANVAS_HEIGHT = 600;
  const GRID_WIDTH = 10;
  const GRID_HEIGHT = 20;
  const BLOCK_SIZE = CANVAS_WIDTH / GRID_WIDTH;

  const initializeGrid = useCallback(() => {
    return Array(GRID_HEIGHT).fill(null).map(() => Array(GRID_WIDTH).fill(null));
  }, []);

  const createRandomPiece = useCallback(() => {
    const tetromino = TETROMINOES[Math.floor(Math.random() * TETROMINOES.length)];
    return {
      shape: tetromino.shape,
      x: Math.floor(GRID_WIDTH / 2) - Math.floor(tetromino.shape[0].length / 2),
      y: 0,
      color: tetromino.color,
    };
  }, []);

  const startGame = useCallback(() => {
    setIsPlaying(true);
    setGameStarted(true);
    setGameEnded(false);
    setTimeLeft(60);
    setScore(0);
    setLines(0);
    setLevel(1);
    setDropTime(500);
    
    const newGrid = initializeGrid();
    setGrid(newGrid);
    
    const firstPiece = createRandomPiece();
    const secondPiece = createRandomPiece();
    setCurrentPiece(firstPiece);
    setNextPiece(secondPiece);

    gameTimerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [initializeGrid, createRandomPiece]);

  const endGame = useCallback(() => {
    setIsPlaying(false);
    setGameEnded(true);
    
    if (gameTimerRef.current) {
      clearInterval(gameTimerRef.current);
    }
    if (dropTimerRef.current) {
      clearTimeout(dropTimerRef.current);
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    // Calculate SC earned based on score
    let scEarned = 0;
    if (score >= 2000) scEarned = 0.25;
    else if (score >= 1500) scEarned = 0.20;
    else if (score >= 1000) scEarned = 0.15;
    else if (score >= 500) scEarned = 0.10;
    else if (score >= 200) scEarned = 0.05;

    setTimeout(() => {
      onGameComplete(score, scEarned);
    }, 2000);
  }, [score, onGameComplete]);

  const rotatePiece = useCallback((piece: Piece): Piece => {
    const rotated = piece.shape[0].map((_, index) =>
      piece.shape.map(row => row[index]).reverse()
    );
    return { ...piece, shape: rotated };
  }, []);

  const isValidMove = useCallback((piece: Piece, deltaX: number, deltaY: number, rotated = false): boolean => {
    const testPiece = rotated ? rotatePiece(piece) : piece;
    
    for (let y = 0; y < testPiece.shape.length; y++) {
      for (let x = 0; x < testPiece.shape[y].length; x++) {
        if (testPiece.shape[y][x]) {
          const newX = testPiece.x + x + deltaX;
          const newY = testPiece.y + y + deltaY;
          
          if (newX < 0 || newX >= GRID_WIDTH || newY >= GRID_HEIGHT) {
            return false;
          }
          
          if (newY >= 0 && grid[newY] && grid[newY][newX]) {
            return false;
          }
        }
      }
    }
    return true;
  }, [grid, rotatePiece]);

  const placePiece = useCallback(() => {
    if (!currentPiece) return;

    const newGrid = [...grid];
    
    for (let y = 0; y < currentPiece.shape.length; y++) {
      for (let x = 0; x < currentPiece.shape[y].length; x++) {
        if (currentPiece.shape[y][x]) {
          const gridY = currentPiece.y + y;
          const gridX = currentPiece.x + x;
          
          if (gridY >= 0) {
            newGrid[gridY][gridX] = currentPiece.color;
          }
        }
      }
    }

    setGrid(newGrid);

    // Check for completed lines
    const completedLines: number[] = [];
    for (let y = GRID_HEIGHT - 1; y >= 0; y--) {
      if (newGrid[y].every(cell => cell !== null)) {
        completedLines.push(y);
      }
    }

    if (completedLines.length > 0) {
      // Remove completed lines
      const filteredGrid = newGrid.filter((_, index) => !completedLines.includes(index));
      
      // Add new empty lines at the top
      const emptyLines = Array(completedLines.length).fill(null).map(() => 
        Array(GRID_WIDTH).fill(null)
      );
      
      const updatedGrid = [...emptyLines, ...filteredGrid];
      setGrid(updatedGrid);
      
      // Update score and lines
      const points = [0, 100, 300, 500, 800][completedLines.length] * level;
      setScore(prev => prev + points);
      setLines(prev => prev + completedLines.length);
      
      // Increase level every 10 lines
      const newLines = lines + completedLines.length;
      const newLevel = Math.floor(newLines / 10) + 1;
      if (newLevel > level) {
        setLevel(newLevel);
        setDropTime(prev => Math.max(50, prev - 50));
      }
    }

    // Generate new piece
    setCurrentPiece(nextPiece);
    setNextPiece(createRandomPiece());

    // Check game over
    if (nextPiece && !isValidMove(nextPiece, 0, 0)) {
      endGame();
    }
  }, [currentPiece, grid, nextPiece, level, lines, isValidMove, createRandomPiece, endGame]);

  const movePiece = useCallback((deltaX: number, deltaY: number) => {
    if (!currentPiece || !isPlaying) return;

    if (isValidMove(currentPiece, deltaX, deltaY)) {
      setCurrentPiece(prev => prev ? {
        ...prev,
        x: prev.x + deltaX,
        y: prev.y + deltaY,
      } : null);
    } else if (deltaY > 0) {
      // Piece hit bottom or another piece
      placePiece();
    }
  }, [currentPiece, isPlaying, isValidMove, placePiece]);

  const rotatePieceAction = useCallback(() => {
    if (!currentPiece || !isPlaying) return;

    if (isValidMove(currentPiece, 0, 0, true)) {
      setCurrentPiece(prev => prev ? rotatePiece(prev) : null);
    }
  }, [currentPiece, isPlaying, isValidMove, rotatePiece]);

  const hardDrop = useCallback(() => {
    if (!currentPiece || !isPlaying) return;

    let dropDistance = 0;
    while (isValidMove(currentPiece, 0, dropDistance + 1)) {
      dropDistance++;
    }

    setCurrentPiece(prev => prev ? {
      ...prev,
      y: prev.y + dropDistance,
    } : null);

    // Award points for hard drop
    setScore(prev => prev + dropDistance * 2);
    
    setTimeout(() => {
      placePiece();
    }, 100);
  }, [currentPiece, isPlaying, isValidMove, placePiece]);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (!isPlaying) return;

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        movePiece(-1, 0);
        break;
      case 'ArrowRight':
        event.preventDefault();
        movePiece(1, 0);
        break;
      case 'ArrowDown':
        event.preventDefault();
        movePiece(0, 1);
        setScore(prev => prev + 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        rotatePieceAction();
        break;
      case ' ':
        event.preventDefault();
        hardDrop();
        break;
    }
  }, [isPlaying, movePiece, rotatePieceAction, hardDrop]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#000011';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw grid
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    for (let x = 0; x <= GRID_WIDTH; x++) {
      ctx.beginPath();
      ctx.moveTo(x * BLOCK_SIZE, 0);
      ctx.lineTo(x * BLOCK_SIZE, CANVAS_HEIGHT);
      ctx.stroke();
    }
    for (let y = 0; y <= GRID_HEIGHT; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * BLOCK_SIZE);
      ctx.lineTo(CANVAS_WIDTH, y * BLOCK_SIZE);
      ctx.stroke();
    }

    // Draw placed blocks
    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        if (grid[y] && grid[y][x]) {
          ctx.fillStyle = grid[y][x] as string;
          ctx.fillRect(
            x * BLOCK_SIZE + 1,
            y * BLOCK_SIZE + 1,
            BLOCK_SIZE - 2,
            BLOCK_SIZE - 2
          );
          
          // Add block highlight
          ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.fillRect(
            x * BLOCK_SIZE + 1,
            y * BLOCK_SIZE + 1,
            BLOCK_SIZE - 2,
            4
          );
        }
      }
    }

    // Draw current piece
    if (currentPiece) {
      ctx.fillStyle = currentPiece.color;
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x]) {
            const drawX = (currentPiece.x + x) * BLOCK_SIZE;
            const drawY = (currentPiece.y + y) * BLOCK_SIZE;
            
            ctx.fillRect(drawX + 1, drawY + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
            
            // Add block highlight
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fillRect(drawX + 1, drawY + 1, BLOCK_SIZE - 2, 4);
            ctx.fillStyle = currentPiece.color;
          }
        }
      }

      // Draw ghost piece (drop preview)
      let ghostY = currentPiece.y;
      while (isValidMove(currentPiece, 0, ghostY - currentPiece.y + 1)) {
        ghostY++;
      }
      
      if (ghostY > currentPiece.y) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        for (let y = 0; y < currentPiece.shape.length; y++) {
          for (let x = 0; x < currentPiece.shape[y].length; x++) {
            if (currentPiece.shape[y][x]) {
              const drawX = (currentPiece.x + x) * BLOCK_SIZE;
              const drawY = (ghostY + y) * BLOCK_SIZE;
              
              ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
              ctx.lineWidth = 2;
              ctx.strokeRect(drawX + 1, drawY + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
            }
          }
        }
      }
    }
  }, [grid, currentPiece, isValidMove]);

  const dropPiece = useCallback(() => {
    movePiece(0, 1);
    
    if (isPlaying) {
      dropTimerRef.current = setTimeout(dropPiece, dropTime);
    }
  }, [movePiece, isPlaying, dropTime]);

  useEffect(() => {
    if (gameStarted && !gameEnded) {
      draw();
    }
  }, [gameStarted, gameEnded, draw, grid, currentPiece]);

  useEffect(() => {
    if (isPlaying) {
      dropTimerRef.current = setTimeout(dropPiece, dropTime);
    }
    
    return () => {
      if (dropTimerRef.current) {
        clearTimeout(dropTimerRef.current);
      }
    };
  }, [isPlaying, dropPiece, dropTime]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  useEffect(() => {
    return () => {
      if (gameTimerRef.current) {
        clearInterval(gameTimerRef.current);
      }
      if (dropTimerRef.current) {
        clearTimeout(dropTimerRef.current);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] space-y-6">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center space-x-2">
              <span className="text-4xl">🧩</span>
              <span>Corey's Fast Blocks</span>
            </CardTitle>
            <CardDescription>
              Fast-paced Tetris - clear lines to earn SC in 60 seconds!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground space-y-2">
              <p>• Use arrow keys to move and rotate pieces</p>
              <p>• Space bar for hard drop</p>
              <p>• Clear lines to earn points</p>
              <p>• Game speeds up as you progress!</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-muted p-3 rounded-lg">
                <div className="text-gold font-semibold">2000+ Points</div>
                <div className="text-xs">0.25 SC</div>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <div className="text-yellow-400 font-semibold">1500+ Points</div>
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
            <div className="text-sm text-muted-foreground">Score</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-sweep">{lines}</div>
            <div className="text-sm text-muted-foreground">Lines</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{level}</div>
            <div className="text-sm text-muted-foreground">Level</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-casino-red">{timeLeft}s</div>
            <div className="text-sm text-muted-foreground">Time Left</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Game Canvas */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className="border border-border rounded-lg"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
              
              {isPlaying && (
                <div className="text-center space-y-2">
                  <div className="text-sm text-muted-foreground">
                    Use arrow keys to move, spacebar to drop
                  </div>
                  <Progress value={(60 - timeLeft) / 60 * 100} className="w-64" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Next Piece and Controls */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Next Piece</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-24 h-24 border border-border rounded-lg flex items-center justify-center bg-muted/30">
                {nextPiece && (
                  <div className="grid gap-1" style={{ 
                    gridTemplateColumns: `repeat(${nextPiece.shape[0].length}, 1fr)`,
                    gridTemplateRows: `repeat(${nextPiece.shape.length}, 1fr)`
                  }}>
                    {nextPiece.shape.flat().map((cell, index) => (
                      <div
                        key={index}
                        className="w-3 h-3 rounded-sm"
                        style={{
                          backgroundColor: cell ? nextPiece.color : 'transparent'
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Move Left/Right:</span>
                <Badge variant="outline">← →</Badge>
              </div>
              <div className="flex justify-between">
                <span>Soft Drop:</span>
                <Badge variant="outline">↓</Badge>
              </div>
              <div className="flex justify-between">
                <span>Rotate:</span>
                <Badge variant="outline">↑</Badge>
              </div>
              <div className="flex justify-between">
                <span>Hard Drop:</span>
                <Badge variant="outline">Space</Badge>
              </div>
            </CardContent>
          </Card>

          {gameEnded && (
            <Card>
              <CardContent className="p-6 text-center space-y-4">
                <Trophy className="h-16 w-16 text-gold mx-auto" />
                <h3 className="text-2xl font-bold">Game Complete!</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-xl font-bold text-gold">{score}</div>
                    <div className="text-muted-foreground">Final Score</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-sweep">{lines}</div>
                    <div className="text-muted-foreground">Lines Cleared</div>
                  </div>
                </div>
                <div className="text-lg">
                  You earned{" "}
                  <span className="text-gold font-bold">
                    {score >= 2000 ? "0.25" : score >= 1500 ? "0.20" : score >= 1000 ? "0.15" : score >= 500 ? "0.10" : score >= 200 ? "0.05" : "0.00"} SC
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
