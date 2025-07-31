import { RequestHandler } from "express";
import {
  GoldCoinPackage,
  PurchaseTransaction,
  StoreSettings,
  StorePromotion,
  AdminLog,
  UserPurchaseHistory,
  RefundRequest,
} from "../../shared/storeTypes";

// In-memory storage (replace with real database)
const packages: Map<string, GoldCoinPackage> = new Map();
const transactions: Map<string, PurchaseTransaction[]> = new Map();
const storeSettings: StoreSettings = {
  id: "main-store",
  paypalEnabled: true,
  paypalClientId: "demo-client-id",
  paypalSandbox: true,
  stripeEnabled: true,
  stripePublishableKey: "pk_test_demo",
  cryptoEnabled: false,
  supportedCryptos: ["BTC", "ETH", "USDC"],
  minPurchaseAmount: 5,
  maxPurchaseAmount: 1000,
  purchaseLimits: {
    daily: 500,
    weekly: 2000,
    monthly: 5000,
  },
  taxSettings: {
    enabled: false,
    rate: 0.08,
    includedInPrice: true,
  },
  bonusMultiplier: 1.0,
  promotions: [],
  updatedAt: new Date(),
  updatedBy: "system",
};
const adminLogs: AdminLog[] = [];
const refundRequests: Map<string, RefundRequest[]> = new Map();

