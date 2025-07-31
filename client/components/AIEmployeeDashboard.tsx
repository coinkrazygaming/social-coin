import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import { 
  Bot, 
  Shield, 
  Target, 
  DollarSign, 
  Users, 
  Settings,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  Brain,
  Eye,
  Lock,
  Send,
  Plus,
  Edit,
  Trash2,
  RefreshCw
} from "lucide-react";
import { useAuth } from "./AuthContext";

interface AIEmployee {
  id: string;
  name: string;
  role: string;
  department: 'security' | 'mini_games' | 'sportsbook' | 'finance' | 'customer_service' | 'management';
  status: 'online' | 'offline' | 'busy' | 'maintenance';
  avatar: string;
  description: string;
  capabilities: string[];
  permissions: string[];
  lastActivity: Date;
  tasksCompleted: number;
  alertsGenerated: number;
  successRate: number;
  settings: Record<string, any>;
}

interface AIAlert {
  id: string;
  employeeId: string;
  type: 'security' | 'performance' | 'anomaly' | 'recommendation' | 'critical';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  data: any;
  actionRequired: boolean;
  suggestedActions: string[];
  timestamp: Date;
  status: 'pending' | 'in_review' | 'approved' | 'denied' | 'resolved';
  assignedTo?: string;
  adminNotes?: string;
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
  messageType: 'request' | 'report' | 'alert' | 'suggestion' | 'question';
  priority: 'low' | 'medium' | 'high';
  attachedData?: any;
}

interface SecurityAnalysis {
  userId: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  flags: string[];
  recommendations: string[];
  confidence: number;
  analysis: string;
}

const AI_EMPLOYEES: AIEmployee[] = [
  {
    id: 'luckyai_manager',
    name: 'LuckyAI Manager',
    role: 'Chief AI Operations Manager',
    department: 'management',
    status: 'online',
    avatar: '🍀',
    description: 'Oversees all AI employee operations and coordinates between departments',
    capabilities: ['Team Management', 'Strategic Planning', 'Performance Monitoring', 'Resource Allocation'],
    permissions: ['manage_ai_employees', 'access_all_departments', 'approve_high_priority_actions'],
    lastActivity: new Date(),
    tasksCompleted: 1247,
    alertsGenerated: 89,
    successRate: 97.3,
    settings: {
      autoApproveThreshold: 0.85,
      alertFrequency: 'real_time',
      reportingLevel: 'detailed'
    }
  },
  {
    id: 'security_ai',
    name: 'SecurityAI Guardian',
    role: 'Security & Fraud Detection Specialist',
    department: 'security',
    status: 'online',
    avatar: '🛡️',
    description: 'Monitors user behavior for suspicious activity and prevents fraud',
    capabilities: ['Fraud Detection', 'Pattern Analysis', 'Risk Assessment', 'Real-time Monitoring'],
    permissions: ['access_user_data', 'flag_accounts', 'recommend_actions', 'generate_security_reports'],
    lastActivity: new Date(),
    tasksCompleted: 892,
    alertsGenerated: 156,
    successRate: 94.2,
    settings: {
      sensitivityLevel: 'high',
      autoFlag: true,
      realTimeAlerts: true,
      analysisDepth: 'comprehensive'
    }
  },
  {
    id: 'minigames_ai',
    name: 'GameMaster AI',
    role: 'Mini Games Analytics Manager',
    department: 'mini_games',
    status: 'online',
    avatar: '🎮',
    description: 'Analyzes mini game performance and ensures fair play',
    capabilities: ['Game Analytics', 'Performance Tracking', 'Reward Optimization', 'Player Engagement'],
    permissions: ['access_game_data', 'adjust_rewards', 'monitor_gameplay', 'generate_reports'],
    lastActivity: new Date(),
    tasksCompleted: 2341,
    alertsGenerated: 23,
    successRate: 98.1,
    settings: {
      rewardOptimization: true,
      cheatDetection: 'aggressive',
      performanceTracking: 'detailed'
    }
  },
  {
    id: 'finance_ai',
    name: 'FinanceAI Advisor',
    role: 'Financial Operations Specialist',
    department: 'finance',
    status: 'online',
    avatar: '💰',
    description: 'Manages financial transactions and revenue optimization',
    capabilities: ['Transaction Monitoring', 'Revenue Analysis', 'Cost Optimization', 'Financial Reporting'],
    permissions: ['access_financial_data', 'monitor_transactions', 'generate_financial_reports'],
    lastActivity: new Date(),
    tasksCompleted: 675,
    alertsGenerated: 34,
    successRate: 99.1,
    settings: {
      transactionMonitoring: 'real_time',
      anomalyDetection: true,
      reportingFrequency: 'daily'
    }
  }
];

