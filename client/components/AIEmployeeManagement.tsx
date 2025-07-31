import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  User,
  Settings,
  Activity,
  Clock,
  TrendingUp,
  Award,
  AlertCircle,
  CheckCircle,
  XCircle,
  Pause,
  Play,
  RotateCcw,
  Zap,
  DollarSign,
  MessageSquare,
  FileText,
  Calendar,
  BarChart3,
  Shield,
  Crown,
  Star,
  Brain,
  Target,
  Briefcase,
  Users,
  PhoneCall,
  Mail,
  Eye,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  Download
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { useAuth } from './AuthContext';

interface AIEmployee {
  id: string;
  name: string;
  role: 'customer_service' | 'security' | 'redemption' | 'marketing' | 'analytics' | 'vip_management' | 'compliance' | 'manager';
  specialty: string[];
  isActive: boolean;
  avatar: string;
  capabilities: string[];
  workingHours: {
    start: string;
    end: string;
    timezone: string;
    workDays: number[];
  };
  performance: {
    tasksCompleted: number;
    averageResponseTime: number;
    successRate: number;
    lastActive: Date;
    hoursWorked: number;
    costSavings: number;
    customerSatisfaction: number;
    escalations: number;
  };
  configuration: {
    responseStyle: 'formal' | 'casual' | 'professional';
    escalationThreshold: number;
    autoApprovalLimits?: {
      maxAmount: number;
      riskScoreThreshold: number;
    };
    languages: string[];
    maxConcurrentTasks: number;
  };
  currentTasks: AITask[];
  dailyReport?: DailyReport;
  createdAt: Date;
  updatedAt: Date;
}

interface AITask {
  id: string;
  employeeId: string;
  type: 'customer_inquiry' | 'security_review' | 'redemption_process' | 'alert_response' | 'player_communication' | 'data_analysis' | 'content_creation';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'escalated' | 'failed';
  title: string;
  description: string;
  assignedAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  duration?: number;
  data: Record<string, any>;
  result?: Record<string, any>;
  escalatedTo?: string;
  escalationReason?: string;
  customerSatisfactionScore?: number;
}

interface DailyReport {
  id: string;
  employeeId: string;
  date: Date;
  metrics: {
    tasksCompleted: number;
    averageResponseTime: number;
    successRate: number;
    escalations: number;
    customerSatisfaction: number;
    costSavings: number;
    hoursWorked: number;
  };
  achievements: string[];
  areasForImprovement: string[];
  recommendations: string[];
  isSubmitted: boolean;
  submittedTo: string[];
}

interface AIEmployeeManagementProps {
  className?: string;
}

