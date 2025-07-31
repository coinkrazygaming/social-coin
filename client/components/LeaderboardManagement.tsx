import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import { useAuth } from "./AuthContext";
import {
  Trophy,
  TrendingUp,
  Users,
  DollarSign,
  Crown,
  Star,
  Zap,
  Target,
  Calendar,
  CheckCircle,
  Clock,
  Award,
  Medal,
  Gift,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Save,
  AlertTriangle,
  Activity,
} from "lucide-react";

interface LeaderboardCategory {
  id: string;
  name: string;
  description: string;
  type: "total_winnings" | "total_wagered" | "biggest_win" | "games_played" | "win_streak" | "daily_active" | "vip_points";
  isActive: boolean;
  resetPeriod: "daily" | "weekly" | "monthly" | "never";
  maxParticipants: number;
  rewards: {
    position: number;
    type: "sc" | "gc" | "vip_points" | "bonus";
    amount: number;
    description: string;
  }[];
  qualificationCriteria: {
    minLevel: number;
    minDeposit: number;
    minGamesPlayed: number;
    vipOnly: boolean;
  };
  startDate: Date;
  endDate?: Date;
  currentLeaders: LeaderboardEntry[];
  pendingRewards: PendingReward[];
}

interface LeaderboardEntry {
  id: string;
  userId: string;
  username: string;
  avatar?: string;
  position: number;
  score: number;
  previousPosition?: number;
  trend: "up" | "down" | "same" | "new";
  vipLevel: string;
  totalWagered: number;
  gamesPlayed: number;
  lastActivity: Date;
  qualified: boolean;
}

interface PendingReward {
  id: string;
  userId: string;
  username: string;
  category: string;
  position: number;
  rewardType: string;
  rewardAmount: number;
  weekEnding: Date;
  status: "pending" | "approved" | "denied" | "paid";
  requestedAt: Date;
  approvedBy?: string;
  paidAt?: Date;
  notes?: string;
}

interface LeaderboardStats {
  totalParticipants: number;
  weeklyRewardsPaid: number;
  monthlyRewardsPaid: number;
  pendingApprovals: number;
  totalSCPaid: number;
  averageScore: number;
  topCategories: {
    category: string;
    participants: number;
  }[];
}

