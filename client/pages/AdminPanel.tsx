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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/components/AuthContext";
import {
  ShieldCheck,
  Users,
  TrendingUp,
  DollarSign,
  Gamepad2,
  Trophy,
  Clock,
  Star,
  ArrowLeft,
  AlertTriangle,
} from "lucide-react";
import {
  MiniGamePlay,
  User as UserType,
  Transaction,
  PayPalPayment,
} from "@shared/types";

export default function AdminPanel() {
  const { user } = useAuth();
  const [miniGameHistory, setMiniGameHistory] = useState<MiniGamePlay[]>([]);
  const [allUsers, setAllUsers] = useState<UserType[]>([]);
  const [allPayments, setAllPayments] = useState<PayPalPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState<string>("all");

  useEffect(() => {
    if (user?.role === "admin") {
      fetchAdminData();
    }
  }, [user]);

  const fetchAdminData = async () => {
    try {
      const [miniGamesRes, usersRes, paymentsRes] = await Promise.all([
        fetch("/api/mini-games/history"),
        fetch("/api/users"),
        fetch("/api/payments"),
      ]);

      if (miniGamesRes.ok) {
        const miniGames = await miniGamesRes.json();
        setMiniGameHistory(miniGames);
      }

      if (usersRes.ok) {
        const users = await usersRes.json();
        setAllUsers(users);
      }

      if (paymentsRes.ok) {
        const payments = await paymentsRes.json();
        setAllPayments(payments);
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect non-admin users
  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <AlertTriangle className="h-12 w-12 mx-auto text-casino-red mb-4" />
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              This area is restricted to administrators only.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild>
              <a href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Casino
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const colinShotsHistory = miniGameHistory.filter(
    (play) => play.gameType === "colin-shots",
  );
  const totalSCPaidOut = miniGameHistory.reduce(
    (sum, play) => sum + play.scEarned,
    0,
  );
  const totalRevenue = allPayments
    .filter((p) => p.status === "completed")
    .reduce((sum, payment) => sum + payment.amount, 0);

  const stats = {
    totalUsers: allUsers.length,
    totalPlays: miniGameHistory.length,
    totalSCPaidOut: Math.round(totalSCPaidOut * 100) / 100,
    totalRevenue,
    avgScoreColinShots:
      colinShotsHistory.length > 0
        ? Math.round(
            (colinShotsHistory.reduce((sum, play) => sum + play.score, 0) /
              colinShotsHistory.length) *
              100,
          ) / 100
        : 0,
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleString();
  };

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = score / maxScore;
    if (percentage >= 0.8) return "text-casino-green";
    if (percentage >= 0.6) return "text-gold";
    if (percentage >= 0.4) return "text-yellow-400";
    return "text-muted-foreground";
  };

  return (
    <div className="min-h-screen p-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-casino-red to-red-600 rounded-lg flex items-center justify-center mr-4">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Admin Panel</h1>
              <p className="text-muted-foreground">
                CoinKrazy Casino Management
              </p>
            </div>
          </div>

          <Alert>
            <ShieldCheck className="h-4 w-4" />
            <AlertDescription>
              Welcome, {user.username}! You have full administrative access to
              CoinKrazy.
            </AlertDescription>
          </Alert>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Mini Game Plays
              </CardTitle>
              <Gamepad2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPlays}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">SC Paid Out</CardTitle>
              <Star className="h-4 w-4 text-sweep" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-sweep">
                {stats.totalSCPaidOut}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-casino-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-casino-green">
                ${stats.totalRevenue.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg Colin Shots
              </CardTitle>
              <Trophy className="h-4 w-4 text-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gold">
                {stats.avgScoreColinShots}/25
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="mini-games" className="space-y-6">
          <TabsList>
            <TabsTrigger value="mini-games">Mini Games</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

          {/* Mini Games Tab */}
          <TabsContent value="mini-games" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>
                      Mini Games → Colin Shots → Payout History
                    </CardTitle>
                    <CardDescription>
                      Track all mini game plays and payouts
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="text-gold border-gold/30">
                    {colinShotsHistory.length} Colin Shots Plays
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {colinShotsHistory.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No Colin Shots games played yet.
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {colinShotsHistory.map((play) => {
                        const user = allUsers.find((u) => u.id === play.userId);
                        return (
                          <div
                            key={play.id}
                            className="flex items-center justify-between p-4 bg-muted/20 rounded-lg"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 bg-gradient-to-br from-gold to-yellow-400 rounded-full flex items-center justify-center">
                                🏀
                              </div>
                              <div>
                                <div className="font-medium">
                                  {user?.username || "Unknown Player"}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {formatDate(play.playedAt)}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-4">
                              <div className="text-center">
                                <div
                                  className={`font-bold ${getScoreColor(play.score, play.maxScore)}`}
                                >
                                  {play.score}/{play.maxScore}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Score
                                </div>
                              </div>

                              <div className="text-center">
                                <div className="font-bold text-sweep">
                                  {play.scEarned.toFixed(2)} SC
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Earned
                                </div>
                              </div>

                              <div className="text-center">
                                <div className="font-bold text-blue-400">
                                  {play.duration}s
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Duration
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  View and manage all registered users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {allUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 bg-muted/20 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            user.role === "admin"
                              ? "bg-gradient-to-br from-casino-red to-red-600"
                              : user.role === "staff"
                                ? "bg-gradient-to-br from-blue-500 to-blue-600"
                                : "bg-gradient-to-br from-sweep to-purple-600"
                          }`}
                        >
                          <Users className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="font-medium flex items-center space-x-2">
                            <span>{user.username}</span>
                            <Badge
                              variant="outline"
                              className={
                                user.role === "admin"
                                  ? "border-casino-red/30 text-casino-red"
                                  : user.role === "staff"
                                    ? "border-blue-500/30 text-blue-400"
                                    : "border-muted/30 text-muted-foreground"
                              }
                            >
                              {user.role}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {user.email}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="font-bold text-gold">
                            {user.goldCoins.toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            GC
                          </div>
                        </div>

                        <div className="text-center">
                          <div className="font-bold text-sweep">
                            {user.sweepsCoins.toFixed(2)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            SC
                          </div>
                        </div>

                        <Badge
                          variant={
                            user.kycStatus === "approved"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {user.kycStatus}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>
                  Track all PayPal transactions and Gold Coin purchases
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {allPayments.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No payments recorded yet.
                    </div>
                  ) : (
                    allPayments.map((payment) => {
                      const user = allUsers.find(
                        (u) => u.id === payment.userId,
                      );
                      return (
                        <div
                          key={payment.id}
                          className="flex items-center justify-between p-4 bg-muted/20 rounded-lg"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                              <DollarSign className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <div className="font-medium">
                                {user?.username || "Unknown User"}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {formatDate(payment.createdAt)}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4">
                            <div className="text-center">
                              <div className="font-bold text-casino-green">
                                ${payment.amount.toFixed(2)}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                USD
                              </div>
                            </div>

                            <div className="text-center">
                              <div className="font-bold text-gold">
                                {payment.goldCoinsAwarded.toLocaleString()}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                GC
                              </div>
                            </div>

                            <div className="text-center">
                              <div className="font-bold text-sweep">
                                {payment.sweepsCoinsBonus.toFixed(2)}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                SC Bonus
                              </div>
                            </div>

                            <Badge
                              variant={
                                payment.status === "completed"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {payment.status}
                            </Badge>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
