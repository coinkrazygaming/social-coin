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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
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
  Building,
  UserCheck,
  Briefcase,
  Calculator,
  Send,
  X,
} from "lucide-react";

interface BankingTransaction {
  id: string;
  userId: string;
  username: string;
  type: "deposit" | "withdrawal" | "bonus" | "refund" | "admin_credit" | "admin_debit" | "jackpot" | "promotion";
  status: "pending" | "processing" | "completed" | "failed" | "cancelled";
  amount: number;
  currency: "USD" | "GC" | "SC";
  method: "paypal" | "stripe" | "bank_transfer" | "google_pay" | "admin_action";
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
  accountBalance: {
    main: number;
    escrow: number;
    fees: number;
    bonusPool: number;
  };
  paymentMethods: {
    paypal: { enabled: boolean; transactions: number; volume: number };
    stripe: { enabled: boolean; transactions: number; volume: number };
    googlePay: { enabled: boolean; transactions: number; volume: number };
    bankTransfer: { enabled: boolean; transactions: number; volume: number };
  };
}

interface EmployeeRecord {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  hireDate: Date;
  salary: number;
  status: "active" | "inactive" | "terminated";
  payrollInfo: {
    hourlyRate?: number;
    hoursWorked: number;
    overtime: number;
    bonus: number;
    deductions: number;
    netPay: number;
    lastPayDate: Date;
    nextPayDate: Date;
  };
  accessLevel: "basic" | "admin" | "manager";
  documents: {
    contractSigned: boolean;
    taxForms: boolean;
    nda: boolean;
    background: boolean;
  };
}

interface BankTransfer {
  id: string;
  fromAccount: string;
  toAccount: string;
  amount: number;
  currency: string;
  description: string;
  status: "pending" | "processing" | "completed" | "failed";
  initiatedBy: string;
  timestamp: Date;
  bankDetails: {
    routingNumber: string;
    accountNumber: string;
    bankName: string;
  };
}

