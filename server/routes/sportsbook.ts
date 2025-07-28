import { RequestHandler } from "express";
import { SportEvent, Bet, BetSlip, Team, BettingOdds, PlayerProp, LiveUpdate } from "@shared/sportsbookTypes";

// In-memory storage (replace with real database)
const sportEvents: Map<string, SportEvent> = new Map();
const bets: Map<string, Bet[]> = new Map();
const playerProps: Map<string, PlayerProp[]> = new Map();
const liveUpdates: Map<string, LiveUpdate[]> = new Map();

// Mock teams data
const teams: Team[] = [
  {
    id: 'lakers',
    name: 'Los Angeles Lakers',
    shortName: 'LAL',
    logo: 'https://via.placeholder.com/64x64?text=LAL',
    city: 'Los Angeles',
    record: { wins: 45, losses: 37 },
    ranking: 7,
    conference: 'Western',
    division: 'Pacific'
  },
  {
    id: 'warriors',
    name: 'Golden State Warriors',
    shortName: 'GSW',
    logo: 'https://via.placeholder.com/64x64?text=GSW',
    city: 'Golden State',
    record: { wins: 46, losses: 36 },
    ranking: 6,
    conference: 'Western',
    division: 'Pacific'
  },
  {
    id: 'chiefs',
    name: 'Kansas City Chiefs',
    shortName: 'KC',
    logo: 'https://via.placeholder.com/64x64?text=KC',
    city: 'Kansas City',
    record: { wins: 14, losses: 3 },
    ranking: 1,
    conference: 'AFC',
    division: 'West'
  },
  {
    id: 'bills',
    name: 'Buffalo Bills',
    shortName: 'BUF',
    logo: 'https://via.placeholder.com/64x64?text=BUF',
    city: 'Buffalo',
    record: { wins: 13, losses: 4 },
    ranking: 2,
    conference: 'AFC',
    division: 'East'
  }
];

// Generate mock odds
const generateOdds = (): BettingOdds => ({
  moneyline: {
    home: Math.floor(Math.random() * 400) - 200, // -200 to +200
    away: Math.floor(Math.random() * 400) - 200
  },
  spread: {
    home: {
      line: (Math.random() * 14 - 7), // -7 to +7
      odds: -110
    },
    away: {
      line: (Math.random() * 14 - 7),
      odds: -110
    }
  },
  total: {
    over: {
      line: Math.floor(Math.random() * 50) + 200, // 200-250
      odds: -110
    },
    under: {
      line: Math.floor(Math.random() * 50) + 200,
      odds: -110
    }
  },
  lastUpdated: new Date()
});

// Initialize mock sport events
const initializeSportEvents = () => {
  const now = new Date();
  
  // NBA Games
  const nbaEvent: SportEvent = {
    id: 'nba-lal-gsw',
    sport: 'NBA',
    league: 'National Basketball Association',
    homeTeam: teams.find(t => t.id === 'lakers')!,
    awayTeam: teams.find(t => t.id === 'warriors')!,
    startTime: new Date(now.getTime() + 2 * 60 * 60 * 1000), // 2 hours from now
    status: 'upcoming',
    odds: generateOdds(),
    isLive: false,
    venue: 'Crypto.com Arena'
  };

  // NFL Game
  const nflEvent: SportEvent = {
    id: 'nfl-kc-buf',
    sport: 'NFL',
    league: 'National Football League',
    homeTeam: teams.find(t => t.id === 'chiefs')!,
    awayTeam: teams.find(t => t.id === 'bills')!,
    startTime: new Date(now.getTime() + 24 * 60 * 60 * 1000), // 24 hours from now
    status: 'upcoming',
    odds: generateOdds(),
    isLive: false,
    venue: 'Arrowhead Stadium',
    weather: {
      temperature: 32,
      conditions: 'Clear',
      windSpeed: 8,
      humidity: 45,
      precipitation: 0
    }
  };

  // Live NBA Game
  const liveNbaEvent: SportEvent = {
    id: 'nba-live-1',
    sport: 'NBA',
    league: 'National Basketball Association',
    homeTeam: { ...teams[0], shortName: 'MIA' },
    awayTeam: { ...teams[1], shortName: 'BOS' },
    startTime: new Date(now.getTime() - 60 * 60 * 1000), // Started 1 hour ago
    status: 'live',
    quarter: '3rd Quarter',
    timeRemaining: '8:42',
    homeScore: 89,
    awayScore: 95,
    odds: generateOdds(),
    isLive: true,
    venue: 'FTX Arena'
  };

  sportEvents.set(nbaEvent.id, nbaEvent);
  sportEvents.set(nflEvent.id, nflEvent);
  sportEvents.set(liveNbaEvent.id, liveNbaEvent);

  // Generate more events for different sports
  const sports: SportEvent['sport'][] = ['MLB', 'NHL', 'UFC', 'MLS', 'NCAA'];
  sports.forEach((sport, index) => {
    const event: SportEvent = {
      id: `${sport.toLowerCase()}-${index}`,
      sport,
      league: `${sport} League`,
      homeTeam: { ...teams[index % teams.length], shortName: `H${index}` },
      awayTeam: { ...teams[(index + 1) % teams.length], shortName: `A${index}` },
      startTime: new Date(now.getTime() + (index + 3) * 60 * 60 * 1000),
      status: 'upcoming',
      odds: generateOdds(),
      isLive: false
    };
    sportEvents.set(event.id, event);
  });

  // Generate player props
  generatePlayerProps();
};

