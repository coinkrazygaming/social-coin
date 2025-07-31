import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ScrollArea } from "./ui/scroll-area";
import { 
  AlertTriangle, 
  Bell, 
  Shield, 
  CheckCircle, 
  XCircle, 
  Clock,
  Eye,
  Bot,
  Users,
  DollarSign
} from "lucide-react";
import { useAuth } from "./AuthContext";

interface AdminAlert {
  id: string;
  type: 'security' | 'system' | 'ai_employee' | 'financial' | 'user_action' | 'critical';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: Date;
  status: 'new' | 'read' | 'acknowledged' | 'resolved';
  actionRequired: boolean;
  source: string;
  data?: any;
  suggestedActions?: string[];
}

export function AdminAlerts() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<AdminAlert[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user && user.role === 'admin') {
      loadAlerts();
      // Set up real-time polling for new alerts
      const interval = setInterval(loadAlerts, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadAlerts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/alerts');
      if (response.ok) {
        const alertData = await response.json();
        setAlerts(alertData.map((alert: any) => ({
          ...alert,
          timestamp: new Date(alert.timestamp)
        })));
      }
    } catch (error) {
      console.error('Error loading admin alerts:', error);
      // Set mock alerts for demonstration
      setAlerts([
        {
          id: 'alert_1',
          type: 'security',
          severity: 'high',
          title: 'Suspicious User Activity Detected',
          description: 'SecurityAI flagged user @player123 for unusual betting patterns',
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
          status: 'new',
          actionRequired: true,
          source: 'SecurityAI Guardian',
          suggestedActions: ['Review user account', 'Check recent activity', 'Consider restrictions']
        },
        {
          id: 'alert_2',
          type: 'ai_employee',
          severity: 'medium',
          title: 'GameMaster AI Recommendation',
          description: 'Mini-game rewards may need rebalancing - 15% above target payout',
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
          status: 'new',
          actionRequired: true,
          source: 'GameMaster AI',
          suggestedActions: ['Review payout rates', 'Adjust game difficulty', 'Update reward tables']
        },
        {
          id: 'alert_3',
          type: 'financial',
          severity: 'low',
          title: 'Daily Revenue Milestone Reached',
          description: 'Platform has exceeded daily revenue target by 12%',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          status: 'read',
          actionRequired: false,
          source: 'FinanceAI Advisor'
        },
        {
          id: 'alert_4',
          type: 'critical',
          severity: 'critical',
          title: 'Multiple Failed Login Attempts',
          description: 'Admin account has 5 failed login attempts from unknown IP',
          timestamp: new Date(Date.now() - 45 * 60 * 1000),
          status: 'new',
          actionRequired: true,
          source: 'Security System',
          suggestedActions: ['Change admin password', 'Enable 2FA', 'Review access logs']
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (alertId: string) => {
    try {
      const response = await fetch(`/api/admin/alerts/${alertId}/read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        setAlerts(prev => prev.map(alert => 
          alert.id === alertId ? { ...alert, status: 'read' } : alert
        ));
      }
    } catch (error) {
      console.error('Error marking alert as read:', error);
    }
  };

  const acknowledgeAlert = async (alertId: string) => {
    try {
      const response = await fetch(`/api/admin/alerts/${alertId}/acknowledge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        setAlerts(prev => prev.map(alert => 
          alert.id === alertId ? { ...alert, status: 'acknowledged' } : alert
        ));
      }
    } catch (error) {
      console.error('Error acknowledging alert:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-blue-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'security': return <Shield className="h-4 w-4" />;
      case 'ai_employee': return <Bot className="h-4 w-4" />;
      case 'financial': return <DollarSign className="h-4 w-4" />;
      case 'user_action': return <Users className="h-4 w-4" />;
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  // Don't render if user is not admin
  if (!user || user.role !== 'admin') {
    return null;
  }

  const newAlerts = alerts.filter(alert => alert.status === 'new');
  const criticalAlerts = alerts.filter(alert => alert.severity === 'critical' && alert.status === 'new');

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`relative ${criticalAlerts.length > 0 ? 'text-red-400 hover:text-red-300' : 'text-gray-300 hover:text-white'}`}
        >
          <Bell className="h-5 w-5" />
          {newAlerts.length > 0 && (
            <Badge 
              className={`absolute -top-1 -right-1 px-1 min-w-[1.2rem] h-5 text-xs ${
                criticalAlerts.length > 0 ? 'bg-red-500' : 'bg-yellow-500'
              } text-white`}
            >
              {newAlerts.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-96 p-0 bg-gray-800 border-gray-700" align="end">
        <Card className="border-none shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
                Admin Alerts
              </CardTitle>
              <Badge variant="outline" className="text-xs">
                {newAlerts.length} new
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <ScrollArea className="max-h-96">
              {alerts.length === 0 ? (
                <div className="p-6 text-center text-gray-400">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No alerts at this time</p>
                </div>
              ) : (
                <div className="space-y-0">
                  {alerts.slice(0, 10).map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-4 border-b border-gray-700 hover:bg-gray-700/30 transition-colors ${
                        alert.status === 'new' ? 'bg-gray-700/20' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`w-2 h-2 rounded-full mt-2 ${getSeverityColor(alert.severity)}`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              {getTypeIcon(alert.type)}
                              <h4 className="text-white font-medium text-sm leading-tight">
                                {alert.title}
                              </h4>
                            </div>
                            <p className="text-gray-300 text-xs mb-2 leading-relaxed">
                              {alert.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400 text-xs">
                                {formatTimeAgo(alert.timestamp)}
                              </span>
                              <span className="text-gray-400 text-xs">
                                {alert.source}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {alert.actionRequired && alert.status === 'new' && (
                        <div className="mt-3 flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => markAsRead(alert.id)}
                            className="text-xs h-7"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => acknowledgeAlert(alert.id)}
                            className="text-xs h-7 bg-blue-600 hover:bg-blue-700"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Acknowledge
                          </Button>
                        </div>
                      )}

                      {alert.suggestedActions && alert.suggestedActions.length > 0 && (
                        <div className="mt-2">
                          <p className="text-gray-400 text-xs mb-1">Suggested actions:</p>
                          <ul className="text-gray-300 text-xs space-y-1">
                            {alert.suggestedActions.slice(0, 2).map((action, index) => (
                              <li key={index} className="flex items-center gap-1">
                                <div className="w-1 h-1 bg-gray-400 rounded-full" />
                                {action}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {alerts.length > 10 && (
              <div className="p-3 border-t border-gray-700">
                <Button variant="ghost" className="w-full text-sm text-gray-400 hover:text-white">
                  View all alerts ({alerts.length})
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
