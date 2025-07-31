import { Database } from 'better-sqlite3';

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

// Database service class
export class DatabaseService {
  private db: Database;

  constructor(dbPath: string = 'casino.db') {
    this.db = new Database(dbPath);
    this.initializeTables();
  }

  private initializeTables() {
    // Create all tables with proper schema
    this.db.exec(`
      -- Users table
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user',
        is_active BOOLEAN DEFAULT 1,
        email_verified BOOLEAN DEFAULT 0,
        email_verification_token TEXT,
        email_verified_at DATETIME,
        registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login DATETIME,
        login_attempts INTEGER DEFAULT 0,
        locked_until DATETIME,
        profile TEXT, -- JSON
        preferences TEXT, -- JSON
        kyc_status TEXT DEFAULT 'pending',
        player_level TEXT DEFAULT 'Bronze',
        vip_manager TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- KYC Documents table
      CREATE TABLE IF NOT EXISTS kyc_documents (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        type TEXT NOT NULL,
        filename TEXT NOT NULL,
        upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'pending',
        reviewed_by TEXT,
        review_date DATETIME,
        rejection_reason TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

      -- Account Restrictions table
      CREATE TABLE IF NOT EXISTS account_restrictions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        type TEXT NOT NULL,
        amount REAL,
        duration INTEGER,
        start_date DATETIME NOT NULL,
        end_date DATETIME,
        is_active BOOLEAN DEFAULT 1,
        reason TEXT NOT NULL,
        created_by TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

      -- Wallets table
      CREATE TABLE IF NOT EXISTS wallets (
        id TEXT PRIMARY KEY,
        user_id TEXT UNIQUE NOT NULL,
        gold_coins REAL DEFAULT 0,
        sweep_coins REAL DEFAULT 0,
        last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
        pending_transactions INTEGER DEFAULT 0,
        frozen_amount REAL DEFAULT 0,
        daily_limits TEXT, -- JSON
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

      -- Sweep Coin Batches table
      CREATE TABLE IF NOT EXISTS sweep_coin_batches (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        amount REAL NOT NULL,
        purchase_date DATETIME NOT NULL,
        expiration_date DATETIME NOT NULL,
        source TEXT NOT NULL,
        package_id TEXT,
        is_expired BOOLEAN DEFAULT 0,
        used_amount REAL DEFAULT 0,
        remaining_amount REAL NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

      -- Transactions table
      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        type TEXT NOT NULL,
        currency TEXT NOT NULL,
        amount REAL NOT NULL,
        balance_before REAL NOT NULL,
        balance_after REAL NOT NULL,
        description TEXT NOT NULL,
        game_id TEXT,
        game_name TEXT,
        session_id TEXT,
        order_id TEXT,
        redemption_id TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'completed',
        metadata TEXT, -- JSON
        ip TEXT NOT NULL,
        device TEXT NOT NULL,
        location TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

      -- Game Sessions table
      CREATE TABLE IF NOT EXISTS game_sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        game_id TEXT NOT NULL,
        game_name TEXT NOT NULL,
        game_type TEXT NOT NULL,
        provider TEXT NOT NULL,
        start_time DATETIME DEFAULT CURRENT_TIMESTAMP,
        end_time DATETIME,
        duration INTEGER DEFAULT 0,
        total_bets REAL DEFAULT 0,
        total_wins REAL DEFAULT 0,
        net_result REAL DEFAULT 0,
        spins_count INTEGER DEFAULT 0,
        currency TEXT NOT NULL,
        max_win REAL DEFAULT 0,
        avg_bet REAL DEFAULT 0,
        rtp REAL DEFAULT 0,
        bonus_rounds_triggered INTEGER DEFAULT 0,
        free_spins_won INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT 1,
        last_activity DATETIME DEFAULT CURRENT_TIMESTAMP,
        ip TEXT NOT NULL,
        device TEXT NOT NULL,
        location TEXT,
        session_data TEXT, -- JSON
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

      -- Game History table
      CREATE TABLE IF NOT EXISTS game_history (
        id TEXT PRIMARY KEY,
        session_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        game_id TEXT NOT NULL,
        spin_number INTEGER NOT NULL,
        bet_amount REAL NOT NULL,
        win_amount REAL NOT NULL,
        symbols TEXT, -- JSON
        win_lines TEXT, -- JSON
        multiplier REAL DEFAULT 1,
        bonus_triggered BOOLEAN DEFAULT 0,
        free_spins INTEGER,
        jackpot_win REAL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        rng_seed TEXT,
        game_state TEXT, -- JSON
        FOREIGN KEY (session_id) REFERENCES game_sessions(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

      -- Redemption Requests table
      CREATE TABLE IF NOT EXISTS redemption_requests (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        type TEXT NOT NULL,
        amount REAL NOT NULL,
        sc_amount REAL NOT NULL,
        method TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        priority TEXT DEFAULT 'standard',
        request_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        approval_date DATETIME,
        completed_date DATETIME,
        approved_by TEXT,
        processed_by TEXT,
        rejection_reason TEXT,
        payment_details TEXT, -- JSON
        verification_documents TEXT, -- JSON
        automatic_processing BOOLEAN DEFAULT 0,
        estimated_processing_time TEXT,
        actual_processing_time INTEGER,
        fees REAL DEFAULT 0,
        exchange_rate REAL DEFAULT 5,
        transaction_id TEXT,
        admin_notes TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

      -- Prizes table
      CREATE TABLE IF NOT EXISTS prizes (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        sc_cost REAL NOT NULL,
        retail_value REAL NOT NULL,
        image TEXT,
        images TEXT, -- JSON array
        availability INTEGER NOT NULL,
        popularity INTEGER DEFAULT 0,
        is_digital BOOLEAN DEFAULT 0,
        is_active BOOLEAN DEFAULT 1,
        processing_time TEXT NOT NULL,
        features TEXT, -- JSON array
        specifications TEXT, -- JSON
        shipping_weight REAL,
        dimensions TEXT, -- JSON
        supplier TEXT,
        supplier_sku TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Admin Alerts table
      CREATE TABLE IF NOT EXISTS admin_alerts (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        severity TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        user_id TEXT,
        username TEXT,
        ip_address TEXT NOT NULL,
        location TEXT,
        device TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'active',
        acknowledged BOOLEAN DEFAULT 0,
        read BOOLEAN DEFAULT 0,
        persistent BOOLEAN DEFAULT 1,
        auto_actions TEXT, -- JSON array
        suggested_actions TEXT, -- JSON array
        metadata TEXT, -- JSON
        sound_enabled BOOLEAN DEFAULT 1,
        flash_enabled BOOLEAN DEFAULT 1,
        risk_score INTEGER DEFAULT 0,
        archived BOOLEAN DEFAULT 0,
        resolved_by TEXT,
        resolved_at DATETIME,
        resolution_notes TEXT,
        escalation_level INTEGER DEFAULT 0,
        ai_employee_assigned TEXT
      );

      -- Alert Chat Messages table
      CREATE TABLE IF NOT EXISTS alert_chat_messages (
        id TEXT PRIMARY KEY,
        alert_id TEXT NOT NULL,
        sender TEXT NOT NULL,
        sender_name TEXT NOT NULL,
        message TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        message_type TEXT DEFAULT 'text',
        metadata TEXT, -- JSON
        FOREIGN KEY (alert_id) REFERENCES admin_alerts(id)
      );

      -- AI Employees table
      CREATE TABLE IF NOT EXISTS ai_employees (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        specialty TEXT, -- JSON array
        is_active BOOLEAN DEFAULT 1,
        capabilities TEXT, -- JSON array
        working_hours TEXT, -- JSON
        performance TEXT, -- JSON
        configuration TEXT, -- JSON
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- AI Employee Tasks table
      CREATE TABLE IF NOT EXISTS ai_employee_tasks (
        id TEXT PRIMARY KEY,
        employee_id TEXT NOT NULL,
        type TEXT NOT NULL,
        priority TEXT DEFAULT 'medium',
        status TEXT DEFAULT 'pending',
        assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        started_at DATETIME,
        completed_at DATETIME,
        duration INTEGER,
        description TEXT NOT NULL,
        data TEXT, -- JSON
        result TEXT, -- JSON
        escalated_to TEXT,
        escalation_reason TEXT,
        FOREIGN KEY (employee_id) REFERENCES ai_employees(id)
      );

      -- AI Employee Reports table
      CREATE TABLE IF NOT EXISTS ai_employee_reports (
        id TEXT PRIMARY KEY,
        employee_id TEXT NOT NULL,
        report_date DATE NOT NULL,
        period TEXT NOT NULL,
        metrics TEXT, -- JSON
        achievements TEXT, -- JSON array
        areas_for_improvement TEXT, -- JSON array
        recommendations TEXT, -- JSON array
        is_submitted BOOLEAN DEFAULT 0,
        submitted_to TEXT, -- JSON array
        FOREIGN KEY (employee_id) REFERENCES ai_employees(id)
      );

      -- Ticker Messages table
      CREATE TABLE IF NOT EXISTS ticker_messages (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        content TEXT NOT NULL,
        is_active BOOLEAN DEFAULT 1,
        is_ai_generated BOOLEAN DEFAULT 0,
        priority INTEGER DEFAULT 5,
        display_duration INTEGER DEFAULT 4000,
        start_date DATETIME,
        end_date DATETIME,
        target_audience TEXT DEFAULT 'all',
        game_id TEXT,
        user_id TEXT,
        metadata TEXT, -- JSON
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_by TEXT NOT NULL,
        approved_by TEXT,
        view_count INTEGER DEFAULT 0,
        click_count INTEGER DEFAULT 0
      );

      -- Social Media Posts table
      CREATE TABLE IF NOT EXISTS social_media_posts (
        id TEXT PRIMARY KEY,
        platform TEXT NOT NULL,
        type TEXT NOT NULL,
        content TEXT NOT NULL,
        media TEXT, -- JSON array
        hashtags TEXT, -- JSON array
        is_scheduled BOOLEAN DEFAULT 0,
        scheduled_for DATETIME,
        posted_at DATETIME,
        status TEXT DEFAULT 'draft',
        engagement TEXT, -- JSON
        is_ai_generated BOOLEAN DEFAULT 0,
        created_by TEXT NOT NULL,
        approved_by TEXT,
        external_post_id TEXT,
        metadata TEXT -- JSON
      );

      -- Casino Analytics table
      CREATE TABLE IF NOT EXISTS casino_analytics (
        id TEXT PRIMARY KEY,
        date DATE NOT NULL,
        metrics TEXT, -- JSON
        game_metrics TEXT, -- JSON array
        financial_metrics TEXT -- JSON
      );

      -- System Settings table
      CREATE TABLE IF NOT EXISTS system_settings (
        id TEXT PRIMARY KEY,
        category TEXT NOT NULL,
        key TEXT NOT NULL,
        value TEXT NOT NULL,
        data_type TEXT NOT NULL,
        description TEXT NOT NULL,
        is_public BOOLEAN DEFAULT 0,
        updated_by TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(category, key)
      );

      -- Audit Log table
      CREATE TABLE IF NOT EXISTS audit_log (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        action TEXT NOT NULL,
        resource TEXT NOT NULL,
        resource_id TEXT NOT NULL,
        details TEXT, -- JSON
        ip TEXT NOT NULL,
        user_agent TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        severity TEXT DEFAULT 'info'
      );

      -- Create indexes for better performance
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
      CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
      CREATE INDEX IF NOT EXISTS idx_transactions_timestamp ON transactions(timestamp);
      CREATE INDEX IF NOT EXISTS idx_game_sessions_user_id ON game_sessions(user_id);
      CREATE INDEX IF NOT EXISTS idx_game_sessions_game_id ON game_sessions(game_id);
      CREATE INDEX IF NOT EXISTS idx_redemption_requests_user_id ON redemption_requests(user_id);
      CREATE INDEX IF NOT EXISTS idx_redemption_requests_status ON redemption_requests(status);
      CREATE INDEX IF NOT EXISTS idx_admin_alerts_timestamp ON admin_alerts(timestamp);
      CREATE INDEX IF NOT EXISTS idx_admin_alerts_status ON admin_alerts(status);
      CREATE INDEX IF NOT EXISTS idx_sweep_coin_batches_user_id ON sweep_coin_batches(user_id);
      CREATE INDEX IF NOT EXISTS idx_sweep_coin_batches_expiration ON sweep_coin_batches(expiration_date);
    `);
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

    const stmt = this.db.prepare(`
      INSERT INTO users (
        id, username, email, password_hash, role, is_active, email_verified,
        registration_date, login_attempts, profile, preferences, kyc_status,
        player_level, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      newUser.id,
      newUser.username,
      newUser.email,
      newUser.passwordHash,
      newUser.role,
      newUser.isActive ? 1 : 0,
      newUser.emailVerified ? 1 : 0,
      newUser.registrationDate.toISOString(),
      newUser.loginAttempts,
      JSON.stringify(newUser.profile),
      JSON.stringify(newUser.preferences),
      newUser.kycStatus,
      newUser.playerLevel,
      newUser.createdAt.toISOString(),
      newUser.updatedAt.toISOString()
    );

    // Create wallet for new user
    this.createWallet(newUser.id);

    return newUser;
  }

  // Wallet management methods
  createWallet(userId: string): Wallet {
    const wallet: Wallet = {
      id: `wallet_${Date.now()}`,
      userId,
      goldCoins: 25000, // Starting bonus
      sweepCoins: 0,
      lastUpdated: new Date(),
      pendingTransactions: 0,
      frozenAmount: 0,
      sweepCoinDetails: [],
      dailyLimits: {
        depositLimit: 5000,
        lossLimit: 1000,
        usedToday: 0,
        lastReset: new Date()
      }
    };

    const stmt = this.db.prepare(`
      INSERT INTO wallets (
        id, user_id, gold_coins, sweep_coins, last_updated,
        pending_transactions, frozen_amount, daily_limits
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      wallet.id,
      wallet.userId,
      wallet.goldCoins,
      wallet.sweepCoins,
      wallet.lastUpdated.toISOString(),
      wallet.pendingTransactions,
      wallet.frozenAmount,
      JSON.stringify(wallet.dailyLimits)
    );

    return wallet;
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

    const stmt = this.db.prepare(`
      INSERT INTO transactions (
        id, user_id, type, currency, amount, balance_before, balance_after,
        description, game_id, game_name, session_id, order_id, redemption_id,
        timestamp, status, metadata, ip, device, location
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      newTransaction.id,
      newTransaction.userId,
      newTransaction.type,
      newTransaction.currency,
      newTransaction.amount,
      newTransaction.balanceBefore,
      newTransaction.balanceAfter,
      newTransaction.description,
      newTransaction.gameId,
      newTransaction.gameName,
      newTransaction.sessionId,
      newTransaction.orderId,
      newTransaction.redemptionId,
      newTransaction.timestamp.toISOString(),
      newTransaction.status,
      newTransaction.metadata ? JSON.stringify(newTransaction.metadata) : null,
      newTransaction.ip,
      newTransaction.device,
      newTransaction.location
    );

    return newTransaction;
  }

  // Query methods
  getUserById(id: string): User | null {
    const stmt = this.db.prepare('SELECT * FROM users WHERE id = ?');
    const row = stmt.get(id) as any;
    
    if (!row) return null;
    
    return {
      ...row,
      isActive: Boolean(row.is_active),
      emailVerified: Boolean(row.email_verified),
      registrationDate: new Date(row.registration_date),
      lastLogin: row.last_login ? new Date(row.last_login) : undefined,
      lockedUntil: row.locked_until ? new Date(row.locked_until) : undefined,
      emailVerifiedAt: row.email_verified_at ? new Date(row.email_verified_at) : undefined,
      profile: JSON.parse(row.profile || '{}'),
      preferences: JSON.parse(row.preferences || '{}'),
      kycDocuments: this.getKYCDocuments(id),
      accountRestrictions: this.getAccountRestrictions(id),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }

  getUserByEmail(email: string): User | null {
    const stmt = this.db.prepare('SELECT * FROM users WHERE email = ?');
    const row = stmt.get(email) as any;
    
    if (!row) return null;
    
    return this.getUserById(row.id);
  }

  getKYCDocuments(userId: string): KYCDocument[] {
    const stmt = this.db.prepare('SELECT * FROM kyc_documents WHERE user_id = ?');
    const rows = stmt.all(userId) as any[];
    
    return rows.map(row => ({
      ...row,
      uploadDate: new Date(row.upload_date),
      reviewDate: row.review_date ? new Date(row.review_date) : undefined
    }));
  }

  getAccountRestrictions(userId: string): AccountRestriction[] {
    const stmt = this.db.prepare('SELECT * FROM account_restrictions WHERE user_id = ? AND is_active = 1');
    const rows = stmt.all(userId) as any[];
    
    return rows.map(row => ({
      ...row,
      isActive: Boolean(row.is_active),
      startDate: new Date(row.start_date),
      endDate: row.end_date ? new Date(row.end_date) : undefined
    }));
  }

  close() {
    this.db.close();
  }
}

// Export types and service
export const db = new DatabaseService();

// Notification and subscription functions
export function subscribeToNotifications(userId: string, callback: (notification: any) => void) {
  // Mock implementation - in real app would use WebSocket or SSE
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
