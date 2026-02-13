/**
 * Player Service
 * Handles all player-related database operations
 */

import { supabase } from "../../shared/database";

export interface PlayerData {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  role: string;
  status: string;
  kycStatus: string;
  avatarUrl?: string;
  createdAt: Date;
  lastLogin?: Date;
}

export interface PlayerStats {
  totalSpins: number;
  totalWagered: number;
  totalWon: number;
  biggestWin: number;
  favoriteGame?: string;
  winRate: number;
  averageBet: number;
}

export interface PlayerSession {
  id: string;
  userId: string;
  gameId: string;
  startTime: Date;
  endTime?: Date;
  totalSpins: number;
  totalWagered: number;
  totalWon: number;
  deviceType: string;
}

/**
 * Get player by ID
 */
export async function getPlayerById(
  playerId: string
): Promise<PlayerData | null> {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", playerId)
      .single();

    if (error) {
      console.error("Error fetching player:", error);
      return null;
    }

    if (!data) {
      return null;
    }

    return {
      id: data.id,
      email: data.email,
      username: data.username,
      firstName: data.first_name,
      lastName: data.last_name,
      role: data.role,
      status: data.status,
      kycStatus: data.kyc_status,
      avatarUrl: data.avatar_url,
      createdAt: new Date(data.created_at),
      lastLogin: data.last_login ? new Date(data.last_login) : undefined,
    };
  } catch (error) {
    console.error("Exception in getPlayerById:", error);
    return null;
  }
}

/**
 * Get player name (username or fallback)
 */
export async function getPlayerName(playerId: string): Promise<string> {
  const player = await getPlayerById(playerId);
  return player?.username || `Player_${playerId.slice(-6)}`;
}

/**
 * Get player statistics
 */
export async function getPlayerStats(
  playerId: string,
  days: number = 30
): Promise<PlayerStats | null> {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const { data, error } = await supabase
      .from("spin_logs")
      .select("bet_amount, win_amount, game_id")
      .eq("user_id", playerId)
      .gte("timestamp", cutoffDate.toISOString());

    if (error) {
      console.error("Error fetching player stats:", error);
      return null;
    }

    if (!data || data.length === 0) {
      return {
        totalSpins: 0,
        totalWagered: 0,
        totalWon: 0,
        biggestWin: 0,
        winRate: 0,
        averageBet: 0,
      };
    }

    const totalSpins = data.length;
    const totalWagered = data.reduce(
      (sum, spin) => sum + parseFloat(spin.bet_amount),
      0
    );
    const totalWon = data.reduce(
      (sum, spin) => sum + parseFloat(spin.win_amount),
      0
    );
    const biggestWin = data.reduce(
      (max, spin) => Math.max(max, parseFloat(spin.win_amount)),
      0
    );

    // Calculate favorite game (most played)
    const gameCounts: Record<string, number> = {};
    data.forEach((spin) => {
      gameCounts[spin.game_id] = (gameCounts[spin.game_id] || 0) + 1;
    });
    const favoriteGame = Object.entries(gameCounts).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0];

    // Calculate win rate (percentage of spins that resulted in a win)
    const winningSpins = data.filter(
      (spin) => parseFloat(spin.win_amount) > 0
    ).length;
    const winRate = (winningSpins / totalSpins) * 100;

    const averageBet = totalWagered / totalSpins;

    return {
      totalSpins,
      totalWagered,
      totalWon,
      biggestWin,
      favoriteGame,
      winRate: Math.round(winRate * 100) / 100,
      averageBet: Math.round(averageBet * 100) / 100,
    };
  } catch (error) {
    console.error("Exception in getPlayerStats:", error);
    return null;
  }
}

/**
 * Update player activity (last login, etc.)
 */
