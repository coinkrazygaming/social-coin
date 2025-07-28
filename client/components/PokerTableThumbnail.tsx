import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { 
  Users, 
  Crown, 
  DollarSign,
  Play,
  Coins,
  Star,
  ChevronRight,
  Seat
} from 'lucide-react';
import { PokerTable } from '@shared/slotTypes';
import { useAuth } from './AuthContext';
import { AuthModal } from './AuthModal';
import { AccessDeniedModal } from './AccessDeniedModal';

interface PokerTableThumbnailProps {
  table: PokerTable;
  onJoinTable: (tableId: string, seatNumber: number, currency: 'GC' | 'SC') => void;
  size?: 'small' | 'medium' | 'large';
}

export function PokerTableThumbnail({ table, onJoinTable, size = 'medium' }: PokerTableThumbnailProps) {
  const { user } = useAuth();
  const [showSeatSelection, setShowSeatSelection] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAccessDenied, setShowAccessDenied] = useState(false);

  const handleTableClick = () => {
    if (!user) {
      if (table.currency === 'SC') {
        setShowAccessDenied(true);
      } else {
        setShowAuthModal(true);
      }
      return;
    }
    setShowSeatSelection(true);
  };

  const handleSeatSelect = (seatNumber: number) => {
    onJoinTable(table.id, seatNumber, table.currency);
    setShowSeatSelection(false);
  };

  const getCardSize = () => {
    switch (size) {
      case 'small': return 'w-48 h-80';
      case 'large': return 'w-80 h-96';
      default: return 'w-64 h-88';
    }
  };

  const occupiedSeats = table.seats.filter(seat => seat.player !== null).length;
  const availableSeats = table.maxSeats - occupiedSeats;

  const getGameTypeDisplay = () => {
    switch (table.gameType) {
      case 'texas-holdem': return 'Texas Hold\'em';
      case 'omaha': return 'Omaha';
      case 'seven-card-stud': return '7-Card Stud';
      case 'blackjack': return 'Blackjack';
      default: return table.gameType;
    }
  };

  return (
    <>
      <Card 
        className={`${getCardSize()} group hover:scale-105 transition-all duration-300 overflow-hidden relative cursor-pointer`}
        onClick={handleTableClick}
      >
        {/* Poker Table Visual */}
        <div className="relative h-40 bg-gradient-to-br from-casino-green via-green-700 to-casino-green p-4">
          {/* CoinKrazy.com Branding */}
          <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-bold">
            CoinKrazy.com
          </div>
          
          {/* Game Type Badge */}
          <Badge className="absolute top-2 left-2 bg-gold text-gold-foreground">
            <Crown className="h-3 w-3 mr-1" />
            {getGameTypeDisplay()}
          </Badge>

          {/* Poker Table Oval */}
          <div className="absolute inset-4 bg-gradient-to-br from-green-800 to-green-900 rounded-full border-4 border-yellow-600 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="text-xl font-bold">CoinKrazy</div>
              <div className="text-xs opacity-75">.com</div>
            </div>
          </div>

          {/* Seat Indicators */}
          <div className="absolute inset-0">
            {table.seats.slice(0, 6).map((seat, index) => {
              const angle = (index * 60) - 90; // Start from top
              const radius = 45;
              const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
              const y = 50 + radius * Math.sin((angle * Math.PI) / 180);
              
              return (
                <div
                  key={seat.seatNumber}
                  className="absolute w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    backgroundColor: seat.player ? '#EF4444' : '#10B981'
                  }}
                >
                  {seat.seatNumber}
                </div>
              );
            })}
          </div>

          {/* Current Pot */}
          {table.currentPot > 0 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-gold text-gold-foreground px-2 py-1 rounded text-xs font-bold">
              Pot: {table.currentPot.toLocaleString()} {table.currency}
            </div>
          )}
        </div>

        <CardContent className="p-4 space-y-3">
          {/* Table Info */}
          <div>
            <CardTitle className="text-lg leading-tight">{table.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{getGameTypeDisplay()}</p>
          </div>

          {/* Table Stats */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Seats:</span>
              <span className={`font-bold ${availableSeats > 0 ? 'text-casino-green' : 'text-casino-red'}`}>
                {occupiedSeats}/{table.maxSeats}
              </span>
            </div>
            
            {table.gameType !== 'blackjack' && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Blinds:</span>
                <span className="font-bold text-gold">
                  {table.blinds.small}/{table.blinds.big} {table.currency}
                </span>
              </div>
            )}
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Buy-in:</span>
              <span className="font-bold text-sweep">
                {table.buyIn.min.toLocaleString()}-{table.buyIn.max.toLocaleString()} {table.currency}
              </span>
            </div>
          </div>

          {/* Currency Badge */}
          <div className="flex justify-center">
            <Badge 
              className={`${table.currency === 'GC' ? 'bg-gold/20 text-gold border-gold/30' : 'bg-sweep/20 text-sweep border-sweep/30'}`}
              variant="outline"
            >
              {table.currency === 'GC' ? <Coins className="h-3 w-3 mr-1" /> : <Star className="h-3 w-3 mr-1" />}
              {table.currency} Table
            </Badge>
          </div>

          {/* Join Button */}
          <Button 
            className={`w-full ${table.currency === 'GC' ? 
              'bg-gradient-to-r from-gold to-yellow-400 text-gold-foreground hover:from-yellow-400 hover:to-gold' :
              'bg-gradient-to-r from-sweep to-purple-600 text-sweep-foreground hover:from-purple-600 hover:to-sweep'
            }`}
            disabled={availableSeats === 0}
          >
            {availableSeats > 0 ? (
              <>
                <Play className="h-4 w-4 mr-2" />
                Join Table
              </>
            ) : (
              <>
                <Users className="h-4 w-4 mr-2" />
                Table Full
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Seat Selection Dialog */}
      <Dialog open={showSeatSelection} onOpenChange={setShowSeatSelection}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-center">
              <span className="text-gold">CoinKrazy</span>.com Poker Table
            </DialogTitle>
            <DialogDescription className="text-center text-lg">
              Select your seat at <strong>{table.name}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Table Visual with Interactive Seats */}
            <div className="relative h-80 bg-gradient-to-br from-casino-green via-green-700 to-casino-green rounded-lg p-6">
              {/* Poker Table Oval */}
              <div className="absolute inset-6 bg-gradient-to-br from-green-800 to-green-900 rounded-full border-4 border-yellow-600 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-2xl font-bold">CoinKrazy</div>
                  <div className="text-sm opacity-75">.com</div>
                  {table.currentPot > 0 && (
                    <div className="mt-2 bg-gold text-gold-foreground px-3 py-1 rounded text-sm font-bold">
                      Pot: {table.currentPot.toLocaleString()} {table.currency}
                    </div>
                  )}
                </div>
              </div>

              {/* Interactive Seats */}
              {table.seats.map((seat, index) => {
                const angle = (index * (360 / table.maxSeats)) - 90;
                const radius = 35;
                const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
                const y = 50 + radius * Math.sin((angle * Math.PI) / 180);
                
                return (
                  <div
                    key={seat.seatNumber}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`
                    }}
                  >
                    <Button
                      variant={seat.player ? "secondary" : "default"}
                      size="sm"
                      disabled={seat.player !== null}
                      onClick={() => handleSeatSelect(seat.seatNumber)}
                      className={`w-16 h-16 rounded-full text-xs font-bold ${
                        seat.player ? 'bg-casino-red text-white' : 'bg-casino-green text-white hover:bg-green-600'
                      }`}
                    >
                      <div className="text-center">
                        <div>Seat {seat.seatNumber}</div>
                        {seat.player ? (
                          <div className="text-xs opacity-75">
                            {seat.player.username.substring(0, 6)}...
                          </div>
                        ) : (
                          <div className="text-xs">Available</div>
                        )}
                      </div>
                    </Button>
                  </div>
                );
              })}
            </div>

            {/* Table Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Game:</span>
                  <span className="font-medium">{getGameTypeDisplay()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Currency:</span>
                  <span className="font-medium">{table.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Available Seats:</span>
                  <span className="font-medium text-casino-green">{availableSeats}</span>
                </div>
              </div>
              <div className="space-y-2">
                {table.gameType !== 'blackjack' && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Blinds:</span>
                    <span className="font-medium">{table.blinds.small}/{table.blinds.big}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Buy-in Range:</span>
                  <span className="font-medium">{table.buyIn.min.toLocaleString()}-{table.buyIn.max.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Players:</span>
                  <span className="font-medium">{occupiedSeats}/{table.maxSeats}</span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button variant="outline" onClick={() => setShowSeatSelection(false)}>
                Cancel
              </Button>
            </div>
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
