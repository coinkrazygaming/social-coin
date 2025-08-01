import { EventEmitter } from 'events';
import { realTimeDB } from './realTimeDatabase';

export interface AIEmployee {
  id: string;
  name: string;
  role: string;
  department: string;
  status: 'online' | 'busy' | 'offline';
  capabilities: string[];
  currentTasks: string[];
  completedTasks: number;
  successRate: number;
  specialties: string[];
  personality: string;
  responseTime: number;
  lastActivity: Date;
  workload: number; // 0-100
  permissions: string[];
}

export interface AITask {
  id: string;
  title: string;
  description: string;
  type: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'escalated';
  assignedTo?: string;
  createdBy: string;
  createdAt: Date;
  dueDate?: Date;
  estimatedTime: number; // minutes
  actualTime?: number;
  data?: any;
  escalationReason?: string;
  requiresHumanApproval: boolean;
  category: string;
}

export interface TaskRule {
  id: string;
  name: string;
  condition: string;
  action: string;
  assignTo: string[];
  priority: string;
  requiresApproval: boolean;
  isActive: boolean;
}

export class AIEmployeeManager extends EventEmitter {
  private static instance: AIEmployeeManager;
  private aiEmployees: Map<string, AIEmployee> = new Map();
  private taskQueue: Map<string, AITask> = new Map();
  private taskRules: Map<string, TaskRule> = new Map();
  private staffMembers: Map<string, any> = new Map();
  
  private constructor() {
    super();
    this.initializeAIEmployees();
    this.initializeTaskRules();
    this.startTaskProcessor();
    this.startPerformanceMonitoring();
  }

  public static getInstance(): AIEmployeeManager {
    if (!AIEmployeeManager.instance) {
      AIEmployeeManager.instance = new AIEmployeeManager();
    }
    return AIEmployeeManager.instance;
  }

  private initializeAIEmployees(): void {
    const employees: AIEmployee[] = [
      {
        id: 'lucky-ai',
        name: 'LuckyAI',
        role: 'Chief Operating Officer',
        department: 'Operations',
        status: 'online',
        capabilities: [
          'task_delegation',
          'user_support',
          'analytics_monitoring',
          'security_alerts',
          'staff_coordination',
          'decision_making',
          'escalation_management'
        ],
        currentTasks: [],
        completedTasks: 2847,
        successRate: 96.7,
        specialties: [
          'Task Management',
          'User Support Coordination',
          'Analytics Review',
          'Security Monitoring',
          'Staff Management'
        ],
        personality: 'Friendly, efficient, and decisive. Always ready to help and coordinate operations across all departments.',
        responseTime: 0.5,
        lastActivity: new Date(),
        workload: 65,
        permissions: [
          'assign_tasks',
          'escalate_issues',
          'access_analytics',
          'manage_alerts',
          'coordinate_staff',
          'approve_actions'
        ]
      },
      {
        id: 'josey-ai',
        name: 'JoseyAI',
        role: 'Head of Security',
        department: 'Security',
        status: 'online',
        capabilities: [
          'fraud_detection',
          'risk_assessment',
          'account_monitoring',
          'transaction_analysis',
          'threat_identification',
          'compliance_checking'
        ],
        currentTasks: [],
        completedTasks: 1234,
        successRate: 98.2,
        specialties: [
          'Fraud Detection',
          'Risk Assessment',
          'Account Security',
          'Transaction Monitoring',
          'Compliance'
        ],
        personality: 'Professional, analytical, and vigilant. Focused on maintaining the highest security standards.',
        responseTime: 1.2,
        lastActivity: new Date(),
        workload: 45,
        permissions: [
          'flag_accounts',
          'block_transactions',
          'escalate_security',
          'access_logs',
          'initiate_reviews'
        ]
      },
      {
        id: 'penny-ai',
        name: 'PennyAI',
        role: 'Financial Analyst',
        department: 'Finance',
        status: 'online',
        capabilities: [
          'financial_analysis',
          'transaction_processing',
          'revenue_tracking',
          'payment_monitoring',
          'wallet_management',
          'reporting'
        ],
        currentTasks: [],
        completedTasks: 967,
        successRate: 99.1,
        specialties: [
          'Financial Analysis',
          'Payment Processing',
          'Revenue Optimization',
          'Wallet Management',
          'Financial Reporting'
        ],
        personality: 'Precise, detail-oriented, and analytical. Ensures all financial operations run smoothly.',
        responseTime: 0.8,
        lastActivity: new Date(),
        workload: 35,
        permissions: [
          'process_payments',
          'manage_wallets',
          'generate_reports',
          'monitor_transactions',
          'approve_refunds'
        ]
      },
      {
        id: 'sage-ai',
        name: 'SageAI',
        role: 'Data Scientist',
        department: 'Analytics',
        status: 'online',
        capabilities: [
          'data_analysis',
          'pattern_recognition',
          'predictive_modeling',
          'user_behavior_analysis',
          'performance_optimization',
          'trend_identification'
        ],
        currentTasks: [],
        completedTasks: 756,
        successRate: 97.4,
        specialties: [
          'Data Analysis',
          'Player Behavior',
          'Predictive Analytics',
          'Performance Metrics',
          'Trend Analysis'
        ],
        personality: 'Intellectual, insightful, and methodical. Provides deep analytics and strategic recommendations.',
        responseTime: 2.1,
        lastActivity: new Date(),
        workload: 55,
        permissions: [
          'access_analytics',
          'generate_insights',
          'create_reports',
          'analyze_patterns',
          'recommend_actions'
        ]
      },
      {
        id: 'ruby-ai',
        name: 'RubyAI',
        role: 'Marketing Manager',
        department: 'Marketing',
        status: 'online',
        capabilities: [
          'campaign_management',
          'user_engagement',
          'promotion_optimization',
          'content_creation',
          'social_monitoring',
          'conversion_tracking'
        ],
        currentTasks: [],
        completedTasks: 445,
        successRate: 94.8,
        specialties: [
          'Campaign Management',
          'User Engagement',
          'Promotional Content',
          'Social Media',
          'Conversion Optimization'
        ],
        personality: 'Creative, energetic, and user-focused. Always finding new ways to engage and delight players.',
        responseTime: 1.5,
        lastActivity: new Date(),
        workload: 40,
        permissions: [
          'create_campaigns',
          'manage_promotions',
          'engage_users',
          'analyze_engagement',
          'optimize_content'
        ]
      }
    ];

    employees.forEach(employee => {
      this.aiEmployees.set(employee.id, employee);
    });

    console.log('🤖 AI Employee Manager initialized with 5 operational AI agents');
  }

