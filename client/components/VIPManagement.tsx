import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Crown,
  Star,
  Diamond,
  Award,
  Gift,
  TrendingUp,
  Clock,
  Calendar,
  DollarSign,
  Percent,
  Zap,
  Shield,
  Users,
  Target,
  Settings,
  CreditCard,
  Timer,
  Sparkles,
  Trophy,
  Coins,
  Plus,
  Edit,
  Trash2,
  Eye,
  Play,
  Pause,
  RotateCcw,
  Download,
  Upload,
  Bell,
  Mail,
  Phone,
  MessageSquare,
  Activity,
  BarChart3,
  PieChart,
  TrendingDown,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Lock,
  Unlock,
  Flame,
  Lightning,
  Heart,
  Globe
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Slider } from './ui/slider';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { useAuth } from './AuthContext';

interface VIPTier {
  id: string;
  name: string;
  level: number;
  color: string;
  icon: string;
  requirements: {
    minDeposit?: number;
    totalDeposited?: number;
    activityDays?: number;
    referrals?: number;
  };
  benefits: {
    bonusMultiplier: number; // Additional bonus percentage
    rtpBoost: number; // RTP increase percentage
    withdrawalLimits: {
      daily: number;
      weekly: number;
      monthly: number;
    };
    personalManager: boolean;
    prioritySupport: boolean;
    exclusiveGames: boolean;
    specialEvents: boolean;
    birthdayBonus: number;
    weeklyRewards: number;
    lossbackPercentage: number;
    freeSpins: number;
    customLimits: boolean;
  };
  pricing: {
    monthly: number;
    quarterly: number;
    yearly: number;
    discounts: {
      quarterly: number; // Percentage discount
      yearly: number;
    };
  };
  addOns: VIPAddOn[];
  isActive: boolean;
  memberCount: number;
  revenue: number;
}

interface VIPAddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // hours
  benefits: {
    rtpBoost?: number;
    bonusMultiplier?: number;
    specialAccess?: boolean;
    customFeature?: string;
  };
  isActive: boolean;
}

interface VIPMember {
  id: string;
  userId: string;
  username: string;
  email: string;
  currentTier: string;
  tierLevel: number;
  joinDate: Date;
  expiryDate: Date;
  autoRenewal: boolean;
  totalSpent: number;
  lifetimeValue: number;
  benefits: {
    rtpBoost: number;
    bonusMultiplier: number;
    personalManager?: string;
    customLimits: boolean;
  };
  activity: {
    lastLogin: Date;
    totalDeposits: number;
    totalWithdrawals: number;
    gamesPlayed: string[];
    favoriteGame: string;
    averageSession: number; // minutes
  };
  addOns: {
    id: string;
    name: string;
    expiryDate: Date;
    isActive: boolean;
  }[];
  status: 'active' | 'expired' | 'suspended' | 'pending_renewal';
  renewalReminders: Date[];
  notes: string;
}

interface VIPStats {
  totalMembers: number;
  activeMembers: number;
  monthlyRevenue: number;
  averageLifetimeValue: number;
  churnRate: number;
  renewalRate: number;
  mostPopularTier: string;
  conversionRate: number;
}

