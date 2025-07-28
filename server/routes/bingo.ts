import { RequestHandler } from "express";
import { BingoGame, BingoCard, BingoNumber, BingoPattern, BingoRoom, BingoWinner } from "@shared/bingoTypes";

// In-memory storage (replace with real database)
const bingoGames: Map<string, BingoGame> = new Map();
const bingoCards: Map<string, BingoCard[]> = new Map();
const bingoNumbers: Map<string, BingoNumber[]> = new Map();
const bingoRooms: Map<string, BingoRoom> = new Map();

// Bingo patterns
const patterns: BingoPattern[] = [
  {
    id: 'line-horizontal',
    name: 'Horizontal Line',
    description: 'Complete any horizontal line',
    icon: '➖',
    winningPositions: [
      [[0,0], [0,1], [0,2], [0,3], [0,4]],
      [[1,0], [1,1], [1,2], [1,3], [1,4]],
      [[2,0], [2,1], [2,2], [2,3], [2,4]],
      [[3,0], [3,1], [3,2], [3,3], [3,4]],
      [[4,0], [4,1], [4,2], [4,3], [4,4]]
    ],
    difficulty: 'easy'
  },
  {
    id: 'line-vertical',
    name: 'Vertical Line',
    description: 'Complete any vertical line',
    icon: '|',
    winningPositions: [
      [[0,0], [1,0], [2,0], [3,0], [4,0]],
      [[0,1], [1,1], [2,1], [3,1], [4,1]],
      [[0,2], [1,2], [2,2], [3,2], [4,2]],
      [[0,3], [1,3], [2,3], [3,3], [4,3]],
      [[0,4], [1,4], [2,4], [3,4], [4,4]]
    ],
    difficulty: 'easy'
  },
  {
    id: 'diagonal',
    name: 'Diagonal',
    description: 'Complete any diagonal line',
    icon: '╲',
    winningPositions: [
      [[0,0], [1,1], [2,2], [3,3], [4,4]],
      [[0,4], [1,3], [2,2], [3,1], [4,0]]
    ],
    difficulty: 'medium'
  },
  {
    id: 'four-corners',
    name: 'Four Corners',
    description: 'Mark all four corners',
    icon: '⬛',
    winningPositions: [
      [[0,0], [0,4], [4,0], [4,4]]
    ],
    difficulty: 'medium'
  },
  {
    id: 'full-house',
    name: 'Full House',
    description: 'Mark all numbers on the card',
    icon: '🏠',
    winningPositions: [
      Array.from({length: 5}, (_, i) => 
        Array.from({length: 5}, (_, j) => [i, j])
      ).flat()
    ],
    difficulty: 'hard'
  }
];

// Initialize bingo rooms
const initializeBingoRooms = () => {
  const freeRoom: BingoRoom = {
    id: 'free-gc-room',
    name: 'Free Play Lounge',
    description: 'Play bingo for free with Gold Coins',
    currency: 'GC',
    maxCapacity: 100,
    currentOccupancy: 45,
    activeGames: [],
    schedule: [],
    isFreePlay: true
  };

  const premiumRoom: BingoRoom = {
    id: 'premium-sc-room',
    name: 'Premium Prize Hall',
    description: 'Play with Sweeps Coins for real prizes',
    currency: 'SC',
    maxCapacity: 50,
    currentOccupancy: 23,
    activeGames: [],
    schedule: [],
    isFreePlay: false
  };

  bingoRooms.set(freeRoom.id, freeRoom);
  bingoRooms.set(premiumRoom.id, premiumRoom);

  // Create scheduled games
  createScheduledGames();
};

const createScheduledGames = () => {
  const now = new Date();
  
  // Create GC games every 10 minutes
  for (let i = 0; i < 6; i++) {
    const startTime = new Date(now.getTime() + (i * 10 * 60 * 1000));
    const game: BingoGame = {
      id: `gc-game-${i}`,
      name: `Free Bingo Game ${i + 1}`,
      description: 'Play for free with Gold Coins',
      currency: 'GC',
      ticketPrice: 0,
      maxPlayers: 100,
      currentPlayers: Math.floor(Math.random() * 30) + 10,
      status: i === 0 ? 'starting' : 'waiting',
      startTime,
      duration: 15,
      timeRemaining: i === 0 ? 300 : Math.floor((startTime.getTime() - now.getTime()) / 1000),
      pattern: patterns[Math.floor(Math.random() * patterns.length)],
      prizePool: 5000 + (i * 1000),
      winners: [],
      isScheduled: true,
      nextScheduledTime: new Date(startTime.getTime() + 25 * 60 * 1000)
    };
    
    bingoGames.set(game.id, game);
    bingoNumbers.set(game.id, generateBingoNumbers());
  }

  // Create SC games every 30 minutes
  for (let i = 0; i < 3; i++) {
    const startTime = new Date(now.getTime() + (i * 30 * 60 * 1000));
    const game: BingoGame = {
      id: `sc-game-${i}`,
      name: `Premium Bingo Game ${i + 1}`,
      description: 'Play with Sweeps Coins for real prizes',
      currency: 'SC',
      ticketPrice: 1,
      maxPlayers: 50,
      currentPlayers: Math.floor(Math.random() * 20) + 5,
      status: 'waiting',
      startTime,
      duration: 20,
      timeRemaining: Math.floor((startTime.getTime() - now.getTime()) / 1000),
      pattern: patterns[Math.floor(Math.random() * patterns.length)],
      prizePool: 25 + (i * 10),
      winners: [],
      isScheduled: true,
      nextScheduledTime: new Date(startTime.getTime() + 50 * 60 * 1000)
    };
    
    bingoGames.set(game.id, game);
    bingoNumbers.set(game.id, generateBingoNumbers());
  }
};

