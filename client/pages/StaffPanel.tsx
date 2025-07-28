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
import { useAuth } from "../components/AuthContext";
import { AccessDeniedModal } from "../components/AccessDeniedModal";
import { RedemptionRequest } from "@shared/userTypes";
import { RefundRequest } from "@shared/storeTypes";
import {
  Shield,
  DollarSign,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Eye,
  FileText,
  Crown,
  Target,
  TrendingUp,
} from "lucide-react";

export function StaffPanel() {
  const { user } = useAuth();
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const [redemptionRequests, setRedemptionRequests] = useState<
    RedemptionRequest[]
  >([]);
  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("redemptions");

  useEffect(() => {
    if (!user || (user.role !== "staff" && user.role !== "admin")) {
      setShowAccessDenied(true);
      return;
    }

    fetchStaffData();
  }, [user]);

  const fetchStaffData = async () => {
    if (!user) return;

    try {
      const [redemptionsRes, refundsRes] = await Promise.all([
        fetch("/api/users/redemptions/staff", {
          headers: { staffId: user.id, staffUsername: user.username },
        }),
        fetch("/api/store/refund-requests/staff", {
          headers: { staffId: user.id, staffUsername: user.username },
        }),
      ]);

      if (redemptionsRes.ok) setRedemptionRequests(await redemptionsRes.json());
      if (refundsRes.ok) setRefundRequests(await refundsRes.json());
    } catch (error) {
      console.error("Error fetching staff data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedemptionReview = async (
    requestId: string,
    status: "staff_approved" | "denied",
    notes: string,
  ) => {
    try {
      const response = await fetch(
        `/api/users/redemptions/${requestId}/staff-review`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            staffId: user!.id,
            staffUsername: user!.username,
          },
          body: JSON.stringify({ status, reviewNotes: notes }),
        },
      );

      if (response.ok) {
        fetchStaffData();
        alert(
          `Redemption request ${status.replace("staff_", "")}! ${status === "staff_approved" ? "Forwarded to admin for final approval." : ""}`,
        );
      }
    } catch (error) {
      console.error("Error reviewing redemption:", error);
      alert("Failed to review redemption request");
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

  if (!user || (user.role !== "staff" && user.role !== "admin")) {
    return (
      <AccessDeniedModal
        isOpen={showAccessDenied}
        onClose={() => setShowAccessDenied(false)}
        feature="Staff Panel"
      />
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading staff panel...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              CoinKrazy Staff Panel 🛡️
            </h1>
            <p className="text-purple-200">Review and approve user requests</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-white">
              <Shield className="w-5 h-5 text-blue-400" />
              <span>Staff: {user.username}</span>
            </div>
            {user.role === "admin" && (
              <Button
                onClick={() => (window.location.href = "/admin")}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Crown className="w-4 h-4 mr-2" />
                Admin Panel
              </Button>
            )}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4 text-center">
              <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-500">
                {
                  redemptionRequests.filter((r) => r.status === "pending")
                    .length
                }
              </div>
              <div className="text-sm text-gray-400">Pending Redemptions</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4 text-center">
              <FileText className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-500">
                {refundRequests.filter((r) => r.status === "pending").length}
              </div>
              <div className="text-sm text-gray-400">Pending Refunds</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-500">
                {
                  redemptionRequests.filter((r) => r.status === "staff_review")
                    .length
                }
              </div>
              <div className="text-sm text-gray-400">Ready for Admin</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-500">
                {
                  redemptionRequests.filter((r) => r.status === "approved")
                    .length
                }
              </div>
              <div className="text-sm text-gray-400">Approved Total</div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="redemptions">Prize Redemptions</TabsTrigger>
            <TabsTrigger value="refunds">Refund Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="redemptions" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">
                  Prize Redemption Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
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
                            <div className="mt-2">
                              <Badge
                                className={
                                  request.kycCompleted
                                    ? "bg-green-600"
                                    : "bg-red-600"
                                }
                              >
                                KYC:{" "}
                                {request.kycCompleted ? "Verified" : "Pending"}
                              </Badge>
                            </div>
                          </div>
                          <Badge className={getStatusColor(request.status)}>
                            {getStatusIcon(request.status)}
                            <span className="ml-2">
                              {request.status.replace("_", " ")}
                            </span>
                          </Badge>
                        </div>

                        {request.status === "pending" ? (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => {
                                const notes =
                                  prompt("Staff review notes (optional):") ||
                                  "";
                                handleRedemptionReview(
                                  request.id,
                                  "staff_approved",
                                  notes,
                                );
                              }}
                              disabled={!request.kycCompleted}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve for Admin Review
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
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                          </div>
                        ) : (
                          request.denialReason && (
                            <div className="text-sm text-red-400 mt-2">
                              Denial reason: {request.denialReason}
                            </div>
                          )
                        )}

                        {!request.kycCompleted && (
                          <div className="mt-2 p-2 bg-yellow-900 border border-yellow-700 rounded text-yellow-200 text-sm">
                            ⚠️ KYC verification required before approval
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <DollarSign className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">
                      No redemption requests to review.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="refunds" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Refund Requests</CardTitle>
              </CardHeader>
              <CardContent>
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
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              className="bg-red-600 hover:bg-red-700"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Deny
                            </Button>
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4 mr-2" />
                              View Transaction
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">
                      No refund requests to review.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <AccessDeniedModal
          isOpen={showAccessDenied}
          onClose={() => setShowAccessDenied(false)}
          feature="Staff Panel"
        />
      </div>
    </div>
  );
}
