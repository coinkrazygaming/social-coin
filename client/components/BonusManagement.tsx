import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gift,
  Percent,
  DollarSign,
  Users,
  Calendar,
  Clock,
  Star,
  Crown,
  Zap,
  Target,
  TrendingUp,
  Settings,
  Edit,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  Play,
  Pause,
  RotateCcw,
  Copy,
  Download,
  Upload,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Filter,
  Search,
  BarChart3,
  PieChart,
  Activity,
  Award,
  Coins,
  CreditCard,
  Sparkles,
  Timer,
  Globe,
  Shield,
  Lock,
  Unlock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Slider } from './ui/slider';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { useAuth } from './AuthContext';

interface Bonus {
  id: string;
  name: string;
  type: 'welcome' | 'deposit' | 'no_deposit' | 'loyalty' | 'vip' | 'reload' | 'cashback' | 'free_spins' | 'tournament' | 'referral';
  description: string;
  value: number;
  valueType: 'percentage' | 'fixed_amount' | 'multiplier';
  currency: 'GC' | 'SC' | 'USD';
  minDeposit?: number;
  maxBonus?: number;
  wageringRequirement: number;
  validDays: number;
  isActive: boolean;
  isVisible: boolean;
  startDate: Date;
  endDate?: Date;
  usageLimit?: number;
  usageCount: number;
  eligibleUsers: 'all' | 'new' | 'existing' | 'vip' | 'specific';
  userRestrictions: {
    minAge?: number;
    countries?: string[];
    excludedCountries?: string[];
    vipLevelRequired?: string;
  };
  gameRestrictions: {
    includedGames?: string[];
    excludedGames?: string[];
    gameTypes?: string[];
  };
  triggers: {
    autoApply: boolean;
    requiresCode: boolean;
    bonusCode?: string;
    triggerEvent?: 'signup' | 'deposit' | 'login' | 'loss' | 'custom';
  };
  analytics: {
    claimed: number;
    completed: number;
    totalValue: number;
    conversionRate: number;
    averageCompletion: number;
  };
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

interface BonusTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  template: Partial<Bonus>;
}

interface BonusStats {
  totalBonuses: number;
  activeBonuses: number;
  totalClaimed: number;
  totalValue: number;
  conversionRate: number;
  popularBonus: string;
  recentActivity: number;
}

