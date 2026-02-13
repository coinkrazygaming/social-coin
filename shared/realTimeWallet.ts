// Real-Time Wallet System with GC/SC Separation
import { DatabaseService } from "./database";
import {
  WalletTransaction,
  RealTimeWallet,
  SpinLog,
} from "./socialCasinoTypes";

export class RealTimeWalletService {
  private static walletCache = new Map<string, RealTimeWallet>();
  private static transactionQueue: WalletTransaction[] = [];
  private static readonly BATCH_SIZE = 10;
  private static readonly FLUSH_INTERVAL = 1000; // 1 second

  // Initialize wallet cache and start transaction processing
  static initialize() {
    setInterval(() => this.flushTransactionQueue(), this.FLUSH_INTERVAL);
  }

  // Get real-time wallet with instant cache
  static async getWallet(userId: string): Promise<RealTimeWallet | null> {
    // Check cache first
    if (this.walletCache.has(userId)) {
      return this.walletCache.get(userId)!;
    }

    // Fetch from database and cache
    const wallet = await this.fetchWalletFromDB(userId);
    if (wallet) {
      this.walletCache.set(userId, wallet);
    }
    return wallet;
  }

  // Process spin with real-time balance updates
  static async processSpin(
    userId: string,
    gameId: string,
    currency: "GC" | "SC",
    betAmount: number,
    winAmount: number,
    spinResult: any,
    sessionId: string,
  ): Promise<{ success: boolean; newBalance: number; transactionId: string }> {
    const wallet = await this.getWallet(userId);
    if (!wallet) {
      return { success: false, newBalance: 0, transactionId: "" };
    }

    // Check if user has sufficient balance
    const currentBalance =
      currency === "GC" ? wallet.gold_coins : wallet.sweeps_coins;
    if (currentBalance < betAmount) {
      return { success: false, newBalance: currentBalance, transactionId: "" };
    }

    // Calculate new balance after debit and credit
    const balanceAfterBet = currentBalance - betAmount;
    const finalBalance = balanceAfterBet + winAmount;

    // Update cache immediately for real-time response
    if (currency === "GC") {
      wallet.gold_coins = finalBalance;
      wallet.daily_gc_spent += betAmount;
      wallet.daily_gc_won += winAmount;
    } else {
      wallet.sweeps_coins = finalBalance;
      wallet.daily_sc_spent += betAmount;
      wallet.daily_sc_won += winAmount;
    }
    wallet.updated_at = new Date().toISOString();

    // Create bet transaction
    const betTransactionId = this.generateTransactionId();
    const betTransaction: WalletTransaction = {
      id: betTransactionId,
      user_id: userId,
      wallet_id: wallet.id,
      type: "spin_bet",
      currency,
      amount: -betAmount,
      balance_before: currentBalance,
      balance_after: balanceAfterBet,
      reference_id: sessionId,
      description: `Bet placed on ${gameId}`,
      status: "completed",
      created_at: new Date().toISOString(),
      metadata: {
        game_id: gameId,
        session_id: sessionId,
        device_type: "web", // Device detection handled by server
      },
    };

    // Create win transaction if there's a win
    let winTransactionId = "";
    if (winAmount > 0) {
      winTransactionId = this.generateTransactionId();
      const winTransaction: WalletTransaction = {
        id: winTransactionId,
        user_id: userId,
        wallet_id: wallet.id,
        type: "spin_win",
        currency,
        amount: winAmount,
        balance_before: balanceAfterBet,
        balance_after: finalBalance,
        reference_id: sessionId,
        description: `Win from ${gameId}`,
        status: "completed",
        created_at: new Date().toISOString(),
        metadata: {
          game_id: gameId,
          session_id: sessionId,
          device_type: "web",
        },
      };
      this.queueTransaction(winTransaction);
    }

    // Queue bet transaction
    this.queueTransaction(betTransaction);

    // Create spin log
    await this.createSpinLog({
      id: this.generateTransactionId(),
      user_id: userId,
      game_id: gameId,
      session_id: sessionId,
      currency,
      bet_amount: betAmount,
      win_amount: winAmount,
      balance_before: currentBalance,
      balance_after: finalBalance,
      spin_result: spinResult,
      paylines_hit: spinResult.paylines_hit || [],
      bonus_triggered: spinResult.bonus_triggered || false,
      free_spins_remaining: spinResult.free_spins_remaining,
      multiplier_applied: spinResult.multiplier || 1,
      created_at: new Date().toISOString(),
      ip_address: "0.0.0.0", // IP address handled by server
      user_agent: "Unknown", // User agent handled by server
    });

    return {
      success: true,
      newBalance: finalBalance,
      transactionId: winAmount > 0 ? winTransactionId : betTransactionId,
    };
  }

