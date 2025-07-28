import { SlotGame } from "./slotTypes";

export const slotGames: SlotGame[] = [
  {
    id: "lightning-riches",
    name: "Lightning Riches",
    provider: "SweepSlots Pro",
    thumbnail:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&auto=format",
    category: "featured",
    rtp: 95.8,
    maxWin: 125000,
    liveSCEarned: 45280.75,
    lastWinner: {
      firstName: "Sarah",
      lastInitial: "M",
      amount: 2450.0,
      currency: "SC",
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    },
    biggestWin: {
      firstName: "Michael",
      lastInitial: "J",
      amount: 15750.0,
      currency: "SC",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    },
    isActive: true,
    minBet: 0.2,
    maxBet: 100.0,
    paylines: 25,
    features: ["Free Spins", "Wild Multipliers", "Lightning Bonus"],
    description:
      "Experience the power of lightning with massive multipliers and electrifying wins!",
    volatility: "high",
  },
  {
    id: "royal-fortune",
    name: "Royal Fortune",
    provider: "ReelGames Elite",
    thumbnail:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&auto=format",
    category: "progressive",
    rtp: 94.2,
    maxWin: 89500,
    liveSCEarned: 32100.5,
    lastWinner: {
      firstName: "David",
      lastInitial: "K",
      amount: 1275.0,
      currency: "SC",
      timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    },
    biggestWin: {
      firstName: "Jennifer",
      lastInitial: "L",
      amount: 12300.0,
      currency: "SC",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
    },
    isActive: true,
    minBet: 0.1,
    maxBet: 50.0,
    paylines: 20,
    features: ["Progressive Jackpot", "Royal Respins", "Crown Wilds"],
    description:
      "Rule the reels with royal symbols and progressive jackpots fit for a king!",
    volatility: "medium",
  },
  {
    id: "mystic-dragons",
    name: "Mystic Dragons",
    provider: "SweepSlots Pro",
    thumbnail:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&auto=format&sat=-50&hue=240",
    category: "video",
    rtp: 96.1,
    maxWin: 67200,
    liveSCEarned: 28750.25,
    lastWinner: {
      firstName: "Amanda",
      lastInitial: "R",
      amount: 890.0,
      currency: "SC",
      timestamp: new Date(Date.now() - 1000 * 60 * 8), // 8 minutes ago
    },
    biggestWin: {
      firstName: "Robert",
      lastInitial: "T",
      amount: 9850.0,
      currency: "SC",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    },
    isActive: true,
    minBet: 0.25,
    maxBet: 75.0,
    paylines: 30,
    features: ["Dragon Wilds", "Fire Breath Bonus", "Mystic Free Spins"],
    description:
      "Enter the mystical realm where dragons guard treasures beyond imagination!",
    volatility: "medium",
  },
  {
    id: "golden-pharaoh",
    name: "Golden Pharaoh",
    provider: "Ancient Games",
    thumbnail:
      "https://images.unsplash.com/photo-1539650116574-75c0c6d73fac?w=400&h=300&fit=crop&auto=format",
    category: "classic",
    rtp: 93.7,
    maxWin: 50000,
    liveSCEarned: 19450.75,
    lastWinner: {
      firstName: "Kevin",
      lastInitial: "W",
      amount: 675.0,
      currency: "SC",
      timestamp: new Date(Date.now() - 1000 * 60 * 25), // 25 minutes ago
    },
    biggestWin: {
      firstName: "Lisa",
      lastInitial: "H",
      amount: 7200.0,
      currency: "SC",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
    },
    isActive: true,
    minBet: 0.05,
    maxBet: 25.0,
    paylines: 9,
    features: ["Pyramid Bonus", "Pharaoh Wilds", "Tomb Scatter"],
    description:
      "Uncover ancient Egyptian treasures in this classic slot adventure!",
    volatility: "low",
  },
  {
    id: "pirates-treasure",
    name: "Pirates Treasure",
    provider: "Adventure Slots",
    thumbnail:
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=300&fit=crop&auto=format",
    category: "video",
    rtp: 95.4,
    maxWin: 75000,
    liveSCEarned: 35600.0,
    lastWinner: {
      firstName: "Chris",
      lastInitial: "B",
      amount: 1150.0,
      currency: "SC",
      timestamp: new Date(Date.now() - 1000 * 60 * 12), // 12 minutes ago
    },
    biggestWin: {
      firstName: "Maria",
      lastInitial: "G",
      amount: 11400.0,
      currency: "SC",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4), // 4 days ago
    },
    isActive: true,
    minBet: 0.15,
    maxBet: 60.0,
    paylines: 25,
    features: ["Treasure Map Bonus", "Pirate Ship Wilds", "Cannonball Scatter"],
    description:
      "Set sail for adventure and discover buried treasure on the high seas!",
    volatility: "medium",
  },
  {
    id: "diamond-dreams",
    name: "Diamond Dreams",
    provider: "Luxury Reels",
    thumbnail:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop&auto=format",
    category: "classic",
    rtp: 92.8,
    maxWin: 40000,
    liveSCEarned: 22100.5,
    lastWinner: {
      firstName: "Nicole",
      lastInitial: "S",
      amount: 540.0,
      currency: "SC",
      timestamp: new Date(Date.now() - 1000 * 60 * 35), // 35 minutes ago
    },
    biggestWin: {
      firstName: "Thomas",
      lastInitial: "A",
      amount: 6750.0,
      currency: "SC",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6), // 6 days ago
    },
    isActive: true,
    minBet: 0.1,
    maxBet: 20.0,
    paylines: 5,
    features: ["Diamond Wilds", "Triple Seven Bonus", "Luxury Multipliers"],
    description:
      "Classic elegance meets modern wins in this diamond-studded slot!",
    volatility: "low",
  },
  {
    id: "wild-west-gold",
    name: "Wild West Gold",
    provider: "Frontier Gaming",
    thumbnail:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&auto=format",
    category: "video",
    rtp: 94.8,
    maxWin: 85000,
    liveSCEarned: 41250.75,
    lastWinner: {
      firstName: "James",
      lastInitial: "P",
      amount: 1680.0,
      currency: "SC",
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    },
    biggestWin: {
      firstName: "Emily",
      lastInitial: "D",
      amount: 13200.0,
      currency: "SC",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1), // 1 day ago
    },
    isActive: true,
    minBet: 0.2,
    maxBet: 80.0,
    paylines: 40,
    features: ["Sheriff Badge Wilds", "Gold Rush Bonus", "Shootout Free Spins"],
    description:
      "Strike gold in the Wild West with bandits, sheriffs, and big rewards!",
    volatility: "high",
  },
  {
    id: "cosmic-fortune",
    name: "Cosmic Fortune",
    provider: "Space Slots",
    thumbnail:
      "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=300&fit=crop&auto=format",
    category: "new",
    rtp: 95.6,
    maxWin: 95000,
    liveSCEarned: 18750.25,
    lastWinner: {
      firstName: "Brian",
      lastInitial: "L",
      amount: 975.0,
      currency: "SC",
      timestamp: new Date(Date.now() - 1000 * 60 * 18), // 18 minutes ago
    },
    biggestWin: {
      firstName: "Rachel",
      lastInitial: "C",
      amount: 8900.0,
      currency: "SC",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    },
    isActive: true,
    minBet: 0.3,
    maxBet: 90.0,
    paylines: 50,
    features: ["Cosmic Wilds", "Planet Bonus", "Supernova Free Spins"],
    description:
      "Explore the cosmos and discover astronomical wins among the stars!",
    volatility: "high",
  },
];

export const featuredSlots = slotGames.filter(
  (game) => game.category === "featured" || game.liveSCEarned > 40000,
);
export const newSlots = slotGames.filter((game) => game.category === "new");
export const popularSlots = slotGames
  .sort((a, b) => b.liveSCEarned - a.liveSCEarned)
  .slice(0, 6);