export const EnhancedCasinoBanking: React.FC = () => {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState("overview");
  const [transactions, setTransactions] = useState<BankingTransaction[]>([]);
  const [stats, setStats] = useState<BankingStats | null>(null);
  const [employees, setEmployees] = useState<EmployeeRecord[]>([]);
  const [bankTransfers, setBankTransfers] = useState<BankTransfer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [transferForm, setTransferForm] = useState({
    fromAccount: "",
    toAccount: "",
    amount: "",
    description: "",
  });

  useEffect(() => {
    loadBankingData();
    loadEmployeeData();
    loadBankTransfers();
  }, []);

  const loadBankingData = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockTransactions: BankingTransaction[] = [
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
        amount: 125.50,
        currency: "USD",
        method: "bank_transfer",
        reference: "WD-98765432109876543210",
        description: "Sweeps Coin Redemption - 125.50 SC",
        requestedAt: new Date(Date.now() - 1800000),
        notes: "Awaiting bank processing",
      },
      {
        id: "txn_003",
        userId: "user3",
        username: "CasinoKing23",
        type: "deposit",
        status: "completed",
        amount: 99.99,
        currency: "USD",
        method: "google_pay",
        reference: "GP-001234567890",
        description: "Gold Coin Package Purchase - Mega Pack",
        requestedAt: new Date(Date.now() - 7200000),
        completedAt: new Date(Date.now() - 7150000),
        fees: {
          processingFee: 2.9,
          platformFee: 1.0,
          total: 3.9,
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
        description: "Gold Coin Package Purchase - Ultimate Pack",
        requestedAt: new Date(Date.now() - 5400000),
        processedAt: new Date(Date.now() - 5340000),
        notes: "Card declined - insufficient funds",
      },
    ];

    const mockStats: BankingStats = {
      totalDeposits: 45672.85,
      totalWithdrawals: 12348.67,
      totalVolume: 58021.52,
      pendingTransactions: 12,
      failedTransactions: 3,
      successRate: 96.8,
      averageDepositAmount: 67.45,
      averageWithdrawalAmount: 89.23,
      dailyVolume: 3456.78,
      weeklyVolume: 24197.46,
      monthlyVolume: 58021.52,
      accountBalance: {
        main: 156789.45,
        escrow: 23456.78,
        fees: 8901.23,
        bonusPool: 45678.90,
      },
      paymentMethods: {
        paypal: { enabled: true, transactions: 342, volume: 23456.78 },
        stripe: { enabled: true, transactions: 198, volume: 18902.34 },
        googlePay: { enabled: true, transactions: 156, volume: 12345.67 },
        bankTransfer: { enabled: true, transactions: 89, volume: 8901.23 },
      },
    };

    setTransactions(mockTransactions);
    setStats(mockStats);
    setIsLoading(false);
  };

  const loadEmployeeData = async () => {
    const mockEmployees: EmployeeRecord[] = [
      {
        id: "emp_001",
        employeeId: "EMP2024001",
        firstName: "John",
        lastName: "Smith",
        email: "john.smith@coinkrizy.com",
        department: "Development",
        position: "Senior Developer",
        hireDate: new Date("2023-01-15"),
        salary: 85000,
        status: "active",
        payrollInfo: {
          hourlyRate: 40.87,
          hoursWorked: 80,
          overtime: 8,
          bonus: 2000,
          deductions: 1250,
          netPay: 6234.56,
          lastPayDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          nextPayDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        },
        accessLevel: "admin",
        documents: {
          contractSigned: true,
          taxForms: true,
          nda: true,
          background: true,
        },
      },
      {
        id: "emp_002",
        employeeId: "EMP2024002",
        firstName: "Sarah",
        lastName: "Johnson",
        email: "sarah.johnson@coinkrizy.com",
        department: "Customer Support",
        position: "Support Manager",
        hireDate: new Date("2023-03-01"),
        salary: 65000,
        status: "active",
        payrollInfo: {
          hourlyRate: 31.25,
          hoursWorked: 80,
          overtime: 4,
          bonus: 1000,
          deductions: 850,
          netPay: 4785.50,
          lastPayDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          nextPayDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        },
        accessLevel: "manager",
        documents: {
          contractSigned: true,
          taxForms: true,
          nda: true,
          background: true,
        },
      },
      {
        id: "emp_003",
        employeeId: "EMP2024003",
        firstName: "Mike",
        lastName: "Williams",
        email: "mike.williams@coinkrizy.com",
        department: "Marketing",
        position: "Marketing Specialist",
        hireDate: new Date("2023-06-15"),
        salary: 55000,
        status: "active",
        payrollInfo: {
          hourlyRate: 26.44,
          hoursWorked: 80,
          overtime: 0,
          bonus: 500,
          deductions: 720,
          netPay: 3895.20,
          lastPayDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          nextPayDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        },
        accessLevel: "basic",
        documents: {
          contractSigned: true,
          taxForms: true,
          nda: true,
          background: false,
        },
      },
    ];

    setEmployees(mockEmployees);
  };

  const loadBankTransfers = async () => {
    const mockTransfers: BankTransfer[] = [
      {
        id: "bt_001",
        fromAccount: "Main Operating Account",
        toAccount: "Employee Payroll Account",
        amount: 25000,
        currency: "USD",
        description: "Bi-weekly payroll transfer",
        status: "completed",
        initiatedBy: user?.username || "Admin",
        timestamp: new Date(Date.now() - 86400000),
        bankDetails: {
          routingNumber: "123456789",
          accountNumber: "****1234",
          bankName: "First National Bank",
        },
      },
      {
        id: "bt_002",
        fromAccount: "Escrow Account",
        toAccount: "Prize Payout Account",
        amount: 5000,
        currency: "USD",
        description: "Weekly prize payouts",
        status: "processing",
        initiatedBy: user?.username || "Admin",
        timestamp: new Date(Date.now() - 3600000),
        bankDetails: {
          routingNumber: "987654321",
          accountNumber: "****5678",
          bankName: "Metro Credit Union",
        },
      },
    ];

    setBankTransfers(mockTransfers);
  };

  const handleBankTransfer = async () => {
    if (!transferForm.fromAccount || !transferForm.toAccount || !transferForm.amount) {
      alert("Please fill in all required fields");
      return;
    }

    const newTransfer: BankTransfer = {
      id: `bt_${Date.now()}`,
      fromAccount: transferForm.fromAccount,
      toAccount: transferForm.toAccount,
      amount: parseFloat(transferForm.amount),
      currency: "USD",
      description: transferForm.description,
      status: "pending",
      initiatedBy: user?.username || "Admin",
      timestamp: new Date(),
      bankDetails: {
        routingNumber: "123456789",
        accountNumber: "****9999",
        bankName: "Primary Bank",
      },
    };

    setBankTransfers(prev => [newTransfer, ...prev]);
    setShowTransferModal(false);
    setTransferForm({
      fromAccount: "",
      toAccount: "",
      amount: "",
      description: "",
    });

    // Simulate processing
    setTimeout(() => {
      setBankTransfers(prev => 
        prev.map(transfer => 
          transfer.id === newTransfer.id 
            ? { ...transfer, status: "processing" as const }
            : transfer
        )
      );
    }, 2000);

    setTimeout(() => {
      setBankTransfers(prev => 
        prev.map(transfer => 
          transfer.id === newTransfer.id 
            ? { ...transfer, status: "completed" as const }
            : transfer
        )
      );
    }, 5000);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-500/20 text-yellow-400", label: "Pending" },
      processing: { color: "bg-blue-500/20 text-blue-400", label: "Processing" },
      completed: { color: "bg-green-500/20 text-green-400", label: "Completed" },
      failed: { color: "bg-red-500/20 text-red-400", label: "Failed" },
      cancelled: { color: "bg-gray-500/20 text-gray-400", label: "Cancelled" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "paypal": return <CreditCard className="w-4 h-4 text-blue-500" />;
      case "stripe": return <CreditCard className="w-4 h-4 text-purple-500" />;
      case "google_pay": return <Wallet className="w-4 h-4 text-green-500" />;
      case "bank_transfer": return <Building className="w-4 h-4 text-gray-500" />;
      case "admin_action": return <Shield className="w-4 h-4 text-red-500" />;
      default: return <DollarSign className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.reference.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         employee.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  if (user?.role !== "admin") {
    return (
      <Card className="bg-red-500/10 border-red-500/20">
        <CardContent className="p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-400 mb-2">Access Denied</h3>
          <p className="text-gray-400">Only administrators can access the Casino Banking panel.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Casino Banking</h2>
          <p className="text-gray-400">Comprehensive banking and financial management</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowTransferModal(true)} className="bg-blue-600 hover:bg-blue-700">
            <Send className="w-4 h-4 mr-2" />
            Bank Transfer
          </Button>
          <Button onClick={loadBankingData} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="accounts">Bank Accounts</TabsTrigger>
          <TabsTrigger value="payments">Payment Settings</TabsTrigger>
          <TabsTrigger value="employees">Employee Payroll</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {stats && (
            <>
              {/* Account Balances */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-green-400">Main Account</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">${stats.accountBalance.main.toLocaleString()}</div>
                    <p className="text-xs text-green-400 mt-1">Operating funds</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-blue-400">Escrow Account</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">${stats.accountBalance.escrow.toLocaleString()}</div>
                    <p className="text-xs text-blue-400 mt-1">Player funds</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-purple-400">Fees Collected</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">${stats.accountBalance.fees.toLocaleString()}</div>
                    <p className="text-xs text-purple-400 mt-1">Processing fees</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border-yellow-500/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-yellow-400">Bonus Pool</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">${stats.accountBalance.bonusPool.toLocaleString()}</div>
                    <p className="text-xs text-yellow-400 mt-1">Promotional funds</p>
                  </CardContent>
                </Card>
              </div>

              {/* Transaction Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">Total Volume</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">${stats.totalVolume.toLocaleString()}</div>
                    <p className="text-xs text-green-400 mt-1">
                      <TrendingUp className="w-4 h-4 inline mr-1" />
                      +12.5% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">Success Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{stats.successRate}%</div>
                    <p className="text-xs text-green-400 mt-1">
                      <CheckCircle className="w-4 h-4 inline mr-1" />
                      Excellent performance
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">Pending Transactions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{stats.pendingTransactions}</div>
                    <p className="text-xs text-yellow-400 mt-1">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Awaiting processing
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Payment Methods Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-white">Payment Methods Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-300">PayPal</span>
                        <Badge className={stats.paymentMethods.paypal.enabled ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
                          {stats.paymentMethods.paypal.enabled ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="text-lg font-bold text-white">${stats.paymentMethods.paypal.volume.toLocaleString()}</div>
                      <div className="text-xs text-gray-400">{stats.paymentMethods.paypal.transactions} transactions</div>
                    </div>

                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-300">Stripe</span>
                        <Badge className={stats.paymentMethods.stripe.enabled ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
                          {stats.paymentMethods.stripe.enabled ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="text-lg font-bold text-white">${stats.paymentMethods.stripe.volume.toLocaleString()}</div>
                      <div className="text-xs text-gray-400">{stats.paymentMethods.stripe.transactions} transactions</div>
                    </div>

                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-300">Google Pay</span>
                        <Badge className={stats.paymentMethods.googlePay.enabled ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
                          {stats.paymentMethods.googlePay.enabled ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="text-lg font-bold text-white">${stats.paymentMethods.googlePay.volume.toLocaleString()}</div>
                      <div className="text-xs text-gray-400">{stats.paymentMethods.googlePay.transactions} transactions</div>
                    </div>

                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-300">Bank Transfer</span>
                        <Badge className={stats.paymentMethods.bankTransfer.enabled ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
                          {stats.paymentMethods.bankTransfer.enabled ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="text-lg font-bold text-white">${stats.paymentMethods.bankTransfer.volume.toLocaleString()}</div>
                      <div className="text-xs text-gray-400">{stats.paymentMethods.bankTransfer.transactions} transactions</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-white">Transaction Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search transactions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Date Range</Label>
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transactions Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-white">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTransactions.map((transaction) => (
                  <div key={transaction.id} className="bg-gray-800/50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getMethodIcon(transaction.method)}
                        <div>
                          <div className="font-medium text-white">{transaction.username}</div>
                          <div className="text-sm text-gray-400">{transaction.description}</div>
                          <div className="text-xs text-gray-500">{transaction.reference}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${
                            transaction.type === "deposit" ? "text-green-400" : "text-red-400"
                          }`}>
                            {transaction.type === "deposit" ? "+" : "-"}${transaction.amount}
                          </span>
                          {getStatusBadge(transaction.status)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {transaction.requestedAt.toLocaleDateString()}
                        </div>
                        {transaction.fees && (
                          <div className="text-xs text-gray-500">
                            Fees: ${transaction.fees.total}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accounts" className="space-y-6">
          {/* Bank Transfers */}
          <Card>
            <CardHeader>
              <CardTitle className="text-white">Bank Transfers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bankTransfers.map((transfer) => (
                  <div key={transfer.id} className="bg-gray-800/50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-white">
                          {transfer.fromAccount} → {transfer.toAccount}
                        </div>
                        <div className="text-sm text-gray-400">{transfer.description}</div>
                        <div className="text-xs text-gray-500">
                          Initiated by {transfer.initiatedBy} • {transfer.timestamp.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-white">${transfer.amount.toLocaleString()}</div>
                        {getStatusBadge(transfer.status)}
                        <div className="text-xs text-gray-500 mt-1">
                          {transfer.bankDetails.bankName}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-white">Payment Gateway Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800/50 p-4 rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-white">PayPal Integration</h3>
                    <Switch defaultChecked />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Client ID</Label>
                    <Input placeholder="PayPal Client ID" className="bg-gray-700 border-gray-600 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Client Secret</Label>
                    <Input type="password" placeholder="PayPal Client Secret" className="bg-gray-700 border-gray-600 text-white" />
                  </div>
                </div>

                <div className="bg-gray-800/50 p-4 rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-white">Stripe Integration</h3>
                    <Switch defaultChecked />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Publishable Key</Label>
                    <Input placeholder="Stripe Publishable Key" className="bg-gray-700 border-gray-600 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Secret Key</Label>
                    <Input type="password" placeholder="Stripe Secret Key" className="bg-gray-700 border-gray-600 text-white" />
                  </div>
                </div>

                <div className="bg-gray-800/50 p-4 rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-white">Google Pay</h3>
                    <Switch defaultChecked />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Merchant ID</Label>
                    <Input placeholder="Google Pay Merchant ID" className="bg-gray-700 border-gray-600 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Gateway ID</Label>
                    <Input placeholder="Google Pay Gateway ID" className="bg-gray-700 border-gray-600 text-white" />
                  </div>
                </div>

                <div className="bg-gray-800/50 p-4 rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-white">Bank Transfer</h3>
                    <Switch defaultChecked />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Routing Number</Label>
                    <Input placeholder="Bank Routing Number" className="bg-gray-700 border-gray-600 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Account Number</Label>
                    <Input placeholder="Bank Account Number" className="bg-gray-700 border-gray-600 text-white" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Save Payment Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="employees" className="space-y-6">
          {/* Employee Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Total Employees</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{employees.length}</div>
                <p className="text-xs text-green-400 mt-1">Active staff members</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Monthly Payroll</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  ${employees.reduce((sum, emp) => sum + emp.payrollInfo.netPay, 0).toLocaleString()}
                </div>
                <p className="text-xs text-blue-400 mt-1">Bi-weekly period</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Total Overtime</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {employees.reduce((sum, emp) => sum + emp.payrollInfo.overtime, 0)} hrs
                </div>
                <p className="text-xs text-yellow-400 mt-1">This period</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Bonus Pool</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  ${employees.reduce((sum, emp) => sum + emp.payrollInfo.bonus, 0).toLocaleString()}
                </div>
                <p className="text-xs text-purple-400 mt-1">Performance bonuses</p>
              </CardContent>
            </Card>
          </div>

          {/* Employee Search */}
          <Card>
            <CardHeader>
              <CardTitle className="text-white">Employee Search</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search employees..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                </div>
                <Button onClick={() => setShowEmployeeModal(true)} className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Employee
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Employee List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-white">Employee Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredEmployees.map((employee) => (
                  <div key={employee.id} className="bg-gray-800/50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <UserCheck className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-white">
                            {employee.firstName} {employee.lastName}
                          </div>
                          <div className="text-sm text-gray-400">
                            {employee.position} • {employee.department}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {employee.employeeId} • Hired: {employee.hireDate.toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-white">${employee.payrollInfo.netPay.toLocaleString()}</div>
                        <div className="text-sm text-gray-400">Net Pay (Bi-weekly)</div>
                        <div className="text-xs text-gray-500">
                          {employee.payrollInfo.hoursWorked}h regular + {employee.payrollInfo.overtime}h OT
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedEmployee(employee);
                              setShowEmployeeModal(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Bank Transfer Modal */}
      <Dialog open={showTransferModal} onOpenChange={setShowTransferModal}>
        <DialogContent className="bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Initiate Bank Transfer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-300">From Account</Label>
              <Select value={transferForm.fromAccount} onValueChange={(value) => 
                setTransferForm(prev => ({ ...prev, fromAccount: value }))
              }>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder="Select source account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="main">Main Operating Account</SelectItem>
                  <SelectItem value="escrow">Escrow Account</SelectItem>
                  <SelectItem value="fees">Fees Collection Account</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">To Account</Label>
              <Select value={transferForm.toAccount} onValueChange={(value) => 
                setTransferForm(prev => ({ ...prev, toAccount: value }))
              }>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder="Select destination account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="payroll">Employee Payroll Account</SelectItem>
                  <SelectItem value="prizes">Prize Payout Account</SelectItem>
                  <SelectItem value="vendors">Vendor Payment Account</SelectItem>
                  <SelectItem value="taxes">Tax Withholding Account</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Amount ($USD)</Label>
              <Input
                type="number"
                value={transferForm.amount}
                onChange={(e) => setTransferForm(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="0.00"
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Description</Label>
              <Textarea
                value={transferForm.description}
                onChange={(e) => setTransferForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Transfer description..."
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowTransferModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleBankTransfer} className="bg-blue-600 hover:bg-blue-700">
                <Send className="w-4 h-4 mr-2" />
                Initiate Transfer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Employee Modal */}
      <Dialog open={showEmployeeModal} onOpenChange={setShowEmployeeModal}>
        <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">
              {selectedEmployee ? "Edit Employee" : "Add New Employee"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-300">First Name</Label>
                <Input
                  defaultValue={selectedEmployee?.firstName}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Last Name</Label>
                <Input
                  defaultValue={selectedEmployee?.lastName}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Email</Label>
              <Input
                type="email"
                defaultValue={selectedEmployee?.email}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Department</Label>
                <Select defaultValue={selectedEmployee?.department}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Development">Development</SelectItem>
                    <SelectItem value="Customer Support">Customer Support</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Position</Label>
                <Input
                  defaultValue={selectedEmployee?.position}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Salary</Label>
                <Input
                  type="number"
                  defaultValue={selectedEmployee?.salary}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Access Level</Label>
                <Select defaultValue={selectedEmployee?.accessLevel}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => {
                setShowEmployeeModal(false);
                setSelectedEmployee(null);
              }}>
                Cancel
              </Button>
              <Button className="bg-green-600 hover:bg-green-700">
                <CheckCircle className="w-4 h-4 mr-2" />
                {selectedEmployee ? "Update Employee" : "Add Employee"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
