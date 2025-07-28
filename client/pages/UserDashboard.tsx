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
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { useAuth } from "../components/AuthContext";
import { AccessDeniedModal } from "../components/AccessDeniedModal";
import {
  UserProfile,
  TransactionHistory,
  GameHistoryEntry,
  RedemptionRequest,
  UserStats,
  UserBalance,
} from "@shared/userTypes";
import {
  User,
  CreditCard,
  TrendingUp,
  Download,
  Settings,
  Shield,
  Gift,
  Clock,
  DollarSign,
  Trophy,
  Star,
  Bell,
  Eye,
  EyeOff,
  Upload,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Coins,
  Crown,
  Target,
  Calendar,
  MapPin,
  Phone,
  Mail,
  FileText,
  Smartphone,
  Bot,
  MessageSquare,
  Video,
  Wand2,
  Sparkles,
  Send,
} from "lucide-react";

export function UserDashboard() {
  const { user } = useAuth();
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userBalance, setUserBalance] = useState<UserBalance | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [transactions, setTransactions] = useState<TransactionHistory[]>([]);
  const [gameHistory, setGameHistory] = useState<GameHistoryEntry[]>([]);
  const [redemptionRequests, setRedemptionRequests] = useState<
    RedemptionRequest[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showRedemptionForm, setShowRedemptionForm] = useState(false);
  const [redemptionData, setRedemptionData] = useState({
    amount: "",
    method: "",
    accountDetails: {},
  });
  const [showKYCUpload, setShowKYCUpload] = useState(false);
  const [luckyAIMessages, setLuckyAIMessages] = useState<
    Array<{ role: "user" | "ai"; message: string; timestamp: Date }>
  >([
    {
      role: "ai",
      message:
        "Hello! I'm LuckyAI, your personal casino assistant. I'm here to help you with KYC verification, game strategies, bonus information, and responsible gaming tips. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [joseyAIMessages, setJoseyAIMessages] = useState<
    Array<{ role: "user" | "ai"; message: string; timestamp: Date }>
  >([
    {
      role: "ai",
      message:
        "Hey there! I'm JoseyAI, your social media content creator! 🎬 I can help you create amazing 30-second video ads to share your wins and promote CoinKrazy. Ready to go viral? Let's create something awesome together!",
      timestamp: new Date(),
    },
  ]);
  const [aiInput, setAiInput] = useState("");
  const [joseyInput, setJoseyInput] = useState("");
  const [showLuckyAIChat, setShowLuckyAIChat] = useState(false);
  const [showJoseyAIChat, setShowJoseyAIChat] = useState(false);
  const [isCreatingVideo, setIsCreatingVideo] = useState(false);
  const [kycStep, setKycStep] = useState(0);

  useEffect(() => {
    if (!user) {
      setShowAccessDenied(true);
      return;
    }

    fetchUserData();
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      const [
        profileRes,
        balanceRes,
        statsRes,
        transactionsRes,
        gameHistoryRes,
        redemptionsRes,
      ] = await Promise.all([
        fetch(`/api/users/${user.id}/profile`),
        fetch(`/api/users/${user.id}/balance`),
        fetch(`/api/users/${user.id}/stats`),
        fetch(`/api/users/${user.id}/transactions`),
        fetch(`/api/users/${user.id}/game-history`),
        fetch(`/api/users/${user.id}/redemptions`),
      ]);

      if (profileRes.ok) setUserProfile(await profileRes.json());
      if (balanceRes.ok) setUserBalance(await balanceRes.json());
      if (statsRes.ok) setUserStats(await statsRes.json());
      if (transactionsRes.ok) setTransactions(await transactionsRes.json());
      if (gameHistoryRes.ok) setGameHistory(await gameHistoryRes.json());
      if (redemptionsRes.ok) setRedemptionRequests(await redemptionsRes.json());
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedemptionSubmit = async () => {
    if (!user || !redemptionData.amount || !redemptionData.method) {
      alert("Please fill in all required fields");
      return;
    }

    const amount = parseFloat(redemptionData.amount);
    if (amount < 100) {
      alert("Minimum redemption amount is 100 SC");
      return;
    }

    if (!userProfile?.kycStatus || userProfile.kycStatus !== "approved") {
      alert(
        "KYC verification required for redemptions. Please complete identity verification first.",
      );
      setShowKYCUpload(true);
      return;
    }

    try {
      const response = await fetch("/api/users/redemptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          username: user.username,
          amount,
          method: redemptionData.method,
          accountDetails: redemptionData.accountDetails,
        }),
      });

      if (response.ok) {
        alert(
          "Redemption request submitted successfully! It will be reviewed by our staff.",
        );
        setShowRedemptionForm(false);
        setRedemptionData({ amount: "", method: "", accountDetails: {} });
        fetchUserData();
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error("Redemption error:", error);
      alert("Failed to submit redemption request. Please try again.");
    }
  };

  const getKYCStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-600";
      case "pending":
        return "bg-yellow-600";
      case "rejected":
        return "bg-red-600";
      default:
        return "bg-gray-600";
    }
  };

  const getKYCStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getVIPIcon = (level: string) => {
    switch (level) {
      case "diamond":
        return <Crown className="w-5 h-5 text-blue-400" />;
      case "platinum":
        return <Crown className="w-5 h-5 text-gray-300" />;
      case "gold":
        return <Crown className="w-5 h-5 text-yellow-400" />;
      case "silver":
        return <Shield className="w-5 h-5 text-gray-400" />;
      case "bronze":
        return <Shield className="w-5 h-5 text-orange-400" />;
      default:
        return <Star className="w-5 h-5 text-gray-500" />;
    }
  };

  const sendLuckyAIMessage = () => {
    if (!aiInput.trim()) return;

    const userMessage = {
      role: "user" as const,
      message: aiInput,
      timestamp: new Date(),
    };
    setLuckyAIMessages((prev) => [...prev, userMessage]);

    // Simulate AI response based on KYC context
    setTimeout(() => {
      let aiResponse = "";
      if (
        aiInput.toLowerCase().includes("kyc") ||
        aiInput.toLowerCase().includes("verification")
      ) {
        const kycSteps = [
          "Let's start your KYC verification! First, I'll need a government-issued photo ID (driver's license, passport, or state ID). Make sure the document is clear and all corners are visible.",
          "Great! Next, we'll need a proof of address document from the last 90 days. This can be a utility bill, bank statement, or official mail with your name and address.",
          "Perfect! Now I'll guide you through the selfie verification. Hold your ID next to your face and take a clear photo. Make sure your face and the ID are both clearly visible.",
          "Excellent! Your documents are being reviewed. Our staff will verify them within 24-48 hours. You'll receive an email notification once approved!",
        ];
        aiResponse =
          kycSteps[kycStep] ||
          "Your KYC verification is complete! You can now make withdrawals and access all premium features.";
        setKycStep((prev) => Math.min(prev + 1, kycSteps.length));
      } else if (
        aiInput.toLowerCase().includes("game") ||
        aiInput.toLowerCase().includes("strategy")
      ) {
        const gameResponses = [
          "For slots, I recommend starting with games that have higher RTP (Return to Player) percentages. Look for games above 96% RTP for better long-term odds.",
          "In table games, blackjack offers some of the best odds if you follow basic strategy. Would you like me to explain the fundamentals?",
          "For sportsbook betting, consider the value in underdogs and always compare odds across different markets. Bankroll management is key!",
          "Remember to set limits and take breaks. Gambling should always be fun and within your means. Use our responsible gaming tools!",
        ];
        aiResponse =
          gameResponses[Math.floor(Math.random() * gameResponses.length)];
      } else {
        const generalResponses = [
          "I'm here to help with any questions about CoinKrazy! Feel free to ask about games, bonuses, verification, or responsible gaming.",
          "Your account looks great! Is there anything specific you'd like help with today?",
          "Don't forget to check your daily bonuses and loyalty rewards. Every day brings new opportunities!",
          "Remember, I'm here 24/7 to assist you with anything you need. What would you like to explore?",
        ];
        aiResponse =
          generalResponses[Math.floor(Math.random() * generalResponses.length)];
      }

      const aiMessage = {
        role: "ai" as const,
        message: aiResponse,
        timestamp: new Date(),
      };

      setLuckyAIMessages((prev) => [...prev, aiMessage]);
    }, 1000);

    setAiInput("");
  };

  const sendJoseyAIMessage = () => {
    if (!joseyInput.trim()) return;

    const userMessage = {
      role: "user" as const,
      message: joseyInput,
      timestamp: new Date(),
    };
    setJoseyAIMessages((prev) => [...prev, userMessage]);

    // Simulate AI response for video creation
    setTimeout(() => {
      let aiResponse = "";
      if (
        joseyInput.toLowerCase().includes("video") ||
        joseyInput.toLowerCase().includes("ad")
      ) {
        const videoQuestions = [
          "Awesome! Let's create your video ad. What's your biggest win on CoinKrazy? I'll make it the highlight of your video! 💰",
          "Perfect! What's your favorite game on the platform? I'll showcase it with amazing visuals! 🎰",
          "Great choice! What message do you want to share with other players? Something like 'Join me on CoinKrazy for epic wins!' 🎉",
          "Fantastic! I'm now generating your 30-second video ad with AI magic. It'll feature your win, favorite game, and custom message with CoinKrazy branding! ✨",
        ];
        aiResponse =
          videoQuestions[
            Math.min(
              joseyAIMessages.filter((m) => m.role === "user").length - 1,
              videoQuestions.length - 1,
            )
          ];
      } else if (
        joseyInput.toLowerCase().includes("share") ||
        joseyInput.toLowerCase().includes("social")
      ) {
        aiResponse =
          "I can help you create content for TikTok, Instagram, YouTube Shorts, and more! What platform are you most excited about? 📱";
      } else {
        const socialResponses = [
          "Ready to go viral? I specialize in creating engaging casino content that follows all platform guidelines! 🔥",
          "Your wins deserve to be celebrated! Let's create content that showcases your success while promoting responsible gaming. 🌟",
          "I can create videos with trending music, cool effects, and your personal gaming highlights. What style interests you most? 🎵",
          "Social media success starts with authentic content. Tell me about your CoinKrazy journey and I'll help you share it! 📸",
        ];
        aiResponse =
          socialResponses[Math.floor(Math.random() * socialResponses.length)];
      }

      const aiMessage = {
        role: "ai" as const,
        message: aiResponse,
        timestamp: new Date(),
      };

      setJoseyAIMessages((prev) => [...prev, aiMessage]);
    }, 1000);

    setJoseyInput("");
  };

  const startVideoCreation = () => {
    setIsCreatingVideo(true);
    setJoseyAIMessages((prev) => [
      ...prev,
      {
        role: "ai",
        message:
          "🎬 Creating your personalized video ad... This may take a few minutes. I'm adding your gameplay highlights, win animations, and CoinKrazy branding!",
        timestamp: new Date(),
      },
    ]);

    // Simulate video creation process
    setTimeout(() => {
      setIsCreatingVideo(false);
      setJoseyAIMessages((prev) => [
        ...prev,
        {
          role: "ai",
          message:
            '🎉 Your video is ready! Check your downloads folder for "CoinKrazy_MyWin_VideoAd.mp4". Ready to share it on your favorite social platform?',
          timestamp: new Date(),
        },
      ]);
    }, 5000);
  };

  if (!user) {
    return (
      <AccessDeniedModal
        isOpen={showAccessDenied}
        onClose={() => setShowAccessDenied(false)}
        feature="User Dashboard"
      />
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              My Dashboard 👤
            </h1>
            <p className="text-purple-200">
              Manage your CoinKrazy account and view your activity
            </p>
          </div>
          <div className="flex items-center gap-4">
            {userProfile && (
              <Badge
                className={`px-3 py-1 ${getKYCStatusColor(userProfile.kycStatus)}`}
              >
                {getKYCStatusIcon(userProfile.kycStatus)}
                <span className="ml-2 capitalize">
                  {userProfile.kycStatus.replace("_", " ")}
                </span>
              </Badge>
            )}
            {userStats && (
              <div className="flex items-center gap-2 text-white">
                {getVIPIcon(userStats.vipProgress.currentLevel)}
                <span className="capitalize">
                  {userStats.vipProgress.currentLevel}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Balance Overview */}
        {userBalance && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4 text-center">
                <Coins className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-500">
                  {userBalance.goldCoins.toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">Gold Coins</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4 text-center">
                <Star className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-500">
                  {userBalance.sweepsCoins.toFixed(2)}
                </div>
                <div className="text-sm text-gray-400">Sweeps Coins</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-500">
                  ${userBalance.lifetimeDeposits.toFixed(2)}
                </div>
                <div className="text-sm text-gray-400">Total Deposits</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4 text-center">
                <Download className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-500">
                  ${userBalance.lifetimeWithdrawals.toFixed(2)}
                </div>
                <div className="text-sm text-gray-400">Total Withdrawals</div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="games">Game History</TabsTrigger>
            <TabsTrigger value="redemptions">Redemptions</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Information */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {userProfile ? (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-400">First Name</Label>
                          <div className="text-white">
                            {userProfile.firstName}
                          </div>
                        </div>
                        <div>
                          <Label className="text-gray-400">Last Name</Label>
                          <div className="text-white">
                            {userProfile.lastName}
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-400">Email</Label>
                        <div className="text-white">{userProfile.email}</div>
                      </div>
                      <div>
                        <Label className="text-gray-400">Username</Label>
                        <div className="text-white">
                          @{userProfile.username}
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-400">Phone Number</Label>
                        <div className="text-white">
                          {userProfile.phoneNumber || "Not provided"}
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-400">Date of Birth</Label>
                        <div className="text-white">
                          {new Date(
                            userProfile.dateOfBirth,
                          ).toLocaleDateString()}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-gray-400">Loading profile...</div>
                  )}
                </CardContent>
              </Card>

              {/* Account Status */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Account Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {userProfile && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">KYC Status</span>
                        <Badge
                          className={getKYCStatusColor(userProfile.kycStatus)}
                        >
                          {getKYCStatusIcon(userProfile.kycStatus)}
                          <span className="ml-2 capitalize">
                            {userProfile.kycStatus.replace("_", " ")}
                          </span>
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">
                          Verification Level
                        </span>
                        <Badge className="bg-blue-600 capitalize">
                          {userProfile.accountVerificationLevel}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">VIP Level</span>
                        <div className="flex items-center gap-2">
                          {getVIPIcon(userProfile.vipLevel)}
                          <span className="text-white capitalize">
                            {userProfile.vipLevel}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Member Since</span>
                        <span className="text-white">
                          {new Date(userProfile.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {userProfile.kycStatus !== "approved" && (
                        <Button
                          onClick={() => setShowKYCUpload(true)}
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Complete KYC Verification
                        </Button>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Gaming Stats */}
            {userStats && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Gaming Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-500">
                        {userStats.gamesPlayed}
                      </div>
                      <div className="text-sm text-gray-400">Games Played</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-500">
                        {userStats.biggestWin.amount.toLocaleString()}{" "}
                        {userStats.biggestWin.currency}
                      </div>
                      <div className="text-sm text-gray-400">Biggest Win</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-500">
                        {userStats.winRate.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-400">Win Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-500">
                        {userStats.currentStreak}
                      </div>
                      <div className="text-sm text-gray-400">
                        Current Streak
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* AI Assistants */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* LuckyAI Casino Assistant */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Bot className="w-5 h-5 text-blue-400" />
                    LuckyAI Casino Assistant
                    <Badge className="bg-blue-600">Online</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {showLuckyAIChat ? (
                    <div className="space-y-4">
                      <div className="h-64 overflow-y-auto space-y-2 p-3 bg-gray-700 rounded">
                        {luckyAIMessages.map((msg, index) => (
                          <div
                            key={index}
                            className={`p-2 rounded text-sm ${
                              msg.role === "ai"
                                ? "bg-blue-600 text-white ml-4"
                                : "bg-gray-600 text-white mr-4"
                            }`}
                          >
                            {msg.message}
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={aiInput}
                          onChange={(e) => setAiInput(e.target.value)}
                          placeholder="Ask about KYC, games, or strategies..."
                          onKeyPress={(e) =>
                            e.key === "Enter" && sendLuckyAIMessage()
                          }
                        />
                        <Button size="sm" onClick={sendLuckyAIMessage}>
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowLuckyAIChat(false)}
                      >
                        Minimize
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-gray-300 text-sm">
                        Your personal casino assistant is here to help with KYC
                        verification, game strategies, bonus information, and
                        responsible gaming guidance.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          KYC Step-by-step guidance
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          Game strategy advice
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          Responsible gaming tips
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          24/7 availability
                        </div>
                      </div>
                      <Button
                        onClick={() => setShowLuckyAIChat(true)}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Start Chat with LuckyAI
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* JoseyAI Social Assistant */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Bot className="w-5 h-5 text-pink-400" />
                    JoseyAI Social Creator
                    <Badge className="bg-pink-600">Creative</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {showJoseyAIChat ? (
                    <div className="space-y-4">
                      <div className="h-64 overflow-y-auto space-y-2 p-3 bg-gray-700 rounded">
                        {joseyAIMessages.map((msg, index) => (
                          <div
                            key={index}
                            className={`p-2 rounded text-sm ${
                              msg.role === "ai"
                                ? "bg-pink-600 text-white ml-4"
                                : "bg-gray-600 text-white mr-4"
                            }`}
                          >
                            {msg.message}
                          </div>
                        ))}
                        {isCreatingVideo && (
                          <div className="flex items-center gap-2 p-2 bg-purple-600 rounded text-white text-sm">
                            <Sparkles className="w-4 h-4 animate-spin" />
                            Creating video...
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={joseyInput}
                          onChange={(e) => setJoseyInput(e.target.value)}
                          placeholder="Tell me about your wins for the video..."
                          onKeyPress={(e) =>
                            e.key === "Enter" && sendJoseyAIMessage()
                          }
                        />
                        <Button size="sm" onClick={sendJoseyAIMessage}>
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={startVideoCreation}
                          disabled={isCreatingVideo}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          <Video className="w-4 h-4 mr-2" />
                          Create Video Ad
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowJoseyAIChat(false)}
                        >
                          Minimize
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-gray-300 text-sm">
                        Create amazing 30-second video ads showcasing your wins
                        and promoting CoinKrazy with our AI-powered video
                        generator!
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Video className="w-4 h-4 text-pink-400" />
                          AI-generated video ads
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Sparkles className="w-4 h-4 text-pink-400" />
                          Trending music & effects
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Wand2 className="w-4 h-4 text-pink-400" />
                          Custom win highlights
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Target className="w-4 h-4 text-pink-400" />
                          Social media ready
                        </div>
                      </div>
                      <Button
                        onClick={() => setShowJoseyAIChat(true)}
                        className="w-full bg-pink-600 hover:bg-pink-700"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Start Creating with JoseyAI
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Transaction History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {transactions.length > 0 ? (
                  <div className="space-y-4">
                    {transactions.slice(0, 10).map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex justify-between items-center p-4 bg-gray-700 rounded-lg"
                      >
                        <div>
                          <div className="text-white font-medium">
                            {transaction.description}
                          </div>
                          <div className="text-sm text-gray-400">
                            {new Date(
                              transaction.createdAt,
                            ).toLocaleDateString()}{" "}
                            • {transaction.type}
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className={`font-bold ${
                              transaction.type === "win" ||
                              transaction.type === "bonus"
                                ? "text-green-500"
                                : transaction.type === "bet" ||
                                    transaction.type === "purchase"
                                  ? "text-red-500"
                                  : "text-white"
                            }`}
                          >
                            {transaction.type === "win" ||
                            transaction.type === "bonus"
                              ? "+"
                              : ""}
                            {transaction.amount} {transaction.currency}
                          </div>
                          <Badge
                            className={`text-xs ${
                              transaction.status === "completed"
                                ? "bg-green-600"
                                : transaction.status === "pending"
                                  ? "bg-yellow-600"
                                  : "bg-red-600"
                            }`}
                          >
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    {transactions.length > 10 && (
                      <div className="text-center">
                        <Button variant="outline" className="text-white">
                          Load More Transactions
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CreditCard className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">No transactions yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="games" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Game History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {gameHistory.length > 0 ? (
                  <div className="space-y-4">
                    {gameHistory.slice(0, 10).map((game) => (
                      <div
                        key={game.id}
                        className="flex justify-between items-center p-4 bg-gray-700 rounded-lg"
                      >
                        <div>
                          <div className="text-white font-medium">
                            {game.gameName}
                          </div>
                          <div className="text-sm text-gray-400">
                            {new Date(game.playedAt).toLocaleDateString()} •{" "}
                            {game.gameType}
                            {game.provider && ` • ${game.provider}`}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-gray-400 text-sm">
                            Bet: {game.betAmount} {game.currency}
                          </div>
                          <div
                            className={`font-bold ${
                              game.result === "win"
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {game.result === "win" ? "+" : ""}
                            {game.winAmount} {game.currency}
                          </div>
                          {game.multiplier && (
                            <div className="text-xs text-yellow-500">
                              {game.multiplier.toFixed(2)}x
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {gameHistory.length > 10 && (
                      <div className="text-center">
                        <Button variant="outline" className="text-white">
                          Load More Games
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Target className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">No games played yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="redemptions" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">
                Prize Redemptions
              </h2>
              <Button
                onClick={() => setShowRedemptionForm(true)}
                className="bg-green-600 hover:bg-green-700"
                disabled={!userBalance || userBalance.sweepsCoins < 100}
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Request Redemption
              </Button>
            </div>

            {/* Redemption Requirements */}
            <Card className="bg-yellow-900 border-yellow-700">
              <CardContent className="p-4">
                <h3 className="text-yellow-300 font-medium mb-2">
                  Redemption Requirements:
                </h3>
                <ul className="text-yellow-100 text-sm space-y-1">
                  <li>• Minimum redemption: 100 Sweeps Coins ($100 USD)</li>
                  <li>• KYC verification must be completed and approved</li>
                  <li>• Processing time: 3-5 business days after approval</li>
                  <li>• 1 SC = $1 USD redemption rate</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Redemption History</CardTitle>
              </CardHeader>
              <CardContent>
                {redemptionRequests.length > 0 ? (
                  <div className="space-y-4">
                    {redemptionRequests.map((request) => (
                      <div
                        key={request.id}
                        className="p-4 bg-gray-700 rounded-lg"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="text-white font-medium">
                              ${request.cashValue} ({request.amount} SC)
                            </div>
                            <div className="text-sm text-gray-400 capitalize">
                              {request.method} •{" "}
                              {new Date(
                                request.requestedAt,
                              ).toLocaleDateString()}
                            </div>
                          </div>
                          <Badge
                            className={`${
                              request.status === "paid"
                                ? "bg-green-600"
                                : request.status === "approved"
                                  ? "bg-blue-600"
                                  : request.status === "denied"
                                    ? "bg-red-600"
                                    : "bg-yellow-600"
                            }`}
                          >
                            {request.status.replace("_", " ")}
                          </Badge>
                        </div>
                        {request.denialReason && (
                          <div className="text-sm text-red-400 mt-2">
                            Denial reason: {request.denialReason}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <DollarSign className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">No redemption requests yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-white font-medium mb-3">
                      Notifications
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">
                          Email Notifications
                        </span>
                        <Button variant="outline" size="sm">
                          Toggle
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">SMS Notifications</span>
                        <Button variant="outline" size="sm">
                          Toggle
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Marketing Emails</span>
                        <Button variant="outline" size="sm">
                          Toggle
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-white font-medium mb-3">
                      Gaming Preferences
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Sound Effects</span>
                        <Button variant="outline" size="sm">
                          Toggle
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Animations</span>
                        <Button variant="outline" size="sm">
                          Toggle
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Auto-play Slots</span>
                        <Button variant="outline" size="sm">
                          Toggle
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Redemption Form Modal */}
        {showRedemptionForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="bg-gray-800 border-gray-700 w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle className="text-white flex justify-between items-center">
                  Request Prize Redemption
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowRedemptionForm(false)}
                  >
                    ✕
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-white">Redemption Amount (SC)</Label>
                  <Input
                    type="number"
                    placeholder="Minimum 100 SC"
                    value={redemptionData.amount}
                    onChange={(e) =>
                      setRedemptionData((prev) => ({
                        ...prev,
                        amount: e.target.value,
                      }))
                    }
                    min="100"
                    max={userBalance?.sweepsCoins || 0}
                  />
                  <div className="text-sm text-gray-400 mt-1">
                    Available: {userBalance?.sweepsCoins.toFixed(2)} SC
                  </div>
                </div>

                <div>
                  <Label className="text-white">Redemption Method</Label>
                  <Select
                    value={redemptionData.method}
                    onValueChange={(value) =>
                      setRedemptionData((prev) => ({ ...prev, method: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cashapp">Cash App</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="bank_transfer">
                        Bank Transfer
                      </SelectItem>
                      <SelectItem value="check">Check</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {redemptionData.method === "cashapp" && (
                  <div className="space-y-3">
                    <div>
                      <Label className="text-white">Cash App Tag</Label>
                      <Input placeholder="$YourCashTag" />
                    </div>
                    <div>
                      <Label className="text-white">Phone Number</Label>
                      <Input placeholder="(555) 123-4567" />
                    </div>
                  </div>
                )}

                {redemptionData.method === "paypal" && (
                  <div className="space-y-3">
                    <div>
                      <Label className="text-white">PayPal Email</Label>
                      <Input placeholder="your@email.com" />
                    </div>
                    <div>
                      <Label className="text-white">Full Name</Label>
                      <Input placeholder="Full Name on PayPal Account" />
                    </div>
                  </div>
                )}

                <div className="text-sm text-yellow-300 bg-yellow-900 p-3 rounded">
                  <AlertTriangle className="w-4 h-4 inline mr-2" />
                  Your request will be reviewed by staff and admin before
                  processing. KYC verification is required for all redemptions.
                </div>

                <Button
                  onClick={handleRedemptionSubmit}
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={!redemptionData.amount || !redemptionData.method}
                >
                  Submit Redemption Request
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        <AccessDeniedModal
          isOpen={showAccessDenied}
          onClose={() => setShowAccessDenied(false)}
          feature="User Dashboard"
        />
      </div>
    </div>
  );
}