  // Check if user can play in specific currency mode
  static async canUserPlay(
    userId: string,
    currency: "GC" | "SC",
    betAmount: number,
  ): Promise<{
    canPlay: boolean;
    reason?: string;
    availableBalance: number;
  }> {
    const wallet = await this.getWallet(userId);
    if (!wallet) {
      return {
        canPlay: false,
        reason: "Wallet not found",
        availableBalance: 0,
      };
    }

    const balance = currency === "GC" ? wallet.gold_coins : wallet.sweeps_coins;

    if (balance < betAmount) {
      return {
        canPlay: false,
        reason: `Insufficient ${currency} balance`,
        availableBalance: balance,
      };
    }

    // Check daily limits (if any restrictions exist)
    const dailySpent =
      currency === "GC" ? wallet.daily_gc_spent : wallet.daily_sc_spent;
    const dailyLimit = currency === "GC" ? 50000 : 500; // Example limits

    if (dailySpent + betAmount > dailyLimit) {
      return {
        canPlay: false,
        reason: `Daily ${currency} limit exceeded`,
        availableBalance: balance,
      };
    }

    return { canPlay: true, availableBalance: balance };
  }

  // Add funds to wallet (admin function)
  static async addFunds(
    userId: string,
    currency: "GC" | "SC",
    amount: number,
    reason: string,
    adminUserId: string,
  ): Promise<boolean> {
    const wallet = await this.getWallet(userId);
    if (!wallet) return false;

    const currentBalance =
      currency === "GC" ? wallet.gold_coins : wallet.sweeps_coins;
    const newBalance = currentBalance + amount;

    // Update cache immediately
    if (currency === "GC") {
      wallet.gold_coins = newBalance;
    } else {
      wallet.sweeps_coins = newBalance;
    }
    wallet.updated_at = new Date().toISOString();

    // Create transaction
    const transaction: WalletTransaction = {
      id: this.generateTransactionId(),
      user_id: userId,
      wallet_id: wallet.id,
      type: "admin_adjustment",
      currency,
      amount,
      balance_before: currentBalance,
      balance_after: newBalance,
      description: `Admin adjustment: ${reason}`,
      status: "completed",
      admin_notes: `Added by admin ${adminUserId}: ${reason}`,
      created_at: new Date().toISOString(),
      metadata: {
        admin_user_id: adminUserId,
        adjustment_reason: reason,
      },
    };

    this.queueTransaction(transaction);
    return true;
  }

  // Get real-time wallet balance without full wallet object
  static async getBalance(
    userId: string,
    currency: "GC" | "SC",
  ): Promise<number> {
    const wallet = await this.getWallet(userId);
    if (!wallet) return 0;
    return currency === "GC" ? wallet.gold_coins : wallet.sweeps_coins;
  }

  // Batch update wallets in database
  private static async flushTransactionQueue(): Promise<void> {
    if (this.transactionQueue.length === 0) return;

    const batch = this.transactionQueue.splice(0, this.BATCH_SIZE);

    try {
      // Group transactions by wallet for batch updates
      const walletUpdates = new Map<string, RealTimeWallet>();

      for (const transaction of batch) {
        const wallet = this.walletCache.get(transaction.user_id);
        if (wallet) {
          walletUpdates.set(wallet.id, wallet);
        }

        // Save individual transaction
        await this.saveTransaction(transaction);
      }

      // Batch update wallets
      for (const wallet of walletUpdates.values()) {
        await this.updateWalletInDB(wallet);
      }
    } catch (error) {
      console.error("Error flushing transaction queue:", error);
      // Re-queue failed transactions
      this.transactionQueue.unshift(...batch);
    }
  }

  private static queueTransaction(transaction: WalletTransaction): void {
    this.transactionQueue.push(transaction);
  }

