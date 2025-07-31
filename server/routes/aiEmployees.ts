import { RequestHandler } from "express";
import { z } from "zod";

interface AIEmployee {
  id: string;
  name: string;
  role: string;
  department:
    | "security"
    | "mini_games"
    | "sportsbook"
    | "finance"
    | "customer_service"
    | "management";
  status: "online" | "offline" | "busy" | "maintenance";
  avatar: string;
  description: string;
  capabilities: string[];
  permissions: string[];
  lastActivity: Date;
  tasksCompleted: number;
  alertsGenerated: number;
  successRate: number;
  settings: Record<string, any>;
  metrics: {
    sessionsAnalyzed: number;
    threatsDetected: number;
    recommendationsMade: number;
    accuracy: number;
  };
}

interface AIAlert {
  id: string;
  employeeId: string;
  type: "security" | "performance" | "anomaly" | "recommendation" | "critical";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  data: any;
  actionRequired: boolean;
  suggestedActions: string[];
  timestamp: Date;
  status: "pending" | "in_review" | "approved" | "denied" | "resolved";
  assignedTo?: string;
  adminNotes?: string;
  confidence: number;
  relatedAlerts: string[];
}

interface AIMessage {
  id: string;
  fromId: string;
  fromName: string;
  toId: string;
  toName: string;
  content: string;
  timestamp: Date;
  isFromAdmin: boolean;
  messageType: "request" | "report" | "alert" | "suggestion" | "question";
  priority: "low" | "medium" | "high";
  attachedData?: any;
  threadId?: string;
}

interface AITask {
  id: string;
  employeeId: string;
  type: string;
  description: string;
  data: any;
  priority: "low" | "medium" | "high" | "critical";
  status: "pending" | "in_progress" | "completed" | "failed";
  assignedAt: Date;
  completedAt?: Date;
  result?: any;
  confidence?: number;
}

// In-memory storage for AI Employee system
const aiEmployees: Map<string, AIEmployee> = new Map();
const aiAlerts: Map<string, AIAlert> = new Map();
const aiMessages: Map<string, AIMessage> = new Map();
const aiTasks: Map<string, AITask> = new Map();

// Initialize AI Employees
const defaultEmployees: AIEmployee[] = [
  {
    id: "luckyai_manager",
    name: "LuckyAI Manager",
    role: "Chief AI Operations Manager",
    department: "management",
    status: "online",
    avatar: "🍀",
    description:
      "Oversees all AI employee operations and coordinates between departments",
    capabilities: [
      "Team Management",
      "Strategic Planning",
      "Performance Monitoring",
      "Resource Allocation",
    ],
    permissions: [
      "manage_ai_employees",
      "access_all_departments",
      "approve_high_priority_actions",
    ],
    lastActivity: new Date(),
    tasksCompleted: 1247,
    alertsGenerated: 89,
    successRate: 97.3,
    settings: {
      autoApproveThreshold: 0.85,
      alertFrequency: "real_time",
      reportingLevel: "detailed",
    },
    metrics: {
      sessionsAnalyzed: 15240,
      threatsDetected: 89,
      recommendationsMade: 234,
      accuracy: 97.3,
    },
  },
  {
    id: "security_ai",
    name: "SecurityAI Guardian",
    role: "Security & Fraud Detection Specialist",
    department: "security",
    status: "online",
    avatar: "🛡️",
    description:
      "Monitors user behavior for suspicious activity and prevents fraud",
    capabilities: [
      "Fraud Detection",
      "Pattern Analysis",
      "Risk Assessment",
      "Real-time Monitoring",
    ],
    permissions: [
      "access_user_data",
      "flag_accounts",
      "recommend_actions",
      "generate_security_reports",
    ],
    lastActivity: new Date(),
    tasksCompleted: 892,
    alertsGenerated: 156,
    successRate: 94.2,
    settings: {
      sensitivityLevel: "high",
      autoFlag: true,
      realTimeAlerts: true,
      analysisDepth: "comprehensive",
    },
    metrics: {
      sessionsAnalyzed: 8920,
      threatsDetected: 156,
      recommendationsMade: 89,
      accuracy: 94.2,
    },
  },
  {
    id: "minigames_ai",
    name: "GameMaster AI",
    role: "Mini Games Analytics Manager",
    department: "mini_games",
    status: "online",
    avatar: "🎮",
    description: "Analyzes mini game performance and ensures fair play",
    capabilities: [
      "Game Analytics",
      "Performance Tracking",
      "Reward Optimization",
      "Player Engagement",
    ],
    permissions: [
      "access_game_data",
      "adjust_rewards",
      "monitor_gameplay",
      "generate_reports",
    ],
    lastActivity: new Date(),
    tasksCompleted: 2341,
    alertsGenerated: 23,
    successRate: 98.1,
    settings: {
      rewardOptimization: true,
      cheatDetection: "aggressive",
      performanceTracking: "detailed",
    },
    metrics: {
      sessionsAnalyzed: 23410,
      threatsDetected: 23,
      recommendationsMade: 67,
      accuracy: 98.1,
    },
  },
  {
    id: "finance_ai",
    name: "FinanceAI Advisor",
    role: "Financial Operations Specialist",
    department: "finance",
    status: "online",
    avatar: "💰",
    description: "Manages financial transactions and revenue optimization",
    capabilities: [
      "Transaction Monitoring",
      "Revenue Analysis",
      "Cost Optimization",
      "Financial Reporting",
    ],
    permissions: [
      "access_financial_data",
      "monitor_transactions",
      "generate_financial_reports",
    ],
    lastActivity: new Date(),
    tasksCompleted: 675,
    alertsGenerated: 34,
    successRate: 99.1,
    settings: {
      transactionMonitoring: "real_time",
      anomalyDetection: true,
      reportingFrequency: "daily",
    },
    metrics: {
      sessionsAnalyzed: 6750,
      threatsDetected: 34,
      recommendationsMade: 123,
      accuracy: 99.1,
    },
  },
];

