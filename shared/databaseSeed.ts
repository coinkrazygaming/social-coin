import {
  AIEmployee,
  AdminToolbarSettings,
  BugReport,
  DocumentationSection,
  AdminTask,
  AdminChatMessage,
  DEFAULT_AI_EMPLOYEES,
} from "./adminToolbarTypes";

// Database Schema Definitions
export interface DatabaseSchema {
  // User Management
  users: {
    id: string;
    username: string;
    email: string;
    password_hash: string;
    role: "user" | "staff" | "admin";
    status: "active" | "suspended" | "banned";
    verification_status: "pending" | "verified" | "rejected";
    age_verified: boolean;
    created_at: Date;
    updated_at: Date;
    last_login: Date;
    profile: {
      first_name?: string;
      last_name?: string;
      phone?: string;
      address?: {
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
      };
      date_of_birth?: Date;
      profile_image?: string;
    };
    preferences: {
      notifications: boolean;
      marketing_emails: boolean;
      sound_enabled: boolean;
      theme: "light" | "dark" | "auto";
      language: string;
      timezone: string;
    };
    limits: {
      daily_spend_limit?: number;
      session_time_limit?: number;
      loss_limit?: number;
      self_exclusion_until?: Date;
    };
  };

  // Wallet System
  wallets: {
    id: string;
    user_id: string;
    gc_balance: number; // Gold Coins
    sc_balance: number; // Sweeps Coins
    reserved_gc: number; // Reserved for pending bets
    reserved_sc: number; // Reserved for pending bets
    total_gc_purchased: number;
    total_sc_earned: number;
    total_gc_spent: number;
    total_sc_redeemed: number;
    created_at: Date;
    updated_at: Date;
  };

  // Transaction History
  transactions: {
    id: string;
    user_id: string;
    wallet_id: string;
    type: "purchase" | "win" | "bet" | "bonus" | "redemption" | "refund";
    currency: "GC" | "SC";
    amount: number;
    balance_before: number;
    balance_after: number;
    description: string;
    reference_id?: string; // Game session, purchase order, etc.
    status: "pending" | "completed" | "failed" | "cancelled";
    metadata?: Record<string, any>;
    created_at: Date;
    processed_at?: Date;
  };

  // Game Sessions & Spins
  game_sessions: {
    id: string;
    user_id: string;
    game_id: string;
    currency: "GC" | "SC";
    start_time: Date;
    end_time?: Date;
    total_bet: number;
    total_win: number;
    spin_count: number;
    max_bet: number;
    max_win: number;
    session_duration?: number; // in seconds
    ip_address: string;
    user_agent: string;
    device_info: Record<string, any>;
  };

  spin_logs: {
    id: string;
    session_id: string;
    user_id: string;
    game_id: string;
    bet_amount: number;
    win_amount: number;
    currency: "GC" | "SC";
    spin_result: Record<string, any>; // Game-specific result data
    rtp_contribution: number;
    timestamp: Date;
    is_bonus_round: boolean;
    multiplier?: number;
    symbols?: string[];
    paylines?: number[];
    metadata?: Record<string, any>;
  };

  // Games & API Providers
  games: {
    id: string;
    name: string;
    slug: string;
    provider_id: string;
    category: "slots" | "table" | "card" | "specialty";
    theme: string;
    rtp: number; // Return to Player percentage
    volatility: "low" | "medium" | "high";
    min_bet_gc: number;
    max_bet_gc: number;
    min_bet_sc: number;
    max_bet_sc: number;
    max_win_multiplier: number;
    thumbnail_url: string;
    background_url?: string;
    demo_available: boolean;
    mobile_optimized: boolean;
    status: "active" | "maintenance" | "disabled";
    features: string[]; // free_spins, bonus_rounds, progressive, etc.
    paylines?: number;
    reels?: number;
    symbols?: string[];
    bonus_features?: Record<string, any>;
    created_at: Date;
    updated_at: Date;
  };

  api_providers: {
    id: string;
    name: string;
    api_endpoint: string;
    auth_method: "api_key" | "oauth" | "basic";
    credentials: Record<string, string>; // Encrypted
    rate_limit: number;
    status: "active" | "inactive" | "maintenance";
    game_count: number;
    supported_currencies: string[];
    webhook_url?: string;
    last_sync: Date;
    created_at: Date;
    updated_at: Date;
  };

