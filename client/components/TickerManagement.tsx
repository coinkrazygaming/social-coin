import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Monitor,
  Plus,
  Edit,
  Trash2,
  Save,
  Play,
  Pause,
  RotateCcw,
  Clock,
  Trophy,
  DollarSign,
  Users,
  Star,
  TrendingUp,
  Calendar,
  Settings,
  Bot,
  Share2,
  ExternalLink,
  Eye,
  EyeOff,
  Copy,
  MessageCircle,
  Hash,
  Link,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import { Slider } from "./ui/slider";
import { Label } from "./ui/label";

interface TickerMessage {
  id: string;
  type: "winner" | "promotion" | "news" | "social" | "jackpot" | "tournament";
  content: string;
  displayText: string;
  priority: "low" | "medium" | "high" | "urgent";
  isActive: boolean;
  isAIGenerated: boolean;
  scheduledStart?: Date;
  scheduledEnd?: Date;
  displayDuration: number; // seconds
  metadata: {
    winAmount?: number;
    playerName?: string;
    gameName?: string;
    socialPlatform?: string;
    promotionCode?: string;
    url?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

interface TickerSettings {
  isEnabled: boolean;
  speed: number; // pixels per second
  displayDuration: number; // seconds per message
  backgroundColor: string;
  textColor: string;
  fontSize: number;
  autoScroll: boolean;
  showIcons: boolean;
  enableAI: boolean;
  aiPostingFrequency: number; // minutes
  maxMessages: number;
  socialMediaIntegration: boolean;
}

interface SocialMediaPost {
  id: string;
  platform: "twitter" | "facebook" | "instagram" | "tiktok";
  content: string;
  mediaUrls?: string[];
  scheduledFor?: Date;
  postedAt?: Date;
  status: "draft" | "scheduled" | "posted" | "failed";
  engagement: {
    likes: number;
    shares: number;
    comments: number;
    clicks: number;
  };
  aiGenerated: boolean;
}

interface TickerManagementProps {
  className?: string;
}

export const TickerManagement: React.FC<TickerManagementProps> = ({
  className = "",
}) => {
  const [messages, setMessages] = useState<TickerMessage[]>([]);
  const [settings, setSettings] = useState<TickerSettings>({
    isEnabled: true,
    speed: 50,
    displayDuration: 8,
    backgroundColor: "#1f2937",
    textColor: "#fbbf24",
    fontSize: 16,
    autoScroll: true,
    showIcons: true,
    enableAI: true,
    aiPostingFrequency: 30,
    maxMessages: 50,
    socialMediaIntegration: true,
  });
  const [socialPosts, setSocialPosts] = useState<SocialMediaPost[]>([]);
  const [editingMessage, setEditingMessage] = useState<TickerMessage | null>(
    null,
  );
  const [showMessageEditor, setShowMessageEditor] = useState(false);
  const [activeTab, setActiveTab] = useState("messages");

  useEffect(() => {
    loadTickerData();
    startAIGeneration();
  }, []);

  const loadTickerData = () => {
    // Load existing ticker messages
    const existingMessages: TickerMessage[] = [
      {
        id: "msg_001",
        type: "winner",
        content: "Big Win Alert!",
        displayText:
          "🎉 HUGE WIN! LuckyPlayer777 just won 25,000 SC on Royal Fortune! Congratulations! 🎉",
        priority: "high",
        isActive: true,
        isAIGenerated: false,
        displayDuration: 10,
        metadata: {
          winAmount: 25000,
          playerName: "LuckyPlayer777",
          gameName: "Royal Fortune",
        },
        createdAt: new Date(Date.now() - 3600000),
        updatedAt: new Date(Date.now() - 3600000),
        createdBy: "admin",
      },
      {
        id: "msg_002",
        type: "promotion",
        content: "Weekend Special!",
        displayText:
          "🔥 WEEKEND SPECIAL: 100% Bonus Gold Coins + 50 Free SC! Use code WEEKEND100 🔥",
        priority: "urgent",
        isActive: true,
        isAIGenerated: false,
        scheduledStart: new Date(),
        scheduledEnd: new Date(Date.now() + 86400000 * 2),
        displayDuration: 12,
        metadata: {
          promotionCode: "WEEKEND100",
          url: "/store",
        },
        createdAt: new Date(Date.now() - 1800000),
        updatedAt: new Date(Date.now() - 1800000),
        createdBy: "admin",
      },
      {
        id: "msg_003",
        type: "social",
        content: "Follow us on social!",
        displayText:
          "📱 Follow @CoinKrazy on all social platforms for exclusive bonuses and giveaways! 📱",
        priority: "medium",
        isActive: true,
        isAIGenerated: true,
        displayDuration: 8,
        metadata: {
          socialPlatform: "all",
          url: "https://twitter.com/coinkrizy",
        },
        createdAt: new Date(Date.now() - 900000),
        updatedAt: new Date(Date.now() - 900000),
        createdBy: "joseyai",
      },
      {
        id: "msg_004",
        type: "jackpot",
        content: "Progressive Jackpot Alert",
        displayText:
          "💰 MEGA JACKPOT now at $125,000! Play Mega Fortune for your chance to win BIG! 💰",
        priority: "high",
        isActive: true,
        isAIGenerated: true,
        displayDuration: 10,
        metadata: {
          winAmount: 125000,
          gameName: "Mega Fortune",
        },
        createdAt: new Date(Date.now() - 600000),
        updatedAt: new Date(Date.now() - 600000),
        createdBy: "joseyai",
      },
    ];

    const existingSocialPosts: SocialMediaPost[] = [
      {
        id: "post_001",
        platform: "twitter",
        content:
          "🎰 Big Win Alert! One of our players just hit it big on Royal Fortune! Could you be next? Play now with your FREE daily coins! #CoinKrazy #BigWin #SocialCasino",
        scheduledFor: new Date(Date.now() + 3600000),
        status: "scheduled",
        engagement: { likes: 0, shares: 0, comments: 0, clicks: 0 },
        aiGenerated: true,
      },
      {
        id: "post_002",
        platform: "facebook",
        content:
          "Weekend Special is LIVE! 🔥\n\nGet 100% Bonus Gold Coins + 50 Free Sweeps Coins!\nUse code: WEEKEND100\n\nDon't miss out on this amazing deal!",
        postedAt: new Date(Date.now() - 1800000),
        status: "posted",
        engagement: { likes: 47, shares: 12, comments: 8, clicks: 156 },
        aiGenerated: false,
      },
    ];

    setMessages(existingMessages);
    setSocialPosts(existingSocialPosts);
  };

  const startAIGeneration = () => {
    if (!settings.enableAI) return;

    const interval = setInterval(() => {
      generateAIContent();
    }, settings.aiPostingFrequency * 60000);

    return () => clearInterval(interval);
  };

  const generateAIContent = () => {
    const winnerMessages = [
      {
        playerName: generatePlayerName(),
        gameName: getRandomGame(),
        winAmount: Math.floor(Math.random() * 50000) + 1000,
        type: "winner" as const,
      },
    ];

    const promoMessages = [
      {
        content: "Flash Sale Alert!",
        displayText:
          "⚡ FLASH SALE: 24 hours only! Extra 50% Gold Coins on all packages! ⚡",
        type: "promotion" as const,
      },
      {
        content: "Daily Bonus Reminder",
        displayText:
          "🎁 Don't forget your FREE daily bonus! Login now to claim your coins! 🎁",
        type: "news" as const,
      },
    ];

    const socialMessages = [
      {
        content: "Community milestone!",
        displayText:
          "🎉 We just reached 100K players! Thank you for being part of the CoinKrazy family! 🎉",
        type: "social" as const,
      },
    ];

    const allMessages = [
      ...winnerMessages,
      ...promoMessages,
      ...socialMessages,
    ];
    const randomMessage =
      allMessages[Math.floor(Math.random() * allMessages.length)];

    let newMessage: TickerMessage;

    if (randomMessage.type === "winner") {
      newMessage = {
        id: `ai_msg_${Date.now()}`,
        type: randomMessage.type,
        content: "AI Generated Winner Alert",
        displayText: `🎉 ${randomMessage.playerName} just won ${randomMessage.winAmount.toLocaleString()} SC on ${randomMessage.gameName}! 🎉`,
        priority: "medium",
        isActive: true,
        isAIGenerated: true,
        displayDuration: 8,
        metadata: {
          winAmount: randomMessage.winAmount,
          playerName: randomMessage.playerName,
          gameName: randomMessage.gameName,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: "joseyai",
      };
    } else {
      newMessage = {
        id: `ai_msg_${Date.now()}`,
        type: randomMessage.type,
        content: randomMessage.content,
        displayText: randomMessage.displayText,
        priority: "medium",
        isActive: true,
        isAIGenerated: true,
        displayDuration: 8,
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: "joseyai",
      };
    }

    setMessages((prev) => [
      newMessage,
      ...prev.slice(0, settings.maxMessages - 1),
    ]);

    // Also generate social media posts
    if (settings.socialMediaIntegration && Math.random() < 0.3) {
      generateSocialMediaPost();
    }
  };

  const generateSocialMediaPost = () => {
    const platforms = ["twitter", "facebook", "instagram"] as const;
    const randomPlatform =
      platforms[Math.floor(Math.random() * platforms.length)];

    const postTemplates = [
      {
        platform: "twitter",
        content: `🎰 Another big winner at CoinKrazy! ${generatePlayerName()} just hit the jackpot! Your turn could be next! 🎉 #BigWin #SocialCasino #CoinKrazy`,
      },
      {
        platform: "facebook",
        content: `🔥 TRENDING NOW: Our players are winning BIG this week!\n\nJoin the excitement and play your favorite slots with FREE coins!\n\nSign up today and get your welcome bonus! 🎁`,
      },
      {
        platform: "instagram",
        content: `✨ Winner Wednesday! ✨\n\nCongratulations to all our lucky winners this week! 🏆\n\n#WinnerWednesday #CoinKrazy #SocialCasino #BigWins`,
      },
    ];

    const template =
      postTemplates.find((t) => t.platform === randomPlatform) ||
      postTemplates[0];

    const newPost: SocialMediaPost = {
      id: `ai_post_${Date.now()}`,
      platform: randomPlatform,
      content: template.content,
      scheduledFor: new Date(Date.now() + Math.random() * 3600000 + 300000), // 5 min to 1 hour
      status: "scheduled",
      engagement: { likes: 0, shares: 0, comments: 0, clicks: 0 },
      aiGenerated: true,
    };

    setSocialPosts((prev) => [newPost, ...prev]);
  };

  const generatePlayerName = () => {
    const adjectives = [
      "Lucky",
      "Golden",
      "Diamond",
      "Royal",
      "Mega",
      "Super",
      "Epic",
    ];
    const nouns = ["Player", "Winner", "Gamer", "Star", "Hero", "Champion"];
    const numbers = Math.floor(Math.random() * 999) + 1;
    return `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}${numbers}`;
  };

  const getRandomGame = () => {
    const games = [
      "Royal Fortune",
      "Lucky Sevens",
      "Diamond Dreams",
      "Mega Millions",
      "Golden Dragon",
      "Crystal Palace",
    ];
    return games[Math.floor(Math.random() * games.length)];
  };

  const createNewMessage = () => {
    const newMessage: TickerMessage = {
      id: `msg_${Date.now()}`,
      type: "news",
      content: "New Message",
      displayText: "New ticker message",
      priority: "medium",
      isActive: true,
      isAIGenerated: false,
      displayDuration: 8,
      metadata: {},
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: "admin",
    };

    setEditingMessage(newMessage);
    setShowMessageEditor(true);
  };

  const saveMessage = (message: TickerMessage) => {
    setMessages((prev) => {
      const existing = prev.findIndex((m) => m.id === message.id);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { ...message, updatedAt: new Date() };
        return updated;
      }
      return [message, ...prev];
    });
    setShowMessageEditor(false);
    setEditingMessage(null);
  };

  const deleteMessage = (messageId: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== messageId));
  };