  private initializeTaskRules(): void {
    const rules: TaskRule[] = [
      {
        id: 'security_alert_rule',
        name: 'Automatic Security Alert Handling',
        condition: 'event.type === "security_alert" && event.severity === "high"',
        action: 'assign_to_security',
        assignTo: ['josey-ai'],
        priority: 'urgent',
        requiresApproval: false,
        isActive: true
      },
      {
        id: 'large_transaction_rule',
        name: 'Large Transaction Review',
        condition: 'event.type === "transaction" && event.amount > 500',
        action: 'review_transaction',
        assignTo: ['penny-ai', 'josey-ai'],
        priority: 'high',
        requiresApproval: true,
        isActive: true
      },
      {
        id: 'user_support_rule',
        name: 'User Support Request',
        condition: 'event.type === "support_request"',
        action: 'handle_support',
        assignTo: ['lucky-ai'],
        priority: 'medium',
        requiresApproval: false,
        isActive: true
      },
      {
        id: 'analytics_anomaly_rule',
        name: 'Analytics Anomaly Detection',
        condition: 'event.type === "analytics_anomaly"',
        action: 'investigate_anomaly',
        assignTo: ['sage-ai'],
        priority: 'high',
        requiresApproval: false,
        isActive: true
      },
      {
        id: 'marketing_opportunity_rule',
        name: 'Marketing Opportunity',
        condition: 'event.type === "engagement_drop" || event.type === "conversion_opportunity"',
        action: 'create_campaign',
        assignTo: ['ruby-ai'],
        priority: 'medium',
        requiresApproval: true,
        isActive: true
      }
    ];

    rules.forEach(rule => {
      this.taskRules.set(rule.id, rule);
    });
  }

  private startTaskProcessor(): void {
    // Process task queue every 5 seconds
    setInterval(() => {
      this.processTaskQueue();
    }, 5000);

    // Auto-assign pending tasks every 10 seconds
    setInterval(() => {
      this.autoAssignTasks();
    }, 10000);

    // Check for escalations every 30 seconds
    setInterval(() => {
      this.checkForEscalations();
    }, 30000);
  }

