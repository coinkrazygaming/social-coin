import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  AlertTriangle,
  Shield,
  TrendingUp,
  Users,
  CreditCard,
  Bot,
  Settings,
  X,
  Check,
  Eye,
  Clock,
  Flag,
  Zap,
  Activity,
  DollarSign,
  UserX,
  AlertCircle,
  CheckCircle,
  XCircle,
  MessageSquare,
  FileText,
  Calendar,
  MapPin,
  Smartphone,
  Globe,
  Ban,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useAuth } from "./AuthContext";

export interface AdminAlert {
  id: string;
  type: "security" | "financial" | "user" | "system" | "ai_agent" | "game" | "compliance";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  source: "LuckyAI" | "SecurityAI" | "FraudAI" | "System" | "User Report" | "Manual";
  timestamp: Date;
  status: "unread" | "read" | "acknowledged" | "resolved" | "dismissed";
  category: string;
  metadata: {
    userId?: string;
    username?: string;
    transactionId?: string;
    gameId?: string;
    ip?: string;
    amount?: number;
    location?: string;
    device?: string;
    riskScore?: number;
    autoAction?: string;
    evidence?: string[];
    relatedAlerts?: string[];
    priority?: number;
  };
  actions?: {
    primary?: {
      label: string;
      action: string;
      variant?: "default" | "destructive" | "secondary";
    };
    secondary?: {
      label: string;
      action: string;
      variant?: "default" | "destructive" | "secondary";
    }[];
  };
  assignedTo?: string;
  resolvedBy?: string;
  resolvedAt?: Date;
  notes?: string;
}

interface AdminAlertsSystemProps {
  isNavbarMode?: boolean;
  maxVisibleAlerts?: number;
  autoRefresh?: boolean;
  showFilters?: boolean;
}

