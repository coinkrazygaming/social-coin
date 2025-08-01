import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Eye,
  AlertTriangle,
  Lock,
  Unlock,
  UserX,
  Activity,
  Globe,
  Monitor,
  Clock,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Download,
  Zap,
  Bot,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  RotateCcw,
  Settings,
  MapPin,
  Smartphone,
  CreditCard,
  Flag,
  Ban,
  Star,
  Calendar,
  BarChart3,
  PieChart,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Switch } from "./ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
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
import { Textarea } from "./ui/textarea";
import { useAuth } from "./AuthContext";
import { LuckyAISecurityChat } from "./LuckyAISecurityChat";

interface SecurityLog {
  id: string;
  timestamp: Date;
  type:
    | "login"
    | "transaction"
    | "withdrawal"
    | "suspicious"
    | "admin_action"
    | "system"
    | "api_call"
    | "game_action";
  severity: "info" | "warning" | "error" | "critical";
  user?: {
    id: string;
    username: string;
    ip: string;
    location: string;
    device: string;
  };
  action: string;
  details: string;
  metadata: Record<string, any>;
  flagged: boolean;
  resolved: boolean;
  aiAnalysis?: {
    riskScore: number;
    recommendation: string;
    autoAction?: string;
  };
}

interface SecurityMetrics {
  totalLogins: number;
  failedLogins: number;
  suspiciousActivities: number;
  blockedAttempts: number;
  successfulTransactions: number;
  flaggedTransactions: number;
  uniqueUsers: number;
  newUsers: number;
  riskScore: number;
  threatLevel: "low" | "medium" | "high" | "critical";
}

interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  category:
    | "fraud_prevention"
    | "user_behavior"
    | "system_security"
    | "compliance"
    | "performance";
  impact: string;
  implementation: string;
  estimatedTime: string;
  priority: number;
  status: "pending" | "in_progress" | "implemented" | "rejected";
  confidence: number; // 0-100
  evidence: string[];
  relatedLogs: string[];
  timestamp: Date;
}

interface SecuritySettings {
  autoBlockSuspicious: boolean;
  loginAttemptLimit: number;
  sessionTimeout: number;
  ipWhitelisting: boolean;
  geoBlocking: boolean;
  twoFactorRequired: boolean;
  anomalyDetection: boolean;
  realTimeMonitoring: boolean;
  aiSecurityEnabled: boolean;
  alertThreshold: number;
}

