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
import { TableGameThumbnail } from "@/components/TableGameThumbnail";
import { EnhancedPokerTableThumbnail } from "@/components/EnhancedPokerTableThumbnail";
import {
  Search,
  Filter,
  Dice6,
  Crown,
  Users,
  Trophy,
  Coins,
  Star,
  DollarSign,
  Timer,
  TrendingUp,
  Activity,
  BarChart3,
  Target,
  Gamepad2,
  Zap,
  Eye,
  RefreshCw,
} from "lucide-react";
import {
  enhancedCardGames,
  enhancedPokerTables,
  getAllTableProfits,
  getTableDailyStats,
} from "@shared/enhancedTableGameData";
import { TableGame, PokerTable } from "@shared/slotTypes";
import { useAuth } from "@/components/AuthContext";

export default function EnhancedTableGames() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [filteredCardGames, setFilteredCardGames] =
    useState<TableGame[]>(enhancedCardGames);
  const [filteredPokerTables, setFilteredPokerTables] =
    useState<PokerTable[]>(enhancedPokerTables);
  const [realTimeUpdate, setRealTimeUpdate] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Real-time updates simulation
  useEffect(() => {
    if (!realTimeUpdate) return;

    const interval = setInterval(() => {
      // Simulate real-time seat changes
      setFilteredPokerTables((prev) =>
        prev.map((table) => ({
          ...table,
          seats: table.seats.map((seat) => ({
            ...seat,
            chipCount: seat.player
              ? seat.chipCount + Math.floor(Math.random() * 200 - 100)
              : 0,
          })),
        })),
      );
      setLastUpdate(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, [realTimeUpdate]);

  useEffect(() => {
    // Filter card games
    let filtered = enhancedCardGames;
    if (searchTerm) {
      filtered = filtered.filter(
        (game) =>
          game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          game.description.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    if (selectedType !== "all" && selectedType !== "poker") {
      filtered = filtered.filter((game) => game.type === selectedType);
    }
    setFilteredCardGames(filtered);

    // Filter poker tables
    let filteredPoker = enhancedPokerTables;
    if (searchTerm) {
      filteredPoker = filteredPoker.filter(
        (table) =>
          table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          table.gameType.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    setFilteredPokerTables(filteredPoker);
  }, [searchTerm, selectedType]);

  const handlePlayCardGame = (gameId: string, currency: "GC" | "SC") => {
    console.log(`Joining card game ${gameId} with ${currency}`);
    // TODO: Implement actual game launch
  };

  const handleJoinPokerTable = (
    tableId: string,
    seatNumber: number,
    currency: "GC" | "SC",
  ) => {
    console.log(
      `Joining poker table ${tableId}, seat ${seatNumber} with ${currency}`,
    );
    // TODO: Implement actual poker table join with buy-in tracking
  };

  const gameTypes = [
    { id: "all", name: "All Games", icon: Dice6 },
    { id: "card", name: "Card Games", icon: Trophy },
    { id: "poker", name: "Poker Tables", icon: Crown },
  ];

  const totalActivePlayers =
    enhancedCardGames.reduce((sum, game) => sum + game.currentPlayers, 0) +
    enhancedPokerTables.reduce(
      (sum, table) => sum + table.seats.filter((s) => s.player).length,
      0,
    );

  const totalAvailableSeats =
    enhancedCardGames.reduce(
      (sum, game) => sum + (game.maxPlayers - game.currentPlayers),
      0,
    ) +
    enhancedPokerTables.reduce(
      (sum, table) => sum + table.seats.filter((s) => !s.player).length,
      0,
    );

  const totalDailyProfits = getAllTableProfits().reduce(
    (sum, table) => sum + table.dailyProfit,
    0,
  );

  const totalTables = enhancedCardGames.length + enhancedPokerTables.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800">
      {/* Enhanced Hero Section */}
      <section className="py-16 bg-gradient-to-br from-casino-red/20 via-purple-900/50 to-blue-900/30">
        <div className="container px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-gold to-yellow-400 rounded-3xl flex items-center justify-center mr-6 shadow-2xl">
                <Crown className="h-10 w-10 text-black" />
              </div>
              <div>
                <h1 className="text-5xl font-bold text-white mb-2">
                  <span className="text-gold">CoinKrazy</span> Table Games
                </h1>
                <p className="text-purple-200 text-xl">
                  Premium live tables with real-time seat selection and profit
                  tracking
                </p>
              </div>
            </div>

            {/* Enhanced Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 mt-12 max-w-4xl mx-auto">
              <div className="text-center bg-gray-800/50 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold text-gold mb-1">
                  {totalTables}
                </div>
                <div className="text-sm text-gray-400">Live Tables</div>
              </div>
              <div className="text-center bg-gray-800/50 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold text-green-400 mb-1">
                  {totalActivePlayers}
                </div>
                <div className="text-sm text-gray-400">Players Online</div>
              </div>
              <div className="text-center bg-gray-800/50 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold text-blue-400 mb-1">
                  {totalAvailableSeats}
                </div>
                <div className="text-sm text-gray-400">Available Seats</div>
              </div>
              <div className="text-center bg-gray-800/50 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold text-purple-400 mb-1">
                  ${totalDailyProfits.toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">Daily Revenue</div>
              </div>
              <div className="text-center bg-gray-800/50 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center justify-center mb-1">
                  <div
                    className={`w-3 h-3 rounded-full ${realTimeUpdate ? "bg-green-400 animate-pulse" : "bg-gray-400"} mr-2`}
                  />
                  <div className="text-xl font-bold text-green-400">LIVE</div>
                </div>
                <div className="text-sm text-gray-400">Real-Time</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real-time Controls & Filters */}
      <section className="py-8 bg-gray-800/30 backdrop-blur-sm">
        <div className="container px-4">
          <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
            {/* Search */}
            <div className="flex items-center space-x-4 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search tables..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700/50 border-gray-600 text-white"
                />
              </div>
            </div>

            {/* Real-time toggle */}
            <div className="flex items-center space-x-4">
              <Button
                variant={realTimeUpdate ? "default" : "outline"}
                size="sm"
                onClick={() => setRealTimeUpdate(!realTimeUpdate)}
                className={
                  realTimeUpdate ? "bg-green-600 hover:bg-green-700" : ""
                }
              >
                {realTimeUpdate ? (
                  <Activity className="h-4 w-4 mr-2 animate-pulse" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                {realTimeUpdate ? "Live Updates" : "Static Mode"}
              </Button>

              {/* CoinKrazy.com Branding */}
              <Badge className="text-lg px-4 py-2 bg-gradient-to-r from-gold to-yellow-400 text-black font-bold">
                CoinKrazy.com Premium Tables
              </Badge>
            </div>
          </div>

          {/* Last Update Info */}
          {realTimeUpdate && (
            <div className="text-center text-sm text-gray-400 mb-4">
              Last updated: {lastUpdate.toLocaleTimeString()} • Auto-refresh
              every 5 seconds
            </div>
          )}

          {/* Game Type Tabs */}
          <div className="flex flex-wrap gap-2">
            {gameTypes.map((type) => {
              const Icon = type.icon;
              return (
                <Button
                  key={type.id}
                  variant={selectedType === type.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(type.id)}
                  className={
                    selectedType === type.id
                      ? "bg-gradient-to-r from-gold to-yellow-400 text-black font-bold"
                      : "border-gray-600 text-gray-300 hover:bg-gray-700"
                  }
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {type.name}
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Enhanced Games Section */}
      <section className="py-16">
        <div className="container px-4">
          <Tabs defaultValue="poker-tables" className="space-y-8">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto bg-gray-800/50 backdrop-blur-sm">
              <TabsTrigger
                value="poker-tables"
                className="text-white data-[state=active]:bg-gold data-[state=active]:text-black"
              >
                5-Seat Poker Tables
              </TabsTrigger>
              <TabsTrigger
                value="card-games"
                className="text-white data-[state=active]:bg-gold data-[state=active]:text-black"
              >
                Card Games
              </TabsTrigger>
            </TabsList>

            {/* Enhanced Poker Tables */}
            <TabsContent value="poker-tables" className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-white flex items-center">
                    <Crown className="h-8 w-8 mr-3 text-gold" />
                    Premium 5-Seat Poker Tables
                  </h2>
                  <p className="text-gray-300 mt-2">
                    Exclusive CoinKrazy.com tables with real-time seat selection
                    and profit tracking
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge
                    variant="outline"
                    className="text-lg px-4 py-2 bg-gold/20 text-gold border-gold/30"
                  >
                    <Crown className="h-4 w-4 mr-2" />
                    {filteredPokerTables.length} Tables
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-lg px-4 py-2 bg-green-600/20 text-green-400 border-green-600/30"
                  >
                    <DollarSign className="h-4 w-4 mr-2" />$
                    {totalDailyProfits.toLocaleString()} Daily Profit
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPokerTables.map((table) => (
                  <EnhancedPokerTableThumbnail
                    key={table.id}
                    table={table}
                    onJoinTable={handleJoinPokerTable}
                    size="medium"
                    showProfitStats={user?.role === "admin"}
                  />
                ))}
              </div>

              {filteredPokerTables.length === 0 && (
                <div className="text-center py-12">
                  <Crown className="h-16 w-16 mx-auto text-gray-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-white">
                    No poker tables found
                  </h3>
                  <p className="text-gray-400">
                    Try adjusting your search criteria
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Enhanced Card Games */}
            <TabsContent value="card-games" className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-white flex items-center">
                    <Trophy className="h-8 w-8 mr-3 text-gold" />
                    CoinKrazy Card Games
                  </h2>
                  <p className="text-gray-300 mt-2">
                    Championship level card games with enhanced CoinKrazy
                    features
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="text-lg px-4 py-2 bg-green-600/20 text-green-400 border-green-600/30"
                >
                  <Trophy className="h-4 w-4 mr-2" />
                  {filteredCardGames.length} Games
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCardGames.map((game) => (
                  <TableGameThumbnail
                    key={game.id}
                    game={game}
                    onPlay={handlePlayCardGame}
                    size="medium"
                  />
                ))}
              </div>

              {filteredCardGames.length === 0 && (
                <div className="text-center py-12">
                  <Dice6 className="h-16 w-16 mx-auto text-gray-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-white">
                    No card games found
                  </h3>
                  <p className="text-gray-400">
                    Try adjusting your search criteria
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Enhanced Live Stats Section */}
      <section className="py-16 bg-gray-800/30 backdrop-blur-sm">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              <span className="text-gold">CoinKrazy</span> Live Table Analytics
            </h2>
            <p className="text-gray-300 text-lg">
              Real-time statistics and profit tracking across all table games
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader className="text-center pb-2">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-6 w-6 text-green-400 mr-2" />
                  <CardTitle className="text-2xl font-bold text-green-400">
                    {totalActivePlayers}
                  </CardTitle>
                </div>
                <CardDescription className="text-gray-300">
                  Active Players
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader className="text-center pb-2">
                <div className="flex items-center justify-center mb-2">
                  <Target className="h-6 w-6 text-blue-400 mr-2" />
                  <CardTitle className="text-2xl font-bold text-blue-400">
                    {totalAvailableSeats}
                  </CardTitle>
                </div>
                <CardDescription className="text-gray-300">
                  Available Seats
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader className="text-center pb-2">
                <div className="flex items-center justify-center mb-2">
                  <DollarSign className="h-6 w-6 text-gold mr-2" />
                  <CardTitle className="text-2xl font-bold text-gold">
                    ${totalDailyProfits.toLocaleString()}
                  </CardTitle>
                </div>
                <CardDescription className="text-gray-300">
                  Daily Revenue
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader className="text-center pb-2">
                <div className="flex items-center justify-center mb-2">
                  <Activity className="h-6 w-6 text-purple-400 mr-2" />
                  <CardTitle className="text-2xl font-bold text-purple-400">
                    {Math.round(
                      (totalActivePlayers /
                        (totalActivePlayers + totalAvailableSeats)) *
                        100,
                    )}
                    %
                  </CardTitle>
                </div>
                <CardDescription className="text-gray-300">
                  Table Occupancy
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How to Play Section */}
      <section className="py-16">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              How <span className="text-gold">CoinKrazy</span> Table Games Work
            </h2>
            <p className="text-gray-300 text-lg">
              Everything you need to know about playing at our premium tables
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-gold to-yellow-400 rounded-full flex items-center justify-center mx-auto shadow-xl">
                <Coins className="h-10 w-10 text-black" />
              </div>
              <h3 className="text-2xl font-semibold text-white">
                Dual Currency System
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Play with Gold Coins (GC) for entertainment or Sweeps Coins (SC)
                for real prizes. Each table supports both currencies with
                separate buy-in tracking.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-xl">
                <Eye className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white">
                Real-Time Seat Selection
              </h3>
              <p className="text-gray-300 leading-relaxed">
                View live table layouts with exactly 5 seats per poker table.
                See real-time availability and select your preferred seat
                instantly.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-violet-500 rounded-full flex items-center justify-center mx-auto shadow-xl">
                <BarChart3 className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white">
                Profit Tracking
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Advanced buy-in tracking and profit calculations. Administrators
                can monitor daily profits and performance metrics for each
                table.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