  const toggleMessageActive = (messageId: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId
          ? { ...m, isActive: !m.isActive, updatedAt: new Date() }
          : m,
      ),
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "winner":
        return Trophy;
      case "promotion":
        return Star;
      case "news":
        return MessageCircle;
      case "social":
        return Share2;
      case "jackpot":
        return DollarSign;
      case "tournament":
        return Users;
      default:
        return MessageCircle;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "text-red-500 bg-red-500/10";
      case "high":
        return "text-orange-500 bg-orange-500/10";
      case "medium":
        return "text-yellow-500 bg-yellow-500/10";
      default:
        return "text-blue-500 bg-blue-500/10";
    }
  };

  const activeMessages = messages.filter((m) => m.isActive);
  const scheduledMessages = messages.filter(
    (m) => m.scheduledStart && m.scheduledStart > new Date(),
  );

  return (
    <div className={`space-y-6 ${className}`}>
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Ticker Management & Social Media Center
            <Badge variant="outline">{messages.length} Messages</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="messages">Ticker Messages</TabsTrigger>
              <TabsTrigger value="settings">Ticker Settings</TabsTrigger>
              <TabsTrigger value="social">Social Media</TabsTrigger>
              <TabsTrigger value="ai">AI Automation</TabsTrigger>
            </TabsList>

            {/* Ticker Messages Tab */}
            <TabsContent value="messages" className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h3 className="text-lg font-semibold text-white">
                    Active Messages
                  </h3>
                  <Badge className="bg-green-600">
                    {activeMessages.length} Active
                  </Badge>
                  <Badge variant="outline">
                    {scheduledMessages.length} Scheduled
                  </Badge>
                </div>
                <Button onClick={createNewMessage} className="bg-blue-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Message
                </Button>
              </div>

              {/* Live Ticker Preview */}
              <Card className="bg-gray-900 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-sm">Live Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="relative overflow-hidden rounded p-3"
                    style={{
                      backgroundColor: settings.backgroundColor,
                      color: settings.textColor,
                      fontSize: `${settings.fontSize}px`,
                    }}
                  >
                    <motion.div
                      animate={{ x: [-100, 100] }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="whitespace-nowrap"
                    >
                      {activeMessages.length > 0
                        ? activeMessages[0].displayText
                        : "No active messages"}
                    </motion.div>
                  </div>
                </CardContent>
              </Card>

              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {messages.map((message) => {
                    const TypeIcon = getTypeIcon(message.type);
                    const priorityClass = getPriorityColor(message.priority);

                    return (
                      <Card
                        key={message.id}
                        className={`${priorityClass} border-current/20`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              <TypeIcon className="h-5 w-5 mt-1" />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium text-white">
                                    {message.content}
                                  </h4>
                                  <Badge className={priorityClass}>
                                    {message.priority}
                                  </Badge>
                                  {message.isAIGenerated && (
                                    <Badge className="bg-purple-600">
                                      <Bot className="h-3 w-3 mr-1" />
                                      AI
                                    </Badge>
                                  )}
                                  <Badge
                                    variant={
                                      message.isActive ? "default" : "secondary"
                                    }
                                  >
                                    {message.isActive ? "Active" : "Inactive"}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-300 mb-2">
                                  {message.displayText}
                                </p>
                                <div className="flex items-center gap-4 text-xs text-gray-400">
                                  <span>
                                    Duration: {message.displayDuration}s
                                  </span>
                                  <span>
                                    Created:{" "}
                                    {message.createdAt.toLocaleDateString()}
                                  </span>
                                  <span>By: {message.createdBy}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleMessageActive(message.id)}
                              >
                                {message.isActive ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingMessage(message);
                                  setShowMessageEditor(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              {!message.isAIGenerated && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteMessage(message.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Ticker Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-gray-700/50">
                  <CardHeader>
                    <CardTitle>Display Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Enable Ticker</Label>
                      <Switch
                        checked={settings.isEnabled}
                        onCheckedChange={(checked) =>
                          setSettings((prev) => ({
                            ...prev,
                            isEnabled: checked,
                          }))
                        }
                      />
                    </div>

                    <div>
                      <Label>Scroll Speed: {settings.speed} px/s</Label>
                      <Slider
                        value={[settings.speed]}
                        onValueChange={([value]) =>
                          setSettings((prev) => ({ ...prev, speed: value }))
                        }
                        min={10}
                        max={100}
                        step={5}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label>
                        Message Duration: {settings.displayDuration}s
                      </Label>
                      <Slider
                        value={[settings.displayDuration]}
                        onValueChange={([value]) =>
                          setSettings((prev) => ({
                            ...prev,
                            displayDuration: value,
                          }))
                        }
                        min={3}
                        max={30}
                        step={1}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label>Font Size: {settings.fontSize}px</Label>
                      <Slider
                        value={[settings.fontSize]}
                        onValueChange={([value]) =>
                          setSettings((prev) => ({ ...prev, fontSize: value }))
                        }
                        min={12}
                        max={24}
                        step={1}
                        className="mt-2"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-700/50">
                  <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Background Color</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          type="color"
                          value={settings.backgroundColor}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              backgroundColor: e.target.value,
                            }))
                          }
                          className="w-16 h-10"
                        />
                        <Input
                          value={settings.backgroundColor}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              backgroundColor: e.target.value,
                            }))
                          }
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Text Color</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          type="color"
                          value={settings.textColor}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              textColor: e.target.value,
                            }))
                          }
                          className="w-16 h-10"
                        />
                        <Input
                          value={settings.textColor}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              textColor: e.target.value,
                            }))
                          }
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Show Icons</Label>
                      <Switch
                        checked={settings.showIcons}
                        onCheckedChange={(checked) =>
                          setSettings((prev) => ({
                            ...prev,
                            showIcons: checked,
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Auto Scroll</Label>
                      <Switch
                        checked={settings.autoScroll}
                        onCheckedChange={(checked) =>
                          setSettings((prev) => ({
                            ...prev,
                            autoScroll: checked,
                          }))
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-center">
                <Button className="bg-green-600">
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </Button>
              </div>
            </TabsContent>

            {/* Social Media Tab */}
            <TabsContent value="social" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                  Social Media Posts
                </h3>
                <Button className="bg-blue-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Post
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {socialPosts.map((post) => (
                  <Card key={post.id} className="bg-gray-700/50">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="text-2xl">
                            {post.platform === "twitter" && "🐦"}
                            {post.platform === "facebook" && "📘"}
                            {post.platform === "instagram" && "📸"}
                            {post.platform === "tiktok" && "🎵"}
                          </div>
                          <div>
                            <h4 className="font-medium text-white capitalize">
                              {post.platform}
                            </h4>
                            <Badge
                              variant={
                                post.status === "posted"
                                  ? "default"
                                  : post.status === "scheduled"
                                    ? "secondary"
                                    : post.status === "failed"
                                      ? "destructive"
                                      : "outline"
                              }
                            >
                              {post.status}
                            </Badge>
                          </div>
                        </div>
                        {post.aiGenerated && (
                          <Badge className="bg-purple-600">
                            <Bot className="h-3 w-3 mr-1" />
                            AI
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-300 mb-3 line-clamp-3">
                        {post.content}
                      </p>

                      {post.status === "posted" && (
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="text-center p-2 bg-blue-900/30 rounded">
                            <div className="font-bold text-blue-400">
                              {post.engagement.likes}
                            </div>
                            <div className="text-blue-300">Likes</div>
                          </div>
                          <div className="text-center p-2 bg-green-900/30 rounded">
                            <div className="font-bold text-green-400">
                              {post.engagement.shares}
                            </div>
                            <div className="text-green-300">Shares</div>
                          </div>
                          <div className="text-center p-2 bg-purple-900/30 rounded">
                            <div className="font-bold text-purple-400">
                              {post.engagement.comments}
                            </div>
                            <div className="text-purple-300">Comments</div>
                          </div>
                          <div className="text-center p-2 bg-orange-900/30 rounded">
                            <div className="font-bold text-orange-400">
                              {post.engagement.clicks}
                            </div>
                            <div className="text-orange-300">Clicks</div>
                          </div>
                        </div>
                      )}

                      {post.scheduledFor && (
                        <div className="text-xs text-gray-400 mt-2">
                          Scheduled: {post.scheduledFor.toLocaleString()}
                        </div>
                      )}

                      {post.postedAt && (
                        <div className="text-xs text-gray-400 mt-2">
                          Posted: {post.postedAt.toLocaleString()}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* AI Automation Tab */}
            <TabsContent value="ai" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-gray-700/50">
                  <CardHeader>
                    <CardTitle>AI Ticker Generation</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Enable AI Generation</Label>
                      <Switch
                        checked={settings.enableAI}
                        onCheckedChange={(checked) =>
                          setSettings((prev) => ({
                            ...prev,
                            enableAI: checked,
                          }))
                        }
                      />
                    </div>

                    <div>
                      <Label>
                        Posting Frequency: {settings.aiPostingFrequency} minutes
                      </Label>
                      <Slider
                        value={[settings.aiPostingFrequency]}
                        onValueChange={([value]) =>
                          setSettings((prev) => ({
                            ...prev,
                            aiPostingFrequency: value,
                          }))
                        }
                        min={5}
                        max={120}
                        step={5}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label>Max Messages: {settings.maxMessages}</Label>
                      <Slider
                        value={[settings.maxMessages]}
                        onValueChange={([value]) =>
                          setSettings((prev) => ({
                            ...prev,
                            maxMessages: value,
                          }))
                        }
                        min={10}
                        max={100}
                        step={5}
                        className="mt-2"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Social Media Integration</Label>
                      <Switch
                        checked={settings.socialMediaIntegration}
                        onCheckedChange={(checked) =>
                          setSettings((prev) => ({
                            ...prev,
                            socialMediaIntegration: checked,
                          }))
                        }
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-700/50">
                  <CardHeader>
                    <CardTitle>AI Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">
                        {messages.filter((m) => m.isAIGenerated).length}
                      </div>
                      <div className="text-sm text-gray-400">
                        AI Generated Messages
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">
                        {socialPosts.filter((p) => p.aiGenerated).length}
                      </div>
                      <div className="text-sm text-gray-400">
                        AI Generated Posts
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">
                        94%
                      </div>
                      <div className="text-sm text-gray-400">
                        AI Content Engagement
                      </div>
                    </div>

                    <Button
                      onClick={generateAIContent}
                      className="w-full bg-purple-600"
                    >
                      <Bot className="h-4 w-4 mr-2" />
                      Generate AI Content Now
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Message Editor Modal */}
      <Dialog open={showMessageEditor} onOpenChange={setShowMessageEditor}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingMessage?.id.startsWith("msg_")
                ? "Edit Message"
                : "Create Message"}
            </DialogTitle>
          </DialogHeader>
          {editingMessage && (
            <TickerMessageEditor
              message={editingMessage}
              onSave={saveMessage}
              onCancel={() => {
                setShowMessageEditor(false);
                setEditingMessage(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Message Editor Component
interface TickerMessageEditorProps {
  message: TickerMessage;
  onSave: (message: TickerMessage) => void;
  onCancel: () => void;
}

function TickerMessageEditor({
  message,
  onSave,
  onCancel,
}: TickerMessageEditorProps) {
  const [editedMessage, setEditedMessage] = useState<TickerMessage>(message);

  const handleSave = () => {
    onSave({ ...editedMessage, updatedAt: new Date() });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Message Type</Label>
        <Select
          value={editedMessage.type}
          onValueChange={(value) =>
            setEditedMessage((prev) => ({ ...prev, type: value as any }))
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="winner">Winner Alert</SelectItem>
            <SelectItem value="promotion">Promotion</SelectItem>
            <SelectItem value="news">News</SelectItem>
            <SelectItem value="social">Social</SelectItem>
            <SelectItem value="jackpot">Jackpot</SelectItem>
            <SelectItem value="tournament">Tournament</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Content Title</Label>
        <Input
          value={editedMessage.content}
          onChange={(e) =>
            setEditedMessage((prev) => ({ ...prev, content: e.target.value }))
          }
          placeholder="Brief title for the message"
        />
      </div>

      <div>
        <Label>Display Text</Label>
        <Textarea
          value={editedMessage.displayText}
          onChange={(e) =>
            setEditedMessage((prev) => ({
              ...prev,
              displayText: e.target.value,
            }))
          }
          placeholder="Full text that will scroll on the ticker"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Priority</Label>
          <Select
            value={editedMessage.priority}
            onValueChange={(value) =>
              setEditedMessage((prev) => ({ ...prev, priority: value as any }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Display Duration (seconds)</Label>
          <Input
            type="number"
            value={editedMessage.displayDuration}
            onChange={(e) =>
              setEditedMessage((prev) => ({
                ...prev,
                displayDuration: parseInt(e.target.value) || 8,
              }))
            }
            min="3"
            max="30"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Label>Active</Label>
        <Switch
          checked={editedMessage.isActive}
          onCheckedChange={(checked) =>
            setEditedMessage((prev) => ({ ...prev, isActive: checked }))
          }
        />
      </div>

      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave} className="bg-blue-600">
          <Save className="h-4 w-4 mr-2" />
          Save Message
        </Button>
      </div>
    </div>
  );
}