export const AdminAlertsSystem: React.FC<AdminAlertsSystemProps> = ({
  isNavbarMode = false,
  maxVisibleAlerts = 10,
  autoRefresh = true,
  showFilters = true,
}) => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<AdminAlert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<AdminAlert[]>([]);
  const [showAlertsPanel, setShowAlertsPanel] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<AdminAlert | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("unread");
  const [isLoading, setIsLoading] = useState(true);
  const [newAlertCount, setNewAlertCount] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    loadAlerts();
    
    if (autoRefresh) {
      const interval = setInterval(() => {
        loadAlerts();
      }, 30000); // Refresh every 30 seconds
      
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  useEffect(() => {
    filterAlerts();
  }, [alerts, filterSeverity, filterType, filterStatus]);

  useEffect(() => {
    // Count new unread alerts
    const unreadCount = alerts.filter(alert => alert.status === "unread").length;
    setNewAlertCount(unreadCount);
  }, [alerts]);

  const loadAlerts = async () => {
    try {
      // Simulate loading real alerts from CoinKrazy systems
      const mockAlerts: AdminAlert[] = [
        {
          id: "alert_001",
          type: "security",
          severity: "critical",
          title: "Multiple Failed Login Attempts",
          description: "User account @SuspiciousUser99 has had 8 failed login attempts in the last 5 minutes from VPN IP addresses",
          source: "LuckyAI",
          timestamp: new Date(Date.now() - 120000),
          status: "unread",
          category: "Account Security",
          metadata: {
            userId: "user_123",
            username: "SuspiciousUser99",
            ip: "203.0.113.45",
            location: "Unknown/VPN",
            device: "Mobile Chrome",
            riskScore: 95,
            autoAction: "Account temporarily locked",
            evidence: [
              "8 failed attempts in 5 minutes",
              "Multiple VPN IP addresses used",
              "Unusual timing patterns detected"
            ],
            priority: 100
          },
          actions: {
            primary: {
              label: "Review Account",
              action: "review_account",
              variant: "destructive"
            },
            secondary: [
              { label: "Chat with LuckyAI", action: "chat_luckyai" },
              { label: "View Logs", action: "view_logs" }
            ]
          }
        },
        {
          id: "alert_002",
          type: "financial", 
          severity: "high",
          title: "Large Withdrawal Request",
          description: "User @HighRoller submitted withdrawal request for $2,500 via Cash App, exceeding deposit history by 500%",
          source: "FraudAI",
          timestamp: new Date(Date.now() - 300000),
          status: "acknowledged",
          category: "Withdrawal Review",
          metadata: {
            userId: "user_456",
            username: "HighRoller",
            transactionId: "withdraw_789",
            amount: 2500,
            ip: "198.51.100.25",
            location: "Miami, FL",
            device: "Desktop Safari",
            riskScore: 87,
            autoAction: "Withdrawal held for manual review",
            evidence: [
              "Withdrawal exceeds deposit history by 500%",
              "Account age: 30 days",
              "Total deposits: $500",
              "Requesting Cash App payout method"
            ]
          },
          actions: {
            primary: {
              label: "Review Withdrawal",
              action: "review_withdrawal",
              variant: "default"
            },
            secondary: [
              { label: "Approve", action: "approve_withdrawal" },
              { label: "Deny", action: "deny_withdrawal", variant: "destructive" },
              { label: "Request KYC", action: "request_kyc" }
            ]
          },
          assignedTo: user?.username
        },
        {
          id: "alert_003",
          type: "ai_agent",
          severity: "medium",
          title: "LuckyAI Requires Attention",
          description: "LuckyAI has identified 3 interconnected suspicious accounts and recommends coordinated investigation",
          source: "LuckyAI",
          timestamp: new Date(Date.now() - 600000),
          status: "read",
          category: "AI Investigation",
          metadata: {
            riskScore: 76,
            evidence: [
              "3 accounts using same payment method",
              "Similar gameplay patterns detected",
              "All created within 24 hours",
              "Same device fingerprint"
            ],
            relatedAlerts: ["alert_004", "alert_005"]
          },
          actions: {
            primary: {
              label: "Chat with LuckyAI",
              action: "chat_luckyai",
              variant: "default"
            },
            secondary: [
              { label: "View Related Accounts", action: "view_accounts" },
              { label: "Flag for Investigation", action: "flag_investigation" }
            ]
          }
        },
        {
          id: "alert_004",
          type: "game",
          severity: "high",
          title: "Bot Activity Detected",
          description: "Automated gameplay detected on user @AutoPlayer99 - inhuman click patterns and timing",
          source: "SecurityAI",
          timestamp: new Date(Date.now() - 900000),
          status: "unread",
          category: "Bot Detection",
          metadata: {
            userId: "user_bot",
            username: "AutoPlayer99",
            gameId: "slot_crypto_fortune",
            ip: "10.0.0.55",
            location: "Automated/Script",
            device: "Headless Browser",
            riskScore: 98,
            autoAction: "Account suspended pending review",
            evidence: [
              "50 game sessions in 1 hour",
              "Average session time: 0.5 seconds",
              "Robotic click patterns",
              "No human interaction delays"
            ]
          },
          actions: {
            primary: {
              label: "Ban Account",
              action: "ban_account",
              variant: "destructive"
            },
            secondary: [
              { label: "Investigate", action: "investigate" },
              { label: "False Positive", action: "mark_false_positive" }
            ]
          }
        },
        {
          id: "alert_005",
          type: "system",
          severity: "low",
          title: "Server Performance Alert",
          description: "Game server response time has increased by 15% over the last hour",
          source: "System",
          timestamp: new Date(Date.now() - 1200000),
          status: "resolved",
          category: "Performance",
          metadata: {
            autoAction: "Load balancer automatically adjusted",
            evidence: [
              "Average response time: 1.2s (was 1.0s)",
              "Affected servers: game-server-2, game-server-3",
              "User impact: Minimal"
            ]
          },
          resolvedBy: "AutoScaler",
          resolvedAt: new Date(Date.now() - 600000)
        },
        {
          id: "alert_006",
          type: "user",
          severity: "medium",
          title: "User Complaint Received",
          description: "User @LegitPlayer reported unexpected account restrictions and missing balance",
          source: "User Report",
          timestamp: new Date(Date.now() - 1800000),
          status: "acknowledged",
          category: "User Support",
          metadata: {
            userId: "user_legitimate",
            username: "LegitPlayer",
            evidence: [
              "User reports missing 5,000 GC",
              "Account temporarily restricted yesterday",
              "No suspicious activity detected",
              "User has clean 6-month history"
            ]
          },
          actions: {
            primary: {
              label: "Review Account",
              action: "review_account"
            },
            secondary: [
              { label: "Restore Balance", action: "restore_balance" },
              { label: "Contact User", action: "contact_user" }
            ]
          },
          assignedTo: user?.username
        }
      ];

      // Add random new alerts occasionally
      if (Math.random() > 0.8) {
        const newAlert: AdminAlert = {
          id: `alert_${Date.now()}`,
          type: ["security", "financial", "game", "ai_agent"][Math.floor(Math.random() * 4)] as any,
          severity: ["low", "medium", "high", "critical"][Math.floor(Math.random() * 4)] as any,
          title: "New Alert Generated",
          description: "A new alert has been generated by the monitoring system",
          source: "LuckyAI",
          timestamp: new Date(),
          status: "unread",
          category: "Live Alert",
          metadata: {
            riskScore: Math.floor(Math.random() * 100),
            autoAction: "Alert generated"
          }
        };
        
        mockAlerts.unshift(newAlert);
        
        // Play alert sound for new critical alerts
        if (newAlert.severity === "critical" && audioRef.current) {
          audioRef.current.play().catch(() => {});
        }
      }

      setAlerts(mockAlerts);
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading alerts:", error);
      setIsLoading(false);
    }
  };

  const filterAlerts = () => {
    let filtered = alerts;

    if (filterSeverity !== "all") {
      filtered = filtered.filter(alert => alert.severity === filterSeverity);
    }

    if (filterType !== "all") {
      filtered = filtered.filter(alert => alert.type === filterType);
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter(alert => alert.status === filterStatus);
    }

    setFilteredAlerts(filtered.slice(0, maxVisibleAlerts));
  };

  const handleAlertAction = async (alertId: string, action: string) => {
    console.log(`Executing action: ${action} on alert: ${alertId}`);
    
    // Update alert status based on action
    setAlerts(prev => prev.map(alert => {
      if (alert.id === alertId) {
        let newStatus = alert.status;
        
        switch (action) {
          case "acknowledge":
            newStatus = "acknowledged";
            break;
          case "resolve":
            newStatus = "resolved";
            break;
          case "dismiss":
            newStatus = "dismissed";
            break;
          case "ban_account":
          case "approve_withdrawal":
          case "deny_withdrawal":
            newStatus = "resolved";
            break;
        }
        
        return {
          ...alert,
          status: newStatus,
          resolvedBy: newStatus === "resolved" ? user?.username : alert.resolvedBy,
          resolvedAt: newStatus === "resolved" ? new Date() : alert.resolvedAt
        };
      }
      return alert;
    }));

    // Close detail modal if open
    if (selectedAlert?.id === alertId) {
      setSelectedAlert(null);
    }

    // Show success message or take additional actions based on the action type
    switch (action) {
      case "chat_luckyai":
        // This would open the LuckyAI chat component
        window.dispatchEvent(new CustomEvent("openLuckyAIChat", { detail: { alertId } }));
        break;
      case "review_account":
        // Navigate to user management
        break;
      case "ban_account":
        alert("Account has been permanently banned.");
        break;
      case "approve_withdrawal":
        alert("Withdrawal has been approved and processed.");
        break;
      case "deny_withdrawal":
        alert("Withdrawal has been denied and user notified.");
        break;
    }
  };

  const markAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId && alert.status === "unread"
        ? { ...alert, status: "read" }
        : alert
    ));
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "security": return Shield;
      case "financial": return DollarSign;
      case "user": return Users;
      case "system": return Settings;
      case "ai_agent": return Bot;
      case "game": return Activity;
      case "compliance": return FileText;
      default: return AlertTriangle;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "text-red-500 bg-red-500/10 border-red-500/20";
      case "high": return "text-orange-500 bg-orange-500/10 border-orange-500/20";
      case "medium": return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      case "low": return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      default: return "text-gray-500 bg-gray-500/10 border-gray-500/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "acknowledged": return <Clock className="h-4 w-4 text-yellow-500" />;
      case "dismissed": return <XCircle className="h-4 w-4 text-gray-500" />;
      default: return <AlertCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  // Navbar mode - just the bell icon with badge
  if (isNavbarMode) {
    return (
      <>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAlertsPanel(true)}
          className="relative"
        >
          <Bell className="h-5 w-5" />
          {newAlertCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
              {newAlertCount > 99 ? "99+" : newAlertCount}
            </Badge>
          )}
        </Button>

        {/* Alerts Panel Modal */}
        <Dialog open={showAlertsPanel} onOpenChange={setShowAlertsPanel}>
          <DialogContent className="max-w-4xl max-h-[80vh] bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Admin Alerts
                <Badge className="bg-red-500 text-white">
                  {newAlertCount} New
                </Badge>
              </DialogTitle>
            </DialogHeader>
            <AdminAlertsSystemContent
              alerts={filteredAlerts}
              onAlertAction={handleAlertAction}
              onMarkAsRead={markAsRead}
              onSelectAlert={setSelectedAlert}
              showFilters={showFilters}
              filterSeverity={filterSeverity}
              filterType={filterType}
              filterStatus={filterStatus}
              onFilterChange={{ setFilterSeverity, setFilterType, setFilterStatus }}
              isLoading={isLoading}
            />
          </DialogContent>
        </Dialog>

        {/* Alert Detail Modal */}
        <Dialog open={!!selectedAlert} onOpenChange={() => setSelectedAlert(null)}>
          <DialogContent className="max-w-3xl bg-gray-900 border-gray-700">
            {selectedAlert && (
              <AlertDetailModal
                alert={selectedAlert}
                onAction={handleAlertAction}
                onClose={() => setSelectedAlert(null)}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Audio element for alert sounds */}
        <audio ref={audioRef} preload="auto">
          <source src="/sounds/alert.mp3" type="audio/mpeg" />
        </audio>
      </>
    );
  }

  // Full dashboard mode
  return (
    <div className="space-y-6">
      <AdminAlertsSystemContent
        alerts={filteredAlerts}
        onAlertAction={handleAlertAction}
        onMarkAsRead={markAsRead}
        onSelectAlert={setSelectedAlert}
        showFilters={showFilters}
        filterSeverity={filterSeverity}
        filterType={filterType}
        filterStatus={filterStatus}
        onFilterChange={{ setFilterSeverity, setFilterType, setFilterStatus }}
        isLoading={isLoading}
      />

      {/* Alert Detail Modal */}
      <Dialog open={!!selectedAlert} onOpenChange={() => setSelectedAlert(null)}>
        <DialogContent className="max-w-3xl bg-gray-900 border-gray-700">
          {selectedAlert && (
            <AlertDetailModal
              alert={selectedAlert}
              onAction={handleAlertAction}
              onClose={() => setSelectedAlert(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Audio element for alert sounds */}
      <audio ref={audioRef} preload="auto">
        <source src="/sounds/alert.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
};

// Content component for reuse between modal and full dashboard
interface AdminAlertsSystemContentProps {
  alerts: AdminAlert[];
  onAlertAction: (alertId: string, action: string) => void;
  onMarkAsRead: (alertId: string) => void;
  onSelectAlert: (alert: AdminAlert) => void;
  showFilters: boolean;
  filterSeverity: string;
  filterType: string;
  filterStatus: string;
  onFilterChange: {
    setFilterSeverity: (value: string) => void;
    setFilterType: (value: string) => void;
    setFilterStatus: (value: string) => void;
  };
  isLoading: boolean;
}

const AdminAlertsSystemContent: React.FC<AdminAlertsSystemContentProps> = ({
  alerts,
  onAlertAction,
  onMarkAsRead,
  onSelectAlert,
  showFilters,
  filterSeverity,
  filterType,
  filterStatus,
  onFilterChange,
  isLoading,
}) => {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case "security": return Shield;
      case "financial": return DollarSign;
      case "user": return Users;
      case "system": return Settings;
      case "ai_agent": return Bot;
      case "game": return Activity;
      case "compliance": return FileText;
      default: return AlertTriangle;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "text-red-500 bg-red-500/10 border-red-500/20";
      case "high": return "text-orange-500 bg-orange-500/10 border-orange-500/20";
      case "medium": return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      case "low": return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      default: return "text-gray-500 bg-gray-500/10 border-gray-500/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "acknowledged": return <Clock className="h-4 w-4 text-yellow-500" />;
      case "dismissed": return <XCircle className="h-4 w-4 text-gray-500" />;
      default: return <AlertCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-400">Loading alerts...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      {showFilters && (
        <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg">
          <Select value={filterStatus} onValueChange={onFilterChange.setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="unread">Unread</SelectItem>
              <SelectItem value="read">Read</SelectItem>
              <SelectItem value="acknowledged">Acknowledged</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterSeverity} onValueChange={onFilterChange.setFilterSeverity}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severity</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterType} onValueChange={onFilterChange.setFilterType}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="security">Security</SelectItem>
              <SelectItem value="financial">Financial</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="system">System</SelectItem>
              <SelectItem value="ai_agent">AI Agent</SelectItem>
              <SelectItem value="game">Game</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Alerts List */}
      <ScrollArea className="h-[500px]">
        <div className="space-y-3">
          <AnimatePresence>
            {alerts.map((alert) => {
              const Icon = getAlertIcon(alert.type);
              const severityClass = getSeverityColor(alert.severity);

              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`border rounded-lg p-4 cursor-pointer transition-all hover:bg-gray-700/50 ${severityClass} ${
                    alert.status === "unread" ? "ring-2 ring-blue-500/50" : ""
                  }`}
                  onClick={() => {
                    onMarkAsRead(alert.id);
                    onSelectAlert(alert);
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <Icon className="h-5 w-5 mt-1" />
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-white">{alert.title}</h4>
                          <Badge className={severityClass}>{alert.severity}</Badge>
                          <Badge variant="outline">{alert.type}</Badge>
                          <Badge className="bg-purple-600 text-white">
                            {alert.source}
                          </Badge>
                        </div>

                        <p className="text-gray-300 text-sm mb-2">{alert.description}</p>

                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {alert.timestamp.toLocaleString()}
                          </span>
                          {alert.metadata.username && (
                            <span>@{alert.metadata.username}</span>
                          )}
                          {alert.metadata.riskScore && (
                            <span>Risk: {alert.metadata.riskScore}%</span>
                          )}
                          {alert.assignedTo && (
                            <span>Assigned to: {alert.assignedTo}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {getStatusIcon(alert.status)}
                      
                      {alert.actions?.primary && (
                        <Button
                          size="sm"
                          variant={alert.actions.primary.variant || "default"}
                          onClick={(e) => {
                            e.stopPropagation();
                            onAlertAction(alert.id, alert.actions!.primary!.action);
                          }}
                        >
                          {alert.actions.primary.label}
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectAlert(alert);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </ScrollArea>

      {alerts.length === 0 && (
        <div className="text-center py-8">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-white font-semibold mb-2">No Alerts</h3>
          <p className="text-gray-400">All systems are running normally.</p>
        </div>
      )}
    </div>
  );
};

// Alert Detail Modal Component
interface AlertDetailModalProps {
  alert: AdminAlert;
  onAction: (alertId: string, action: string) => void;
  onClose: () => void;
}

const AlertDetailModal: React.FC<AlertDetailModalProps> = ({ alert, onAction, onClose }) => {
  const [notes, setNotes] = useState(alert.notes || "");

  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle className="text-white flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Alert Details
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge className={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
          <Badge variant="outline">{alert.type}</Badge>
          <Badge className="bg-purple-600 text-white">{alert.source}</Badge>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-2">{alert.title}</h3>
          <p className="text-gray-300">{alert.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-white font-medium mb-2">Basic Information</h4>
            <div className="space-y-1 text-sm">
              <div>
                <span className="text-gray-400">Timestamp:</span>
                <span className="text-white ml-2">{alert.timestamp.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-400">Category:</span>
                <span className="text-white ml-2">{alert.category}</span>
              </div>
              <div>
                <span className="text-gray-400">Status:</span>
                <span className="text-white ml-2">{alert.status}</span>
              </div>
            </div>
          </div>

          {alert.metadata.username && (
            <div>
              <h4 className="text-white font-medium mb-2">User Information</h4>
              <div className="space-y-1 text-sm">
                <div>
                  <span className="text-gray-400">Username:</span>
                  <span className="text-white ml-2">@{alert.metadata.username}</span>
                </div>
                {alert.metadata.ip && (
                  <div>
                    <span className="text-gray-400">IP Address:</span>
                    <span className="text-white ml-2">{alert.metadata.ip}</span>
                  </div>
                )}
                {alert.metadata.location && (
                  <div>
                    <span className="text-gray-400">Location:</span>
                    <span className="text-white ml-2">{alert.metadata.location}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {alert.metadata.evidence && alert.metadata.evidence.length > 0 && (
          <div>
            <h4 className="text-white font-medium mb-2">Evidence</h4>
            <ul className="list-disc list-inside space-y-1">
              {alert.metadata.evidence.map((evidence, index) => (
                <li key={index} className="text-gray-300 text-sm">{evidence}</li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <h4 className="text-white font-medium mb-2">Admin Notes</h4>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes about this alert..."
            className="bg-gray-800 border-gray-600 text-white"
          />
        </div>

        <div className="flex gap-2">
          {alert.actions?.primary && (
            <Button
              variant={alert.actions.primary.variant || "default"}
              onClick={() => {
                onAction(alert.id, alert.actions!.primary!.action);
                onClose();
              }}
            >
              {alert.actions.primary.label}
            </Button>
          )}
          
          {alert.actions?.secondary?.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || "outline"}
              onClick={() => {
                onAction(alert.id, action.action);
                onClose();
              }}
            >
              {action.label}
            </Button>
          ))}
          
          <Button
            variant="outline"
            onClick={() => onAction(alert.id, "acknowledge")}
          >
            <Clock className="h-4 w-4 mr-2" />
            Acknowledge
          </Button>
          
          <Button
            variant="outline"
            onClick={() => onAction(alert.id, "resolve")}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Resolve
          </Button>
        </div>
      </div>
    </div>
  );
};

// Helper function for severity colors
const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "critical": return "text-red-500 bg-red-500/10 border-red-500/20";
    case "high": return "text-orange-500 bg-orange-500/10 border-orange-500/20";
    case "medium": return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
    case "low": return "text-blue-500 bg-blue-500/10 border-blue-500/20";
    default: return "text-gray-500 bg-gray-500/10 border-gray-500/20";
  }
};
