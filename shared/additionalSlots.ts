import { SlotMachine } from "./slotTypes";

export const ADDITIONAL_COINKRAZY_SLOTS: SlotMachine[] = [
  {
    id: "coinkrazy_ocean_treasure",
    name: "Ocean Treasure",
    description: "Dive deep into underwater riches with pirates, mermaids, and golden treasures!",
    theme: "Ocean Adventure",
    provider: "CoinKrazy",
    thumbnail: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJvY2VhbkdyYWQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMwMDg4Q0M7c3RvcC1vcGFjaXR5OjEiIC8+PHN0b3Agb2Zmc2V0PSI1MCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMwMDY2QUE7c3RvcC1vcGFjaXR5OjEiIC8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMDA0NDg4O3N0b3Atb3BhY2l0eToxIiAvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSJ1cmwoI29jZWFuR3JhZCkiLz48dGV4dCB4PSIyMDAiIHk9IjUwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+T0NFQU4gVFJFQVNVUkU8L3RleHQ+PHRleHQgeD0iMjAwIiB5PSIyNTAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNvaW5LcmF6eS5jb208L3RleHQ+PGNpcmNsZSBjeD0iMTAwIiBjeT0iMTQwIiByPSIyNSIgZmlsbD0iI0ZGRDcwMCIgc3Ryb2tlPSIjRkZGRkZGIiBzdHJva2Utd2lkdGg9IjMiLz48Y2lyY2xlIGN4PSIzMDAiIGN5PSIxNDAiIHI9IjIwIiBmaWxsPSIjRkY2QjZCIiBzdHJva2U9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iMiIvPjxwb2x5Z29uIHBvaW50cz0iMjAwLDEyMCAyMjAsMTQwIDIwMCwxNjAgMTgwLDE0MCIgZmlsbD0iIzAwRkZGRiIgc3Ryb2tlPSIjRkZGRkZGIiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=",
    backgroundImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJvY2VhbkJnIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMDA2NkFBO3N0b3Atb3BhY2l0eToxIiAvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzAwMjI0NDtzdG9wLW9wYWNpdHk6MSIgLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0idXJsKCNvY2VhbkJnKSIvPjwvc3ZnPg==",
    reels: Array.from({length: 5}, (_, i) => ({
      id: `reel_${i}`,
      position: i,
      symbols: ["wild", "scatter", "treasure", "anchor", "pearl", "shell", "fish"],
      weight: { "wild": 1, "scatter": 2, "treasure": 4, "anchor": 6, "pearl": 10, "shell": 14, "fish": 18 }
    })),
    rows: 3,
    paylines: [
      { id: "line_1", name: "Center Line", positions: [{ reel: 0, row: 1 }, { reel: 1, row: 1 }, { reel: 2, row: 1 }, { reel: 3, row: 1 }, { reel: 4, row: 1 }], active: true },
      { id: "line_2", name: "Top Line", positions: [{ reel: 0, row: 0 }, { reel: 1, row: 0 }, { reel: 2, row: 0 }, { reel: 3, row: 0 }, { reel: 4, row: 0 }], active: true },
      { id: "line_3", name: "Bottom Line", positions: [{ reel: 0, row: 2 }, { reel: 1, row: 2 }, { reel: 2, row: 2 }, { reel: 3, row: 2 }, { reel: 4, row: 2 }], active: true }
    ],
    symbols: [
      { id: "wild", name: "Ocean Wild", image: "", value: 1000, rarity: "legendary", multiplier: 2, color: "#00FFFF" },
      { id: "scatter", name: "Treasure Map", image: "", value: 500, rarity: "epic", multiplier: 1, color: "#8B4513" },
      { id: "treasure", name: "Treasure Chest", image: "", value: 300, rarity: "rare", multiplier: 1, color: "#FFD700" },
      { id: "anchor", name: "Ship Anchor", image: "", value: 200, rarity: "rare", multiplier: 1, color: "#696969" },
      { id: "pearl", name: "Pearl", image: "", value: 150, rarity: "uncommon", multiplier: 1, color: "#F8F8FF" },
      { id: "shell", name: "Seashell", image: "", value: 100, rarity: "uncommon", multiplier: 1, color: "#FFB6C1" },
      { id: "fish", name: "Tropical Fish", image: "", value: 75, rarity: "common", multiplier: 1, color: "#FF4500" }
    ],
    winConditions: [
      { id: "wild_5", symbolId: "wild", count: 5, payout: 1000, paylineRequired: true },
      { id: "treasure_5", symbolId: "treasure", count: 5, payout: 300, paylineRequired: true }
    ],
    rtp: 95.7,
    volatility: "medium",
    minBet: 0.01,
    maxBet: 100,
    bonusFeatures: [],
    soundEffects: { spinSound: "/sounds/ocean-spin.mp3", winSound: "/sounds/ocean-win.mp3", bonusSound: "/sounds/ocean-bonus.mp3", backgroundMusic: "/sounds/ocean-bg.mp3", volume: 0.7 },
    animations: { spinDuration: 2000, reelDelay: 200, winAnimationDuration: 1500, symbolAnimations: {} },
    created: new Date(),
    updated: new Date(),
    active: true,
    featured: false
  },
  {
    id: "coinkrazy_fire_dragons",
    name: "Fire Dragons",
    description: "Awaken the ancient dragons and claim their legendary fire-forged treasures!",
    theme: "Dragon Fantasy",
    provider: "CoinKrazy",
    thumbnail: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHJhZGlhbEdyYWRpZW50IGlkPSJkcmFnb25HcmFkIiBjeD0iNTAlIiBjeT0iNTAlIiByPSI1MCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNGRjAwMDA7c3RvcC1vcGFjaXR5OjEiIC8+PHN0b3Agb2Zmc2V0PSI1MCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNEQzI2MjY7c3RvcC1vcGFjaXR5OjEiIC8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojN0YxRDFEO3N0b3Atb3BhY2l0eToxIiAvPjwvcmFkaWFsR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSJ1cmwoI2RyYWdvbkdyYWQpIi8+PHRleHQgeD0iMjAwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkZJUkUgRFJBR09OUzwvdGV4dD48dGV4dCB4PSIyMDAiIHk9IjI1MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Q29pbktyYXp5LmNvbTwvdGV4dD48Y2lyY2xlIGN4PSIxMDAiIGN5PSIxNDAiIHI9IjMwIiBmaWxsPSIjRkZENzAwIiBzdHJva2U9IiNGRjAwMDAiIHN0cm9rZS13aWR0aD0iNCIvPjxjaXJjbGUgY3g9IjMwMCIgY3k9IjE0MCIgcj0iMjAiIGZpbGw9IiNGRjQ1MDAiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSIzIi8+PHBvbHlnb24gcG9pbnRzPSIyMDAsMTIwIDIzMCwxNDAsMjAwLDE2MCAxNzAsMTQwIiBmaWxsPSIjRkZENzAwIiBzdHJva2U9IiNGRjAwMDAiIHN0cm9rZS13aWR0aD0iMyIvPjwvc3ZnPg==",
    backgroundImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHJhZGlhbEdyYWRpZW50IGlkPSJkcmFnb25CZyIgY3g9IjUwJSIgY3k9IjUwJSIgcj0iNTAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojN0YxRDFEO3N0b3Atb3BhY2l0eToxIiAvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFFMTEyNDtzdG9wLW9wYWNpdHk6MSIgLz48L3JhZGlhbEdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0idXJsKCNkcmFnb25CZykiLz48L3N2Zz4=",
    reels: Array.from({length: 5}, (_, i) => ({
      id: `reel_${i}`,
      position: i,
      symbols: ["wild", "scatter", "dragon", "flame", "gem", "sword", "shield"],
      weight: { "wild": 1, "scatter": 2, "dragon": 3, "flame": 6, "gem": 8, "sword": 12, "shield": 16 }
    })),
    rows: 3,
    paylines: [
      { id: "line_1", name: "Center Line", positions: [{ reel: 0, row: 1 }, { reel: 1, row: 1 }, { reel: 2, row: 1 }, { reel: 3, row: 1 }, { reel: 4, row: 1 }], active: true },
      { id: "line_2", name: "Top Line", positions: [{ reel: 0, row: 0 }, { reel: 1, row: 0 }, { reel: 2, row: 0 }, { reel: 3, row: 0 }, { reel: 4, row: 0 }], active: true },
      { id: "line_3", name: "Bottom Line", positions: [{ reel: 0, row: 2 }, { reel: 1, row: 2 }, { reel: 2, row: 2 }, { reel: 3, row: 2 }, { reel: 4, row: 2 }], active: true }
    ],
    symbols: [
      { id: "wild", name: "Dragon Wild", image: "", value: 1200, rarity: "legendary", multiplier: 3, color: "#FFD700" },
      { id: "scatter", name: "Dragon Egg", image: "", value: 600, rarity: "epic", multiplier: 1, color: "#8B4513" },
      { id: "dragon", name: "Fire Dragon", image: "", value: 400, rarity: "rare", multiplier: 1, color: "#FF0000" },
      { id: "flame", name: "Dragon Flame", image: "", value: 250, rarity: "rare", multiplier: 1, color: "#FF4500" },
      { id: "gem", name: "Dragon Gem", image: "", value: 150, rarity: "uncommon", multiplier: 1, color: "#9400D3" },
      { id: "sword", name: "Dragon Sword", image: "", value: 100, rarity: "uncommon", multiplier: 1, color: "#C0C0C0" },
      { id: "shield", name: "Dragon Shield", image: "", value: 75, rarity: "common", multiplier: 1, color: "#B8860B" }
    ],
    winConditions: [
      { id: "wild_5", symbolId: "wild", count: 5, payout: 1200, paylineRequired: true },
      { id: "dragon_5", symbolId: "dragon", count: 5, payout: 400, paylineRequired: true }
    ],
    rtp: 96.4,
    volatility: "high",
    minBet: 0.01,
    maxBet: 100,
    bonusFeatures: [],
    soundEffects: { spinSound: "/sounds/dragon-spin.mp3", winSound: "/sounds/dragon-win.mp3", bonusSound: "/sounds/dragon-bonus.mp3", backgroundMusic: "/sounds/dragon-bg.mp3", volume: 0.7 },
    animations: { spinDuration: 2000, reelDelay: 200, winAnimationDuration: 1500, symbolAnimations: {} },
    created: new Date(),
    updated: new Date(),
    active: true,
    featured: false
  }
];
