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
import { Switch } from "../components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Slider } from "../components/ui/slider";
import { useAuth } from "../components/AuthContext";
import { AccessDeniedModal } from "../components/AccessDeniedModal";
import {
  Settings,
  Bell,
  Shield,
  Gamepad2,
  Volume2,
  Eye,
  MessageSquare,
  DollarSign,
  Moon,
  Sun,
  Smartphone,
  Mail,
  Lock,
  User,
  Bot,
  Crown,
  Palette,
  Monitor,
  Globe,
  Target,
  Clock,
  AlertTriangle,
  CheckCircle,
  Save,
} from "lucide-react";

interface UserSettings {
  // Theme & Display
  theme: "light" | "dark" | "system";
  language: string;
  timezone: string;
  animations: boolean;
  reducedMotion: boolean;

  // Notifications
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  bonusNotifications: boolean;
  gameNotifications: boolean;
  sportsbookNotifications: boolean;

  // Gaming Preferences
  autoPlay: boolean;
  quickSpin: boolean;
  soundEffects: boolean;
  backgroundMusic: boolean;
  volumeLevel: number;
  vibration: boolean;

  // Privacy & Security
  profileVisibility: "public" | "friends" | "private";
  onlineStatus: boolean;
  dataCollection: boolean;
  thirdPartyIntegration: boolean;

  // Communication
  chatEnabled: boolean;
  friendRequests: boolean;
  directMessages: boolean;
  groupInvites: boolean;

  // Responsible Gaming
  sessionTimeLimit: number;
  dailyDepositLimit: number;
  lossLimit: number;
  realityChecks: boolean;
  cooloffPeriod: number;

  // AI Assistants
  luckyAIEnabled: boolean;
  luckyAIPersonality: "professional" | "friendly" | "casual";
  joseyAIEnabled: boolean;
  joseyAISocialFeatures: boolean;
}