export function AIEmployeeDashboard() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<AIEmployee[]>(AI_EMPLOYEES);
  const [alerts, setAlerts] = useState<AIAlert[]>([]);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<AIEmployee | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<AIAlert | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadAIData();
    // Set up real-time updates
    const interval = setInterval(loadAIData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadAIData = async () => {
    setIsLoading(true);
    try {
      // Load AI alerts
      const alertsResponse = await fetch('/api/ai-employees/alerts');
      if (alertsResponse.ok) {
        const alertsData = await alertsResponse.json();
        setAlerts(alertsData.map((alert: any) => ({
          ...alert,
          timestamp: new Date(alert.timestamp)
        })));
      }

      // Load AI messages
      const messagesResponse = await fetch('/api/ai-employees/messages');
      if (messagesResponse.ok) {
        const messagesData = await messagesResponse.json();
        setMessages(messagesData.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      }

      // Update employee status
      const statusResponse = await fetch('/api/ai-employees/status');
      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        setEmployees(prev => prev.map(emp => ({
          ...emp,
          ...statusData[emp.id],
          lastActivity: new Date(statusData[emp.id]?.lastActivity || emp.lastActivity)
        })));
      }
    } catch (error) {
      console.error('Error loading AI data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessageToAI = async (employeeId: string, content: string, messageType: string = 'request') => {
    if (!content.trim()) return;

    const message: AIMessage = {
      id: `msg_${Date.now()}`,
      fromId: user?.id || 'admin',
      fromName: user?.username || 'Admin',
      toId: employeeId,
      toName: employees.find(e => e.id === employeeId)?.name || 'AI Employee',
      content,
      timestamp: new Date(),
      isFromAdmin: true,
      messageType: messageType as any,
      priority: 'medium'
    };

    try {
      const response = await fetch('/api/ai-employees/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message)
      });

      if (response.ok) {
        setMessages(prev => [...prev, message]);
        setNewMessage('');
        
        // Simulate AI response
        setTimeout(() => {
          const aiResponse: AIMessage = {
            id: `msg_${Date.now() + 1}`,
            fromId: employeeId,
            fromName: employees.find(e => e.id === employeeId)?.name || 'AI Employee',
            toId: user?.id || 'admin',
            toName: user?.username || 'Admin',
            content: generateAIResponse(employeeId, content),
            timestamp: new Date(),
            isFromAdmin: false,
            messageType: 'report',
            priority: 'medium'
          };
          setMessages(prev => [...prev, aiResponse]);
        }, 2000);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const generateAIResponse = (employeeId: string, userMessage: string): string => {
    const employee = employees.find(e => e.id === employeeId);
    if (!employee) return "I'm currently unavailable.";

    // Simple AI response generation based on employee role
    switch (employee.department) {
      case 'security':
        if (userMessage.toLowerCase().includes('security') || userMessage.toLowerCase().includes('fraud')) {
          return "I've analyzed the current security status. No critical threats detected. 14 users flagged for review today with 92% accuracy rate. Shall I provide a detailed security report?";
        }
        return "Security systems are operating normally. I'm monitoring 2,847 active users with real-time threat detection enabled.";
      
      case 'mini_games':
        if (userMessage.toLowerCase().includes('game') || userMessage.toLowerCase().includes('cheat')) {
          return "Mini games analytics show 342 sessions today. Detected 3 potential anomalies that have been flagged for review. Overall player satisfaction is 94.7%.";
        }
        return "Game systems are running smoothly. All mini games are operational with balanced reward distributions.";
      
      case 'finance':
        if (userMessage.toLowerCase().includes('money') || userMessage.toLowerCase().includes('transaction')) {
          return "Financial systems processed $47,329 in transactions today with 99.97% success rate. 2 transactions flagged for manual review.";
        }
        return "All financial operations are within normal parameters. Daily revenue tracking is active.";
      
      default:
        return "I'm monitoring all systems and can assist with any questions about my department operations.";
    }
  };

  const handleAlertAction = async (alertId: string, action: 'approve' | 'deny' | 'investigate', notes?: string) => {
    try {
      const response = await fetch(`/api/ai-employees/alerts/${alertId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, notes, adminId: user?.id })
      });

      if (response.ok) {
        setAlerts(prev => prev.map(alert => 
          alert.id === alertId 
            ? { ...alert, status: action === 'approve' ? 'approved' : action === 'deny' ? 'denied' : 'in_review', adminNotes: notes }
            : alert
        ));
      }
    } catch (error) {
      console.error('Error handling alert action:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      case 'maintenance': return 'bg-red-500';
      default: return 'bg-gray-500';
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

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 flex items-center justify-center">
        <Card className="bg-gray-800 border-gray-700 p-8">
          <div className="text-center">
            <Lock className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
            <p className="text-gray-400">Admin privileges required to access AI Employee Dashboard</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 p-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">AI Employee Dashboard</h1>
          <p className="text-purple-200">Manage and monitor your AI workforce</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="employees">Employees</TabsTrigger>
            <TabsTrigger value="alerts">Alerts ({alerts.filter(a => a.status === 'pending').length})</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* System Status Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6 text-center">
                  <Bot className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-400">
                    {employees.filter(e => e.status === 'online').length}
                  </div>
                  <div className="text-gray-400">AI Employees Online</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6 text-center">
                  <AlertTriangle className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-yellow-400">
                    {alerts.filter(a => a.status === 'pending').length}
                  </div>
                  <div className="text-gray-400">Pending Alerts</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6 text-center">
                  <Activity className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-400">
                    {employees.reduce((sum, e) => sum + e.tasksCompleted, 0)}
                  </div>
                  <div className="text-gray-400">Tasks Completed</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6 text-center">
                  <CheckCircle className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-400">
                    {Math.round(employees.reduce((sum, e) => sum + e.successRate, 0) / employees.length)}%
                  </div>
                  <div className="text-gray-400">Avg Success Rate</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Alerts */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  Recent Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.slice(0, 5).map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getSeverityColor(alert.severity)}`} />
                        <div>
                          <div className="text-white font-medium">{alert.title}</div>
                          <div className="text-gray-400 text-sm">{alert.description}</div>
                        </div>
                      </div>
                      <Badge variant="outline">{alert.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="employees" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {employees.map((employee) => (
                <Card key={employee.id} className="bg-gray-800 border-gray-700 hover:border-gold/50 transition-all">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{employee.avatar}</div>
                        <div>
                          <CardTitle className="text-white text-lg">{employee.name}</CardTitle>
                          <p className="text-gray-400 text-sm">{employee.role}</p>
                        </div>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(employee.status)}`} />
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-gray-300 text-sm">{employee.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Tasks:</span>
                        <div className="text-white font-semibold">{employee.tasksCompleted}</div>
                      </div>
                      <div>
                        <span className="text-gray-400">Success Rate:</span>
                        <div className="text-green-400 font-semibold">{employee.successRate}%</div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => setSelectedEmployee(employee)}
                        className="flex-1"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Chat
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <div className="space-y-4">
              {alerts.map((alert) => (
                <Card key={alert.id} className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${getSeverityColor(alert.severity)}`} />
                        <div>
                          <CardTitle className="text-white text-lg">{alert.title}</CardTitle>
                          <p className="text-gray-400 text-sm">
                            From: {employees.find(e => e.id === alert.employeeId)?.name} • 
                            {alert.timestamp.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">{alert.status}</Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-gray-300">{alert.description}</p>
                    
                    {alert.suggestedActions.length > 0 && (
                      <div>
                        <h4 className="text-white font-semibold mb-2">Suggested Actions:</h4>
                        <ul className="list-disc list-inside text-gray-300 space-y-1">
                          {alert.suggestedActions.map((action, index) => (
                            <li key={index}>{action}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {alert.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleAlertAction(alert.id, 'approve')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleAlertAction(alert.id, 'investigate')}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Investigate
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleAlertAction(alert.id, 'deny')}
                        >
                          Deny
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Employee List */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">AI Employees</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {employees.map((employee) => (
                      <Button
                        key={employee.id}
                        variant={selectedEmployee?.id === employee.id ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => setSelectedEmployee(employee)}
                      >
                        <span className="text-xl mr-2">{employee.avatar}</span>
                        {employee.name}
                        <div className={`ml-auto w-2 h-2 rounded-full ${getStatusColor(employee.status)}`} />
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Chat Interface */}
              <div className="lg:col-span-2">
                <Card className="bg-gray-800 border-gray-700 h-[600px] flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      {selectedEmployee && (
                        <>
                          <span className="text-2xl">{selectedEmployee.avatar}</span>
                          {selectedEmployee.name}
                        </>
                      )}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="flex-1 flex flex-col">
                    {selectedEmployee ? (
                      <>
                        <ScrollArea className="flex-1 mb-4">
                          <div className="space-y-4">
                            {messages
                              .filter(m => 
                                (m.fromId === selectedEmployee.id || m.toId === selectedEmployee.id) &&
                                (m.fromId === user?.id || m.toId === user?.id)
                              )
                              .map((message) => (
                                <div
                                  key={message.id}
                                  className={`flex ${message.isFromAdmin ? 'justify-end' : 'justify-start'}`}
                                >
                                  <div
                                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                      message.isFromAdmin
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-700 text-gray-200'
                                    }`}
                                  >
                                    <p>{message.content}</p>
                                    <p className="text-xs opacity-70 mt-1">
                                      {message.timestamp.toLocaleTimeString()}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            <div ref={messagesEndRef} />
                          </div>
                        </ScrollArea>
                        
                        <div className="flex gap-2">
                          <Input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                sendMessageToAI(selectedEmployee.id, newMessage);
                              }
                            }}
                          />
                          <Button onClick={() => sendMessageToAI(selectedEmployee.id, newMessage)}>
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="flex-1 flex items-center justify-center text-gray-400">
                        Select an AI employee to start chatting
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">AI Employee Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-white">
                  <p className="mb-4">Configure AI employee behavior and permissions</p>
                  <p className="text-sm text-gray-400">
                    Advanced settings for AI employee management will be available here.
                    This includes performance thresholds, alert sensitivity, and department-specific configurations.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
