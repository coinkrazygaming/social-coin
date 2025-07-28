import { RequestHandler } from "express";
import {
  User,
  Balance,
  Transaction,
  MiniGamePlay,
  MiniGameCooldown,
} from "@shared/types";
import { z } from "zod";

// In-memory storage (replace with real database)
const users: Map<string, User> = new Map();
const balances: Map<string, Balance> = new Map();
const transactions: Map<string, Transaction> = new Map();
const miniGamePlays: Map<string, MiniGamePlay[]> = new Map();
const cooldowns: Map<string, MiniGameCooldown[]> = new Map();

// Create admin account
const adminUser: User = {
  id: "admin-001",
  email: "coinkrazy00@gmail.com",
  username: "CoinKrazyAdmin",
  goldCoins: 1000000,
  sweepsCoins: 1000,
  isVerified: true,
  role: "admin",
  createdAt: new Date(),
  lastLogin: new Date(),
  kycStatus: "approved",
};

users.set(adminUser.id, adminUser);
balances.set(adminUser.id, {
  userId: adminUser.id,
  goldCoins: adminUser.goldCoins,
  sweepsCoins: adminUser.sweepsCoins,
  lastUpdated: new Date(),
});

// Validation schemas
const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3),
  password: z.string().min(6),
  agreeToTerms: z
    .boolean()
    .refine((val) => val === true, "Must agree to terms"),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Helper functions
function generateUserId(): string {
  return "user_" + Math.random().toString(36).substring(2, 15);
}

function generateTransactionId(): string {
  return "txn_" + Math.random().toString(36).substring(2, 15);
}

function createWelcomeTransaction(userId: string): Transaction {
  return {
    id: generateTransactionId(),
    userId,
    type: "bonus",
    amount: 10000,
    currency: "GC",
    description: "Welcome Bonus - 10,000 GC",
    createdAt: new Date(),
    status: "completed",
  };
}

function createWelcomeSCTransaction(userId: string): Transaction {
  return {
    id: generateTransactionId(),
    userId,
    type: "bonus",
    amount: 10,
    currency: "SC",
    description: "Welcome Bonus - 10 SC",
    createdAt: new Date(),
    status: "completed",
  };
}

// Register user
export const handleRegister: RequestHandler = (req, res) => {
  try {
    const { email, username, password, agreeToTerms } = registerSchema.parse(
      req.body,
    );

    // Check if user already exists
    const existingUser = Array.from(users.values()).find(
      (u) => u.email === email,
    );
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const userId = generateUserId();
    const newUser: User = {
      id: userId,
      email,
      username,
      goldCoins: 10000, // Welcome bonus
      sweepsCoins: 10, // Welcome bonus
      isVerified: false,
      role: "user",
      createdAt: new Date(),
      lastLogin: new Date(),
      kycStatus: "pending",
    };

    users.set(userId, newUser);

    // Create balance record
    balances.set(userId, {
      userId,
      goldCoins: 10000,
      sweepsCoins: 10,
      lastUpdated: new Date(),
    });

    // Create welcome bonus transactions
    const gcTransaction = createWelcomeTransaction(userId);
    const scTransaction = createWelcomeSCTransaction(userId);

    transactions.set(gcTransaction.id, gcTransaction);
    transactions.set(scTransaction.id, scTransaction);

    res.json({
      user: { ...newUser, password: undefined },
      message: "Registration successful! Welcome bonus awarded.",
    });
  } catch (error) {
    res.status(400).json({ error: "Invalid registration data" });
  }
};

// Login user
export const handleLogin: RequestHandler = (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    // Find user by email
    const user = Array.from(users.values()).find((u) => u.email === email);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Simple password check (use proper hashing in production)
    if (email === "coinkrazy00@gmail.com" && password === "Woot6969!") {
      // Admin login
      user.lastLogin = new Date();
      return res.json({ user: { ...user, password: undefined } });
    } else if (password === "password123") {
      // Demo login for other users
      user.lastLogin = new Date();
      return res.json({ user: { ...user, password: undefined } });
    }

    res.status(401).json({ error: "Invalid credentials" });
  } catch (error) {
    res.status(400).json({ error: "Invalid login data" });
  }
};

// Get user balance
export const handleGetBalance: RequestHandler = (req, res) => {
  const userId = req.params.userId;
  const balance = balances.get(userId);

  if (!balance) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json(balance);
};

