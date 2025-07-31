import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Switch } from "../components/ui/switch";
import { useAuth } from "../components/AuthContext";
import { AccessDeniedModal } from "../components/AccessDeniedModal";
import { VisualSlotEditor } from "../components/VisualSlotEditor";
import { JoseyAI } from "../components/JoseyAI";
import { SecurityTab } from "../components/SecurityTab";
import { AIEmployeeManagement } from "../components/AIEmployeeManagement";
import { KYCOnboarding } from "../components/KYCOnboarding";
import { BonusManagement } from "../components/BonusManagement";
import { JackpotManagement } from "../components/JackpotManagement";
import { VIPManagement } from "../components/VIPManagement";
import { PaymentSettings } from "../components/PaymentSettings";
import { LeaderboardManagement } from "../components/LeaderboardManagement";
import { AchievementBadgeSystem } from "../components/AchievementBadgeSystem";
import { EnhancedCasinoBanking } from "../components/EnhancedCasinoBanking";
import { TickerManagement } from "../components/TickerManagement";
import { UserManagementSystem } from "../components/UserManagementSystem";
import { AIGameDeveloper } from "../components/AIGameDeveloper";
import {
  GoldCoinPackage,
  StoreSettings,
  AdminLog,
  RefundRequest,
} from "@shared/storeTypes";
import { RedemptionRequest } from "@shared/userTypes";
import { SlotMachine as SlotMachineType } from "@shared/slotTypes";
import {
  Settings,
  Package,
  DollarSign,
  Users,
  FileText,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Crown,
  TrendingUp,
  Target,
  Star,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  MessageSquare,
  Bot,
  Gift,
} from "lucide-react";

