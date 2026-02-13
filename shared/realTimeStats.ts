// Real-Time Stats System for Social Casino
import { RealTimeStats, SocialCasinoGame, BigWin } from "./socialCasinoTypes";
import { SpinLoggerService } from "./spinLogger";
import { APISlotProvidersService } from "./apiSlotsProviders";

export class RealTimeStatsService {
  private static stats: RealTimeStats = {
    total_active_games: 0,
    total_games_available: 0,
    sc_earned_today: 0,
    gc_earned_today: 0,
    max_win_available_gc: 0,
    max_win_available_sc: 0,
    total_players_online: 0,
    total_spins_today: 0,
    biggest_win_today: undefined,
    updated_at: new Date().toISOString(),
  };

  private static listeners: Array<(stats: RealTimeStats) => void> = [];
  private static updateInterval: NodeJS.Timeout | null = null;
  private static readonly UPDATE_FREQUENCY = 5000; // 5 seconds
  private static gameCache: Map<string, SocialCasinoGame> = new Map();

  // Initialize the service
  static initialize() {
    this.loadInitialStats();
    this.startRealTimeUpdates();
  }

  // Get current stats
  static getCurrentStats(): RealTimeStats {
    return { ...this.stats };
  }

  // Subscribe to real-time stats updates
  static subscribe(callback: (stats: RealTimeStats) => void): () => void {
    this.listeners.push(callback);

    // Send current stats immediately
    callback(this.stats);

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Update stats with new spin data
  static async updateStatsFromSpin(
    currency: "GC" | "SC",
    betAmount: number,
    winAmount: number,
    gameId: string,
    playerId: string,
  ): Promise<void> {
    // Update total spins
    this.stats.total_spins_today++;

    // Update earnings
    if (currency === "GC") {
      this.stats.gc_earned_today += betAmount;
    } else {
      this.stats.sc_earned_today += betAmount;
    }

    // Check for biggest win today
    if (winAmount > 0) {
      const isNewBiggestWin =
        !this.stats.biggest_win_today ||
        winAmount > this.stats.biggest_win_today.amount;

      if (isNewBiggestWin) {
        this.stats.biggest_win_today = {
          player_name: await this.getPlayerName(playerId),
          amount: winAmount,
          currency,
          game_id: gameId,
          timestamp: new Date().toISOString(),
        };
      }
    }

    this.stats.updated_at = new Date().toISOString();
    this.notifyListeners();
  }

  // Get detailed game stats
  static async getGameStats(): Promise<
    Array<{
      gameId: string;
      gameName: string;
      category: string;
      totalSpins: number;
      totalRevenue: number;
      biggestWin: number;
      activeNow: number;
      popularityScore: number;
    }>
  > {
    const analytics = await SpinLoggerService.getGameAnalytics();

    return analytics.map((game) => ({
      gameId: game.game_id,
      gameName: game.game_name,
      category: this.getGameCategory(game.game_id),
      totalSpins: game.total_spins_today,
      totalRevenue: game.total_revenue_gc + game.total_revenue_sc,
      biggestWin: game.total_payouts_gc + game.total_payouts_sc,
      activeNow: await this.getActivePlayerCount(game.game_id),
      popularityScore: this.calculatePopularityScore(game),
    }));
  }

  // Get top performing games
  static async getTopGames(limit: number = 10): Promise<
    Array<{
      gameId: string;
      gameName: string;
      revenue: number;
      spins: number;
      rtp: number;
      trend: "up" | "down" | "stable";
    }>
  > {
    const gameStats = await this.getGameStats();

    return gameStats
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, limit)
      .map((game) => ({
        gameId: game.gameId,
        gameName: game.gameName,
        revenue: game.totalRevenue,
        spins: game.totalSpins,
        rtp: this.calculateRTP(game.gameId),
        trend: this.calculateTrend(game.gameId),
      }));
  }