// Update user balance
export const handleUpdateBalance: RequestHandler = (req, res) => {
  const userId = req.params.userId;
  const { goldCoins, sweepsCoins, type, description } = req.body;

  const currentBalance = balances.get(userId);
  if (!currentBalance) {
    return res.status(404).json({ error: "User not found" });
  }

  const newBalance = {
    ...currentBalance,
    goldCoins: currentBalance.goldCoins + (goldCoins || 0),
    sweepsCoins: currentBalance.sweepsCoins + (sweepsCoins || 0),
    lastUpdated: new Date(),
  };

  balances.set(userId, newBalance);

  // Create transaction record
  if (goldCoins !== 0) {
    const transaction: Transaction = {
      id: generateTransactionId(),
      userId,
      type: type || "win",
      amount: goldCoins,
      currency: "GC",
      description: description || "Balance update",
      createdAt: new Date(),
      status: "completed",
    };
    transactions.set(transaction.id, transaction);
  }

  if (sweepsCoins !== 0) {
    const transaction: Transaction = {
      id: generateTransactionId(),
      userId,
      type: type || "win",
      amount: sweepsCoins,
      currency: "SC",
      description: description || "Balance update",
      createdAt: new Date(),
      status: "completed",
    };
    transactions.set(transaction.id, transaction);
  }

  res.json(newBalance);
};