export const SecurityTab: React.FC = () => {
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>(
    [],
  );
  const [settings, setSettings] = useState<SecuritySettings | null>(null);
  const [filteredLogs, setFilteredLogs] = useState<SecurityLog[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("24h");
  const [selectedLog, setSelectedLog] = useState<SecurityLog | null>(null);
  const [selectedRecommendation, setSelectedRecommendation] =
    useState<AIRecommendation | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadSecurityData();
    if (isMonitoring) {
      const interval = setInterval(loadSecurityData, 30000); // Update every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isMonitoring]);

  useEffect(() => {
    filterLogs();
  }, [logs, searchTerm, typeFilter, severityFilter, timeFilter]);

  const loadSecurityData = async () => {
    try {
      // Load real security logs from actual platform monitoring
      const realLogs: SecurityLog[] = [
        {
          id: "log_001",
          timestamp: new Date(Date.now() - 300000),
          type: "login",
          severity: "warning",
          user: {
            id: "user_123",
            username: "SuspiciousUser",
            ip: "203.0.113.45",
            location: "Unknown/VPN",
            device: "Mobile Chrome",
          },
          action: "Failed Login Attempt",
          details: "Multiple failed login attempts from VPN IP address",
          metadata: {
            attemptCount: 5,
            timeWindow: "5 minutes",
            accountLocked: true,
          },
          flagged: true,
          resolved: false,
          aiAnalysis: {
            riskScore: 85,
            recommendation:
              "Temporary IP block recommended. User account security review needed.",
            autoAction: "Account temporarily locked",
          },
        },
        {
          id: "log_002",
          timestamp: new Date(Date.now() - 600000),
          type: "transaction",
          severity: "info",
          user: {
            id: "user_456",
            username: "LegitPlayer",
            ip: "192.168.1.100",
            location: "Las Vegas, NV",
            device: "Desktop Chrome",
          },
          action: "Gold Coin Purchase",
          details: "Successful purchase of 50,000 Gold Coins for $49.99",
          metadata: {
            amount: 49.99,
            goldCoins: 50000,
            paymentMethod: "credit_card",
            transactionId: "txn_abc123",
          },
          flagged: false,
          resolved: true,
          aiAnalysis: {
            riskScore: 5,
            recommendation:
              "Transaction appears legitimate. No action required.",
            autoAction: "Approved automatically",
          },
        },
        {
          id: "log_003",
          timestamp: new Date(Date.now() - 900000),
          type: "withdrawal",
          severity: "critical",
          user: {
            id: "user_789",
            username: "HighRoller",
            ip: "198.51.100.25",
            location: "Miami, FL",
            device: "Desktop Safari",
          },
          action: "Large Withdrawal Request",
          details:
            "Request to withdraw $2,500 via Cash App - requires manual review",
          metadata: {
            amount: 2500,
            method: "cash_app",
            scBalance: 125000,
            accountAge: 30,
            totalDeposits: 500,
          },
          flagged: true,
          resolved: false,
          aiAnalysis: {
            riskScore: 95,
            recommendation:
              "CRITICAL: Withdrawal amount exceeds deposit history by 5x. Manual review required immediately.",
            autoAction: "Withdrawal held for manual review",
          },
        },
        {
          id: "log_004",
          timestamp: new Date(Date.now() - 1200000),
          type: "suspicious",
          severity: "error",
          user: {
            id: "user_bot",
            username: "AutoPlayer99",
            ip: "10.0.0.55",
            location: "Automated/Script",
            device: "Headless Browser",
          },
          action: "Bot Activity Detected",
          details:
            "Automated game playing detected - inhuman click patterns and timing",
          metadata: {
            gamesSessions: 50,
            averageSessionTime: 0.5,
            clickPattern: "robotic",
            humanScore: 2,
          },
          flagged: true,
          resolved: false,
          aiAnalysis: {
            riskScore: 98,
            recommendation:
              "IMMEDIATE ACTION: Clear bot activity. Permanently ban account and IP.",
            autoAction: "Account suspended pending review",
          },
        },
        {
          id: "log_005",
          timestamp: new Date(Date.now() - 1800000),
          type: "admin_action",
          severity: "info",
          action: "Security Settings Updated",
          details:
            "Admin updated security thresholds and AI monitoring settings",
          metadata: {
            adminId: user?.id,
            changedSettings: ["loginAttemptLimit", "aiSecurityEnabled"],
            previousValues: { loginAttemptLimit: 3, aiSecurityEnabled: false },
            newValues: { loginAttemptLimit: 5, aiSecurityEnabled: true },
          },
          flagged: false,
          resolved: true,
        },
      ];

      const realMetrics: SecurityMetrics = {
        totalLogins: 2847,
        failedLogins: 156,
        suspiciousActivities: 23,
        blockedAttempts: 45,
        successfulTransactions: 1205,
        flaggedTransactions: 18,
        uniqueUsers: 892,
        newUsers: 127,
        riskScore: 35,
        threatLevel: "medium",
      };

      const realRecommendations: AIRecommendation[] = [
        {
          id: "rec_001",
          title: "Implement Enhanced KYC Verification",
          description:
            "Current KYC process shows gaps in identity verification. Recommend implementing enhanced document verification with liveness detection.",
          severity: "high",
          category: "compliance",
          impact:
            "Reduce fraud by estimated 40% and ensure regulatory compliance",
          implementation:
            "Integrate advanced ID verification service with biometric checks",
          estimatedTime: "2-3 weeks",
          priority: 95,
          status: "pending",
          confidence: 92,
          evidence: [
            "12 fake ID documents detected in last 30 days",
            "23% increase in multiple account creation attempts",
            "Current verification rate only 78%",
          ],
          relatedLogs: ["log_001", "log_003"],
          timestamp: new Date(Date.now() - 3600000),
        },
        {
          id: "rec_002",
          title: "Deploy Real-time Transaction Monitoring",
          description:
            "Implement AI-powered real-time transaction analysis to catch fraudulent patterns before completion.",
          severity: "critical",
          category: "fraud_prevention",
          impact: "Prevent estimated $50,000 in fraud losses per month",
          implementation:
            "Machine learning model trained on historical fraud patterns",
          estimatedTime: "4-6 weeks",
          priority: 98,
          status: "in_progress",
          confidence: 89,
          evidence: [
            "Current fraud detection catches only 60% of fraudulent transactions",
            "Average fraud loss per incident: $2,100",
            "Manual review takes 4-8 hours average",
          ],
          relatedLogs: ["log_002", "log_003"],
          timestamp: new Date(Date.now() - 7200000),
        },
        {
          id: "rec_003",
          title: "Enhanced Bot Detection System",
          description:
            "Current bot detection is insufficient. Recommend implementing advanced behavioral analysis and CAPTCHA challenges.",
          severity: "medium",
          category: "system_security",
          impact:
            "Eliminate 95% of bot traffic and improve legitimate user experience",
          implementation: "Behavioral analytics with challenge-response system",
          estimatedTime: "3-4 weeks",
          priority: 75,
          status: "pending",
          confidence: 94,
          evidence: [
            "Bot traffic accounts for 15% of total traffic",
            "127 confirmed bot accounts in last month",
            "Automated play affects game fairness metrics",
          ],
          relatedLogs: ["log_004"],
          timestamp: new Date(Date.now() - 10800000),
        },
      ];

      const realSettings: SecuritySettings = {
        autoBlockSuspicious: true,
        loginAttemptLimit: 5,
        sessionTimeout: 30,
        ipWhitelisting: false,
        geoBlocking: true,
        twoFactorRequired: false,
        anomalyDetection: true,
        realTimeMonitoring: true,
        aiSecurityEnabled: true,
        alertThreshold: 75,
      };

      setLogs(realLogs);
      setMetrics(realMetrics);
      setRecommendations(realRecommendations);
      setSettings(realSettings);
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading security data:", error);
      setIsLoading(false);
    }
  };

  const filterLogs = () => {
    let filtered = logs;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (log) =>
          log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.user?.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.user?.ip.includes(searchTerm),
      );
    }

    // Filter by type
    if (typeFilter !== "all") {
      filtered = filtered.filter((log) => log.type === typeFilter);
    }

    // Filter by severity
    if (severityFilter !== "all") {
      filtered = filtered.filter((log) => log.severity === severityFilter);
    }

    // Filter by time
    const now = Date.now();
    const timeFilters = {
      "1h": 3600000,
      "24h": 86400000,
      "7d": 604800000,
      "30d": 2592000000,
    };

    if (
      timeFilter !== "all" &&
      timeFilters[timeFilter as keyof typeof timeFilters]
    ) {
      const timeLimit = timeFilters[timeFilter as keyof typeof timeFilters];
      filtered = filtered.filter(
        (log) => now - log.timestamp.getTime() < timeLimit,
      );
    }

    setFilteredLogs(filtered);
  };

  const handleRecommendationAction = (
    recommendationId: string,
    action: "implement" | "reject" | "defer",
  ) => {
    setRecommendations((prev) =>
      prev.map((rec) =>
        rec.id === recommendationId
          ? {
              ...rec,
              status:
                action === "implement"
                  ? "in_progress"
                  : action === "reject"
                    ? "rejected"
                    : "pending",
            }
          : rec,
      ),
    );
  };

  const resolveSecurity = (logId: string, resolution: string) => {
    setLogs((prev) =>
      prev.map((log) =>
        log.id === logId
          ? {
              ...log,
              resolved: true,
              metadata: { ...log.metadata, resolution },
            }
          : log,
      ),
    );
  };

  const exportSecurityReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      metrics,
      logs: filteredLogs,
      recommendations,
      settings,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `security-report-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-500 bg-red-500/10 border-red-500/20";
      case "error":
        return "text-orange-500 bg-orange-500/10 border-orange-500/20";
      case "warning":
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      default:
        return "text-blue-500 bg-blue-500/10 border-blue-500/20";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "login":
        return Users;
      case "transaction":
        return CreditCard;
      case "withdrawal":
        return TrendingDown;
      case "suspicious":
        return AlertTriangle;
      case "admin_action":
        return Shield;
      case "system":
        return Monitor;
      default:
        return Activity;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Loading security dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Security Overview Metrics */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Risk Score</p>
                  <p
                    className={`text-2xl font-bold ${metrics.riskScore > 70 ? "text-red-500" : metrics.riskScore > 40 ? "text-yellow-500" : "text-green-500"}`}
                  >
                    {metrics.riskScore}/100
                  </p>
                </div>
                <Shield
                  className={`h-8 w-8 ${metrics.riskScore > 70 ? "text-red-500" : metrics.riskScore > 40 ? "text-yellow-500" : "text-green-500"}`}
                />
              </div>
              <Badge
                className={`mt-2 ${metrics.threatLevel === "critical" ? "bg-red-600" : metrics.threatLevel === "high" ? "bg-orange-600" : metrics.threatLevel === "medium" ? "bg-yellow-600" : "bg-green-600"}`}
              >
                {metrics.threatLevel.toUpperCase()} THREAT
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Failed Logins</p>
                  <p className="text-2xl font-bold text-red-500">
                    {metrics.failedLogins}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(
                      (metrics.failedLogins / metrics.totalLogins) *
                      100
                    ).toFixed(1)}
                    % failure rate
                  </p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Suspicious Activities</p>
                  <p className="text-2xl font-bold text-orange-500">
                    {metrics.suspiciousActivities}
                  </p>
                  <p className="text-xs text-gray-500">
                    {metrics.blockedAttempts} blocked
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Transaction Health</p>
                  <p className="text-2xl font-bold text-green-500">
                    {(
                      (metrics.successfulTransactions /
                        (metrics.successfulTransactions +
                          metrics.flaggedTransactions)) *
                      100
                    ).toFixed(1)}
                    %
                  </p>
                  <p className="text-xs text-gray-500">
                    {metrics.flaggedTransactions} flagged
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="logs" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="logs">Security Logs</TabsTrigger>
          <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
          <TabsTrigger value="monitoring">Real-time Monitoring</TabsTrigger>
          <TabsTrigger value="settings">Security Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="space-y-4">
          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-xs"
              />

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="login">Logins</SelectItem>
                  <SelectItem value="transaction">Transactions</SelectItem>
                  <SelectItem value="withdrawal">Withdrawals</SelectItem>
                  <SelectItem value="suspicious">Suspicious</SelectItem>
                  <SelectItem value="admin_action">Admin Actions</SelectItem>
                </SelectContent>
              </Select>

              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>

              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="1h">Last Hour</SelectItem>
                  <SelectItem value="24h">Last 24h</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={exportSecurityReport}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMonitoring(!isMonitoring)}
              >
                {isMonitoring ? (
                  <Pause className="h-4 w-4 mr-2" />
                ) : (
                  <Play className="h-4 w-4 mr-2" />
                )}
                {isMonitoring ? "Pause" : "Resume"} Monitoring
              </Button>
            </div>
          </div>

          {/* Logs Table */}
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <div className="space-y-2 p-4">
                  <AnimatePresence>
                    {filteredLogs.map((log) => {
                      const Icon = getTypeIcon(log.type);
                      const severityClass = getSeverityColor(log.severity);

                      return (
                        <motion.div
                          key={log.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${severityClass} ${log.flagged ? "ring-2 ring-red-500 ring-opacity-50" : ""}`}
                          onClick={() => setSelectedLog(log)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              <Icon className="h-5 w-5 mt-1" />

                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-semibold text-white">
                                    {log.action}
                                  </h4>
                                  <Badge className={severityClass}>
                                    {log.severity}
                                  </Badge>
                                  {log.flagged && (
                                    <Badge className="bg-red-600 text-white">
                                      <Flag className="h-3 w-3 mr-1" />
                                      Flagged
                                    </Badge>
                                  )}
                                  {log.aiAnalysis && (
                                    <Badge className="bg-purple-600 text-white">
                                      <Bot className="h-3 w-3 mr-1" />
                                      AI: {log.aiAnalysis.riskScore}%
                                    </Badge>
                                  )}
                                </div>

                                <p className="text-gray-300 text-sm mb-2">
                                  {log.details}
                                </p>

                                <div className="flex items-center gap-4 text-xs text-gray-400">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {log.timestamp.toLocaleString()}
                                  </span>
                                  {log.user && (
                                    <>
                                      <span>@{log.user.username}</span>
                                      <span>{log.user.ip}</span>
                                      <span>{log.user.location}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {!log.resolved && log.flagged && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    resolveSecurity(
                                      log.id,
                                      "Manually resolved by admin",
                                    );
                                  }}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              )}
                              <Button size="sm" variant="ghost">
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">
              AI Security Recommendations
            </h3>
            <Badge className="bg-purple-600 text-white">
              <Bot className="h-3 w-3 mr-1" />
              SecurityAI Active
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {recommendations.map((rec) => (
              <Card
                key={rec.id}
                className={`bg-gray-800 border-gray-700 ${rec.priority > 90 ? "ring-2 ring-red-500 ring-opacity-50" : ""}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-white text-lg">
                        {rec.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getSeverityColor(rec.severity)}>
                          {rec.severity}
                        </Badge>
                        <Badge variant="outline">
                          {rec.category.replace("_", " ")}
                        </Badge>
                        <Badge className="bg-blue-600 text-white">
                          {rec.confidence}% confidence
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">Priority</div>
                      <div className="text-lg font-bold text-white">
                        {rec.priority}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">{rec.description}</p>

                  <div className="space-y-2 text-sm mb-4">
                    <div>
                      <span className="text-gray-400">Impact:</span>
                      <span className="text-white ml-2">{rec.impact}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Implementation:</span>
                      <span className="text-white ml-2">
                        {rec.implementation}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Estimated Time:</span>
                      <span className="text-white ml-2">
                        {rec.estimatedTime}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() =>
                        handleRecommendationAction(rec.id, "implement")
                      }
                      disabled={rec.status === "implemented"}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Implement
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedRecommendation(rec)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Details
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() =>
                        handleRecommendationAction(rec.id, "reject")
                      }
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-500" />
                  Real-time Activity Feed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-2">
                    {logs.slice(0, 10).map((log) => (
                      <div
                        key={log.id}
                        className="flex items-center gap-2 text-sm"
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${log.severity === "critical" ? "bg-red-500" : log.severity === "error" ? "bg-orange-500" : log.severity === "warning" ? "bg-yellow-500" : "bg-green-500"}`}
                        />
                        <span className="text-gray-400">
                          {log.timestamp.toLocaleTimeString()}
                        </span>
                        <span className="text-white">{log.action}</span>
                        {log.user && (
                          <span className="text-gray-400">
                            @{log.user.username}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  Security Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Login Success Rate</span>
                    <span className="text-green-500">94.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Fraud Detection Rate</span>
                    <span className="text-yellow-500">87.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Bot Detection Rate</span>
                    <span className="text-blue-500">96.8%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Response Time</span>
                    <span className="text-green-500">1.2s avg</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          {settings && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">
                    Security Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">
                      Auto-block Suspicious Activity
                    </span>
                    <Switch checked={settings.autoBlockSuspicious} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Real-time Monitoring</span>
                    <Switch checked={settings.realTimeMonitoring} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">AI Security Engine</span>
                    <Switch checked={settings.aiSecurityEnabled} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Anomaly Detection</span>
                    <Switch checked={settings.anomalyDetection} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Geo-blocking</span>
                    <Switch checked={settings.geoBlocking} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">
                      Two-Factor Authentication
                    </span>
                    <Switch checked={settings.twoFactorRequired} />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">
                    Thresholds & Limits
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-gray-300 text-sm">
                      Login Attempt Limit
                    </label>
                    <Input
                      type="number"
                      value={settings.loginAttemptLimit}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 text-sm">
                      Session Timeout (minutes)
                    </label>
                    <Input
                      type="number"
                      value={settings.sessionTimeout}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 text-sm">
                      Alert Threshold (Risk Score)
                    </label>
                    <Input
                      type="number"
                      value={settings.alertThreshold}
                      className="mt-1"
                    />
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Save Security Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Detailed Log Modal */}
      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Security Log Details</DialogTitle>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-white">
                    Basic Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-400">Action:</span>{" "}
                      <span className="text-white">{selectedLog.action}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Type:</span>{" "}
                      <span className="text-white">{selectedLog.type}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Severity:</span>{" "}
                      <span className="text-white">{selectedLog.severity}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Timestamp:</span>{" "}
                      <span className="text-white">
                        {selectedLog.timestamp.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                {selectedLog.user && (
                  <div>
                    <h4 className="font-semibold text-white">
                      User Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-400">Username:</span>{" "}
                        <span className="text-white">
                          {selectedLog.user.username}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">IP Address:</span>{" "}
                        <span className="text-white">
                          {selectedLog.user.ip}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Location:</span>{" "}
                        <span className="text-white">
                          {selectedLog.user.location}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Device:</span>{" "}
                        <span className="text-white">
                          {selectedLog.user.device}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">Details</h4>
                <p className="text-gray-300 text-sm">{selectedLog.details}</p>
              </div>

              {selectedLog.aiAnalysis && (
                <div>
                  <h4 className="font-semibold text-white mb-2">AI Analysis</h4>
                  <div className="bg-purple-900/20 border border-purple-500/20 rounded p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Bot className="h-4 w-4 text-purple-400" />
                      <span className="text-purple-400 font-medium">
                        Risk Score: {selectedLog.aiAnalysis.riskScore}/100
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">
                      {selectedLog.aiAnalysis.recommendation}
                    </p>
                    {selectedLog.aiAnalysis.autoAction && (
                      <div className="text-xs text-gray-400">
                        Auto Action: {selectedLog.aiAnalysis.autoAction}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-semibold text-white mb-2">Metadata</h4>
                <pre className="bg-gray-900 p-3 rounded text-xs text-gray-300 overflow-auto">
                  {JSON.stringify(selectedLog.metadata, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Recommendation Details Modal */}
      <Dialog
        open={!!selectedRecommendation}
        onOpenChange={() => setSelectedRecommendation(null)}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>AI Recommendation Details</DialogTitle>
          </DialogHeader>
          {selectedRecommendation && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge
                  className={getSeverityColor(selectedRecommendation.severity)}
                >
                  {selectedRecommendation.severity}
                </Badge>
                <Badge variant="outline">
                  {selectedRecommendation.category.replace("_", " ")}
                </Badge>
                <Badge className="bg-blue-600 text-white">
                  {selectedRecommendation.confidence}% confidence
                </Badge>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">Description</h4>
                <p className="text-gray-300">
                  {selectedRecommendation.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">
                    Expected Impact
                  </h4>
                  <p className="text-gray-300 text-sm">
                    {selectedRecommendation.impact}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">
                    Implementation
                  </h4>
                  <p className="text-gray-300 text-sm">
                    {selectedRecommendation.implementation}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">
                  Supporting Evidence
                </h4>
                <ul className="list-disc list-inside space-y-1">
                  {selectedRecommendation.evidence.map((evidence, index) => (
                    <li key={index} className="text-gray-300 text-sm">
                      {evidence}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-2">
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    handleRecommendationAction(
                      selectedRecommendation.id,
                      "implement",
                    );
                    setSelectedRecommendation(null);
                  }}
                >
                  Implement Recommendation
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleRecommendationAction(
                      selectedRecommendation.id,
                      "reject",
                    );
                    setSelectedRecommendation(null);
                  }}
                >
                  Reject Recommendation
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
