import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useAuth } from "./AuthContext";
import {
  Users,
  User,
  Search,
  Filter,
  Download,
  Upload,
  Edit,
  Trash2,
  Lock,
  Unlock,
  Shield,
  Crown,
  Star,
  Calendar,
  Activity,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  Minus,
  Eye,
  EyeOff,
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Banknote,
  CreditCard,
  Gift,
  Award,
  Target,
  Gamepad2,
} from "lucide-react";

interface UserProfile {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  avatar?: string;
  status: "active" | "suspended" | "banned" | "pending_verification";
  role: "user" | "vip" | "staff" | "admin";
  vipLevel: "none" | "bronze" | "silver" | "gold" | "platinum" | "diamond";
  createdAt: Date;
  lastLoginAt?: Date;
  lastActivityAt?: Date;
  emailVerified: boolean;
  phoneVerified: boolean;
  kycStatus: "none" | "pending" | "approved" | "rejected";
  balances: {
    goldCoins: number;
    sweepsCoins: number;
    vipPoints: number;
  };
  statistics: {
    totalDeposited: number;
    totalWithdrawn: number;
    totalWagered: number;
    totalWon: number;
    gamesPlayed: number;
    favoriteGame: string;
    winRate: number;
    currentStreak: number;
    biggestWin: number;
    averageBet: number;
  };
  preferences: {
    notifications: boolean;
    emailMarketing: boolean;
    soundEffects: boolean;
    theme: "light" | "dark";
    language: string;
    currency: string;
    autoPlay: boolean;
  };
  restrictions: {
    dailyDepositLimit: number;
    weeklyDepositLimit: number;
    monthlyDepositLimit: number;
    sessionTimeLimit: number;
    coolingOffPeriod?: Date;
    selfExcluded: boolean;
  };
  notes: {
    id: string;
    content: string;
    author: string;
    timestamp: Date;
    type: "general" | "warning" | "escalation" | "resolution";
  }[];
}

interface UserManagementStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  suspendedUsers: number;
  vipUsers: number;
  onlineUsers: number;
  averageSessionTime: number;
  totalDeposits: number;
  totalWithdrawals: number;
  pendingKYC: number;
  flaggedAccounts: number;
}

