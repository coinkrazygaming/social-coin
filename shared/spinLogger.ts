// Comprehensive Spin Logging System for Admin Panel Tracking
import {
  SpinLog,
  AdminSpinLog,
  GameAnalytics,
  WalletTransaction,
} from "./socialCasinoTypes";

export class SpinLoggerService {
  private static readonly MAX_CACHE_SIZE = 1000;
  private static spinLogCache: SpinLog[] = [];
  private static analyticsCache = new Map<string, GameAnalytics>();
  private static suspiciousActivityThreshold = {
    maxWinsInRow: 10,
    maxWinMultiplier: 1000,
    unusualBettingPattern: 50,
    rapidFireSpins: 30, // spins per minute
  };

  // Log a single spin with comprehensive data
  static async logSpin(spinData: {
    userId: string;
    gameId: string;
    sessionId: string;
    currency: "GC" | "SC";
    betAmount: number;
    winAmount: number;
    balanceBefore: number;
    balanceAfter: number;
    spinResult: any;
    ipAddress: string;
    userAgent: string;
    deviceType?: string;
  }): Promise<string> {
    const spinId = this.generateSpinId();

    const spinLog: SpinLog = {
      id: spinId,
      user_id: spinData.userId,
      game_id: spinData.gameId,
      session_id: spinData.sessionId,
      currency: spinData.currency,
      bet_amount: spinData.betAmount,
      win_amount: spinData.winAmount,
      balance_before: spinData.balanceBefore,
      balance_after: spinData.balanceAfter,
      spin_result: spinData.spinResult,
      paylines_hit: spinData.spinResult.paylines_hit || [],
      bonus_triggered: spinData.spinResult.bonus_triggered || false,
      free_spins_remaining: spinData.spinResult.free_spins_remaining,
      multiplier_applied: spinData.spinResult.multiplier || 1,
      created_at: new Date().toISOString(),
      ip_address: spinData.ipAddress,
      user_agent: spinData.userAgent,
    };

    // Add to cache
    this.spinLogCache.push(spinLog);

    // Manage cache size
    if (this.spinLogCache.length > this.MAX_CACHE_SIZE) {
      const excess = this.spinLogCache.splice(
        0,
        this.spinLogCache.length - this.MAX_CACHE_SIZE,
      );
      await this.batchSaveToDatabase(excess);
    }

    // Update real-time analytics
    await this.updateGameAnalytics(spinData.gameId, spinLog);

    // Check for suspicious activity
    await this.checkSuspiciousActivity(spinData.userId, spinLog);

    // Save immediately for high-value wins
    if (
      spinData.winAmount > 1000 ||
      spinData.winAmount > spinData.betAmount * 100
    ) {
      await this.saveSpinToDatabase(spinLog);
      await this.notifyAdminOfBigWin(spinLog);
    }

    return spinId;
  }

