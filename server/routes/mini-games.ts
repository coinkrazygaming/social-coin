import { RequestHandler } from "express";
import { MiniGameResult, MiniGameConfig, CooldownInfo } from "@shared/miniGameTypes";

// In-memory storage for demo purposes
// In production, this would be stored in a database
let miniGameResults: MiniGameResult[] = [];
let userCooldowns: Record<string, Record<string, Date>> = {};

const COOLDOWN_HOURS = 24;

export const handleMiniGamePlay: RequestHandler = (req, res) => {
  try {
    const { userId, gameType, score, maxScore, duration } = req.body;

    if (!userId || !gameType || score === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check cooldown
    const userGameCooldowns = userCooldowns[userId] || {};
    const lastPlayed = userGameCooldowns[gameType];
    
    if (lastPlayed) {
      const timeSinceLastPlay = Date.now() - lastPlayed.getTime();
      const hoursElapsed = timeSinceLastPlay / (1000 * 60 * 60);
      
      if (hoursElapsed < COOLDOWN_HOURS) {
        return res.status(429).json({ 
          error: "Game still on cooldown",
          hoursRemaining: COOLDOWN_HOURS - hoursElapsed
        });
      }
    }

    // Calculate SC earned based on game type and score
    let scEarned = 0;
    switch (gameType) {
      case "colin-shots":
        scEarned = Math.min(0.25, (score / (maxScore || 25)) * 0.25);
        break;
      case "joseys-quack-attack":
        scEarned = Math.min(0.25, score * 0.01);
        break;
      case "beths-darts":
        scEarned = Math.min(0.25, score * 0.01); // This would be calculated differently based on dart game logic
        break;
      case "coreys-fast-blocks":
        scEarned = Math.min(0.25, score * 0.01);
        break;
      case "coreys-fast-jewels":
        scEarned = Math.min(0.25, score * 0.01);
        break;
      case "brens-meow":
        scEarned = Math.min(0.25, score * 0.01);
        break;
      default:
        scEarned = Math.min(0.25, score * 0.01);
    }

    // Record the result
    const result: MiniGameResult = {
      userId,
      gameId: gameType,
      score,
      maxScore: maxScore || 100,
      scEarned: Math.round(scEarned * 100) / 100,
      timestamp: new Date(),
      approved: false, // Requires admin approval
    };

    miniGameResults.push(result);

    // Set cooldown
    if (!userCooldowns[userId]) {
      userCooldowns[userId] = {};
    }
    userCooldowns[userId][gameType] = new Date();

    res.json({
      success: true,
      scEarned: result.scEarned,
      nextPlayAvailable: new Date(Date.now() + COOLDOWN_HOURS * 60 * 60 * 1000),
    });

  } catch (error) {
    console.error("Error recording mini game play:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const handleCheckCooldown: RequestHandler = (req, res) => {
  try {
    const { userId, gameId } = req.params;

    if (!userId || !gameId) {
      return res.status(400).json({ error: "Missing userId or gameId" });
    }

    const userGameCooldowns = userCooldowns[userId] || {};
    const lastPlayed = userGameCooldowns[gameId];

    if (!lastPlayed) {
      return res.json({
        canPlay: true,
        nextAvailable: null,
        hoursRemaining: 0,
      });
    }

    const timeSinceLastPlay = Date.now() - lastPlayed.getTime();
    const hoursElapsed = timeSinceLastPlay / (1000 * 60 * 60);
    const hoursRemaining = Math.max(0, COOLDOWN_HOURS - hoursElapsed);

    const cooldownInfo: CooldownInfo = {
      canPlay: hoursElapsed >= COOLDOWN_HOURS,
      nextAvailable: hoursElapsed >= COOLDOWN_HOURS ? null : new Date(lastPlayed.getTime() + COOLDOWN_HOURS * 60 * 60 * 1000),
      hoursRemaining,
    };

    res.json(cooldownInfo);

  } catch (error) {
    console.error("Error checking cooldown:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const handleGetMiniGameResults: RequestHandler = (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    const userResults = miniGameResults.filter(result => result.userId === userId);
    res.json(userResults);

  } catch (error) {
    console.error("Error getting mini game results:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const handleGetAllMiniGameResults: RequestHandler = (req, res) => {
  try {
    // Return all results for admin panel
    res.json(miniGameResults);

  } catch (error) {
    console.error("Error getting all mini game results:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const handleApprovePayout: RequestHandler = (req, res) => {
  try {
    const { resultId } = req.params;
    const { approved } = req.body;

    const resultIndex = miniGameResults.findIndex(result => 
      result.timestamp.getTime().toString() === resultId
    );

    if (resultIndex === -1) {
      return res.status(404).json({ error: "Result not found" });
    }

    miniGameResults[resultIndex].approved = approved;

    res.json({
      success: true,
      result: miniGameResults[resultIndex],
    });

  } catch (error) {
    console.error("Error approving payout:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const handleGetMiniGameStats: RequestHandler = (req, res) => {
  try {
    const stats = {
      totalPlays: miniGameResults.length,
      totalScPaid: miniGameResults
        .filter(r => r.approved)
        .reduce((sum, r) => sum + r.scEarned, 0),
      pendingPayouts: miniGameResults
        .filter(r => !r.approved)
        .reduce((sum, r) => sum + r.scEarned, 0),
      gameBreakdown: {} as Record<string, any>,
    };

    // Calculate per-game statistics
    const gameIds = [...new Set(miniGameResults.map(r => r.gameId))];
    gameIds.forEach(gameId => {
      const gameResults = miniGameResults.filter(r => r.gameId === gameId);
      stats.gameBreakdown[gameId] = {
        totalPlays: gameResults.length,
        averageScore: gameResults.reduce((sum, r) => sum + r.score, 0) / gameResults.length || 0,
        topScore: Math.max(...gameResults.map(r => r.score), 0),
        totalScPaid: gameResults
          .filter(r => r.approved)
          .reduce((sum, r) => sum + r.scEarned, 0),
      };
    });

    res.json(stats);

  } catch (error) {
    console.error("Error getting mini game stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
