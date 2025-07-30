import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ColinShots } from "@/components/ColinShots";
import { JoseysQuackAttack } from "@/components/JoseysQuackAttack";
import { BethsDarts } from "@/components/BethsDarts";
import { CoreysFastBlocks } from "@/components/CoreysFastBlocks";
import { CoreysFastJewels } from "@/components/CoreysFastJewels";
import { BrensMeow } from "@/components/BrensMeow";
import { FlickenMyBean } from "@/components/FlickenMyBean";
import { DeeDeeFunRun } from "@/components/DeeDeeFunRun";
import { HeathersWhackACorey } from "@/components/HeathersWhackACorey";
import { TheresasFrogz } from "@/components/TheresasFrogz";
import { Clock, Trophy, Star, Timer, RotateCcw, Gamepad2 } from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import { AccessDeniedModal } from "@/components/AccessDeniedModal";

interface MiniGame {
  id: string;
  name: string;
  description: string;
  icon: string;
  maxReward: number;
  duration: number;
  available: boolean;
  nextAvailable?: Date;
  component?: React.ComponentType<any>;
}

interface CooldownInfo {
  canPlay: boolean;
  nextAvailable: Date | null;
  hoursRemaining: number;
}

export default function MiniGames() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [cooldowns, setCooldowns] = useState<Record<string, CooldownInfo>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showAccessDenied, setShowAccessDenied] = useState(false);

  const { user } = useAuth();

  const miniGames: MiniGame[] = [
    {
      id: "colin-shots",
      name: "Colin Shots",
      description:
        "Basketball free throw challenge - score as many shots as possible in 60 seconds!",
      icon: "🏀",
      maxReward: 0.25,
      duration: 60,
      available: true,
      component: ColinShots,
    },
    {
      id: "joseys-quack-attack",
      name: "Josey's Quack Attack",
      description: "Duck hunting challenge - shoot flying ducks to earn SC!",
      icon: "🦆",
      maxReward: 0.25,
      duration: 60,
      available: true,
      component: JoseysQuackAttack,
    },
    {
      id: "beths-darts",
      name: "Beth's Darts",
      description: "Hit the dartboard targets - bullseyes and special spots earn SC!",
      icon: "🎯",
      maxReward: 0.25,
      duration: 60,
      available: true,
      component: BethsDarts,
    },
    {
      id: "coreys-fast-blocks",
      name: "Corey's Fast Blocks",
      description: "Fast-paced Tetris - clear lines to earn SC in 60 seconds!",
      icon: "🧩",
      maxReward: 0.25,
      duration: 60,
      available: true,
      component: CoreysFastBlocks,
    },
    {
      id: "coreys-fast-jewels",
      name: "Corey's Fast Jewels",
      description: "Match gems quickly - create combos to earn SC!",
      icon: "💎",
      maxReward: 0.25,
      duration: 60,
      available: true,
      component: CoreysFastJewels,
    },
    {
      id: "brens-meow",
      name: "Bren's Meow",
      description: "Catch the smart dogs with your cage - they'll try to escape!",
      icon: "🐱",
      maxReward: 0.25,
      duration: 60,
      available: true,
      component: BrensMeow,
    },
    {
      id: "flicken-my-bean",
      name: "Flicken' My Bean",
      description: "Fast-paced bean flicking action - coming soon!",
      icon: "🫘",
      maxReward: 0.25,
      duration: 60,
      available: false,
    },
    {
      id: "deedees-fun-run",
      name: "DeeDee's Fun Run",
      description: "Endless runner adventure - coming soon!",
      icon: "🏃‍♀️",
      maxReward: 0.25,
      duration: 60,
      available: false,
    },
    {
      id: "heathers-whack-a-corey",
      name: "Heather's Whack a Corey",
      description: "Classic whack-a-mole with a twist - coming soon!",
      icon: "🔨",
      maxReward: 0.25,
      duration: 60,
      available: false,
    },
    {
      id: "theresas-frogz",
      name: "Theresa's Frogz",
      description: "Hop and jump to victory - coming soon!",
      icon: "🐸",
      maxReward: 0.25,
      duration: 60,
      available: false,
    },
  ];

  useEffect(() => {
    checkCooldowns();
  }, []);

  const checkCooldowns = async () => {
    if (!user) return;

    setIsLoading(true);
    const cooldownPromises = miniGames.map(async (game) => {
      try {
        const response = await fetch(
          `/api/mini-games/${user.id}/${game.id}/cooldown`,
        );
        const data = await response.json();
        return { gameId: game.id, ...data };
      } catch (error) {
        console.error(`Error checking cooldown for ${game.id}:`, error);
        return {
          gameId: game.id,
          canPlay: true,
          nextAvailable: null,
          hoursRemaining: 0,
        };
      }
    });

    const results = await Promise.all(cooldownPromises);
    const cooldownMap: Record<string, CooldownInfo> = {};

    results.forEach((result) => {
      cooldownMap[result.gameId] = {
        canPlay: result.canPlay,
        nextAvailable: result.nextAvailable
          ? new Date(result.nextAvailable)
          : null,
        hoursRemaining: result.hoursRemaining || 0,
      };
    });

    setCooldowns(cooldownMap);
    setIsLoading(false);
  };

  const handleGameComplete = async (
    gameId: string,
    score: number,
    scEarned: number,
  ) => {
    try {
      // Record the mini game play
      const response = await fetch("/api/mini-games/play", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          gameType: gameId,
          score,
          maxScore: 25, // For Colin Shots
          duration: 60,
        }),
      });

      if (response.ok) {
        // Add to ticker
        await fetch("/api/ticker/mini-game", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user?.id,
            username: user?.username,
            gameType: gameId,
            score,
            maxScore: 25,
            scEarned,
          }),
        });

        // Refresh cooldowns
        await checkCooldowns();

        // Close game view
        setSelectedGame(null);
      }
    } catch (error) {
      console.error("Error recording game play:", error);
    }
  };

  const formatTimeRemaining = (hoursRemaining: number) => {
    if (hoursRemaining <= 0) return "Available now";

    const hours = Math.floor(hoursRemaining);
    const minutes = Math.round((hoursRemaining - hours) * 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getGameStatus = (game: MiniGame) => {
    const cooldown = cooldowns[game.id];

    if (!game.available) {
      return {
        status: "coming-soon",
        text: "Coming Soon",
        color: "bg-muted text-muted-foreground",
      };
    }

    if (isLoading) {
      return {
        status: "loading",
        text: "Loading...",
        color: "bg-muted text-muted-foreground",
      };
    }

    if (!cooldown?.canPlay) {
      return {
        status: "cooldown",
        text: formatTimeRemaining(cooldown?.hoursRemaining || 0),
        color: "bg-casino-red/20 text-casino-red border-casino-red/30",
      };
    }

    return {
      status: "available",
      text: "Play Now!",
      color: "bg-casino-green/20 text-casino-green border-casino-green/30",
    };
  };

  if (selectedGame) {
    const game = miniGames.find((g) => g.id === selectedGame);
    if (game?.component) {
      const GameComponent = game.component;
      return (
        <div className="min-h-screen p-4">
          <div className="container mx-auto">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setSelectedGame(null)}
                  className="mr-4"
                >
                  ← Back to Mini Games
                </Button>
                <div className="text-2xl">{game.icon}</div>
                <div>
                  <h1 className="text-2xl font-bold">{game.name}</h1>
                  <p className="text-muted-foreground">{game.description}</p>
                </div>
              </div>
            </div>

            <GameComponent
              userId={user?.id || ""}
              username={user?.username || ""}
              onGameComplete={(score: number, scEarned: number) =>
                handleGameComplete(selectedGame, score, scEarned)
              }
            />
          </div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-gold to-yellow-400 rounded-2xl flex items-center justify-center mr-4">
                <Gamepad2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Mini Games</h1>
                <p className="text-muted-foreground text-lg">
                  Play daily mini games and earn free Sweeps Coins!
                </p>
              </div>
            </div>

            <div className="flex justify-center space-x-6 mt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-gold">0.25 SC</div>
                <div className="text-sm text-muted-foreground">
                  Max Daily Reward
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-sweep">60s</div>
                <div className="text-sm text-muted-foreground">
                  Game Duration
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">24h</div>
                <div className="text-sm text-muted-foreground">
                  Cooldown Period
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Games Grid */}
      <section className="py-16">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {miniGames.map((game) => {
              const gameStatus = getGameStatus(game);
              const cooldown = cooldowns[game.id];

              return (
                <Card
                  key={game.id}
                  className={`group transition-all duration-300 cursor-pointer ${
                    gameStatus.status === "available"
                      ? "hover:scale-105 hover:shadow-lg"
                      : "opacity-75"
                  }`}
                  onClick={() => {
                    if (!user) {
                      setShowAccessDenied(true);
                      return;
                    }
                    if (gameStatus.status === "available") {
                      setSelectedGame(game.id);
                    }
                  }}
                >
                  <CardHeader className="text-center">
                    <div className="text-4xl mb-3">{game.icon}</div>
                    <CardTitle className="flex items-center justify-between">
                      {game.name}
                      <Badge variant="outline" className={gameStatus.color}>
                        {gameStatus.text}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{game.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-2 text-center text-sm">
                      <div>
                        <div className="text-gold font-semibold">
                          {game.maxReward} SC
                        </div>
                        <div className="text-muted-foreground text-xs">
                          Max Reward
                        </div>
                      </div>
                      <div>
                        <div className="text-blue-400 font-semibold">
                          {game.duration}s
                        </div>
                        <div className="text-muted-foreground text-xs">
                          Duration
                        </div>
                      </div>
                      <div>
                        <div className="text-sweep font-semibold">24h</div>
                        <div className="text-muted-foreground text-xs">
                          Cooldown
                        </div>
                      </div>
                    </div>

                    {gameStatus.status === "cooldown" &&
                      cooldown?.nextAvailable && (
                        <div className="text-center space-y-2">
                          <div className="flex items-center justify-center text-sm text-muted-foreground">
                            <Clock className="h-4 w-4 mr-1" />
                            Next play in{" "}
                            {formatTimeRemaining(cooldown.hoursRemaining)}
                          </div>
                        </div>
                      )}

                    <Button
                      className={`w-full ${
                        gameStatus.status === "available"
                          ? "bg-gradient-to-r from-gold to-yellow-400 text-gold-foreground hover:from-yellow-400 hover:to-gold"
                          : ""
                      }`}
                      disabled={gameStatus.status !== "available"}
                      variant={
                        gameStatus.status === "available"
                          ? "default"
                          : "outline"
                      }
                    >
                      {gameStatus.status === "available" && (
                        <Trophy className="h-4 w-4 mr-2" />
                      )}
                      {gameStatus.status === "cooldown" && (
                        <Timer className="h-4 w-4 mr-2" />
                      )}
                      {gameStatus.status === "coming-soon" && (
                        <Star className="h-4 w-4 mr-2" />
                      )}

                      {gameStatus.status === "available"
                        ? "Play Now"
                        : gameStatus.status === "cooldown"
                          ? "On Cooldown"
                          : "Coming Soon"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-card/30">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">How Mini Games Work</h2>
            <p className="text-muted-foreground mt-2">
              Earn Sweeps Coins daily with our exclusive mini games
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-gold to-yellow-400 rounded-full flex items-center justify-center mx-auto">
                <Gamepad2 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Play Daily</h3>
              <p className="text-muted-foreground">
                Each mini game can be played once every 24 hours. Come back
                daily for more rewards!
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-sweep to-purple-600 rounded-full flex items-center justify-center mx-auto">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Earn SC</h3>
              <p className="text-muted-foreground">
                Your performance determines your reward. Score higher to earn up
                to 0.25 SC per game!
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-casino-green to-green-600 rounded-full flex items-center justify-center mx-auto">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Use Everywhere</h3>
              <p className="text-muted-foreground">
                Use your earned SC in slots, table games, sportsbook, and bingo
                throughout the casino!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Access Denied Modal */}
      <AccessDeniedModal
        isOpen={showAccessDenied}
        onClose={() => setShowAccessDenied(false)}
        feature="mini-games"
      />
    </div>
  );
}
