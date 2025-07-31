import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Gamepad2,
  Clock,
  Calendar,
  Target,
  Award,
  AlertCircle,
  CheckCircle,
  Star,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Download,
  Filter,
  Eye,
  Brain,
  Shield,
  Crown,
  Zap,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useAuth } from "./AuthContext";

interface AnalyticsData {
  overview: {
    totalUsers: number;
    activeUsers: number;
    newUsers: number;
    totalRevenue: number;
    revenueGrowth: number;
    totalBets: number;
    totalWins: number;
    houseEdge: number;
    averageSessionTime: number;
    conversionRate: number;
  };
  miniGames: {
    gameId: string;
    gameName: string;
    totalPlayers: number;
    totalBets: number;
    totalWins: number;
    revenue: number;
    rtp: number;
    popularity: number;
    averageSessionTime: number;
    newPlayersToday: number;
    revenueGrowth: number;
    isVerified: boolean;
    lastVerifiedBy: string;
    lastVerification: Date;
  }[];
  recommendations: {
    id: string;
    type: "performance" | "revenue" | "retention" | "marketing";
    priority: "low" | "medium" | "high" | "critical";
    title: string;
    description: string;
    actionPlan: string[];
    estimatedImpact: string;
    implementationTime: string;
    verifiedBy: string;
    createdAt: Date;
  }[];
  timeSeriesData: {
    date: string;
    revenue: number;
    users: number;
    bets: number;
    wins: number;
  }[];
}

interface AdminAnalyticsDashboardProps {
  className?: string;
}

export const AdminAnalyticsDashboard: React.FC<
  AdminAnalyticsDashboardProps
