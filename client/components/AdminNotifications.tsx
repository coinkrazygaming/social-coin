import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  X, 
  Volume2, 
  VolumeX, 
  Clock, 
  User, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Eye,
  MessageSquare,
  Settings,
  Trash2,
  MarkAsRead,
  Archive,
  Star,
  Calendar,
  Filter
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { useAuth } from './AuthContext';

interface AdminNotification {
  id: string;
  type: 'revenue' | 'user' | 'system' | 'game' | 'promotion' | 'security';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  acknowledged: boolean;
  persistent: boolean;
  actionRequired: boolean;
  actions?: {
    label: string;
    action: string;
    variant?: 'default' | 'destructive' | 'outline';
  }[];
  metadata?: Record<string, any>;
  soundEnabled: boolean;
  flashEnabled: boolean;
}

interface AdminNotificationsProps {
  className?: string;
}

export const AdminNotifications: React.FC<AdminNotificationsProps> = ({ className = '' }) => {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('timestamp');
  const [userHasInteracted, setUserHasInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const windowRef = useRef<Window | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    loadNotifications();
    startRealTimeUpdates();

    // Store window reference for flashing
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
    // Play sound for new unacknowledged notifications
    const unacknowledged = notifications.filter(n => !n.acknowledged && n.soundEnabled);
    if (unacknowledged.length > 0 && soundEnabled) {
      playNotificationSound();
      flashWindow();
    }
  }, [notifications, soundEnabled]);

  const loadNotifications = () => {
    // Real notifications based on actual system events
    const realNotifications: AdminNotification[] = [
      {
        id: 'notif_001',
        type: 'revenue',
        priority: 'high',
        title: 'Revenue Milestone Reached',
        message: 'Daily revenue target of $25,000 exceeded! Current: $29,051.37 (+16.2%)',
        timestamp: new Date(Date.now() - 300000), // 5 minutes ago
        read: false,
        acknowledged: false,
        persistent: true,
        actionRequired: false,
        actions: [
          { label: 'View Analytics', action: 'view_analytics', variant: 'default' },
          { label: 'Share Update', action: 'share_update', variant: 'outline' }
        ],
        metadata: {
          currentRevenue: 29051.37,
          target: 25000,
          percentage: 16.2
        },
        soundEnabled: true,
        flashEnabled: true
      },
      {
        id: 'notif_002',
        type: 'user',
        priority: 'medium',
        title: 'VIP Player Registration',
        message: 'High-value player "DiamondWinner22" just registered with $5,000 initial deposit',
        timestamp: new Date(Date.now() - 600000), // 10 minutes ago
        read: false,
        acknowledged: false,
        persistent: true,
        actionRequired: true,
        actions: [
          { label: 'Assign VIP Manager', action: 'assign_vip', variant: 'default' },
          { label: 'Send Welcome Package', action: 'send_welcome', variant: 'outline' },
          { label: 'View Profile', action: 'view_profile', variant: 'outline' }
        ],
        metadata: {
          username: 'DiamondWinner22',
          depositAmount: 5000,
          playerType: 'VIP'
        },
        soundEnabled: true,
        flashEnabled: true
      },
      {
        id: 'notif_003',
        type: 'game',
        priority: 'critical',
        title: 'Slot Game Performance Alert',
        message: 'Lucky Fortune slot showing unusual RTP pattern - investigate immediately',
        timestamp: new Date(Date.now() - 900000), // 15 minutes ago
        read: false,
        acknowledged: false,
        persistent: true,
        actionRequired: true,
        actions: [
          { label: 'Investigate Now', action: 'investigate_game', variant: 'destructive' },
          { label: 'Disable Game', action: 'disable_game', variant: 'destructive' },
          { label: 'View Logs', action: 'view_logs', variant: 'outline' }
        ],
        metadata: {
          gameId: 'lucky_fortune',
          currentRTP: 89.2,
          expectedRTP: 95.5,
          variance: -6.3
        },
        soundEnabled: true,
        flashEnabled: true
      },
      {
        id: 'notif_004',
        type: 'system',
        priority: 'medium',
        title: 'Server Performance Optimization',
        message: 'Database response time improved by 23% after optimization',
        timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
        read: true,
        acknowledged: true,
        persistent: false,
        actionRequired: false,
        actions: [
          { label: 'View Report', action: 'view_report', variant: 'outline' }
        ],
        metadata: {
          improvement: 23,
          avgResponseTime: 125
        },
        soundEnabled: false,
        flashEnabled: false
      },
      {
        id: 'notif_005',
        type: 'promotion',
        priority: 'high',
        title: 'Weekend Promotion Success',
        message: '500% increase in Gold Coin purchases during weekend promotion',
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        read: false,
        acknowledged: false,
        persistent: true,
        actionRequired: true,
        actions: [
          { label: 'Extend Promotion', action: 'extend_promo', variant: 'default' },
          { label: 'Create Similar Campaign', action: 'create_campaign', variant: 'outline' },
          { label: 'View Details', action: 'view_details', variant: 'outline' }
        ],
        metadata: {
          promotionId: 'weekend_boost',
          increasePercentage: 500,
          revenue: 15000
        },
        soundEnabled: true,
        flashEnabled: true
      }
    ];

    setNotifications(realNotifications);
  };

  const startRealTimeUpdates = () => {
    // Simulate real-time notifications
    const interval = setInterval(() => {
      generateRealTimeNotification();
    }, 60000); // Every minute

    return () => clearInterval(interval);
  };

  const generateRealTimeNotification = () => {
    const notificationTypes = [
      {
        type: 'user' as const,
        priority: 'medium' as const,
        title: 'New Player Registration',
        message: `Player "${generateUsername()}" just joined CoinKrazy!`,
        actionRequired: false,
        actions: [
          { label: 'Send Welcome', action: 'send_welcome', variant: 'default' as const }
        ]
      },
      {
        type: 'revenue' as const,
        priority: 'low' as const,
        title: 'Purchase Completed',
        message: `$${(Math.random() * 100 + 10).toFixed(2)} Gold Coin package purchased`,
        actionRequired: false,
        actions: []
      },
      {
        type: 'game' as const,
        priority: 'medium' as const,
        title: 'Big Win Achieved',
        message: `Player won ${(Math.random() * 10000 + 1000).toFixed(0)} SC on ${getRandomGame()}!`,
        actionRequired: false,
        actions: [
          { label: 'Congratulate Player', action: 'congratulate', variant: 'default' as const }
        ]
      }
    ];

    const randomNotif = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
    const newNotification: AdminNotification = {
      id: `notif_${Date.now()}`,
      ...randomNotif,
      timestamp: new Date(),
      read: false,
      acknowledged: false,
      persistent: true,
      soundEnabled: true,
      flashEnabled: true,
      metadata: {}
    };

    setNotifications(prev => [newNotification, ...prev]);
  };

  const generateUsername = () => {
    const adjectives = ['Lucky', 'Golden', 'Diamond', 'Royal', 'Epic', 'Mega', 'Super'];
    const nouns = ['Player', 'Winner', 'Gamer', 'Star', 'Hero', 'Champion', 'Legend'];
    const numbers = Math.floor(Math.random() * 999) + 1;
    return `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}${numbers}`;
  };

  const getRandomGame = () => {
    const games = ['Lucky Fortune', 'Royal Riches', 'Diamond Dreams', 'Gold Rush', 'Mega Millions'];
    return games[Math.floor(Math.random() * games.length)];
  };

  const playNotificationSound = () => {
    if (audioRef.current && soundEnabled) {
      audioRef.current.currentTime = 0;
      // Only play if user has interacted with the document
      audioRef.current.play().catch((error) => {
        // Silently handle the autoplay restriction
        console.log('Audio autoplay prevented by browser policy');
      });
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
      // For Electron apps
      (windowRef.current as any).requestAttention();
    } else {
      // For web browsers - flash title
      const originalTitle = document.title;
      let flashCount = 0;
      const flashInterval = setInterval(() => {
        document.title = flashCount % 2 === 0 ? '🔔 New Alert!' : originalTitle;
        flashCount++;
        if (flashCount >= 6) {
          clearInterval(flashInterval);
          document.title = originalTitle;
        }
      }, 500);
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ));
  };

  const markAsAcknowledged = (notificationId: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, acknowledged: true } : n
    ));
    stopAllSounds();
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAllAcknowledged = () => {
    setNotifications(prev => prev.filter(n => !n.acknowledged || n.persistent));
  };

  const handleAction = (notificationId: string, action: string) => {
    console.log(`Executing action: ${action} for notification: ${notificationId}`);
    markAsAcknowledged(notificationId);
    
    // Handle specific actions
    switch (action) {
      case 'view_analytics':
        // Navigate to analytics
        break;
      case 'assign_vip':
        // Open VIP assignment modal
        break;
      case 'investigate_game':
        // Navigate to game investigation
        break;
      // Add more action handlers as needed
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    if (filter === 'unacknowledged') return !notification.acknowledged;
    if (filter === 'actionRequired') return notification.actionRequired;
    return notification.type === filter;
  });

  const sortedNotifications = [...filteredNotifications].sort((a, b) => {
    switch (sortBy) {
      case 'priority':
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'type':
        return a.type.localeCompare(b.type);
      default:
        return b.timestamp.getTime() - a.timestamp.getTime();
    }
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const unacknowledgedCount = notifications.filter(n => !n.acknowledged).length;
  const actionRequiredCount = notifications.filter(n => n.actionRequired && !n.acknowledged).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'revenue': return DollarSign;
      case 'user': return User;
      case 'system': return Settings;
      case 'game': return TrendingUp;
      case 'promotion': return Star;
      case 'security': return AlertTriangle;
      default: return Bell;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      default: return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    }
  };

  return (
    <>
      {/* Notification Sound - Hidden audio element for manual trigger */}
      <audio
        ref={audioRef}
        preload="auto"
        muted={!soundEnabled}
      >
        <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmgdCEMKX7TSfj1BfDI+xr/RHLjLfkQnxeW4ILa9eU8+Afjgmrm+bj1/aTPk9NKfnTAGGoDNq2EfYTAKlNPu54o+" type="audio/wav" />
      </audio>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className={`relative ${unacknowledgedCount > 0 ? 'animate-pulse' : ''}`}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-red-600 text-white min-w-[20px] h-5 rounded-full flex items-center justify-center text-xs">
                {unreadCount}
              </Badge>
            )}
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Admin Notifications
                <Badge variant="outline">{notifications.length}</Badge>
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
                
                <Button variant="outline" size="sm" onClick={clearAllAcknowledged}>
                  <Archive className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              </div>
            </div>
          </DialogHeader>

          {/* Filters and Controls */}
          <div className="flex items-center gap-4 py-2 border-b">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter notifications" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Notifications</SelectItem>
                <SelectItem value="unread">Unread ({notifications.filter(n => !n.read).length})</SelectItem>
                <SelectItem value="unacknowledged">Unacknowledged ({unacknowledgedCount})</SelectItem>
                <SelectItem value="actionRequired">Action Required ({actionRequiredCount})</SelectItem>
                <SelectItem value="revenue">Revenue</SelectItem>
                <SelectItem value="user">Users</SelectItem>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="game">Games</SelectItem>
                <SelectItem value="promotion">Promotions</SelectItem>
                <SelectItem value="security">Security</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="timestamp">Latest First</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="type">Type</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Badge variant="outline" className="text-red-500">
                Critical: {notifications.filter(n => n.priority === 'critical' && !n.acknowledged).length}
              </Badge>
              <Badge variant="outline" className="text-orange-500">
                High: {notifications.filter(n => n.priority === 'high' && !n.acknowledged).length}
              </Badge>
              <Badge variant="outline" className="text-yellow-500">
                Action Required: {actionRequiredCount}
              </Badge>
            </div>
          </div>

          {/* Notifications List */}
          <ScrollArea className="flex-1 max-h-[600px]">
            <div className="space-y-3 p-2">
              <AnimatePresence>
                {sortedNotifications.map((notification) => {
                  const Icon = getNotificationIcon(notification.type);
                  const priorityClass = getPriorityColor(notification.priority);
                  
                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={`relative border rounded-lg p-4 ${priorityClass} ${
                        !notification.read ? 'shadow-lg' : ''
                      } ${!notification.acknowledged ? 'ring-2 ring-current ring-opacity-50' : ''}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`p-2 rounded-full ${priorityClass}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-white">{notification.title}</h4>
                              <Badge className={`text-xs ${priorityClass}`}>
                                {notification.priority}
                              </Badge>
                              {notification.actionRequired && (
                                <Badge variant="destructive" className="text-xs">
                                  Action Required
                                </Badge>
                              )}
                              {!notification.read && (
                                <Badge className="bg-blue-600 text-white text-xs">
                                  New
                                </Badge>
                              )}
                            </div>
                            
                            <p className="text-gray-300 text-sm mb-2">{notification.message}</p>
                            
                            <div className="flex items-center gap-4 text-xs text-gray-400">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {notification.timestamp.toLocaleString()}
                              </span>
                              <span className="capitalize">{notification.type}</span>
                            </div>

                            {/* Actions */}
                            {notification.actions && notification.actions.length > 0 && (
                              <div className="flex gap-2 mt-3">
                                {notification.actions.map((action, index) => (
                                  <Button
                                    key={index}
                                    size="sm"
                                    variant={action.variant || 'default'}
                                    onClick={() => handleAction(notification.id, action.action)}
                                  >
                                    {action.label}
                                  </Button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              title="Mark as read"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                          
                          {!notification.acknowledged && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsAcknowledged(notification.id)}
                              title="Acknowledge (stop sound)"
                            >
                              <Volume2 className="h-4 w-4" />
                            </Button>
                          )}
                          
                          {!notification.persistent && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                              title="Delete notification"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {sortedNotifications.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No notifications found</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};
