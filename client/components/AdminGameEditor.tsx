import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Palette,
  Settings,
  Eye,
  Save,
  Undo,
  Redo,
  Download,
  Upload,
  Bot,
  MessageSquare,
  Lightbulb,
  Code,
  Gamepad2,
  Image,
  Sliders,
  Grid,
  Zap,
  RefreshCw,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";
import { useAuth } from "./AuthContext";
import {
  SocialCasinoGame,
  VisualGameEditor,
  AIEditorAssistant,
  AIMessage,
} from "@shared/socialCasinoTypes";

interface AdminGameEditorProps {
  gameId?: string;
  onSave?: (gameData: SocialCasinoGame) => void;
  className?: string;
}

export function AdminGameEditor({
  gameId,
  onSave,
  className = "",
}: AdminGameEditorProps) {
  const { user } = useAuth();
  const [editorState, setEditorState] = useState<VisualGameEditor>({
    id: `editor_${Date.now()}`,
    game_id: gameId || "new_game",
    editor_data: {
      symbols: [],
      paylines: [],
      reels: [],
      settings: {},
    },
    ai_suggestions: [],
    preview_mode: false,
    unsaved_changes: false,
    last_saved: new Date().toISOString(),
  });

  const [gameData, setGameData] = useState<Partial<SocialCasinoGame>>({
    name: "New Game",
    description: "A custom social casino game",
    provider: "CoinKrazy",
    category: "social_slots",
    game_type: "BOTH",
    min_bet_gc: 1,
    max_bet_gc: 1000,
    min_bet_sc: 0.01,
    max_bet_sc: 10,
    rtp: 95.0,
    volatility: "medium",
    max_win_gc: 100000,
    max_win_sc: 1000,
    paylines: 25,
    features: [],
    is_active: false,
    is_featured: false,
  });

  const [aiAssistant, setAiAssistant] = useState<AIEditorAssistant>({
    session_id: `ai_session_${Date.now()}`,
    admin_user_id: user?.id || "admin",
    conversation_history: [],
    suggestions_given: 0,
    code_generated: false,
    last_interaction: new Date().toISOString(),
  });

  const [activeTab, setActiveTab] = useState("basic");
  const [showAiChat, setShowAiChat] = useState(false);
  const [aiMessage, setAiMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Symbol configuration
  const [symbols, setSymbols] = useState([
    {
      id: "wild",
      name: "Wild",
      color: "#FFD700",
      value: 1000,
      rarity: "legendary",
    },
    {
      id: "scatter",
      name: "Scatter",
      color: "#FF6B6B",
      value: 500,
      rarity: "epic",
    },
    {
      id: "high1",
      name: "High Symbol 1",
      color: "#4ECDC4",
      value: 300,
      rarity: "rare",
    },
    {
      id: "high2",
      name: "High Symbol 2",
      color: "#45B7D1",
      value: 250,
      rarity: "rare",
    },
    {
      id: "med1",
      name: "Med Symbol 1",
      color: "#96CEB4",
      value: 150,
      rarity: "uncommon",
    },
    {
      id: "med2",
      name: "Med Symbol 2",
      color: "#FFEAA7",
      value: 100,
      rarity: "uncommon",
    },
    {
      id: "low1",
      name: "Low Symbol 1",
      color: "#DDA0DD",
      value: 75,
      rarity: "common",
    },
    {
      id: "low2",
      name: "Low Symbol 2",
      color: "#98D8C8",
      value: 50,
      rarity: "common",
    },
  ]);

  const [reelConfiguration, setReelConfiguration] = useState({
    reelCount: 5,
    rowCount: 3,
    symbolWeights: {} as Record<string, Record<string, number>>,
  });

  useEffect(() => {
    if (gameId) {
      loadGameData(gameId);
    }
    initializeSymbolWeights();
  }, [gameId]);

  const loadGameData = async (id: string) => {
    // TODO: Load actual game data from database
    console.log("Loading game data for:", id);
  };

  const initializeSymbolWeights = () => {
    const weights: Record<string, Record<string, number>> = {};
    for (let i = 0; i < reelConfiguration.reelCount; i++) {
      weights[`reel_${i}`] = {};
      symbols.forEach((symbol) => {
        weights[`reel_${i}`][symbol.id] =
          symbol.rarity === "legendary"
            ? 1
            : symbol.rarity === "epic"
              ? 2
              : symbol.rarity === "rare"
                ? 5
                : symbol.rarity === "uncommon"
                  ? 10
                  : 20;
      });
    }
    setReelConfiguration((prev) => ({ ...prev, symbolWeights: weights }));
  };

  const handleAiChat = async () => {
    if (!aiMessage.trim()) return;

    setIsGenerating(true);
    const userMessage: AIMessage = {
      role: "user",
      message: aiMessage,
      timestamp: new Date().toISOString(),
      game_id: gameData.id,
    };

    // Add user message to conversation
    setAiAssistant((prev) => ({
      ...prev,
      conversation_history: [...prev.conversation_history, userMessage],
    }));

    // Generate AI response
    const aiResponse = await generateAiResponse(aiMessage);
    const assistantMessage: AIMessage = {
      role: "assistant",
      message: aiResponse.message,
      timestamp: new Date().toISOString(),
      game_id: gameData.id,
      code_suggestion: aiResponse.code,
    };

    setAiAssistant((prev) => ({
      ...prev,
      conversation_history: [...prev.conversation_history, assistantMessage],
      suggestions_given: prev.suggestions_given + 1,
      code_generated: prev.code_generated || !!aiResponse.code,
      last_interaction: new Date().toISOString(),
    }));

    setEditorState((prev) => ({
      ...prev,
      ai_suggestions: [...prev.ai_suggestions, aiResponse.message],
    }));

    setAiMessage("");
    setIsGenerating(false);
  };

  const generateAiResponse = async (
    prompt: string,
  ): Promise<{ message: string; code?: string }> => {
    // Simulate AI response based on prompt
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 2000),
    );

    const lowerPrompt = prompt.toLowerCase();

    if (lowerPrompt.includes("symbol") || lowerPrompt.includes("icon")) {
      return {
        message:
          "I recommend using high-contrast symbols with clear visual hierarchy. Consider using a golden wild symbol as your highest value, followed by themed symbols that match your game's aesthetic. Would you like me to suggest specific color schemes or generate symbol configurations?",
        code: `const suggestedSymbols = [
  { id: 'wild', name: 'Golden Wild', color: '#FFD700', value: 1000, rarity: 'legendary' },
  { id: 'bonus', name: 'Bonus Symbol', color: '#FF4500', value: 500, rarity: 'epic' },
  { id: 'premium', name: 'Premium Symbol', color: '#8A2BE2', value: 300, rarity: 'rare' }
];`,
      };
    }

    if (lowerPrompt.includes("rtp") || lowerPrompt.includes("payout")) {
      return {
        message:
          "For social casino games, I recommend an RTP between 94-96%. Lower RTP (94-95%) creates more revenue but ensure player engagement remains high. Higher RTP (95-96%) increases player satisfaction. Consider your target audience and business model.",
      };
    }

    if (lowerPrompt.includes("payline") || lowerPrompt.includes("win")) {
      return {
        message:
          "Modern slots typically use 20-50 paylines for good balance. I suggest starting with 25 paylines - it's familiar to players and provides good win frequency. Would you like me to generate a balanced payline configuration?",
        code: `const paylineConfig = {
  totalLines: 25,
  winPatterns: ['left-to-right', 'scatter-pays'],
  minSymbols: 3,
  maxSymbols: 5
};`,
      };
    }

    if (lowerPrompt.includes("theme") || lowerPrompt.includes("design")) {
      return {
        message:
          "Choose a theme that resonates with your target audience. Popular themes include: Ancient civilizations (Egyptian, Greek), Fantasy (dragons, magic), Adventure (pirates, exploration), and Classic (fruits, bars). The theme should be consistent across symbols, background, and sound effects.",
      };
    }

    if (lowerPrompt.includes("bonus") || lowerPrompt.includes("feature")) {
      return {
        message:
          "Consider adding engaging bonus features like Free Spins (triggered by 3+ scatters), Wild multipliers (2x-5x), or Pick & Click bonus rounds. These increase player engagement and extend session time.",
        code: `const bonusFeatures = [
  { type: 'free_spins', trigger: 'scatter_3+', awards: '10-20 spins' },
  { type: 'wild_multiplier', multiplier: '2x-5x' },
  { type: 'pick_bonus', prizes: 'coin_wins_or_multipliers' }
];`,
      };
    }

    // Default response
    return {
      message:
        "I'm here to help you create an amazing social casino game! I can assist with symbol design, payline configuration, RTP optimization, bonus features, theme selection, and much more. What specific aspect would you like to work on?",
    };
  };

  const applyAiSuggestion = (suggestion: string) => {
    // Parse and apply AI suggestions to the game configuration
    setEditorState((prev) => ({ ...prev, unsaved_changes: true }));
  };

  const generateThumbnail = () => {
    const theme = gameData.name || "Custom Game";
    const colors = ["#FFD700", "#4ECDC4", "#FF6B6B"];

    // Generate SVG thumbnail
    const svg = `
      <svg width="400" height="300" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${colors[0]};stop-opacity:1" />
            <stop offset="50%" style="stop-color:${colors[1]};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${colors[2]};stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="400" height="300" fill="url(#bgGrad)"/>
        <text x="200" y="60" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="white" text-anchor="middle">${theme}</text>
        <text x="200" y="250" font-family="Arial, sans-serif" font-size="14" fill="white" text-anchor="middle">CoinKrazy.com</text>
        <circle cx="100" cy="150" r="25" fill="white" opacity="0.8"/>
        <circle cx="300" cy="120" r="20" fill="white" opacity="0.6"/>
        <polygon points="200,110 230,140 200,170 170,140" fill="white" opacity="0.7"/>
      </svg>
    `;

    return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
  };

  const saveGame = () => {
    const completeGameData: SocialCasinoGame = {
      id: gameData.id || `custom_${Date.now()}`,
      name: gameData.name || "New Game",
      provider: gameData.provider || "CoinKrazy",
      category: gameData.category || "social_slots",
      game_type: gameData.game_type || "BOTH",
      thumbnail: generateThumbnail(),
      description: gameData.description || "A custom social casino game",
      min_bet_gc: gameData.min_bet_gc || 1,
      max_bet_gc: gameData.max_bet_gc || 1000,
      min_bet_sc: gameData.min_bet_sc || 0.01,
      max_bet_sc: gameData.max_bet_sc || 10,
      rtp: gameData.rtp || 95.0,
      volatility: gameData.volatility || "medium",
      max_win_gc: gameData.max_win_gc || 100000,
      max_win_sc: gameData.max_win_sc || 1000,
      paylines: gameData.paylines || 25,
      features: gameData.features || [],
      is_active: gameData.is_active || false,
      is_featured: gameData.is_featured || false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      total_spins_today: 0,
      total_gc_earned_today: 0,
      total_sc_earned_today: 0,
      biggest_win_today: 0,
    };

    setEditorState((prev) => ({
      ...prev,
      unsaved_changes: false,
      last_saved: new Date().toISOString(),
    }));

    if (onSave) {
      onSave(completeGameData);
    }

    console.log("Saving game:", completeGameData);
  };

  const previewGame = () => {
    setEditorState((prev) => ({ ...prev, preview_mode: !prev.preview_mode }));
  };

  if (!user || user.role !== "admin") {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardContent className="p-6 text-center">
          <Settings className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Admin Access Required</h3>
          <p className="text-muted-foreground">
            This feature is only available to administrators.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Palette className="h-8 w-8 mr-3 text-gold" />
            Game Visual Editor
          </h1>
          <p className="text-muted-foreground mt-1">
            Create and customize social casino games with AI assistance
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={previewGame}>
            <Eye className="h-4 w-4 mr-2" />
            {editorState.preview_mode ? "Edit Mode" : "Preview"}
          </Button>
          <Button
            onClick={() => setShowAiChat(true)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Bot className="h-4 w-4 mr-2" />
            AI Assistant
          </Button>
          <Button onClick={saveGame} disabled={!editorState.unsaved_changes}>
            <Save className="h-4 w-4 mr-2" />
            Save Game
          </Button>
        </div>
      </div>

      {/* Main Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Game Configuration</CardTitle>
              <CardDescription>
                Configure your game settings, symbols, and mechanics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Basic</TabsTrigger>
                  <TabsTrigger value="symbols">Symbols</TabsTrigger>
                  <TabsTrigger value="reels">Reels</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>

                {/* Basic Settings */}
                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="game-name">Game Name</Label>
                      <Input
                        id="game-name"
                        value={gameData.name}
                        onChange={(e) =>
                          setGameData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="Enter game name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="provider">Provider</Label>
                      <Input
                        id="provider"
                        value={gameData.provider}
                        onChange={(e) =>
                          setGameData((prev) => ({
                            ...prev,
                            provider: e.target.value,
                          }))
                        }
                        placeholder="Game provider"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={gameData.description}
                      onChange={(e) =>
                        setGameData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Game description"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="rtp">RTP (%)</Label>
                      <div className="mt-2">
                        <Slider
                          value={[gameData.rtp || 95]}
                          onValueChange={([value]) =>
                            setGameData((prev) => ({ ...prev, rtp: value }))
                          }
                          min={85}
                          max={98}
                          step={0.1}
                        />
                        <div className="text-sm text-muted-foreground mt-1">
                          {(gameData.rtp || 95).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="volatility">Volatility</Label>
                      <select
                        className="w-full mt-2 p-2 border rounded"
                        value={gameData.volatility}
                        onChange={(e) =>
                          setGameData((prev) => ({
                            ...prev,
                            volatility: e.target.value as any,
                          }))
                        }
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="paylines">Paylines</Label>
                      <Input
                        id="paylines"
                        type="number"
                        value={gameData.paylines}
                        onChange={(e) =>
                          setGameData((prev) => ({
                            ...prev,
                            paylines: parseInt(e.target.value),
                          }))
                        }
                        min={1}
                        max={100}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="active"
                        checked={gameData.is_active}
                        onCheckedChange={(checked) =>
                          setGameData((prev) => ({
                            ...prev,
                            is_active: checked,
                          }))
                        }
                      />
                      <Label htmlFor="active">Active</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="featured"
                        checked={gameData.is_featured}
                        onCheckedChange={(checked) =>
                          setGameData((prev) => ({
                            ...prev,
                            is_featured: checked,
                          }))
                        }
                      />
                      <Label htmlFor="featured">Featured</Label>
                    </div>
                  </div>
                </TabsContent>

                {/* Symbol Configuration */}
                <TabsContent value="symbols" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      Symbol Configuration
                    </h3>
                    <Button size="sm">
                      <Zap className="h-4 w-4 mr-2" />
                      Add Symbol
                    </Button>
                  </div>

                  <div className="grid gap-4">
                    {symbols.map((symbol, index) => (
                      <Card key={symbol.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div
                              className="w-8 h-8 rounded"
                              style={{ backgroundColor: symbol.color }}
                            />
                            <div>
                              <div className="font-medium">{symbol.name}</div>
                              <div className="text-sm text-muted-foreground">
                                Value: {symbol.value} • {symbol.rarity}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Input
                              type="color"
                              value={symbol.color}
                              onChange={(e) => {
                                const newSymbols = [...symbols];
                                newSymbols[index].color = e.target.value;
                                setSymbols(newSymbols);
                              }}
                              className="w-12 h-8"
                            />
                            <Button variant="outline" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Reel Configuration */}
                <TabsContent value="reels" className="space-y-4">
                  <h3 className="text-lg font-semibold">Reel Configuration</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Reel Count</Label>
                      <Input
                        type="number"
                        value={reelConfiguration.reelCount}
                        onChange={(e) =>
                          setReelConfiguration((prev) => ({
                            ...prev,
                            reelCount: parseInt(e.target.value),
                          }))
                        }
                        min={3}
                        max={7}
                      />
                    </div>
                    <div>
                      <Label>Row Count</Label>
                      <Input
                        type="number"
                        value={reelConfiguration.rowCount}
                        onChange={(e) =>
                          setReelConfiguration((prev) => ({
                            ...prev,
                            rowCount: parseInt(e.target.value),
                          }))
                        }
                        min={1}
                        max={5}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {Array.from(
                      { length: reelConfiguration.reelCount },
                      (_, reelIndex) => (
                        <Card key={reelIndex} className="p-3">
                          <h4 className="font-medium mb-2">
                            Reel {reelIndex + 1}
                          </h4>
                          <div className="space-y-1">
                            {Array.from(
                              { length: reelConfiguration.rowCount },
                              (_, rowIndex) => (
                                <div
                                  key={rowIndex}
                                  className="w-full h-8 bg-muted rounded flex items-center justify-center text-xs"
                                >
                                  Pos {rowIndex + 1}
                                </div>
                              ),
                            )}
                          </div>
                        </Card>
                      ),
                    )}
                  </div>
                </TabsContent>

                {/* Advanced Settings */}
                <TabsContent value="advanced" className="space-y-4">
                  <h3 className="text-lg font-semibold">Advanced Settings</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Min Bet (GC)</Label>
                      <Input
                        type="number"
                        value={gameData.min_bet_gc}
                        onChange={(e) =>
                          setGameData((prev) => ({
                            ...prev,
                            min_bet_gc: parseInt(e.target.value),
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label>Max Bet (GC)</Label>
                      <Input
                        type="number"
                        value={gameData.max_bet_gc}
                        onChange={(e) =>
                          setGameData((prev) => ({
                            ...prev,
                            max_bet_gc: parseInt(e.target.value),
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label>Min Bet (SC)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={gameData.min_bet_sc}
                        onChange={(e) =>
                          setGameData((prev) => ({
                            ...prev,
                            min_bet_sc: parseFloat(e.target.value),
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label>Max Bet (SC)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={gameData.max_bet_sc}
                        onChange={(e) =>
                          setGameData((prev) => ({
                            ...prev,
                            max_bet_sc: parseFloat(e.target.value),
                          }))
                        }
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Preview Panel */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="h-5 w-5 mr-2" />
                Game Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 rounded-lg mb-4 flex items-center justify-center">
                <div className="text-center">
                  <Gamepad2 className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Game Preview</p>
                  <p className="text-xs text-muted-foreground">
                    {gameData.name}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>RTP:</span>
                  <span>{(gameData.rtp || 95).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Volatility:</span>
                  <span className="capitalize">{gameData.volatility}</span>
                </div>
                <div className="flex justify-between">
                  <span>Paylines:</span>
                  <span>{gameData.paylines}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <Badge variant={gameData.is_active ? "default" : "secondary"}>
                    {gameData.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>

              <Button className="w-full mt-4" onClick={previewGame}>
                <Play className="h-4 w-4 mr-2" />
                Test Game
              </Button>
            </CardContent>
          </Card>

          {/* AI Suggestions */}
          {editorState.ai_suggestions.length > 0 && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="flex items-center text-purple-600">
                  <Lightbulb className="h-5 w-5 mr-2" />
                  AI Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {editorState.ai_suggestions
                    .slice(-3)
                    .map((suggestion, index) => (
                      <div
                        key={index}
                        className="p-3 bg-purple-50 rounded border-l-4 border-purple-500"
                      >
                        <p className="text-sm">{suggestion}</p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-2"
                          onClick={() => applyAiSuggestion(suggestion)}
                        >
                          Apply
                        </Button>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* AI Chat Modal */}
      <Dialog open={showAiChat} onOpenChange={setShowAiChat}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Bot className="h-6 w-6 mr-2 text-purple-600" />
              AI Game Design Assistant
            </DialogTitle>
            <DialogDescription>
              Get expert advice on game design, mechanics, and optimization
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col h-96">
            <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-muted/20 rounded">
              {aiAssistant.conversation_history.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-purple-100 text-purple-900"
                    }`}
                  >
                    <p className="text-sm">{message.message}</p>
                    {message.code_suggestion && (
                      <pre className="mt-2 p-2 bg-black/10 rounded text-xs overflow-x-auto">
                        <code>{message.code_suggestion}</code>
                      </pre>
                    )}
                  </div>
                </div>
              ))}
              {isGenerating && (
                <div className="flex justify-start">
                  <div className="bg-purple-100 text-purple-900 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span className="text-sm">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-2 mt-4">
              <Input
                value={aiMessage}
                onChange={(e) => setAiMessage(e.target.value)}
                placeholder="Ask about game design, symbols, RTP, features..."
                onKeyPress={(e) => e.key === "Enter" && handleAiChat()}
                disabled={isGenerating}
              />
              <Button
                onClick={handleAiChat}
                disabled={isGenerating || !aiMessage.trim()}
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
