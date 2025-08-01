import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { useAuth } from "../components/AuthContext";
import { AccessDeniedModal } from "../components/AccessDeniedModal";
import { EnhancedCheckoutSystem } from "../components/EnhancedCheckoutSystem";
import {
  GoldCoinPackage,
  PurchaseTransaction,
  UserPurchaseHistory,
} from "@shared/storeTypes";
import {
  ShoppingCart,
  Star,
  Gift,
  CreditCard,
  Smartphone,
  Crown,
  Shield,
  Zap,
  TrendingUp,
  DollarSign,
  Clock,
  Sparkles,
  CheckCircle,
} from "lucide-react";

export function Store() {
  const { user } = useAuth();
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const [packages, setPackages] = useState<GoldCoinPackage[]>([]);
  const [purchaseHistory, setPurchaseHistory] =
    useState<UserPurchaseHistory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] =
    useState<GoldCoinPackage | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    fetchPackages();
    if (user) {
      fetchPurchaseHistory();
    }
  }, [user]);

  const fetchPackages = async () => {
    try {
      const response = await fetch("/api/enhanced-store/packages?active=true");
      const data = await response.json();
      setPackages(data);
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPurchaseHistory = async () => {
    if (!user) return;

    try {
      const response = await fetch(`/api/store/users/${user.id}/purchases`);
      const data = await response.json();
      setPurchaseHistory(data);
    } catch (error) {
      console.error("Error fetching purchase history:", error);
    }
  };

  const handlePurchase = (packageItem: GoldCoinPackage) => {
    if (!user) {
      setShowAccessDenied(true);
      return;
    }

    setSelectedPackage(packageItem);
    setShowCheckout(true);
  };

  const handlePurchaseComplete = async (transaction: any) => {
    try {
      // Send transaction to backend
      const response = await fetch("/api/store/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user!.id,
          username: user!.username,
          transactionData: transaction,
        }),
      });

      if (response.ok) {
        // Update user balance and purchase history
        fetchPurchaseHistory();

        // Show success message
        setTimeout(() => {
          alert(
            `Purchase successful! You received ${transaction.goldCoinsAwarded.toLocaleString()} Gold Coins and ${transaction.sweepsCoinsBonus} Sweeps Coins! Transaction ID: ${transaction.id}`,
          );
        }, 1000);
      }
    } catch (error) {
      console.error("Error saving transaction:", error);
    } finally {
      setShowCheckout(false);
      setSelectedPackage(null);
    }
  };

  const getVIPStatusIcon = (status: string) => {
    switch (status) {
      case "platinum":
        return <Crown className="w-4 h-4 text-purple-400" />;
      case "gold":
        return <Crown className="w-4 h-4 text-yellow-400" />;
      case "silver":
        return <Shield className="w-4 h-4 text-gray-400" />;
      case "bronze":
        return <Shield className="w-4 h-4 text-orange-400" />;
      default:
        return null;
    }
  };

  const getPackageIcon = (packageName: string) => {
    if (packageName.toLowerCase().includes("starter")) return "🌟";
    if (packageName.toLowerCase().includes("value")) return "💎";
    if (packageName.toLowerCase().includes("premium")) return "👑";
    if (packageName.toLowerCase().includes("mega")) return "🚀";
    if (packageName.toLowerCase().includes("ultimate")) return "💯";
    if (packageName.toLowerCase().includes("daily")) return "☀️";
    if (packageName.toLowerCase().includes("weekend")) return "🎉";
    if (packageName.toLowerCase().includes("high roller")) return "🎰";
    return "🪙";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading store...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            CoinKrazy Gold Coin Store 🪙
          </h1>
          <p className="text-purple-200">
            Purchase Gold Coins for endless fun gaming! Bonus Sweeps Coins
            included!
          </p>
          <div className="mt-4 text-sm text-yellow-300">
            💰 PayPal payments go to: <strong>corey@coinkrazy.com</strong>
          </div>
        </div>

        <Tabs defaultValue="packages" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
            <TabsTrigger value="packages">Gold Coin Packages</TabsTrigger>
            <TabsTrigger value="history">Purchase History</TabsTrigger>
          </TabsList>

          <TabsContent value="packages">
            {/* User Balance */}
            {user && (
              <div className="max-w-4xl mx-auto mb-8">
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <h3 className="text-white font-medium mb-4">
                          Your Balance
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-2xl font-bold text-yellow-500">
                              {user.goldCoins.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-400">
                              Gold Coins
                            </div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-green-500">
                              {user.sweepsCoins.toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-400">
                              Sweeps Coins
                            </div>
                          </div>
                        </div>
                      </div>

                      {purchaseHistory && (
                        <>
                          <div className="text-center">
                            <h3 className="text-white font-medium mb-4 flex items-center justify-center gap-2">
                              VIP Status{" "}
                              {getVIPStatusIcon(purchaseHistory.vipStatus)}
                            </h3>
                            <div className="text-lg font-bold text-purple-400 capitalize">
                              {purchaseHistory.vipStatus}
                            </div>
                            <div className="text-sm text-gray-400">
                              Total Spent: $
                              {purchaseHistory.totalSpent.toFixed(2)}
                            </div>
                          </div>

                          <div className="text-center">
                            <h3 className="text-white font-medium mb-4">
                              Lifetime Stats
                            </h3>
                            <div className="text-sm text-gray-400 space-y-1">
                              <div>
                                Purchases: {purchaseHistory.transactions.length}
                              </div>
                              <div>
                                Gold Coins:{" "}
                                {purchaseHistory.totalGoldCoins.toLocaleString()}
                              </div>
                              <div>
                                Sweeps Coins:{" "}
                                {purchaseHistory.totalSweepsCoins.toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Gold Coin Packages - 8 Packages in 2 rows */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {packages.map((pkg) => (
                <Card
                  key={pkg.id}
                  className={`bg-gray-800 border-gray-700 hover:border-purple-500 transition-all duration-300 transform hover:scale-105 relative ${
                    pkg.popular ? "ring-2 ring-purple-500" : ""
                  } ${pkg.bestValue ? "ring-2 ring-green-500" : ""}`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-purple-600 text-white px-3 py-1">
                        <Star className="w-3 h-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  {pkg.bestValue && (
                    <div className="absolute -top-3 right-4">
                      <Badge className="bg-green-600 text-white px-3 py-1">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Best Value
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-4">
                    <div className="text-4xl mx-auto mb-3">
                      {getPackageIcon(pkg.name)}
                    </div>
                    <CardTitle className="text-white text-xl mb-2">
                      {pkg.name}
                    </CardTitle>
                    <p className="text-gray-400 text-sm">{pkg.description}</p>
                  </CardHeader>

                  <CardContent className="text-center">
                    <div className="mb-4">
                      <div className="text-3xl font-bold text-yellow-500 mb-1">
                        {pkg.goldCoins.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-400">Gold Coins</div>
                    </div>

                    <div className="mb-4">
                      <div className="text-lg font-semibold text-green-500 mb-1">
                        +{pkg.bonusSweepsCoins}
                      </div>
                      <div className="text-xs text-gray-400">
                        Bonus Sweeps Coins
                      </div>
                    </div>

                    <div className="mb-4">
                      <ul className="text-xs text-gray-300 space-y-1">
                        {pkg.features.slice(0, 3).map((feature, index) => (
                          <li
                            key={index}
                            className="flex items-center justify-center gap-1"
                          >
                            <Zap className="w-3 h-3 text-yellow-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-6">
                      {pkg.originalPrice && (
                        <div className="text-sm text-gray-500 line-through mb-1">
                          ${pkg.originalPrice}
                        </div>
                      )}
                      <div className="text-2xl font-bold text-white">
                        ${pkg.price}
                      </div>
                    </div>

                    <Button
                      onClick={() => handlePurchase(pkg)}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Purchase
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history">
            {user && purchaseHistory ? (
              <div className="max-w-4xl mx-auto">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Purchase History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {purchaseHistory.transactions.length > 0 ? (
                      <div className="space-y-4">
                        {purchaseHistory.transactions.map((transaction) => (
                          <div
                            key={transaction.id}
                            className="p-4 bg-gray-700 rounded-lg"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="text-white font-medium">
                                  {transaction.packageName}
                                </h4>
                                <p className="text-gray-400 text-sm">
                                  {transaction.goldCoinsAwarded.toLocaleString()}{" "}
                                  Gold Coins + {transaction.sweepsCoinsBonus}{" "}
                                  Sweeps Coins
                                </p>
                                <p className="text-gray-500 text-xs">
                                  <Clock className="w-3 h-3 inline mr-1" />
                                  {new Date(
                                    transaction.createdAt,
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="text-white font-medium">
                                  ${transaction.amountPaid}
                                </div>
                                <Badge
                                  className={`text-xs ${
                                    transaction.status === "completed"
                                      ? "bg-green-600"
                                      : transaction.status === "pending"
                                        ? "bg-yellow-600"
                                        : transaction.status === "failed"
                                          ? "bg-red-600"
                                          : "bg-gray-600"
                                  }`}
                                >
                                  {transaction.status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <ShoppingCart className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-400">
                          No purchases yet. Start with a package above!
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">
                  Please log in to view purchase history.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Payment Methods */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Secure Payment Methods
          </h2>
          <div className="flex justify-center gap-6">
            <div className="bg-gray-800 p-4 rounded-lg">
              <CreditCard className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-white text-sm">PayPal</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <Smartphone className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-white text-sm">Apple Pay</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <Gift className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <p className="text-white text-sm">Gift Cards</p>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <Card className="max-w-2xl mx-auto bg-yellow-900 border-yellow-700">
          <CardContent className="p-6 text-center">
            <h3 className="text-yellow-300 font-bold mb-2">Important Notice</h3>
            <p className="text-yellow-100 text-sm">
              Gold Coins have no cash value and are for entertainment purposes
              only. Sweeps Coins can be redeemed for prizes subject to terms and
              conditions.
            </p>
          </CardContent>
        </Card>

        {/* Enhanced Checkout System */}
        {selectedPackage && (
          <EnhancedCheckoutSystem
            selectedPackage={selectedPackage}
            isOpen={showCheckout}
            onClose={() => {
              setShowCheckout(false);
              setSelectedPackage(null);
            }}
            onComplete={handlePurchaseComplete}
            userBalance={{
              goldCoins: user?.goldCoins || 0,
              sweepsCoins: user?.sweepsCoins || 0
            }}
          />
        )}

        <AccessDeniedModal
          isOpen={showAccessDenied}
          onClose={() => setShowAccessDenied(false)}
          feature="Gold Coin Store"
        />
      </div>
    </div>
  );
}
