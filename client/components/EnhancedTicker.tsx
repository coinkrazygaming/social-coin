import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  DollarSign,
  Star,
  Gift,
  Zap,
  Crown,
  Target,
  Users,
  TrendingUp,
  Sparkles,
  Bell,
  MessageCircle,
  Calendar,
  Award,
  Coins,
  Volume2,
  VolumeX,
} from "lucide-react";

interface TickerMessage {
  id: string;
  type: "winner" | "promotion" | "news" | "social" | "jackpot" | "tournament";
  content: string;
  displayText: string;
  priority: "low" | "medium" | "high" | "urgent";
  isActive: boolean;
  displayDuration: number;
  metadata: {
    winAmount?: number;
    playerName?: string;
    gameName?: string;
    promotionCode?: string;
    url?: string;
  };
  createdAt: Date;
}

interface TickerSettings {
  isEnabled: boolean;
  speed: number;
  backgroundColor: string;
  textColor: string;
  fontSize: number;
  showIcons: boolean;
  soundEnabled: boolean;
}

interface EnhancedTickerProps {
  className?: string;
  position?: "top" | "bottom";
  tickerType?: "all" | "winners" | "promotions" | "social" | "jackpots";
}

export const EnhancedTicker: React.FC<EnhancedTickerProps> = ({
  className = "",
  position = "top",
  tickerType = "all",
}) => {
  const [messages, setMessages] = useState<TickerMessage[]>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [settings, setSettings] = useState<TickerSettings>({
    isEnabled: true,
    speed: 50,
    backgroundColor: "#1f2937",
    textColor: "#fbbf24",
    fontSize: 16,
    showIcons: true,
    soundEnabled: true,
  });

  const tickerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    loadTickerMessages();
    loadTickerSettings();
  }, [tickerType]);

  useEffect(() => {
    if (!settings.isEnabled || messages.length === 0 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 8000); // Change message every 8 seconds

    return () => clearInterval(interval);
  }, [messages.length, settings.isEnabled, isPaused]);

  const loadTickerMessages = () => {
    // Simulated real-time ticker data based on type
    const allMessages: TickerMessage[] = [
      // Winner Messages
      {
        id: "win_001",
        type: "winner",
        content: "Big Win Alert!",
        displayText: "🎉 HUGE WIN! SlotMaster97 just won 25,000 SC on Royal Fortune! Congratulations! 🎉",
        priority: "high",
        isActive: true,
        displayDuration: 10,
        metadata: {
          winAmount: 25000,
          playerName: "SlotMaster97",
          gameName: "Royal Fortune",
        },
        createdAt: new Date(Date.now() - 300000),
      },
      {
        id: "win_002", 
        type: "winner",
        content: "Jackpot Winner!",
        displayText: "🏆 JACKPOT! LuckyPlayer777 hit the MEGA JACKPOT for 150,000 SC on Diamond Dreams! 🏆",
        priority: "urgent",
        isActive: true,
        displayDuration: 12,
        metadata: {
          winAmount: 150000,
          playerName: "LuckyPlayer777",
          gameName: "Diamond Dreams",
        },
        createdAt: new Date(Date.now() - 600000),
      },
      {
        id: "win_003",
        type: "winner", 
        content: "Lucky Strike!",
        displayText: "⚡ LIGHTNING WIN! CasinoKing23 struck gold with 45,000 SC on Lucky Sevens! ⚡",
        priority: "high",
        isActive: true,
        displayDuration: 8,
        metadata: {
          winAmount: 45000,
          playerName: "CasinoKing23",
          gameName: "Lucky Sevens",
        },
        createdAt: new Date(Date.now() - 900000),
      },

      // Promotion Messages
      {
        id: "promo_001",
        type: "promotion",
        content: "Weekend Special!",
        displayText: "🔥 WEEKEND SPECIAL: 100% Bonus Gold Coins + 50 Free SC! Use code WEEKEND100 🔥",
        priority: "urgent",
        isActive: true,
        displayDuration: 12,
        metadata: {
          promotionCode: "WEEKEND100",
          url: "/store",
        },
        createdAt: new Date(Date.now() - 1800000),
      },
      {
        id: "promo_002",
        type: "promotion",
        content: "Flash Sale Alert!",
        displayText: "⚡ FLASH SALE: 24 hours only! Extra 50% Gold Coins on all packages! Hurry! ⚡",
        priority: "high",
        isActive: true,
        displayDuration: 10,
        metadata: {
          promotionCode: "FLASH50",
          url: "/store",
        },
        createdAt: new Date(Date.now() - 3600000),
      },
      {
        id: "promo_003",
        type: "promotion",
        content: "VIP Exclusive!",
        displayText: "👑 VIP EXCLUSIVE: Double rewards on all deposits this week! VIP members only! 👑",
        priority: "medium",
        isActive: true,
        displayDuration: 8,
        metadata: {
          url: "/store",
        },
        createdAt: new Date(Date.now() - 5400000),
      },

      // Social Messages  
      {
        id: "social_001",
        type: "social",
        content: "Follow us!",
        displayText: "📱 Follow @CoinKrazy on all social platforms for exclusive bonuses and giveaways! 📱",
        priority: "medium",
        isActive: true,
        displayDuration: 8,
        metadata: {
          url: "https://twitter.com/coinkrizy",
        },
        createdAt: new Date(Date.now() - 7200000),
      },
      {
        id: "social_002",
        type: "social",
        content: "Community Milestone!",
        displayText: "🎉 We just reached 100K players! Thank you for being part of the CoinKrazy family! 🎉",
        priority: "high",
        isActive: true,
        displayDuration: 10,
        metadata: {},
        createdAt: new Date(Date.now() - 10800000),
      },

      // Jackpot Messages
      {
        id: "jackpot_001",
        type: "jackpot",
        content: "Progressive Jackpot Alert",
        displayText: "💰 MEGA JACKPOT now at $125,000! Play Mega Fortune for your chance to win BIG! 💰",
        priority: "high",
        isActive: true,
        displayDuration: 10,
        metadata: {
          winAmount: 125000,
          gameName: "Mega Fortune",
        },
        createdAt: new Date(Date.now() - 14400000),
      },
      {
        id: "jackpot_002",
        type: "jackpot",
        content: "Daily Must Drop!",
        displayText: "🎯 DAILY MUST DROP: $45,000 SC must be won before midnight! Don't miss out! 🎯",
        priority: "urgent",
        isActive: true,
        displayDuration: 12,
        metadata: {
          winAmount: 45000,
        },
        createdAt: new Date(Date.now() - 18000000),
      },

      // Tournament Messages
      {
        id: "tournament_001",
        type: "tournament",
        content: "Tournament Alert!",
        displayText: "🏆 TOURNAMENT: Weekly Slots Championship starts in 2 hours! $50,000 SC prize pool! 🏆",
        priority: "high",
        isActive: true,
        displayDuration: 10,
        metadata: {},
        createdAt: new Date(Date.now() - 21600000),
      },

      // News Messages
      {
        id: "news_001",
        type: "news",
        content: "Daily Bonus Reminder",
        displayText: "🎁 Don't forget your FREE daily bonus! Login now to claim your coins! 🎁",
        priority: "medium",
        isActive: true,
        displayDuration: 8,
        metadata: {},
        createdAt: new Date(Date.now() - 25200000),
      },
    ];

    // Filter messages based on ticker type
    let filteredMessages = allMessages.filter(msg => msg.isActive);
    
    if (tickerType !== "all") {
      switch (tickerType) {
        case "winners":
          filteredMessages = filteredMessages.filter(msg => msg.type === "winner");
          break;
        case "promotions":
          filteredMessages = filteredMessages.filter(msg => msg.type === "promotion");
          break;
        case "social":
          filteredMessages = filteredMessages.filter(msg => msg.type === "social");
          break;
        case "jackpots":
          filteredMessages = filteredMessages.filter(msg => msg.type === "jackpot" || msg.type === "tournament");
          break;
      }
    }

    setMessages(filteredMessages);
  };

  const loadTickerSettings = () => {
    // Load settings from admin panel or use defaults
    const savedSettings = localStorage.getItem("tickerSettings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "winner":
        return <Trophy className="w-4 h-4 text-yellow-400" />;
      case "promotion":
        return <Star className="w-4 h-4 text-purple-400" />;
      case "news":
        return <MessageCircle className="w-4 h-4 text-blue-400" />;
      case "social":
        return <Users className="w-4 h-4 text-green-400" />;
      case "jackpot":
        return <DollarSign className="w-4 h-4 text-gold" />;
      case "tournament":
        return <Award className="w-4 h-4 text-orange-400" />;
      default:
        return <Bell className="w-4 h-4 text-gray-400" />;
    }
  };

  const playNotificationSound = () => {
    if (settings.soundEnabled && audioRef.current) {
      audioRef.current.play().catch(() => {
        // Handle autoplay restrictions
      });
    }
  };

  const getTickerTypeColor = () => {
    switch (tickerType) {
      case "winners":
        return "from-yellow-600 to-orange-600";
      case "promotions":
        return "from-purple-600 to-pink-600";
      case "social":
        return "from-green-600 to-teal-600";
      case "jackpots":
        return "from-gold to-yellow-500";
      default:
        return "from-gray-800 to-gray-700";
    }
  };

  const getTickerTypeLabel = () => {
    switch (tickerType) {
      case "winners":
        return "🏆 WINNERS";
      case "promotions":
        return "🔥 PROMOTIONS";
      case "social":
        return "📱 SOCIAL";
      case "jackpots":
        return "💰 JACKPOTS";
      default:
        return "📢 NEWS";
    }
  };

  if (!settings.isEnabled || messages.length === 0 || !isVisible) {
    return null;
  }

  const currentMessage = messages[currentMessageIndex];

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {/* Ticker Bar */}
      <div
        className={`relative bg-gradient-to-r ${getTickerTypeColor()} border-y border-gray-600 shadow-lg`}
        style={{ 
          backgroundColor: settings.backgroundColor,
          fontSize: `${settings.fontSize}px`
        }}
      >
        {/* Ticker Type Label */}
        <div className="absolute left-0 top-0 bottom-0 bg-black/30 px-4 flex items-center z-10">
          <span className="text-white font-bold text-sm whitespace-nowrap">
            {getTickerTypeLabel()}
          </span>
        </div>

        {/* Scrolling Content */}
        <div className="relative h-12 overflow-hidden pl-24 pr-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMessage.id}
              initial={{ x: "100%" }}
              animate={{ x: "-100%" }}
              exit={{ x: "-100%" }}
              transition={{
                duration: currentMessage.displayDuration,
                ease: "linear",
                repeat: 0,
              }}
              className="absolute inset-y-0 flex items-center whitespace-nowrap"
              style={{ color: settings.textColor }}
              onAnimationStart={() => {
                if (currentMessage.priority === "urgent" || currentMessage.priority === "high") {
                  playNotificationSound();
                }
              }}
            >
              <div className="flex items-center gap-2">
                {settings.showIcons && getTypeIcon(currentMessage.type)}
                <span className="font-medium">
                  {currentMessage.displayText}
                </span>
                {currentMessage.metadata.promotionCode && (
                  <span className="bg-white/20 text-white px-2 py-1 rounded text-xs font-bold ml-2">
                    CODE: {currentMessage.metadata.promotionCode}
                  </span>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="absolute right-0 top-0 bottom-0 bg-black/30 px-2 flex items-center gap-1 z-10">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="text-white/70 hover:text-white transition-colors p-1"
            title={isPaused ? "Resume" : "Pause"}
          >
            {isPaused ? (
              <Zap className="w-3 h-3" />
            ) : (
              <Target className="w-3 h-3" />
            )}
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="text-white/70 hover:text-white transition-colors p-1"
            title="Hide ticker"
          >
            <VolumeX className="w-3 h-3" />
          </button>
        </div>

        {/* Priority Indicator */}
        {(currentMessage.priority === "urgent" || currentMessage.priority === "high") && (
          <div className="absolute top-0 left-24 right-16 h-1 bg-gradient-to-r from-red-500 to-yellow-500 animate-pulse" />
        )}

        {/* Shine Effect for High Priority Messages */}
        {currentMessage.priority === "urgent" && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        )}
      </div>

      {/* Sound Effect */}
      <audio
        ref={audioRef}
        preload="auto"
        src="/notification-sound.mp3"
      />

      {/* Restore Button */}
      {!isVisible && (
        <motion.button
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => setIsVisible(true)}
          className={`fixed ${position === 'top' ? 'top-16' : 'bottom-4'} right-4 bg-gradient-to-r ${getTickerTypeColor()} text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg hover:shadow-xl transition-all z-50`}
        >
          Show {getTickerTypeLabel()}
        </motion.button>
      )}
    </div>
  );
};

