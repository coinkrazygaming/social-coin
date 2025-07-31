import { useState, useEffect } from "react";
import { Badge } from "./ui/badge";
import { Trophy, Clock, Target, DollarSign, Zap, Star } from "lucide-react";
import { TickerItem } from "@shared/types";

export function Ticker() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [tickerItems, setTickerItems] = useState<TickerItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  // Fallback ticker items when API is unavailable
  const fallbackItems: TickerItem[] = [
    {
      id: "fallback-1",
      type: "promo",
      content: "🎉 Welcome to CoinKrazy - Play 700+ slot games for FREE!",
      priority: 5,
      createdAt: new Date(),
    },
    {
      id: "fallback-2",
      type: "win",
      content: "💰 Player just won 50,000 Gold Coins on Mega Fortune!",
      priority: 4,
      createdAt: new Date(),
    },
    {
      id: "fallback-3",
      type: "sports",
      content: "🏈 Live NFL betting now available with real-time odds!",
      priority: 3,
      createdAt: new Date(),
    },
  ];

  useEffect(() => {
    fetchTickerItems();
    // Refresh ticker items every 30 seconds
    const interval = setInterval(fetchTickerItems, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchTickerItems = async (retryCount = 0) => {
    // Prevent concurrent requests
    if (isFetching && retryCount === 0) {
      console.log("Ticker fetch already in progress, skipping...");
      return;
    }

    setIsFetching(true);
    let timeoutId: NodeJS.Timeout | null = null;
    let controller: AbortController | null = null;

    try {
      // Create abort controller and timeout
      controller = new AbortController();
      timeoutId = setTimeout(() => {
        if (controller && !controller.signal.aborted) {
          controller.abort();
        }
      }, 8000); // Increased timeout to 8 seconds

      const response = await fetch("/api/ticker", {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      // Clear timeout on successful response
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }

      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          setTickerItems(Array.isArray(data) ? data : []);
          console.log(
            "Ticker items loaded successfully:",
            data.length,
            "items",
          );
        } else {
          console.warn("Ticker API returned non-JSON response, using fallback");
          setTickerItems(fallbackItems);
        }
      } else {
        console.warn(
          "Ticker API returned error status:",
          response.status,
          response.statusText,
        );
        setTickerItems(fallbackItems);
      }
    } catch (error) {
      // Clean up timeout if it exists
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }

      // Handle different error types
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          console.warn("Ticker request was aborted (timeout or cancellation)");
          // Don't retry on abort errors, just use fallback
          setTickerItems(fallbackItems);
          return;
        } else if (error.message.includes("Failed to fetch")) {
          console.warn(
            "Network error fetching ticker - server may be unavailable",
          );
        } else {
          console.error("Error fetching ticker items:", error);
        }
      } else {
        console.error("Unknown error fetching ticker items:", error);
      }

      // Retry once after a short delay (but not for abort errors)
      if (retryCount < 1 && !(error instanceof Error && error.name === "AbortError")) {
        console.log(`Retrying ticker fetch... attempt ${retryCount + 1}`);
        setTimeout(() => fetchTickerItems(retryCount + 1), 3000);
        return;
      }

      // Use fallback items on failure
      console.log("Using fallback ticker items after failed retries");
      setTickerItems(fallbackItems);
    } finally {
      // Clean up timeout if it still exists
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      if (retryCount === 0) {
        // Only set loading false on first attempt
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (tickerItems.length === 0) return;

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
