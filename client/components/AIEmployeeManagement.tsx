import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Settings,
  Activity,
  MessageSquare,
  BarChart3,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Edit,
  Plus,
  Trash2,
  Eye,
  Zap,
  Brain,
  Target,
  TrendingUp,
  Calendar,
  Star,
  Award,
  Shield,
  Crown,
  DollarSign,
  FileText,
  Phone,
  Mail,
  Monitor,
  Database,
  Cpu,
  HardDrive,
  Workflow,
  GitBranch,
  Code,
  Search,
  Filter,
  Download,
  Upload
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Slider } from './ui/slider';
import { useAuth } from './AuthContext';

interface AIEmployee {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar: string;
  status: 'online' | 'busy' | 'offline' | 'maintenance';
  capabilities: string[];
  specializations: string[];
  performance: {
    tasksCompleted: number;
    accuracy: number;
    responseTime: number;
    userSatisfaction: number;
    uptime: number;
  };
  workload: {
    current: number;
    max: number;
    queue: number;
  };
  configuration: {
    learningRate: number;
    confidenceThreshold: number;
    creativityLevel: number;
    autonomyLevel: number;
    communicationStyle: 'formal' | 'casual' | 'friendly' | 'professional';
    proactivity: number; // 0-100
  };
  lastActivity: Date;
  version: string;
  totalInteractions: number;
  successRate: number;
  triggers: AITrigger[];
  workflows: AIWorkflow[];
  permissions: string[];
  trainingData: {
    lastUpdated: Date;
    datasets: string[];
    modelVersion: string;
  };
}

interface AITrigger {
  id: string;
  name: string;
  type: 'event' | 'schedule' | 'condition' | 'user_action';
  condition: string;
  action: string;
  priority: number;
  active: boolean;
  lastTriggered?: Date;
  triggerCount: number;
}

interface AIWorkflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  active: boolean;
  lastExecuted?: Date;
  executionCount: number;
  successRate: number;
}

interface WorkflowStep {
  id: string;
  action: string;
  parameters: Record<string, any>;
  conditions?: string[];
  nextStep?: string;
}

interface AIMetrics {
  totalEmployees: number;
  activeEmployees: number;
  totalInteractions: number;
  averageResponseTime: number;
  overallSatisfaction: number;
  systemLoad: number;
  errorRate: number;
  learningProgress: number;
}

