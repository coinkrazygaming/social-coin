import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";
import { Progress } from "./ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { ScrollArea } from "./ui/scroll-area";
import { useAuth } from "./AuthContext";
import { AccessDeniedModal } from "./AccessDeniedModal";
import { EnhancedJoseyAI } from "./EnhancedJoseyAI";
import { SystemTester } from "./SystemTester";
import {
  SlotMachine as SlotMachineType,
  SlotSymbol,
  SlotReel,
} from "@shared/slotTypes";
import { DEFAULT_COINKRAZY_SLOTS } from "@shared/defaultSlots";
import { ADDITIONAL_COINKRAZY_SLOTS } from "@shared/additionalSlots";
import {
  Settings,
  Crown,
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  Target,
  Star,
  BarChart3,
  PieChart,
  Bot,
  MessageSquare,
  Zap,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Save,
  Play,
  Pause,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  Palette,
  Grid,
  Sparkles,
  FileCode,
  TestTube,
  Image as ImageIcon,
  Cpu,
  Shield,
  Lock,
  Key,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  Gamepad2,
  Coins,
  CreditCard,
  Banknote,
  Building,
  UserCheck,
  FileText,
  Search,
  Filter,
  Calendar,
  Clock4,
  Flame,
  Lightning,
  Gem,
  Medal,
  Trophy,
  Award,
  Gift,
} from "lucide-react";

interface EnhancedAdminPanelProps {
  userId?: string;
}

interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  totalGames: number;
  totalSlots: number;
  todayRevenue: number;
  weekRevenue: number;
  monthRevenue: number;
  avgRTP: number;
  totalSpins: number;
  totalWins: number;
  popularSlots: Array<{
    id: string;
    name: string;
    plays: number;
    revenue: number;
  }>;
  recentActivity: Array<{
    timestamp: Date;
    action: string;
    user: string;
    details: string;
  }>;
}

interface GameAnalytics {
  slotId: string;
  name: string;
  plays: number;
  revenue: number;
  rtp: number;
  winRate: number;
  avgBet: number;
  maxWin: number;
  popularity: number;
  retention: number;
  performance: "excellent" | "good" | "average" | "poor";
}

interface UserMetrics {
  id: string;
  username: string;
  totalBets: number;
  totalWins: number;
  netLoss: number;
  favoriteSlot: string;
  avgSession: number;
  retention: number;
  riskLevel: "low" | "medium" | "high";
  lastActivity: Date;
}

interface AdminSettings {
  maintenance: boolean;
  newUserRegistration: boolean;
  maxBetLimit: number;
  minWithdrawal: number;
  maxWithdrawal: number;
  rtpRange: { min: number; max: number };
  bonusSettings: {
    welcomeBonus: number;
    dailyBonus: number;
    referralBonus: number;
  };
  securitySettings: {
    twoFactorRequired: boolean;
    sessionTimeout: number;
    maxLoginAttempts: number;
  };
  gameSettings: {
    autoplayMaxSpins: number;
    maxBetMultiplier: number;
    enableQuickSpin: boolean;
  };
}

