import { RequestHandler } from "express";
import { TickerItem } from "@shared/types";

// In-memory storage (replace with real database)
const tickerItems: Map<string, TickerItem> = new Map();

// Initialize some default ticker items
const defaultItems: TickerItem[] = [
  {
    id: "default-1",
    type: "promo",
    content: "Welcome to CoinKrazy! Get 10,000 GC + 10 SC FREE on signup!",
    priority: 1,
    createdAt: new Date(),
  },
  {
    id: "default-2",
    type: "jackpot",
    content: "MEGA JACKPOT: $50,000 SC - Play Royal Riches now!",
    priority: 2,
    createdAt: new Date(),
  },
  {
    id: "default-3",
    type: "sports",
    content: "Live Now: Lakers vs Warriors - Lakers +2.5 (-110)",
    priority: 3,
    createdAt: new Date(),
  },
];

defaultItems.forEach((item) => tickerItems.set(item.id, item));

function generateTickerId(): string {
  return "ticker_" + Math.random().toString(36).substring(2, 15);
}

// Get all ticker items
export const handleGetTickerItems: RequestHandler = (req, res) => {
  try {
    const items = Array.from(tickerItems.values())
      .sort(
        (a, b) =>
          a.priority - b.priority ||
          b.createdAt.getTime() - a.createdAt.getTime(),
      )
      .slice(0, 20); // Limit to 20 most recent/important items

    res.setHeader('Content-Type', 'application/json');
    res.json(items);
  } catch (error) {
    console.error('Error in handleGetTickerItems:', error);
    res.status(500).json({ error: 'Failed to fetch ticker items' });
  }
};

// Add ticker item
export const handleAddTickerItem: RequestHandler = (req, res) => {
  const { type, content, userId, amount, gameType, priority } = req.body;

  const tickerItem: TickerItem = {
    id: generateTickerId(),
    type: type || "win",
    content,
    userId,
    amount,
    gameType,
    priority: priority || 5,
    createdAt: new Date(),
  };

  tickerItems.set(tickerItem.id, tickerItem);

  // Remove oldest items if we have too many (keep max 50)
  const allItems = Array.from(tickerItems.values());
  if (allItems.length > 50) {
    const sorted = allItems.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
    const toRemove = sorted.slice(50);
    toRemove.forEach((item) => tickerItems.delete(item.id));
  }

  res.json(tickerItem);
};

// Delete ticker item (admin only)
export const handleDeleteTickerItem: RequestHandler = (req, res) => {
  const itemId = req.params.itemId;
  const success = tickerItems.delete(itemId);

  if (!success) {
    return res.status(404).json({ error: "Ticker item not found" });
  }

  res.json({ success: true });
};

// Add mini game win to ticker
export const handleAddMiniGameWin: RequestHandler = (req, res) => {
  const { userId, username, gameType, score, maxScore, scEarned } = req.body;

  if (scEarned > 0) {
    const content = `🏀 ${username} scored ${score}/${maxScore} in ${gameType} and earned ${scEarned} SC!`;

    const tickerItem: TickerItem = {
      id: generateTickerId(),
      type: "mini-game",
      content,
      userId,
      amount: scEarned,
      gameType,
      priority: 4,
      createdAt: new Date(),
    };

    tickerItems.set(tickerItem.id, tickerItem);
    res.json(tickerItem);
  } else {
    res.json({ message: "No ticker item created for zero earnings" });
  }
};