export function LeaderboardManagement() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<LeaderboardCategory[]>([
    {
      id: "total_winnings",
      name: "Biggest Winners",
      description: "Players with the highest total winnings this week",
      type: "total_winnings",
      isActive: true,
      resetPeriod: "weekly",
      maxParticipants: 100,
      rewards: [
        { position: 1, type: "sc", amount: 5, description: "5 SC for 1st place" },
        { position: 2, type: "sc", amount: 3, description: "3 SC for 2nd place" },
        { position: 3, type: "sc", amount: 2, description: "2 SC for 3rd place" },
        { position: 4, type: "sc", amount: 1, description: "1 SC for 4th-5th place" },
        { position: 5, type: "sc", amount: 1, description: "1 SC for 4th-5th place" },
      ],
      qualificationCriteria: {
        minLevel: 5,
        minDeposit: 10,
        minGamesPlayed: 50,
        vipOnly: false,
      },
      startDate: new Date(),
      currentLeaders: [
        {
          id: "1",
          userId: "user1",
          username: "SlotMaster97",
          position: 1,
          score: 2847.50,
          previousPosition: 2,
          trend: "up",
          vipLevel: "Gold",
          totalWagered: 5420.00,
          gamesPlayed: 342,
          lastActivity: new Date(),
          qualified: true,
        },
        {
          id: "2",
          userId: "user2",
          username: "LuckySpinner",
          position: 2,
          score: 2156.75,
          previousPosition: 1,
          trend: "down",
          vipLevel: "Silver",
          totalWagered: 4890.25,
          gamesPlayed: 289,
          lastActivity: new Date(),
          qualified: true,
        },
        {
          id: "3",
          userId: "user3",
          username: "CasinoKing23",
          position: 3,
          score: 1892.30,
          previousPosition: 4,
          trend: "up",
          vipLevel: "Platinum",
          totalWagered: 6721.40,
          gamesPlayed: 456,
          lastActivity: new Date(),
          qualified: true,
        },
        {
          id: "4",
          userId: "user4",
          username: "WinStreak99",
          position: 4,
          score: 1654.80,
          trend: "new",
          vipLevel: "Bronze",
          totalWagered: 3245.60,
          gamesPlayed: 201,
          lastActivity: new Date(),
          qualified: true,
        },
        {
          id: "5",
          userId: "user5",
          username: "JackpotHunter",
          position: 5,
          score: 1423.95,
          previousPosition: 3,
          trend: "down",
          vipLevel: "Diamond",
          totalWagered: 8934.20,
          gamesPlayed: 612,
          lastActivity: new Date(),
          qualified: true,
        },
      ],
      pendingRewards: [
        {
          id: "reward1",
          userId: "user1",
          username: "SlotMaster97",
          category: "Biggest Winners",
          position: 1,
          rewardType: "SC",
          rewardAmount: 5,
          weekEnding: new Date(Date.now() - 86400000),
          status: "pending",
          requestedAt: new Date(),
        },
        {
          id: "reward2",
          userId: "user2",
          username: "LuckySpinner",
          category: "Biggest Winners",
          position: 2,
          rewardType: "SC",
          rewardAmount: 3,
          weekEnding: new Date(Date.now() - 86400000),
          status: "pending",
          requestedAt: new Date(),
        },
      ],
    },
    {
      id: "total_wagered",
      name: "High Rollers",
      description: "Players who wagered the most this week",
      type: "total_wagered",
      isActive: true,
      resetPeriod: "weekly",
      maxParticipants: 50,
      rewards: [
        { position: 1, type: "sc", amount: 5, description: "5 SC for 1st place" },
        { position: 2, type: "sc", amount: 3, description: "3 SC for 2nd place" },
        { position: 3, type: "sc", amount: 2, description: "2 SC for 3rd place" },
      ],
      qualificationCriteria: {
        minLevel: 10,
        minDeposit: 25,
        minGamesPlayed: 100,
        vipOnly: false,
      },
      startDate: new Date(),
      currentLeaders: [
        {
          id: "6",
          userId: "user6",
          username: "HighRoller88",
          position: 1,
          score: 15420.75,
          trend: "same",
          vipLevel: "Diamond",
          totalWagered: 15420.75,
          gamesPlayed: 890,
          lastActivity: new Date(),
          qualified: true,
        },
        {
          id: "7",
          userId: "user7",
          username: "BigSpender",
          position: 2,
          score: 12856.30,
          previousPosition: 3,
          trend: "up",
          vipLevel: "Platinum",
          totalWagered: 12856.30,
          gamesPlayed: 654,
          lastActivity: new Date(),
          qualified: true,
        },
        {
          id: "8",
          userId: "user8",
          username: "VIPPlayer1",
          position: 3,
          score: 11234.90,
          previousPosition: 2,
          trend: "down",
          vipLevel: "Diamond",
          totalWagered: 11234.90,
          gamesPlayed: 723,
          lastActivity: new Date(),
          qualified: true,
        },
      ],
      pendingRewards: [],
    },
    {
      id: "biggest_win",
      name: "Lucky Streaks",
      description: "Players with the biggest single win this week",
      type: "biggest_win",
      isActive: true,
      resetPeriod: "weekly",
      maxParticipants: 25,
      rewards: [
        { position: 1, type: "sc", amount: 5, description: "5 SC for 1st place" },
        { position: 2, type: "sc", amount: 3, description: "3 SC for 2nd place" },
        { position: 3, type: "sc", amount: 2, description: "2 SC for 3rd place" },
      ],
      qualificationCriteria: {
        minLevel: 3,
        minDeposit: 5,
        minGamesPlayed: 20,
        vipOnly: false,
      },
      startDate: new Date(),
      currentLeaders: [
        {
          id: "9",
          userId: "user9",
          username: "MegaWinner",
          position: 1,
          score: 8945.60,
          trend: "new",
          vipLevel: "Gold",
          totalWagered: 2456.80,
          gamesPlayed: 156,
          lastActivity: new Date(),
          qualified: true,
        },
        {
          id: "10",
          userId: "user10",
          username: "JackpotLucky",
          position: 2,
          score: 6543.25,
          previousPosition: 1,
          trend: "down",
          vipLevel: "Silver",
          totalWagered: 1890.45,
          gamesPlayed: 98,
          lastActivity: new Date(),
          qualified: true,
        },
        {
          id: "11",
          userId: "user11",
          username: "BigWin777",
          position: 3,
          score: 4567.89,
          trend: "new",
          vipLevel: "Bronze",
          totalWagered: 1245.60,
          gamesPlayed: 76,
          lastActivity: new Date(),
          qualified: true,
        },
      ],
      pendingRewards: [],
    },
    {
      id: "games_played",
      name: "Most Active",
      description: "Players who played the most games this week",
      type: "games_played",
      isActive: true,
      resetPeriod: "weekly",
      maxParticipants: 75,
      rewards: [
        { position: 1, type: "sc", amount: 5, description: "5 SC for 1st place" },
        { position: 2, type: "sc", amount: 3, description: "3 SC for 2nd place" },
        { position: 3, type: "sc", amount: 2, description: "2 SC for 3rd place" },
      ],
      qualificationCriteria: {
        minLevel: 1,
        minDeposit: 1,
        minGamesPlayed: 10,
        vipOnly: false,
      },
      startDate: new Date(),
      currentLeaders: [
        {
          id: "12",
          userId: "user12",
          username: "GameAddict99",
          position: 1,
          score: 1247,
          previousPosition: 2,
          trend: "up",
          vipLevel: "Silver",
          totalWagered: 3456.78,
          gamesPlayed: 1247,
          lastActivity: new Date(),
          qualified: true,
        },
        {
          id: "13",
          userId: "user13",
          username: "PlayAllDay",
          position: 2,
          score: 1156,
          previousPosition: 1,
          trend: "down",
          vipLevel: "Gold",
          totalWagered: 4567.89,
          gamesPlayed: 1156,
          lastActivity: new Date(),
          qualified: true,
        },
        {
          id: "14",
          userId: "user14",
          username: "SpinMaster",
          position: 3,
          score: 1089,
          trend: "same",
          vipLevel: "Bronze",
          totalWagered: 2345.67,
          gamesPlayed: 1089,
          lastActivity: new Date(),
          qualified: true,
        },
      ],
      pendingRewards: [],
    },
  ]);

  const [stats, setStats] = useState<LeaderboardStats>({
    totalParticipants: 1247,
    weeklyRewardsPaid: 45.5,
    monthlyRewardsPaid: 189.75,
    pendingApprovals: 12,
    totalSCPaid: 2456.80,
    averageScore: 1567.89,
    topCategories: [
      { category: "Biggest Winners", participants: 342 },
      { category: "High Rollers", participants: 198 },
      { category: "Most Active", participants: 267 },
      { category: "Lucky Streaks", participants: 156 },
    ],
  });

  const [selectedCategory, setSelectedCategory] = useState<LeaderboardCategory | null>(null);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [isProcessingRewards, setIsProcessingRewards] = useState(false);

  const handleApproveReward = async (rewardId: string, approved: boolean, notes?: string) => {
    setIsProcessingRewards(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setCategories(prev => 
      prev.map(category => ({
        ...category,
        pendingRewards: category.pendingRewards.map(reward =>
          reward.id === rewardId
            ? {
                ...reward,
                status: approved ? "approved" : "denied",
                approvedBy: user?.username || "admin",
                notes,
                paidAt: approved ? new Date() : undefined,
              }
            : reward
        ),
      }))
    );
    
    if (approved) {
      setStats(prev => ({
        ...prev,
        pendingApprovals: prev.pendingApprovals - 1,
        weeklyRewardsPaid: prev.weeklyRewardsPaid + 5, // Assuming 5 SC reward
      }));
    }
    
    setIsProcessingRewards(false);
  };

  const handleResetLeaderboard = async (categoryId: string) => {
    if (!confirm("Are you sure you want to reset this leaderboard? This action cannot be undone.")) {
      return;
    }

    setCategories(prev =>
      prev.map(category =>
        category.id === categoryId
          ? {
              ...category,
              currentLeaders: [],
              startDate: new Date(),
            }
          : category
      )
    );
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "down":
        return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
      case "new":
        return <Star className="w-4 h-4 text-yellow-500" />;
      default:
        return <Target className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-orange-500" />;
      default:
        return <Crown className="w-4 h-4 text-purple-400" />;
    }
  };

  const getVIPBadgeColor = (vipLevel: string) => {
    switch (vipLevel.toLowerCase()) {
      case "diamond":
        return "bg-blue-600";
      case "platinum":
        return "bg-purple-600";
      case "gold":
        return "bg-yellow-600";
      case "silver":
        return "bg-gray-600";
      case "bronze":
        return "bg-orange-600";
      default:
        return "bg-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-500">
              {stats.totalParticipants.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">Total Participants</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-500">
              {stats.weeklyRewardsPaid} SC
            </div>
            <div className="text-sm text-gray-400">Weekly Rewards Paid</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-500">
              {stats.pendingApprovals}
            </div>
            <div className="text-sm text-gray-400">Pending Approvals</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <Trophy className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-500">
              {stats.totalSCPaid} SC
            </div>
            <div className="text-sm text-gray-400">Total SC Paid</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="rewards">Pending Rewards</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {categories.map((category) => (
              <Card key={category.id} className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                        {category.name}
                        <Badge variant={category.isActive ? "default" : "secondary"}>
                          {category.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </CardTitle>
                      <p className="text-gray-400 text-sm">{category.description}</p>
                    </div>
                    <Switch
                      checked={category.isActive}
                      onCheckedChange={(checked) => {
                        setCategories(prev =>
                          prev.map(c => 
                            c.id === category.id ? { ...c, isActive: checked } : c
                          )
                        );
                      }}
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-400">Reset Period</div>
                      <div className="text-white font-medium capitalize">{category.resetPeriod}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Participants</div>
                      <div className="text-white font-medium">{category.currentLeaders.length}/{category.maxParticipants}</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-gray-400 text-sm mb-2">Top 3 Leaders</div>
                    <div className="space-y-2">
                      {category.currentLeaders.slice(0, 3).map((leader) => (
                        <div key={leader.id} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              {getPositionIcon(leader.position)}
                              <span className="text-white font-bold">#{leader.position}</span>
                            </div>
                            <div>
                              <div className="text-white font-medium">{leader.username}</div>
                              <Badge className={`text-xs ${getVIPBadgeColor(leader.vipLevel)}`}>
                                {leader.vipLevel}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-white font-bold">{leader.score.toLocaleString()}</div>
                            <div className="flex items-center gap-1">
                              {getTrendIcon(leader.trend)}
                              <span className="text-xs text-gray-400">
                                {leader.trend === "new" ? "NEW" : leader.previousPosition ? `#${leader.previousPosition}` : ""}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-gray-400 text-sm mb-2">Rewards (Top 5)</div>
                    <div className="space-y-1">
                      {category.rewards.map((reward, index) => (
                        <div key={index} className="flex items-center justify-between text-xs">
                          <span className="text-gray-400">#{reward.position}</span>
                          <Badge className="bg-green-600">
                            {reward.amount} {reward.type.toUpperCase()}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedCategory(category)}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Manage
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleResetLeaderboard(category.id)}
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
                  </div>

                  {category.pendingRewards.length > 0 && (
                    <div className="p-2 bg-yellow-900 border border-yellow-700 rounded">
                      <div className="flex items-center gap-2 text-yellow-300 text-sm">
                        <AlertTriangle className="w-4 h-4" />
                        {category.pendingRewards.length} pending reward{category.pendingRewards.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Gift className="w-5 h-5 text-green-500" />
                Pending Reward Approvals
              </CardTitle>
            </CardHeader>
            <CardContent>
              {categories.some(c => c.pendingRewards.length > 0) ? (
                <div className="space-y-4">
                  {categories.flatMap(category => 
                    category.pendingRewards.filter(r => r.status === "pending")
                  ).map((reward) => (
                    <div key={reward.id} className="p-4 bg-gray-700 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {getPositionIcon(reward.position)}
                          <div>
                            <div className="text-white font-medium">{reward.username}</div>
                            <div className="text-gray-400 text-sm">
                              {reward.category} - #{reward.position} place
                            </div>
                            <div className="text-gray-500 text-xs">
                              Week ending: {reward.weekEnding.toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-green-600 text-white font-bold">
                            {reward.rewardAmount} {reward.rewardType.toUpperCase()}
                          </Badge>
                          <div className="text-gray-400 text-xs mt-1">
                            Requested: {reward.requestedAt.toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleApproveReward(reward.id, true)}
                          disabled={isProcessingRewards}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve & Pay
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                          onClick={() => {
                            const reason = prompt("Denial reason (required):");
                            if (reason) handleApproveReward(reward.id, false, reason);
                          }}
                          disabled={isProcessingRewards}
                        >
                          Deny
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Gift className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No pending reward approvals.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Category Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.topCategories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="text-white font-medium">{category.category}</div>
                        <div className="text-sm text-gray-400">
                          {category.participants} participants
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold">
                        {((category.participants / stats.totalParticipants) * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-400">of total</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Reward Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">
                    {stats.weeklyRewardsPaid} SC
                  </div>
                  <div className="text-sm text-gray-400">This Week</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">
                    {stats.monthlyRewardsPaid} SC
                  </div>
                  <div className="text-sm text-gray-400">This Month</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-500">
                    {stats.totalSCPaid} SC
                  </div>
                  <div className="text-sm text-gray-400">All Time</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Global Leaderboard Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-white">Auto-approve rewards under</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input type="number" defaultValue="5" className="flex-1" />
                      <Select defaultValue="sc">
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sc">SC</SelectItem>
                          <SelectItem value="gc">GC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-white">Enable automatic rewards</Label>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-white">Weekly reset notifications</Label>
                    <Switch defaultChecked />
                  </div>

                  <div>
                    <Label className="text-white">Maximum participants per category</Label>
                    <Input type="number" defaultValue="100" className="mt-1" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-white">Default reward amount (1st place)</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input type="number" defaultValue="5" className="flex-1" />
                      <Select defaultValue="sc">
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sc">SC</SelectItem>
                          <SelectItem value="gc">GC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label className="text-white">Minimum qualification level</Label>
                    <Input type="number" defaultValue="1" className="mt-1" />
                  </div>

                  <div>
                    <Label className="text-white">Minimum games played</Label>
                    <Input type="number" defaultValue="10" className="mt-1" />
                  </div>

                  <div>
                    <Label className="text-white">Reset time (weekly)</Label>
                    <Select defaultValue="sunday">
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sunday">Sunday 00:00 UTC</SelectItem>
                        <SelectItem value="monday">Monday 00:00 UTC</SelectItem>
                        <SelectItem value="custom">Custom Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Button className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