  // Social Casino Statistics
  social_casino_stats: {
    id: string;
    date: Date; // Daily statistics
    total_players: number;
    active_players: number;
    new_registrations: number;
    total_games_played: number;
    total_spins: number;
    total_gc_wagered: number;
    total_sc_wagered: number;
    total_sc_won: number;
    total_sc_redeemed: number;
    average_session_time: number;
    top_game_id: string;
    peak_concurrent_users: number;
    peak_time: Date;
    revenue_gc: number; // GC purchases
    redemptions_processed: number;
    new_game_launches: number;
    created_at: Date;
  };

  // Admin Toolbar & AI System
  ai_employees: {
    id: string;
    name: string;
    role: string;
    specialization: string;
    status: "online" | "busy" | "offline";
    avatar: string;
    description: string;
    capabilities: string[];
    performance_score: number;
    tasks_completed: number;
    response_time_avg: number;
    last_active: Date;
    created_at: Date;
    updated_at: Date;
    configuration: Record<string, any>;
  };

  admin_chat_messages: {
    id: string;
    sender_id: string;
    sender_name: string;
    sender_type: "admin" | "staff" | "ai_employee";
    message: string;
    timestamp: Date;
    attachments?: string[];
    reply_to?: string;
    reactions?: Record<string, string[]>;
    metadata?: Record<string, any>;
  };

  admin_tasks: {
    id: string;
    title: string;
    description: string;
    priority: "low" | "medium" | "high" | "urgent";
    status: "pending" | "assigned" | "in_progress" | "completed" | "cancelled";
    assigned_to?: string;
    assigned_by: string;
    category:
      | "bug_fix"
      | "feature"
      | "maintenance"
      | "content"
      | "security"
      | "compliance";
    due_date?: Date;
    completed_at?: Date;
    tags: string[];
    attachments?: string[];
    estimated_hours?: number;
    actual_hours?: number;
    created_at: Date;
    updated_at: Date;
  };

  task_comments: {
    id: string;
    task_id: string;
    user_id: string;
    user_name: string;
    message: string;
    timestamp: Date;
    attachments?: string[];
  };

  bug_reports: {
    id: string;
    title: string;
    description: string;
    severity: "low" | "medium" | "high" | "critical";
    status: "open" | "investigating" | "in_progress" | "resolved" | "closed";
    reported_by: string;
    assigned_to?: string;
    category:
      | "frontend"
      | "backend"
      | "database"
      | "security"
      | "performance"
      | "ui_ux";
    reproduction_steps: string[];
    expected_behavior: string;
    actual_behavior: string;
    environment: {
      browser?: string;
      device?: string;
      os?: string;
      url?: string;
    };
    screenshots?: string[];
    logs?: string[];
    barcode: string;
    tags: string[];
    related_issues?: string[];
    created_at: Date;
    updated_at: Date;
    resolved_at?: Date;
  };

  documentation_sections: {
    id: string;
    title: string;
    category: "user" | "staff" | "admin";
    content: string; // Markdown content
    subcategories: string[];
    tags: string[];
    visibility: "public" | "staff_only" | "admin_only";
    version: string;
    author_id: string;
    last_updated_by: string;
    attachments?: string[];
    related_sections?: string[];
    view_count: number;
    rating_sum: number;
    rating_count: number;
    created_at: Date;
    updated_at: Date;
  };

  admin_toolbar_settings: {
    id: string;
    user_id: string;
    position: "right" | "left";
    minimized: boolean;
    theme: "light" | "dark" | "auto";
    notifications: boolean;
    sound_enabled: boolean;
    auto_hide_inactive: boolean;
    quick_actions: string[];
    favorite_features: string[];
    custom_shortcuts: Record<string, string>;
    chat_notifications: boolean;
    reporting_enabled: boolean;
    created_at: Date;
    updated_at: Date;
  };

