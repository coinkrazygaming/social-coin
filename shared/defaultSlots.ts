import { SlotMachine } from "./slotTypes";

export const DEFAULT_COINKRAZY_SLOTS: SlotMachine[] = [
  {
    id: "coinkrazy_crypto_fortune",
    name: "Crypto Fortune",
    description: "Mine your way to digital riches with Bitcoin, Ethereum and CoinKrazy tokens!",
    theme: "Crypto Fortune",
    provider: "CoinKrazy",
    thumbnail: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImNyeXB0b0dyYWQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgo8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojRkZENzAwO3N0b3Atb3BhY2l0eToxIiAvPgo8c3RvcCBvZmZzZXQ9IjUwJSIgc3R5bGU9InN0b3AtY29sb3I6I0Y3OTMxRTtzdG9wLW9wYWNpdHk6MSIgLz4KPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojRkZENzAwO3N0b3Atb3BhY2l0eToxIiAvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSJ1cmwoI2NyeXB0b0dyYWQpIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iNTAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5DUllQVE8gRk9SVFVORTU8L3RleHQ+Cjx0ZXh0IHg9IjIwMCIgeT0iMjUwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Db2luS3JhenkuY29tPC90ZXh0Pgo8Y2lyY2xlIGN4PSIxMDAiIGN5PSIxNTAiIHI9IjMwIiBmaWxsPSIjRkY4QzAwIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjMiLz4KPHN2ZyB4PSI4NSIgeT0iMTM1IiB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIGZpbGw9IndoaXRlIj4KPHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiPjxwYXRoIGQ9Im0xMS45OTkgMS45OThjLTUuNTE4IDAtOS45OTggNC40OC05Ljk5OCA5Ljk5OHM0LjQ4IDkuOTk4IDkuOTk4IDkuOTk4IDkuOTk5LTQuNDggOS45OTktOS45OTgtNC40ODEtOS45OTgtOS45OTktOS45OTh6bTUuNTEyIDEzLjg0OGMtMS43MSAxLjM2LTMuODUyIDEuNzc4LTUuNTEyIDEuOTZ2MS4xODZoLTEuNHYtMS4xOThjLTEuMTU2LS4wNzItMi4yNjQtLjI1OC0zLjEzLS0uNTNsLjUwNC0yLjMwNGMuNzAyLjI1NCAxLjQ4OC40NjYgMi4zNTQuNTUydi0yLjc5NGMtMS43NzYtLjYxNi0zLjEzOC0xLjQyMi0zLjEzOC0zLjQzNiAwLTEuOTk2IDEuMzE4LTMuMzE2IDMuMTM4LTMuNjQ0di0xLjE5aDEuNHYxLjE1NGMxLjAzLjA1NCAyLjA2NC4yMyAyLjc5NC40NDhsLS41MSAyLjI2OGMtLjU1NC0uMjA0LTEuMjM4LS4zOTgtMS44ODQtLjQ0NnYyLjY4NGMxLjkzMi42NjIgMy4zNTIgMS40NjggMy4zNTIgMy41OTIgMCAyLjM3LTEuNDc2IDMuNS0zLjg1MiAzLjc2NHptLTQuMTEyLTEwLjQ4NGMwIDEuMjQ4LjcuMi0zMTF2LS4yNDZ6bTAgNS42NDJ2Mi44N2MxLjQxOC0uMTI2IDIuNDY0LS42MzggMi40NjQtMS42NDQgMC0xLjA3OC0uNzU2LTEuNTU0LTEuODY0LTEuOTJ6Ii8+PC9zdmc+Cjwvc3ZnPgo8Y2lyY2xlIGN4PSIzMDAiIGN5PSIxNTAiIHI9IjMwIiBmaWxsPSIjNjI3RUVBIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjMiLz4KPC9zdmc+",
    backgroundImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJiZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFhMjAyYztzdG9wLW9wYWNpdHk6MSIgLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMzNzQxNTE7c3RvcC1vcGFjaXR5OjEiIC8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjgwMCIgaGVpZ2h0PSI2MDAiIGZpbGw9InVybCgjYmcpIi8+PC9zdmc+",
    reels: [
      {
        id: "reel_0",
        position: 0,
        symbols: ["wild", "scatter", "bitcoin", "ethereum", "coinKrazy", "seven", "bar"],
        weight: { "wild": 1, "scatter": 2, "bitcoin": 5, "ethereum": 5, "coinKrazy": 3, "seven": 10, "bar": 20 }
      },
      {
        id: "reel_1",
        position: 1,
        symbols: ["wild", "scatter", "bitcoin", "ethereum", "coinKrazy", "seven", "bar"],
        weight: { "wild": 1, "scatter": 2, "bitcoin": 5, "ethereum": 5, "coinKrazy": 3, "seven": 10, "bar": 20 }
      },
      {
        id: "reel_2",
        position: 2,
        symbols: ["wild", "scatter", "bitcoin", "ethereum", "coinKrazy", "seven", "bar"],
        weight: { "wild": 1, "scatter": 2, "bitcoin": 5, "ethereum": 5, "coinKrazy": 3, "seven": 10, "bar": 20 }
      },
      {
        id: "reel_3",
        position: 3,
        symbols: ["wild", "scatter", "bitcoin", "ethereum", "coinKrazy", "seven", "bar"],
        weight: { "wild": 1, "scatter": 2, "bitcoin": 5, "ethereum": 5, "coinKrazy": 3, "seven": 10, "bar": 20 }
      },
      {
        id: "reel_4",
        position: 4,
        symbols: ["wild", "scatter", "bitcoin", "ethereum", "coinKrazy", "seven", "bar"],
        weight: { "wild": 1, "scatter": 2, "bitcoin": 5, "ethereum": 5, "coinKrazy": 3, "seven": 10, "bar": 20 }
      }
    ],
    rows: 3,
    paylines: [
      { id: "line_1", name: "Center Line", positions: [{ reel: 0, row: 1 }, { reel: 1, row: 1 }, { reel: 2, row: 1 }, { reel: 3, row: 1 }, { reel: 4, row: 1 }], active: true },
      { id: "line_2", name: "Top Line", positions: [{ reel: 0, row: 0 }, { reel: 1, row: 0 }, { reel: 2, row: 0 }, { reel: 3, row: 0 }, { reel: 4, row: 0 }], active: true },
      { id: "line_3", name: "Bottom Line", positions: [{ reel: 0, row: 2 }, { reel: 1, row: 2 }, { reel: 2, row: 2 }, { reel: 3, row: 2 }, { reel: 4, row: 2 }], active: true }
    ],
    symbols: [
      { id: "wild", name: "CoinKrazy Wild", image: "", value: 1000, rarity: "legendary", multiplier: 2, color: "#FFD700" },
      { id: "scatter", name: "Scatter Star", image: "", value: 500, rarity: "epic", multiplier: 1, color: "#FF6B6B" },
      { id: "bitcoin", name: "Bitcoin", image: "", value: 250, rarity: "rare", multiplier: 1, color: "#FF8C00" },
      { id: "ethereum", name: "Ethereum", image: "", value: 200, rarity: "rare", multiplier: 1, color: "#627EEA" },
      { id: "coinKrazy", name: "CoinKrazy Token", image: "", value: 150, rarity: "uncommon", multiplier: 1, color: "#FFD700" },
      { id: "seven", name: "Lucky 7", image: "", value: 100, rarity: "uncommon", multiplier: 1, color: "#4ECDC4" },
      { id: "bar", name: "Bar", image: "", value: 50, rarity: "common", multiplier: 1, color: "#45B7D1" }
    ],
    winConditions: [
      { id: "wild_5", symbolId: "wild", count: 5, payout: 1000, paylineRequired: true },
      { id: "bitcoin_5", symbolId: "bitcoin", count: 5, payout: 250, paylineRequired: true },
      { id: "ethereum_5", symbolId: "ethereum", count: 5, payout: 200, paylineRequired: true }
    ],
    rtp: 95.5,
    volatility: "medium",
    minBet: 0.01,
    maxBet: 100,
    bonusFeatures: [],
    soundEffects: { spinSound: "/sounds/spin.mp3", winSound: "/sounds/win.mp3", bonusSound: "/sounds/bonus.mp3", backgroundMusic: "/sounds/background.mp3", volume: 0.7 },
    animations: { spinDuration: 2000, reelDelay: 200, winAnimationDuration: 1500, symbolAnimations: {} },
    created: new Date(),
    updated: new Date(),
    active: true,
    featured: true
  },
  {
    id: "coinkrazy_space_odyssey",
    name: "Space Odyssey",
    description: "Journey through the cosmos and discover stellar rewards among the stars!",
    theme: "Space Odyssey",
    provider: "CoinKrazy",
    thumbnail: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxkZWZzPgo8cmFkaWFsR3JhZGllbnQgaWQ9InNwYWNlR3JhZCIgY3g9IjUwJSIgY3k9IjUwJSIgcj0iNTAlIj4KPHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzMzMDA4ODtzdG9wLW9wYWNpdHk6MSIgLz4KPHN0b3Agb2Zmc2V0PSI1MCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMxMTAwNDQ7c3RvcC1vcGFjaXR5OjEiIC8+CjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzAwMDAxMTtzdG9wLW9wYWNpdHk6MSIgLz4KPC9yYWRpYWxHcmFkaWVudD4KPC9kZWZzPgo8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0idXJsKCNzcGFjZUdyYWQpIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iNTAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5TUEFDRS9PUE9EU1NFWTwvdGV4dD4KPHR4dCB4PSIyMDAiIHk9IjI1MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Q29pbktyYXp5LmNvbTwvdGV4dD4KPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTIwIiByPSIzIiBmaWxsPSIjRkZGRkZGIi8+CjxjaXJjbGUgY3g9IjE1MCIgY3k9IjkwIiByPSIyIiBmaWxsPSIjRkZGRkZGIi8+CjxjaXJjbGUgY3g9IjMwMCIgY3k9IjExMCIgcj0iNCIgZmlsbD0iI0ZGRkZGRiIvPgo8Y2lyY2xlIGN4PSIzNTAiIGN5PSIxNDAiIHI9IjIiIGZpbGw9IiNGRkZGRkYiLz4KPGNpcmNsZSBjeD0iNzAiIGN5PSIxODAiIHI9IjMiIGZpbGw9IiNGRkZGRkYiLz4KPGVsbGlwc2UgY3g9IjIwMCIgY3k9IjE1MCIgcng9IjUwIiByeT0iMjAiIGZpbGw9IiNGRkQ3MDAiIG9wYWNpdHk9IjAuOCIvPgo8Y2lyY2xlIGN4PSIyMDAiIGN5PSIxNTAiIHI9IjE1IiBmaWxsPSIjRkY0NTAwIi8+CjwvcBnZz4=",
    backgroundImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHJhZGlhbEdyYWRpZW50IGlkPSJzcGFjZUJnIiBjeD0iNTAlIiBjeT0iNTAlIiByPSI1MCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMzMzAwODg7c3RvcC1vcGFjaXR5OjEiIC8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMDAwMDExO3N0b3Atb3BhY2l0eToxIiAvPjwvcmFkaWFsR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiBmaWxsPSJ1cmwoI3NwYWNlQmcpIi8+PC9zdmc+",
    reels: [
      {
        id: "reel_0",
        position: 0,
        symbols: ["wild", "scatter", "planet", "rocket", "star", "meteor", "crystal"],
        weight: { "wild": 1, "scatter": 2, "planet": 5, "rocket": 6, "star": 8, "meteor": 12, "crystal": 15 }
      },
      {
        id: "reel_1",
        position: 1,
        symbols: ["wild", "scatter", "planet", "rocket", "star", "meteor", "crystal"],
        weight: { "wild": 1, "scatter": 2, "planet": 5, "rocket": 6, "star": 8, "meteor": 12, "crystal": 15 }
      },
      {
        id: "reel_2",
        position: 2,
        symbols: ["wild", "scatter", "planet", "rocket", "star", "meteor", "crystal"],
        weight: { "wild": 1, "scatter": 2, "planet": 5, "rocket": 6, "star": 8, "meteor": 12, "crystal": 15 }
      },
      {
        id: "reel_3",
        position: 3,
        symbols: ["wild", "scatter", "planet", "rocket", "star", "meteor", "crystal"],
        weight: { "wild": 1, "scatter": 2, "planet": 5, "rocket": 6, "star": 8, "meteor": 12, "crystal": 15 }
      },
      {
        id: "reel_4",
        position: 4,
        symbols: ["wild", "scatter", "planet", "rocket", "star", "meteor", "crystal"],
        weight: { "wild": 1, "scatter": 2, "planet": 5, "rocket": 6, "star": 8, "meteor": 12, "crystal": 15 }
      }
    ],
    rows: 3,
    paylines: [
      { id: "line_1", name: "Center Line", positions: [{ reel: 0, row: 1 }, { reel: 1, row: 1 }, { reel: 2, row: 1 }, { reel: 3, row: 1 }, { reel: 4, row: 1 }], active: true },
      { id: "line_2", name: "Top Line", positions: [{ reel: 0, row: 0 }, { reel: 1, row: 0 }, { reel: 2, row: 0 }, { reel: 3, row: 0 }, { reel: 4, row: 0 }], active: true },
      { id: "line_3", name: "Bottom Line", positions: [{ reel: 0, row: 2 }, { reel: 1, row: 2 }, { reel: 2, row: 2 }, { reel: 3, row: 2 }, { reel: 4, row: 2 }], active: true }
    ],
    symbols: [
      { id: "wild", name: "Cosmic Wild", image: "", value: 1000, rarity: "legendary", multiplier: 3, color: "#FFD700" },
      { id: "scatter", name: "Nebula Scatter", image: "", value: 500, rarity: "epic", multiplier: 1, color: "#9333EA" },
      { id: "planet", name: "Golden Planet", image: "", value: 300, rarity: "rare", multiplier: 1, color: "#F59E0B" },
      { id: "rocket", name: "Space Rocket", image: "", value: 200, rarity: "rare", multiplier: 1, color: "#EF4444" },
      { id: "star", name: "Star Cluster", image: "", value: 150, rarity: "uncommon", multiplier: 1, color: "#06B6D4" },
      { id: "meteor", name: "Meteor", image: "", value: 100, rarity: "uncommon", multiplier: 1, color: "#F97316" },
      { id: "crystal", name: "Space Crystal", image: "", value: 75, rarity: "common", multiplier: 1, color: "#8B5CF6" }
    ],
    winConditions: [
      { id: "wild_5", symbolId: "wild", count: 5, payout: 1000, paylineRequired: true },
      { id: "planet_5", symbolId: "planet", count: 5, payout: 300, paylineRequired: true },
      { id: "rocket_5", symbolId: "rocket", count: 5, payout: 200, paylineRequired: true }
    ],
    rtp: 96.2,
    volatility: "high",
    minBet: 0.01,
    maxBet: 100,
    bonusFeatures: [],
    soundEffects: { spinSound: "/sounds/space-spin.mp3", winSound: "/sounds/space-win.mp3", bonusSound: "/sounds/space-bonus.mp3", backgroundMusic: "/sounds/space-bg.mp3", volume: 0.7 },
    animations: { spinDuration: 2000, reelDelay: 200, winAnimationDuration: 1500, symbolAnimations: {} },
    created: new Date(),
    updated: new Date(),
    active: true,
    featured: true
  },
  {
    id: "coinkrazy_gaming_quest",
    name: "Gaming Quest",
    description: "Level up through retro gaming worlds and unlock legendary power-ups!",
    theme: "Video Game Adventure",
    provider: "CoinKrazy",
    thumbnail: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImdhbWluZ0dyYWQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgo8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMDBGRjAwO3N0b3Atb3BhY2l0eToxIiAvPgo8c3RvcCBvZmZzZXQ9IjUwJSIgc3R5bGU9InN0b3AtY29sb3I6IzAwODgwMDtzdG9wLW9wYWNpdHk6MSIgLz4KPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMDBGRjAwO3N0b3Atb3BhY2l0eToxIiAvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSJ1cmwoI2dhbWluZ0dyYWQpIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iNTAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5HQU1JTkcgUVVFU1Q8L3RleHQ+Cjx0ZXh0IHg9IjIwMCIgeT0iMjUwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Db2luS3JhenkuY29tPC90ZXh0Pgo8cmVjdCB4PSI4MCIgeT0iMTIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IiNGRkZGRkYiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSIzIi8+CjxyZWN0IHg9IjI4MCIgeT0iMTIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IiNGRkQwMDAiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSIzIi8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjE0MCIgcj0iMzAiIGZpbGw9IiNGRjAwMDAiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSIzIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTgiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UEwxPC90ZXh0Pgo8L3N2Zz4=",
    backgroundImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnYW1lQmciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMwMDQ0MDA7c3RvcC1vcGFjaXR5OjEiIC8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMDAxMTAwO3N0b3Atb3BhY2l0eToxIiAvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiBmaWxsPSJ1cmwoI2dhbWVCZykiLz48L3N2Zz4=",
    reels: [
      {
        id: "reel_0",
        position: 0,
        symbols: ["wild", "scatter", "powerUp", "controller", "coin", "mushroom", "star"],
        weight: { "wild": 1, "scatter": 2, "powerUp": 4, "controller": 6, "coin": 10, "mushroom": 12, "star": 15 }
      },
      {
        id: "reel_1",
        position: 1,
        symbols: ["wild", "scatter", "powerUp", "controller", "coin", "mushroom", "star"],
        weight: { "wild": 1, "scatter": 2, "powerUp": 4, "controller": 6, "coin": 10, "mushroom": 12, "star": 15 }
      },
      {
        id: "reel_2",
        position: 2,
        symbols: ["wild", "scatter", "powerUp", "controller", "coin", "mushroom", "star"],
        weight: { "wild": 1, "scatter": 2, "powerUp": 4, "controller": 6, "coin": 10, "mushroom": 12, "star": 15 }
      },
      {
        id: "reel_3",
        position: 3,
        symbols: ["wild", "scatter", "powerUp", "controller", "coin", "mushroom", "star"],
        weight: { "wild": 1, "scatter": 2, "powerUp": 4, "controller": 6, "coin": 10, "mushroom": 12, "star": 15 }
      },
      {
        id: "reel_4",
        position: 4,
        symbols: ["wild", "scatter", "powerUp", "controller", "coin", "mushroom", "star"],
        weight: { "wild": 1, "scatter": 2, "powerUp": 4, "controller": 6, "coin": 10, "mushroom": 12, "star": 15 }
      }
    ],
    rows: 3,
    paylines: [
      { id: "line_1", name: "Center Line", positions: [{ reel: 0, row: 1 }, { reel: 1, row: 1 }, { reel: 2, row: 1 }, { reel: 3, row: 1 }, { reel: 4, row: 1 }], active: true },
      { id: "line_2", name: "Top Line", positions: [{ reel: 0, row: 0 }, { reel: 1, row: 0 }, { reel: 2, row: 0 }, { reel: 3, row: 0 }, { reel: 4, row: 0 }], active: true },
      { id: "line_3", name: "Bottom Line", positions: [{ reel: 0, row: 2 }, { reel: 1, row: 2 }, { reel: 2, row: 2 }, { reel: 3, row: 2 }, { reel: 4, row: 2 }], active: true }
    ],
    symbols: [
      { id: "wild", name: "Boss Wild", image: "", value: 1000, rarity: "legendary", multiplier: 2, color: "#FFD700" },
      { id: "scatter", name: "Bonus Portal", image: "", value: 500, rarity: "epic", multiplier: 1, color: "#8B5CF6" },
      { id: "powerUp", name: "Power Up", image: "", value: 300, rarity: "rare", multiplier: 1, color: "#EF4444" },
      { id: "controller", name: "Controller", image: "", value: 200, rarity: "rare", multiplier: 1, color: "#3B82F6" },
      { id: "coin", name: "Game Coin", image: "", value: 150, rarity: "uncommon", multiplier: 1, color: "#FFD700" },
      { id: "mushroom", name: "1-UP Mushroom", image: "", value: 100, rarity: "uncommon", multiplier: 1, color: "#22C55E" },
      { id: "star", name: "Star", image: "", value: 75, rarity: "common", multiplier: 1, color: "#FBBF24" }
    ],
    winConditions: [
      { id: "wild_5", symbolId: "wild", count: 5, payout: 1000, paylineRequired: true },
      { id: "powerUp_5", symbolId: "powerUp", count: 5, payout: 300, paylineRequired: true },
      { id: "controller_5", symbolId: "controller", count: 5, payout: 200, paylineRequired: true }
    ],
    rtp: 95.8,
    volatility: "medium",
    minBet: 0.01,
    maxBet: 100,
    bonusFeatures: [],
    soundEffects: { spinSound: "/sounds/game-spin.mp3", winSound: "/sounds/game-win.mp3", bonusSound: "/sounds/game-bonus.mp3", backgroundMusic: "/sounds/game-bg.mp3", volume: 0.7 },
    animations: { spinDuration: 2000, reelDelay: 200, winAnimationDuration: 1500, symbolAnimations: {} },
    created: new Date(),
    updated: new Date(),
    active: true,
    featured: true
  },
  {
    id: "coinkrazy_wild_west",
    name: "Wild West Gold",
    description: "Strike it rich in the old frontier with outlaws, sheriffs, and golden nuggets!",
    theme: "Wild West Gold",
    provider: "CoinKrazy",
    thumbnail: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9Indlc3RHcmFkIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KPHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6I0Q4NEIwMTtzdG9wLW9wYWNpdHk6MSIgLz4KPHN0b3Agb2Zmc2V0PSI1MCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNGNTk1MTY7c3RvcC1vcGFjaXR5OjEiIC8+CjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I0Q4NEIwMTtzdG9wLW9wYWNpdHk6MSIgLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0idXJsKCN3ZXN0R3JhZCkiLz4KPHR4dCB4PSIyMDAiIHk9IjUwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+V0lMRCBXRVNUIEdPTEQ8L3RleHQ+Cjx0ZXh0IHg9IjIwMCIgeT0iMjUwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Db2luS3JhenkuY29tPC90ZXh0Pgo8Y2lyY2xlIGN4PSIxMDAiIGN5PSIxNDAiIHI9IjIwIiBmaWxsPSIjRkZENzAwIiBzdHJva2U9IiM5MjQwMDAiIHN0cm9rZS13aWR0aD0iMyIvPgo8cmVjdCB4PSIzMDAiIHk9IjEyMCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjOTI0MDAwIiBzdHJva2U9IiNGRkQ3MDAiIHN0cm9rZS13aWR0aD0iMiIvPgo8cG9seWdvbiBwb2ludHM9IjIwMCwxMjAgMjIwLDE0MCAyMDAsMTYwIDE4MCwxNDAiIGZpbGw9IiNGRkQ3MDAiIHN0cm9rZT0iIzkyNDAwMCIgc3Ryb2tlLXdpZHRoPSIyIi8+CjwvcBnZz4=",
    backgroundImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJ3ZXN0QmciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM0NEE5MDg7c3RvcC1vcGFjaXR5OjEiIC8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMTY1MzE1O3N0b3Atb3BhY2l0eToxIiAvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiBmaWxsPSJ1cmwoI3dlc3RCZykiLz48L3N2Zz4=",
    reels: [
      {
        id: "reel_0",
        position: 0,
        symbols: ["wild", "scatter", "sheriff", "outlaw", "nugget", "horseshoe", "cactus"],
        weight: { "wild": 1, "scatter": 2, "sheriff": 4, "outlaw": 5, "nugget": 8, "horseshoe": 12, "cactus": 18 }
      },
      {
        id: "reel_1",
        position: 1,
        symbols: ["wild", "scatter", "sheriff", "outlaw", "nugget", "horseshoe", "cactus"],
        weight: { "wild": 1, "scatter": 2, "sheriff": 4, "outlaw": 5, "nugget": 8, "horseshoe": 12, "cactus": 18 }
      },
      {
        id: "reel_2",
        position: 2,
        symbols: ["wild", "scatter", "sheriff", "outlaw", "nugget", "horseshoe", "cactus"],
        weight: { "wild": 1, "scatter": 2, "sheriff": 4, "outlaw": 5, "nugget": 8, "horseshoe": 12, "cactus": 18 }
      },
      {
        id: "reel_3",
        position: 3,
        symbols: ["wild", "scatter", "sheriff", "outlaw", "nugget", "horseshoe", "cactus"],
        weight: { "wild": 1, "scatter": 2, "sheriff": 4, "outlaw": 5, "nugget": 8, "horseshoe": 12, "cactus": 18 }
      },
      {
        id: "reel_4",
        position: 4,
        symbols: ["wild", "scatter", "sheriff", "outlaw", "nugget", "horseshoe", "cactus"],
        weight: { "wild": 1, "scatter": 2, "sheriff": 4, "outlaw": 5, "nugget": 8, "horseshoe": 12, "cactus": 18 }
      }
    ],
    rows: 3,
    paylines: [
      { id: "line_1", name: "Center Line", positions: [{ reel: 0, row: 1 }, { reel: 1, row: 1 }, { reel: 2, row: 1 }, { reel: 3, row: 1 }, { reel: 4, row: 1 }], active: true },
      { id: "line_2", name: "Top Line", positions: [{ reel: 0, row: 0 }, { reel: 1, row: 0 }, { reel: 2, row: 0 }, { reel: 3, row: 0 }, { reel: 4, row: 0 }], active: true },
      { id: "line_3", name: "Bottom Line", positions: [{ reel: 0, row: 2 }, { reel: 1, row: 2 }, { reel: 2, row: 2 }, { reel: 3, row: 2 }, { reel: 4, row: 2 }], active: true }
    ],
    symbols: [
      { id: "wild", name: "Sheriff Wild", image: "", value: 1000, rarity: "legendary", multiplier: 2, color: "#FFD700" },
      { id: "scatter", name: "Wanted Poster", image: "", value: 500, rarity: "epic", multiplier: 1, color: "#DC2626" },
      { id: "sheriff", name: "Sheriff", image: "", value: 400, rarity: "rare", multiplier: 1, color: "#1F2937" },
      { id: "outlaw", name: "Outlaw", image: "", value: 300, rarity: "rare", multiplier: 1, color: "#374151" },
      { id: "nugget", name: "Gold Nugget", image: "", value: 200, rarity: "uncommon", multiplier: 1, color: "#F59E0B" },
      { id: "horseshoe", name: "Horseshoe", image: "", value: 100, rarity: "uncommon", multiplier: 1, color: "#6B7280" },
      { id: "cactus", name: "Cactus", image: "", value: 75, rarity: "common", multiplier: 1, color: "#16A34A" }
    ],
    winConditions: [
      { id: "wild_5", symbolId: "wild", count: 5, payout: 1000, paylineRequired: true },
      { id: "sheriff_5", symbolId: "sheriff", count: 5, payout: 400, paylineRequired: true },
      { id: "outlaw_5", symbolId: "outlaw", count: 5, payout: 300, paylineRequired: true }
    ],
    rtp: 94.9,
    volatility: "high",
    minBet: 0.01,
    maxBet: 100,
    bonusFeatures: [],
    soundEffects: { spinSound: "/sounds/west-spin.mp3", winSound: "/sounds/west-win.mp3", bonusSound: "/sounds/west-bonus.mp3", backgroundMusic: "/sounds/west-bg.mp3", volume: 0.7 },
    animations: { spinDuration: 2000, reelDelay: 200, winAnimationDuration: 1500, symbolAnimations: {} },
    created: new Date(),
    updated: new Date(),
    active: true,
    featured: true
  },
  {
    id: "coinkrazy_mystic_magic",
    name: "Mystic Magic",
    description: "Cast spells and brew potions in this magical realm of wizards and enchantments!",
    theme: "Mystic Magic",
    provider: "CoinKrazy",
    thumbnail: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxkZWZzPgo8cmFkaWFsR3JhZGllbnQgaWQ9Im1hZ2ljR3JhZCIgY3g9IjUwJSIgY3k9IjUwJSIgcj0iNTAlIj4KPHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzU5MzNjYztzdG9wLW9wYWNpdHk6MSIgLz4KPHN0b3Agb2Zmc2V0PSI1MCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM4YjVjZjY7c3RvcC1vcGFjaXR5OjEiIC8+CjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzQ2MjNhYTtzdG9wLW9wYWNpdHk6MSIgLz4KPC9yYWRpYWxHcmFkaWVudD4KPC9kZWZzPgo8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0idXJsKCNtYWdpY0dyYWQpIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iNTAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5NWVNUSUMGBUT0FHSTUwvdGV4dD4KPHR4dCB4PSIyMDAiIHk9IjI1MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Q29pbktyYXp5LmNvbTwvdGV4dD4KPHBvbHlnb24gcG9pbnRzPSIxMDAsMTIwIDExNSwxNDAgMTAwLDE2MCA4NSwxNDAiIGZpbGw9IiNGRkQ3MDAiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjE0MCIgcj0iMjUiIGZpbGw9IiNGRjAwRkYiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSIzIiBvcGFjaXR5PSIwLjgiLz4KPHJlY3QgeD0iMjgwIiB5PSIxMjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0iIzAwRkZGRiIgc3Ryb2tlPSIjRkZGRkZGIiBzdHJva2Utd2lkdGg9IjIiIG9wYWNpdHk9IjAuOCIvPgo8L3N2Zz4=",
    backgroundImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHJhZGlhbEdyYWRpZW50IGlkPSJtYWdpY0JnIiBjeD0iNTAlIiBjeT0iNTAlIiByPSI1MCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM1OTMzY2M7c3RvcC1vcGFjaXR5OjEiIC8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMzEwZTY4O3N0b3Atb3BhY2l0eToxIiAvPjwvcmFkaWFsR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiBmaWxsPSJ1cmwoI21hZ2ljQmcpIi8+PC9zdmc+",
    reels: [
      {
        id: "reel_0",
        position: 0,
        symbols: ["wild", "scatter", "wizard", "crystal", "potion", "spell", "wand"],
        weight: { "wild": 1, "scatter": 2, "wizard": 4, "crystal": 6, "potion": 10, "spell": 14, "wand": 18 }
      },
      {
        id: "reel_1",
        position: 1,
        symbols: ["wild", "scatter", "wizard", "crystal", "potion", "spell", "wand"],
        weight: { "wild": 1, "scatter": 2, "wizard": 4, "crystal": 6, "potion": 10, "spell": 14, "wand": 18 }
      },
      {
        id: "reel_2",
        position: 2,
        symbols: ["wild", "scatter", "wizard", "crystal", "potion", "spell", "wand"],
        weight: { "wild": 1, "scatter": 2, "wizard": 4, "crystal": 6, "potion": 10, "spell": 14, "wand": 18 }
      },
      {
        id: "reel_3",
        position: 3,
        symbols: ["wild", "scatter", "wizard", "crystal", "potion", "spell", "wand"],
        weight: { "wild": 1, "scatter": 2, "wizard": 4, "crystal": 6, "potion": 10, "spell": 14, "wand": 18 }
      },
      {
        id: "reel_4",
        position: 4,
        symbols: ["wild", "scatter", "wizard", "crystal", "potion", "spell", "wand"],
        weight: { "wild": 1, "scatter": 2, "wizard": 4, "crystal": 6, "potion": 10, "spell": 14, "wand": 18 }
      }
    ],
    rows: 3,
    paylines: [
      { id: "line_1", name: "Center Line", positions: [{ reel: 0, row: 1 }, { reel: 1, row: 1 }, { reel: 2, row: 1 }, { reel: 3, row: 1 }, { reel: 4, row: 1 }], active: true },
      { id: "line_2", name: "Top Line", positions: [{ reel: 0, row: 0 }, { reel: 1, row: 0 }, { reel: 2, row: 0 }, { reel: 3, row: 0 }, { reel: 4, row: 0 }], active: true },
      { id: "line_3", name: "Bottom Line", positions: [{ reel: 0, row: 2 }, { reel: 1, row: 2 }, { reel: 2, row: 2 }, { reel: 3, row: 2 }, { reel: 4, row: 2 }], active: true }
    ],
    symbols: [
      { id: "wild", name: "Arcane Wild", image: "", value: 1000, rarity: "legendary", multiplier: 3, color: "#FFD700" },
      { id: "scatter", name: "Magic Portal", image: "", value: 500, rarity: "epic", multiplier: 1, color: "#8B5CF6" },
      { id: "wizard", name: "Grand Wizard", image: "", value: 350, rarity: "rare", multiplier: 1, color: "#3B82F6" },
      { id: "crystal", name: "Magic Crystal", image: "", value: 250, rarity: "rare", multiplier: 1, color: "#EC4899" },
      { id: "potion", name: "Healing Potion", image: "", value: 150, rarity: "uncommon", multiplier: 1, color: "#10B981" },
      { id: "spell", name: "Spell Book", image: "", value: 100, rarity: "uncommon", multiplier: 1, color: "#F59E0B" },
      { id: "wand", name: "Magic Wand", image: "", value: 75, rarity: "common", multiplier: 1, color: "#8B5CF6" }
    ],
    winConditions: [
      { id: "wild_5", symbolId: "wild", count: 5, payout: 1000, paylineRequired: true },
      { id: "wizard_5", symbolId: "wizard", count: 5, payout: 350, paylineRequired: true },
      { id: "crystal_5", symbolId: "crystal", count: 5, payout: 250, paylineRequired: true }
    ],
    rtp: 96.1,
    volatility: "medium",
    minBet: 0.01,
    maxBet: 100,
    bonusFeatures: [],
    soundEffects: { spinSound: "/sounds/magic-spin.mp3", winSound: "/sounds/magic-win.mp3", bonusSound: "/sounds/magic-bonus.mp3", backgroundMusic: "/sounds/magic-bg.mp3", volume: 0.7 },
    animations: { spinDuration: 2000, reelDelay: 200, winAnimationDuration: 1500, symbolAnimations: {} },
    created: new Date(),
    updated: new Date(),
    active: true,
    featured: true
  }
];
