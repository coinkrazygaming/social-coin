import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Users,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Ban,
  Unlock,
  RefreshCw,
  Shield,
  Clock,
} from "lucide-react";
import { useAuth } from "./AuthContext";

interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role: "user" | "admin" | "staff" | "moderator";
  status: "active" | "suspended" | "pending_verification" | "banned";
  kycStatus: "none" | "pending" | "approved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  lastActivity?: Date;
  ipAddress?: string;
  country?: string;
  city?: string;
  deviceInfo?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  goldCoins: number;
  sweepsCoins: number;
  totalDeposits: number;
  totalWithdrawals: number;
  totalWagered: number;
  gamesPlayed: number;
  loginCount: number;
  flags: string[];
  riskLevel: "low" | "medium" | "high" | "critical";
  notes: string[];
}

interface UserActivity {
  id: string;
  userId: string;
  type:
    | "login"
    | "logout"
    | "game_play"
    | "deposit"
    | "withdrawal"
    | "suspicious_activity";
  description: string;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  metadata: any;
}

interface SecurityFlag {
  id: string;
  userId: string;
  type:
    | "multiple_accounts"
    | "suspicious_betting"
    | "abnormal_activity"
    | "payment_fraud"
    | "location_anomaly";
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  flaggedBy: "system" | "ai" | "staff";
  flaggedAt: Date;
  status: "active" | "resolved" | "false_positive";
  reviewedBy?: string;
  reviewNotes?: string;
}