  // Social Media & Marketing
  social_media_posts: {
    id: string;
    platform: "facebook" | "twitter" | "instagram" | "linkedin";
    content: string;
    media_urls?: string[];
    scheduled_for?: Date;
    posted_at?: Date;
    status: "draft" | "scheduled" | "posted" | "failed";
    engagement: {
      likes: number;
      shares: number;
      comments: number;
      clicks: number;
    };
    author_id: string;
    campaign_id?: string;
    created_at: Date;
    updated_at: Date;
  };

  // Compliance & Security
  compliance_logs: {
    id: string;
    type:
      | "age_verification"
      | "kyc"
      | "anti_fraud"
      | "responsible_gaming"
      | "audit";
    user_id?: string;
    action: string;
    details: Record<string, any>;
    result: "pass" | "fail" | "pending" | "review_required";
    performed_by: string;
    timestamp: Date;
    reference_id?: string;
  };

  security_alerts: {
    id: string;
    type:
      | "suspicious_activity"
      | "fraud_attempt"
      | "system_breach"
      | "policy_violation";
    severity: "low" | "medium" | "high" | "critical";
    user_id?: string;
    description: string;
    details: Record<string, any>;
    status: "open" | "investigating" | "resolved" | "false_positive";
    created_by: string; // System or user ID
    assigned_to?: string;
    resolved_at?: Date;
    created_at: Date;
    updated_at: Date;
  };

  // Promotions & Bonuses
  promotions: {
    id: string;
    name: string;
    description: string;
    type:
      | "welcome_bonus"
      | "daily_bonus"
      | "deposit_match"
      | "free_coins"
      | "loyalty_reward";
    currency: "GC" | "SC" | "both";
    amount: number;
    percentage?: number; // For deposit match
    minimum_purchase?: number;
    maximum_bonus?: number;
    start_date: Date;
    end_date: Date;
    status: "active" | "inactive" | "expired";
    usage_limit?: number;
    usage_count: number;
    terms_conditions: string;
    created_by: string;
    created_at: Date;
    updated_at: Date;
  };

  user_promotions: {
    id: string;
    user_id: string;
    promotion_id: string;
    claimed_at: Date;
    amount_awarded: number;
    currency: "GC" | "SC";
    status: "claimed" | "used" | "expired";
    transaction_id?: string;
  };

  // Customer Support
  support_tickets: {
    id: string;
    user_id: string;
    subject: string;
    description: string;
    category:
      | "account"
      | "payment"
      | "technical"
      | "game"
      | "bonus"
      | "complaint";
    priority: "low" | "medium" | "high" | "urgent";
    status: "open" | "in_progress" | "waiting_user" | "resolved" | "closed";
    assigned_to?: string;
    created_at: Date;
    updated_at: Date;
    resolved_at?: Date;
    satisfaction_rating?: number;
    tags: string[];
  };

  support_messages: {
    id: string;
    ticket_id: string;
    sender_id: string;
    sender_type: "user" | "staff" | "system";
    message: string;
    attachments?: string[];
    timestamp: Date;
    is_internal: boolean; // Staff-only notes
  };
}

