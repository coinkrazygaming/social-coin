import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Clock, 
  Trophy, 
  Star, 
  Timer, 
  Lock, 
  Play, 
  Target,
  Gift,
  Shield,
  AlertTriangle,
  CheckCircle,
  Coins
} from "lucide-react";
import { useAuth } from "./AuthContext";
import { AuthModal } from "./AuthModal";
import { ColinShots } from "./ColinShots";
import { BethsDarts } from "./BethsDarts";
import { JoseysQuackAttack } from "./JoseysQuackAttack";
import { CoreysFastBlocks } from "./CoreysFastBlocks";
import { CoreysFastJewels } from "./CoreysFastJewels";
import { BrensMeow } from "./BrensMeow";
import { TheresasFrogz } from "./TheresasFrogz";

interface MiniGame {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  maxScore: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  maxReward: number;
  component: React.ComponentType<any>;
  category: 'Sports' | 'Arcade' | 'Puzzle' | 'Strategy';
  thumbnail: string;
}

interface GameSession {
  id: string;
  userId: string;
  gameId: string;
  score: number;
  maxScore: number;
  scEarned: number;
  duration: number;
  accuracy: number;
  playedAt: Date;
  ipAddress: string;
  userAgent: string;
  sessionData: any;
}

interface CooldownData {
  gameId: string;
  lastPlayed: Date;
  nextAvailable: Date;
  attemptsToday: number;
}

interface SecurityEvent {
  id: string;
  userId: string;
  type: 'unusual_pattern' | 'multiple_attempts' | 'suspicious_score' | 'timing_anomaly';
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: string;
  timestamp: Date;
  ipAddress: string;
  gameId?: string;
  actionTaken: string;
  reviewStatus: 'pending' | 'approved' | 'denied' | 'investigating';
}

const MINI_GAMES: MiniGame[] = [
  {
    id: 'colin_shots',
    name: "Colin's Basketball Shots",
    description: "Make as many basketball shots as possible in 60 seconds!",
    icon: <Target className="h-6 w-6" />,
    maxScore: 50,
    difficulty: 'Medium',
    maxReward: 0.25,
    component: ColinShots,
    category: 'Sports',
    thumbnail: 'basketball'
  },
  {
    id: 'beths_darts',
    name: "Beth's Dartboard Challenge", 
    description: "Hit the bullseye and rack up points in this precision game!",
    icon: <Target className="h-6 w-6" />,
    maxScore: 180,
    difficulty: 'Hard',
    maxReward: 0.25,
    component: BethsDarts,
    category: 'Sports',
    thumbnail: 'dartboard'
  },
  {
    id: 'joseys_quack_attack',
    name: "Josey's Quack Attack",
    description: "Duck hunting adventure with moving targets!",
    icon: <Target className="h-6 w-6" />,
    maxScore: 100,
    difficulty: 'Medium',
    maxReward: 0.25,
    component: JoseysQuackAttack,
    category: 'Arcade',
    thumbnail: 'duck_hunt'
  },
  {
    id: 'coreys_fast_blocks',
    name: "Corey's Fast Blocks",
    description: "Tetris-style block matching challenge!",
    icon: <Star className="h-6 w-6" />,
    maxScore: 10000,
    difficulty: 'Medium',
    maxReward: 0.25,
    component: CoreysFastBlocks,
    category: 'Puzzle',
    thumbnail: 'tetris'
  },
  {
    id: 'coreys_fast_jewels',
    name: "Corey's Fast Jewels",
    description: "Match colorful gems in this jewel-crushing adventure!",
    icon: <Star className="h-6 w-6" />,
    maxScore: 5000,
    difficulty: 'Easy',
    maxReward: 0.25,
    component: CoreysFastJewels,
    category: 'Puzzle',
    thumbnail: 'gems'
  },
  {
    id: 'brens_meow',
    name: "Bren's Cat Catcher",
    description: "Catch as many cats as possible before time runs out!",
    icon: <Trophy className="h-6 w-6" />,
    maxScore: 30,
    difficulty: 'Easy',
    maxReward: 0.25,
    component: BrensMeow,
    category: 'Strategy',
    thumbnail: 'cat_catcher'
  },
  {
    id: 'theresas_frogz',
    name: "Theresa's Frog Hop",
    description: "Help the frog hop across lily pads to safety!",
    icon: <Trophy className="h-6 w-6" />,
    maxScore: 100,
    difficulty: 'Medium',
    maxReward: 0.25,
    component: TheresasFrogz,
    category: 'Arcade',
    thumbnail: 'frog_hop'
  }
];

