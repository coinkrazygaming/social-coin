import { RequestHandler } from "express";
import { LeaderboardEntry, LeaderboardCategory, UserStats, Achievement } from "@shared/leaderboardTypes";

// In-memory storage (replace with real database)
const leaderboardEntries: Map<string, LeaderboardEntry[]> = new Map();
const userStats: Map<string, UserStats> = new Map();

// Mock leaderboard data
const mockEntries: LeaderboardEntry[] = [
  {
    id: 'entry1',
    userId: 'user1',
    username: 'SlotMaster2024',
    score: 157890,
    currency: 'SC',
    gameType: 'slots',
    specificGame: 'Lightning Riches',
    rank: 1,
    winAmount: 15789,
    gamesPlayed: 234,
    winRate: 67.5,
    lastWin: new Date(Date.now() - 1000 * 60 * 30),
    totalWinnings: 45600,
    isVip: true,
    achievements: ['High Roller', 'Slot Champion', 'Lucky Strike']
  },
  {
    id: 'entry2',
    userId: 'user2',
    username: 'PokerPro88',
    score: 142350,
    currency: 'SC',
    gameType: 'table-games',
    specificGame: 'Texas Holdem',
    rank: 2,
    winAmount: 14235,
    gamesPlayed: 189,
    winRate: 71.2,
    lastWin: new Date(Date.now() - 1000 * 60 * 45),
    totalWinnings: 38920,
    isVip: true,
    achievements: ['Poker Face', 'All In Master', 'Royal Flush']
  },
  {
    id: 'entry3',
    userId: 'user3',
    username: 'BingoQueen',
    score: 128940,
    currency: 'SC',
    gameType: 'bingo',
    rank: 3,
    winAmount: 12894,
    gamesPlayed: 156,
    winRate: 45.8,
    lastWin: new Date(Date.now() - 1000 * 60 * 15),
    totalWinnings: 29750,
    isVip: false,
    achievements: ['Bingo Master', 'Pattern Pro', 'Full House']
  },
  {
    id: 'entry4',
    userId: 'user4',
    username: 'SportsExpert',
    score: 119650,
    currency: 'SC',
    gameType: 'sportsbook',
    rank: 4,
    winAmount: 11965,
    gamesPlayed: 298,
    winRate: 58.7,
    lastWin: new Date(Date.now() - 1000 * 60 * 60),
    totalWinnings: 31240,
    isVip: false,
    achievements: ['Predictor', 'Sports Guru', 'Winning Streak']
  },
  {
    id: 'entry5',
    userId: 'user5',
    username: 'MiniGameHero',
    score: 98750,
    currency: 'SC',
    gameType: 'mini-games',
    specificGame: 'Colin Shots',
    rank: 5,
    winAmount: 9875,
    gamesPlayed: 145,
    winRate: 82.1,
    lastWin: new Date(Date.now() - 1000 * 60 * 10),
    totalWinnings: 15680,
    isVip: false,
    achievements: ['Sharp Shooter', 'Mini Master', 'Daily Champion']
  }
];

// Initialize mock data
leaderboardEntries.set('overall-sc', mockEntries);
leaderboardEntries.set('slots-sc', mockEntries.filter(e => e.gameType === 'slots'));
leaderboardEntries.set('table-games-sc', mockEntries.filter(e => e.gameType === 'table-games'));
leaderboardEntries.set('mini-games-sc', mockEntries.filter(e => e.gameType === 'mini-games'));
leaderboardEntries.set('sportsbook-sc', mockEntries.filter(e => e.gameType === 'sportsbook'));
leaderboardEntries.set('bingo-sc', mockEntries.filter(e => e.gameType === 'bingo'));

// Leaderboard categories
const categories: LeaderboardCategory[] = [
  {
    id: 'overall-sc',
    name: 'Overall Champions',
    description: 'Top SC winners across all games',
    icon: '👑',
    gameType: 'overall',
    currency: 'SC',
    prize: { first: 100, second: 50, third: 25, currency: 'SC' }
  },
  {
    id: 'slots-sc',
    name: 'Slot Masters',
    description: 'Biggest slot game winners',
    icon: '🎰',
    gameType: 'slots',
    currency: 'SC',
    prize: { first: 75, second: 40, third: 20, currency: 'SC' }
  },
  {
    id: 'table-games-sc',
    name: 'Table Legends',
    description: 'Top table game players',
    icon: '♠️',
    gameType: 'table-games',
    currency: 'SC',
    prize: { first: 60, second: 30, third: 15, currency: 'SC' }
  },
  {
    id: 'mini-games-sc',
    name: 'Mini Game Heroes',
    description: 'Daily mini game champions',
    icon: '🎮',
    gameType: 'mini-games',
    currency: 'SC',
    prize: { first: 25, second: 15, third: 10, currency: 'SC' }
  },
  {
    id: 'sportsbook-sc',
    name: 'Sports Predictors',
    description: 'Top sports betting winners',
    icon: '🏈',
    gameType: 'sportsbook',
    currency: 'SC',
    prize: { first: 50, second: 25, third: 12, currency: 'SC' }
  },
  {
    id: 'bingo-sc',
    name: 'Bingo Champions',
    description: 'Bingo hall winners',
    icon: '🎱',
    gameType: 'bingo',
    currency: 'SC',
    prize: { first: 40, second: 20, third: 10, currency: 'SC' }
  }
];

