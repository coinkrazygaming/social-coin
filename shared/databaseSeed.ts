import { DatabaseService, User, Prize, AIEmployee, SystemSettings } from './database';
import { hashPassword } from '../server/utils/auth';

export class DatabaseSeeder {
  private db: DatabaseService;

  constructor(db: DatabaseService) {
    this.db = db;
  }

  async seedAll() {
    console.log('🌱 Starting database seeding...');
    
    try {
      await this.seedSystemSettings();
      await this.seedAdminUsers();
      await this.seedTestUsers();
      await this.seedPrizes();
      await this.seedAIEmployees();
      await this.seedTickerMessages();
      await this.seedSampleTransactions();
      await this.seedGameSessions();
      await this.seedAdminAlerts();
      await this.seedRedemptionRequests();
      await this.seedSweepCoinBatches();
      
      console.log('✅ Database seeding completed successfully!');
    } catch (error) {
      console.error('❌ Database seeding failed:', error);
      throw error;
    }
  }

  private async seedSystemSettings() {
    console.log('📋 Seeding system settings...');
    
    const settings = [
      {
        category: 'general',
        key: 'casino_name',
        value: 'CoinKrazy Casino',
        dataType: 'string',
        description: 'Casino brand name',
        isPublic: true
      },
      {
        category: 'general',
        key: 'maintenance_mode',
        value: 'false',
        dataType: 'boolean',
        description: 'Enable maintenance mode',
        isPublic: false
      },
      {
        category: 'security',
        key: 'max_login_attempts',
        value: '5',
        dataType: 'number',
        description: 'Maximum login attempts before lockout',
        isPublic: false
      },
      {
        category: 'security',
        key: 'session_timeout',
        value: '3600',
        dataType: 'number',
        description: 'Session timeout in seconds',
        isPublic: false
      },
      {
        category: 'security',
        key: 'kyc_required_threshold',
        value: '1000',
        dataType: 'number',
        description: 'Dollar amount requiring KYC verification',
        isPublic: false
      },
      {
        category: 'payments',
        key: 'sc_to_usd_rate',
        value: '5',
        dataType: 'number',
        description: 'Sweep Coins to USD conversion rate',
        isPublic: false
      },
      {
        category: 'payments',
        key: 'min_redemption_amount',
        value: '20',
        dataType: 'number',
        description: 'Minimum cash redemption amount in USD',
        isPublic: true
      },
      {
        category: 'payments',
        key: 'max_daily_redemption',
        value: '5000',
        dataType: 'number',
        description: 'Maximum daily redemption amount per user',
        isPublic: false
      },
      {
        category: 'payments',
        key: 'auto_approval_limit',
        value: '500',
        dataType: 'number',
        description: 'Auto-approval limit for VIP redemptions',
        isPublic: false
      },
      {
        category: 'games',
        key: 'house_edge_slots',
        value: '3.5',
        dataType: 'number',
        description: 'Default house edge for slot games',
        isPublic: false
      },
      {
        category: 'games',
        key: 'max_bet_gc',
        value: '5000',
        dataType: 'number',
        description: 'Maximum bet amount for Gold Coins',
        isPublic: true
      },
      {
        category: 'games',
        key: 'max_bet_sc',
        value: '100',
        dataType: 'number',
        description: 'Maximum bet amount for Sweep Coins',
        isPublic: true
      },
      {
        category: 'ai',
        key: 'ai_auto_responses',
        value: 'true',
        dataType: 'boolean',
        description: 'Enable AI automatic responses',
        isPublic: false
      },
      {
        category: 'ai',
        key: 'ai_escalation_threshold',
        value: '0.8',
        dataType: 'number',
        description: 'AI confidence threshold for escalation',
        isPublic: false
      },
      {
        category: 'marketing',
        key: 'welcome_bonus_gc',
        value: '25000',
        dataType: 'number',
        description: 'Welcome bonus Gold Coins amount',
        isPublic: true
      },
      {
        category: 'marketing',
        key: 'daily_bonus_gc',
        value: '1000',
        dataType: 'number',
        description: 'Daily bonus Gold Coins amount',
        isPublic: true
      },
      {
        category: 'marketing',
        key: 'referral_bonus_gc',
        value: '5000',
        dataType: 'number',
        description: 'Referral bonus Gold Coins amount',
        isPublic: true
      }
    ];

    for (const setting of settings) {
      this.db.db.prepare(`
        INSERT OR REPLACE INTO system_settings 
        (id, category, key, value, data_type, description, is_public, updated_by, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        `setting_${setting.category}_${setting.key}`,
        setting.category,
        setting.key,
        setting.value,
        setting.dataType,
        setting.description,
        setting.isPublic ? 1 : 0,
        'system',
        new Date().toISOString()
      );
    }
  }

  private async seedAdminUsers() {
    console.log('👨‍💼 Seeding admin users...');
    
    const adminUsers = [
      {
        username: 'admin',
        email: 'admin@coinkrazy.com',
        password: 'CoinKrazy2024!',
        role: 'admin' as const,
        playerLevel: 'Diamond' as const
      },
      {
        username: 'keo_admin',
        email: 'keo@coinkrazy.com',
        password: 'KeoAdmin2024!',
        role: 'admin' as const,
        playerLevel: 'VIP' as const
      },
      {
        username: 'staff_manager',
        email: 'manager@coinkrazy.com',
        password: 'StaffManager2024!',
        role: 'staff' as const,
        playerLevel: 'Platinum' as const
      },
      {
        username: 'customer_support',
        email: 'support@coinkrazy.com',
        password: 'Support2024!',
        role: 'staff' as const,
        playerLevel: 'Gold' as const
      }
    ];

    for (const userData of adminUsers) {
      const passwordHash = await hashPassword(userData.password);
      
      const user = this.db.createUser({
        username: userData.username,
        email: userData.email,
        passwordHash,
        role: userData.role
      });

      // Update user with additional admin privileges
      this.db.db.prepare(`
        UPDATE users SET 
          email_verified = 1,
          email_verified_at = ?,
          player_level = ?,
          profile = ?
        WHERE id = ?
      `).run(
        new Date().toISOString(),
        userData.playerLevel,
        JSON.stringify({
          ...user.profile,
          firstName: userData.username.split('_')[0],
          lastName: 'Admin',
          totalDeposits: 0,
          totalWithdrawals: 0,
          lifetimeValue: 0,
          riskScore: 0,
          lastRiskAssessment: new Date()
        }),
        user.id
      );

      // Give admin users starting balances
      if (userData.role === 'admin') {
        this.db.db.prepare(`
          UPDATE wallets SET 
            gold_coins = 1000000,
            sweep_coins = 1000
          WHERE user_id = ?
        `).run(user.id);
      }
    }
  }

  private async seedTestUsers() {
    console.log('👥 Seeding test users...');
    
    const testUsers = [
      {
        username: 'DiamondQueen22',
        email: 'diamond@test.com',
        password: 'TestUser123!',
        playerLevel: 'Diamond',
        goldCoins: 50000,
        sweepCoins: 250.75
      },
      {
        username: 'LuckyStrike88',
        email: 'lucky@test.com',
        password: 'TestUser123!',
        playerLevel: 'Platinum',
        goldCoins: 35000,
        sweepCoins: 150.50
      },
      {
        username: 'SlotKing777',
        email: 'slotking@test.com',
        password: 'TestUser123!',
        playerLevel: 'Gold',
        goldCoins: 25000,
        sweepCoins: 75.25
      },
      {
        username: 'BigWinBetty',
        email: 'betty@test.com',
        password: 'TestUser123!',
        playerLevel: 'Silver',
        goldCoins: 15000,
        sweepCoins: 50.00
      },
      {
        username: 'NewPlayer123',
        email: 'newbie@test.com',
        password: 'TestUser123!',
        playerLevel: 'Bronze',
        goldCoins: 25000,
        sweepCoins: 0
      }
    ];

    for (const userData of testUsers) {
      const passwordHash = await hashPassword(userData.password);
      
      const user = this.db.createUser({
        username: userData.username,
        email: userData.email,
        passwordHash,
        role: 'user'
      });

      // Update user profile and wallet
      this.db.db.prepare(`
        UPDATE users SET 
          email_verified = 1,
          email_verified_at = ?,
          player_level = ?,
          profile = ?
        WHERE id = ?
      `).run(
        new Date().toISOString(),
        userData.playerLevel,
        JSON.stringify({
          ...user.profile,
          firstName: userData.username,
          totalDeposits: Math.floor(Math.random() * 5000) + 1000,
          totalWithdrawals: Math.floor(Math.random() * 2000),
          lifetimeValue: Math.floor(Math.random() * 10000) + 2000,
          riskScore: Math.floor(Math.random() * 30) + 10,
          lastRiskAssessment: new Date()
        }),
        user.id
      );

      this.db.db.prepare(`
        UPDATE wallets SET 
          gold_coins = ?,
          sweep_coins = ?
        WHERE user_id = ?
      `).run(userData.goldCoins, userData.sweepCoins, user.id);
    }
  }

  private async seedPrizes() {
    console.log('🎁 Seeding prizes...');
    
    const prizes = [
      {
        name: 'Apple iPhone 15 Pro',
        description: '128GB Titanium smartphone with A17 Pro chip and advanced camera system',
        category: 'electronics',
        scCost: 5000,
        retailValue: 999,
        availability: 5,
        popularity: 95,
        isDigital: false,
        processingTime: '7-14 business days',
        features: ['Latest Model', 'Free Shipping', 'Warranty Included', 'Express Processing'],
        specifications: {
          storage: '128GB',
          color: 'Natural Titanium',
          screen: '6.1-inch Super Retina XDR',
          camera: '48MP Main + 12MP Ultra Wide + 12MP Telephoto'
        }
      },
      {
        name: 'Amazon Gift Card - $100',
        description: 'Digital gift card for Amazon.com with instant delivery',
        category: 'gift_cards',
        scCost: 500,
        retailValue: 100,
        availability: 999,
        popularity: 88,
        isDigital: true,
        processingTime: '1-2 hours',
        features: ['Instant Delivery', 'No Expiration', 'Digital Code', 'Email Delivery']
      },
      {
        name: 'PlayStation 5 Console',
        description: 'Gaming console with 1TB SSD storage and DualSense controller',
        category: 'gaming',
        scCost: 2500,
        retailValue: 499,
        availability: 3,
        popularity: 92,
        isDigital: false,
        processingTime: '5-10 business days',
        features: ['Latest Model', 'Free Games Bundle', 'Express Shipping', '2-Year Warranty']
      },
      {
        name: 'Las Vegas Experience Package',
        description: '3-day 2-night Vegas getaway with hotel, shows, and dining credits',
        category: 'experiences',
        scCost: 7500,
        retailValue: 1500,
        availability: 10,
        popularity: 85,
        isDigital: false,
        processingTime: '14-21 business days',
        features: ['Hotel Included', 'Show Tickets', 'Dining Credits', 'Concierge Service']
      },
      {
        name: 'Rolex Submariner Watch',
        description: 'Luxury dive watch in stainless steel with automatic movement',
        category: 'luxury',
        scCost: 40000,
        retailValue: 8000,
        availability: 1,
        popularity: 78,
        isDigital: false,
        processingTime: '21-30 business days',
        features: ['Authentic', 'Warranty', 'Luxury Packaging', 'Certificate of Authenticity']
      },
      {
        name: 'Steam Gift Card - $50',
        description: 'Digital gift card for Steam gaming platform',
        category: 'gift_cards',
        scCost: 250,
        retailValue: 50,
        availability: 999,
        popularity: 82,
        isDigital: true,
        processingTime: '1-2 hours',
        features: ['Instant Delivery', 'Digital Code', 'No Expiration']
      },
      {
        name: 'MacBook Air M2',
        description: '13-inch laptop with M2 chip, 8GB RAM, and 256GB storage',
        category: 'electronics',
        scCost: 6000,
        retailValue: 1199,
        availability: 2,
        popularity: 89,
        isDigital: false,
        processingTime: '7-14 business days',
        features: ['Latest Model', 'Free Shipping', 'AppleCare+ Eligible', 'Express Processing']
      },
      {
        name: 'Nintendo Switch OLED',
        description: 'Handheld gaming console with 7-inch OLED screen',
        category: 'gaming',
        scCost: 1500,
        retailValue: 349,
        availability: 8,
        popularity: 86,
        isDigital: false,
        processingTime: '5-10 business days',
        features: ['OLED Display', 'Free Shipping', 'Game Bundle', '1-Year Warranty']
      }
    ];

    for (const prizeData of prizes) {
      const id = `prize_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      this.db.db.prepare(`
        INSERT INTO prizes (
          id, name, description, category, sc_cost, retail_value,
          image, availability, popularity, is_digital, is_active,
          processing_time, features, specifications, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id,
        prizeData.name,
        prizeData.description,
        prizeData.category,
        prizeData.scCost,
        prizeData.retailValue,
        `/prizes/${prizeData.category}/${id}.jpg`,
        prizeData.availability,
        prizeData.popularity,
        prizeData.isDigital ? 1 : 0,
        1,
        prizeData.processingTime,
        JSON.stringify(prizeData.features),
        JSON.stringify(prizeData.specifications || {}),
        new Date().toISOString(),
        new Date().toISOString()
      );
    }
  }

  private async seedAIEmployees() {
    console.log('🤖 Seeding AI employees...');
    
    const aiEmployees = [
      {
        name: 'LuckyAI',
        role: 'manager',
        specialty: ['overall_management', 'decision_making', 'strategy', 'oversight'],
        capabilities: ['task_assignment', 'performance_monitoring', 'strategic_planning', 'escalation_handling'],
        workingHours: {
          start: '00:00',
          end: '23:59',
          timezone: 'UTC',
          workDays: [0, 1, 2, 3, 4, 5, 6]
        },
        performance: {
          tasksCompleted: 1250,
          averageResponseTime: 1.2,
          successRate: 98.5,
          lastActive: new Date(),
          hoursWorked: 8760, // 24/7 for a year
          costSavings: 87600 // $10/hour * 8760 hours
        },
        configuration: {
          responseStyle: 'professional',
          escalationThreshold: 90
        }
      },
      {
        name: 'SecurityAI',
        role: 'security',
        specialty: ['fraud_detection', 'risk_assessment', 'account_monitoring', 'compliance'],
        capabilities: ['fraud_analysis', 'pattern_recognition', 'risk_scoring', 'alert_generation'],
        workingHours: {
          start: '00:00',
          end: '23:59',
          timezone: 'UTC',
          workDays: [0, 1, 2, 3, 4, 5, 6]
        },
        performance: {
          tasksCompleted: 2840,
          averageResponseTime: 0.5,
          successRate: 99.2,
          lastActive: new Date(),
          hoursWorked: 8760,
          costSavings: 87600
        },
        configuration: {
          responseStyle: 'formal',
          escalationThreshold: 75
        }
      },
      {
        name: 'RedemptionAI',
        role: 'redemption',
        specialty: ['payment_processing', 'verification', 'kyc_review', 'approval_workflow'],
        capabilities: ['document_verification', 'risk_assessment', 'payment_processing', 'compliance_checking'],
        workingHours: {
          start: '00:00',
          end: '23:59',
          timezone: 'UTC',
          workDays: [0, 1, 2, 3, 4, 5, 6]
        },
        performance: {
          tasksCompleted: 892,
          averageResponseTime: 2.8,
          successRate: 97.8,
          lastActive: new Date(),
          hoursWorked: 8760,
          costSavings: 87600
        },
        configuration: {
          responseStyle: 'professional',
          escalationThreshold: 80,
          autoApprovalLimits: {
            maxAmount: 500,
            riskScoreThreshold: 25
          }
        }
      },
      {
        name: 'CustomerServiceAI',
        role: 'customer_service',
        specialty: ['player_support', 'inquiries', 'complaints', 'general_assistance'],
        capabilities: ['chat_support', 'email_responses', 'ticket_resolution', 'player_education'],
        workingHours: {
          start: '00:00',
          end: '23:59',
          timezone: 'UTC',
          workDays: [0, 1, 2, 3, 4, 5, 6]
        },
        performance: {
          tasksCompleted: 5420,
          averageResponseTime: 1.8,
          successRate: 94.5,
          lastActive: new Date(),
          hoursWorked: 8760,
          costSavings: 87600
        },
        configuration: {
          responseStyle: 'casual',
          escalationThreshold: 85
        }
      },
      {
        name: 'VIPAI',
        role: 'vip_management',
        specialty: ['vip_relations', 'high_value_players', 'personalized_service', 'retention'],
        capabilities: ['vip_communication', 'personalized_offers', 'relationship_management', 'retention_strategies'],
        workingHours: {
          start: '00:00',
          end: '23:59',
          timezone: 'UTC',
          workDays: [0, 1, 2, 3, 4, 5, 6]
        },
        performance: {
          tasksCompleted: 456,
          averageResponseTime: 3.2,
          successRate: 98.9,
          lastActive: new Date(),
          hoursWorked: 8760,
          costSavings: 87600
        },
        configuration: {
          responseStyle: 'formal',
          escalationThreshold: 95
        }
      },
      {
        name: 'MarketingAI',
        role: 'marketing',
        specialty: ['campaign_management', 'content_creation', 'social_media', 'promotions'],
        capabilities: ['content_generation', 'campaign_optimization', 'social_posting', 'analytics'],
        workingHours: {
          start: '06:00',
          end: '22:00',
          timezone: 'UTC',
          workDays: [1, 2, 3, 4, 5, 6, 0]
        },
        performance: {
          tasksCompleted: 1680,
          averageResponseTime: 5.5,
          successRate: 92.3,
          lastActive: new Date(),
          hoursWorked: 5840, // 16 hours * 365 days
          costSavings: 58400
        },
        configuration: {
          responseStyle: 'casual',
          escalationThreshold: 70
        }
      }
    ];

    for (const employee of aiEmployees) {
      const id = `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      this.db.db.prepare(`
        INSERT INTO ai_employees (
          id, name, role, specialty, is_active, capabilities,
          working_hours, performance, configuration, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id,
        employee.name,
        employee.role,
        JSON.stringify(employee.specialty),
        1,
        JSON.stringify(employee.capabilities),
        JSON.stringify(employee.workingHours),
        JSON.stringify(employee.performance),
        JSON.stringify(employee.configuration),
        new Date().toISOString(),
        new Date().toISOString()
      );
    }
  }

  private async seedTickerMessages() {
    console.log('📰 Seeding ticker messages...');
    
    const tickerMessages = [
      {
        type: 'winner',
        content: '🎉 Congratulations to DiamondQueen22 for winning 15,000 SC on Royal Riches!',
        priority: 8,
        isAIGenerated: false,
        createdBy: 'admin'
      },
      {
        type: 'promotion',
        content: '💰 Weekend Special: 100% Bonus on all Gold Coin purchases! Limited time offer!',
        priority: 9,
        isAIGenerated: false,
        createdBy: 'admin'
      },
      {
        type: 'jackpot',
        content: '🎰 MEGA JACKPOT ALERT: Diamond Fortune progressive jackpot now at 125,000 SC!',
        priority: 10,
        isAIGenerated: false,
        createdBy: 'admin'
      },
      {
        type: 'news',
        content: '🚀 New game alert: Space Adventure slot now live with multipliers up to 1000x!',
        priority: 7,
        isAIGenerated: true,
        createdBy: 'MarketingAI'
      },
      {
        type: 'social',
        content: '📱 Follow us on social media for exclusive bonuses and behind-the-scenes content!',
        priority: 5,
        isAIGenerated: true,
        createdBy: 'MarketingAI'
      },
      {
        type: 'tournament',
        content: '🏆 Weekly Tournament starts Monday! Compete for 50,000 SC in prizes!',
        priority: 8,
        isAIGenerated: false,
        createdBy: 'admin'
      }
    ];

    for (const message of tickerMessages) {
      const id = `ticker_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      this.db.db.prepare(`
        INSERT INTO ticker_messages (
          id, type, content, is_active, is_ai_generated, priority,
          display_duration, created_at, created_by, view_count, click_count
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id,
        message.type,
        message.content,
        1,
        message.isAIGenerated ? 1 : 0,
        message.priority,
        4000,
        new Date().toISOString(),
        message.createdBy,
        Math.floor(Math.random() * 1000) + 100,
        Math.floor(Math.random() * 50) + 10
      );
    }
  }

  private async seedSampleTransactions() {
    console.log('💳 Seeding sample transactions...');
    
    // Get test users
    const users = this.db.db.prepare('SELECT id FROM users WHERE role = ?').all('user') as any[];
    
    for (const user of users) {
      // Create some sample transactions
      const transactionTypes = ['bet', 'win', 'purchase', 'bonus'];
      const currencies = ['GC', 'SC'];
      
      for (let i = 0; i < 10; i++) {
        const type = transactionTypes[Math.floor(Math.random() * transactionTypes.length)] as any;
        const currency = currencies[Math.floor(Math.random() * currencies.length)] as any;
        let amount = Math.floor(Math.random() * 1000) + 50;
        
        if (type === 'bet') amount = -amount;
        
        const balanceBefore = Math.floor(Math.random() * 10000) + 5000;
        const balanceAfter = balanceBefore + amount;
        
        this.db.createTransaction({
          userId: user.id,
          type,
          currency,
          amount,
          balanceBefore,
          balanceAfter,
          description: `${type === 'bet' ? 'Bet placed' : type === 'win' ? 'Win on' : type === 'purchase' ? 'Purchase' : 'Bonus awarded'} ${type === 'bet' || type === 'win' ? 'on Lucky Sevens' : ''}`,
          gameId: (type === 'bet' || type === 'win') ? 'lucky_sevens' : undefined,
          gameName: (type === 'bet' || type === 'win') ? 'Lucky Sevens' : undefined,
          ip: '192.168.1.100',
          device: 'Desktop Chrome'
        });
      }
    }
  }

  private async seedGameSessions() {
    console.log('🎮 Seeding game sessions...');
    
    const users = this.db.db.prepare('SELECT id FROM users WHERE role = ?').all('user') as any[];
    const games = [
      { id: 'lucky_sevens', name: 'Lucky Sevens', type: 'slot', provider: 'coinkrazy' },
      { id: 'diamond_fortune', name: 'Diamond Fortune', type: 'slot', provider: 'coinkrazy' },
      { id: 'royal_riches', name: 'Royal Riches', type: 'slot', provider: 'coinkrazy' },
      { id: 'gates_olympus', name: 'Gates of Olympus', type: 'slot', provider: 'pragmatic' },
      { id: 'sweet_bonanza', name: 'Sweet Bonanza', type: 'slot', provider: 'pragmatic' }
    ];

    for (const user of users) {
      for (let i = 0; i < 5; i++) {
        const game = games[Math.floor(Math.random() * games.length)];
        const currency = Math.random() > 0.7 ? 'SC' : 'GC';
        const startTime = new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000));
        const duration = Math.floor(Math.random() * 3600) + 300; // 5 minutes to 1 hour
        const endTime = new Date(startTime.getTime() + duration * 1000);
        
        const spinsCount = Math.floor(Math.random() * 200) + 50;
        const totalBets = spinsCount * (Math.floor(Math.random() * 100) + 25);
        const totalWins = totalBets * (0.7 + Math.random() * 0.6); // 70-130% RTP range
        const netResult = totalWins - totalBets;
        
        const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        this.db.db.prepare(`
          INSERT INTO game_sessions (
            id, user_id, game_id, game_name, game_type, provider,
            start_time, end_time, duration, total_bets, total_wins,
            net_result, spins_count, currency, max_win, avg_bet,
            rtp, bonus_rounds_triggered, free_spins_won, is_active,
            last_activity, ip, device, location
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          sessionId,
          user.id,
          game.id,
          game.name,
          game.type,
          game.provider,
          startTime.toISOString(),
          endTime.toISOString(),
          duration,
          totalBets,
          totalWins,
          netResult,
          spinsCount,
          currency,
          Math.max(totalWins * 0.3, 100),
          totalBets / spinsCount,
          (totalWins / totalBets) * 100,
          Math.floor(Math.random() * 5),
          Math.floor(Math.random() * 50),
          0,
          endTime.toISOString(),
          '192.168.1.100',
          'Desktop Chrome',
          'Las Vegas, NV'
        );
      }
    }
  }

  private async seedAdminAlerts() {
    console.log('🚨 Seeding admin alerts...');
    
    const alerts = [
      {
        type: 'big_win',
        severity: 'medium',
        title: '🏆 Big Win Alert: 7,500 SC',
        description: 'Player "LuckyStrike88" won 7,500 SC on Diamond Fortune slot',
        username: 'LuckyStrike88',
        riskScore: 15,
        aiEmployeeAssigned: 'LuckyAI'
      },
      {
        type: 'redemption_request',
        severity: 'high',
        title: '💰 Redemption Request: $500 Cash',
        description: 'VIP player "DiamondQueen22" requesting $500 cash redemption via Cash App',
        username: 'DiamondQueen22',
        riskScore: 25,
        aiEmployeeAssigned: 'RedemptionAI'
      },
      {
        type: 'fraud',
        severity: 'critical',
        title: '🚨 Potential Account Fraud',
        description: 'Multiple failed login attempts from different locations for VIP account',
        username: 'SuspiciousUser',
        riskScore: 95,
        aiEmployeeAssigned: 'SecurityAI'
      },
      {
        type: 'vip_activity',
        severity: 'medium',
        title: '👑 VIP Player High Activity',
        description: 'VIP player "RoyalFlush" deposited $2,000 and playing multiple games',
        username: 'RoyalFlush',
        riskScore: 10,
        aiEmployeeAssigned: 'VIPAI'
      }
    ];

    for (const alert of alerts) {
      const id = `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const timestamp = new Date(Date.now() - Math.floor(Math.random() * 24 * 60 * 60 * 1000));
      
      this.db.db.prepare(`
        INSERT INTO admin_alerts (
          id, type, severity, title, description, username,
          ip_address, location, device, timestamp, status,
          acknowledged, read, persistent, auto_actions,
          suggested_actions, metadata, sound_enabled, flash_enabled,
          risk_score, archived, escalation_level, ai_employee_assigned
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id,
        alert.type,
        alert.severity,
        alert.title,
        alert.description,
        alert.username,
        '192.168.1.100',
        'Las Vegas, NV',
        'Desktop Chrome',
        timestamp.toISOString(),
        'active',
        0,
        0,
        1,
        JSON.stringify(['Notification sent', 'Log created']),
        JSON.stringify([
          { label: 'Review Details', action: 'review', severity: 'info' },
          { label: 'Contact Player', action: 'contact', severity: 'warning' }
        ]),
        JSON.stringify({ generatedBy: 'system' }),
        1,
        1,
        alert.riskScore,
        0,
        0,
        alert.aiEmployeeAssigned
      );
    }
  }

  private async seedRedemptionRequests() {
    console.log('💰 Seeding redemption requests...');
    
    const users = this.db.db.prepare('SELECT id, username FROM users WHERE role = ? LIMIT 3').all('user') as any[];
    
    const redemptionData = [
      {
        type: 'cash',
        amount: 500,
        scAmount: 2500,
        method: 'cash_app',
        status: 'approved',
        priority: 'vip'
      },
      {
        type: 'gift_card',
        amount: 100,
        scAmount: 500,
        method: 'digital_gift_card',
        status: 'completed',
        priority: 'standard'
      },
      {
        type: 'cash',
        amount: 250,
        scAmount: 1250,
        method: 'cash_app',
        status: 'pending',
        priority: 'standard'
      }
    ];

    for (let i = 0; i < users.length && i < redemptionData.length; i++) {
      const user = users[i];
      const data = redemptionData[i];
      const id = `red_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const requestDate = new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000));
      
      this.db.db.prepare(`
        INSERT INTO redemption_requests (
          id, user_id, type, amount, sc_amount, method, status,
          priority, request_date, payment_details, verification_documents,
          automatic_processing, estimated_processing_time, fees, exchange_rate
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id,
        user.id,
        data.type,
        data.amount,
        data.scAmount,
        data.method,
        data.status,
        data.priority,
        requestDate.toISOString(),
        JSON.stringify({
          cashAppTag: data.method === 'cash_app' ? `$${user.username}` : undefined,
          recipientName: user.username,
          phoneNumber: '+1-555-0123'
        }),
        JSON.stringify({
          idDocument: 'id_document.pdf',
          proofOfAddress: 'utility_bill.pdf'
        }),
        data.priority === 'vip' ? 1 : 0,
        data.priority === 'vip' ? '24-48 hours' : '48-72 hours',
        0,
        5
      );
    }
  }

  private async seedSweepCoinBatches() {
    console.log('🪙 Seeding sweep coin batches...');
    
    const users = this.db.db.prepare('SELECT id FROM users WHERE role = ?').all('user') as any[];
    
    for (const user of users) {
      // Create 2-3 sweep coin batches per user with different expiration dates
      const batchCount = Math.floor(Math.random() * 2) + 2;
      
      for (let i = 0; i < batchCount; i++) {
        const amount = Math.floor(Math.random() * 100) + 25;
        const purchaseDate = new Date(Date.now() - Math.floor(Math.random() * 60 * 24 * 60 * 60 * 1000)); // Up to 60 days ago
        const expirationDate = new Date(purchaseDate.getTime() + 90 * 24 * 60 * 60 * 1000); // 90 days from purchase
        const usedAmount = Math.floor(Math.random() * amount * 0.3); // Up to 30% used
        const remainingAmount = amount - usedAmount;
        const isExpired = expirationDate < new Date() ? 1 : 0;
        
        const id = `sc_batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        this.db.db.prepare(`
          INSERT INTO sweep_coin_batches (
            id, user_id, amount, purchase_date, expiration_date,
            source, is_expired, used_amount, remaining_amount
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          id,
          user.id,
          amount,
          purchaseDate.toISOString(),
          expirationDate.toISOString(),
          i === 0 ? 'purchase' : (Math.random() > 0.5 ? 'bonus' : 'promotion'),
          isExpired,
          usedAmount,
          remainingAmount
        );
      }
    }
  }
}

// Function to run the seeder
export async function seedDatabase(dbPath?: string) {
  const db = new DatabaseService(dbPath);
  const seeder = new DatabaseSeeder(db);
  
  try {
    await seeder.seedAll();
    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  } finally {
    db.close();
  }
}

// Default export for easy importing
export default DatabaseSeeder;
