// Client-side database interfaces and mock implementation
// This replaces the server-side SQLite implementation for browser compatibility

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  role: 'user' | 'staff' | 'admin';
  isActive: boolean;
  emailVerified: boolean;
  emailVerificationToken?: string;
  emailVerifiedAt?: Date;
  registrationDate: Date;
  lastLogin?: Date;
  loginAttempts: number;
  lockedUntil?: Date;
  profile: UserProfile;
  preferences: UserPreferences;
  kycStatus: 'pending' | 'verified' | 'rejected';
  kycDocuments?: KYCDocument[];
  playerLevel: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'VIP';
  vipManager?: string;
  accountRestrictions?: AccountRestriction[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  phoneNumber?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  avatar?: string;
  timezone?: string;
  language: string;
  totalDeposits: number;
  totalWithdrawals: number;
  lifetimeValue: number;
  riskScore: number;
  lastRiskAssessment: Date;
}

export interface UserPreferences {
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  emailMarketing: boolean;
  smsMarketing: boolean;
  autoPlayEnabled: boolean;
  fastSpinMode: boolean;
  currency: 'GC' | 'SC';
  theme: 'dark' | 'light' | 'auto';
  language: string;
  timeFormat: '12h' | '24h';
  privacySettings: {
    showOnLeaderboard: boolean;
    showWinsPublically: boolean;
    allowDirectMessages: boolean;
  };
}

export interface KYCDocument {
  id: string;
  userId: string;
  type: 'id' | 'passport' | 'utility_bill' | 'bank_statement' | 'other';
  filename: string;
  uploadDate: Date;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewDate?: Date;
  rejectionReason?: string;
}

export interface AccountRestriction {
  id: string;
  userId: string;
  type: 'deposit_limit' | 'loss_limit' | 'session_limit' | 'cooling_off' | 'self_exclusion';
  amount?: number;
  duration?: number; // in days
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  reason: string;
  createdBy: string;
}

export interface Wallet {
  id: string;
  userId: string;
  goldCoins: number;
  sweepCoins: number;
  lastUpdated: Date;
  pendingTransactions: number;
  frozenAmount: number;
  sweepCoinDetails: SweepCoinBatch[];
  dailyLimits: {
    depositLimit: number;
    lossLimit: number;
    usedToday: number;
    lastReset: Date;
  };
}

export interface SweepCoinBatch {
  id: string;
  userId: string;
  amount: number;
  purchaseDate: Date;
  expirationDate: Date;
  source: 'purchase' | 'bonus' | 'promotion' | 'tournament';
  packageId?: string;
  isExpired: boolean;
  usedAmount: number;
  remainingAmount: number;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'bet' | 'win' | 'purchase' | 'bonus' | 'redemption' | 'adjustment' | 'refund';
  currency: 'GC' | 'SC' | 'USD';
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  description: string;
  gameId?: string;
  gameName?: string;
  sessionId?: string;
  orderId?: string;
  redemptionId?: string;
  timestamp: Date;
  status: 'completed' | 'pending' | 'failed' | 'cancelled';
  metadata?: Record<string, any>;
  ip: string;
  device: string;
  location?: string;
}

export interface GameSession {
  id: string;
  userId: string;
  gameId: string;
  gameName: string;
  gameType: 'slot' | 'table' | 'live' | 'bingo' | 'sports';
  provider: 'coinkrazy' | 'pragmatic' | 'evolution' | 'netent' | 'microgaming' | 'other';
  startTime: Date;
  endTime?: Date;
  duration: number; // in seconds
  totalBets: number;
  totalWins: number;
  netResult: number;
  spinsCount: number;
  currency: 'GC' | 'SC';
  maxWin: number;
  avgBet: number;
  rtp: number; // actual RTP for this session
  bonusRoundsTriggered: number;
  freeSpinsWon: number;
  isActive: boolean;
  lastActivity: Date;
  ip: string;
  device: string;
  location?: string;
  sessionData?: Record<string, any>;
}

export interface GameHistory {
  id: string;
  sessionId: string;
  userId: string;
  gameId: string;
  spinNumber: number;
  betAmount: number;
  winAmount: number;
  symbols?: string[][];
  winLines?: number[];
  multiplier: number;
  bonusTriggered: boolean;
  freeSpins?: number;
  jackpotWin?: number;
  timestamp: Date;
  rng_seed?: string;
  gameState?: Record<string, any>;
}