export function UserManagementSystem() {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [stats, setStats] = useState<UserManagementStats>({
    totalUsers: 15473,
    activeUsers: 8567,
    newUsersToday: 247,
    newUsersThisWeek: 1834,
    suspendedUsers: 23,
    vipUsers: 1245,
    onlineUsers: 2156,
    averageSessionTime: 45.5,
    totalDeposits: 2847923.45,
    totalWithdrawals: 1234567.89,
    pendingKYC: 156,
    flaggedAccounts: 12,
  });

  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRole, setFilterRole] = useState("all");
  const [sortBy, setSortBy] = useState("lastActivity");
  const [isLoading, setIsLoading] = useState(false);

  const [balanceAction, setBalanceAction] = useState<"credit" | "debit">(
    "credit",
  );
  const [balanceAmount, setBalanceAmount] = useState("");
  const [balanceCurrency, setBalanceCurrency] = useState<
    "goldCoins" | "sweepsCoins" | "vipPoints"
  >("goldCoins");
  const [balanceReason, setBalanceReason] = useState("");

  useEffect(() => {
    loadUsers();
    loadStats();

    // Set up real-time updates
    const interval = setInterval(() => {
      updateRealTimeData();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const loadUsers = () => {
    // Simulated user data
    const userData: UserProfile[] = [
      {
        id: "user_001",
        username: "SlotMaster97",
        email: "slotmaster97@example.com",
        firstName: "John",
        lastName: "Smith",
        phoneNumber: "+1-555-0123",
        dateOfBirth: new Date("1985-06-15"),
        address: {
          street: "123 Main St",
          city: "Las Vegas",
          state: "NV",
          country: "USA",
          zipCode: "89101",
        },
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SlotMaster97",
        status: "active",
        role: "vip",
        vipLevel: "gold",
        createdAt: new Date("2023-01-15"),
        lastLoginAt: new Date(),
        lastActivityAt: new Date(Date.now() - 300000),
        emailVerified: true,
        phoneVerified: true,
        kycStatus: "approved",
        balances: {
          goldCoins: 15678,
          sweepsCoins: 23.45,
          vipPoints: 567,
        },
        statistics: {
          totalDeposited: 2456.78,
          totalWithdrawn: 1234.56,
          totalWagered: 12456.78,
          totalWon: 8934.56,
          gamesPlayed: 1247,
          favoriteGame: "Royal Fortune",
          winRate: 71.8,
          currentStreak: 5,
          biggestWin: 8945.6,
          averageBet: 9.99,
        },
        preferences: {
          notifications: true,
          emailMarketing: true,
          soundEffects: true,
          theme: "dark",
          language: "en-US",
          currency: "USD",
          autoPlay: false,
        },
        restrictions: {
          dailyDepositLimit: 500,
          weeklyDepositLimit: 2500,
          monthlyDepositLimit: 10000,
          sessionTimeLimit: 180,
          selfExcluded: false,
        },
        notes: [
          {
            id: "note_001",
            content: "VIP player with excellent history. No issues.",
            author: "AdminUser",
            timestamp: new Date("2024-01-10"),
            type: "general",
          },
          {
            id: "note_002",
            content: "Requested higher deposit limits - approved.",
            author: "StaffMember",
            timestamp: new Date("2024-02-15"),
            type: "resolution",
          },
        ],
      },
      {
        id: "user_002",
        username: "LuckySpinner",
        email: "luckyspinner@example.com",
        firstName: "Sarah",
        lastName: "Johnson",
        status: "active",
        role: "user",
        vipLevel: "silver",
        createdAt: new Date("2023-06-20"),
        lastLoginAt: new Date(Date.now() - 1800000),
        lastActivityAt: new Date(Date.now() - 1800000),
        emailVerified: true,
        phoneVerified: false,
        kycStatus: "pending",
        balances: {
          goldCoins: 8934,
          sweepsCoins: 12.89,
          vipPoints: 234,
        },
        statistics: {
          totalDeposited: 967.43,
          totalWithdrawn: 456.78,
          totalWagered: 5467.89,
          totalWon: 4123.45,
          gamesPlayed: 689,
          favoriteGame: "Lucky Sevens",
          winRate: 75.4,
          currentStreak: 3,
          biggestWin: 2345.67,
          averageBet: 7.94,
        },
        preferences: {
          notifications: true,
          emailMarketing: false,
          soundEffects: true,
          theme: "dark",
          language: "en-US",
          currency: "USD",
          autoPlay: true,
        },
        restrictions: {
          dailyDepositLimit: 300,
          weeklyDepositLimit: 1500,
          monthlyDepositLimit: 6000,
          sessionTimeLimit: 120,
          selfExcluded: false,
        },
        notes: [
          {
            id: "note_003",
            content: "KYC documents submitted, pending review.",
            author: "AdminUser",
            timestamp: new Date(),
            type: "general",
          },
        ],
      },
      {
        id: "user_003",
        username: "HighRoller88",
        email: "highroller88@example.com",
        firstName: "Michael",
        lastName: "Davis",
        status: "suspended",
        role: "user",
        vipLevel: "platinum",
        createdAt: new Date("2022-11-08"),
        lastLoginAt: new Date(Date.now() - 259200000),
        lastActivityAt: new Date(Date.now() - 259200000),
        emailVerified: true,
        phoneVerified: true,
        kycStatus: "approved",
        balances: {
          goldCoins: 234567,
          sweepsCoins: 456.78,
          vipPoints: 1234,
        },
        statistics: {
          totalDeposited: 15678.9,
          totalWithdrawn: 8934.56,
          totalWagered: 78945.67,
          totalWon: 56789.12,
          gamesPlayed: 3456,
          favoriteGame: "Diamond Dreams",
          winRate: 71.9,
          currentStreak: 0,
          biggestWin: 25000.0,
          averageBet: 22.84,
        },
        preferences: {
          notifications: false,
          emailMarketing: false,
          soundEffects: false,
          theme: "light",
          language: "en-US",
          currency: "USD",
          autoPlay: false,
        },
        restrictions: {
          dailyDepositLimit: 1000,
          weeklyDepositLimit: 5000,
          monthlyDepositLimit: 20000,
          sessionTimeLimit: 240,
          coolingOffPeriod: new Date(Date.now() + 604800000),
          selfExcluded: false,
        },
        notes: [
          {
            id: "note_004",
            content:
              "Temporarily suspended due to excessive play time. Cooling off period applied.",
            author: "AdminUser",
            timestamp: new Date(Date.now() - 86400000),
            type: "warning",
          },
          {
            id: "note_005",
            content:
              "Player contacted support requesting help with gambling habits.",
            author: "SupportTeam",
            timestamp: new Date(Date.now() - 172800000),
            type: "escalation",
          },
        ],
      },
    ];

    setUsers(userData);
  };

  const loadStats = () => {
    // In a real app, this would fetch from an API
    // Stats are already initialized in useState
  };

  const updateRealTimeData = () => {
    // Simulate real-time updates
    setStats((prev) => ({
      ...prev,
      onlineUsers: Math.floor(Math.random() * 500) + 2000,
      newUsersToday: prev.newUsersToday + Math.floor(Math.random() * 5),
    }));

    // Update last activity for some users
    setUsers((prev) =>
      prev.map((user) => {
        if (Math.random() < 0.1) {
          // 10% chance of activity update
          return {
            ...user,
            lastActivityAt: new Date(),
          };
        }
        return user;
      }),
    );
  };

  const handleBalanceUpdate = async () => {
    if (!selectedUser || !balanceAmount || !balanceReason) return;

    setIsLoading(true);

    const amount = parseFloat(balanceAmount);
    const isCredit = balanceAction === "credit";

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Update user balance
    setUsers((prev) =>
      prev.map((u) =>
        u.id === selectedUser.id
          ? {
              ...u,
              balances: {
                ...u.balances,
                [balanceCurrency]: isCredit
                  ? u.balances[balanceCurrency] + amount
                  : u.balances[balanceCurrency] - amount,
              },
              notes: [
                {
                  id: `note_${Date.now()}`,
                  content: `${isCredit ? "Credited" : "Debited"} ${amount} ${balanceCurrency} - ${balanceReason}`,
                  author: user?.username || "AdminUser",
                  timestamp: new Date(),
                  type: "general",
                },
                ...u.notes,
              ],
            }
          : u,
      ),
    );

    setIsLoading(false);
    setShowBalanceModal(false);
    setBalanceAmount("");
    setBalanceReason("");
  };

  const handleUserStatusChange = async (userId: string, newStatus: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, status: newStatus as any } : u,
      ),
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-600";
      case "suspended":
        return "bg-yellow-600";
      case "banned":
        return "bg-red-600";
      case "pending_verification":
        return "bg-blue-600";
      default:
        return "bg-gray-600";
    }
  };

  const getVIPLevelColor = (level: string) => {
    switch (level) {
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
        return "bg-gray-500";
    }
  };

  const getKYCStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.firstName &&
        user.firstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.lastName &&
        user.lastName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      filterStatus === "all" || user.status === filterStatus;
    const matchesRole = filterRole === "all" || user.role === filterRole;

    return matchesSearch && matchesStatus && matchesRole;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    switch (sortBy) {
      case "username":
        return a.username.localeCompare(b.username);
      case "createdAt":
        return b.createdAt.getTime() - a.createdAt.getTime();
      case "lastActivity":
        const aActivity = a.lastActivityAt || new Date(0);
        const bActivity = b.lastActivityAt || new Date(0);
        return bActivity.getTime() - aActivity.getTime();
      case "totalDeposited":
        return (
          (b.statistics?.totalDeposited || 0) -
          (a.statistics?.totalDeposited || 0)
        );
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-500">
              {stats.totalUsers.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">Total Users</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <Activity className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-500">
              {stats.onlineUsers.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">Online Now</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-500">
              {stats.newUsersToday.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">New Today</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <Crown className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-500">
              {stats.vipUsers.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">VIP Users</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">User List</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="kyc">KYC Management</TabsTrigger>
          <TabsTrigger value="settings">User Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          {/* Filters and Search */}
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="banned">Banned</SelectItem>
                      <SelectItem value="pending_verification">
                        Pending
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Select value={filterRole} onValueChange={setFilterRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="vip">VIP</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lastActivity">
                        Last Activity
                      </SelectItem>
                      <SelectItem value="username">Username</SelectItem>
                      <SelectItem value="createdAt">Join Date</SelectItem>
                      <SelectItem value="totalDeposited">
                        Total Deposited
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User List */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="w-5 h-5" />
                User Management
                <Badge className="ml-auto">{sortedUsers.length} users</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sortedUsers.map((user) => (
                  <div key={user.id} className="p-4 bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="text-white font-medium flex items-center gap-2">
                            {user.username}
                            {user.emailVerified && (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            )}
                            {user.role === "admin" && (
                              <Crown className="w-4 h-4 text-yellow-500" />
                            )}
                            {user.role === "staff" && (
                              <Shield className="w-4 h-4 text-blue-500" />
                            )}
                          </div>
                          <div className="text-gray-400 text-sm">
                            {user.email}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getStatusColor(user.status)}>
                              {user.status.replace("_", " ")}
                            </Badge>
                            <Badge className={getVIPLevelColor(user.vipLevel)}>
                              {user.vipLevel}
                            </Badge>
                            <div className="flex items-center gap-1">
                              {getKYCStatusIcon(user.kycStatus)}
                              <span className="text-xs text-gray-400">KYC</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-bold">
                          {user.balances.goldCoins.toLocaleString()} GC
                        </div>
                        <div className="text-green-400 font-medium">
                          {user.balances.sweepsCoins.toFixed(2)} SC
                        </div>
                        <div className="text-purple-400 text-sm">
                          {user.balances.vipPoints} VIP
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                      <div>
                        <div className="text-gray-400">Total Deposited</div>
                        <div className="text-white font-medium">
                          $
                          {user.statistics?.totalDeposited?.toLocaleString() ||
                            "0"}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-400">Games Played</div>
                        <div className="text-white font-medium">
                          {user.statistics?.gamesPlayed?.toLocaleString() ||
                            "0"}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-400">Win Rate</div>
                        <div className="text-white font-medium">
                          {user.statistics?.winRate?.toFixed(1) || "0"}%
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-400">Last Activity</div>
                        <div className="text-white font-medium">
                          {user.lastActivityAt
                            ? new Date(user.lastActivityAt).toLocaleDateString()
                            : "Never"}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowUserModal(true);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowBalanceModal(true);
                        }}
                      >
                        <DollarSign className="w-4 h-4 mr-2" />
                        Adjust Balance
                      </Button>
                      {user.status === "active" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-yellow-600 text-yellow-400 hover:bg-yellow-600 hover:text-white"
                          onClick={() =>
                            handleUserStatusChange(user.id, "suspended")
                          }
                        >
                          <Lock className="w-4 h-4 mr-2" />
                          Suspend
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white"
                          onClick={() =>
                            handleUserStatusChange(user.id, "active")
                          }
                        >
                          <Unlock className="w-4 h-4 mr-2" />
                          Activate
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">User Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">This Week</span>
                    <span className="text-white font-bold">
                      +{stats.newUsersThisWeek}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Average Session</span>
                    <span className="text-white font-bold">
                      {stats.averageSessionTime} min
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Total Deposits</span>
                    <span className="text-white font-bold">
                      ${stats.totalDeposits.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Pending KYC</span>
                    <span className="text-white font-bold">
                      {stats.pendingKYC}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">
                  Account Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-600 rounded"></div>
                      <span className="text-gray-400">Active</span>
                    </div>
                    <span className="text-white font-bold">
                      {stats.activeUsers.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-600 rounded"></div>
                      <span className="text-gray-400">Suspended</span>
                    </div>
                    <span className="text-white font-bold">
                      {stats.suspendedUsers}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-600 rounded"></div>
                      <span className="text-gray-400">VIP</span>
                    </div>
                    <span className="text-white font-bold">
                      {stats.vipUsers.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-600 rounded"></div>
                      <span className="text-gray-400">Flagged</span>
                    </div>
                    <span className="text-white font-bold">
                      {stats.flaggedAccounts}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="kyc" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">KYC Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Shield className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  KYC Verification System
                </h3>
                <p className="text-gray-400 mb-6">
                  Comprehensive KYC management and verification system coming
                  soon.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-gray-700 border-gray-600">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-500">
                        {stats.pendingKYC}
                      </div>
                      <div className="text-sm text-gray-400">
                        Pending Review
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gray-700 border-gray-600">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-500">
                        {users.filter((u) => u.kycStatus === "approved").length}
                      </div>
                      <div className="text-sm text-gray-400">Approved</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gray-700 border-gray-600">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-red-500">
                        {users.filter((u) => u.kycStatus === "rejected").length}
                      </div>
                      <div className="text-sm text-gray-400">Rejected</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Global User Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-white">
                      Auto-verify email addresses
                    </Label>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-white">
                      Require phone verification
                    </Label>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-white">Enable self-exclusion</Label>
                    <Switch defaultChecked />
                  </div>

                  <div>
                    <Label className="text-white">Default deposit limit</Label>
                    <Input type="number" defaultValue="500" className="mt-1" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-white">
                      Maximum session time (minutes)
                    </Label>
                    <Input type="number" defaultValue="180" className="mt-1" />
                  </div>

                  <div>
                    <Label className="text-white">
                      Inactivity timeout (minutes)
                    </Label>
                    <Input type="number" defaultValue="30" className="mt-1" />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-white">
                      Enable login notifications
                    </Label>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-white">
                      Require 2FA for withdrawals
                    </Label>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <Button className="bg-blue-600 hover:bg-blue-700">
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Balance Adjustment Modal */}
      {showBalanceModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="bg-gray-800 border-gray-700 w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="text-white flex justify-between items-center">
                Adjust Balance - {selectedUser.username}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBalanceModal(false)}
                >
                  ✕
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-3 bg-gray-700 rounded">
                <div className="text-white font-medium">
                  {selectedUser.username}
                </div>
                <div className="text-sm text-gray-400">
                  GC: {selectedUser.balances.goldCoins.toLocaleString()} | SC:{" "}
                  {selectedUser.balances.sweepsCoins.toFixed(2)} | VIP:{" "}
                  {selectedUser.balances.vipPoints}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Action</Label>
                  <Select
                    value={balanceAction}
                    onValueChange={(value: any) => setBalanceAction(value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit">Credit (Add)</SelectItem>
                      <SelectItem value="debit">Debit (Subtract)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white">Currency</Label>
                  <Select
                    value={balanceCurrency}
                    onValueChange={(value: any) => setBalanceCurrency(value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="goldCoins">Gold Coins</SelectItem>
                      <SelectItem value="sweepsCoins">Sweeps Coins</SelectItem>
                      <SelectItem value="vipPoints">VIP Points</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-white">Amount</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={balanceAmount}
                  onChange={(e) => setBalanceAmount(e.target.value)}
                  className="mt-1"
                  placeholder="Enter amount"
                />
              </div>

              <div>
                <Label className="text-white">Reason (Required)</Label>
                <Textarea
                  value={balanceReason}
                  onChange={(e) => setBalanceReason(e.target.value)}
                  className="mt-1"
                  placeholder="Enter reason for adjustment"
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleBalanceUpdate}
                  className={`flex-1 ${balanceAction === "credit" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
                  disabled={isLoading || !balanceAmount || !balanceReason}
                >
                  {isLoading
                    ? "Processing..."
                    : `${balanceAction === "credit" ? "Credit" : "Debit"} ${balanceAmount} ${balanceCurrency}`}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowBalanceModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