// Default Seed Data
export const DEFAULT_SEED_DATA = {
  // AI Employees
  ai_employees: DEFAULT_AI_EMPLOYEES.map(
    (employee): DatabaseSchema["ai_employees"] => ({
      id: employee.id,
      name: employee.name,
      role: employee.role,
      specialization: employee.specialization,
      status: employee.status,
      avatar: employee.avatar,
      description: employee.description,
      capabilities: employee.capabilities,
      performance_score: employee.performance,
      tasks_completed: employee.tasksCompleted,
      response_time_avg: 1.5, // seconds
      last_active: employee.lastActive,
      created_at: new Date(),
      updated_at: new Date(),
      configuration: {
        auto_respond: true,
        response_delay: 1000,
        max_concurrent_chats: 10,
        learning_enabled: true,
      },
    }),
  ),

  // Documentation Sections
  documentation_sections: [
    {
      id: "user-001",
      title: "Getting Started with Coin Krazy",
      category: "user" as const,
      content: `# Welcome to Coin Krazy Social Casino!\n\n## What is Coin Krazy?\n\nCoin Krazy is a premier social casino platform...`,
      subcategories: ["account", "games", "currency", "support"],
      tags: ["beginner", "overview", "getting-started"],
      visibility: "public" as const,
      version: "2.1",
      author_id: "admin",
      last_updated_by: "admin",
      attachments: [],
      related_sections: ["user-002", "user-003"],
      view_count: 1247,
      rating_sum: 235,
      rating_count: 52,
      created_at: new Date("2024-01-01"),
      updated_at: new Date("2024-01-15"),
    },
    {
      id: "user-002",
      title: "Sweepstakes Rules & Terms",
      category: "user" as const,
      content: `# Sweepstakes Rules & Terms of Service\n\n## Important Legal Information...`,
      subcategories: ["legal", "sweepstakes", "terms", "privacy"],
      tags: ["legal", "required-reading", "sweepstakes"],
      visibility: "public" as const,
      version: "3.2",
      author_id: "legal-team",
      last_updated_by: "legal-team",
      attachments: [],
      related_sections: ["user-003", "user-004"],
      view_count: 892,
      rating_sum: 178,
      rating_count: 41,
      created_at: new Date("2024-01-01"),
      updated_at: new Date("2024-01-01"),
    },
    {
      id: "staff-001",
      title: "Staff Panel Guide & Features",
      category: "staff" as const,
      content: `# Staff Panel Guide & Features\n\n## Staff Panel Overview...`,
      subcategories: ["staff-tools", "procedures", "training", "policies"],
      tags: ["staff-only", "procedures", "training"],
      visibility: "staff_only" as const,
      version: "2.5",
      author_id: "hr-team",
      last_updated_by: "hr-team",
      attachments: [],
      related_sections: ["staff-002", "admin-001"],
      view_count: 156,
      rating_sum: 38,
      rating_count: 8,
      created_at: new Date("2024-01-12"),
      updated_at: new Date("2024-01-12"),
    },
    {
      id: "admin-001",
      title: "Admin Panel Complete Guide",
      category: "admin" as const,
      content: `# Admin Panel Complete Guide\n\n## System Administration Overview...`,
      subcategories: ["system-admin", "security", "compliance", "monitoring"],
      tags: ["admin-only", "system", "security"],
      visibility: "admin_only" as const,
      version: "3.1",
      author_id: "admin",
      last_updated_by: "admin",
      attachments: [],
      related_sections: ["admin-002", "staff-001"],
      view_count: 89,
      rating_sum: 22,
      rating_count: 5,
      created_at: new Date("2024-01-14"),
      updated_at: new Date("2024-01-14"),
    },
  ],

  // Social Casino Daily Stats (last 30 days)
  social_casino_stats: Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));

    return {
      id: `stats_${date.getTime()}`,
      date,
      total_players: 2450 + Math.floor(Math.random() * 500),
      active_players: 890 + Math.floor(Math.random() * 200),
      new_registrations: 45 + Math.floor(Math.random() * 20),
      total_games_played: 8920 + Math.floor(Math.random() * 2000),
      total_spins: 45600 + Math.floor(Math.random() * 10000),
      total_gc_wagered: 156000 + Math.floor(Math.random() * 50000),
      total_sc_wagered: 2800 + Math.floor(Math.random() * 800),
      total_sc_won: 2650 + Math.floor(Math.random() * 700),
      total_sc_redeemed: 1200 + Math.floor(Math.random() * 300),
      average_session_time: 1800 + Math.floor(Math.random() * 600), // seconds
      top_game_id: "lucky-sevens",
      peak_concurrent_users: 245 + Math.floor(Math.random() * 100),
      peak_time: new Date(date.getTime() + Math.random() * 24 * 60 * 60 * 1000),
      revenue_gc: 12400 + Math.floor(Math.random() * 5000),
      redemptions_processed: 25 + Math.floor(Math.random() * 15),
      new_game_launches: Math.floor(Math.random() * 3),
      created_at: date,
    };
  }),

  // Sample API Providers
  api_providers: [
    {
      id: "provider_pragmatic",
      name: "Pragmatic Play",
      api_endpoint: "https://api.pragmaticplay.net/v1",
      auth_method: "api_key" as const,
      credentials: { api_key: "demo_key_encrypted" },
      rate_limit: 1000,
      status: "active" as const,
      game_count: 250,
      supported_currencies: ["GC", "SC"],
      webhook_url: "https://coinkrizy.com/webhooks/pragmatic",
      last_sync: new Date(),
      created_at: new Date("2024-01-01"),
      updated_at: new Date(),
    },
    {
      id: "provider_netent",
      name: "NetEnt",
      api_endpoint: "https://api.netent.com/v2",
      auth_method: "oauth" as const,
      credentials: {
        client_id: "demo_client",
        client_secret: "demo_secret_encrypted",
      },
      rate_limit: 500,
      status: "active" as const,
      game_count: 180,
      supported_currencies: ["GC", "SC"],
      last_sync: new Date(),
      created_at: new Date("2024-01-01"),
      updated_at: new Date(),
    },
    {
      id: "provider_microgaming",
      name: "Microgaming",
      api_endpoint: "https://api.microgaming.com/v1",
      auth_method: "basic" as const,
      credentials: { username: "demo_user", password: "demo_pass_encrypted" },
      rate_limit: 750,
      status: "active" as const,
      game_count: 320,
      supported_currencies: ["GC", "SC"],
      last_sync: new Date(),
      created_at: new Date("2024-01-01"),
      updated_at: new Date(),
    },
  ],

  // Sample Promotions
  promotions: [
    {
      id: "promo_welcome",
      name: "Welcome Bonus",
      description:
        "Get 100,000 free Gold Coins + 100 Sweeps Coins when you sign up!",
      type: "welcome_bonus" as const,
      currency: "both" as const,
      amount: 100000, // GC amount
      start_date: new Date("2024-01-01"),
      end_date: new Date("2024-12-31"),
      status: "active" as const,
      usage_limit: undefined, // Unlimited
      usage_count: 1247,
      terms_conditions: "New users only. Must verify account to claim.",
      created_by: "admin",
      created_at: new Date("2024-01-01"),
      updated_at: new Date("2024-01-01"),
    },
    {
      id: "promo_daily",
      name: "Daily Login Bonus",
      description: "Free coins every day just for logging in!",
      type: "daily_bonus" as const,
      currency: "GC" as const,
      amount: 5000,
      start_date: new Date("2024-01-01"),
      end_date: new Date("2024-12-31"),
      status: "active" as const,
      usage_count: 15670,
      terms_conditions: "Available once per day per user.",
      created_by: "admin",
      created_at: new Date("2024-01-01"),
      updated_at: new Date("2024-01-01"),
    },
  ],

  // Sample Admin Settings
  admin_toolbar_settings: [
    {
      id: "settings_admin",
      user_id: "admin",
      position: "right" as const,
      minimized: false,
      theme: "auto" as const,
      notifications: true,
      sound_enabled: true,
      auto_hide_inactive: false,
      quick_actions: [
        "dashboard",
        "user-management",
        "game-editor",
        "reports",
        "security",
        "settings",
      ],
      favorite_features: ["ai-chat", "bug-reports", "analytics"],
      custom_shortcuts: {
        "ctrl+shift+d": "dashboard",
        "ctrl+shift+u": "users",
        "ctrl+shift+g": "games",
      },
      chat_notifications: true,
      reporting_enabled: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ],
};

