export interface UserProfile {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dateOfBirth: Date;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  kycStatus: 'pending' | 'approved' | 'rejected' | 'not_submitted';
  kycDocuments: KYCDocument[];
  accountVerificationLevel: 'basic' | 'verified' | 'premium';
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date;
  isActive: boolean;
  vipLevel: 'none' | 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  referralCode: string;
  referredBy?: string;
}

export interface KYCDocument {
  id: string;
  type: 'drivers_license' | 'passport' | 'state_id' | 'utility_bill' | 'bank_statement';
  fileName: string;
  fileUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  uploadedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  rejectionReason?: string;
}

export interface UserPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  language: string;
  timezone: string;
  currency: 'USD' | 'CAD' | 'EUR' | 'GBP';
  autoPlaySlots: boolean;
  soundEnabled: boolean;
  animationsEnabled: boolean;
}

export interface TransactionHistory {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'purchase' | 'win' | 'bet' | 'bonus' | 'refund' | 'redemption';
  amount: number;
  currency: 'GC' | 'SC' | 'USD';
  description: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  createdAt: Date;
  completedAt?: Date;
  reference?: string;
  metadata?: Record<string, any>;
  balanceAfter: {
    goldCoins: number;
    sweepsCoins: number;
  };
}

export interface GameHistoryEntry {
  id: string;
  userId: string;
  gameType: 'slot' | 'table' | 'bingo' | 'sportsbook' | 'mini_game';
  gameId: string;
  gameName: string;
  provider?: string;
  betAmount: number;
  winAmount: number;
  currency: 'GC' | 'SC';
  duration: number; // in seconds
  result: 'win' | 'loss' | 'bonus';
  multiplier?: number;
  features?: string[]; // bonus features triggered
  playedAt: Date;
  sessionId: string;
}

export interface RedemptionRequest {
  id: string;
  userId: string;
  username: string;
  amount: number; // SC amount
  cashValue: number; // USD equivalent (1 SC = $1)
  method: 'cashapp' | 'paypal' | 'bank_transfer' | 'check';
  accountDetails: RedemptionAccountDetails;
  status: 'pending' | 'staff_review' | 'admin_review' | 'approved' | 'denied' | 'processed' | 'paid';
  requestedAt: Date;
  reviewedAt?: Date;
  processedAt?: Date;
  paidAt?: Date;
  reviewedBy?: string;
  denialReason?: string;
  processingNotes?: string;
  kycRequired: boolean;
  kycCompleted: boolean;
}

export interface RedemptionAccountDetails {
  cashapp?: {
    cashtag: string;
    phoneNumber: string;
  };
  paypal?: {
    email: string;
    fullName: string;
  };
  bankTransfer?: {
    accountNumber: string;
    routingNumber: string;
    bankName: string;
    accountHolderName: string;
    accountType: 'checking' | 'savings';
  };
  check?: {
    fullName: string;
    mailingAddress: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
}

export interface UserBalance {
  userId: string;
  goldCoins: number;
  sweepsCoins: number;
  lastUpdated: Date;
  dailyBonusClaimed: boolean;
  dailyBonusStreak: number;
  weeklyBonusAvailable: boolean;
  lifetimeDeposits: number;
  lifetimeWithdrawals: number;
  totalWagered: {
    GC: number;
    SC: number;
  };
  totalWon: {
    GC: number;
    SC: number;
  };
}

export interface UserStats {
  userId: string;
  gamesPlayed: number;
  totalWagered: number;
  totalWon: number;
  biggestWin: {
    amount: number;
    currency: 'GC' | 'SC';
    gameName: string;
    date: Date;
  };
  favoriteGame: string;
  favoriteGameType: string;
  averageSessionTime: number; // in minutes
  longestSession: number; // in minutes
  winRate: number; // percentage
  currentStreak: number;
  longestWinStreak: number;
  totalRedemptions: number;
  totalRedemptionValue: number;
  vipProgress: {
    currentLevel: string;
    pointsEarned: number;
    pointsToNextLevel: number;
    nextLevel: string;
  };
}

export interface UserSession {
  id: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // in seconds
  gamesPlayed: number;
  totalWagered: {
    GC: number;
    SC: number;
  };
  totalWon: {
    GC: number;
    SC: number;
  };
  ipAddress: string;
  userAgent: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  isActive: boolean;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  achievementName: string;
  achievementDescription: string;
  achievementType: 'games' | 'wins' | 'loyalty' | 'special';
  earnedAt: Date;
  rewardAmount?: number;
  rewardCurrency?: 'GC' | 'SC';
  badgeIcon?: string;
}

export interface UserNotification {
  id: string;
  userId: string;
  type: 'bonus' | 'win' | 'redemption' | 'kyc' | 'promotion' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  readAt?: Date;
  actionUrl?: string;
  metadata?: Record<string, any>;
}