// Initialize default packages
const initializePackages = () => {
  const defaultPackages: GoldCoinPackage[] = [
    {
      id: "starter-pack",
      name: "Starter Pack",
      description: "Perfect for new players to get started",
      goldCoins: 10000,
      bonusSweepsCoins: 5,
      price: 9.99,
      image: "https://via.placeholder.com/200x150?text=Starter+Pack",
      popular: false,
      bestValue: false,
      features: ["10,000 Gold Coins", "5 Bonus Sweeps Coins", "Welcome Bonus"],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "value-pack",
      name: "Value Pack",
      description: "Great value for regular players",
      goldCoins: 25000,
      bonusSweepsCoins: 15,
      price: 19.99,
      originalPrice: 24.99,
      image: "https://via.placeholder.com/200x150?text=Value+Pack",
      popular: true,
      bestValue: false,
      features: [
        "25,000 Gold Coins",
        "15 Bonus Sweeps Coins",
        "20% Extra Bonus",
        "Priority Support",
      ],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "premium-pack",
      name: "Premium Pack",
      description: "Maximum fun with premium features",
      goldCoins: 50000,
      bonusSweepsCoins: 35,
      price: 39.99,
      originalPrice: 49.99,
      image: "https://via.placeholder.com/200x150?text=Premium+Pack",
      popular: false,
      bestValue: true,
      features: [
        "50,000 Gold Coins",
        "35 Bonus Sweeps Coins",
        "40% Extra Bonus",
        "VIP Support",
        "Exclusive Games",
      ],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "mega-pack",
      name: "Mega Pack",
      description: "For serious players who want it all",
      goldCoins: 100000,
      bonusSweepsCoins: 75,
      price: 79.99,
      originalPrice: 99.99,
      image: "https://via.placeholder.com/200x150?text=Mega+Pack",
      popular: false,
      bestValue: false,
      features: [
        "100,000 Gold Coins",
        "75 Bonus Sweeps Coins",
        "50% Extra Bonus",
        "VIP Treatment",
        "All Game Access",
        "Monthly Rewards",
      ],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "ultimate-pack",
      name: "Ultimate Pack",
      description: "The ultimate gaming experience",
      goldCoins: 250000,
      bonusSweepsCoins: 200,
      price: 199.99,
      originalPrice: 249.99,
      image: "https://via.placeholder.com/200x150?text=Ultimate+Pack",
      popular: false,
      bestValue: false,
      features: [
        "250,000 Gold Coins",
        "200 Bonus Sweeps Coins",
        "75% Extra Bonus",
        "Platinum VIP",
        "Personal Account Manager",
        "Exclusive Tournaments",
      ],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "daily-boost",
      name: "Daily Boost",
      description: "Small daily boost for consistent players",
      goldCoins: 5000,
      bonusSweepsCoins: 2,
      price: 4.99,
      image: "https://via.placeholder.com/200x150?text=Daily+Boost",
      popular: false,
      bestValue: false,
      features: [
        "5,000 Gold Coins",
        "2 Bonus Sweeps Coins",
        "Daily Login Bonus",
      ],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "weekend-special",
      name: "Weekend Special",
      description: "Special weekend package with extra bonuses",
      goldCoins: 75000,
      bonusSweepsCoins: 50,
      price: 59.99,
      originalPrice: 74.99,
      image: "https://via.placeholder.com/200x150?text=Weekend+Special",
      popular: false,
      bestValue: false,
      features: [
        "75,000 Gold Coins",
        "50 Bonus Sweeps Coins",
        "Weekend Multiplier",
        "Bonus Games Access",
      ],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "high-roller",
      name: "High Roller",
      description: "For the ultimate high roller experience",
      goldCoins: 500000,
      bonusSweepsCoins: 500,
      price: 499.99,
      originalPrice: 599.99,
      image: "https://via.placeholder.com/200x150?text=High+Roller",
      popular: false,
      bestValue: false,
      features: [
        "500,000 Gold Coins",
        "500 Bonus Sweeps Coins",
        "100% Extra Bonus",
        "Diamond VIP",
        "Concierge Service",
        "Private Gaming Room",
      ],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  defaultPackages.forEach((pkg) => packages.set(pkg.id, pkg));
};

// Get all packages
export const handleGetPackages: RequestHandler = (req, res) => {
  const { active } = req.query;

  let packageList = Array.from(packages.values());

  if (active === "true") {
    packageList = packageList.filter((pkg) => pkg.isActive);
  }

  // Sort by price
  packageList.sort((a, b) => a.price - b.price);

  res.json(packageList);
};

// Get specific package
export const handleGetPackage: RequestHandler = (req, res) => {
  const { packageId } = req.params;
  const package_ = packages.get(packageId);

  if (!package_) {
    return res.status(404).json({ error: "Package not found" });
  }

  res.json(package_);
};

// Create package (Admin only)
export const handleCreatePackage: RequestHandler = (req, res) => {
  const { adminId, adminUsername } = req.headers;
  const packageData = req.body;

  if (!adminId) {
    return res.status(401).json({ error: "Admin access required" });
  }

  const newPackage: GoldCoinPackage = {
    id: `package-${Date.now()}`,
    ...packageData,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  packages.set(newPackage.id, newPackage);

  // Log admin action
  const log: AdminLog = {
    id: `log-${Date.now()}`,
    adminId: adminId as string,
    adminUsername: adminUsername as string,
    action: "package_created",
    targetId: newPackage.id,
    targetType: "package",
    newValue: newPackage,
    description: `Created package: ${newPackage.name}`,
    timestamp: new Date(),
  };
  adminLogs.push(log);

  res.json({ success: true, package: newPackage });
};

// Update package (Admin only)
export const handleUpdatePackage: RequestHandler = (req, res) => {
  const { packageId } = req.params;
  const { adminId, adminUsername } = req.headers;
  const updates = req.body;

  if (!adminId) {
    return res.status(401).json({ error: "Admin access required" });
  }

  const existingPackage = packages.get(packageId);
  if (!existingPackage) {
    return res.status(404).json({ error: "Package not found" });
  }

  const updatedPackage = {
    ...existingPackage,
    ...updates,
    updatedAt: new Date(),
  };

  packages.set(packageId, updatedPackage);

  // Log admin action
  const log: AdminLog = {
    id: `log-${Date.now()}`,
    adminId: adminId as string,
    adminUsername: adminUsername as string,
    action: "package_updated",
    targetId: packageId,
    targetType: "package",
    oldValue: existingPackage,
    newValue: updatedPackage,
    description: `Updated package: ${updatedPackage.name}`,
    timestamp: new Date(),
  };
  adminLogs.push(log);

  res.json({ success: true, package: updatedPackage });
};

// Delete package (Admin only)
export const handleDeletePackage: RequestHandler = (req, res) => {
  const { packageId } = req.params;
  const { adminId, adminUsername } = req.headers;

  if (!adminId) {
    return res.status(401).json({ error: "Admin access required" });
  }

  const package_ = packages.get(packageId);
  if (!package_) {
    return res.status(404).json({ error: "Package not found" });
  }

  packages.delete(packageId);

  // Log admin action
  const log: AdminLog = {
    id: `log-${Date.now()}`,
    adminId: adminId as string,
    adminUsername: adminUsername as string,
    action: "package_deleted",
    targetId: packageId,
    targetType: "package",
    oldValue: package_,
    description: `Deleted package: ${package_.name}`,
    timestamp: new Date(),
  };
  adminLogs.push(log);

  res.json({ success: true });
};

// Purchase package
export const handlePurchasePackage: RequestHandler = (req, res) => {
  const { userId, username, packageId, paymentMethod, paymentReference } =
    req.body;

  const package_ = packages.get(packageId);
  if (!package_ || !package_.isActive) {
    return res.status(404).json({ error: "Package not found or inactive" });
  }

  const transaction: PurchaseTransaction = {
    id: `txn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    username,
    packageId,
    packageName: package_.name,
    goldCoinsAwarded: package_.goldCoins,
    sweepsCoinsBonus: package_.bonusSweepsCoins,
    amountPaid: package_.price,
    paymentMethod,
    paymentReference,
    status: "processing",
    createdAt: new Date(),
  };

  const userTransactions = transactions.get(userId) || [];
  userTransactions.push(transaction);
  transactions.set(userId, userTransactions);

  // Simulate payment processing
  setTimeout(() => {
    transaction.status = "completed";
    transaction.completedAt = new Date();

    // Here you would normally update user balance in database
    // For now we'll just mark as completed
  }, 2000);

  res.json({ success: true, transaction });
};

// Get user purchase history
export const handleGetUserPurchases: RequestHandler = (req, res) => {
  const { userId } = req.params;

  const userTransactions = transactions.get(userId) || [];

  const history: UserPurchaseHistory = {
    userId,
    transactions: userTransactions.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    ),
    totalSpent: userTransactions
      .filter((t) => t.status === "completed")
      .reduce((sum, t) => sum + t.amountPaid, 0),
    totalGoldCoins: userTransactions
      .filter((t) => t.status === "completed")
      .reduce((sum, t) => sum + t.goldCoinsAwarded, 0),
    totalSweepsCoins: userTransactions
      .filter((t) => t.status === "completed")
      .reduce((sum, t) => sum + t.sweepsCoinsBonus, 0),
    firstPurchase:
      userTransactions.length > 0
        ? new Date(
            Math.min(...userTransactions.map((t) => t.createdAt.getTime())),
          )
        : new Date(),
    lastPurchase:
      userTransactions.length > 0
        ? new Date(
            Math.max(...userTransactions.map((t) => t.createdAt.getTime())),
          )
        : new Date(),
    vipStatus: "none",
  };

  // Determine VIP status based on total spent
  if (history.totalSpent >= 1000) history.vipStatus = "platinum";
  else if (history.totalSpent >= 500) history.vipStatus = "gold";
  else if (history.totalSpent >= 200) history.vipStatus = "silver";
  else if (history.totalSpent >= 50) history.vipStatus = "bronze";

  res.json(history);
};

// Get store settings (Admin only)
export const handleGetStoreSettings: RequestHandler = (req, res) => {
  const { adminId } = req.headers;

  if (!adminId) {
    return res.status(401).json({ error: "Admin access required" });
  }

  res.json(storeSettings);
};

// Update store settings (Admin only)
export const handleUpdateStoreSettings: RequestHandler = (req, res) => {
  const { adminId, adminUsername } = req.headers;
  const updates = req.body;

  if (!adminId) {
    return res.status(401).json({ error: "Admin access required" });
  }

  const oldSettings = { ...storeSettings };
  Object.assign(storeSettings, updates, {
    updatedAt: new Date(),
    updatedBy: adminUsername as string,
  });

  // Log admin action
  const log: AdminLog = {
    id: `log-${Date.now()}`,
    adminId: adminId as string,
    adminUsername: adminUsername as string,
    action: "settings_updated",
    targetId: storeSettings.id,
    targetType: "settings",
    oldValue: oldSettings,
    newValue: storeSettings,
    description: "Updated store settings",
    timestamp: new Date(),
  };
  adminLogs.push(log);

  res.json({ success: true, settings: storeSettings });
};

// Get admin logs
export const handleGetAdminLogs: RequestHandler = (req, res) => {
  const { adminId } = req.headers;
  const { limit = 50 } = req.query;

  if (!adminId) {
    return res.status(401).json({ error: "Admin access required" });
  }

  const logs = adminLogs
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, Number(limit));

  res.json(logs);
};

// Create refund request
export const handleCreateRefundRequest: RequestHandler = (req, res) => {
  const { userId, username, transactionId, reason } = req.body;

  const userTransactions = transactions.get(userId) || [];
  const transaction = userTransactions.find((t) => t.id === transactionId);

  if (!transaction) {
    return res.status(404).json({ error: "Transaction not found" });
  }

  if (transaction.status !== "completed") {
    return res
      .status(400)
      .json({ error: "Can only refund completed transactions" });
  }

  const refundRequest: RefundRequest = {
    id: `refund-${Date.now()}`,
    transactionId,
    userId,
    username,
    reason,
    requestedAmount: transaction.amountPaid,
    status: "pending",
    requestedAt: new Date(),
  };

  const userRefunds = refundRequests.get(userId) || [];
  userRefunds.push(refundRequest);
  refundRequests.set(userId, userRefunds);

  res.json({ success: true, refundRequest });
};

// Get refund requests (Admin only)
export const handleGetRefundRequests: RequestHandler = (req, res) => {
  const { adminId } = req.headers;
  const { status } = req.query;

  if (!adminId) {
    return res.status(401).json({ error: "Admin access required" });
  }

  let allRefunds: RefundRequest[] = [];
  refundRequests.forEach((userRefunds) => {
    allRefunds = allRefunds.concat(userRefunds);
  });

  if (status) {
    allRefunds = allRefunds.filter((r) => r.status === status);
  }

  allRefunds.sort((a, b) => b.requestedAt.getTime() - a.requestedAt.getTime());

  res.json(allRefunds);
};

// Process refund (Admin only)
export const handleProcessRefund: RequestHandler = (req, res) => {
  const { refundId } = req.params;
  const { adminId, adminUsername } = req.headers;
  const { status, reviewNotes } = req.body;

  if (!adminId) {
    return res.status(401).json({ error: "Admin access required" });
  }

  let refundRequest: RefundRequest | undefined;
  let found = false;

  refundRequests.forEach((userRefunds) => {
    const refund = userRefunds.find((r) => r.id === refundId);
    if (refund) {
      refundRequest = refund;
      found = true;
    }
  });

  if (!found || !refundRequest) {
    return res.status(404).json({ error: "Refund request not found" });
  }

  refundRequest.status = status;
  refundRequest.reviewedAt = new Date();
  refundRequest.reviewedBy = adminUsername as string;
  refundRequest.reviewNotes = reviewNotes;

  if (status === "approved") {
    refundRequest.processedAt = new Date();
  }

  // Log admin action
  const log: AdminLog = {
    id: `log-${Date.now()}`,
    adminId: adminId as string,
    adminUsername: adminUsername as string,
    action: "transaction_refunded",
    targetId: refundRequest.transactionId,
    targetType: "transaction",
    description: `${status === "approved" ? "Approved" : "Denied"} refund request for $${refundRequest.requestedAmount}`,
    timestamp: new Date(),
  };
  adminLogs.push(log);

  res.json({ success: true, refundRequest });
};

// Get payment statistics
export const handleGetPaymentStats: RequestHandler = (req, res) => {
  const { adminId } = req.headers;

  if (!adminId) {
    return res.status(401).json({ error: "Admin access required" });
  }

  let allTransactions: PurchaseTransaction[] = [];
  transactions.forEach((userTransactions) => {
    allTransactions = allTransactions.concat(userTransactions);
  });

  const completedTransactions = allTransactions.filter(
    (t) => t.status === "completed",
  );
  const today = new Date();
  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  const todayTransactions = completedTransactions.filter(
    (t) => t.completedAt && t.completedAt >= startOfDay,
  );

  const stats = {
    totalRevenue: completedTransactions.reduce(
      (sum, t) => sum + t.amountPaid,
      0,
    ),
    todayRevenue: todayTransactions.reduce((sum, t) => sum + t.amountPaid, 0),
    totalTransactions: completedTransactions.length,
    todayTransactions: todayTransactions.length,
    averageTransactionValue:
      completedTransactions.length > 0
        ? completedTransactions.reduce((sum, t) => sum + t.amountPaid, 0) /
          completedTransactions.length
        : 0,
    popularPackages: getPopularPackages(completedTransactions),
    revenueByMethod: getRevenueByPaymentMethod(completedTransactions),
    monthlyRevenue: getMonthlyRevenue(completedTransactions),
  };

  res.json(stats);
};

// Helper functions
const getPopularPackages = (transactions: PurchaseTransaction[]) => {
  const packageCounts: Record<
    string,
    { count: number; revenue: number; name: string }
  > = {};

  transactions.forEach((t) => {
    if (!packageCounts[t.packageId]) {
      packageCounts[t.packageId] = {
        count: 0,
        revenue: 0,
        name: t.packageName,
      };
    }
    packageCounts[t.packageId].count++;
    packageCounts[t.packageId].revenue += t.amountPaid;
  });

  return Object.entries(packageCounts)
    .map(([id, data]) => ({ packageId: id, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
};

const getRevenueByPaymentMethod = (transactions: PurchaseTransaction[]) => {
  const methodRevenue: Record<string, number> = {};

  transactions.forEach((t) => {
    methodRevenue[t.paymentMethod] =
      (methodRevenue[t.paymentMethod] || 0) + t.amountPaid;
  });

  return methodRevenue;
};

const getMonthlyRevenue = (transactions: PurchaseTransaction[]) => {
  const monthlyData: Record<string, number> = {};

  transactions.forEach((t) => {
    if (t.completedAt) {
      const monthKey = t.completedAt.toISOString().substring(0, 7); // YYYY-MM
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + t.amountPaid;
    }
  });

  return Object.entries(monthlyData)
    .map(([month, revenue]) => ({ month, revenue }))
    .sort((a, b) => a.month.localeCompare(b.month));
};

// Initialize packages on server start
initializePackages();