// SQL Schema Creation Commands
export const CREATE_TABLES_SQL = `
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user', 'staff', 'admin') DEFAULT 'user',
  status ENUM('active', 'suspended', 'banned') DEFAULT 'active',
  verification_status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
  age_verified BOOLEAN DEFAULT FALSE,
  profile JSON,
  preferences JSON,
  limits JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_username (username),
  INDEX idx_role (role),
  INDEX idx_status (status)
);

-- Wallets table
CREATE TABLE IF NOT EXISTS wallets (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  gc_balance DECIMAL(15,2) DEFAULT 0,
  sc_balance DECIMAL(15,2) DEFAULT 0,
  reserved_gc DECIMAL(15,2) DEFAULT 0,
  reserved_sc DECIMAL(15,2) DEFAULT 0,
  total_gc_purchased DECIMAL(15,2) DEFAULT 0,
  total_sc_earned DECIMAL(15,2) DEFAULT 0,
  total_gc_spent DECIMAL(15,2) DEFAULT 0,
  total_sc_redeemed DECIMAL(15,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  wallet_id VARCHAR(255) NOT NULL,
  type ENUM('purchase', 'win', 'bet', 'bonus', 'redemption', 'refund') NOT NULL,
  currency ENUM('GC', 'SC') NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  balance_before DECIMAL(15,2) NOT NULL,
  balance_after DECIMAL(15,2) NOT NULL,
  description TEXT,
  reference_id VARCHAR(255),
  status ENUM('pending', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  processed_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_type (type),
  INDEX idx_currency (currency),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);

-- Game sessions table
CREATE TABLE IF NOT EXISTS game_sessions (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  game_id VARCHAR(255) NOT NULL,
  currency ENUM('GC', 'SC') NOT NULL,
  start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  end_time TIMESTAMP,
  total_bet DECIMAL(15,2) DEFAULT 0,
  total_win DECIMAL(15,2) DEFAULT 0,
  spin_count INT DEFAULT 0,
  max_bet DECIMAL(15,2) DEFAULT 0,
  max_win DECIMAL(15,2) DEFAULT 0,
  session_duration INT,
  ip_address VARCHAR(45),
  user_agent TEXT,
  device_info JSON,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_game_id (game_id),
  INDEX idx_start_time (start_time)
);

-- Spin logs table
CREATE TABLE IF NOT EXISTS spin_logs (
  id VARCHAR(255) PRIMARY KEY,
  session_id VARCHAR(255) NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  game_id VARCHAR(255) NOT NULL,
  bet_amount DECIMAL(15,2) NOT NULL,
  win_amount DECIMAL(15,2) NOT NULL,
  currency ENUM('GC', 'SC') NOT NULL,
  spin_result JSON NOT NULL,
  rtp_contribution DECIMAL(8,4),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_bonus_round BOOLEAN DEFAULT FALSE,
  multiplier DECIMAL(8,2),
  symbols JSON,
  paylines JSON,
  metadata JSON,
  FOREIGN KEY (session_id) REFERENCES game_sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_game_id (game_id),
  INDEX idx_timestamp (timestamp),
  INDEX idx_currency (currency)
);

-- Continue with remaining tables...
-- [Additional CREATE TABLE statements for all other tables in the schema]
`;