// Multi-Ticker Component for Header
export const MultiTicker: React.FC<{ className?: string }> = ({ className = "" }) => {
  const [activeTickers, setActiveTickers] = useState([
    { type: "winners" as const, visible: true },
    { type: "promotions" as const, visible: true },
    { type: "social" as const, visible: true },
    { type: "jackpots" as const, visible: true },
  ]);

  const [currentTickerIndex, setCurrentTickerIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTickerIndex((prev) => {
        const visibleTickers = activeTickers.filter(t => t.visible);
        return (prev + 1) % visibleTickers.length;
      });
    }, 15000); // Switch ticker every 15 seconds

    return () => clearInterval(interval);
  }, [activeTickers]);

  const visibleTickers = activeTickers.filter(t => t.visible);
  
  if (visibleTickers.length === 0) return null;

  const currentTicker = visibleTickers[currentTickerIndex];

  return (
    <div className={`w-full ${className}`}>
      <EnhancedTicker 
        tickerType={currentTicker.type}
        position="top"
      />
      
      {/* Ticker Navigation Dots */}
      <div className="flex justify-center gap-1 py-1 bg-gray-900/50">
        {visibleTickers.map((ticker, index) => (
          <button
            key={ticker.type}
            onClick={() => setCurrentTickerIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentTickerIndex 
                ? "bg-gold scale-125" 
                : "bg-gray-600 hover:bg-gray-500"
            }`}
            title={ticker.type}
          />
        ))}
      </div>
    </div>
  );
};
