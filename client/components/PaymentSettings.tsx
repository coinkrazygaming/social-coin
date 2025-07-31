import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useAuth } from "./AuthContext";
import {
  CreditCard,
  DollarSign,
  Shield,
  CheckCircle,
  XCircle,
  Settings,
  Save,
  RefreshCw,
  AlertTriangle,
  TrendingUp,
  Globe,
  Lock,
  Smartphone,
  Zap,
  Activity,
} from "lucide-react";

interface PaymentProvider {
  id: string;
  name: string;
  type: "paypal" | "stripe" | "googlepay" | "applepay";
  enabled: boolean;
  status: "active" | "inactive" | "error";
  config: {
    clientId?: string;
    secretKey?: string;
    publishableKey?: string;
    sandbox?: boolean;
    merchantId?: string;
    environment?: "sandbox" | "production";
  };
  fees: {
    percentage: number;
    fixed: number;
  };
  limits: {
    min: number;
    max: number;
    daily: number;
  };
  features: string[];
  lastTest: Date;
  testResult: "success" | "error" | "pending" | "never";
}

interface PaymentStats {
  totalVolume: number;
  totalTransactions: number;
  successRate: number;
  averageValue: number;
  providerBreakdown: {
    provider: string;
    volume: number;
    transactions: number;
    percentage: number;
  }[];
  recentActivity: {
    date: string;
    provider: string;
    amount: number;
    status: string;
  }[];
}

