import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { 
  Save, 
  Play, 
  Eye, 
  Settings, 
  Palette, 
  Grid, 
  Zap, 
  Upload, 
  Download,
  Plus,
  Trash2,
  Copy,
  Edit,
  Image as ImageIcon,
  FileCode,
  TestTube,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Crown,
  Sparkles
} from "lucide-react";
import { SlotMachine as SlotMachineType, SlotSymbol, SlotReel, SlotPayline, SlotWinCondition, VisualEditorState } from "@shared/slotTypes";
import { JoseyAI } from "./JoseyAI";
import { SlotMachine } from "./SlotMachine";

interface VisualSlotEditorProps {
  initialSlot?: SlotMachineType;
  onSave: (slot: SlotMachineType) => Promise<void>;
  onPreview: (slot: SlotMachineType) => void;
}

export function VisualSlotEditor({ initialSlot, onSave, onPreview }: VisualSlotEditorProps) {
  const [slot, setSlot] = useState<SlotMachineType>(
    initialSlot || createDefaultSlot()
  );
  const [editorState, setEditorState] = useState<VisualEditorState>({
    selectedSlot: slot.id,
    editMode: 'settings',
    unsavedChanges: false,
    previewMode: false
  });
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [selectedReel, setSelectedReel] = useState<number>(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  function createDefaultSlot(): SlotMachineType {
    const defaultSymbols: SlotSymbol[] = [
      {
        id: 'wild',
        name: 'CoinKrazy Wild',
        image: '/symbols/wild.png',
        value: 1000,
        rarity: 'legendary',
        multiplier: 2,
        color: '#FFD700',
        animation: 'sparkle'
      },
      {
        id: 'scatter',
        name: 'Scatter',
        image: '/symbols/scatter.png',
        value: 500,
        rarity: 'epic',
        multiplier: 1,
        color: '#FF6B6B',
        animation: 'glow'
      },
      {
        id: 'seven',
        name: 'Lucky 7',
        image: '/symbols/seven.png',
        value: 250,
        rarity: 'rare',
        multiplier: 1,
        color: '#4ECDC4'
      },
      {
        id: 'bar',
        name: 'Bar',
        image: '/symbols/bar.png',
        value: 100,
        rarity: 'uncommon',
        multiplier: 1,
        color: '#45B7D1'
      },
      {
        id: 'cherry',
        name: 'Cherry',
        image: '/symbols/cherry.png',
        value: 50,
        rarity: 'common',
        multiplier: 1,
        color: '#FFA07A'
      }
    ];

    const defaultReels: SlotReel[] = Array.from({ length: 5 }, (_, i) => ({
      id: `reel_${i}`,
      position: i,
      symbols: ['wild', 'scatter', 'seven', 'bar', 'cherry'],
      weight: {
        'wild': 1,
        'scatter': 2,
        'seven': 5,
        'bar': 15,
        'cherry': 25
      }
    }));

    const defaultPaylines: SlotPayline[] = [
      {
        id: 'line_1',
        name: 'Center Line',
        positions: [
          { reel: 0, row: 1 }, { reel: 1, row: 1 }, { reel: 2, row: 1 }, 
          { reel: 3, row: 1 }, { reel: 4, row: 1 }
        ],
        active: true
      },
      {
        id: 'line_2', 
        name: 'Top Line',
        positions: [
          { reel: 0, row: 0 }, { reel: 1, row: 0 }, { reel: 2, row: 0 },
          { reel: 3, row: 0 }, { reel: 4, row: 0 }
        ],
        active: true
      },
      {
        id: 'line_3',
        name: 'Bottom Line', 
        positions: [
          { reel: 0, row: 2 }, { reel: 1, row: 2 }, { reel: 2, row: 2 },
          { reel: 3, row: 2 }, { reel: 4, row: 2 }
        ],
        active: true
      }
    ];

    return {
      id: `slot_${Date.now()}`,
      name: 'New CoinKrazy Slot',
      description: 'A custom slot machine powered by CoinKrazy',
      theme: 'Classic',
      provider: 'CoinKrazy',
      thumbnail: '/thumbnails/default-slot.png',
      backgroundImage: '/backgrounds/default-bg.jpg',
      reels: defaultReels,
      rows: 3,
      paylines: defaultPaylines,
      symbols: defaultSymbols,
      winConditions: [
        {
          id: 'wild_5',
          symbolId: 'wild',
          count: 5,
          payout: 1000,
          paylineRequired: true
        },
        {
          id: 'seven_5',
          symbolId: 'seven', 
          count: 5,
          payout: 250,
          paylineRequired: true
        }
      ],
      rtp: 95.5,
      volatility: 'medium',
      minBet: 0.01,
      maxBet: 100,
      bonusFeatures: [],
      soundEffects: {
        spinSound: '/sounds/spin.mp3',
        winSound: '/sounds/win.mp3',
        bonusSound: '/sounds/bonus.mp3',
        backgroundMusic: '/sounds/background.mp3',
        volume: 0.7
      },
      animations: {
        spinDuration: 2000,
        reelDelay: 200,
        winAnimationDuration: 1500,
        symbolAnimations: {}
      },
      created: new Date(),
      updated: new Date(),
      active: true,
      featured: false
    };
  }

  const updateSlot = (updates: Partial<SlotMachineType>) => {
    setSlot(prev => ({ ...prev, ...updates, updated: new Date() }));
    setEditorState(prev => ({ ...prev, unsavedChanges: true }));
  };

  const addSymbol = () => {
    const newSymbol: SlotSymbol = {
      id: `symbol_${Date.now()}`,
      name: 'New Symbol',
      image: '',
      value: 10,
      rarity: 'common',
      multiplier: 1,
      color: '#FFFFFF'
    };

    updateSlot({
      symbols: [...slot.symbols, newSymbol]
    });
    setSelectedSymbol(newSymbol.id);
  };

  const updateSymbol = (symbolId: string, updates: Partial<SlotSymbol>) => {
    updateSlot({
      symbols: slot.symbols.map(symbol => 
        symbol.id === symbolId ? { ...symbol, ...updates } : symbol
      )
    });
  };

  const deleteSymbol = (symbolId: string) => {
    updateSlot({
      symbols: slot.symbols.filter(symbol => symbol.id !== symbolId)
    });
    if (selectedSymbol === symbolId) {
      setSelectedSymbol(null);
    }
  };

  const addReel = () => {
    const newReel: SlotReel = {
      id: `reel_${slot.reels.length}`,
      position: slot.reels.length,
      symbols: slot.symbols.map(s => s.id),
      weight: slot.symbols.reduce((acc, symbol) => {
        acc[symbol.id] = 10;
        return acc;
      }, {} as Record<string, number>)
    };

    updateSlot({
      reels: [...slot.reels, newReel]
    });
  };

  const updateReelWeight = (reelIndex: number, symbolId: string, weight: number) => {
    const updatedReels = [...slot.reels];
    updatedReels[reelIndex].weight[symbolId] = weight;
    updateSlot({ reels: updatedReels });
  };

  const validateSlot = (): string[] => {
    const errors: string[] = [];

    if (!slot.name.trim()) errors.push('Slot name is required');
    if (slot.symbols.length < 3) errors.push('At least 3 symbols are required');
    if (slot.reels.length < 3) errors.push('At least 3 reels are required');
    if (slot.paylines.length === 0) errors.push('At least 1 payline is required');
    if (slot.minBet <= 0) errors.push('Minimum bet must be greater than 0');
    if (slot.maxBet <= slot.minBet) errors.push('Maximum bet must be greater than minimum bet');
    if (slot.rtp < 85 || slot.rtp > 98) errors.push('RTP should be between 85% and 98%');

    return errors;
  };

  const handleSave = async () => {
    const errors = validateSlot();
    setValidationErrors(errors);

    if (errors.length > 0) return;

    setIsSaving(true);
    try {
      await onSave(slot);
      setEditorState(prev => ({ ...prev, unsavedChanges: false }));
    } catch (error) {
      console.error('Failed to save slot:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    const errors = validateSlot();
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }
    setShowPreview(true);
    onPreview(slot);
  };

  const handleImageUpload = (file: File, symbolId: string) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      updateSymbol(symbolId, { image: imageUrl });
    };
    reader.readAsDataURL(file);
  };

  const exportSlotConfig = () => {
    const dataStr = JSON.stringify(slot, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${slot.name.replace(/\s+/g, '_')}_config.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleJoseyAISuggestion = (suggestion: string) => {
    // Apply JoseyAI suggestions to the slot configuration
    const lowerSuggestion = suggestion.toLowerCase();
    
    if (lowerSuggestion.includes('add symbol')) {
      addSymbol();
    } else if (lowerSuggestion.includes('video game')) {
      updateSlot({
        theme: 'Video Game Adventure',
        name: 'CoinKrazy Gaming Quest',
        description: 'Epic retro gaming adventure with power-up symbols!'
      });
    } else if (lowerSuggestion.includes('crypto')) {
      updateSlot({
        theme: 'Crypto Fortune',
        name: 'CoinKrazy Digital Gold',
        description: 'Mine your way to digital riches!'
      });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <Card className="border-gold/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center">
                <Crown className="h-6 w-6 mr-2 text-gold" />
                Visual Slot Editor
                <Badge variant="outline" className="ml-2 border-gold/50 text-gold">
                  CoinKrazy Studio
                </Badge>
              </CardTitle>
              <CardDescription>
                Create and customize your in-house slot machines with advanced tools
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              {editorState.unsavedChanges && (
                <Badge variant="destructive" className="animate-pulse">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Unsaved Changes
                </Badge>
              )}
              <Button onClick={handlePreview} variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button onClick={exportSlotConfig} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Slot
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs value={editorState.editMode} onValueChange={(mode) => 
            setEditorState(prev => ({ ...prev, editMode: mode as any }))
          }>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="settings">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
              <TabsTrigger value="symbols">
                <Sparkles className="h-4 w-4 mr-2" />
                Symbols
              </TabsTrigger>
              <TabsTrigger value="reels">
                <Grid className="h-4 w-4 mr-2" />
                Reels
              </TabsTrigger>
              <TabsTrigger value="paylines">
                <Zap className="h-4 w-4 mr-2" />
                Paylines
              </TabsTrigger>
              <TabsTrigger value="preview">
                <Play className="h-4 w-4 mr-2" />
                Test
              </TabsTrigger>
            </TabsList>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Slot Name</Label>
                      <Input
                        id="name"
                        value={slot.name}
                        onChange={(e) => updateSlot({ name: e.target.value })}
                        placeholder="Enter slot name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="theme">Theme</Label>
                      <Select value={slot.theme} onValueChange={(theme) => updateSlot({ theme })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Classic">Classic</SelectItem>
                          <SelectItem value="Video Game Adventure">Video Game Adventure</SelectItem>
                          <SelectItem value="Crypto Fortune">Crypto Fortune</SelectItem>
                          <SelectItem value="Space Odyssey">Space Odyssey</SelectItem>
                          <SelectItem value="Wild West Gold">Wild West Gold</SelectItem>
                          <SelectItem value="Mystic Magic">Mystic Magic</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={slot.description}
                      onChange={(e) => updateSlot({ description: e.target.value })}
                      placeholder="Describe your slot machine"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="rows">Rows</Label>
                      <Input
                        id="rows"
                        type="number"
                        value={slot.rows}
                        onChange={(e) => updateSlot({ rows: parseInt(e.target.value) })}
                        min="3"
                        max="5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="minBet">Min Bet ($)</Label>
                      <Input
                        id="minBet"
                        type="number"
                        step="0.01"
                        value={slot.minBet}
                        onChange={(e) => updateSlot({ minBet: parseFloat(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxBet">Max Bet ($)</Label>
                      <Input
                        id="maxBet"
                        type="number"
                        step="0.01"
                        value={slot.maxBet}
                        onChange={(e) => updateSlot({ maxBet: parseFloat(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="rtp">RTP (%)</Label>
                      <Slider
                        value={[slot.rtp]}
                        onValueChange={(value) => updateSlot({ rtp: value[0] })}
                        min={85}
                        max={98}
                        step={0.1}
                        className="mt-2"
                      />
                      <div className="text-sm text-muted-foreground mt-1">
                        Current: {slot.rtp}%
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="volatility">Volatility</Label>
                      <Select value={slot.volatility} onValueChange={(volatility: any) => updateSlot({ volatility })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={slot.active}
                        onCheckedChange={(active) => updateSlot({ active })}
                      />
                      <Label>Active</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={slot.featured}
                        onCheckedChange={(featured) => updateSlot({ featured })}
                      />
                      <Label>Featured</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Symbols Tab */}
            <TabsContent value="symbols" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Symbol Library</CardTitle>
                    <Button onClick={addSymbol}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Symbol
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {slot.symbols.map((symbol) => (
                      <Card 
                        key={symbol.id} 
                        className={`cursor-pointer transition-all ${
                          selectedSymbol === symbol.id ? 'ring-2 ring-gold' : ''
                        }`}
                        onClick={() => setSelectedSymbol(symbol.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-12 h-12 rounded border-2 flex items-center justify-center"
                              style={{ backgroundColor: symbol.color, borderColor: symbol.color }}
                            >
                              {symbol.image ? (
                                <img src={symbol.image} alt={symbol.name} className="w-8 h-8" />
                              ) : (
                                <span className="text-white font-bold">{symbol.name[0]}</span>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold">{symbol.name}</div>
                              <div className="text-sm text-muted-foreground">
                                Value: {symbol.value}x • {symbol.rarity}
                              </div>
                            </div>
                            <div className="flex space-x-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedSymbol(symbol.id);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteSymbol(symbol.id);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Symbol Editor */}
                  {selectedSymbol && (
                    <Card className="mt-6">
                      <CardHeader>
                        <CardTitle>Edit Symbol</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {(() => {
                          const symbol = slot.symbols.find(s => s.id === selectedSymbol);
                          if (!symbol) return null;

                          return (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Symbol Name</Label>
                                  <Input
                                    value={symbol.name}
                                    onChange={(e) => updateSymbol(symbol.id, { name: e.target.value })}
                                  />
                                </div>
                                <div>
                                  <Label>Value Multiplier</Label>
                                  <Input
                                    type="number"
                                    value={symbol.value}
                                    onChange={(e) => updateSymbol(symbol.id, { value: parseInt(e.target.value) })}
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Rarity</Label>
                                  <Select 
                                    value={symbol.rarity} 
                                    onValueChange={(rarity: any) => updateSymbol(symbol.id, { rarity })}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="common">Common</SelectItem>
                                      <SelectItem value="uncommon">Uncommon</SelectItem>
                                      <SelectItem value="rare">Rare</SelectItem>
                                      <SelectItem value="epic">Epic</SelectItem>
                                      <SelectItem value="legendary">Legendary</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label>Color</Label>
                                  <div className="flex space-x-2">
                                    <Input
                                      type="color"
                                      value={symbol.color}
                                      onChange={(e) => updateSymbol(symbol.id, { color: e.target.value })}
                                      className="w-16"
                                    />
                                    <Input
                                      value={symbol.color}
                                      onChange={(e) => updateSymbol(symbol.id, { color: e.target.value })}
                                      placeholder="#FFFFFF"
                                    />
                                  </div>
                                </div>
                              </div>

                              <div>
                                <Label>Symbol Image</Label>
                                <div className="flex items-center space-x-2 mt-2">
                                  <Button
                                    variant="outline"
                                    onClick={() => fileInputRef.current?.click()}
                                  >
                                    <Upload className="h-4 w-4 mr-2" />
                                    Upload Image
                                  </Button>
                                  <Input
                                    value={symbol.image || ''}
                                    onChange={(e) => updateSymbol(symbol.id, { image: e.target.value })}
                                    placeholder="Or enter image URL"
                                  />
                                  <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) handleImageUpload(file, symbol.id);
                                    }}
                                    className="hidden"
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reels Tab */}
            <TabsContent value="reels" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Reel Configuration</CardTitle>
                    <Button onClick={addReel}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Reel
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Selected Reel</Label>
                      <Select 
                        value={selectedReel.toString()} 
                        onValueChange={(value) => setSelectedReel(parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {slot.reels.map((_, index) => (
                            <SelectItem key={index} value={index.toString()}>
                              Reel {index + 1}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {slot.reels[selectedReel] && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Reel {selectedReel + 1} Symbol Weights</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {slot.symbols.map((symbol) => (
                              <div key={symbol.id} className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2 flex-1">
                                  <div 
                                    className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold"
                                    style={{ backgroundColor: symbol.color }}
                                  >
                                    {symbol.name[0]}
                                  </div>
                                  <span className="text-sm">{symbol.name}</span>
                                </div>
                                <div className="flex-1">
                                  <Slider
                                    value={[slot.reels[selectedReel].weight[symbol.id] || 1]}
                                    onValueChange={(value) => 
                                      updateReelWeight(selectedReel, symbol.id, value[0])
                                    }
                                    min={1}
                                    max={50}
                                    step={1}
                                    className="flex-1"
                                  />
                                </div>
                                <div className="w-12 text-right text-sm">
                                  {slot.reels[selectedReel].weight[symbol.id] || 1}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Paylines Tab */}
            <TabsContent value="paylines" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payline Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center text-muted-foreground py-8">
                    <Grid className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Payline editor coming soon!</p>
                    <p className="text-sm">Currently using default payline configuration.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preview Tab */}
            <TabsContent value="preview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Test Your Slot Machine</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    <p className="text-muted-foreground">
                      Test your slot machine configuration before saving.
                    </p>
                    <Button onClick={handlePreview} size="lg">
                      <TestTube className="h-5 w-5 mr-2" />
                      Launch Test Mode
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Validation Errors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index} className="text-sm text-destructive">
                      • {error}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* JoseyAI Assistant */}
        <div className="space-y-6">
          <JoseyAI
            context="slot-editor"
            currentSlot={slot}
            onSuggestionApply={handleJoseyAISuggestion}
            onCodeGenerate={(code) => {
              console.log('Generated code:', code);
              // Apply generated code logic here
            }}
          />

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Slot Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Symbols</span>
                  <Badge variant="outline">{slot.symbols.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Reels</span>
                  <Badge variant="outline">{slot.reels.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Rows</span>
                  <Badge variant="outline">{slot.rows}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Paylines</span>
                  <Badge variant="outline">{slot.paylines.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>RTP</span>
                  <Badge variant="outline">{slot.rtp}%</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Volatility</span>
                  <Badge variant="outline">{slot.volatility}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Status</span>
                  <Badge variant={slot.active ? "default" : "secondary"}>
                    {slot.active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Slot Machine Preview</DialogTitle>
            <DialogDescription>
              Test your slot machine configuration
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <SlotMachine
              slot={slot}
              userId="preview"
              userBalance={1000}
              onSpin={async (bet) => ({
                id: 'preview',
                userId: 'preview',
                slotId: slot.id,
                bet,
                result: [['wild', 'seven', 'bar'], ['seven', 'seven', 'seven'], ['bar', 'wild', 'cherry']],
                winAmount: bet * 5,
                winLines: [],
                timestamp: new Date()
              })}
              onBalanceUpdate={() => {}}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
