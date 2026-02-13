/**
 * Security Service
 * Handles security monitoring, suspicious activity detection, and admin alerts
 */

import { supabase } from "../../shared/database";
import type { SpinLog } from "../../shared/spinLogger";
import { sendNotification } from "./notificationService";

export interface AdminAlert {
  id: string;
  type:
    | "approval_needed"
    | "security_alert"
    | "system_issue"
    | "financial_alert"
    | "user_report";
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "pending" | "in_progress" | "resolved" | "dismissed";
  assignedTo?: string;
  relatedUserId?: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface SuspiciousActivity {
  userId: string;
  activityType: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  metadata: Record<string, any>;
}

/**
 * Detect suspicious activity from spin log
 */
export async function detectSuspiciousActivity(
  log: SpinLog
): Promise<boolean> {
  const suspiciousPatterns: SuspiciousActivity[] = [];

  // Pattern 1: Extremely high win multiplier (> 100x)
  if (log.multiplier > 100) {
    suspiciousPatterns.push({
      userId: log.userId,
      activityType: "high_multiplier_win",
      severity: "high",
      description: `Unusually high win multiplier: ${log.multiplier}x`,
      metadata: {
        gameId: log.gameId,
        sessionId: log.sessionId,
        multiplier: log.multiplier,
        winAmount: log.winAmount,
      },
    });
  }

  // Pattern 2: Win amount significantly higher than bet (> 1000x)
  if (log.winAmount > log.betAmount * 1000) {
    suspiciousPatterns.push({
      userId: log.userId,
      activityType: "extreme_win_amount",
      severity: "critical",
      description: `Win amount ${log.winAmount} is ${Math.round(log.winAmount / log.betAmount)}x the bet amount`,
      metadata: {
        gameId: log.gameId,
        betAmount: log.betAmount,
        winAmount: log.winAmount,
        ratio: log.winAmount / log.betAmount,
      },
    });
  }

  // Pattern 3: Jackpot win
  if (log.isJackpot) {
    suspiciousPatterns.push({
      userId: log.userId,
      activityType: "jackpot_win",
      severity: "medium",
      description: `Jackpot won: ${log.winAmount} ${log.currency}`,
      metadata: {
        gameId: log.gameId,
        winAmount: log.winAmount,
        currency: log.currency,
      },
    });
  }

  // Pattern 4: Check for rapid consecutive wins
  const recentWins = await getRecentWins(log.userId, 10);
  const consecutiveWins = recentWins.filter((w) => w.winAmount > 0).length;
  if (consecutiveWins >= 8) {
    suspiciousPatterns.push({
      userId: log.userId,
      activityType: "consecutive_wins",
      severity: "high",
      description: `${consecutiveWins} consecutive wins detected`,
      metadata: {
        consecutiveWins,
        recentSpins: recentWins.length,
      },
    });
  }

  // Flag suspicious activities
  for (const pattern of suspiciousPatterns) {
    await flagSuspiciousActivity(pattern);
  }

  return suspiciousPatterns.length > 0;
}

/**
 * Get recent wins for a user
 */
async function getRecentWins(
  userId: string,
  limit: number
): Promise<SpinLog[]> {
  try {
    const { data, error } = await supabase
      .from("spin_logs")
      .select("*")
      .eq("user_id", userId)
      .order("timestamp", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching recent wins:", error);
      return [];
    }

    return (
      data?.map((log) => ({
        id: log.id,
        userId: log.user_id,
        gameId: log.game_id,
        sessionId: log.session_id,
        betAmount: parseFloat(log.bet_amount),
        winAmount: parseFloat(log.win_amount),
        currency: log.currency,
        result: log.result,
        multiplier: parseFloat(log.multiplier),
        isBonus: log.is_bonus,
        isJackpot: log.is_jackpot,
        rtpContribution: parseFloat(log.rtp_contribution),
        timestamp: new Date(log.timestamp),
        deviceType: log.device_type,
      })) || []
    );
  } catch (error) {
    console.error("Exception in getRecentWins:", error);
    return [];
  }
}

/**
 * Flag suspicious activity and create admin alert
 */
export async function flagSuspiciousActivity(
  activity: SuspiciousActivity
): Promise<boolean> {
  try {
    // Create admin alert
    const alertId = await createAdminAlert({
      type: "security_alert",
      title: `Suspicious Activity: ${activity.activityType}`,
      description: activity.description,
      priority: activity.severity === "critical" ? "urgent" : activity.severity,
      status: "pending",
      relatedUserId: activity.userId,
      relatedEntityType: "user_activity",
      metadata: activity.metadata,
    });

    if (!alertId) {
      console.error("Failed to create admin alert for suspicious activity");
      return false;
    }

    // Notify all admins
    await notifyAdmins(
      `Suspicious Activity Detected`,
      activity.description,
      "warning",
      activity.severity === "critical" ? "urgent" : "high",
      {
        actionUrl: `/admin/security/alerts/${alertId}`,
        actionLabel: "Review Alert",
        metadata: activity.metadata,
      }
    );

    return true;
  } catch (error) {
    console.error("Exception in flagSuspiciousActivity:", error);
    return false;
  }
}

/**
 * Create an admin alert
 */
export async function createAdminAlert(
  alert: Omit<AdminAlert, "id" | "createdAt" | "updatedAt">
): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from("admin_alerts")
      .insert({
        type: alert.type,
        title: alert.title,
        description: alert.description,
        priority: alert.priority,
        status: alert.status,
        assigned_to: alert.assignedTo,
        related_user_id: alert.relatedUserId,
        related_entity_type: alert.relatedEntityType,
        related_entity_id: alert.relatedEntityId,
        metadata: alert.metadata || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (error) {
      console.error("Error creating admin alert:", error);
      return null;
    }

    return data?.id || null;
  } catch (error) {
    console.error("Exception in createAdminAlert:", error);
    return null;
  }
}

/**
 * Notify all admins
 */
export async function notifyAdmins(
  title: string,
  message: string,
  type: "info" | "success" | "warning" | "error" = "info",
  priority: "low" | "medium" | "high" | "urgent" = "medium",
  options?: {
    actionUrl?: string;
    actionLabel?: string;
    metadata?: Record<string, any>;
  }
): Promise<number> {
  try {
    // Get all admin users
    const { data: admins, error } = await supabase
      .from("users")
      .select("id")
      .in("role", ["admin", "staff"])
      .eq("status", "active");

    if (error || !admins) {
      console.error("Error fetching admins:", error);
      return 0;
    }

    let notificationCount = 0;

    // Send notification to each admin
    for (const admin of admins) {
      const notifId = await sendNotification(
        admin.id,
        title,
        message,
        type,
        priority,
        {
          senderType: "system",
          actionUrl: options?.actionUrl,
          actionLabel: options?.actionLabel,
          metadata: options?.metadata,
        }
      );

      if (notifId) {
        notificationCount++;
      }
    }

    return notificationCount;
  } catch (error) {
    console.error("Exception in notifyAdmins:", error);
    return 0;
  }
}

/**
 * Notify admins of a big win
 */
export async function notifyAdminOfBigWin(log: SpinLog): Promise<boolean> {
  try {
    const title = `🎰 Big Win Alert!`;
    const message = `Player won ${log.winAmount} ${log.currency} (${log.multiplier}x multiplier) on game ${log.gameId}`;

    await notifyAdmins(title, message, "success", "medium", {
      actionUrl: `/admin/analytics/spins/${log.id}`,
      actionLabel: "View Spin Details",
      metadata: {
        spinId: log.id,
        userId: log.userId,
        gameId: log.gameId,
        winAmount: log.winAmount,
        multiplier: log.multiplier,
      },
    });

    return true;
  } catch (error) {
    console.error("Exception in notifyAdminOfBigWin:", error);
    return false;
  }
}

/**
 * Get admin alerts
 */
export async function getAdminAlerts(
  status?: AdminAlert["status"],
  limit: number = 50,
  offset: number = 0
): Promise<AdminAlert[]> {
  try {
    let query = supabase
      .from("admin_alerts")
      .select("*")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching admin alerts:", error);
      return [];
    }

    return (
      data?.map((alert) => ({
        id: alert.id,
        type: alert.type,
        title: alert.title,
        description: alert.description,
        priority: alert.priority,
        status: alert.status,
        assignedTo: alert.assigned_to,
        relatedUserId: alert.related_user_id,
        relatedEntityType: alert.related_entity_type,
        relatedEntityId: alert.related_entity_id,
        metadata: alert.metadata,
        createdAt: new Date(alert.created_at),
        updatedAt: new Date(alert.updated_at),
      })) || []
    );
  } catch (error) {
    console.error("Exception in getAdminAlerts:", error);
    return [];
  }
}

