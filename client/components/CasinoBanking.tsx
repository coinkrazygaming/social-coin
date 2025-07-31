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
  DollarSign,
  CreditCard,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  Users,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Banknote,
  Wallet,
  Receipt,
  FileText,
  Filter,
  Download,
  RefreshCw,
  Search,
  Eye,
  Edit,
  Plus,
  Minus,
  Shield,
  Lock,
  Activity,
  BarChart3,
} from "lucide-react";

interface BankingTransaction {
  id: string;
  userId: string;
  username: string;
  type:
    | "deposit"
    | "withdrawal"
    | "bonus"
    | "refund"
    | "admin_credit"
    | "admin_debit"
    | "jackpot"
    | "promotion";
  status: "pending" | "processing" | "completed" | "failed" | "cancelled";
  amount: number;
  currency: "USD" | "GC" | "SC";
  method: "paypal" | "stripe" | "bank_transfer" | "crypto" | "admin_action";
  reference: string;
  description: string;
  requestedAt: Date;
  processedAt?: Date;
  completedAt?: Date;
  notes?: string;
  adminAction?: {
    adminId: string;
    adminUsername: string;
    reason: string;
    timestamp: Date;
  };
  fees?: {
    processingFee: number;
    platformFee: number;
    total: number;
  };
}

interface BankingStats {
  totalDeposits: number;
  totalWithdrawals: number;
  totalVolume: number;
  pendingTransactions: number;
  failedTransactions: number;
  successRate: number;
  averageDepositAmount: number;
  averageWithdrawalAmount: number;
  dailyVolume: number;
  weeklyVolume: number;
  monthlyVolume: number;
  topSpenders: {
    userId: string;
    username: string;
    totalSpent: number;
    transactionCount: number;
  }[];
  recentActivity: BankingTransaction[];
}

interface UserBalance {
  userId: string;
  username: string;
  goldCoins: number;
  sweepsCoins: number;
  vipPoints: number;
  totalDeposited: number;
  totalWithdrawn: number;
  lastActivity: Date;
  status: "active" | "suspended" | "restricted";
  limits: {
    dailyDeposit: number;
    weeklyDeposit: number;
    monthlyDeposit: number;
    dailyWithdrawal: number;
    weeklyWithdrawal: number;
  };
}

