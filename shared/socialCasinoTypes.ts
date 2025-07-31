// Comprehensive Social Casino Database Schema and Types
export interface SocialCasinoGame {
  id: string;
  name: string;
  provider: string;
  category: "social_slots" | "table_games" | "poker" | "bingo" | "specialty";
  game_type: "GC" | "SC" | "BOTH"; // Game currency restrictions
  thumbnail: string;
  background_image?: string;
  description: string;
  min_bet_gc: number;
  max_bet_gc: number;
  min_bet_sc: number;
  max_bet_sc: number;
  rtp: number;
  volatility: "low" | "medium" | "high";
  max_win_gc: number;
  max_win_sc: number;
  paylines?: number;
  features: string[];
  is_active: boolean;
  is_featured: boolean;
  api_provider?: string; // For external API slots
  api_game_id?: string;
  created_at: string;
  updated_at: string;
  // Real-time stats
  total_spins_today: number;
  total_gc_earned_today: number;
  total_sc_earned_today: number;
  biggest_win_today: number;
  last_big_win?: BigWin;
}

export interface BigWin {
  player_name: string;
  amount: number;
  currency: "GC" | "SC";
  game_id: string;
  timestamp: string;
}

export interface SpinLog {
  id: string;
  user_id: string;
  game_id: string;
  session_id: string;
  currency: "GC" | "SC";
  bet_amount: number;
  win_amount: number;
  balance_before: number;
  balance_after: number;
  spin_result: any; // JSON object containing reel results
  paylines_hit: number[];
  bonus_triggered: boolean;
  free_spins_remaining?: number;
  multiplier_applied?: number;
  created_at: string;
  ip_address: string;
  user_agent: string;
}

export interface GameSession {
  id: string;
  user_id: string;
  game_id: string;
  currency: "GC" | "SC";
  start_time: string;
  end_time?: string;
  total_spins: number;
  total_bet: number;
  total_win: number;
  net_result: number; // win - bet
  biggest_win: number;
  longest_streak: number;
  bonus_rounds_triggered: number;
  status: "active" | "completed" | "abandoned";
  device_type: "desktop" | "mobile" | "tablet";
  created_at: string;
  updated_at: string;
}

export interface WalletTransaction {
  id: string;
  user_id: string;
  wallet_id: string;
  type:
    | "spin_bet"
    | "spin_win"
    | "deposit"
    | "withdrawal"
    | "bonus"
    | "refund"
    | "admin_adjustment";
  currency: "GC" | "SC";
  amount: number;
  balance_before: number;
  balance_after: number;
  reference_id?: string; // spin_id, game_session_id, etc.
  description: string;
  status: "pending" | "completed" | "failed" | "cancelled";
  admin_notes?: string;
  created_at: string;
  metadata?: {
    game_id?: string;
    spin_id?: string;
    session_id?: string;
    ip_address?: string;
    device_type?: string;
  };
}

export interface APIProvider {
  id: string;
  name: string;
  api_url: string;
  api_key_encrypted: string;
  is_active: boolean;
  supported_currencies: ("GC" | "SC")[];
  webhook_url?: string;
  rate_limit_per_minute: number;
  cost_per_request: number;
  games_count: number;
  created_at: string;
  updated_at: string;
}

export interface APIProviderGame {
  id: string;
  provider_id: string;
  external_game_id: string;
  name: string;
  thumbnail: string;
  category: string;
  rtp: number;
  min_bet: number;
  max_bet: number;
  max_win: number;
  is_active: boolean;
  last_sync_at: string;
  metadata?: any;
}

export interface GameSettings {
  id: string;
  game_id: string;
  setting_key: string;
  setting_value: string;
  setting_type: "string" | "number" | "boolean" | "json";
  is_admin_only: boolean;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface AdminGameEditor {
  id: string;
  admin_user_id: string;
  game_id: string;
  action: "create" | "update" | "delete" | "activate" | "deactivate";
  changes_made: any; // JSON object
  ai_assistance_used: boolean;
  ai_suggestions?: string[];
  created_at: string;
}

export interface RealTimeStats {
  total_active_games: number;
  total_games_available: number;
  sc_earned_today: number;
  gc_earned_today: number;
  max_win_available_gc: number;
  max_win_available_sc: number;
  total_players_online: number;
  total_spins_today: number;
  biggest_win_today?: BigWin;
  updated_at: string;
}

export interface GameModeRestriction {
  user_id: string;
  can_play_gc: boolean;
  can_play_sc: boolean;
  gc_daily_limit?: number;
  sc_daily_limit?: number;
  restricted_games: string[]; // game IDs
  restriction_reason?: string;
  created_at: string;
  expires_at?: string;
}

// Real-time wallet interface with instant updates
export interface RealTimeWallet {
  id: string;
  user_id: string;
  gold_coins: number;
  sweeps_coins: number;
  last_gc_transaction: string;
  last_sc_transaction: string;
  daily_gc_spent: number;
  daily_sc_spent: number;
  daily_gc_won: number;
  daily_sc_won: number;
  pending_withdrawals: number;
  total_deposits: number;
  total_withdrawals: number;
  created_at: string;
  updated_at: string;
}

// Spin result types for comprehensive logging
export interface SpinResult {
  reels: string[][]; // 2D array of symbol IDs
  paylines_hit: PaylineHit[];
  total_win: number;
  multiplier: number;
  bonus_triggered: boolean;
  free_spins_awarded?: number;
  scatter_count?: number;
  wild_count?: number;
}

export interface PaylineHit {
  payline_id: number;
  symbols: string[];
  symbol_count: number;
  win_amount: number;
  multiplier: number;
}

// Admin panel interfaces
export interface AdminSpinLog {
  id: string;
  player_name: string;
  game_name: string;
  currency: "GC" | "SC";
  bet_amount: number;
  win_amount: number;
  net_result: number;
  timestamp: string;
  ip_address: string;
  device_type: string;
  suspicious_activity: boolean;
  notes?: string;
}

export interface GameAnalytics {
  game_id: string;
  game_name: string;
  total_sessions_today: number;
  total_spins_today: number;
  total_revenue_gc: number;
  total_revenue_sc: number;
  total_payouts_gc: number;
  total_payouts_sc: number;
  actual_rtp_gc: number;
  actual_rtp_sc: number;
  unique_players_today: number;
  average_session_time: number;
  bounce_rate: number;
  conversion_rate: number;
}

// API provider management types
export interface APIGameIntegration {
  provider_name: string;
  games_available: number;
  integration_status: "active" | "inactive" | "error";
  last_sync: string;
  error_message?: string;
  cost_today: number;
  requests_today: number;
  rate_limit_remaining: number;
}

// Visual editor types for admin panel
export interface VisualGameEditor {
  id: string;
  game_id: string;
  editor_data: {
    symbols: any[];
    paylines: any[];
    reels: any[];
    settings: any;
  };
  ai_suggestions: string[];
  preview_mode: boolean;
  unsaved_changes: boolean;
  last_saved: string;
}

export interface AIEditorAssistant {
  session_id: string;
  admin_user_id: string;
  conversation_history: AIMessage[];
  current_game_context?: string;
  suggestions_given: number;
  code_generated: boolean;
  last_interaction: string;
}

export interface AIMessage {
  role: "user" | "assistant";
  message: string;
  timestamp: string;
  game_id?: string;
  code_suggestion?: string;
}
