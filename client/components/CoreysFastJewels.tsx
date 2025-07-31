import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Timer, Target, Trophy, Play, RotateCcw } from "lucide-react";

interface CoreysFastJewelsProps {
  userId: string;
  username: string;
  onGameComplete: (score: number, scEarned: number) => void;
}

interface Gem {
  type: number;
  x: number;
  y: number;
  falling: boolean;
  matched: boolean;
  eliminating: boolean;
}

interface SelectedGem {
  x: number;
  y: number;
}

const GEM_TYPES = 6;
const GRID_SIZE = 8;
const GEM_COLORS = [
  '#FF0000', // Red
  '#00FF00', // Green
  '#0000FF', // Blue
  '#FFFF00', // Yellow
  '#FF00FF', // Magenta
  '#00FFFF', // Cyan
];

export function CoreysFastJewels({ userId, username, onGameComplete }: CoreysFastJewelsProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [grid, setGrid] = useState<Gem[][]>([]);
  const [selectedGem, setSelectedGem] = useState<SelectedGem | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [combo, setCombo] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const gameTimerRef = useRef<NodeJS.Timeout>();

  // Game dimensions
  const CANVAS_WIDTH = 480;
  const CANVAS_HEIGHT = 480;
  const GEM_SIZE = CANVAS_WIDTH / GRID_SIZE;

  const createRandomGem = useCallback((x: number, y: number): Gem => {
    return {
      type: Math.floor(Math.random() * GEM_TYPES),
      x,
      y,
      falling: false,
      matched: false,
      eliminating: false,
    };
  }, []);

  const initializeGrid = useCallback(() => {
    const newGrid: Gem[][] = [];
    
    for (let y = 0; y < GRID_SIZE; y++) {
      newGrid[y] = [];
      for (let x = 0; x < GRID_SIZE; x++) {
        let gem: Gem;
        do {
          gem = createRandomGem(x, y);
        } while (
          // Avoid creating initial matches
          (x >= 2 && newGrid[y][x - 1].type === gem.type && newGrid[y][x - 2].type === gem.type) ||
          (y >= 2 && newGrid[y - 1][x].type === gem.type && newGrid[y - 2][x].type === gem.type)
        );
        newGrid[y][x] = gem;
      }
    }
    
    return newGrid;
  }, [createRandomGem]);

  const startGame = useCallback(() => {
    setIsPlaying(true);
    setGameStarted(true);
    setGameEnded(false);
    setTimeLeft(60);
    setScore(0);
    setMoves(0);
    setMatches(0);
    setCombo(0);
    setSelectedGem(null);
    setIsProcessing(false);
    
    const newGrid = initializeGrid();
    setGrid(newGrid);

    gameTimerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [initializeGrid]);

  const endGame = useCallback(() => {
    setIsPlaying(false);
    setGameEnded(true);
    
    if (gameTimerRef.current) {
      clearInterval(gameTimerRef.current);
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    // Calculate SC earned based on score
    let scEarned = 0;
    if (score >= 3000) scEarned = 0.25;
    else if (score >= 2500) scEarned = 0.20;
    else if (score >= 2000) scEarned = 0.15;
    else if (score >= 1500) scEarned = 0.10;
    else if (score >= 1000) scEarned = 0.05;

    setTimeout(() => {
      onGameComplete(score, scEarned);
    }, 2000);
  }, [score, onGameComplete]);

  const findMatches = useCallback((grid: Gem[][]): { x: number; y: number }[] => {
    const matches: { x: number; y: number }[] = [];
    
    // Check horizontal matches
    for (let y = 0; y < GRID_SIZE; y++) {
      let count = 1;
      let currentType = grid[y][0].type;
      
      for (let x = 1; x < GRID_SIZE; x++) {
        if (grid[y][x].type === currentType) {
          count++;
        } else {
          if (count >= 3) {
            for (let i = x - count; i < x; i++) {
              matches.push({ x: i, y });
            }
          }
          count = 1;
          currentType = grid[y][x].type;
        }
      }
      
      if (count >= 3) {
        for (let i = GRID_SIZE - count; i < GRID_SIZE; i++) {
          matches.push({ x: i, y });
        }
      }
    }
    
    // Check vertical matches
    for (let x = 0; x < GRID_SIZE; x++) {
      let count = 1;
      let currentType = grid[0][x].type;
      
      for (let y = 1; y < GRID_SIZE; y++) {
        if (grid[y][x].type === currentType) {
          count++;
        } else {
          if (count >= 3) {
            for (let i = y - count; i < y; i++) {
              matches.push({ x, y: i });
            }
          }
          count = 1;
          currentType = grid[y][x].type;
        }
      }
      
      if (count >= 3) {
        for (let i = GRID_SIZE - count; i < GRID_SIZE; i++) {
          matches.push({ x, y: i });
        }
      }
    }
    
    return matches;
  }, []);

  const removeMatches = useCallback((grid: Gem[][], matches: { x: number; y: number }[]): Gem[][] => {
    const newGrid = grid.map(row => [...row]);
    
    matches.forEach(({ x, y }) => {
      newGrid[y][x].eliminating = true;
    });
    
    return newGrid;
  }, []);

  const dropGems = useCallback((grid: Gem[][]): Gem[][] => {
    const newGrid = grid.map(row => [...row]);
    
    for (let x = 0; x < GRID_SIZE; x++) {
      let writeIndex = GRID_SIZE - 1;
      
      // Drop existing gems
      for (let y = GRID_SIZE - 1; y >= 0; y--) {
        if (!newGrid[y][x].eliminating) {
          if (writeIndex !== y) {
            newGrid[writeIndex][x] = { ...newGrid[y][x], y: writeIndex };
            newGrid[y][x] = createRandomGem(x, y);
          }
          writeIndex--;
        }
      }
      
      // Fill empty spaces with new gems
      for (let y = writeIndex; y >= 0; y--) {
        newGrid[y][x] = createRandomGem(x, y);
      }
    }
    
    return newGrid;
  }, [createRandomGem]);

  const processMatches = useCallback(async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    let currentGrid = [...grid];
    let totalMatches = 0;
    let currentCombo = 0;
    
    while (true) {
      const matches = findMatches(currentGrid);
      if (matches.length === 0) break;
      
      totalMatches += matches.length;
      currentCombo++;
      
      // Calculate score with combo multiplier
      const baseScore = matches.length * 10;
      const comboBonus = currentCombo > 1 ? baseScore * (currentCombo - 1) : 0;
      setScore(prev => prev + baseScore + comboBonus);
      
      setMatches(prev => prev + matches.length);
      setCombo(currentCombo);
      
      // Remove matches
      currentGrid = removeMatches(currentGrid, matches);
      setGrid(currentGrid);
      
      // Wait for animation
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Drop gems
      currentGrid = dropGems(currentGrid);
      setGrid(currentGrid);
      
      // Wait for drop animation
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    setCombo(0);
    setIsProcessing(false);
  }, [grid, isProcessing, findMatches, removeMatches, dropGems]);

  const swapGems = useCallback((x1: number, y1: number, x2: number, y2: number) => {
    const newGrid = grid.map(row => [...row]);
    const temp = newGrid[y1][x1];
    newGrid[y1][x1] = newGrid[y2][x2];
    newGrid[y2][x2] = temp;
    
    // Update positions
    newGrid[y1][x1].x = x1;
    newGrid[y1][x1].y = y1;
    newGrid[y2][x2].x = x2;
    newGrid[y2][x2].y = y2;
    
    return newGrid;
  }, [grid]);

  const isValidSwap = useCallback((x1: number, y1: number, x2: number, y2: number): boolean => {
    const testGrid = swapGems(x1, y1, x2, y2);
    const matches = findMatches(testGrid);
    return matches.length > 0;
  }, [swapGems, findMatches]);

  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPlaying || isProcessing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const clickX = Math.floor(((event.clientX - rect.left) * scaleX) / GEM_SIZE);
    const clickY = Math.floor(((event.clientY - rect.top) * scaleY) / GEM_SIZE);

    if (clickX < 0 || clickX >= GRID_SIZE || clickY < 0 || clickY >= GRID_SIZE) return;

    if (!selectedGem) {
      setSelectedGem({ x: clickX, y: clickY });
    } else {
      const { x: sx, y: sy } = selectedGem;
      
      if (sx === clickX && sy === clickY) {
        // Deselect if clicking the same gem
        setSelectedGem(null);
      } else {
        // Check if gems are adjacent
        const dx = Math.abs(sx - clickX);
        const dy = Math.abs(sy - clickY);
        
        if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
          // Valid adjacent swap
          if (isValidSwap(sx, sy, clickX, clickY)) {
            const newGrid = swapGems(sx, sy, clickX, clickY);
            setGrid(newGrid);
            setMoves(prev => prev + 1);
            setSelectedGem(null);
            
            // Process matches after a short delay
            setTimeout(() => {
              processMatches();
            }, 100);
          } else {
            // Invalid swap, animate back
            setSelectedGem(null);
          }
        } else {
          // Not adjacent, select new gem
          setSelectedGem({ x: clickX, y: clickY });
        }
      }
    }
  }, [isPlaying, isProcessing, selectedGem, isValidSwap, swapGems, processMatches]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw grid background
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    for (let x = 0; x <= GRID_SIZE; x++) {
      ctx.beginPath();
      ctx.moveTo(x * GEM_SIZE, 0);
      ctx.lineTo(x * GEM_SIZE, CANVAS_HEIGHT);
      ctx.stroke();
    }
    for (let y = 0; y <= GRID_SIZE; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * GEM_SIZE);
      ctx.lineTo(CANVAS_WIDTH, y * GEM_SIZE);
      ctx.stroke();
    }

    // Draw gems
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const gem = grid[y] && grid[y][x];
        if (!gem) continue;

        const drawX = x * GEM_SIZE;
        const drawY = y * GEM_SIZE;
        
        // Gem background
        if (gem.eliminating) {
          ctx.fillStyle = '#FF0000';
          ctx.globalAlpha = 0.5;
        } else {
          ctx.fillStyle = GEM_COLORS[gem.type];
          ctx.globalAlpha = 1;
        }
        
        // Draw gem shape (diamond)
        ctx.beginPath();
        ctx.moveTo(drawX + GEM_SIZE / 2, drawY + 5);
        ctx.lineTo(drawX + GEM_SIZE - 5, drawY + GEM_SIZE / 2);
        ctx.lineTo(drawX + GEM_SIZE / 2, drawY + GEM_SIZE - 5);
        ctx.lineTo(drawX + 5, drawY + GEM_SIZE / 2);
        ctx.closePath();
        ctx.fill();
        
        // Add gem highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.moveTo(drawX + GEM_SIZE / 2, drawY + 5);
        ctx.lineTo(drawX + GEM_SIZE - 5, drawY + GEM_SIZE / 2);
        ctx.lineTo(drawX + GEM_SIZE / 2, drawY + GEM_SIZE / 3);
        ctx.lineTo(drawX + 5, drawY + GEM_SIZE / 2);
        ctx.closePath();
        ctx.fill();
        
        // Draw selection highlight
        if (selectedGem && selectedGem.x === x && selectedGem.y === y) {
          ctx.strokeStyle = '#FFD700';
          ctx.lineWidth = 4;
          ctx.strokeRect(drawX + 2, drawY + 2, GEM_SIZE - 4, GEM_SIZE - 4);
        }
        
        ctx.globalAlpha = 1;
      }
    }

    // Draw combo indicator
    if (combo > 1) {
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`COMBO x${combo}!`, CANVAS_WIDTH / 2, 30);
    }
  }, [grid, selectedGem, combo]);

  const animate = useCallback(() => {
    draw();
    animationRef.current = requestAnimationFrame(animate);
  }, [draw]);

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
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const averageScore = moves > 0 ? Math.round(score / moves) : 0;

  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] space-y-6">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center space-x-2">
              <span className="text-4xl">💎</span>
              <span>Corey's Fast Jewels</span>
            </CardTitle>
            <CardDescription>
              Match gems quickly - create combos to earn SC!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground space-y-2">
              <p>• Click gems to select, then click an adjacent gem to swap</p>
              <p>• Match 3 or more gems in a row or column</p>
              <p>• Create combos for bonus points</p>
              <p>• Higher scores = more Sweeps Coins!</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-muted p-3 rounded-lg">
                <div className="text-gold font-semibold">3000+ Points</div>
                <div className="text-xs">0.25 SC</div>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <div className="text-yellow-400 font-semibold">2500+ Points</div>
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
            <div className="text-2xl font-bold text-sweep">{matches}</div>
            <div className="text-sm text-muted-foreground">Gems Matched</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{moves}</div>
            <div className="text-sm text-muted-foreground">Moves</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{averageScore}</div>
            <div className="text-sm text-muted-foreground">Avg/Move</div>
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
              onClick={handleCanvasClick}
              style={{ maxWidth: '100%', height: 'auto' }}
            />
            
            {isPlaying && (
              <div className="text-center space-y-2">
                <div className="text-lg font-semibold">
                  {selectedGem ? 'Click an adjacent gem to swap!' : 'Click a gem to select it!'}
                </div>
                <Progress value={(60 - timeLeft) / 60 * 100} className="w-64" />
                {combo > 1 && (
                  <Badge variant="secondary" className="bg-gold/20 text-gold">
                    COMBO x{combo}!
                  </Badge>
                )}
                {isProcessing && (
                  <Badge variant="secondary" className="animate-pulse">
                    Processing matches...
                  </Badge>
                )}
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
                    <div className="text-xl font-bold text-sweep">{matches}</div>
                    <div className="text-muted-foreground">Gems Matched</div>
                  </div>
                </div>
                <div className="text-lg">
                  You earned{" "}
                  <span className="text-gold font-bold">
                    {score >= 3000 ? "0.25" : score >= 2500 ? "0.20" : score >= 2000 ? "0.15" : score >= 1500 ? "0.10" : score >= 1000 ? "0.05" : "0.00"} SC
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
