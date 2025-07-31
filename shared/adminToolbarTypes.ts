export interface AIEmployee {
  id: string;
  name: string;
  role: string;
  specialization: string;
  status: 'online' | 'busy' | 'offline';
  avatar: string;
  description: string;
  capabilities: string[];
  lastActive: Date;
  tasksCompleted: number;
  performance: number; // 0-100 rating
}

export interface AIEmployeeMessage {
  id: string;
  employeeId: string;
  employeeName: string;
  message: string;
  timestamp: Date;
  type: 'status_update' | 'report' | 'alert' | 'task_update' | 'chat';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  metadata?: Record<string, any>;
}

export interface AdminChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderType: 'admin' | 'staff' | 'ai_employee';
  message: string;
  timestamp: Date;
  attachments?: string[];
  replyTo?: string;
  reactions?: Record<string, string[]>; // emoji -> user IDs
}

export interface AdminTask {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  assignedTo?: string;
  assignedBy: string;
  createdAt: Date;
  dueDate?: Date;
  completedAt?: Date;
  category: 'bug_fix' | 'feature' | 'maintenance' | 'content' | 'security' | 'compliance';
  tags: string[];
  attachments?: string[];
  comments?: TaskComment[];
}

export interface TaskComment {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
  attachments?: string[];
}

export interface BugReport {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'in_progress' | 'resolved' | 'closed';
  reportedBy: string;
  assignedTo?: string;
  category: 'frontend' | 'backend' | 'database' | 'security' | 'performance' | 'ui_ux';
  reproductionSteps: string[];
  expectedBehavior: string;
  actualBehavior: string;
  environment: {
    browser?: string;
    device?: string;
    os?: string;
    url?: string;
  };
  screenshots?: string[];
  logs?: string[];
  barcode: string; // Generated QR code for easy access
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  tags: string[];
  relatedIssues?: string[];
}

export interface AdminToolbarSettings {
  id: string;
  userId: string;
  position: 'right' | 'left';
  minimized: boolean;
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  soundEnabled: boolean;
  autoHideInactive: boolean;
  quickActions: string[];
  favoriteFeatures: string[];
  customShortcuts: Record<string, string>;
  chatNotifications: boolean;
  reportingEnabled: boolean;
}

export interface DocumentationSection {
  id: string;
  title: string;
  category: 'user' | 'staff' | 'admin';
  content: string;
  subcategories: string[];
  tags: string[];
  visibility: 'public' | 'staff_only' | 'admin_only';
  lastUpdated: Date;
  updatedBy: string;
  version: string;
  attachments?: string[];
  relatedSections?: string[];
}

export interface AdminQuickAction {
  id: string;
  label: string;
  icon: string;
  action: string;
  permission: 'admin' | 'staff';
  category: 'navigation' | 'tools' | 'reports' | 'settings';
  shortcut?: string;
  badge?: string; // For notification counts
}

// Default AI Employees for Coin Krazy Social Casino
export const DEFAULT_AI_EMPLOYEES: AIEmployee[] = [
  {
    id: 'lucky-ai',
    name: 'LuckyAI',
    role: 'Operations Manager',
    specialization: 'Overall casino management and coordination',
    status: 'online',
    avatar: '🍀',
    description: 'Master coordinator for all casino operations, providing oversight and detailed reports from all AI employee agents.',
    capabilities: [
      'Overall operations management',
      'AI employee coordination',
      'Real-time reporting',
      'Day-to-day operations oversight',
      'Performance analytics',
      'Strategic planning'
    ],
    lastActive: new Date(),
    tasksCompleted: 0,
    performance: 98
  },
  {
    id: 'security-sentinel',
    name: 'SecuritySentinel',
    role: 'Security Manager',
    specialization: 'Platform security and fraud detection',
    status: 'online',
    avatar: '🛡️',
    description: 'Advanced security monitoring and fraud prevention specialist.',
    capabilities: [
      'Real-time fraud detection',
      'Security monitoring',
      'Account verification',
      'Risk assessment',
      'Compliance checking',
      'Incident response'
    ],
    lastActive: new Date(),
    tasksCompleted: 0,
    performance: 96
  },
  {
    id: 'game-master',
    name: 'GameMaster',
    role: 'Game Operations Specialist',
    specialization: 'Game mechanics and player experience',
    status: 'online',
    avatar: '����',
    description: 'Expert in game operations, RTP optimization, and player engagement.',
    capabilities: [
      'Game performance monitoring',
      'RTP analysis',
      'Player behavior analysis',
      'Game balancing',
      'Feature optimization',
      'Player experience enhancement'
    ],
    lastActive: new Date(),
    tasksCompleted: 0,
    performance: 94
  },
  {
    id: 'customer-care',
    name: 'CustomerCare',
    role: 'Customer Support Lead',
    specialization: 'Player support and satisfaction',
    status: 'online',
    avatar: '💬',
    description: 'Dedicated customer service and player satisfaction specialist.',
    capabilities: [
      'Player support',
      'Issue resolution',
      'Account assistance',
      'Complaint handling',
      'Satisfaction monitoring',
      'Communication management'
    ],
    lastActive: new Date(),
    tasksCompleted: 0,
    performance: 97
  },
  {
    id: 'data-analyst',
    name: 'DataAnalyst',
    role: 'Analytics Specialist',
    specialization: 'Data analysis and business intelligence',
    status: 'online',
    avatar: '📊',
    description: 'Advanced data analytics and business intelligence specialist.',
    capabilities: [
      'Data analysis',
      'Performance metrics',
      'Revenue optimization',
      'Player analytics',
      'Trend analysis',
      'Predictive modeling'
    ],
    lastActive: new Date(),
    tasksCompleted: 0,
    performance: 95
  },
  {
    id: 'compliance-officer',
    name: 'ComplianceOfficer',
    role: 'Compliance Manager',
    specialization: 'Regulatory compliance and legal oversight',
    status: 'online',
    avatar: '⚖️',
    description: 'Regulatory compliance and legal requirements specialist.',
    capabilities: [
      'Regulatory compliance',
      'Legal oversight',
      'Policy enforcement',
      'Audit preparation',
      'Risk management',
      'Documentation review'
    ],
    lastActive: new Date(),
    tasksCompleted: 0,
    performance: 99
  }
];

export const DEFAULT_QUICK_ACTIONS: AdminQuickAction[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: '📊',
    action: '/admin',
    permission: 'admin',
    category: 'navigation'
  },
  {
    id: 'user-management',
    label: 'Users',
    icon: '👥',
    action: '/admin/users',
    permission: 'admin',
    category: 'navigation'
  },
  {
    id: 'game-editor',
    label: 'Game Editor',
    icon: '🎮',
    action: '/admin/games',
    permission: 'admin',
    category: 'tools'
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: '📈',
    action: '/admin/reports',
    permission: 'admin',
    category: 'reports'
  },
  {
    id: 'security',
    label: 'Security',
    icon: '🔒',
    action: '/admin/security',
    permission: 'admin',
    category: 'tools'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: '⚙️',
    action: '/admin/settings',
    permission: 'admin',
    category: 'settings'
  }
];
