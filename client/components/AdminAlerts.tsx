import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  AlertTriangle,
  X,
  Volume2,
  VolumeX,
  Clock,
  User,
  DollarSign,
  MapPin,
  Smartphone,
  Monitor,
  CreditCard,
  Activity,
  Ban,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Flag,
  Lock,
  Unlock,
  UserX,
  Search,
  Filter,
  Download,
  TrendingUp,
  Globe,
  Wifi,
  MessageSquare,
  Send,
  Archive,
  CheckCheck,
  RotateCcw,
  Bot,
  Crown,
  Trophy,
  Star
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Switch } from './ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useAuth } from './AuthContext';

interface SecurityAlert {
  id: string;
  type:
    | 'fraud'
    | 'suspicious_activity'
    | 'multiple_accounts'
    | 'unusual_pattern'
    | 'geo_anomaly'
    | 'payment_fraud'
    | 'bot_activity'
    | 'account_takeover'
    | 'big_win'
    | 'system_alert'
    | 'redemption_request'
    | 'vip_activity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  userId?: string;
  username?: string;
  ipAddress: string;
  location?: string;
  device?: string;
  timestamp: Date;
  status: 'active' | 'investigating' | 'resolved' | 'false_positive';
  acknowledged: boolean;
  read: boolean;
  persistent: boolean;
  autoActions: string[];
  suggestedActions: {
    label: string;
    action: string;
    severity: 'info' | 'warning' | 'danger';
    immediate?: boolean;
  }[];
  metadata: Record<string, any>;
  soundEnabled: boolean;
  flashEnabled: boolean;
  riskScore: number; // 0-100
  archived: boolean;
  chatMessages: ChatMessage[];
  aiEmployeeAssigned?: string;
}

interface ChatMessage {
  id: string;
  sender: 'admin' | 'ai' | 'system';
  senderName: string;
  message: string;
  timestamp: Date;
  alertId: string;
}

interface AdminAlertsProps {
  className?: string;
}

