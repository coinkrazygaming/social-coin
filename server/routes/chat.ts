/**
 * Chat API Routes
 * Handles chat message endpoints
 */

import { RequestHandler } from "express";
import {
  createChatMessage,
  getChatMessages,
  getPrivateChatMessages,
} from "../services/notificationService";

/**
 * GET /api/chat/messages
 * Get chat messages for a channel
 */
export const handleGetChatMessages: RequestHandler = async (req, res) => {
  try {
    const channel = (req.query.channel as any) || "global";
    const limit = parseInt(req.query.limit as string) || 100;
    const offset = parseInt(req.query.offset as string) || 0;

    const messages = await getChatMessages(channel, limit, offset);
    res.json(messages);
  } catch (error) {
    console.error("Error in handleGetChatMessages:", error);
    res.status(500).json({ error: "Failed to fetch chat messages" });
  }
};

/**
 * POST /api/chat/messages
 * Create a new chat message
 */
export const handleCreateChatMessage: RequestHandler = async (req, res) => {
  try {
    const messageData = req.body;

    const messageId = await createChatMessage(messageData);

    if (!messageId) {
      return res.status(500).json({ error: "Failed to create chat message" });
    }

    res.json({ success: true, messageId });
  } catch (error) {
    console.error("Error in handleCreateChatMessage:", error);
    res.status(500).json({ error: "Failed to create chat message" });
  }
};

/**
 * GET /api/chat/private/:userId
 * Get private chat messages between two users
 */
export const handleGetPrivateChatMessages: RequestHandler = async (
  req,
  res
) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.query.currentUserId as string;
    const limit = parseInt(req.query.limit as string) || 100;

    if (!currentUserId) {
      return res.status(400).json({ error: "Current user ID required" });
    }

    const messages = await getPrivateChatMessages(
      currentUserId,
      userId,
      limit
    );
    res.json(messages);
  } catch (error) {
    console.error("Error in handleGetPrivateChatMessages:", error);
    res.status(500).json({ error: "Failed to fetch private chat messages" });
  }
};
