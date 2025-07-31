import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import { useAuth } from "./AuthContext";
import {
  Award,
  Star,
  Crown,
  Trophy,
  Target,
  Zap,
  Gift,
  Medal,
  Shield,
  Diamond,
  Flame,
  Heart,
  Sparkles,
  TrendingUp,
  Users,
  Calendar,
  Activity,
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Save,
  Settings,
  CheckCircle,
  Lock,
  Unlock,
  Eye,
  EyeOff,
} from "lucide-react";

interface Achievement {
  id: string;
  name: string;
  description: string;
  category: "gaming" | "social" | "financial" | "loyalty" | "special";
  type: "milestone" | "cumulative" | "streak" | "challenge";
  isActive: boolean;
  isSecret: boolean;
  difficulty: "easy" | "medium" | "hard" | "legendary";
  icon: string;
  color: string;
  requirements: {
    condition: string;
    value: number;
    period?: "daily" | "weekly" | "monthly" | "all-time";
  }[];
  rewards: {
    type: "badge" | "gc" | "sc" | "vip_points" | "title";
    value: number | string;
    description: string;
  }[];
  milestones: {
    tier: number;
    name: string;
    requirement: number;
    reward: {
      type: string;
      value: number | string;
    };
  }[];
  createdAt: Date;
  earnedBy: number;
  totalEarnings: number;
  progressData: {
    userId: string;
    username: string;
    progress: number;
    maxProgress: number;
    percentage: number;
    earnedAt?: Date;
  }[];
}

interface BadgeDesign {
  id: string;
  name: string;
  description: string;
  rarity: "common" | "rare" | "epic" | "legendary" | "mythic";
  design: {
    shape: "circle" | "shield" | "star" | "diamond" | "crown";
    primaryColor: string;
    secondaryColor: string;
    icon: string;
    border: string;
    glow: boolean;
  };
  unlockConditions: string[];
  isActive: boolean;
  earnedBy: number;
  firstEarnedBy?: string;
  firstEarnedAt?: Date;
}

interface UserBadgeCollection {
  userId: string;
  username: string;
  badges: {
    badgeId: string;
    badgeName: string;
    earnedAt: Date;
    rarity: string;
    showcased: boolean;
  }[];
  achievements: {
    achievementId: string;
    achievementName: string;
    tier: number;
    progress: number;
    completedAt?: Date;
  }[];
  totalBadges: number;
  totalAchievements: number;
  totalPoints: number;
  showcasedBadges: string[];
}

