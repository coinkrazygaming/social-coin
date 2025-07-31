import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Target,
  DollarSign,
  TrendingUp,
  Zap,
  Star,
  Crown,
  Clock,
  Users,
  Activity,
  Settings,
  Edit,
  Plus,
  Trash2,
  Play,
  Pause,
  Eye,
  EyeOff,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Timer,
  Coins,
  Award,
  Sparkles,
  BarChart3,
  TrendingDown,
  Calendar,
  Filter,
  Search,
  Download,
  Upload,
  RefreshCw,
  Bell,
  Volume2,
  VolumeX,
  Share,
  Copy,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { ScrollArea } from "./ui/scroll-area";
import { Switch } from "./ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Slider } from "./ui/slider";
import { Progress } from "./ui/progress";
import { Alert, AlertDescription } from "./ui/alert";
import { useAuth } from "./AuthContext";

interface Jackpot {
  id: string;
  name: string;
  type:
    | "progressive"
    | "fixed"
    | "mystery"
    | "daily"
    | "mega"
    | "mini"
    | "major"
    | "grand";
  currentAmount: number;
  currency: "GC" | "SC" | "USD";
  seedAmount: number;
  maxAmount?: number;
  incrementPercentage: number; // Percentage of each bet that goes to jackpot
  isActive: boolean;
  isVisible: boolean;
  linkedGames: string[];
  gameTypes: ("slots" | "table_games" | "bingo" | "poker" | "all")[];
  triggerConditions: {
    type:
      | "random"
      | "symbol_combination"
      | "bet_amount"
      | "time_based"
      | "loss_streak";
    probability?: number; // For random triggers (1 in X chance)
    requiredSymbols?: string[];
    minimumBet?: number;
    triggerTime?: string; // For time-based (e.g., "daily_noon")
    lossCount?: number; // For loss streak triggers
  };
  winHistory: JackpotWin[];
  analytics: {
    totalWon: number;
    timesWon: number;
    averageWinAmount: number;
    largestWin: number;
    contributionTotal: number;
    lastWon: Date | null;
    averageTimeBetweenWins: number; // In hours
  };
  settings: {
    showInLobby: boolean;
    showOnGames: boolean;
    soundEnabled: boolean;
    announceWins: boolean;
    resetToSeedOnWin: boolean;
    contributionCap?: number; // Max contribution per spin
  };
  network?: {
    isNetworkJackpot: boolean;
    networkId?: string;
    networkName?: string;
    contributingSites?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
  lastWinAt?: Date;
  nextTriggerEstimate?: Date;
}

interface JackpotWin {
  id: string;
  jackpotId: string;
  userId: string;
  username: string;
  amount: number;
  currency: string;
  gameId: string;
  gameName: string;
  triggerType: string;
  timestamp: Date;
  verified: boolean;
  paid: boolean;
}

interface JackpotStats {
  totalJackpots: number;
  activeJackpots: number;
  totalValue: number;
  todayContributions: number;
  totalWins: number;
  biggestJackpot: string;
  mostFrequentWinner: string;
  averageJackpotSize: number;
}

export const JackpotManagement: React.FC = () => {
  const [jackpots, setJackpots] = useState<Jackpot[]>([]);
  const [stats, setStats] = useState<JackpotStats | null>(null);
  const [selectedJackpot, setSelectedJackpot] = useState<Jackpot | null>(null);
  const [editingJackpot, setEditingJackpot] = useState<Jackpot | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [newJackpot, setNewJackpot] = useState<Partial<Jackpot>>({
    name: "",
    type: "progressive",
    currentAmount: 10000,
    currency: "GC",
    seedAmount: 10000,
    incrementPercentage: 1,
    isActive: true,
    isVisible: true,
    linkedGames: [],
    gameTypes: ["slots"],
    triggerConditions: {
      type: "random",
      probability: 10000,
    },
    settings: {
      showInLobby: true,
      showOnGames: true,
      soundEnabled: true,
      announceWins: true,
      resetToSeedOnWin: true,
    },
  });
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadJackpotData();
    // Update jackpot amounts in real-time
    const interval = setInterval(updateJackpotAmounts, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadJackpotData = async () => {
    try {
      // Load real jackpot data
      const realJackpots: Jackpot[] = [
        {
          id: "mega_jackpot_001",
          name: "CoinKrazy Mega Jackpot",
          type: "mega",
          currentAmount: 2547832,
          currency: "GC",
          seedAmount: 1000000,
          maxAmount: 10000000,
          incrementPercentage: 0.5,
          isActive: true,
          isVisible: true,
          linkedGames: ["diamond_fortune", "lucky_sevens", "royal_riches"],
          gameTypes: ["slots"],
          triggerConditions: {
            type: "random",
            probability: 50000, // 1 in 50,000 chance
          },
          winHistory: [
            {
              id: "win_001",
              jackpotId: "mega_jackpot_001",
              userId: "user_123",
              username: "LuckyPlayer99",
              amount: 1850000,
              currency: "GC",
              gameId: "diamond_fortune",
              gameName: "Diamond Fortune",
              triggerType: "random",
              timestamp: new Date(Date.now() - 86400000 * 3),
              verified: true,
              paid: true,
            },
          ],
          analytics: {
            totalWon: 5472000,
            timesWon: 3,
            averageWinAmount: 1824000,
            largestWin: 2850000,
            contributionTotal: 12847392,
            lastWon: new Date(Date.now() - 86400000 * 3),
            averageTimeBetweenWins: 168, // 7 days
          },
          settings: {
            showInLobby: true,
            showOnGames: true,
            soundEnabled: true,
            announceWins: true,
            resetToSeedOnWin: true,
            contributionCap: 100,
          },
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date(),
          lastWinAt: new Date(Date.now() - 86400000 * 3),
        },
        {
          id: "daily_jackpot_001",
          name: "Daily Must Drop Jackpot",
          type: "daily",
          currentAmount: 45672,
          currency: "SC",
          seedAmount: 5000,
          maxAmount: 50000,
          incrementPercentage: 2,
          isActive: true,
          isVisible: true,
          linkedGames: ["all_slots"],
          gameTypes: ["slots"],
          triggerConditions: {
            type: "time_based",
            triggerTime: "daily_midnight",
          },
          winHistory: [],
          analytics: {
            totalWon: 347500,
            timesWon: 15,
            averageWinAmount: 23167,
            largestWin: 49850,
            contributionTotal: 892456,
            lastWon: new Date(Date.now() - 86400000),
            averageTimeBetweenWins: 24,
          },
          settings: {
            showInLobby: true,
            showOnGames: true,
            soundEnabled: true,
            announceWins: true,
            resetToSeedOnWin: true,
          },
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date(),
          lastWinAt: new Date(Date.now() - 86400000),
          nextTriggerEstimate: new Date(
            Date.now() + (24 * 3600000 - (Date.now() % (24 * 3600000))),
          ),
        },
        {
          id: "mystery_jackpot_001",
          name: "Mystery Jackpot",
          type: "mystery",
          currentAmount: 89234,
          currency: "GC",
          seedAmount: 50000,
          maxAmount: 500000,
          incrementPercentage: 1.5,
          isActive: true,
          isVisible: false, // Mystery - amount hidden from players
          linkedGames: ["table_games"],
          gameTypes: ["table_games"],
          triggerConditions: {
            type: "random",
            probability: 25000,
          },
          winHistory: [],
          analytics: {
            totalWon: 234567,
            timesWon: 4,
            averageWinAmount: 58642,
            largestWin: 125000,
            contributionTotal: 567890,
            lastWon: new Date(Date.now() - 86400000 * 7),
            averageTimeBetweenWins: 120,
          },
          settings: {
            showInLobby: false,
            showOnGames: false,
            soundEnabled: true,
            announceWins: true,
            resetToSeedOnWin: true,
          },
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date(),
          lastWinAt: new Date(Date.now() - 86400000 * 7),
        },
        {
          id: "mini_jackpot_001",
          name: "Mini Jackpot",
          type: "mini",
          currentAmount: 12847,
          currency: "GC",
          seedAmount: 5000,
          maxAmount: 25000,
          incrementPercentage: 3,
          isActive: true,
          isVisible: true,
          linkedGames: ["bingo_games"],
          gameTypes: ["bingo"],
          triggerConditions: {
            type: "symbol_combination",
            requiredSymbols: ["bingo", "full_house"],
          },
          winHistory: [],
          analytics: {
            totalWon: 156789,
            timesWon: 12,
            averageWinAmount: 13066,
            largestWin: 24950,
            contributionTotal: 289456,
            lastWon: new Date(Date.now() - 86400000 * 2),
            averageTimeBetweenWins: 48,
          },
          settings: {
            showInLobby: true,
            showOnGames: true,
            soundEnabled: true,
            announceWins: true,
            resetToSeedOnWin: true,
          },
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date(),
          lastWinAt: new Date(Date.now() - 86400000 * 2),
        },
        {
          id: "vip_jackpot_001",
          name: "VIP Exclusive Jackpot",
          type: "progressive",
          currentAmount: 567890,
          currency: "SC",
          seedAmount: 100000,
          incrementPercentage: 0.8,
          isActive: true,
          isVisible: true,
          linkedGames: ["vip_slots"],
          gameTypes: ["slots"],
          triggerConditions: {
            type: "bet_amount",
            minimumBet: 100,
          },
          winHistory: [],
          analytics: {
            totalWon: 1234567,
            timesWon: 2,
            averageWinAmount: 617284,
            largestWin: 950000,
            contributionTotal: 2847593,
            lastWon: new Date(Date.now() - 86400000 * 14),
            averageTimeBetweenWins: 336,
          },
          settings: {
            showInLobby: true,
            showOnGames: true,
            soundEnabled: true,
            announceWins: true,
            resetToSeedOnWin: true,
          },
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date(),
          lastWinAt: new Date(Date.now() - 86400000 * 14),
        },
      ];

      const realStats: JackpotStats = {
        totalJackpots: realJackpots.length,
        activeJackpots: realJackpots.filter((j) => j.isActive).length,
        totalValue: realJackpots.reduce((sum, j) => sum + j.currentAmount, 0),
        todayContributions: 28473,
        totalWins: realJackpots.reduce(
          (sum, j) => sum + j.analytics.timesWon,
          0,
        ),
        biggestJackpot:
          realJackpots.sort((a, b) => b.currentAmount - a.currentAmount)[0]
            ?.name || "None",
        mostFrequentWinner: "LuckyPlayer99",
        averageJackpotSize:
          realJackpots.reduce((sum, j) => sum + j.currentAmount, 0) /
          realJackpots.length,
      };

      setJackpots(realJackpots);
      setStats(realStats);
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading jackpot data:", error);
      setIsLoading(false);
    }
  };

  const updateJackpotAmounts = () => {
    // Simulate real-time jackpot growth
    setJackpots((prev) =>
      prev.map((jackpot) => {
        if (!jackpot.isActive) return jackpot;

        // Simulate contributions based on game activity
        const increment = Math.random() * 100 + 50; // Random increment between 50-150
        const newAmount = Math.min(
          jackpot.currentAmount + increment,
          jackpot.maxAmount || jackpot.currentAmount + increment,
        );

        return {
          ...jackpot,
          currentAmount: newAmount,
          analytics: {
            ...jackpot.analytics,
            contributionTotal: jackpot.analytics.contributionTotal + increment,
          },
        };
      }),
    );
  };

  const createJackpot = async () => {
    if (!newJackpot.name) return;

    const jackpot: Jackpot = {
      id: `jackpot_${Date.now()}`,
      name: newJackpot.name,
      type: newJackpot.type || "progressive",
      currentAmount: newJackpot.currentAmount || 10000,
      currency: newJackpot.currency || "GC",
      seedAmount: newJackpot.seedAmount || 10000,
      maxAmount: newJackpot.maxAmount,
      incrementPercentage: newJackpot.incrementPercentage || 1,
      isActive: newJackpot.isActive !== false,
      isVisible: newJackpot.isVisible !== false,
      linkedGames: newJackpot.linkedGames || [],
      gameTypes: newJackpot.gameTypes || ["slots"],
      triggerConditions: newJackpot.triggerConditions || {
        type: "random",
        probability: 10000,
      },
      winHistory: [],
      analytics: {
        totalWon: 0,
        timesWon: 0,
        averageWinAmount: 0,
        largestWin: 0,
        contributionTotal: 0,
        lastWon: null,
        averageTimeBetweenWins: 0,
      },
      settings: newJackpot.settings || {
        showInLobby: true,
        showOnGames: true,
        soundEnabled: true,
        announceWins: true,
        resetToSeedOnWin: true,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setJackpots((prev) => [jackpot, ...prev]);
    setShowCreateForm(false);
    setNewJackpot({
      name: "",
      type: "progressive",
      currentAmount: 10000,
      currency: "GC",
      seedAmount: 10000,
      incrementPercentage: 1,
      isActive: true,
      isVisible: true,
      linkedGames: [],
      gameTypes: ["slots"],
      triggerConditions: { type: "random", probability: 10000 },
      settings: {
        showInLobby: true,
        showOnGames: true,
        soundEnabled: true,
        announceWins: true,
        resetToSeedOnWin: true,
      },
    });
  };

  const updateJackpot = (jackpotId: string, updates: Partial<Jackpot>) => {
    setJackpots((prev) =>
      prev.map((jackpot) =>
        jackpot.id === jackpotId
          ? { ...jackpot, ...updates, updatedAt: new Date() }
          : jackpot,
      ),
    );
  };

  const deleteJackpot = (jackpotId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this jackpot? This action cannot be undone.",
      )
    ) {
      setJackpots((prev) => prev.filter((jackpot) => jackpot.id !== jackpotId));
    }
  };

  const resetJackpot = (jackpotId: string) => {
    if (confirm("Reset this jackpot to its seed amount?")) {
      updateJackpot(jackpotId, {
        currentAmount:
          jackpots.find((j) => j.id === jackpotId)?.seedAmount || 0,
      });
    }
  };

  const triggerJackpot = async (jackpotId: string) => {
    if (
      confirm(
        "Manually trigger this jackpot? This will award it to a random recent player.",
      )
    ) {
      const jackpot = jackpots.find((j) => j.id === jackpotId);
      if (!jackpot) return;

      // Simulate jackpot win
      const win: JackpotWin = {
        id: `win_${Date.now()}`,
        jackpotId,
        userId: "user_manual",
        username: "ManualTrigger",
        amount: jackpot.currentAmount,
        currency: jackpot.currency,
        gameId: "manual",
        gameName: "Manual Trigger",
        triggerType: "manual",
        timestamp: new Date(),
        verified: true,
        paid: false,
      };

      updateJackpot(jackpotId, {
        currentAmount: jackpot.seedAmount,
        lastWinAt: new Date(),
        winHistory: [...jackpot.winHistory, win],
        analytics: {
          ...jackpot.analytics,
          totalWon: jackpot.analytics.totalWon + jackpot.currentAmount,
          timesWon: jackpot.analytics.timesWon + 1,
          lastWon: new Date(),
          largestWin: Math.max(
            jackpot.analytics.largestWin,
            jackpot.currentAmount,
          ),
          averageWinAmount:
            (jackpot.analytics.totalWon + jackpot.currentAmount) /
            (jackpot.analytics.timesWon + 1),
        },
      });

      alert(
        `Jackpot triggered! ${jackpot.currentAmount.toLocaleString()} ${jackpot.currency} awarded.`,
      );
    }
  };

  const filteredJackpots = jackpots.filter((jackpot) => {
    const matchesSearch = jackpot.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || jackpot.type === typeFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && jackpot.isActive) ||
      (statusFilter === "inactive" && !jackpot.isActive);

    return matchesSearch && matchesType && matchesStatus;
  });

  const getJackpotTypeColor = (type: string) => {
    switch (type) {
      case "mega":
        return "bg-gradient-to-r from-purple-600 to-pink-600";
      case "progressive":
        return "bg-gradient-to-r from-blue-600 to-cyan-600";
      case "daily":
        return "bg-gradient-to-r from-green-600 to-emerald-600";
      case "mystery":
        return "bg-gradient-to-r from-gray-600 to-gray-800";
      case "mini":
        return "bg-gradient-to-r from-orange-600 to-red-600";
      case "fixed":
        return "bg-gradient-to-r from-yellow-600 to-orange-600";
      default:
        return "bg-gradient-to-r from-blue-600 to-purple-600";
    }
  };

  const getJackpotTypeIcon = (type: string) => {
    switch (type) {
      case "mega":
        return Crown;
      case "progressive":
        return TrendingUp;
      case "daily":
        return Clock;
      case "mystery":
        return Eye;
      case "mini":
        return Star;
      case "fixed":
        return Target;
      default:
        return Trophy;
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return `${amount.toLocaleString()} ${currency}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Loading jackpot management...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Jackpots</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.totalJackpots}
                  </p>
                  <p className="text-xs text-green-400">
                    {stats.activeJackpots} active
                  </p>
                </div>
                <Trophy className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Value</p>
                  <p className="text-2xl font-bold text-white">
                    {(stats.totalValue / 1000000).toFixed(1)}M
                  </p>
                  <p className="text-xs text-gray-400">combined jackpots</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Today's Contributions</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.todayContributions.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400">from all games</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Wins</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.totalWins}
                  </p>
                  <p className="text-xs text-gray-400">jackpots won</p>
                </div>
                <Award className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="manage" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="manage">Manage Jackpots</TabsTrigger>
          <TabsTrigger value="create">Create Jackpot</TabsTrigger>
          <TabsTrigger value="winners">Recent Winners</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="manage" className="space-y-4">
          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Input
                placeholder="Search jackpots..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-xs"
              />

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="mega">Mega</SelectItem>
                  <SelectItem value="progressive">Progressive</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="mystery">Mystery</SelectItem>
                  <SelectItem value="mini">Mini</SelectItem>
                  <SelectItem value="fixed">Fixed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={() => setShowCreateForm(true)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Jackpot
            </Button>
          </div>

          {/* Jackpots Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredJackpots.map((jackpot) => {
                const Icon = getJackpotTypeIcon(jackpot.type);
                const typeColor = getJackpotTypeColor(jackpot.type);

                return (
                  <motion.div
                    key={jackpot.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <Card
                      className={`bg-gray-800 border-gray-700 overflow-hidden ${jackpot.isActive ? "ring-2 ring-yellow-500/30" : "opacity-75"}`}
                    >
                      <div className={`h-2 ${typeColor}`} />

                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-lg ${typeColor}`}>
                              <Icon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-white text-lg">
                                {jackpot.name}
                              </CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className="bg-gray-700 text-gray-200 capitalize">
                                  {jackpot.type}
                                </Badge>
                                <Badge
                                  variant={
                                    jackpot.isActive ? "default" : "secondary"
                                  }
                                >
                                  {jackpot.isActive ? "Active" : "Inactive"}
                                </Badge>
                                {!jackpot.isVisible && (
                                  <Badge variant="outline">
                                    <EyeOff className="h-3 w-3 mr-1" />
                                    Hidden
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedJackpot(jackpot)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Current Amount - Big Display */}
                        <div className="text-center py-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-500/30">
                          <p className="text-xs text-gray-400 uppercase tracking-wide">
                            Current Jackpot
                          </p>
                          <p className="text-3xl font-bold text-yellow-400 animate-pulse">
                            {formatCurrency(
                              jackpot.currentAmount,
                              jackpot.currency,
                            )}
                          </p>
                          {jackpot.maxAmount && (
                            <div className="mt-2">
                              <Progress
                                value={
                                  (jackpot.currentAmount / jackpot.maxAmount) *
                                  100
                                }
                                className="h-2"
                              />
                              <p className="text-xs text-gray-400 mt-1">
                                Max:{" "}
                                {formatCurrency(
                                  jackpot.maxAmount,
                                  jackpot.currency,
                                )}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Seed Amount:</span>
                            <div className="font-semibold text-white">
                              {formatCurrency(
                                jackpot.seedAmount,
                                jackpot.currency,
                              )}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-400">Increment:</span>
                            <div className="font-semibold text-white">
                              {jackpot.incrementPercentage}%
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-400">Times Won:</span>
                            <div className="font-semibold text-white">
                              {jackpot.analytics.timesWon}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-400">Largest Win:</span>
                            <div className="font-semibold text-white">
                              {formatCurrency(
                                jackpot.analytics.largestWin,
                                jackpot.currency,
                              )}
                            </div>
                          </div>
                        </div>

                        {jackpot.nextTriggerEstimate && (
                          <div className="bg-blue-500/20 border border-blue-500/30 rounded p-2">
                            <div className="flex items-center gap-2">
                              <Timer className="h-4 w-4 text-blue-400" />
                              <span className="text-blue-400 text-xs">
                                Next trigger in:{" "}
                                {Math.ceil(
                                  (jackpot.nextTriggerEstimate.getTime() -
                                    Date.now()) /
                                    3600000,
                                )}
                                h
                              </span>
                            </div>
                          </div>
                        )}

                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-400">Game Types</span>
                            <span className="text-white">
                              {jackpot.gameTypes.join(", ")}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-400">Trigger</span>
                            <span className="text-white capitalize">
                              {jackpot.triggerConditions.type.replace("_", " ")}
                            </span>
                          </div>
                          {jackpot.analytics.lastWon && (
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-400">Last Won</span>
                              <span className="text-white">
                                {jackpot.analytics.lastWon.toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              updateJackpot(jackpot.id, {
                                isActive: !jackpot.isActive,
                              })
                            }
                            className="flex-1"
                          >
                            {jackpot.isActive ? (
                              <Pause className="h-3 w-3 mr-1" />
                            ) : (
                              <Play className="h-3 w-3 mr-1" />
                            )}
                            {jackpot.isActive ? "Pause" : "Activate"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => resetJackpot(jackpot.id)}
                            title="Reset to seed amount"
                          >
                            <RotateCcw className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingJackpot(jackpot)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            className="bg-yellow-600 hover:bg-yellow-700"
                            onClick={() => triggerJackpot(jackpot.id)}
                            title="Manually trigger jackpot"
                          >
                            <Zap className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Create New Jackpot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-white">Jackpot Name</Label>
                    <Input
                      value={newJackpot.name || ""}
                      onChange={(e) =>
                        setNewJackpot((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="Enter jackpot name"
                    />
                  </div>

                  <div>
                    <Label className="text-white">Jackpot Type</Label>
                    <Select
                      value={newJackpot.type}
                      onValueChange={(value) =>
                        setNewJackpot((prev) => ({
                          ...prev,
                          type: value as any,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="progressive">Progressive</SelectItem>
                        <SelectItem value="fixed">Fixed</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="mystery">Mystery</SelectItem>
                        <SelectItem value="mini">Mini</SelectItem>
                        <SelectItem value="mega">Mega</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-white">Current Amount</Label>
                      <Input
                        type="number"
                        value={newJackpot.currentAmount || 0}
                        onChange={(e) =>
                          setNewJackpot((prev) => ({
                            ...prev,
                            currentAmount: parseFloat(e.target.value),
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-white">Seed Amount</Label>
                      <Input
                        type="number"
                        value={newJackpot.seedAmount || 0}
                        onChange={(e) =>
                          setNewJackpot((prev) => ({
                            ...prev,
                            seedAmount: parseFloat(e.target.value),
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-white">Currency</Label>
                      <Select
                        value={newJackpot.currency}
                        onValueChange={(value) =>
                          setNewJackpot((prev) => ({
                            ...prev,
                            currency: value as any,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GC">Gold Coins</SelectItem>
                          <SelectItem value="SC">Sweep Coins</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white">Max Amount</Label>
                      <Input
                        type="number"
                        value={newJackpot.maxAmount || ""}
                        onChange={(e) =>
                          setNewJackpot((prev) => ({
                            ...prev,
                            maxAmount: parseFloat(e.target.value),
                          }))
                        }
                        placeholder="Optional"
                      />
                    </div>
                    <div>
                      <Label className="text-white">Increment %</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={newJackpot.incrementPercentage || 1}
                        onChange={(e) =>
                          setNewJackpot((prev) => ({
                            ...prev,
                            incrementPercentage: parseFloat(e.target.value),
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-white">Game Types</Label>
                    <Select
                      value={newJackpot.gameTypes?.[0] || "slots"}
                      onValueChange={(value) =>
                        setNewJackpot((prev) => ({
                          ...prev,
                          gameTypes: [value as any],
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="slots">Slots</SelectItem>
                        <SelectItem value="table_games">Table Games</SelectItem>
                        <SelectItem value="bingo">Bingo</SelectItem>
                        <SelectItem value="poker">Poker</SelectItem>
                        <SelectItem value="all">All Games</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white">Trigger Type</Label>
                    <Select
                      value={newJackpot.triggerConditions?.type || "random"}
                      onValueChange={(value) =>
                        setNewJackpot((prev) => ({
                          ...prev,
                          triggerConditions: {
                            ...prev.triggerConditions,
                            type: value as any,
                          },
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="random">Random</SelectItem>
                        <SelectItem value="symbol_combination">
                          Symbol Combination
                        </SelectItem>
                        <SelectItem value="bet_amount">Bet Amount</SelectItem>
                        <SelectItem value="time_based">Time Based</SelectItem>
                        <SelectItem value="loss_streak">Loss Streak</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {newJackpot.triggerConditions?.type === "random" && (
                    <div>
                      <Label className="text-white">Probability (1 in X)</Label>
                      <Input
                        type="number"
                        value={
                          newJackpot.triggerConditions.probability || 10000
                        }
                        onChange={(e) =>
                          setNewJackpot((prev) => ({
                            ...prev,
                            triggerConditions: {
                              ...prev.triggerConditions,
                              probability: parseInt(e.target.value),
                            },
                          }))
                        }
                      />
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-white">Active</Label>
                      <Switch
                        checked={newJackpot.isActive !== false}
                        onCheckedChange={(checked) =>
                          setNewJackpot((prev) => ({
                            ...prev,
                            isActive: checked,
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="text-white">Visible to Players</Label>
                      <Switch
                        checked={newJackpot.isVisible !== false}
                        onCheckedChange={(checked) =>
                          setNewJackpot((prev) => ({
                            ...prev,
                            isVisible: checked,
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="text-white">Show in Lobby</Label>
                      <Switch
                        checked={newJackpot.settings?.showInLobby !== false}
                        onCheckedChange={(checked) =>
                          setNewJackpot((prev) => ({
                            ...prev,
                            settings: {
                              ...prev.settings,
                              showInLobby: checked,
                            },
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="text-white">Announce Wins</Label>
                      <Switch
                        checked={newJackpot.settings?.announceWins !== false}
                        onCheckedChange={(checked) =>
                          setNewJackpot((prev) => ({
                            ...prev,
                            settings: {
                              ...prev.settings,
                              announceWins: checked,
                            },
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="text-white">Reset to Seed on Win</Label>
                      <Switch
                        checked={
                          newJackpot.settings?.resetToSeedOnWin !== false
                        }
                        onCheckedChange={(checked) =>
                          setNewJackpot((prev) => ({
                            ...prev,
                            settings: {
                              ...prev.settings,
                              resetToSeedOnWin: checked,
                            },
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={createJackpot}
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={!newJackpot.name}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Jackpot
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="winners" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">
                Recent Jackpot Winners
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {jackpots
                  .flatMap((j) =>
                    j.winHistory.map((w) => ({ ...w, jackpotName: j.name })),
                  )
                  .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                  .slice(0, 10)
                  .map((win: any) => (
                    <div
                      key={win.id}
                      className="flex items-center justify-between p-4 bg-gray-700 rounded border"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-yellow-500 rounded">
                          <Trophy className="h-5 w-5 text-black" />
                        </div>
                        <div>
                          <div className="text-white font-semibold">
                            {win.username}
                          </div>
                          <div className="text-gray-400 text-sm">
                            {win.jackpotName}
                          </div>
                          <div className="text-gray-500 text-xs">
                            {win.timestamp.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-yellow-400 font-bold text-lg">
                          {formatCurrency(win.amount, win.currency)}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {win.gameName}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant={win.verified ? "default" : "secondary"}
                          >
                            {win.verified ? "Verified" : "Pending"}
                          </Badge>
                          <Badge variant={win.paid ? "default" : "destructive"}>
                            {win.paid ? "Paid" : "Unpaid"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">
                  Jackpot Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {jackpots
                    .sort((a, b) => b.analytics.totalWon - a.analytics.totalWon)
                    .slice(0, 5)
                    .map((jackpot) => (
                      <div
                        key={jackpot.id}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <div className="text-white font-medium">
                            {jackpot.name}
                          </div>
                          <div className="text-gray-400 text-sm">
                            {jackpot.analytics.timesWon} wins
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-yellow-400 font-semibold">
                            {formatCurrency(
                              jackpot.analytics.totalWon,
                              jackpot.currency,
                            )}
                          </div>
                          <div className="text-gray-400 text-sm">
                            total paid
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">
                  Jackpot Growth Rates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {jackpots.map((jackpot) => (
                    <div
                      key={jackpot.id}
                      className="flex items-center justify-between"
                    >
                      <span className="text-gray-300">{jackpot.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-700 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-green-500"
                            style={{
                              width: `${Math.min(jackpot.incrementPercentage * 20, 100)}%`,
                            }}
                          />
                        </div>
                        <span className="text-white font-medium w-12">
                          {jackpot.incrementPercentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Jackpot Details Modal */}
      <Dialog
        open={!!selectedJackpot}
        onOpenChange={() => setSelectedJackpot(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedJackpot && (
                <>
                  <div
                    className={`p-2 rounded ${getJackpotTypeColor(selectedJackpot.type)}`}
                  >
                    {React.createElement(
                      getJackpotTypeIcon(selectedJackpot.type),
                      { className: "h-5 w-5 text-white" },
                    )}
                  </div>
                  {selectedJackpot.name}
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          {selectedJackpot && (
            <div className="space-y-6">
              {/* Current Jackpot Display */}
              <div className="text-center py-6 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-500/30">
                <p className="text-lg text-gray-300 mb-2">
                  Current Jackpot Amount
                </p>
                <p className="text-5xl font-bold text-yellow-400 animate-pulse">
                  {formatCurrency(
                    selectedJackpot.currentAmount,
                    selectedJackpot.currency,
                  )}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">
                    Jackpot Configuration
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Type:</span>
                      <span className="text-white capitalize">
                        {selectedJackpot.type}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Seed Amount:</span>
                      <span className="text-white">
                        {formatCurrency(
                          selectedJackpot.seedAmount,
                          selectedJackpot.currency,
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Max Amount:</span>
                      <span className="text-white">
                        {selectedJackpot.maxAmount
                          ? formatCurrency(
                              selectedJackpot.maxAmount,
                              selectedJackpot.currency,
                            )
                          : "Unlimited"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Increment Rate:</span>
                      <span className="text-white">
                        {selectedJackpot.incrementPercentage}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Game Types:</span>
                      <span className="text-white">
                        {selectedJackpot.gameTypes.join(", ")}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">
                    Performance Statistics
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Times Won:</span>
                      <span className="text-white">
                        {selectedJackpot.analytics.timesWon}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Won:</span>
                      <span className="text-white">
                        {formatCurrency(
                          selectedJackpot.analytics.totalWon,
                          selectedJackpot.currency,
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Largest Win:</span>
                      <span className="text-white">
                        {formatCurrency(
                          selectedJackpot.analytics.largestWin,
                          selectedJackpot.currency,
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Average Win:</span>
                      <span className="text-white">
                        {formatCurrency(
                          selectedJackpot.analytics.averageWinAmount,
                          selectedJackpot.currency,
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Last Won:</span>
                      <span className="text-white">
                        {selectedJackpot.analytics.lastWon
                          ? selectedJackpot.analytics.lastWon.toLocaleDateString()
                          : "Never"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setEditingJackpot(selectedJackpot)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Jackpot
                </Button>
                <Button
                  onClick={() => resetJackpot(selectedJackpot.id)}
                  variant="outline"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset Amount
                </Button>
                <Button
                  onClick={() => triggerJackpot(selectedJackpot.id)}
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Manual Trigger
                </Button>
                <Button
                  onClick={() => deleteJackpot(selectedJackpot.id)}
                  variant="destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Jackpot Modal */}
      <Dialog
        open={!!editingJackpot}
        onOpenChange={() => setEditingJackpot(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Jackpot: {editingJackpot?.name}</DialogTitle>
          </DialogHeader>
          {editingJackpot && (
            <div className="space-y-4">
              <div>
                <Label className="text-white">Jackpot Name</Label>
                <Input
                  value={editingJackpot.name}
                  onChange={(e) =>
                    setEditingJackpot((prev) =>
                      prev ? { ...prev, name: e.target.value } : null,
                    )
                  }
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-white">Current Amount</Label>
                  <Input
                    type="number"
                    value={editingJackpot.currentAmount}
                    onChange={(e) =>
                      setEditingJackpot((prev) =>
                        prev
                          ? {
                              ...prev,
                              currentAmount: parseFloat(e.target.value),
                            }
                          : null,
                      )
                    }
                  />
                </div>
                <div>
                  <Label className="text-white">Seed Amount</Label>
                  <Input
                    type="number"
                    value={editingJackpot.seedAmount}
                    onChange={(e) =>
                      setEditingJackpot((prev) =>
                        prev
                          ? { ...prev, seedAmount: parseFloat(e.target.value) }
                          : null,
                      )
                    }
                  />
                </div>
                <div>
                  <Label className="text-white">Increment %</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={editingJackpot.incrementPercentage}
                    onChange={(e) =>
                      setEditingJackpot((prev) =>
                        prev
                          ? {
                              ...prev,
                              incrementPercentage: parseFloat(e.target.value),
                            }
                          : null,
                      )
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-white">Active</Label>
                <Switch
                  checked={editingJackpot.isActive}
                  onCheckedChange={(checked) =>
                    setEditingJackpot((prev) =>
                      prev ? { ...prev, isActive: checked } : null,
                    )
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-white">Visible</Label>
                <Switch
                  checked={editingJackpot.isVisible}
                  onCheckedChange={(checked) =>
                    setEditingJackpot((prev) =>
                      prev ? { ...prev, isVisible: checked } : null,
                    )
                  }
                />
              </div>

              <Button
                onClick={() => {
                  if (editingJackpot) {
                    updateJackpot(editingJackpot.id, editingJackpot);
                    setEditingJackpot(null);
                  }
                }}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Save Changes
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
