import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Timer, Target, Trophy, Play, RotateCcw } from "lucide-react";

interface HeathersWhackACoreyProps {
  userId: string;
  username: string;
  onGameComplete: (score: number, scEarned: number) => void;
}

interface Mole {
  id: number;
  x: number;
  y: number;
  active: boolean;
  type: 'corey' | 'bomb' | 'golden';
  animationState: 'rising' | 'visible' | 'falling';
  spawnTime: number;
  visibleTime: number;
}

interface Hole {
  x: number;
  y: number;
  radius: number;
}

export function HeathersWhackACorey({ userId, username, onGameComplete }: HeathersWhackACoreyProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [moles, setMoles] = useState<Mole[]>([]);
  const [holes] = useState<Hole[]>(() => {
    // Generate 9 holes in a 3x3 grid
    const holes: Hole[] = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        holes.push({
          x: 150 + col * 180,
          y: 150 + row * 140,
          radius: 60,
        });
      }
    }
    return holes;
  });
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [hitEffects, setHitEffects] = useState<{id: number; x: number; y: number; type: string; timestamp: number}[]>([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const gameTimerRef = useRef<NodeJS.Timeout>();
  const moleSpawnerRef = useRef<NodeJS.Timeout>();

  // Game dimensions
  const CANVAS_WIDTH = 700;
  const CANVAS_HEIGHT = 550;

  const startGame = useCallback(() => {
    setIsPlaying(true);
    setGameStarted(true);
    setGameEnded(false);
    setTimeLeft(60);
    setScore(0);
    setHits(0);
    setMisses(0);
    setMoles([]);
    setHitEffects([]);

    gameTimerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Start spawning moles
    spawnMole();
    moleSpawnerRef.current = setInterval(spawnMole, 800 + Math.random() * 1200);
  }, []);

  const endGame = useCallback(() => {
    setIsPlaying(false);
    setGameEnded(true);
    
    if (gameTimerRef.current) {
      clearInterval(gameTimerRef.current);
    }
    if (moleSpawnerRef.current) {
      clearInterval(moleSpawnerRef.current);
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    // Calculate SC earned based on score
    let scEarned = 0;
    if (score >= 1500) scEarned = 0.25;
    else if (score >= 1200) scEarned = 0.20;
    else if (score >= 900) scEarned = 0.15;
    else if (score >= 600) scEarned = 0.10;
    else if (score >= 300) scEarned = 0.05;

    setTimeout(() => {
      onGameComplete(score, scEarned);
    }, 2000);
  }, [score, onGameComplete]);

  const spawnMole = useCallback(() => {
    if (!isPlaying) return;

    // Find available holes (no active moles)
    const activeMoleHoles = new Set(moles.map(mole => `${mole.x}-${mole.y}`));
    const availableHoles = holes.filter(hole => !activeMoleHoles.has(`${hole.x}-${hole.y}`));
    
    if (availableHoles.length === 0) return;

    const randomHole = availableHoles[Math.floor(Math.random() * availableHoles.length)];
    
    // Determine mole type
    const rand = Math.random();
    let type: 'corey' | 'bomb' | 'golden';
    if (rand < 0.05) type = 'golden'; // 5% chance
    else if (rand < 0.15) type = 'bomb'; // 10% chance
    else type = 'corey'; // 85% chance

    const newMole: Mole = {
      id: Date.now() + Math.random(),
      x: randomHole.x,
      y: randomHole.y,
      active: true,
      type,
      animationState: 'rising',
      spawnTime: Date.now(),
      visibleTime: type === 'golden' ? 1500 : type === 'bomb' ? 2500 : 2000,
    };

    setMoles(prev => [...prev, newMole]);
  }, [isPlaying, moles, holes]);

  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPlaying) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const clickX = (event.clientX - rect.left) * scaleX;
    const clickY = (event.clientY - rect.top) * scaleY;

    let hitMole = false;

    setMoles(prevMoles => prevMoles.map(mole => {
      if (mole.active && mole.animationState === 'visible') {
        const distance = Math.sqrt((clickX - mole.x) ** 2 + (clickY - mole.y) ** 2);
        
        if (distance <= 50) {
          hitMole = true;
          setHits(prev => prev + 1);
          
          let points = 0;
          let effectType = '';
          
          switch (mole.type) {
            case 'corey':
              points = 100;
              effectType = 'hit';
              break;
            case 'golden':
              points = 500;
              effectType = 'golden';
              break;
            case 'bomb':
              points = -200;
              effectType = 'bomb';
              break;
          }
          
          setScore(prev => Math.max(0, prev + points));
          
          // Add hit effect
          setHitEffects(prev => [...prev, {
            id: Date.now(),
            x: mole.x,
            y: mole.y,
            type: effectType,
            timestamp: Date.now(),
          }]);
          
          return { ...mole, active: false, animationState: 'falling' };
        }
      }
      return mole;
    }));

    if (!hitMole) {
      setMisses(prev => prev + 1);
    }
  }, [isPlaying]);

  const updateMoles = useCallback(() => {
    const currentTime = Date.now();
    
    setMoles(prevMoles => prevMoles.map(mole => {
      const timeAlive = currentTime - mole.spawnTime;
      
      if (mole.animationState === 'rising' && timeAlive > 300) {
        return { ...mole, animationState: 'visible' };
      } else if (mole.animationState === 'visible' && timeAlive > mole.visibleTime) {
        return { ...mole, animationState: 'falling', active: false };
      }
      
      return mole;
    }).filter(mole => {
      const timeAlive = currentTime - mole.spawnTime;
      return timeAlive < mole.visibleTime + 500; // Remove after falling animation
    }));

    // Clean up old hit effects
    setHitEffects(prev => prev.filter(effect => currentTime - effect.timestamp < 1000));
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with grass background
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#228B22');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw holes
    holes.forEach(hole => {
      // Hole shadow
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(hole.x, hole.y, hole.radius, 0, Math.PI * 2);
      ctx.fill();
      
      // Hole border
      ctx.strokeStyle = '#654321';
      ctx.lineWidth = 8;
      ctx.stroke();
      
      // Hole interior
      ctx.fillStyle = '#2F1B1B';
      ctx.beginPath();
      ctx.arc(hole.x, hole.y, hole.radius - 4, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw moles
    moles.forEach(mole => {
      const timeAlive = Date.now() - mole.spawnTime;
      let yOffset = 0;
      
      // Animation offset
      if (mole.animationState === 'rising') {
        yOffset = 60 - (timeAlive / 300) * 60;
      } else if (mole.animationState === 'falling') {
        const fallTime = timeAlive - mole.visibleTime;
        yOffset = (fallTime / 500) * 60;
      }
      
      const drawY = mole.y + yOffset;
      
      // Don't draw if fully underground
      if (yOffset >= 60) return;
      
      ctx.save();
      ctx.translate(mole.x, drawY);
      
      // Mole body
      let bodyColor = '#8B4513';
      if (mole.type === 'golden') bodyColor = '#FFD700';
      else if (mole.type === 'bomb') bodyColor = '#2F2F2F';
      
      ctx.fillStyle = bodyColor;
      ctx.beginPath();
      ctx.ellipse(0, 0, 35, 45, 0, 0, Math.PI * 2);
      ctx.fill();
      
      if (mole.type === 'bomb') {
        // Draw bomb
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(0, 0, 30, 0, Math.PI * 2);
        ctx.fill();
        
        // Fuse
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, -30);
        ctx.lineTo(10, -45);
        ctx.stroke();
        
        // Spark
        ctx.fillStyle = '#FF0000';
        ctx.beginPath();
        ctx.arc(10, -45, 3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('💣', 0, 5);
      } else {
        // Draw Corey face
        // Eyes
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(-10, -10, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(10, -10, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Nose
        ctx.fillStyle = '#FF69B4';
        ctx.beginPath();
        ctx.arc(0, -2, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Mouth
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 5, 8, 0, Math.PI);
        ctx.stroke();
        
        // Hair
        ctx.fillStyle = mole.type === 'golden' ? '#FFD700' : '#654321';
        ctx.fillRect(-20, -35, 40, 15);
        
        // Special golden effects
        if (mole.type === 'golden') {
          ctx.strokeStyle = '#FFFF00';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(0, 0, 45, 0, Math.PI * 2);
          ctx.stroke();
          
          // Sparkles
          for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2 + Date.now() * 0.01;
            const x = Math.cos(angle) * 50;
            const y = Math.sin(angle) * 50;
            
            ctx.fillStyle = '#FFFF00';
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      
      ctx.restore();
    });

    // Draw hit effects
    hitEffects.forEach(effect => {
      const age = Date.now() - effect.timestamp;
      const alpha = 1 - age / 1000;
      
      ctx.globalAlpha = alpha;
      
      switch (effect.type) {
        case 'hit':
          ctx.fillStyle = '#00FF00';
          ctx.font = 'bold 24px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('+100', effect.x, effect.y - age * 0.05);
          break;
          
        case 'golden':
          ctx.fillStyle = '#FFD700';
          ctx.font = 'bold 32px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('+500!', effect.x, effect.y - age * 0.05);
          break;
          
        case 'bomb':
          ctx.fillStyle = '#FF0000';
          ctx.font = 'bold 28px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('-200', effect.x, effect.y - age * 0.05);
          
          // Explosion effect
          ctx.strokeStyle = '#FF6600';
          ctx.lineWidth = 4;
          const radius = age * 0.1;
          ctx.beginPath();
          ctx.arc(effect.x, effect.y, radius, 0, Math.PI * 2);
          ctx.stroke();
          break;
      }
      
      ctx.globalAlpha = 1;
    });
  }, [moles, hitEffects, holes]);

  const animate = useCallback(() => {
    updateMoles();
    draw();
    animationRef.current = requestAnimationFrame(animate);
  }, [updateMoles, draw]);

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
      if (moleSpawnerRef.current) {
        clearInterval(moleSpawnerRef.current);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const accuracy = (hits + misses) > 0 ? Math.round((hits / (hits + misses)) * 100) : 0;

  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] space-y-6">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center space-x-2">
              <span className="text-4xl">🔨</span>
              <span>Heather's Whack a Corey</span>
            </CardTitle>
            <CardDescription>
              Classic whack-a-mole with a twist - whack Coreys but avoid bombs!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground space-y-2">
              <p>• Click on Coreys when they pop up to score points</p>
              <p>• Regular Corey = 100 points</p>
              <p>• Golden Corey = 500 points (rare!)</p>
              <p>• Bomb = -200 points (avoid!)</p>
              <p>• Quick reactions get higher scores!</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-muted p-3 rounded-lg">
                <div className="text-gold font-semibold">1500+ Points</div>
                <div className="text-xs">0.25 SC</div>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <div className="text-yellow-400 font-semibold">1200+ Points</div>
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
            <div className="text-2xl font-bold text-sweep">{hits}</div>
            <div className="text-sm text-muted-foreground">Hits</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{accuracy}%</div>
            <div className="text-sm text-muted-foreground">Accuracy</div>
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
                  Click on the Coreys when they pop up!
                </div>
                <Progress value={(60 - timeLeft) / 60 * 100} className="w-64" />
                <div className="flex space-x-4 text-sm">
                  <Badge variant="outline" className="bg-green-500/20 text-green-400">Regular Corey: +100</Badge>
                  <Badge variant="outline" className="bg-gold/20 text-gold">Golden Corey: +500</Badge>
                  <Badge variant="outline" className="bg-red-500/20 text-red-400">Bomb: -200</Badge>
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
                    <div className="text-xl font-bold text-sweep">{accuracy}%</div>
                    <div className="text-muted-foreground">Accuracy</div>
                  </div>
                </div>
                <div className="text-lg">
                  You earned{" "}
                  <span className="text-gold font-bold">
                    {score >= 1500 ? "0.25" : score >= 1200 ? "0.20" : score >= 900 ? "0.15" : score >= 600 ? "0.10" : score >= 300 ? "0.05" : "0.00"} SC
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