export function MiniGamesPlatform() {
  const { user } = useAuth();
  const [selectedGame, setSelectedGame] = useState<MiniGame | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [cooldowns, setCooldowns] = useState<Map<string, CooldownData>>(new Map());
  const [gameHistory, setGameHistory] = useState<GameSession[]>([]);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [gameInProgress, setGameInProgress] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Load cooldown data
      const cooldownResponse = await fetch(`/api/mini-games/${user.id}/cooldowns`);
      if (cooldownResponse.ok) {
        const cooldownData = await cooldownResponse.json();
        const cooldownMap = new Map();
        cooldownData.forEach((cd: any) => {
          cooldownMap.set(cd.gameId, {
            ...cd,
            lastPlayed: new Date(cd.lastPlayed),
            nextAvailable: new Date(cd.nextAvailable)
          });
        });
        setCooldowns(cooldownMap);
      }

      // Load game history
      const historyResponse = await fetch(`/api/mini-games/${user.id}/history`);
      if (historyResponse.ok) {
        const history = await historyResponse.json();
        setGameHistory(history.map((h: any) => ({
          ...h,
          playedAt: new Date(h.playedAt)
        })));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkCooldown = (gameId: string): { canPlay: boolean; timeRemaining: number } => {
    const cooldown = cooldowns.get(gameId);
    if (!cooldown) {
      return { canPlay: true, timeRemaining: 0 };
    }

    const now = new Date();
    const canPlay = now >= cooldown.nextAvailable;
    const timeRemaining = canPlay ? 0 : cooldown.nextAvailable.getTime() - now.getTime();

    return { canPlay, timeRemaining };
  };

  const formatTimeRemaining = (ms: number): string => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const analyzeSecurityData = (session: GameSession): SecurityEvent[] => {
    const events: SecurityEvent[] = [];
    const userHistory = gameHistory.filter(h => h.userId === session.userId);
    
    // Check for unusual high scores
    const avgScore = userHistory.length > 0 
      ? userHistory.reduce((sum, h) => sum + (h.score / h.maxScore), 0) / userHistory.length
      : 0;
    const currentPerformance = session.score / session.maxScore;
    
    if (currentPerformance > 0.95 && avgScore < 0.5) {
      events.push({
        id: `security_${Date.now()}_1`,
        userId: session.userId,
        type: 'suspicious_score',
        severity: 'medium',
        details: `Sudden performance improvement: ${(currentPerformance * 100).toFixed(1)}% vs avg ${(avgScore * 100).toFixed(1)}%`,
        timestamp: new Date(),
        ipAddress: session.ipAddress,
        gameId: session.gameId,
        actionTaken: 'flagged_for_review',
        reviewStatus: 'pending'
      });
    }

    // Check for timing anomalies
    if (session.duration < 30) {
      events.push({
        id: `security_${Date.now()}_2`,
        userId: session.userId,
        type: 'timing_anomaly',
        severity: 'high',
        details: `Game completed too quickly: ${session.duration}s (minimum expected: 30s)`,
        timestamp: new Date(),
        ipAddress: session.ipAddress,
        gameId: session.gameId,
        actionTaken: 'score_invalidated',
        reviewStatus: 'pending'
      });
    }

    return events;
  };

  const logGameSession = async (session: GameSession) => {
    try {
      // Log to AI Employee Agent
      const aiLogResponse = await fetch('/api/ai-employees/mini-games/log-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session,
          userHistory: gameHistory.filter(h => h.userId === session.userId),
          securityAnalysis: analyzeSecurityData(session)
        })
      });

      // Log security events
      const securityEvents = analyzeSecurityData(session);
      if (securityEvents.length > 0) {
        setSecurityEvents(prev => [...prev, ...securityEvents]);
        
        // Alert security AI
        await fetch('/api/ai-employees/security/analyze-events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ events: securityEvents })
        });
      }

      // Update game history
      setGameHistory(prev => [session, ...prev]);
      
      // Update cooldown
      const cooldown: CooldownData = {
        gameId: session.gameId,
        lastPlayed: session.playedAt,
        nextAvailable: new Date(session.playedAt.getTime() + 24 * 60 * 60 * 1000),
        attemptsToday: 1
      };
      setCooldowns(prev => new Map(prev.set(session.gameId, cooldown)));

    } catch (error) {
      console.error('Error logging game session:', error);
    }
  };

  const handleGameComplete = async (gameId: string, score: number, duration: number, additionalData: any = {}) => {
    if (!user) return;

    const game = MINI_GAMES.find(g => g.id === gameId);
    if (!game) return;

    const scorePercentage = score / game.maxScore;
    const scEarned = Math.min(0.25, Math.round(scorePercentage * 0.25 * 100) / 100);

    const session: GameSession = {
      id: `session_${Date.now()}`,
      userId: user.id,
      gameId,
      score,
      maxScore: game.maxScore,
      scEarned,
      duration,
      accuracy: scorePercentage,
      playedAt: new Date(),
      ipAddress: await getUserIP(),
      userAgent: navigator.userAgent,
      sessionData: additionalData
    };

    // Award SC to user
    if (scEarned > 0) {
      try {
        await fetch(`/api/users/${user.id}/balance`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            goldCoins: 0,
            sweepsCoins: scEarned,
            type: 'mini-game',
            description: `${game.name} reward - ${score}/${game.maxScore}`
          })
        });
      } catch (error) {
        console.error('Error awarding SC:', error);
      }
    }

    await logGameSession(session);
    setGameInProgress(false);
    setSelectedGame(null);
  };

  const getUserIP = async (): Promise<string> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return 'unknown';
    }
  };

  const handleGameStart = (game: MiniGame) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    const { canPlay } = checkCooldown(game.id);
    if (!canPlay) {
      return;
    }

    setSelectedGame(game);
    setGameInProgress(true);
  };

  const filteredGames = selectedCategory === 'All' 
    ? MINI_GAMES 
    : MINI_GAMES.filter(game => game.category === selectedCategory);

  if (selectedGame && gameInProgress) {
    const GameComponent = selectedGame.component;
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-4 flex justify-between items-center">
            <Button 
              variant="outline" 
              onClick={() => {
                setGameInProgress(false);
                setSelectedGame(null);
              }}
            >
              ← Back to Games
            </Button>
            <div className="text-white text-center">
              <h2 className="text-2xl font-bold">{selectedGame.name}</h2>
              <p className="text-purple-200">Max Reward: {selectedGame.maxReward} SC</p>
            </div>
          </div>
          
          <GameComponent
            userId={user?.id || ''}
            username={user?.username || ''}
            onGameComplete={(score: number, additionalData?: any) => 
              handleGameComplete(selectedGame.id, score, 60, additionalData)
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🎮 CoinKrazy Mini Games
          </h1>
          <p className="text-purple-200 text-lg">
            Play fun games every 24 hours and earn real Sweeps Coins!
          </p>
          {!user && (
            <div className="mt-4 p-4 bg-amber-500/20 border border-amber-500/50 rounded-lg">
              <p className="text-amber-200 flex items-center justify-center gap-2">
                <Lock className="h-5 w-5" />
                Login required to play and earn rewards
              </p>
            </div>
          )}
        </div>

        {/* Category Filter */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="All">All Games</TabsTrigger>
            <TabsTrigger value="Sports">Sports</TabsTrigger>
            <TabsTrigger value="Arcade">Arcade</TabsTrigger>
            <TabsTrigger value="Puzzle">Puzzle</TabsTrigger>
            <TabsTrigger value="Strategy">Strategy</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game) => {
            const { canPlay, timeRemaining } = user ? checkCooldown(game.id) : { canPlay: false, timeRemaining: 0 };
            const isLocked = !user || !canPlay;

            return (
              <Card key={game.id} className="bg-gray-800 border-gray-700 hover:border-gold/50 transition-all">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {game.icon}
                      <div>
                        <CardTitle className="text-white text-lg">{game.name}</CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {game.difficulty}
                        </Badge>
                      </div>
                    </div>
                    {isLocked && (
                      <Lock className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-gray-300 text-sm mb-4">{game.description}</p>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Max Reward:</span>
                      <span className="text-green-400 font-semibold flex items-center gap-1">
                        <Coins className="h-4 w-4" />
                        {game.maxReward} SC
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Category:</span>
                      <span className="text-blue-400">{game.category}</span>
                    </div>
                    
                    {user && !canPlay && (
                      <div className="text-center p-3 bg-red-500/20 border border-red-500/50 rounded">
                        <div className="flex items-center justify-center gap-2 text-red-300">
                          <Timer className="h-4 w-4" />
                          <span className="text-sm">
                            Next play: {formatTimeRemaining(timeRemaining)}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <Button
                      onClick={() => handleGameStart(game)}
                      disabled={isLocked}
                      className={`w-full ${
                        isLocked 
                          ? 'bg-gray-600 text-gray-400' 
                          : 'bg-gradient-to-r from-gold to-yellow-500 text-black font-bold hover:from-yellow-500 hover:to-gold'
                      }`}
                    >
                      {!user ? (
                        <>
                          <Lock className="h-4 w-4 mr-2" />
                          Login to Play
                        </>
                      ) : !canPlay ? (
                        <>
                          <Timer className="h-4 w-4 mr-2" />
                          On Cooldown
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Play Now
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* User Stats */}
        {user && gameHistory.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">Your Gaming Stats</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6 text-center">
                  <Trophy className="h-8 w-8 text-gold mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gold">
                    {gameHistory.length}
                  </div>
                  <div className="text-gray-400">Games Played</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6 text-center">
                  <Coins className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-400">
                    {gameHistory.reduce((sum, game) => sum + game.scEarned, 0).toFixed(2)}
                  </div>
                  <div className="text-gray-400">SC Earned</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6 text-center">
                  <Star className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-400">
                    {Math.round(gameHistory.reduce((sum, game) => sum + game.accuracy, 0) / gameHistory.length * 100)}%
                  </div>
                  <div className="text-gray-400">Avg Accuracy</div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Auth Modal */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          defaultTab="register"
        />
      </div>
    </div>
  );
}