export async function updatePlayerActivity(playerId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("users")
      .update({
        last_login: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", playerId);

    if (error) {
      console.error("Error updating player activity:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Exception in updatePlayerActivity:", error);
    return false;
  }
}

/**
 * Track player session
 */
export async function trackPlayerSession(
  session: Omit<PlayerSession, "id">
): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from("game_sessions")
      .insert({
        user_id: session.userId,
        game_id: session.gameId,
        start_time: session.startTime.toISOString(),
        end_time: session.endTime?.toISOString(),
        total_spins: session.totalSpins,
        total_wagered: session.totalWagered,
        total_won: session.totalWon,
        device_type: session.deviceType,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Error tracking player session:", error);
      return null;
    }

    return data?.id || null;
  } catch (error) {
    console.error("Exception in trackPlayerSession:", error);
    return null;
  }
}

/**
 * Update player session
 */
export async function updatePlayerSession(
  sessionId: string,
  updates: Partial<Omit<PlayerSession, "id" | "userId" | "gameId" | "startTime">>
): Promise<boolean> {
  try {
    const updateData: any = {};

    if (updates.endTime) updateData.end_time = updates.endTime.toISOString();
    if (updates.totalSpins !== undefined)
      updateData.total_spins = updates.totalSpins;
    if (updates.totalWagered !== undefined)
      updateData.total_wagered = updates.totalWagered;
    if (updates.totalWon !== undefined) updateData.total_won = updates.totalWon;
    if (updates.deviceType) updateData.device_type = updates.deviceType;

    const { error } = await supabase
      .from("game_sessions")
      .update(updateData)
      .eq("id", sessionId);

    if (error) {
      console.error("Error updating player session:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Exception in updatePlayerSession:", error);
    return false;
  }
}

/**
 * Get active sessions for a player
 */
export async function getActiveSessions(
  playerId: string
): Promise<PlayerSession[]> {
  try {
    const { data, error } = await supabase
      .from("game_sessions")
      .select("*")
      .eq("user_id", playerId)
      .is("end_time", null)
      .order("start_time", { ascending: false });

    if (error) {
      console.error("Error fetching active sessions:", error);
      return [];
    }

    return (
      data?.map((session) => ({
        id: session.id,
        userId: session.user_id,
        gameId: session.game_id,
        startTime: new Date(session.start_time),
        endTime: session.end_time ? new Date(session.end_time) : undefined,
        totalSpins: session.total_spins,
        totalWagered: parseFloat(session.total_wagered),
        totalWon: parseFloat(session.total_won),
        deviceType: session.device_type,
      })) || []
    );
  } catch (error) {
    console.error("Exception in getActiveSessions:", error);
    return [];
  }
}

/**
 * Get all players with pagination
 */
export async function getAllPlayers(
  limit: number = 50,
  offset: number = 0
): Promise<PlayerData[]> {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Error fetching all players:", error);
      return [];
    }

    return (
      data?.map((user) => ({
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        status: user.status,
        kycStatus: user.kyc_status,
        avatarUrl: user.avatar_url,
        createdAt: new Date(user.created_at),
        lastLogin: user.last_login ? new Date(user.last_login) : undefined,
      })) || []
    );
  } catch (error) {
    console.error("Exception in getAllPlayers:", error);
    return [];
  }
}

/**
 * Update player data
 */
export async function updatePlayer(
  playerId: string,
  updates: Partial<PlayerData>
): Promise<boolean> {
  try {
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (updates.email) updateData.email = updates.email;
    if (updates.username) updateData.username = updates.username;
    if (updates.firstName) updateData.first_name = updates.firstName;
    if (updates.lastName) updateData.last_name = updates.lastName;
    if (updates.role) updateData.role = updates.role;
    if (updates.status) updateData.status = updates.status;
    if (updates.kycStatus) updateData.kyc_status = updates.kycStatus;
    if (updates.avatarUrl) updateData.avatar_url = updates.avatarUrl;

    const { error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", playerId);

    if (error) {
      console.error("Error updating player:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Exception in updatePlayer:", error);
    return false;
  }
}