export function PaymentSettings() {
  const { user } = useAuth();
  const [providers, setProviders] = useState<PaymentProvider[]>([
    {
      id: "paypal",
      name: "PayPal",
      type: "paypal",
      enabled: true,
      status: "active",
      config: {
        clientId: "AYE8zF9dGvjlKbT2Rw9zNOEF8HKrwZjHhDcLqP7X",
        secretKey: "••••••••••••••••••••••••••••••••",
        sandbox: false,
        environment: "production",
      },
      fees: {
        percentage: 2.9,
        fixed: 0.3,
      },
      limits: {
        min: 1.0,
        max: 10000.0,
        daily: 25000.0,
      },
      features: ["Instant Transfer", "Buyer Protection", "Mobile Optimized"],
      lastTest: new Date(),
      testResult: "success",
    },
    {
      id: "stripe",
      name: "Stripe",
      type: "stripe",
      enabled: true,
      status: "active",
      config: {
        publishableKey: "pk_live_51KdJ7zHkF2YwZ8xNzGqTbP4mCvRtE9QaSlXpB",
        secretKey: "••••••••••••••••••••••••••••••••",
        environment: "production",
      },
      fees: {
        percentage: 2.9,
        fixed: 0.3,
      },
      limits: {
        min: 0.5,
        max: 999999.0,
        daily: 100000.0,
      },
      features: [
        "Advanced Fraud Protection",
        "3D Secure",
        "International Cards",
      ],
      lastTest: new Date(),
      testResult: "success",
    },
    {
      id: "googlepay",
      name: "Google Pay",
      type: "googlepay",
      enabled: true,
      status: "active",
      config: {
        merchantId: "12345678901234567890",
        environment: "production",
      },
      fees: {
        percentage: 2.2,
        fixed: 0.0,
      },
      limits: {
        min: 1.0,
        max: 5000.0,
        daily: 15000.0,
      },
      features: ["One-Click Payments", "Biometric Auth", "Mobile First"],
      lastTest: new Date(),
      testResult: "success",
    },
    {
      id: "applepay",
      name: "Apple Pay",
      type: "applepay",
      enabled: false,
      status: "inactive",
      config: {
        merchantId: "merchant.com.coinkrazy.store",
        environment: "production",
      },
      fees: {
        percentage: 2.2,
        fixed: 0.0,
      },
      limits: {
        min: 1.0,
        max: 5000.0,
        daily: 15000.0,
      },
      features: ["Touch ID", "Face ID", "iOS Integration"],
      lastTest: new Date(),
      testResult: "never",
    },
  ]);

  const [paymentStats, setPaymentStats] = useState<PaymentStats>({
    totalVolume: 145672.45,
    totalTransactions: 1247,
    successRate: 98.7,
    averageValue: 116.83,
    providerBreakdown: [
      {
        provider: "PayPal",
        volume: 78234.56,
        transactions: 672,
        percentage: 53.7,
      },
      {
        provider: "Stripe",
        volume: 54891.23,
        transactions: 445,
        percentage: 37.7,
      },
      {
        provider: "Google Pay",
        volume: 12546.66,
        transactions: 130,
        percentage: 8.6,
      },
    ],
    recentActivity: [
      {
        date: new Date().toISOString(),
        provider: "PayPal",
        amount: 49.99,
        status: "completed",
      },
      {
        date: new Date(Date.now() - 300000).toISOString(),
        provider: "Stripe",
        amount: 199.99,
        status: "completed",
      },
      {
        date: new Date(Date.now() - 600000).toISOString(),
        provider: "Google Pay",
        amount: 24.99,
        status: "completed",
      },
      {
        date: new Date(Date.now() - 900000).toISOString(),
        provider: "PayPal",
        amount: 99.99,
        status: "pending",
      },
      {
        date: new Date(Date.now() - 1200000).toISOString(),
        provider: "Stripe",
        amount: 149.99,
        status: "completed",
      },
    ],
  });

  const [editingProvider, setEditingProvider] =
    useState<PaymentProvider | null>(null);
  const [isTesting, setIsTesting] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleProviderToggle = async (providerId: string, enabled: boolean) => {
    setProviders((prev) =>
      prev.map((p) =>
        p.id === providerId
          ? { ...p, enabled, status: enabled ? "active" : "inactive" }
          : p,
      ),
    );
  };

  const handleTestConnection = async (providerId: string) => {
    setIsTesting(providerId);

    // Simulate API test
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setProviders((prev) =>
      prev.map((p) =>
        p.id === providerId
          ? { ...p, lastTest: new Date(), testResult: "success" }
          : p,
      ),
    );

    setIsTesting(null);
  };

  const handleSaveProvider = async (provider: PaymentProvider) => {
    setIsSaving(true);

    // Simulate API save
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setProviders((prev) =>
      prev.map((p) => (p.id === provider.id ? provider : p)),
    );

    setEditingProvider(null);
    setIsSaving(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "inactive":
        return <XCircle className="w-4 h-4 text-gray-500" />;
      case "error":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <RefreshCw className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getProviderIcon = (type: string) => {
    switch (type) {
      case "paypal":
        return "💳";
      case "stripe":
        return "💰";
      case "googlepay":
        return "📱";
      case "applepay":
        return "🍎";
      default:
        return "💳";
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-500">
              ${paymentStats.totalVolume.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">Total Volume</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <Activity className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-500">
              {paymentStats.totalTransactions.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">Transactions</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-500">
              {paymentStats.successRate}%
            </div>
            <div className="text-sm text-gray-400">Success Rate</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <Zap className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-500">
              ${paymentStats.averageValue.toFixed(2)}
            </div>
            <div className="text-sm text-gray-400">Avg Transaction</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="providers" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="providers">Providers</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="providers" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {providers.map((provider) => (
              <Card key={provider.id} className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">
                        {getProviderIcon(provider.type)}
                      </div>
                      <div>
                        <CardTitle className="text-white flex items-center gap-2">
                          {provider.name}
                          {getStatusIcon(provider.status)}
                        </CardTitle>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span>
                            Fee: {provider.fees.percentage}% + $
                            {provider.fees.fixed}
                          </span>
                          <Badge
                            variant={provider.enabled ? "default" : "secondary"}
                          >
                            {provider.enabled ? "Enabled" : "Disabled"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Switch
                      checked={provider.enabled}
                      onCheckedChange={(enabled) =>
                        handleProviderToggle(provider.id, enabled)
                      }
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-gray-400">Min Amount</div>
                      <div className="text-white font-medium">
                        ${provider.limits.min}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400">Max Amount</div>
                      <div className="text-white font-medium">
                        ${provider.limits.max.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400">Daily Limit</div>
                      <div className="text-white font-medium">
                        ${provider.limits.daily.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-gray-400 text-sm mb-2">Features</div>
                    <div className="flex flex-wrap gap-1">
                      {provider.features.map((feature, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingProvider(provider)}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Configure
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleTestConnection(provider.id)}
                      disabled={isTesting === provider.id}
                    >
                      {isTesting === provider.id ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Shield className="w-4 h-4 mr-2" />
                      )}
                      {isTesting === provider.id ? "Testing..." : "Test"}
                    </Button>
                  </div>

                  <div className="text-xs text-gray-500">
                    Last tested: {provider.lastTest.toLocaleDateString()}
                    <Badge
                      className={`ml-2 ${
                        provider.testResult === "success"
                          ? "bg-green-600"
                          : provider.testResult === "error"
                            ? "bg-red-600"
                            : "bg-gray-600"
                      }`}
                    >
                      {provider.testResult}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Provider Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentStats.providerBreakdown.map((provider, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                        {provider.provider.charAt(0)}
                      </div>
                      <div>
                        <div className="text-white font-medium">
                          {provider.provider}
                        </div>
                        <div className="text-sm text-gray-400">
                          {provider.transactions} transactions
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold">
                        ${provider.volume.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-400">
                        {provider.percentage}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {paymentStats.recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-sm">
                        <div className="text-white font-medium">
                          {activity.provider}
                        </div>
                        <div className="text-gray-400">
                          {new Date(activity.date).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold">
                        ${activity.amount}
                      </div>
                      <Badge
                        className={
                          activity.status === "completed"
                            ? "bg-green-600"
                            : activity.status === "pending"
                              ? "bg-yellow-600"
                              : "bg-red-600"
                        }
                      >
                        {activity.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">
                Global Payment Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-white">Default Currency</Label>
                    <Select defaultValue="USD">
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        <SelectItem value="CAD">
                          CAD - Canadian Dollar
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white">
                      Auto Retry Failed Payments
                    </Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Switch defaultChecked />
                      <span className="text-sm text-gray-400">Enabled</span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-white">
                      Payment Timeout (seconds)
                    </Label>
                    <Input type="number" defaultValue="300" className="mt-1" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-white">
                      Minimum Purchase Amount
                    </Label>
                    <Input
                      type="number"
                      step="0.01"
                      defaultValue="1.00"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-white">
                      Maximum Purchase Amount
                    </Label>
                    <Input
                      type="number"
                      step="0.01"
                      defaultValue="10000.00"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-white">Daily Purchase Limit</Label>
                    <Input
                      type="number"
                      step="0.01"
                      defaultValue="25000.00"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <Button className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Security & Compliance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-white">PCI DSS Compliance</Label>
                    <Badge className="bg-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-white">
                      3D Secure Authentication
                    </Label>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-white">Fraud Detection</Label>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-white">SSL Certificate</Label>
                    <Badge className="bg-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Valid
                    </Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-white">Webhook Endpoint</Label>
                    <Input
                      defaultValue="https://api.coinkrazy.com/webhooks/payments"
                      className="mt-1"
                      readOnly
                    />
                  </div>

                  <div>
                    <Label className="text-white">IP Whitelist</Label>
                    <Textarea
                      placeholder="Enter IP addresses (one per line)"
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-white">Rate Limiting</Label>
                    <Badge className="bg-blue-600">100/hour</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Provider Configuration Modal */}
      {editingProvider && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="bg-gray-800 border-gray-700 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="text-white flex justify-between items-center">
                Configure {editingProvider.name}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingProvider(null)}
                >
                  ✕
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {editingProvider.type === "paypal" && (
                  <>
                    <div>
                      <Label className="text-white">Client ID</Label>
                      <Input
                        defaultValue={editingProvider.config.clientId}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-white">Client Secret</Label>
                      <Input
                        type="password"
                        defaultValue="••••••••••••••••••••••••••••••••"
                        className="mt-1"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch checked={editingProvider.config.sandbox} />
                      <Label className="text-white">Sandbox Mode</Label>
                    </div>
                  </>
                )}

                {editingProvider.type === "stripe" && (
                  <>
                    <div>
                      <Label className="text-white">Publishable Key</Label>
                      <Input
                        defaultValue={editingProvider.config.publishableKey}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-white">Secret Key</Label>
                      <Input
                        type="password"
                        defaultValue="••••••••••••••••••••••••••••••••"
                        className="mt-1"
                      />
                    </div>
                  </>
                )}

                {editingProvider.type === "googlepay" && (
                  <>
                    <div>
                      <Label className="text-white">Merchant ID</Label>
                      <Input
                        defaultValue={editingProvider.config.merchantId}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-white">Environment</Label>
                      <Select defaultValue={editingProvider.config.environment}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sandbox">Sandbox</SelectItem>
                          <SelectItem value="production">Production</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Fee Percentage</Label>
                    <Input
                      type="number"
                      step="0.1"
                      defaultValue={editingProvider.fees.percentage}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Fixed Fee</Label>
                    <Input
                      type="number"
                      step="0.01"
                      defaultValue={editingProvider.fees.fixed}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-white">Min Amount</Label>
                    <Input
                      type="number"
                      step="0.01"
                      defaultValue={editingProvider.limits.min}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Max Amount</Label>
                    <Input
                      type="number"
                      step="0.01"
                      defaultValue={editingProvider.limits.max}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Daily Limit</Label>
                    <Input
                      type="number"
                      step="0.01"
                      defaultValue={editingProvider.limits.daily}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleSaveProvider(editingProvider)}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Configuration"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditingProvider(null)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