/**
 * Update admin alert status
 */
export async function updateAdminAlert(
  alertId: string,
  updates: Partial<Pick<AdminAlert, "status" | "assignedTo">>
): Promise<boolean> {
  try {
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (updates.status) updateData.status = updates.status;
    if (updates.assignedTo) updateData.assigned_to = updates.assignedTo;

    const { error } = await supabase
      .from("admin_alerts")
      .update(updateData)
      .eq("id", alertId);

    if (error) {
      console.error("Error updating admin alert:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Exception in updateAdminAlert:", error);
    return false;
  }
}

/**
 * Check for error rate threshold
 */
export async function checkErrorRate(
  gameId: string,
  threshold: number = 5
): Promise<boolean> {
  try {
    // Check error rate in the last hour
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);

    const { data, error } = await supabase
      .from("game_errors")
      .select("id", { count: "exact" })
      .eq("game_id", gameId)
      .gte("created_at", oneHourAgo.toISOString());

    if (error) {
      console.error("Error checking error rate:", error);
      return false;
    }

    const errorCount = data?.length || 0;
    const errorRate = errorCount;

    if (errorRate >= threshold) {
      await createAdminAlert({
        type: "system_issue",
        title: `High Error Rate Detected`,
        description: `Game ${gameId} has ${errorCount} errors in the last hour`,
        priority: errorRate >= threshold * 2 ? "urgent" : "high",
        status: "pending",
        relatedEntityType: "game",
        relatedEntityId: gameId,
        metadata: { errorCount, threshold, timeWindow: "1 hour" },
      });

      return true;
    }

    return false;
  } catch (error) {
    console.error("Exception in checkErrorRate:", error);
    return false;
  }
}
