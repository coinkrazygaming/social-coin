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
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SlotThumbnail } from "@/components/SlotThumbnail";
import { SlotGameCard } from "@/components/SlotGameCard";
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
} from "lucide-react";
import {
  slotGames,
  featuredSlots,
  newSlots,
  popularSlots,
} from "@shared/slotData";
import { SlotGame } from "@shared/slotTypes";
import { DEFAULT_COINKRAZY_SLOTS } from "@shared/defaultSlots";
import { useAuth } from "@/components/AuthContext";

export default function Slots() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedProvider, setSelectedProvider] = useState<string>("all");
  const [filteredGames, setFilteredGames] = useState<SlotGame[]>(slotGames);

  useEffect(() => {
    let filtered = slotGames;

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
      filtered = filtered.filter((game) => game.category === selectedCategory);
    }

    // Provider filter
    if (selectedProvider !== "all") {
      filtered = filtered.filter((game) => game.provider === selectedProvider);
    }

    setFilteredGames(filtered);
  }, [searchTerm, selectedCategory, selectedProvider]);

  const handlePlayGame = (gameId: string, currency: "GC" | "SC") => {
    // TODO: Implement actual game launch
    console.log(`Launching game ${gameId} with ${currency}`);
    // This would redirect to the actual slot game or open in a modal
  };

  const providers = Array.from(new Set(slotGames.map((game) => game.provider)));
  const categories = [
    { id: "all", name: "All Games", icon: Gamepad2 },
    { id: "featured", name: "Featured", icon: Star },
    { id: "new", name: "New", icon: Zap },
    { id: "progressive", name: "Progressive", icon: Crown },
    { id: "video", name: "Video Slots", icon: TrendingUp },
    { id: "classic", name: "Classic", icon: Trophy },
  ];

  const totalSCEarned = slotGames.reduce(
    (sum, game) => sum + game.liveSCEarned,
    0,
  );
  const totalMaxWin = Math.max(...slotGames.map((game) => game.maxWin));

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-gold to-yellow-400 rounded-2xl flex items-center justify-center mr-4 casino-glow">
                <Gamepad2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Slot Games</h1>
                <p className="text-muted-foreground text-lg">
                  500+ Premium slots with real-time jackpots and massive wins!
                </p>
              </div>
            </div>

            <div className="flex justify-center space-x-6 mt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-gold">
                  {slotGames.length}
                </div>
                <div className="text-sm text-muted-foreground">Total Games</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-sweep">
                  {totalSCEarned.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  SC Earned Today
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-casino-green">
                  {totalMaxWin.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  Max Win Available
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {user ? slotGames.length : 0}
                </div>
                <div className="text-sm text-muted-foreground">
                  Available to Play
                </div>
              </div>
            </div>
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

      {/* Games Section */}
      <section className="py-16">
        <div className="container px-4">
          <Tabs defaultValue="coinkrazy" className="space-y-8">
            <TabsList className="grid w-full grid-cols-5 max-w-3xl mx-auto">
              <TabsTrigger value="coinkrazy" className="text-gold">
                <Crown className="h-4 w-4 mr-2" />
                CoinKrazy
              </TabsTrigger>
              <TabsTrigger value="all">All Games</TabsTrigger>
              <TabsTrigger value="featured">Featured</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
              <TabsTrigger value="new">New Games</TabsTrigger>
            </TabsList>

            {/* CoinKrazy In-House Games */}
            <TabsContent value="coinkrazy" className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center">
                  <Sparkles className="h-6 w-6 mr-3 text-gold animate-pulse" />
                  CoinKrazy In-House Slots
                </h2>
                <Badge className="bg-gold text-black font-bold">
                  <Crown className="h-3 w-3 mr-1" />
                  Exclusive
                </Badge>
              </div>

              <p className="text-muted-foreground">
                Our exclusive collection of handcrafted slot games, designed and developed by CoinKrazy.
                Each game features unique themes, balanced gameplay, and exciting bonus features!
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {DEFAULT_COINKRAZY_SLOTS.map((slot) => (
                  <SlotGameCard
                    key={slot.id}
                    slot={slot}
                    onPlayFreeGC={() => {
                      console.log('Play Free GC:', slot.name);
                      // Navigate to slot game with GC mode
                    }}
                    onPlayRealSC={() => {
                      console.log('Play Real SC:', slot.name);
                      // Navigate to slot game with SC mode
                    }}
                    onPlayDemo={() => {
                      console.log('Play Demo:', slot.name);
                      // Demo handled in SlotGameCard
                    }}
                  />
                ))}
              </div>

              {/* Coming Soon Slots */}
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-blue-400" />
                  Coming Soon
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                  {Array.from({ length: 20 }, (_, index) => (
                    <Card key={`coming-soon-${index}`} className="opacity-50 border-dashed border-gold/30">
                      <CardContent className="p-4 text-center">
                        <div className="h-32 bg-gradient-to-br from-gold/10 to-yellow-400/10 rounded mb-3 flex items-center justify-center">
                          <Sparkles className="h-8 w-8 text-gold/50" />
                        </div>
                        <h4 className="font-bold text-gold/70 text-sm mb-1">Slot #{index + 6}</h4>
                        <p className="text-xs text-muted-foreground mb-3">In Development</p>
                        <Button disabled size="sm" variant="outline" className="w-full border-gold/30 text-gold/50 text-xs">
                          Coming Soon
                        </Button>
                        <p className="text-xs text-gold/50 font-bold mt-2">CoinKrazy.com</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* CoinKrazy Features */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-gold/10 to-yellow-400/10 border-gold/30">
                  <CardContent className="p-6 text-center">
                    <Crown className="h-12 w-12 text-gold mx-auto mb-4" />
                    <h3 className="font-bold text-gold mb-2">Exclusive Games</h3>
                    <p className="text-sm text-muted-foreground">
                      Unique slot machines you won't find anywhere else, crafted specifically for CoinKrazy players.
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30">
                  <CardContent className="p-6 text-center">
                    <Zap className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                    <h3 className="font-bold text-purple-400 mb-2">Optimized RTP</h3>
                    <p className="text-sm text-muted-foreground">
                      Carefully balanced return-to-player rates designed for fair and exciting gameplay.
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30">
                  <CardContent className="p-6 text-center">
                    <Trophy className="h-12 w-12 text-green-400 mx-auto mb-4" />
                    <h3 className="font-bold text-green-400 mb-2">Regular Updates</h3>
                    <p className="text-sm text-muted-foreground">
                      New themes, features, and games added regularly based on player feedback.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* All Games */}
            <TabsContent value="all" className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  {selectedCategory === "all"
                    ? "All Slot Games"
                    : categories.find((c) => c.id === selectedCategory)?.name}
                  {searchTerm && ` matching "${searchTerm}"`}
                </h2>
                <Badge variant="outline" className="text-lg px-4 py-2">
                  {filteredGames.length} Games
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                {filteredGames.map((game) => (
                  <SlotThumbnail
                    key={game.id}
                    game={game}
                    onPlay={handlePlayGame}
                    size="medium"
                  />
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
            </TabsContent>

            {/* Featured Games */}
            <TabsContent value="featured" className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Featured Games</h2>
                <Badge
                  variant="outline"
                  className="text-lg px-4 py-2 bg-gold/20 text-gold border-gold/30"
                >
                  <Star className="h-4 w-4 mr-2" />
                  {featuredSlots.length} Featured
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {featuredSlots.map((game) => (
                  <SlotThumbnail
                    key={game.id}
                    game={game}
                    onPlay={handlePlayGame}
                    size="large"
                  />
                ))}
              </div>
            </TabsContent>

            {/* Popular Games */}
            <TabsContent value="popular" className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Most Popular</h2>
                <Badge
                  variant="outline"
                  className="text-lg px-4 py-2 bg-casino-green/20 text-casino-green border-casino-green/30"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Top Earners
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {popularSlots.map((game, index) => (
                  <div key={game.id} className="relative">
                    <Badge className="absolute -top-2 -left-2 z-10 bg-casino-green text-white">
                      #{index + 1}
                    </Badge>
                    <SlotThumbnail
                      game={game}
                      onPlay={handlePlayGame}
                      size="large"
                    />
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* New Games */}
            <TabsContent value="new" className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">New Releases</h2>
                <Badge
                  variant="outline"
                  className="text-lg px-4 py-2 bg-sweep/20 text-sweep border-sweep/30"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Fresh Games
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {newSlots.map((game) => (
                  <SlotThumbnail
                    key={game.id}
                    game={game}
                    onPlay={handlePlayGame}
                    size="large"
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card/30">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Live Casino Stats</h2>
            <p className="text-muted-foreground mt-2">
              Real-time performance across all slot games
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl font-bold text-gold">
                  {totalSCEarned.toLocaleString()}
                </CardTitle>
                <CardDescription>Total SC Earned</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl font-bold text-sweep">
                  {totalMaxWin.toLocaleString()}
                </CardTitle>
                <CardDescription>Highest Max Win</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl font-bold text-casino-green">
                  {slotGames.length}
                </CardTitle>
                <CardDescription>Active Games</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl font-bold text-blue-400">
                  {providers.length}
                </CardTitle>
                <CardDescription>Game Providers</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
