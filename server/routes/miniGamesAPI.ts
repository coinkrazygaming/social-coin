import { RequestHandler } from "express";
import { z } from "zod";

// Enhanced interfaces for comprehensive mini-games platform
interface GameSession {
  id: string;
  userId: string;
  gameId: string;
  score: number;
  maxScore: number;
  scEarned: number;
  duration: number;
  accuracy: number;
  playedAt: Date;
  ipAddress: string;
  userAgent: string;
  sessionData: any;
  validated: boolean;
  flagged: boolean;
  flagReason?: string;
}

interface CooldownData {
  userId: string;
  gameId: string;
  lastPlayed: Date;
  nextAvailable: Date;
  attemptsToday: number;
  streakDays: number;
}

interface SecurityEvent {
  id: string;
  userId: string;
  type: 'unusual_pattern' | 'multiple_attempts' | 'suspicious_score' | 'timing_anomaly' | 'location_change';
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: string;
  timestamp: Date;
  ipAddress: string;
  gameId?: string;
  actionTaken: string;
  reviewStatus: 'pending' | 'approved' | 'denied' | 'investigating';
  aiConfidence: number;
  relatedEvents: string[];
}

interface AIAnalysis {
  userId: string;
  gameId: string;
  riskScore: number;
  anomalies: string[];
  recommendations: string[];
  confidence: number;
  analysis: string;
  comparedToAverage: boolean;
  userHistory: any[];
}

// In-memory storage (replace with real database)
const gameSessions: Map<string, GameSession> = new Map();
const cooldowns: Map<string, CooldownData> = new Map();
const securityEvents: Map<string, SecurityEvent> = new Map();
const userGameStats: Map<string, any> = new Map();

// Validation schemas
const gameSessionSchema = z.object({
  userId: z.string(),
  gameId: z.string(),
  score: z.number().min(0),
  maxScore: z.number().min(1),
  duration: z.number().min(0),
  sessionData: z.any().optional(),
});

const cooldownCheckSchema = z.object({
  userId: z.string(),
  gameId: z.string(),
});

// Helper functions
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

