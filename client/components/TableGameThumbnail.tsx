import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { 
  Users, 
  TrendingUp, 
  Clock,
  Trophy,
  Coins,
  Star,
  Play,
  Crown,
  Timer
} from 'lucide-react';
import { TableGame } from '@shared/slotTypes';
import { useAuth } from './AuthContext';
import { AuthModal } from './AuthModal';
import { AccessDeniedModal } from './AccessDeniedModal';

interface TableGameThumbnailProps {
  game: TableGame;
  onPlay: (gameId: string, currency: 'GC' | 'SC') => void;
  size?: 'small' | 'medium' | 'large';
}

export function TableGameThumbnail({ game, onPlay, size = 'medium' }: TableGameThumbnailProps) {
  const { user } = useAuth();
  const [showCurrencyDialog, setShowCurrencyDialog] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<'GC' | 'SC' | null>(null);

  const handlePlayClick = (currency: 'GC' | 'SC') => {
    if (!user) {
      if (currency === 'SC') {
        setShowAccessDenied(true);
      } else {
        setShowAuthModal(true);
      }
      return;
    }
    setSelectedCurrency(currency);
    setShowCurrencyDialog(true);
  };

  const handleConfirmPlay = () => {
    if (selectedCurrency) {
      onPlay(game.id, selectedCurrency);
      setShowCurrencyDialog(false);
      setSelectedCurrency(null);
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getCardSize = () => {
    switch (size) {
      case 'small': return 'w-48 h-80';
      case 'large': return 'w-80 h-96';
      default: return 'w-64 h-88';
    }
  };

  const getTypeIcon = () => {
    switch (game.type) {
      case 'card':
        return <Trophy className="h-4 w-4" />;
      case 'poker':
        return <Crown className="h-4 w-4" />;
      default:
        return <Play className="h-4 w-4" />;
    }
  };

  const occupancyPercentage = (game.currentPlayers / game.maxPlayers) * 100;
  const getOccupancyColor = () => {
    if (occupancyPercentage >= 80) return 'text-casino-red';
    if (occupancyPercentage >= 60) return 'text-yellow-400';
    return 'text-casino-green';
  };

  return (
    <>
      <Card className={`${getCardSize()} group hover:scale-105 transition-all duration-300 overflow-hidden relative`}>
        {/* Thumbnail Image */}
        <div className="relative h-40 overflow-hidden">
          <img
            src={game.thumbnail}
            alt={game.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          
          {/* CoinKrazy.com Branding Overlay */}
          <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-bold">
            CoinKrazy.com
          </div>
          
          {/* Game Type Badge */}
          <Badge className="absolute top-2 left-2 bg-casino-green text-white">
            {getTypeIcon()}
            <span className="ml-1 capitalize">{game.type} Game</span>
          </Badge>
          
          {/* Stats Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-2 left-2 right-2 text-white">
              <div className="grid grid-cols-2 gap-1 text-xs">
                <div className="bg-black/50 rounded p-1">
                  <div className="flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    <span>RTP: {game.rtp}%</span>
                  </div>
                </div>
                <div className="bg-black/50 rounded p-1">
                  <div className="flex items-center">
                    <Coins className="h-3 w-3 mr-1 text-gold" />
                    <span>${game.minBet}-${game.maxBet}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <CardContent className="p-4 space-y-3">
          {/* Game Info */}
          <div>
            <CardTitle className="text-lg leading-tight">{game.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{game.description}</p>
          </div>

          {/* Player Stats */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Players:</span>
              <span className={`font-bold ${getOccupancyColor()}`}>
                {game.currentPlayers}/{game.maxPlayers}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Table Limits:</span>
              <span className="font-bold text-gold">${game.minBet} - ${game.maxBet}</span>
            </div>
          </div>

          {/* Winner Stats */}
          <div className="space-y-2 text-xs">
            {game.lastWinner && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Last Winner:</span>
                <div className="text-right">
                  <div className="font-semibold text-casino-green">
                    {game.lastWinner.firstName} {game.lastWinner.lastInitial}.
                  </div>
                  <div className="text-muted-foreground">
                    {game.lastWinner.amount.toLocaleString()} {game.lastWinner.currency} • {formatTime(game.lastWinner.timestamp)}
                  </div>
                </div>
              </div>
            )}
            
            {game.biggestWin && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Biggest Win:</span>
                <div className="text-right">
                  <div className="font-semibold text-gold">
                    {game.biggestWin.firstName} {game.biggestWin.lastInitial}.
                  </div>
                  <div className="text-muted-foreground">
                    {game.biggestWin.amount.toLocaleString()} {game.biggestWin.currency} • {formatTime(game.biggestWin.timestamp)}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Play Buttons */}
          <div className="flex gap-2 pt-2">
            <Button 
              size="sm" 
              className="flex-1 bg-gradient-to-r from-gold to-yellow-400 text-gold-foreground hover:from-yellow-400 hover:to-gold"
              onClick={() => handlePlayClick('GC')}
              disabled={game.currentPlayers >= game.maxPlayers}
            >
              <Coins className="h-3 w-3 mr-1" />
              Play GC
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              className="flex-1 border-sweep text-sweep hover:bg-sweep/10"
              onClick={() => handlePlayClick('SC')}
              disabled={game.currentPlayers >= game.maxPlayers}
            >
              <Star className="h-3 w-3 mr-1" />
              Play SC
            </Button>
          </div>

          {game.currentPlayers >= game.maxPlayers && (
            <div className="text-center text-xs text-casino-red">
              Table Full - Join Waitlist
            </div>
          )}
        </CardContent>
      </Card>

      {/* Currency Selection Dialog */}
      <Dialog open={showCurrencyDialog} onOpenChange={setShowCurrencyDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              <span className="text-gold">CoinKrazy</span>.com
            </DialogTitle>
            <DialogDescription className="text-center text-lg">
              You Selected to play <strong>{game.name}</strong> with{' '}
              <span className={selectedCurrency === 'GC' ? 'text-gold font-bold' : 'text-sweep font-bold'}>
                {selectedCurrency === 'GC' ? 'Gold Coins' : 'Sweeps Coins'}
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {selectedCurrency === 'GC' ? (
              <div className="space-y-4">
                <div className="p-4 bg-gold/10 border border-gold/20 rounded-lg">
                  <h4 className="font-semibold text-gold mb-2">Gold Coins Table Game</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Play with Gold Coins for entertainment</li>
                    <li>• Win additional Gold Coins only</li>
                    <li>• No cash value - for fun only</li>
                    <li>• Table limits: ${game.minBet} - ${game.maxBet}</li>
                  </ul>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                  By continuing, you accept the Terms of Service of CoinKrazy.com
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setShowCurrencyDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="flex-1 bg-gradient-to-r from-gold to-yellow-400 text-gold-foreground hover:from-yellow-400 hover:to-gold"
                    onClick={handleConfirmPlay}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Join Table
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-sweep/10 border border-sweep/20 rounded-lg">
                  <h4 className="font-semibold text-sweep mb-2">Sweeps Coins Table Game</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Play with Sweeps Coins (1 SC = $1 redeemable value)</li>
                    <li>• Win additional Sweeps Coins</li>
                    <li>• Cannot be purchased - only earned or won</li>
                    <li>• Table limits: ${game.minBet} - ${game.maxBet}</li>
                  </ul>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setShowCurrencyDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="flex-1 bg-gradient-to-r from-sweep to-purple-600 text-sweep-foreground hover:from-purple-600 hover:to-sweep"
                    onClick={handleConfirmPlay}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Join Table
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        defaultTab="register"
      />
    </>
  );
}