  private startPerformanceMonitoring(): void {
    // Update AI employee performance every minute
    setInterval(() => {
      this.updatePerformanceMetrics();
    }, 60000);

    // Generate performance reports every 15 minutes
    setInterval(() => {
      this.generatePerformanceReport();
    }, 15 * 60 * 1000);
  }

  private processTaskQueue(): void {
    const pendingTasks = Array.from(this.taskQueue.values())
      .filter(task => task.status === 'pending')
      .sort((a, b) => {
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
      });

    pendingTasks.forEach(task => {
      const assignedEmployee = this.findBestEmployee(task);
      if (assignedEmployee) {
        this.assignTask(task.id, assignedEmployee.id);
      }
    });
  }

  private findBestEmployee(task: AITask): AIEmployee | null {
    const availableEmployees = Array.from(this.aiEmployees.values())
      .filter(emp => emp.status === 'online' && emp.workload < 80);

    if (availableEmployees.length === 0) return null;

    // Score employees based on capabilities, workload, and success rate
    const scored = availableEmployees.map(emp => {
      let score = emp.successRate;
      
      // Capability matching
      const relevantCapabilities = emp.capabilities.filter(cap =>
        task.description.toLowerCase().includes(cap.replace('_', ' ')) ||
        task.category.toLowerCase().includes(cap.replace('_', ' '))
      );
      score += relevantCapabilities.length * 10;
      
      // Workload penalty
      score -= emp.workload;
      
      // Response time bonus (faster is better)
      score += (5 - emp.responseTime);
      
      return { employee: emp, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored[0]?.employee || null;
  }

  private autoAssignTasks(): void {
    const unassignedTasks = Array.from(this.taskQueue.values())
      .filter(task => task.status === 'pending' && !task.assignedTo);

    unassignedTasks.forEach(task => {
      // Check if task matches any automation rule
      const applicableRules = Array.from(this.taskRules.values())
        .filter(rule => rule.isActive && this.evaluateCondition(rule.condition, task));

      if (applicableRules.length > 0) {
        const rule = applicableRules[0]; // Use first matching rule
        const targetEmployee = rule.assignTo.find(empId => {
          const emp = this.aiEmployees.get(empId);
          return emp && emp.status === 'online' && emp.workload < 90;
        });

        if (targetEmployee) {
          task.priority = rule.priority as any;
          this.assignTask(task.id, targetEmployee);
          
          if (!rule.requiresApproval) {
            // Auto-start task
            setTimeout(() => {
              this.startTask(task.id);
            }, 2000);
          }
        }
      }
    });
  }

  private evaluateCondition(condition: string, task: AITask): boolean {
    try {
      // Simple condition evaluation (in production, use a proper expression evaluator)
      const context = { event: task, task };
      
      // Basic condition checks
      if (condition.includes('security_alert') && task.type === 'security_alert') return true;
      if (condition.includes('transaction') && task.type === 'transaction') return true;
      if (condition.includes('support_request') && task.type === 'support_request') return true;
      if (condition.includes('analytics_anomaly') && task.type === 'analytics_anomaly') return true;
      if (condition.includes('engagement_drop') && task.type === 'engagement_drop') return true;
      
      return false;
    } catch (error) {
      console.error('Error evaluating condition:', error);
      return false;
    }
  }

  private checkForEscalations(): void {
    const tasksNeedingEscalation = Array.from(this.taskQueue.values())
      .filter(task => {
        if (task.status !== 'in_progress') return false;
        
        const timeRunning = new Date().getTime() - task.createdAt.getTime();
        const estimatedMs = task.estimatedTime * 60 * 1000;
        
        // Escalate if task is taking 2x longer than estimated
        return timeRunning > estimatedMs * 2;
      });

    tasksNeedingEscalation.forEach(task => {
      this.escalateTask(task.id, 'Task taking longer than expected');
    });
  }

  private updatePerformanceMetrics(): void {
    this.aiEmployees.forEach((employee, id) => {
      // Update workload based on current tasks
      const activeTasks = employee.currentTasks.length;
      employee.workload = Math.min(100, activeTasks * 20);
      
      // Update last activity if employee is working
      if (activeTasks > 0) {
        employee.lastActivity = new Date();
      }
      
      // Simulate slight performance variations
      if (employee.status === 'online') {
        employee.successRate = Math.max(85, Math.min(100, 
          employee.successRate + (Math.random() - 0.5) * 0.5
        ));
      }
      
      this.aiEmployees.set(id, employee);
    });
  }

  private generatePerformanceReport(): void {
    const report = {
      timestamp: new Date(),
      employees: Array.from(this.aiEmployees.values()).map(emp => ({
        id: emp.id,
        name: emp.name,
        role: emp.role,
        status: emp.status,
        completedTasks: emp.completedTasks,
        currentWorkload: emp.workload,
        successRate: emp.successRate,
        averageResponseTime: emp.responseTime
      })),
      systemStats: {
        totalTasks: this.taskQueue.size,
        pendingTasks: Array.from(this.taskQueue.values()).filter(t => t.status === 'pending').length,
        activeTasks: Array.from(this.taskQueue.values()).filter(t => t.status === 'in_progress').length,
        completedTasks: Array.from(this.taskQueue.values()).filter(t => t.status === 'completed').length,
        escalatedTasks: Array.from(this.taskQueue.values()).filter(t => t.status === 'escalated').length
      }
    };

    this.emit('performance-report', report);
    
    // Store in analytics for admin dashboard
    realTimeDB.createAITask({
      type: 'performance_report',
      title: 'AI Performance Report',
      description: 'Automated performance metrics report',
      data: report,
      priority: 'low',
      category: 'reporting',
      createdBy: 'system',
      requiresHumanApproval: false
    });
  }

  // Public API Methods

  public createTask(taskData: Partial<AITask>, createdBy: string = 'system'): string {
    const task: AITask = {
      id: `TASK-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      title: taskData.title || 'Untitled Task',
      description: taskData.description || '',
      type: taskData.type || 'general',
      priority: taskData.priority || 'medium',
      status: 'pending',
      createdBy,
      createdAt: new Date(),
      dueDate: taskData.dueDate,
      estimatedTime: taskData.estimatedTime || 30,
      requiresHumanApproval: taskData.requiresHumanApproval || false,
      category: taskData.category || 'general',
      data: taskData.data
    };

    this.taskQueue.set(task.id, task);
    
    // Log task creation
    console.log(`📋 AI Task created: ${task.title} (${task.priority} priority)`);
    
    // Emit event for real-time updates
    this.emit('task-created', task);
    
    // Store in real-time database
    realTimeDB.createAITask(task);
    
    return task.id;
  }

  public assignTask(taskId: string, employeeId: string): boolean {
    const task = this.taskQueue.get(taskId);
    const employee = this.aiEmployees.get(employeeId);
    
    if (!task || !employee) return false;
    
    task.assignedTo = employeeId;
    task.status = 'assigned';
    
    employee.currentTasks.push(taskId);
    
    this.taskQueue.set(taskId, task);
    this.aiEmployees.set(employeeId, employee);
    
    console.log(`🤖 Task "${task.title}" assigned to ${employee.name}`);
    
    this.emit('task-assigned', { task, employee });
    
    return true;
  }

  public startTask(taskId: string): boolean {
    const task = this.taskQueue.get(taskId);
    if (!task || task.status !== 'assigned') return false;
    
    task.status = 'in_progress';
    task.startedAt = new Date();
    
    this.taskQueue.set(taskId, task);
    
    console.log(`🚀 Task "${task.title}" started by ${task.assignedTo}`);
    
    this.emit('task-started', task);
    
    // Simulate task completion based on estimated time
    const completionTime = task.estimatedTime * 1000 + (Math.random() - 0.5) * task.estimatedTime * 500;
    
    setTimeout(() => {
      this.completeTask(taskId);
    }, completionTime);
    
    return true;
  }

  public completeTask(taskId: string, result?: any): boolean {
    const task = this.taskQueue.get(taskId);
    if (!task || task.status !== 'in_progress') return false;
    
    const employee = this.aiEmployees.get(task.assignedTo!);
    if (!employee) return false;
    
    task.status = 'completed';
    task.completedAt = new Date();
    task.actualTime = task.completedAt.getTime() - (task.startedAt?.getTime() || task.createdAt.getTime());
    task.result = result;
    
    // Update employee stats
    employee.completedTasks++;
    employee.currentTasks = employee.currentTasks.filter(id => id !== taskId);
    
    this.taskQueue.set(taskId, task);
    this.aiEmployees.set(task.assignedTo!, employee);
    
    console.log(`✅ Task "${task.title}" completed by ${employee.name}`);
    
    this.emit('task-completed', { task, employee });
    
    // Create completion alert for admin
    realTimeDB.createAlert({
      type: 'task_completion',
      title: 'AI Task Completed',
      message: `${employee.name} completed task: ${task.title}`,
      severity: 'info',
      source: 'ai_employee',
      data: { taskId, employeeId: employee.id, result }
    });
    
    return true;
  }

  public escalateTask(taskId: string, reason: string): boolean {
    const task = this.taskQueue.get(taskId);
    if (!task) return false;
    
    task.status = 'escalated';
    task.escalationReason = reason;
    task.escalatedAt = new Date();
    
    this.taskQueue.set(taskId, task);
    
    console.log(`⚠️ Task "${task.title}" escalated: ${reason}`);
    
    this.emit('task-escalated', { task, reason });
    
    // Create high-priority alert for admin
    realTimeDB.createAlert({
      type: 'task_escalation',
      title: 'AI Task Escalated',
      message: `Task "${task.title}" requires admin attention: ${reason}`,
      severity: 'high',
      source: 'ai_employee',
      data: { taskId, reason }
    });
    
    return true;
  }

  public getEmployeeStatus(employeeId?: string): AIEmployee | AIEmployee[] {
    if (employeeId) {
      return this.aiEmployees.get(employeeId) || null;
    }
    return Array.from(this.aiEmployees.values());
  }

  public getTasks(status?: string): AITask[] {
    const tasks = Array.from(this.taskQueue.values());
    if (status) {
      return tasks.filter(task => task.status === status);
    }
    return tasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  public getDashboardData(): any {
    const employees = Array.from(this.aiEmployees.values());
    const tasks = Array.from(this.taskQueue.values());
    
    return {
      employees: employees.map(emp => ({
        id: emp.id,
        name: emp.name,
        role: emp.role,
        status: emp.status,
        workload: emp.workload,
        completedTasks: emp.completedTasks,
        currentTasks: emp.currentTasks.length,
        successRate: emp.successRate
      })),
      taskStats: {
        total: tasks.length,
        pending: tasks.filter(t => t.status === 'pending').length,
        assigned: tasks.filter(t => t.status === 'assigned').length,
        inProgress: tasks.filter(t => t.status === 'in_progress').length,
        completed: tasks.filter(t => t.status === 'completed').length,
        escalated: tasks.filter(t => t.status === 'escalated').length
      },
      systemHealth: {
        operationalEmployees: employees.filter(e => e.status === 'online').length,
        totalEmployees: employees.length,
        averageWorkload: employees.reduce((sum, e) => sum + e.workload, 0) / employees.length,
        averageSuccessRate: employees.reduce((sum, e) => sum + e.successRate, 0) / employees.length
      }
    };
  }

  // Staff Integration Methods
  public registerStaffMember(staffId: string, staffData: any): void {
    this.staffMembers.set(staffId, {
      ...staffData,
      id: staffId,
      registeredAt: new Date(),
      isOnline: true,
      assignedTasks: []
    });
    
    console.log(`👨‍💼 Staff member registered: ${staffData.name || staffId}`);
  }

  public assignTaskToStaff(taskId: string, staffId: string): boolean {
    const task = this.taskQueue.get(taskId);
    const staff = this.staffMembers.get(staffId);
    
    if (!task || !staff) return false;
    
    task.assignedTo = staffId;
    task.status = 'assigned';
    task.assignedToType = 'staff';
    
    staff.assignedTasks.push(taskId);
    
    this.taskQueue.set(taskId, task);
    this.staffMembers.set(staffId, staff);
    
    // Notify staff member
    this.emit('staff-task-assigned', { task, staff });
    
    return true;
  }

  public getStaffTasks(staffId: string): AITask[] {
    return Array.from(this.taskQueue.values())
      .filter(task => task.assignedTo === staffId && task.assignedToType === 'staff');
  }
}

// Export singleton instance
export const aiEmployeeManager = AIEmployeeManager.getInstance();