// TypeScript interface for database operations
export interface DatabaseOperations {
  // User operations
  createUser(userData: Partial<DatabaseSchema["users"]>): Promise<string>;
  getUserById(userId: string): Promise<DatabaseSchema["users"] | null>;
  updateUser(
    userId: string,
    updates: Partial<DatabaseSchema["users"]>,
  ): Promise<boolean>;

  // Wallet operations
  getWallet(userId: string): Promise<DatabaseSchema["wallets"] | null>;
  updateBalance(
    userId: string,
    currency: "GC" | "SC",
    amount: number,
  ): Promise<boolean>;

  // Transaction operations
  createTransaction(
    transaction: Partial<DatabaseSchema["transactions"]>,
  ): Promise<string>;
  getTransactionHistory(
    userId: string,
    limit?: number,
  ): Promise<DatabaseSchema["transactions"][]>;

  // Game operations
  logSpin(spinData: Partial<DatabaseSchema["spin_logs"]>): Promise<string>;
  getGameStats(gameId: string, period?: string): Promise<any>;

  // Admin operations
  getAIEmployees(): Promise<DatabaseSchema["ai_employees"][]>;
  createBugReport(
    report: Partial<DatabaseSchema["bug_reports"]>,
  ): Promise<string>;
  getDocumentation(
    category?: string,
    visibility?: string,
  ): Promise<DatabaseSchema["documentation_sections"][]>;

  // Statistics
  getDailyStats(
    date?: Date,
  ): Promise<DatabaseSchema["social_casino_stats"] | null>;
  generateReport(type: string, parameters: any): Promise<any>;
}

export default {
  schema: {} as DatabaseSchema,
  seedData: DEFAULT_SEED_DATA,
  createTablesSQL: CREATE_TABLES_SQL,
};