export function CasinoBanking() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<BankingTransaction[]>([
    {
      id: "txn_001",
      userId: "user1",
      username: "SlotMaster97",
      type: "deposit",
      status: "completed",
      amount: 49.99,
      currency: "USD",
      method: "paypal",
      reference: "PAY-12345678901234567890",
      description: "Gold Coin Package Purchase - Premium Pack",
      requestedAt: new Date(Date.now() - 3600000),
      processedAt: new Date(Date.now() - 3540000),
      completedAt: new Date(Date.now() - 3480000),
      fees: {
        processingFee: 1.45,
        platformFee: 0.5,
        total: 1.95,
      },
    },
    {
      id: "txn_002",
      userId: "user2",
      username: "LuckySpinner",
      type: "withdrawal",
      status: "pending",
      amount: 25.0,
      currency: "USD",
      method: "paypal",
      reference: "WD-98765432109876543210",
      description: "Sweeps Coin Redemption - 25 SC",
      requestedAt: new Date(Date.now() - 1800000),
      notes: "Awaiting KYC verification",
    },
    {
      id: "txn_003",
      userId: "user3",
      username: "CasinoKing23",
      type: "admin_credit",
      status: "completed",
      amount: 1000,
      currency: "GC",
      method: "admin_action",
      reference: "ADM-CREDIT-001",
      description: "Compensation for system downtime",
      requestedAt: new Date(Date.now() - 7200000),
      completedAt: new Date(Date.now() - 7200000),
      adminAction: {
        adminId: "admin1",
        adminUsername: "AdminUser",
        reason: "System compensation",
        timestamp: new Date(Date.now() - 7200000),
      },
    },
    {
      id: "txn_004",
      userId: "user4",
      username: "HighRoller88",
      type: "deposit",
      status: "failed",
      amount: 199.99,
      currency: "USD",
      method: "stripe",
      reference: "pi_1234567890abcdef",
      description: "Gold Coin Package Purchase - Mega Pack",
      requestedAt: new Date(Date.now() - 5400000),
      processedAt: new Date(Date.now() - 5340000),
      notes: "Card declined - insufficient funds",
    },
    {
      id: "txn_005",
      userId: "user5",
      username: "VIPPlayer1",
      type: "bonus",
      status: "completed",
      amount: 5,
      currency: "SC",
      method: "admin_action",
      reference: "BONUS-WEEKLY-001",
      description: "Weekly leaderboard reward - 1st place",
      requestedAt: new Date(Date.now() - 10800000),
      completedAt: new Date(Date.now() - 10800000),
      adminAction: {
        adminId: "admin1",
        adminUsername: "AdminUser",
        reason: "Leaderboard reward",
        timestamp: new Date(Date.now() - 10800000),
      },
    },
  ]);

  const [stats, setStats] = useState<BankingStats>({
    totalDeposits: 47892.45,
    totalWithdrawals: 12456.78,
    totalVolume: 60349.23,
    pendingTransactions: 23,
    failedTransactions: 8,
    successRate: 96.8,
    averageDepositAmount: 78.45,
    averageWithdrawalAmount: 35.67,
    dailyVolume: 4567.89,
    weeklyVolume: 28934.56,
    monthlyVolume: 125678.9,
    topSpenders: [
      {
        userId: "user1",
        username: "SlotMaster97",
        totalSpent: 2456.78,
        transactionCount: 45,
      },
      {
        userId: "user2",
        username: "HighRoller88",
        totalSpent: 1892.34,
        transactionCount: 28,
      },
      {
        userId: "user3",
        username: "VIPPlayer1",
        totalSpent: 1634.56,
        transactionCount: 35,
      },
      {
        userId: "user4",
        username: "CasinoKing23",
        totalSpent: 1287.9,
        transactionCount: 22,
      },
      {
        userId: "user5",
        username: "LuckySpinner",
        totalSpent: 967.43,
        transactionCount: 18,
      },
    ],
    recentActivity: [],
  });

  const [userBalances, setUserBalances] = useState<UserBalance[]>([
    {
      userId: "user1",
      username: "SlotMaster97",
      goldCoins: 15678,
      sweepsCoins: 23.45,
      vipPoints: 567,
      totalDeposited: 2456.78,
      totalWithdrawn: 145.67,
      lastActivity: new Date(),
      status: "active",
      limits: {
        dailyDeposit: 500,
        weeklyDeposit: 2500,
        monthlyDeposit: 10000,
        dailyWithdrawal: 200,
        weeklyWithdrawal: 1000,
      },
    },
    {
      userId: "user2",
      username: "LuckySpinner",
      goldCoins: 8934,
      sweepsCoins: 12.89,
      vipPoints: 234,
      totalDeposited: 967.43,
      totalWithdrawn: 78.9,
      lastActivity: new Date(Date.now() - 1800000),
      status: "active",
      limits: {
        dailyDeposit: 300,
        weeklyDeposit: 1500,
        monthlyDeposit: 6000,
        dailyWithdrawal: 150,
        weeklyWithdrawal: 750,
      },
    },
  ]);

  const [selectedTransaction, setSelectedTransaction] =
    useState<BankingTransaction | null>(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserBalance | null>(null);
  const [balanceAction, setBalanceAction] = useState<"credit" | "debit">(
    "credit",
  );
  const [balanceAmount, setBalanceAmount] = useState("");
  const [balanceCurrency, setBalanceCurrency] = useState<
    "GC" | "SC" | "vip_points"
  >("GC");
  const [balanceReason, setBalanceReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const [filters, setFilters] = useState({
    type: "all",
    status: "all",
    currency: "all",
    dateRange: "7d",
  });

  const handleTransactionAction = async (
    transactionId: string,
    action: "approve" | "deny" | "cancel",
    notes?: string,
  ) => {
    setIsProcessing(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setTransactions((prev) =>
      prev.map((txn) =>
        txn.id === transactionId
          ? {
              ...txn,
              status:
                action === "approve"
                  ? "processing"
                  : action === "deny"
                    ? "failed"
                    : "cancelled",
              processedAt: new Date(),
              completedAt: action === "approve" ? new Date() : undefined,
              notes: notes || txn.notes,
              adminAction: {
                adminId: user?.id || "admin1",
                adminUsername: user?.username || "AdminUser",
                reason: notes || `Transaction ${action}d`,
                timestamp: new Date(),
              },
            }
          : txn,
      ),
    );

    setIsProcessing(false);
  };

  const handleBalanceUpdate = async () => {
    if (!selectedUser || !balanceAmount || !balanceReason) return;

    setIsProcessing(true);

    const amount = parseFloat(balanceAmount);
    const isCredit = balanceAction === "credit";

    // Create transaction record
    const newTransaction: BankingTransaction = {
      id: `txn_${Date.now()}`,
      userId: selectedUser.userId,
      username: selectedUser.username,
      type: isCredit ? "admin_credit" : "admin_debit",
      status: "completed",
      amount: amount,
      currency: balanceCurrency,
      method: "admin_action",
      reference: `ADM-${isCredit ? "CREDIT" : "DEBIT"}-${Date.now()}`,
      description: balanceReason,
      requestedAt: new Date(),
      completedAt: new Date(),
      adminAction: {
        adminId: user?.id || "admin1",
        adminUsername: user?.username || "AdminUser",
        reason: balanceReason,
        timestamp: new Date(),
      },
    };

    setTransactions((prev) => [newTransaction, ...prev]);

    // Update user balance
    setUserBalances((prev) =>
      prev.map((userBalance) =>
        userBalance.userId === selectedUser.userId
          ? {
              ...userBalance,
              goldCoins:
                balanceCurrency === "GC"
                  ? isCredit
                    ? userBalance.goldCoins + amount
                    : userBalance.goldCoins - amount
                  : userBalance.goldCoins,
              sweepsCoins:
                balanceCurrency === "SC"
                  ? isCredit
                    ? userBalance.sweepsCoins + amount
                    : userBalance.sweepsCoins - amount
                  : userBalance.sweepsCoins,
              vipPoints:
                balanceCurrency === "vip_points"
                  ? isCredit
                    ? userBalance.vipPoints + amount
                    : userBalance.vipPoints - amount
                  : userBalance.vipPoints,
              lastActivity: new Date(),
            }
          : userBalance,
      ),
    );

    setIsProcessing(false);
    setShowBalanceModal(false);
    setSelectedUser(null);
    setBalanceAmount("");
    setBalanceReason("");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "processing":
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      case "failed":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "cancelled":
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-600";
      case "pending":
        return "bg-yellow-600";
      case "processing":
        return "bg-blue-600";
      case "failed":
        return "bg-red-600";
      case "cancelled":
        return "bg-gray-600";
      default:
        return "bg-gray-600";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowDownLeft className="w-4 h-4 text-green-500" />;
      case "withdrawal":
        return <ArrowUpRight className="w-4 h-4 text-red-500" />;
      case "bonus":
        return <Gift className="w-4 h-4 text-purple-500" />;
      case "admin_credit":
        return <Plus className="w-4 h-4 text-blue-500" />;
      case "admin_debit":
        return <Minus className="w-4 h-4 text-orange-500" />;
      default:
        return <DollarSign className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredTransactions = transactions.filter((txn) => {
    if (filters.type !== "all" && txn.type !== filters.type) return false;
    if (filters.status !== "all" && txn.status !== filters.status) return false;
    if (filters.currency !== "all" && txn.currency !== filters.currency)
      return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-500">
              ${stats.totalDeposits.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">Total Deposits</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <TrendingDown className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-500">
              ${stats.totalWithdrawals.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">Total Withdrawals</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-500">
              {stats.pendingTransactions}
            </div>
            <div className="text-sm text-gray-400">Pending Transactions</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <BarChart3 className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-500">
              {stats.successRate}%
            </div>
            <div className="text-sm text-gray-400">Success Rate</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="balances">User Balances</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="limits">Limits & Controls</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-6">
          {/* Filters */}
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <Label className="text-white">Type</Label>
                  <Select
                    value={filters.type}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="deposit">Deposits</SelectItem>
                      <SelectItem value="withdrawal">Withdrawals</SelectItem>
                      <SelectItem value="bonus">Bonuses</SelectItem>
                      <SelectItem value="admin_credit">
                        Admin Credits
                      </SelectItem>
                      <SelectItem value="admin_debit">Admin Debits</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white">Status</Label>
                  <Select
                    value={filters.status}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white">Currency</Label>
                  <Select
                    value={filters.currency}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, currency: value }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Currencies</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="GC">Gold Coins</SelectItem>
                      <SelectItem value="SC">Sweeps Coins</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white">Date Range</Label>
                  <Select
                    value={filters.dateRange}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, dateRange: value }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1d">Last 24 Hours</SelectItem>
                      <SelectItem value="7d">Last 7 Days</SelectItem>
                      <SelectItem value="30d">Last 30 Days</SelectItem>
                      <SelectItem value="90d">Last 90 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transactions List */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Receipt className="w-5 h-5" />
                Transaction History
                <Badge className="ml-auto">
                  {filteredTransactions.length} transactions
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="p-4 bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(transaction.type)}
                        <div>
                          <div className="text-white font-medium">
                            {transaction.username}
                          </div>
                          <div className="text-gray-400 text-sm">
                            {transaction.description}
                          </div>
                          <div className="text-gray-500 text-xs">
                            {transaction.requestedAt.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-bold">
                          {transaction.type === "withdrawal" ||
                          transaction.type === "admin_debit"
                            ? "-"
                            : "+"}
                          {transaction.amount} {transaction.currency}
                        </div>
                        <Badge className={getStatusColor(transaction.status)}>
                          {getStatusIcon(transaction.status)}
                          <span className="ml-1">{transaction.status}</span>
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-400">
                        {transaction.method} • {transaction.reference}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedTransaction(transaction);
                            setShowTransactionModal(true);
                          }}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        {transaction.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() =>
                                handleTransactionAction(
                                  transaction.id,
                                  "approve",
                                )
                              }
                              disabled={isProcessing}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                              onClick={() => {
                                const reason = prompt("Denial reason:");
                                if (reason)
                                  handleTransactionAction(
                                    transaction.id,
                                    "deny",
                                    reason,
                                  );
                              }}
                              disabled={isProcessing}
                            >
                              Deny
                            </Button>
                          </>
                        )}
                      </div>
                    </div>

                    {transaction.fees && (
                      <div className="mt-2 p-2 bg-gray-600 rounded text-xs">
                        <div className="text-gray-300">
                          Fees: Processing ${transaction.fees.processingFee} +
                          Platform ${transaction.fees.platformFee} = $
                          {transaction.fees.total}
                        </div>
                      </div>
                    )}

                    {transaction.notes && (
                      <div className="mt-2 p-2 bg-yellow-900 border border-yellow-700 rounded text-xs">
                        <div className="text-yellow-300">
                          Note: {transaction.notes}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="balances" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">
              User Balance Management
            </h3>
            <Button
              onClick={() => setShowBalanceModal(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adjust Balance
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {userBalances.map((userBalance) => (
              <Card
                key={userBalance.userId}
                className="bg-gray-800 border-gray-700"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white">
                        {userBalance.username}
                      </CardTitle>
                      <Badge
                        className={
                          userBalance.status === "active"
                            ? "bg-green-600"
                            : userBalance.status === "suspended"
                              ? "bg-red-600"
                              : "bg-yellow-600"
                        }
                      >
                        {userBalance.status}
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedUser(userBalance);
                        setShowBalanceModal(true);
                      }}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Adjust
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-500">
                        {userBalance.goldCoins.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-400">Gold Coins</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-500">
                        {userBalance.sweepsCoins.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-400">Sweeps Coins</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-500">
                        {userBalance.vipPoints}
                      </div>
                      <div className="text-sm text-gray-400">VIP Points</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-400">Total Deposited</div>
                      <div className="text-white font-medium">
                        ${userBalance.totalDeposited.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400">Total Withdrawn</div>
                      <div className="text-white font-medium">
                        ${userBalance.totalWithdrawn.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500">
                    Last activity: {userBalance.lastActivity.toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Volume Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">
                    ${stats.dailyVolume.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">Daily Volume</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">
                    ${stats.weeklyVolume.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">Weekly Volume</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-500">
                    ${stats.monthlyVolume.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">Monthly Volume</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Top Spenders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.topSpenders.map((spender, index) => (
                  <div
                    key={spender.userId}
                    className="flex items-center justify-between p-3 bg-gray-700 rounded"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="text-white font-medium">
                          {spender.username}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {spender.transactionCount} transactions
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold">
                        ${spender.totalSpent.toLocaleString()}
                      </div>
                      <div className="text-gray-400 text-sm">Total Spent</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="limits" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Deposit & Withdrawal Limits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-white font-medium">
                    Default Deposit Limits
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white">Daily Limit</Label>
                      <Input
                        type="number"
                        defaultValue="500"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-white">Weekly Limit</Label>
                      <Input
                        type="number"
                        defaultValue="2500"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-white">Monthly Limit</Label>
                      <Input
                        type="number"
                        defaultValue="10000"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-white">Single Transaction</Label>
                      <Input
                        type="number"
                        defaultValue="1000"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-white font-medium">
                    Default Withdrawal Limits
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white">Daily Limit</Label>
                      <Input
                        type="number"
                        defaultValue="200"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-white">Weekly Limit</Label>
                      <Input
                        type="number"
                        defaultValue="1000"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-white">Monthly Limit</Label>
                      <Input
                        type="number"
                        defaultValue="4000"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-white">Single Transaction</Label>
                      <Input
                        type="number"
                        defaultValue="500"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-white font-medium">Risk Controls</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-white">
                        Auto-approve withdrawals under
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          defaultValue="50"
                          className="w-20"
                        />
                        <span className="text-white">USD</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="text-white">
                        Require KYC for withdrawals over
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          defaultValue="100"
                          className="w-20"
                        />
                        <span className="text-white">USD</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="text-white">
                        Enable velocity checks
                      </Label>
                      <Switch defaultChecked />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-white">
                        Flag rapid transactions
                      </Label>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="text-white">
                        Enable fraud detection
                      </Label>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="text-white">
                        Require 2FA for large amounts
                      </Label>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </div>

              <Button className="bg-blue-600 hover:bg-blue-700">
                <Shield className="w-4 h-4 mr-2" />
                Save Limit Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Financial Reports
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-white font-medium">
                    Transaction Reports
                  </h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="w-4 h-4 mr-2" />
                      Daily Transaction Report
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="w-4 h-4 mr-2" />
                      Weekly Volume Report
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="w-4 h-4 mr-2" />
                      Monthly Financial Summary
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="w-4 h-4 mr-2" />
                      Failed Transaction Report
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-white font-medium">Compliance Reports</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="w-4 h-4 mr-2" />
                      AML Transaction Report
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="w-4 h-4 mr-2" />
                      Large Transaction Report
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="w-4 h-4 mr-2" />
                      User Activity Report
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="w-4 h-4 mr-2" />
                      Tax Reporting Summary
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-900 border border-blue-700 rounded">
                <div className="flex items-center gap-2 text-blue-300 text-sm">
                  <Lock className="w-4 h-4" />
                  All reports are encrypted and comply with financial data
                  protection regulations
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Balance Adjustment Modal */}
      {showBalanceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="bg-gray-800 border-gray-700 w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="text-white flex justify-between items-center">
                Adjust User Balance
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowBalanceModal(false);
                    setSelectedUser(null);
                  }}
                >
                  ✕
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedUser && (
                <div className="text-center p-3 bg-gray-700 rounded">
                  <div className="text-white font-medium">
                    {selectedUser.username}
                  </div>
                  <div className="text-sm text-gray-400">
                    GC: {selectedUser.goldCoins.toLocaleString()} | SC:{" "}
                    {selectedUser.sweepsCoins.toFixed(2)} | VIP:{" "}
                    {selectedUser.vipPoints}
                  </div>
                </div>
              )}

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
                      <SelectItem value="GC">Gold Coins</SelectItem>
                      <SelectItem value="SC">Sweeps Coins</SelectItem>
                      <SelectItem value="vip_points">VIP Points</SelectItem>
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
                  disabled={isProcessing || !balanceAmount || !balanceReason}
                >
                  {isProcessing
                    ? "Processing..."
                    : `${balanceAction === "credit" ? "Credit" : "Debit"} ${balanceAmount} ${balanceCurrency}`}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowBalanceModal(false);
                    setSelectedUser(null);
                  }}
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
