export interface SlotSymbol {
  id: string;
  name: string;
  image: string;
  value: number;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  multiplier: number;
  color: string;
  animation?: string;
}

export interface SlotReel {
  id: string;
  position: number;
  symbols: string[]; // Array of symbol IDs
  weight: Record<string, number>; // Symbol weight for probability
}

export interface SlotPayline {
  id: string;
  name: string;
  positions: Array<{ reel: number; row: number }>;
  active: boolean;
}

export interface SlotWinCondition {
  id: string;
  symbolId: string;
  count: number;
  payout: number;
  paylineRequired?: boolean;
  scatterPay?: boolean;
  wildMultiplier?: number;
}

export interface SlotMachine {
  id: string;
  name: string;
  description: string;
  theme: string;
  provider: "CoinKrazy";
  thumbnail: string;
  backgroundImage: string;
  reels: SlotReel[];
  rows: number;
  paylines: SlotPayline[];
  symbols: SlotSymbol[];
  winConditions: SlotWinCondition[];
  rtp: number; // Return to Player percentage
  volatility: "low" | "medium" | "high";
  minBet: number;
  maxBet: number;
  jackpot?: number;
  bonusFeatures: SlotBonusFeature[];
  soundEffects: SlotSoundConfig;
  animations: SlotAnimationConfig;
  created: Date;
  updated: Date;
  active: boolean;
  featured: boolean;
}

export interface SlotBonusFeature {
  id: string;
  type:
    | "free_spins"
    | "bonus_game"
    | "multiplier"
    | "expanding_wild"
    | "cascading";
  triggerSymbols: string[];
  triggerCount: number;
  description: string;
  settings: Record<string, any>;
}

export interface SlotSoundConfig {
  spinSound: string;
  winSound: string;
  bonusSound: string;
  backgroundMusic: string;
  volume: number;
}

export interface SlotAnimationConfig {
  spinDuration: number;
  reelDelay: number;
  winAnimationDuration: number;
  symbolAnimations: Record<string, string>;
}

export interface SlotSpin {
  id: string;
  userId: string;
  slotId: string;
  bet: number;
  result: string[][]; // 2D array of symbol IDs
  winAmount: number;
  winLines: Array<{
    paylineId: string;
    symbols: string[];
    payout: number;
  }>;
  bonusTriggered?: string;
  timestamp: Date;
}

export interface SlotSession {
  id: string;
  userId: string;
  slotId: string;
  startTime: Date;
  endTime?: Date;
  totalSpins: number;
  totalBet: number;
  totalWin: number;
  biggestWin: number;
  bonusRounds: number;
}

export interface SlotStats {
  slotId: string;
  totalSpins: number;
  totalBet: number;
  totalPayout: number;
  rtp: number;
  popularityScore: number;
  averageSession: number;
  biggestWin: number;
  jackpotHits: number;
}

export interface JoseyAIResponse {
  message: string;
  suggestions: string[];
  codeExample?: string;
  nextSteps: string[];
  confidence: number;
}

export interface VisualEditorState {
  selectedSlot: string | null;
  editMode: "symbols" | "reels" | "paylines" | "settings" | "preview";
  unsavedChanges: boolean;
  previewMode: boolean;
}

// Table Game Interfaces
export interface TableGameWinner {
  firstName: string;
  lastInitial: string;
  amount: number;
  currency: "GC" | "SC";
  timestamp: Date;
}

export interface TableGame {
  id: string;
  name: string;
  type: "card" | "poker";
  thumbnail: string;
  maxPlayers: number;
  currentPlayers: number;
  minBet: number;
  maxBet: number;
  rtp: number;
  lastWinner?: TableGameWinner;
  biggestWin?: TableGameWinner;
  isActive: boolean;
  description: string;
  rules: string;
}

export interface PokerPlayer {
  id: string;
  username: string;
}

export interface PokerSeat {
  seatNumber: number;
  player: PokerPlayer | null;
  chipCount: number;
  isDealer: boolean;
  isActive: boolean;
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
  // Enhanced profit tracking fields
  dailyProfit?: number;
  totalBuyIns?: number;
  averageBuyIn?: number;
}
