export interface BingoGame {
  id: string;
  name: string;
  description: string;
  currency: "GC" | "SC";
  ticketPrice: number;
  maxPlayers: number;
  currentPlayers: number;
  status: "waiting" | "starting" | "in-progress" | "completed";
  startTime: Date;
  duration: number; // in minutes
  timeRemaining: number; // in seconds
  pattern: BingoPattern;
  prizePool: number;
  winners: BingoWinner[];
  isScheduled: boolean;
  nextScheduledTime?: Date;
}

export interface BingoPattern {
  id: string;
  name: string;
  description: string;
  icon: string;
  winningPositions: number[][];
  difficulty: "easy" | "medium" | "hard";
}

export interface BingoCard {
  id: string;
  gameId: string;
  playerId: string;
  playerName: string;
  numbers: number[][];
  markedPositions: boolean[][];
  isWinner: boolean;
  winningPattern?: string;
  purchaseTime: Date;
}

export interface BingoNumber {
  number: number;
  letter: "B" | "I" | "N" | "G" | "O";
  called: boolean;
  calledTime?: Date;
}

export interface BingoWinner {
  id: string;
  playerId: string;
  playerName: string;
  cardId: string;
  pattern: string;
  prize: number;
  currency: "GC" | "SC";
  timestamp: Date;
}

export interface BingoRoom {
  id: string;
  name: string;
  description: string;
  currency: "GC" | "SC";
  maxCapacity: number;
  currentOccupancy: number;
  activeGames: BingoGame[];
  schedule: BingoSchedule[];
  isFreePlay: boolean;
}

export interface BingoSchedule {
  id: string;
  roomId: string;
  startTime: Date;
  duration: number;
  pattern: BingoPattern;
  ticketPrice: number;
  currency: "GC" | "SC";
  maxPlayers: number;
  prizeStructure: {
    first: number;
    second?: number;
    third?: number;
  };
}

export interface BingoStats {
  playerId: string;
  totalGamesPlayed: number;
  totalGamesWon: number;
  winRate: number;
  totalWinnings: {
    GC: number;
    SC: number;
  };
  favoritePattern: string;
  longestWinStreak: number;
  currentWinStreak: number;
  cardsPlayed: number;
  fastestWin: number; // in seconds
}