const generatePlayerProps = () => {
  const events = Array.from(sportEvents.values());
  events.forEach(event => {
    if (event.sport === 'NBA' || event.sport === 'NFL') {
      const props: PlayerProp[] = [];
      for (let i = 0; i < 5; i++) {
        const prop: PlayerProp = {
          id: `prop-${event.id}-${i}`,
          eventId: event.id,
          playerId: `player-${i}`,
          playerName: `Player ${i + 1}`,
          propType: event.sport === 'NBA' ? 'points' : 'yards',
          line: event.sport === 'NBA' ? 25.5 : 85.5,
          overOdds: -110,
          underOdds: -110,
          isAvailable: true
        };
        props.push(prop);
      }
      playerProps.set(event.id, props);
    }
  });
};

// Get all sport events
export const handleGetEvents: RequestHandler = (req, res) => {
  const { sport, status, live } = req.query;
  
  let events = Array.from(sportEvents.values());
  
  if (sport) {
    events = events.filter(event => event.sport === sport);
  }
  
  if (status) {
    events = events.filter(event => event.status === status);
  }
  
  if (live === 'true') {
    events = events.filter(event => event.isLive);
  }
  
  // Sort by start time
  events.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  
  res.json(events);
};

// Get specific event details
export const handleGetEvent: RequestHandler = (req, res) => {
  const { eventId } = req.params;
  const event = sportEvents.get(eventId);
  
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }
  
  const props = playerProps.get(eventId) || [];
  const updates = liveUpdates.get(eventId) || [];
  
  res.json({
    event,
    playerProps: props,
    liveUpdates: updates.slice(-10) // Last 10 updates
  });
};

