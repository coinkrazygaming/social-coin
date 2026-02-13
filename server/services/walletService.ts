/**
 * Wallet Service
 * Handles all wallet-related database operations
 */

import { supabase } from "../../shared/database";
import type {
  RealTimeWallet,
  WalletTransaction,
} from "../../shared/realTimeWallet";

export interface WalletBalance {
  gold_coins: number;
  sweeps_coins: number;
}

export interface TransactionInput {
  user_id: string;
  wallet_id: string;
  type: "deposit" | "withdrawal" | "win" | "bet" | "bonus" | "refund";
  currency: "GC" | "SC";
  amount: number;
  balance_before: number;
  balance_after: number;
  description?: string;
  reference_id?: string;
  metadata?: Record<string, any>;
}

/**
 * Get wallet by user ID
 */
export async function getWalletByUserId(
  userId: string
): Promise<RealTimeWallet | null> {
  try {
    const { data, error } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Error fetching wallet:", error);
      return null;
    }

    if (!data) {
      return null;
    }

    // Transform database format to RealTimeWallet format
    return {
      id: data.id,
      userId: data.user_id,
      goldCoins: parseFloat(data.gold_coins) || 0,
      sweepsCoins: parseFloat(data.sweeps_coins) || 0,
      totalDeposits: parseFloat(data.total_deposits) || 0,
      totalWithdrawals: parseFloat(data.total_withdrawals) || 0,
      pendingWithdrawals: parseFloat(data.pending_withdrawals) || 0,
      lastTransaction: data.last_transaction
        ? new Date(data.last_transaction)
        : new Date(),
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  } catch (error) {
    console.error("Exception in getWalletByUserId:", error);
    return null;
  }
}

/**
 * Update wallet balance
 */
export async function updateWalletBalance(
  walletId: string,
  goldCoins?: number,
  sweepsCoins?: number
): Promise<boolean> {
  try {
    const updateData: any = {
      updated_at: new Date().toISOString(),
      last_transaction: new Date().toISOString(),
    };

    if (goldCoins !== undefined) {
      updateData.gold_coins = goldCoins;
    }

    if (sweepsCoins !== undefined) {
      updateData.sweeps_coins = sweepsCoins;
    }

    const { error } = await supabase
      .from("wallets")
      .update(updateData)
      .eq("id", walletId);

    if (error) {
      console.error("Error updating wallet balance:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Exception in updateWalletBalance:", error);
    return false;
  }
}

/**
 * Create a new transaction record
 */
export async function createTransaction(
  transaction: TransactionInput
): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from("transactions")
      .insert({
        user_id: transaction.user_id,
        wallet_id: transaction.wallet_id,
        type: transaction.type,
        currency: transaction.currency,
        amount: transaction.amount,
        balance_before: transaction.balance_before,
        balance_after: transaction.balance_after,
        description: transaction.description || "",
        reference_id: transaction.reference_id,
        status: "completed",
        metadata: transaction.metadata || {},
        created_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (error) {
      console.error("Error creating transaction:", error);
      return null;
    }

    return data?.id || null;
  } catch (error) {
    console.error("Exception in createTransaction:", error);
    return null;
  }
}

/**
 * Get transaction history for a user
 */
export async function getTransactionHistory(
  userId: string,
  limit: number = 50,
  offset: number = 0
): Promise<WalletTransaction[]> {
  try {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Error fetching transaction history:", error);
      return [];
    }

    return (
      data?.map((tx) => ({
        id: tx.id,
        userId: tx.user_id,
        walletId: tx.wallet_id,
        type: tx.type,
        currency: tx.currency,
        amount: parseFloat(tx.amount),
        balanceBefore: parseFloat(tx.balance_before),
        balanceAfter: parseFloat(tx.balance_after),
        description: tx.description,
        referenceId: tx.reference_id,
        status: tx.status,
        metadata: tx.metadata,
        createdAt: new Date(tx.created_at),
      })) || []
    );
  } catch (error) {
    console.error("Exception in getTransactionHistory:", error);
    return [];
  }
}

/**
 * Validate transaction before processing
 */
