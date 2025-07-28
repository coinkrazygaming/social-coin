export interface SlotGame {
  id: string;
  name: string;
  provider: string;
  thumbnail: string;
  category: "classic" | "video" | "progressive" | "featured" | "new";
  rtp: number; // Between 92-96%
  maxWin: number; // In SC
  liveSCEarned: number; // Real-time SC earned by all players
  lastWinner: {
    firstName: string;
    lastInitial: string;
    amount: number;
    currency: "GC" | "SC";
    timestamp: Date;
  } | null;
  biggestWin: {
    firstName: string;
    lastInitial: string;
    amount: number;
    currency: "GC" | "SC";
    timestamp: Date;
  } | null;
  isActive: boolean;
  minBet: number;
  maxBet: number;
  paylines: number;
  features: string[];
  description: string;
  volatility: "low" | "medium" | "high";
}

export interface SlotProvider {
  id: string;
  name: string;
  apiEndpoint: string;
  isActive: boolean;
  games: SlotGame[];
}

export interface TableGame {
  id: string;
  name: string;
  type: "card" | "poker" | "specialty";
  thumbnail: string;
  maxPlayers: number;
  currentPlayers: number;
  minBet: number;
  maxBet: number;
  rtp: number;
  lastWinner: {
    firstName: string;
    lastInitial: string;
    amount: number;
    currency: "GC" | "SC";
    timestamp: Date;
  } | null;
  biggestWin: {
    firstName: string;
    lastInitial: string;
    amount: number;
    currency: "GC" | "SC";
    timestamp: Date;
  } | null;
  isActive: boolean;
  description: string;
  rules: string;
}

export interface PokerTable {
  id: string;
  name: string;
  gameType: "texas-holdem" | "omaha" | "seven-card-stud" | "blackjack";
  maxSeats: number;
  seats: PokerSeat[];
  blinds: {
    small: number;
    big: number;
  };
  buyIn: {
    min: number;
    max: number;
  };
  currency: "GC" | "SC";
  isActive: boolean;
  currentPot: number;
}

export interface PokerSeat {
  seatNumber: number;
  player: {
    id: string;
    username: string;
    avatar?: string;
  } | null;
  chipCount: number;
  isDealer: boolean;
  isActive: boolean;
}

export interface GameSelection {
  gameId: string;
  gameType: "slot" | "table" | "poker";
  currency: "GC" | "SC";
  betAmount?: number;
}

export interface LuckyAIMessage {
  id: string;
  message: string;
  type: "welcome" | "help" | "win" | "info" | "warning";
  timestamp: Date;
  tableId?: string;
  userId?: string;
}