// Place a bet
export const handlePlaceBet: RequestHandler = (req, res) => {
  const { 
    userId, 
    username, 
    eventId, 
    betType, 
    selection, 
    odds, 
    stake, 
    currency 
  } = req.body;
  
  const event = sportEvents.get(eventId);
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }
  
  if (event.status === 'finished') {
    return res.status(400).json({ error: 'Cannot bet on finished events' });
  }
  
  const potentialWin = Math.round((stake * (odds > 0 ? odds / 100 : 100 / Math.abs(odds))) * 100) / 100;
  
  const bet: Bet = {
    id: `bet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    username,
    eventId,
    betType,
    selection,
    odds,
    stake,
    currency,
    potentialWin,
    status: 'pending',
    placedAt: new Date()
  };
  
  const userBets = bets.get(userId) || [];
  userBets.push(bet);
  bets.set(userId, userBets);
  
  res.json({ success: true, bet });
};

// Get user bets
export const handleGetUserBets: RequestHandler = (req, res) => {
  const { userId } = req.params;
  const { status } = req.query;
  
  let userBets = bets.get(userId) || [];
  
  if (status) {
    userBets = userBets.filter(bet => bet.status === status);
  }
  
  // Sort by placed date descending
  userBets.sort((a, b) => b.placedAt.getTime() - a.placedAt.getTime());
  
  res.json(userBets);
};

// Get available sports
export const handleGetSports: RequestHandler = (req, res) => {
  const sportsData = [
    { id: 'NFL', name: 'Football', icon: '🏈', activeGames: 0 },
    { id: 'NBA', name: 'Basketball', icon: '🏀', activeGames: 0 },
    { id: 'MLB', name: 'Baseball', icon: '⚾', activeGames: 0 },
    { id: 'NHL', name: 'Hockey', icon: '🏒', activeGames: 0 },
    { id: 'UFC', name: 'MMA', icon: '🥊', activeGames: 0 },
    { id: 'MLS', name: 'Soccer', icon: '⚽', activeGames: 0 },
    { id: 'NCAA', name: 'College', icon: '🎓', activeGames: 0 },
    { id: 'PGA', name: 'Golf', icon: '⛳', activeGames: 0 }
  ];
  
  // Count active games for each sport
  const events = Array.from(sportEvents.values());
  sportsData.forEach(sport => {
    sport.activeGames = events.filter(event => 
      event.sport === sport.id && (event.status === 'upcoming' || event.status === 'live')
    ).length;
  });
  
  res.json(sportsData);
};

// Get live odds updates
export const handleGetLiveOdds: RequestHandler = (req, res) => {
  const { eventId } = req.params;
  const event = sportEvents.get(eventId);
  
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }
  
  // Simulate odds movement for live events
  if (event.isLive) {
    const oddsVariation = 0.05; // 5% variation
    event.odds.moneyline.home += Math.floor((Math.random() - 0.5) * 20);
    event.odds.moneyline.away += Math.floor((Math.random() - 0.5) * 20);
    event.odds.lastUpdated = new Date();
  }
  
  res.json(event.odds);
};

// Cash out bet
export const handleCashOut: RequestHandler = (req, res) => {
  const { betId } = req.params;
  const { userId } = req.body;
  
  const userBets = bets.get(userId) || [];
  const bet = userBets.find(b => b.id === betId);
  
  if (!bet) {
    return res.status(404).json({ error: 'Bet not found' });
  }
  
  if (bet.status !== 'pending') {
    return res.status(400).json({ error: 'Bet cannot be cashed out' });
  }
  
  // Calculate cash out value (typically 70-90% of potential win)
  const cashOutPercentage = 0.8;
  bet.cashOutValue = Math.round(bet.stake * cashOutPercentage * 100) / 100;
  bet.status = 'cashed-out';
  bet.settledAt = new Date();
  
  res.json({ success: true, cashOutValue: bet.cashOutValue });
};

// Get popular bets
export const handleGetPopularBets: RequestHandler = (req, res) => {
  const popularBets = [
    { selection: 'Lakers ML', percentage: 68, odds: -150 },
    { selection: 'Over 225.5', percentage: 72, odds: -110 },
    { selection: 'Warriors +3.5', percentage: 58, odds: -110 },
    { selection: 'Chiefs -7', percentage: 81, odds: -110 }
  ];
  
  res.json(popularBets);
};

// Initialize data on server start
initializeSportEvents();

// Simulate live game updates
setInterval(() => {
  const liveEvents = Array.from(sportEvents.values()).filter(event => event.isLive);
  
  liveEvents.forEach(event => {
    // Randomly update scores
    if (Math.random() < 0.1) { // 10% chance per interval
      const isHomeScore = Math.random() < 0.5;
      if (isHomeScore) {
        event.homeScore = (event.homeScore || 0) + (event.sport === 'NBA' ? Math.floor(Math.random() * 3) + 1 : 3);
      } else {
        event.awayScore = (event.awayScore || 0) + (event.sport === 'NBA' ? Math.floor(Math.random() * 3) + 1 : 3);
      }
      
      // Create live update
      const update: LiveUpdate = {
        eventId: event.id,
        homeScore: event.homeScore || 0,
        awayScore: event.awayScore || 0,
        quarter: event.quarter || '1st Quarter',
        timeRemaining: event.timeRemaining || '15:00',
        lastPlay: isHomeScore ? `${event.homeTeam.shortName} scores!` : `${event.awayTeam.shortName} scores!`,
        timestamp: new Date()
      };
      
      const updates = liveUpdates.get(event.id) || [];
      updates.push(update);
      liveUpdates.set(event.id, updates);
      
      // Update odds slightly
      event.odds = generateOdds();
      sportEvents.set(event.id, event);
    }
  });
}, 30000); // Every 30 seconds