const generateBingoNumbers = (): BingoNumber[] => {
  const numbers: BingoNumber[] = [];
  const letters: ('B' | 'I' | 'N' | 'G' | 'O')[] = ['B', 'I', 'N', 'G', 'O'];
  
  letters.forEach((letter, letterIndex) => {
    const min = letterIndex * 15 + 1;
    const max = letterIndex * 15 + 15;
    
    for (let i = min; i <= max; i++) {
      numbers.push({
        number: i,
        letter,
        called: false
      });
    }
  });
  
  return numbers.sort(() => Math.random() - 0.5);
};

const generateBingoCard = (gameId: string, playerId: string, playerName: string): BingoCard => {
  const card: number[][] = [[], [], [], [], []];
  const letters = ['B', 'I', 'N', 'G', 'O'];
  
  letters.forEach((_, columnIndex) => {
    const min = columnIndex * 15 + 1;
    const max = columnIndex * 15 + 15;
    const columnNumbers: number[] = [];
    
    while (columnNumbers.length < 5) {
      const num = Math.floor(Math.random() * (max - min + 1)) + min;
      if (!columnNumbers.includes(num)) {
        columnNumbers.push(num);
      }
    }
    
    columnNumbers.sort((a, b) => a - b);
    
    for (let row = 0; row < 5; row++) {
      card[row][columnIndex] = columnNumbers[row];
    }
  });
  
  // Free space in center
  card[2][2] = 0; // Free space
  
  const bingoCard: BingoCard = {
    id: `card-${gameId}-${playerId}-${Date.now()}`,
    gameId,
    playerId,
    playerName,
    numbers: card,
    markedPositions: card.map(row => row.map((_, colIndex) => 
      row === 2 && colIndex === 2 // Free space is always marked
    )),
    isWinner: false,
    purchaseTime: new Date()
  };
  
  return bingoCard;
};

// Get all bingo rooms
export const handleGetRooms: RequestHandler = (req, res) => {
  const rooms = Array.from(bingoRooms.values());
  res.json(rooms);
};

// Get games in a room
export const handleGetRoomGames: RequestHandler = (req, res) => {
  const { roomId } = req.params;
  const games = Array.from(bingoGames.values()).filter(game => 
    (roomId === 'free-gc-room' && game.currency === 'GC') ||
    (roomId === 'premium-sc-room' && game.currency === 'SC')
  );
  
  res.json(games);
};

// Get specific game details
export const handleGetGame: RequestHandler = (req, res) => {
  const { gameId } = req.params;
  const game = bingoGames.get(gameId);
  
  if (!game) {
    return res.status(404).json({ error: 'Game not found' });
  }
  
  const calledNumbers = bingoNumbers.get(gameId)?.filter(n => n.called) || [];
  
  res.json({
    game,
    calledNumbers,
    patterns: patterns
  });
};

// Join a game (buy ticket)
export const handleJoinGame: RequestHandler = (req, res) => {
  const { gameId } = req.params;
  const { userId, username } = req.body;
  
  const game = bingoGames.get(gameId);
  if (!game) {
    return res.status(404).json({ error: 'Game not found' });
  }
  
  if (game.currentPlayers >= game.maxPlayers) {
    return res.status(400).json({ error: 'Game is full' });
  }
  
  if (game.status !== 'waiting') {
    return res.status(400).json({ error: 'Game has already started' });
  }
  
  // Check if player already has a card
  const existingCards = bingoCards.get(gameId) || [];
  if (existingCards.some(card => card.playerId === userId)) {
    return res.status(400).json({ error: 'You already have a card for this game' });
  }
  
  // Generate bingo card
  const card = generateBingoCard(gameId, userId, username);
  
  // Add card to game
  existingCards.push(card);
  bingoCards.set(gameId, existingCards);
  
  // Update player count
  game.currentPlayers++;
  bingoGames.set(gameId, game);
  
  res.json({ success: true, card });
};

