import { useState, useEffect } from "react";
import { Badge } from "./ui/badge";
import { Trophy, Clock, Target, DollarSign, Zap, Star } from "lucide-react";
import { TickerItem } from "@shared/types";

export function Ticker() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [tickerItems, setTickerItems] = useState<TickerItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTickerItems();
    // Refresh ticker items every 30 seconds
    const interval = setInterval(fetchTickerItems, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchTickerItems = async () => {
    try {
      const response = await fetch("/api/ticker");
      if (response.ok) {
        const data = await response.json();
        setTickerItems(data);
      }
    } catch (error) {
      console.error("Error fetching ticker items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % tickerItems.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [tickerItems.length]);

  const getItemStyle = (type: TickerItem["type"]) => {
    switch (type) {
      case "win":
        return "bg-casino-green/20 text-casino-green border-casino-green/30";
      case "jackpot":
        return "bg-gold/20 text-gold border-gold/30 casino-glow";
      case "sports":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "bingo":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "promo":
        return "bg-sweep/20 text-sweep border-sweep/30 sweep-glow";
      case "mini-game":
        return "bg-gold/20 text-gold border-gold/30 casino-glow";
      default:
        return "bg-muted/20 text-muted-foreground border-muted/30";
    }
  };

  const getItemIcon = (type: TickerItem["type"]) => {
    switch (type) {
      case "win":
        return <Trophy className="h-4 w-4" />;
      case "jackpot":
        return <DollarSign className="h-4 w-4" />;
      case "sports":
        return <Target className="h-4 w-4" />;
      case "bingo":
        return <Clock className="h-4 w-4" />;
      case "promo":
        return <Zap className="h-4 w-4" />;
      case "mini-game":
        return <Star className="h-4 w-4" />;
      default:
        return <Trophy className="h-4 w-4" />;
    }
  };

  if (isLoading || tickerItems.length === 0) {
    return (
      <div className="w-full bg-card/50 backdrop-blur border-b border-border/40 overflow-hidden">
        <div className="container px-4 py-2">
          <div className="flex items-center justify-center">
            <Badge
              variant="outline"
              className="bg-muted/20 text-muted-foreground border-muted/30 flex items-center space-x-2 px-4 py-2 text-sm"
            >
              <Zap className="h-4 w-4" />
              <span className="font-medium">
                Welcome to CoinKrazy - The Ultimate Social Casino!
              </span>
            </Badge>
          </div>
        </div>
      </div>
    );
  }

  const currentItem = tickerItems[currentIndex];

  // Handle case where currentItem might be undefined
  if (!currentItem) {
    return (
      <div className="w-full bg-card/50 backdrop-blur border-b border-border/40 overflow-hidden">
        <div className="container px-4 py-2">
          <div className="flex items-center justify-center">
            <Badge
              variant="outline"
              className="bg-muted/20 text-muted-foreground border-muted/30 flex items-center space-x-2 px-4 py-2 text-sm"
            >
              <Zap className="h-4 w-4" />
              <span className="font-medium">
                Welcome to CoinKrazy - The Ultimate Social Casino!
              </span>
            </Badge>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-card/50 backdrop-blur border-b border-border/40 overflow-hidden">
      <div className="container px-4 py-2">
        <div className="flex items-center justify-center">
          <Badge
            variant="outline"
            className={`flex items-center space-x-2 px-4 py-2 text-sm transition-all duration-500 ${getItemStyle(currentItem.type)}`}
          >
            {getItemIcon(currentItem.type)}
            <span className="font-medium animate-pulse">
              {currentItem.content}
            </span>
          </Badge>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="h-1 bg-muted/20">
        <div
          className="h-full bg-gradient-to-r from-gold to-sweep transition-all duration-1000 ease-linear"
          style={{
            width: "100%",
            animation: "ticker-progress 4s infinite linear",
          }}
        />
      </div>

      <style>{`
        @keyframes ticker-progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}