export function validateTransaction(
  walletBalance: WalletBalance,
  amount: number,
  currency: "GC" | "SC",
  type: "bet" | "withdrawal"
): { valid: boolean; error?: string } {
  const balance =
    currency === "GC" ? walletBalance.gold_coins : walletBalance.sweeps_coins;

  if (amount <= 0) {
    return { valid: false, error: "Amount must be greater than 0" };
  }

  if (type === "bet" || type === "withdrawal") {
    if (balance < amount) {
      return { valid: false, error: "Insufficient balance" };
    }
  }

  return { valid: true };
}

/**
 * Process a bet transaction (deduct from wallet)
 */
export async function processBet(
  userId: string,
  walletId: string,
  amount: number,
  currency: "GC" | "SC",
  gameId: string,
  sessionId: string
): Promise<{ success: boolean; error?: string; transactionId?: string }> {
  try {
    // Get current wallet
    const wallet = await getWalletByUserId(userId);
    if (!wallet) {
      return { success: false, error: "Wallet not found" };
    }

    // Validate transaction
    const validation = validateTransaction(
      {
        gold_coins: wallet.goldCoins,
        sweeps_coins: wallet.sweepsCoins,
      },
      amount,
      currency,
      "bet"
    );

    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Calculate new balance
    const balanceBefore =
      currency === "GC" ? wallet.goldCoins : wallet.sweepsCoins;
    const balanceAfter = balanceBefore - amount;

    // Update wallet
    const updateSuccess = await updateWalletBalance(
      walletId,
      currency === "GC" ? balanceAfter : undefined,
      currency === "SC" ? balanceAfter : undefined
    );

    if (!updateSuccess) {
      return { success: false, error: "Failed to update wallet" };
    }

    // Create transaction record
    const transactionId = await createTransaction({
      user_id: userId,
      wallet_id: walletId,
      type: "bet",
      currency,
      amount,
      balance_before: balanceBefore,
      balance_after: balanceAfter,
      description: `Bet placed on ${gameId}`,
      reference_id: sessionId,
      metadata: { gameId, sessionId },
    });

    if (!transactionId) {
      return { success: false, error: "Failed to create transaction record" };
    }

    return { success: true, transactionId };
  } catch (error) {
    console.error("Exception in processBet:", error);
    return { success: false, error: "Internal error processing bet" };
  }
}

/**
 * Process a win transaction (add to wallet)
 */
export async function processWin(
  userId: string,
  walletId: string,
  amount: number,
  currency: "GC" | "SC",
  gameId: string,
  sessionId: string
): Promise<{ success: boolean; error?: string; transactionId?: string }> {
  try {
    // Get current wallet
    const wallet = await getWalletByUserId(userId);
    if (!wallet) {
      return { success: false, error: "Wallet not found" };
    }

    // Calculate new balance
    const balanceBefore =
      currency === "GC" ? wallet.goldCoins : wallet.sweepsCoins;
    const balanceAfter = balanceBefore + amount;

    // Update wallet
    const updateSuccess = await updateWalletBalance(
      walletId,
      currency === "GC" ? balanceAfter : undefined,
      currency === "SC" ? balanceAfter : undefined
    );

    if (!updateSuccess) {
      return { success: false, error: "Failed to update wallet" };
    }

    // Create transaction record
    const transactionId = await createTransaction({
      user_id: userId,
      wallet_id: walletId,
      type: "win",
      currency,
      amount,
      balance_before: balanceBefore,
      balance_after: balanceAfter,
      description: `Win from ${gameId}`,
      reference_id: sessionId,
      metadata: { gameId, sessionId },
    });

    if (!transactionId) {
      return { success: false, error: "Failed to create transaction record" };
    }

    return { success: true, transactionId };
  } catch (error) {
    console.error("Exception in processWin:", error);
    return { success: false, error: "Internal error processing win" };
  }
}

/**
 * Create a wallet for a new user
 */
export async function createWallet(
  userId: string,
  initialGC: number = 0,
  initialSC: number = 0
): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from("wallets")
      .insert({
        user_id: userId,
        gold_coins: initialGC,
        sweeps_coins: initialSC,
        total_deposits: 0,
        total_withdrawals: 0,
        pending_withdrawals: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (error) {
      console.error("Error creating wallet:", error);
      return null;
    }

    return data?.id || null;
  } catch (error) {
    console.error("Exception in createWallet:", error);
    return null;
  }
}