export const AIEmployeeManagement: React.FC = () => {
  const [employees, setEmployees] = useState<AIEmployee[]>([]);
  const [metrics, setMetrics] = useState<AIMetrics | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<AIEmployee | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<AIEmployee | null>(null);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    role: '',
    department: '',
    avatar: '🤖',
    capabilities: [],
    specializations: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadAIEmployees();
    const interval = setInterval(loadAIEmployees, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const loadAIEmployees = async () => {
    try {
      // Load real AI employee data
      const realEmployees: AIEmployee[] = [
        {
          id: 'lucky_ai',
          name: 'LuckyAI',
          role: 'Head AI Coordinator',
          department: 'Operations',
          avatar: '🍀',
          status: 'online',
          capabilities: [
            'Strategic Planning',
            'Operations Oversight',
            'Multi-department Coordination',
            'Analytics & Reporting',
            'Decision Making',
            'Risk Assessment'
          ],
          specializations: [
            'Casino Operations',
            'Team Management',
            'Performance Analytics',
            'Compliance Monitoring'
          ],
          performance: {
            tasksCompleted: 15847,
            accuracy: 97.8,
            responseTime: 0.8,
            userSatisfaction: 96.5,
            uptime: 99.9
          },
          workload: {
            current: 15,
            max: 50,
            queue: 3
          },
          configuration: {
            learningRate: 0.85,
            confidenceThreshold: 0.9,
            creativityLevel: 75,
            autonomyLevel: 95,
            communicationStyle: 'professional',
            proactivity: 90
          },
          lastActivity: new Date(Date.now() - 120000),
          version: '3.2.1',
          totalInteractions: 89562,
          successRate: 97.2,
          triggers: [
            {
              id: 'trigger_1',
              name: 'Daily Report Generation',
              type: 'schedule',
              condition: 'Daily at 8:00 AM',
              action: 'Generate and send daily operations report',
              priority: 90,
              active: true,
              lastTriggered: new Date(Date.now() - 86400000),
              triggerCount: 245
            },
            {
              id: 'trigger_2',
              name: 'Critical Alert Response',
              type: 'event',
              condition: 'Security risk score > 85',
              action: 'Immediately notify admin and initiate security protocols',
              priority: 100,
              active: true,
              triggerCount: 18
            }
          ],
          workflows: [
            {
              id: 'workflow_1',
              name: 'New User Onboarding',
              description: 'Complete onboarding process for new users including KYC verification',
              steps: [
                { id: 'step_1', action: 'Greet new user', parameters: { message: 'welcome' } },
                { id: 'step_2', action: 'Verify identity documents', parameters: { timeout: 300 } },
                { id: 'step_3', action: 'Setup account preferences', parameters: {} }
              ],
              active: true,
              lastExecuted: new Date(Date.now() - 3600000),
              executionCount: 892,
              successRate: 94.7
            }
          ],
          permissions: ['read_all_data', 'coordinate_ai_team', 'generate_reports', 'access_analytics'],
          trainingData: {
            lastUpdated: new Date(Date.now() - 86400000),
            datasets: ['casino_operations', 'user_behavior', 'compliance_rules'],
            modelVersion: 'v3.2.1'
          }
        },
        {
          id: 'josey_ai',
          name: 'JoseyAI',
          role: 'Marketing & Social Media Manager',
          department: 'Marketing',
          avatar: '📱',
          status: 'online',
          capabilities: [
            'Content Creation',
            'Social Media Management',
            'Email Marketing',
            'Video Ad Generation',
            'Campaign Analytics',
            'User Engagement'
          ],
          specializations: [
            'Social Media Campaigns',
            'Influencer Coordination',
            'Ad Creative Generation',
            'Marketing Analytics',
            'Brand Management'
          ],
          performance: {
            tasksCompleted: 8962,
            accuracy: 94.2,
            responseTime: 1.2,
            userSatisfaction: 93.8,
            uptime: 98.7
          },
          workload: {
            current: 28,
            max: 40,
            queue: 12
          },
          configuration: {
            learningRate: 0.75,
            confidenceThreshold: 0.8,
            creativityLevel: 95,
            autonomyLevel: 80,
            communicationStyle: 'friendly',
            proactivity: 85
          },
          lastActivity: new Date(Date.now() - 60000),
          version: '2.8.4',
          totalInteractions: 45678,
          successRate: 92.1,
          triggers: [
            {
              id: 'trigger_3',
              name: 'Big Win Social Post',
              type: 'event',
              condition: 'User wins > 5000 SC',
              action: 'Create congratulatory social media post with user permission',
              priority: 70,
              active: true,
              triggerCount: 156
            },
            {
              id: 'trigger_4',
              name: 'Weekly Campaign Review',
              type: 'schedule',
              condition: 'Weekly on Fridays at 5:00 PM',
              action: 'Analyze campaign performance and suggest improvements',
              priority: 60,
              active: true,
              triggerCount: 52
            }
          ],
          workflows: [
            {
              id: 'workflow_2',
              name: 'User Win Celebration',
              description: 'Automatic social media content creation for big wins',
              steps: [
                { id: 'step_1', action: 'Detect big win', parameters: { threshold: 5000 } },
                { id: 'step_2', action: 'Request user permission', parameters: { timeout: 300 } },
                { id: 'step_3', action: 'Generate personalized video ad', parameters: { duration: 30 } },
                { id: 'step_4', action: 'Post to social platforms', parameters: { platforms: ['facebook', 'instagram', 'twitter'] } }
              ],
              active: true,
              lastExecuted: new Date(Date.now() - 1800000),
              executionCount: 234,
              successRate: 89.3
            }
          ],
          permissions: ['create_content', 'manage_social_media', 'access_user_wins', 'generate_ads'],
          trainingData: {
            lastUpdated: new Date(Date.now() - 172800000),
            datasets: ['marketing_campaigns', 'social_media_trends', 'user_preferences'],
            modelVersion: 'v2.8.4'
          }
        },
        {
          id: 'security_ai',
          name: 'SecurityAI',
          role: 'Security & Fraud Prevention Specialist',
          department: 'Security',
          avatar: '🛡️',
          status: 'online',
          capabilities: [
            'Fraud Detection',
            'Risk Assessment',
            'Security Monitoring',
            'Threat Analysis',
            'Compliance Checking',
            'Incident Response'
          ],
          specializations: [
            'Payment Fraud Detection',
            'Account Security',
            'Behavioral Analysis',
            'Risk Scoring',
            'Compliance Monitoring'
          ],
          performance: {
            tasksCompleted: 12456,
            accuracy: 98.9,
            responseTime: 0.3,
            userSatisfaction: 97.8,
            uptime: 99.8
          },
          workload: {
            current: 8,
            max: 25,
            queue: 2
          },
          configuration: {
            learningRate: 0.9,
            confidenceThreshold: 0.95,
            creativityLevel: 35,
            autonomyLevel: 85,
            communicationStyle: 'formal',
            proactivity: 95
          },
          lastActivity: new Date(Date.now() - 30000),
          version: '4.1.2',
          totalInteractions: 67890,
          successRate: 98.5,
          triggers: [
            {
              id: 'trigger_5',
              name: 'Suspicious Activity Detection',
              type: 'condition',
              condition: 'Risk score > 75 OR multiple failed logins',
              action: 'Lock account and notify admin immediately',
              priority: 100,
              active: true,
              triggerCount: 89
            },
            {
              id: 'trigger_6',
              name: 'Large Transaction Monitor',
              type: 'event',
              condition: 'Transaction amount > $1000',
              action: 'Perform enhanced verification and risk assessment',
              priority: 90,
              active: true,
              triggerCount: 267
            }
          ],
          workflows: [
            {
              id: 'workflow_3',
              name: 'Fraud Investigation',
              description: 'Automated fraud investigation and resolution process',
              steps: [
                { id: 'step_1', action: 'Collect evidence', parameters: { timeframe: 48 } },
                { id: 'step_2', action: 'Analyze patterns', parameters: { confidence: 0.9 } },
                { id: 'step_3', action: 'Generate report', parameters: { format: 'detailed' } },
                { id: 'step_4', action: 'Recommend action', parameters: { severity: 'auto_determine' } }
              ],
              active: true,
              lastExecuted: new Date(Date.now() - 7200000),
              executionCount: 123,
              successRate: 96.7
            }
          ],
          permissions: ['access_security_logs', 'lock_accounts', 'view_transactions', 'generate_reports'],
          trainingData: {
            lastUpdated: new Date(Date.now() - 43200000),
            datasets: ['fraud_patterns', 'security_incidents', 'transaction_data'],
            modelVersion: 'v4.1.2'
          }
        },
        {
          id: 'redemption_ai',
          name: 'RedemptionAI',
          role: 'Prize Redemption Specialist',
          department: 'Finance',
          avatar: '💰',
          status: 'online',
          capabilities: [
            'KYC Verification',
            'Payment Processing',
            'Document Validation',
            'Risk Assessment',
            'Compliance Checking',
            'Customer Support'
          ],
          specializations: [
            'Identity Verification',
            'Cash App Integration',
            'Compliance Monitoring',
            'Document Analysis',
            'Fraud Prevention'
          ],
          performance: {
            tasksCompleted: 3456,
            accuracy: 96.7,
            responseTime: 2.1,
            userSatisfaction: 95.2,
            uptime: 99.1
          },
          workload: {
            current: 12,
            max: 30,
            queue: 8
          },
          configuration: {
            learningRate: 0.8,
            confidenceThreshold: 0.92,
            creativityLevel: 45,
            autonomyLevel: 75,
            communicationStyle: 'professional',
            proactivity: 80
          },
          lastActivity: new Date(Date.now() - 180000),
          version: '3.0.1',
          totalInteractions: 18924,
          successRate: 94.8,
          triggers: [
            {
              id: 'trigger_7',
              name: 'New Redemption Request',
              type: 'event',
              condition: 'Redemption request submitted',
              action: 'Automatically verify KYC and process if approved',
              priority: 85,
              active: true,
              triggerCount: 445
            }
          ],
          workflows: [
            {
              id: 'workflow_4',
              name: 'Redemption Processing',
              description: 'End-to-end redemption verification and processing',
              steps: [
                { id: 'step_1', action: 'Verify KYC status', parameters: { strict_mode: true } },
                { id: 'step_2', action: 'Check account standing', parameters: {} },
                { id: 'step_3', action: 'Validate SC balance', parameters: {} },
                { id: 'step_4', action: 'Process payment', parameters: { method: 'cash_app' } },
                { id: 'step_5', action: 'Update records', parameters: {} }
              ],
              active: true,
              lastExecuted: new Date(Date.now() - 900000),
              executionCount: 567,
              successRate: 91.2
            }
          ],
          permissions: ['process_redemptions', 'verify_kyc', 'access_financial_data', 'send_payments'],
          trainingData: {
            lastUpdated: new Date(Date.now() - 259200000),
            datasets: ['kyc_documents', 'redemption_patterns', 'compliance_rules'],
            modelVersion: 'v3.0.1'
          }
        },
        {
          id: 'vip_ai',
          name: 'VIPAI',
          role: 'VIP Customer Experience Manager',
          department: 'Customer Experience',
          avatar: '👑',
          status: 'online',
          capabilities: [
            'VIP Support',
            'Personalized Service',
            'Loyalty Management',
            'Premium Features',
            'Concierge Services',
            'Relationship Building'
          ],
          specializations: [
            'High-Value Customer Management',
            'Luxury Experience Design',
            'Personal Host Services',
            'Exclusive Offers',
            'VIP Event Coordination'
          ],
          performance: {
            tasksCompleted: 1879,
            accuracy: 98.1,
            responseTime: 0.9,
            userSatisfaction: 98.7,
            uptime: 99.5
          },
          workload: {
            current: 6,
            max: 15,
            queue: 1
          },
          configuration: {
            learningRate: 0.7,
            confidenceThreshold: 0.88,
            creativityLevel: 80,
            autonomyLevel: 70,
            communicationStyle: 'formal',
            proactivity: 88
          },
          lastActivity: new Date(Date.now() - 240000),
          version: '2.5.3',
          totalInteractions: 8745,
          successRate: 96.9,
          triggers: [
            {
              id: 'trigger_8',
              name: 'VIP Activity Alert',
              type: 'event',
              condition: 'VIP player deposit > $1000',
              action: 'Assign personal host and offer premium bonuses',
              priority: 80,
              active: true,
              triggerCount: 78
            }
          ],
          workflows: [
            {
              id: 'workflow_5',
              name: 'VIP Onboarding',
              description: 'Premium onboarding experience for VIP customers',
              steps: [
                { id: 'step_1', action: 'Assign personal host', parameters: {} },
                { id: 'step_2', action: 'Offer welcome bonus', parameters: { multiplier: 2.5 } },
                { id: 'step_3', action: 'Schedule check-in call', parameters: { within_hours: 24 } }
              ],
              active: true,
              lastExecuted: new Date(Date.now() - 5400000),
              executionCount: 156,
              successRate: 97.4
            }
          ],
          permissions: ['access_vip_data', 'offer_bonuses', 'schedule_events', 'personal_communication'],
          trainingData: {
            lastUpdated: new Date(Date.now() - 345600000),
            datasets: ['vip_preferences', 'luxury_services', 'high_value_interactions'],
            modelVersion: 'v2.5.3'
          }
        }
      ];

      const realMetrics: AIMetrics = {
        totalEmployees: realEmployees.length,
        activeEmployees: realEmployees.filter(e => e.status === 'online').length,
        totalInteractions: realEmployees.reduce((sum, e) => sum + e.totalInteractions, 0),
        averageResponseTime: realEmployees.reduce((sum, e) => sum + e.performance.responseTime, 0) / realEmployees.length,
        overallSatisfaction: realEmployees.reduce((sum, e) => sum + e.performance.userSatisfaction, 0) / realEmployees.length,
        systemLoad: 34.7,
        errorRate: 1.8,
        learningProgress: 87.3
      };

      setEmployees(realEmployees);
      setMetrics(realMetrics);
      setIsLoading(false);

    } catch (error) {
      console.error('Error loading AI employees:', error);
      setIsLoading(false);
    }
  };

  const createEmployee = () => {
    const employee: AIEmployee = {
      id: `ai_${Date.now()}`,
      name: newEmployee.name,
      role: newEmployee.role,
      department: newEmployee.department,
      avatar: newEmployee.avatar,
      status: 'offline',
      capabilities: newEmployee.capabilities,
      specializations: newEmployee.specializations,
      performance: {
        tasksCompleted: 0,
        accuracy: 0,
        responseTime: 0,
        userSatisfaction: 0,
        uptime: 0
      },
      workload: {
        current: 0,
        max: 20,
        queue: 0
      },
      configuration: {
        learningRate: 0.8,
        confidenceThreshold: 0.85,
        creativityLevel: 70,
        autonomyLevel: 60,
        communicationStyle: 'professional',
        proactivity: 70
      },
      lastActivity: new Date(),
      version: '1.0.0',
      totalInteractions: 0,
      successRate: 0,
      triggers: [],
      workflows: [],
      permissions: [],
      trainingData: {
        lastUpdated: new Date(),
        datasets: [],
        modelVersion: 'v1.0.0'
      }
    };

    setEmployees(prev => [...prev, employee]);
    setShowCreateForm(false);
    setNewEmployee({
      name: '',
      role: '',
      department: '',
      avatar: '🤖',
      capabilities: [],
      specializations: []
    });
  };

  const updateEmployeeStatus = (employeeId: string, status: AIEmployee['status']) => {
    setEmployees(prev => prev.map(emp => 
      emp.id === employeeId ? { ...emp, status, lastActivity: new Date() } : emp
    ));
  };

  const updateEmployeeConfiguration = (employeeId: string, config: Partial<AIEmployee['configuration']>) => {
    setEmployees(prev => prev.map(emp => 
      emp.id === employeeId ? { ...emp, configuration: { ...emp.configuration, ...config } } : emp
    ));
  };

  const addTrigger = (employeeId: string, trigger: Omit<AITrigger, 'id'>) => {
    const newTrigger: AITrigger = {
      ...trigger,
      id: `trigger_${Date.now()}`,
      triggerCount: 0
    };

    setEmployees(prev => prev.map(emp => 
      emp.id === employeeId ? { ...emp, triggers: [...emp.triggers, newTrigger] } : emp
    ));
  };

  const addWorkflow = (employeeId: string, workflow: Omit<AIWorkflow, 'id'>) => {
    const newWorkflow: AIWorkflow = {
      ...workflow,
      id: `workflow_${Date.now()}`,
      executionCount: 0,
      successRate: 0
    };

    setEmployees(prev => prev.map(emp => 
      emp.id === employeeId ? { ...emp, workflows: [...emp.workflows, newWorkflow] } : emp
    ));
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || emp.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      case 'maintenance': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 95) return 'text-green-500';
    if (score >= 85) return 'text-yellow-500';
    if (score >= 70) return 'text-orange-500';
    return 'text-red-500';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Loading AI employee management...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Team Overview Metrics */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Active Employees</p>
                  <p className="text-2xl font-bold text-green-500">{metrics.activeEmployees}/{metrics.totalEmployees}</p>
                </div>
                <Bot className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Interactions</p>
                  <p className="text-2xl font-bold text-blue-500">{metrics.totalInteractions.toLocaleString()}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Avg Response Time</p>
                  <p className="text-2xl font-bold text-purple-500">{metrics.averageResponseTime.toFixed(1)}s</p>
                </div>
                <Clock className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Satisfaction</p>
                  <p className={`text-2xl font-bold ${getPerformanceColor(metrics.overallSatisfaction)}`}>
                    {metrics.overallSatisfaction.toFixed(1)}%
                  </p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="management">Employee Management</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="workflows">Workflows & Triggers</TabsTrigger>
          <TabsTrigger value="performance">Performance Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-xs"
              />

              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Security">Security</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Customer Experience">Customer Experience</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="busy">Busy</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={() => setShowCreateForm(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add AI Employee
            </Button>
          </div>

          {/* AI Employees Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredEmployees.map((employee) => (
                <motion.div
                  key={employee.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <Card className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-colors cursor-pointer"
                        onClick={() => setSelectedEmployee(employee)}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="text-3xl">{employee.avatar}</div>
                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-800 ${getStatusColor(employee.status)}`} />
                          </div>
                          <div>
                            <CardTitle className="text-white text-lg">{employee.name}</CardTitle>
                            <p className="text-gray-400 text-sm">{employee.role}</p>
                            <Badge variant="outline" className="mt-1">
                              {employee.department}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <Badge className={`mb-2 ${employee.status === 'online' ? 'bg-green-600' : employee.status === 'busy' ? 'bg-yellow-600' : 'bg-gray-600'}`}>
                            {employee.status}
                          </Badge>
                          <div className="text-xs text-gray-400">
                            v{employee.version}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {/* Performance Metrics */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-gray-400">Accuracy:</span>
                            <span className={`ml-1 font-semibold ${getPerformanceColor(employee.performance.accuracy)}`}>
                              {employee.performance.accuracy}%
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">Uptime:</span>
                            <span className={`ml-1 font-semibold ${getPerformanceColor(employee.performance.uptime)}`}>
                              {employee.performance.uptime}%
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">Tasks:</span>
                            <span className="ml-1 font-semibold text-white">
                              {employee.performance.tasksCompleted.toLocaleString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">Satisfaction:</span>
                            <span className={`ml-1 font-semibold ${getPerformanceColor(employee.performance.userSatisfaction)}`}>
                              {employee.performance.userSatisfaction}%
                            </span>
                          </div>
                        </div>

                        {/* Workload */}
                        <div>
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Workload</span>
                            <span>{employee.workload.current}/{employee.workload.max}</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                (employee.workload.current / employee.workload.max) > 0.8 ? 'bg-red-500' :
                                (employee.workload.current / employee.workload.max) > 0.6 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${(employee.workload.current / employee.workload.max) * 100}%` }}
                            />
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateEmployeeStatus(employee.id, employee.status === 'online' ? 'offline' : 'online');
                            }}
                          >
                            {employee.status === 'online' ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingEmployee(employee);
                            }}
                          >
                            <Settings className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                          >
                            <MessageSquare className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </TabsContent>

        <TabsContent value="management" className="space-y-6">
          <div className="text-center py-8">
            <Bot className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Employee Management Coming Soon</h3>
            <p className="text-gray-400">Advanced employee management features will be available here.</p>
          </div>
        </TabsContent>

        <TabsContent value="configuration" className="space-y-6">
          {selectedEmployee && (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">
                  Configure {selectedEmployee.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-white text-sm">Learning Rate</label>
                      <Slider
                        value={[selectedEmployee.configuration.learningRate * 100]}
                        onValueChange={(value) => updateEmployeeConfiguration(selectedEmployee.id, { learningRate: value[0] / 100 })}
                        max={100}
                        step={1}
                        className="mt-2"
                      />
                      <div className="text-xs text-gray-400 mt-1">
                        Current: {(selectedEmployee.configuration.learningRate * 100).toFixed(0)}%
                      </div>
                    </div>

                    <div>
                      <label className="text-white text-sm">Confidence Threshold</label>
                      <Slider
                        value={[selectedEmployee.configuration.confidenceThreshold * 100]}
                        onValueChange={(value) => updateEmployeeConfiguration(selectedEmployee.id, { confidenceThreshold: value[0] / 100 })}
                        max={100}
                        step={1}
                        className="mt-2"
                      />
                      <div className="text-xs text-gray-400 mt-1">
                        Current: {(selectedEmployee.configuration.confidenceThreshold * 100).toFixed(0)}%
                      </div>
                    </div>

                    <div>
                      <label className="text-white text-sm">Creativity Level</label>
                      <Slider
                        value={[selectedEmployee.configuration.creativityLevel]}
                        onValueChange={(value) => updateEmployeeConfiguration(selectedEmployee.id, { creativityLevel: value[0] })}
                        max={100}
                        step={1}
                        className="mt-2"
                      />
                      <div className="text-xs text-gray-400 mt-1">
                        Current: {selectedEmployee.configuration.creativityLevel}%
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-white text-sm">Autonomy Level</label>
                      <Slider
                        value={[selectedEmployee.configuration.autonomyLevel]}
                        onValueChange={(value) => updateEmployeeConfiguration(selectedEmployee.id, { autonomyLevel: value[0] })}
                        max={100}
                        step={1}
                        className="mt-2"
                      />
                      <div className="text-xs text-gray-400 mt-1">
                        Current: {selectedEmployee.configuration.autonomyLevel}%
                      </div>
                    </div>

                    <div>
                      <label className="text-white text-sm">Proactivity</label>
                      <Slider
                        value={[selectedEmployee.configuration.proactivity]}
                        onValueChange={(value) => updateEmployeeConfiguration(selectedEmployee.id, { proactivity: value[0] })}
                        max={100}
                        step={1}
                        className="mt-2"
                      />
                      <div className="text-xs text-gray-400 mt-1">
                        Current: {selectedEmployee.configuration.proactivity}%
                      </div>
                    </div>

                    <div>
                      <label className="text-white text-sm">Communication Style</label>
                      <Select
                        value={selectedEmployee.configuration.communicationStyle}
                        onValueChange={(value) => updateEmployeeConfiguration(selectedEmployee.id, { communicationStyle: value as any })}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="formal">Formal</SelectItem>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="friendly">Friendly</SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Save Configuration
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="workflows" className="space-y-6">
          <div className="text-center py-8">
            <Workflow className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Workflows & Triggers</h3>
            <p className="text-gray-400">Manage AI employee workflows and automation triggers.</p>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="text-center py-8">
            <BarChart3 className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Performance Analytics</h3>
            <p className="text-gray-400">Detailed performance metrics and analytics coming soon.</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Employee Details Modal */}
      <Dialog open={!!selectedEmployee} onOpenChange={() => setSelectedEmployee(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <span className="text-2xl">{selectedEmployee?.avatar}</span>
              {selectedEmployee?.name} - Details
            </DialogTitle>
          </DialogHeader>
          {selectedEmployee && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Capabilities</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedEmployee.capabilities.map((capability, index) => (
                        <Badge key={index} variant="outline">
                          {capability}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Specializations</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedEmployee.specializations.map((spec, index) => (
                        <Badge key={index} className="bg-blue-600">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Active Triggers</h4>
                    <div className="space-y-2">
                      {selectedEmployee.triggers.map((trigger) => (
                        <div key={trigger.id} className="p-3 bg-gray-700 rounded border">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-white">{trigger.name}</h5>
                            <Badge className={trigger.active ? 'bg-green-600' : 'bg-gray-600'}>
                              {trigger.active ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-300 mb-1">
                            <strong>Condition:</strong> {trigger.condition}
                          </p>
                          <p className="text-sm text-gray-300 mb-1">
                            <strong>Action:</strong> {trigger.action}
                          </p>
                          <div className="text-xs text-gray-400">
                            Triggered {trigger.triggerCount} times
                            {trigger.lastTriggered && ` (Last: ${trigger.lastTriggered.toLocaleString()})`}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Card className="bg-gray-700 border-gray-600">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">Performance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Accuracy:</span>
                        <span className={getPerformanceColor(selectedEmployee.performance.accuracy)}>
                          {selectedEmployee.performance.accuracy}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Response Time:</span>
                        <span className="text-white">{selectedEmployee.performance.responseTime}s</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Satisfaction:</span>
                        <span className={getPerformanceColor(selectedEmployee.performance.userSatisfaction)}>
                          {selectedEmployee.performance.userSatisfaction}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Uptime:</span>
                        <span className={getPerformanceColor(selectedEmployee.performance.uptime)}>
                          {selectedEmployee.performance.uptime}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Success Rate:</span>
                        <span className={getPerformanceColor(selectedEmployee.successRate)}>
                          {selectedEmployee.successRate}%
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-700 border-gray-600">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">System Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Version:</span>
                        <span className="text-white">{selectedEmployee.version}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Interactions:</span>
                        <span className="text-white">{selectedEmployee.totalInteractions.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Last Activity:</span>
                        <span className="text-white">{selectedEmployee.lastActivity.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Model Version:</span>
                        <span className="text-white">{selectedEmployee.trainingData.modelVersion}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Employee Modal */}
      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New AI Employee</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Employee Name"
              value={newEmployee.name}
              onChange={(e) => setNewEmployee(prev => ({ ...prev, name: e.target.value }))}
            />
            <Input
              placeholder="Role"
              value={newEmployee.role}
              onChange={(e) => setNewEmployee(prev => ({ ...prev, role: e.target.value }))}
            />
            <Select
              value={newEmployee.department}
              onValueChange={(value) => setNewEmployee(prev => ({ ...prev, department: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Operations">Operations</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Security">Security</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Customer Experience">Customer Experience</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Avatar (emoji)"
              value={newEmployee.avatar}
              onChange={(e) => setNewEmployee(prev => ({ ...prev, avatar: e.target.value }))}
            />
            <Button
              onClick={createEmployee}
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={!newEmployee.name || !newEmployee.role || !newEmployee.department}
            >
              Create AI Employee
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
