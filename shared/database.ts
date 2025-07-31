// Database configuration and types for CoinKrazy platform
import { createClient } from "@supabase/supabase-js";

// Environment variables for database connections
// Check if running in Node.js environment
const isServer = typeof process !== "undefined" && process.env;

export const SUPABASE_URL = isServer
  ? process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"
  : "https://placeholder.supabase.co";

export const SUPABASE_ANON_KEY = isServer
  ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder_anon_key_12345"
  : "placeholder_anon_key_12345";

export const NEON_DATABASE_URL = isServer
  ? process.env.DATABASE_URL || "postgresql://placeholder"
  : "postgresql://placeholder";

// Supabase client - only create if we have valid URLs
export const supabase = (() => {
  try {
    // Only create client if URL looks valid (not a placeholder)
    if (SUPABASE_URL && SUPABASE_URL !== "https://placeholder.supabase.co") {
      return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
    // Return a mock client for development/placeholder scenarios
    return null;
  } catch (error) {
    console.warn("Failed to create Supabase client:", error);
    return null;
  }
})();

// Database table interfaces
export interface User {
  id: string;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  role: "user" | "admin" | "staff" | "moderator";
  status: "active" | "suspended" | "pending_verification";
  kyc_status: "none" | "pending" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
  last_login?: string;
  avatar_url?: string;
  preferences: UserPreferences;
  oauth_providers: string[];
}

export interface UserPreferences {
  theme: "dark" | "light" | "auto";
  notifications_enabled: boolean;
  sound_enabled: boolean;
  auto_play_enabled: boolean;
  currency_preference: "GC" | "SC";
  language: string;
  timezone: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  gold_coins: number;
  sweeps_coins: number;
  total_deposits: number;
  total_withdrawals: number;
  pending_withdrawals: number;
  last_transaction: string;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  wallet_id: string;
  type: "deposit" | "withdrawal" | "win" | "bet" | "bonus" | "refund";
  currency: "GC" | "SC";
  amount: number;
  balance_before: number;
  balance_after: number;
  description: string;
  reference_id?: string; // Game session, purchase, etc.
  status: "pending" | "completed" | "failed" | "cancelled";
  created_at: string;
  metadata?: Record<string, any>;
}

export interface Notification {
  id: string;
  user_id?: string; // null for global notifications
  sender_id?: string;
  sender_type: "system" | "admin" | "staff" | "ai_assistant" | "user";
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error" | "promotion" | "alert";
  priority: "low" | "medium" | "high" | "urgent";
  read: boolean;
  action_url?: string;
  action_label?: string;
  expires_at?: string;
  created_at: string;
  metadata?: Record<string, any>;
}

export interface ChatMessage {
  id: string;
  user_id?: string;
  sender_name: string;
  sender_type: "user" | "admin" | "staff" | "ai_assistant" | "system";
  message: string;
  reply_to?: string;
  channel: "global" | "support" | "vip" | "admin";
  is_private: boolean;
  created_at: string;
  metadata?: Record<string, any>;
}

export interface AdminAlert {
  id: string;
  type:
    | "approval_needed"
    | "security_alert"
    | "system_issue"
    | "financial_alert"
    | "user_report";
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "pending" | "in_progress" | "resolved" | "dismissed";
  assigned_to?: string;
  related_user_id?: string;
  related_entity_type?: string;
  related_entity_id?: string;
  created_at: string;
  resolved_at?: string;
  metadata?: Record<string, any>;
}

export interface GameSession {
  id: string;
  user_id: string;
  game_type: "slot" | "table" | "poker" | "bingo" | "sportsbook";
  game_id: string;
  start_time: string;
  end_time?: string;
  total_bet: number;
  total_win: number;
  currency: "GC" | "SC";
  spins_count?: number;
  bonus_rounds?: number;
  max_win?: number;
  status: "active" | "completed" | "abandoned";
  metadata?: Record<string, any>;
}

export interface SportsEvent {
  id: string;
  sport: string;
  league: string;
  home_team: string;
  away_team: string;
  start_time: string;
  status: "scheduled" | "live" | "finished" | "cancelled" | "postponed";
  home_score?: number;
  away_score?: number;
  odds: Record<string, number>;
  markets: SportsMarket[];
  live_data?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface SportsMarket {
  id: string;
  event_id: string;
  name: string;
  type: "moneyline" | "spread" | "total" | "prop";
  options: SportsOption[];
  status: "open" | "closed" | "settled";
  created_at: string;
}

export interface SportsOption {
  id: string;
  market_id: string;
  name: string;
  odds: number;
  line?: number; // For spread/total bets
  status: "open" | "closed" | "won" | "lost" | "push";
}

export interface SportsBet {
  id: string;
  user_id: string;
  event_id: string;
  market_id: string;
  option_id: string;
  stake: number;
  currency: "GC" | "SC";
  odds: number;
  potential_win: number;
  status: "pending" | "won" | "lost" | "void" | "cashed_out";
  placed_at: string;
  settled_at?: string;
}

// Database utility functions
export class DatabaseService {
  static async createUser(userData: Partial<User>): Promise<User | null> {
    try {
      if (!supabase) {
        console.warn("Supabase client not available - using mock data");
        return null;
      }

      const { data, error } = await supabase
        .from("users")
        .insert([
          {
            ...userData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating user:", error);
      return null;
    }
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    try {
      if (!supabase) {
        console.warn("Supabase client not available - using mock data");
        return null;
      }

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  }

  static async getUserWallet(userId: string): Promise<Wallet | null> {
    try {
      if (!supabase) {
        console.warn("Supabase client not available - returning mock wallet");
        return {
          id: `wallet_${userId}`,
          user_id: userId,
          gold_coins: 10000,
          sweeps_coins: 10,
          total_deposits: 0,
          total_withdrawals: 0,
          pending_withdrawals: 0,
          last_transaction: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }

      const { data, error } = await supabase
        .from("wallets")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching wallet:", error);
      return null;
    }
  }

  static async updateWalletBalance(
    userId: string,
    currency: "GC" | "SC",
    amount: number,
    transactionData: Partial<Transaction>,
  ): Promise<boolean> {
    try {
      // Start transaction
      const { data: wallet, error: walletError } = await supabase
        .from("wallets")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (walletError) throw walletError;

      const currentBalance =
        currency === "GC" ? wallet.gold_coins : wallet.sweeps_coins;
      const newBalance = currentBalance + amount;

      // Update wallet
      const updateData =
        currency === "GC"
          ? { gold_coins: newBalance }
          : { sweeps_coins: newBalance };

      const { error: updateError } = await supabase
        .from("wallets")
        .update({
          ...updateData,
          updated_at: new Date().toISOString(),
          last_transaction: new Date().toISOString(),
        })
        .eq("user_id", userId);

      if (updateError) throw updateError;

      // Create transaction record
      const { error: transactionError } = await supabase
        .from("transactions")
        .insert([
          {
            user_id: userId,
            wallet_id: wallet.id,
            currency,
            amount,
            balance_before: currentBalance,
            balance_after: newBalance,
            status: "completed",
            created_at: new Date().toISOString(),
            ...transactionData,
          },
        ]);

      if (transactionError) throw transactionError;

      return true;
    } catch (error) {
      console.error("Error updating wallet:", error);
      return false;
    }
  }

  static async createNotification(
    notificationData: Partial<Notification>,
  ): Promise<boolean> {
    try {
      const { error } = await supabase.from("notifications").insert([
        {
          ...notificationData,
          created_at: new Date().toISOString(),
          read: false,
        },
      ]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error creating notification:", error);
      return false;
    }
  }

  static async getUserNotifications(
    userId: string,
    limit: number = 50,
  ): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .or(`user_id.eq.${userId},user_id.is.null`)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return [];
    }
  }

  static async markNotificationAsRead(
    notificationId: string,
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", notificationId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      return false;
    }
  }

  static async getAdminAlerts(): Promise<AdminAlert[]> {
    try {
      const { data, error } = await supabase
        .from("admin_alerts")
        .select("*")
        .eq("status", "pending")
        .order("priority", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching admin alerts:", error);
      return [];
    }
  }

  static async initializeDefaultAdmin(): Promise<void> {
    try {
      // Check if admin already exists
      const existingAdmin = await this.getUserByEmail("admin@coinkrazy.com");

      if (!existingAdmin) {
        // Create default admin user
        const adminUser = await this.createUser({
          email: "admin@coinkrazy.com",
          username: "admin",
          first_name: "CoinKrazy",
          last_name: "Admin",
          role: "admin",
          status: "active",
          kyc_status: "approved",
          preferences: {
            theme: "dark",
            notifications_enabled: true,
            sound_enabled: true,
            auto_play_enabled: false,
            currency_preference: "SC",
            language: "en",
            timezone: "UTC",
          },
          oauth_providers: [],
        });

        if (adminUser) {
          // Create admin wallet
          await supabase.from("wallets").insert([
            {
              user_id: adminUser.id,
              gold_coins: 1000000,
              sweeps_coins: 10000,
              total_deposits: 0,
              total_withdrawals: 0,
              pending_withdrawals: 0,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              last_transaction: new Date().toISOString(),
            },
          ]);

          console.log("Default admin account created successfully");
        }
      }
    } catch (error) {
      console.error("Error initializing default admin:", error);
    }
  }
}

// Real-time subscription helpers
export const subscribeToWalletUpdates = (
  userId: string,
  callback: (wallet: Wallet) => void,
) => {
  return supabase
    .channel("wallet_updates")
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "wallets",
        filter: `user_id=eq.${userId}`,
      },
      (payload) => callback(payload.new as Wallet),
    )
    .subscribe();
};

export const subscribeToNotifications = (
  userId: string,
  callback: (notification: Notification) => void,
) => {
  return supabase
    .channel("user_notifications")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "notifications",
        filter: `user_id=eq.${userId}`,
      },
      (payload) => callback(payload.new as Notification),
    )
    .subscribe();
};

export const subscribeToGlobalNotifications = (
  callback: (notification: Notification) => void,
) => {
  return supabase
    .channel("global_notifications")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "notifications",
        filter: "user_id=is.null",
      },
      (payload) => callback(payload.new as Notification),
    )
    .subscribe();
};

export const subscribeToAdminAlerts = (
  callback: (alert: AdminAlert) => void,
) => {
  return supabase
    .channel("admin_alerts")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "admin_alerts" },
      (payload) => callback(payload.new as AdminAlert),
    )
    .subscribe();
};
