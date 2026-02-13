/**
 * Games API Routes
 * Handles game-related endpoints
 */

import { RequestHandler } from "express";
import {
  getGameById,
  getAllGames,
  updateGame,
  getGameStats,
  calculateRTP,
  getActivePlayerCount,
  calculateTrend,
} from "../services/gameService";

/**
 * GET /api/games
 * Get all games
 */
export const handleGetAllGames: RequestHandler = async (req, res) => {
  try {
    const games = await getAllGames();
    res.json(games);
  } catch (error) {
    console.error("Error in handleGetAllGames:", error);
    res.status(500).json({ error: "Failed to fetch games" });
  }
};

/**
 * GET /api/games/:id
 * Get game by ID
 */
export const handleGetGameById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const game = await getGameById(id);

    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }

    res.json(game);
  } catch (error) {
    console.error("Error in handleGetGameById:", error);
    res.status(500).json({ error: "Failed to fetch game" });
  }
};

/**
 * PUT /api/games/:id
 * Update game
 */
export const handleUpdateGame: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const success = await updateGame(id, updates);

    if (!success) {
      return res.status(500).json({ error: "Failed to update game" });
    }

    res.json({ success: true, message: "Game updated successfully" });
  } catch (error) {
    console.error("Error in handleUpdateGame:", error);
    res.status(500).json({ error: "Failed to update game" });
  }
};

/**
 * GET /api/games/:id/stats
 * Get game statistics
 */
export const handleGetGameStats: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const days = parseInt(req.query.days as string) || 30;

    const stats = await getGameStats(id, days);

    if (!stats) {
      return res.status(404).json({ error: "Game stats not found" });
    }

    res.json(stats);
  } catch (error) {
    console.error("Error in handleGetGameStats:", error);
    res.status(500).json({ error: "Failed to fetch game stats" });
  }
};

/**
 * GET /api/games/:id/rtp
 * Get game RTP
 */
export const handleGetGameRTP: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const days = parseInt(req.query.days as string) || 30;

    const rtp = await calculateRTP(id, days);

    res.json({ gameId: id, rtp, days });
  } catch (error) {
    console.error("Error in handleGetGameRTP:", error);
    res.status(500).json({ error: "Failed to calculate RTP" });
  }
};

/**
 * GET /api/games/:id/active-players
 * Get active player count
 */
export const handleGetActivePlayerCount: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const count = await getActivePlayerCount(id);

    res.json({ gameId: id, activePlayerCount: count });
  } catch (error) {
    console.error("Error in handleGetActivePlayerCount:", error);
    res.status(500).json({ error: "Failed to get active player count" });
  }
};

/**
 * GET /api/games/:id/trend
 * Get game trend
 */
export const handleGetGameTrend: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const trend = await calculateTrend(id);

    res.json({ gameId: id, trend });
  } catch (error) {
    console.error("Error in handleGetGameTrend:", error);
    res.status(500).json({ error: "Failed to calculate trend" });
  }
};
