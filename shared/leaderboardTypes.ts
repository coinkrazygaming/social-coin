export interface LeaderboardEntry {
  id: string;
  userId: string;
  username: string;
  avatar?: string;
  score: number;
  currency: 'GC' | 'SC';
  gameType: 'slots' | 'table-games' | 'mini-games' | 'sportsbook' | 'bingo' | 'overall';
  specificGame?: string;
  rank: number;
  winAmount: number;
  gamesPlayed: number;
  winRate: number;
  lastWin: Date;
  totalWinnings: number;
  isVip: boolean;
  achievements: string[];
}

export interface LeaderboardPeriod {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

export interface LeaderboardCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  gameType: string;
  currency: 'GC' | 'SC' | 'both';
  prize?: {
    first: number;
    second: number;
    third: number;
    currency: 'GC' | 'SC';
  };
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  reward: {
    amount: number;
    currency: 'GC' | 'SC';
  };
}

export interface UserStats {
  userId: string;
  totalGamesPlayed: number;
  totalWinnings: {
    GC: number;
    SC: number;
  };
  favoriteGame: string;
  longestWinStreak: number;
  currentWinStreak: number;
  biggestWin: {
    amount: number;
    currency: 'GC' | 'SC';
    game: string;
    date: Date;
  };
  achievements: Achievement[];
  level: number;
  experience: number;
  nextLevelExp: number;
}
