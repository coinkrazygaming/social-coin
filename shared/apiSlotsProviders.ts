// API Slots Provider Integration System
import { APIProvider, APIProviderGame, SocialCasinoGame } from './socialCasinoTypes';

export interface APIGameResponse {
  success: boolean;
  games: APIProviderGame[];
  error?: string;
  totalGames?: number;
  nextPage?: string;
}

export interface APISpinResponse {
  success: boolean;
  result: {
    reels: string[][];
    paylines: any[];
    winAmount: number;
    bonusTriggered: boolean;
    freeSpinsAwarded?: number;
  };
  error?: string;
}

export class APISlotProvidersService {
  private static providers: Map<string, APIProvider> = new Map();
  private static gameCache: Map<string, APIProviderGame[]> = new Map();
  private static readonly CACHE_DURATION = 3600000; // 1 hour
  private static lastCacheUpdate = new Map<string, number>();

  // Initialize with multiple no-cost API providers
  static initialize() {
    this.registerProviders();
    this.startCacheRefresh();
  }

  private static registerProviders() {
    // Demo/Test Providers (Free)
    this.providers.set('demo_provider', {
      id: 'demo_provider',
      name: 'Demo Games Provider',
      api_url: 'https://demo-api.slots.com/v1',
      api_key_encrypted: 'demo_key_encrypted',
      is_active: true,
      supported_currencies: ['GC', 'SC'],
      rate_limit_per_minute: 1000,
      cost_per_request: 0,
      games_count: 150,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    // Free Gaming API Provider
    this.providers.set('freegaming_api', {
      id: 'freegaming_api',
      name: 'Free Gaming API',
      api_url: 'https://api.freegaming.com/slots',
      api_key_encrypted: 'free_api_key_encrypted',
      is_active: true,
      supported_currencies: ['GC'],
      rate_limit_per_minute: 500,
      cost_per_request: 0,
      games_count: 200,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    // Open Source Slots Provider
    this.providers.set('opensource_slots', {
      id: 'opensource_slots',
      name: 'Open Source Slots',
      api_url: 'https://api.opensourceslots.org/v2',
      api_key_encrypted: 'opensource_key_encrypted',
      is_active: true,
      supported_currencies: ['GC', 'SC'],
      rate_limit_per_minute: 2000,
      cost_per_request: 0,
      games_count: 300,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    // Community Slots Provider
    this.providers.set('community_slots', {
      id: 'community_slots',
      name: 'Community Slots Network',
      api_url: 'https://community-slots.net/api',
      api_key_encrypted: 'community_key_encrypted',
      is_active: true,
      supported_currencies: ['GC'],
      rate_limit_per_minute: 750,
      cost_per_request: 0,
      games_count: 100,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    // Public Gaming Test API
    this.providers.set('public_test_api', {
      id: 'public_test_api',
      name: 'Public Gaming Test API',
      api_url: 'https://test-api.publicslotsdb.com',
      api_key_encrypted: 'public_test_key_encrypted',
      is_active: true,
      supported_currencies: ['GC', 'SC'],
      rate_limit_per_minute: 1500,
      cost_per_request: 0,
      games_count: 250,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }

  // Get all active providers
  static getActiveProviders(): APIProvider[] {
    return Array.from(this.providers.values()).filter(provider => provider.is_active);
  }

  // Fetch games from all providers
  static async fetchAllGames(): Promise<SocialCasinoGame[]> {
    const allGames: SocialCasinoGame[] = [];
    const providers = this.getActiveProviders();

    await Promise.all(providers.map(async (provider) => {
      try {
        const games = await this.fetchGamesFromProvider(provider.id);
        const convertedGames = games.map(game => this.convertAPIGameToSocialCasino(game, provider));
        allGames.push(...convertedGames);
      } catch (error) {
        console.error(`Error fetching games from ${provider.name}:`, error);
      }
    }));

    return allGames;
  }

  // Fetch games from specific provider
  static async fetchGamesFromProvider(providerId: string): Promise<APIProviderGame[]> {
    const provider = this.providers.get(providerId);
    if (!provider || !provider.is_active) {
      throw new Error(`Provider ${providerId} not found or inactive`);
    }

    // Check cache first
    const cachedGames = this.gameCache.get(providerId);
    const lastUpdate = this.lastCacheUpdate.get(providerId) || 0;
    
    if (cachedGames && Date.now() - lastUpdate < this.CACHE_DURATION) {
      return cachedGames;
    }

    // Fetch from API (simulated for now)
    const games = await this.simulateFetchFromAPI(provider);
    
    // Update cache
    this.gameCache.set(providerId, games);
    this.lastCacheUpdate.set(providerId, Date.now());

    return games;
  }

  // Convert API game to Social Casino format
  private static convertAPIGameToSocialCasino(
    apiGame: APIProviderGame, 
    provider: APIProvider
  ): SocialCasinoGame {
    return {
      id: `${provider.id}_${apiGame.external_game_id}`,
      name: apiGame.name,
      provider: provider.name,
      category: 'social_slots',
      game_type: provider.supported_currencies.includes('SC') ? 'BOTH' : 'GC',
      thumbnail: apiGame.thumbnail,
      description: `${apiGame.name} - Powered by ${provider.name}`,
      min_bet_gc: 1,
      max_bet_gc: 1000,
      min_bet_sc: 0.01,
      max_bet_sc: 10,
      rtp: apiGame.rtp,
      volatility: this.determineVolatility(apiGame.rtp),
      max_win_gc: apiGame.max_win,
      max_win_sc: apiGame.max_win / 100,
      paylines: 25, // Default
      features: this.extractFeatures(apiGame.metadata),
      is_active: apiGame.is_active,
      is_featured: false,
      api_provider: provider.id,
      api_game_id: apiGame.external_game_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      total_spins_today: 0,
      total_gc_earned_today: 0,
      total_sc_earned_today: 0,
      biggest_win_today: 0
    };
  }

  // Simulate API calls with realistic data
  private static async simulateFetchFromAPI(provider: APIProvider): Promise<APIProviderGame[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));

    const gameNames = [
      // Classic themed games
      'Golden Pharaoh\'s Treasure', 'Dragon\'s Fortune', 'Pirate\'s Gold Rush',
      'Mystic Forest Adventure', 'Egyptian Riches', 'Viking\'s Quest',
      'Aztec Sun Temple', 'Roman Empire Glory', 'Celtic Magic Stones',
      'Wild West Showdown', 'Samurai\'s Honor', 'Greek Gods Olympus',
      
      // Modern themed games
      'Neon City Nights', 'Space Odyssey 2077', 'Cyber Punk Revolution',
      'Ocean\'s Deep Mystery', 'Jungle Safari Wild', 'Arctic Adventure',
      'Diamond Luxury Club', 'Ruby Fortune Palace', 'Emerald Kingdom',
      'Crystal Cave Explorer', 'Fire Dragon\'s Lair', 'Ice Queen\'s Castle',
      
      // Fantasy themed games
      'Wizard\'s Magic Realm', 'Fairy Tale Dreams', 'Enchanted Forest',
      'Mermaid\'s Underwater World', 'Phoenix Rising Fire', 'Unicorn\'s Rainbow',
      'Castle of Shadows', 'Angel\'s Divine Light', 'Demon\'s Dark Portal',
      'Time Traveler\'s Journey', 'Alien Planet Discovery', 'Robot Wars Future',
      
      // Fruit and classic games
      'Classic Fruit Bonanza', 'Lucky 7s Jackpot', 'Triple Cherry Blast',
      'Diamond Triple Slots', 'Gold Bar Extravaganza', 'Royal Crown Jewels',
      'Lucky Clover Fields', 'Rainbow Fruit Mix', 'Mega Fruit Explosion',
      'Vintage Slot Machine', 'Retro Gaming Zone', 'Classic Vegas Style'
    ];

    const themes = [
      'Ancient Egypt', 'Fantasy Adventure', 'Pirate Treasure', 'Space Exploration',
      'Wild West', 'Underwater World', 'Mystical Forest', 'Dragon Legends',
      'Viking Saga', 'Greek Mythology', 'Roman Empire', 'Aztec Civilization',
      'Cyberpunk Future', 'Neon City', 'Jungle Adventure', 'Arctic Expedition',
      'Classic Fruit', 'Lucky 7s', 'Diamond Luxury', 'Royal Kingdom'
    ];

    const games: APIProviderGame[] = [];
    const gameCount = Math.min(provider.games_count, 50); // Limit for demo

    for (let i = 0; i < gameCount; i++) {
      const gameName = gameNames[Math.floor(Math.random() * gameNames.length)];
      const theme = themes[Math.floor(Math.random() * themes.length)];
      const rtp = 92 + Math.random() * 6; // 92-98% RTP
      
      games.push({
        id: `${provider.id}_game_${i + 1}`,
        provider_id: provider.id,
        external_game_id: `ext_${i + 1}`,
        name: `${gameName} ${i + 1}`,
        thumbnail: this.generateGameThumbnail(gameName, theme),
        category: 'slots',
        rtp: Math.round(rtp * 100) / 100,
        min_bet: 0.01,
        max_bet: 100,
        max_win: Math.floor(Math.random() * 100000) + 10000,
        is_active: Math.random() > 0.1, // 90% active
        last_sync_at: new Date().toISOString(),
        metadata: {
          theme,
          paylines: [5, 9, 20, 25, 50][Math.floor(Math.random() * 5)],
          volatility: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
          features: this.generateRandomFeatures()
        }
      });
    }

    return games;
  }

  // Generate colorful, themed thumbnails
  private static generateGameThumbnail(gameName: string, theme: string): string {
    const colors = {
      'Ancient Egypt': ['#FFD700', '#8B4513', '#4169E1'],
      'Fantasy Adventure': ['#8A2BE2', '#32CD32', '#FFD700'],
      'Pirate Treasure': ['#4169E1', '#8B4513', '#FFD700'],
      'Space Exploration': ['#000080', '#00FFFF', '#FF69B4'],
      'Wild West': ['#D2691E', '#8B4513', '#FFD700'],
      'Underwater World': ['#00CED1', '#4169E1', '#00FA9A'],
      'Mystical Forest': ['#228B22', '#8B4513', '#FFD700'],
      'Dragon Legends': ['#DC143C', '#FFD700', '#FF4500'],
      'Viking Saga': ['#2F4F4F', '#C0C0C0', '#FF0000'],
      'Greek Mythology': ['#FFFFFF', '#FFD700', '#4169E1'],
      'Roman Empire': ['#8B0000', '#FFD700', '#FFFFFF'],
      'Aztec Civilization': ['#DAA520', '#8B4513', '#32CD32'],
      'Cyberpunk Future': ['#00FFFF', '#FF00FF', '#000000'],
      'Neon City': ['#FF1493', '#00FFFF', '#ADFF2F'],
      'Jungle Adventure': ['#228B22', '#8B4513', '#FF4500'],
      'Arctic Expedition': ['#87CEEB', '#FFFFFF', '#4682B4'],
      'Classic Fruit': ['#FF0000', '#FFD700', '#32CD32'],
      'Lucky 7s': ['#FFD700', '#FF0000', '#FFFFFF'],
      'Diamond Luxury': ['#E6E6FA', '#FFD700', '#4169E1'],
      'Royal Kingdom': ['#8A2BE2', '#FFD700', '#DC143C']
    };

    const themeColors = colors[theme as keyof typeof colors] || ['#FFD700', '#4169E1', '#FF4500'];
    const [primary, secondary, accent] = themeColors;

    // Create SVG thumbnail with theme-appropriate design
    const svg = `
      <svg width="400" height="300" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${primary};stop-opacity:1" />
            <stop offset="50%" style="stop-color:${secondary};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${accent};stop-opacity:1" />
          </linearGradient>
          <radialGradient id="highlight" cx="50%" cy="30%" r="60%">
            <stop offset="0%" style="stop-color:#FFFFFF;stop-opacity:0.3" />
            <stop offset="100%" style="stop-color:#FFFFFF;stop-opacity:0" />
          </radialGradient>
        </defs>
        <rect width="400" height="300" fill="url(#bgGrad)"/>
        <rect width="400" height="300" fill="url(#highlight)"/>
        <text x="200" y="60" font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="white" text-anchor="middle" stroke="#000000" stroke-width="1">${gameName.split(' ').slice(0, 2).join(' ')}</text>
        <text x="200" y="250" font-family="Arial, sans-serif" font-size="14" fill="white" text-anchor="middle" opacity="0.9">CoinKrazy.com</text>
        <circle cx="100" cy="150" r="25" fill="${accent}" stroke="white" stroke-width="3" opacity="0.8"/>
        <circle cx="300" cy="120" r="20" fill="${primary}" stroke="white" stroke-width="2" opacity="0.7"/>
        <polygon points="200,110 230,140 200,170 170,140" fill="${secondary}" stroke="white" stroke-width="2" opacity="0.8"/>
        <rect x="80" y="180" width="30" height="30" fill="${primary}" stroke="white" stroke-width="2" opacity="0.6"/>
        <rect x="290" y="180" width="30" height="30" fill="${accent}" stroke="white" stroke-width="2" opacity="0.6"/>
      </svg>
    `;

    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
  }

  private static generateRandomFeatures(): string[] {
    const allFeatures = [
      'Wild Symbols', 'Scatter Pays', 'Free Spins', 'Bonus Rounds', 
      'Multipliers', 'Expanding Wilds', 'Stacked Symbols', 'Cascading Reels',
      'Re-spins', 'Pick & Click Bonus', 'Wheel of Fortune', 'Progressive Jackpot',
      'Mystery Symbols', 'Walking Wilds', 'Sticky Wilds', 'Symbol Upgrades'
    ];
    
    const featureCount = Math.floor(Math.random() * 4) + 2; // 2-5 features
    const selectedFeatures: string[] = [];
    
    while (selectedFeatures.length < featureCount) {
      const feature = allFeatures[Math.floor(Math.random() * allFeatures.length)];
      if (!selectedFeatures.includes(feature)) {
        selectedFeatures.push(feature);
      }
    }
    
    return selectedFeatures;
  }

  private static extractFeatures(metadata: any): string[] {
    return metadata?.features || ['Wild Symbols', 'Scatter Pays'];
  }

  private static determineVolatility(rtp: number): 'low' | 'medium' | 'high' {
    if (rtp >= 96) return 'low';
    if (rtp >= 94) return 'medium';
    return 'high';
  }

  // Process spin through API provider
  static async processSpin(
    gameId: string, 
    betAmount: number, 
    currency: 'GC' | 'SC'
  ): Promise<APISpinResponse> {
    const [providerId, apiGameId] = gameId.split('_').slice(0, 2);
    const provider = this.providers.get(providerId);
    
    if (!provider) {
      return { success: false, error: 'Provider not found' };
    }

    // Simulate API spin call
    return this.simulateSpinAPI(provider, apiGameId, betAmount, currency);
  }

  private static async simulateSpinAPI(
    provider: APIProvider,
    gameId: string,
    betAmount: number,
    currency: 'GC' | 'SC'
  ): Promise<APISpinResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 100));

    // Generate random spin result
    const symbols = ['wild', 'scatter', 'high1', 'high2', 'med1', 'med2', 'low1', 'low2', 'low3'];
    const reels: string[][] = [];
    
    for (let reel = 0; reel < 5; reel++) {
      reels[reel] = [];
      for (let row = 0; row < 3; row++) {
        reels[reel][row] = symbols[Math.floor(Math.random() * symbols.length)];
      }
    }

    // Calculate win (simplified)
    const winChance = 0.3; // 30% chance to win
    const isWin = Math.random() < winChance;
    const winMultiplier = isWin ? (1 + Math.random() * 9) : 0; // 1x to 10x
    const winAmount = isWin ? betAmount * winMultiplier : 0;

    const bonusChance = 0.05; // 5% chance for bonus
    const bonusTriggered = Math.random() < bonusChance;

    return {
      success: true,
      result: {
        reels,
        paylines: isWin ? [{
          payline: 1,
          symbols: ['high1', 'high1', 'high1'],
          multiplier: winMultiplier
        }] : [],
        winAmount: Math.floor(winAmount * 100) / 100,
        bonusTriggered,
        freeSpinsAwarded: bonusTriggered ? Math.floor(Math.random() * 15) + 5 : undefined
      }
    };
  }

  // Sync all providers
  static async syncAllProviders(): Promise<void> {
    const providers = this.getActiveProviders();
    
    await Promise.all(providers.map(async (provider) => {
      try {
        console.log(`Syncing ${provider.name}...`);
        await this.fetchGamesFromProvider(provider.id);
        console.log(`${provider.name} synced successfully`);
      } catch (error) {
        console.error(`Failed to sync ${provider.name}:`, error);
      }
    }));
  }

  // Start automatic cache refresh
  private static startCacheRefresh(): void {
    // Refresh cache every hour
    setInterval(() => {
      this.syncAllProviders();
    }, this.CACHE_DURATION);
  }

  // Get provider statistics
  static getProviderStats(): Array<{
    name: string;
    gamesCount: number;
    isActive: boolean;
    lastSync: string;
    errorRate: number;
  }> {
    return Array.from(this.providers.values()).map(provider => ({
      name: provider.name,
      gamesCount: this.gameCache.get(provider.id)?.length || 0,
      isActive: provider.is_active,
      lastSync: new Date(this.lastCacheUpdate.get(provider.id) || 0).toISOString(),
      errorRate: 0 // TODO: Track actual error rates
    }));
  }
}

// Initialize the service
APISlotProvidersService.initialize();