  // Get hourly stats for charts
  static async getHourlyStats(): Promise<
    Array<{
      hour: string;
      spins: number;
      revenue_gc: number;
      revenue_sc: number;
      unique_players: number;
      big_wins: number;
    }>
  > {
    const hourlyData: Array<{
      hour: string;
      spins: number;
      revenue_gc: number;
      revenue_sc: number;
      unique_players: number;
      big_wins: number;
    }> = [];

    // Generate last 24 hours of data
    for (let i = 23; i >= 0; i--) {
      const hour = new Date(Date.now() - i * 60 * 60 * 1000);
      const hourString = hour.toISOString().substring(0, 13) + ":00:00Z";

      // Simulate realistic hourly data
      const baseSpins = 50 + Math.floor(Math.random() * 200);
      const timeOfDay = hour.getHours();

      // Peak hours: 6-9 PM (18-21)
      const peakMultiplier =
        timeOfDay >= 18 && timeOfDay <= 21
          ? 2.5
          : timeOfDay >= 12 && timeOfDay <= 14
            ? 1.8 // Lunch
            : timeOfDay >= 20 || timeOfDay <= 2
              ? 0.3
              : 1; // Late night

      const adjustedSpins = Math.floor(baseSpins * peakMultiplier);

      hourlyData.push({
        hour: hourString,
        spins: adjustedSpins,
        revenue_gc: adjustedSpins * (5 + Math.random() * 15), // 5-20 GC per spin avg
        revenue_sc: adjustedSpins * (0.1 + Math.random() * 0.4), // 0.1-0.5 SC per spin avg
        unique_players: Math.floor(adjustedSpins * (0.1 + Math.random() * 0.2)), // 10-30% unique
        big_wins: Math.floor(adjustedSpins * 0.02), // 2% big win rate
      });
    }

    return hourlyData;
  }

  // Get player activity stats
  static async getPlayerActivityStats(): Promise<{
    totalRegistered: number;
    activeToday: number;
    onlineNow: number;
    newToday: number;
    retentionRate: number;
    averageSessionTime: number;
  }> {
    return {
      totalRegistered: 15847 + Math.floor(Math.random() * 100),
      activeToday: 2847 + Math.floor(Math.random() * 100),
      onlineNow: 156 + Math.floor(Math.random() * 50),
      newToday: 47 + Math.floor(Math.random() * 20),
      retentionRate: 0.78 + Math.random() * 0.1,
      averageSessionTime: 18.5 + Math.random() * 5, // minutes
    };
  }

  // Get financial stats
  static async getFinancialStats(): Promise<{
    totalRevenueToday: number;
    totalPayoutsToday: number;
    netRevenueToday: number;
    averageRTP: number;
    gcCirculation: number;
    scCirculation: number;
    pendingWithdrawals: number;
  }> {
    return {
      totalRevenueToday:
        this.stats.gc_earned_today + this.stats.sc_earned_today * 100,
      totalPayoutsToday:
        this.stats.gc_earned_today * 0.95 + this.stats.sc_earned_today * 95,
      netRevenueToday:
        (this.stats.gc_earned_today + this.stats.sc_earned_today * 100) * 0.05,
      averageRTP: 95.4 + Math.random() * 2,
      gcCirculation: 2456789 + Math.floor(Math.random() * 100000),
      scCirculation: 12847.65 + Math.random() * 1000,
      pendingWithdrawals: 2847.32 + Math.random() * 500,
    };
  }

  // Private helper methods
  private static async loadInitialStats(): Promise<void> {
    try {
      // Load all available games
      const apiGames = await APISlotProvidersService.fetchAllGames();
      apiGames.forEach((game) => this.gameCache.set(game.id, game));

      // Set initial stats
      this.stats.total_games_available = apiGames.length;
      this.stats.total_active_games = apiGames.filter(
        (game) => game.is_active,
      ).length;

      // Calculate max wins
      this.stats.max_win_available_gc = Math.max(
        ...apiGames.map((game) => game.max_win_gc),
      );
      this.stats.max_win_available_sc = Math.max(
        ...apiGames.map((game) => game.max_win_sc),
      );

      // Load today's accumulated stats
      await this.loadTodaysStats();

      this.stats.updated_at = new Date().toISOString();
    } catch (error) {
      console.error("Error loading initial stats:", error);
    }
  }

  private static async loadTodaysStats(): Promise<void> {
    const today = new Date().toISOString().split("T")[0];

    // Simulate loading today's accumulated stats
    this.stats.total_spins_today = 8547 + Math.floor(Math.random() * 1000);
    this.stats.gc_earned_today = 125847.5 + Math.random() * 10000;
    this.stats.sc_earned_today = 2847.75 + Math.random() * 500;
    this.stats.total_players_online = 156 + Math.floor(Math.random() * 50);

    // Set biggest win today
    this.stats.biggest_win_today = {
      player_name: "Player_" + Math.random().toString(36).substr(2, 6),
      amount: 2500 + Math.random() * 10000,
      currency: Math.random() > 0.5 ? "GC" : "SC",
      game_id: "demo_provider_game_1",
      timestamp: new Date(
        Date.now() - Math.random() * 24 * 60 * 60 * 1000,
      ).toISOString(),
    };
  }