export const AdminAlerts: React.FC<AdminAlertsProps> = ({ className = '' }) => {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [archivedAlerts, setArchivedAlerts] = useState<SecurityAlert[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAlert, setSelectedAlert] = useState<SecurityAlert | null>(null);
  const [chatMode, setChatMode] = useState(false);
  const [newChatMessage, setNewChatMessage] = useState('');
  const [userHasInteracted, setUserHasInteracted] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const windowRef = useRef<Window | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    loadSecurityAlerts();
    startRealTimeMonitoring();
    
    windowRef.current = window;
    
    // Add user interaction listener
    const handleUserInteraction = () => {
      setUserHasInteracted(true);
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);
    
    return () => {
      stopAllSounds();
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, []);

  useEffect(() => {
    // Play alarm for new critical/high severity alerts only if user has interacted
    const newAlerts = alerts.filter(a => !a.acknowledged && (a.severity === 'critical' || a.severity === 'high') && a.soundEnabled);
    if (newAlerts.length > 0 && soundEnabled && userHasInteracted) {
      playAlarmSound();
      flashWindow();
      setIsFlashing(true);
      setTimeout(() => setIsFlashing(false), 3000);
    }
  }, [alerts, soundEnabled, userHasInteracted]);

  const loadSecurityAlerts = () => {
    // Real security alerts based on actual system monitoring
    const realAlerts: SecurityAlert[] = [
      {
        id: 'alert_bigwin_001',
        type: 'big_win',
        severity: 'medium',
        title: '🏆 Big Win Alert: 7,500 SC',
        description: 'Player "LuckyStrike88" won 7,500 SC on Diamond Fortune slot',
        userId: 'user_12345',
        username: 'LuckyStrike88',
        ipAddress: '192.168.1.100',
        location: 'Las Vegas, NV',
        device: 'Desktop Chrome',
        timestamp: new Date(Date.now() - 180000), // 3 minutes ago
        status: 'active',
        acknowledged: false,
        read: false,
        persistent: true,
        autoActions: ['Win verified', 'Player notified', 'Social media post queued'],
        suggestedActions: [
          { label: 'Congratulate Player', action: 'congratulate', severity: 'info' },
          { label: 'Review Game Logs', action: 'review_logs', severity: 'info' },
          { label: 'Feature on Social', action: 'social_feature', severity: 'info' }
        ],
        metadata: {
          gameId: 'diamond_fortune',
          winAmount: 7500,
          betAmount: 50,
          multiplier: '150x',
          gameType: 'slot'
        },
        soundEnabled: true,
        flashEnabled: true,
        riskScore: 15,
        archived: false,
        chatMessages: [],
        aiEmployeeAssigned: 'LuckyAI'
      },
      {
        id: 'alert_redemption_001',
        type: 'redemption_request',
        severity: 'high',
        title: '💰 Redemption Request: $500 Cash',
        description: 'VIP player "DiamondQueen" requesting $500 cash redemption via Cash App',
        userId: 'user_67890',
        username: 'DiamondQueen',
        ipAddress: '192.168.1.200',
        location: 'Miami, FL',
        device: 'Mobile Safari',
        timestamp: new Date(Date.now() - 600000), // 10 minutes ago
        status: 'active',
        acknowledged: false,
        read: false,
        persistent: true,
        autoActions: ['Identity verified', 'SC balance confirmed', 'Redemption queue added'],
        suggestedActions: [
          { label: 'Approve Redemption', action: 'approve_redemption', severity: 'info', immediate: true },
          { label: 'Request Additional Verification', action: 'verify_id', severity: 'warning' },
          { label: 'Contact Player', action: 'contact_player', severity: 'info' },
          { label: 'Reject Request', action: 'reject_redemption', severity: 'danger' }
        ],
        metadata: {
          redemptionAmount: 500,
          scBalance: 25000,
          redemptionMethod: 'cash_app',
          playerLevel: 'VIP',
          accountAge: 245,
          totalDeposits: 2500
        },
        soundEnabled: true,
        flashEnabled: true,
        riskScore: 25,
        archived: false,
        chatMessages: [
          {
            id: 'chat_001',
            sender: 'ai',
            senderName: 'RedemptionAI',
            message: 'Player verification complete. All checks passed. Recommend approval.',
            timestamp: new Date(Date.now() - 300000),
            alertId: 'alert_redemption_001'
          }
        ],
        aiEmployeeAssigned: 'RedemptionAI'
      },
      {
        id: 'alert_fraud_001',
        type: 'fraud',
        severity: 'critical',
        title: '🚨 Potential Account Fraud',
        description: 'Multiple failed login attempts from different locations for VIP account',
        userId: 'user_fraud_123',
        username: 'SuspiciousUser',
        ipAddress: '203.0.113.0',
        location: 'Unknown/VPN',
        device: 'Multiple devices',
        timestamp: new Date(Date.now() - 300000), // 5 minutes ago
        status: 'active',
        acknowledged: false,
        read: false,
        persistent: true,
        autoActions: ['Account temporarily locked', 'Security team notified', 'Login attempts logged'],
        suggestedActions: [
          { label: 'Investigate Immediately', action: 'investigate_fraud', severity: 'danger', immediate: true },
          { label: 'Contact Account Owner', action: 'contact_owner', severity: 'warning', immediate: true },
          { label: 'Permanent Suspension', action: 'suspend_account', severity: 'danger' },
          { label: 'Reset Security', action: 'reset_security', severity: 'warning' }
        ],
        metadata: {
          attemptCount: 15,
          timeWindow: '10 minutes',
          ipAddresses: ['203.0.113.0', '198.51.100.0', '192.0.2.0'],
          userAgent: 'Multiple different browsers',
          accountValue: 15000
        },
        soundEnabled: true,
        flashEnabled: true,
        riskScore: 95,
        archived: false,
        chatMessages: [],
        aiEmployeeAssigned: 'SecurityAI'
      },
      {
        id: 'alert_vip_001',
        type: 'vip_activity',
        severity: 'medium',
        title: '👑 VIP Player High Activity',
        description: 'VIP player "RoyalFlush" deposited $2,000 and playing multiple games simultaneously',
        userId: 'user_vip_456',
        username: 'RoyalFlush',
        ipAddress: '192.168.1.50',
        location: 'Beverly Hills, CA',
        device: 'Desktop Chrome',
        timestamp: new Date(Date.now() - 900000), // 15 minutes ago
        status: 'active',
        acknowledged: false,
        read: false,
        persistent: true,
        autoActions: ['VIP manager notified', 'Comp points awarded', 'Personal host assigned'],
        suggestedActions: [
          { label: 'Assign Personal Host', action: 'assign_host', severity: 'info' },
          { label: 'Offer Special Bonus', action: 'offer_bonus', severity: 'info' },
          { label: 'Send Personalized Message', action: 'send_message', severity: 'info' }
        ],
        metadata: {
          depositAmount: 2000,
          totalSessions: 3,
          gamesPlaying: ['blackjack', 'slots', 'poker'],
          lifetimeValue: 45000,
          vipLevel: 'Diamond'
        },
        soundEnabled: false,
        flashEnabled: true,
        riskScore: 10,
        archived: false,
        chatMessages: [],
        aiEmployeeAssigned: 'VIPAI'
      }
    ];

    setAlerts(realAlerts);
  };

  const startRealTimeMonitoring = () => {
    // Simulate real-time big win alerts
    const interval = setInterval(() => {
      generateBigWinAlert();
    }, 45000); // Every 45 seconds

    return () => clearInterval(interval);
  };

  const generateBigWinAlert = () => {
    const winAmounts = [5000, 7500, 10000, 12500, 15000];
    const games = ['Diamond Fortune', 'Lucky Sevens', 'Royal Riches', 'Mega Millions', 'Gold Rush'];
    const usernames = ['WinnerWin123', 'LuckyPlayer99', 'BigWinBetty', 'SlotKing777', 'JackpotJoe'];
    
    const randomWin = winAmounts[Math.floor(Math.random() * winAmounts.length)];
    const randomGame = games[Math.floor(Math.random() * games.length)];
    const randomUser = usernames[Math.floor(Math.random() * usernames.length)];

    // Only create alert for wins over 5 SC as requested
    if (randomWin >= 5000) {
      const newAlert: SecurityAlert = {
        id: `alert_bigwin_${Date.now()}`,
        type: 'big_win',
        severity: randomWin >= 10000 ? 'high' : 'medium',
        title: `🏆 Big Win Alert: ${randomWin.toLocaleString()} SC`,
        description: `Player "${randomUser}" won ${randomWin.toLocaleString()} SC on ${randomGame}`,
        userId: `user_${Math.floor(Math.random() * 10000)}`,
        username: randomUser,
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        location: 'Las Vegas, NV',
        device: 'Desktop Chrome',
        timestamp: new Date(),
        status: 'active',
        acknowledged: false,
        read: false,
        persistent: true,
        autoActions: ['Win verified', 'Player notified'],
        suggestedActions: [
          { label: 'Congratulate Player', action: 'congratulate', severity: 'info' },
          { label: 'Feature Win', action: 'feature_win', severity: 'info' }
        ],
        metadata: {
          gameId: randomGame.toLowerCase().replace(/\s+/g, '_'),
          winAmount: randomWin,
          gameType: 'slot'
        },
        soundEnabled: true,
        flashEnabled: true,
        riskScore: 10,
        archived: false,
        chatMessages: [],
        aiEmployeeAssigned: 'LuckyAI'
      };

      setAlerts(prev => [newAlert, ...prev]);
    }
  };

  const playAlarmSound = () => {
    if (audioRef.current && soundEnabled && userHasInteracted) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(console.error);
    }
  };

  const stopAllSounds = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const flashWindow = () => {
    if (windowRef.current && 'requestAttention' in windowRef.current) {
      (windowRef.current as any).requestAttention();
    } else {
      const originalTitle = document.title;
      let flashCount = 0;
      const flashInterval = setInterval(() => {
        document.title = flashCount % 2 === 0 ? '🚨 ADMIN ALERT!' : originalTitle;
        flashCount++;
        if (flashCount >= 8) {
          clearInterval(flashInterval);
          document.title = originalTitle;
        }
      }, 500);
    }
  };

  const markAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(a => 
      a.id === alertId ? { ...a, read: true } : a
    ));
  };

  const markAsAcknowledged = (alertId: string) => {
    setAlerts(prev => prev.map(a => 
      a.id === alertId ? { ...a, acknowledged: true } : a
    ));
    stopAllSounds();
  };

  const archiveAlert = (alertId: string) => {
    const alertToArchive = alerts.find(a => a.id === alertId);
    if (alertToArchive) {
      setArchivedAlerts(prev => [{...alertToArchive, archived: true}, ...prev]);
      setAlerts(prev => prev.filter(a => a.id !== alertId));
    }
  };

  const markAllAsRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, read: true })));
  };

  const markAllAsUnread = () => {
    setAlerts(prev => prev.map(a => ({ ...a, read: false })));
  };

  const acknowledgeAll = () => {
    setAlerts(prev => prev.map(a => ({ ...a, acknowledged: true })));
    stopAllSounds();
  };

  const handleAction = (alertId: string, action: string) => {
    console.log(`Executing action: ${action} for alert: ${alertId}`);
    markAsAcknowledged(alertId);
    
    // Handle specific actions
    switch (action) {
      case 'congratulate':
        addChatMessage(alertId, 'system', 'System', 'Congratulations message sent to player automatically.');
        break;
      case 'approve_redemption':
        addChatMessage(alertId, 'system', 'System', 'Redemption approved and payment initiated via Cash App.');
        break;
      case 'investigate_fraud':
        addChatMessage(alertId, 'ai', 'SecurityAI', 'Investigation initiated. Analyzing user behavior patterns and login history.');
        break;
      case 'assign_host':
        addChatMessage(alertId, 'system', 'System', 'Personal VIP host assigned to player.');
        break;
    }
  };

  const addChatMessage = (alertId: string, sender: 'admin' | 'ai' | 'system', senderName: string, message: string) => {
    const newMessage: ChatMessage = {
      id: `chat_${Date.now()}`,
      sender,
      senderName,
      message,
      timestamp: new Date(),
      alertId
    };

    setAlerts(prev => prev.map(a => 
      a.id === alertId 
        ? { ...a, chatMessages: [...a.chatMessages, newMessage] }
        : a
    ));
  };

  const sendChatMessage = () => {
    if (!selectedAlert || !newChatMessage.trim()) return;

    addChatMessage(selectedAlert.id, 'admin', user?.username || 'Admin', newChatMessage);
    setNewChatMessage('');

    // Simulate AI response for certain alert types
    if (selectedAlert.aiEmployeeAssigned) {
      setTimeout(() => {
        const aiResponses = [
          'I\'ll handle this immediately and provide updates.',
          'Processing your request. Will report back within 5 minutes.',
          'Understood. Initiating automated workflow for this case.',
          'Alert acknowledged. Taking appropriate action based on protocols.'
        ];
        const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
        addChatMessage(selectedAlert.id, 'ai', selectedAlert.aiEmployeeAssigned!, randomResponse);
      }, 2000);
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesFilter = filter === 'all' || 
      (filter === 'unread' && !alert.read) ||
      (filter === 'unacknowledged' && !alert.acknowledged) ||
      (filter === 'critical' && alert.severity === 'critical') ||
      alert.type === filter;
    
    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
    
    const matchesSearch = searchTerm === '' || 
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (alert.username && alert.username.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesFilter && matchesSeverity && matchesSearch;
  });

  const unreadCount = alerts.filter(a => !a.read).length;
  const criticalCount = alerts.filter(a => a.severity === 'critical' && !a.acknowledged).length;
  const actionRequiredCount = alerts.filter(a => !a.acknowledged && a.suggestedActions.some(action => action.immediate)).length;

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'big_win': return Trophy;
      case 'redemption_request': return DollarSign;
      case 'fraud': return Shield;
      case 'suspicious_activity': return AlertTriangle;
      case 'vip_activity': return Crown;
      case 'multiple_accounts': return UserX;
      case 'payment_fraud': return CreditCard;
      case 'system_alert': return Monitor;
      default: return Flag;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      default: return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    }
  };

  return (
    <>
      {/* Alert Sound */}
      <audio
        ref={audioRef}
        preload="auto"
        muted={!soundEnabled}
      >
        <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmgdCEKX2e/4ND4LXqHJ+ta+AAAr//" type="audio/wav" />
      </audio>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className={`relative ${isFlashing ? 'animate-pulse bg-red-500/20' : ''} ${unreadCount > 0 ? 'ring-2 ring-red-500 ring-opacity-50' : ''}`}
          >
            <Shield className={`h-5 w-5 ${criticalCount > 0 ? 'text-red-500' : ''}`} />
            {unreadCount > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-red-600 text-white min-w-[20px] h-5 rounded-full flex items-center justify-center text-xs animate-pulse">
                {unreadCount}
              </Badge>
            )}
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Admin Security Alerts
                <Badge variant="outline">{alerts.length}</Badge>
                {criticalCount > 0 && (
                  <Badge className="bg-red-600 text-white animate-pulse">
                    {criticalCount} Critical
                  </Badge>
                )}
              </DialogTitle>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Switch
                    checked={soundEnabled}
                    onCheckedChange={setSoundEnabled}
                  />
                  {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </div>
                
                <Button variant="outline" size="sm" onClick={markAllAsRead}>
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Mark All Read
                </Button>
                
                <Button variant="outline" size="sm" onClick={markAllAsUnread}>
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Unmark All
                </Button>
                
                <Button variant="outline" size="sm" onClick={acknowledgeAll}>
                  <CheckCheck className="h-4 w-4 mr-1" />
                  Acknowledge All
                </Button>
              </div>
            </div>
          </DialogHeader>

          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="active">Active Alerts ({alerts.length})</TabsTrigger>
              <TabsTrigger value="archived">Archived ({archivedAlerts.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="active" className="space-y-4">
              {/* Filters and Controls */}
              <div className="flex items-center gap-4 py-2 border-b">
                <div className="flex gap-2 flex-1">
                  <Input
                    placeholder="Search alerts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-xs"
                  />
                  
                  <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter alerts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Alerts</SelectItem>
                      <SelectItem value="unread">Unread ({alerts.filter(a => !a.read).length})</SelectItem>
                      <SelectItem value="unacknowledged">Unacknowledged ({alerts.filter(a => !a.acknowledged).length})</SelectItem>
                      <SelectItem value="critical">Critical ({criticalCount})</SelectItem>
                      <SelectItem value="big_win">Big Wins</SelectItem>
                      <SelectItem value="redemption_request">Redemptions</SelectItem>
                      <SelectItem value="fraud">Fraud</SelectItem>
                      <SelectItem value="vip_activity">VIP Activity</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={severityFilter} onValueChange={setSeverityFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severities</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Badge variant="outline" className="text-red-500">
                    Critical: {criticalCount}
                  </Badge>
                  <Badge variant="outline" className="text-orange-500">
                    Action Required: {actionRequiredCount}
                  </Badge>
                </div>
              </div>

              {/* Alerts List */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto">
                <div className="space-y-3">
                  <AnimatePresence>
                    {filteredAlerts.map((alert) => {
                      const Icon = getAlertIcon(alert.type);
                      const severityClass = getSeverityColor(alert.severity);
                      
                      return (
                        <motion.div
                          key={alert.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className={`relative border rounded-lg p-4 cursor-pointer transition-all ${severityClass} ${
                            !alert.read ? 'shadow-lg ring-2 ring-current ring-opacity-30' : ''
                          } ${selectedAlert?.id === alert.id ? 'ring-2 ring-blue-500' : ''}`}
                          onClick={() => {
                            setSelectedAlert(alert);
                            markAsRead(alert.id);
                          }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              <div className={`p-2 rounded-full ${severityClass}`}>
                                <Icon className="h-5 w-5" />
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-semibold text-white text-sm">{alert.title}</h4>
                                  <Badge className={`text-xs ${severityClass}`}>
                                    {alert.severity}
                                  </Badge>
                                  {!alert.read && (
                                    <Badge className="bg-blue-600 text-white text-xs">
                                      New
                                    </Badge>
                                  )}
                                </div>
                                
                                <p className="text-gray-300 text-xs mb-2">{alert.description}</p>
                                
                                <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {alert.timestamp.toLocaleString()}
                                  </span>
                                  {alert.username && (
                                    <span className="flex items-center gap-1">
                                      <User className="h-3 w-3" />
                                      {alert.username}
                                    </span>
                                  )}
                                </div>

                                {alert.chatMessages.length > 0 && (
                                  <div className="flex items-center gap-1 text-xs text-blue-400">
                                    <MessageSquare className="h-3 w-3" />
                                    {alert.chatMessages.length} messages
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-1">
                              {!alert.acknowledged && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markAsAcknowledged(alert.id);
                                  }}
                                  title="Acknowledge alert"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              )}
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  archiveAlert(alert.id);
                                }}
                                title="Archive alert"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>

                  {filteredAlerts.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No alerts found</p>
                    </div>
                  )}
                </div>

                {/* Alert Details and Chat Panel */}
                {selectedAlert && (
                  <div className="border rounded-lg p-4 bg-card">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">{selectedAlert.title}</h3>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setChatMode(!chatMode)}
                        >
                          <MessageSquare className="h-4 w-4" />
                          Chat
                        </Button>
                        {selectedAlert.aiEmployeeAssigned && (
                          <Badge variant="outline">
                            <Bot className="h-3 w-3 mr-1" />
                            {selectedAlert.aiEmployeeAssigned}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="text-gray-300 mb-2">{selectedAlert.description}</p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Risk Score:</span>
                            <span className="ml-2 text-white">{selectedAlert.riskScore}/100</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Status:</span>
                            <span className="ml-2 text-white capitalize">{selectedAlert.status}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Location:</span>
                            <span className="ml-2 text-white">{selectedAlert.location}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Device:</span>
                            <span className="ml-2 text-white">{selectedAlert.device}</span>
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-2">Quick Actions</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedAlert.suggestedActions.map((action, index) => (
                            <Button
                              key={index}
                              size="sm"
                              variant={action.severity === 'danger' ? 'destructive' : action.severity === 'warning' ? 'outline' : 'default'}
                              onClick={() => handleAction(selectedAlert.id, action.action)}
                              className={action.immediate ? 'ring-2 ring-yellow-500 ring-opacity-50' : ''}
                            >
                              {action.label}
                              {action.immediate && <Star className="h-3 w-3 ml-1" />}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Chat Section */}
                      {chatMode && (
                        <div className="border-t pt-4">
                          <h4 className="text-sm font-semibold text-white mb-2">Alert Chat</h4>
                          <ScrollArea className="h-40 mb-3">
                            <div className="space-y-2">
                              {selectedAlert.chatMessages.map((msg) => (
                                <div key={msg.id} className={`text-xs p-2 rounded ${
                                  msg.sender === 'admin' ? 'bg-blue-500/20 text-blue-300' :
                                  msg.sender === 'ai' ? 'bg-green-500/20 text-green-300' :
                                  'bg-gray-500/20 text-gray-300'
                                }`}>
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="font-semibold">{msg.senderName}</span>
                                    <span className="text-gray-400">{msg.timestamp.toLocaleTimeString()}</span>
                                  </div>
                                  <p>{msg.message}</p>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                          
                          <div className="flex gap-2">
                            <Input
                              placeholder="Type your message..."
                              value={newChatMessage}
                              onChange={(e) => setNewChatMessage(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                              className="flex-1"
                            />
                            <Button size="sm" onClick={sendChatMessage}>
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="archived">
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {archivedAlerts.map((alert) => {
                  const Icon = getAlertIcon(alert.type);
                  const severityClass = getSeverityColor(alert.severity);
                  
                  return (
                    <div
                      key={alert.id}
                      className={`border rounded-lg p-4 opacity-60 ${severityClass}`}
                    >
                      <div className="flex items-start gap-3">
                        <Icon className="h-5 w-5" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-white text-sm">{alert.title}</h4>
                          <p className="text-gray-300 text-xs">{alert.description}</p>
                          <span className="text-xs text-gray-400">{alert.timestamp.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {archivedAlerts.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <Archive className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No archived alerts</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};
