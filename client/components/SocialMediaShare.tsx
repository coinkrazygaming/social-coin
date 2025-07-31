import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Share2,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Link,
  Copy,
  Check,
  Download,
  Image,
  Video,
  Users,
  TrendingUp,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface SocialMediaShareProps {
  className?: string;
}

export const SocialMediaShare: React.FC<SocialMediaShareProps> = ({
  className = "",
}) => {
  const [activeTab, setActiveTab] = useState<
    "quick-share" | "content-creator" | "analytics"
  >("quick-share");
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [customMessage, setCustomMessage] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");

  const quickShareLinks = [
    {
      id: "homepage",
      title: "Coin Krazy Homepage",
      url: "https://coinkrizy.com",
      description: "Main platform page with welcome bonus",
    },
    {
      id: "games",
      title: "Social Casino Games",
      url: "https://coinkrizy.com/social-casino",
      description: "Full collection of slot games and table games",
    },
    {
      id: "promotions",
      title: "Current Promotions",
      url: "https://coinkrizy.com/promotions",
      description: "Latest bonuses and special offers",
    },
    {
      id: "mobile",
      title: "Mobile App",
      url: "https://coinkrizy.com/mobile",
      description: "Download our mobile app for iOS and Android",
    },
  ];

  const socialTemplates = [
    {
      id: "new-games",
      title: "New Games Announcement",
      content:
        "🎰 NEW GAMES ALERT! 🎰\n\nWe just added 25+ new slot games to Coin Krazy Social Casino! \n\n✨ Amazing graphics\n🎁 Bonus features\n💫 Free daily coins\n\nStart playing now with your welcome bonus!\n\n#CoinKrazy #SocialCasino #NewGames #FreeToPlay",
      platforms: ["twitter", "facebook", "instagram"],
    },
    {
      id: "promotion",
      title: "Special Promotion",
      content:
        "🔥 LIMITED TIME OFFER! 🔥\n\nGet 100,000 FREE Gold Coins + 100 Sweeps Coins when you sign up today!\n\n🎯 Perfect for new players\n💎 Premium slot collection\n🏆 Real prize redemptions\n⏰ Offer ends soon!\n\nClaim your bonus now! 👆\n\n#CoinKrazy #FreeBonus #SocialCasino #WinReal",
      platforms: ["facebook", "instagram", "twitter"],
    },
    {
      id: "winner-spotlight",
      title: "Winner Spotlight",
      content:
        "🎉 WINNER SPOTLIGHT! 🎉\n\nCongratulations to our latest jackpot winner who just redeemed $2,500 in prizes! 💰\n\n🎰 Playing: Lucky Diamond Slots\n💎 Prize: $2,500 cash redemption\n⏱️ Playing time: Just 30 minutes!\n\nYour turn could be next! Start playing with free coins!\n\n#CoinKrazy #Winner #Jackpot #RealPrizes",
      platforms: ["facebook", "twitter", "instagram"],
    },
    {
      id: "game-feature",
      title: "Game Feature Highlight",
      content:
        "🎮 GAME SPOTLIGHT: Dragon's Fortune 🐉\n\n🔥 Features:\n• 243 ways to win\n• Progressive multipliers\n• Free spin bonuses\n• 96.8% RTP\n\nTry it now with your daily free coins!\n\n#CoinKrazy #DragonsFortune #SlotGames #FreePlay",
      platforms: ["twitter", "facebook", "instagram"],
    },
  ];

  const socialPlatforms = [
    {
      id: "twitter",
      name: "Twitter / X",
      icon: Twitter,
      color: "bg-black text-white",
      maxChars: 280,
      bestTimes: ["9 AM", "12 PM", "3 PM", "6 PM"],
      tips: "Use hashtags, keep it concise, engage with replies",
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: Facebook,
      color: "bg-blue-600 text-white",
      maxChars: 2200,
      bestTimes: ["9 AM", "1 PM", "7 PM"],
      tips: "Longer posts perform well, use engaging images",
    },
    {
      id: "instagram",
      name: "Instagram",
      icon: Instagram,
      color: "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
      maxChars: 2200,
      bestTimes: ["11 AM", "2 PM", "5 PM", "8 PM"],
      tips: "Visual-first content, use stories for engagement",
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: Linkedin,
      color: "bg-blue-700 text-white",
      maxChars: 3000,
      bestTimes: ["8 AM", "12 PM", "5 PM"],
      tips: "Professional tone, industry insights, company updates",
    },
  ];

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(id);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const generateShareUrl = (platform: string, text: string, url: string) => {
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(url);

    switch (platform) {
      case "twitter":
        return `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
      case "facebook":
        return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
      case "linkedin":
        return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&summary=${encodedText}`;
      default:
        return "#";
    }
  };

  const mockAnalytics = {
    totalShares: 1247,
    totalClicks: 8932,
    topPlatform: "Facebook",
    engagement: 4.8,
    recentShares: [
      { platform: "Facebook", shares: 45, date: "2024-01-15" },
      { platform: "Twitter", shares: 32, date: "2024-01-15" },
      { platform: "Instagram", shares: 28, date: "2024-01-15" },
      { platform: "LinkedIn", shares: 12, date: "2024-01-15" },
    ],
  };

  const renderQuickShare = () => (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
          Quick Share Links
        </h4>
        <div className="space-y-3">
          {quickShareLinks.map((link) => (
            <div
              key={link.id}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3"
            >
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-medium text-gray-900 dark:text-white">
                  {link.title}
                </h5>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(link.url, link.id)}
                >
                  {copiedText === link.id ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {link.description}
              </p>
              <div className="flex gap-2">
                {socialPlatforms.slice(0, 3).map((platform) => {
                  const PlatformIcon = platform.icon;
                  return (
                    <Button
                      key={platform.id}
                      size="sm"
                      className={platform.color}
                      onClick={() =>
                        window.open(
                          generateShareUrl(
                            platform.id,
                            link.description,
                            link.url,
                          ),
                          "_blank",
                        )
                      }
                    >
                      <PlatformIcon className="w-4 h-4 mr-1" />
                      Share
                    </Button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
          Custom Share Message
        </h4>
        <div className="space-y-3">
          <Textarea
            placeholder="Write your custom message..."
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            rows={3}
          />
          <div className="flex gap-2 flex-wrap">
            {socialPlatforms.map((platform) => {
              const PlatformIcon = platform.icon;
              return (
                <Button
                  key={platform.id}
                  size="sm"
                  variant="outline"
                  disabled={!customMessage.trim()}
                  onClick={() =>
                    window.open(
                      generateShareUrl(
                        platform.id,
                        customMessage,
                        "https://coinkrizy.com",
                      ),
                      "_blank",
                    )
                  }
                  className="flex items-center gap-1"
                >
                  <PlatformIcon className="w-4 h-4" />
                  {platform.name}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  const renderContentCreator = () => (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
          Content Templates
        </h4>
        <div className="space-y-3">
          {socialTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-medium text-gray-900 dark:text-white">
                  {template.title}
                </h5>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(template.content, template.id)
                    }
                  >
                    {copiedText === template.id ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCustomMessage(template.content)}
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded p-3 mb-3">
                <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans">
                  {template.content}
                </pre>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {template.platforms.map((platformId) => {
                    const platform = socialPlatforms.find(
                      (p) => p.id === platformId,
                    );
                    if (!platform) return null;
                    const PlatformIcon = platform.icon;
                    return (
                      <Badge
                        key={platformId}
                        variant="secondary"
                        className="text-xs"
                      >
                        <PlatformIcon className="w-3 h-3 mr-1" />
                        {platform.name}
                      </Badge>
                    );
                  })}
                </div>
                <span className="text-xs text-gray-500">
                  {template.content.length} characters
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
          Platform Guidelines
        </h4>
        <div className="grid gap-3">
          {socialPlatforms.map((platform) => {
            const PlatformIcon = platform.icon;
            return (
              <div
                key={platform.id}
                className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3"
              >
                <div className="flex items-center gap-2 mb-2">
                  <PlatformIcon className="w-5 h-5" />
                  <span className="font-medium text-gray-900 dark:text-white">
                    {platform.name}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {platform.maxChars} chars max
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {platform.tips}
                </p>
                <div className="flex gap-2">
                  <span className="text-xs text-gray-500">Best times:</span>
                  {platform.bestTimes.map((time) => (
                    <Badge key={time} variant="secondary" className="text-xs">
                      {time}
                    </Badge>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
          Share Performance
        </h4>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {mockAnalytics.totalShares.toLocaleString()}
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-400">
              Total Shares
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {mockAnalytics.totalClicks.toLocaleString()}
            </div>
            <div className="text-sm text-green-600 dark:text-green-400">
              Link Clicks
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {mockAnalytics.topPlatform}
            </div>
            <div className="text-sm text-purple-600 dark:text-purple-400">
              Top Platform
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {mockAnalytics.engagement}%
            </div>
            <div className="text-sm text-orange-600 dark:text-orange-400">
              Engagement Rate
            </div>
          </div>
        </div>
      </div>

      <div>
        <h5 className="font-medium text-gray-900 dark:text-white mb-3">
          Recent Share Activity
        </h5>
        <div className="space-y-2">
          {mockAnalytics.recentShares.map((share, index) => {
            const platform = socialPlatforms.find(
              (p) => p.id === share.platform.toLowerCase(),
            );
            const PlatformIcon = platform?.icon || Share2;

            return (
              <div
                key={index}
                className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-800 rounded"
              >
                <div className="flex items-center gap-3">
                  <PlatformIcon className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {share.platform}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {share.shares} shares
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {share.date}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <Button className="w-full" variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Full Analytics Report
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Share2 className="w-5 h-5" />
          Social Media Manager
        </h3>

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as any)}
        >
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="quick-share" className="text-xs">
              Quick Share
            </TabsTrigger>
            <TabsTrigger value="content-creator" className="text-xs">
              Content Creator
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs">
              Analytics
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 p-4">
        {activeTab === "quick-share" && renderQuickShare()}
        {activeTab === "content-creator" && renderContentCreator()}
        {activeTab === "analytics" && renderAnalytics()}
      </ScrollArea>
    </div>
  );
};
