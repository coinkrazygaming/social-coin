import { RequestHandler } from "express";
import {
  SlotMachine,
  SlotSpin,
  SlotSession,
  SlotStats,
} from "../../shared/slotTypes";
import { DEFAULT_COINKRAZY_SLOTS } from "../../shared/defaultSlots";

// In-memory storage for demo purposes
// In production, this would be stored in a database
let inHouseSlots: SlotMachine[] = [...DEFAULT_COINKRAZY_SLOTS];
let slotSpins: SlotSpin[] = [];
let slotSessions: SlotSession[] = [];

export const handleGetInHouseSlots: RequestHandler = (req, res) => {
  try {
    res.json(inHouseSlots);
  } catch (error) {
    console.error("Error getting in-house slots:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const handleCreateSlot: RequestHandler = (req, res) => {
  try {
    const slotData: SlotMachine = req.body;

    // Validate required fields
    if (!slotData.name || !slotData.symbols || !slotData.reels) {
      return res
        .status(400)
        .json({ error: "Missing required slot configuration" });
    }

    // Assign ID if not provided
    if (!slotData.id) {
      slotData.id = `slot_${Date.now()}`;
    }

    // Set provider to CoinKrazy
    slotData.provider = "CoinKrazy";
    slotData.created = new Date();
    slotData.updated = new Date();

    inHouseSlots.push(slotData);

    res.status(201).json({
      success: true,
      slot: slotData,
    });
  } catch (error) {
    console.error("Error creating slot:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const handleUpdateSlot: RequestHandler = (req, res) => {
  try {
    const { slotId } = req.params;
    const updates: Partial<SlotMachine> = req.body;

    const slotIndex = inHouseSlots.findIndex((slot) => slot.id === slotId);
    if (slotIndex === -1) {
      return res.status(404).json({ error: "Slot not found" });
    }

    // Update slot
    inHouseSlots[slotIndex] = {
      ...inHouseSlots[slotIndex],
      ...updates,
      updated: new Date(),
    };

    res.json({
      success: true,
      slot: inHouseSlots[slotIndex],
    });
  } catch (error) {
    console.error("Error updating slot:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const handleDeleteSlot: RequestHandler = (req, res) => {
  try {
    const { slotId } = req.params;

    const slotIndex = inHouseSlots.findIndex((slot) => slot.id === slotId);
    if (slotIndex === -1) {
      return res.status(404).json({ error: "Slot not found" });
    }

    // Remove slot
    const deletedSlot = inHouseSlots.splice(slotIndex, 1)[0];

    res.json({
      success: true,
      deletedSlot,
    });
  } catch (error) {
    console.error("Error deleting slot:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const handleSpinSlot: RequestHandler = async (req, res) => {
  try {
    const { slotId } = req.params;
    const { userId, bet, currency = "GC" } = req.body;

    if (!userId || !bet || bet <= 0) {
      return res.status(400).json({ error: "Invalid spin request" });
    }

    if (!["GC", "SC"].includes(currency)) {
      return res.status(400).json({ error: "Invalid currency" });
    }

    const slot = inHouseSlots.find((s) => s.id === slotId);
    if (!slot || !slot.active) {
      return res.status(404).json({ error: "Slot not found or inactive" });
    }

    if (bet < slot.minBet || bet > slot.maxBet) {
      return res
        .status(400)
        .json({ error: "Play amount outside allowed range" });
    }

    // Check user balance (this would integrate with real wallet system)
    // For now, using mock wallet check
    const userBalance = await checkUserBalance(userId, currency);
    if (userBalance < bet) {
      return res.status(400).json({
        error: `Insufficient ${currency} balance`,
        required: bet,
        available: userBalance
      });
    }

    // Generate spin result
    const result = generateSpinResult(slot);
    const { winAmount, winLines } = calculateWin(slot, result, bet);

    // Update user wallet in real-time
    const walletUpdate = await updateUserWallet(userId, currency, -bet + winAmount);

    const spin: SlotSpin = {
      id: `spin_${Date.now()}_${Math.random()}`,
      userId,
      slotId,
      bet,
      result,
      winAmount,
      winLines,
      timestamp: new Date(),
    };

    // Add currency info to spin record
    (spin as any).currency = currency;
    (spin as any).walletUpdate = walletUpdate;

    slotSpins.push(spin);

    res.json({
      success: true,
      spin,
      walletUpdate,
      newBalance: walletUpdate.newBalance,
    });
  } catch (error) {
    console.error("Error processing slot spin:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const handleGetSlotStats: RequestHandler = (req, res) => {
  try {
    const { slotId } = req.params;

    const slot = inHouseSlots.find((s) => s.id === slotId);
    if (!slot) {
      return res.status(404).json({ error: "Slot not found" });
    }

    const slotSpinsForGame = slotSpins.filter((s) => s.slotId === slotId);

    const stats: SlotStats = {
      slotId,
      totalSpins: slotSpinsForGame.length,
      totalBet: slotSpinsForGame.reduce((sum, spin) => sum + spin.bet, 0),
      totalPayout: slotSpinsForGame.reduce(
        (sum, spin) => sum + spin.winAmount,
        0,
      ),
      rtp: 0,
      popularityScore: slotSpinsForGame.length,
      averageSession: 0,
      biggestWin: Math.max(...slotSpinsForGame.map((s) => s.winAmount), 0),
      jackpotHits: 0,
    };

    // Calculate RTP
    if (stats.totalBet > 0) {
      stats.rtp = (stats.totalPayout / stats.totalBet) * 100;
    }

    res.json(stats);
  } catch (error) {
    console.error("Error getting slot stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const handleGetAllSlotStats: RequestHandler = (req, res) => {
  try {
    const allStats = inHouseSlots.map((slot) => {
      const slotSpinsForGame = slotSpins.filter((s) => s.slotId === slot.id);

      const stats: SlotStats = {
        slotId: slot.id,
        totalSpins: slotSpinsForGame.length,
        totalBet: slotSpinsForGame.reduce((sum, spin) => sum + spin.bet, 0),
        totalPayout: slotSpinsForGame.reduce(
          (sum, spin) => sum + spin.winAmount,
          0,
        ),
        rtp: 0,
        popularityScore: slotSpinsForGame.length,
        averageSession: 0,
        biggestWin: Math.max(...slotSpinsForGame.map((s) => s.winAmount), 0),
        jackpotHits: 0,
      };

      if (stats.totalBet > 0) {
        stats.rtp = (stats.totalPayout / stats.totalBet) * 100;
      }

      return stats;
    });

    res.json(allStats);
  } catch (error) {
    console.error("Error getting all slot stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Mock wallet system (in production, this would integrate with real wallet/database)
const userWallets: Record<string, { GC: number; SC: number }> = {};

async function checkUserBalance(userId: string, currency: "GC" | "SC"): Promise<number> {
  if (!userWallets[userId]) {
    // Initialize user wallet with some demo funds
    userWallets[userId] = { GC: 10000, SC: 100 };
  }
  return userWallets[userId][currency];
}

async function updateUserWallet(
  userId: string,
  currency: "GC" | "SC",
  amount: number
): Promise<{ success: boolean; newBalance: number; gcBalance: number; scBalance: number }> {
  if (!userWallets[userId]) {
    userWallets[userId] = { GC: 10000, SC: 100 };
  }

  const currentBalance = userWallets[userId][currency];
  const newBalance = currentBalance + amount;

  if (newBalance < 0) {
    throw new Error(`Insufficient ${currency} balance`);
  }

  userWallets[userId][currency] = newBalance;

  return {
    success: true,
    newBalance,
    gcBalance: userWallets[userId].GC,
    scBalance: userWallets[userId].SC,
  };
}

// Helper functions
function generateSpinResult(slot: SlotMachine): string[][] {
  const result: string[][] = [];

  for (let row = 0; row < slot.rows; row++) {
    result[row] = [];
    for (let reel = 0; reel < slot.reels.length; reel++) {
      const reelConfig = slot.reels[reel];
      const weights = reelConfig.weight;

      // Weighted random selection
      const totalWeight = Object.values(weights).reduce(
        (sum, weight) => sum + weight,
        0,
      );
      let random = Math.random() * totalWeight;

      let selectedSymbol = reelConfig.symbols[0];
      for (const symbolId of reelConfig.symbols) {
        random -= weights[symbolId] || 1;
        if (random <= 0) {
          selectedSymbol = symbolId;
          break;
        }
      }

      result[row][reel] = selectedSymbol;
    }
  }

  return result;
}

function calculateWin(
  slot: SlotMachine,
  result: string[][],
  bet: number,
): {
  winAmount: number;
  winLines: Array<{
    paylineId: string;
    symbols: string[];
    payout: number;
  }>;
} {
  let totalWin = 0;
  const winningLines: any[] = [];

  slot.paylines.forEach((payline) => {
    if (!payline.active) return;

    const lineSymbols: string[] = [];
    payline.positions.forEach((pos) => {
      if (result[pos.row] && result[pos.row][pos.reel]) {
        lineSymbols.push(result[pos.row][pos.reel]);
      }
    });

    // Check for winning combinations
    slot.winConditions.forEach((condition) => {
      const matchingSymbols = lineSymbols.filter(
        (symbol) =>
          symbol === condition.symbolId ||
          slot.symbols
            .find((s) => s.id === symbol)
            ?.name?.toLowerCase()
            .includes("wild"),
      );

      if (matchingSymbols.length >= condition.count) {
        const winAmount = condition.payout * bet;
        totalWin += winAmount;

        winningLines.push({
          paylineId: payline.id,
          symbols: matchingSymbols,
          payout: winAmount,
        });
      }
    });
  });

  return { winAmount: totalWin, winLines: winningLines };
}
