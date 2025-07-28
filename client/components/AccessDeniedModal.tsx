import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AuthModal } from "./AuthModal";
import {
  Coins,
  Star,
  Gamepad2,
  Trophy,
  Zap,
  Gift,
  Crown,
  Target,
  Users,
  Sparkles,
} from "lucide-react";

interface AccessDeniedModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: string;
}

export function AccessDeniedModal({
  isOpen,
  onClose,
  feature,
}: AccessDeniedModalProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleSignUpClick = () => {
    setShowAuthModal(true);
    onClose();
  };

  const getFeatureTitle = () => {
    switch (feature) {
      case "mini-games":
        return "Mini Games";
      case "sweeps-coins":
        return "Sweeps Coins Gameplay";
      case "poker":
        return "Poker Tournaments";
      case "sportsbook":
      case "Sportsbook Betting":
        return "Sportsbook Betting";
      case "Gold Coin Store":
        return "Gold Coin Store";
      case "User Dashboard":
        return "User Dashboard";
      case "Account Settings":
        return "Account Settings";
      case "Admin Panel":
        return "Admin Panel";
      case "Staff Panel":
        return "Staff Panel";
      default:
        return feature || "Premium Features";
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl p-0 overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
          <DialogTitle className="sr-only">Access Denied - {getFeatureTitle()}</DialogTitle>
          {/* Header with Branding */}
          <div className="relative bg-gradient-to-r from-gold via-yellow-400 to-gold p-6 text-center">
            <div
              className={
                'absolute inset-0 bg-[url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')] opacity-50'
              }
            />

            <div className="relative z-10">
              <h1 className="text-3xl font-bold text-gold-foreground mb-2">
                <span className="text-4xl">🔒</span> Access Denied
              </h1>
              <p className="text-xl text-gold-foreground/90">
                You must be logged in to Play for SC!
              </p>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Animated Mascot Section */}
            <div className="text-center relative">
              {/* Mascot Character */}
              <div className="relative inline-block">
                <div className="w-32 h-32 mx-auto mb-4 relative">
                  {/* Main character body */}
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-gold rounded-full border-4 border-gold-foreground flex items-center justify-center text-6xl animate-bounce">
                    🪙
                  </div>

                  {/* Johnny Bravo style hair */}
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-16 h-12 bg-gradient-to-r from-yellow-600 to-yellow-800 rounded-t-full" />

                  {/* Sunglasses with spinning coins */}
                  <div className="absolute top-6 left-1/2 transform -translate-x-1/2 flex items-center space-x-2">
                    <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 animate-spin">
                        <Coins className="h-4 w-4 text-gold" />
                      </div>
                    </div>
                    <div className="w-2 h-1 bg-black" />
                    <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 animate-spin">
                        <Coins className="h-4 w-4 text-gold" />
                      </div>
                    </div>
                  </div>

                  {/* Pointing arm */}
                  <div className="absolute -right-8 top-12 w-12 h-3 bg-gradient-to-r from-yellow-400 to-gold rounded-full transform rotate-12 animate-pulse" />
                  <div className="absolute -right-12 top-10 text-2xl animate-pulse">
                    👉
                  </div>
                </div>

                {/* Floating coins animation */}
                <div className="absolute -top-4 -left-4 animate-bounce delay-100">
                  <Coins className="h-6 w-6 text-gold" />
                </div>
                <div className="absolute -top-2 -right-6 animate-bounce delay-300">
                  <Star className="h-5 w-5 text-sweep" />
                </div>
                <div className="absolute -bottom-2 -left-6 animate-bounce delay-500">
                  <Sparkles className="h-4 w-4 text-gold" />
                </div>
              </div>

              <h2 className="text-2xl font-bold mb-4">
                Welcome to <span className="text-gold">CoinKrazy</span>.com!
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                The World's First AI-Powered Social Casino & Sportsbook & Poker
                Tournaments & Bingo!
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gold/10 border border-gold/20 rounded-lg p-4 text-center">
                <Gift className="h-8 w-8 mx-auto mb-2 text-gold" />
                <h3 className="font-semibold text-gold">Welcome Bonus</h3>
                <p className="text-sm text-muted-foreground">
                  10,000 GC + 10 SC FREE!
                </p>
              </div>

              <div className="bg-sweep/10 border border-sweep/20 rounded-lg p-4 text-center">
                <Gamepad2 className="h-8 w-8 mx-auto mb-2 text-sweep" />
                <h3 className="font-semibold text-sweep">Daily Mini Games</h3>
                <p className="text-sm text-muted-foreground">
                  Free SC Every Day!
                </p>
              </div>

              <div className="bg-casino-red/10 border border-casino-red/20 rounded-lg p-4 text-center">
                <Crown className="h-8 w-8 mx-auto mb-2 text-casino-red" />
                <h3 className="font-semibold text-casino-red">
                  Poker Tournaments
                </h3>
                <p className="text-sm text-muted-foreground">
                  Live Player Competition
                </p>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-center">
                <Target className="h-8 w-8 mx-auto mb-2 text-blue-400" />
                <h3 className="font-semibold text-blue-400">Live Sportsbook</h3>
                <p className="text-sm text-muted-foreground">Real-Time Odds</p>
              </div>
            </div>

            {/* Social Features */}
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6 text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-purple-400" />
              <h3 className="text-xl font-semibold mb-2">
                Join Our Social Casino Community
              </h3>
              <p className="text-muted-foreground mb-4">
                Connect with thousands of players, compete in tournaments, and
                earn free Sweeps Coins daily!
              </p>
              <div className="flex justify-center space-x-4 text-sm">
                <Badge
                  variant="outline"
                  className="bg-gold/20 text-gold border-gold/30"
                >
                  <Trophy className="h-3 w-3 mr-1" />
                  Leaderboards
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-sweep/20 text-sweep border-sweep/30"
                >
                  <Zap className="h-3 w-3 mr-1" />
                  AI-Powered
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-casino-green/20 text-casino-green border-casino-green/30"
                >
                  <Star className="h-3 w-3 mr-1" />
                  Real Prizes
                </Badge>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center space-y-4">
              <div className="relative">
                <Button
                  size="lg"
                  onClick={handleSignUpClick}
                  className="bg-gradient-to-r from-gold via-yellow-400 to-gold text-gold-foreground hover:from-yellow-400 hover:via-gold hover:to-yellow-400 text-xl px-12 py-6 casino-glow transform hover:scale-105 transition-all duration-300 shadow-2xl"
                >
                  <span className="text-2xl mr-3">🪙</span>
                  Signup Now to Claim Your Welcome Bonus!
                  <Sparkles className="h-5 w-5 ml-3" />
                </Button>

                {/* Floating animation around button */}
                <div className="absolute -top-2 -left-2 animate-bounce delay-100">
                  <Star className="h-4 w-4 text-gold" />
                </div>
                <div className="absolute -top-2 -right-2 animate-bounce delay-300">
                  <Coins className="h-4 w-4 text-sweep" />
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 animate-bounce delay-500">
                  <Gift className="h-4 w-4 text-casino-green" />
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <button
                  onClick={handleSignUpClick}
                  className="text-gold hover:underline font-medium"
                >
                  Login Here
                </button>
              </p>
            </div>

            {/* Bottom Features */}
            <div className="border-t border-border pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-sm">
                <div>
                  <Coins className="h-6 w-6 mx-auto mb-2 text-gold" />
                  <p className="font-medium">Free Gold Coins</p>
                  <p className="text-muted-foreground">Play for Fun</p>
                </div>
                <div>
                  <Star className="h-6 w-6 mx-auto mb-2 text-sweep" />
                  <p className="font-medium">Sweeps Coins</p>
                  <p className="text-muted-foreground">Win Real Prizes</p>
                </div>
                <div>
                  <Trophy className="h-6 w-6 mx-auto mb-2 text-casino-green" />
                  <p className="font-medium">Daily Rewards</p>
                  <p className="text-muted-foreground">1 SC Per Day</p>
                </div>
              </div>
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