// Get player's cards for a game
export const handleGetPlayerCards: RequestHandler = (req, res) => {
  const { gameId, userId } = req.params;
  const cards = bingoCards.get(gameId)?.filter(card => card.playerId === userId) || [];
  res.json(cards);
};

// Mark number on card
export const handleMarkNumber: RequestHandler = (req, res) => {
  const { cardId } = req.params;
  const { row, col } = req.body;
  
  // Find the card
  let foundCard: BingoCard | undefined;
  let gameCards: BingoCard[] | undefined;
  
  for (const [gameId, cards] of bingoCards.entries()) {
    foundCard = cards.find(card => card.id === cardId);
    if (foundCard) {
      gameCards = cards;
      break;
    }
  }
  
  if (!foundCard || !gameCards) {
    return res.status(404).json({ error: 'Card not found' });
  }
  
  // Toggle mark
  foundCard.markedPositions[row][col] = !foundCard.markedPositions[row][col];
  
  // Check for win
  const game = bingoGames.get(foundCard.gameId);
  if (game) {
    foundCard.isWinner = checkForWin(foundCard, game.pattern);
    if (foundCard.isWinner && !foundCard.winningPattern) {
      foundCard.winningPattern = game.pattern.name;
      // Add to winners
      const winner: BingoWinner = {
        id: `winner-${Date.now()}`,
        playerId: foundCard.playerId,
        playerName: foundCard.playerName,
        cardId: foundCard.id,
        pattern: game.pattern.name,
        prize: Math.floor(game.prizePool * 0.5), // 50% of prize pool for first winner
        currency: game.currency,
        timestamp: new Date()
      };
      game.winners.push(winner);
    }
  }
  
  res.json({ success: true, card: foundCard });
};

// Check if card has winning pattern
const checkForWin = (card: BingoCard, pattern: BingoPattern): boolean => {
  return pattern.winningPositions.some(positions => 
    positions.every(([row, col]) => card.markedPositions[row][col])
  );
};

// Get bingo patterns
export const handleGetPatterns: RequestHandler = (req, res) => {
  res.json(patterns);
};

// Admin: Start game manually
export const handleStartGame: RequestHandler = (req, res) => {
  const { gameId } = req.params;
  const game = bingoGames.get(gameId);
  
  if (!game) {
    return res.status(404).json({ error: 'Game not found' });
  }
  
  game.status = 'in-progress';
  game.startTime = new Date();
  bingoGames.set(gameId, game);
  
  res.json({ success: true, game });
};

// Get live game updates
export const handleGetLiveUpdates: RequestHandler = (req, res) => {
  const { gameId } = req.params;
  const calledNumbers = bingoNumbers.get(gameId)?.filter(n => n.called) || [];
  const game = bingoGames.get(gameId);
  
  res.json({
    calledNumbers: calledNumbers.slice(-5), // Last 5 called numbers
    gameStatus: game?.status,
    timeRemaining: game?.timeRemaining,
    winners: game?.winners || []
  });
};

// Initialize rooms on server start
initializeBingoRooms();

// Auto-update timers
setInterval(() => {
  for (const [gameId, game] of bingoGames.entries()) {
    if (game.status === 'waiting' || game.status === 'starting') {
      const now = new Date();
      game.timeRemaining = Math.max(0, Math.floor((game.startTime.getTime() - now.getTime()) / 1000));
      
      if (game.timeRemaining <= 0 && game.status === 'waiting') {
        game.status = 'starting';
        game.timeRemaining = 30; // 30 second countdown to start
      } else if (game.timeRemaining <= 0 && game.status === 'starting') {
        game.status = 'in-progress';
        game.timeRemaining = game.duration * 60; // Convert to seconds
      }
    } else if (game.status === 'in-progress') {
      game.timeRemaining = Math.max(0, game.timeRemaining - 1);
      
      if (game.timeRemaining <= 0) {
        game.status = 'completed';
      }
      
      // Call numbers periodically during game
      if (game.timeRemaining % 5 === 0) { // Every 5 seconds
        const numbers = bingoNumbers.get(gameId);
        if (numbers) {
          const uncalledNumbers = numbers.filter(n => !n.called);
          if (uncalledNumbers.length > 0) {
            const randomIndex = Math.floor(Math.random() * uncalledNumbers.length);
            uncalledNumbers[randomIndex].called = true;
            uncalledNumbers[randomIndex].calledTime = new Date();
          }
        }
      }
    }
    
    bingoGames.set(gameId, game);
  }
}, 1000);