export function UserManagement() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userActivities, setUserActivities] = useState<UserActivity[]>([]);
  const [securityFlags, setSecurityFlags] = useState<SecurityFlag[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, statusFilter, riskFilter]);

  useEffect(() => {
    if (selectedUser) {
      loadUserDetails(selectedUser.id);
    }
  }, [selectedUser]);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const userData = await response.json();
        const processedUsers = userData.map((u: any) => ({
          ...u,
          createdAt: new Date(u.createdAt),
          updatedAt: new Date(u.updatedAt),
          lastLogin: u.lastLogin ? new Date(u.lastLogin) : undefined,
          lastActivity: u.lastActivity ? new Date(u.lastActivity) : undefined,
        }));
        setUsers(processedUsers);
      }
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserDetails = async (userId: string) => {
    try {
      // Load user activities
      const activitiesResponse = await fetch(
        `/api/admin/users/${userId}/activities`,
      );
      if (activitiesResponse.ok) {
        const activities = await activitiesResponse.json();
        setUserActivities(
          activities.map((a: any) => ({
            ...a,
            timestamp: new Date(a.timestamp),
          })),
        );
      }

      // Load security flags
      const flagsResponse = await fetch(
        `/api/admin/users/${userId}/security-flags`,
      );
      if (flagsResponse.ok) {
        const flags = await flagsResponse.json();
        setSecurityFlags(
          flags.map((f: any) => ({
            ...f,
            flaggedAt: new Date(f.flaggedAt),
          })),
        );
      }
    } catch (error) {
      console.error("Error loading user details:", error);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.email.toLowerCase().includes(term) ||
          user.username.toLowerCase().includes(term) ||
          (user.firstName && user.firstName.toLowerCase().includes(term)) ||
          (user.lastName && user.lastName.toLowerCase().includes(term)),
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((user) => user.status === statusFilter);
    }

    if (riskFilter !== "all") {
      filtered = filtered.filter((user) => user.riskLevel === riskFilter);
    }

    setFilteredUsers(filtered);
  };

  const updateUserStatus = async (
    userId: string,
    newStatus: string,
    reason?: string,
  ) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          reason,
          adminId: currentUser?.id,
        }),
      });

      if (response.ok) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId ? { ...u, status: newStatus as any } : u,
          ),
        );

        if (selectedUser?.id === userId) {
          setSelectedUser((prev) =>
            prev ? { ...prev, status: newStatus as any } : null,
          );
        }

        await loadUserDetails(userId); // Refresh activities
      }
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const resolveSecurityFlag = async (
    flagId: string,
    resolution: "resolved" | "false_positive",
    notes: string,
  ) => {
    try {
      const response = await fetch(
        `/api/admin/security-flags/${flagId}/resolve`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: resolution,
            reviewNotes: notes,
            reviewedBy: currentUser?.username,
          }),
        },
      );

      if (response.ok) {
        setSecurityFlags((prev) =>
          prev.map((flag) =>
            flag.id === flagId
              ? {
                  ...flag,
                  status: resolution,
                  reviewNotes: notes,
                  reviewedBy: currentUser?.username,
                }
              : flag,
          ),
        );
      }
    } catch (error) {
      console.error("Error resolving security flag:", error);
    }
  };

  const exportUserData = async (format: "csv" | "json") => {
    try {
      const response = await fetch(`/api/admin/users/export?format=${format}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `users_export_${new Date().toISOString().split("T")[0]}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("Error exporting user data:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "suspended":
        return "bg-yellow-500";
      case "banned":
        return "bg-red-500";
      case "pending_verification":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "text-green-400";
      case "medium":
        return "text-yellow-400";
      case "high":
        return "text-orange-400";
      case "critical":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-blue-500";
      case "medium":
        return "bg-yellow-500";
      case "high":
        return "bg-orange-500";
      case "critical":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 flex items-center justify-center">
        <Card className="bg-gray-800 border-gray-700 p-8">
          <div className="text-center">
            <Shield className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
            <p className="text-gray-400">Admin privileges required</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 p-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            User Management
          </h1>
          <p className="text-purple-200">
            Comprehensive user administration and monitoring
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">All Users</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6 text-center">
                  <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-400">
                    {users.length}
                  </div>
                  <div className="text-gray-400">Total Users</div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6 text-center">
                  <Activity className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-400">
                    {users.filter((u) => u.status === "active").length}
                  </div>
                  <div className="text-gray-400">Active Users</div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6 text-center">
                  <AlertTriangle className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-yellow-400">
                    {
                      users.filter(
                        (u) =>
                          u.riskLevel === "high" || u.riskLevel === "critical",
                      ).length
                    }
                  </div>
                  <div className="text-gray-400">High Risk Users</div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6 text-center">
                  <DollarSign className="h-8 w-8 text-gold mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gold">
                    $
                    {users
                      .reduce((sum, u) => sum + u.totalDeposits, 0)
                      .toLocaleString()}
                  </div>
                  <div className="text-gray-400">Total Deposits</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Registrations */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">
                  Recent Registrations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {users
                    .sort(
                      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
                    )
                    .slice(0, 10)
                    .map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                            <span className="text-white font-medium">
                              {user.username}
                            </span>
                            <span className="text-gray-400 text-sm">
                              {user.email}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={`${getStatusColor(user.status)} text-white`}
                          >
                            {user.status}
                          </Badge>
                          <span className="text-gray-400 text-sm">
                            {user.createdAt.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            {/* Filters and Search */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search users by email, username, or name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="banned">Banned</SelectItem>
                      <SelectItem value="pending_verification">
                        Pending
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={riskFilter} onValueChange={setRiskFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by risk" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Risk Levels</SelectItem>
                      <SelectItem value="low">Low Risk</SelectItem>
                      <SelectItem value="medium">Medium Risk</SelectItem>
                      <SelectItem value="high">High Risk</SelectItem>
                      <SelectItem value="critical">Critical Risk</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={() => exportUserData("csv")}
                    variant="outline"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Users Table */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">User</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-300">
                        Risk Level
                      </TableHead>
                      <TableHead className="text-gray-300">Balance</TableHead>
                      <TableHead className="text-gray-300">
                        Last Activity
                      </TableHead>
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow
                        key={user.id}
                        className="border-gray-700 hover:bg-gray-700/50"
                      >
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-white font-medium">
                              {user.username}
                            </span>
                            <span className="text-gray-400 text-sm">
                              {user.email}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${getStatusColor(user.status)} text-white`}
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className={getRiskColor(user.riskLevel)}>
                            {user.riskLevel.toUpperCase()}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="text-yellow-400">
                              {user.goldCoins.toLocaleString()} GC
                            </div>
                            <div className="text-green-400">
                              {user.sweepsCoins.toFixed(2)} SC
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-400">
                          {user.lastActivity
                            ? user.lastActivity.toLocaleDateString()
                            : "Never"}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedUser(user)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {user.status === "active" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  updateUserStatus(
                                    user.id,
                                    "suspended",
                                    "Admin action",
                                  )
                                }
                              >
                                <Ban className="h-4 w-4" />
                              </Button>
                            )}
                            {user.status === "suspended" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  updateUserStatus(
                                    user.id,
                                    "active",
                                    "Admin action",
                                  )
                                }
                              >
                                <Unlock className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            {/* Security Flags */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-400" />
                  Security Flags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {securityFlags
                    .filter((flag) => flag.status === "active")
                    .map((flag) => (
                      <div
                        key={flag.id}
                        className="p-4 bg-gray-700/50 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-3 h-3 rounded-full ${getSeverityColor(flag.severity)}`}
                            />
                            <div>
                              <div className="text-white font-medium">
                                {flag.type.replace(/_/g, " ").toUpperCase()}
                              </div>
                              <div className="text-gray-400 text-sm">
                                User:{" "}
                                {
                                  users.find((u) => u.id === flag.userId)
                                    ?.username
                                }{" "}
                                • Flagged: {flag.flaggedAt.toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <Badge variant="outline">{flag.severity}</Badge>
                        </div>
                        <p className="text-gray-300 mb-3">{flag.description}</p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() =>
                              resolveSecurityFlag(
                                flag.id,
                                "resolved",
                                "Reviewed and resolved",
                              )
                            }
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Resolve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              resolveSecurityFlag(
                                flag.id,
                                "false_positive",
                                "False positive",
                              )
                            }
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            False Positive
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">User Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-white">
                  <p>
                    Comprehensive user analytics and reporting features will be
                    available here.
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Including user growth trends, engagement metrics, revenue
                    analytics, and behavioral insights.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* User Detail Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="bg-gray-800 border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white flex items-center gap-3">
                    <Users className="h-6 w-6" />
                    {selectedUser.username}
                  </CardTitle>
                  <Button variant="ghost" onClick={() => setSelectedUser(null)}>
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* User Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-white font-semibold mb-3">
                      Personal Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Email:</span>
                        <span className="text-white">{selectedUser.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Name:</span>
                        <span className="text-white">
                          {selectedUser.firstName} {selectedUser.lastName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Phone:</span>
                        <span className="text-white">
                          {selectedUser.phone || "Not provided"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <Badge
                          className={`${getStatusColor(selectedUser.status)} text-white`}
                        >
                          {selectedUser.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-white font-semibold mb-3">
                      Account Statistics
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Gold Coins:</span>
                        <span className="text-yellow-400">
                          {selectedUser.goldCoins.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Sweeps Coins:</span>
                        <span className="text-green-400">
                          {selectedUser.sweepsCoins.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Deposits:</span>
                        <span className="text-white">
                          ${selectedUser.totalDeposits.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Games Played:</span>
                        <span className="text-white">
                          {selectedUser.gamesPlayed}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activities */}
                <div>
                  <h3 className="text-white font-semibold mb-3">
                    Recent Activities
                  </h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {userActivities.slice(0, 10).map((activity) => (
                      <div
                        key={activity.id}
                        className="flex justify-between items-center p-2 bg-gray-700/50 rounded"
                      >
                        <span className="text-gray-300">
                          {activity.description}
                        </span>
                        <span className="text-gray-400 text-sm">
                          {activity.timestamp.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Security Flags for this user */}
                {securityFlags.length > 0 && (
                  <div>
                    <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-400" />
                      Security Flags
                    </h3>
                    <div className="space-y-2">
                      {securityFlags.map((flag) => (
                        <div
                          key={flag.id}
                          className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-white font-medium">
                              {flag.type}
                            </span>
                            <Badge
                              className={`${getSeverityColor(flag.severity)} text-white`}
                            >
                              {flag.severity}
                            </Badge>
                          </div>
                          <p className="text-gray-300 text-sm mt-1">
                            {flag.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
