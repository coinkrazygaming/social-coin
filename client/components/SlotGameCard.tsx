import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Separator } from "./ui/separator";
import {
  Play,
  Star,
  Crown,
  Coins,
  Trophy,
  Eye,
  Info,
  Sparkles,
  Gift,
  DollarSign,
  Wallet,
} from "lucide-react";
import { SlotMachine as SlotMachineType } from "@shared/slotTypes";
import { SlotMachine } from "./SlotMachine";
import { useAuth } from "./AuthContext";

interface SlotGameCardProps {
  slot: SlotMachineType;
  onPlayFreeGC?: (currency: "GC" | "SC") => void;
  onPlayRealSC?: (currency: "GC" | "SC") => void;
  onPlayDemo?: () => void;
  userGCBalance?: number;
  userSCBalance?: number;
  onWalletUpdate?: (gcBalance: number, scBalance: number) => void;
}

export function SlotGameCard({
  slot,
  onPlayFreeGC,
  onPlayRealSC,
  onPlayDemo,
  userGCBalance = 0,
  userSCBalance = 0,
  onWalletUpdate,
}: SlotGameCardProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showPreview, setShowPreview] = useState(false);
  const [showCurrencySelector, setShowCurrencySelector] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<"GC" | "SC">("GC");
  const [gameMode, setGameMode] = useState<"free" | "real" | "demo">("demo");
  const [previewBalance, setPreviewBalance] = useState(100);

  const handleGameModeClick = (mode: "free" | "real" | "demo") => {
    if (!user && (mode === "free" || mode === "real")) {
      // Redirect to signup
      window.location.href = "/signup";
      return;
    }

    setGameMode(mode);

    if (mode === "demo") {
      setShowPreview(true);
      return;
    }

    // For real money modes, show currency selector
    if (mode === "free" || mode === "real") {
      setShowCurrencySelector(true);
    }
  };

  const handleCurrencySelect = () => {
    setShowCurrencySelector(false);

    switch (gameMode) {
      case "free":
        onPlayFreeGC?.(selectedCurrency);
        break;
      case "real":
        onPlayRealSC?.(selectedCurrency);
        break;
    }
  };

  const getCurrentBalance = () => {
    return selectedCurrency === "GC" ? userGCBalance : userSCBalance;
  };

  const getCurrencySymbol = (currency: "GC" | "SC") => {
    return currency === "GC" ? "GC" : "SC";
  };

  const getRarityColor = (rtp: number) => {
    if (rtp >= 96) return "text-purple-400";
    if (rtp >= 95) return "text-blue-400";
    if (rtp >= 94) return "text-green-400";
    return "text-yellow-400";
  };

  const getVolatilityIcon = (volatility: string) => {
    switch (volatility) {
      case "low":
        return "🟢";
      case "medium":
        return "🟡";
      case "high":
        return "🔴";
      default:
        return "⚪";
    }
  };

  return (
    <>
      <Card className="group relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl border-gold/30 bg-gradient-to-br from-gray-900/90 to-gray-800/90">
        {/* Thumbnail */}
        <div className="relative">
          <img
            src={slot.thumbnail}
            alt={slot.name}
            className="w-full h-48 object-cover"
          />

          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Provider Badge */}
          <div className="absolute top-3 left-3">
            <Badge className="bg-gold text-black font-bold border-0">
              <Crown className="h-3 w-3 mr-1" />
              {slot.provider}
            </Badge>
          </div>

          {/* Featured Badge */}
          {slot.featured && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-purple-600 text-white border-purple-400 animate-pulse">
                <Sparkles className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            </div>
          )}

          {/* Quick Stats Overlay */}
          <div className="absolute bottom-3 left-3 flex items-center space-x-2">
            <Badge
              variant="outline"
              className="border-white/50 text-white bg-black/50"
            >
              RTP: <span className={getRarityColor(slot.rtp)}>{slot.rtp}%</span>
            </Badge>
            <Badge
              variant="outline"
              className="border-white/50 text-white bg-black/50"
            >
              {getVolatilityIcon(slot.volatility)} {slot.volatility}
            </Badge>
          </div>

          {/* Preview Button */}
          <div className="absolute bottom-3 right-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowPreview(true)}
              className="border-white/50 text-white bg-black/50 hover:bg-black/70"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg text-white group-hover:text-gold transition-colors">
                {slot.name}
              </CardTitle>
              <CardDescription className="text-gray-400 text-sm mt-1 line-clamp-2">
                {slot.description}
              </CardDescription>
            </div>
          </div>

          {/* Theme and Details */}
          <div className="flex items-center justify-between mt-2">
            <Badge variant="secondary" className="text-xs">
              {slot.theme}
            </Badge>
            <div className="flex items-center space-x-1 text-xs text-gray-400">
              <span>
                {slot.reels.length}x{slot.rows}
              </span>
              <span>•</span>
              <span>{slot.paylines.length} lines</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Game Mode Buttons */}
          <div className="space-y-2">
            {/* Real Money Play Button */}
            {user && (
              <Button
                onClick={() => handleGameModeClick("real")}
                className="w-full bg-gradient-to-r from-gold to-yellow-400 text-black font-bold hover:from-yellow-400 hover:to-gold transition-all duration-300"
                size="sm"
              >
                <Trophy className="h-4 w-4 mr-2" />
                Play for Real Prizes!
              </Button>
            )}

            {/* Fun Play Button */}
            {user && (
              <Button
                onClick={() => handleGameModeClick("free")}
                variant="outline"
                className="w-full border-green-400 text-green-400 hover:bg-green-400 hover:text-black transition-all duration-300"
                size="sm"
              >
                <Coins className="h-4 w-4 mr-2" />
                Play for Fun!
              </Button>
            )}

            {/* User wallet display */}
            {user && (
              <div className="flex justify-between text-xs mt-2 p-2 bg-gray-800/50 rounded">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-gold rounded-full mr-1"></div>
                  <span className="text-gold font-semibold">{userGCBalance.toLocaleString()} GC</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-1"></div>
                  <span className="text-purple-400 font-semibold">{userSCBalance.toLocaleString()} SC</span>
                </div>
              </div>
            )}

            {/* Play Demo Mode */}
            <Button
              onClick={() => handleGameModeClick("demo")}
              variant="outline"
              className="w-full border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black transition-all duration-300"
              size="sm"
            >
              <Play className="h-4 w-4 mr-2" />
              Play Demo Mode
            </Button>

            {/* Signup prompt for non-users */}
            {!user && (
              <div className="text-center mt-2">
                <p className="text-xs text-gray-400">
                  <a href="/signup" className="text-gold hover:underline">
                    Sign up
                  </a>{" "}
                  to play for real prizes!
                </p>
              </div>
            )}
          </div>

          {/* Betting Range */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700">
            <div className="text-xs text-gray-400">
              <span className="font-semibold text-white">Play:</span>{" "}
              {slot.minBet} - {slot.maxBet} coins
            </div>
            <div className="text-xs text-gray-400">
              <span className="font-semibold text-white">Max Win:</span>{" "}
              {slot.symbols[0]?.value || 1000}x
            </div>
          </div>

          {/* CoinKrazy Branding */}
          <div className="text-center mt-2">
            <p className="text-xs text-gold font-bold opacity-70">
              CoinKrazy.com
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-900 to-gray-800 border-gold/50">
          <DialogHeader>
            <DialogTitle className="text-gold flex items-center">
              <Crown className="h-5 w-5 mr-2" />
              {slot.name} - Demo Mode
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              Try out this CoinKrazy slot machine with virtual credits. No real
              money required!
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <SlotMachine
              slot={slot}
              userId="demo"
              userBalance={previewBalance}
              currency="GC"
              onSpin={async (bet) => {
                // Demo mode with limited credits
                if (previewBalance < bet) {
                  throw new Error("Insufficient demo credits");
                }

                return {
                  id: "demo",
                  userId: "demo",
                  slotId: slot.id,
                  bet,
                  result: [
                    [
                      slot.symbols[
                        Math.floor(Math.random() * slot.symbols.length)
                      ]?.id || "wild",
                      slot.symbols[
                        Math.floor(Math.random() * slot.symbols.length)
                      ]?.id || "wild",
                      slot.symbols[
                        Math.floor(Math.random() * slot.symbols.length)
                      ]?.id || "wild",
                    ],
                    [
                      slot.symbols[
                        Math.floor(Math.random() * slot.symbols.length)
                      ]?.id || "wild",
                      slot.symbols[
                        Math.floor(Math.random() * slot.symbols.length)
                      ]?.id || "wild",
                      slot.symbols[
                        Math.floor(Math.random() * slot.symbols.length)
                      ]?.id || "wild",
                    ],
                    [
                      slot.symbols[
                        Math.floor(Math.random() * slot.symbols.length)
                      ]?.id || "wild",
                      slot.symbols[
                        Math.floor(Math.random() * slot.symbols.length)
                      ]?.id || "wild",
                      slot.symbols[
                        Math.floor(Math.random() * slot.symbols.length)
                      ]?.id || "wild",
                    ],
                  ],
                  winAmount:
                    Math.random() > 0.7 ? bet * (Math.random() * 2 + 1) : 0,
                  winLines: [],
                  timestamp: new Date(),
                };
              }}
              onBalanceUpdate={(newBalance) => {
                setPreviewBalance(Math.max(0, newBalance));
                // If balance reaches 0 or below, show signup prompt
                if (newBalance <= 0) {
                  setTimeout(() => {
                    setShowPreview(false);
                    window.location.href = "/signup";
                  }, 2000);
                }
              }}
            />
          </div>
          <div className="mt-4 text-center space-y-2">
            <div className="bg-orange-900/50 border border-orange-500/50 rounded-lg p-3">
              <p className="text-sm text-orange-300 font-semibold">
                🎮 Demo Mode - {previewBalance} Credits Remaining
              </p>
              <p className="text-xs text-orange-200 mt-1">
                This is for testing only. No real money involved.
              </p>
            </div>
            <p className="text-sm text-gray-400">
              Want to play for real prizes?
              <a href="/signup" className="text-gold hover:underline ml-1">
                Sign up now
              </a>{" "}
              and get bonus credits!
            </p>
            {previewBalance <= 10 && (
              <div className="bg-red-900/50 border border-red-500/50 rounded-lg p-2">
                <p className="text-sm text-red-300">
                  ⚠️ Low demo credits!
                  <a href="/signup" className="text-gold hover:underline ml-1">
                    Sign up
                  </a>{" "}
                  to continue playing.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Currency Selection Modal */}
      <Dialog open={showCurrencySelector} onOpenChange={setShowCurrencySelector}>
        <DialogContent className="max-w-md bg-gradient-to-br from-gray-900 to-gray-800 border-gold/50">
          <DialogHeader>
            <DialogTitle className="text-gold flex items-center">
              <Wallet className="h-5 w-5 mr-2" />
              Select Currency
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              Choose your currency for {slot.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-4">
                {gameMode === "real" ? "Play for Real Prizes" : "Play for Fun"}
              </h3>
            </div>

            <Select value={selectedCurrency} onValueChange={(value: "GC" | "SC") => setSelectedCurrency(value)}>
              <SelectTrigger className="w-full bg-gray-800 border-gold/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GC">
                  <div className="flex items-center justify-between w-full">
                    <span className="flex items-center">
                      <div className="w-3 h-3 bg-gold rounded-full mr-2"></div>
                      Gold Coins (GC)
                    </span>
                    <span className="ml-4 text-gold font-semibold">
                      {userGCBalance.toLocaleString()}
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="SC">
                  <div className="flex items-center justify-between w-full">
                    <span className="flex items-center">
                      <div className="w-3 h-3 bg-purple-400 rounded-full mr-2"></div>
                      Sweeps Coins (SC)
                    </span>
                    <span className="ml-4 text-purple-400 font-semibold">
                      {userSCBalance.toLocaleString()}
                    </span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            <div className="bg-gray-800/50 rounded-lg p-3">
              <div className="text-sm text-gray-300">
                <div className="flex justify-between">
                  <span>Current Balance:</span>
                  <span className={`font-semibold ${
                    selectedCurrency === "GC" ? "text-gold" : "text-purple-400"
                  }`}>
                    {getCurrentBalance().toLocaleString()} {getCurrencySymbol(selectedCurrency)}
                  </span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>Play Range:</span>
                  <span className="text-white">
                    {slot.minBet} - {slot.maxBet} {getCurrencySymbol(selectedCurrency)}
                  </span>
                </div>
              </div>
            </div>

            {getCurrentBalance() < slot.minBet && (
              <div className="bg-red-900/50 border border-red-500/50 rounded-lg p-3">
                <p className="text-sm text-red-300">
                  ⚠️ Insufficient {getCurrencySymbol(selectedCurrency)} balance.
                  {selectedCurrency === "GC" ? (
                    <> You need more Gold Coins to play.</>
                  ) : (
                    <> Purchase packages to get more Sweeps Coins.</>
                  )}
                </p>
              </div>
            )}

            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowCurrencySelector(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCurrencySelect}
                disabled={getCurrentBalance() < slot.minBet}
                className="flex-1 bg-gradient-to-r from-gold to-yellow-400 text-black font-bold hover:from-yellow-400 hover:to-gold"
              >
                Play with {getCurrencySymbol(selectedCurrency)}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
