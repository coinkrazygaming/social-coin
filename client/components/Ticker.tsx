import { useState, useEffect } from 'react';
import { Badge } from './ui/badge';
import { Trophy, Clock, Target, DollarSign, Zap } from 'lucide-react';

interface TickerItem {
  id: string;
  type: 'win' | 'jackpot' | 'sports' | 'bingo' | 'promo';
  content: string;
  icon?: React.ReactNode;
}

export function Ticker() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Mock ticker data - this would come from real-time API
  const tickerItems: TickerItem[] = [
    {
      id: '1',
      type: 'win',
      content: 'Player "LuckyStars77" just won 15,000 SC on Lightning Slots!',
      icon: <Trophy className="h-4 w-4" />
    },
    {
      id: '2',
      type: 'sports',
      content: 'Live Now: Lakers vs Warriors - Lakers +2.5 (-110)',
      icon: <Target className="h-4 w-4" />
    },
    {
      id: '3',
      type: 'bingo',
      content: 'Next Bingo Round starts in 3:24 - Join now for FREE!',
      icon: <Clock className="h-4 w-4" />
    },
    {
      id: '4',
      type: 'jackpot',
      content: 'MEGA JACKPOT: $50,000 SC - Play Royal Riches now!',
      icon: <DollarSign className="h-4 w-4" />
    },
    {
      id: '5',
      type: 'promo',
      content: 'FLASH SALE: Buy 10,000 GC and get 10,000 GC FREE + 10 SC Bonus!',
      icon: <Zap className="h-4 w-4" />
    },
    {
      id: '6',
      type: 'win',
      content: 'Congratulations "BigWinner2024" - 25,000 GC win on Blackjack!',
      icon: <Trophy className="h-4 w-4" />
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % tickerItems.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [tickerItems.length]);

  const getItemStyle = (type: TickerItem['type']) => {
    switch (type) {
      case 'win':
        return 'bg-casino-green/20 text-casino-green border-casino-green/30';
      case 'jackpot':
        return 'bg-gold/20 text-gold border-gold/30 casino-glow';
      case 'sports':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'bingo':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'promo':
        return 'bg-sweep/20 text-sweep border-sweep/30 sweep-glow';
      default:
        return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const currentItem = tickerItems[currentIndex];

  return (
    <div className="w-full bg-card/50 backdrop-blur border-b border-border/40 overflow-hidden">
      <div className="container px-4 py-2">
        <div className="flex items-center justify-center">
          <Badge
            variant="outline"
            className={`flex items-center space-x-2 px-4 py-2 text-sm transition-all duration-500 ${getItemStyle(currentItem.type)}`}
          >
            {currentItem.icon}
            <span className="font-medium animate-pulse">{currentItem.content}</span>
          </Badge>
        </div>
      </div>
      
      {/* Progress indicator */}
      <div className="h-1 bg-muted/20">
        <div 
          className="h-full bg-gradient-to-r from-gold to-sweep transition-all duration-[4000ms] ease-linear"
          style={{ 
            width: '100%',
            animation: 'ticker-progress 4s infinite linear'
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