// Initialize default employees
defaultEmployees.forEach((emp) => aiEmployees.set(emp.id, emp));

// Helper functions
function generateAlertId(): string {
  return `alert_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

function generateTaskId(): string {
  return `task_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

// Validation schemas
const messageSchema = z.object({
  fromId: z.string(),
  fromName: z.string(),
  toId: z.string(),
  toName: z.string(),
  content: z.string(),
  messageType: z.enum(["request", "report", "alert", "suggestion", "question"]),
  priority: z.enum(["low", "medium", "high"]).optional().default("medium"),
  attachedData: z.any().optional(),
});

const alertActionSchema = z.object({
  action: z.enum(["approve", "deny", "investigate"]),
  notes: z.string().optional(),
  adminId: z.string(),
});

// API Routes

// Get all AI employees
export const handleGetAIEmployees: RequestHandler = (req, res) => {
  try {
    const employees = Array.from(aiEmployees.values()).map((emp) => ({
      ...emp,
      // Add real-time status updates
      lastActivity: emp.status === "online" ? new Date() : emp.lastActivity,
    }));

    res.json(employees);
  } catch (error) {
    console.error("Error getting AI employees:", error);
    res.status(500).json({ error: "Failed to get AI employees" });
  }
};

// Get AI employee status
export const handleGetAIEmployeeStatus: RequestHandler = (req, res) => {
  try {
    const statusData: Record<string, any> = {};

    aiEmployees.forEach((emp, id) => {
      statusData[id] = {
        status: emp.status,
        lastActivity: emp.status === "online" ? new Date() : emp.lastActivity,
        tasksCompleted: emp.tasksCompleted + Math.floor(Math.random() * 5),
        alertsGenerated: emp.alertsGenerated,
        successRate: Math.min(100, emp.successRate + (Math.random() - 0.5)),
        metrics: {
          ...emp.metrics,
          sessionsAnalyzed:
            emp.metrics.sessionsAnalyzed + Math.floor(Math.random() * 10),
        },
      };
    });

    res.json(statusData);
  } catch (error) {
    console.error("Error getting AI employee status:", error);
    res.status(500).json({ error: "Failed to get AI employee status" });
  }
};

// Get AI alerts
export const handleGetAIAlerts: RequestHandler = (req, res) => {
  try {
    const { status, severity, employeeId } = req.query;

    let alerts = Array.from(aiAlerts.values()).sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
    );

    if (status) {
      alerts = alerts.filter((alert) => alert.status === status);
    }

    if (severity) {
      alerts = alerts.filter((alert) => alert.severity === severity);
    }

    if (employeeId) {
      alerts = alerts.filter((alert) => alert.employeeId === employeeId);
    }

    res.json(alerts);
  } catch (error) {
    console.error("Error getting AI alerts:", error);
    res.status(500).json({ error: "Failed to get AI alerts" });
  }
};