export function AchievementBadgeSystem() {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: "first_spin",
      name: "First Spin",
      description: "Play your first slot game",
      category: "gaming",
      type: "milestone",
      isActive: true,
      isSecret: false,
      difficulty: "easy",
      icon: "🎰",
      color: "#10B981",
      requirements: [
        { condition: "games_played", value: 1 }
      ],
      rewards: [
        { type: "badge", value: "first_spin_badge", description: "First Spin Badge" },
        { type: "gc", value: 500, description: "500 Gold Coins" }
      ],
      milestones: [
        { tier: 1, name: "First Timer", requirement: 1, reward: { type: "gc", value: 500 } },
        { tier: 2, name: "Getting Started", requirement: 10, reward: { type: "gc", value: 1000 } },
        { tier: 3, name: "Regular Player", requirement: 50, reward: { type: "sc", value: 1 } },
        { tier: 4, name: "Dedicated Gamer", requirement: 100, reward: { type: "sc", value: 2 } },
        { tier: 5, name: "Slot Master", requirement: 500, reward: { type: "sc", value: 5 } }
      ],
      createdAt: new Date(),
      earnedBy: 847,
      totalEarnings: 12456,
      progressData: [
        {
          userId: "user1",
          username: "SlotMaster97",
          progress: 500,
          maxProgress: 500,
          percentage: 100,
          earnedAt: new Date()
        },
        {
          userId: "user2",
          username: "NewPlayer99",
          progress: 15,
          maxProgress: 500,
          percentage: 3
        }
      ]
    },
    {
      id: "big_winner",
      name: "Big Winner",
      description: "Win 1000 or more coins in a single spin",
      category: "gaming",
      type: "milestone",
      isActive: true,
      isSecret: false,
      difficulty: "medium",
      icon: "🏆",
      color: "#F59E0B",
      requirements: [
        { condition: "single_win", value: 1000 }
      ],
      rewards: [
        { type: "badge", value: "big_winner_badge", description: "Big Winner Badge" },
        { type: "sc", value: 2, description: "2 Sweeps Coins" }
      ],
      milestones: [
        { tier: 1, name: "Lucky Strike", requirement: 1000, reward: { type: "sc", value: 2 } },
        { tier: 2, name: "Fortune Favors", requirement: 5000, reward: { type: "sc", value: 5 } },
        { tier: 3, name: "Jackpot Hunter", requirement: 10000, reward: { type: "sc", value: 10 } },
        { tier: 4, name: "Mega Winner", requirement: 25000, reward: { type: "vip_points", value: 100 } },
        { tier: 5, name: "Legendary Win", requirement: 50000, reward: { type: "title", value: "Legendary Winner" } }
      ],
      createdAt: new Date(),
      earnedBy: 234,
      totalEarnings: 5678,
      progressData: []
    },
    {
      id: "loyal_player",
      name: "Loyal Player",
      description: "Play every day for a week straight",
      category: "loyalty",
      type: "streak",
      isActive: true,
      isSecret: false,
      difficulty: "medium",
      icon: "❤️",
      color: "#EF4444",
      requirements: [
        { condition: "daily_login_streak", value: 7, period: "daily" }
      ],
      rewards: [
        { type: "badge", value: "loyal_player_badge", description: "Loyal Player Badge" },
        { type: "sc", value: 3, description: "3 Sweeps Coins" },
        { type: "vip_points", value: 50, description: "50 VIP Points" }
      ],
      milestones: [
        { tier: 1, name: "Week Warrior", requirement: 7, reward: { type: "sc", value: 3 } },
        { tier: 2, name: "Fortnight Fighter", requirement: 14, reward: { type: "sc", value: 5 } },
        { tier: 3, name: "Monthly Marvel", requirement: 30, reward: { type: "sc", value: 10 } },
        { tier: 4, name: "Quarterly Champion", requirement: 90, reward: { type: "vip_points", value: 200 } },
        { tier: 5, name: "Eternal Devotee", requirement: 365, reward: { type: "title", value: "Eternal Player" } }
      ],
      createdAt: new Date(),
      earnedBy: 456,
      totalEarnings: 8901,
      progressData: []
    },
    {
      id: "high_roller",
      name: "High Roller",
      description: "Spend $100 or more in the Gold Coin Store",
      category: "financial",
      type: "cumulative",
      isActive: true,
      isSecret: false,
      difficulty: "hard",
      icon: "💎",
      color: "#8B5CF6",
      requirements: [
        { condition: "total_spent", value: 100, period: "all-time" }
      ],
      rewards: [
        { type: "badge", value: "high_roller_badge", description: "High Roller Badge" },
        { type: "sc", value: 10, description: "10 Sweeps Coins" },
        { type: "title", value: "High Roller", description: "High Roller Title" }
      ],
      milestones: [
        { tier: 1, name: "Spender", requirement: 100, reward: { type: "sc", value: 10 } },
        { tier: 2, name: "Big Spender", requirement: 250, reward: { type: "sc", value: 20 } },
        { tier: 3, name: "VIP Customer", requirement: 500, reward: { type: "vip_points", value: 500 } },
        { tier: 4, name: "Premium Player", requirement: 1000, reward: { type: "sc", value: 50 } },
        { tier: 5, name: "Elite Patron", requirement: 2500, reward: { type: "title", value: "Elite Patron" } }
      ],
      createdAt: new Date(),
      earnedBy: 123,
      totalEarnings: 2345,
      progressData: []
    },
    {
      id: "secret_achievement",
      name: "Mystery Master",
      description: "Unlock this secret achievement by discovering the hidden game",
      category: "special",
      type: "challenge",
      isActive: true,
      isSecret: true,
      difficulty: "legendary",
      icon: "🔮",
      color: "#EC4899",
      requirements: [
        { condition: "hidden_game_found", value: 1 }
      ],
      rewards: [
        { type: "badge", value: "mystery_master_badge", description: "Mystery Master Badge" },
        { type: "sc", value: 25, description: "25 Sweeps Coins" },
        { type: "title", value: "Mystery Master", description: "Mystery Master Title" }
      ],
      milestones: [
        { tier: 1, name: "Secret Seeker", requirement: 1, reward: { type: "sc", value: 25 } }
      ],
      createdAt: new Date(),
      earnedBy: 12,
      totalEarnings: 300,
      progressData: []
    }
  ]);

  const [badges, setBadges] = useState<BadgeDesign[]>([
    {
      id: "first_spin_badge",
      name: "First Spin",
      description: "Commemorates your first slot game",
      rarity: "common",
      design: {
        shape: "circle",
        primaryColor: "#10B981",
        secondaryColor: "#065F46",
        icon: "🎰",
        border: "solid",
        glow: false
      },
      unlockConditions: ["Complete First Spin achievement"],
      isActive: true,
      earnedBy: 847,
      firstEarnedBy: "BetaTester1",
      firstEarnedAt: new Date("2024-01-01")
    },
    {
      id: "big_winner_badge",
      name: "Big Winner",
      description: "For those who strike it big",
      rarity: "rare",
      design: {
        shape: "star",
        primaryColor: "#F59E0B",
        secondaryColor: "#92400E",
        icon: "🏆",
        border: "gradient",
        glow: true
      },
      unlockConditions: ["Complete Big Winner achievement"],
      isActive: true,
      earnedBy: 234
    },
    {
      id: "loyal_player_badge",
      name: "Loyal Player",
      description: "For the most dedicated players",
      rarity: "epic",
      design: {
        shape: "shield",
        primaryColor: "#EF4444",
        secondaryColor: "#991B1B",
        icon: "❤️",
        border: "diamond",
        glow: true
      },
      unlockConditions: ["Complete Loyal Player achievement"],
      isActive: true,
      earnedBy: 456
    },
    {
      id: "high_roller_badge",
      name: "High Roller",
      description: "For the biggest spenders",
      rarity: "legendary",
      design: {
        shape: "diamond",
        primaryColor: "#8B5CF6",
        secondaryColor: "#581C87",
        icon: "💎",
        border: "platinum",
        glow: true
      },
      unlockConditions: ["Complete High Roller achievement"],
      isActive: true,
      earnedBy: 123
    },
    {
      id: "mystery_master_badge",
      name: "Mystery Master",
      description: "Only the most observant earn this",
      rarity: "mythic",
      design: {
        shape: "crown",
        primaryColor: "#EC4899",
        secondaryColor: "#9D174D",
        icon: "🔮",
        border: "mystical",
        glow: true
      },
      unlockConditions: ["Complete Mystery Master achievement"],
      isActive: true,
      earnedBy: 12
    }
  ]);

  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [selectedBadge, setSelectedBadge] = useState<BadgeDesign | null>(null);
  const [showNewAchievementForm, setShowNewAchievementForm] = useState(false);
  const [showNewBadgeForm, setShowNewBadgeForm] = useState(false);

  const [newAchievement, setNewAchievement] = useState({
    name: "",
    description: "",
    category: "gaming" as const,
    type: "milestone" as const,
    difficulty: "easy" as const,
    icon: "🏆",
    color: "#10B981",
    isSecret: false,
    requirements: [{ condition: "", value: 0 }],
    rewards: [{ type: "badge", value: "", description: "" }],
    milestones: [{ tier: 1, name: "", requirement: 0, reward: { type: "gc", value: 0 } }]
  });

  const [newBadge, setNewBadge] = useState({
    name: "",
    description: "",
    rarity: "common" as const,
    design: {
      shape: "circle" as const,
      primaryColor: "#10B981",
      secondaryColor: "#065F46",
      icon: "🏆",
      border: "solid",
      glow: false
    },
    unlockConditions: [""]
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-600";
      case "medium": return "bg-yellow-600";
      case "hard": return "bg-red-600";
      case "legendary": return "bg-purple-600";
      default: return "bg-gray-600";
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "bg-gray-600";
      case "rare": return "bg-blue-600";
      case "epic": return "bg-purple-600";
      case "legendary": return "bg-orange-600";
      case "mythic": return "bg-pink-600";
      default: return "bg-gray-600";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "gaming": return <Target className="w-4 h-4" />;
      case "social": return <Users className="w-4 h-4" />;
      case "financial": return <DollarSign className="w-4 h-4" />;
      case "loyalty": return <Heart className="w-4 h-4" />;
      case "special": return <Sparkles className="w-4 h-4" />;
      default: return <Award className="w-4 h-4" />;
    }
  };

  const handleCreateAchievement = async () => {
    const achievement: Achievement = {
      id: `achievement_${Date.now()}`,
      ...newAchievement,
      isActive: true,
      createdAt: new Date(),
      earnedBy: 0,
      totalEarnings: 0,
      progressData: []
    };

    setAchievements(prev => [...prev, achievement]);
    setShowNewAchievementForm(false);
    setNewAchievement({
      name: "",
      description: "",
      category: "gaming",
      type: "milestone",
      difficulty: "easy",
      icon: "🏆",
      color: "#10B981",
      isSecret: false,
      requirements: [{ condition: "", value: 0 }],
      rewards: [{ type: "badge", value: "", description: "" }],
      milestones: [{ tier: 1, name: "", requirement: 0, reward: { type: "gc", value: 0 } }]
    });
  };

  const handleCreateBadge = async () => {
    const badge: BadgeDesign = {
      id: `badge_${Date.now()}`,
      ...newBadge,
      isActive: true,
      earnedBy: 0
    };

    setBadges(prev => [...prev, badge]);
    setShowNewBadgeForm(false);
    setNewBadge({
      name: "",
      description: "",
      rarity: "common",
      design: {
        shape: "circle",
        primaryColor: "#10B981",
        secondaryColor: "#065F46",
        icon: "🏆",
        border: "solid",
        glow: false
      },
      unlockConditions: [""]
    });
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <Award className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-500">
              {achievements.filter(a => a.isActive).length}
            </div>
            <div className="text-sm text-gray-400">Active Achievements</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <Medal className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-500">
              {badges.filter(b => b.isActive).length}
            </div>
            <div className="text-sm text-gray-400">Available Badges</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-500">
              {achievements.reduce((sum, a) => sum + a.earnedBy, 0)}
            </div>
            <div className="text-sm text-gray-400">Total Earned</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-500">
              {achievements.reduce((sum, a) => sum + a.totalEarnings, 0)}
            </div>
            <div className="text-sm text-gray-400">Total Rewards Paid</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="achievements" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="progress">User Progress</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="achievements" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">Achievement Management</h3>
            <Button
              onClick={() => setShowNewAchievementForm(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Achievement
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div>
                        <CardTitle className="text-white flex items-center gap-2">
                          {achievement.name}
                          {achievement.isSecret && <Lock className="w-4 h-4 text-yellow-500" />}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getDifficultyColor(achievement.difficulty)}>
                            {achievement.difficulty}
                          </Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            {getCategoryIcon(achievement.category)}
                            {achievement.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Switch
                      checked={achievement.isActive}
                      onCheckedChange={(checked) => {
                        setAchievements(prev =>
                          prev.map(a => 
                            a.id === achievement.id ? { ...a, isActive: checked } : a
                          )
                        );
                      }}
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-400 text-sm">{achievement.description}</p>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-400">Earned By</div>
                      <div className="text-white font-medium">{achievement.earnedBy.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Total Rewards</div>
                      <div className="text-white font-medium">{achievement.totalEarnings.toLocaleString()}</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-gray-400 text-sm mb-2">Milestones</div>
                    <div className="space-y-1">
                      {achievement.milestones.slice(0, 3).map((milestone, index) => (
                        <div key={index} className="flex items-center justify-between text-xs">
                          <span className="text-gray-400">Tier {milestone.tier}: {milestone.name}</span>
                          <Badge className="bg-green-600">
                            {milestone.reward.value} {milestone.reward.type.toUpperCase()}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedAchievement(achievement)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        if (confirm(`Delete "${achievement.name}"?`)) {
                          setAchievements(prev => prev.filter(a => a.id !== achievement.id));
                        }
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="badges" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">Badge Management</h3>
            <Button
              onClick={() => setShowNewBadgeForm(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Badge
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {badges.map((badge) => (
              <Card key={badge.id} className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <div className="text-center">
                    <div 
                      className={`mx-auto mb-3 w-16 h-16 rounded-full flex items-center justify-center text-2xl ${
                        badge.design.glow ? 'shadow-lg' : ''
                      }`}
                      style={{ 
                        backgroundColor: badge.design.primaryColor,
                        border: `2px solid ${badge.design.secondaryColor}`,
                        boxShadow: badge.design.glow ? `0 0 20px ${badge.design.primaryColor}40` : 'none'
                      }}
                    >
                      {badge.design.icon}
                    </div>
                    <CardTitle className="text-white">{badge.name}</CardTitle>
                    <Badge className={getRarityColor(badge.rarity)}>
                      {badge.rarity}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-400 text-sm text-center">{badge.description}</p>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-gray-400">Earned By</div>
                      <div className="text-white font-medium">{badge.earnedBy.toLocaleString()}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-400">Shape</div>
                      <div className="text-white font-medium capitalize">{badge.design.shape}</div>
                    </div>
                  </div>

                  {badge.firstEarnedBy && (
                    <div className="text-center p-2 bg-gray-700 rounded">
                      <div className="text-xs text-gray-400">First earned by</div>
                      <div className="text-white font-medium">{badge.firstEarnedBy}</div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedBadge(badge)}
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        if (confirm(`Delete "${badge.name}" badge?`)) {
                          setBadges(prev => prev.filter(b => b.id !== badge.id));
                        }
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">User Progress Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {achievements.flatMap(achievement => 
                  achievement.progressData.map(progress => (
                    <div key={`${achievement.id}-${progress.userId}`} className="p-4 bg-gray-700 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="text-xl">{achievement.icon}</div>
                          <div>
                            <div className="text-white font-medium">{progress.username}</div>
                            <div className="text-gray-400 text-sm">{achievement.name}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-bold">{progress.percentage}%</div>
                          <div className="text-gray-400 text-sm">
                            {progress.progress}/{progress.maxProgress}
                          </div>
                        </div>
                      </div>
                      
                      <div className="w-full bg-gray-600 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${progress.percentage}%` }}
                        ></div>
                      </div>
                      
                      {progress.earnedAt && (
                        <div className="mt-2 text-xs text-green-400">
                          <CheckCircle className="w-3 h-3 inline mr-1" />
                          Completed on {progress.earnedAt.toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Achievement & Badge Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-white">Auto-award achievements</Label>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-white">Show secret achievements</Label>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-white">Badge notifications</Label>
                    <Switch defaultChecked />
                  </div>

                  <div>
                    <Label className="text-white">Default badge size</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-white">Max showcased badges</Label>
                    <Input type="number" defaultValue="3" className="mt-1" />
                  </div>

                  <div>
                    <Label className="text-white">Progress update frequency</Label>
                    <Select defaultValue="realtime">
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="realtime">Real-time</SelectItem>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white">Reset progress on</Label>
                    <Select defaultValue="never">
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="never">Never</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-white">Enable leaderboards</Label>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <Button className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Achievement Creation Modal */}
      {showNewAchievementForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="bg-gray-800 border-gray-700 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="text-white flex justify-between items-center">
                Create New Achievement
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNewAchievementForm(false)}
                >
                  ✕
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-white">Achievement Name</Label>
                    <Input
                      value={newAchievement.name}
                      onChange={(e) => setNewAchievement(prev => ({ ...prev, name: e.target.value }))}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-white">Description</Label>
                    <Textarea
                      value={newAchievement.description}
                      onChange={(e) => setNewAchievement(prev => ({ ...prev, description: e.target.value }))}
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white">Category</Label>
                      <Select value={newAchievement.category} onValueChange={(value: any) => setNewAchievement(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gaming">Gaming</SelectItem>
                          <SelectItem value="social">Social</SelectItem>
                          <SelectItem value="financial">Financial</SelectItem>
                          <SelectItem value="loyalty">Loyalty</SelectItem>
                          <SelectItem value="special">Special</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-white">Difficulty</Label>
                      <Select value={newAchievement.difficulty} onValueChange={(value: any) => setNewAchievement(prev => ({ ...prev, difficulty: value }))}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                          <SelectItem value="legendary">Legendary</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white">Icon</Label>
                      <Input
                        value={newAchievement.icon}
                        onChange={(e) => setNewAchievement(prev => ({ ...prev, icon: e.target.value }))}
                        className="mt-1"
                        placeholder="🏆"
                      />
                    </div>

                    <div>
                      <Label className="text-white">Color</Label>
                      <Input
                        type="color"
                        value={newAchievement.color}
                        onChange={(e) => setNewAchievement(prev => ({ ...prev, color: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={newAchievement.isSecret}
                      onCheckedChange={(checked) => setNewAchievement(prev => ({ ...prev, isSecret: checked }))}
                    />
                    <Label className="text-white">Secret Achievement</Label>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-white">Requirements</Label>
                    {newAchievement.requirements.map((req, index) => (
                      <div key={index} className="flex gap-2 mt-2">
                        <Input
                          placeholder="Condition"
                          value={req.condition}
                          onChange={(e) => {
                            const updated = [...newAchievement.requirements];
                            updated[index].condition = e.target.value;
                            setNewAchievement(prev => ({ ...prev, requirements: updated }));
                          }}
                          className="flex-1"
                        />
                        <Input
                          type="number"
                          placeholder="Value"
                          value={req.value}
                          onChange={(e) => {
                            const updated = [...newAchievement.requirements];
                            updated[index].value = parseInt(e.target.value) || 0;
                            setNewAchievement(prev => ({ ...prev, requirements: updated }));
                          }}
                          className="w-20"
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <Label className="text-white">Rewards</Label>
                    {newAchievement.rewards.map((reward, index) => (
                      <div key={index} className="grid grid-cols-3 gap-2 mt-2">
                        <Select value={reward.type} onValueChange={(value: any) => {
                          const updated = [...newAchievement.rewards];
                          updated[index].type = value;
                          setNewAchievement(prev => ({ ...prev, rewards: updated }));
                        }}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="badge">Badge</SelectItem>
                            <SelectItem value="gc">Gold Coins</SelectItem>
                            <SelectItem value="sc">Sweeps Coins</SelectItem>
                            <SelectItem value="vip_points">VIP Points</SelectItem>
                            <SelectItem value="title">Title</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          placeholder="Value"
                          value={reward.value}
                          onChange={(e) => {
                            const updated = [...newAchievement.rewards];
                            updated[index].value = e.target.value;
                            setNewAchievement(prev => ({ ...prev, rewards: updated }));
                          }}
                        />
                        <Input
                          placeholder="Description"
                          value={reward.description}
                          onChange={(e) => {
                            const updated = [...newAchievement.rewards];
                            updated[index].description = e.target.value;
                            setNewAchievement(prev => ({ ...prev, rewards: updated }));
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleCreateAchievement}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Create Achievement
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowNewAchievementForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Badge Creation Modal */}
      {showNewBadgeForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="bg-gray-800 border-gray-700 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="text-white flex justify-between items-center">
                Create New Badge
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNewBadgeForm(false)}
                >
                  ✕
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-white">Badge Name</Label>
                    <Input
                      value={newBadge.name}
                      onChange={(e) => setNewBadge(prev => ({ ...prev, name: e.target.value }))}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-white">Description</Label>
                    <Textarea
                      value={newBadge.description}
                      onChange={(e) => setNewBadge(prev => ({ ...prev, description: e.target.value }))}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-white">Rarity</Label>
                    <Select value={newBadge.rarity} onValueChange={(value: any) => setNewBadge(prev => ({ ...prev, rarity: value }))}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="common">Common</SelectItem>
                        <SelectItem value="rare">Rare</SelectItem>
                        <SelectItem value="epic">Epic</SelectItem>
                        <SelectItem value="legendary">Legendary</SelectItem>
                        <SelectItem value="mythic">Mythic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="text-center">
                    <div 
                      className={`mx-auto mb-3 w-16 h-16 rounded-full flex items-center justify-center text-2xl ${
                        newBadge.design.glow ? 'shadow-lg' : ''
                      }`}
                      style={{ 
                        backgroundColor: newBadge.design.primaryColor,
                        border: `2px solid ${newBadge.design.secondaryColor}`,
                        boxShadow: newBadge.design.glow ? `0 0 20px ${newBadge.design.primaryColor}40` : 'none'
                      }}
                    >
                      {newBadge.design.icon}
                    </div>
                    <div className="text-white font-medium">Preview</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white">Primary Color</Label>
                      <Input
                        type="color"
                        value={newBadge.design.primaryColor}
                        onChange={(e) => setNewBadge(prev => ({ 
                          ...prev, 
                          design: { ...prev.design, primaryColor: e.target.value }
                        }))}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label className="text-white">Secondary Color</Label>
                      <Input
                        type="color"
                        value={newBadge.design.secondaryColor}
                        onChange={(e) => setNewBadge(prev => ({ 
                          ...prev, 
                          design: { ...prev.design, secondaryColor: e.target.value }
                        }))}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-white">Icon</Label>
                    <Input
                      value={newBadge.design.icon}
                      onChange={(e) => setNewBadge(prev => ({ 
                        ...prev, 
                        design: { ...prev.design, icon: e.target.value }
                      }))}
                      className="mt-1"
                      placeholder="🏆"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={newBadge.design.glow}
                      onCheckedChange={(checked) => setNewBadge(prev => ({ 
                        ...prev, 
                        design: { ...prev.design, glow: checked }
                      }))}
                    />
                    <Label className="text-white">Enable Glow Effect</Label>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleCreateBadge}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Create Badge
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowNewBadgeForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
