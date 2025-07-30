import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Users,
  Crown,
  DollarSign,
  Play,
  Coins,
  Star,
  ChevronRight,
  TrendingUp,
  BarChart3,
  Target,
  Activity,
  Eye,
  ShoppingCart,
} from "lucide-react";
import { PokerTable } from "@shared/slotTypes";
import { useAuth } from "./AuthContext";
import { AuthModal } from "./AuthModal";
import { AccessDeniedModal } from "./AccessDeniedModal";
import { getTableDailyStats } from "@shared/enhancedTableGameData";

interface EnhancedPokerTableThumbnailProps {
  table: PokerTable;
  onJoinTable: (
    tableId: string,
    seatNumber: number,
    currency: "GC" | "SC",
  ) => void;
  size?: "small" | "medium" | "large";
  showProfitStats?: boolean;
}

export function EnhancedPokerTableThumbnail({
  table,
  onJoinTable,
  size = "medium",
  showProfitStats = false,
}: EnhancedPokerTableThumbnailProps) {
  const { user } = useAuth();
  const [showSeatSelection, setShowSeatSelection] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [showBuyInDialog, setShowBuyInDialog] = useState(false);
  const [buyInAmount, setBuyInAmount] = useState(table.buyIn.min);

  const handleTableClick = () => {
    if (!user) {
      if (table.currency === "SC") {
        setShowAccessDenied(true);
      } else {
        setShowAuthModal(true);
      }
      return;
    }
    setShowSeatSelection(true);
  };

  const handleSeatSelect = (seatNumber: number) => {
    if (table.seats[seatNumber - 1].player) return; // Seat occupied
    setSelectedSeat(seatNumber);
    setShowBuyInDialog(true);
  };

  const handleConfirmBuyIn = () => {
    if (selectedSeat && buyInAmount >= table.buyIn.min && buyInAmount <= table.buyIn.max) {
      onJoinTable(table.id, selectedSeat, table.currency);
      setShowSeatSelection(false);
      setShowBuyInDialog(false);
      setSelectedSeat(null);
    }
  };

  const getCardSize = () => {
    switch (size) {
      case "small":
        return "w-56 h-96";
      case "large":
        return "w-80 h-[28rem]";
      default:
        return "w-72 h-[26rem]";
    }
  };

  const occupiedSeats = table.seats.filter(
    (seat) => seat.player !== null,
  ).length;
  const availableSeats = table.maxSeats - occupiedSeats;

  const getGameTypeDisplay = () => {
    switch (table.gameType) {
      case "texas-holdem":
        return "Texas Hold'em";
      case "omaha":
        return "Omaha";
      case "seven-card-stud":
        return "7-Card Stud";
      case "blackjack":
        return "Blackjack";
      default:
        return table.gameType;
    }
  };

  const tableStats = getTableDailyStats(table.id);

  return (
    <>
      <Card
        className={`${getCardSize()} group hover:scale-105 transition-all duration-300 overflow-hidden relative cursor-pointer bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-gray-700 backdrop-blur-sm hover:border-gold/50`}
        onClick={handleTableClick}
      >
        {/* Enhanced Poker Table Visual */}
        <div className="relative h-48 bg-gradient-to-br from-green-800 via-green-700 to-green-900 p-4">
          {/* CoinKrazy.com Branding */}
          <div className="absolute top-2 right-2 bg-black/80 text-gold px-3 py-1 rounded-full text-xs font-bold border border-gold/30">
            CoinKrazy.com
          </div>

          {/* Game Type Badge */}
          <Badge className="absolute top-2 left-2 bg-gold text-black font-bold border-gold">
            <Crown className="h-3 w-3 mr-1" />
            {getGameTypeDisplay()}
          </Badge>

          {/* Enhanced 5-Seat Table Oval */}
          <div className="absolute inset-6 bg-gradient-to-br from-green-900 to-green-800 rounded-full border-4 border-gold shadow-2xl flex items-center justify-center">
            <div className="text-center text-white">
              <div className="text-lg font-bold text-gold">CoinKrazy</div>
              <div className="text-xs opacity-90">.com</div>
              {table.currentPot > 0 && (
                <div className="mt-1 text-xs bg-gold text-black px-2 py-1 rounded font-bold">
                  ${table.currentPot.toLocaleString()}
                </div>
              )}
            </div>
          </div>

          {/* Enhanced 5-Seat Indicators */}
          <div className="absolute inset-0">
            {table.seats.map((seat, index) => {
              // Position seats in a circle around the table (5 seats exactly)
              const angle = index * 72 - 90; // 72 degrees apart (360/5)
              const radius = 42;
              const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
              const y = 50 + radius * Math.sin((angle * Math.PI) / 180);

              return (
                <div
                  key={seat.seatNumber}
                  className="absolute w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold transform -translate-x-1/2 -translate-y-1/2 shadow-lg"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    backgroundColor: seat.player ? "#EF4444" : "#10B981",
                    boxShadow: seat.player ? "0 0 10px rgba(239, 68, 68, 0.5)" : "0 0 10px rgba(16, 185, 129, 0.5)",
                  }}
                >
                  {seat.seatNumber}
                </div>
              );
            })}
          </div>

          {/* Live indicator */}
          <div className="absolute bottom-2 left-2 flex items-center bg-black/60 px-2 py-1 rounded text-xs">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
            <span className="text-white font-medium">LIVE</span>
          </div>
        </div>

        <CardContent className="p-4 space-y-3">
          {/* Table Info */}
          <div>
            <CardTitle className="text-lg leading-tight text-white group-hover:text-gold transition-colors">
              {table.name}
            </CardTitle>
            <p className="text-sm text-gray-400">
              {getGameTypeDisplay()} • 5 Seats
            </p>
          </div>

          {/* Enhanced Table Stats */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Seats Available:</span>
              <div className="flex items-center">
                <span
                  className={`font-bold ${availableSeats > 0 ? "text-green-400" : "text-red-400"}`}
                >
                  {availableSeats}/5
                </span>
                {availableSeats > 0 && (
                  <div className="w-2 h-2 bg-green-400 rounded-full ml-2 animate-pulse" />
                )}
              </div>
            </div>

            {table.gameType !== "blackjack" && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Blinds:</span>
                <span className="font-bold text-gold">
                  {table.blinds.small}/{table.blinds.big} {table.currency}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Buy-in Range:</span>
              <span className="font-bold text-purple-400">
                {table.buyIn.min.toLocaleString()}-{table.buyIn.max.toLocaleString()} {table.currency}
              </span>
            </div>

            {/* Profit Stats for Admins */}
            {showProfitStats && tableStats && (
              <div className="border-t border-gray-600 pt-2 mt-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">Daily Profit:</span>
                  <span className="font-bold text-green-400">
                    ${tableStats.dailyProfit.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">Buy-ins Today:</span>
                  <span className="font-bold text-blue-400">
                    {tableStats.totalBuyIns}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">Avg Buy-in:</span>
                  <span className="font-bold text-yellow-400">
                    ${tableStats.averageBuyIn.toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Currency Badge */}
          <div className="flex justify-center">
            <Badge
              className={`${table.currency === "GC" ? "bg-gold/20 text-gold border-gold/30" : "bg-purple-600/20 text-purple-400 border-purple-600/30"}`}
              variant="outline"
            >
              {table.currency === "GC" ? (
                <Coins className="h-3 w-3 mr-1" />
              ) : (
                <Star className="h-3 w-3 mr-1" />
              )}
              {table.currency} Table
            </Badge>
          </div>

          {/* Enhanced Join Button */}
          <Button
            className={`w-full font-bold ${
              table.currency === "GC"
                ? "bg-gradient-to-r from-gold to-yellow-400 text-black hover:from-yellow-400 hover:to-gold"
                : "bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:from-violet-600 hover:to-purple-600"
            } ${availableSeats === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={availableSeats === 0}
          >
            {availableSeats > 0 ? (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Select Seat ({availableSeats} available)
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

      {/* Enhanced Seat Selection Dialog */}
      <Dialog open={showSeatSelection} onOpenChange={setShowSeatSelection}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">
              <span className="text-gold">CoinKrazy</span>.com Premium Table
            </DialogTitle>
            <DialogDescription className="text-center text-lg">
              Select your seat at <strong>{table.name}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Enhanced Table Visual with Interactive Seats */}
            <div className="relative h-96 bg-gradient-to-br from-green-800 via-green-700 to-green-900 rounded-lg p-8 border-4 border-gold/20">
              {/* CoinKrazy Branded Table */}
              <div className="absolute inset-8 bg-gradient-to-br from-green-900 to-green-800 rounded-full border-4 border-gold shadow-2xl flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-3xl font-bold text-gold">CoinKrazy</div>
                  <div className="text-lg opacity-90">.com</div>
                  {table.currentPot > 0 && (
                    <div className="mt-3 bg-gold text-black px-4 py-2 rounded-lg text-lg font-bold">
                      Pot: ${table.currentPot.toLocaleString()} {table.currency}
                    </div>
                  )}
                </div>
              </div>

              {/* Interactive 5-Seat Layout */}
              {table.seats.map((seat, index) => {
                const angle = index * 72 - 90; // 72 degrees apart for 5 seats
                const radius = 38;
                const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
                const y = 50 + radius * Math.sin((angle * Math.PI) / 180);

                return (
                  <div
                    key={seat.seatNumber}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                    }}
                  >
                    <Button
                      variant={seat.player ? "secondary" : "default"}
                      size="lg"
                      disabled={seat.player !== null}
                      onClick={() => handleSeatSelect(seat.seatNumber)}
                      className={`w-20 h-20 rounded-full text-xs font-bold shadow-xl border-2 ${
                        seat.player
                          ? "bg-red-600 text-white border-red-400 cursor-not-allowed"
                          : "bg-green-600 text-white hover:bg-green-500 border-green-400 hover:scale-110"
                      } transition-all duration-200`}
                    >
                      <div className="text-center">
                        <div className="text-sm">Seat {seat.seatNumber}</div>
                        {seat.player ? (
                          <div className="text-xs opacity-90 mt-1">
                            {seat.player.username.substring(0, 8)}
                            {seat.player.username.length > 8 ? "..." : ""}
                          </div>
                        ) : (
                          <div className="text-xs mt-1 opacity-90">Available</div>
                        )}
                        {seat.player && (
                          <div className="text-xs opacity-75">
                            ${seat.chipCount.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </Button>
                  </div>
                );
              })}

              {/* Legend */}
              <div className="absolute bottom-4 left-4 flex items-center space-x-4 text-white text-sm">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-600 rounded-full mr-2"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-600 rounded-full mr-2"></div>
                  <span>Occupied</span>
                </div>
              </div>
            </div>

            {/* Enhanced Table Info */}
            <div className="grid grid-cols-2 gap-6 text-sm bg-gray-800/50 rounded-lg p-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Game Type:</span>
                  <span className="font-medium text-white">{getGameTypeDisplay()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Currency:</span>
                  <span className="font-medium text-white">{table.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Available Seats:</span>
                  <span className="font-medium text-green-400">
                    {availableSeats}/5
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                {table.gameType !== "blackjack" && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Blinds:</span>
                    <span className="font-medium text-white">
                      {table.blinds.small}/{table.blinds.big} {table.currency}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-400">Buy-in Range:</span>
                  <span className="font-medium text-white">
                    {table.buyIn.min.toLocaleString()}-{table.buyIn.max.toLocaleString()} {table.currency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Players:</span>
                  <span className="font-medium text-white">
                    {occupiedSeats}/5
                  </span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => setShowSeatSelection(false)}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Buy-in Dialog */}
      <Dialog open={showBuyInDialog} onOpenChange={setShowBuyInDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              <span className="text-gold">CoinKrazy</span> Buy-in
            </DialogTitle>
            <DialogDescription className="text-center">
              Enter your buy-in amount for Seat {selectedSeat}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="text-center bg-gray-800/50 rounded-lg p-4">
              <div className="text-lg font-bold text-white mb-2">
                {table.name} - Seat {selectedSeat}
              </div>
              <div className="text-sm text-gray-400">
                Range: {table.buyIn.min.toLocaleString()} - {table.buyIn.max.toLocaleString()} {table.currency}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Buy-in Amount ({table.currency})
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  min={table.buyIn.min}
                  max={table.buyIn.max}
                  value={buyInAmount}
                  onChange={(e) => setBuyInAmount(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-gold focus:ring-1 focus:ring-gold"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                onClick={() => setShowBuyInDialog(false)}
              >
                Cancel
              </Button>
              <Button
                className={`flex-1 font-bold ${
                  table.currency === "GC"
                    ? "bg-gradient-to-r from-gold to-yellow-400 text-black hover:from-yellow-400 hover:to-gold"
                    : "bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:from-violet-600 hover:to-purple-600"
                }`}
                onClick={handleConfirmBuyIn}
                disabled={buyInAmount < table.buyIn.min || buyInAmount > table.buyIn.max}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Confirm Buy-in
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

      {/* Access Denied Modal */}
      <AccessDeniedModal
        isOpen={showAccessDenied}
        onClose={() => setShowAccessDenied(false)}
        feature="poker"
      />
    </>
  );
}