export function EnhancedAdminPanel({ userId }: EnhancedAdminPanelProps) {
  const { user } = useAuth();
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [subTab, setSubTab] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // State management
  const [allSlots, setAllSlots] = useState<SlotMachineType[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<SlotMachineType | null>(
    null,
  );
  const [editingSlot, setEditingSlot] = useState<SlotMachineType | null>(null);
  const [showSlotEditor, setShowSlotEditor] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Analytics and metrics
  const [systemStats, setSystemStats] = useState<SystemStats>({
    totalUsers: 12847,
    activeUsers: 3241,
    totalRevenue: 234567.89,
    totalGames: 47,
    totalSlots: 25,
    todayRevenue: 4567.23,
    weekRevenue: 23456.78,
    monthRevenue: 89123.45,
    avgRTP: 95.8,
    totalSpins: 1847532,
    totalWins: 523847,
    popularSlots: [],
    recentActivity: [],
  });

  const [gameAnalytics, setGameAnalytics] = useState<GameAnalytics[]>([]);
  const [userMetrics, setUserMetrics] = useState<UserMetrics[]>([]);
  const [adminSettings, setAdminSettings] = useState<AdminSettings>({
    maintenance: false,
    newUserRegistration: true,
    maxBetLimit: 1000,
    minWithdrawal: 50,
    maxWithdrawal: 10000,
    rtpRange: { min: 85, max: 98 },
    bonusSettings: {
      welcomeBonus: 100,
      dailyBonus: 25,
      referralBonus: 50,
    },
    securitySettings: {
      twoFactorRequired: false,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
    },
    gameSettings: {
      autoplayMaxSpins: 100,
      maxBetMultiplier: 10,
      enableQuickSpin: true,
    },
  });

  // Filters and search
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState("7d");
  const [selectedProvider, setSelectedProvider] = useState("all");
  const [sortBy, setSortBy] = useState("revenue");

  // Real-time updates
  const [realTimeEnabled, setRealTimeEnabled] = useState(true);
  const [updateInterval, setUpdateInterval] = useState(5000);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      setShowAccessDenied(true);
      return;
    }

    initializeAdminPanel();
  }, [user]);

  useEffect(() => {
    // Combine all slot games
    const combinedSlots = [
      ...DEFAULT_COINKRAZY_SLOTS,
      ...ADDITIONAL_COINKRAZY_SLOTS,
    ];
    setAllSlots(combinedSlots);
    generateMockAnalytics(combinedSlots);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (realTimeEnabled) {
      const interval = setInterval(() => {
        updateRealTimeData();
      }, updateInterval);
      return () => clearInterval(interval);
    }
  }, [realTimeEnabled, updateInterval]);

  const initializeAdminPanel = async () => {
    try {
      // Initialize admin panel data
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to initialize admin panel:", error);
      setIsLoading(false);
    }
  };

  const generateMockAnalytics = (slots: SlotMachineType[]) => {
    const analytics: GameAnalytics[] = slots.map((slot, index) => ({
      slotId: slot.id,
      name: slot.name,
      plays: Math.floor(Math.random() * 10000) + 1000,
      revenue: Math.floor(Math.random() * 50000) + 5000,
      rtp: slot.rtp,
      winRate: Math.random() * 0.3 + 0.2, // 20-50%
      avgBet: Math.random() * 50 + 10,
      maxWin: Math.floor(Math.random() * 10000) + 1000,
      popularity: Math.random() * 100,
      retention: Math.random() * 100,
      performance: ["excellent", "good", "average", "poor"][
        Math.floor(Math.random() * 4)
      ] as any,
    }));
    setGameAnalytics(analytics);

    // Generate popular slots
    const popularSlots = analytics
      .sort((a, b) => b.plays - a.plays)
      .slice(0, 5)
      .map((a) => ({
        id: a.slotId,
        name: a.name,
        plays: a.plays,
        revenue: a.revenue,
      }));

    setSystemStats((prev) => ({ ...prev, popularSlots }));
  };

  const updateRealTimeData = () => {
    // Simulate real-time data updates
    setSystemStats((prev) => ({
      ...prev,
      activeUsers: prev.activeUsers + Math.floor(Math.random() * 20) - 10,
      todayRevenue: prev.todayRevenue + Math.random() * 100,
      totalSpins: prev.totalSpins + Math.floor(Math.random() * 50),
    }));
  };

  const filteredSlots = useMemo(() => {
    return allSlots.filter((slot) => {
      const matchesSearch =
        slot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        slot.theme.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesProvider =
        selectedProvider === "all" || slot.provider === selectedProvider;
      return matchesSearch && matchesProvider;
    });
  }, [allSlots, searchTerm, selectedProvider]);

  const sortedAnalytics = useMemo(() => {
    return [...gameAnalytics].sort((a, b) => {
      switch (sortBy) {
        case "revenue":
          return b.revenue - a.revenue;
        case "plays":
          return b.plays - a.plays;
        case "rtp":
          return b.rtp - a.rtp;
        case "popularity":
          return b.popularity - a.popularity;
        default:
          return 0;
      }
    });
  }, [gameAnalytics, sortBy]);

  const createNewSlot = () => {
    const newSlot: SlotMachineType = {
      id: `slot_${Date.now()}`,
      name: "New CoinKrazy Slot",
      description: "A new slot machine created with the visual editor",
      theme: "Custom",
      provider: "CoinKrazy",
      thumbnail: "/thumbnails/default-new.svg",
      backgroundImage: "/backgrounds/default-bg.jpg",
      reels: Array.from({ length: 5 }, (_, i) => ({
        id: `reel_${i}`,
        position: i,
        symbols: ["wild", "scatter", "seven", "bar"],
        weight: { wild: 1, scatter: 2, seven: 5, bar: 10 },
      })),
      rows: 3,
      paylines: [
        {
          id: "line_1",
          name: "Center Line",
          positions: [
            { reel: 0, row: 1 },
            { reel: 1, row: 1 },
            { reel: 2, row: 1 },
            { reel: 3, row: 1 },
            { reel: 4, row: 1 },
          ],
          active: true,
        },
      ],
      symbols: [
        {
          id: "wild",
          name: "Wild Symbol",
          image: "",
          value: 1000,
          rarity: "legendary",
          multiplier: 2,
          color: "#FFD700",
        },
        {
          id: "scatter",
          name: "Scatter Symbol",
          image: "",
          value: 500,
          rarity: "epic",
          multiplier: 1,
          color: "#FF6B6B",
        },
      ],
      winConditions: [],
      rtp: 95.5,
      volatility: "medium",
      minBet: 0.01,
      maxBet: 100,
      bonusFeatures: [],
      soundEffects: {
        spinSound: "/sounds/spin.mp3",
        winSound: "/sounds/win.mp3",
        bonusSound: "/sounds/bonus.mp3",
        backgroundMusic: "/sounds/background.mp3",
        volume: 0.7,
      },
      animations: {
        spinDuration: 2000,
        reelDelay: 200,
        winAnimationDuration: 1500,
        symbolAnimations: {},
      },
      created: new Date(),
      updated: new Date(),
      active: true,
      featured: false,
    };

    setEditingSlot(newSlot);
    setShowSlotEditor(true);
  };

  const handleSlotSave = async (slot: SlotMachineType) => {
    try {
      setAllSlots((prev) => {
        const existing = prev.findIndex((s) => s.id === slot.id);
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = slot;
          return updated;
        }
        return [...prev, slot];
      });
      setShowSlotEditor(false);
      setEditingSlot(null);
    } catch (error) {
      console.error("Failed to save slot:", error);
    }
  };

  const handleJoseyAICodeGenerate = (code: string, type: string) => {
    console.log(`JoseyAI generated ${type}:`, code);
    // Handle generated code
  };

  const handleJoseyAIComponentGenerate = (component: any) => {
    console.log("JoseyAI generated component:", component);
    // Handle generated component
  };

  const handleJoseyAITodoCreate = (todo: any) => {
    console.log("JoseyAI created todo:", todo);
    // Handle created todo
  };

  const handleJoseyAIRestorePoint = (point: any) => {
    console.log("JoseyAI created restore point:", point);
    // Handle restore point
  };

  if (!user || user.role !== "admin") {
    return (
      <AccessDeniedModal
        isOpen={showAccessDenied}
        onClose={() => setShowAccessDenied(false)}
        feature="Enhanced Admin Panel"
      />
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 flex items-center justify-center">
        <div className="text-white text-xl flex items-center">
          <RefreshCw className="h-6 w-6 mr-3 animate-spin" />
          Loading Enhanced Admin Panel...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
              <Crown className="h-8 w-8 mr-3 text-gold" />
              CoinKrazy Enhanced Admin Panel
              <Badge className="ml-3 bg-gold text-black font-bold">
                Advanced Control Center
              </Badge>
            </h1>
            <p className="text-purple-200">
              Comprehensive platform management with AI-powered insights
            </p>
          </div>
          <div className="flex items-center gap-4 text-white">
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${realTimeEnabled ? "bg-green-400 animate-pulse" : "bg-gray-400"}`}
              />
              <span className="text-sm">
                {realTimeEnabled ? "Live Updates" : "Static Mode"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-gold" />
              <span>Admin: {user.username}</span>
            </div>
          </div>
        </div>

        {/* Real-time Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">
                    Total Revenue
                  </p>
                  <div className="flex items-center">
                    <p className="text-2xl font-bold text-green-400">
                      ${systemStats.totalRevenue.toLocaleString()}
                    </p>
                    <TrendingUp className="h-4 w-4 text-green-400 ml-2" />
                  </div>
                  <p className="text-xs text-gray-500">
                    +${systemStats.todayRevenue.toFixed(2)} today
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">
                    Active Users
                  </p>
                  <div className="flex items-center">
                    <p className="text-2xl font-bold text-blue-400">
                      {systemStats.activeUsers.toLocaleString()}
                    </p>
                    <Activity className="h-4 w-4 text-blue-400 ml-2" />
                  </div>
                  <p className="text-xs text-gray-500">
                    of {systemStats.totalUsers.toLocaleString()} total
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">
                    Total Spins
                  </p>
                  <div className="flex items-center">
                    <p className="text-2xl font-bold text-purple-400">
                      {systemStats.totalSpins.toLocaleString()}
                    </p>
                    <Zap className="h-4 w-4 text-purple-400 ml-2" />
                  </div>
                  <p className="text-xs text-gray-500">
                    {systemStats.totalWins.toLocaleString()} wins
                  </p>
                </div>
                <Target className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Avg RTP</p>
                  <div className="flex items-center">
                    <p className="text-2xl font-bold text-gold">
                      {systemStats.avgRTP}%
                    </p>
                    <BarChart3 className="h-4 w-4 text-gold ml-2" />
                  </div>
                  <p className="text-xs text-gray-500">
                    {systemStats.totalSlots} active slots
                  </p>
                </div>
                <Medal className="h-8 w-8 text-gold" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Admin Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-8 bg-gray-800/50 backdrop-blur-sm">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="slots">Slot Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="ai">AI Control</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Dashboard */}
              <div className="lg:col-span-2 space-y-6">
                {/* Popular Slots */}
                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Star className="h-5 w-5 mr-2 text-gold" />
                      Top Performing Slots
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {systemStats.popularSlots
                        .slice(0, 5)
                        .map((slot, index) => (
                          <div
                            key={slot.id}
                            className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center justify-center w-8 h-8 bg-gold/20 rounded-full text-gold font-bold">
                                {index + 1}
                              </div>
                              <div>
                                <p className="text-white font-medium">
                                  {slot.name}
                                </p>
                                <p className="text-sm text-gray-400">
                                  {slot.plays.toLocaleString()} plays
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-green-400 font-bold">
                                ${slot.revenue.toLocaleString()}
                              </p>
                              <p className="text-xs text-gray-400">revenue</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Revenue Chart */}
                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
                      Revenue Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-400">
                          ${systemStats.todayRevenue.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-400">Today</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-400">
                          ${systemStats.weekRevenue.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-400">This Week</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-400">
                          ${systemStats.monthRevenue.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-400">This Month</p>
                      </div>
                    </div>
                    <div className="h-32 bg-gray-700/30 rounded-lg flex items-center justify-center">
                      <p className="text-gray-400">Revenue Chart Placeholder</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Enhanced JoseyAI Sidebar */}
              <div className="space-y-6">
                <EnhancedJoseyAI
                  context="admin"
                  currentProject={{
                    type: "casino_admin",
                    stats: systemStats,
                    slots: allSlots,
                  }}
                  onSuggestionApply={(suggestion) =>
                    console.log("Admin suggestion:", suggestion)
                  }
                  onCodeGenerate={handleJoseyAICodeGenerate}
                  onComponentGenerate={handleJoseyAIComponentGenerate}
                  onTodoCreate={handleJoseyAITodoCreate}
                  onRestorePoint={handleJoseyAIRestorePoint}
                />

                {/* System Health */}
                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Activity className="h-5 w-5 mr-2 text-green-400" />
                      System Health
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Server Load</span>
                        <span className="text-white">23%</span>
                      </div>
                      <Progress value={23} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Database</span>
                        <span className="text-white">89%</span>
                      </div>
                      <Progress value={89} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Cache Hit Rate</span>
                        <span className="text-white">94%</span>
                      </div>
                      <Progress value={94} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Response Time</span>
                        <span className="text-white">125ms</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Zap className="h-5 w-5 mr-2 text-yellow-400" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={createNewSlot}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Slot
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => setActiveTab("analytics")}
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Analytics
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => setActiveTab("users")}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Manage Users
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => setActiveTab("settings")}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      System Settings
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Slot Management Tab */}
          <TabsContent value="slots" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Slot Management Main Area */}
              <div className="xl:col-span-3">
                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white flex items-center">
                          <Crown className="h-6 w-6 mr-2 text-gold" />
                          Advanced Slot Management Studio
                          <Badge className="ml-2 bg-gold text-black font-bold">
                            CoinKrazy Pro
                          </Badge>
                        </CardTitle>
                        <p className="text-gray-400 mt-1">
                          Complete slot machine development and management suite
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={createNewSlot}
                          className="bg-gold hover:bg-gold/80 text-black font-bold"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Create New Slot
                        </Button>
                        <Button variant="outline">
                          <Upload className="h-4 w-4 mr-2" />
                          Import
                        </Button>
                        <Button variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Export All
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Search and Filters */}
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="flex-1">
                        <Input
                          placeholder="Search slots by name or theme..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="bg-gray-700/50 border-gray-600"
                        />
                      </div>
                      <Select
                        value={selectedProvider}
                        onValueChange={setSelectedProvider}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Providers</SelectItem>
                          <SelectItem value="CoinKrazy">CoinKrazy</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="revenue">Revenue</SelectItem>
                          <SelectItem value="plays">Plays</SelectItem>
                          <SelectItem value="rtp">RTP</SelectItem>
                          <SelectItem value="popularity">Popularity</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Slot Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredSlots.map((slot) => {
                        const analytics = gameAnalytics.find(
                          (a) => a.slotId === slot.id,
                        );
                        return (
                          <Card
                            key={slot.id}
                            className="bg-gray-700/50 border-gray-600 hover:border-gold/50 transition-all duration-300 group"
                          >
                            <CardContent className="p-4">
                              <div className="relative mb-3">
                                <img
                                  src={slot.thumbnail}
                                  alt={slot.name}
                                  className="w-full h-32 object-cover rounded-lg"
                                />
                                <div className="absolute top-2 left-2">
                                  <Badge className="bg-gold text-black font-bold">
                                    {slot.provider}
                                  </Badge>
                                </div>
                                <div className="absolute top-2 right-2">
                                  {slot.featured && (
                                    <Badge className="bg-purple-600 text-white">
                                      Featured
                                    </Badge>
                                  )}
                                </div>
                                <div className="absolute bottom-2 right-2">
                                  <Badge
                                    variant={
                                      slot.active ? "default" : "secondary"
                                    }
                                    className={
                                      slot.active ? "bg-green-600" : ""
                                    }
                                  >
                                    {slot.active ? "Active" : "Inactive"}
                                  </Badge>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <h3 className="font-bold text-white group-hover:text-gold transition-colors">
                                  {slot.name}
                                </h3>
                                <p className="text-sm text-gray-400 line-clamp-2">
                                  {slot.description}
                                </p>

                                {analytics && (
                                  <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="text-center p-2 bg-gray-800/50 rounded">
                                      <p className="text-gray-400">Plays</p>
                                      <p className="text-white font-bold">
                                        {analytics.plays.toLocaleString()}
                                      </p>
                                    </div>
                                    <div className="text-center p-2 bg-gray-800/50 rounded">
                                      <p className="text-gray-400">Revenue</p>
                                      <p className="text-green-400 font-bold">
                                        ${analytics.revenue.toLocaleString()}
                                      </p>
                                    </div>
                                  </div>
                                )}

                                <div className="flex items-center justify-between text-xs text-gray-400">
                                  <span>RTP: {slot.rtp}%</span>
                                  <span>{slot.volatility}</span>
                                  <span>{slot.symbols.length} symbols</span>
                                </div>
                              </div>

                              <div className="flex space-x-2 mt-4">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setEditingSlot(slot);
                                    setShowSlotEditor(true);
                                  }}
                                  className="flex-1"
                                >
                                  <Edit className="h-3 w-3 mr-1" />
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedSlot(slot);
                                    setShowPreview(true);
                                  }}
                                  className="flex-1"
                                >
                                  <Eye className="h-3 w-3 mr-1" />
                                  Preview
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    // Clone slot
                                    const cloned = {
                                      ...slot,
                                      id: `slot_${Date.now()}`,
                                      name: `${slot.name} (Copy)`,
                                      created: new Date(),
                                      updated: new Date(),
                                    };
                                    setAllSlots((prev) => [...prev, cloned]);
                                  }}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>

                    {filteredSlots.length === 0 && (
                      <div className="text-center py-12">
                        <Search className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-400">
                          No slots found matching your criteria
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Slot Management Sidebar */}
              <div className="space-y-6">
                <EnhancedJoseyAI
                  context="slot-editor"
                  currentProject={{
                    type: "slot_management",
                    totalSlots: allSlots.length,
                    activeSlots: allSlots.filter((s) => s.active).length,
                  }}
                  onSuggestionApply={(suggestion) =>
                    console.log("Slot suggestion:", suggestion)
                  }
                  onCodeGenerate={handleJoseyAICodeGenerate}
                  onComponentGenerate={handleJoseyAIComponentGenerate}
                  onTodoCreate={handleJoseyAITodoCreate}
                  onRestorePoint={handleJoseyAIRestorePoint}
                />

                {/* Slot Statistics */}
                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2 text-blue-400" />
                      Slot Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Total Slots</span>
                      <Badge className="bg-blue-600">{allSlots.length}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Active Slots</span>
                      <Badge className="bg-green-600">
                        {allSlots.filter((s) => s.active).length}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Featured</span>
                      <Badge className="bg-gold text-black">
                        {allSlots.filter((s) => s.featured).length}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Avg RTP</span>
                      <Badge variant="outline">
                        {allSlots.length > 0
                          ? (
                              allSlots.reduce((acc, s) => acc + s.rtp, 0) /
                              allSlots.length
                            ).toFixed(1) + "%"
                          : "N/A"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">High Volatility</span>
                      <Badge variant="outline">
                        {allSlots.filter((s) => s.volatility === "high").length}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Performance Insights */}
                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Target className="h-5 w-5 mr-2 text-purple-400" />
                      Performance Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-green-900/30 border border-green-500/30 rounded-lg">
                      <div className="flex items-center">
                        <Trophy className="h-4 w-4 text-green-400 mr-2" />
                        <span className="text-sm text-green-300">
                          Top Performer
                        </span>
                      </div>
                      <p className="text-xs text-green-200 mt-1">
                        Lucky Fortune generating highest revenue
                      </p>
                    </div>
                    <div className="p-3 bg-yellow-900/30 border border-yellow-500/30 rounded-lg">
                      <div className="flex items-center">
                        <AlertTriangle className="h-4 w-4 text-yellow-400 mr-2" />
                        <span className="text-sm text-yellow-300">
                          Needs Attention
                        </span>
                      </div>
                      <p className="text-xs text-yellow-200 mt-1">
                        3 slots with low engagement rates
                      </p>
                    </div>
                    <div className="p-3 bg-blue-900/30 border border-blue-500/30 rounded-lg">
                      <div className="flex items-center">
                        <Lightbulb className="h-4 w-4 text-blue-400 mr-2" />
                        <span className="text-sm text-blue-300">
                          Recommendation
                        </span>
                      </div>
                      <p className="text-xs text-blue-200 mt-1">
                        Consider adding more themed slots
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <BarChart3 className="h-6 w-6 mr-2 text-blue-400" />
                  Advanced Analytics Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Game Performance Table */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Game Performance
                    </h3>
                    <div className="max-h-96 overflow-y-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-gray-400">
                              Game
                            </TableHead>
                            <TableHead className="text-gray-400">
                              Plays
                            </TableHead>
                            <TableHead className="text-gray-400">
                              Revenue
                            </TableHead>
                            <TableHead className="text-gray-400">RTP</TableHead>
                            <TableHead className="text-gray-400">
                              Status
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {sortedAnalytics.slice(0, 10).map((analytics) => (
                            <TableRow key={analytics.slotId}>
                              <TableCell className="text-white font-medium">
                                {analytics.name}
                              </TableCell>
                              <TableCell className="text-blue-400">
                                {analytics.plays.toLocaleString()}
                              </TableCell>
                              <TableCell className="text-green-400">
                                ${analytics.revenue.toLocaleString()}
                              </TableCell>
                              <TableCell className="text-yellow-400">
                                {analytics.rtp}%
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    analytics.performance === "excellent"
                                      ? "default"
                                      : analytics.performance === "good"
                                        ? "secondary"
                                        : "outline"
                                  }
                                  className={
                                    analytics.performance === "excellent"
                                      ? "bg-green-600"
                                      : analytics.performance === "good"
                                        ? "bg-blue-600"
                                        : analytics.performance === "average"
                                          ? "bg-yellow-600"
                                          : "bg-red-600"
                                  }
                                >
                                  {analytics.performance}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  {/* Analytics Charts */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">
                        Revenue Distribution
                      </h3>
                      <div className="h-48 bg-gray-700/30 rounded-lg flex items-center justify-center">
                        <p className="text-gray-400">
                          Revenue Chart Placeholder
                        </p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">
                        User Engagement
                      </h3>
                      <div className="h-48 bg-gray-700/30 rounded-lg flex items-center justify-center">
                        <p className="text-gray-400">
                          Engagement Chart Placeholder
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Control Tab */}
          <TabsContent value="ai" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Bot className="h-6 w-6 mr-2 text-blue-400" />
                      JoseyAI Enhanced Control Center
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <EnhancedJoseyAI
                      context="development"
                      currentProject={{
                        type: "full_platform",
                        adminLevel: "enhanced",
                        features: [
                          "slots",
                          "table_games",
                          "bingo",
                          "payments",
                          "analytics",
                        ],
                      }}
                      onSuggestionApply={(suggestion) =>
                        console.log("Development suggestion:", suggestion)
                      }
                      onCodeGenerate={handleJoseyAICodeGenerate}
                      onComponentGenerate={handleJoseyAIComponentGenerate}
                      onTodoCreate={handleJoseyAITodoCreate}
                      onRestorePoint={handleJoseyAIRestorePoint}
                    />
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                {/* AI Department Managers */}
                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Cpu className="h-5 w-5 mr-2 text-purple-400" />
                      AI Department Managers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4">
                      {[
                        {
                          name: "SlotAI Manager",
                          icon: "🎰",
                          desc: "Manages slot optimization and RTP",
                          status: "online",
                        },
                        {
                          name: "TableAI Manager",
                          icon: "🃏",
                          desc: "Oversees table games and dealers",
                          status: "online",
                        },
                        {
                          name: "BingoAI Manager",
                          icon: "🎱",
                          desc: "Handles bingo hall operations",
                          status: "online",
                        },
                        {
                          name: "PaymentAI Manager",
                          icon: "💳",
                          desc: "Processes payments and fraud detection",
                          status: "online",
                        },
                        {
                          name: "SecurityAI Manager",
                          icon: "🛡️",
                          desc: "Monitors security and compliance",
                          status: "online",
                        },
                        {
                          name: "AnalyticsAI Manager",
                          icon: "📊",
                          desc: "Generates insights and reports",
                          status: "online",
                        },
                      ].map((ai) => (
                        <div
                          key={ai.name}
                          className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl">{ai.icon}</div>
                            <div>
                              <p className="text-white font-medium">
                                {ai.name}
                              </p>
                              <p className="text-sm text-gray-400">{ai.desc}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div
                              className={`w-2 h-2 rounded-full ${ai.status === "online" ? "bg-green-400" : "bg-red-400"}`}
                            />
                            <Button size="sm" variant="outline">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              Chat
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* AI System Status */}
                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Activity className="h-5 w-5 mr-2 text-green-400" />
                      AI System Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">LLM Processing</span>
                        <span className="text-white">94%</span>
                      </div>
                      <Progress value={94} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Code Generation</span>
                        <span className="text-white">87%</span>
                      </div>
                      <Progress value={87} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Analytics Engine</span>
                        <span className="text-white">92%</span>
                      </div>
                      <Progress value={92} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">
                          Security Monitoring
                        </span>
                        <span className="text-white">99%</span>
                      </div>
                      <Progress value={99} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Settings className="h-6 w-6 mr-2 text-gray-400" />
                  Advanced System Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Platform Settings */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">
                        Platform Settings
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label className="text-white">Maintenance Mode</Label>
                          <Switch
                            checked={adminSettings.maintenance}
                            onCheckedChange={(checked) =>
                              setAdminSettings((prev) => ({
                                ...prev,
                                maintenance: checked,
                              }))
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-white">
                            New User Registration
                          </Label>
                          <Switch
                            checked={adminSettings.newUserRegistration}
                            onCheckedChange={(checked) =>
                              setAdminSettings((prev) => ({
                                ...prev,
                                newUserRegistration: checked,
                              }))
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-white">
                            Real-time Updates
                          </Label>
                          <Switch
                            checked={realTimeEnabled}
                            onCheckedChange={setRealTimeEnabled}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">
                        Betting Limits
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-white">
                            Maximum Bet Limit ($)
                          </Label>
                          <Input
                            type="number"
                            value={adminSettings.maxBetLimit}
                            onChange={(e) =>
                              setAdminSettings((prev) => ({
                                ...prev,
                                maxBetLimit: parseFloat(e.target.value),
                              }))
                            }
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-white">RTP Range (%)</Label>
                          <div className="grid grid-cols-2 gap-2 mt-1">
                            <Input
                              type="number"
                              value={adminSettings.rtpRange.min}
                              onChange={(e) =>
                                setAdminSettings((prev) => ({
                                  ...prev,
                                  rtpRange: {
                                    ...prev.rtpRange,
                                    min: parseFloat(e.target.value),
                                  },
                                }))
                              }
                              placeholder="Min RTP"
                            />
                            <Input
                              type="number"
                              value={adminSettings.rtpRange.max}
                              onChange={(e) =>
                                setAdminSettings((prev) => ({
                                  ...prev,
                                  rtpRange: {
                                    ...prev.rtpRange,
                                    max: parseFloat(e.target.value),
                                  },
                                }))
                              }
                              placeholder="Max RTP"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Security Settings */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">
                        Security Settings
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label className="text-white">
                            Two-Factor Authentication Required
                          </Label>
                          <Switch
                            checked={
                              adminSettings.securitySettings.twoFactorRequired
                            }
                            onCheckedChange={(checked) =>
                              setAdminSettings((prev) => ({
                                ...prev,
                                securitySettings: {
                                  ...prev.securitySettings,
                                  twoFactorRequired: checked,
                                },
                              }))
                            }
                          />
                        </div>
                        <div>
                          <Label className="text-white">
                            Session Timeout (minutes)
                          </Label>
                          <Input
                            type="number"
                            value={
                              adminSettings.securitySettings.sessionTimeout
                            }
                            onChange={(e) =>
                              setAdminSettings((prev) => ({
                                ...prev,
                                securitySettings: {
                                  ...prev.securitySettings,
                                  sessionTimeout: parseInt(e.target.value),
                                },
                              }))
                            }
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-white">
                            Max Login Attempts
                          </Label>
                          <Input
                            type="number"
                            value={
                              adminSettings.securitySettings.maxLoginAttempts
                            }
                            onChange={(e) =>
                              setAdminSettings((prev) => ({
                                ...prev,
                                securitySettings: {
                                  ...prev.securitySettings,
                                  maxLoginAttempts: parseInt(e.target.value),
                                },
                              }))
                            }
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">
                        Game Settings
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label className="text-white">
                            Enable Quick Spin
                          </Label>
                          <Switch
                            checked={adminSettings.gameSettings.enableQuickSpin}
                            onCheckedChange={(checked) =>
                              setAdminSettings((prev) => ({
                                ...prev,
                                gameSettings: {
                                  ...prev.gameSettings,
                                  enableQuickSpin: checked,
                                },
                              }))
                            }
                          />
                        </div>
                        <div>
                          <Label className="text-white">
                            Autoplay Max Spins
                          </Label>
                          <Input
                            type="number"
                            value={adminSettings.gameSettings.autoplayMaxSpins}
                            onChange={(e) =>
                              setAdminSettings((prev) => ({
                                ...prev,
                                gameSettings: {
                                  ...prev.gameSettings,
                                  autoplayMaxSpins: parseInt(e.target.value),
                                },
                              }))
                            }
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center mt-8">
                  <Button className="bg-blue-600 hover:bg-blue-700 px-8">
                    <Save className="h-4 w-4 mr-2" />
                    Save All Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Slot Editor Modal */}
        <Dialog open={showSlotEditor} onOpenChange={setShowSlotEditor}>
          <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-gold">
                {editingSlot ? `Edit ${editingSlot.name}` : "Create New Slot"}
              </DialogTitle>
              <DialogDescription>
                Use the advanced visual editor to create and customize your slot
                machine
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              {editingSlot && (
                <EnhancedSlotEditor
                  initialSlot={editingSlot}
                  onSave={handleSlotSave}
                  onCancel={() => {
                    setShowSlotEditor(false);
                    setEditingSlot(null);
                  }}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Preview Modal */}
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-gold">
                Slot Preview: {selectedSlot?.name}
              </DialogTitle>
              <DialogDescription>
                Preview the slot machine as it will appear to players
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              {selectedSlot && (
                <div className="bg-gray-900 p-6 rounded-lg">
                  <p className="text-gray-400 text-center">
                    Slot Machine Preview Component Would Go Here
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

// Enhanced Slot Editor Component
interface EnhancedSlotEditorProps {
  initialSlot: SlotMachineType;
  onSave: (slot: SlotMachineType) => Promise<void>;
  onCancel: () => void;
}

function EnhancedSlotEditor({
  initialSlot,
  onSave,
  onCancel,
}: EnhancedSlotEditorProps) {
  const [slot, setSlot] = useState<SlotMachineType>(initialSlot);
  const [activeTab, setActiveTab] = useState("basic");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(slot);
    } catch (error) {
      console.error("Failed to save slot:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const updateSlot = (updates: Partial<SlotMachineType>) => {
    setSlot((prev) => ({ ...prev, ...updates, updated: new Date() }));
  };

  return (
    <div className="space-y-6">
      {/* Editor Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">{slot.name}</h3>
          <p className="text-gray-400">Advanced Slot Configuration</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-gold text-black"
          >
            {isSaving ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Slot
          </Button>
        </div>
      </div>

      {/* Editor Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="symbols">Symbols</TabsTrigger>
          <TabsTrigger value="reels">Reels</TabsTrigger>
          <TabsTrigger value="paylines">Paylines</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Slot Name</Label>
                  <Input
                    value={slot.name}
                    onChange={(e) => updateSlot({ name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Theme</Label>
                  <Select
                    value={slot.theme}
                    onValueChange={(theme) => updateSlot({ theme })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Classic">Classic</SelectItem>
                      <SelectItem value="Adventure">Adventure</SelectItem>
                      <SelectItem value="Fantasy">Fantasy</SelectItem>
                      <SelectItem value="Sci-Fi">Sci-Fi</SelectItem>
                      <SelectItem value="Horror">Horror</SelectItem>
                      <SelectItem value="Mythology">Mythology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={slot.description}
                  onChange={(e) => updateSlot({ description: e.target.value })}
                  placeholder="Describe your slot machine..."
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Rows</Label>
                  <Input
                    type="number"
                    value={slot.rows}
                    onChange={(e) =>
                      updateSlot({ rows: parseInt(e.target.value) })
                    }
                    min="3"
                    max="5"
                  />
                </div>
                <div>
                  <Label>Min Bet ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={slot.minBet}
                    onChange={(e) =>
                      updateSlot({ minBet: parseFloat(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <Label>Max Bet ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={slot.maxBet}
                    onChange={(e) =>
                      updateSlot({ maxBet: parseFloat(e.target.value) })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>RTP (%): {slot.rtp}</Label>
                  <Slider
                    value={[slot.rtp]}
                    onValueChange={(value) => updateSlot({ rtp: value[0] })}
                    min={85}
                    max={98}
                    step={0.1}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Volatility</Label>
                  <Select
                    value={slot.volatility}
                    onValueChange={(volatility: any) =>
                      updateSlot({ volatility })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={slot.active}
                    onCheckedChange={(active) => updateSlot({ active })}
                  />
                  <Label>Active</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={slot.featured}
                    onCheckedChange={(featured) => updateSlot({ featured })}
                  />
                  <Label>Featured</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="symbols">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8 text-gray-400">
                <Sparkles className="h-12 w-12 mx-auto mb-4" />
                <p>Symbol editor interface would go here</p>
                <p className="text-sm">
                  Configure symbol values, rarities, and appearances
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reels">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8 text-gray-400">
                <Grid className="h-12 w-12 mx-auto mb-4" />
                <p>Reel configuration interface would go here</p>
                <p className="text-sm">
                  Set up reel weights and symbol distributions
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paylines">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8 text-gray-400">
                <Zap className="h-12 w-12 mx-auto mb-4" />
                <p>Payline editor interface would go here</p>
                <p className="text-sm">
                  Define winning combinations and payouts
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8 text-gray-400">
                <Star className="h-12 w-12 mx-auto mb-4" />
                <p>Bonus features configuration would go here</p>
                <p className="text-sm">
                  Add special features, animations, and sound effects
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8 text-gray-400">
                <Eye className="h-12 w-12 mx-auto mb-4" />
                <p>Slot machine preview would go here</p>
                <p className="text-sm">Test your slot machine configuration</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