export function AdminPanel() {
  const { user } = useAuth();
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [packages, setPackages] = useState<GoldCoinPackage[]>([]);
  const [storeSettings, setStoreSettings] = useState<StoreSettings | null>(
    null,
  );
  const [adminLogs, setAdminLogs] = useState<AdminLog[]>([]);
  const [redemptionRequests, setRedemptionRequests] = useState<
    RedemptionRequest[]
  >([]);
  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPackage, setEditingPackage] = useState<GoldCoinPackage | null>(
    null,
  );
  const [showNewPackageForm, setShowNewPackageForm] = useState(false);
  const [newPackage, setNewPackage] = useState({
    name: "",
    description: "",
    goldCoins: 0,
    bonusSweepsCoins: 0,
    price: 0,
    originalPrice: 0,
    image: "",
    popular: false,
    bestValue: false,
    features: [""],
    isActive: true,
  });
  const [paymentStats, setPaymentStats] = useState<any>(null);
  const [inHouseSlots, setInHouseSlots] = useState<SlotMachineType[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<SlotMachineType | null>(
    null,
  );
  const [showSlotEditor, setShowSlotEditor] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      setShowAccessDenied(true);
      return;
    }

    fetchAdminData();
  }, [user]);

  const fetchAdminData = async () => {
    if (!user) return;

    try {
      const [
        packagesRes,
        settingsRes,
        logsRes,
        redemptionsRes,
        refundsRes,
        statsRes,
      ] = await Promise.all([
        fetch("/api/store/packages", {
          headers: { adminId: user.id, adminUsername: user.username },
        }),
        fetch("/api/store/settings", {
          headers: { adminId: user.id, adminUsername: user.username },
        }),
        fetch("/api/store/admin-logs", {
          headers: { adminId: user.id, adminUsername: user.username },
        }),
        fetch("/api/users/redemptions/all", {
          headers: { adminId: user.id, adminUsername: user.username },
        }),
        fetch("/api/store/refund-requests", {
          headers: { adminId: user.id, adminUsername: user.username },
        }),
        fetch("/api/store/payment-stats", {
          headers: { adminId: user.id, adminUsername: user.username },
        }),
      ]);

      // Handle packages response
      try {
        if (
          packagesRes.ok &&
          packagesRes.headers.get("content-type")?.includes("application/json")
        ) {
          setPackages(await packagesRes.json());
        } else {
          console.warn(
            "Packages API returned non-JSON response:",
            packagesRes.status,
          );
          setPackages([]);
        }
      } catch (e) {
        console.error("Error parsing packages response:", e);
        setPackages([]);
      }

      // Handle settings response
      try {
        if (
          settingsRes.ok &&
          settingsRes.headers.get("content-type")?.includes("application/json")
        ) {
          setStoreSettings(await settingsRes.json());
        } else {
          console.warn(
            "Settings API returned non-JSON response:",
            settingsRes.status,
          );
        }
      } catch (e) {
        console.error("Error parsing settings response:", e);
      }

      // Handle logs response
      try {
        if (
          logsRes.ok &&
          logsRes.headers.get("content-type")?.includes("application/json")
        ) {
          setAdminLogs(await logsRes.json());
        } else {
          console.warn("Logs API returned non-JSON response:", logsRes.status);
          setAdminLogs([]);
        }
      } catch (e) {
        console.error("Error parsing logs response:", e);
        setAdminLogs([]);
      }

      // Handle redemptions response
      try {
        if (
          redemptionsRes.ok &&
          redemptionsRes.headers
            .get("content-type")
            ?.includes("application/json")
        ) {
          setRedemptionRequests(await redemptionsRes.json());
        } else {
          console.warn(
            "Redemptions API returned non-JSON response:",
            redemptionsRes.status,
          );
          setRedemptionRequests([]);
        }
      } catch (e) {
        console.error("Error parsing redemptions response:", e);
        setRedemptionRequests([]);
      }

      // Handle refunds response
      try {
        if (
          refundsRes.ok &&
          refundsRes.headers.get("content-type")?.includes("application/json")
        ) {
          setRefundRequests(await refundsRes.json());
        } else {
          console.warn(
            "Refunds API returned non-JSON response:",
            refundsRes.status,
          );
          setRefundRequests([]);
        }
      } catch (e) {
        console.error("Error parsing refunds response:", e);
        setRefundRequests([]);
      }

      // Handle stats response
      try {
        if (
          statsRes.ok &&
          statsRes.headers.get("content-type")?.includes("application/json")
        ) {
          setPaymentStats(await statsRes.json());
        } else {
          console.warn(
            "Stats API returned non-JSON response:",
            statsRes.status,
          );
          setPaymentStats(null);
        }
      } catch (e) {
        console.error("Error parsing stats response:", e);
        setPaymentStats(null);
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePackageCreate = async () => {
    try {
      const response = await fetch("/api/store/packages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          adminId: user!.id,
          adminUsername: user!.username,
        },
        body: JSON.stringify(newPackage),
      });

      if (response.ok) {
        setShowNewPackageForm(false);
        setNewPackage({
          name: "",
          description: "",
          goldCoins: 0,
          bonusSweepsCoins: 0,
          price: 0,
          originalPrice: 0,
          image: "",
          popular: false,
          bestValue: false,
          features: [""],
          isActive: true,
        });
        fetchAdminData();
        alert("Package created successfully!");
      }
    } catch (error) {
      console.error("Error creating package:", error);
      alert("Failed to create package");
    }
  };

  const handlePackageUpdate = async (
    packageId: string,
    updates: Partial<GoldCoinPackage>,
  ) => {
    try {
      const response = await fetch(`/api/store/packages/${packageId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          adminId: user!.id,
          adminUsername: user!.username,
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        fetchAdminData();
        setEditingPackage(null);
        alert("Package updated successfully!");
      }
    } catch (error) {
      console.error("Error updating package:", error);
      alert("Failed to update package");
    }
  };

  const handlePackageDelete = async (packageId: string) => {
    if (!confirm("Are you sure you want to delete this package?")) return;

    try {
      const response = await fetch(`/api/store/packages/${packageId}`, {
        method: "DELETE",
        headers: {
          adminId: user!.id,
          adminUsername: user!.username,
        },
      });

      if (response.ok) {
        fetchAdminData();
        alert("Package deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting package:", error);
      alert("Failed to delete package");
    }
  };

  const handleRedemptionReview = async (
    requestId: string,
    status: "approved" | "denied",
    notes: string,
  ) => {
    try {
      const response = await fetch(
        `/api/users/redemptions/${requestId}/review`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            adminId: user!.id,
            adminUsername: user!.username,
          },
          body: JSON.stringify({ status, reviewNotes: notes }),
        },
      );

      if (response.ok) {
        fetchAdminData();
        alert(`Redemption request ${status}!`);
      }
    } catch (error) {
      console.error("Error reviewing redemption:", error);
      alert("Failed to review redemption request");
    }
  };

  const handleRefundReview = async (
    refundId: string,
    status: "approved" | "denied",
    notes: string,
  ) => {
    try {
      const response = await fetch(
        `/api/store/refund-requests/${refundId}/process`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            adminId: user!.id,
            adminUsername: user!.username,
          },
          body: JSON.stringify({ status, reviewNotes: notes }),
        },
      );

      if (response.ok) {
        fetchAdminData();
        alert(`Refund request ${status}!`);
      }
    } catch (error) {
      console.error("Error processing refund:", error);
      alert("Failed to process refund request");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "approved":
      case "paid":
        return "bg-green-600";
      case "pending":
      case "staff_review":
      case "admin_review":
        return "bg-yellow-600";
      case "denied":
      case "failed":
        return "bg-red-600";
      default:
        return "bg-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
      case "approved":
      case "paid":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
      case "staff_review":
      case "admin_review":
        return <Clock className="w-4 h-4" />;
      case "denied":
      case "failed":
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <AccessDeniedModal
        isOpen={showAccessDenied}
        onClose={() => setShowAccessDenied(false)}
        feature="Admin Panel"
      />
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading admin panel...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              CoinKrazy Admin Panel 👑
            </h1>
            <p className="text-purple-200">
              Manage store, users, and platform settings
            </p>
          </div>
          <div className="flex items-center gap-2 text-white">
            <Crown className="w-5 h-5 text-yellow-400" />
            <span>Admin: {user.username}</span>
          </div>
        </div>

        {/* Overview Stats */}
        {paymentStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4 text-center">
                <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-500">
                  ${paymentStats.totalRevenue.toFixed(2)}
                </div>
                <div className="text-sm text-gray-400">Total Revenue</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-500">
                  ${paymentStats.todayRevenue.toFixed(2)}
                </div>
                <div className="text-sm text-gray-400">Today's Revenue</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4 text-center">
                <Activity className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-500">
                  {paymentStats.totalTransactions}
                </div>
                <div className="text-sm text-gray-400">Total Transactions</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4 text-center">
                <Target className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-500">
                  ${paymentStats.averageTransactionValue.toFixed(2)}
                </div>
                <div className="text-sm text-gray-400">Avg Transaction</div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList
            className="grid w-full grid-cols-19"
            style={{ gridTemplateColumns: "repeat(19, 1fr)" }}
          >
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="ai-employees">AI Employees</TabsTrigger>
            <TabsTrigger value="kyc">KYC</TabsTrigger>
            <TabsTrigger value="bonuses">Bonuses</TabsTrigger>
            <TabsTrigger value="jackpots">Jackpots</TabsTrigger>
            <TabsTrigger value="vip">VIP</TabsTrigger>
            <TabsTrigger value="games">Games</TabsTrigger>
            <TabsTrigger value="ai-developer">AI Game Dev</TabsTrigger>
            <TabsTrigger value="packages">Packages</TabsTrigger>
            <TabsTrigger value="redemptions">Redemptions</TabsTrigger>
            <TabsTrigger value="refunds">Refunds</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="leaderboards">Leaderboards</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="banking">Banking</TabsTrigger>
            <TabsTrigger value="usermanagement">Users</TabsTrigger>
            <TabsTrigger value="ticker">Ticker</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pending Actions */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    Pending Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Pending Redemptions</span>
                    <Badge className="bg-yellow-600">
                      {
                        redemptionRequests.filter(
                          (r) =>
                            r.status === "pending" ||
                            r.status === "staff_review",
                        ).length
                      }
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Pending Refunds</span>
                    <Badge className="bg-yellow-600">
                      {
                        refundRequests.filter((r) => r.status === "pending")
                          .length
                      }
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Active Packages</span>
                    <Badge className="bg-green-600">
                      {packages.filter((p) => p.isActive).length}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Popular Packages */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    Popular Packages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {paymentStats?.popularPackages && (
                    <div className="space-y-3">
                      {paymentStats.popularPackages
                        .slice(0, 5)
                        .map((pkg: any, index: number) => (
                          <div
                            key={pkg.packageId}
                            className="flex justify-between items-center"
                          >
                            <span className="text-gray-400">{pkg.name}</span>
                            <div className="text-right">
                              <div className="text-white font-medium">
                                {pkg.count} sales
                              </div>
                              <div className="text-sm text-gray-400">
                                ${pkg.revenue.toFixed(2)}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* LuckyAI Department Managers */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Bot className="w-5 h-5 text-blue-500" />
                  AI Department Managers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-700 rounded-lg text-center">
                    <div className="text-2xl mb-2">🎰</div>
                    <h3 className="text-white font-medium">SlotAI Manager</h3>
                    <p className="text-sm text-gray-400">
                      Manages slot games and RTP
                    </p>
                    <Button size="sm" className="mt-2" variant="outline">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Chat
                    </Button>
                  </div>

                  <div className="p-4 bg-gray-700 rounded-lg text-center">
                    <div className="text-2xl mb-2">🏆</div>
                    <h3 className="text-white font-medium">SportsAI Manager</h3>
                    <p className="text-sm text-gray-400">
                      Handles sportsbook operations
                    </p>
                    <Button size="sm" className="mt-2" variant="outline">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Chat
                    </Button>
                  </div>

                  <div className="p-4 bg-gray-700 rounded-lg text-center">
                    <div className="text-2xl mb-2">💰</div>
                    <h3 className="text-white font-medium">StoreAI Manager</h3>
                    <p className="text-sm text-gray-400">
                      Oversees coin store and payments
                    </p>
                    <Button size="sm" className="mt-2" variant="outline">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Chat
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <SecurityTab />
          </TabsContent>

          <TabsContent value="ai-employees" className="space-y-6">
            <AIEmployeeManagement />
          </TabsContent>

          <TabsContent value="kyc" className="space-y-6">
            <KYCOnboarding />
          </TabsContent>

          <TabsContent value="bonuses" className="space-y-6">
            <BonusManagement />
          </TabsContent>

          <TabsContent value="jackpots" className="space-y-6">
            <JackpotManagement />
          </TabsContent>

          <TabsContent value="vip" className="space-y-6">
            <VIPManagement />
          </TabsContent>

          <TabsContent value="games" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Main Content Area */}
              <div className="xl:col-span-2 space-y-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white flex items-center gap-2">
                        <Crown className="w-6 h-6 text-gold" />
                        In-House Slot Management
                        <Badge className="bg-gold text-black font-bold">
                          CoinKrazy Studio
                        </Badge>
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={() => {
                            setSelectedSlot(null);
                            setShowSlotEditor(true);
                          }}
                          className="bg-gold hover:bg-gold/80 text-black font-bold"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Create New Slot
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {showSlotEditor ? (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-bold text-white">
                            {selectedSlot
                              ? "Edit Slot Machine"
                              : "Create New Slot Machine"}
                          </h3>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setShowSlotEditor(false);
                              setSelectedSlot(null);
                            }}
                          >
                            Back to List
                          </Button>
                        </div>
                        <VisualSlotEditor
                          initialSlot={selectedSlot || undefined}
                          onSave={async (slot) => {
                            // Add slot to list and close editor
                            setInHouseSlots((prev) => {
                              const existing = prev.findIndex(
                                (s) => s.id === slot.id,
                              );
                              if (existing >= 0) {
                                const updated = [...prev];
                                updated[existing] = slot;
                                return updated;
                              }
                              return [...prev, slot];
                            });
                            setShowSlotEditor(false);
                            setSelectedSlot(null);
                          }}
                          onPreview={(slot) => {
                            console.log("Previewing slot:", slot);
                          }}
                        />
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Slot Machine List */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {inHouseSlots.length === 0 ? (
                            <div className="col-span-2 text-center py-12">
                              <Crown className="w-16 h-16 text-gold mx-auto mb-4 opacity-50" />
                              <h3 className="text-xl font-semibold text-white mb-2">
                                No Slots Created Yet
                              </h3>
                              <p className="text-gray-400 mb-6">
                                Create your first in-house slot machine with our
                                visual editor
                              </p>
                              <Button
                                onClick={() => setShowSlotEditor(true)}
                                className="bg-gold hover:bg-gold/80 text-black font-bold"
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Create Your First Slot
                              </Button>
                            </div>
                          ) : (
                            inHouseSlots.map((slot) => (
                              <Card
                                key={slot.id}
                                className="bg-gray-700 border-gray-600"
                              >
                                <CardHeader>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                      <img
                                        src={
                                          slot.thumbnail ||
                                          "/slot-placeholder.png"
                                        }
                                        alt={slot.name}
                                        className="w-12 h-12 rounded border border-gold/50"
                                      />
                                      <div>
                                        <CardTitle className="text-white text-lg">
                                          {slot.name}
                                        </CardTitle>
                                        <p className="text-gray-400 text-sm">
                                          {slot.theme}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Badge
                                        variant={
                                          slot.active ? "default" : "secondary"
                                        }
                                      >
                                        {slot.active ? "Active" : "Inactive"}
                                      </Badge>
                                      {slot.featured && (
                                        <Badge className="bg-gold text-black">
                                          Featured
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </CardHeader>
                                <CardContent>
                                  <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                                    <div>
                                      <span className="text-gray-400">
                                        RTP:
                                      </span>
                                      <div className="text-white font-semibold">
                                        {slot.rtp}%
                                      </div>
                                    </div>
                                    <div>
                                      <span className="text-gray-400">
                                        Volatility:
                                      </span>
                                      <div className="text-white font-semibold capitalize">
                                        {slot.volatility}
                                      </div>
                                    </div>
                                    <div>
                                      <span className="text-gray-400">
                                        Symbols:
                                      </span>
                                      <div className="text-white font-semibold">
                                        {slot.symbols.length}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex space-x-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        setSelectedSlot(slot);
                                        setShowSlotEditor(true);
                                      }}
                                    >
                                      <Edit className="w-4 h-4 mr-1" />
                                      Edit
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        // Preview slot
                                        console.log("Preview slot:", slot);
                                      }}
                                    >
                                      <Eye className="w-4 h-4 mr-1" />
                                      Preview
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        setInHouseSlots((prev) =>
                                          prev.filter((s) => s.id !== slot.id),
                                        );
                                      }}
                                    >
                                      <Trash2 className="w-4 h-4 mr-1" />
                                      Delete
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            ))
                          )}
                        </div>

                        {/* Mini Games Management */}
                        <Card className="bg-gray-800 border-gray-700">
                          <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                              <Zap className="w-5 h-5 text-blue-400" />
                              Mini Games Management
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <Card className="bg-gray-700 border-gray-600">
                                <CardContent className="p-4">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <h4 className="text-white font-semibold">
                                        Total Plays
                                      </h4>
                                      <p className="text-2xl font-bold text-blue-400">
                                        1,247
                                      </p>
                                    </div>
                                    <Activity className="w-8 h-8 text-blue-400" />
                                  </div>
                                </CardContent>
                              </Card>
                              <Card className="bg-gray-700 border-gray-600">
                                <CardContent className="p-4">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <h4 className="text-white font-semibold">
                                        SC Paid Out
                                      </h4>
                                      <p className="text-2xl font-bold text-gold">
                                        $45.67
                                      </p>
                                    </div>
                                    <DollarSign className="w-8 h-8 text-gold" />
                                  </div>
                                </CardContent>
                              </Card>
                              <Card className="bg-gray-700 border-gray-600">
                                <CardContent className="p-4">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <h4 className="text-white font-semibold">
                                        Pending Approvals
                                      </h4>
                                      <p className="text-2xl font-bold text-yellow-400">
                                        23
                                      </p>
                                    </div>
                                    <Clock className="w-8 h-8 text-yellow-400" />
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                            <div className="mt-4">
                              <Button variant="outline" className="w-full">
                                <Settings className="w-4 h-4 mr-2" />
                                Mini Game Settings
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* JoseyAI Assistant Sidebar */}
              <div className="space-y-6">
                <JoseyAI
                  context="slot-editor"
                  onSuggestionApply={(suggestion) => {
                    console.log("JoseyAI suggestion:", suggestion);
                  }}
                  onCodeGenerate={(code) => {
                    console.log("JoseyAI generated code:", code);
                  }}
                />

                {/* Quick Stats */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-green-400" />
                      Slot Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Total Slots</span>
                        <Badge className="bg-blue-600">
                          {inHouseSlots.length}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Active Slots</span>
                        <Badge className="bg-green-600">
                          {inHouseSlots.filter((s) => s.active).length}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Featured</span>
                        <Badge className="bg-gold text-black">
                          {inHouseSlots.filter((s) => s.featured).length}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Avg RTP</span>
                        <Badge variant="outline">
                          {inHouseSlots.length > 0
                            ? (
                                inHouseSlots.reduce(
                                  (acc, s) => acc + s.rtp,
                                  0,
                                ) / inHouseSlots.length
                              ).toFixed(1) + "%"
                            : "N/A"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Target className="w-5 h-5 text-purple-400" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => setShowSlotEditor(true)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create New Slot
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export All Configs
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Import Slot Config
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <Star className="w-4 h-4 mr-2" />
                        Featured Management
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="packages" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">
                Package Management
              </h2>
              <Button
                onClick={() => setShowNewPackageForm(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Package
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <Card key={pkg.id} className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-white text-lg">
                          {pkg.name}
                        </CardTitle>
                        <p className="text-gray-400 text-sm">
                          {pkg.description}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingPackage(pkg)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePackageDelete(pkg.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Price:</span>
                        <span className="text-white">${pkg.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Gold Coins:</span>
                        <span className="text-yellow-500">
                          {pkg.goldCoins.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Bonus SC:</span>
                        <span className="text-green-500">
                          {pkg.bonusSweepsCoins}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-gray-400">Status:</span>
                        <Badge
                          className={
                            pkg.isActive ? "bg-green-600" : "bg-red-600"
                          }
                        >
                          {pkg.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      {(pkg.popular || pkg.bestValue) && (
                        <div className="flex gap-2 mt-2">
                          {pkg.popular && (
                            <Badge className="bg-purple-600">Popular</Badge>
                          )}
                          {pkg.bestValue && (
                            <Badge className="bg-green-600">Best Value</Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="redemptions" className="space-y-6">
            <h2 className="text-2xl font-bold text-white">
              Prize Redemption Requests
            </h2>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                {redemptionRequests.length > 0 ? (
                  <div className="space-y-4">
                    {redemptionRequests.map((request) => (
                      <div
                        key={request.id}
                        className="p-4 bg-gray-700 rounded-lg"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-white font-medium">
                              @{request.username}
                            </h3>
                            <p className="text-gray-400 text-sm">
                              ${request.cashValue} ({request.amount} SC) via{" "}
                              {request.method}
                            </p>
                            <p className="text-gray-500 text-xs">
                              Requested:{" "}
                              {new Date(
                                request.requestedAt,
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge className={getStatusColor(request.status)}>
                            {getStatusIcon(request.status)}
                            <span className="ml-2">
                              {request.status.replace("_", " ")}
                            </span>
                          </Badge>
                        </div>

                        {request.status === "pending" ||
                        request.status === "staff_review" ? (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => {
                                const notes =
                                  prompt("Review notes (optional):") || "";
                                handleRedemptionReview(
                                  request.id,
                                  "approved",
                                  notes,
                                );
                              }}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              className="bg-red-600 hover:bg-red-700"
                              onClick={() => {
                                const notes = prompt(
                                  "Denial reason (required):",
                                );
                                if (notes)
                                  handleRedemptionReview(
                                    request.id,
                                    "denied",
                                    notes,
                                  );
                              }}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Deny
                            </Button>
                          </div>
                        ) : (
                          request.denialReason && (
                            <div className="text-sm text-red-400 mt-2">
                              Denial reason: {request.denialReason}
                            </div>
                          )
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <DollarSign className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">No redemption requests.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="refunds" className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Refund Requests</h2>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                {refundRequests.length > 0 ? (
                  <div className="space-y-4">
                    {refundRequests.map((request) => (
                      <div
                        key={request.id}
                        className="p-4 bg-gray-700 rounded-lg"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-white font-medium">
                              @{request.username}
                            </h3>
                            <p className="text-gray-400 text-sm">
                              Refund: ${request.requestedAmount}
                            </p>
                            <p className="text-gray-400 text-sm">
                              Reason: {request.reason}
                            </p>
                            <p className="text-gray-500 text-xs">
                              Requested:{" "}
                              {new Date(
                                request.requestedAt,
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge className={getStatusColor(request.status)}>
                            {getStatusIcon(request.status)}
                            <span className="ml-2">{request.status}</span>
                          </Badge>
                        </div>

                        {request.status === "pending" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => {
                                const notes =
                                  prompt("Review notes (optional):") || "";
                                handleRefundReview(
                                  request.id,
                                  "approved",
                                  notes,
                                );
                              }}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              className="bg-red-600 hover:bg-red-700"
                              onClick={() => {
                                const notes = prompt(
                                  "Denial reason (required):",
                                );
                                if (notes)
                                  handleRefundReview(
                                    request.id,
                                    "denied",
                                    notes,
                                  );
                              }}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Deny
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <DollarSign className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">No refund requests.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Store Settings</h2>

            {storeSettings && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Payment Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-white">PayPal Enabled</Label>
                        <Switch checked={storeSettings.paypalEnabled} />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-white">Stripe Enabled</Label>
                        <Switch checked={storeSettings.stripeEnabled} />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-white">Crypto Enabled</Label>
                        <Switch checked={storeSettings.cryptoEnabled} />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label className="text-white">
                          Min Purchase Amount
                        </Label>
                        <Input
                          type="number"
                          value={storeSettings.minPurchaseAmount}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-white">
                          Max Purchase Amount
                        </Label>
                        <Input
                          type="number"
                          value={storeSettings.maxPurchaseAmount}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-white">Bonus Multiplier</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={storeSettings.bonusMultiplier}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Save Settings
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            <h2 className="text-2xl font-bold text-white">
              Admin Activity Logs
            </h2>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                {adminLogs.length > 0 ? (
                  <div className="space-y-3">
                    {adminLogs.slice(0, 20).map((log) => (
                      <div key={log.id} className="p-3 bg-gray-700 rounded">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-white font-medium">
                              @{log.adminUsername}
                            </span>
                            <span className="text-gray-400 ml-2">
                              {log.description}
                            </span>
                          </div>
                          <span className="text-gray-500 text-xs">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">No admin logs yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <PaymentSettings />
          </TabsContent>

          <TabsContent value="leaderboards" className="space-y-6">
            <LeaderboardManagement />
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <AchievementBadgeSystem />
          </TabsContent>

          <TabsContent value="banking" className="space-y-6">
            <EnhancedCasinoBanking />
          </TabsContent>

          <TabsContent value="usermanagement" className="space-y-6">
            <UserManagementSystem />
          </TabsContent>

          <TabsContent value="ticker" className="space-y-6">
            <TickerManagement />
          </TabsContent>
        </Tabs>

        {/* New Package Form Modal */}
        {showNewPackageForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="bg-gray-800 border-gray-700 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="text-white flex justify-between items-center">
                  Create New Package
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowNewPackageForm(false)}
                  >
                    ��
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Package Name</Label>
                    <Input
                      value={newPackage.name}
                      onChange={(e) =>
                        setNewPackage((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-white">Price (USD)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newPackage.price}
                      onChange={(e) =>
                        setNewPackage((prev) => ({
                          ...prev,
                          price: parseFloat(e.target.value),
                        }))
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-white">Description</Label>
                  <Textarea
                    value={newPackage.description}
                    onChange={(e) =>
                      setNewPackage((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Gold Coins</Label>
                    <Input
                      type="number"
                      value={newPackage.goldCoins}
                      onChange={(e) =>
                        setNewPackage((prev) => ({
                          ...prev,
                          goldCoins: parseInt(e.target.value),
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-white">Bonus Sweeps Coins</Label>
                    <Input
                      type="number"
                      value={newPackage.bonusSweepsCoins}
                      onChange={(e) =>
                        setNewPackage((prev) => ({
                          ...prev,
                          bonusSweepsCoins: parseInt(e.target.value),
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={newPackage.popular}
                      onCheckedChange={(checked) =>
                        setNewPackage((prev) => ({ ...prev, popular: checked }))
                      }
                    />
                    <Label className="text-white">Popular</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={newPackage.bestValue}
                      onCheckedChange={(checked) =>
                        setNewPackage((prev) => ({
                          ...prev,
                          bestValue: checked,
                        }))
                      }
                    />
                    <Label className="text-white">Best Value</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={newPackage.isActive}
                      onCheckedChange={(checked) =>
                        setNewPackage((prev) => ({
                          ...prev,
                          isActive: checked,
                        }))
                      }
                    />
                    <Label className="text-white">Active</Label>
                  </div>
                </div>

                <Button
                  onClick={handlePackageCreate}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Create Package
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        <AccessDeniedModal
          isOpen={showAccessDenied}
          onClose={() => setShowAccessDenied(false)}
          feature="Admin Panel"
        />
      </div>
    </div>
  );
}