> = ({ className = "" }) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState("7d");
  const [selectedGame, setSelectedGame] = useState("all");
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const { user } = useAuth();

  useEffect(() => {
    loadAnalyticsData();
    const interval = setInterval(loadAnalyticsData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [selectedTimeRange, selectedGame]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);

    // Simulate real data that would come from your database
    const mockData: AnalyticsData = {
      overview: {
        totalUsers: 12547,
        activeUsers: 3892,
        newUsers: 127,
        totalRevenue: 285730.5,
        revenueGrowth: 12.3,
        totalBets: 1547829,
        totalWins: 1398946,
        houseEdge: 4.2,
        averageSessionTime: 23.5,
        conversionRate: 18.7,
      },
      miniGames: [
        {
          gameId: "lucky_sevens",
          gameName: "Lucky Sevens Deluxe",
          totalPlayers: 2847,
          totalBets: 156720,
          totalWins: 145893,
          revenue: 65420.3,
          rtp: 93.1,
          popularity: 98,
          averageSessionTime: 18.2,
          newPlayersToday: 43,
          revenueGrowth: 15.8,
          isVerified: true,
          lastVerifiedBy: "LuckyAI",
          lastVerification: new Date(Date.now() - 3600000),
        },
        {
          gameId: "diamond_fortune",
          gameName: "Diamond Fortune",
          totalPlayers: 3156,
          totalBets: 189430,
          totalWins: 171287,
          revenue: 78240.6,
          rtp: 90.4,
          popularity: 95,
          averageSessionTime: 22.7,
          newPlayersToday: 67,
          revenueGrowth: 22.1,
          isVerified: true,
          lastVerifiedBy: "LuckyAI",
          lastVerification: new Date(Date.now() - 1800000),
        },
        {
          gameId: "royal_riches",
          gameName: "Royal Riches Megaways",
          totalPlayers: 1923,
          totalBets: 124560,
          totalWins: 112104,
          revenue: 52310.4,
          rtp: 90.0,
          popularity: 87,
          averageSessionTime: 25.1,
          newPlayersToday: 29,
          revenueGrowth: 8.7,
          isVerified: true,
          lastVerifiedBy: "LuckyAI",
          lastVerification: new Date(Date.now() - 7200000),
        },
        {
          gameId: "golden_treasure",
          gameName: "Golden Treasure Hunt",
          totalPlayers: 1456,
          totalBets: 89350,
          totalWins: 80415,
          revenue: 38920.2,
          rtp: 90.0,
          popularity: 82,
          averageSessionTime: 19.8,
          newPlayersToday: 18,
          revenueGrowth: -2.3,
          isVerified: false,
          lastVerifiedBy: "Pending",
          lastVerification: new Date(Date.now() - 86400000),
        },
      ],
      recommendations: [
        {
          id: "rec_001",
          type: "revenue",
          priority: "high",
          title: "Optimize Golden Treasure Hunt RTP",
          description:
            "Golden Treasure Hunt showing negative revenue growth (-2.3%). Analysis suggests RTP is too high for current player engagement levels.",
          actionPlan: [
            "Reduce RTP from 90.0% to 88.5% gradually over 1 week",
            "Increase bonus frequency to maintain player satisfaction",
            "Monitor player retention during adjustment period",
            "Implement additional visual effects to enhance perceived value",
          ],
          estimatedImpact: "+$12,000 monthly revenue increase",
          implementationTime: "1-2 weeks",
          verifiedBy: "LuckyAI",
          createdAt: new Date(Date.now() - 3600000),
        },
        {
          id: "rec_002",
          type: "marketing",
          priority: "high",
          title: "Promote Diamond Fortune Success",
          description:
            "Diamond Fortune showing exceptional performance (22.1% growth). Capitalize on this momentum with targeted marketing.",
          actionPlan: [
            "Feature Diamond Fortune in homepage banner rotation",
            "Create social media campaign highlighting big wins",
            "Offer limited-time bonus for Diamond Fortune players",
            "Send targeted email to inactive users featuring the game",
          ],
          estimatedImpact: "+$18,000 monthly revenue increase",
          implementationTime: "3-5 days",
          verifiedBy: "LuckyAI",
          createdAt: new Date(Date.now() - 1800000),
        },
        {
          id: "rec_003",
          type: "retention",
          priority: "medium",
          title: "Improve Session Length Strategy",
          description:
            "Average session time (23.5 minutes) is below industry standard (28 minutes). Implement engagement boosters.",
          actionPlan: [
            "Add progressive bonus system for longer sessions",
            "Implement achievement system with session-based rewards",
            "Create mini-challenges that unlock after 20 minutes of play",
            "Send push notifications for daily bonus after 30-minute sessions",
          ],
          estimatedImpact: "+15% player retention, +$8,500 monthly revenue",
          implementationTime: "2-3 weeks",
          verifiedBy: "LuckyAI",
          createdAt: new Date(Date.now() - 7200000),
        },
      ],
      timeSeriesData: Array.from({ length: 7 }, (_, i) => ({
        date: new Date(
          Date.now() - (6 - i) * 24 * 60 * 60 * 1000,
        ).toLocaleDateString(),
        revenue: 35000 + Math.random() * 15000,
        users: 450 + Math.random() * 200,
        bets: 180000 + Math.random() * 50000,
        wins: 162000 + Math.random() * 45000,
      })),
    };

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setAnalyticsData(mockData);
    setLastUpdated(new Date());
    setIsLoading(false);
  };

  if (isLoading || !analyticsData) {
    return (
      <div className={`w-full ${className}`}>
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center justify-center">
              <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
              <span className="ml-3 text-lg">Loading Analytics Data...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatCurrency = (amount: number) =>
    `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const formatNumber = (num: number) => num.toLocaleString();
  const formatPercentage = (num: number) => `${num.toFixed(1)}%`;

  return (
    <div className={`w-full space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
          <p className="text-gray-400">
            Last updated: {lastUpdated.toLocaleString()} • Verified by LuckyAI
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select
            value={selectedTimeRange}
            onValueChange={setSelectedTimeRange}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={loadAnalyticsData} disabled={isLoading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-400">
                    {formatCurrency(analyticsData.overview.totalRevenue)}
                  </p>
                  <div className="flex items-center mt-1">
                    <ArrowUp className="h-4 w-4 text-green-400 mr-1" />
                    <span className="text-sm text-green-400">
                      +{formatPercentage(analyticsData.overview.revenueGrowth)}
                    </span>
                  </div>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Active Users</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {formatNumber(analyticsData.overview.activeUsers)}
                  </p>
                  <p className="text-sm text-gray-400">
                    {formatNumber(analyticsData.overview.newUsers)} new today
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">House Edge</p>
                  <p className="text-2xl font-bold text-gold">
                    {formatPercentage(analyticsData.overview.houseEdge)}
                  </p>
                  <p className="text-sm text-green-400">Optimal range</p>
                </div>
                <Target className="h-8 w-8 text-gold" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Avg Session</p>
                  <p className="text-2xl font-bold text-purple-400">
                    {analyticsData.overview.averageSessionTime}m
                  </p>
                  <p className="text-sm text-yellow-400">Target: 28m</p>
                </div>
                <Clock className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Tabs defaultValue="games" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="games">Mini Games Performance</TabsTrigger>
          <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
          <TabsTrigger value="trends">Revenue Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="games" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gamepad2 className="h-5 w-5" />
                Mini Games Analytics
                <Badge
                  variant="outline"
                  className="text-green-400 border-green-400"
                >
                  <Brain className="h-3 w-3 mr-1" />
                  LuckyAI Verified
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {analyticsData.miniGames.map((game, index) => (
                  <motion.div
                    key={game.gameId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      className={`border-2 ${game.isVerified ? "border-green-500/30" : "border-yellow-500/30"}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-white">
                            {game.gameName}
                          </h3>
                          <div className="flex items-center gap-2">
                            {game.isVerified ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-yellow-500" />
                            )}
                            <Badge
                              className={`text-xs ${
                                game.revenueGrowth >= 0
                                  ? "bg-green-500/20 text-green-400"
                                  : "bg-red-500/20 text-red-400"
                              }`}
                            >
                              {game.revenueGrowth >= 0 ? "+" : ""}
                              {formatPercentage(game.revenueGrowth)}
                            </Badge>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-400">Revenue:</span>
                              <span className="text-green-400 ml-2">
                                {formatCurrency(game.revenue)}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-400">Players:</span>
                              <span className="text-blue-400 ml-2">
                                {formatNumber(game.totalPlayers)}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-400">RTP:</span>
                              <span className="text-yellow-400 ml-2">
                                {formatPercentage(game.rtp)}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-400">Popularity:</span>
                              <span className="text-purple-400 ml-2">
                                {game.popularity}/100
                              </span>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                              <span>Popularity Score</span>
                              <span>{game.popularity}/100</span>
                            </div>
                            <Progress value={game.popularity} className="h-2" />
                          </div>

                          <div className="text-xs text-gray-400">
                            <p>Verified by: {game.lastVerifiedBy}</p>
                            <p>
                              Last check:{" "}
                              {game.lastVerification.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                LuckyAI Recommendations
                <Badge className="bg-blue-600 text-white">
                  {analyticsData.recommendations.length} Active
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.recommendations.map((rec, index) => (
                  <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      className={`border-l-4 ${
                        rec.priority === "critical"
                          ? "border-l-red-500"
                          : rec.priority === "high"
                            ? "border-l-orange-500"
                            : rec.priority === "medium"
                              ? "border-l-yellow-500"
                              : "border-l-blue-500"
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-white mb-1">
                              {rec.title}
                            </h3>
                            <p className="text-sm text-gray-400">
                              {rec.description}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              className={`${
                                rec.priority === "critical"
                                  ? "bg-red-500"
                                  : rec.priority === "high"
                                    ? "bg-orange-500"
                                    : rec.priority === "medium"
                                      ? "bg-yellow-500"
                                      : "bg-blue-500"
                              } text-white`}
                            >
                              {rec.priority.toUpperCase()}
                            </Badge>
                            <Badge variant="outline">
                              <Brain className="h-3 w-3 mr-1" />
                              {rec.verifiedBy}
                            </Badge>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <h4 className="text-sm font-semibold text-white mb-2">
                              Action Plan:
                            </h4>
                            <ul className="space-y-1">
                              {rec.actionPlan.map((action, actionIndex) => (
                                <li
                                  key={actionIndex}
                                  className="text-sm text-gray-300 flex items-start"
                                >
                                  <CheckCircle className="h-3 w-3 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                  {action}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-400">
                                Estimated Impact:
                              </span>
                              <span className="text-green-400 ml-2">
                                {rec.estimatedImpact}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-400">
                                Implementation:
                              </span>
                              <span className="text-blue-400 ml-2">
                                {rec.implementationTime}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Revenue & Performance Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">
                    Daily Revenue
                  </h3>
                  <div className="space-y-2">
                    {analyticsData.timeSeriesData.map((data, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-card/50 rounded"
                      >
                        <span className="text-sm text-gray-400">
                          {data.date}
                        </span>
                        <span className="text-sm text-green-400">
                          {formatCurrency(data.revenue)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">
                    Key Metrics
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Conversion Rate</span>
                        <span className="text-white">
                          {formatPercentage(
                            analyticsData.overview.conversionRate,
                          )}
                        </span>
                      </div>
                      <Progress
                        value={analyticsData.overview.conversionRate}
                        className="h-2"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">House Edge</span>
                        <span className="text-white">
                          {formatPercentage(analyticsData.overview.houseEdge)}
                        </span>
                      </div>
                      <Progress
                        value={analyticsData.overview.houseEdge}
                        className="h-2"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Player Retention</span>
                        <span className="text-white">73.2%</span>
                      </div>
                      <Progress value={73.2} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
