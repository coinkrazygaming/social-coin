export interface MiniGameResult {
  userId: string;
  gameId: string;
  score: number;
  maxScore: number;
  scEarned: number;
  timestamp: Date;
  approved: boolean;
}

export interface MiniGameConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  maxReward: number;
  duration: number;
  cooldownHours: number;
  enabled: boolean;
  settings?: Record<string, any>;
}

export interface GameSessionData {
  sessionId: string;
  userId: string;
  gameId: string;
  startTime: Date;
  endTime?: Date;
  score: number;
  moves: number;
  accuracy?: number;
  performance?: Record<string, any>;
}

export interface CooldownInfo {
  canPlay: boolean;
  nextAvailable: Date | null;
  hoursRemaining: number;
}

export interface MiniGameStats {
  totalPlays: number;
  totalScore: number;
  averageScore: number;
  bestScore: number;
  scEarned: number;
  lastPlayed?: Date;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  score: number;
  scEarned: number;
  playedAt: Date;
  rank: number;
}

export interface AdminMiniGameData {
  gameId: string;
  totalPlays: number;
  totalScPaid: number;
  pendingPayouts: number;
  averageScore: number;
  topScore: number;
  recentPlays: MiniGameResult[];
  settings: MiniGameConfig;
}