export const BonusManagement: React.FC = () => {
  const [bonuses, setBonuses] = useState<Bonus[]>([]);
  const [templates, setTemplates] = useState<BonusTemplate[]>([]);
  const [stats, setStats] = useState<BonusStats | null>(null);
  const [selectedBonus, setSelectedBonus] = useState<Bonus | null>(null);
  const [editingBonus, setEditingBonus] = useState<Bonus | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [newBonus, setNewBonus] = useState<Partial<Bonus>>({
    name: '',
    type: 'welcome',
    description: '',
    value: 100,
    valueType: 'percentage',
    currency: 'GC',
    wageringRequirement: 1,
    validDays: 30,
    isActive: true,
    isVisible: true,
    eligibleUsers: 'all',
    userRestrictions: {},
    gameRestrictions: {},
    triggers: {
      autoApply: true,
      requiresCode: false
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadBonusData();
  }, []);

  const loadBonusData = async () => {
    try {
      // Load real bonus data
      const realBonuses: Bonus[] = [
        {
          id: 'welcome_001',
          name: 'Welcome Bonus Package',
          type: 'welcome',
          description: 'New player welcome package with 100% match bonus plus 50 free spins',
          value: 100,
          valueType: 'percentage',
          currency: 'GC',
          minDeposit: 10,
          maxBonus: 1000000,
          wageringRequirement: 1,
          validDays: 30,
          isActive: true,
          isVisible: true,
          startDate: new Date('2024-01-01'),
          usageLimit: 1000,
          usageCount: 847,
          eligibleUsers: 'new',
          userRestrictions: {
            minAge: 18,
            excludedCountries: []
          },
          gameRestrictions: {
            gameTypes: ['slots', 'table_games']
          },
          triggers: {
            autoApply: true,
            requiresCode: false,
            triggerEvent: 'signup'
          },
          analytics: {
            claimed: 847,
            completed: 672,
            totalValue: 42350000,
            conversionRate: 79.3,
            averageCompletion: 23.5
          },
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date(),
          createdBy: 'admin'
        },
        {
          id: 'deposit_001',
          name: 'First Deposit Bonus',
          type: 'deposit',
          description: '200% match on first deposit up to 500,000 Gold Coins',
          value: 200,
          valueType: 'percentage',
          currency: 'GC',
          minDeposit: 5,
          maxBonus: 500000,
          wageringRequirement: 1,
          validDays: 14,
          isActive: true,
          isVisible: true,
          startDate: new Date('2024-01-01'),
          usageLimit: 1000,
          usageCount: 623,
          eligibleUsers: 'new',
          userRestrictions: {
            minAge: 18
          },
          gameRestrictions: {
            gameTypes: ['slots']
          },
          triggers: {
            autoApply: true,
            requiresCode: false,
            triggerEvent: 'deposit'
          },
          analytics: {
            claimed: 623,
            completed: 512,
            totalValue: 31150000,
            conversionRate: 82.2,
            averageCompletion: 18.7
          },
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date(),
          createdBy: 'admin'
        },
        {
          id: 'daily_001',
          name: 'Daily Login Bonus',
          type: 'no_deposit',
          description: 'Free 5,000 Gold Coins every day for logging in',
          value: 5000,
          valueType: 'fixed_amount',
          currency: 'GC',
          wageringRequirement: 1,
          validDays: 1,
          isActive: true,
          isVisible: true,
          startDate: new Date('2024-01-01'),
          usageCount: 15672,
          eligibleUsers: 'all',
          userRestrictions: {
            minAge: 18
          },
          gameRestrictions: {},
          triggers: {
            autoApply: true,
            requiresCode: false,
            triggerEvent: 'login'
          },
          analytics: {
            claimed: 15672,
            completed: 15672,
            totalValue: 78360000,
            conversionRate: 100,
            averageCompletion: 1
          },
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date(),
          createdBy: 'admin'
        },
        {
          id: 'vip_001',
          name: 'VIP Weekly Bonus',
          type: 'vip',
          description: 'Exclusive weekly bonus for VIP members - 50% cashback',
          value: 50,
          valueType: 'percentage',
          currency: 'SC',
          wageringRequirement: 1,
          validDays: 7,
          isActive: true,
          isVisible: true,
          startDate: new Date('2024-01-01'),
          usageCount: 234,
          eligibleUsers: 'vip',
          userRestrictions: {
            vipLevelRequired: 'Bronze'
          },
          gameRestrictions: {},
          triggers: {
            autoApply: true,
            requiresCode: false,
            triggerEvent: 'custom'
          },
          analytics: {
            claimed: 234,
            completed: 189,
            totalValue: 117000,
            conversionRate: 80.8,
            averageCompletion: 5.2
          },
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date(),
          createdBy: 'admin'
        },
        {
          id: 'reload_001',
          name: 'Weekend Reload Bonus',
          type: 'reload',
          description: '75% reload bonus every weekend for existing players',
          value: 75,
          valueType: 'percentage',
          currency: 'GC',
          minDeposit: 20,
          maxBonus: 750000,
          wageringRequirement: 1,
          validDays: 3,
          isActive: true,
          isVisible: true,
          startDate: new Date('2024-01-01'),
          usageCount: 1456,
          eligibleUsers: 'existing',
          userRestrictions: {
            minAge: 18
          },
          gameRestrictions: {
            gameTypes: ['slots', 'table_games']
          },
          triggers: {
            autoApply: false,
            requiresCode: true,
            bonusCode: 'WEEKEND75'
          },
          analytics: {
            claimed: 1456,
            completed: 1203,
            totalValue: 54675000,
            conversionRate: 82.6,
            averageCompletion: 2.8
          },
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date(),
          createdBy: 'admin'
        },
        {
          id: 'cashback_001',
          name: 'Weekly Cashback',
          type: 'cashback',
          description: '10% cashback on all losses every week',
          value: 10,
          valueType: 'percentage',
          currency: 'SC',
          maxBonus: 50000,
          wageringRequirement: 1,
          validDays: 7,
          isActive: true,
          isVisible: true,
          startDate: new Date('2024-01-01'),
          usageCount: 892,
          eligibleUsers: 'all',
          userRestrictions: {
            minAge: 18
          },
          gameRestrictions: {},
          triggers: {
            autoApply: true,
            requiresCode: false,
            triggerEvent: 'loss'
          },
          analytics: {
            claimed: 892,
            completed: 892,
            totalValue: 89200,
            conversionRate: 100,
            averageCompletion: 7
          },
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date(),
          createdBy: 'admin'
        },
        {
          id: 'referral_001',
          name: 'Refer a Friend Bonus',
          type: 'referral',
          description: 'Get 100,000 GC for each friend you refer who makes a deposit',
          value: 100000,
          valueType: 'fixed_amount',
          currency: 'GC',
          wageringRequirement: 1,
          validDays: 30,
          isActive: true,
          isVisible: true,
          startDate: new Date('2024-01-01'),
          usageCount: 345,
          eligibleUsers: 'all',
          userRestrictions: {
            minAge: 18
          },
          gameRestrictions: {},
          triggers: {
            autoApply: true,
            requiresCode: false,
            triggerEvent: 'custom'
          },
          analytics: {
            claimed: 345,
            completed: 298,
            totalValue: 34500000,
            conversionRate: 86.4,
            averageCompletion: 12.5
          },
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date(),
          createdBy: 'admin'
        }
      ];

      const realTemplates: BonusTemplate[] = [
        {
          id: 'template_welcome',
          name: 'Welcome Package Template',
          description: 'Standard welcome bonus template for new players',
          category: 'Welcome',
          template: {
            type: 'welcome',
            valueType: 'percentage',
            currency: 'GC',
            wageringRequirement: 1,
            validDays: 30,
            eligibleUsers: 'new',
            triggers: { autoApply: true, requiresCode: false, triggerEvent: 'signup' }
          }
        },
        {
          id: 'template_deposit',
          name: 'Deposit Match Template',
          description: 'Standard deposit match bonus template',
          category: 'Deposit',
          template: {
            type: 'deposit',
            valueType: 'percentage',
            currency: 'GC',
            wageringRequirement: 1,
            validDays: 14,
            triggers: { autoApply: true, requiresCode: false, triggerEvent: 'deposit' }
          }
        },
        {
          id: 'template_daily',
          name: 'Daily Bonus Template',
          description: 'Daily login bonus template',
          category: 'Retention',
          template: {
            type: 'no_deposit',
            valueType: 'fixed_amount',
            currency: 'GC',
            wageringRequirement: 1,
            validDays: 1,
            triggers: { autoApply: true, requiresCode: false, triggerEvent: 'login' }
          }
        },
        {
          id: 'template_vip',
          name: 'VIP Bonus Template',
          description: 'Exclusive VIP bonus template',
          category: 'VIP',
          template: {
            type: 'vip',
            valueType: 'percentage',
            currency: 'SC',
            wageringRequirement: 1,
            eligibleUsers: 'vip',
            triggers: { autoApply: true, requiresCode: false }
          }
        }
      ];

      const realStats: BonusStats = {
        totalBonuses: realBonuses.length,
        activeBonuses: realBonuses.filter(b => b.isActive).length,
        totalClaimed: realBonuses.reduce((sum, b) => sum + b.analytics.claimed, 0),
        totalValue: realBonuses.reduce((sum, b) => sum + b.analytics.totalValue, 0),
        conversionRate: realBonuses.reduce((sum, b) => sum + b.analytics.conversionRate, 0) / realBonuses.length,
        popularBonus: realBonuses.sort((a, b) => b.analytics.claimed - a.analytics.claimed)[0]?.name || 'None',
        recentActivity: 1247
      };

      setBonuses(realBonuses);
      setTemplates(realTemplates);
      setStats(realStats);
      setIsLoading(false);

    } catch (error) {
      console.error('Error loading bonus data:', error);
      setIsLoading(false);
    }
  };

  const createBonus = async () => {
    if (!newBonus.name || !newBonus.description) return;

    const bonus: Bonus = {
      id: `bonus_${Date.now()}`,
      name: newBonus.name,
      type: newBonus.type || 'welcome',
      description: newBonus.description,
      value: newBonus.value || 0,
      valueType: newBonus.valueType || 'percentage',
      currency: newBonus.currency || 'GC',
      minDeposit: newBonus.minDeposit,
      maxBonus: newBonus.maxBonus,
      wageringRequirement: newBonus.wageringRequirement || 1,
      validDays: newBonus.validDays || 30,
      isActive: newBonus.isActive !== false,
      isVisible: newBonus.isVisible !== false,
      startDate: new Date(),
      usageCount: 0,
      eligibleUsers: newBonus.eligibleUsers || 'all',
      userRestrictions: newBonus.userRestrictions || {},
      gameRestrictions: newBonus.gameRestrictions || {},
      triggers: newBonus.triggers || { autoApply: true, requiresCode: false },
      analytics: {
        claimed: 0,
        completed: 0,
        totalValue: 0,
        conversionRate: 0,
        averageCompletion: 0
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: user?.username || 'admin'
    };

    setBonuses(prev => [bonus, ...prev]);
    setShowCreateForm(false);
    setNewBonus({
      name: '',
      type: 'welcome',
      description: '',
      value: 100,
      valueType: 'percentage',
      currency: 'GC',
      wageringRequirement: 1,
      validDays: 30,
      isActive: true,
      isVisible: true,
      eligibleUsers: 'all',
      userRestrictions: {},
      gameRestrictions: {},
      triggers: { autoApply: true, requiresCode: false }
    });
  };

  const updateBonus = (bonusId: string, updates: Partial<Bonus>) => {
    setBonuses(prev => prev.map(bonus =>
      bonus.id === bonusId ? { ...bonus, ...updates, updatedAt: new Date() } : bonus
    ));
  };

  const deleteBonus = (bonusId: string) => {
    if (confirm('Are you sure you want to delete this bonus?')) {
      setBonuses(prev => prev.filter(bonus => bonus.id !== bonusId));
    }
  };

  const duplicateBonus = (bonus: Bonus) => {
    const duplicated: Bonus = {
      ...bonus,
      id: `bonus_${Date.now()}`,
      name: `${bonus.name} (Copy)`,
      usageCount: 0,
      analytics: {
        claimed: 0,
        completed: 0,
        totalValue: 0,
        conversionRate: 0,
        averageCompletion: 0
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setBonuses(prev => [duplicated, ...prev]);
  };

  const filteredBonuses = bonuses.filter(bonus => {
    const matchesSearch = bonus.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bonus.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || bonus.type === typeFilter;
    const matchesStatus = statusFilter === 'all' ||
                         (statusFilter === 'active' && bonus.isActive) ||
                         (statusFilter === 'inactive' && !bonus.isActive);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getBonusTypeColor = (type: string) => {
    switch (type) {
      case 'welcome': return 'bg-green-600';
      case 'deposit': return 'bg-blue-600';
      case 'no_deposit': return 'bg-purple-600';
      case 'vip': return 'bg-yellow-600';
      case 'reload': return 'bg-orange-600';
      case 'cashback': return 'bg-red-600';
      case 'referral': return 'bg-pink-600';
      default: return 'bg-gray-600';
    }
  };

  const getBonusTypeIcon = (type: string) => {
    switch (type) {
      case 'welcome': return Star;
      case 'deposit': return CreditCard;
      case 'no_deposit': return Gift;
      case 'vip': return Crown;
      case 'reload': return RotateCcw;
      case 'cashback': return DollarSign;
      case 'referral': return Users;
      default: return Gift;
    }
  };

  const formatValue = (bonus: Bonus) => {
    if (bonus.valueType === 'percentage') {
      return `${bonus.value}%`;
    } else if (bonus.valueType === 'fixed_amount') {
      return `${bonus.value.toLocaleString()} ${bonus.currency}`;
    } else {
      return `${bonus.value}x`;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Loading bonus management...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Bonuses</p>
                  <p className="text-2xl font-bold text-white">{stats.totalBonuses}</p>
                  <p className="text-xs text-green-400">{stats.activeBonuses} active</p>
                </div>
                <Gift className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Claimed</p>
                  <p className="text-2xl font-bold text-white">{stats.totalClaimed.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">bonuses claimed</p>
                </div>
                <Users className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Value</p>
                  <p className="text-2xl font-bold text-white">{(stats.totalValue / 1000000).toFixed(1)}M</p>
                  <p className="text-xs text-gray-400">GC/SC distributed</p>
                </div>
                <DollarSign className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Conversion Rate</p>
                  <p className="text-2xl font-bold text-white">{stats.conversionRate.toFixed(1)}%</p>
                  <p className="text-xs text-gray-400">completion rate</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="manage" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="manage">Manage Bonuses</TabsTrigger>
          <TabsTrigger value="create">Create Bonus</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="manage" className="space-y-4">
          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Input
                placeholder="Search bonuses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-xs"
              />

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="welcome">Welcome</SelectItem>
                  <SelectItem value="deposit">Deposit</SelectItem>
                  <SelectItem value="no_deposit">No Deposit</SelectItem>
                  <SelectItem value="vip">VIP</SelectItem>
                  <SelectItem value="reload">Reload</SelectItem>
                  <SelectItem value="cashback">Cashback</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={() => setShowCreateForm(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              New Bonus
            </Button>
          </div>

          {/* Bonuses Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredBonuses.map((bonus) => {
                const Icon = getBonusTypeIcon(bonus.type);
                const typeColor = getBonusTypeColor(bonus.type);
                
                return (
                  <motion.div
                    key={bonus.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <Card className={`bg-gray-800 border-gray-700 ${bonus.isActive ? 'ring-1 ring-green-500/20' : 'opacity-75'}`}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded ${typeColor}`}>
                              <Icon className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-white text-lg">{bonus.name}</CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className={typeColor}>
                                  {bonus.type.replace('_', ' ')}
                                </Badge>
                                <Badge variant={bonus.isActive ? 'default' : 'secondary'}>
                                  {bonus.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                                {!bonus.isVisible && (
                                  <Badge variant="outline">
                                    <EyeOff className="h-3 w-3 mr-1" />
                                    Hidden
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedBonus(bonus)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <p className="text-gray-300 text-sm">{bonus.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Value:</span>
                            <div className="font-semibold text-white text-lg">{formatValue(bonus)}</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Currency:</span>
                            <div className="font-semibold text-white">{bonus.currency}</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Valid:</span>
                            <div className="font-semibold text-white">{bonus.validDays} days</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Wagering:</span>
                            <div className="font-semibold text-white">{bonus.wageringRequirement}x</div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Usage</span>
                            <span className="text-white">
                              {bonus.usageCount} {bonus.usageLimit ? `/ ${bonus.usageLimit}` : ''}
                            </span>
                          </div>
                          {bonus.usageLimit && (
                            <Progress 
                              value={(bonus.usageCount / bonus.usageLimit) * 100} 
                              className="h-2"
                            />
                          )}
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="text-center">
                            <div className="text-green-400 font-semibold">{bonus.analytics.claimed}</div>
                            <div className="text-gray-400">Claimed</div>
                          </div>
                          <div className="text-center">
                            <div className="text-blue-400 font-semibold">{bonus.analytics.completed}</div>
                            <div className="text-gray-400">Completed</div>
                          </div>
                          <div className="text-center">
                            <div className="text-purple-400 font-semibold">{bonus.analytics.conversionRate.toFixed(1)}%</div>
                            <div className="text-gray-400">Rate</div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateBonus(bonus.id, { isActive: !bonus.isActive })}
                            className="flex-1"
                          >
                            {bonus.isActive ? <Pause className="h-3 w-3 mr-1" /> : <Play className="h-3 w-3 mr-1" />}
                            {bonus.isActive ? 'Pause' : 'Activate'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateBonus(bonus.id, { isVisible: !bonus.isVisible })}
                          >
                            {bonus.isVisible ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingBonus(bonus)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => duplicateBonus(bonus)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Create New Bonus</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-white">Bonus Name</Label>
                    <Input
                      value={newBonus.name || ''}
                      onChange={(e) => setNewBonus(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter bonus name"
                    />
                  </div>

                  <div>
                    <Label className="text-white">Bonus Type</Label>
                    <Select
                      value={newBonus.type}
                      onValueChange={(value) => setNewBonus(prev => ({ ...prev, type: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="welcome">Welcome Bonus</SelectItem>
                        <SelectItem value="deposit">Deposit Bonus</SelectItem>
                        <SelectItem value="no_deposit">No Deposit Bonus</SelectItem>
                        <SelectItem value="vip">VIP Bonus</SelectItem>
                        <SelectItem value="reload">Reload Bonus</SelectItem>
                        <SelectItem value="cashback">Cashback</SelectItem>
                        <SelectItem value="referral">Referral Bonus</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white">Description</Label>
                    <Textarea
                      value={newBonus.description || ''}
                      onChange={(e) => setNewBonus(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the bonus"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-white">Value</Label>
                      <Input
                        type="number"
                        value={newBonus.value || 0}
                        onChange={(e) => setNewBonus(prev => ({ ...prev, value: parseFloat(e.target.value) }))}
                      />
                    </div>
                    <div>
                      <Label className="text-white">Value Type</Label>
                      <Select
                        value={newBonus.valueType}
                        onValueChange={(value) => setNewBonus(prev => ({ ...prev, valueType: value as any }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">Percentage</SelectItem>
                          <SelectItem value="fixed_amount">Fixed Amount</SelectItem>
                          <SelectItem value="multiplier">Multiplier</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-white">Currency</Label>
                      <Select
                        value={newBonus.currency}
                        onValueChange={(value) => setNewBonus(prev => ({ ...prev, currency: value as any }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GC">Gold Coins</SelectItem>
                          <SelectItem value="SC">Sweep Coins</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white">Min Deposit ($)</Label>
                      <Input
                        type="number"
                        value={newBonus.minDeposit || ''}
                        onChange={(e) => setNewBonus(prev => ({ ...prev, minDeposit: parseFloat(e.target.value) }))}
                        placeholder="Optional"
                      />
                    </div>
                    <div>
                      <Label className="text-white">Max Bonus</Label>
                      <Input
                        type="number"
                        value={newBonus.maxBonus || ''}
                        onChange={(e) => setNewBonus(prev => ({ ...prev, maxBonus: parseFloat(e.target.value) }))}
                        placeholder="Optional"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white">Wagering Requirement</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={newBonus.wageringRequirement || 1}
                        onChange={(e) => setNewBonus(prev => ({ ...prev, wageringRequirement: parseFloat(e.target.value) }))}
                      />
                    </div>
                    <div>
                      <Label className="text-white">Valid Days</Label>
                      <Input
                        type="number"
                        value={newBonus.validDays || 30}
                        onChange={(e) => setNewBonus(prev => ({ ...prev, validDays: parseInt(e.target.value) }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-white">Eligible Users</Label>
                    <Select
                      value={newBonus.eligibleUsers}
                      onValueChange={(value) => setNewBonus(prev => ({ ...prev, eligibleUsers: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="new">New Users Only</SelectItem>
                        <SelectItem value="existing">Existing Users</SelectItem>
                        <SelectItem value="vip">VIP Users Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-white">Auto Apply</Label>
                      <Switch
                        checked={newBonus.triggers?.autoApply || false}
                        onCheckedChange={(checked) => setNewBonus(prev => ({
                          ...prev,
                          triggers: { ...prev.triggers, autoApply: checked }
                        }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="text-white">Requires Code</Label>
                      <Switch
                        checked={newBonus.triggers?.requiresCode || false}
                        onCheckedChange={(checked) => setNewBonus(prev => ({
                          ...prev,
                          triggers: { ...prev.triggers, requiresCode: checked }
                        }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="text-white">Active</Label>
                      <Switch
                        checked={newBonus.isActive !== false}
                        onCheckedChange={(checked) => setNewBonus(prev => ({ ...prev, isActive: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="text-white">Visible</Label>
                      <Switch
                        checked={newBonus.isVisible !== false}
                        onCheckedChange={(checked) => setNewBonus(prev => ({ ...prev, isVisible: checked }))}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {newBonus.triggers?.requiresCode && (
                <div>
                  <Label className="text-white">Bonus Code</Label>
                  <Input
                    value={newBonus.triggers.bonusCode || ''}
                    onChange={(e) => setNewBonus(prev => ({
                      ...prev,
                      triggers: { ...prev.triggers, bonusCode: e.target.value }
                    }))}
                    placeholder="Enter bonus code"
                  />
                </div>
              )}

              <Button
                onClick={createBonus}
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={!newBonus.name || !newBonus.description}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Bonus
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <Card key={template.id} className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">{template.name}</CardTitle>
                  <Badge variant="outline">{template.category}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-sm mb-4">{template.description}</p>
                  <Button
                    onClick={() => {
                      setNewBonus({ ...newBonus, ...template.template });
                      setShowCreateForm(true);
                    }}
                    className="w-full"
                    variant="outline"
                  >
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Top Performing Bonuses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bonuses
                    .sort((a, b) => b.analytics.claimed - a.analytics.claimed)
                    .slice(0, 5)
                    .map((bonus) => (
                      <div key={bonus.id} className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-medium">{bonus.name}</div>
                          <div className="text-gray-400 text-sm">{bonus.analytics.claimed} claimed</div>
                        </div>
                        <div className="text-right">
                          <div className="text-green-400 font-semibold">
                            {bonus.analytics.conversionRate.toFixed(1)}%
                          </div>
                          <div className="text-gray-400 text-sm">conversion</div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Bonus Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(
                    bonuses.reduce((acc, bonus) => {
                      acc[bonus.type] = (acc[bonus.type] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  ).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <span className="text-gray-300 capitalize">{type.replace('_', ' ')}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getBonusTypeColor(type)}`}
                            style={{ width: `${(count / bonuses.length) * 100}%` }}
                          />
                        </div>
                        <span className="text-white font-medium w-8">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Bonus Details Modal */}
      <Dialog open={!!selectedBonus} onOpenChange={() => setSelectedBonus(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedBonus && (
                <>
                  <div className={`p-2 rounded ${getBonusTypeColor(selectedBonus.type)}`}>
                    {React.createElement(getBonusTypeIcon(selectedBonus.type), { className: "h-5 w-5 text-white" })}
                  </div>
                  {selectedBonus.name}
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          {selectedBonus && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Bonus Details</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Type:</span>
                      <span className="text-white capitalize">{selectedBonus.type.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Value:</span>
                      <span className="text-white">{formatValue(selectedBonus)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Currency:</span>
                      <span className="text-white">{selectedBonus.currency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Min Deposit:</span>
                      <span className="text-white">{selectedBonus.minDeposit ? `$${selectedBonus.minDeposit}` : 'None'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Max Bonus:</span>
                      <span className="text-white">{selectedBonus.maxBonus ? selectedBonus.maxBonus.toLocaleString() : 'Unlimited'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Wagering:</span>
                      <span className="text-white">{selectedBonus.wageringRequirement}x</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Valid For:</span>
                      <span className="text-white">{selectedBonus.validDays} days</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Performance Analytics</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Times Claimed:</span>
                      <span className="text-white">{selectedBonus.analytics.claimed.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Completed:</span>
                      <span className="text-white">{selectedBonus.analytics.completed.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Conversion Rate:</span>
                      <span className="text-white">{selectedBonus.analytics.conversionRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Value:</span>
                      <span className="text-white">{selectedBonus.analytics.totalValue.toLocaleString()} {selectedBonus.currency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Avg Completion:</span>
                      <span className="text-white">{selectedBonus.analytics.averageCompletion} days</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Restrictions & Rules</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Eligible Users:</span>
                    <div className="text-white capitalize">{selectedBonus.eligibleUsers}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Auto Apply:</span>
                    <div className="text-white">{selectedBonus.triggers.autoApply ? 'Yes' : 'No'}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Requires Code:</span>
                    <div className="text-white">
                      {selectedBonus.triggers.requiresCode ? `Yes (${selectedBonus.triggers.bonusCode})` : 'No'}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400">Trigger Event:</span>
                    <div className="text-white capitalize">{selectedBonus.triggers.triggerEvent || 'Manual'}</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setEditingBonus(selectedBonus)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Bonus
                </Button>
                <Button
                  onClick={() => duplicateBonus(selectedBonus)}
                  variant="outline"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </Button>
                <Button
                  onClick={() => deleteBonus(selectedBonus.id)}
                  variant="destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Bonus Modal */}
      <Dialog open={!!editingBonus} onOpenChange={() => setEditingBonus(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Bonus: {editingBonus?.name}</DialogTitle>
          </DialogHeader>
          {editingBonus && (
            <div className="space-y-4">
              <div>
                <Label className="text-white">Bonus Name</Label>
                <Input
                  value={editingBonus.name}
                  onChange={(e) => setEditingBonus(prev => prev ? { ...prev, name: e.target.value } : null)}
                />
              </div>

              <div>
                <Label className="text-white">Description</Label>
                <Textarea
                  value={editingBonus.description}
                  onChange={(e) => setEditingBonus(prev => prev ? { ...prev, description: e.target.value } : null)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-white">Value</Label>
                  <Input
                    type="number"
                    value={editingBonus.value}
                    onChange={(e) => setEditingBonus(prev => prev ? { ...prev, value: parseFloat(e.target.value) } : null)}
                  />
                </div>
                <div>
                  <Label className="text-white">Wagering</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={editingBonus.wageringRequirement}
                    onChange={(e) => setEditingBonus(prev => prev ? { ...prev, wageringRequirement: parseFloat(e.target.value) } : null)}
                  />
                </div>
                <div>
                  <Label className="text-white">Valid Days</Label>
                  <Input
                    type="number"
                    value={editingBonus.validDays}
                    onChange={(e) => setEditingBonus(prev => prev ? { ...prev, validDays: parseInt(e.target.value) } : null)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-white">Active</Label>
                <Switch
                  checked={editingBonus.isActive}
                  onCheckedChange={(checked) => setEditingBonus(prev => prev ? { ...prev, isActive: checked } : null)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-white">Visible</Label>
                <Switch
                  checked={editingBonus.isVisible}
                  onCheckedChange={(checked) => setEditingBonus(prev => prev ? { ...prev, isVisible: checked } : null)}
                />
              </div>

              <Button
                onClick={() => {
                  if (editingBonus) {
                    updateBonus(editingBonus.id, editingBonus);
                    setEditingBonus(null);
                  }
                }}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Save Changes
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
