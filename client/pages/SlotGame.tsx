import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import {
  ArrowLeft,
  Wallet,
  TrendingUp,
  Star,
  Crown,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { SlotMachine } from "../components/SlotMachine";
import { useAuth } from "../components/AuthContext";
import { SlotMachine as SlotMachineType, SlotSpin } from "@shared/slotTypes";
import { DEFAULT_COINKRAZY_SLOTS } from "@shared/defaultSlots";

export default function SlotGame() {
  const { slotId } = useParams<{ slotId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [slot, setSlot] = useState<SlotMachineType | null>(null);
  const [walletBalance, setWalletBalance] = useState<{
    GC: number;
    SC: number;
  }>({ GC: 0, SC: 0 });
  const [selectedCurrency, setSelectedCurrency] = useState<"GC" | "SC">("GC");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSlot();
    if (user) {
      loadWalletBalance();
    }
  }, [slotId, user]);

  const loadSlot = () => {
    // Find slot in default slots (in production, this would be an API call)
    const foundSlot = DEFAULT_COINKRAZY_SLOTS.find((s) => s.id === slotId);
    if (foundSlot) {
      setSlot(foundSlot);
    } else {
      setError("Slot not found");
    }
    setLoading(false);
  };

  const loadWalletBalance = async () => {
    if (!user) return;

    try {
      const response = await fetch(`/api/slots/wallet/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setWalletBalance(data.wallet);
      }
    } catch (error) {
      console.error("Error loading wallet balance:", error);
    }
  };

  const handleSpin = async (bet: number, currency: "GC" | "SC"): Promise<SlotSpin> => {
    if (!user || !slot) {
      throw new Error("User not authenticated or slot not loaded");
    }

    const response = await fetch(`/api/slots/${slot.id}/spin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.id,
        bet,
        currency,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Spin failed");
    }

    const data = await response.json();
    
    // Update wallet balance with server response
    if (data.walletUpdate) {
      setWalletBalance({
        GC: data.walletUpdate.gcBalance,
        SC: data.walletUpdate.scBalance,
      });
    }

    return data.spin;
  };

  const handleBalanceUpdate = (newBalance: number) => {
    // Update the specific currency balance
    setWalletBalance((prev) => ({
      ...prev,
      [selectedCurrency]: newBalance,
    }));
  };

  const handleWalletUpdate = (gcBalance: number, scBalance: number) => {
    setWalletBalance({ GC: gcBalance, SC: scBalance });
  };

  const getCurrentBalance = () => {
    return walletBalance[selectedCurrency];
  };

  const getCurrencyColor = (currency: "GC" | "SC") => {
    return currency === "GC" ? "text-gold" : "text-purple-400";
  };

  const getCurrencyBg = (currency: "GC" | "SC") => {
    return currency === "GC" ? "bg-gold" : "bg-purple-400";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin text-gold mx-auto mb-4" />
          <p className="text-white text-lg">Loading slot game...</p>
        </div>
      </div>
    );
  }

  if (error || !slot) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4 bg-gray-800 border-red-500/50">
          <CardHeader>
            <CardTitle className="text-red-400 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Game Not Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">
              {error || "The requested slot game could not be found."}
            </p>
            <Button
              onClick={() => navigate("/")}
              className="w-full bg-gold hover:bg-gold/80 text-black font-bold"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Games
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4 bg-gray-800 border-gold/50">
          <CardHeader>
            <CardTitle className="text-gold flex items-center">
              <Crown className="h-5 w-5 mr-2" />
              Login Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">
              Please log in to play {slot.name} and access your wallet.
            </p>
            <div className="space-y-2">
              <Button
                onClick={() => navigate("/login")}
                className="w-full bg-gold hover:bg-gold/80 text-black font-bold"
              >
                Login
              </Button>
              <Button
                onClick={() => navigate("/signup")}
                variant="outline"
                className="w-full border-gold text-gold hover:bg-gold/10"
              >
                Sign Up
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-gray-800/50 border-b border-gold/20 sticky top-0 z-10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/")}
                className="border-gold/30 text-gold hover:bg-gold/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Games
              </Button>
              
              <div className="flex items-center">
                <img
                  src={slot.thumbnail}
                  alt={slot.name}
                  className="w-12 h-12 rounded border-2 border-gold/50 mr-3"
                />
                <div>
                  <h1 className="text-xl font-bold text-white">{slot.name}</h1>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-gold text-black">
                      <Crown className="h-3 w-3 mr-1" />
                      {slot.provider}
                    </Badge>
                    {slot.featured && (
                      <Badge className="bg-purple-600 text-white">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Wallet Display */}
            <div className="flex items-center space-x-4">
              <div className="bg-gray-700/50 rounded-lg p-3 border border-gold/20">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gold rounded-full mr-2"></div>
                    <span className="text-gold font-bold">
                      {walletBalance.GC.toLocaleString()} GC
                    </span>
                  </div>
                  <Separator orientation="vertical" className="h-6" />
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-purple-400 rounded-full mr-2"></div>
                    <span className="text-purple-400 font-bold">
                      {walletBalance.SC.toLocaleString()} SC
                    </span>
                  </div>
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={loadWalletBalance}
                className="border-gold/30 text-gold hover:bg-gold/10"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Currency Selection */}
      <div className="container mx-auto px-4 py-6">
        <Card className="mb-6 bg-gray-800/50 border-gold/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Wallet className="h-5 w-5 mr-2" />
              Select Currency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Card
                className={`cursor-pointer transition-all duration-300 border-2 ${
                  selectedCurrency === "GC"
                    ? "border-gold bg-gold/10"
                    : "border-gray-600 hover:border-gold/50"
                }`}
                onClick={() => setSelectedCurrency("GC")}
              >
                <CardContent className="p-4 text-center">
                  <div className="w-8 h-8 bg-gold rounded-full mx-auto mb-2"></div>
                  <h3 className="font-bold text-gold">Gold Coins (GC)</h3>
                  <p className="text-2xl font-bold text-gold mt-2">
                    {walletBalance.GC.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Play for Fun</p>
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer transition-all duration-300 border-2 ${
                  selectedCurrency === "SC"
                    ? "border-purple-400 bg-purple-400/10"
                    : "border-gray-600 hover:border-purple-400/50"
                }`}
                onClick={() => setSelectedCurrency("SC")}
              >
                <CardContent className="p-4 text-center">
                  <div className="w-8 h-8 bg-purple-400 rounded-full mx-auto mb-2"></div>
                  <h3 className="font-bold text-purple-400">Sweeps Coins (SC)</h3>
                  <p className="text-2xl font-bold text-purple-400 mt-2">
                    {walletBalance.SC.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Play for Prizes</p>
                </CardContent>
              </Card>
            </div>

            {getCurrentBalance() < slot.minBet && (
              <div className="mt-4 bg-red-900/50 border border-red-500/50 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
                  <div>
                    <p className="text-red-400 font-semibold">
                      Insufficient {selectedCurrency} Balance
                    </p>
                    <p className="text-red-300 text-sm">
                      You need at least {slot.minBet} {selectedCurrency} to play.{" "}
                      {selectedCurrency === "SC" && (
                        <a href="/store" className="text-gold hover:underline">
                          Purchase packages to get more SC.
                        </a>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Slot Machine */}
        <SlotMachine
          slot={slot}
          userId={user.id}
          userBalance={getCurrentBalance()}
          currency={selectedCurrency}
          realTimeMode={true}
          onSpin={handleSpin}
          onBalanceUpdate={handleBalanceUpdate}
          onWalletUpdate={handleWalletUpdate}
        />
      </div>
    </div>
  );
}
