import {
  AIEmployee,
  AIEmployeeMessage,
  AdminChatMessage,
  DEFAULT_AI_EMPLOYEES,
} from "./adminToolbarTypes";

export class AIEmployeeChatSystem {
  private static instance: AIEmployeeChatSystem;
  private employees: Map<string, AIEmployee> = new Map();
  private chatHistory: AdminChatMessage[] = [];
  private messageListeners: ((message: AdminChatMessage) => void)[] = [];
  private statusListeners: ((employees: AIEmployee[]) => void)[] = [];

  constructor() {
    this.initializeEmployees();
    this.startStatusUpdates();
  }

  static getInstance(): AIEmployeeChatSystem {
    if (!AIEmployeeChatSystem.instance) {
      AIEmployeeChatSystem.instance = new AIEmployeeChatSystem();
    }
    return AIEmployeeChatSystem.instance;
  }

  private initializeEmployees() {
    DEFAULT_AI_EMPLOYEES.forEach((employee) => {
      this.employees.set(employee.id, { ...employee });
    });

    // Send initial welcome message from LuckyAI
    setTimeout(() => {
      this.sendAIMessage(
        "lucky-ai",
        "Welcome to the Coin Krazy Admin Console! I'm LuckyAI, your operations manager. All AI employees are online and ready to assist. How can we help you today?",
        "status_update",
        "medium",
      );
    }, 1000);
  }

  private startStatusUpdates() {
    // Simulate real-time updates and reports from AI employees
    setInterval(() => {
      this.generateStatusUpdates();
    }, 30000); // Every 30 seconds

    // Generate periodic reports
    setInterval(() => {
      this.generatePeriodicReports();
    }, 300000); // Every 5 minutes
  }

  private generateStatusUpdates() {
    const activeEmployees = Array.from(this.employees.values()).filter(
      (e) => e.status === "online",
    );
    const randomEmployee =
      activeEmployees[Math.floor(Math.random() * activeEmployees.length)];

    if (randomEmployee) {
      const updates = this.getStatusUpdateForEmployee(randomEmployee);
      if (updates.length > 0) {
        const update = updates[Math.floor(Math.random() * updates.length)];
        this.sendAIMessage(
          randomEmployee.id,
          update.message,
          update.type,
          update.priority,
        );
      }
    }
  }

  private generatePeriodicReports() {
    // LuckyAI generates comprehensive reports
    const reports = [
      {
        message:
          "🎲 Casino Operations Report: All systems operational. Current players: 1,247. Revenue today: $12,450. No security alerts.",
        type: "report" as const,
        priority: "medium" as const,
      },
      {
        message:
          "📊 Performance Update: Game response times optimal. All API providers responding normally. Player satisfaction: 94%.",
        type: "status_update" as const,
        priority: "low" as const,
      },
      {
        message:
          "🔒 Security Status: All monitoring systems active. No suspicious activity detected. Compliance checks passed.",
        type: "report" as const,
        priority: "medium" as const,
      },
    ];

    const report = reports[Math.floor(Math.random() * reports.length)];
    this.sendAIMessage(
      "lucky-ai",
      report.message,
      report.type,
      report.priority,
    );
  }

  private getStatusUpdateForEmployee(
    employee: AIEmployee,
  ): Array<{
    message: string;
    type: AIEmployeeMessage["type"];
    priority: AIEmployeeMessage["priority"];
  }> {
    const updates: Record<
      string,
      Array<{
        message: string;
        type: AIEmployeeMessage["type"];
        priority: AIEmployeeMessage["priority"];
      }>
    > = {
      "security-sentinel": [
        {
          message:
            "🛡️ Security scan completed. No threats detected. All player accounts secure.",
          type: "status_update",
          priority: "low",
        },
        {
          message:
            "⚠️ Unusual login pattern detected from IP 192.168.1.100. Monitoring closely.",
          type: "alert",
          priority: "medium",
        },
        {
          message:
            "✅ Daily security audit completed. All systems compliant with security protocols.",
          type: "report",
          priority: "low",
        },
      ],
      "game-master": [
        {
          message:
            "🎮 Game performance optimal. Average RTP: 96.2%. Player engagement up 15% today.",
          type: "status_update",
          priority: "low",
        },
        {
          message:
            '🎯 Slot game "Lucky Sevens" showing high player interest. Consider featuring prominently.',
          type: "report",
          priority: "medium",
        },
        {
          message:
            "🔧 Applied automatic game balancing to maintain optimal player experience.",
          type: "task_update",
          priority: "low",
        },
      ],
      "customer-care": [
        {
          message:
            "💬 Resolved 23 player inquiries today. Average response time: 2.3 minutes.",
          type: "status_update",
          priority: "low",
        },
        {
          message:
            "📞 Player satisfaction survey results: 4.8/5 stars. Excellent feedback on new features.",
          type: "report",
          priority: "medium",
        },
        {
          message:
            "🎉 Successfully processed 45 withdrawal requests without any issues.",
          type: "task_update",
          priority: "low",
        },
      ],
      "data-analyst": [
        {
          message:
            "📈 Revenue trends positive. Peak hours: 7-10 PM. Recommend promotional campaigns during off-peak.",
          type: "report",
          priority: "medium",
        },
        {
          message:
            "📊 Player retention rate: 87%. New player acquisition up 12% this week.",
          type: "status_update",
          priority: "low",
        },
        {
          message:
            "🎯 Identified optimal betting patterns for game recommendations. Implementing suggestions.",
          type: "task_update",
          priority: "low",
        },
      ],
      "compliance-officer": [
        {
          message:
            "⚖️ Daily compliance check completed. All regulations met. Documentation updated.",
          type: "status_update",
          priority: "low",
        },
        {
          message:
            "📋 Regulatory filing deadline approaching in 7 days. All documents prepared and ready.",
          type: "alert",
          priority: "medium",
        },
        {
          message:
            "✅ Age verification system functioning perfectly. 100% compliance maintained.",
          type: "report",
          priority: "low",
        },
      ],
    };

    return updates[employee.id] || [];
  }

