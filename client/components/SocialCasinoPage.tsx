import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Search,
  Filter,
  TrendingUp,
  Star,
  Zap,
  Crown,
  Gamepad2,
  Trophy,
  Clock,
  DollarSign,
  Sparkles,
  Coins,
  Activity,
  Users,
  Eye,
  PlayCircle,
  Shuffle,
} from "lucide-react";
import { useAuth } from "./AuthContext";
import { GameModeSelector } from "./GameModeSelector";
import { RealTimeStatsService } from "@shared/realTimeStats";
import { APISlotProvidersService } from "@shared/apiSlotsProviders";
import { RealTimeStats, SocialCasinoGame } from "@shared/socialCasinoTypes";
import { DEFAULT_COINKRAZY_SLOTS } from "@shared/defaultSlots";

export default function SocialCasinoPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedProvider, setSelectedProvider] = useState<string>("all");
  const [gamesList, setGamesList] = useState<SocialCasinoGame[]>([]);
  const [filteredGames, setFilteredGames] = useState<SocialCasinoGame[]>([]);
  const [realTimeStats, setRealTimeStats] = useState<RealTimeStats | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState<SocialCasinoGame | null>(
    null,
  );
  const [showGameModal, setShowGameModal] = useState(false);

  useEffect(() => {
    loadGamesAndStats();

    // Subscribe to real-time stats updates
    const unsubscribe = RealTimeStatsService.subscribe((stats) => {
      setRealTimeStats(stats);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    filterGames();
  }, [gamesList, searchTerm, selectedCategory, selectedProvider]);

  const loadGamesAndStats = async () => {
    try {
      setIsLoading(true);

      // Load API games
      const apiGames = await APISlotProvidersService.fetchAllGames();

      // Convert CoinKrazy slots to SocialCasinoGame format
      const coinKrazyGames: SocialCasinoGame[] = DEFAULT_COINKRAZY_SLOTS.map(
        (slot) => ({
          id: slot.id,
          name: slot.name,
          provider: "CoinKrazy",
          category: "social_slots",
          game_type: "BOTH",
          thumbnail: slot.thumbnail,
          background_image: slot.backgroundImage,
          description: slot.description,
          min_bet_gc: Math.floor(slot.minBet * 100),
          max_bet_gc: Math.floor(slot.maxBet * 100),
          min_bet_sc: slot.minBet,
          max_bet_sc: slot.maxBet,
          rtp: slot.rtp,
          volatility: slot.volatility,
          max_win_gc: 100000,
          max_win_sc: 1000,
          paylines: slot.paylines?.length || 25,
          features: [],
          is_active: slot.active,
          is_featured: slot.featured,
          created_at: slot.created.toISOString(),
          updated_at: slot.updated.toISOString(),
          total_spins_today: Math.floor(Math.random() * 500),
          total_gc_earned_today: Math.floor(Math.random() * 10000),
          total_sc_earned_today: Math.floor(Math.random() * 100),
          biggest_win_today: Math.floor(Math.random() * 5000),
        }),
      );

      // Combine all games
      const allGames = [...coinKrazyGames, ...apiGames];
      setGamesList(allGames);
    } catch (error) {
      console.error("Error loading games and stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterGames = () => {
    let filtered = [...gamesList];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (game) =>
          game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          game.provider.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      if (selectedCategory === "featured") {
        filtered = filtered.filter((game) => game.is_featured);
      } else if (selectedCategory === "new") {
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(
          (game) => new Date(game.created_at) > weekAgo,
        );
      } else if (selectedCategory === "popular") {
        filtered = filtered
          .sort((a, b) => b.total_spins_today - a.total_spins_today)
          .slice(0, 20);
      } else {
        filtered = filtered.filter(
          (game) => game.category === selectedCategory,
        );
      }
    }

    // Provider filter
    if (selectedProvider !== "all") {
      filtered = filtered.filter((game) => game.provider === selectedProvider);
    }

    setFilteredGames(filtered);
  };

  const handlePlayGame = (game: SocialCasinoGame) => {
    setSelectedGame(game);
    setShowGameModal(true);
  };

  const handleModeSelect = (mode: "GC" | "SC", betAmount: number) => {
    if (!selectedGame) return;

    // Launch actual game with selected mode and bet
    console.log(`Launching ${selectedGame.name} with ${betAmount} ${mode}`);
    setShowGameModal(false);

    // Navigate to game page with parameters
    const gameUrl = `/slots/${selectedGame.id}?mode=${mode}&bet=${betAmount}`;
    window.location.href = gameUrl;
  };

  const providers = Array.from(new Set(gamesList.map((game) => game.provider)));
  const categories = [
    { id: "all", name: "All Games", icon: Gamepad2 },
    { id: "featured", name: "Featured", icon: Star },
    { id: "new", name: "New", icon: Zap },
    { id: "popular", name: "Popular", icon: TrendingUp },
    { id: "social_slots", name: "Social Slots", icon: Crown },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="h-12 w-12 mx-auto text-gold animate-pulse mb-4" />
          <h2 className="text-2xl font-bold mb-2">Loading Social Casino</h2>
          <p className="text-muted-foreground">
            Preparing your gaming experience...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Real-Time Stats */}
      <section className="py-16 bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-gold to-yellow-400 rounded-2xl flex items-center justify-center mr-4 casino-glow">
                <Gamepad2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Social Casino</h1>
                <p className="text-muted-foreground text-lg">
                  {realTimeStats?.total_games_available || 0}+ Premium social
                  casino games with real-time jackpots and massive wins!
                </p>
              </div>
            </div>

            {/* Real-Time Stats Display */}
            {realTimeStats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gold flex items-center justify-center">
                    <Activity className="h-5 w-5 mr-2" />
                    {realTimeStats.total_active_games}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Games
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-sweep flex items-center justify-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    {realTimeStats.sc_earned_today.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    SC Earned Today
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-casino-green flex items-center justify-center">
                    <Trophy className="h-5 w-5 mr-2" />
                    {Math.max(
                      realTimeStats.max_win_available_sc,
                      realTimeStats.max_win_available_gc,
                    ).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Max Win Available
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400 flex items-center justify-center">
                    <Users className="h-5 w-5 mr-2" />
                    {realTimeStats.total_players_online}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Players Online
                  </div>
                </div>
              </div>
            )}

            {/* Biggest Win Today */}
            {realTimeStats?.biggest_win_today && (
              <div className="mt-6 p-4 bg-gradient-to-r from-gold/20 to-yellow-400/20 rounded-lg border border-gold/30 max-w-md mx-auto">
                <div className="flex items-center justify-center mb-2">
                  <Crown className="h-5 w-5 text-gold mr-2" />
                  <span className="font-semibold text-gold">
                    Biggest Win Today
                  </span>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {realTimeStats.biggest_win_today.amount.toLocaleString()}{" "}
                    {realTimeStats.biggest_win_today.currency}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Won by {realTimeStats.biggest_win_today.player_name}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-card/30">
        <div className="container px-4">
          <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
            {/* Search */}
            <div className="flex items-center space-x-4 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search games..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Provider Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="bg-background border border-border rounded-md px-3 py-2 text-sm"
              >
                <option value="all">All Providers</option>
                {providers.map((provider) => (
                  <option key={provider} value={provider}>
                    {provider}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
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
                  <Icon className="h-4 w-4 mr-2" />
                  {category.name}
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Games Grid */}
      <section className="py-16">
        <div className="container px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">
              {selectedCategory === "all"
                ? "All Social Casino Games"
                : categories.find((c) => c.id === selectedCategory)?.name}
              {searchTerm && ` matching "${searchTerm}"`}
            </h2>
            <Badge variant="outline" className="text-lg px-4 py-2">
              {filteredGames.length} Games
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {filteredGames.map((game) => (
              <Card
                key={game.id}
                className="group hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={game.thumbnail}
                    alt={game.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      onClick={() => handlePlayGame(game)}
                      className="bg-gold text-black hover:bg-gold/90"
                    >
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Play Now
                    </Button>
                  </div>

                  {/* Game Type Badge */}
                  <div className="absolute top-2 right-2">
                    <Badge
                      className={
                        game.game_type === "BOTH"
                          ? "bg-gold text-black"
                          : game.game_type === "GC"
                            ? "bg-blue-500"
                            : "bg-sweep"
                      }
                    >
                      {game.game_type === "BOTH" ? "GC + SC" : game.game_type}
                    </Badge>
                  </div>

                  {/* Featured Badge */}
                  {game.is_featured && (
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-gold text-black">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    </div>
                  )}
                </div>

                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-1 truncate">
                    {game.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {game.provider}
                  </p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <span>RTP: {game.rtp}%</span>
                    <span className="capitalize">{game.volatility}</span>
                  </div>

                  {/* Real-time stats */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="text-center p-1 bg-muted/50 rounded">
                      <div className="font-semibold">
                        {game.total_spins_today}
                      </div>
                      <div className="text-muted-foreground">Spins Today</div>
                    </div>
                    <div className="text-center p-1 bg-muted/50 rounded">
                      <div className="font-semibold text-gold">
                        {game.biggest_win_today.toLocaleString()}
                      </div>
                      <div className="text-muted-foreground">Biggest Win</div>
                    </div>
                  </div>

                  <Button
                    onClick={() => handlePlayGame(game)}
                    className="w-full mt-3"
                    variant="outline"
                  >
                    <Shuffle className="h-4 w-4 mr-2" />
                    Select Mode & Play
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredGames.length === 0 && (
            <div className="text-center py-12">
              <Gamepad2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No games found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Game Mode Selection Modal */}
      {selectedGame && (
        <Dialog open={showGameModal} onOpenChange={setShowGameModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <img
                  src={selectedGame.thumbnail}
                  alt={selectedGame.name}
                  className="w-12 h-12 rounded mr-3 object-cover"
                />
                {selectedGame.name}
              </DialogTitle>
              <DialogDescription>{selectedGame.description}</DialogDescription>
            </DialogHeader>

            <GameModeSelector
              gameId={selectedGame.id}
              gameName={selectedGame.name}
              minBetGC={selectedGame.min_bet_gc}
              maxBetGC={selectedGame.max_bet_gc}
              minBetSC={selectedGame.min_bet_sc}
              maxBetSC={selectedGame.max_bet_sc}
              supportedModes={
                selectedGame.game_type === "BOTH"
                  ? ["GC", "SC"]
                  : selectedGame.game_type === "GC"
                    ? ["GC"]
                    : ["SC"]
              }
              onModeSelect={handleModeSelect}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