  private static startRealTimeUpdates(): void {
    this.updateInterval = setInterval(async () => {
      await this.updateStats();
    }, this.UPDATE_FREQUENCY);
  }

  private static async updateStats(): Promise<void> {
    // Simulate real-time fluctuations
    const fluctuation = (Math.random() - 0.5) * 0.1; // ±5% fluctuation

    // Update online players count
    this.stats.total_players_online = Math.max(
      50,
      Math.floor(this.stats.total_players_online * (1 + fluctuation)),
    );

    // Simulate new spins and earnings
    const newSpins = Math.floor(Math.random() * 10);
    if (newSpins > 0) {
      this.stats.total_spins_today += newSpins;
      this.stats.gc_earned_today += newSpins * (5 + Math.random() * 15);
      this.stats.sc_earned_today += newSpins * (0.1 + Math.random() * 0.4);
    }

    this.stats.updated_at = new Date().toISOString();
    this.notifyListeners();
  }

  private static notifyListeners(): void {
    this.listeners.forEach((callback) => {
      try {
        callback(this.stats);
      } catch (error) {
        console.error("Error in stats listener callback:", error);
      }
    });
  }

  private static async getPlayerName(playerId: string): Promise<string> {
    try {
      const { data, error } = await DatabaseService.supabase
        .from("users")
        .select("username")
        .eq("id", playerId)
        .single();

      if (error || !data) {
        return `Player_${playerId.slice(-6)}`;
      }

      return data.username || `Player_${playerId.slice(-6)}`;
    } catch (error) {
      return `Player_${playerId.slice(-6)}`;
    }
  }

  private static async getActivePlayerCount(gameId: string): Promise<number> {
    try {
      // Consider players active if they played in the last 5 minutes
      const cutoffTime = new Date();
      cutoffTime.setMinutes(cutoffTime.getMinutes() - 5);

      const { data, error } = await DatabaseService.supabase
        .from("spin_logs")
        .select("user_id")
        .eq("game_id", gameId)
        .gte("timestamp", cutoffTime.toISOString());

      if (error || !data) {
        return 0;
      }

      // Count unique users
      const uniqueUsers = new Set(data.map((log) => log.user_id));
      return uniqueUsers.size;
    } catch (error) {
      console.error("Error getting active player count:", error);
      return 0;
    }
  }

  private static getGameCategory(gameId: string): string {
    const game = this.gameCache.get(gameId);
    return game?.category || "social_slots";
  }

  private static calculatePopularityScore(game: any): number {
    // Simple popularity calculation based on spins and revenue
    const spinsWeight = game.total_spins_today * 0.7;
    const revenueWeight = (game.total_revenue_gc + game.total_revenue_sc) * 0.3;
    return Math.floor(spinsWeight + revenueWeight);
  }

  private static async calculateRTP(gameId: string): Promise<number> {
    try {
      // Calculate RTP from last 30 days of spin logs
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - 30);

      const { data, error } = await DatabaseService.supabase
        .from("spin_logs")
        .select("bet_amount, win_amount")
        .eq("game_id", gameId)
        .gte("timestamp", cutoffDate.toISOString());

      if (error || !data || data.length === 0) {
        return 96.0; // Default RTP
      }

      const totalBet = data.reduce((sum, spin) => sum + parseFloat(spin.bet_amount), 0);
      const totalWin = data.reduce((sum, spin) => sum + parseFloat(spin.win_amount), 0);

      if (totalBet === 0) {
        return 96.0;
      }

      const rtp = (totalWin / totalBet) * 100;
      return Math.round(rtp * 100) / 100;
    } catch (error) {
      console.error("Error calculating RTP:", error);
      return 96.0;
    }
  }

  private static async calculateTrend(gameId: string): Promise<"up" | "down" | "stable"> {
    try {
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

      // Get spin count for last 24 hours
      const { data: recentData } = await DatabaseService.supabase
        .from("spin_logs")
        .select("id", { count: "exact" })
        .eq("game_id", gameId)
        .gte("timestamp", oneDayAgo.toISOString());

      // Get spin count for previous 24 hours
      const { data: previousData } = await DatabaseService.supabase
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
      console.error("Error calculating trend:", error);
      return "stable";
    }
  }

  // Cleanup when service is stopped
  static destroy(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    this.listeners = [];
  }
}

// Initialize the service
RealTimeStatsService.initialize();
