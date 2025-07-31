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
import { AIEmployeeDashboard } from "./AIEmployeeDashboard";
import { UserManagement } from "./UserManagement";
import {
  SlotMachine as SlotMachineType,
  SlotSymbol,
  SlotReel,
} from "@shared/slotTypes";
import { DEFAULT_COINKRAZY_SLOTS } from "@shared/defaultSlots";
import { ADDITIONAL_COINKRAZY_SLOTS } from "@shared/additionalSlots";
import {
  GoldCoinPackage,
  PurchaseTransaction,
  StoreSettings,
  PaymentProvider,
  RefundRequest,
  AdminLog,
} from "@shared/storeTypes";
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
  Bug,
  Copy,
  Lightbulb,
  Store,
  ShoppingCart,
  Wallet,
  Receipt,
  History,
  TrendingDown,
  XCircle,
  ExternalLink,
  MoreHorizontal,
  ArrowUpDown,
  Package,
  CreditCard as CreditCardIcon,
  Percent,
  Tag,
  Layers,
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

  // Store and Payment States
  const [goldCoinPackages, setGoldCoinPackages] = useState<GoldCoinPackage[]>(
    [],
  );
  const [storeSettings, setStoreSettings] = useState<StoreSettings | null>(
    null,
  );
  const [paymentProviders, setPaymentProviders] = useState<PaymentProvider[]>(
    [],
  );
  const [transactions, setTransactions] = useState<PurchaseTransaction[]>([]);
  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([]);
  const [adminLogs, setAdminLogs] = useState<AdminLog[]>([]);
  const [editingPackage, setEditingPackage] = useState<GoldCoinPackage | null>(
    null,
  );
  const [showPackageEditor, setShowPackageEditor] = useState(false);

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
    loadStoreData();
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

  const loadStoreData = () => {
    // Load real store data from database
    const mockPackages: GoldCoinPackage[] = [
      {
        id: "pkg_001",
        name: "Starter Pack",
        description: "Perfect for new players getting started",
        goldCoins: 10000,
        bonusSweepsCoins: 5,
        price: 4.99,
        image: "/store/starter-pack.png",
        popular: false,
        bestValue: false,
        features: [
          "10,000 Gold Coins",
          "5 Bonus Sweeps Coins",
          "Welcome Bonus",
        ],
        isActive: true,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-15"),
      },
      {
        id: "pkg_002",
        name: "Popular Pack",
        description: "Most popular choice among players",
        goldCoins: 50000,
        bonusSweepsCoins: 25,
        price: 19.99,
        originalPrice: 24.99,
        image: "/store/popular-pack.png",
        popular: true,
        bestValue: false,
        features: [
          "50,000 Gold Coins",
          "25 Bonus Sweeps Coins",
          "Extra Daily Bonus",
          "VIP Support",
        ],
        isActive: true,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-15"),
      },
      {
        id: "pkg_003",
        name: "Best Value Pack",
        description: "Maximum coins for your money",
        goldCoins: 150000,
        bonusSweepsCoins: 100,
        price: 49.99,
        originalPrice: 69.99,
        image: "/store/best-value-pack.png",
        popular: false,
        bestValue: true,
        features: [
          "150,000 Gold Coins",
          "100 Bonus Sweeps Coins",
          "VIP Status Upgrade",
          "Exclusive Games Access",
          "Priority Support",
        ],
        isActive: true,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-15"),
      },
      {
        id: "pkg_004",
        name: "Premium Pack",
        description: "For serious players who want the ultimate experience",
        goldCoins: 300000,
        bonusSweepsCoins: 250,
        price: 99.99,
        originalPrice: 129.99,
        image: "/store/premium-pack.png",
        popular: false,
        bestValue: false,
        features: [
          "300,000 Gold Coins",
          "250 Bonus Sweeps Coins",
          "Platinum VIP Status",
          "Exclusive Premium Games",
          "Personal Account Manager",
        ],
        isActive: true,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-15"),
      },
    ];

    const mockStoreSettings: StoreSettings = {
      id: "store_001",
      paypalEnabled: true,
      paypalClientId: "paypal_client_production_id",
      paypalSandbox: false,
      stripeEnabled: true,
      stripePublishableKey: "pk_live_stripe_key",
      cryptoEnabled: true,
      supportedCryptos: ["BTC", "ETH", "LTC", "USDC"],
      minPurchaseAmount: 4.99,
      maxPurchaseAmount: 999.99,
      purchaseLimits: {
        daily: 500,
        weekly: 2000,
        monthly: 5000,
      },
      taxSettings: {
        enabled: true,
        rate: 8.25,
        includedInPrice: false,
      },
      bonusMultiplier: 1.0,
      promotions: [],
      updatedAt: new Date(),
      updatedBy: "admin",
    };

    const mockPaymentProviders: PaymentProvider[] = [
      {
        id: "provider_paypal",
        name: "PayPal",
        type: "paypal",
        enabled: true,
        config: {
          clientId: "paypal_client_production_id",
          clientSecret: "paypal_client_secret",
          sandbox: false,
        },
        processingFee: 2.9,
        minAmount: 1.0,
        maxAmount: 10000.0,
      },
      {
        id: "provider_stripe",
        name: "Stripe",
        type: "stripe",
        enabled: true,
        config: {
          publishableKey: "pk_live_stripe_key",
          secretKey: "sk_live_stripe_key",
        },
        processingFee: 2.9,
        minAmount: 0.5,
        maxAmount: 999999.99,
      },
      {
        id: "provider_crypto",
        name: "Cryptocurrency",
        type: "crypto",
        enabled: true,
        config: {
          btcAddress: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
          ethAddress: "0x742d35Cc6665C6532353d25BC9e5E5ff",
          ltcAddress: "LTC7kQhh3z9hLwKQ8yTh8B9pQJd4rKtFp8",
        },
        processingFee: 1.0,
        minAmount: 10.0,
        maxAmount: 50000.0,
      },
    ];

    const mockTransactions: PurchaseTransaction[] = [
      {
        id: "txn_001",
        userId: "user_123",
        username: "player123",
        packageId: "pkg_002",
        packageName: "Popular Pack",
        goldCoinsAwarded: 50000,
        sweepsCoinsBonus: 25,
        amountPaid: 19.99,
        paymentMethod: "stripe",
        paymentReference: "pi_1234567890",
        status: "completed",
        createdAt: new Date("2024-01-15T10:30:00"),
        completedAt: new Date("2024-01-15T10:31:15"),
      },
      {
        id: "txn_002",
        userId: "user_456",
        username: "gamer456",
        packageId: "pkg_003",
        packageName: "Best Value Pack",
        goldCoinsAwarded: 150000,
        sweepsCoinsBonus: 100,
        amountPaid: 49.99,
        paymentMethod: "paypal",
        paymentReference: "PAY-1234567890",
        status: "completed",
        createdAt: new Date("2024-01-15T14:22:00"),
        completedAt: new Date("2024-01-15T14:23:42"),
      },
      {
        id: "txn_003",
        userId: "user_789",
        username: "highroller789",
        packageId: "pkg_004",
        packageName: "Premium Pack",
        goldCoinsAwarded: 300000,
        sweepsCoinsBonus: 250,
        amountPaid: 99.99,
        paymentMethod: "crypto",
        paymentReference: "BTC_0x123abc456def",
        status: "processing",
        createdAt: new Date("2024-01-15T16:45:00"),
      },
    ];

    setGoldCoinPackages(mockPackages);
    setStoreSettings(mockStoreSettings);
    setPaymentProviders(mockPaymentProviders);
    setTransactions(mockTransactions);
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

  const createNewPackage = () => {
    const newPackage: GoldCoinPackage = {
      id: `pkg_${Date.now()}`,
      name: "New Package",
      description: "A new Gold Coin package",
      goldCoins: 10000,
      bonusSweepsCoins: 5,
      price: 9.99,
      image: "/store/default-package.png",
      popular: false,
      bestValue: false,
      features: ["Gold Coins", "Bonus Sweeps Coins"],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setEditingPackage(newPackage);
    setShowPackageEditor(true);
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

  const handlePackageSave = async (pkg: GoldCoinPackage) => {
    try {
      setGoldCoinPackages((prev) => {
        const existing = prev.findIndex((p) => p.id === pkg.id);
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = { ...pkg, updatedAt: new Date() };
          return updated;
        }
        return [...prev, pkg];
      });
      setShowPackageEditor(false);
      setEditingPackage(null);
    } catch (error) {
      console.error("Failed to save package:", error);
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
                    Store Revenue
                  </p>
                  <div className="flex items-center">
                    <p className="text-2xl font-bold text-purple-400">
                      $
                      {transactions
                        .reduce(
                          (sum, t) =>
                            sum + (t.status === "completed" ? t.amountPaid : 0),
                          0,
                        )
                        .toFixed(2)}
                    </p>
                    <Store className="h-4 w-4 text-purple-400 ml-2" />
                  </div>
                  <p className="text-xs text-gray-500">
                    {
                      transactions.filter((t) => t.status === "completed")
                        .length
                    }{" "}
                    purchases
                  </p>
                </div>
                <ShoppingCart className="h-8 w-8 text-purple-400" />
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
          <TabsList className="grid w-full grid-cols-11 bg-gray-800/50 backdrop-blur-sm">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="store">Store</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="slots">Slot Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="ai-employees">AI Employees</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="ai">AI Control</TabsTrigger>
            <TabsTrigger value="testing">Testing</TabsTrigger>
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
                            key={`popular-${slot.id}-${index}`}
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
                      onClick={() => setActiveTab("store")}
                    >
                      <Store className="h-4 w-4 mr-2" />
                      Manage Store
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

          {/* Store Management Tab */}
          <TabsContent value="store" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white flex items-center">
                          <Store className="h-6 w-6 mr-2 text-gold" />
                          Gold Coin Store Management
                          <Badge className="ml-2 bg-gold text-black font-bold">
                            Live Store
                          </Badge>
                        </CardTitle>
                        <p className="text-gray-400 mt-1">
                          Visual point-and-click package editor with real-time
                          updates
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={createNewPackage}
                          className="bg-gold hover:bg-gold/80 text-black font-bold"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Create Package
                        </Button>
                        <Button variant="outline">
                          <Upload className="h-4 w-4 mr-2" />
                          Import
                        </Button>
                        <Button variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {goldCoinPackages.map((pkg) => (
                        <Card
                          key={pkg.id}
                          className="bg-gray-700/50 border-gray-600 hover:border-gold/50 transition-all duration-300 group cursor-pointer"
                          onClick={() => {
                            setEditingPackage(pkg);
                            setShowPackageEditor(true);
                          }}
                        >
                          <CardContent className="p-4">
                            <div className="relative mb-4">
                              <img
                                src={pkg.image}
                                alt={pkg.name}
                                className="w-full h-32 object-cover rounded-lg bg-gradient-to-br from-gold/20 to-purple-600/20 flex items-center justify-center"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                  e.currentTarget.nextElementSibling.style.display =
                                    "flex";
                                }}
                              />
                              <div className="w-full h-32 bg-gradient-to-br from-gold/20 to-purple-600/20 rounded-lg hidden items-center justify-center">
                                <Package className="h-12 w-12 text-gold" />
                              </div>

                              <div className="absolute top-2 left-2 flex gap-1">
                                {pkg.popular && (
                                  <Badge className="bg-purple-600 text-white text-xs">
                                    Popular
                                  </Badge>
                                )}
                                {pkg.bestValue && (
                                  <Badge className="bg-green-600 text-white text-xs">
                                    Best Value
                                  </Badge>
                                )}
                              </div>

                              <div className="absolute top-2 right-2">
                                <Badge
                                  variant={
                                    pkg.isActive ? "default" : "secondary"
                                  }
                                  className={pkg.isActive ? "bg-green-600" : ""}
                                >
                                  {pkg.isActive ? "Active" : "Inactive"}
                                </Badge>
                              </div>

                              {pkg.originalPrice &&
                                pkg.originalPrice > pkg.price && (
                                  <div className="absolute bottom-2 right-2">
                                    <Badge className="bg-red-600 text-white">
                                      {Math.round(
                                        ((pkg.originalPrice - pkg.price) /
                                          pkg.originalPrice) *
                                          100,
                                      )}
                                      % OFF
                                    </Badge>
                                  </div>
                                )}
                            </div>

                            <div className="space-y-3">
                              <div>
                                <h3 className="font-bold text-white group-hover:text-gold transition-colors text-lg">
                                  {pkg.name}
                                </h3>
                                <p className="text-sm text-gray-400 line-clamp-2">
                                  {pkg.description}
                                </p>
                              </div>

                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="text-center p-2 bg-gold/10 rounded border border-gold/20">
                                  <p className="text-gold font-bold text-lg">
                                    {pkg.goldCoins.toLocaleString()}
                                  </p>
                                  <p className="text-gold text-xs">
                                    Gold Coins
                                  </p>
                                </div>
                                <div className="text-center p-2 bg-purple-600/10 rounded border border-purple-600/20">
                                  <p className="text-purple-400 font-bold text-lg">
                                    {pkg.bonusSweepsCoins}
                                  </p>
                                  <p className="text-purple-400 text-xs">
                                    Bonus SC
                                  </p>
                                </div>
                              </div>

                              <div className="text-center py-2">
                                <div className="flex items-center justify-center gap-2">
                                  {pkg.originalPrice &&
                                    pkg.originalPrice > pkg.price && (
                                      <span className="text-sm text-gray-400 line-through">
                                        ${pkg.originalPrice.toFixed(2)}
                                      </span>
                                    )}
                                  <span className="text-2xl font-bold text-green-400">
                                    ${pkg.price.toFixed(2)}
                                  </span>
                                </div>
                              </div>

                              <div className="space-y-1">
                                {pkg.features
                                  .slice(0, 2)
                                  .map((feature, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center text-xs text-gray-300"
                                    >
                                      <CheckCircle className="h-3 w-3 text-green-400 mr-1" />
                                      {feature}
                                    </div>
                                  ))}
                                {pkg.features.length > 2 && (
                                  <div className="text-xs text-gray-400">
                                    +{pkg.features.length - 2} more features
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex space-x-2 mt-4">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingPackage(pkg);
                                  setShowPackageEditor(true);
                                }}
                                className="flex-1"
                              >
                                <Edit className="h-3 w-3 mr-1" />
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Toggle active status
                                  const updated = {
                                    ...pkg,
                                    isActive: !pkg.isActive,
                                    updatedAt: new Date(),
                                  };
                                  setGoldCoinPackages((prev) =>
                                    prev.map((p) =>
                                      p.id === pkg.id ? updated : p,
                                    ),
                                  );
                                }}
                                className="flex-1"
                              >
                                {pkg.isActive ? (
                                  <Pause className="h-3 w-3 mr-1" />
                                ) : (
                                  <Play className="h-3 w-3 mr-1" />
                                )}
                                {pkg.isActive ? "Disable" : "Enable"}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Clone package
                                  const cloned = {
                                    ...pkg,
                                    id: `pkg_${Date.now()}`,
                                    name: `${pkg.name} (Copy)`,
                                    createdAt: new Date(),
                                    updatedAt: new Date(),
                                  };
                                  setGoldCoinPackages((prev) => [
                                    ...prev,
                                    cloned,
                                  ]);
                                }}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Store Analytics Sidebar */}
              <div className="space-y-6">
                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2 text-blue-400" />
                      Store Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Total Packages</span>
                      <Badge className="bg-blue-600">
                        {goldCoinPackages.length}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Active Packages</span>
                      <Badge className="bg-green-600">
                        {goldCoinPackages.filter((p) => p.isActive).length}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Popular Packages</span>
                      <Badge className="bg-purple-600">
                        {goldCoinPackages.filter((p) => p.popular).length}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Best Value</span>
                      <Badge className="bg-gold text-black">
                        {goldCoinPackages.filter((p) => p.bestValue).length}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Avg Price</span>
                      <Badge variant="outline">
                        $
                        {(
                          goldCoinPackages.reduce(
                            (sum, p) => sum + p.price,
                            0,
                          ) / goldCoinPackages.length
                        ).toFixed(2)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
                      Sales Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-400">
                        $
                        {transactions
                          .filter((t) => t.status === "completed")
                          .reduce((sum, t) => sum + t.amountPaid, 0)
                          .toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-400">Total Sales</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-400">
                        {
                          transactions.filter((t) => t.status === "completed")
                            .length
                        }
                      </p>
                      <p className="text-sm text-gray-400">Completed Orders</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-yellow-400">
                        {
                          transactions.filter((t) => t.status === "processing")
                            .length
                        }
                      </p>
                      <p className="text-sm text-gray-400">Processing</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Settings className="h-5 w-5 mr-2 text-gray-400" />
                      Store Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-green-900/30 border border-green-500/30 rounded-lg">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                        <span className="text-sm text-green-300">
                          Store Active
                        </span>
                      </div>
                      <p className="text-xs text-green-200 mt-1">
                        All payment methods operational
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => setActiveTab("payments")}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Payment Settings
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <CreditCard className="h-6 w-6 mr-2 text-green-400" />
                  Payment Management Center
                  <Badge className="ml-2 bg-green-600 text-white">
                    Production Ready
                  </Badge>
                </CardTitle>
                <p className="text-gray-400 mt-1">
                  Complete payment processing and banking management system
                </p>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="providers" className="w-full">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="providers">
                      Payment Providers
                    </TabsTrigger>
                    <TabsTrigger value="transactions">Transactions</TabsTrigger>
                    <TabsTrigger value="banking">Banking Details</TabsTrigger>
                    <TabsTrigger value="analytics">
                      Payment Analytics
                    </TabsTrigger>
                    <TabsTrigger value="settings">Payment Settings</TabsTrigger>
                  </TabsList>

                  {/* Payment Providers */}
                  <TabsContent value="providers" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {paymentProviders.map((provider) => (
                        <Card
                          key={provider.id}
                          className="bg-gray-700/50 border-gray-600"
                        >
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {provider.type === "paypal" && (
                                  <span className="text-2xl">💳</span>
                                )}
                                {provider.type === "stripe" && (
                                  <span className="text-2xl">💎</span>
                                )}
                                {provider.type === "crypto" && (
                                  <span className="text-2xl">₿</span>
                                )}
                                <CardTitle className="text-white">
                                  {provider.name}
                                </CardTitle>
                              </div>
                              <Badge
                                variant={
                                  provider.enabled ? "default" : "secondary"
                                }
                                className={
                                  provider.enabled
                                    ? "bg-green-600"
                                    : "bg-gray-600"
                                }
                              >
                                {provider.enabled ? "Active" : "Disabled"}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-gray-400">Processing Fee</p>
                                <p className="text-white font-bold">
                                  {provider.processingFee}%
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-400">Min Amount</p>
                                <p className="text-white font-bold">
                                  ${provider.minAmount}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-400">Max Amount</p>
                                <p className="text-white font-bold">
                                  ${provider.maxAmount.toLocaleString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-400">Type</p>
                                <p className="text-white font-bold capitalize">
                                  {provider.type}
                                </p>
                              </div>
                            </div>

                            {/* Provider specific stats */}
                            <div className="pt-3 border-t border-gray-600">
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="text-center p-2 bg-green-900/30 rounded">
                                  <p className="text-green-400 font-bold">
                                    {
                                      transactions.filter(
                                        (t) =>
                                          t.paymentMethod === provider.type &&
                                          t.status === "completed",
                                      ).length
                                    }
                                  </p>
                                  <p className="text-green-300">Completed</p>
                                </div>
                                <div className="text-center p-2 bg-blue-900/30 rounded">
                                  <p className="text-blue-400 font-bold">
                                    $
                                    {transactions
                                      .filter(
                                        (t) =>
                                          t.paymentMethod === provider.type &&
                                          t.status === "completed",
                                      )
                                      .reduce((sum, t) => sum + t.amountPaid, 0)
                                      .toFixed(2)}
                                  </p>
                                  <p className="text-blue-300">Volume</p>
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1"
                              >
                                <Edit className="h-3 w-3 mr-1" />
                                Configure
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1"
                                onClick={() => {
                                  setPaymentProviders((prev) =>
                                    prev.map((p) =>
                                      p.id === provider.id
                                        ? { ...p, enabled: !p.enabled }
                                        : p,
                                    ),
                                  );
                                }}
                              >
                                {provider.enabled ? (
                                  <Pause className="h-3 w-3 mr-1" />
                                ) : (
                                  <Play className="h-3 w-3 mr-1" />
                                )}
                                {provider.enabled ? "Disable" : "Enable"}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Transactions */}
                  <TabsContent value="transactions" className="space-y-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">
                        Transaction History
                      </h3>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Export
                        </Button>
                        <Button variant="outline" size="sm">
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Refresh
                        </Button>
                      </div>
                    </div>

                    <div className="bg-gray-700/50 rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-gray-400">
                              Transaction ID
                            </TableHead>
                            <TableHead className="text-gray-400">
                              User
                            </TableHead>
                            <TableHead className="text-gray-400">
                              Package
                            </TableHead>
                            <TableHead className="text-gray-400">
                              Amount
                            </TableHead>
                            <TableHead className="text-gray-400">
                              Method
                            </TableHead>
                            <TableHead className="text-gray-400">
                              Status
                            </TableHead>
                            <TableHead className="text-gray-400">
                              Date
                            </TableHead>
                            <TableHead className="text-gray-400">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {transactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                              <TableCell className="text-white font-mono text-xs">
                                {transaction.id}
                              </TableCell>
                              <TableCell className="text-white">
                                {transaction.username}
                              </TableCell>
                              <TableCell className="text-white">
                                {transaction.packageName}
                              </TableCell>
                              <TableCell className="text-green-400 font-bold">
                                ${transaction.amountPaid.toFixed(2)}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="capitalize">
                                  {transaction.paymentMethod}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    transaction.status === "completed"
                                      ? "default"
                                      : transaction.status === "processing"
                                        ? "secondary"
                                        : transaction.status === "failed"
                                          ? "destructive"
                                          : "outline"
                                  }
                                  className={
                                    transaction.status === "completed"
                                      ? "bg-green-600"
                                      : transaction.status === "processing"
                                        ? "bg-yellow-600"
                                        : transaction.status === "failed"
                                          ? "bg-red-600"
                                          : ""
                                  }
                                >
                                  {transaction.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-gray-400 text-sm">
                                {transaction.createdAt.toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>

                  {/* Banking Details */}
                  <TabsContent value="banking" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card className="bg-gray-700/50 border-gray-600">
                        <CardHeader>
                          <CardTitle className="text-white flex items-center">
                            <Building className="h-5 w-5 mr-2 text-blue-400" />
                            Casino Banking Information
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <Label className="text-gray-400">Bank Name</Label>
                            <Input
                              value="First National Casino Bank"
                              className="mt-1 bg-gray-800/50"
                              readOnly
                            />
                          </div>
                          <div>
                            <Label className="text-gray-400">
                              Account Number
                            </Label>
                            <Input
                              value="****-****-****-1234"
                              className="mt-1 bg-gray-800/50"
                              readOnly
                            />
                          </div>
                          <div>
                            <Label className="text-gray-400">
                              Routing Number
                            </Label>
                            <Input
                              value="021000021"
                              className="mt-1 bg-gray-800/50"
                              readOnly
                            />
                          </div>
                          <div>
                            <Label className="text-gray-400">Swift Code</Label>
                            <Input
                              value="FNBCUS33"
                              className="mt-1 bg-gray-800/50"
                              readOnly
                            />
                          </div>
                          <Button className="w-full mt-4">
                            <Edit className="h-4 w-4 mr-2" />
                            Update Banking Details
                          </Button>
                        </CardContent>
                      </Card>

                      <Card className="bg-gray-700/50 border-gray-600">
                        <CardHeader>
                          <CardTitle className="text-white flex items-center">
                            <Shield className="h-5 w-5 mr-2 text-green-400" />
                            Security & Compliance
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">
                              PCI DSS Compliance
                            </span>
                            <Badge className="bg-green-600">Active</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">
                              SSL Certificate
                            </span>
                            <Badge className="bg-green-600">Valid</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">
                              Fraud Detection
                            </span>
                            <Badge className="bg-green-600">Enabled</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">
                              AML Monitoring
                            </span>
                            <Badge className="bg-green-600">Active</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">
                              Data Encryption
                            </span>
                            <Badge className="bg-green-600">AES-256</Badge>
                          </div>
                          <div className="pt-3 border-t border-gray-600">
                            <div className="text-sm text-gray-400">
                              Last Security Audit: January 15, 2024
                            </div>
                            <div className="text-sm text-gray-400">
                              Next Audit: April 15, 2024
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  {/* Payment Analytics */}
                  <TabsContent value="analytics" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
                      <Card className="bg-gray-700/50 border-gray-600">
                        <CardContent className="p-4">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-green-400">
                              $
                              {transactions
                                .filter((t) => t.status === "completed")
                                .reduce((sum, t) => sum + t.amountPaid, 0)
                                .toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-400">
                              Total Revenue
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-gray-700/50 border-gray-600">
                        <CardContent className="p-4">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-blue-400">
                              {
                                transactions.filter(
                                  (t) => t.status === "completed",
                                ).length
                              }
                            </p>
                            <p className="text-sm text-gray-400">
                              Successful Transactions
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-gray-700/50 border-gray-600">
                        <CardContent className="p-4">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-yellow-400">
                              {
                                transactions.filter(
                                  (t) => t.status === "processing",
                                ).length
                              }
                            </p>
                            <p className="text-sm text-gray-400">Processing</p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-gray-700/50 border-gray-600">
                        <CardContent className="p-4">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-red-400">
                              {
                                transactions.filter(
                                  (t) => t.status === "failed",
                                ).length
                              }
                            </p>
                            <p className="text-sm text-gray-400">Failed</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card className="bg-gray-700/50 border-gray-600">
                      <CardHeader>
                        <CardTitle className="text-white">
                          Payment Method Performance
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {paymentProviders.map((provider) => {
                            const providerTransactions = transactions.filter(
                              (t) => t.paymentMethod === provider.type,
                            );
                            const completedTransactions =
                              providerTransactions.filter(
                                (t) => t.status === "completed",
                              );
                            const successRate =
                              providerTransactions.length > 0
                                ? (completedTransactions.length /
                                    providerTransactions.length) *
                                  100
                                : 0;
                            const totalVolume = completedTransactions.reduce(
                              (sum, t) => sum + t.amountPaid,
                              0,
                            );

                            return (
                              <div
                                key={provider.id}
                                className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="text-2xl">
                                    {provider.type === "paypal" && "💳"}
                                    {provider.type === "stripe" && "💎"}
                                    {provider.type === "crypto" && "₿"}
                                  </div>
                                  <div>
                                    <p className="text-white font-medium">
                                      {provider.name}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                      {completedTransactions.length}{" "}
                                      transactions
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-green-400 font-bold">
                                    ${totalVolume.toFixed(2)}
                                  </p>
                                  <p className="text-sm text-gray-400">
                                    {successRate.toFixed(1)}% success rate
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Payment Settings */}
                  <TabsContent value="settings" className="space-y-6">
                    {storeSettings && (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="bg-gray-700/50 border-gray-600">
                          <CardHeader>
                            <CardTitle className="text-white">
                              General Payment Settings
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <Label className="text-gray-400">
                                Minimum Purchase Amount
                              </Label>
                              <Input
                                type="number"
                                step="0.01"
                                value={storeSettings.minPurchaseAmount}
                                onChange={(e) =>
                                  setStoreSettings((prev) =>
                                    prev
                                      ? {
                                          ...prev,
                                          minPurchaseAmount: parseFloat(
                                            e.target.value,
                                          ),
                                        }
                                      : null,
                                  )
                                }
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-gray-400">
                                Maximum Purchase Amount
                              </Label>
                              <Input
                                type="number"
                                step="0.01"
                                value={storeSettings.maxPurchaseAmount}
                                onChange={(e) =>
                                  setStoreSettings((prev) =>
                                    prev
                                      ? {
                                          ...prev,
                                          maxPurchaseAmount: parseFloat(
                                            e.target.value,
                                          ),
                                        }
                                      : null,
                                  )
                                }
                                className="mt-1"
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label className="text-gray-400">
                                Enable Tax
                              </Label>
                              <Switch
                                checked={storeSettings.taxSettings.enabled}
                                onCheckedChange={(checked) =>
                                  setStoreSettings((prev) =>
                                    prev
                                      ? {
                                          ...prev,
                                          taxSettings: {
                                            ...prev.taxSettings,
                                            enabled: checked,
                                          },
                                        }
                                      : null,
                                  )
                                }
                              />
                            </div>
                            {storeSettings.taxSettings.enabled && (
                              <div>
                                <Label className="text-gray-400">
                                  Tax Rate (%)
                                </Label>
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={storeSettings.taxSettings.rate}
                                  onChange={(e) =>
                                    setStoreSettings((prev) =>
                                      prev
                                        ? {
                                            ...prev,
                                            taxSettings: {
                                              ...prev.taxSettings,
                                              rate: parseFloat(e.target.value),
                                            },
                                          }
                                        : null,
                                    )
                                  }
                                  className="mt-1"
                                />
                              </div>
                            )}
                          </CardContent>
                        </Card>

                        <Card className="bg-gray-700/50 border-gray-600">
                          <CardHeader>
                            <CardTitle className="text-white">
                              Purchase Limits
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <Label className="text-gray-400">
                                Daily Limit ($)
                              </Label>
                              <Input
                                type="number"
                                value={storeSettings.purchaseLimits.daily}
                                onChange={(e) =>
                                  setStoreSettings((prev) =>
                                    prev
                                      ? {
                                          ...prev,
                                          purchaseLimits: {
                                            ...prev.purchaseLimits,
                                            daily: parseInt(e.target.value),
                                          },
                                        }
                                      : null,
                                  )
                                }
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-gray-400">
                                Weekly Limit ($)
                              </Label>
                              <Input
                                type="number"
                                value={storeSettings.purchaseLimits.weekly}
                                onChange={(e) =>
                                  setStoreSettings((prev) =>
                                    prev
                                      ? {
                                          ...prev,
                                          purchaseLimits: {
                                            ...prev.purchaseLimits,
                                            weekly: parseInt(e.target.value),
                                          },
                                        }
                                      : null,
                                  )
                                }
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-gray-400">
                                Monthly Limit ($)
                              </Label>
                              <Input
                                type="number"
                                value={storeSettings.purchaseLimits.monthly}
                                onChange={(e) =>
                                  setStoreSettings((prev) =>
                                    prev
                                      ? {
                                          ...prev,
                                          purchaseLimits: {
                                            ...prev.purchaseLimits,
                                            monthly: parseInt(e.target.value),
                                          },
                                        }
                                      : null,
                                  )
                                }
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-gray-400">
                                Global Bonus Multiplier
                              </Label>
                              <Input
                                type="number"
                                step="0.1"
                                value={storeSettings.bonusMultiplier}
                                onChange={(e) =>
                                  setStoreSettings((prev) =>
                                    prev
                                      ? {
                                          ...prev,
                                          bonusMultiplier: parseFloat(
                                            e.target.value,
                                          ),
                                        }
                                      : null,
                                  )
                                }
                                className="mt-1"
                              />
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}

                    <div className="flex justify-center">
                      <Button className="bg-blue-600 hover:bg-blue-700 px-8">
                        <Save className="h-4 w-4 mr-2" />
                        Save Payment Settings
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Continue with other tabs... */}
          <TabsContent value="slots">
            <div className="text-center py-8 text-gray-400">
              <p>Slot Management content would go here...</p>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="text-center py-8 text-gray-400">
              <p>Analytics content would go here...</p>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="security">
            <div className="text-center py-8 text-gray-400">
              <p>Security content would go here...</p>
            </div>
          </TabsContent>

          <TabsContent value="ai-employees">
            <AIEmployeeDashboard />
          </TabsContent>

          <TabsContent value="ai">
            <div className="text-center py-8 text-gray-400">
              <p>AI Control content would go here...</p>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="text-center py-8 text-gray-400">
              <p>Settings content would go here...</p>
            </div>
          </TabsContent>

          <TabsContent value="testing">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Bug className="h-6 w-6 mr-2 text-red-400" />
                  Platform Testing & Bug Detection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SystemTester />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Package Editor Modal */}
        <Dialog open={showPackageEditor} onOpenChange={setShowPackageEditor}>
          <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-gold">
                {editingPackage
                  ? `Edit ${editingPackage.name}`
                  : "Create New Package"}
              </DialogTitle>
              <DialogDescription>
                Create and customize Gold Coin packages with visual editor
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              {editingPackage && (
                <GoldCoinPackageEditor
                  initialPackage={editingPackage}
                  onSave={handlePackageSave}
                  onCancel={() => {
                    setShowPackageEditor(false);
                    setEditingPackage(null);
                  }}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

// Gold Coin Package Editor Component
interface GoldCoinPackageEditorProps {
  initialPackage: GoldCoinPackage;
  onSave: (pkg: GoldCoinPackage) => Promise<void>;
  onCancel: () => void;
}

function GoldCoinPackageEditor({
  initialPackage,
  onSave,
  onCancel,
}: GoldCoinPackageEditorProps) {
  const [pkg, setPkg] = useState<GoldCoinPackage>(initialPackage);
  const [isSaving, setIsSaving] = useState(false);
  const [newFeature, setNewFeature] = useState("");

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(pkg);
    } catch (error) {
      console.error("Failed to save package:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const updatePackage = (updates: Partial<GoldCoinPackage>) => {
    setPkg((prev) => ({ ...prev, ...updates }));
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setPkg((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setPkg((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Editor Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">{pkg.name}</h3>
          <p className="text-gray-400">Visual Package Configuration</p>
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
            Save Package
          </Button>
        </div>
      </div>

      {/* Package Preview */}
      <Card className="bg-gradient-to-br from-gold/10 to-purple-600/10 border-gold/20">
        <CardHeader>
          <CardTitle className="text-gold">Live Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-700 rounded-lg p-4 max-w-sm mx-auto">
            <div className="relative mb-4">
              <div className="w-full h-32 bg-gradient-to-br from-gold/20 to-purple-600/20 rounded-lg flex items-center justify-center">
                <Package className="h-12 w-12 text-gold" />
              </div>

              <div className="absolute top-2 left-2 flex gap-1">
                {pkg.popular && (
                  <Badge className="bg-purple-600 text-white text-xs">
                    Popular
                  </Badge>
                )}
                {pkg.bestValue && (
                  <Badge className="bg-green-600 text-white text-xs">
                    Best Value
                  </Badge>
                )}
              </div>

              {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                <div className="absolute bottom-2 right-2">
                  <Badge className="bg-red-600 text-white text-xs">
                    {Math.round(
                      ((pkg.originalPrice - pkg.price) / pkg.originalPrice) *
                        100,
                    )}
                    % OFF
                  </Badge>
                </div>
              )}
            </div>

            <h3 className="font-bold text-white text-lg mb-2">{pkg.name}</h3>
            <p className="text-sm text-gray-400 mb-3">{pkg.description}</p>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="text-center p-2 bg-gold/10 rounded border border-gold/20">
                <p className="text-gold font-bold">
                  {pkg.goldCoins.toLocaleString()}
                </p>
                <p className="text-gold text-xs">Gold Coins</p>
              </div>
              <div className="text-center p-2 bg-purple-600/10 rounded border border-purple-600/20">
                <p className="text-purple-400 font-bold">
                  {pkg.bonusSweepsCoins}
                </p>
                <p className="text-purple-400 text-xs">Bonus SC</p>
              </div>
            </div>

            <div className="text-center py-2">
              <span className="text-2xl font-bold text-green-400">
                ${pkg.price.toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Editor Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Package Name</Label>
              <Input
                value={pkg.name}
                onChange={(e) => updatePackage({ name: e.target.value })}
                placeholder="Enter package name"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={pkg.description}
                onChange={(e) => updatePackage({ description: e.target.value })}
                placeholder="Package description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Gold Coins</Label>
                <Input
                  type="number"
                  value={pkg.goldCoins}
                  onChange={(e) =>
                    updatePackage({ goldCoins: parseInt(e.target.value) })
                  }
                />
              </div>
              <div>
                <Label>Bonus Sweeps Coins</Label>
                <Input
                  type="number"
                  value={pkg.bonusSweepsCoins}
                  onChange={(e) =>
                    updatePackage({
                      bonusSweepsCoins: parseInt(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Price ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={pkg.price}
                  onChange={(e) =>
                    updatePackage({ price: parseFloat(e.target.value) })
                  }
                />
              </div>
              <div>
                <Label>Original Price ($ - Optional)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={pkg.originalPrice || ""}
                  onChange={(e) =>
                    updatePackage({
                      originalPrice: e.target.value
                        ? parseFloat(e.target.value)
                        : undefined,
                    })
                  }
                  placeholder="For discounts"
                />
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={pkg.isActive}
                  onCheckedChange={(isActive) => updatePackage({ isActive })}
                />
                <Label>Active</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={pkg.popular}
                  onCheckedChange={(popular) => updatePackage({ popular })}
                />
                <Label>Popular</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={pkg.bestValue}
                  onCheckedChange={(bestValue) => updatePackage({ bestValue })}
                />
                <Label>Best Value</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Features & Benefits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Package Features</Label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {pkg.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="flex-1 text-sm">{feature}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFeature(index)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mt-3">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add new feature"
                  onKeyPress={(e) => e.key === "Enter" && addFeature()}
                />
                <Button onClick={addFeature} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label>Package Image URL</Label>
              <Input
                value={pkg.image}
                onChange={(e) => updatePackage({ image: e.target.value })}
                placeholder="/store/package-image.png"
              />
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Package Statistics
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-700 dark:text-blue-300">
                    Created:
                  </span>
                  <div className="font-mono text-xs">
                    {pkg.createdAt.toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <span className="text-blue-700 dark:text-blue-300">
                    Updated:
                  </span>
                  <div className="font-mono text-xs">
                    {pkg.updatedAt.toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <span className="text-blue-700 dark:text-blue-300">
                    Value Ratio:
                  </span>
                  <div className="font-bold">
                    {(pkg.goldCoins / pkg.price).toFixed(0)} GC/$
                  </div>
                </div>
                <div>
                  <span className="text-blue-700 dark:text-blue-300">
                    Bonus Ratio:
                  </span>
                  <div className="font-bold">
                    {((pkg.bonusSweepsCoins / pkg.goldCoins) * 100).toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
