import { RequestHandler } from "express";

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

// In-memory storage for admin alerts
const adminAlerts: Map<string, AdminAlert> = new Map();

// Initialize with some sample alerts
const sampleAlerts: AdminAlert[] = [
  {
    id: 'alert_security_1',
    type: 'security',
    severity: 'high',
    title: 'Suspicious User Activity Detected',
    description: 'SecurityAI flagged user for unusual betting patterns and potential fraud indicators',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    status: 'new',
    actionRequired: true,
    source: 'SecurityAI Guardian',
    suggestedActions: ['Review user account', 'Check recent activity', 'Consider temporary restrictions']
  },
  {
    id: 'alert_ai_1',
    type: 'ai_employee',
    severity: 'medium',
    title: 'GameMaster AI Recommendation',
    description: 'Mini-game payout rates are 15% above target - consider rebalancing',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    status: 'new',
    actionRequired: true,
    source: 'GameMaster AI',
    suggestedActions: ['Review payout rates', 'Adjust game difficulty', 'Update reward tables']
  },
  {
    id: 'alert_financial_1',
    type: 'financial',
    severity: 'low',
    title: 'Daily Revenue Milestone',
    description: 'Platform exceeded daily revenue target by 12% - excellent performance!',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    status: 'read',
    actionRequired: false,
    source: 'FinanceAI Advisor'
  },
  {
    id: 'alert_critical_1',
    type: 'critical',
    severity: 'critical',
    title: 'Multiple Failed Admin Login Attempts',
    description: 'Admin account has 5 failed login attempts from unknown IP address in the last hour',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    status: 'new',
    actionRequired: true,
    source: 'Security System',
    suggestedActions: ['Change admin password immediately', 'Enable 2FA', 'Review access logs', 'Block suspicious IP']
  },
  {
    id: 'alert_system_1',
    type: 'system',
    severity: 'medium',
    title: 'Server Performance Alert',
    description: 'API response times increased by 25% in the last hour',
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    status: 'acknowledged',
    actionRequired: true,
    source: 'System Monitor',
    suggestedActions: ['Check server resources', 'Review database queries', 'Scale infrastructure if needed']
  }
];

// Initialize alerts
sampleAlerts.forEach(alert => adminAlerts.set(alert.id, alert));

// Helper functions
function generateAlertId(): string {
  return `alert_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

// Get all admin alerts
export const handleGetAdminAlerts: RequestHandler = (req, res) => {
  try {
    const { status, severity, type } = req.query;
    
    let alerts = Array.from(adminAlerts.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    // Apply filters
    if (status) {
      alerts = alerts.filter(alert => alert.status === status);
    }
    
    if (severity) {
      alerts = alerts.filter(alert => alert.severity === severity);
    }
    
    if (type) {
      alerts = alerts.filter(alert => alert.type === type);
    }
    
    res.json(alerts);
  } catch (error) {
    console.error('Error getting admin alerts:', error);
    res.status(500).json({ error: 'Failed to get admin alerts' });
  }
};

// Mark alert as read
export const handleMarkAlertAsRead: RequestHandler = (req, res) => {
  try {
    const { alertId } = req.params;
    
    const alert = adminAlerts.get(alertId);
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    
    alert.status = 'read';
    adminAlerts.set(alertId, alert);
    
    res.json({ success: true, alert });
  } catch (error) {
    console.error('Error marking alert as read:', error);
    res.status(500).json({ error: 'Failed to mark alert as read' });
  }
};

// Acknowledge alert
export const handleAcknowledgeAlert: RequestHandler = (req, res) => {
  try {
    const { alertId } = req.params;
    
    const alert = adminAlerts.get(alertId);
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    
    alert.status = 'acknowledged';
    adminAlerts.set(alertId, alert);
    
    res.json({ success: true, alert });
  } catch (error) {
    console.error('Error acknowledging alert:', error);
    res.status(500).json({ error: 'Failed to acknowledge alert' });
  }
};

// Resolve alert
export const handleResolveAlert: RequestHandler = (req, res) => {
  try {
    const { alertId } = req.params;
    const { notes } = req.body;
    
    const alert = adminAlerts.get(alertId);
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    
    alert.status = 'resolved';
    if (notes) {
      alert.data = { ...alert.data, resolutionNotes: notes };
    }
    adminAlerts.set(alertId, alert);
    
    res.json({ success: true, alert });
  } catch (error) {
    console.error('Error resolving alert:', error);
    res.status(500).json({ error: 'Failed to resolve alert' });
  }
};

// Create new alert (for AI employees or system)
export const handleCreateAlert: RequestHandler = (req, res) => {
  try {
    const { type, severity, title, description, source, actionRequired, suggestedActions, data } = req.body;
    
    const alert: AdminAlert = {
      id: generateAlertId(),
      type,
      severity,
      title,
      description,
      timestamp: new Date(),
      status: 'new',
      actionRequired: actionRequired || false,
      source,
      suggestedActions: suggestedActions || [],
      data: data || {}
    };
    
    adminAlerts.set(alert.id, alert);
    
    res.json({ success: true, alert });
  } catch (error) {
    console.error('Error creating alert:', error);
    res.status(500).json({ error: 'Failed to create alert' });
  }
};

// Get alert statistics
export const handleGetAlertStats: RequestHandler = (req, res) => {
  try {
    const alerts = Array.from(adminAlerts.values());
    
    const stats = {
      total: alerts.length,
      new: alerts.filter(a => a.status === 'new').length,
      acknowledged: alerts.filter(a => a.status === 'acknowledged').length,
      resolved: alerts.filter(a => a.status === 'resolved').length,
      critical: alerts.filter(a => a.severity === 'critical').length,
      high: alerts.filter(a => a.severity === 'high').length,
      medium: alerts.filter(a => a.severity === 'medium').length,
      low: alerts.filter(a => a.severity === 'low').length,
      actionRequired: alerts.filter(a => a.actionRequired && a.status === 'new').length
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error getting alert stats:', error);
    res.status(500).json({ error: 'Failed to get alert stats' });
  }
};

export {
  handleGetAdminAlerts,
  handleMarkAlertAsRead,
  handleAcknowledgeAlert,
  handleResolveAlert,
  handleCreateAlert,
  handleGetAlertStats
};