function generateEventId(): string {
  return `event_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

function analyzeGameSession(session: GameSession, userHistory: GameSession[]): AIAnalysis {
  const gameHistory = userHistory.filter(h => h.gameId === session.gameId);
  const allUserSessions = userHistory.length;
  
  let riskScore = 0;
  const anomalies: string[] = [];
  const recommendations: string[] = [];

  // Analyze score patterns
  if (gameHistory.length > 0) {
    const avgScore = gameHistory.reduce((sum, h) => sum + (h.score / h.maxScore), 0) / gameHistory.length;
    const currentPerformance = session.score / session.maxScore;
    
    // Sudden improvement detection
    if (currentPerformance > 0.95 && avgScore < 0.5) {
      riskScore += 40;
      anomalies.push('Sudden dramatic performance improvement');
      recommendations.push('Review gameplay video if available');
    }
    
    // Consistency check
    const variance = gameHistory.reduce((sum, h) => Math.pow((h.score / h.maxScore) - avgScore, 2), 0) / gameHistory.length;
    if (variance < 0.01 && gameHistory.length > 5) {
      riskScore += 30;
      anomalies.push('Unusually consistent performance');
      recommendations.push('Monitor for automation tools');
    }
  }

  // Timing analysis
  if (session.duration < 30) {
    riskScore += 50;
    anomalies.push('Game completed too quickly');
    recommendations.push('Investigate for speed hacks or automation');
  }

  if (session.duration > 120) {
    riskScore += 20;
    anomalies.push('Game took unusually long');
    recommendations.push('Check for interruptions or manipulation');
  }

  // IP and device analysis
  const recentSessions = userHistory.filter(h => 
    new Date().getTime() - h.playedAt.getTime() < 24 * 60 * 60 * 1000
  );
  
  const uniqueIPs = new Set(recentSessions.map(s => s.ipAddress));
  if (uniqueIPs.size > 3) {
    riskScore += 25;
    anomalies.push('Multiple IP addresses in 24 hours');
    recommendations.push('Verify location and device consistency');
  }

  // Session frequency analysis
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todaySessions = userHistory.filter(h => h.playedAt >= today);
  
  if (todaySessions.length > 10) {
    riskScore += 35;
    anomalies.push('Excessive gaming activity today');
    recommendations.push('Check for multiple account violations');
  }

  return {
    userId: session.userId,
    gameId: session.gameId,
    riskScore: Math.min(100, riskScore),
    anomalies,
    recommendations,
    confidence: Math.min(95, riskScore * 0.8 + 20),
    analysis: `Risk analysis completed. ${anomalies.length} anomalies detected.`,
    comparedToAverage: gameHistory.length > 0,
    userHistory: gameHistory.slice(-10)
  };
}

function createSecurityEvent(analysis: AIAnalysis, session: GameSession): SecurityEvent | null {
  if (analysis.riskScore < 30) return null;

  let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
  let type: SecurityEvent['type'] = 'unusual_pattern';

  if (analysis.riskScore >= 80) {
    severity = 'critical';
    type = 'suspicious_score';
  } else if (analysis.riskScore >= 60) {
    severity = 'high';
    type = 'timing_anomaly';
  } else if (analysis.riskScore >= 40) {
    severity = 'medium';
    type = 'unusual_pattern';
  }

  return {
    id: generateEventId(),
    userId: session.userId,
    type,
    severity,
    details: `Risk score: ${analysis.riskScore}%. Anomalies: ${analysis.anomalies.join(', ')}`,
    timestamp: new Date(),
    ipAddress: session.ipAddress,
    gameId: session.gameId,
    actionTaken: severity === 'critical' ? 'session_flagged' : 'logged_for_review',
    reviewStatus: 'pending',
    aiConfidence: analysis.confidence,
    relatedEvents: []
  };
}

// API Routes

// Check game cooldown
export const handleCheckGameCooldown: RequestHandler = (req, res) => {
  try {
    const { userId, gameId } = req.params;
    const cooldownKey = `${userId}_${gameId}`;
    const cooldown = cooldowns.get(cooldownKey);
    
    if (!cooldown) {
      return res.json({ 
        canPlay: true, 
        nextAvailable: null,
        timeRemaining: 0,
        attemptsToday: 0
      });
    }
    
    const now = new Date();
    const canPlay = now >= cooldown.nextAvailable;
    const timeRemaining = canPlay ? 0 : cooldown.nextAvailable.getTime() - now.getTime();
    
    res.json({
      canPlay,
      nextAvailable: cooldown.nextAvailable,
      timeRemaining,
      attemptsToday: cooldown.attemptsToday,
      streakDays: cooldown.streakDays
    });
  } catch (error) {
    console.error('Error checking cooldown:', error);
    res.status(500).json({ error: 'Failed to check cooldown' });
  }
};

// Submit game session
export const handleSubmitGameSession: RequestHandler = (req, res) => {
  try {
    const sessionData = gameSessionSchema.parse(req.body);
    const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';
    const userAgent = req.get('User-Agent') || 'unknown';
    
    // Check cooldown first
    const cooldownKey = `${sessionData.userId}_${sessionData.gameId}`;
    const cooldown = cooldowns.get(cooldownKey);
    
    if (cooldown && new Date() < cooldown.nextAvailable) {
      return res.status(400).json({ 
        error: 'Game is on cooldown',
        nextAvailable: cooldown.nextAvailable 
      });
    }
    
    // Calculate SC earned (max 0.25 SC per game)
    const scorePercentage = sessionData.score / sessionData.maxScore;
    const scEarned = Math.min(0.25, Math.round(scorePercentage * 0.25 * 100) / 100);
    
    // Create game session
    const session: GameSession = {
      id: generateSessionId(),
      userId: sessionData.userId,
      gameId: sessionData.gameId,
      score: sessionData.score,
      maxScore: sessionData.maxScore,
      scEarned,
      duration: sessionData.duration,
      accuracy: scorePercentage,
      playedAt: new Date(),
      ipAddress,
      userAgent,
      sessionData: sessionData.sessionData || {},
      validated: false,
      flagged: false
    };
    
    // Get user's game history for analysis
    const userHistory = Array.from(gameSessions.values()).filter(s => s.userId === sessionData.userId);
    
    // Perform AI analysis
    const analysis = analyzeGameSession(session, userHistory);
    
    // Create security event if necessary
    const securityEvent = createSecurityEvent(analysis, session);
    if (securityEvent) {
      securityEvents.set(securityEvent.id, securityEvent);
      session.flagged = true;
      session.flagReason = securityEvent.details;
      
      // If critical, invalidate the session
      if (securityEvent.severity === 'critical') {
        session.validated = false;
        session.scEarned = 0;
      }
    } else {
      session.validated = true;
    }
    
    // Store session
    gameSessions.set(session.id, session);
    
    // Update cooldown
    const newCooldown: CooldownData = {
      userId: sessionData.userId,
      gameId: sessionData.gameId,
      lastPlayed: new Date(),
      nextAvailable: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      attemptsToday: (cooldown?.attemptsToday || 0) + 1,
      streakDays: cooldown ? cooldown.streakDays + 1 : 1
    };
    cooldowns.set(cooldownKey, newCooldown);
    
    // Update user stats
    const userStats = userGameStats.get(sessionData.userId) || {
      totalGames: 0,
      totalScore: 0,
      totalSC: 0,
      averageAccuracy: 0,
      favoriteGame: null,
      lastPlayed: null
    };
    
    userStats.totalGames++;
    userStats.totalScore += sessionData.score;
    userStats.totalSC += session.scEarned;
    userStats.averageAccuracy = (userStats.averageAccuracy * (userStats.totalGames - 1) + scorePercentage) / userStats.totalGames;
    userStats.lastPlayed = new Date();
    userGameStats.set(sessionData.userId, userStats);
    
    // Log to AI Employee Agent
    logToAIEmployee('mini_games', {
      type: 'game_session_complete',
      session,
      analysis,
      securityEvent,
      userStats
    });
    
    res.json({
      success: true,
      sessionId: session.id,
      scEarned: session.scEarned,
      validated: session.validated,
      flagged: session.flagged,
      analysis: session.flagged ? analysis : undefined,
      cooldown: newCooldown
    });
    
  } catch (error) {
    console.error('Error submitting game session:', error);
    res.status(400).json({ error: 'Invalid session data' });
  }
};

// Get user game history
export const handleGetUserGameHistory: RequestHandler = (req, res) => {
  try {
    const { userId } = req.params;
    const { gameId, limit = 50 } = req.query;
    
    let userSessions = Array.from(gameSessions.values())
      .filter(s => s.userId === userId)
      .sort((a, b) => b.playedAt.getTime() - a.playedAt.getTime());
    
    if (gameId) {
      userSessions = userSessions.filter(s => s.gameId === gameId);
    }
    
    userSessions = userSessions.slice(0, Number(limit));
    
    res.json(userSessions);
  } catch (error) {
    console.error('Error getting user game history:', error);
    res.status(500).json({ error: 'Failed to get game history' });
  }
};

// Get user cooldowns
export const handleGetUserCooldowns: RequestHandler = (req, res) => {
  try {
    const { userId } = req.params;
    
    const userCooldowns = Array.from(cooldowns.values())
      .filter(c => c.userId === userId);
    
    res.json(userCooldowns);
  } catch (error) {
    console.error('Error getting user cooldowns:', error);
    res.status(500).json({ error: 'Failed to get cooldowns' });
  }
};

// Get security events (admin only)
export const handleGetSecurityEvents: RequestHandler = (req, res) => {
  try {
    const { severity, status, userId } = req.query;
    
    let events = Array.from(securityEvents.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    if (severity) {
      events = events.filter(e => e.severity === severity);
    }
    
    if (status) {
      events = events.filter(e => e.reviewStatus === status);
    }
    
    if (userId) {
      events = events.filter(e => e.userId === userId);
    }
    
    res.json(events);
  } catch (error) {
    console.error('Error getting security events:', error);
    res.status(500).json({ error: 'Failed to get security events' });
  }
};

// Update security event status (admin only)
export const handleUpdateSecurityEvent: RequestHandler = (req, res) => {
  try {
    const { eventId } = req.params;
    const { status, adminNotes, adminId } = req.body;
    
    const event = securityEvents.get(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Security event not found' });
    }
    
    event.reviewStatus = status;
    securityEvents.set(eventId, event);
    
    // Log admin action
    logToAIEmployee('security', {
      type: 'security_event_reviewed',
      eventId,
      status,
      adminId,
      adminNotes
    });
    
    res.json({ success: true, event });
  } catch (error) {
    console.error('Error updating security event:', error);
    res.status(500).json({ error: 'Failed to update security event' });
  }
};

// Get game analytics (admin only)
export const handleGetGameAnalytics: RequestHandler = (req, res) => {
  try {
    const { gameId, timeframe = '7d' } = req.query;
    
    const now = new Date();
    let startDate = new Date();
    
    switch (timeframe) {
      case '1d':
        startDate.setDate(now.getDate() - 1);
        break;
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }
    
    let sessions = Array.from(gameSessions.values())
      .filter(s => s.playedAt >= startDate);
    
    if (gameId) {
      sessions = sessions.filter(s => s.gameId === gameId);
    }
    
    const analytics = {
      totalSessions: sessions.length,
      totalPlayers: new Set(sessions.map(s => s.userId)).size,
      totalSCEarned: sessions.reduce((sum, s) => sum + s.scEarned, 0),
      averageScore: sessions.length > 0 ? sessions.reduce((sum, s) => sum + s.score, 0) / sessions.length : 0,
      averageDuration: sessions.length > 0 ? sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length : 0,
      flaggedSessions: sessions.filter(s => s.flagged).length,
      topPerformers: sessions
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)
        .map(s => ({ userId: s.userId, score: s.score, gameId: s.gameId })),
      gameBreakdown: {}
    };
    
    // Game breakdown
    const gameStats = new Map();
    sessions.forEach(session => {
      const gameId = session.gameId;
      if (!gameStats.has(gameId)) {
        gameStats.set(gameId, {
          sessions: 0,
          totalScore: 0,
          totalSC: 0,
          uniquePlayers: new Set()
        });
      }
      
      const stats = gameStats.get(gameId);
      stats.sessions++;
      stats.totalScore += session.score;
      stats.totalSC += session.scEarned;
      stats.uniquePlayers.add(session.userId);
    });
    
    gameStats.forEach((stats, gameId) => {
      analytics.gameBreakdown[gameId] = {
        sessions: stats.sessions,
        averageScore: stats.totalScore / stats.sessions,
        totalSC: stats.totalSC,
        uniquePlayers: stats.uniquePlayers.size
      };
    });
    
    res.json(analytics);
  } catch (error) {
    console.error('Error getting game analytics:', error);
    res.status(500).json({ error: 'Failed to get analytics' });
  }
};

// Log to AI Employee Agent
function logToAIEmployee(department: string, data: any) {
  // This would send data to the AI Employee system
  console.log(`[AI Employee - ${department}]:`, data);
  
  // In a real implementation, this would:
  // 1. Send data to AI Employee Agent API
  // 2. Trigger analysis and recommendations
  // 3. Generate alerts if necessary
  // 4. Update user risk profiles
  // 5. Log to admin dashboard
}

// Export all handlers
export {
  handleCheckGameCooldown,
  handleSubmitGameSession,
  handleGetUserGameHistory,
  handleGetUserCooldowns,
  handleGetSecurityEvents,
  handleUpdateSecurityEvent,
  handleGetGameAnalytics
};
