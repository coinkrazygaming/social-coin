import { TableGame, PokerTable } from "./slotTypes";

export const cardGames: TableGame[] = [
  {
    id: "partners-spades",
    name: "Partners Spades",
    type: "card",
    thumbnail:
      "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=300&fit=crop&auto=format",
    maxPlayers: 4,
    currentPlayers: 3,
    minBet: 1,
    maxBet: 100,
    rtp: 94.5,
    lastWinner: {
      firstName: "Alex",
      lastInitial: "M",
      amount: 450,
      currency: "SC",
      timestamp: new Date(Date.now() - 1000 * 60 * 20), // 20 minutes ago
    },
    biggestWin: {
      firstName: "Sarah",
      lastInitial: "J",
      amount: 2250,
      currency: "SC",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    },
    isActive: true,
    description: "Classic partnership spades with bidding and trump cards",
    rules:
      "Partnership spades game where teams bid and try to make their contract. Spades are always trump.",
  },
  {
    id: "uno-classic",
    name: "UNO Classic",
    type: "card",
    thumbnail:
      "https://images.unsplash.com/photo-1541278107931-e006523892df?w=400&h=300&fit=crop&auto=format",
    maxPlayers: 8,
    currentPlayers: 6,
    minBet: 0.5,
    maxBet: 50,
    rtp: 95.2,
    lastWinner: {
      firstName: "Marcus",
      lastInitial: "T",
      amount: 125,
      currency: "GC",
      timestamp: new Date(Date.now() - 1000 * 60 * 8), // 8 minutes ago
    },
    biggestWin: {
      firstName: "Emily",
      lastInitial: "R",
      amount: 850,
      currency: "GC",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    },
    isActive: true,
    description: "Fast-paced card matching game with special action cards",
    rules:
      "Match cards by color or number. Use action cards strategically. First player to empty their hand wins!",
  },
  {
    id: "crazy-eights",
    name: "Crazy Eights",
    type: "card",
    thumbnail:
      "https://images.unsplash.com/photo-1596132108103-0acc103582a4?w=400&h=300&fit=crop&auto=format",
    maxPlayers: 6,
    currentPlayers: 4,
    minBet: 0.25,
    maxBet: 25,
    rtp: 93.8,
    lastWinner: {
      firstName: "David",
      lastInitial: "L",
      amount: 75,
      currency: "GC",
      timestamp: new Date(Date.now() - 1000 * 60 * 35), // 35 minutes ago
    },
    biggestWin: {
      firstName: "Jessica",
      lastInitial: "K",
      amount: 320,
      currency: "GC",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    },
    isActive: true,
    description: "Shedding card game where eights are wild cards",
    rules:
      "Play cards matching suit or rank. Eights can be played anytime and change the suit.",
  },
  {
    id: "hearts-tournament",
    name: "Hearts Tournament",
    type: "card",
    thumbnail:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&auto=format&sat=-20&hue=0",
    maxPlayers: 4,
    currentPlayers: 4,
    minBet: 2,
    maxBet: 200,
    rtp: 94.1,
    lastWinner: {
      firstName: "Rachel",
      lastInitial: "W",
      amount: 680,
      currency: "SC",
      timestamp: new Date(Date.now() - 1000 * 60 * 12), // 12 minutes ago
    },
    biggestWin: {
      firstName: "Brian",
      lastInitial: "S",
      amount: 1750,
      currency: "SC",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    },
    isActive: true,
    description: "Avoid penalty points in this trick-taking game",
    rules:
      "Avoid hearts and the Queen of Spades. Lowest score wins the tournament!",
  },
];