// Handle alert action
export const handleAlertAction: RequestHandler = (req, res) => {
  try {
    const { alertId } = req.params;
    const { action, notes, adminId } = alertActionSchema.parse(req.body);

    const alert = aiAlerts.get(alertId);
    if (!alert) {
      return res.status(404).json({ error: "Alert not found" });
    }

    // Update alert status
    alert.status =
      action === "approve"
        ? "approved"
        : action === "deny"
          ? "denied"
          : "in_review";
    alert.adminNotes = notes;
    alert.assignedTo = adminId;

    aiAlerts.set(alertId, alert);

    // Log the action
    const employee = aiEmployees.get(alert.employeeId);
    if (employee) {
      employee.lastActivity = new Date();
      aiEmployees.set(employee.id, employee);
    }

    // Send response to AI employee
    const responseMessage: AIMessage = {
      id: generateMessageId(),
      fromId: adminId,
      fromName: "Admin",
      toId: alert.employeeId,
      toName: employee?.name || "AI Employee",
      content: `Alert ${alertId} has been ${action}. ${notes ? `Notes: ${notes}` : ""}`,
      timestamp: new Date(),
      isFromAdmin: true,
      messageType: "report",
      priority: "medium",
    };

    aiMessages.set(responseMessage.id, responseMessage);

    res.json({ success: true, alert, message: responseMessage });
  } catch (error) {
    console.error("Error handling alert action:", error);
    res.status(400).json({ error: "Invalid action data" });
  }
};

