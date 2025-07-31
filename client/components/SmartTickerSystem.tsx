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
  RefreshCw,
  Bot,
} from "lucide-react";

interface TickerMessage {
  id: string;
  type: "winner" | "promotion" | "news" | "social";
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
  generatedBy?: "joseyai" | "admin" | "system";
}

interface TickerCategory {
  type: "winner" | "promotion" | "news" | "social";
  label: string;
  icon: React.ComponentType<any>;
  color: string;
  bgGradient: string;
  isActive: boolean;
}

interface SmartTickerSystemProps {
  className?: string;
  enableJoseyAI?: boolean;
}

export const SmartTickerSystem: React.FC<SmartTickerSystemProps> = ({
  className = "",
  enableJoseyAI = true,
}) => {
  const [categories] = useState<TickerCategory[]>([
    {
      type: "winner",
      label: "🏆 WINNERS",
      icon: Trophy,
      color: "text-yellow-400",
      bgGradient: "from-yellow-600 to-orange-600",
      isActive: true,
    },
    {
      type: "promotion",
      label: "🔥 PROMOTIONS",
      icon: Star,
      color: "text-purple-400",
      bgGradient: "from-purple-600 to-pink-600",
      isActive: true,
    },
    {
      type: "news",
      label: "📢 NEWS",
      icon: MessageCircle,
      color: "text-blue-400",
      bgGradient: "from-blue-600 to-indigo-600",
      isActive: true,
    },
    {
      type: "social",
      label: "📱 SOCIAL",
      icon: Users,
      color: "text-green-400",
      bgGradient: "from-green-600 to-teal-600",
      isActive: true,
    },
  ]);

  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [messages, setMessages] = useState<TickerMessage[]>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [joseyAIStatus, setJoseyAIStatus] = useState<
    "idle" | "generating" | "posting"
  >("idle");

  const tickerRef = useRef<HTMLDivElement>(null);
  const joseyAIInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadInitialMessages();
    if (enableJoseyAI) {
      initializeJoseyAI();
    }

    return () => {
      if (joseyAIInterval.current) {
        clearInterval(joseyAIInterval.current);
      }
    };
  }, [enableJoseyAI]);

  // Category rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCategoryIndex((prev) => (prev + 1) % categories.length);
      setCurrentMessageIndex(0); // Reset message index when category changes
    }, 20000); // Switch category every 20 seconds

    return () => clearInterval(interval);
  }, [categories.length]);

  // Message rotation within category
  useEffect(() => {
    const currentCategory = categories[currentCategoryIndex];
    const categoryMessages = messages.filter(
      (msg) => msg.type === currentCategory.type && msg.isActive,
    );

    if (categoryMessages.length === 0 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % categoryMessages.length);
    }, 8000); // Change message every 8 seconds

    return () => clearInterval(interval);
  }, [currentCategoryIndex, messages, isPaused]);

  const loadInitialMessages = () => {
    const initialMessages: TickerMessage[] = [
      // Winner Messages
      {
        id: "win_001",
        type: "winner",
        content: "Mega Win Alert!",
        displayText:
          "🎉 MASSIVE WIN! SlotMaster97 just won 75,000 SC on Lightning Reels! Congratulations! 🎉",
        priority: "urgent",
        isActive: true,
        displayDuration: 12,
        metadata: {
          winAmount: 75000,
          playerName: "SlotMaster97",
          gameName: "Lightning Reels",
        },
        createdAt: new Date(Date.now() - 300000),
        generatedBy: "system",
      },
      {
        id: "win_002",
        type: "winner",
        content: "Jackpot Winner!",
        displayText:
          "🏆 JACKPOT HIT! LuckyPlayer777 won the PROGRESSIVE JACKPOT of 200,000 SC on Diamond Dreams! 🏆",
        priority: "urgent",
        isActive: true,
        displayDuration: 15,
        metadata: {
          winAmount: 200000,
          playerName: "LuckyPlayer777",
          gameName: "Diamond Dreams",
        },
        createdAt: new Date(Date.now() - 600000),
        generatedBy: "system",
      },
      {
        id: "win_003",
        type: "winner",
        content: "Big Win!",
        displayText:
          "⚡ BIG WIN! CasinoKing23 scored 45,000 SC on Royal Fortune! Amazing luck! ⚡",
        priority: "high",
        isActive: true,
        displayDuration: 10,
        metadata: {
          winAmount: 45000,
          playerName: "CasinoKing23",
          gameName: "Royal Fortune",
        },
        createdAt: new Date(Date.now() - 900000),
        generatedBy: "system",
      },

      // Promotion Messages
      {
        id: "promo_001",
        type: "promotion",
        content: "Weekend Mega Bonus!",
        displayText:
          "🔥 WEEKEND MEGA BONUS: 200% Gold Coins + 100 FREE SC! Use code MEGA200 - Limited Time! 🔥",
        priority: "urgent",
        isActive: true,
        displayDuration: 15,
        metadata: {
          promotionCode: "MEGA200",
          url: "/store",
        },
        createdAt: new Date(Date.now() - 1800000),
        generatedBy: "joseyai",
      },
      {
        id: "promo_002",
        type: "promotion",
        content: "Flash Sale Alert!",
        displayText:
          "⚡ FLASH SALE: 6 hours only! Triple Gold Coins on ALL packages! Don't miss out! ⚡",
        priority: "urgent",
        isActive: true,
        displayDuration: 12,
        metadata: {
          promotionCode: "FLASH3X",
          url: "/store",
        },
        createdAt: new Date(Date.now() - 3600000),
        generatedBy: "joseyai",
      },
      {
        id: "promo_003",
        type: "promotion",
        content: "VIP Exclusive Offer!",
        displayText:
          "👑 VIP EXCLUSIVE: Quadruple rewards on deposits + Personal account manager! VIP members only! 👑",
        priority: "high",
        isActive: true,
        displayDuration: 12,
        metadata: {
          url: "/store",
        },
        createdAt: new Date(Date.now() - 5400000),
        generatedBy: "admin",
      },

      // News Messages
      {
        id: "news_001",
        type: "news",
        content: "New Games Added!",
        displayText:
          "🎮 NEW GAMES ALERT: 15 brand new slot games just added! Experience the latest in casino gaming! 🎮",
        priority: "high",
        isActive: true,
        displayDuration: 10,
        metadata: {},
        createdAt: new Date(Date.now() - 7200000),
        generatedBy: "joseyai",
      },
      {
        id: "news_002",
        type: "news",
        content: "Daily Bonus Reminder",
        displayText:
          "🎁 DAILY BONUS: Don't forget to claim your FREE daily coins! Login bonus resets in 2 hours! 🎁",
        priority: "medium",
        isActive: true,
        displayDuration: 10,
        metadata: {},
        createdAt: new Date(Date.now() - 10800000),
        generatedBy: "system",
      },
      {
        id: "news_003",
        type: "news",
        content: "Tournament Announcement",
        displayText:
          "🏆 TOURNAMENT: Weekly Slots Championship starts tomorrow! $100,000 SC prize pool! Register now! 🏆",
        priority: "high",
        isActive: true,
        displayDuration: 12,
        metadata: {},
        createdAt: new Date(Date.now() - 14400000),
        generatedBy: "joseyai",
      },

      // Social Messages
      {
        id: "social_001",
        type: "social",
        content: "Follow for Bonuses!",
        displayText:
          "📱 Follow @CoinKrazy on social media for EXCLUSIVE bonuses, giveaways, and insider tips! 📱",
        priority: "medium",
        isActive: true,
        displayDuration: 10,
        metadata: {
          url: "https://twitter.com/coinkrizy",
        },
        createdAt: new Date(Date.now() - 18000000),
        generatedBy: "joseyai",
      },
      {
        id: "social_002",
        type: "social",
        content: "Community Milestone!",
        displayText:
          "🎉 MILESTONE ACHIEVED: 250K players have joined CoinKrazy! Thank you for being part of our family! 🎉",
        priority: "high",
        isActive: true,
        displayDuration: 12,
        metadata: {},
        createdAt: new Date(Date.now() - 21600000),
        generatedBy: "system",
      },
      {
        id: "social_003",
        type: "social",
        content: "Community Challenge",
        displayText:
          "🏅 COMMUNITY CHALLENGE: Help us reach 300K players this month! Every new member gets bonus rewards! 🏅",
        priority: "medium",
        isActive: true,
        displayDuration: 10,
        metadata: {},
        createdAt: new Date(Date.now() - 25200000),
        generatedBy: "joseyai",
      },
    ];

    setMessages(initialMessages);
  };

  const initializeJoseyAI = () => {
    // JoseyAI auto-generates new ticker messages every 30 minutes
    joseyAIInterval.current = setInterval(
      () => {
        generateJoseyAIMessage();
      },
      30 * 60 * 1000,
    ); // 30 minutes
  };

  const generateJoseyAIMessage = async () => {
    setJoseyAIStatus("generating");

    // Simulate JoseyAI thinking and generating content
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const messageTypes = ["promotion", "news", "social"] as const;
    const randomType =
      messageTypes[Math.floor(Math.random() * messageTypes.length)];

    const joseyAIMessages = {
      promotion: [
        {
          content: "AI Generated Bonus!",
          displayText:
            "🤖 JOSEYAI SPECIAL: AI-powered bonus match! Get 150% Gold Coins + AI-selected free spins! Code: AI150 🤖",
          promotionCode: "AI150",
        },
        {
          content: "Smart Bonus Alert!",
          displayText:
            "🧠 SMART BONUS: JoseyAI analyzed your play style! Perfect bonus package waiting in your account! 🧠",
          promotionCode: "SMART",
        },
        {
          content: "Personalized Offer!",
          displayText:
            "✨ PERSONALIZED: JoseyAI created a custom bonus just for you! Check your messages for details! ✨",
          promotionCode: "CUSTOM",
        },
      ],
      news: [
        {
          content: "AI Game Recommendation!",
          displayText:
            "🎯 AI RECOMMENDATION: Based on current trends, 'Mystic Fortune' has 23% higher win rates today! 🎯",
        },
        {
          content: "Smart Gaming Update!",
          displayText:
            "🔮 AI INSIGHT: JoseyAI detected optimal playing times! Peak winning periods: 6-8 PM EST! 🔮",
        },
        {
          content: "Intelligent Analysis!",
          displayText:
            "📊 AI ANALYSIS: Today's hottest games identified! JoseyAI recommends trying 'Dragon's Treasure'! 📊",
        },
      ],
      social: [
        {
          content: "Community AI Update!",
          displayText:
            "🤝 COMMUNITY: JoseyAI is learning from our amazing players! Help train AI by playing your favorites! 🤝",
        },
        {
          content: "AI Social Challenge!",
          displayText:
            "🎮 AI CHALLENGE: JoseyAI vs Players! Beat the AI's predicted scores this week for bonus rewards! 🎮",
        },
        {
          content: "Smart Community!",
          displayText:
            "💡 SMART COMMUNITY: JoseyAI helped 1,250 players optimize their gaming this week! Join the smart play! 💡",
        },
      ],
    };

    const templates = joseyAIMessages[randomType];
    const selectedTemplate =
      templates[Math.floor(Math.random() * templates.length)];

    const newMessage: TickerMessage = {
      id: `joseyai_${Date.now()}`,
      type: randomType,
      content: selectedTemplate.content,
      displayText: selectedTemplate.displayText,
      priority: "high",
      isActive: true,
      displayDuration: 12,
      metadata: {
        promotionCode: (selectedTemplate as any).promotionCode,
        url: randomType === "promotion" ? "/store" : undefined,
      },
      createdAt: new Date(),
      generatedBy: "joseyai",
    };

    setJoseyAIStatus("posting");
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setMessages((prev) => [newMessage, ...prev.slice(0, 19)]); // Keep only latest 20 messages
    setJoseyAIStatus("idle");
  };

  const getCurrentMessages = () => {
    const currentCategory = categories[currentCategoryIndex];
    return messages.filter(
      (msg) => msg.type === currentCategory.type && msg.isActive,
    );
  };

  const getCurrentMessage = () => {
    const categoryMessages = getCurrentMessages();
    if (categoryMessages.length === 0) return null;
    return categoryMessages[currentMessageIndex % categoryMessages.length];
  };

  if (!isVisible) {
    return (
      <motion.button
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => setIsVisible(true)}
        className="fixed top-4 right-4 bg-gradient-to-r from-gold to-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg hover:shadow-xl transition-all z-50"
      >
        <Bell className="w-3 h-3 mr-1 inline" />
        Show Ticker
      </motion.button>
    );
  }

  const currentCategory = categories[currentCategoryIndex];
  const currentMessage = getCurrentMessage();

  if (!currentMessage) return null;

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 ${className}`}>
      {/* Main Ticker Bar */}
      <div
        className={`relative bg-gradient-to-r ${currentCategory.bgGradient} shadow-lg border-b border-black/20`}
      >
        {/* Category Label */}
        <div className="absolute left-0 top-0 bottom-0 bg-black/40 px-4 flex items-center z-10 min-w-[120px]">
          <span className="text-white font-bold text-sm whitespace-nowrap">
            {currentCategory.label}
          </span>
          {enableJoseyAI && joseyAIStatus !== "idle" && (
            <div className="ml-2 flex items-center">
              <Bot className="w-3 h-3 text-blue-300" />
              {joseyAIStatus === "generating" && (
                <RefreshCw className="w-3 h-3 text-blue-300 animate-spin ml-1" />
              )}
            </div>
          )}
        </div>

        {/* Scrolling Content */}
        <div className="relative h-12 overflow-hidden pl-32 pr-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentMessage.id}-${currentCategoryIndex}`}
              initial={{ x: "100%" }}
              animate={{ x: "-100%" }}
              exit={{ x: "-100%" }}
              transition={{
                duration: currentMessage.displayDuration,
                ease: "linear",
                repeat: 0,
              }}
              className="absolute inset-y-0 flex items-center whitespace-nowrap"
            >
              <div className="flex items-center gap-3">
                <currentCategory.icon
                  className={`w-4 h-4 ${currentCategory.color}`}
                />
                <span className="font-medium text-white text-shadow-sm">
                  {currentMessage.displayText}
                </span>
                {currentMessage.metadata.promotionCode && (
                  <span className="bg-white/20 text-white px-2 py-1 rounded text-xs font-bold ml-2 backdrop-blur-sm">
                    CODE: {currentMessage.metadata.promotionCode}
                  </span>
                )}
                {currentMessage.generatedBy === "joseyai" && (
                  <span className="bg-blue-500/30 text-blue-200 px-2 py-1 rounded text-xs font-bold ml-2 backdrop-blur-sm">
                    <Bot className="w-3 h-3 inline mr-1" />
                    AI
                  </span>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="absolute right-0 top-0 bottom-0 bg-black/40 px-3 flex items-center gap-2 z-10">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="text-white/70 hover:text-white transition-colors p-1"
            title={isPaused ? "Resume ticker" : "Pause ticker"}
          >
            {isPaused ? (
              <Zap className="w-4 h-4" />
            ) : (
              <Target className="w-4 h-4" />
            )}
          </button>
          {enableJoseyAI && (
            <button
              onClick={generateJoseyAIMessage}
              disabled={joseyAIStatus !== "idle"}
              className="text-white/70 hover:text-white transition-colors p-1 disabled:opacity-50"
              title="Generate JoseyAI message"
            >
              <Bot
                className={`w-4 h-4 ${joseyAIStatus === "generating" ? "animate-pulse" : ""}`}
              />
            </button>
          )}
          <button
            onClick={() => setIsVisible(false)}
            className="text-white/70 hover:text-white transition-colors p-1"
            title="Hide ticker"
          >
            <VolumeX className="w-4 h-4" />
          </button>
        </div>

        {/* Priority Indicator */}
        {(currentMessage.priority === "urgent" ||
          currentMessage.priority === "high") && (
          <div className="absolute top-0 left-32 right-24 h-1 bg-gradient-to-r from-red-400 to-yellow-400 animate-pulse" />
        )}

        {/* Shine Effect for Urgent Messages */}
        {currentMessage.priority === "urgent" && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        )}
      </div>

      {/* Category Navigation Dots */}
      <div className="bg-black/20 backdrop-blur-sm py-1">
        <div className="flex justify-center gap-2">
          {categories.map((category, index) => (
            <button
              key={category.type}
              onClick={() => {
                setCurrentCategoryIndex(index);
                setCurrentMessageIndex(0);
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentCategoryIndex
                  ? "bg-white scale-125 shadow-lg"
                  : "bg-white/40 hover:bg-white/60"
              }`}
              title={category.label}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
