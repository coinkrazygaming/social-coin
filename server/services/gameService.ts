/**
 * Game Service
 * Handles all game-related database operations
 */

import { supabase } from "../../shared/database";
import type { SpinLog } from "../../shared/spinLogger";

export interface GameStats {
  gameId: string;
  gameName: string;
  totalSpins: number;
  totalWagered: number;
  totalPayout: number;
  rtp: number;
  activePlayerCount: number;
  biggestWin: number;
  popularityScore: number;
}

export interface GameData {
  id: string;
  name: string;
  type: string;
  provider: string;
  thumbnail: string;
  rtp: number;
  volatility: string;
  minBet: number;
  maxBet: number;
  features: string[];
  active: boolean;
}

/**
 * Get game by ID
 */
export async function getGameById(gameId: string): Promise<GameData | null> {
  try {
    const { data, error } = await supabase
      .from("games")
      .select("*")
      .eq("id", gameId)
      .single();

    if (error) {
      console.error("Error fetching game:", error);
      return null;
    }

    if (!data) {
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      type: data.type,
      provider: data.provider || "CoinKrazy",
      thumbnail: data.thumbnail_url || "",
      rtp: parseFloat(data.rtp) || 96.0,
      volatility: data.volatility || "medium",
      minBet: parseFloat(data.min_bet) || 0.1,
      maxBet: parseFloat(data.max_bet) || 100,
      features: data.features || [],
      active: data.active !== false,
    };
  } catch (error) {
    console.error("Exception in getGameById:", error);
    return null;
  }
}

/**
 * Get game name by ID (fallback to ID if not found)
 */
export async function getGameName(gameId: string): Promise<string> {
  const game = await getGameById(gameId);
  return game?.name || `Game_${gameId}`;
}

/**
 * Record a spin in the database
 */
export async function recordSpin(spinLog: SpinLog): Promise<boolean> {
  try {
    const { error } = await supabase.from("spin_logs").insert({
      id: spinLog.id,
      user_id: spinLog.userId,
      game_id: spinLog.gameId,
      session_id: spinLog.sessionId,
      bet_amount: spinLog.betAmount,
      win_amount: spinLog.winAmount,
      currency: spinLog.currency,
      result: spinLog.result,
      multiplier: spinLog.multiplier,
      is_bonus: spinLog.isBonus,
      is_jackpot: spinLog.isJackpot,
      rtp_contribution: spinLog.rtpContribution,
      timestamp: spinLog.timestamp.toISOString(),
      device_type: spinLog.deviceType,
    });

    if (error) {
      console.error("Error recording spin:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Exception in recordSpin:", error);
    return false;
  }
}

/**
 * Batch save spin logs to database
 */
export async function batchSaveSpins(logs: SpinLog[]): Promise<boolean> {
  try {
    const records = logs.map((log) => ({
      id: log.id,
      user_id: log.userId,
      game_id: log.gameId,
      session_id: log.sessionId,
      bet_amount: log.betAmount,
      win_amount: log.winAmount,
      currency: log.currency,
      result: log.result,
      multiplier: log.multiplier,
      is_bonus: log.isBonus,
      is_jackpot: log.isJackpot,
      rtp_contribution: log.rtpContribution,
      timestamp: log.timestamp.toISOString(),
      device_type: log.deviceType,
    }));

    const { error } = await supabase.from("spin_logs").insert(records);

    if (error) {
      console.error("Error batch saving spins:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Exception in batchSaveSpins:", error);
    return false;
  }
}

/**
 * Calculate RTP for a game based on spin history
 */
export async function calculateRTP(
  gameId: string,
  days: number = 30
): Promise<number> {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const { data, error } = await supabase
      .from("spin_logs")
      .select("bet_amount, win_amount")
      .eq("game_id", gameId)
      .gte("timestamp", cutoffDate.toISOString());

    if (error) {
      console.error("Error calculating RTP:", error);
      return 96.0; // Default RTP
    }

    if (!data || data.length === 0) {
      return 96.0; // Default RTP if no data
    }

    const totalBet = data.reduce(
      (sum, spin) => sum + parseFloat(spin.bet_amount),
      0
    );
    const totalWin = data.reduce(
      (sum, spin) => sum + parseFloat(spin.win_amount),
      0
    );

    if (totalBet === 0) {
      return 96.0;
    }

    const rtp = (totalWin / totalBet) * 100;
    return Math.round(rtp * 100) / 100; // Round to 2 decimal places
  } catch (error) {
    console.error("Exception in calculateRTP:", error);
    return 96.0;
  }
}

/**
 * Get active player count for a game
 */
export async function getActivePlayerCount(gameId: string): Promise<number> {
  try {
    // Consider players active if they played in the last 5 minutes
    const cutoffTime = new Date();
    cutoffTime.setMinutes(cutoffTime.getMinutes() - 5);

    const { data, error } = await supabase
      .from("spin_logs")
      .select("user_id")
      .eq("game_id", gameId)
      .gte("timestamp", cutoffTime.toISOString());

    if (error) {
      console.error("Error getting active player count:", error);
      return 0;
    }

    // Count unique users
    const uniqueUsers = new Set(data?.map((log) => log.user_id) || []);
    return uniqueUsers.size;
  } catch (error) {
    console.error("Exception in getActivePlayerCount:", error);
    return 0;
  }
}

/**
 * Get game statistics
 */
export async function getGameStats(
  gameId: string,
  days: number = 30
): Promise<GameStats | null> {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const { data, error } = await supabase
      .from("spin_logs")
      .select("bet_amount, win_amount")
      .eq("game_id", gameId)
      .gte("timestamp", cutoffDate.toISOString());

    if (error) {
      console.error("Error fetching game stats:", error);
      return null;
    }

    const game = await getGameById(gameId);
    const totalSpins = data?.length || 0;
    const totalWagered = data?.reduce(
      (sum, spin) => sum + parseFloat(spin.bet_amount),
      0
    ) || 0;
    const totalPayout = data?.reduce(
      (sum, spin) => sum + parseFloat(spin.win_amount),
      0
    ) || 0;
    const biggestWin = data?.reduce(
      (max, spin) => Math.max(max, parseFloat(spin.win_amount)),
      0
    ) || 0;

    const rtp = await calculateRTP(gameId, days);
    const activePlayerCount = await getActivePlayerCount(gameId);

    // Calculate popularity score based on recent activity
    const popularityScore = Math.min(100, totalSpins / 10);

    return {
      gameId,
      gameName: game?.name || `Game_${gameId}`,
      totalSpins,
      totalWagered,
      totalPayout,
      rtp,
      activePlayerCount,
      biggestWin,
      popularityScore,
    };
  } catch (error) {
    console.error("Exception in getGameStats:", error);
    return null;
  }
}