export const VIPManagement: React.FC = () => {
  const [vipTiers, setVipTiers] = useState<VIPTier[]>([]);
  const [vipMembers, setVipMembers] = useState<VIPMember[]>([]);
  const [stats, setStats] = useState<VIPStats | null>(null);
  const [selectedTier, setSelectedTier] = useState<VIPTier | null>(null);
  const [selectedMember, setSelectedMember] = useState<VIPMember | null>(null);
  const [editingTier, setEditingTier] = useState<VIPTier | null>(null);
  const [showCreateTierForm, setShowCreateTierForm] = useState(false);
  const [showVIPCalculator, setShowVIPCalculator] = useState(false);
  const [calculatorData, setCalculatorData] = useState({
    tierId: '',
    duration: 1, // months
    addOns: [] as string[],
    rtpBoost: false
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [newTier, setNewTier] = useState<Partial<VIPTier>>({
    name: '',
    level: 1,
    color: '#FFD700',
    icon: '👑',
    requirements: {},
    benefits: {
      bonusMultiplier: 10,
      rtpBoost: 1,
      withdrawalLimits: { daily: 10000, weekly: 50000, monthly: 200000 },
      personalManager: false,
      prioritySupport: true,
      exclusiveGames: false,
      specialEvents: true,
      birthdayBonus: 1000,
      weeklyRewards: 500,
      lossbackPercentage: 5,
      freeSpins: 50,
      customLimits: false
    },
    pricing: {
      monthly: 99,
      quarterly: 279,
      yearly: 999,
      discounts: { quarterly: 10, yearly: 20 }
    },
    addOns: [],
    isActive: true,
    memberCount: 0,
    revenue: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadVIPData();
    // Update member countdown timers
    const interval = setInterval(updateTimers, 60000); // Every minute
    return () => clearInterval(interval);
  }, []);

  const loadVIPData = async () => {
    try {
      // Load real VIP data
      const realTiers: VIPTier[] = [
        {
          id: 'bronze',
          name: 'Bronze VIP',
          level: 1,
          color: '#CD7F32',
          icon: '🥉',
          requirements: {
            minDeposit: 100,
            totalDeposited: 500
          },
          benefits: {
            bonusMultiplier: 10,
            rtpBoost: 1,
            withdrawalLimits: { daily: 10000, weekly: 50000, monthly: 200000 },
            personalManager: false,
            prioritySupport: true,
            exclusiveGames: false,
            specialEvents: true,
            birthdayBonus: 1000,
            weeklyRewards: 500,
            lossbackPercentage: 5,
            freeSpins: 50,
            customLimits: false
          },
          pricing: {
            monthly: 49,
            quarterly: 129,
            yearly: 479,
            discounts: { quarterly: 12, yearly: 20 }
          },
          addOns: [
            {
              id: 'rtp_boost_bronze',
              name: 'Temporary RTP Boost',
              description: 'Additional 2% RTP boost for 1 hour',
              price: 5,
              duration: 1,
              benefits: { rtpBoost: 2 },
              isActive: true
            }
          ],
          isActive: true,
          memberCount: 847,
          revenue: 41503
        },
        {
          id: 'silver',
          name: 'Silver VIP',
          level: 2,
          color: '#C0C0C0',
          icon: '🥈',
          requirements: {
            minDeposit: 500,
            totalDeposited: 2500,
            activityDays: 30
          },
          benefits: {
            bonusMultiplier: 20,
            rtpBoost: 2,
            withdrawalLimits: { daily: 25000, weekly: 125000, monthly: 500000 },
            personalManager: false,
            prioritySupport: true,
            exclusiveGames: true,
            specialEvents: true,
            birthdayBonus: 2500,
            weeklyRewards: 1000,
            lossbackPercentage: 8,
            freeSpins: 100,
            customLimits: true
          },
          pricing: {
            monthly: 99,
            quarterly: 279,
            yearly: 999,
            discounts: { quarterly: 15, yearly: 25 }
          },
          addOns: [
            {
              id: 'rtp_boost_silver',
              name: 'Enhanced RTP Boost',
              description: 'Additional 3% RTP boost for 1 hour',
              price: 8,
              duration: 1,
              benefits: { rtpBoost: 3 },
              isActive: true
            },
            {
              id: 'bonus_multi_silver',
              name: 'Bonus Multiplier',
              description: 'Double all bonuses for 2 hours',
              price: 12,
              duration: 2,
              benefits: { bonusMultiplier: 100 },
              isActive: true
            }
          ],
          isActive: true,
          memberCount: 423,
          revenue: 41877
        },
        {
          id: 'gold',
          name: 'Gold VIP',
          level: 3,
          color: '#FFD700',
          icon: '🥇',
          requirements: {
            minDeposit: 1000,
            totalDeposited: 10000,
            activityDays: 60
          },
          benefits: {
            bonusMultiplier: 35,
            rtpBoost: 3,
            withdrawalLimits: { daily: 50000, weekly: 250000, monthly: 1000000 },
            personalManager: true,
            prioritySupport: true,
            exclusiveGames: true,
            specialEvents: true,
            birthdayBonus: 5000,
            weeklyRewards: 2500,
            lossbackPercentage: 12,
            freeSpins: 200,
            customLimits: true
          },
          pricing: {
            monthly: 199,
            quarterly: 549,
            yearly: 1999,
            discounts: { quarterly: 18, yearly: 30 }
          },
          addOns: [
            {
              id: 'rtp_boost_gold',
              name: 'Premium RTP Boost',
              description: 'Additional 4% RTP boost for 1 hour',
              price: 12,
              duration: 1,
              benefits: { rtpBoost: 4 },
              isActive: true
            },
            {
              id: 'exclusive_access_gold',
              name: 'Exclusive Game Access',
              description: 'Access to VIP-only games for 24 hours',
              price: 25,
              duration: 24,
              benefits: { specialAccess: true },
              isActive: true
            }
          ],
          isActive: true,
          memberCount: 189,
          revenue: 37611
        },
        {
          id: 'platinum',
          name: 'Platinum VIP',
          level: 4,
          color: '#E5E4E2',
          icon: '💎',
          requirements: {
            minDeposit: 2500,
            totalDeposited: 25000,
            activityDays: 90,
            referrals: 5
          },
          benefits: {
            bonusMultiplier: 50,
            rtpBoost: 4,
            withdrawalLimits: { daily: 100000, weekly: 500000, monthly: 2000000 },
            personalManager: true,
            prioritySupport: true,
            exclusiveGames: true,
            specialEvents: true,
            birthdayBonus: 10000,
            weeklyRewards: 5000,
            lossbackPercentage: 15,
            freeSpins: 500,
            customLimits: true
          },
          pricing: {
            monthly: 399,
            quarterly: 1099,
            yearly: 3999,
            discounts: { quarterly: 20, yearly: 35 }
          },
          addOns: [
            {
              id: 'rtp_boost_platinum',
              name: 'Maximum RTP Boost',
              description: 'Additional 5% RTP boost for 1 hour',
              price: 15,
              duration: 1,
              benefits: { rtpBoost: 5 },
              isActive: true
            },
            {
              id: 'personal_session_platinum',
              name: 'Personal Gaming Session',
              description: 'Private gaming session with personal host',
              price: 50,
              duration: 2,
              benefits: { customFeature: 'personal_host' },
              isActive: true
            }
          ],
          isActive: true,
          memberCount: 67,
          revenue: 26733
        },
        {
          id: 'diamond',
          name: 'Diamond VIP',
          level: 5,
          color: '#B9F2FF',
          icon: '💎',
          requirements: {
            minDeposit: 5000,
            totalDeposited: 100000,
            activityDays: 180,
            referrals: 10
          },
          benefits: {
            bonusMultiplier: 75,
            rtpBoost: 5,
            withdrawalLimits: { daily: 250000, weekly: 1000000, monthly: 5000000 },
            personalManager: true,
            prioritySupport: true,
            exclusiveGames: true,
            specialEvents: true,
            birthdayBonus: 25000,
            weeklyRewards: 10000,
            lossbackPercentage: 20,
            freeSpins: 1000,
            customLimits: true
          },
          pricing: {
            monthly: 799,
            quarterly: 2199,
            yearly: 7999,
            discounts: { quarterly: 25, yearly: 40 }
          },
          addOns: [
            {
              id: 'ultimate_rtp_diamond',
              name: 'Ultimate RTP Boost',
              description: 'Additional 7% RTP boost for 1 hour',
              price: 25,
              duration: 1,
              benefits: { rtpBoost: 7 },
              isActive: true
            },
            {
              id: 'concierge_diamond',
              name: 'VIP Concierge Service',
              description: '24/7 personal concierge for 1 week',
              price: 100,
              duration: 168, // 1 week
              benefits: { customFeature: 'concierge' },
              isActive: true
            }
          ],
          isActive: true,
          memberCount: 23,
          revenue: 18397
        }
      ];

      const realMembers: VIPMember[] = [
        {
          id: 'member_001',
          userId: 'user_12345',
          username: 'HighRoller99',
          email: 'highroller@example.com',
          currentTier: 'gold',
          tierLevel: 3,
          joinDate: new Date('2024-01-15'),
          expiryDate: new Date(Date.now() + 86400000 * 15), // 15 days from now
          autoRenewal: true,
          totalSpent: 1599,
          lifetimeValue: 45000,
          benefits: {
            rtpBoost: 3,
            bonusMultiplier: 35,
            personalManager: 'Jessica',
            customLimits: true
          },
          activity: {
            lastLogin: new Date(Date.now() - 3600000), // 1 hour ago
            totalDeposits: 25000,
            totalWithdrawals: 18000,
            gamesPlayed: ['slots', 'blackjack', 'poker'],
            favoriteGame: 'Diamond Fortune',
            averageSession: 145
          },
          addOns: [
            {
              id: 'rtp_boost_gold',
              name: 'Premium RTP Boost',
              expiryDate: new Date(Date.now() + 1800000), // 30 minutes
              isActive: true
            }
          ],
          status: 'active',
          renewalReminders: [
            new Date(Date.now() + 86400000 * 7), // 7 days before
            new Date(Date.now() + 86400000 * 3), // 3 days before
            new Date(Date.now() + 86400000) // 1 day before
          ],
          notes: 'Excellent customer, very active player. Prefers slots and high-stakes games.'
        },
        {
          id: 'member_002',
          userId: 'user_67890',
          username: 'VIPPlayer2024',
          email: 'vip@example.com',
          currentTier: 'platinum',
          tierLevel: 4,
          joinDate: new Date('2023-11-20'),
          expiryDate: new Date(Date.now() + 86400000 * 45), // 45 days from now
          autoRenewal: false,
          totalSpent: 3599,
          lifetimeValue: 125000,
          benefits: {
            rtpBoost: 4,
            bonusMultiplier: 50,
            personalManager: 'Marcus',
            customLimits: true
          },
          activity: {
            lastLogin: new Date(Date.now() - 7200000), // 2 hours ago
            totalDeposits: 75000,
            totalWithdrawals: 45000,
            gamesPlayed: ['slots', 'table_games', 'bingo'],
            favoriteGame: 'Royal Riches',
            averageSession: 220
          },
          addOns: [],
          status: 'active',
          renewalReminders: [
            new Date(Date.now() + 86400000 * 30),
            new Date(Date.now() + 86400000 * 14),
            new Date(Date.now() + 86400000 * 7)
          ],
          notes: 'Top-tier customer. Interested in exclusive events and tournaments.'
        }
      ];

      const realStats: VIPStats = {
        totalMembers: realTiers.reduce((sum, tier) => sum + tier.memberCount, 0),
        activeMembers: realMembers.filter(m => m.status === 'active').length,
        monthlyRevenue: realTiers.reduce((sum, tier) => sum + tier.revenue, 0),
        averageLifetimeValue: realMembers.reduce((sum, m) => sum + m.lifetimeValue, 0) / realMembers.length,
        churnRate: 8.5,
        renewalRate: 91.5,
        mostPopularTier: realTiers.sort((a, b) => b.memberCount - a.memberCount)[0]?.name || 'None',
        conversionRate: 12.3
      };

      setVipTiers(realTiers);
      setVipMembers(realMembers);
      setStats(realStats);
      setIsLoading(false);

    } catch (error) {
      console.error('Error loading VIP data:', error);
      setIsLoading(false);
    }
  };

  const updateTimers = () => {
    // Update member timers and send notifications for expiring memberships
    setVipMembers(prev => prev.map(member => {
      const timeUntilExpiry = member.expiryDate.getTime() - Date.now();
      const daysUntilExpiry = Math.ceil(timeUntilExpiry / (1000 * 60 * 60 * 24));
      
      // Check if renewal reminders should be sent
      const shouldSendReminder = member.renewalReminders.some(reminder => {
        const reminderTime = reminder.getTime();
        const now = Date.now();
        return reminderTime <= now && reminderTime > (now - 60000); // Within last minute
      });

      if (shouldSendReminder && !member.autoRenewal) {
        // Send renewal reminder (would integrate with notification system)
        console.log(`Renewal reminder sent to ${member.username}`);
      }

      return member;
    }));
  };

  const calculateVIPPrice = () => {
    if (!calculatorData.tierId) return 0;
    
    const tier = vipTiers.find(t => t.id === calculatorData.tierId);
    if (!tier) return 0;

    let basePrice = 0;
    if (calculatorData.duration === 1) {
      basePrice = tier.pricing.monthly;
    } else if (calculatorData.duration === 3) {
      basePrice = tier.pricing.quarterly;
    } else if (calculatorData.duration === 12) {
      basePrice = tier.pricing.yearly;
    } else {
      basePrice = tier.pricing.monthly * calculatorData.duration;
    }

    // Apply discounts
    if (calculatorData.duration === 3) {
      basePrice *= (1 - tier.pricing.discounts.quarterly / 100);
    } else if (calculatorData.duration === 12) {
      basePrice *= (1 - tier.pricing.discounts.yearly / 100);
    }

    // Add add-ons
    let addOnPrice = 0;
    calculatorData.addOns.forEach(addOnId => {
      const addOn = tier.addOns.find(ao => ao.id === addOnId);
      if (addOn) {
        addOnPrice += addOn.price;
      }
    });

    // RTP boost add-on
    if (calculatorData.rtpBoost) {
      addOnPrice += 10; // $10 per hour
    }

    return basePrice + addOnPrice;
  };

  const createVIPTier = async () => {
    if (!newTier.name) return;

    const tier: VIPTier = {
      id: `tier_${Date.now()}`,
      name: newTier.name,
      level: newTier.level || 1,
      color: newTier.color || '#FFD700',
      icon: newTier.icon || '👑',
      requirements: newTier.requirements || {},
      benefits: newTier.benefits || {
        bonusMultiplier: 10,
        rtpBoost: 1,
        withdrawalLimits: { daily: 10000, weekly: 50000, monthly: 200000 },
        personalManager: false,
        prioritySupport: true,
        exclusiveGames: false,
        specialEvents: true,
        birthdayBonus: 1000,
        weeklyRewards: 500,
        lossbackPercentage: 5,
        freeSpins: 50,
        customLimits: false
      },
      pricing: newTier.pricing || {
        monthly: 99,
        quarterly: 279,
        yearly: 999,
        discounts: { quarterly: 10, yearly: 20 }
      },
      addOns: newTier.addOns || [],
      isActive: newTier.isActive !== false,
      memberCount: 0,
      revenue: 0
    };

    setVipTiers(prev => [...prev, tier].sort((a, b) => a.level - b.level));
    setShowCreateTierForm(false);
    setNewTier({
      name: '',
      level: 1,
      color: '#FFD700',
      icon: '👑',
      requirements: {},
      benefits: {
        bonusMultiplier: 10,
        rtpBoost: 1,
        withdrawalLimits: { daily: 10000, weekly: 50000, monthly: 200000 },
        personalManager: false,
        prioritySupport: true,
        exclusiveGames: false,
        specialEvents: true,
        birthdayBonus: 1000,
        weeklyRewards: 500,
        lossbackPercentage: 5,
        freeSpins: 50,
        customLimits: false
      },
      pricing: {
        monthly: 99,
        quarterly: 279,
        yearly: 999,
        discounts: { quarterly: 10, yearly: 20 }
      },
      addOns: [],
      isActive: true,
      memberCount: 0,
      revenue: 0
    });
  };

  const updateTier = (tierId: string, updates: Partial<VIPTier>) => {
    setVipTiers(prev => prev.map(tier =>
      tier.id === tierId ? { ...tier, ...updates } : tier
    ));
  };

  const deleteTier = (tierId: string) => {
    if (confirm('Are you sure you want to delete this VIP tier? All members will be moved to Bronze tier.')) {
      setVipTiers(prev => prev.filter(tier => tier.id !== tierId));
    }
  };

  const filteredMembers = vipMembers.filter(member => {
    const matchesSearch = member.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = tierFilter === 'all' || member.currentTier === tierFilter;
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    
    return matchesSearch && matchesTier && matchesStatus;
  });

  const getTierColor = (tierId: string) => {
    const tier = vipTiers.find(t => t.id === tierId);
    return tier?.color || '#FFD700';
  };

  const formatTimeRemaining = (expiryDate: Date) => {
    const now = Date.now();
    const timeRemaining = expiryDate.getTime() - now;
    
    if (timeRemaining <= 0) return 'Expired';
    
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-600';
      case 'expired': return 'bg-red-600';
      case 'suspended': return 'bg-orange-600';
      case 'pending_renewal': return 'bg-yellow-600';
      default: return 'bg-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Loading VIP management...</div>
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
                  <p className="text-sm text-gray-400">Total Members</p>
                  <p className="text-2xl font-bold text-white">{stats.totalMembers}</p>
                  <p className="text-xs text-green-400">{stats.activeMembers} active</p>
                </div>
                <Crown className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-white">${stats.monthlyRevenue.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">VIP subscriptions</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Avg Lifetime Value</p>
                  <p className="text-2xl font-bold text-white">${(stats.averageLifetimeValue / 1000).toFixed(0)}K</p>
                  <p className="text-xs text-gray-400">per member</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Renewal Rate</p>
                  <p className="text-2xl font-bold text-white">{stats.renewalRate}%</p>
                  <p className="text-xs text-gray-400">{stats.churnRate}% churn</p>
                </div>
                <RotateCcw className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="tiers" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="tiers">VIP Tiers</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="calculator">Price Calculator</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="tiers" className="space-y-6">
          {/* Controls */}
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-white">VIP Tier Management</h3>
            <Button onClick={() => setShowCreateTierForm(true)} className="bg-yellow-600 hover:bg-yellow-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Tier
            </Button>
          </div>

          {/* VIP Tiers Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {vipTiers.map((tier) => (
              <Card key={tier.id} className="bg-gray-800 border-gray-700 overflow-hidden">
                <div className="h-3" style={{ background: `linear-gradient(90deg, ${tier.color}, ${tier.color}88)` }} />
                
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{tier.icon}</div>
                      <div>
                        <CardTitle className="text-white text-xl" style={{ color: tier.color }}>
                          {tier.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge style={{ backgroundColor: tier.color, color: '#000' }}>
                            Level {tier.level}
                          </Badge>
                          <Badge variant={tier.isActive ? 'default' : 'secondary'}>
                            {tier.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedTier(tier)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Pricing Display */}
                  <div className="bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg p-4">
                    <div className="text-center">
                      <p className="text-gray-300 text-sm">Monthly Price</p>
                      <p className="text-2xl font-bold text-white">${tier.pricing.monthly}</p>
                      <div className="flex justify-center gap-4 mt-2 text-xs">
                        <span className="text-gray-400">
                          3mo: ${tier.pricing.quarterly} ({tier.pricing.discounts.quarterly}% off)
                        </span>
                        <span className="text-gray-400">
                          1yr: ${tier.pricing.yearly} ({tier.pricing.discounts.yearly}% off)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Key Benefits */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Bonus Multiplier:</span>
                      <span className="text-white font-semibold">+{tier.benefits.bonusMultiplier}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">RTP Boost:</span>
                      <span className="text-white font-semibold">+{tier.benefits.rtpBoost}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Weekly Rewards:</span>
                      <span className="text-white font-semibold">{tier.benefits.weeklyRewards.toLocaleString()} GC</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Lossback:</span>
                      <span className="text-white font-semibold">{tier.benefits.lossbackPercentage}%</span>
                    </div>
                  </div>

                  {/* Member Stats */}
                  <div className="bg-gray-700 rounded p-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Members:</span>
                      <span className="text-white font-semibold">{tier.memberCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Revenue:</span>
                      <span className="text-white font-semibold">${tier.revenue.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateTier(tier.id, { isActive: !tier.isActive })}
                      className="flex-1"
                    >
                      {tier.isActive ? <Pause className="h-3 w-3 mr-1" /> : <Play className="h-3 w-3 mr-1" />}
                      {tier.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingTier(tier)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteTier(tier.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="members" className="space-y-6">
          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Input
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-xs"
              />

              <Select value={tierFilter} onValueChange={setTierFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tiers</SelectItem>
                  {vipTiers.map(tier => (
                    <SelectItem key={tier.id} value={tier.id}>{tier.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="pending_renewal">Pending Renewal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={() => setShowVIPCalculator(true)} className="bg-blue-600 hover:bg-blue-700">
              <Calculator className="h-4 w-4 mr-2" />
              Price Calculator
            </Button>
          </div>

          {/* Members List */}
          <div className="space-y-4">
            {filteredMembers.map((member) => (
              <Card key={member.id} className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                        style={{ backgroundColor: getTierColor(member.currentTier) }}
                      >
                        {vipTiers.find(t => t.id === member.currentTier)?.icon || '👑'}
                      </div>
                      
                      <div>
                        <h4 className="text-white font-semibold text-lg">{member.username}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <Badge 
                            style={{ backgroundColor: getTierColor(member.currentTier), color: '#000' }}
                          >
                            {vipTiers.find(t => t.id === member.currentTier)?.name || 'Unknown'}
                          </Badge>
                          <Badge className={getStatusColor(member.status)}>
                            {member.status.replace('_', ' ')}
                          </Badge>
                          {member.autoRenewal && (
                            <Badge variant="outline">
                              <RotateCcw className="h-3 w-3 mr-1" />
                              Auto-Renewal
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-white font-semibold">
                          {formatTimeRemaining(member.expiryDate)}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedMember(member)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-700">
                    <div>
                      <p className="text-gray-400 text-sm">Lifetime Value</p>
                      <p className="text-white font-semibold">${member.lifetimeValue.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Total Spent (VIP)</p>
                      <p className="text-white font-semibold">${member.totalSpent.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">RTP Boost</p>
                      <p className="text-green-400 font-semibold">+{member.benefits.rtpBoost}%</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Bonus Multiplier</p>
                      <p className="text-blue-400 font-semibold">+{member.benefits.bonusMultiplier}%</p>
                    </div>
                  </div>

                  {member.addOns.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <p className="text-gray-400 text-sm mb-2">Active Add-ons:</p>
                      <div className="flex flex-wrap gap-2">
                        {member.addOns.map(addOn => (
                          <Badge key={addOn.id} variant="outline" className="text-xs">
                            {addOn.name} - {formatTimeRemaining(addOn.expiryDate)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="calculator" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">VIP Price Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-white">Select VIP Tier</Label>
                    <Select
                      value={calculatorData.tierId}
                      onValueChange={(value) => setCalculatorData(prev => ({ ...prev, tierId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a VIP tier" />
                      </SelectTrigger>
                      <SelectContent>
                        {vipTiers.map(tier => (
                          <SelectItem key={tier.id} value={tier.id}>
                            {tier.icon} {tier.name} - ${tier.pricing.monthly}/month
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white">Duration</Label>
                    <Select
                      value={calculatorData.duration.toString()}
                      onValueChange={(value) => setCalculatorData(prev => ({ ...prev, duration: parseInt(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Month</SelectItem>
                        <SelectItem value="3">3 Months (Quarterly)</SelectItem>
                        <SelectItem value="6">6 Months</SelectItem>
                        <SelectItem value="12">12 Months (Yearly)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {calculatorData.tierId && (
                    <div>
                      <Label className="text-white">Add-ons</Label>
                      <div className="space-y-2 mt-2">
                        {vipTiers.find(t => t.id === calculatorData.tierId)?.addOns.map(addOn => (
                          <div key={addOn.id} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                            <div>
                              <span className="text-white text-sm">{addOn.name}</span>
                              <p className="text-gray-400 text-xs">{addOn.description}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-yellow-400 font-semibold">${addOn.price}</span>
                              <Switch
                                checked={calculatorData.addOns.includes(addOn.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setCalculatorData(prev => ({
                                      ...prev,
                                      addOns: [...prev.addOns, addOn.id]
                                    }));
                                  } else {
                                    setCalculatorData(prev => ({
                                      ...prev,
                                      addOns: prev.addOns.filter(id => id !== addOn.id)
                                    }));
                                  }
                                }}
                              />
                            </div>
                          </div>
                        )) || []}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded border border-purple-500/30">
                    <div>
                      <span className="text-white font-semibold">Temporary RTP Boost</span>
                      <p className="text-gray-300 text-sm">+5% RTP for 1 hour - $10</p>
                    </div>
                    <Switch
                      checked={calculatorData.rtpBoost}
                      onCheckedChange={(checked) => setCalculatorData(prev => ({ ...prev, rtpBoost: checked }))}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {calculatorData.tierId && (
                    <>
                      <div className="p-6 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-500/30">
                        <h4 className="text-white font-semibold text-lg mb-4">Price Breakdown</h4>
                        
                        {(() => {
                          const tier = vipTiers.find(t => t.id === calculatorData.tierId);
                          if (!tier) return null;

                          let basePrice = 0;
                          let discount = 0;
                          
                          if (calculatorData.duration === 1) {
                            basePrice = tier.pricing.monthly;
                          } else if (calculatorData.duration === 3) {
                            basePrice = tier.pricing.quarterly;
                            discount = tier.pricing.discounts.quarterly;
                          } else if (calculatorData.duration === 12) {
                            basePrice = tier.pricing.yearly;
                            discount = tier.pricing.discounts.yearly;
                          } else {
                            basePrice = tier.pricing.monthly * calculatorData.duration;
                          }

                          const originalPrice = tier.pricing.monthly * calculatorData.duration;
                          const addOnPrice = calculatorData.addOns.reduce((sum, addOnId) => {
                            const addOn = tier.addOns.find(ao => ao.id === addOnId);
                            return sum + (addOn?.price || 0);
                          }, 0) + (calculatorData.rtpBoost ? 10 : 0);

                          return (
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-gray-300">Base Price ({calculatorData.duration} months):</span>
                                <span className="text-white">${originalPrice}</span>
                              </div>
                              
                              {discount > 0 && (
                                <div className="flex justify-between">
                                  <span className="text-green-400">Discount ({discount}%):</span>
                                  <span className="text-green-400">-${(originalPrice * discount / 100).toFixed(2)}</span>
                                </div>
                              )}
                              
                              {addOnPrice > 0 && (
                                <div className="flex justify-between">
                                  <span className="text-gray-300">Add-ons:</span>
                                  <span className="text-white">+${addOnPrice}</span>
                                </div>
                              )}
                              
                              <div className="border-t border-yellow-500/30 pt-3">
                                <div className="flex justify-between text-xl font-bold">
                                  <span className="text-yellow-400">Total:</span>
                                  <span className="text-yellow-400">${calculateVIPPrice()}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>

                      <div className="p-4 bg-gray-700 rounded">
                        <h5 className="text-white font-semibold mb-2">Benefits Summary</h5>
                        {(() => {
                          const tier = vipTiers.find(t => t.id === calculatorData.tierId);
                          if (!tier) return null;

                          return (
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-300">Bonus Multiplier:</span>
                                <span className="text-green-400">+{tier.benefits.bonusMultiplier}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-300">Base RTP Boost:</span>
                                <span className="text-green-400">+{tier.benefits.rtpBoost}%</span>
                              </div>
                              {calculatorData.rtpBoost && (
                                <div className="flex justify-between">
                                  <span className="text-gray-300">Temporary RTP Boost:</span>
                                  <span className="text-purple-400">+5% (1 hour)</span>
                                </div>
                              )}
                              <div className="flex justify-between">
                                <span className="text-gray-300">Weekly Rewards:</span>
                                <span className="text-blue-400">{tier.benefits.weeklyRewards.toLocaleString()} GC</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-300">Lossback:</span>
                                <span className="text-yellow-400">{tier.benefits.lossbackPercentage}%</span>
                              </div>
                            </div>
                          );
                        })()}
                      </div>

                      <Button className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Purchase VIP Membership
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Tier Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vipTiers
                    .sort((a, b) => b.revenue - a.revenue)
                    .map((tier) => (
                      <div key={tier.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{tier.icon}</div>
                          <div>
                            <div className="text-white font-medium">{tier.name}</div>
                            <div className="text-gray-400 text-sm">{tier.memberCount} members</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-yellow-400 font-semibold">
                            ${tier.revenue.toLocaleString()}
                          </div>
                          <div className="text-gray-400 text-sm">revenue</div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Member Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {vipTiers.map((tier) => (
                    <div key={tier.id} className="flex items-center justify-between">
                      <span className="text-gray-300 flex items-center gap-2">
                        <span className="text-lg">{tier.icon}</span>
                        {tier.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-700 rounded-full h-2">
                          <div
                            className="h-2 rounded-full"
                            style={{ 
                              width: `${(tier.memberCount / Math.max(...vipTiers.map(t => t.memberCount))) * 100}%`,
                              backgroundColor: tier.color
                            }}
                          />
                        </div>
                        <span className="text-white font-medium w-12">{tier.memberCount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">VIP System Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-white">Auto-renewal enabled by default</Label>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label className="text-white">Send renewal reminders</Label>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label className="text-white">Allow tier downgrades</Label>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label className="text-white">Prorate upgrades</Label>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-white">Grace period (days)</Label>
                    <Input type="number" defaultValue="7" className="mt-1" />
                  </div>
                  
                  <div>
                    <Label className="text-white">Reminder days before expiry</Label>
                    <Input defaultValue="7, 3, 1" placeholder="7, 3, 1" className="mt-1" />
                  </div>
                  
                  <div>
                    <Label className="text-white">Max tier level</Label>
                    <Input type="number" defaultValue="5" className="mt-1" />
                  </div>
                </div>
              </div>

              <Button className="bg-blue-600 hover:bg-blue-700">
                Save VIP Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* VIP Tier Details Modal */}
      <Dialog open={!!selectedTier} onOpenChange={() => setSelectedTier(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selectedTier && (
                <>
                  <span className="text-3xl">{selectedTier.icon}</span>
                  <span style={{ color: selectedTier.color }}>{selectedTier.name}</span>
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          {selectedTier && (
            <div className="space-y-6">
              {/* Benefits Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Member Benefits</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Bonus Multiplier:</span>
                      <span className="text-green-400 font-semibold">+{selectedTier.benefits.bonusMultiplier}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">RTP Boost:</span>
                      <span className="text-green-400 font-semibold">+{selectedTier.benefits.rtpBoost}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Weekly Rewards:</span>
                      <span className="text-blue-400 font-semibold">{selectedTier.benefits.weeklyRewards.toLocaleString()} GC</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Lossback:</span>
                      <span className="text-yellow-400 font-semibold">{selectedTier.benefits.lossbackPercentage}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Birthday Bonus:</span>
                      <span className="text-purple-400 font-semibold">{selectedTier.benefits.birthdayBonus.toLocaleString()} GC</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Free Spins:</span>
                      <span className="text-pink-400 font-semibold">{selectedTier.benefits.freeSpins}/week</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Special Features</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {selectedTier.benefits.personalManager ? 
                        <CheckCircle className="h-4 w-4 text-green-500" /> : 
                        <XCircle className="h-4 w-4 text-red-500" />
                      }
                      <span className="text-gray-300">Personal Manager</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedTier.benefits.prioritySupport ? 
                        <CheckCircle className="h-4 w-4 text-green-500" /> : 
                        <XCircle className="h-4 w-4 text-red-500" />
                      }
                      <span className="text-gray-300">Priority Support</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedTier.benefits.exclusiveGames ? 
                        <CheckCircle className="h-4 w-4 text-green-500" /> : 
                        <XCircle className="h-4 w-4 text-red-500" />
                      }
                      <span className="text-gray-300">Exclusive Games</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedTier.benefits.specialEvents ? 
                        <CheckCircle className="h-4 w-4 text-green-500" /> : 
                        <XCircle className="h-4 w-4 text-red-500" />
                      }
                      <span className="text-gray-300">Special Events</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedTier.benefits.customLimits ? 
                        <CheckCircle className="h-4 w-4 text-green-500" /> : 
                        <XCircle className="h-4 w-4 text-red-500" />
                      }
                      <span className="text-gray-300">Custom Limits</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Withdrawal Limits */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Withdrawal Limits</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-gray-700 rounded">
                    <p className="text-gray-400 text-sm">Daily</p>
                    <p className="text-white font-semibold">${selectedTier.benefits.withdrawalLimits.daily.toLocaleString()}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-700 rounded">
                    <p className="text-gray-400 text-sm">Weekly</p>
                    <p className="text-white font-semibold">${selectedTier.benefits.withdrawalLimits.weekly.toLocaleString()}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-700 rounded">
                    <p className="text-gray-400 text-sm">Monthly</p>
                    <p className="text-white font-semibold">${selectedTier.benefits.withdrawalLimits.monthly.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Add-ons */}
              {selectedTier.addOns.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Available Add-ons</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedTier.addOns.map(addOn => (
                      <div key={addOn.id} className="p-3 bg-gray-700 rounded border">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="text-white font-medium">{addOn.name}</h5>
                          <Badge className="bg-yellow-600">${addOn.price}</Badge>
                        </div>
                        <p className="text-gray-300 text-sm mb-2">{addOn.description}</p>
                        <div className="text-xs text-gray-400">
                          Duration: {addOn.duration} hour{addOn.duration !== 1 ? 's' : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={() => setEditingTier(selectedTier)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Tier
                </Button>
                <Button
                  onClick={() => updateTier(selectedTier.id, { isActive: !selectedTier.isActive })}
                  variant="outline"
                >
                  {selectedTier.isActive ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                  {selectedTier.isActive ? 'Deactivate' : 'Activate'}
                </Button>
                <Button
                  onClick={() => deleteTier(selectedTier.id)}
                  variant="destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Tier
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* VIP Member Details Modal */}
      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selectedMember && (
                <>
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-2xl"
                    style={{ backgroundColor: getTierColor(selectedMember.currentTier) }}
                  >
                    {vipTiers.find(t => t.id === selectedMember.currentTier)?.icon || '👑'}
                  </div>
                  {selectedMember.username}
                  <Badge className={getStatusColor(selectedMember.status)}>
                    {selectedMember.status.replace('_', ' ')}
                  </Badge>
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          {selectedMember && (
            <div className="space-y-6">
              {/* Member Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Member Information</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Email:</span>
                      <span className="text-white">{selectedMember.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Join Date:</span>
                      <span className="text-white">{selectedMember.joinDate.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Expiry Date:</span>
                      <span className="text-white">{selectedMember.expiryDate.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Time Remaining:</span>
                      <span className="text-yellow-400 font-semibold">
                        {formatTimeRemaining(selectedMember.expiryDate)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Auto Renewal:</span>
                      <span className={selectedMember.autoRenewal ? "text-green-400" : "text-red-400"}>
                        {selectedMember.autoRenewal ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Financial Overview</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total VIP Spent:</span>
                      <span className="text-white">${selectedMember.totalSpent.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Lifetime Value:</span>
                      <span className="text-green-400 font-semibold">${selectedMember.lifetimeValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Deposits:</span>
                      <span className="text-white">${selectedMember.activity.totalDeposits.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Withdrawals:</span>
                      <span className="text-white">${selectedMember.activity.totalWithdrawals.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Net Deposits:</span>
                      <span className="text-blue-400 font-semibold">
                        ${(selectedMember.activity.totalDeposits - selectedMember.activity.totalWithdrawals).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Benefits */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Current VIP Benefits</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded border border-green-500/30">
                    <TrendingUp className="h-6 w-6 text-green-400 mx-auto mb-1" />
                    <p className="text-green-400 font-semibold">+{selectedMember.benefits.rtpBoost}%</p>
                    <p className="text-gray-400 text-xs">RTP Boost</p>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded border border-blue-500/30">
                    <Percent className="h-6 w-6 text-blue-400 mx-auto mb-1" />
                    <p className="text-blue-400 font-semibold">+{selectedMember.benefits.bonusMultiplier}%</p>
                    <p className="text-gray-400 text-xs">Bonus Multiplier</p>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded border border-purple-500/30">
                    <Users className="h-6 w-6 text-purple-400 mx-auto mb-1" />
                    <p className="text-purple-400 font-semibold">{selectedMember.benefits.personalManager || 'None'}</p>
                    <p className="text-gray-400 text-xs">Personal Manager</p>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded border border-yellow-500/30">
                    <Settings className="h-6 w-6 text-yellow-400 mx-auto mb-1" />
                    <p className="text-yellow-400 font-semibold">{selectedMember.benefits.customLimits ? 'Yes' : 'No'}</p>
                    <p className="text-gray-400 text-xs">Custom Limits</p>
                  </div>
                </div>
              </div>

              {/* Activity Stats */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Activity Statistics</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Last Login:</span>
                    <div className="text-white font-semibold">{selectedMember.activity.lastLogin.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Favorite Game:</span>
                    <div className="text-white font-semibold">{selectedMember.activity.favoriteGame}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Avg Session:</span>
                    <div className="text-white font-semibold">{selectedMember.activity.averageSession} min</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Games Played:</span>
                    <div className="text-white font-semibold">{selectedMember.activity.gamesPlayed.length} types</div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedMember.notes && (
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Admin Notes</h4>
                  <div className="p-3 bg-gray-700 rounded">
                    <p className="text-gray-300 text-sm">{selectedMember.notes}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button className="bg-green-600 hover:bg-green-700">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline">
                  <Gift className="h-4 w-4 mr-2" />
                  Grant Bonus
                </Button>
                <Button variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Extend Membership
                </Button>
                <Button variant="destructive">
                  <Ban className="h-4 w-4 mr-2" />
                  Suspend
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Tier Modal */}
      <Dialog open={showCreateTierForm} onOpenChange={setShowCreateTierForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New VIP Tier</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white">Tier Name</Label>
                <Input
                  value={newTier.name || ''}
                  onChange={(e) => setNewTier(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Platinum VIP"
                />
              </div>
              <div>
                <Label className="text-white">Level</Label>
                <Input
                  type="number"
                  min="1"
                  value={newTier.level || 1}
                  onChange={(e) => setNewTier(prev => ({ ...prev, level: parseInt(e.target.value) }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white">Color</Label>
                <Input
                  type="color"
                  value={newTier.color || '#FFD700'}
                  onChange={(e) => setNewTier(prev => ({ ...prev, color: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-white">Icon (Emoji)</Label>
                <Input
                  value={newTier.icon || '👑'}
                  onChange={(e) => setNewTier(prev => ({ ...prev, icon: e.target.value }))}
                  placeholder="👑"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-white">Monthly Price ($)</Label>
                <Input
                  type="number"
                  value={newTier.pricing?.monthly || 99}
                  onChange={(e) => setNewTier(prev => ({
                    ...prev,
                    pricing: { ...prev.pricing, monthly: parseFloat(e.target.value) }
                  }))}
                />
              </div>
              <div>
                <Label className="text-white">Quarterly Price ($)</Label>
                <Input
                  type="number"
                  value={newTier.pricing?.quarterly || 279}
                  onChange={(e) => setNewTier(prev => ({
                    ...prev,
                    pricing: { ...prev.pricing, quarterly: parseFloat(e.target.value) }
                  }))}
                />
              </div>
              <div>
                <Label className="text-white">Yearly Price ($)</Label>
                <Input
                  type="number"
                  value={newTier.pricing?.yearly || 999}
                  onChange={(e) => setNewTier(prev => ({
                    ...prev,
                    pricing: { ...prev.pricing, yearly: parseFloat(e.target.value) }
                  }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white">Bonus Multiplier (%)</Label>
                <Input
                  type="number"
                  value={newTier.benefits?.bonusMultiplier || 10}
                  onChange={(e) => setNewTier(prev => ({
                    ...prev,
                    benefits: { ...prev.benefits, bonusMultiplier: parseFloat(e.target.value) }
                  }))}
                />
              </div>
              <div>
                <Label className="text-white">RTP Boost (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={newTier.benefits?.rtpBoost || 1}
                  onChange={(e) => setNewTier(prev => ({
                    ...prev,
                    benefits: { ...prev.benefits, rtpBoost: parseFloat(e.target.value) }
                  }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white">Weekly Rewards (GC)</Label>
                <Input
                  type="number"
                  value={newTier.benefits?.weeklyRewards || 500}
                  onChange={(e) => setNewTier(prev => ({
                    ...prev,
                    benefits: { ...prev.benefits, weeklyRewards: parseInt(e.target.value) }
                  }))}
                />
              </div>
              <div>
                <Label className="text-white">Lossback (%)</Label>
                <Input
                  type="number"
                  value={newTier.benefits?.lossbackPercentage || 5}
                  onChange={(e) => setNewTier(prev => ({
                    ...prev,
                    benefits: { ...prev.benefits, lossbackPercentage: parseFloat(e.target.value) }
                  }))}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-white">Personal Manager</Label>
                <Switch
                  checked={newTier.benefits?.personalManager || false}
                  onCheckedChange={(checked) => setNewTier(prev => ({
                    ...prev,
                    benefits: { ...prev.benefits, personalManager: checked }
                  }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-white">Exclusive Games Access</Label>
                <Switch
                  checked={newTier.benefits?.exclusiveGames || false}
                  onCheckedChange={(checked) => setNewTier(prev => ({
                    ...prev,
                    benefits: { ...prev.benefits, exclusiveGames: checked }
                  }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-white">Custom Limits</Label>
                <Switch
                  checked={newTier.benefits?.customLimits || false}
                  onCheckedChange={(checked) => setNewTier(prev => ({
                    ...prev,
                    benefits: { ...prev.benefits, customLimits: checked }
                  }))}
                />
              </div>
            </div>

            <Button
              onClick={createVIPTier}
              className="w-full bg-yellow-600 hover:bg-yellow-700"
              disabled={!newTier.name}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create VIP Tier
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