export function AccountSettings() {
  const { user } = useAuth();
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const [settings, setSettings] = useState<UserSettings>({
    theme: "dark",
    language: "en",
    timezone: "America/New_York",
    animations: true,
    reducedMotion: false,
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    marketingEmails: false,
    bonusNotifications: true,
    gameNotifications: true,
    sportsbookNotifications: true,
    autoPlay: false,
    quickSpin: true,
    soundEffects: true,
    backgroundMusic: false,
    volumeLevel: 70,
    vibration: true,
    profileVisibility: "public",
    onlineStatus: true,
    dataCollection: true,
    thirdPartyIntegration: false,
    chatEnabled: true,
    friendRequests: true,
    directMessages: true,
    groupInvites: true,
    sessionTimeLimit: 240,
    dailyDepositLimit: 500,
    lossLimit: 200,
    realityChecks: true,
    cooloffPeriod: 0,
    luckyAIEnabled: true,
    luckyAIPersonality: "friendly",
    joseyAIEnabled: true,
    joseyAISocialFeatures: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");

  useEffect(() => {
    if (!user) {
      setShowAccessDenied(true);
      return;
    }

    fetchUserSettings();
  }, [user]);

  const fetchUserSettings = async () => {
    if (!user) return;

    try {
      const response = await fetch(`/api/users/${user.id}/settings`);
      if (response.ok) {
        const userSettings = await response.json();
        setSettings((prev) => ({ ...prev, ...userSettings }));
      }
    } catch (error) {
      console.error("Error fetching user settings:", error);
    }
  };

  const saveSettings = async () => {
    if (!user) return;

    setIsLoading(true);
    setSaveStatus("saving");

    try {
      const response = await fetch(`/api/users/${user.id}/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } else {
        setSaveStatus("error");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      setSaveStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = (key: keyof UserSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  if (!user) {
    return (
      <AccessDeniedModal
        isOpen={showAccessDenied}
        onClose={() => setShowAccessDenied(false)}
        feature="Account Settings"
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Account Settings ⚙️
            </h1>
            <p className="text-purple-200">
              Customize your CoinKrazy experience
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={saveSettings}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {saveStatus === "saving" ? (
                <>Saving...</>
              ) : saveStatus === "saved" ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Saved
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </>
              )}
            </Button>
            {user.role === "admin" && (
              <Button
                onClick={() => (window.location.href = "/admin")}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Crown className="w-4 h-4 mr-2" />
                Admin Panel
              </Button>
            )}
            {(user.role === "admin" || user.role === "staff") && (
              <Button
                onClick={() => (window.location.href = "/staff")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Shield className="w-4 h-4 mr-2" />
                Staff Panel
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="display" className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="display">Display</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="gaming">Gaming</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
            <TabsTrigger value="responsible">Responsible</TabsTrigger>
            <TabsTrigger value="ai">AI Assistants</TabsTrigger>
          </TabsList>

          <TabsContent value="display" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Theme & Display Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-white mb-3 block">Theme</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <Button
                      variant={
                        settings.theme === "light" ? "default" : "outline"
                      }
                      onClick={() => updateSetting("theme", "light")}
                      className="flex items-center gap-2"
                    >
                      <Sun className="w-4 h-4" />
                      Light
                    </Button>
                    <Button
                      variant={
                        settings.theme === "dark" ? "default" : "outline"
                      }
                      onClick={() => updateSetting("theme", "dark")}
                      className="flex items-center gap-2"
                    >
                      <Moon className="w-4 h-4" />
                      Dark
                    </Button>
                    <Button
                      variant={
                        settings.theme === "system" ? "default" : "outline"
                      }
                      onClick={() => updateSetting("theme", "system")}
                      className="flex items-center gap-2"
                    >
                      <Monitor className="w-4 h-4" />
                      System
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-white">Language</Label>
                    <Select
                      value={settings.language}
                      onValueChange={(value) =>
                        updateSetting("language", value)
                      }
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                        <SelectItem value="it">Italiano</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white">Timezone</Label>
                    <Select
                      value={settings.timezone}
                      onValueChange={(value) =>
                        updateSetting("timezone", value)
                      }
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">
                          Eastern Time
                        </SelectItem>
                        <SelectItem value="America/Chicago">
                          Central Time
                        </SelectItem>
                        <SelectItem value="America/Denver">
                          Mountain Time
                        </SelectItem>
                        <SelectItem value="America/Los_Angeles">
                          Pacific Time
                        </SelectItem>
                        <SelectItem value="Europe/London">London</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Animations</Label>
                      <p className="text-sm text-gray-400">
                        Enable smooth transitions and animations
                      </p>
                    </div>
                    <Switch
                      checked={settings.animations}
                      onCheckedChange={(checked) =>
                        updateSetting("animations", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Reduced Motion</Label>
                      <p className="text-sm text-gray-400">
                        Minimize motion effects for accessibility
                      </p>
                    </div>
                    <Switch
                      checked={settings.reducedMotion}
                      onCheckedChange={(checked) =>
                        updateSetting("reducedMotion", checked)
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-white font-medium">
                      General Notifications
                    </h3>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-blue-400" />
                        <div>
                          <Label className="text-white">
                            Email Notifications
                          </Label>
                          <p className="text-xs text-gray-400">
                            Account updates and security alerts
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.emailNotifications}
                        onCheckedChange={(checked) =>
                          updateSetting("emailNotifications", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-green-400" />
                        <div>
                          <Label className="text-white">
                            SMS Notifications
                          </Label>
                          <p className="text-xs text-gray-400">
                            Text messages for important updates
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.smsNotifications}
                        onCheckedChange={(checked) =>
                          updateSetting("smsNotifications", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-purple-400" />
                        <div>
                          <Label className="text-white">
                            Push Notifications
                          </Label>
                          <p className="text-xs text-gray-400">
                            Browser and mobile push alerts
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.pushNotifications}
                        onCheckedChange={(checked) =>
                          updateSetting("pushNotifications", checked)
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-white font-medium">
                      Gaming Notifications
                    </h3>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">
                          Bonus Notifications
                        </Label>
                        <p className="text-xs text-gray-400">
                          Daily bonuses and promotions
                        </p>
                      </div>
                      <Switch
                        checked={settings.bonusNotifications}
                        onCheckedChange={(checked) =>
                          updateSetting("bonusNotifications", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Game Notifications</Label>
                        <p className="text-xs text-gray-400">
                          Big wins and jackpots
                        </p>
                      </div>
                      <Switch
                        checked={settings.gameNotifications}
                        onCheckedChange={(checked) =>
                          updateSetting("gameNotifications", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Sportsbook Alerts</Label>
                        <p className="text-xs text-gray-400">
                          Bet results and live scores
                        </p>
                      </div>
                      <Switch
                        checked={settings.sportsbookNotifications}
                        onCheckedChange={(checked) =>
                          updateSetting("sportsbookNotifications", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Marketing Emails</Label>
                        <p className="text-xs text-gray-400">
                          Promotional offers and newsletters
                        </p>
                      </div>
                      <Switch
                        checked={settings.marketingEmails}
                        onCheckedChange={(checked) =>
                          updateSetting("marketingEmails", checked)
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gaming" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Gamepad2 className="w-5 h-5" />
                  Gaming Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-white font-medium">
                      Gameplay Settings
                    </h3>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Auto Play</Label>
                        <p className="text-xs text-gray-400">
                          Enable automatic spins
                        </p>
                      </div>
                      <Switch
                        checked={settings.autoPlay}
                        onCheckedChange={(checked) =>
                          updateSetting("autoPlay", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Quick Spin</Label>
                        <p className="text-xs text-gray-400">
                          Faster slot animations
                        </p>
                      </div>
                      <Switch
                        checked={settings.quickSpin}
                        onCheckedChange={(checked) =>
                          updateSetting("quickSpin", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Vibration</Label>
                        <p className="text-xs text-gray-400">
                          Haptic feedback on mobile
                        </p>
                      </div>
                      <Switch
                        checked={settings.vibration}
                        onCheckedChange={(checked) =>
                          updateSetting("vibration", checked)
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-white font-medium">Audio Settings</h3>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Sound Effects</Label>
                        <p className="text-xs text-gray-400">
                          Game sounds and alerts
                        </p>
                      </div>
                      <Switch
                        checked={settings.soundEffects}
                        onCheckedChange={(checked) =>
                          updateSetting("soundEffects", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Background Music</Label>
                        <p className="text-xs text-gray-400">
                          Ambient casino music
                        </p>
                      </div>
                      <Switch
                        checked={settings.backgroundMusic}
                        onCheckedChange={(checked) =>
                          updateSetting("backgroundMusic", checked)
                        }
                      />
                    </div>

                    <div>
                      <Label className="text-white">Volume Level</Label>
                      <div className="mt-2 px-3">
                        <Slider
                          value={[settings.volumeLevel]}
                          onValueChange={(value) =>
                            updateSetting("volumeLevel", value[0])
                          }
                          max={100}
                          step={5}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                          <span>0</span>
                          <span>{settings.volumeLevel}%</span>
                          <span>100</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Privacy & Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-white font-medium">Profile Privacy</h3>

                    <div>
                      <Label className="text-white">Profile Visibility</Label>
                      <Select
                        value={settings.profileVisibility}
                        onValueChange={(value) =>
                          updateSetting("profileVisibility", value as any)
                        }
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">
                            Public - Anyone can view
                          </SelectItem>
                          <SelectItem value="friends">Friends Only</SelectItem>
                          <SelectItem value="private">
                            Private - Hidden
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Show Online Status</Label>
                        <p className="text-xs text-gray-400">
                          Let others see when you're online
                        </p>
                      </div>
                      <Switch
                        checked={settings.onlineStatus}
                        onCheckedChange={(checked) =>
                          updateSetting("onlineStatus", checked)
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-white font-medium">Data & Analytics</h3>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">
                          Analytics Collection
                        </Label>
                        <p className="text-xs text-gray-400">
                          Help improve our platform
                        </p>
                      </div>
                      <Switch
                        checked={settings.dataCollection}
                        onCheckedChange={(checked) =>
                          updateSetting("dataCollection", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">
                          Third-party Integration
                        </Label>
                        <p className="text-xs text-gray-400">
                          Connect with external services
                        </p>
                      </div>
                      <Switch
                        checked={settings.thirdPartyIntegration}
                        onCheckedChange={(checked) =>
                          updateSetting("thirdPartyIntegration", checked)
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="communication" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Communication Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Chat Enabled</Label>
                      <p className="text-xs text-gray-400">
                        Participate in global and game chats
                      </p>
                    </div>
                    <Switch
                      checked={settings.chatEnabled}
                      onCheckedChange={(checked) =>
                        updateSetting("chatEnabled", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Friend Requests</Label>
                      <p className="text-xs text-gray-400">
                        Allow others to send friend requests
                      </p>
                    </div>
                    <Switch
                      checked={settings.friendRequests}
                      onCheckedChange={(checked) =>
                        updateSetting("friendRequests", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Direct Messages</Label>
                      <p className="text-xs text-gray-400">
                        Receive private messages from other players
                      </p>
                    </div>
                    <Switch
                      checked={settings.directMessages}
                      onCheckedChange={(checked) =>
                        updateSetting("directMessages", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Group Invites</Label>
                      <p className="text-xs text-gray-400">
                        Accept invitations to tournaments and events
                      </p>
                    </div>
                    <Switch
                      checked={settings.groupInvites}
                      onCheckedChange={(checked) =>
                        updateSetting("groupInvites", checked)
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="responsible" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Responsible Gaming Limits
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-4 mb-6">
                  <p className="text-yellow-100 text-sm">
                    Set limits to help maintain healthy gaming habits. These
                    limits will be enforced across all games and cannot be
                    increased for 24 hours after setting.
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label className="text-white">
                      Session Time Limit (minutes)
                    </Label>
                    <div className="mt-2 px-3">
                      <Slider
                        value={[settings.sessionTimeLimit]}
                        onValueChange={(value) =>
                          updateSetting("sessionTimeLimit", value[0])
                        }
                        max={480}
                        min={30}
                        step={30}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>30 min</span>
                        <span>{settings.sessionTimeLimit} minutes</span>
                        <span>8 hours</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-white">
                      Daily Deposit Limit (USD)
                    </Label>
                    <div className="mt-2 px-3">
                      <Slider
                        value={[settings.dailyDepositLimit]}
                        onValueChange={(value) =>
                          updateSetting("dailyDepositLimit", value[0])
                        }
                        max={1000}
                        min={50}
                        step={50}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>$50</span>
                        <span>${settings.dailyDepositLimit}</span>
                        <span>$1,000</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-white">Daily Loss Limit (USD)</Label>
                    <div className="mt-2 px-3">
                      <Slider
                        value={[settings.lossLimit]}
                        onValueChange={(value) =>
                          updateSetting("lossLimit", value[0])
                        }
                        max={500}
                        min={20}
                        step={20}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>$20</span>
                        <span>${settings.lossLimit}</span>
                        <span>$500</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Reality Checks</Label>
                      <p className="text-xs text-gray-400">
                        Periodic reminders about time and spending
                      </p>
                    </div>
                    <Switch
                      checked={settings.realityChecks}
                      onCheckedChange={(checked) =>
                        updateSetting("realityChecks", checked)
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Bot className="w-5 h-5 text-blue-400" />
                    LuckyAI Casino Assistant
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Enable LuckyAI</Label>
                      <p className="text-xs text-gray-400">
                        Your personal casino guide and helper
                      </p>
                    </div>
                    <Switch
                      checked={settings.luckyAIEnabled}
                      onCheckedChange={(checked) =>
                        updateSetting("luckyAIEnabled", checked)
                      }
                    />
                  </div>

                  <div>
                    <Label className="text-white">AI Personality</Label>
                    <Select
                      value={settings.luckyAIPersonality}
                      onValueChange={(value) =>
                        updateSetting("luckyAIPersonality", value as any)
                      }
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">
                          Professional - Formal and informative
                        </SelectItem>
                        <SelectItem value="friendly">
                          Friendly - Warm and encouraging
                        </SelectItem>
                        <SelectItem value="casual">
                          Casual - Fun and relaxed
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="bg-blue-900 border border-blue-700 rounded-lg p-3">
                    <p className="text-blue-100 text-sm">
                      LuckyAI helps with game strategies, bonus information, and
                      KYC guidance.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Bot className="w-5 h-5 text-pink-400" />
                    JoseyAI Social Assistant
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Enable JoseyAI</Label>
                      <p className="text-xs text-gray-400">
                        Social media content creator
                      </p>
                    </div>
                    <Switch
                      checked={settings.joseyAIEnabled}
                      onCheckedChange={(checked) =>
                        updateSetting("joseyAIEnabled", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Social Features</Label>
                      <p className="text-xs text-gray-400">
                        Video ads and social content creation
                      </p>
                    </div>
                    <Switch
                      checked={settings.joseyAISocialFeatures}
                      onCheckedChange={(checked) =>
                        updateSetting("joseyAISocialFeatures", checked)
                      }
                    />
                  </div>

                  <div className="bg-pink-900 border border-pink-700 rounded-lg p-3">
                    <p className="text-pink-100 text-sm">
                      JoseyAI creates personalized video ads and helps share
                      your wins!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <AccessDeniedModal
          isOpen={showAccessDenied}
          onClose={() => setShowAccessDenied(false)}
          feature="Account Settings"
        />
      </div>
    </div>
  );
}