/**
 * Calculate trend for a game (up, down, stable)
 */
export async function calculateTrend(
  gameId: string
): Promise<"up" | "down" | "stable"> {
  try {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

    // Get spin count for last 24 hours
    const { data: recentData } = await supabase
      .from("spin_logs")
      .select("id", { count: "exact" })
      .eq("game_id", gameId)
      .gte("timestamp", oneDayAgo.toISOString());

    // Get spin count for previous 24 hours
    const { data: previousData } = await supabase
      .from("spin_logs")
      .select("id", { count: "exact" })
      .eq("game_id", gameId)
      .gte("timestamp", twoDaysAgo.toISOString())
      .lt("timestamp", oneDayAgo.toISOString());

    const recentCount = recentData?.length || 0;
    const previousCount = previousData?.length || 0;

    if (previousCount === 0) {
      return "stable";
    }

    const change = ((recentCount - previousCount) / previousCount) * 100;

    if (change > 10) return "up";
    if (change < -10) return "down";
    return "stable";
  } catch (error) {
    console.error("Exception in calculateTrend:", error);
    return "stable";
  }
}

/**
 * Get all games
 */
export async function getAllGames(): Promise<GameData[]> {
  try {
    const { data, error } = await supabase
      .from("games")
      .select("*")
      .eq("active", true)
      .order("name");

    if (error) {
      console.error("Error fetching all games:", error);
      return [];
    }

    return (
      data?.map((game) => ({
        id: game.id,
        name: game.name,
        type: game.type,
        provider: game.provider || "CoinKrazy",
        thumbnail: game.thumbnail_url || "",
        rtp: parseFloat(game.rtp) || 96.0,
        volatility: game.volatility || "medium",
        minBet: parseFloat(game.min_bet) || 0.1,
        maxBet: parseFloat(game.max_bet) || 100,
        features: game.features || [],
        active: game.active !== false,
      })) || []
    );
  } catch (error) {
    console.error("Exception in getAllGames:", error);
    return [];
  }
}

/**
 * Update game data
 */
export async function updateGame(
  gameId: string,
  updates: Partial<GameData>
): Promise<boolean> {
  try {
    const updateData: any = {};

    if (updates.name) updateData.name = updates.name;
    if (updates.type) updateData.type = updates.type;
    if (updates.provider) updateData.provider = updates.provider;
    if (updates.thumbnail) updateData.thumbnail_url = updates.thumbnail;
    if (updates.rtp !== undefined) updateData.rtp = updates.rtp;
    if (updates.volatility) updateData.volatility = updates.volatility;
    if (updates.minBet !== undefined) updateData.min_bet = updates.minBet;
    if (updates.maxBet !== undefined) updateData.max_bet = updates.maxBet;
    if (updates.features) updateData.features = updates.features;
    if (updates.active !== undefined) updateData.active = updates.active;

    const { error } = await supabase
      .from("games")
      .update(updateData)
      .eq("id", gameId);

    if (error) {
      console.error("Error updating game:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Exception in updateGame:", error);
    return false;
  }
}
