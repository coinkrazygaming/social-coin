import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SlotThumbnail } from "@/components/SlotThumbnail";
import { featuredSlots } from "@shared/slotData";
import {
  Gamepad2,
  Dice6,
  Target,
  Grid3X3,
  Trophy,
  Star,
  Coins,
  Zap,
  Gift,
  Users,
  TrendingUp,
  Clock,
  PlayCircle,
  Sparkles,
} from "lucide-react";

export default function Index() {
  const gameCategories = [
    {
      title: "Slot Games",
      description: "Over 500+ premium slot games",
      icon: Gamepad2,
      href: "/slots",
      gradient: "from-gold to-yellow-400",
      games: 542,
      players: 1284,
    },
    {
      title: "Table Games",
      description: "Classic casino table games",
      icon: Dice6,
      href: "/table-games",
      gradient: "from-casino-red to-red-400",
      games: 28,
      players: 342,
    },
    {
      title: "Sportsbook",
      description: "Live sports betting action",
      icon: Target,
      href: "/sportsbook",
      gradient: "from-blue-500 to-blue-400",
      games: 150,
      players: 892,
    },
    {
      title: "Bingo Hall",
      description: "Community bingo games",
      icon: Grid3X3,
      href: "/bingo",
      gradient: "from-sweep to-purple-400",
      games: 12,
      players: 234,
    },
  ];

  const featuredSlots = [
    {
      name: "Lightning Riches",
      provider: "SweepSlots",
      jackpot: "125,000 SC",
      image: "https://via.placeholder.com/300x200?text=Lightning+Riches",
      popular: true,
    },
    {
      name: "Royal Fortune",
      provider: "ReelGames",
      jackpot: "89,500 SC",
      image: "https://via.placeholder.com/300x200?text=Royal+Fortune",
      new: true,
    },
    {
      name: "Mystic Dragons",
      provider: "SweepSlots",
      jackpot: "67,200 SC",
      image: "https://via.placeholder.com/300x200?text=Mystic+Dragons",
      hot: true,
    },
  ];

  const recentWinners = [
    {
      username: "LuckyPlayer77",
      game: "Lightning Riches",
      amount: "15,000 SC",
    },
    { username: "WinnerBig2024", game: "Royal Fortune", amount: "12,500 SC" },
    { username: "CasinoKing", game: "Blackjack Pro", amount: "8,900 SC" },
    { username: "SlotMaster", game: "Mystic Dragons", amount: "7,600 SC" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20 py-16 sm:py-24">
        <div
          className={
            'absolute inset-0 bg-[url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')] opacity-50'
          }
        />

        <div className="container relative px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 flex justify-center">
              <Badge className="casino-glow bg-gold/20 text-gold border-gold/30 px-4 py-2">
                <Sparkles className="h-4 w-4 mr-2" />
                Welcome Bonus: 10,000 GC + 10 SC FREE!
              </Badge>
            </div>

            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-gold via-yellow-400 to-gold bg-clip-text text-transparent neon-text">
                CoinKrazy
              </span>
              <br />
              <span className="text-2xl sm:text-4xl text-muted-foreground">
                AI-Powered Social Casino
              </span>
            </h1>

            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the ultimate sweepstakes casino with 500+ games, live
              sports betting, and AI-powered features. Play with Gold Coins or
              win real Sweeps Coins!
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-gold to-yellow-400 text-gold-foreground hover:from-yellow-400 hover:to-gold casino-glow text-lg px-8 py-4"
              >
                <Gift className="h-5 w-5 mr-2" />
                Claim Welcome Bonus
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-sweep text-sweep hover:bg-sweep/10 text-lg px-8 py-4"
              >
                <PlayCircle className="h-5 w-5 mr-2" />
                Play Demo
              </Button>
            </div>

            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-gold">500+</div>
                <div className="text-sm text-muted-foreground">Slot Games</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-sweep">28</div>
                <div className="text-sm text-muted-foreground">Table Games</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">Live</div>
                <div className="text-sm text-muted-foreground">Sportsbook</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-casino-green">24/7</div>
                <div className="text-sm text-muted-foreground">Bingo Hall</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Game Categories */}
      <section className="py-16 bg-card/30">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Game Categories</h2>
            <p className="text-muted-foreground mt-2">
              Choose your adventure in our casino world
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {gameCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Link key={category.title} to={category.href}>
                  <Card className="group hover:scale-105 transition-all duration-300 border-border/40 hover:border-border bg-card/50 backdrop-blur">
                    <CardHeader className="text-center pb-4">
                      <div
                        className={`mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br ${category.gradient} p-4 group-hover:shadow-lg transition-shadow`}
                      >
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="mt-4">{category.title}</CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Games:</span>
                        <span className="font-medium">{category.games}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Online:</span>
                        <span className="font-medium text-casino-green">
                          {category.players}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Slots */}
      <section className="py-16">
        <div className="container px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold">Featured Slots</h2>
              <p className="text-muted-foreground">
                Hottest games with biggest jackpots
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/slots">View All Slots</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredSlots.map((slot) => (
              <Card
                key={slot.name}
                className="group overflow-hidden hover:scale-105 transition-all duration-300"
              >
                <div className="relative">
                  <img
                    src={slot.image}
                    alt={slot.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    {slot.popular && (
                      <Badge className="bg-gold/90 text-gold-foreground">
                        <Star className="h-3 w-3 mr-1" />
                        Popular
                      </Badge>
                    )}
                    {slot.new && (
                      <Badge className="bg-casino-green/90 text-white">
                        <Zap className="h-3 w-3 mr-1" />
                        New
                      </Badge>
                    )}
                    {slot.hot && (
                      <Badge className="bg-casino-red/90 text-white">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Hot
                      </Badge>
                    )}
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {slot.name}
                    <Badge
                      variant="outline"
                      className="text-sweep border-sweep"
                    >
                      {slot.jackpot}
                    </Badge>
                  </CardTitle>
                  <CardDescription>by {slot.provider}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Play Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Winners & Live Stats */}
      <section className="py-16 bg-card/30">
        <div className="container px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Winners */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-gold" />
                  Recent Big Winners
                </CardTitle>
                <CardDescription>
                  Latest SC wins across all games
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentWinners.map((winner, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/20"
                  >
                    <div>
                      <div className="font-medium">{winner.username}</div>
                      <div className="text-sm text-muted-foreground">
                        {winner.game}
                      </div>
                    </div>
                    <Badge className="bg-casino-green/20 text-casino-green border-casino-green/30">
                      {winner.amount}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Live Casino Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-sweep" />
                  Live Casino Stats
                </CardTitle>
                <CardDescription>Real-time casino activity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-lg bg-gold/10 border border-gold/20">
                    <div className="text-2xl font-bold text-gold">2,847</div>
                    <div className="text-sm text-muted-foreground">
                      Players Online
                    </div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-sweep/10 border border-sweep/20">
                    <div className="text-2xl font-bold text-sweep">$1.2M</div>
                    <div className="text-sm text-muted-foreground">
                      Total Jackpots
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Next Bingo Round</span>
                    <Badge
                      variant="outline"
                      className="text-purple-400 border-purple-500/30"
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      2:45
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Live Sports Games</span>
                    <Badge
                      variant="outline"
                      className="text-blue-400 border-blue-500/30"
                    >
                      <Target className="h-3 w-3 mr-1" />
                      23 Live
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Table Games</span>
                    <Badge
                      variant="outline"
                      className="text-casino-red border-casino-red/30"
                    >
                      <Dice6 className="h-3 w-3 mr-1" />8 Open
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-gold/10 via-transparent to-sweep/10">
        <div className="container px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Winning?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of players at CoinKrazy and experience the ultimate
            social casino with AI-powered features, live sports betting, and
            real Sweeps Coin prizes!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-gold to-yellow-400 text-gold-foreground hover:from-yellow-400 hover:to-gold casino-glow"
            >
              <Coins className="h-5 w-5 mr-2" />
              Get 10,000 GC + 10 SC Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-sweep text-sweep hover:bg-sweep/10"
            >
              <Trophy className="h-5 w-5 mr-2" />
              View Leaderboards
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
