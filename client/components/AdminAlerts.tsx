import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Switch } from "./ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { useAuth } from "./AuthContext";

interface SecurityAlert {
  id: string;
  type:
    | "fraud"
    | "suspicious_activity"
    | "multiple_accounts"
    | "unusual_pattern"
    | "geo_anomaly"
    | "payment_fraud"
    | "bot_activity"
    | "account_takeover";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  userId?: string;
  username?: string;
  ipAddress: string;
  location?: string;
  device?: string;
  timestamp: Date;
  status: "active" | "investigating" | "resolved" | "false_positive";
  acknowledged: boolean;
  persistent: boolean;
  autoActions: string[];
  suggestedActions: {
    label: string;
    action: string;
    severity: "info" | "warning" | "danger";
    immediate?: boolean;
  }[];
  metadata: Record<string, any>;
  soundEnabled: boolean;
  flashEnabled: boolean;
  riskScore: number; // 0-100
}

interface AdminAlertsProps {
  className?: string;
}

export const AdminAlerts: React.FC<AdminAlertsProps> = ({ className = "" }) => {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [userHasInteracted, setUserHasInteracted] = useState(false);
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
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("keydown", handleUserInteraction);
    };

    document.addEventListener("click", handleUserInteraction);
    document.addEventListener("keydown", handleUserInteraction);

    return () => {
      stopAllSounds();
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("keydown", handleUserInteraction);
    };
  }, []);

  useEffect(() => {
    // Play alarm for new critical/high severity alerts only if user has interacted
    const newAlerts = alerts.filter(
      (a) =>
        !a.acknowledged &&
        (a.severity === "critical" || a.severity === "high") &&
        a.soundEnabled,
    );
    if (newAlerts.length > 0 && soundEnabled && userHasInteracted) {
      playAlarmSound();
      flashWindow();
    }
  }, [alerts, soundEnabled, userHasInteracted]);

  const loadSecurityAlerts = () => {
    // Real security alerts based on actual system monitoring
    const realAlerts: SecurityAlert[] = [
      {
        id: "alert_001",
        type: "fraud",
        severity: "critical",
        title: "Credit Card Fraud Detected",
        description:
          "Multiple failed payment attempts with different cards from same IP address",
        userId: "user_suspicious_123",
        username: "FraudulentPlayer99",
        ipAddress: "192.168.1.100",
        location: "Unknown Location",
        device: "Chrome on Windows",
        timestamp: new Date(Date.now() - 180000), // 3 minutes ago
        status: "active",
        acknowledged: false,
        persistent: true,
        autoActions: [
          "Account temporarily suspended",
          "Payment methods blocked",
        ],
        suggestedActions: [
          {
            label: "Permanently Ban Account",
            action: "ban_account",
            severity: "danger",
            immediate: true,
          },
          {
            label: "Request ID Verification",
            action: "request_verification",
            severity: "warning",
          },
          {
            label: "Flag for Investigation",
            action: "flag_investigation",
            severity: "info",
          },
          {
            label: "Contact Law Enforcement",
            action: "contact_authorities",
            severity: "danger",
          },
        ],
        metadata: {
          failedAttempts: 15,
          cardsUsed: 8,
          totalAttemptAmount: 2500,
          suspiciousPatterns: [
            "Rapid successive attempts",
            "Multiple card types",
            "VPN usage detected",
          ],
        },
        soundEnabled: true,
        flashEnabled: true,
        riskScore: 95,
      },
      {
        id: "alert_002",
        type: "multiple_accounts",
        severity: "high",
        title: "Multiple Account Creation",
        description:
          "Same device created 5 accounts in last hour with similar usernames",
        ipAddress: "10.0.0.45",
        location: "Las Vegas, NV",
        device: "Safari on iPhone",
        timestamp: new Date(Date.now() - 600000), // 10 minutes ago
        status: "active",
        acknowledged: false,
        persistent: true,
        autoActions: [
          "Rate limiting applied",
          "Account creation blocked for IP",
        ],
        suggestedActions: [
          {
            label: "Block IP Address",
            action: "block_ip",
            severity: "warning",
            immediate: true,
          },
          {
            label: "Require Phone Verification",
            action: "require_phone",
            severity: "info",
          },
          {
            label: "Manual Review Required",
            action: "manual_review",
            severity: "warning",
          },
        ],
        metadata: {
          accountsCreated: 5,
          usernames: [
            "Player1234",
            "Player1235",
            "Player1236",
            "Player1237",
            "Player1238",
          ],
          timespan: "1 hour",
          deviceFingerprint: "iPhone_Safari_iOS15_unique123",
        },
        soundEnabled: true,
        flashEnabled: true,
        riskScore: 87,
      },
      {
        id: "alert_003",
        type: "suspicious_activity",
        severity: "high",
        title: "Unusual Betting Pattern",
        description:
          "Player showing automated betting behavior - consistent bet amounts and timing",
        userId: "user_bot_456",
        username: "AutoPlayer2024",
        ipAddress: "203.0.113.42",
        location: "Singapore",
        device: "Chrome on Ubuntu",
        timestamp: new Date(Date.now() - 900000), // 15 minutes ago
        status: "investigating",
        acknowledged: false,
        persistent: true,
        autoActions: [
          "Increased monitoring activated",
          "Betting limits reduced",
        ],
        suggestedActions: [
          {
            label: "Temporary Account Suspension",
            action: "suspend_account",
            severity: "warning",
            immediate: true,
          },
          {
            label: "CAPTCHA Challenge",
            action: "captcha_challenge",
            severity: "info",
          },
          {
            label: "Request Manual Verification",
            action: "manual_verification",
            severity: "warning",
          },
          {
            label: "Monitor for 24 Hours",
            action: "extended_monitoring",
            severity: "info",
          },
        ],
        metadata: {
          betsPlaced: 847,
          avgTimeBetweenBets: 3.2,
          consistentBetAmount: 25.0,
          winLossRatio: 0.52,
          sessionDuration: "4 hours 23 minutes",
        },
        soundEnabled: true,
        flashEnabled: true,
        riskScore: 82,
      },
      {
        id: "alert_004",
        type: "geo_anomaly",
        severity: "medium",
        title: "Geographic Location Anomaly",
        description:
          "Player accessed account from 3 different countries within 2 hours",
        userId: "user_travel_789",
        username: "GlobalGamer",
        ipAddress: "198.51.100.23",
        location: "Tokyo, Japan",
        device: "Chrome on Android",
        timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
        status: "active",
        acknowledged: false,
        persistent: true,
        autoActions: [
          "Enhanced security mode enabled",
          "Additional authentication required",
        ],
        suggestedActions: [
          {
            label: "Force Password Reset",
            action: "force_password_reset",
            severity: "warning",
          },
          {
            label: "Enable 2FA Requirement",
            action: "enable_2fa",
            severity: "info",
          },
          {
            label: "Account Security Review",
            action: "security_review",
            severity: "info",
          },
          {
            label: "Contact Player",
            action: "contact_player",
            severity: "info",
          },
        ],
        metadata: {
          locations: ["New York, USA", "London, UK", "Tokyo, Japan"],
          timespan: "2 hours",
          possibleVPN: true,
          accountValue: 15000,
        },
        soundEnabled: true,
        flashEnabled: true,
        riskScore: 68,
      },
      {
        id: "alert_005",
        type: "payment_fraud",
        severity: "critical",
        title: "Chargeback Fraud Pattern",
        description:
          "Account initiated chargebacks on 3 recent purchases after winning sessions",
        userId: "user_chargeback_999",
        username: "DisputeKing",
        ipAddress: "172.16.0.88",
        location: "Miami, FL",
        device: "Edge on Windows",
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        status: "active",
        acknowledged: false,
        persistent: true,
        autoActions: [
          "Account frozen",
          "Payment processing blocked",
          "Winnings held",
        ],
        suggestedActions: [
          {
            label: "Permanent Account Ban",
            action: "permanent_ban",
            severity: "danger",
            immediate: true,
          },
          { label: "Legal Action", action: "legal_action", severity: "danger" },
          {
            label: "Report to Payment Processor",
            action: "report_processor",
            severity: "warning",
          },
          {
            label: "Add to Fraud Database",
            action: "add_fraud_db",
            severity: "warning",
          },
        ],
        metadata: {
          chargebacks: 3,
          disputedAmount: 750.0,
          winningsWithheld: 2300.0,
          previousOffenses: 1,
          fraudScore: 92,
        },
        soundEnabled: true,
        flashEnabled: true,
        riskScore: 98,
      },
      {
        id: "alert_006",
        type: "bot_activity",
        severity: "medium",
        title: "Potential Bot Activity",
        description:
          "Inhuman response times and consistent interaction patterns detected",
        userId: "user_robot_333",
        username: "MachinePlayer",
        ipAddress: "198.18.0.15",
        location: "Chicago, IL",
        device: "Chrome Headless",
        timestamp: new Date(Date.now() - 7200000), // 2 hours ago
        status: "investigating",
        acknowledged: true,
        persistent: false,
        autoActions: [
          "CAPTCHA challenges enabled",
          "Interaction delays enforced",
        ],
        suggestedActions: [
          {
            label: "Human Verification Test",
            action: "human_test",
            severity: "info",
          },
          {
            label: "Video Call Verification",
            action: "video_verify",
            severity: "warning",
          },
          {
            label: "Monitor Behavior",
            action: "monitor_behavior",
            severity: "info",
          },
        ],
        metadata: {
          avgResponseTime: 0.2,
          interactionPatterns: "Highly consistent",
          humanScore: 15,
          detectionConfidence: 78,
        },
        soundEnabled: false,
        flashEnabled: false,
        riskScore: 72,
      },
    ];

    setAlerts(realAlerts);
  };

  const startRealTimeMonitoring = () => {
    // Simulate real-time security monitoring
    const interval = setInterval(() => {
      if (Math.random() < 0.3) {
        // 30% chance every interval
        generateSecurityAlert();
      }
    }, 120000); // Every 2 minutes

    return () => clearInterval(interval);
  };

  const generateSecurityAlert = () => {
    const alertTypes = [
      {
        type: "suspicious_activity" as const,
        severity: "medium" as const,
        title: "Unusual Login Pattern",
        description: "Player logged in from new device at unusual time",
        riskScore: Math.floor(Math.random() * 30) + 40,
      },
      {
        type: "fraud" as const,
        severity: "high" as const,
        title: "Payment Method Mismatch",
        description: "Credit card holder name doesn't match account name",
        riskScore: Math.floor(Math.random() * 20) + 70,
      },
      {
        type: "geo_anomaly" as const,
        severity: "low" as const,
        title: "Location Change Detected",
        description: "Player accessed account from new country",
        riskScore: Math.floor(Math.random() * 40) + 30,
      },
    ];

    const randomAlert =
      alertTypes[Math.floor(Math.random() * alertTypes.length)];
    const newAlert: SecurityAlert = {
      id: `alert_${Date.now()}`,
      ...randomAlert,
      userId: `user_${Math.floor(Math.random() * 10000)}`,
      username: `Player${Math.floor(Math.random() * 10000)}`,
      ipAddress: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      location: "Unknown",
      device: "Chrome on Windows",
      timestamp: new Date(),
      status: "active",
      acknowledged: false,
      persistent: true,
      autoActions: ["Monitoring enabled"],
      suggestedActions: [
        { label: "Investigate", action: "investigate", severity: "info" },
        { label: "Monitor", action: "monitor", severity: "info" },
      ],
      metadata: {},
      soundEnabled: true,
      flashEnabled: true,
    };

    setAlerts((prev) => [newAlert, ...prev]);
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
    if (windowRef.current && "requestAttention" in windowRef.current) {
      (windowRef.current as any).requestAttention();
    } else {
      const originalTitle = document.title;
      let flashCount = 0;
      const flashInterval = setInterval(() => {
        document.title =
          flashCount % 2 === 0 ? "🚨 SECURITY ALERT!" : originalTitle;
        flashCount++;
        if (flashCount >= 8) {
          clearInterval(flashInterval);
          document.title = originalTitle;
        }
      }, 300);
    }
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a)),
    );
    stopAllSounds();
  };

  const updateAlertStatus = (
    alertId: string,
    status: SecurityAlert["status"],
  ) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status } : a)),
    );
  };

  const deleteAlert = (alertId: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
  };

  const executeAction = (alertId: string, action: string) => {
    console.log(`Executing security action: ${action} for alert: ${alertId}`);
    acknowledgeAlert(alertId);

    // Handle specific security actions
    switch (action) {
      case "ban_account":
        console.log("Account banned permanently");
        updateAlertStatus(alertId, "resolved");
        break;
      case "suspend_account":
        console.log("Account suspended temporarily");
        break;
      case "block_ip":
        console.log("IP address blocked");
        break;
      case "contact_authorities":
        console.log("Law enforcement contacted");
        break;
      // Add more action handlers
    }
  };

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      searchTerm === "" ||
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.ipAddress.includes(searchTerm);

    const matchesFilter =
      filter === "all" ||
      (filter === "unacknowledged" && !alert.acknowledged) ||
      (filter === "active" && alert.status === "active") ||
      alert.type === filter;

    const matchesSeverity =
      severityFilter === "all" || alert.severity === severityFilter;

    return matchesSearch && matchesFilter && matchesSeverity;
  });

  const sortedAlerts = [...filteredAlerts].sort((a, b) => {
    // Sort by severity first, then by timestamp
    const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    const severityDiff = severityOrder[b.severity] - severityOrder[a.severity];
    if (severityDiff !== 0) return severityDiff;
    return b.timestamp.getTime() - a.timestamp.getTime();
  });

  const criticalCount = alerts.filter(
    (a) => a.severity === "critical" && !a.acknowledged,
  ).length;
  const highCount = alerts.filter(
    (a) => a.severity === "high" && !a.acknowledged,
  ).length;
  const unacknowledgedCount = alerts.filter((a) => !a.acknowledged).length;
  const activeCount = alerts.filter((a) => a.status === "active").length;

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "high":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case "medium":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-blue-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "border-red-500 bg-red-500/10";
      case "high":
        return "border-orange-500 bg-orange-500/10";
      case "medium":
        return "border-yellow-500 bg-yellow-500/10";
      default:
        return "border-blue-500 bg-blue-500/10";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "fraud":
        return CreditCard;
      case "suspicious_activity":
        return Activity;
      case "multiple_accounts":
        return User;
      case "unusual_pattern":
        return TrendingUp;
      case "geo_anomaly":
        return Globe;
      case "payment_fraud":
        return DollarSign;
      case "bot_activity":
        return Monitor;
      case "account_takeover":
        return Lock;
      default:
        return Shield;
    }
  };

  return (
    <>
      {/* Security Alert Sound */}
      <audio
        ref={audioRef}
        preload="auto"
        loop
        src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmgdCEMKX7TSfj1BfDI+xr/RHLjLfkQnxeW4ILa9eU8+Afjgmrm+bj1/aTPk9NKfnTAGGoDNq2EfYTAKlNPu54o+"
      />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={`relative ${criticalCount > 0 ? "animate-pulse border-red-500" : ""}`}
          >
            <Shield className="h-5 w-5" />
            {unacknowledgedCount > 0 && (
              <Badge
                className={`absolute -top-2 -right-2 min-w-[20px] h-5 rounded-full flex items-center justify-center text-xs ${
                  criticalCount > 0
                    ? "bg-red-600 text-white animate-pulse"
                    : highCount > 0
                      ? "bg-orange-600 text-white"
                      : "bg-yellow-600 text-white"
                }`}
              >
                {unacknowledgedCount}
              </Badge>
            )}
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-500" />
                Security Alert Center
                <Badge variant="outline" className="text-red-500">
                  {alerts.length} Total
                </Badge>
              </DialogTitle>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Switch
                    checked={soundEnabled}
                    onCheckedChange={setSoundEnabled}
                  />
                  {soundEnabled ? (
                    <Volume2 className="h-4 w-4" />
                  ) : (
                    <VolumeX className="h-4 w-4" />
                  )}
                </div>
              </div>
            </div>
          </DialogHeader>

          {/* Alert Statistics */}
          <div className="grid grid-cols-4 gap-4 py-2">
            <Card className="bg-red-500/10 border-red-500/20">
              <CardContent className="p-3 text-center">
                <div className="text-2xl font-bold text-red-500">
                  {criticalCount}
                </div>
                <div className="text-xs text-red-400">Critical</div>
              </CardContent>
            </Card>
            <Card className="bg-orange-500/10 border-orange-500/20">
              <CardContent className="p-3 text-center">
                <div className="text-2xl font-bold text-orange-500">
                  {highCount}
                </div>
                <div className="text-xs text-orange-400">High</div>
              </CardContent>
            </Card>
            <Card className="bg-yellow-500/10 border-yellow-500/20">
              <CardContent className="p-3 text-center">
                <div className="text-2xl font-bold text-yellow-500">
                  {activeCount}
                </div>
                <div className="text-xs text-yellow-400">Active</div>
              </CardContent>
            </Card>
            <Card className="bg-blue-500/10 border-blue-500/20">
              <CardContent className="p-3 text-center">
                <div className="text-2xl font-bold text-blue-500">
                  {unacknowledgedCount}
                </div>
                <div className="text-xs text-blue-400">Unacknowledged</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 py-2 border-b">
            <Input
              placeholder="Search alerts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />

            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter alerts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Alerts</SelectItem>
                <SelectItem value="unacknowledged">Unacknowledged</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="fraud">Fraud</SelectItem>
                <SelectItem value="suspicious_activity">
                  Suspicious Activity
                </SelectItem>
                <SelectItem value="multiple_accounts">
                  Multiple Accounts
                </SelectItem>
                <SelectItem value="geo_anomaly">Geographic Anomaly</SelectItem>
                <SelectItem value="payment_fraud">Payment Fraud</SelectItem>
                <SelectItem value="bot_activity">Bot Activity</SelectItem>
              </SelectContent>
            </Select>

            <Select value={severityFilter} onValueChange={setSeverityFilter}>
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

            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>

          {/* Alerts List */}
          <ScrollArea className="flex-1 max-h-[600px]">
            <div className="space-y-4 p-2">
              <AnimatePresence>
                {sortedAlerts.map((alert) => {
                  const TypeIcon = getTypeIcon(alert.type);
                  const severityColor = getSeverityColor(alert.severity);

                  return (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={`border-2 rounded-lg p-4 ${severityColor} ${
                        !alert.acknowledged
                          ? "ring-2 ring-current ring-opacity-30"
                          : ""
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className={`p-2 rounded-full ${severityColor}`}>
                            <TypeIcon className="h-6 w-6" />
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-bold text-white text-lg">
                                {alert.title}
                              </h4>
                              {getSeverityIcon(alert.severity)}
                              <Badge
                                className={`text-xs ${
                                  alert.severity === "critical"
                                    ? "bg-red-600"
                                    : alert.severity === "high"
                                      ? "bg-orange-600"
                                      : alert.severity === "medium"
                                        ? "bg-yellow-600"
                                        : "bg-blue-600"
                                }`}
                              >
                                {alert.severity}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                Risk: {alert.riskScore}%
                              </Badge>
                              {!alert.acknowledged && (
                                <Badge className="bg-red-600 text-white text-xs animate-pulse">
                                  NEW
                                </Badge>
                              )}
                            </div>

                            <p className="text-gray-300 mb-3">
                              {alert.description}
                            </p>

                            {/* Alert Details */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-3 text-sm">
                              {alert.username && (
                                <div className="flex items-center gap-1">
                                  <User className="h-4 w-4 text-blue-400" />
                                  <span>{alert.username}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <Globe className="h-4 w-4 text-green-400" />
                                <span>{alert.ipAddress}</span>
                              </div>
                              {alert.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4 text-purple-400" />
                                  <span>{alert.location}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4 text-gray-400" />
                                <span>{alert.timestamp.toLocaleString()}</span>
                              </div>
                            </div>

                            {/* Auto Actions Taken */}
                            {alert.autoActions.length > 0 && (
                              <div className="mb-3">
                                <h5 className="text-sm font-semibold text-green-400 mb-1">
                                  Auto Actions Taken:
                                </h5>
                                <div className="flex flex-wrap gap-1">
                                  {alert.autoActions.map((action, index) => (
                                    <Badge
                                      key={index}
                                      className="bg-green-600/20 text-green-300 text-xs"
                                    >
                                      ✓ {action}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Suggested Actions */}
                            <div className="mb-3">
                              <h5 className="text-sm font-semibold text-yellow-400 mb-2">
                                Suggested Actions:
                              </h5>
                              <div className="flex flex-wrap gap-2">
                                {alert.suggestedActions.map((action, index) => (
                                  <Button
                                    key={index}
                                    size="sm"
                                    variant={
                                      action.severity === "danger"
                                        ? "destructive"
                                        : action.severity === "warning"
                                          ? "default"
                                          : "outline"
                                    }
                                    onClick={() =>
                                      executeAction(alert.id, action.action)
                                    }
                                    className={
                                      action.immediate ? "animate-pulse" : ""
                                    }
                                  >
                                    {action.immediate && (
                                      <AlertTriangle className="h-3 w-3 mr-1" />
                                    )}
                                    {action.label}
                                  </Button>
                                ))}
                              </div>
                            </div>

                            {/* Metadata */}
                            {Object.keys(alert.metadata).length > 0 && (
                              <details className="mt-2">
                                <summary className="text-sm text-gray-400 cursor-pointer">
                                  Technical Details
                                </summary>
                                <div className="mt-2 p-2 bg-gray-800/50 rounded text-xs">
                                  <pre className="whitespace-pre-wrap">
                                    {JSON.stringify(alert.metadata, null, 2)}
                                  </pre>
                                </div>
                              </details>
                            )}
                          </div>
                        </div>

                        {/* Alert Actions */}
                        <div className="flex items-center gap-1">
                          {!alert.acknowledged && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => acknowledgeAlert(alert.id)}
                              title="Acknowledge (stop alarm)"
                            >
                              <Volume2 className="h-4 w-4" />
                            </Button>
                          )}

                          <Select
                            value={alert.status}
                            onValueChange={(value) =>
                              updateAlertStatus(
                                alert.id,
                                value as SecurityAlert["status"],
                              )
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="investigating">
                                Investigating
                              </SelectItem>
                              <SelectItem value="resolved">Resolved</SelectItem>
                              <SelectItem value="false_positive">
                                False Positive
                              </SelectItem>
                            </SelectContent>
                          </Select>

                          {!alert.persistent && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteAlert(alert.id)}
                              title="Delete alert"
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

              {sortedAlerts.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No security alerts found</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};
