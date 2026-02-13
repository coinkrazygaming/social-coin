/**
 * Notification Service
 * Handles all notification-related database operations
 */

import { supabase } from "../../shared/database";

export interface Notification {
  id: string;
  userId: string;
  senderId?: string;
  senderType: "system" | "admin" | "staff" | "ai_assistant" | "user";
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error" | "promotion" | "alert";
  priority: "low" | "medium" | "high" | "urgent";
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  expiresAt?: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  userId?: string;
  senderName: string;
  senderType: "user" | "admin" | "staff" | "ai_assistant" | "system";
  message: string;
  replyTo?: string;
  channel: "global" | "support" | "vip" | "admin";
  isPrivate: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
}

/**
 * Create a new notification
 */
export async function createNotification(
  notification: Omit<Notification, "id" | "createdAt">
): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .insert({
        user_id: notification.userId,
        sender_id: notification.senderId,
        sender_type: notification.senderType,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        priority: notification.priority,
        read: false,
        action_url: notification.actionUrl,
        action_label: notification.actionLabel,
        expires_at: notification.expiresAt?.toISOString(),
        metadata: notification.metadata || {},
        created_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (error) {
      console.error("Error creating notification:", error);
      return null;
    }

    return data?.id || null;
  } catch (error) {
    console.error("Exception in createNotification:", error);
    return null;
  }
}

/**
 * Send notification to a user
 */
export async function sendNotification(
  userId: string,
  title: string,
  message: string,
  type: Notification["type"] = "info",
  priority: Notification["priority"] = "medium",
  options?: {
    senderId?: string;
    senderType?: Notification["senderType"];
    actionUrl?: string;
    actionLabel?: string;
    expiresAt?: Date;
    metadata?: Record<string, any>;
  }
): Promise<string | null> {
  return createNotification({
    userId,
    senderId: options?.senderId,
    senderType: options?.senderType || "system",
    title,
    message,
    type,
    priority,
    actionUrl: options?.actionUrl,
    actionLabel: options?.actionLabel,
    expiresAt: options?.expiresAt,
    metadata: options?.metadata,
    read: false,
  });
}

/**
 * Mark notification as read
 */
export async function markAsRead(notificationId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", notificationId);

    if (error) {
      console.error("Error marking notification as read:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Exception in markAsRead:", error);
    return false;
  }
}

/**
 * Bulk mark notifications as read
 */
