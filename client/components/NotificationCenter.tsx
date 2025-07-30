import React, { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Bell,
  MessageSquare,
  Shield,
  Bot,
  User,
  Crown,
  Settings,
  X,
  Send,
  AlertTriangle,
  CheckCircle,
  Info,
  Star,
  Users,
  Clock,
  Eye,
  Volume2,
  VolumeX,
  Filter,
} from "lucide-react";
import { useAuth } from "./AuthContext";
import {
  DatabaseService,
  subscribeToNotifications,
  subscribeToGlobalNotifications,
  subscribeToAdminAlerts,
  Notification,
  ChatMessage,
  AdminAlert,
} from "@shared/database";

interface NotificationCenterProps {
  className?: string;
}

export function NotificationCenter({ className }: NotificationCenterProps) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [adminAlerts, setAdminAlerts] = useState<AdminAlert[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadAlertsCount, setUnreadAlertsCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showAdminAlerts, setShowAdminAlerts] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "notifications" | "chat" | "alerts"
  >("notifications");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [chatMessage, setChatMessage] = useState("");
  const [chatChannel, setChatChannel] = useState<"global" | "support" | "vip">(
    "global",
  );
  const [notificationFilter, setNotificationFilter] = useState<
    "all" | "unread" | "system" | "ai" | "admin"
  >("all");

  const audioRef = useRef<HTMLAudioElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load initial data
  useEffect(() => {
    if (!user?.id) return;

    loadNotifications();
    if (user.role === "admin" || user.role === "staff") {
      loadAdminAlerts();
    }
    loadChatMessages();

    // Subscribe to real-time updates
    const notificationSub = subscribeToNotifications(
      user.id,
      handleNewNotification,
    );
    const globalNotificationSub = subscribeToGlobalNotifications(
      handleNewNotification,
    );
    const adminAlertSub =
      user.role === "admin" || user.role === "staff"
        ? subscribeToAdminAlerts(handleNewAdminAlert)
        : null;

    return () => {
      notificationSub.unsubscribe();
      globalNotificationSub.unsubscribe();
      adminAlertSub?.unsubscribe();
    };
  }, [user?.id]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const loadNotifications = async () => {
    if (!user?.id) return;

    try {
      const data = await DatabaseService.getUserNotifications(user.id);
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.read).length);
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  };

  const loadAdminAlerts = async () => {
    try {
      const data = await DatabaseService.getAdminAlerts();
      setAdminAlerts(data);
      setUnreadAlertsCount(data.filter((a) => a.status === "pending").length);
    } catch (error) {
      console.error("Error loading admin alerts:", error);
    }
  };

  const loadChatMessages = async () => {
    // TODO: Implement chat message loading from database
    // For now, use mock data
    setChatMessages([
      {
        id: "1",
        sender_name: "JoseyAI",
        sender_type: "ai_assistant",
        message: "Welcome to CoinKrazy! I'm here to help with any questions.",
        channel: "global",
        is_private: false,
        created_at: new Date(Date.now() - 300000).toISOString(),
      },
      {
        id: "2",
        user_id: "staff1",
        sender_name: "CasinoSupport",
        sender_type: "staff",
        message: "New slot games have been added! Check them out.",
        channel: "global",
        is_private: false,
        created_at: new Date(Date.now() - 120000).toISOString(),
      },
    ]);
  };

  const handleNewNotification = (notification: Notification) => {
    setNotifications((prev) => [notification, ...prev]);
    setUnreadCount((prev) => prev + 1);

    if (soundEnabled && audioRef.current) {
      audioRef.current.play();
    }

    // Show toast for high priority notifications
    if (
      notification.priority === "high" ||
      notification.priority === "urgent"
    ) {
      showNotificationToast(notification);
    }
  };

  const handleNewAdminAlert = (alert: AdminAlert) => {
    setAdminAlerts((prev) => [alert, ...prev]);
    setUnreadAlertsCount((prev) => prev + 1);

    if (soundEnabled && audioRef.current) {
      audioRef.current.play();
    }
  };

  const markAsRead = async (notificationId: string) => {
    const success =
      await DatabaseService.markNotificationAsRead(notificationId);
    if (success) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  };

  const markAllAsRead = async () => {
    // TODO: Implement bulk mark as read
    const unreadNotifications = notifications.filter((n) => !n.read);
    for (const notification of unreadNotifications) {
      await markAsRead(notification.id);
    }
  };

  const sendChatMessage = async () => {
    if (!chatMessage.trim() || !user) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      user_id: user.id,
      sender_name: user.username,
      sender_type: "user",
      message: chatMessage,
      channel: chatChannel,
      is_private: false,
      created_at: new Date().toISOString(),
    };

    setChatMessages((prev) => [...prev, newMessage]);
    setChatMessage("");

    // TODO: Send to database and broadcast to other users
  };

  const showNotificationToast = (notification: Notification) => {
    // Create sliding notification toast
    const toast = document.createElement("div");
    toast.className = `fixed top-4 right-4 z-50 bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-xl transform translate-x-full transition-transform duration-300`;
    toast.innerHTML = `
      <div class="flex items-start space-x-3">
        <div class="flex-shrink-0">
          ${getNotificationIcon(notification.type)}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-white">${notification.title}</p>
          <p class="text-sm text-gray-400">${notification.message}</p>
        </div>
        <button class="flex-shrink-0 text-gray-400 hover:text-white" onclick="this.parentElement.parentElement.remove()">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    `;

    document.body.appendChild(toast);

    // Slide in
    setTimeout(() => {
      toast.style.transform = "translateX(0)";
    }, 100);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      toast.style.transform = "translateX(full)";
      setTimeout(() => toast.remove(), 300);
    }, 5000);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return '<div class="w-4 h-4 text-green-400">✓</div>';
      case "warning":
        return '<div class="w-4 h-4 text-yellow-400">⚠</div>';
      case "error":
        return '<div class="w-4 h-4 text-red-400">✕</div>';
      case "info":
        return '<div class="w-4 h-4 text-blue-400">ℹ</div>';
      default:
        return '<div class="w-4 h-4 text-gray-400">•</div>';
    }
  };

  const getSenderIcon = (senderType: string) => {
    switch (senderType) {
      case "ai_assistant":
        return <Bot className="h-4 w-4 text-blue-400" />;
      case "admin":
        return <Crown className="h-4 w-4 text-gold" />;
      case "staff":
        return <Shield className="h-4 w-4 text-green-400" />;
      case "system":
        return <Settings className="h-4 w-4 text-gray-400" />;
      default:
        return <User className="h-4 w-4 text-gray-400" />;
    }
  };

  const getNotificationTypeIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case "error":
        return <X className="h-4 w-4 text-red-400" />;
      case "promotion":
        return <Star className="h-4 w-4 text-purple-400" />;
      default:
        return <Info className="h-4 w-4 text-blue-400" />;
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (notificationFilter === "all") return true;
    if (notificationFilter === "unread") return !notification.read;
    if (notificationFilter === "system")
      return notification.sender_type === "system";
    if (notificationFilter === "ai")
      return notification.sender_type === "ai_assistant";
    if (notificationFilter === "admin")
      return (
        notification.sender_type === "admin" ||
        notification.sender_type === "staff"
      );
    return true;
  });

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <>
      {/* Hidden audio element for notification sounds */}
      <audio
        ref={audioRef}
        preload="auto"
        src="data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAAC9Mb2dpYyBQcm8gWC4yLjAuMSBCdWlsZCAxNjc="
      />

      <div className={`flex items-center space-x-2 ${className}`}>
        {/* Chat Button */}
        <Popover open={showChat} onOpenChange={setShowChat}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="relative hover:bg-gray-800"
            >
              <MessageSquare className="h-5 w-5 text-gray-300" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-blue-600 text-white text-xs">
                <Users className="h-3 w-3" />
              </Badge>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-96 p-0 bg-gray-900 border-gray-700"
            align="end"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">
                CoinKrazy Global Chat
              </h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                >
                  {soundEnabled ? (
                    <Volume2 className="h-4 w-4 text-gray-400" />
                  ) : (
                    <VolumeX className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowChat(false)}
                >
                  <X className="h-4 w-4 text-gray-400" />
                </Button>
              </div>
            </div>

            {/* Chat Messages */}
            <ScrollArea className="h-64 p-4">
              <div className="space-y-3">
                {chatMessages.map((message) => (
                  <div key={message.id} className="flex items-start space-x-2">
                    <div className="flex-shrink-0">
                      {getSenderIcon(message.sender_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-white">
                          {message.sender_name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTimeAgo(message.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 break-words">
                        {message.message}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
            </ScrollArea>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-700">
              <div className="flex space-x-2">
                <Input
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-800 border-gray-600 text-white"
                  onKeyPress={(e) => e.key === "Enter" && sendChatMessage()}
                />
                <Button onClick={sendChatMessage} size="sm">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Be respectful • No private details • Family-friendly chat
              </p>
            </div>
          </PopoverContent>
        </Popover>

        {/* Notifications Button */}
        <Popover open={showNotifications} onOpenChange={setShowNotifications}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="relative hover:bg-gray-800"
            >
              <Bell className="h-5 w-5 text-gray-300" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-red-600 text-white text-xs">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-96 p-0 bg-gray-900 border-gray-700"
            align="end"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">
                Notifications
              </h3>
              <div className="flex items-center space-x-2">
                <select
                  value={notificationFilter}
                  onChange={(e) => setNotificationFilter(e.target.value as any)}
                  className="text-xs bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white"
                >
                  <option value="all">All</option>
                  <option value="unread">Unread</option>
                  <option value="system">System</option>
                  <option value="ai">AI Staff</option>
                  <option value="admin">Staff</option>
                </select>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs"
                  >
                    Mark all read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNotifications(false)}
                >
                  <X className="h-4 w-4 text-gray-400" />
                </Button>
              </div>
            </div>

            <ScrollArea className="h-80">
              <div className="p-2">
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No notifications</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          notification.read
                            ? "bg-gray-800/50 hover:bg-gray-800"
                            : "bg-blue-900/20 border border-blue-600/20 hover:bg-blue-900/30"
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            {getNotificationTypeIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-white truncate">
                                {notification.title}
                              </p>
                              <span className="text-xs text-gray-500">
                                {formatTimeAgo(notification.created_at)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-400 break-words">
                              {notification.message}
                            </p>
                            {notification.sender_type && (
                              <div className="flex items-center space-x-1 mt-1">
                                {getSenderIcon(notification.sender_type)}
                                <span className="text-xs text-gray-500 capitalize">
                                  {notification.sender_type.replace("_", " ")}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>

        {/* Admin Alerts Button (Admin/Staff Only) */}
        {(user?.role === "admin" || user?.role === "staff") && (
          <Popover open={showAdminAlerts} onOpenChange={setShowAdminAlerts}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="relative hover:bg-gray-800"
              >
                <Shield className="h-5 w-5 text-gold" />
                {unreadAlertsCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-orange-600 text-white text-xs">
                    {unreadAlertsCount > 99 ? "99+" : unreadAlertsCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-96 p-0 bg-gray-900 border-gray-700"
              align="end"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <h3 className="text-lg font-semibold text-gold">
                  {user?.role === "admin" ? "Admin Alerts" : "Staff Alerts"}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAdminAlerts(false)}
                >
                  <X className="h-4 w-4 text-gray-400" />
                </Button>
              </div>

              <ScrollArea className="h-80">
                <div className="p-2">
                  {adminAlerts.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No alerts</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {adminAlerts.map((alert) => (
                        <div
                          key={alert.id}
                          className={`p-3 rounded-lg border ${
                            alert.priority === "urgent"
                              ? "bg-red-900/20 border-red-600/20"
                              : alert.priority === "high"
                                ? "bg-orange-900/20 border-orange-600/20"
                                : "bg-gray-800/50 border-gray-700"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white">
                                {alert.title}
                              </p>
                              <p className="text-sm text-gray-400 break-words">
                                {alert.description}
                              </p>
                              <div className="flex items-center space-x-2 mt-2">
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${
                                    alert.priority === "urgent"
                                      ? "border-red-400 text-red-400"
                                      : alert.priority === "high"
                                        ? "border-orange-400 text-orange-400"
                                        : "border-gray-400 text-gray-400"
                                  }`}
                                >
                                  {alert.priority.toUpperCase()}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  {formatTimeAgo(alert.created_at)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </>
  );
}

export default NotificationCenter;
