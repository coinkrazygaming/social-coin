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
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Clock,
  Users,
  Trophy,
  Star,
  Coins,
  Grid3X3,
  Play,
  Timer,
  Target,
  Crown,
  Gift,
  Zap,
} from "lucide-react";
import {
  BingoGame,
  BingoCard,
  BingoRoom,
  BingoNumber,
} from "@shared/bingoTypes";
import { useAuth } from "@/components/AuthContext";
import { AccessDeniedModal } from "@/components/AccessDeniedModal";

export default function Bingo() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<BingoRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>("free-gc-room");
  const [games, setGames] = useState<BingoGame[]>([]);
  const [selectedGame, setSelectedGame] = useState<BingoGame | null>(null);
  const [playerCards, setPlayerCards] = useState<BingoCard[]>([]);
  const [calledNumbers, setCalledNumbers] = useState<BingoNumber[]>([]);
  const [showGameDialog, setShowGameDialog] = useState(false);
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    if (selectedRoom) {
      fetchRoomGames();
    }
  }, [selectedRoom]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (selectedGame && showGameDialog) {
      fetchLiveUpdates();
      interval = setInterval(fetchLiveUpdates, 2000); // Update every 2 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [selectedGame, showGameDialog]);

  const fetchRooms = async () => {
    try {
      const response = await fetch("/api/bingo/rooms");
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error("Error fetching bingo rooms:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRoomGames = async () => {
    try {
      const response = await fetch(`/api/bingo/rooms/${selectedRoom}/games`);
      const data = await response.json();
      setGames(data);
    } catch (error) {
      console.error("Error fetching room games:", error);
    }
  };

  const fetchLiveUpdates = async () => {
    if (!selectedGame) return;
    try {
      const response = await fetch(
        `/api/bingo/games/${selectedGame.id}/live-updates`,
      );
      const data = await response.json();
      setCalledNumbers(data.calledNumbers);

      // Update game status
      if (selectedGame) {
        setSelectedGame((prev) =>
          prev
            ? {
                ...prev,
                status: data.gameStatus,
                timeRemaining: data.timeRemaining,
                winners: data.winners,
              }
            : null,
        );
      }
    } catch (error) {
      console.error("Error fetching live updates:", error);
    }
  };

  const handleJoinGame = async (game: BingoGame) => {
    if (!user) {
      if (game.currency === "SC") {
        setShowAccessDenied(true);
      }
      return;
    }

    if (game.currency === "SC" && !user) {
      setShowAccessDenied(true);
      return;
    }

    try {
      const response = await fetch(`/api/bingo/games/${game.id}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          username: user.username,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPlayerCards([data.card]);
        setSelectedGame(game);
        setShowGameDialog(true);
        fetchRoomGames(); // Refresh to show updated player count
      } else {
        const error = await response.json();
        alert(error.error || "Failed to join game");
      }
    } catch (error) {
      console.error("Error joining game:", error);
      alert("Failed to join game");
    }
  };

  const handleMarkNumber = async (cardId: string, row: number, col: number) => {
    try {
      const response = await fetch(`/api/bingo/cards/${cardId}/mark`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ row, col }),
      });

      if (response.ok) {
        const data = await response.json();
        setPlayerCards((prev) =>
          prev.map((card) => (card.id === cardId ? data.card : card)),
        );
      }
    } catch (error) {
      console.error("Error marking number:", error);
    }
  };

  const formatTimeRemaining = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "waiting":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "starting":
        return "bg-gold/20 text-gold border-gold/30";
      case "in-progress":
        return "bg-casino-green/20 text-casino-green border-casino-green/30";
      case "completed":
        return "bg-muted/20 text-muted-foreground border-muted/30";
      default:
        return "bg-muted/20 text-muted-foreground border-muted/30";
    }
  };

  const getStatusText = (status: string, timeRemaining: number) => {
    switch (status) {
      case "waiting":
        return `Starts in ${formatTimeRemaining(timeRemaining)}`;
      case "starting":
        return `Starting in ${timeRemaining}s`;
      case "in-progress":
        return `${formatTimeRemaining(timeRemaining)} left`;
      case "completed":
        return "Completed";
      default:
        return "Unknown";
    }
  };

  const currentRoom = rooms.find((room) => room.id === selectedRoom);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
                <Grid3X3 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Bingo Hall</h1>
                <p className="text-muted-foreground text-lg">
                  Join scheduled games and win big with our community bingo!
                </p>
              </div>
            </div>

            <div className="flex justify-center space-x-6 mt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {rooms.reduce((sum, room) => sum + room.currentOccupancy, 0)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Players Online
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gold">
                  {
                    games.filter(
                      (g) => g.status === "waiting" || g.status === "starting",
                    ).length
                  }
                </div>
                <div className="text-sm text-muted-foreground">
                  Upcoming Games
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-casino-green">
                  {games.filter((g) => g.status === "in-progress").length}
                </div>
                <div className="text-sm text-muted-foreground">Live Games</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-sweep">24/7</div>
                <div className="text-sm text-muted-foreground">
                  Always Playing
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Room Selection */}
      <section className="py-8 bg-card/30">
        <div className="container px-4">
          <div className="flex flex-wrap gap-4 items-center justify-center">
            {rooms.map((room) => (
              <Button
                key={room.id}
                variant={selectedRoom === room.id ? "default" : "outline"}
                size="lg"
                onClick={() => setSelectedRoom(room.id)}
                className={`${
                  selectedRoom === room.id
                    ? room.currency === "GC"
                      ? "bg-gradient-to-r from-gold to-yellow-400 text-gold-foreground"
                      : "bg-gradient-to-r from-purple-500 to-purple-600 text-white"
                    : ""
                }`}
              >
                {room.currency === "GC" ? (
                  <Coins className="h-5 w-5 mr-2" />
                ) : (
                  <Star className="h-5 w-5 mr-2" />
                )}
                <div className="text-left">
                  <div className="font-semibold">{room.name}</div>
                  <div className="text-xs opacity-75">
                    {room.currentOccupancy}/{room.maxCapacity} players
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Games List */}
      <section className="py-16">
        <div className="container px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">{currentRoom?.name}</h2>
            <p className="text-muted-foreground">{currentRoom?.description}</p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading bingo games...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {games.map((game) => (
                <Card
                  key={game.id}
                  className="group hover:scale-105 transition-all duration-300 overflow-hidden"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center">
                        <Grid3X3 className="h-5 w-5 mr-2" />
                        {game.name}
                      </CardTitle>
                      <Badge className={getStatusColor(game.status)}>
                        {getStatusText(game.status, game.timeRemaining)}
                      </Badge>
                    </div>
                    <CardDescription>{game.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Game Info */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>
                          {game.currentPlayers}/{game.maxPlayers}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Timer className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{game.duration}m game</span>
                      </div>
                      <div className="flex items-center">
                        <Target className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{game.pattern.name}</span>
                      </div>
                      <div className="flex items-center">
                        {game.currency === "GC" ? (
                          <Coins className="h-4 w-4 mr-2 text-gold" />
                        ) : (
                          <Star className="h-4 w-4 mr-2 text-purple-400" />
                        )}
                        <span>
                          {game.ticketPrice} {game.currency}
                        </span>
                      </div>
                    </div>

                    {/* Prize Pool */}
                    <div className="bg-gradient-to-r from-gold/10 to-purple-500/10 border border-gold/20 rounded-lg p-3 text-center">
                      <div className="text-sm text-muted-foreground">
                        Prize Pool
                      </div>
                      <div className="text-lg font-bold text-gold">
                        {game.prizePool.toLocaleString()} {game.currency}
                      </div>
                    </div>

                    {/* Pattern Preview */}
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground mb-2">
                        Winning Pattern
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-2xl">{game.pattern.icon}</span>
                        <div>
                          <div className="font-semibold">
                            {game.pattern.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {game.pattern.description}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Winners */}
                    {game.winners.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-sm font-semibold flex items-center">
                          <Trophy className="h-4 w-4 mr-2 text-gold" />
                          Recent Winners
                        </div>
                        {game.winners.slice(0, 3).map((winner, index) => (
                          <div
                            key={winner.id}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="flex items-center">
                              {index === 0 && (
                                <Crown className="h-3 w-3 mr-1 text-gold" />
                              )}
                              {winner.playerName}
                            </span>
                            <span className="font-semibold text-casino-green">
                              {winner.prize} {winner.currency}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Join Button */}
                    <Button
                      className={`w-full ${
                        game.currency === "GC"
                          ? "bg-gradient-to-r from-gold to-yellow-400 text-gold-foreground hover:from-yellow-400 hover:to-gold"
                          : "bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-500"
                      }`}
                      disabled={
                        game.status === "completed" ||
                        game.currentPlayers >= game.maxPlayers
                      }
                      onClick={() => handleJoinGame(game)}
                    >
                      {game.status === "completed" ? (
                        <>
                          <Trophy className="h-4 w-4 mr-2" />
                          Game Finished
                        </>
                      ) : game.currentPlayers >= game.maxPlayers ? (
                        <>
                          <Users className="h-4 w-4 mr-2" />
                          Room Full
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          {game.ticketPrice === 0
                            ? "Join Free"
                            : `Buy Ticket (${game.ticketPrice} ${game.currency})`}
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Game Dialog */}
      <Dialog open={showGameDialog} onOpenChange={setShowGameDialog}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">
              {selectedGame?.name}
            </DialogTitle>
            <DialogDescription className="text-center">
              Pattern: {selectedGame?.pattern.name} | Prize Pool:{" "}
              {selectedGame?.prizePool} {selectedGame?.currency}
            </DialogDescription>
          </DialogHeader>

          {selectedGame && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Bingo Card */}
              <div className="lg:col-span-2">
                <h3 className="font-bold mb-4 text-center">Your Bingo Card</h3>
                {playerCards.map((card) => (
                  <div
                    key={card.id}
                    className="bg-white rounded-lg p-4 border-4 border-purple-500"
                  >
                    {/* BINGO Header */}
                    <div className="grid grid-cols-5 mb-2">
                      {["B", "I", "N", "G", "O"].map((letter) => (
                        <div
                          key={letter}
                          className="text-center font-bold text-lg text-purple-600 py-2"
                        >
                          {letter}
                        </div>
                      ))}
                    </div>

                    {/* Bingo Grid */}
                    <div className="grid grid-cols-5 gap-1">
                      {card.numbers.map((row, rowIndex) =>
                        row.map((number, colIndex) => (
                          <button
                            key={`${rowIndex}-${colIndex}`}
                            className={`
                              w-12 h-12 flex items-center justify-center text-sm font-bold rounded border-2
                              ${
                                card.markedPositions[rowIndex][colIndex]
                                  ? "bg-purple-500 text-white border-purple-600"
                                  : "bg-white text-gray-800 border-gray-300 hover:bg-purple-100"
                              }
                              ${rowIndex === 2 && colIndex === 2 ? "bg-gold text-white border-gold" : ""}
                            `}
                            onClick={() => {
                              if (rowIndex !== 2 || colIndex !== 2) {
                                // Can't unmark free space
                                handleMarkNumber(card.id, rowIndex, colIndex);
                              }
                            }}
                            disabled={selectedGame?.status !== "in-progress"}
                          >
                            {rowIndex === 2 && colIndex === 2 ? "FREE" : number}
                          </button>
                        )),
                      )}
                    </div>

                    {card.isWinner && (
                      <div className="mt-4 text-center">
                        <Badge className="bg-gold text-gold-foreground text-lg px-4 py-2">
                          <Trophy className="h-4 w-4 mr-2" />
                          BINGO! You Won!
                        </Badge>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Game Info */}
              <div className="space-y-4">
                {/* Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-center">Game Status</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <Badge
                      className={`text-lg px-4 py-2 ${getStatusColor(selectedGame.status)}`}
                    >
                      {selectedGame.status.toUpperCase()}
                    </Badge>
                    <div className="text-2xl font-bold">
                      {formatTimeRemaining(selectedGame.timeRemaining)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {selectedGame.status === "in-progress"
                        ? "Time Remaining"
                        : "Time to Start"}
                    </div>
                  </CardContent>
                </Card>

                {/* Called Numbers */}
                <Card>
                  <CardHeader>
                    <CardTitle>Last Called Numbers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-5 gap-2">
                      {calledNumbers.slice(-10).map((num, index) => (
                        <div
                          key={index}
                          className="text-center p-2 bg-purple-100 rounded text-purple-800 font-bold"
                        >
                          {num.letter}
                          {num.number}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Winners */}
                {selectedGame.winners.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Winners</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {selectedGame.winners.map((winner, index) => (
                          <div
                            key={winner.id}
                            className="flex items-center justify-between"
                          >
                            <span className="flex items-center">
                              {index === 0 && (
                                <Crown className="h-4 w-4 mr-1 text-gold" />
                              )}
                              {winner.playerName}
                            </span>
                            <span className="font-bold text-casino-green">
                              {winner.prize} {winner.currency}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Access Denied Modal */}
      <AccessDeniedModal
        isOpen={showAccessDenied}
        onClose={() => setShowAccessDenied(false)}
        feature="sweeps-coins"
      />
    </div>
  );
}
