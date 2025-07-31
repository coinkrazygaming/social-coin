import { TableGame, PokerTable } from "./slotTypes";

// Enhanced table games with CoinKrazy branding and 5-seat poker tables
export const enhancedCardGames: TableGame[] = [
  {
    id: "coinkrazy-spades-championship",
    name: "CoinKrazy Spades Championship",
    type: "card",
    thumbnail: `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(`
      <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#1e40af;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#7c3aed;stop-opacity:1" />
          </linearGradient>
          <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#ffd700;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#ffed4e;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="400" height="300" fill="url(#bg)"/>
        <rect x="20" y="20" width="360" height="200" rx="20" fill="rgba(0,0,0,0.3)"/>
        <text x="200" y="60" font-family="Arial Black" font-size="24" font-weight="bold" text-anchor="middle" fill="url(#gold)">CoinKrazy</text>
        <text x="200" y="85" font-family="Arial" font-size="14" text-anchor="middle" fill="white">SPADES CHAMPIONSHIP</text>
        <g transform="translate(160,110)">
          <rect x="0" y="0" width="30" height="40" rx="4" fill="white"/>
          <text x="15" y="20" font-family="Arial" font-size="16" font-weight="bold" text-anchor="middle" fill="black">♠</text>
          <text x="15" y="35" font-family="Arial" font-size="10" text-anchor="middle" fill="black">A</text>
        </g>
        <g transform="translate(210,110)">
          <rect x="0" y="0" width="30" height="40" rx="4" fill="white"/>
          <text x="15" y="20" font-family="Arial" font-size="16" font-weight="bold" text-anchor="middle" fill="black">♠</text>
          <text x="15" y="35" font-family="Arial" font-size="10" text-anchor="middle" fill="black">K</text>
        </g>
        <text x="200" y="250" font-family="Arial" font-size="12" font-weight="bold" text-anchor="middle" fill="url(#gold)">CoinKrazy.com</text>
        <circle cx="50" cy="250" r="15" fill="url(#gold)"/>
        <text x="50" y="255" font-family="Arial" font-size="12" font-weight="bold" text-anchor="middle" fill="black">GC</text>
        <circle cx="350" cy="250" r="15" fill="#8b5cf6"/>
        <text x="350" y="255" font-family="Arial" font-size="12" font-weight="bold" text-anchor="middle" fill="white">SC</text>
      </svg>
    `)))}`,
    maxPlayers: 4,
    currentPlayers: 3,
    minBet: 1,
    maxBet: 500,
    rtp: 95.8,
    lastWinner: {
      firstName: "CoinKrazy",
      lastInitial: "P",
      amount: 850,
      currency: "SC",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
    },
    biggestWin: {
      firstName: "SpadesMaster",
      lastInitial: "K",
      amount: 5250,
      currency: "SC",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
    },
    isActive: true,
    description:
      "Championship level partnership spades with CoinKrazy tournament rules",
    rules:
      "CoinKrazy partnership spades with bidding, nil bids, and bonus scoring. First team to 500 points wins!",
  },
  {
    id: "coinkrazy-uno-blitz",
    name: "CoinKrazy UNO Blitz",
    type: "card",
    thumbnail: `data:image/svg+xml;base64,${btoa(`
      <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#dc2626;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#eab308;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#16a34a;stop-opacity:1" />
          </linearGradient>
          <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#ffd700;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#ffed4e;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="400" height="300" fill="url(#bg)"/>
        <rect x="20" y="20" width="360" height="200" rx="20" fill="rgba(0,0,0,0.4)"/>
        <text x="200" y="60" font-family="Arial Black" font-size="24" font-weight="bold" text-anchor="middle" fill="url(#gold)">CoinKrazy</text>
        <text x="200" y="85" font-family="Arial" font-size="14" text-anchor="middle" fill="white">UNO BLITZ</text>
        <g transform="translate(140,110)">
          <rect x="0" y="0" width="30" height="40" rx="4" fill="#dc2626"/>
          <text x="15" y="28" font-family="Arial" font-size="20" font-weight="bold" text-anchor="middle" fill="white">7</text>
        </g>
        <g transform="translate(185,110)">
          <rect x="0" y="0" width="30" height="40" rx="4" fill="#16a34a"/>
          <text x="15" y="20" font-family="Arial" font-size="12" font-weight="bold" text-anchor="middle" fill="white">WILD</text>
          <text x="15" y="35" font-family="Arial" font-size="10" text-anchor="middle" fill="white">+4</text>
        </g>
        <g transform="translate(230,110)">
          <rect x="0" y="0" width="30" height="40" rx="4" fill="#eab308"/>
          <text x="15" y="28" font-family="Arial" font-size="20" font-weight="bold" text-anchor="middle" fill="white">2</text>
        </g>
        <text x="200" y="250" font-family="Arial" font-size="12" font-weight="bold" text-anchor="middle" fill="url(#gold)">CoinKrazy.com</text>
        <circle cx="50" cy="250" r="15" fill="url(#gold)"/>
        <text x="50" y="255" font-family="Arial" font-size="12" font-weight="bold" text-anchor="middle" fill="black">GC</text>
        <circle cx="350" cy="250" r="15" fill="#8b5cf6"/>
        <text x="350" y="255" font-family="Arial" font-size="12" font-weight="bold" text-anchor="middle" fill="white">SC</text>
      </svg>
    `)}`,
    maxPlayers: 8,
    currentPlayers: 7,
    minBet: 0.5,
    maxBet: 100,
    rtp: 96.2,
    lastWinner: {
      firstName: "UnoKing",
      lastInitial: "C",
      amount: 285,
      currency: "GC",
      timestamp: new Date(Date.now() - 1000 * 60 * 3),
    },
    biggestWin: {
      firstName: "BlitzQueen",
      lastInitial: "M",
      amount: 1840,
      currency: "GC",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
    },
    isActive: true,
    description:
      "Fast-paced CoinKrazy UNO with special power-ups and instant wins",
    rules:
      "CoinKrazy UNO with timer rounds, bonus multipliers, and special CoinKrazy wild cards!",
  },
  {
    id: "coinkrazy-hearts-royal",
    name: "CoinKrazy Hearts Royal",
    type: "card",
    thumbnail: `data:image/svg+xml;base64,${btoa(`
      <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#7c3aed;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#dc2626;stop-opacity:1" />
          </linearGradient>
          <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#ffd700;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#ffed4e;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="400" height="300" fill="url(#bg)"/>
        <rect x="20" y="20" width="360" height="200" rx="20" fill="rgba(0,0,0,0.3)"/>
        <text x="200" y="60" font-family="Arial Black" font-size="24" font-weight="bold" text-anchor="middle" fill="url(#gold)">CoinKrazy</text>
        <text x="200" y="85" font-family="Arial" font-size="14" text-anchor="middle" fill="white">HEARTS ROYAL</text>
        <g transform="translate(160,110)">
          <rect x="0" y="0" width="30" height="40" rx="4" fill="white"/>
          <text x="15" y="20" font-family="Arial" font-size="16" font-weight="bold" text-anchor="middle" fill="#dc2626">♥</text>
          <text x="15" y="35" font-family="Arial" font-size="10" text-anchor="middle" fill="black">Q</text>
        </g>
        <g transform="translate(210,110)">
          <rect x="0" y="0" width="30" height="40" rx="4" fill="white"/>
          <text x="15" y="20" font-family="Arial" font-size="16" font-weight="bold" text-anchor="middle" fill="black">♠</text>
          <text x="15" y="35" font-family="Arial" font-size="10" text-anchor="middle" fill="black">Q</text>
        </g>
        <text x="200" y="250" font-family="Arial" font-size="12" font-weight="bold" text-anchor="middle" fill="url(#gold)">CoinKrazy.com</text>
        <circle cx="50" cy="250" r="15" fill="url(#gold)"/>
        <text x="50" y="255" font-family="Arial" font-size="12" font-weight="bold" text-anchor="middle" fill="black">GC</text>
        <circle cx="350" cy="250" r="15" fill="#8b5cf6"/>
        <text x="350" y="255" font-family="Arial" font-size="12" font-weight="bold" text-anchor="middle" fill="white">SC</text>
      </svg>
    `)}`,
    maxPlayers: 4,
    currentPlayers: 4,
    minBet: 2,
    maxBet: 1000,
    rtp: 94.9,
    lastWinner: {
      firstName: "HeartBreaker",
      lastInitial: "R",
      amount: 1250,
      currency: "SC",
      timestamp: new Date(Date.now() - 1000 * 60 * 7),
    },
    biggestWin: {
      firstName: "RoyalFlush",
      lastInitial: "A",
      amount: 8750,
      currency: "SC",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18),
    },
    isActive: true,
    description:
      "Royal tournament hearts with CoinKrazy bonus scoring and moon shots",
    rules:
      "CoinKrazy hearts with royal bonuses, moon shot multipliers, and special penalty avoidance cards.",
  },
];