  // Get admin-formatted spin logs with filtering
  static async getAdminSpinLogs(
    filters: {
      userId?: string;
      gameId?: string;
      currency?: "GC" | "SC";
      minAmount?: number;
      maxAmount?: number;
      dateFrom?: string;
      dateTo?: string;
      suspicious?: boolean;
      limit?: number;
      offset?: number;
    } = {},
  ): Promise<AdminSpinLog[]> {
    // Filter cache data
    let filtered = [...this.spinLogCache];

    if (filters.userId) {
      filtered = filtered.filter((log) => log.user_id === filters.userId);
    }

    if (filters.gameId) {
      filtered = filtered.filter((log) => log.game_id === filters.gameId);
    }

    if (filters.currency) {
      filtered = filtered.filter((log) => log.currency === filters.currency);
    }

    if (filters.minAmount) {
      filtered = filtered.filter((log) => log.win_amount >= filters.minAmount!);
    }

    if (filters.maxAmount) {
      filtered = filtered.filter((log) => log.win_amount <= filters.maxAmount!);
    }

    if (filters.dateFrom) {
      filtered = filtered.filter((log) => log.created_at >= filters.dateFrom!);
    }

    if (filters.dateTo) {
      filtered = filtered.filter((log) => log.created_at <= filters.dateTo!);
    }

    // Convert to admin format
    const adminLogs: AdminSpinLog[] = await Promise.all(
      filtered.map(async (log) => {
        const playerName = await this.getPlayerName(log.user_id);
        const gameName = await this.getGameName(log.game_id);
        const suspicious = await this.isSuspiciousActivity(log);

        return {
          id: log.id,
          player_name: playerName,
          game_name: gameName,
          currency: log.currency,
          bet_amount: log.bet_amount,
          win_amount: log.win_amount,
          net_result: log.win_amount - log.bet_amount,
          timestamp: log.created_at,
          ip_address: log.ip_address,
          device_type: this.detectDeviceType(log.user_agent),
          suspicious_activity: suspicious,
          notes: suspicious
            ? await this.getSuspiciousActivityReason(log)
            : undefined,
        };
      }),
    );

    // Apply pagination
    const offset = filters.offset || 0;
    const limit = filters.limit || 100;

    return adminLogs
      .slice(offset, offset + limit)
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );
  }

  // Get real-time game analytics
  static async getGameAnalytics(gameId?: string): Promise<GameAnalytics[]> {
    if (gameId) {
      const analytics = this.analyticsCache.get(gameId);
      return analytics ? [analytics] : [];
    }

    return Array.from(this.analyticsCache.values());
  }

  // Get top performers for admin dashboard
  static async getTopPerformers(
    timeframe: "today" | "week" | "month" = "today",
  ): Promise<{
    topEarners: AdminSpinLog[];
    biggestWins: AdminSpinLog[];
    mostActive: AdminSpinLog[];
    suspiciousActivity: AdminSpinLog[];
  }> {
    const now = new Date();
    let cutoffDate: Date;

    switch (timeframe) {
      case "today":
        cutoffDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case "week":
        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        cutoffDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
    }

    const logs = await this.getAdminSpinLogs({
      dateFrom: cutoffDate.toISOString(),
      limit: 1000,
    });

    // Calculate top earners (by total winnings)
    const earningsMap = new Map<string, number>();
    logs.forEach((log) => {
      const current = earningsMap.get(log.player_name) || 0;
      earningsMap.set(log.player_name, current + log.win_amount);
    });

    const topEarners = logs
      .filter(
        (log, index, arr) =>
          arr.findIndex((l) => l.player_name === log.player_name) === index,
      )
      .map((log) => ({
        ...log,
        win_amount: earningsMap.get(log.player_name) || 0,
      }))
      .sort((a, b) => b.win_amount - a.win_amount)
      .slice(0, 10);

    // Biggest single wins
    const biggestWins = logs
      .sort((a, b) => b.win_amount - a.win_amount)
      .slice(0, 10);

    // Most active players (by spin count)
    const activityMap = new Map<string, number>();
    logs.forEach((log) => {
      const current = activityMap.get(log.player_name) || 0;
      activityMap.set(log.player_name, current + 1);
    });

    const mostActive = logs
      .filter(
        (log, index, arr) =>
          arr.findIndex((l) => l.player_name === log.player_name) === index,
      )
      .map((log) => ({
        ...log,
        win_amount: activityMap.get(log.player_name) || 0, // Reusing win_amount field for spin count
      }))
      .sort((a, b) => b.win_amount - a.win_amount)
      .slice(0, 10);

    // Suspicious activity
    const suspiciousActivity = logs
      .filter((log) => log.suspicious_activity)
      .slice(0, 20);

    return {
      topEarners,
      biggestWins,
      mostActive,
      suspiciousActivity,
    };
  }

  // Export spin logs for compliance/audit
  static async exportSpinLogs(
    filters: any = {},
    format: "json" | "csv" = "json",
  ): Promise<string> {
    const logs = await this.getAdminSpinLogs({ ...filters, limit: 10000 });

    if (format === "csv") {
      const headers = [
        "ID",
        "Player",
        "Game",
        "Currency",
        "Bet",
        "Win",
        "Net",
        "Timestamp",
        "IP Address",
        "Device",
        "Suspicious",
        "Notes",
      ];

      const csvData = [
        headers.join(","),
        ...logs.map((log) =>
          [
            log.id,
            log.player_name,
            log.game_name,
            log.currency,
            log.bet_amount,
            log.win_amount,
            log.net_result,
            log.timestamp,
            log.ip_address,
            log.device_type,
            log.suspicious_activity,
            log.notes || "",
          ].join(","),
        ),
      ].join("\n");

      return csvData;
    }

    return JSON.stringify(logs, null, 2);
  }

  // Real-time spin feed for admin dashboard
  static subscribeToLiveSpins(
    callback: (log: AdminSpinLog) => void,
  ): () => void {
    const interval = setInterval(async () => {
      const recentLogs = await this.getAdminSpinLogs({
        dateFrom: new Date(Date.now() - 60000).toISOString(), // Last minute
        limit: 10,
      });

      recentLogs.forEach(callback);
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }

  // Private helper methods
  private static generateSpinId(): string {
    return `spin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private static async updateGameAnalytics(
    gameId: string,
    spinLog: SpinLog,
  ): Promise<void> {
    const today = new Date().toISOString().split("T")[0];
    let analytics = this.analyticsCache.get(gameId);

    if (!analytics) {
      analytics = {
        game_id: gameId,
        game_name: await this.getGameName(gameId),
        total_sessions_today: 0,
        total_spins_today: 0,
        total_revenue_gc: 0,
        total_revenue_sc: 0,
        total_payouts_gc: 0,
        total_payouts_sc: 0,
        actual_rtp_gc: 0,
        actual_rtp_sc: 0,
        unique_players_today: 0,
        average_session_time: 0,
        bounce_rate: 0,
        conversion_rate: 0,
      };
    }

    // Update analytics
    analytics.total_spins_today++;

    if (spinLog.currency === "GC") {
      analytics.total_revenue_gc += spinLog.bet_amount;
      analytics.total_payouts_gc += spinLog.win_amount;
      analytics.actual_rtp_gc =
        analytics.total_revenue_gc > 0
          ? (analytics.total_payouts_gc / analytics.total_revenue_gc) * 100
          : 0;
    } else {
      analytics.total_revenue_sc += spinLog.bet_amount;
      analytics.total_payouts_sc += spinLog.win_amount;
      analytics.actual_rtp_sc =
        analytics.total_revenue_sc > 0
          ? (analytics.total_payouts_sc / analytics.total_revenue_sc) * 100
          : 0;
    }

    this.analyticsCache.set(gameId, analytics);
  }

  private static async checkSuspiciousActivity(
    userId: string,
    spinLog: SpinLog,
  ): Promise<void> {
    const userSpins = this.spinLogCache
      .filter((log) => log.user_id === userId)
      .slice(-50); // Last 50 spins

    const suspicious = {
      rapidFire: this.checkRapidFireSpins(userSpins),
      unusualWins: this.checkUnusualWinPattern(userSpins),
      bettingPattern: this.checkUnusualBettingPattern(userSpins),
      winStreak: this.checkLongWinStreak(userSpins),
    };

    if (Object.values(suspicious).some(Boolean)) {
      await this.flagSuspiciousActivity(userId, spinLog, suspicious);
    }
  }

  private static checkRapidFireSpins(spins: SpinLog[]): boolean {
    if (spins.length < 10) return false;

    const recentSpins = spins.slice(-10);
    const timeSpan =
      new Date(recentSpins[recentSpins.length - 1].created_at).getTime() -
      new Date(recentSpins[0].created_at).getTime();

    return timeSpan < 60000; // 10 spins in less than 1 minute
  }

  private static checkUnusualWinPattern(spins: SpinLog[]): boolean {
    const winRate =
      spins.filter((spin) => spin.win_amount > spin.bet_amount).length /
      spins.length;
    return winRate > 0.7; // Winning more than 70% of spins
  }

  private static checkUnusualBettingPattern(spins: SpinLog[]): boolean {
    if (spins.length < 5) return false;

    const amounts = spins.map((spin) => spin.bet_amount);
    const avgAmount = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const hasErraticPattern = amounts.some(
      (amount) => Math.abs(amount - avgAmount) > avgAmount * 10,
    );

    return hasErraticPattern;
  }

  private static checkLongWinStreak(spins: SpinLog[]): boolean {
    let streak = 0;
    let maxStreak = 0;

    for (const spin of spins.reverse()) {
      if (spin.win_amount > spin.bet_amount) {
        streak++;
        maxStreak = Math.max(maxStreak, streak);
      } else {
        streak = 0;
      }
    }

    return maxStreak > this.suspiciousActivityThreshold.maxWinsInRow;
  }

  private static async flagSuspiciousActivity(
    userId: string,
    spinLog: SpinLog,
    reasons: any,
  ): Promise<void> {
    try {
      const { error } = await DatabaseService.supabase
        .from("admin_alerts")
        .insert({
          type: "security_alert",
          title: "Suspicious Activity Detected",
          description: `User ${userId} - ${reasons}`,
          priority: "high",
          status: "pending",
          related_user_id: userId,
          related_entity_type: "spin_log",
          related_entity_id: spinLog.id,
          metadata: { spinLog, reasons },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (error) {
        console.error("Error flagging suspicious activity:", error);
      }
    } catch (error) {
      console.error("Exception in flagSuspiciousActivity:", error);
    }
  }

  private static async getPlayerName(userId: string): Promise<string> {
    try {
      const { data, error } = await DatabaseService.supabase
        .from("users")
        .select("username")
        .eq("id", userId)
        .single();

      if (error || !data) {
        return `Player_${userId.slice(-6)}`;
      }

      return data.username || `Player_${userId.slice(-6)}`;
    } catch (error) {
      return `Player_${userId.slice(-6)}`;
    }
  }

  private static async getGameName(gameId: string): Promise<string> {
    try {
      const { data, error } = await DatabaseService.supabase
        .from("games")
        .select("name")
        .eq("id", gameId)
        .single();

      if (error || !data) {
        return `Game_${gameId}`;
      }

      return data.name || `Game_${gameId}`;
    } catch (error) {
      return `Game_${gameId}`;
    }
  }

  private static detectDeviceType(userAgent: string): string {
    if (/mobile/i.test(userAgent)) return "mobile";
    if (/tablet/i.test(userAgent)) return "tablet";
    return "desktop";
  }

  private static async isSuspiciousActivity(log: SpinLog): Promise<boolean> {
    // Pattern 1: Extremely high win multiplier (> 100x)
    if (log.win_amount > log.bet_amount * 100) {
      return true;
    }

    // Pattern 2: Jackpot wins
    if (log.is_jackpot) {
      return true;
    }

    // Pattern 3: Very high single win amount
    if (log.win_amount > 10000) {
      return true;
    }

    return false;
  }

  private static async getSuspiciousActivityReason(
    log: SpinLog,
  ): Promise<string> {
    if (log.win_amount > log.bet_amount * 100) {
      return "Extremely high win multiplier";
    }
    return "Unusual activity pattern detected";
  }

  private static async batchSaveToDatabase(logs: SpinLog[]): Promise<void> {
    try {
      const records = logs.map((log) => ({
        id: log.id,
        user_id: log.user_id,
        game_id: log.game_id,
        session_id: log.session_id,
        bet_amount: log.bet_amount,
        win_amount: log.win_amount,
        currency: log.currency,
        result: log.result,
        multiplier: log.multiplier,
        is_bonus: log.is_bonus,
        is_jackpot: log.is_jackpot,
        rtp_contribution: log.rtp_contribution,
        timestamp: log.timestamp,
        device_type: log.device_type,
      }));

      const { error } = await DatabaseService.supabase
        .from("spin_logs")
        .insert(records);

      if (error) {
        console.error("Error batch saving spin logs:", error);
      }
    } catch (error) {
      console.error("Exception in batchSaveToDatabase:", error);
    }
  }

  private static async saveSpinToDatabase(log: SpinLog): Promise<void> {
    try {
      const { error } = await DatabaseService.supabase
        .from("spin_logs")
        .insert({
          id: log.id,
          user_id: log.user_id,
          game_id: log.game_id,
          session_id: log.session_id,
          bet_amount: log.bet_amount,
          win_amount: log.win_amount,
          currency: log.currency,
          result: log.result,
          multiplier: log.multiplier,
          is_bonus: log.is_bonus,
          is_jackpot: log.is_jackpot,
          rtp_contribution: log.rtp_contribution,
          timestamp: log.timestamp,
          device_type: log.device_type,
        });

      if (error) {
        console.error("Error saving spin to database:", error);
      }
    } catch (error) {
      console.error("Exception in saveSpinToDatabase:", error);
    }
  }

  private static async notifyAdminOfBigWin(log: SpinLog): Promise<void> {
    try {
      // Get all admin users
      const { data: admins, error: adminError } = await DatabaseService.supabase
        .from("users")
        .select("id")
        .in("role", ["admin", "staff"])
        .eq("status", "active");

      if (adminError || !admins) {
        console.error("Error fetching admins for big win notification:", adminError);
        return;
      }

      // Create notifications for all admins
      const notifications = admins.map((admin) => ({
        user_id: admin.id,
        sender_type: "system",
        title: "🎰 Big Win Alert!",
        message: `Player won ${log.win_amount} ${log.currency} (${log.multiplier}x multiplier)`,
        type: "success",
        priority: "medium",
        read: false,
        metadata: {
          spinId: log.id,
          userId: log.user_id,
          gameId: log.game_id,
          winAmount: log.win_amount,
          multiplier: log.multiplier,
        },
        created_at: new Date().toISOString(),
      }));

      const { error } = await DatabaseService.supabase
        .from("notifications")
        .insert(notifications);

      if (error) {
        console.error("Error sending big win notifications:", error);
      }
    } catch (error) {
      console.error("Exception in notifyAdminOfBigWin:", error);
    }
  }
}
