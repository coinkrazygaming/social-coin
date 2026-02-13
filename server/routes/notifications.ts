/**
 * Notifications API Routes
 * Handles notification endpoints
 */

import { RequestHandler } from "express";
import {
  createNotification,
  getNotifications,
  markAsRead,
  bulkMarkAsRead,
  markAllAsRead,
  getUnreadCount,
  broadcastNotification,
} from "../services/notificationService";

/**
 * GET /api/notifications
 * Get notifications for a user
 */
export const handleGetNotifications: RequestHandler = async (req, res) => {
  try {
    const userId = req.query.userId as string;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;
    const unreadOnly = req.query.unreadOnly === "true";

    if (!userId) {
      return res.status(400).json({ error: "User ID required" });
    }

    const notifications = await getNotifications(
      userId,
      limit,
      offset,
      unreadOnly
    );
    res.json(notifications);
  } catch (error) {
    console.error("Error in handleGetNotifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

/**
 * POST /api/notifications
 * Create a new notification
 */
export const handleCreateNotification: RequestHandler = async (req, res) => {
  try {
    const notificationData = req.body;

    const notificationId = await createNotification(notificationData);

    if (!notificationId) {
      return res
        .status(500)
        .json({ error: "Failed to create notification" });
    }

    res.json({ success: true, notificationId });
  } catch (error) {
    console.error("Error in handleCreateNotification:", error);
    res.status(500).json({ error: "Failed to create notification" });
  }
};

/**
 * POST /api/notifications/:id/read
 * Mark notification as read
 */
export const handleMarkAsRead: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const success = await markAsRead(id);

    if (!success) {
      return res
        .status(500)
        .json({ error: "Failed to mark notification as read" });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Error in handleMarkAsRead:", error);
    res.status(500).json({ error: "Failed to mark notification as read" });
  }
};

/**
 * POST /api/notifications/mark-all-read
 * Mark all notifications as read for a user
 */
export const handleMarkAllAsRead: RequestHandler = async (req, res) => {
  try {
    const { userId, notificationIds } = req.body;

    let success = false;

    if (notificationIds && Array.isArray(notificationIds)) {
      // Bulk mark specific notifications as read
      success = await bulkMarkAsRead(notificationIds);
    } else if (userId) {
      // Mark all notifications as read for user
      success = await markAllAsRead(userId);
    } else {
      return res
        .status(400)
        .json({ error: "User ID or notification IDs required" });
    }

    if (!success) {
      return res
        .status(500)
        .json({ error: "Failed to mark notifications as read" });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Error in handleMarkAllAsRead:", error);
    res.status(500).json({ error: "Failed to mark notifications as read" });
  }
};

/**
 * GET /api/notifications/unread-count
 * Get unread notification count
 */
export const handleGetUnreadCount: RequestHandler = async (req, res) => {
  try {
    const userId = req.query.userId as string;

    if (!userId) {
      return res.status(400).json({ error: "User ID required" });
    }

    const count = await getUnreadCount(userId);
    res.json({ userId, unreadCount: count });
  } catch (error) {
    console.error("Error in handleGetUnreadCount:", error);
    res.status(500).json({ error: "Failed to get unread count" });
  }
};

/**
 * POST /api/notifications/broadcast
 * Broadcast notification to all users (admin only)
 */
export const handleBroadcastNotification: RequestHandler = async (
  req,
  res
) => {
  try {
    const { title, message, type, priority, options } = req.body;

    if (!title || !message) {
      return res.status(400).json({ error: "Title and message required" });
    }

    const count = await broadcastNotification(
      title,
      message,
      type,
      priority,
      options
    );

    res.json({
      success: true,
      message: `Notification sent to ${count} users`,
      count,
    });
  } catch (error) {
    console.error("Error in handleBroadcastNotification:", error);
    res.status(500).json({ error: "Failed to broadcast notification" });
  }
};
