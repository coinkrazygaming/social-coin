import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useAuth } from "./AuthContext";
import { AuthModal } from "./AuthModal";
import {
  Gift,
  Coins,
  Star,
  Sparkles,
  CheckCircle,
  Crown,
  Zap,
  Trophy,
  X,
} from "lucide-react";

interface WelcomeBonusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WelcomeBonusModal: React.FC<WelcomeBonusModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, updateBalance } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "register">(
    "register",
  );
  const [bonusClaimed, setBonusClaimed] = useState(false);
  const [claimingBonus, setClaimingBonus] = useState(false);

  const bonusPackage = {
    goldCoins: 10000,
    sweepsCoins: 10,
    bonusFeatures: [
      "10,000 Gold Coins (Play for FREE)",
      "10 Sweeps Coins (Win Real Prizes)",
      "Access to 500+ Premium Slot Games",
      "FREE Daily Login Bonuses",
      "Entry to VIP Rewards Program",
      "24/7 Customer Support",
    ],
  };

  const handleClaimBonus = async () => {
    if (!user) {
      // User needs to login/register first
      setAuthModalTab("register");
      setShowAuthModal(true);
      return;
    }

    // Check if user has already claimed welcome bonus
    if (user.hasClaimedWelcomeBonus) {
      alert("You have already claimed your welcome bonus!");
      return;
    }

    setClaimingBonus(true);

    try {
      // Simulate API call to claim bonus
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Update user balance
      await updateBalance({
        goldCoins: bonusPackage.goldCoins,
        sweepsCoins: bonusPackage.sweepsCoins,
      });

      setBonusClaimed(true);

      // Auto-close after 3 seconds
      setTimeout(() => {
        onClose();
        setBonusClaimed(false);
      }, 3000);
    } catch (error) {
      console.error("Error claiming bonus:", error);
      alert("Failed to claim bonus. Please try again.");
    } finally {
      setClaimingBonus(false);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    // After successful auth, automatically attempt to claim bonus
    setTimeout(() => {
      handleClaimBonus();
    }, 500);
  };

  const handleGuestLogin = () => {
    setAuthModalTab("login");
    setShowAuthModal(true);
  };

  const handleNewUserSignup = () => {
    setAuthModalTab("register");
    setShowAuthModal(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 border-gold/30">
          <DialogHeader className="text-center space-y-4">
            <DialogTitle className="text-3xl font-bold text-white flex items-center justify-center gap-3">
              <Gift className="w-8 h-8 text-gold animate-bounce" />
              <span className="bg-gradient-to-r from-gold to-yellow-400 bg-clip-text text-transparent">
                Welcome Bonus
              </span>
              <Gift className="w-8 h-8 text-gold animate-bounce" />
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Bonus Package Display */}
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="bg-gradient-to-r from-gold/20 to-yellow-400/20 rounded-xl p-6 border border-gold/30">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="bg-gold/20 rounded-lg p-4 mb-2">
                        <Coins className="w-8 h-8 text-gold mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gold">
                          {bonusPackage.goldCoins.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-300">Gold Coins</div>
                      </div>
                      <Badge className="bg-gold/20 text-gold border-gold/30">
                        Play for FREE
                      </Badge>
                    </div>
                    <div className="text-center">
                      <div className="bg-purple-500/20 rounded-lg p-4 mb-2">
                        <Star className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-purple-400">
                          {bonusPackage.sweepsCoins}
                        </div>
                        <div className="text-sm text-gray-300">
                          Sweeps Coins
                        </div>
                      </div>
                      <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                        Win Real Prizes
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Sparkle Effects */}
                <Sparkles className="absolute -top-2 -left-2 w-6 h-6 text-gold animate-pulse" />
                <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-pulse" />
                <Sparkles className="absolute -bottom-2 -left-2 w-6 h-6 text-purple-400 animate-pulse" />
                <Sparkles className="absolute -bottom-2 -right-2 w-6 h-6 text-gold animate-pulse" />
              </div>

              {/* Bonus Features */}
              <div className="bg-gray-800/50 rounded-xl p-4 space-y-3">
                <h3 className="text-lg font-semibold text-white flex items-center justify-center gap-2">
                  <Crown className="w-5 h-5 text-gold" />
                  Bonus Features Included
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  {bonusPackage.bonusFeatures.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-gray-300"
                    >
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Success State */}
            <AnimatePresence>
              {bonusClaimed && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-center space-y-4"
                >
                  <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-6">
                    <Trophy className="w-16 h-16 text-gold mx-auto mb-4 animate-bounce" />
                    <h3 className="text-2xl font-bold text-green-400 mb-2">
                      Bonus Claimed Successfully!
                    </h3>
                    <p className="text-gray-300">
                      Your bonus has been added to your account. Start playing
                      now!
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            {!bonusClaimed && (
              <div className="space-y-4">
                {!user ? (
                  <div className="space-y-3">
                    <div className="text-center text-gray-300 text-sm">
                      Create your account to claim this amazing bonus!
                    </div>
                    <Button
                      onClick={handleNewUserSignup}
                      className="w-full bg-gradient-to-r from-gold to-yellow-400 text-black hover:from-yellow-400 hover:to-gold text-lg py-3"
                      size="lg"
                    >
                      <Gift className="w-5 h-5 mr-2" />
                      Sign Up & Claim Bonus
                    </Button>
                    <Button
                      onClick={handleGuestLogin}
                      variant="outline"
                      className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                      Already have an account? Login
                    </Button>
                  </div>
                ) : user.hasClaimedWelcomeBonus ? (
                  <div className="text-center space-y-4">
                    <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4">
                      <CheckCircle className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                      <p className="text-blue-400 font-medium">
                        You have already claimed your welcome bonus!
                      </p>
                      <p className="text-gray-400 text-sm mt-2">
                        Existing users don't receive additional welcome bonuses
                      </p>
                    </div>
                    <Button
                      onClick={onClose}
                      variant="outline"
                      className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                      Continue Playing
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={handleClaimBonus}
                    disabled={claimingBonus}
                    className="w-full bg-gradient-to-r from-gold to-yellow-400 text-black hover:from-yellow-400 hover:to-gold text-lg py-3"
                    size="lg"
                  >
                    {claimingBonus ? (
                      <>
                        <Zap className="w-5 h-5 mr-2 animate-spin" />
                        Claiming Bonus...
                      </>
                    ) : (
                      <>
                        <Gift className="w-5 h-5 mr-2" />
                        Claim Welcome Bonus
                      </>
                    )}
                  </Button>
                )}
              </div>
            )}

            {/* Terms */}
            <div className="text-xs text-gray-400 text-center space-y-1">
              <p>⚠️ Welcome bonus is only available to new users</p>
              <p>
                Must be 18+ • Terms and conditions apply • Void where prohibited
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultTab={authModalTab}
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  );
};