// Enhanced 5-seat poker tables with CoinKrazy branding
export const enhancedPokerTables: PokerTable[] = [
  {
    id: "coinkrazy-holdem-high-roller",
    name: "CoinKrazy High Roller Hold'em",
    gameType: "texas-holdem",
    maxSeats: 5, // Exactly 5 seats as requested
    seats: [
      {
        seatNumber: 1,
        player: { id: "p1", username: "CoinKrazy_Pro" },
        chipCount: 45620,
        isDealer: false,
        isActive: true,
      },
      {
        seatNumber: 2,
        player: null,
        chipCount: 0,
        isDealer: false,
        isActive: false,
      },
      {
        seatNumber: 3,
        player: { id: "p3", username: "GoldRush88" },
        chipCount: 28750,
        isDealer: true,
        isActive: true,
      },
      {
        seatNumber: 4,
        player: { id: "p4", username: "AllIn_Annie" },
        chipCount: 67300,
        isDealer: false,
        isActive: true,
      },
      {
        seatNumber: 5,
        player: null,
        chipCount: 0,
        isDealer: false,
        isActive: false,
      },
    ],
    blinds: { small: 250, big: 500 },
    buyIn: { min: 25000, max: 250000 },
    currency: "SC",
    isActive: true,
    currentPot: 8750,
    dailyProfit: 125780,
    totalBuyIns: 15,
    averageBuyIn: 87500,
  },
  {
    id: "coinkrazy-holdem-casual",
    name: "CoinKrazy Casual Hold'em",
    gameType: "texas-holdem",
    maxSeats: 5,
    seats: [
      {
        seatNumber: 1,
        player: { id: "p10", username: "NewComer23" },
        chipCount: 4850,
        isDealer: false,
        isActive: true,
      },
      {
        seatNumber: 2,
        player: { id: "p11", username: "FoldEmAll" },
        chipCount: 7200,
        isDealer: true,
        isActive: true,
      },
      {
        seatNumber: 3,
        player: null,
        chipCount: 0,
        isDealer: false,
        isActive: false,
      },
      {
        seatNumber: 4,
        player: { id: "p13", username: "LuckyLenny" },
        chipCount: 3150,
        isDealer: false,
        isActive: true,
      },
      {
        seatNumber: 5,
        player: null,
        chipCount: 0,
        isDealer: false,
        isActive: false,
      },
    ],
    blinds: { small: 25, big: 50 },
    buyIn: { min: 2500, max: 15000 },
    currency: "GC",
    isActive: true,
    currentPot: 875,
    dailyProfit: 12450,
    totalBuyIns: 28,
    averageBuyIn: 6250,
  },
  {
    id: "coinkrazy-blackjack-vip",
    name: "CoinKrazy Blackjack VIP",
    gameType: "blackjack",
    maxSeats: 5,
    seats: [
      {
        seatNumber: 1,
        player: { id: "p20", username: "BlackjackKing" },
        chipCount: 18500,
        isDealer: false,
        isActive: true,
      },
      {
        seatNumber: 2,
        player: { id: "p21", username: "Hit_Me_21" },
        chipCount: 24300,
        isDealer: false,
        isActive: true,
      },
      {
        seatNumber: 3,
        player: null,
        chipCount: 0,
        isDealer: false,
        isActive: false,
      },
      {
        seatNumber: 4,
        player: { id: "p23", username: "DoubleDown_Dan" },
        chipCount: 11750,
        isDealer: false,
        isActive: true,
      },
      {
        seatNumber: 5,
        player: { id: "p24", username: "AceHigh_Amy" },
        chipCount: 31200,
        isDealer: false,
        isActive: true,
      },
    ],
    blinds: { small: 0, big: 0 },
    buyIn: { min: 5000, max: 50000 },
    currency: "SC",
    isActive: true,
    currentPot: 0,
    dailyProfit: 89650,
    totalBuyIns: 19,
    averageBuyIn: 18500,
  },
  {
    id: "coinkrazy-omaha-split",
    name: "CoinKrazy Omaha Hi-Lo",
    gameType: "omaha",
    maxSeats: 5,
    seats: [
      {
        seatNumber: 1,
        player: null,
        chipCount: 0,
        isDealer: false,
        isActive: false,
      },
      {
        seatNumber: 2,
        player: { id: "p30", username: "OmahaExpert" },
        chipCount: 28750,
        isDealer: false,
        isActive: true,
      },
      {
        seatNumber: 3,
        player: { id: "p31", username: "SplitPot_Pro" },
        chipCount: 19200,
        isDealer: true,
        isActive: true,
      },
      {
        seatNumber: 4,
        player: { id: "p32", username: "HiLo_Master" },
        chipCount: 15840,
        isDealer: false,
        isActive: true,
      },
      {
        seatNumber: 5,
        player: null,
        chipCount: 0,
        isDealer: false,
        isActive: false,
      },
    ],
    blinds: { small: 50, big: 100 },
    buyIn: { min: 5000, max: 50000 },
    currency: "SC",
    isActive: true,
    currentPot: 2850,
    dailyProfit: 67890,
    totalBuyIns: 13,
    averageBuyIn: 22500,
  },
  {
    id: "coinkrazy-holdem-micro",
    name: "CoinKrazy Micro Stakes",
    gameType: "texas-holdem",
    maxSeats: 5,
    seats: [
      {
        seatNumber: 1,
        player: { id: "p40", username: "MicroPlayer1" },
        chipCount: 850,
        isDealer: true,
        isActive: true,
      },
      {
        seatNumber: 2,
        player: { id: "p41", username: "SmallStakes" },
        chipCount: 1250,
        isDealer: false,
        isActive: true,
      },
      {
        seatNumber: 3,
        player: { id: "p42", username: "PennyPoker" },
        chipCount: 675,
        isDealer: false,
        isActive: true,
      },
      {
        seatNumber: 4,
        player: null,
        chipCount: 0,
        isDealer: false,
        isActive: false,
      },
      {
        seatNumber: 5,
        player: { id: "p44", username: "NitPlayer99" },
        chipCount: 1450,
        isDealer: false,
        isActive: true,
      },
    ],
    blinds: { small: 5, big: 10 },
    buyIn: { min: 500, max: 2500 },
    currency: "GC",
    isActive: true,
    currentPot: 125,
    dailyProfit: 3250,
    totalBuyIns: 45,
    averageBuyIn: 1250,
  },
  {
    id: "coinkrazy-blackjack-standard",
    name: "CoinKrazy Blackjack Standard",
    gameType: "blackjack",
    maxSeats: 5,
    seats: [
      {
        seatNumber: 1,
        player: { id: "p50", username: "Hit_Stand_Pro" },
        chipCount: 5850,
        isDealer: false,
        isActive: true,
      },
      {
        seatNumber: 2,
        player: null,
        chipCount: 0,
        isDealer: false,
        isActive: false,
      },
      {
        seatNumber: 3,
        player: { id: "p52", username: "Card_Counter" },
        chipCount: 8200,
        isDealer: false,
        isActive: true,
      },
      {
        seatNumber: 4,
        player: null,
        chipCount: 0,
        isDealer: false,
        isActive: false,
      },
      {
        seatNumber: 5,
        player: { id: "p54", username: "Basic_Strategy" },
        chipCount: 4650,
        isDealer: false,
        isActive: true,
      },
    ],
    blinds: { small: 0, big: 0 },
    buyIn: { min: 1000, max: 10000 },
    currency: "GC",
    isActive: true,
    currentPot: 0,
    dailyProfit: 15680,
    totalBuyIns: 24,
    averageBuyIn: 4200,
  },
];

export const allEnhancedTableGames = [...enhancedCardGames];
export const activeEnhancedPokerTables = enhancedPokerTables.filter(
  (table) => table.isActive,
);

// Table profit tracking functions
export const getTableDailyStats = (tableId: string) => {
  const table = enhancedPokerTables.find((t) => t.id === tableId);
  if (!table) return null;

  return {
    dailyProfit: table.dailyProfit || 0,
    totalBuyIns: table.totalBuyIns || 0,
    averageBuyIn: table.averageBuyIn || 0,
    occupancyRate:
      (table.seats.filter((s) => s.player).length / table.maxSeats) * 100,
    currentPlayers: table.seats.filter((s) => s.player).length,
  };
};

// Get all table profits for admin tracking
export const getAllTableProfits = () => {
  return enhancedPokerTables.map((table) => ({
    tableId: table.id,
    tableName: table.name,
    currency: table.currency,
    dailyProfit: table.dailyProfit || 0,
    totalBuyIns: table.totalBuyIns || 0,
    averageBuyIn: table.averageBuyIn || 0,
    currentPlayers: table.seats.filter((s) => s.player).length,
    maxSeats: table.maxSeats,
  }));
};