// Mock achievements
const achievements: Achievement[] = [
  {
    id: 'high-roller',
    name: 'High Roller',
    description: 'Win over 10,000 SC in a single session',
    icon: '💎',
    requirement: 10000,
    category: 'winnings',
    rarity: 'epic',
    reward: { amount: 50, currency: 'SC' }
  },
  {
    id: 'slot-champion',
    name: 'Slot Champion',
    description: 'Win 100 slot games',
    icon: '🎰',
    requirement: 100,
    category: 'slots',
    rarity: 'rare',
    reward: { amount: 25, currency: 'SC' }
  },
  {
    id: 'daily-player',
    name: 'Daily Player',
    description: 'Play every day for 7 days',
    icon: '📅',
    requirement: 7,
    category: 'activity',
    rarity: 'common',
    reward: { amount: 500, currency: 'GC' }
  }
];

// Get leaderboards by category
export const handleGetLeaderboard: RequestHandler = (req, res) => {
  const { category = 'overall-sc', period = 'weekly' } = req.query;
  
  const entries = leaderboardEntries.get(category as string) || [];
  const categoryInfo = categories.find(c => c.id === category);
  
  // Sort by score descending and add rank
  const sortedEntries = entries
    .sort((a, b) => b.score - a.score)
    .map((entry, index) => ({ ...entry, rank: index + 1 }))
    .slice(0, 100); // Top 100
  
  res.json({
    category: categoryInfo,
    period,
    entries: sortedEntries,
    lastUpdated: new Date()
  });
};

// Get all leaderboard categories
export const handleGetCategories: RequestHandler = (req, res) => {
  res.json(categories);
};

// Get user's leaderboard position
export const handleGetUserPosition: RequestHandler = (req, res) => {
  const { userId, category = 'overall-sc' } = req.params;
  
  const entries = leaderboardEntries.get(category) || [];
  const userEntry = entries.find(e => e.userId === userId);
  
  if (!userEntry) {
    return res.json({ position: null, message: 'User not ranked yet' });
  }
  
  const sortedEntries = entries.sort((a, b) => b.score - a.score);
  const position = sortedEntries.findIndex(e => e.userId === userId) + 1;
  
  res.json({
    position,
    entry: { ...userEntry, rank: position },
    totalPlayers: entries.length
  });
};

// Get user stats
export const handleGetUserStats: RequestHandler = (req, res) => {
  const { userId } = req.params;
  
  // Mock user stats
  const stats: UserStats = {
    userId,
    totalGamesPlayed: 567,
    totalWinnings: { GC: 125000, SC: 89.50 },
    favoriteGame: 'Lightning Riches',
    longestWinStreak: 12,
    currentWinStreak: 5,
    biggestWin: {
      amount: 2500,
      currency: 'SC',
      game: 'Royal Fortune',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3)
    },
    achievements: achievements.slice(0, 3),
    level: 8,
    experience: 2340,
    nextLevelExp: 3000
  };
  
  res.json(stats);
};

// Update user score (called after wins)
export const handleUpdateScore: RequestHandler = (req, res) => {
  const { userId, gameType, specificGame, winAmount, currency } = req.body;
  
  const categoryKey = `${gameType}-${currency.toLowerCase()}`;
  const entries = leaderboardEntries.get(categoryKey) || [];
  
  // Find or create user entry
  let userEntry = entries.find(e => e.userId === userId);
  
  if (userEntry) {
    userEntry.score += winAmount;
    userEntry.winAmount += winAmount;
    userEntry.totalWinnings += winAmount;
    userEntry.gamesPlayed += 1;
    userEntry.lastWin = new Date();
    userEntry.winRate = (userEntry.winAmount / userEntry.gamesPlayed) * 100;
  } else {
    userEntry = {
      id: `entry_${Date.now()}`,
      userId,
      username: req.body.username || `Player${userId.slice(-4)}`,
      score: winAmount,
      currency: currency as 'GC' | 'SC',
      gameType: gameType as any,
      specificGame,
      rank: 0,
      winAmount,
      gamesPlayed: 1,
      winRate: 100,
      lastWin: new Date(),
      totalWinnings: winAmount,
      isVip: false,
      achievements: []
    };
    entries.push(userEntry);
  }
  
  // Update leaderboard
  leaderboardEntries.set(categoryKey, entries);
  
  // Also update overall leaderboard
  const overallEntries = leaderboardEntries.get(`overall-${currency.toLowerCase()}`) || [];
  let overallEntry = overallEntries.find(e => e.userId === userId);
  
  if (overallEntry) {
    overallEntry.score += winAmount;
    overallEntry.winAmount += winAmount;
    overallEntry.totalWinnings += winAmount;
    overallEntry.gamesPlayed += 1;
    overallEntry.lastWin = new Date();
  } else {
    overallEntries.push({ ...userEntry, gameType: 'overall' });
  }
  
  leaderboardEntries.set(`overall-${currency.toLowerCase()}`, overallEntries);
  
  res.json({ success: true, entry: userEntry });
};

// Get achievements
export const handleGetAchievements: RequestHandler = (req, res) => {
  res.json(achievements);
};

// Get live leaderboard updates (for real-time)
export const handleGetLiveUpdates: RequestHandler = (req, res) => {
  const { category = 'overall-sc', lastUpdate } = req.query;
  
  // Mock recent updates
  const recentUpdates = [
    {
      userId: 'user6',
      username: 'NewWinner',
      action: 'won',
      amount: 450,
      game: 'Mystic Dragons',
      timestamp: new Date()
    },
    {
      userId: 'user7',
      username: 'LuckyPlayer',
      action: 'won',
      amount: 750,
      game: 'Blackjack Pro',
      timestamp: new Date(Date.now() - 1000 * 60 * 2)
    }
  ];
  
  res.json({
    updates: recentUpdates,
    timestamp: new Date()
  });
};
