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
import { PokerTableThumbnail } from "@/components/PokerTableThumbnail";
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
} from "lucide-react";
import { cardGames, pokerTables } from "@shared/tableGameData";
import { TableGame, PokerTable } from "@shared/slotTypes";
import { useAuth } from "@/components/AuthContext";

export default function TableGames() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [filteredCardGames, setFilteredCardGames] =
    useState<TableGame[]>(cardGames);
  const [filteredPokerTables, setFilteredPokerTables] =
    useState<PokerTable[]>(pokerTables);

  useEffect(() => {
    // Filter card games
    let filtered = cardGames;
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
    let filteredPoker = pokerTables;
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
    // TODO: Implement actual poker table join
  };

  const gameTypes = [
    { id: "all", name: "All Games", icon: Dice6 },
    { id: "card", name: "Card Games", icon: Trophy },
    { id: "poker", name: "Poker Tables", icon: Crown },
  ];

  const totalActivePlayers =
    cardGames.reduce((sum, game) => sum + game.currentPlayers, 0) +
    pokerTables.reduce(
      (sum, table) => sum + table.seats.filter((s) => s.player).length,
      0,
    );

  const totalAvailableSeats =
    cardGames.reduce(
      (sum, game) => sum + (game.maxPlayers - game.currentPlayers),
      0,
    ) +
    pokerTables.reduce(
      (sum, table) => sum + table.seats.filter((s) => !s.player).length,
      0,
    );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-casino-red to-red-600 rounded-2xl flex items-center justify-center mr-4">
                <Dice6 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Table Games</h1>
                <p className="text-muted-foreground text-lg">
                  Classic card games and live poker tables with real players!
                </p>
              </div>
            </div>

            <div className="flex justify-center space-x-6 mt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-casino-red">
                  {cardGames.length + pokerTables.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Active Tables
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-casino-green">
                  {totalActivePlayers}
                </div>
                <div className="text-sm text-muted-foreground">
                  Players Online
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gold">
                  {totalAvailableSeats}
                </div>
                <div className="text-sm text-muted-foreground">
                  Available Seats
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-sweep">Live</div>
                <div className="text-sm text-muted-foreground">
                  Real-Time Play
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
                  placeholder="Search tables..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* CoinKrazy.com Branding */}
            <Badge className="text-lg px-4 py-2 bg-gradient-to-r from-gold to-yellow-400 text-gold-foreground">
              CoinKrazy.com Table Games
            </Badge>
          </div>

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
                      ? "bg-gradient-to-r from-casino-red to-red-600 text-white"
                      : ""
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

      {/* Games Section */}
      <section className="py-16">
        <div className="container px-4">
          <Tabs defaultValue="card-games" className="space-y-8">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
              <TabsTrigger value="card-games">Card Games</TabsTrigger>
              <TabsTrigger value="poker-tables">Poker Tables</TabsTrigger>
            </TabsList>

            {/* Card Games */}
            <TabsContent value="card-games" className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Card Games</h2>
                  <p className="text-muted-foreground">
                    Spades, UNO, Hearts and more classic card games
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="text-lg px-4 py-2 bg-casino-green/20 text-casino-green border-casino-green/30"
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
                  <Dice6 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    No card games found
                  </h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search criteria
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Poker Tables */}
            <TabsContent value="poker-tables" className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Live Poker Tables</h2>
                  <p className="text-muted-foreground">
                    Texas Hold'em, Omaha, Blackjack with real-time seats
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="text-lg px-4 py-2 bg-gold/20 text-gold border-gold/30"
                >
                  <Crown className="h-4 w-4 mr-2" />
                  {filteredPokerTables.length} Tables
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPokerTables.map((table) => (
                  <PokerTableThumbnail
                    key={table.id}
                    table={table}
                    onJoinTable={handleJoinPokerTable}
                    size="medium"
                  />
                ))}
              </div>

              {filteredPokerTables.length === 0 && (
                <div className="text-center py-12">
                  <Crown className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    No poker tables found
                  </h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search criteria
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Live Stats Section */}
      <section className="py-16 bg-card/30">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Live Table Stats</h2>
            <p className="text-muted-foreground mt-2">
              Real-time activity across all table games
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl font-bold text-casino-green">
                  {totalActivePlayers}
                </CardTitle>
                <CardDescription>Active Players</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl font-bold text-gold">
                  {totalAvailableSeats}
                </CardTitle>
                <CardDescription>Available Seats</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl font-bold text-casino-red">
                  {cardGames.length}
                </CardTitle>
                <CardDescription>Card Games</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl font-bold text-sweep">
                  {pokerTables.length}
                </CardTitle>
                <CardDescription>Poker Tables</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How to Play Section */}
      <section className="py-16">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">How Table Games Work</h2>
            <p className="text-muted-foreground mt-2">
              Everything you need to know about playing at CoinKrazy.com
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-gold to-yellow-400 rounded-full flex items-center justify-center mx-auto">
                <Coins className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Choose Your Currency</h3>
              <p className="text-muted-foreground">
                Play with Gold Coins (GC) for fun or Sweeps Coins (SC) for real
                prizes. Each table supports both currencies separately.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-casino-red to-red-600 rounded-full flex items-center justify-center mx-auto">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Join Real Players</h3>
              <p className="text-muted-foreground">
                Compete against real players in card games or select your seat
                at live poker tables with interactive seat selection.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-sweep to-purple-600 rounded-full flex items-center justify-center mx-auto">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Win Big Prizes</h3>
              <p className="text-muted-foreground">
                Win additional coins based on your performance. Sweeps Coins can
                be redeemed for real prizes!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