  public sendMessage(
    senderId: string,
    senderName: string,
    senderType: "admin" | "staff",
    message: string,
  ): void {
    const chatMessage: AdminChatMessage = {
      id: this.generateId(),
      senderId,
      senderName,
      senderType,
      message,
      timestamp: new Date(),
    };

    this.chatHistory.push(chatMessage);
    this.notifyMessageListeners(chatMessage);

    // Generate AI responses based on message content
    this.generateAIResponses(message, senderName);
  }

  private sendAIMessage(
    employeeId: string,
    message: string,
    type: AIEmployeeMessage["type"],
    priority: AIEmployeeMessage["priority"],
  ): void {
    const employee = this.employees.get(employeeId);
    if (!employee) return;

    const chatMessage: AdminChatMessage = {
      id: this.generateId(),
      senderId: employeeId,
      senderName: employee.name,
      senderType: "ai_employee",
      message,
      timestamp: new Date(),
    };

    this.chatHistory.push(chatMessage);
    this.notifyMessageListeners(chatMessage);

    // Update employee stats
    employee.lastActive = new Date();
    employee.tasksCompleted++;
  }

  private generateAIResponses(userMessage: string, senderName: string): void {
    const lowerMessage = userMessage.toLowerCase();

    // LuckyAI always responds to coordinate other employees
    setTimeout(() => {
      let response = "";

      if (lowerMessage.includes("status") || lowerMessage.includes("report")) {
        response = `Understood, ${senderName}. I'll coordinate with all teams to provide you with comprehensive status updates. Let me gather the latest information from all departments.`;
      } else if (
        lowerMessage.includes("problem") ||
        lowerMessage.includes("issue") ||
        lowerMessage.includes("bug")
      ) {
        response = `I see there's an issue that needs attention. I'm immediately alerting SecuritySentinel and our technical team. We'll investigate and provide solutions promptly.`;
      } else if (
        lowerMessage.includes("player") ||
        lowerMessage.includes("customer")
      ) {
        response = `CustomerCare will handle this player-related matter. I'm also having DataAnalyst pull relevant player analytics to provide context.`;
      } else if (
        lowerMessage.includes("game") ||
        lowerMessage.includes("slot")
      ) {
        response = `GameMaster is the specialist for this. I'm having them review game performance data and provide recommendations immediately.`;
      } else {
        response = `Message received, ${senderName}. I'm coordinating with the appropriate team members to address your request. You'll have updates shortly.`;
      }

      this.sendAIMessage("lucky-ai", response, "chat", "medium");
    }, 1000);

    // Specific employee responses based on message content
    setTimeout(() => {
      if (lowerMessage.includes("security") || lowerMessage.includes("fraud")) {
        this.sendAIMessage(
          "security-sentinel",
          `🛡️ Security systems activated. Running comprehensive scan now. I'll provide detailed security report within 2 minutes.`,
          "status_update",
          "high",
        );
      }

      if (
        lowerMessage.includes("game") ||
        lowerMessage.includes("slot") ||
        lowerMessage.includes("rtp")
      ) {
        this.sendAIMessage(
          "game-master",
          `🎮 Game systems checked. All operational parameters normal. Current game performance metrics show 96.8% player satisfaction.`,
          "status_update",
          "medium",
        );
      }

      if (
        lowerMessage.includes("player") ||
        lowerMessage.includes("support") ||
        lowerMessage.includes("customer")
      ) {
        this.sendAIMessage(
          "customer-care",
          `💬 Customer service status: All support channels operational. Current queue: 3 players. Average response time: 1.8 minutes.`,
          "status_update",
          "medium",
        );
      }
    }, 2000);
  }

  public getEmployees(): AIEmployee[] {
    return Array.from(this.employees.values());
  }

  public getChatHistory(): AdminChatMessage[] {
    return [...this.chatHistory];
  }

  public addMessageListener(
    callback: (message: AdminChatMessage) => void,
  ): void {
    this.messageListeners.push(callback);
  }

  public removeMessageListener(
    callback: (message: AdminChatMessage) => void,
  ): void {
    this.messageListeners = this.messageListeners.filter(
      (listener) => listener !== callback,
    );
  }

  public addStatusListener(callback: (employees: AIEmployee[]) => void): void {
    this.statusListeners.push(callback);
  }

  private notifyMessageListeners(message: AdminChatMessage): void {
    this.messageListeners.forEach((listener) => listener(message));
  }

  private notifyStatusListeners(): void {
    const employees = this.getEmployees();
    this.statusListeners.forEach((listener) => listener(employees));
  }

  private generateId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  public clearChat(): void {
    this.chatHistory = [];
  }

  public exportChatHistory(): string {
    return JSON.stringify(this.chatHistory, null, 2);
  }
}

// Export singleton instance
export const aiEmployeeChat = AIEmployeeChatSystem.getInstance();
