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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  Medal,
  Crown,
  Star,
  Target,
  TrendingUp,
  Clock,
  Users,
  Gamepad2,
  Dice6,
  Grid3X3,
  Zap,
  Gift,
  Award,
  Timer,
} from "lucide-react";
import {
  LeaderboardEntry,
  LeaderboardCategory,
  UserStats,
} from "@shared/leaderboardTypes";
import { useAuth } from "@/components/AuthContext";

export default function Leaderboards() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("overall-sc");
  const [selectedPeriod, setSelectedPeriod] = useState("weekly");
  const [leaderboardData, setLeaderboardData] = useState<{
    category: LeaderboardCategory | null;
    entries: LeaderboardEntry[];
    lastUpdated: Date;
  }>({ category: null, entries: [], lastUpdated: new Date() });
  const [categories, setCategories] = useState<LeaderboardCategory[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [userPosition, setUserPosition] = useState<{
    position: number | null;
    entry: LeaderboardEntry | null;
  }>({ position: null, entry: null });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    if (user) {
      fetchUserStats();
    }
  }, [user]);

  useEffect(() => {
    fetchLeaderboard();
    if (user) {
      fetchUserPosition();
    }
  }, [selectedCategory, selectedPeriod, user]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/leaderboards/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/leaderboards?category=${selectedCategory}&period=${selectedPeriod}`,
      );
      const data = await response.json();
      setLeaderboardData(data);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserStats = async () => {
    if (!user) return;
    try {
      const response = await fetch(`/api/leaderboards/users/${user.id}/stats`);
      const data = await response.json();
      setUserStats(data);
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
  };

  const fetchUserPosition = async () => {
    if (!user) return;
    try {
      const response = await fetch(
        `/api/leaderboards/users/${user.id}/position/${selectedCategory}`,
      );
      const data = await response.json();
      setUserPosition(data);
    } catch (error) {
      console.error("Error fetching user position:", error);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-gold" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return (
          <span className="text-lg font-bold text-muted-foreground">
            #{rank}
          </span>
        );
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-gold to-yellow-400 text-gold-foreground";
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800";
      case 3:
        return "bg-gradient-to-r from-amber-500 to-amber-600 text-white";
      default:
        return "bg-muted";
    }
  };

  const getCategoryIcon = (gameType: string) => {
    switch (gameType) {
      case "slots":
        return <Gamepad2 className="h-5 w-5" />;
      case "table-games":
        return <Dice6 className="h-5 w-5" />;
      case "mini-games":
        return <Target className="h-5 w-5" />;
      case "sportsbook":
        return <Trophy className="h-5 w-5" />;
      case "bingo":
        return <Grid3X3 className="h-5 w-5" />;
      default:
        return <Crown className="h-5 w-5" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const periods = [
    { id: "daily", name: "Daily", icon: Timer },
    { id: "weekly", name: "Weekly", icon: Clock },
    { id: "monthly", name: "Monthly", icon: TrendingUp },
    { id: "all-time", name: "All Time", icon: Star },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-gold to-yellow-400 rounded-2xl flex items-center justify-center mr-4 casino-glow">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Leaderboards</h1>
                <p className="text-muted-foreground text-lg">
                  Compete with players worldwide and climb to the top!
                </p>
              </div>
            </div>

            {/* User Position Card */}
            {user && userPosition.position && (
              <Card className="max-w-2xl mx-auto mb-8 bg-gradient-to-r from-sweep/10 to-gold/10 border-sweep/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-sweep to-purple-600 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">Your Rank</h3>
                        <p className="text-muted-foreground">
                          in {leaderboardData.category?.name}
                        </p>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-sweep">
                        #{userPosition.position}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {userPosition.entry?.score.toLocaleString()} SC
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-card/30">
        <div className="container px-4">
          <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
            <div className="flex flex-wrap gap-2">
              <h3 className="text-lg font-semibold mr-4 flex items-center">
                <Trophy className="h-5 w-5 mr-2" />
                Categories:
              </h3>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={
                    selectedCategory === category.id ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={
                    selectedCategory === category.id
                      ? "bg-gradient-to-r from-gold to-yellow-400 text-gold-foreground"
                      : ""
                  }
                >
                  {getCategoryIcon(category.gameType)}
                  <span className="ml-2">{category.name}</span>
                </Button>
              ))}
            </div>

            <div className="flex gap-2">
              <h3 className="text-lg font-semibold mr-2 flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Period:
              </h3>
              {periods.map((period) => {
                const Icon = period.icon;
                return (
                  <Button
                    key={period.id}
                    variant={
                      selectedPeriod === period.id ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedPeriod(period.id)}
                    className={
                      selectedPeriod === period.id
                        ? "bg-gradient-to-r from-sweep to-purple-600 text-white"
                        : ""
                    }
                  >
                    <Icon className="h-4 w-4 mr-1" />
                    {period.name}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Leaderboard */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center text-2xl">
                        {leaderboardData.category &&
                          getCategoryIcon(leaderboardData.category.gameType)}
                        <span className="ml-2">
                          {leaderboardData.category?.name || "Loading..."}
                        </span>
                      </CardTitle>
                      <CardDescription>
                        {leaderboardData.category?.description}
                      </CardDescription>
                    </div>
                    {leaderboardData.category?.prize && (
                      <div className="text-center">
                        <Badge className="bg-gold/20 text-gold border-gold/30 mb-2">
                          <Gift className="h-3 w-3 mr-1" />
                          Prizes Available
                        </Badge>
                        <div className="text-sm space-y-1">
                          <div>
                            🥇 {leaderboardData.category.prize.first}{" "}
                            {leaderboardData.category.prize.currency}
                          </div>
                          <div>
                            🥈 {leaderboardData.category.prize.second}{" "}
                            {leaderboardData.category.prize.currency}
                          </div>
                          <div>
                            🥉 {leaderboardData.category.prize.third}{" "}
                            {leaderboardData.category.prize.currency}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto"></div>
                      <p className="text-muted-foreground mt-2">
                        Loading leaderboard...
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {leaderboardData.entries
                        .slice(0, 50)
                        .map((entry, index) => (
                          <div
                            key={entry.id}
                            className={`flex items-center justify-between p-4 rounded-lg transition-all hover:scale-[1.02] ${
                              entry.rank <= 3
                                ? getRankColor(entry.rank)
                                : "bg-muted/20 hover:bg-muted/30"
                            } ${entry.userId === user?.id ? "ring-2 ring-sweep" : ""}`}
                          >
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center justify-center w-12 h-12">
                                {getRankIcon(entry.rank)}
                              </div>
                              <Avatar className="w-10 h-10">
                                <AvatarFallback className="bg-gradient-to-br from-sweep to-purple-600 text-white">
                                  {entry.username.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-bold flex items-center space-x-2">
                                  <span>{entry.username}</span>
                                  {entry.isVip && (
                                    <Crown className="h-4 w-4 text-gold" />
                                  )}
                                  {entry.achievements.length > 0 && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {entry.achievements.length} 🏆
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {entry.gamesPlayed} games •{" "}
                                  {entry.winRate.toFixed(1)}% win rate
                                </div>
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="font-bold text-lg">
                                {entry.score.toLocaleString()} {entry.currency}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Last win: {formatTimeAgo(entry.lastWin)}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* User Stats Sidebar */}
            <div className="space-y-6">
              {/* User Level */}
              {userStats && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Star className="h-5 w-5 mr-2 text-gold" />
                      Your Level
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gold">
                        Level {userStats.level}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {userStats.experience}/{userStats.nextLevelExp} XP
                      </div>
                    </div>
                    <Progress
                      value={
                        (userStats.experience / userStats.nextLevelExp) * 100
                      }
                      className="h-3"
                    />
                    <div className="grid grid-cols-2 gap-4 text-center text-sm">
                      <div>
                        <div className="font-bold text-sweep">
                          {userStats.totalGamesPlayed}
                        </div>
                        <div className="text-muted-foreground">
                          Games Played
                        </div>
                      </div>
                      <div>
                        <div className="font-bold text-casino-green">
                          {userStats.currentWinStreak}
                        </div>
                        <div className="text-muted-foreground">Win Streak</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Biggest Win */}
              {userStats?.biggestWin && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Trophy className="h-5 w-5 mr-2 text-casino-green" />
                      Biggest Win
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-2">
                      <div className="text-2xl font-bold text-casino-green">
                        {userStats.biggestWin.amount.toLocaleString()}{" "}
                        {userStats.biggestWin.currency}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {userStats.biggestWin.game}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatTimeAgo(userStats.biggestWin.date)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Recent Achievements */}
              {userStats?.achievements && userStats.achievements.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Award className="h-5 w-5 mr-2 text-gold" />
                      Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {userStats.achievements.slice(0, 3).map((achievement) => (
                        <div
                          key={achievement.id}
                          className="flex items-center space-x-3 p-2 bg-muted/20 rounded-lg"
                        >
                          <div className="text-2xl">{achievement.icon}</div>
                          <div>
                            <div className="font-semibold text-sm">
                              {achievement.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {achievement.description}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Live Updates */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-blue-400" />
                    Live Updates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-casino-green rounded-full animate-pulse"></div>
                      <span className="text-muted-foreground">
                        SlotMaster2024 just won 1,250 SC!
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gold rounded-full animate-pulse"></div>
                      <span className="text-muted-foreground">
                        PokerPro88 climbed to #2!
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-sweep rounded-full animate-pulse"></div>
                      <span className="text-muted-foreground">
                        New player joined the leaderboard
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