  private static generateTransactionId(): string {
    return `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private static async fetchWalletFromDB(
    userId: string,
  ): Promise<RealTimeWallet | null> {
    try {
      const { data, error } = await DatabaseService.supabase
        .from("wallets")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error || !data) {
        console.error("Error fetching wallet:", error);
        // Return default wallet for new users
        return {
          id: `wallet_${userId}`,
          user_id: userId,
          gold_coins: 10000,
          sweeps_coins: 10,
          last_gc_transaction: new Date().toISOString(),
          last_sc_transaction: new Date().toISOString(),
          daily_gc_spent: 0,
          daily_sc_spent: 0,
          daily_gc_won: 0,
          daily_sc_won: 0,
          pending_withdrawals: 0,
          total_deposits: 0,
          total_withdrawals: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }

      return {
        id: data.id,
        user_id: data.user_id,
        gold_coins: parseFloat(data.gold_coins) || 0,
        sweeps_coins: parseFloat(data.sweeps_coins) || 0,
        last_gc_transaction: data.last_transaction || new Date().toISOString(),
        last_sc_transaction: data.last_transaction || new Date().toISOString(),
        daily_gc_spent: 0,
        daily_sc_spent: 0,
        daily_gc_won: 0,
        daily_sc_won: 0,
        pending_withdrawals: parseFloat(data.pending_withdrawals) || 0,
        total_deposits: parseFloat(data.total_deposits) || 0,
        total_withdrawals: parseFloat(data.total_withdrawals) || 0,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };
    } catch (error) {
      console.error("Exception in fetchWalletFromDB:", error);
      return null;
    }
  }

  private static async updateWalletInDB(wallet: RealTimeWallet): Promise<void> {
    try {
      const { error } = await DatabaseService.supabase
        .from("wallets")
        .update({
          gold_coins: wallet.gold_coins,
          sweeps_coins: wallet.sweeps_coins,
          last_transaction: new Date().toISOString(),
          pending_withdrawals: wallet.pending_withdrawals,
          total_deposits: wallet.total_deposits,
          total_withdrawals: wallet.total_withdrawals,
          updated_at: new Date().toISOString(),
        })
        .eq("id", wallet.id);

      if (error) {
        console.error("Error updating wallet in DB:", error);
      }
    } catch (error) {
      console.error("Exception in updateWalletInDB:", error);
    }
  }

  private static async saveTransaction(
    transaction: WalletTransaction,
  ): Promise<void> {
    try {
      const { error } = await DatabaseService.supabase
        .from("transactions")
        .insert({
          id: transaction.id,
          user_id: transaction.user_id,
          wallet_id: transaction.wallet_id,
          type: transaction.type,
          currency: transaction.currency,
          amount: transaction.amount,
          balance_before: transaction.balance_before,
          balance_after: transaction.balance_after,
          description: transaction.description,
          reference_id: transaction.reference_id,
          status: transaction.status,
          metadata: transaction.metadata,
          created_at: transaction.created_at,
        });

      if (error) {
        console.error("Error saving transaction:", error);
      }
    } catch (error) {
      console.error("Exception in saveTransaction:", error);
    }
  }

  private static async createSpinLog(spinLog: SpinLog): Promise<void> {
    try {
      const { error } = await DatabaseService.supabase
        .from("spin_logs")
        .insert({
          id: spinLog.id,
          user_id: spinLog.user_id,
          game_id: spinLog.game_id,
          session_id: spinLog.session_id,
          bet_amount: spinLog.bet_amount,
          win_amount: spinLog.win_amount,
          currency: spinLog.currency,
          balance_before: spinLog.balance_before,
          balance_after: spinLog.balance_after,
          spin_result: spinLog.spin_result,
          paylines_hit: spinLog.paylines_hit,
          bonus_triggered: spinLog.bonus_triggered,
          free_spins_remaining: spinLog.free_spins_remaining,
          multiplier_applied: spinLog.multiplier_applied,
          created_at: spinLog.created_at,
          ip_address: spinLog.ip_address,
          user_agent: spinLog.user_agent,
        });

      if (error) {
        console.error("Error creating spin log:", error);
      }
    } catch (error) {
      console.error("Exception in createSpinLog:", error);
    }
  }

  // Subscribe to wallet updates for real-time UI updates
  static subscribeToWallet(
    userId: string,
    callback: (wallet: RealTimeWallet) => void,
  ): () => void {
    const interval = setInterval(() => {
      const wallet = this.walletCache.get(userId);
      if (wallet) {
        callback(wallet);
      }
    }, 500); // Update every 500ms

    return () => clearInterval(interval);
  }

  // Clear cache (for logout, etc.)
  static clearCache(userId?: string): void {
    if (userId) {
      this.walletCache.delete(userId);
    } else {
      this.walletCache.clear();
    }
  }
}

// Initialize the service
RealTimeWalletService.initialize();
