export interface SportEvent {
  id: string;
  sport: 'NFL' | 'NBA' | 'MLB' | 'NHL' | 'UFC' | 'MLS' | 'NCAA' | 'PGA';
  league: string;
  homeTeam: Team;
  awayTeam: Team;
  startTime: Date;
  status: 'upcoming' | 'live' | 'finished' | 'postponed';
  quarter?: string;
  timeRemaining?: string;
  homeScore?: number;
  awayScore?: number;
  odds: BettingOdds;
  isLive: boolean;
  venue?: string;
  weather?: WeatherCondition;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  city: string;
  record?: {
    wins: number;
    losses: number;
    ties?: number;
  };
  ranking?: number;
  conference?: string;
  division?: string;
}

export interface BettingOdds {
  moneyline: {
    home: number;
    away: number;
  };
  spread: {
    home: {
      line: number;
      odds: number;
    };
    away: {
      line: number;
      odds: number;
    };
  };
  total: {
    over: {
      line: number;
      odds: number;
    };
    under: {
      line: number;
      odds: number;
    };
  };
  lastUpdated: Date;
}

export interface Bet {
  id: string;
  userId: string;
  username: string;
  eventId: string;
  betType: 'moneyline' | 'spread' | 'total' | 'prop';
  selection: string;
  odds: number;
  stake: number;
  currency: 'GC' | 'SC';
  potentialWin: number;
  status: 'pending' | 'won' | 'lost' | 'void' | 'cashed-out';
  placedAt: Date;
  settledAt?: Date;
  cashOutValue?: number;
}

export interface BetSlip {
  bets: BetSlipItem[];
  totalStake: number;
  totalPotentialWin: number;
  currency: 'GC' | 'SC';
  betType: 'single' | 'parlay' | 'system';
}

export interface BetSlipItem {
  eventId: string;
  event: SportEvent;
  betType: 'moneyline' | 'spread' | 'total' | 'prop';
  selection: string;
  odds: number;
  line?: number;
  stake: number;
}

export interface WeatherCondition {
  temperature: number;
  conditions: string;
  windSpeed: number;
  humidity: number;
  precipitation: number;
}

export interface PlayerProp {
  id: string;
  eventId: string;
  playerId: string;
  playerName: string;
  propType: 'points' | 'rebounds' | 'assists' | 'yards' | 'touchdowns' | 'strikeouts';
  line: number;
  overOdds: number;
  underOdds: number;
  isAvailable: boolean;
}

export interface LiveUpdate {
  eventId: string;
  homeScore: number;
  awayScore: number;
  quarter: string;
  timeRemaining: string;
  lastPlay?: string;
  oddsChanges?: Partial<BettingOdds>;
  timestamp: Date;
}

export interface SportsbookStats {
  userId: string;
  totalBets: number;
  totalWagered: {
    GC: number;
    SC: number;
  };
  totalWon: {
    GC: number;
    SC: number;
  };
  winRate: number;
  favoriteSport: string;
  biggestWin: {
    amount: number;
    currency: 'GC' | 'SC';
    event: string;
    odds: number;
    date: Date;
  };
  currentStreak: number;
  longestWinStreak: number;
  averageOdds: number;
  roi: number; // Return on investment
}