export async function bulkMarkAsRead(
  notificationIds: string[]
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .in("id", notificationIds);

    if (error) {
      console.error("Error bulk marking notifications as read:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Exception in bulkMarkAsRead:", error);
    return false;
  }
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllAsRead(userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", userId)
      .eq("read", false);

    if (error) {
      console.error("Error marking all notifications as read:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Exception in markAllAsRead:", error);
    return false;
  }
}

/**
 * Get notifications for a user
 */
export async function getNotifications(
  userId: string,
  limit: number = 50,
  offset: number = 0,
  unreadOnly: boolean = false
): Promise<Notification[]> {
  try {
    let query = supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (unreadOnly) {
      query = query.eq("read", false);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching notifications:", error);
      return [];
    }

    return (
      data?.map((notif) => ({
        id: notif.id,
        userId: notif.user_id,
        senderId: notif.sender_id,
        senderType: notif.sender_type,
        title: notif.title,
        message: notif.message,
        type: notif.type,
        priority: notif.priority,
        read: notif.read,
        actionUrl: notif.action_url,
        actionLabel: notif.action_label,
        expiresAt: notif.expires_at ? new Date(notif.expires_at) : undefined,
        metadata: notif.metadata,
        createdAt: new Date(notif.created_at),
      })) || []
    );
  } catch (error) {
    console.error("Exception in getNotifications:", error);
    return [];
  }
}

/**
 * Get unread notification count
 */
export async function getUnreadCount(userId: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("read", false);

    if (error) {
      console.error("Error getting unread count:", error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error("Exception in getUnreadCount:", error);
    return 0;
  }
}

/**
 * Delete expired notifications
 */
export async function deleteExpiredNotifications(): Promise<number> {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .delete()
      .lt("expires_at", new Date().toISOString())
      .select("id");

    if (error) {
      console.error("Error deleting expired notifications:", error);
      return 0;
    }

    return data?.length || 0;
  } catch (error) {
    console.error("Exception in deleteExpiredNotifications:", error);
    return 0;
  }
}

/**
 * Create a chat message
 */
export async function createChatMessage(
  message: Omit<ChatMessage, "id" | "createdAt">
): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from("chat_messages")
      .insert({
        user_id: message.userId,
        sender_name: message.senderName,
        sender_type: message.senderType,
        message: message.message,
        reply_to: message.replyTo,
        channel: message.channel,
        is_private: message.isPrivate,
        metadata: message.metadata || {},
        created_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (error) {
      console.error("Error creating chat message:", error);
      return null;
    }

    return data?.id || null;
  } catch (error) {
    console.error("Exception in createChatMessage:", error);
    return null;
  }
}

/**
 * Get chat messages for a channel
 */
export async function getChatMessages(
  channel: ChatMessage["channel"],
  limit: number = 100,
  offset: number = 0
): Promise<ChatMessage[]> {
  try {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("channel", channel)
      .eq("is_private", false)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Error fetching chat messages:", error);
      return [];
    }

    return (
      data?.map((msg) => ({
        id: msg.id,
        userId: msg.user_id,
        senderName: msg.sender_name,
        senderType: msg.sender_type,
        message: msg.message,
        replyTo: msg.reply_to,
        channel: msg.channel,
        isPrivate: msg.is_private,
        metadata: msg.metadata,
        createdAt: new Date(msg.created_at),
      })) || []
    );
  } catch (error) {
    console.error("Exception in getChatMessages:", error);
    return [];
  }
}

/**
 * Get private chat messages between two users
 */
export async function getPrivateChatMessages(
  userId1: string,
  userId2: string,
  limit: number = 100
): Promise<ChatMessage[]> {
  try {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("is_private", true)
      .or(`user_id.eq.${userId1},user_id.eq.${userId2}`)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching private chat messages:", error);
      return [];
    }

    return (
      data?.map((msg) => ({
        id: msg.id,
        userId: msg.user_id,
        senderName: msg.sender_name,
        senderType: msg.sender_type,
        message: msg.message,
        replyTo: msg.reply_to,
        channel: msg.channel,
        isPrivate: msg.is_private,
        metadata: msg.metadata,
        createdAt: new Date(msg.created_at),
      })) || []
    );
  } catch (error) {
    console.error("Exception in getPrivateChatMessages:", error);
    return [];
  }
}

/**
 * Broadcast notification to all users
 */
export async function broadcastNotification(
  title: string,
  message: string,
  type: Notification["type"] = "info",
  priority: Notification["priority"] = "medium",
  options?: {
    senderId?: string;
    senderType?: Notification["senderType"];
    actionUrl?: string;
    actionLabel?: string;
    expiresAt?: Date;
    metadata?: Record<string, any>;
  }
): Promise<number> {
  try {
    // Get all active users
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id")
      .eq("status", "active");

    if (usersError || !users) {
      console.error("Error fetching users for broadcast:", usersError);
      return 0;
    }

    // Create notifications for all users
    const notifications = users.map((user) => ({
      user_id: user.id,
      sender_id: options?.senderId,
      sender_type: options?.senderType || "system",
      title,
      message,
      type,
      priority,
      read: false,
      action_url: options?.actionUrl,
      action_label: options?.actionLabel,
      expires_at: options?.expiresAt?.toISOString(),
      metadata: options?.metadata || {},
      created_at: new Date().toISOString(),
    }));

    const { data, error } = await supabase
      .from("notifications")
      .insert(notifications)
      .select("id");

    if (error) {
      console.error("Error broadcasting notifications:", error);
      return 0;
    }

    return data?.length || 0;
  } catch (error) {
    console.error("Exception in broadcastNotification:", error);
    return 0;
  }
}
