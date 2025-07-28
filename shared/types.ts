export interface User {
  id: string;
  email: string;
  username: string;
  goldCoins: number;
  sweepsCoins: number;
  isVerified: boolean;
  role: "user" | "staff" | "admin";
  createdAt: Date;
  lastLogin: Date;
  kycStatus: "pending" | "approved" | "rejected";
}

export interface Balance {
  userId: string;
  goldCoins: number;
  sweepsCoins: number;
  lastUpdated: Date;
}

export interface MiniGamePlay {
  id: string;
  userId: string;
  gameType: "colin-shots" | "future-game";
  score: number;
  maxScore: number;
  scEarned: number;
  playedAt: Date;
  duration: number; // in seconds
}

export interface MiniGameCooldown {
  userId: string;
  gameType: string;
  lastPlayed: Date;
  nextAvailable: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  type: "purchase" | "win" | "bet" | "mini-game" | "bonus" | "withdrawal";
  amount: number;
  currency: "GC" | "SC" | "USD";
  description: string;
  createdAt: Date;
  status: "pending" | "completed" | "failed";
  metadata?: Record<string, any>;
}

export interface TickerItem {
  id: string;
  type: "win" | "jackpot" | "sports" | "bingo" | "promo" | "mini-game";
  content: string;
  userId?: string;
  amount?: number;
  gameType?: string;
  createdAt: Date;
  priority: number;
}

export interface PayPalPayment {
  id: string;
  userId: string;
  amount: number; // USD
  goldCoinsAwarded: number;
  sweepsCoinsBonus: number;
  paypalTransactionId: string;
  status: "pending" | "completed" | "failed";
  createdAt: Date;
}

export interface AdminStats {
  totalUsers: number;
  totalGoldCoins: number;
  totalSweepsCoins: number;
  dailyRevenue: number;
  miniGamePlays: number;
  totalPayouts: number;
}