// Get AI messages
export const handleGetAIMessages: RequestHandler = (req, res) => {
  try {
    const { employeeId, adminId } = req.query;

    let messages = Array.from(aiMessages.values()).sort(
      (a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
    );

    if (employeeId) {
      messages = messages.filter(
        (msg) => msg.fromId === employeeId || msg.toId === employeeId,
      );
    }

    if (adminId) {
      messages = messages.filter(
        (msg) => msg.fromId === adminId || msg.toId === adminId,
      );
    }

    res.json(messages);
  } catch (error) {
    console.error("Error getting AI messages:", error);
    res.status(500).json({ error: "Failed to get AI messages" });
  }
};

// Send message to AI employee
export const handleSendMessageToAI: RequestHandler = (req, res) => {
  try {
    const messageData = messageSchema.parse(req.body);

    const message: AIMessage = {
      id: generateMessageId(),
      ...messageData,
      timestamp: new Date(),
      isFromAdmin: true,
    };

    aiMessages.set(message.id, message);

    // Update employee last activity
    const employee = aiEmployees.get(message.toId);
    if (employee) {
      employee.lastActivity = new Date();
      aiEmployees.set(employee.id, employee);
    }

    res.json({ success: true, message });
  } catch (error) {
    console.error("Error sending message to AI:", error);
    res.status(400).json({ error: "Invalid message data" });
  }
};

// Log session to AI employee (for mini-games)
export const handleLogSessionToAI: RequestHandler = (req, res) => {
  try {
    const { department, sessionData } = req.body;

    // Find appropriate AI employee
    const employee = Array.from(aiEmployees.values()).find(
      (emp) => emp.department === department,
    );

    if (!employee) {
      return res
        .status(404)
        .json({ error: "AI employee not found for department" });
    }

    // Create analysis task
    const task: AITask = {
      id: generateTaskId(),
      employeeId: employee.id,
      type: "session_analysis",
      description: `Analyze game session for user ${sessionData.session.userId}`,
      data: sessionData,
      priority: sessionData.securityEvent ? "high" : "medium",
      status: "pending",
      assignedAt: new Date(),
    };

    aiTasks.set(task.id, task);

    // Process task immediately (simulate AI processing)
    setTimeout(() => processAITask(task), 1000);

    res.json({ success: true, taskId: task.id });
  } catch (error) {
    console.error("Error logging session to AI:", error);
    res.status(500).json({ error: "Failed to log session to AI" });
  }
};

// Analyze security events (for security AI)
export const handleAnalyzeSecurityEvents: RequestHandler = (req, res) => {
  try {
    const { events } = req.body;

    const securityAI = Array.from(aiEmployees.values()).find(
      (emp) => emp.department === "security",
    );

    if (!securityAI) {
      return res.status(404).json({ error: "Security AI not found" });
    }

    // Create analysis task for each event
    const tasks = events.map((event: any) => {
      const task: AITask = {
        id: generateTaskId(),
        employeeId: securityAI.id,
        type: "security_analysis",
        description: `Analyze security event: ${event.type}`,
        data: event,
        priority: event.severity === "critical" ? "critical" : "high",
        status: "pending",
        assignedAt: new Date(),
      };

      aiTasks.set(task.id, task);
      return task;
    });

    // Process tasks
    tasks.forEach((task) => {
      setTimeout(() => processSecurityAnalysis(task), 500);
    });

    res.json({ success: true, tasksCreated: tasks.length });
  } catch (error) {
    console.error("Error analyzing security events:", error);
    res.status(500).json({ error: "Failed to analyze security events" });
  }
};

// Process AI task (simulated AI processing)
function processAITask(task: AITask) {
  const employee = aiEmployees.get(task.employeeId);
  if (!employee) return;

  // Update task status
  task.status = "in_progress";
  aiTasks.set(task.id, task);

  // Simulate processing time
  setTimeout(
    () => {
      task.status = "completed";
      task.completedAt = new Date();
      task.confidence = 0.85 + Math.random() * 0.15;

      // Generate result based on task type
      if (task.type === "session_analysis") {
        task.result = {
          recommendation: "Session appears normal, no further action required",
          riskLevel: "low",
          confidence: task.confidence,
        };
      }

      // Update employee metrics
      employee.tasksCompleted++;
      employee.lastActivity = new Date();
      employee.metrics.sessionsAnalyzed++;

      aiTasks.set(task.id, task);
      aiEmployees.set(employee.id, employee);

      // Generate report message
      const reportMessage: AIMessage = {
        id: generateMessageId(),
        fromId: employee.id,
        fromName: employee.name,
        toId: "admin",
        toName: "Admin",
        content: `Task ${task.id} completed. ${task.result?.recommendation || "Analysis complete."}`,
        timestamp: new Date(),
        isFromAdmin: false,
        messageType: "report",
        priority: "medium",
        attachedData: task.result,
      };

      aiMessages.set(reportMessage.id, reportMessage);
    },
    2000 + Math.random() * 3000,
  );
}

// Process security analysis
function processSecurityAnalysis(task: AITask) {
  const employee = aiEmployees.get(task.employeeId);
  if (!employee) return;

  task.status = "in_progress";
  aiTasks.set(task.id, task);

  setTimeout(
    () => {
      task.status = "completed";
      task.completedAt = new Date();
      task.confidence = 0.8 + Math.random() * 0.2;

      const event = task.data;

      // Generate alert if needed
      if (
        event.severity === "critical" ||
        (event.severity === "high" && Math.random() > 0.3)
      ) {
        const alert: AIAlert = {
          id: generateAlertId(),
          employeeId: employee.id,
          type: "security",
          severity: event.severity,
          title: `Security Alert: ${event.type}`,
          description: `AI analysis detected ${event.type} requiring admin attention. ${event.details}`,
          data: event,
          actionRequired: true,
          suggestedActions: [
            "Review user account",
            "Check recent activity patterns",
            "Consider temporary restrictions",
            "Investigate further",
          ],
          timestamp: new Date(),
          status: "pending",
          confidence: task.confidence,
          relatedAlerts: [],
        };

        aiAlerts.set(alert.id, alert);
        employee.alertsGenerated++;
      }

      // Update employee metrics
      employee.tasksCompleted++;
      employee.lastActivity = new Date();
      employee.metrics.threatsDetected++;

      aiTasks.set(task.id, task);
      aiEmployees.set(employee.id, employee);
    },
    1500 + Math.random() * 2500,
  );
}

export {
  handleGetAIEmployees,
  handleGetAIEmployeeStatus,
  handleGetAIAlerts,
  handleAlertAction,
  handleGetAIMessages,
  handleSendMessageToAI,
  handleLogSessionToAI,
  handleAnalyzeSecurityEvents,
};