// Get user transactions
export const handleGetTransactions: RequestHandler = (req, res) => {
  const userId = req.params.userId;
  const userTransactions = Array.from(transactions.values())
    .filter((t) => t.userId === userId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  res.json(userTransactions);
};

// Get all users (admin only)
export const handleGetAllUsers: RequestHandler = (req, res) => {
  const allUsers = Array.from(users.values()).map((user) => ({
    ...user,
    password: undefined,
  }));
  res.json(allUsers);
};

// Mini game cooldown check
export const handleCheckCooldown: RequestHandler = (req, res) => {
  const { userId, gameType } = req.params;
  const userCooldowns = cooldowns.get(userId) || [];
  const gameCooldown = userCooldowns.find((c) => c.gameType === gameType);

  if (!gameCooldown) {
    return res.json({ canPlay: true, nextAvailable: null });
  }

  const now = new Date();
  const canPlay = now >= gameCooldown.nextAvailable;

  res.json({
    canPlay,
    nextAvailable: gameCooldown.nextAvailable,
    hoursRemaining: canPlay
      ? 0
      : Math.ceil(
          (gameCooldown.nextAvailable.getTime() - now.getTime()) /
            (1000 * 60 * 60),
        ),
  });
};

// Record mini game play
export const handleMiniGamePlay: RequestHandler = (req, res) => {
  const { userId, gameType, score, maxScore, duration } = req.body;

  // Calculate SC earned (max 0.25 SC)
  const scorePercentage = score / maxScore;
  const scEarned = Math.min(
    0.25,
    Math.round(scorePercentage * 0.25 * 100) / 100,
  );

  const gamePlay: MiniGamePlay = {
    id: generateTransactionId(),
    userId,
    gameType,
    score,
    maxScore,
    scEarned,
    playedAt: new Date(),
    duration,
  };

  // Store game play
  const userPlays = miniGamePlays.get(userId) || [];
  userPlays.push(gamePlay);
  miniGamePlays.set(userId, userPlays);

  // Set cooldown (24 hours)
  const nextAvailable = new Date();
  nextAvailable.setHours(nextAvailable.getHours() + 24);

  const cooldown: MiniGameCooldown = {
    userId,
    gameType,
    lastPlayed: new Date(),
    nextAvailable,
  };

  const userCooldowns = cooldowns.get(userId) || [];
  const existingCooldownIndex = userCooldowns.findIndex(
    (c) => c.gameType === gameType,
  );

  if (existingCooldownIndex >= 0) {
    userCooldowns[existingCooldownIndex] = cooldown;
  } else {
    userCooldowns.push(cooldown);
  }
  cooldowns.set(userId, userCooldowns);

  // Update user balance
  const currentBalance = balances.get(userId);
  if (currentBalance && scEarned > 0) {
    const newBalance = {
      ...currentBalance,
      sweepsCoins:
        Math.round((currentBalance.sweepsCoins + scEarned) * 100) / 100,
      lastUpdated: new Date(),
    };
    balances.set(userId, newBalance);

    // Create transaction
    const transaction: Transaction = {
      id: generateTransactionId(),
      userId,
      type: "mini-game",
      amount: scEarned,
      currency: "SC",
      description: `${gameType} mini-game reward - ${score}/${maxScore}`,
      createdAt: new Date(),
      status: "completed",
      metadata: { gameType, score, maxScore },
    };
    transactions.set(transaction.id, transaction);
  }

  res.json({ ...gamePlay, balanceUpdated: scEarned > 0 });
};

// Get mini game history
export const handleGetMiniGameHistory: RequestHandler = (req, res) => {
  const userId = req.params.userId;
  const gameType = req.query.gameType as string;

  let userPlays = miniGamePlays.get(userId) || [];

  if (gameType) {
    userPlays = userPlays.filter((play) => play.gameType === gameType);
  }

  userPlays.sort((a, b) => b.playedAt.getTime() - a.playedAt.getTime());

  res.json(userPlays);
};

// Get all mini game history (admin)
export const handleGetAllMiniGameHistory: RequestHandler = (req, res) => {
  const gameType = req.query.gameType as string;
  let allPlays: MiniGamePlay[] = [];

  for (const userPlays of miniGamePlays.values()) {
    allPlays = allPlays.concat(userPlays);
  }

  if (gameType) {
    allPlays = allPlays.filter((play) => play.gameType === gameType);
  }

  allPlays.sort((a, b) => b.playedAt.getTime() - a.playedAt.getTime());

  res.json(allPlays);
};

// In-memory user settings storage
const userSettings: Map<string, any> = new Map();

// Get user settings
export const handleGetUserSettings: RequestHandler = (req, res) => {
  const { userId } = req.params;

  // Return default settings if none exist
  const defaultSettings = {
    theme: "dark",
    language: "en",
    timezone: "America/New_York",
    animations: true,
    reducedMotion: false,
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    marketingEmails: false,
    bonusNotifications: true,
    gameNotifications: true,
    sportsbookNotifications: true,
    autoPlay: false,
    quickSpin: true,
    soundEffects: true,
    backgroundMusic: false,
    volumeLevel: 70,
    vibration: true,
    profileVisibility: "public",
    onlineStatus: true,
    dataCollection: true,
    thirdPartyIntegration: false,
    chatEnabled: true,
    friendRequests: true,
    directMessages: true,
    groupInvites: true,
    sessionTimeLimit: 240,
    dailyDepositLimit: 500,
    lossLimit: 200,
    realityChecks: true,
    cooloffPeriod: 0,
    luckyAIEnabled: true,
    luckyAIPersonality: "friendly",
    joseyAIEnabled: true,
    joseyAISocialFeatures: true,
  };

  const settings = userSettings.get(userId) || defaultSettings;
  res.json(settings);
};

// Update user settings
export const handleUpdateUserSettings: RequestHandler = (req, res) => {
  const { userId } = req.params;
  const newSettings = req.body;

  // Get current settings or defaults
  const currentSettings = userSettings.get(userId) || {};

  // Merge with new settings
  const updatedSettings = { ...currentSettings, ...newSettings };

  // Store updated settings
  userSettings.set(userId, updatedSettings);

  res.json({ success: true, settings: updatedSettings });
};

// Mock redemption storage
const redemptionRequests: any[] = [];

// Get all redemption requests (admin/staff)
export const handleGetAllRedemptions: RequestHandler = (req, res) => {
  const { adminId, staffId } = req.headers;

  if (!adminId && !staffId) {
    return res.status(401).json({ error: "Admin or staff access required" });
  }

  // Sort by requested date descending
  const sortedRequests = redemptionRequests.sort(
    (a, b) =>
      new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime(),
  );

  res.json(sortedRequests);
};

// Create redemption request
export const handleCreateRedemption: RequestHandler = (req, res) => {
  const { userId, username, amount, method, accountDetails } = req.body;

  if (!userId || !amount || amount < 100) {
    return res.status(400).json({ error: "Invalid redemption request" });
  }

  const redemption = {
    id: `redemption-${Date.now()}`,
    userId,
    username,
    amount,
    cashValue: amount, // 1 SC = $1 USD
    method,
    accountDetails,
    status: "pending",
    requestedAt: new Date(),
    kycRequired: true,
    kycCompleted: true, // Assume KYC is completed for demo
  };

  redemptionRequests.push(redemption);

  res.json({ success: true, redemption });
};

// Review redemption request (staff/admin)
export const handleReviewRedemption: RequestHandler = (req, res) => {
  const { requestId } = req.params;
  const { status, reviewNotes } = req.body;
  const { adminId, staffId, adminUsername, staffUsername } = req.headers;

  if (!adminId && !staffId) {
    return res.status(401).json({ error: "Admin or staff access required" });
  }

  const redemption = redemptionRequests.find((r) => r.id === requestId);
  if (!redemption) {
    return res.status(404).json({ error: "Redemption not found" });
  }

  redemption.status = status;
  redemption.reviewNotes = reviewNotes;
  redemption.reviewedAt = new Date();
  redemption.reviewedBy = adminUsername || staffUsername;

  if (status === "approved") {
    redemption.processedAt = new Date();
  }

  res.json({ success: true, redemption });
};