export const pokerTables: PokerTable[] = [
  {
    id: "texas-holdem-1",
    name: "Texas Hold'em - High Stakes",
    gameType: "texas-holdem",
    maxSeats: 9,
    seats: [
      {
        seatNumber: 1,
        player: { id: "p1", username: "PokerPro88" },
        chipCount: 15420,
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
        player: { id: "p3", username: "BluffMaster" },
        chipCount: 8750,
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
        player: { id: "p5", username: "AllInAmy" },
        chipCount: 22100,
        isDealer: true,
        isActive: true,
      },
      {
        seatNumber: 6,
        player: { id: "p6", username: "CasinoKing" },
        chipCount: 12680,
        isDealer: false,
        isActive: true,
      },
      {
        seatNumber: 7,
        player: null,
        chipCount: 0,
        isDealer: false,
        isActive: false,
      },
      {
        seatNumber: 8,
        player: null,
        chipCount: 0,
        isDealer: false,
        isActive: false,
      },
      {
        seatNumber: 9,
        player: { id: "p9", username: "LuckyLisa" },
        chipCount: 9340,
        isDealer: false,
        isActive: true,
      },
    ],
    blinds: { small: 50, big: 100 },
    buyIn: { min: 5000, max: 50000 },
    currency: "SC",
    isActive: true,
    currentPot: 2750,
  },
  {
    id: "texas-holdem-2",
    name: "Texas Hold'em - Casual",
    gameType: "texas-holdem",
    maxSeats: 6,
    seats: [
      {
        seatNumber: 1,
        player: { id: "p10", username: "NewPlayer1" },
        chipCount: 2450,
        isDealer: true,
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
        player: { id: "p12", username: "CardShark" },
        chipCount: 3100,
        isDealer: false,
        isActive: true,
      },
      {
        seatNumber: 4,
        player: { id: "p13", username: "FoldQueen" },
        chipCount: 1850,
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
      {
        seatNumber: 6,
        player: null,
        chipCount: 0,
        isDealer: false,
        isActive: false,
      },
    ],
    blinds: { small: 10, big: 20 },
    buyIn: { min: 1000, max: 10000 },
    currency: "GC",
    isActive: true,
    currentPot: 420,
  },
  {
    id: "blackjack-vip",
    name: "Blackjack VIP Table",
    gameType: "blackjack",
    maxSeats: 7,
    seats: [
      {
        seatNumber: 1,
        player: { id: "p20", username: "BlackjackBob" },
        chipCount: 8500,
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
        player: { id: "p22", username: "Hit21Sara" },
        chipCount: 12300,
        isDealer: false,
        isActive: true,
      },
      {
        seatNumber: 4,
        player: { id: "p23", username: "DoubleDown" },
        chipCount: 6750,
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
      {
        seatNumber: 6,
        player: null,
        chipCount: 0,
        isDealer: false,
        isActive: false,
      },
      {
        seatNumber: 7,
        player: { id: "p26", username: "AceHigh" },
        chipCount: 15200,
        isDealer: false,
        isActive: true,
      },
    ],
    blinds: { small: 0, big: 0 }, // Not applicable for blackjack
    buyIn: { min: 2500, max: 25000 },
    currency: "SC",
    isActive: true,
    currentPot: 0, // Not applicable for blackjack
  },
  {
    id: "omaha-hi-lo",
    name: "Omaha Hi-Lo Split",
    gameType: "omaha",
    maxSeats: 8,
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
        chipCount: 18750,
        isDealer: false,
        isActive: true,
      },
      {
        seatNumber: 3,
        player: { id: "p31", username: "SplitPotKing" },
        chipCount: 14200,
        isDealer: true,
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
        player: { id: "p34", username: "HiLoMaster" },
        chipCount: 9840,
        isDealer: false,
        isActive: true,
      },
      {
        seatNumber: 6,
        player: null,
        chipCount: 0,
        isDealer: false,
        isActive: false,
      },
      {
        seatNumber: 7,
        player: { id: "p36", username: "NutFlush" },
        chipCount: 22600,
        isDealer: false,
        isActive: true,
      },
      {
        seatNumber: 8,
        player: null,
        chipCount: 0,
        isDealer: false,
        isActive: false,
      },
    ],
    blinds: { small: 25, big: 50 },
    buyIn: { min: 2500, max: 30000 },
    currency: "SC",
    isActive: true,
    currentPot: 1850,
  },
];

export const allTableGames = [...cardGames];
export const activePokerTables = pokerTables.filter((table) => table.isActive);