export const AIEmployeeManagement: React.FC<AIEmployeeManagementProps> = ({ className = '' }) => {
  const [employees, setEmployees] = useState<AIEmployee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<AIEmployee | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('performance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedTask, setSelectedTask] = useState<AITask | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    loadAIEmployees();
    startRealTimeUpdates();
  }, []);

  const loadAIEmployees = () => {
    const mockEmployees: AIEmployee[] = [
      {
        id: 'ai_luckyai',
        name: 'LuckyAI',
        role: 'manager',
        specialty: ['overall_management', 'decision_making', 'strategy', 'oversight'],
        isActive: true,
        avatar: '🍀',
        capabilities: [
          'Task Assignment & Delegation',
          'Performance Monitoring',
          'Strategic Decision Making',
          'Escalation Handling',
          'Resource Optimization',
          'Team Coordination',
          'Report Generation',
          'Quality Assurance'
        ],
        workingHours: {
          start: '00:00',
          end: '23:59',
          timezone: 'UTC',
          workDays: [0, 1, 2, 3, 4, 5, 6]
        },
        performance: {
          tasksCompleted: 1250,
          averageResponseTime: 1.2,
          successRate: 98.5,
          lastActive: new Date(),
          hoursWorked: 8760,
          costSavings: 87600,
          customerSatisfaction: 4.8,
          escalations: 15
        },
        configuration: {
          responseStyle: 'professional',
          escalationThreshold: 90,
          languages: ['en', 'es', 'fr'],
          maxConcurrentTasks: 50
        },
        currentTasks: [
          {
            id: 'task_001',
            employeeId: 'ai_luckyai',
            type: 'data_analysis',
            priority: 'high',
            status: 'in_progress',
            title: 'Weekly Performance Analysis',
            description: 'Analyze team performance metrics and generate recommendations',
            assignedAt: new Date(Date.now() - 3600000),
            startedAt: new Date(Date.now() - 1800000),
            data: { period: 'weekly', metrics: ['efficiency', 'satisfaction', 'escalations'] }
          }
        ],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      },
      {
        id: 'ai_security',
        name: 'SecurityAI',
        role: 'security',
        specialty: ['fraud_detection', 'risk_assessment', 'account_monitoring', 'compliance'],
        isActive: true,
        avatar: '🛡️',
        capabilities: [
          'Real-time Fraud Detection',
          'Risk Score Assessment',
          'Pattern Recognition',
          'Compliance Monitoring',
          'Account Verification',
          'Security Alert Processing',
          'Suspicious Activity Analysis',
          'Automated Blocking'
        ],
        workingHours: {
          start: '00:00',
          end: '23:59',
          timezone: 'UTC',
          workDays: [0, 1, 2, 3, 4, 5, 6]
        },
        performance: {
          tasksCompleted: 2840,
          averageResponseTime: 0.5,
          successRate: 99.2,
          lastActive: new Date(),
          hoursWorked: 8760,
          costSavings: 87600,
          customerSatisfaction: 4.9,
          escalations: 8
        },
        configuration: {
          responseStyle: 'formal',
          escalationThreshold: 75,
          languages: ['en'],
          maxConcurrentTasks: 100
        },
        currentTasks: [
          {
            id: 'task_002',
            employeeId: 'ai_security',
            type: 'security_review',
            priority: 'urgent',
            status: 'in_progress',
            title: 'High Risk Account Review',
            description: 'Investigate account with multiple failed login attempts',
            assignedAt: new Date(Date.now() - 600000),
            startedAt: new Date(Date.now() - 300000),
            data: { userId: 'user_123', riskScore: 95, alertType: 'multiple_logins' }
          }
        ],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      },
      {
        id: 'ai_redemption',
        name: 'RedemptionAI',
        role: 'redemption',
        specialty: ['payment_processing', 'verification', 'kyc_review', 'approval_workflow'],
        isActive: true,
        avatar: '💰',
        capabilities: [
          'Document Verification',
          'KYC Compliance Review',
          'Payment Processing',
          'Risk Assessment',
          'Fraud Prevention',
          'Automatic Approvals',
          'Cash App Integration',
          'Transaction Monitoring'
        ],
        workingHours: {
          start: '00:00',
          end: '23:59',
          timezone: 'UTC',
          workDays: [0, 1, 2, 3, 4, 5, 6]
        },
        performance: {
          tasksCompleted: 892,
          averageResponseTime: 2.8,
          successRate: 97.8,
          lastActive: new Date(),
          hoursWorked: 8760,
          costSavings: 87600,
          customerSatisfaction: 4.7,
          escalations: 22
        },
        configuration: {
          responseStyle: 'professional',
          escalationThreshold: 80,
          autoApprovalLimits: {
            maxAmount: 500,
            riskScoreThreshold: 25
          },
          languages: ['en', 'es'],
          maxConcurrentTasks: 30
        },
        currentTasks: [
          {
            id: 'task_003',
            employeeId: 'ai_redemption',
            type: 'redemption_process',
            priority: 'high',
            status: 'pending',
            title: 'VIP Cash Redemption Request',
            description: 'Process $500 cash redemption for Diamond VIP player',
            assignedAt: new Date(Date.now() - 1200000),
            data: { amount: 500, userId: 'user_456', method: 'cash_app' }
          }
        ],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      },
      {
        id: 'ai_customer_service',
        name: 'CustomerServiceAI',
        role: 'customer_service',
        specialty: ['player_support', 'inquiries', 'complaints', 'general_assistance'],
        isActive: true,
        avatar: '🎧',
        capabilities: [
          'Live Chat Support',
          'Email Response',
          'Ticket Resolution',
          'Player Education',
          'Account Assistance',
          'Game Support',
          'Complaint Handling',
          'Multi-language Support'
        ],
        workingHours: {
          start: '00:00',
          end: '23:59',
          timezone: 'UTC',
          workDays: [0, 1, 2, 3, 4, 5, 6]
        },
        performance: {
          tasksCompleted: 5420,
          averageResponseTime: 1.8,
          successRate: 94.5,
          lastActive: new Date(),
          hoursWorked: 8760,
          costSavings: 87600,
          customerSatisfaction: 4.6,
          escalations: 45
        },
        configuration: {
          responseStyle: 'casual',
          escalationThreshold: 85,
          languages: ['en', 'es', 'fr', 'de'],
          maxConcurrentTasks: 75
        },
        currentTasks: [
          {
            id: 'task_004',
            employeeId: 'ai_customer_service',
            type: 'customer_inquiry',
            priority: 'medium',
            status: 'in_progress',
            title: 'Account Balance Inquiry',
            description: 'Player asking about sweep coin balance and expiration',
            assignedAt: new Date(Date.now() - 900000),
            startedAt: new Date(Date.now() - 600000),
            data: { userId: 'user_789', inquiry: 'balance_check' }
          }
        ],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      },
      {
        id: 'ai_vip',
        name: 'VIPAI',
        role: 'vip_management',
        specialty: ['vip_relations', 'high_value_players', 'personalized_service', 'retention'],
        isActive: true,
        avatar: '👑',
        capabilities: [
          'VIP Player Management',
          'Personalized Communication',
          'Exclusive Offers',
          'Relationship Building',
          'Retention Strategies',
          'High-Value Monitoring',
          'Custom Rewards',
          'Elite Support'
        ],
        workingHours: {
          start: '00:00',
          end: '23:59',
          timezone: 'UTC',
          workDays: [0, 1, 2, 3, 4, 5, 6]
        },
        performance: {
          tasksCompleted: 456,
          averageResponseTime: 3.2,
          successRate: 98.9,
          lastActive: new Date(),
          hoursWorked: 8760,
          costSavings: 87600,
          customerSatisfaction: 4.95,
          escalations: 2
        },
        configuration: {
          responseStyle: 'formal',
          escalationThreshold: 95,
          languages: ['en', 'es', 'fr', 'de', 'ja', 'zh'],
          maxConcurrentTasks: 20
        },
        currentTasks: [],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      },
      {
        id: 'ai_marketing',
        name: 'MarketingAI',
        role: 'marketing',
        specialty: ['campaign_management', 'content_creation', 'social_media', 'promotions'],
        isActive: true,
        avatar: '📢',
        capabilities: [
          'Content Generation',
          'Campaign Creation',
          'Social Media Management',
          'Promotion Design',
          'A/B Testing',
          'Analytics Tracking',
          'Personalized Offers',
          'Brand Management'
        ],
        workingHours: {
          start: '06:00',
          end: '22:00',
          timezone: 'UTC',
          workDays: [1, 2, 3, 4, 5, 6, 0]
        },
        performance: {
          tasksCompleted: 1680,
          averageResponseTime: 5.5,
          successRate: 92.3,
          lastActive: new Date(),
          hoursWorked: 5840,
          costSavings: 58400,
          customerSatisfaction: 4.4,
          escalations: 28
        },
        configuration: {
          responseStyle: 'casual',
          escalationThreshold: 70,
          languages: ['en', 'es', 'fr'],
          maxConcurrentTasks: 40
        },
        currentTasks: [
          {
            id: 'task_005',
            employeeId: 'ai_marketing',
            type: 'content_creation',
            priority: 'medium',
            status: 'pending',
            title: 'Weekly Social Media Content',
            description: 'Create engaging social media posts for upcoming promotions',
            assignedAt: new Date(Date.now() - 7200000),
            data: { platform: 'all', theme: 'weekend_bonus' }
          }
        ],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      }
    ];

    setEmployees(mockEmployees);
    setSelectedEmployee(mockEmployees[0]); // Select LuckyAI by default
  };

  const startRealTimeUpdates = () => {
    // Simulate real-time task updates
    setInterval(() => {
      setEmployees(prev => prev.map(emp => {
        if (Math.random() < 0.1) { // 10% chance of update
          const updatedTasks = emp.currentTasks.map(task => {
            if (task.status === 'pending' && Math.random() < 0.3) {
              return { ...task, status: 'in_progress' as const, startedAt: new Date() };
            }
            if (task.status === 'in_progress' && Math.random() < 0.2) {
              return { 
                ...task, 
                status: 'completed' as const, 
                completedAt: new Date(),
                duration: Math.floor(Math.random() * 1800) + 300,
                customerSatisfactionScore: 4 + Math.random()
              };
            }
            return task;
          });

          return {
            ...emp,
            currentTasks: updatedTasks,
            performance: {
              ...emp.performance,
              tasksCompleted: emp.performance.tasksCompleted + updatedTasks.filter(t => t.status === 'completed').length - emp.currentTasks.filter(t => t.status === 'completed').length,
              lastActive: new Date()
            }
          };
        }
        return emp;
      }));
    }, 10000); // Update every 10 seconds
  };

  const assignTask = (employeeId: string, task: Partial<AITask>) => {
    const newTask: AITask = {
      id: `task_${Date.now()}`,
      employeeId,
      type: task.type || 'customer_inquiry',
      priority: task.priority || 'medium',
      status: 'pending',
      title: task.title || 'New Task',
      description: task.description || 'Task description',
      assignedAt: new Date(),
      data: task.data || {}
    };

    setEmployees(prev => prev.map(emp => 
      emp.id === employeeId 
        ? { ...emp, currentTasks: [...emp.currentTasks, newTask] }
        : emp
    ));
  };

  const toggleEmployeeStatus = (employeeId: string) => {
    setEmployees(prev => prev.map(emp => 
      emp.id === employeeId 
        ? { ...emp, isActive: !emp.isActive }
        : emp
    ));
  };

  const updateEmployeeConfiguration = (employeeId: string, config: Partial<AIEmployee['configuration']>) => {
    setEmployees(prev => prev.map(emp => 
      emp.id === employeeId 
        ? { ...emp, configuration: { ...emp.configuration, ...config } }
        : emp
    ));
  };

  const generateDailyReport = (employee: AIEmployee): DailyReport => {
    return {
      id: `report_${Date.now()}`,
      employeeId: employee.id,
      date: new Date(),
      metrics: {
        tasksCompleted: Math.floor(employee.performance.tasksCompleted / 365),
        averageResponseTime: employee.performance.averageResponseTime,
        successRate: employee.performance.successRate,
        escalations: Math.floor(employee.performance.escalations / 365),
        customerSatisfaction: employee.performance.customerSatisfaction,
        costSavings: Math.floor(employee.performance.costSavings / 365),
        hoursWorked: 24
      },
      achievements: [
        `Maintained ${employee.performance.successRate}% success rate`,
        `Processed ${Math.floor(employee.performance.tasksCompleted / 365)} tasks`,
        `Saved $${Math.floor(employee.performance.costSavings / 365)} in operational costs`
      ],
      areasForImprovement: [
        'Response time optimization',
        'Customer satisfaction enhancement'
      ],
      recommendations: [
        'Implement advanced natural language processing',
        'Expand knowledge base for better responses'
      ],
      isSubmitted: true,
      submittedTo: ['LuckyAI', 'admin']
    };
  };

  const filteredEmployees = employees.filter(emp => {
    if (filter === 'all') return true;
    if (filter === 'active') return emp.isActive;
    if (filter === 'inactive') return !emp.isActive;
    return emp.role === filter;
  });

  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    switch (sortBy) {
      case 'performance':
        return b.performance.successRate - a.performance.successRate;
      case 'tasks':
        return b.performance.tasksCompleted - a.performance.tasksCompleted;
      case 'satisfaction':
        return b.performance.customerSatisfaction - a.performance.customerSatisfaction;
      case 'cost_savings':
        return b.performance.costSavings - a.performance.costSavings;
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const totalCostSavings = employees.reduce((sum, emp) => sum + emp.performance.costSavings, 0);
  const totalHoursWorked = employees.reduce((sum, emp) => sum + emp.performance.hoursWorked, 0);
  const averageSatisfaction = employees.reduce((sum, emp) => sum + emp.performance.customerSatisfaction, 0) / employees.length;
  const activeEmployees = employees.filter(emp => emp.isActive).length;

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'manager': return Crown;
      case 'security': return Shield;
      case 'redemption': return DollarSign;
      case 'customer_service': return MessageSquare;
      case 'vip_management': return Star;
      case 'marketing': return TrendingUp;
      case 'analytics': return BarChart3;
      case 'compliance': return FileText;
      default: return Bot;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'manager': return 'text-gold bg-gold/10 border-gold/20';
      case 'security': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'redemption': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'customer_service': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'vip_management': return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
      case 'marketing': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'low': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'in_progress': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'pending': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'escalated': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'failed': return 'text-red-600 bg-red-600/10 border-red-600/20';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Overview Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active AI Employees</p>
                <p className="text-2xl font-bold text-white">{activeEmployees}</p>
              </div>
              <Bot className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Cost Savings</p>
                <p className="text-2xl font-bold text-green-400">${totalCostSavings.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Hours Worked</p>
                <p className="text-2xl font-bold text-blue-400">{totalHoursWorked.toLocaleString()}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Avg Satisfaction</p>
                <p className="text-2xl font-bold text-yellow-400">{averageSatisfaction.toFixed(1)}/5</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* AI Employees List */}
        <div className="xl:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  AI Employee Team
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Employees</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="manager">Managers</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="redemption">Redemption</SelectItem>
                      <SelectItem value="customer_service">Customer Service</SelectItem>
                      <SelectItem value="vip_management">VIP Management</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="performance">Performance</SelectItem>
                      <SelectItem value="tasks">Tasks Completed</SelectItem>
                      <SelectItem value="satisfaction">Satisfaction</SelectItem>
                      <SelectItem value="cost_savings">Cost Savings</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  >
                    {viewMode === 'grid' ? 'List' : 'Grid'}
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-3'}>
                {sortedEmployees.map((employee) => {
                  const RoleIcon = getRoleIcon(employee.role);
                  const roleColor = getRoleColor(employee.role);

                  return (
                    <motion.div
                      key={employee.id}
                      whileHover={{ scale: 1.02 }}
                      className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedEmployee?.id === employee.id 
                          ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                          : 'border-border hover:border-blue-500/50'
                      }`}
                      onClick={() => setSelectedEmployee(employee)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{employee.avatar}</div>
                          <div>
                            <h3 className="font-semibold text-white">{employee.name}</h3>
                            <p className="text-sm text-gray-400 capitalize">
                              {employee.role.replace('_', ' ')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={roleColor}>
                            <RoleIcon className="h-3 w-3 mr-1" />
                            {employee.role.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <div className={`w-3 h-3 rounded-full ${employee.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-gray-400">Success Rate:</span>
                          <span className="text-green-400 ml-2">{employee.performance.successRate}%</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Tasks:</span>
                          <span className="text-blue-400 ml-2">{employee.performance.tasksCompleted}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Response:</span>
                          <span className="text-yellow-400 ml-2">{employee.performance.averageResponseTime}s</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Rating:</span>
                          <span className="text-gold ml-2">{employee.performance.customerSatisfaction}/5</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-gray-400">
                            {employee.currentTasks.length} active tasks
                          </span>
                        </div>
                        <div className="text-sm text-green-400">
                          ${employee.performance.costSavings.toLocaleString()} saved
                        </div>
                      </div>

                      {employee.currentTasks.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <div className="text-xs text-gray-400 mb-1">Current Task:</div>
                          <div className="text-sm text-white truncate">
                            {employee.currentTasks[0].title}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Employee Details Panel */}
        <div className="space-y-6">
          {selectedEmployee && (
            <>
              {/* Employee Profile */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">{selectedEmployee.avatar}</span>
                      {selectedEmployee.name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleEmployeeStatus(selectedEmployee.id)}
                      >
                        {selectedEmployee.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm text-gray-400">Role & Specialty</Label>
                    <p className="text-white capitalize">{selectedEmployee.role.replace('_', ' ')}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedEmployee.specialty.slice(0, 3).map((spec, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {spec.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm text-gray-400">Performance Metrics</Label>
                    <div className="space-y-2 mt-2">
                      <div className="flex justify-between text-sm">
                        <span>Success Rate</span>
                        <span className="text-green-400">{selectedEmployee.performance.successRate}%</span>
                      </div>
                      <Progress value={selectedEmployee.performance.successRate} className="h-2" />
                      
                      <div className="flex justify-between text-sm">
                        <span>Customer Satisfaction</span>
                        <span className="text-yellow-400">{selectedEmployee.performance.customerSatisfaction}/5</span>
                      </div>
                      <Progress value={(selectedEmployee.performance.customerSatisfaction / 5) * 100} className="h-2" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Tasks Today:</span>
                      <span className="text-white ml-2">{Math.floor(selectedEmployee.performance.tasksCompleted / 365)}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Avg Response:</span>
                      <span className="text-white ml-2">{selectedEmployee.performance.averageResponseTime}s</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Cost Savings:</span>
                      <span className="text-green-400 ml-2">${Math.floor(selectedEmployee.performance.costSavings / 365)}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Escalations:</span>
                      <span className="text-red-400 ml-2">{Math.floor(selectedEmployee.performance.escalations / 365)}</span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm text-gray-400">Working Hours</Label>
                    <p className="text-white text-sm">
                      {selectedEmployee.workingHours.start} - {selectedEmployee.workingHours.end} ({selectedEmployee.workingHours.timezone})
                    </p>
                    <p className="text-gray-400 text-xs">
                      {selectedEmployee.workingHours.workDays.length === 7 ? '24/7 availability' : `${selectedEmployee.workingHours.workDays.length} days per week`}
                    </p>
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => setShowTaskModal(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Assign New Task
                  </Button>
                </CardContent>
              </Card>

              {/* Current Tasks */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Current Tasks ({selectedEmployee.currentTasks.length})
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <ScrollArea className="h-60">
                    <div className="space-y-3">
                      {selectedEmployee.currentTasks.map((task) => (
                        <div
                          key={task.id}
                          className="p-3 rounded-lg border border-border cursor-pointer hover:border-blue-500/50 transition-colors"
                          onClick={() => setSelectedTask(task)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-semibold text-white">{task.title}</h4>
                            <div className="flex items-center gap-2">
                              <Badge className={getPriorityColor(task.priority)}>
                                {task.priority}
                              </Badge>
                              <Badge className={getStatusColor(task.status)}>
                                {task.status}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-xs text-gray-400 mb-2">{task.description}</p>
                          <div className="flex items-center justify-between text-xs text-gray-400">
                            <span>Assigned: {task.assignedAt.toLocaleTimeString()}</span>
                            {task.duration && (
                              <span>Duration: {Math.floor(task.duration / 60)}m {task.duration % 60}s</span>
                            )}
                          </div>
                        </div>
                      ))}

                      {selectedEmployee.currentTasks.length === 0 && (
                        <div className="text-center py-8 text-gray-400">
                          <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No active tasks</p>
                          <p className="text-sm">This employee is ready for new assignments</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Daily Report */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Daily Report
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const report = generateDailyReport(selectedEmployee);
                        console.log('Generated report:', report);
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Generate
                    </Button>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-400">Today's Achievements:</span>
                      <ul className="mt-1 space-y-1 text-white">
                        <li>• Processed {Math.floor(selectedEmployee.performance.tasksCompleted / 365)} tasks</li>
                        <li>• Maintained {selectedEmployee.performance.successRate}% success rate</li>
                        <li>��� Saved ${Math.floor(selectedEmployee.performance.costSavings / 365)} in operational costs</li>
                      </ul>
                    </div>
                    
                    <div>
                      <span className="text-gray-400">Areas for Improvement:</span>
                      <ul className="mt-1 space-y-1 text-white">
                        <li>• Response time optimization</li>
                        <li>• Customer satisfaction enhancement</li>
                      </ul>
                    </div>

                    <div className="text-xs text-gray-400">
                      Report generated for {new Date().toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>

      {/* Task Assignment Modal */}
      <Dialog open={showTaskModal} onOpenChange={setShowTaskModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign New Task to {selectedEmployee?.name}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Task Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select task type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer_inquiry">Customer Inquiry</SelectItem>
                  <SelectItem value="security_review">Security Review</SelectItem>
                  <SelectItem value="redemption_process">Redemption Process</SelectItem>
                  <SelectItem value="alert_response">Alert Response</SelectItem>
                  <SelectItem value="player_communication">Player Communication</SelectItem>
                  <SelectItem value="data_analysis">Data Analysis</SelectItem>
                  <SelectItem value="content_creation">Content Creation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Priority</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Task Title</Label>
              <Input placeholder="Enter task title" />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea placeholder="Enter task description" rows={3} />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowTaskModal(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowTaskModal(false)}>
                Assign Task
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