export interface RedemptionRequest {
  id: string;
  userId: string;
  type: 'cash' | 'gift_card' | 'prize';
  amount: number;
  scAmount: number;
  method: 'cash_app' | 'paypal' | 'zelle' | 'digital_gift_card' | 'physical_prize';
  status: 'pending' | 'approved' | 'processing' | 'completed' | 'rejected' | 'cancelled';
  priority: 'standard' | 'vip' | 'urgent';
  requestDate: Date;
  approvalDate?: Date;
  completedDate?: Date;
  approvedBy?: string;
  processedBy?: string;
  rejectionReason?: string;
  paymentDetails: {
    cashAppTag?: string;
    paypalEmail?: string;
    zelleEmail?: string;
    giftCardProvider?: string;
    prizeId?: string;
    recipientName?: string;
    phoneNumber?: string;
    shippingAddress?: Address;
  };
  verificationDocuments: {
    idDocument?: string;
    proofOfAddress?: string;
    additionalDocs?: string[];
  };
  automaticProcessing: boolean;
  estimatedProcessingTime: string;
  actualProcessingTime?: number;
  fees: number;
  exchangeRate: number; // SC to USD rate at time of request
  transactionId?: string;
  adminNotes?: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Prize {
  id: string;
  name: string;
  description: string;
  category: 'electronics' | 'gift_cards' | 'experiences' | 'gaming' | 'luxury' | 'home' | 'travel';
  scCost: number;
  retailValue: number;
  image: string;
  images?: string[];
  availability: number;
  popularity: number;
  isDigital: boolean;
  isActive: boolean;
  processingTime: string;
  features: string[];
  specifications?: Record<string, any>;
  shippingWeight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  supplier?: string;
  supplierSku?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminAlert {
  id: string;
  type: 'fraud' | 'suspicious_activity' | 'multiple_accounts' | 'unusual_pattern' | 'geo_anomaly' | 'payment_fraud' | 'bot_activity' | 'account_takeover' | 'big_win' | 'system_alert' | 'redemption_request' | 'vip_activity' | 'maintenance' | 'security';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  userId?: string;
  username?: string;
  ipAddress: string;
  location?: string;
  device?: string;
  timestamp: Date;
  status: 'active' | 'investigating' | 'resolved' | 'false_positive';
  acknowledged: boolean;
  read: boolean;
  persistent: boolean;
  autoActions: string[];
  suggestedActions: {
    label: string;
    action: string;
    severity: 'info' | 'warning' | 'danger';
    immediate?: boolean;
  }[];
  metadata: Record<string, any>;
  soundEnabled: boolean;
  flashEnabled: boolean;
  riskScore: number;
  archived: boolean;
  resolvedBy?: string;
  resolvedAt?: Date;
  resolutionNotes?: string;
  escalationLevel: number;
  aiEmployeeAssigned?: string;
  chatMessages: AlertChatMessage[];
}

export interface AlertChatMessage {
  id: string;
  alertId: string;
  sender: 'admin' | 'ai' | 'system';
  senderName: string;
  message: string;
  timestamp: Date;
  messageType: 'text' | 'action' | 'system_update';
  metadata?: Record<string, any>;
}

export interface AIEmployee {
  id: string;
  name: string;
  role: 'customer_service' | 'security' | 'redemption' | 'marketing' | 'analytics' | 'vip_management' | 'compliance' | 'manager';
  specialty: string[];
  isActive: boolean;
  capabilities: string[];
  workingHours: {
    start: string; // HH:MM format
    end: string;
    timezone: string;
    workDays: number[]; // 0-6, Sunday to Saturday
  };
  performance: {
    tasksCompleted: number;
    averageResponseTime: number;
    successRate: number;
    lastActive: Date;
    hoursWorked: number;
    costSavings: number; // Based on $10/hour rate
  };
  configuration: {
    responseStyle: 'formal' | 'casual' | 'professional';
    escalationThreshold: number;
    autoApprovalLimits?: {
      maxAmount: number;
      riskScoreThreshold: number;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface AIEmployeeTask {
  id: string;
  employeeId: string;
  type: 'customer_inquiry' | 'security_review' | 'redemption_process' | 'alert_response' | 'player_communication' | 'data_analysis';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'escalated' | 'failed';
  assignedAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  duration?: number;
  description: string;
  data: Record<string, any>;
  result?: Record<string, any>;
  escalatedTo?: string;
  escalationReason?: string;
}

export interface AIEmployeeReport {
  id: string;
  employeeId: string;
  reportDate: Date;
  period: 'daily' | 'weekly' | 'monthly';
  metrics: {
    tasksCompleted: number;
    averageResponseTime: number;
    successRate: number;
    escalations: number;
    customerSatisfaction: number;
    costSavings: number;
    hoursWorked: number;
  };
  achievements: string[];
  areas_for_improvement: string[];
  recommendations: string[];
  isSubmitted: boolean;
  submittedTo: string[];
}

export interface TickerMessage {
  id: string;
  type: 'winner' | 'promotion' | 'news' | 'social' | 'jackpot' | 'tournament' | 'system';
  content: string;
  isActive: boolean;
  isAIGenerated: boolean;
  priority: number; // 1-10
  displayDuration: number; // seconds
  startDate?: Date;
  endDate?: Date;
  targetAudience?: 'all' | 'vip' | 'new_players' | 'high_rollers';
  gameId?: string;
  userId?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  createdBy: string; // user ID or 'ai'
  approvedBy?: string;
  viewCount: number;
  clickCount: number;
}

export interface SocialMediaPost {
  id: string;
  platform: 'facebook' | 'twitter' | 'instagram' | 'youtube' | 'tiktok';
  type: 'big_win' | 'promotion' | 'news' | 'engagement' | 'tournament';
  content: string;
  media?: string[]; // URLs to images/videos
  hashtags: string[];
  isScheduled: boolean;
  scheduledFor?: Date;
  postedAt?: Date;
  status: 'draft' | 'scheduled' | 'posted' | 'failed';
  engagement: {
    likes: number;
    shares: number;
    comments: number;
    views: number;
  };
  isAIGenerated: boolean;
  createdBy: string;
  approvedBy?: string;
  externalPostId?: string;
  metadata?: Record<string, any>;
}

export interface CasinoAnalytics {
  id: string;
  date: Date;
  metrics: {
    totalUsers: number;
    activeUsers: number;
    newRegistrations: number;
    totalRevenue: number;
    totalDeposits: number;
    totalWithdrawals: number;
    grossGamingRevenue: number;
    houseEdge: number;
    playerRetention: {
      day1: number;
      day7: number;
      day30: number;
    };
    averageSessionDuration: number;
    mostPlayedGames: string[];
    biggestWin: {
      amount: number;
      gameId: string;
      userId: string;
    };
    totalSpins: number;
    totalBets: number;
    rtp: number;
  };
  gameMetrics: GameMetrics[];
  financialMetrics: {
    operatingCosts: number;
    aiEmployeeSavings: number;
    customerAcquisitionCost: number;
    lifetimeValue: number;
    payoutRatio: number;
  };
}

export interface GameMetrics {
  gameId: string;
  gameName: string;
  provider: string;
  totalPlayers: number;
  totalBets: number;
  totalWins: number;
  grossRevenue: number;
  rtp: number;
  popularityScore: number;
  avgSessionDuration: number;
  avgBetAmount: number;
  biggestWin: number;
  bonusTriggeredCount: number;
  jackpotHits: number;
}

export interface SystemSettings {
  id: string;
  category: 'general' | 'security' | 'payments' | 'games' | 'ai' | 'marketing';
  key: string;
  value: string;
  dataType: 'string' | 'number' | 'boolean' | 'json';
  description: string;
  isPublic: boolean;
  updatedBy: string;
  updatedAt: Date;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  details: Record<string, any>;
  ip: string;
  userAgent: string;
  timestamp: Date;
  severity: 'info' | 'warning' | 'error' | 'critical';
}

// Mock database service for client-side use
export class DatabaseService {
  private data: {
    users: User[];
    transactions: Transaction[];
    sessions: GameSession[];
    redemptions: RedemptionRequest[];
    alerts: AdminAlert[];
    employees: AIEmployee[];
    tickets: TickerMessage[];
  } = {
    users: [],
    transactions: [],
    sessions: [],
    redemptions: [],
    alerts: [],
    employees: [],
    tickets: []
  };

  constructor() {
    // Initialize with some mock data if needed
    this.loadMockData();
  }

  private loadMockData() {
    // Load from localStorage or initialize with defaults
    const savedData = localStorage.getItem('casino_database');
    if (savedData) {
      try {
        this.data = JSON.parse(savedData);
      } catch (error) {
        console.warn('Failed to load saved data, using defaults');
      }
    }
  }

  private saveData() {
    try {
      localStorage.setItem('casino_database', JSON.stringify(this.data));
    } catch (error) {
      console.warn('Failed to save data to localStorage');
    }
  }

  // User management methods
  createUser(user: Partial<User>): User {
    const id = `user_${Date.now()}`;
    const now = new Date();
    
    const newUser: User = {
      id,
      username: user.username!,
      email: user.email!,
      passwordHash: user.passwordHash!,
      role: user.role || 'user',
      isActive: true,
      emailVerified: false,
      registrationDate: now,
      loginAttempts: 0,
      profile: {
        language: 'en',
        totalDeposits: 0,
        totalWithdrawals: 0,
        lifetimeValue: 0,
        riskScore: 0,
        lastRiskAssessment: now
      },
      preferences: {
        soundEnabled: true,
        notificationsEnabled: true,
        emailMarketing: true,
        smsMarketing: false,
        autoPlayEnabled: false,
        fastSpinMode: false,
        currency: 'GC',
        theme: 'dark',
        language: 'en',
        timeFormat: '12h',
        privacySettings: {
          showOnLeaderboard: true,
          showWinsPublically: true,
          allowDirectMessages: true
        }
      },
      kycStatus: 'pending',
      playerLevel: 'Bronze',
      createdAt: now,
      updatedAt: now
    };

    this.data.users.push(newUser);
    this.saveData();
    return newUser;
  }

  // Transaction methods
  createTransaction(transaction: Partial<Transaction>): Transaction {
    const id = `txn_${Date.now()}`;
    const now = new Date();
    
    const newTransaction: Transaction = {
      id,
      userId: transaction.userId!,
      type: transaction.type!,
      currency: transaction.currency!,
      amount: transaction.amount!,
      balanceBefore: transaction.balanceBefore!,
      balanceAfter: transaction.balanceAfter!,
      description: transaction.description!,
      gameId: transaction.gameId,
      gameName: transaction.gameName,
      sessionId: transaction.sessionId,
      orderId: transaction.orderId,
      redemptionId: transaction.redemptionId,
      timestamp: now,
      status: transaction.status || 'completed',
      metadata: transaction.metadata,
      ip: transaction.ip || '127.0.0.1',
      device: transaction.device || 'Unknown',
      location: transaction.location
    };

    this.data.transactions.push(newTransaction);
    this.saveData();
    return newTransaction;
  }

  // Query methods
  getUserById(id: string): User | null {
    return this.data.users.find(user => user.id === id) || null;
  }

  getUserByEmail(email: string): User | null {
    return this.data.users.find(user => user.email === email) || null;
  }

  getTransactionsByUserId(userId: string): Transaction[] {
    return this.data.transactions.filter(txn => txn.userId === userId);
  }

  getKYCDocuments(userId: string): KYCDocument[] {
    // Mock implementation
    return [];
  }

  getAccountRestrictions(userId: string): AccountRestriction[] {
    // Mock implementation
    return [];
  }

  close() {
    // No-op for client-side implementation
  }
}

// Export singleton instance
export const db = new DatabaseService();

// Notification and subscription functions (mock implementations)
export function subscribeToNotifications(userId: string, callback: (notification: any) => void) {
  // Mock implementation - would use WebSocket or SSE in real app
  return {
    unsubscribe: () => {}
  };
}

export function subscribeToGlobalNotifications(callback: (notification: any) => void) {
  // Mock implementation
  return {
    unsubscribe: () => {}
  };
}

export function subscribeToAdminAlerts(callback: (alert: any) => void) {
  // Mock implementation
  return {
    unsubscribe: () => {}
  };
}

// Additional interfaces for compatibility
export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  userId: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  metadata?: Record<string, any>;
}

export interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: Date;
  channel: string;
  userId: string;
  metadata?: Record<string, any>;
}

// Sports betting interfaces
export interface SportsEvent {
  id: string;
  sport: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  startTime: Date;
  status: 'upcoming' | 'live' | 'finished' | 'postponed';
  score?: {
    home: number;
    away: number;
  };
  markets: SportsMarket[];
  isLive: boolean;
  metadata?: Record<string, any>;
}

export interface SportsMarket {
  id: string;
  eventId: string;
  type: 'moneyline' | 'spread' | 'total' | 'props';
  name: string;
  outcomes: {
    id: string;
    name: string;
    odds: number;
    isActive: boolean;
  }[];
  isActive: boolean;
  metadata?: Record<string, any>;
}

export interface SportsBet {
  id: string;
  userId: string;
  eventId: string;
  marketId: string;
  outcomeId: string;
  amount: number;
  odds: number;
  potentialWin: number;
  status: 'pending' | 'won' | 'lost' | 'voided' | 'cashed_out';
  placedAt: Date;
  settledAt?: Date;
  metadata?: Record<string, any>;
}
