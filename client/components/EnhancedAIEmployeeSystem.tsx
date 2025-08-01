import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { 
  MessageCircle, 
  Send, 
  Users, 
  Settings, 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Calendar, 
  User, 
  BrainCircuit,
  MessageSquare,
  UserCheck,
  FileText,
  Search,
  Filter,
  Plus,
  Trash2,
  Eye,
  Edit
} from 'lucide-react';

interface AIEmployee {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'online' | 'busy' | 'offline';
  lastActive: string;
  tasksCompleted: number;
  currentTasks: number;
  specialties: string[];
  personality: string;
  responseTime: string;
}

interface Message {
  id: string;
  sender: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'system' | 'task' | 'alert';
  isRead: boolean;
}

interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  dueDate: string;
  createdAt: string;
  completedAt?: string;
  category: string;
  estimatedTime: string;
}

interface ChatRoom {
  id: string;
  name: string;
  type: 'individual' | 'group';
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
}

const aiEmployees: AIEmployee[] = [
  {
    id: 'lucky-ai',
    name: 'LuckyAI',
    role: 'Chief AI Assistant',
    avatar: '/ai-avatars/lucky.png',
    status: 'online',
    lastActive: 'Now',
    tasksCompleted: 847,
    currentTasks: 3,
    specialties: ['Customer Support', 'Game Analysis', 'Security Monitoring', 'Player Assistance'],
    personality: 'Friendly, helpful, and enthusiastic about gaming. Always ready to assist players and staff.',
    responseTime: '< 1s'
  },
  {
    id: 'josey-ai',
    name: 'JoseyAI',
    role: 'Security Specialist',
    avatar: '/ai-avatars/josey.png',
    status: 'online',
    lastActive: 'Now',
    tasksCompleted: 234,
    currentTasks: 5,
    specialties: ['Fraud Detection', 'Risk Assessment', 'Account Security', 'Compliance Monitoring'],
    personality: 'Professional, analytical, and detail-oriented. Focused on maintaining platform security.',
    responseTime: '< 2s'
  },
  {
    id: 'penny-ai',
    name: 'PennyAI',
    role: 'Financial Analyst',
    avatar: '/ai-avatars/penny.png',
    status: 'busy',
    lastActive: '5 min ago',
    tasksCompleted: 156,
    currentTasks: 2,
    specialties: ['Financial Analysis', 'Transaction Monitoring', 'Revenue Optimization', 'Banking Operations'],
    personality: 'Precise, data-driven, and thorough. Specializes in financial insights and banking operations.',
    responseTime: '< 3s'
  },
  {
    id: 'sage-ai',
    name: 'SageAI',
    role: 'Data Scientist',
    avatar: '/ai-avatars/sage.png',
    status: 'online',
    lastActive: 'Now',
    tasksCompleted: 89,
    currentTasks: 4,
    specialties: ['Data Analysis', 'Player Behavior', 'Predictive Modeling', 'Performance Metrics'],
    personality: 'Intellectual, insightful, and methodical. Provides deep analytics and strategic recommendations.',
    responseTime: '< 5s'
  }
];

const sampleTasks: Task[] = [
  {
    id: 'task-001',
    title: 'Analyze slot machine performance metrics',
    description: 'Review performance data for all slot games from the past week and identify optimization opportunities.',
    assignedTo: ['sage-ai', 'lucky-ai'],
    priority: 'high',
    status: 'in-progress',
    dueDate: '2024-01-15',
    createdAt: '2024-01-10',
    category: 'Analytics',
    estimatedTime: '2 hours'
  },
  {
    id: 'task-002',
    title: 'Security audit for new player accounts',
    description: 'Conduct comprehensive security screening for accounts created in the last 24 hours.',
    assignedTo: ['josey-ai'],
    priority: 'urgent',
    status: 'pending',
    dueDate: '2024-01-12',
    createdAt: '2024-01-11',
    category: 'Security',
    estimatedTime: '1 hour'
  },
  {
    id: 'task-003',
    title: 'Customer support backlog review',
    description: 'Process and respond to pending customer support tickets, prioritizing VIP players.',
    assignedTo: ['lucky-ai'],
    priority: 'medium',
    status: 'completed',
    dueDate: '2024-01-11',
    createdAt: '2024-01-10',
    completedAt: '2024-01-11',
    category: 'Support',
    estimatedTime: '3 hours'
  }
];

export const EnhancedAIEmployeeSystem: React.FC = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<AIEmployee | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [messages, setMessages] = useState<{ [key: string]: Message[] }>({});
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [messageInput, setMessageInput] = useState('');
  const [selectedChatRoom, setSelectedChatRoom] = useState<string | null>(null);
  const [isCreateTaskDialogOpen, setIsCreateTaskDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: [] as string[],
    priority: 'medium' as Task['priority'],
    dueDate: '',
    category: '',
    estimatedTime: ''
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chat rooms
    const individualRooms: ChatRoom[] = aiEmployees.map(employee => ({
      id: `chat-${employee.id}`,
      name: employee.name,
      type: 'individual',
      participants: ['admin', employee.id],
      unreadCount: Math.floor(Math.random() * 3)
    }));

    const groupRoom: ChatRoom = {
      id: 'group-all',
      name: 'All AI Agents',
      type: 'group',
      participants: ['admin', ...aiEmployees.map(e => e.id)],
      unreadCount: 2
    };

    setChatRooms([...individualRooms, groupRoom]);

    // Initialize sample messages
    const sampleMessages: { [key: string]: Message[] } = {};
    
    individualRooms.forEach(room => {
      const employeeId = room.participants.find(p => p !== 'admin');
      const employee = aiEmployees.find(e => e.id === employeeId);
      
      sampleMessages[room.id] = [
        {
          id: `msg-${room.id}-1`,
          sender: employee?.name || 'AI Agent',
          senderId: employeeId || '',
          content: `Hello! I'm ${employee?.name}, ready to assist with any tasks you have for me.`,
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          type: 'text',
          isRead: true
        }
      ];
    });

    sampleMessages['group-all'] = [
      {
        id: 'msg-group-1',
        sender: 'LuckyAI',
        senderId: 'lucky-ai',
        content: 'Good morning team! All systems are running smoothly. Ready for today\'s tasks!',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        type: 'text',
        isRead: true
      },
      {
        id: 'msg-group-2',
        sender: 'JoseyAI',
        senderId: 'josey-ai',
        content: 'Security scans completed. No anomalies detected in the past 24 hours.',
        timestamp: new Date(Date.now() - 900000).toISOString(),
        type: 'system',
        isRead: false
      }
    ];

    setMessages(sampleMessages);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedChatRoom]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedChatRoom) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: 'Admin',
      senderId: 'admin',
      content: messageInput,
      timestamp: new Date().toISOString(),
      type: 'text',
      isRead: true
    };

    setMessages(prev => ({
      ...prev,
      [selectedChatRoom]: [...(prev[selectedChatRoom] || []), newMessage]
    }));

    setMessageInput('');

    // Simulate AI response
    setTimeout(() => {
      const room = chatRooms.find(r => r.id === selectedChatRoom);
      if (room?.type === 'individual') {
        const employeeId = room.participants.find(p => p !== 'admin');
        const employee = aiEmployees.find(e => e.id === employeeId);
        
        const aiResponse: Message = {
          id: `msg-${Date.now()}-ai`,
          sender: employee?.name || 'AI Agent',
          senderId: employeeId || '',
          content: generateAIResponse(messageInput, employee?.role || ''),
          timestamp: new Date().toISOString(),
          type: 'text',
          isRead: false
        };

        setMessages(prev => ({
          ...prev,
          [selectedChatRoom]: [...(prev[selectedChatRoom] || []), aiResponse]
        }));
      }
    }, 1000 + Math.random() * 2000);
  };

  const generateAIResponse = (userMessage: string, role: string): string => {
    const responses = {
      'Chief AI Assistant': [
        "I'll help you with that right away! Let me analyze the situation and provide the best solution.",
        "Great question! Based on my analysis of player behavior and game data, here's what I recommend...",
        "I've reviewed the relevant data and can assist with this task. Would you like me to proceed?",
        "That's an interesting challenge! I have some insights that might be helpful for this situation."
      ],
      'Security Specialist': [
        "I've initiated a security scan for this request. All protocols are being followed.",
        "Security assessment complete. I've identified potential risk factors and mitigation strategies.",
        "This requires immediate attention from a security perspective. I'm implementing protective measures now.",
        "I'll cross-reference this with our fraud detection systems and provide a comprehensive report."
      ],
      'Financial Analyst': [
        "I'll run the financial models and provide you with detailed analytics on this matter.",
        "Based on current transaction patterns and revenue data, here's my analysis...",
        "I'm processing the banking data now. The financial implications are being calculated.",
        "Let me review the monetary impact and provide optimization recommendations."
      ],
      'Data Scientist': [
        "I'm analyzing the data patterns and will provide predictive insights shortly.",
        "Based on historical data and current trends, I can offer several strategic recommendations.",
        "Let me run this through our machine learning models to provide accurate predictions.",
        "The data shows interesting correlations. I'll prepare a comprehensive analysis for you."
      ]
    };

    const roleResponses = responses[role as keyof typeof responses] || responses['Chief AI Assistant'];
    return roleResponses[Math.floor(Math.random() * roleResponses.length)];
  };

  const handleCreateTask = () => {
    if (!newTask.title.trim() || !newTask.description.trim()) return;

    const task: Task = {
      id: `task-${Date.now()}`,
      title: newTask.title,
      description: newTask.description,
      assignedTo: newTask.assignedTo,
      priority: newTask.priority,
      status: 'pending',
      dueDate: newTask.dueDate,
      createdAt: new Date().toISOString(),
      category: newTask.category,
      estimatedTime: newTask.estimatedTime
    };

    setTasks(prev => [task, ...prev]);
    setNewTask({
      title: '',
      description: '',
      assignedTo: [],
      priority: 'medium',
      dueDate: '',
      category: '',
      estimatedTime: ''
    });
    setIsCreateTaskDialogOpen(false);

    // Send task notification to assigned agents
    newTask.assignedTo.forEach(employeeId => {
      const chatRoomId = `chat-${employeeId}`;
      const employee = aiEmployees.find(e => e.id === employeeId);
      
      const taskMessage: Message = {
        id: `task-msg-${Date.now()}-${employeeId}`,
        sender: 'System',
        senderId: 'system',
        content: `New task assigned: "${task.title}". Priority: ${task.priority}. Due: ${task.dueDate}`,
        timestamp: new Date().toISOString(),
        type: 'task',
        isRead: false
      };

      setMessages(prev => ({
        ...prev,
        [chatRoomId]: [...(prev[chatRoomId] || []), taskMessage]
      }));
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'pending': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'cancelled': return <Trash2 className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <BrainCircuit className="h-8 w-8 text-yellow-400" />
              AI Employee Management System
            </h2>
            <p className="text-blue-200 mt-1">Manage and communicate with CoinKrazy AI agents</p>
          </div>
          <Dialog open={isCreateTaskDialogOpen} onOpenChange={setIsCreateTaskDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                <Plus className="h-4 w-4 mr-2" />
                Create Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogDescription>
                  Assign a new task to one or more AI agents
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Task Title</label>
                  <Input
                    value={newTask.title}
                    onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter task title..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the task in detail..."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Priority</label>
                    <Select value={newTask.priority} onValueChange={(value: Task['priority']) => setNewTask(prev => ({ ...prev, priority: value }))}>
                      <SelectTrigger>
                        <SelectValue />
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
                    <label className="text-sm font-medium">Due Date</label>
                    <Input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <Input
                      value={newTask.category}
                      onChange={(e) => setNewTask(prev => ({ ...prev, category: e.target.value }))}
                      placeholder="e.g., Security, Analytics, Support"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Estimated Time</label>
                    <Input
                      value={newTask.estimatedTime}
                      onChange={(e) => setNewTask(prev => ({ ...prev, estimatedTime: e.target.value }))}
                      placeholder="e.g., 2 hours, 30 minutes"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Assign To</label>
                  <div className="space-y-2 mt-2">
                    {aiEmployees.map(employee => (
                      <div key={employee.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={employee.id}
                          checked={newTask.assignedTo.includes(employee.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setNewTask(prev => ({ ...prev, assignedTo: [...prev.assignedTo, employee.id] }));
                            } else {
                              setNewTask(prev => ({ ...prev, assignedTo: prev.assignedTo.filter(id => id !== employee.id) }));
                            }
                          }}
                        />
                        <label htmlFor={employee.id} className="text-sm flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={employee.avatar} alt={employee.name} />
                            <AvatarFallback>{employee.name[0]}</AvatarFallback>
                          </Avatar>
                          {employee.name} - {employee.role}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateTaskDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateTask} className="bg-blue-600 hover:bg-blue-700">
                    Create Task
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 m-6 mb-0">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-black">
              <User className="h-4 w-4 mr-2" />
              Agents Overview
            </TabsTrigger>
            <TabsTrigger value="chat" className="data-[state=active]:bg-white data-[state=active]:text-black">
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat Hub
            </TabsTrigger>
            <TabsTrigger value="tasks" className="data-[state=active]:bg-white data-[state=active]:text-black">
              <FileText className="h-4 w-4 mr-2" />
              Task Management
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-white data-[state=active]:text-black">
              <BrainCircuit className="h-4 w-4 mr-2" />
              Performance
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 p-6 pt-4">
            <TabsContent value="overview" className="h-full m-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 h-full">
                {aiEmployees.map((employee) => (
                  <Card key={employee.id} className="bg-white/10 border-white/20 text-white hover:bg-white/15 transition-all cursor-pointer"
                        onClick={() => setSelectedEmployee(employee)}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={employee.avatar} alt={employee.name} />
                              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                                {employee.name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(employee.status)}`} />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{employee.name}</CardTitle>
                            <CardDescription className="text-blue-200">{employee.role}</CardDescription>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-white border-white/30">
                          {employee.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-200">Tasks Completed:</span>
                        <span className="font-semibold text-green-400">{employee.tasksCompleted}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-200">Current Tasks:</span>
                        <span className="font-semibold text-yellow-400">{employee.currentTasks}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-200">Response Time:</span>
                        <span className="font-semibold text-blue-400">{employee.responseTime}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-200">Last Active:</span>
                        <span className="font-semibold">{employee.lastActive}</span>
                      </div>
                      <div className="pt-2">
                        <p className="text-xs text-blue-200 mb-2">Specialties:</p>
                        <div className="flex flex-wrap gap-1">
                          {employee.specialties.slice(0, 2).map((specialty, index) => (
                            <Badge key={index} variant="secondary" className="text-xs bg-blue-600/50 text-blue-100">
                              {specialty}
                            </Badge>
                          ))}
                          {employee.specialties.length > 2 && (
                            <Badge variant="secondary" className="text-xs bg-gray-600/50 text-gray-100">
                              +{employee.specialties.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="chat" className="h-full m-0">
              <div className="flex h-full gap-4">
                {/* Chat Rooms List */}
                <Card className="w-80 bg-white/10 border-white/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white flex items-center gap-2">
                      <MessageCircle className="h-5 w-5" />
                      Chat Rooms
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[calc(100vh-300px)]">
                      <div className="space-y-1 p-4 pt-0">
                        {chatRooms.map((room) => (
                          <div
                            key={room.id}
                            className={`p-3 rounded-lg cursor-pointer transition-all hover:bg-white/10 ${
                              selectedChatRoom === room.id ? 'bg-white/20' : ''
                            }`}
                            onClick={() => setSelectedChatRoom(room.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                {room.type === 'individual' ? (
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={aiEmployees.find(e => room.participants.includes(e.id))?.avatar} />
                                    <AvatarFallback className="bg-blue-600 text-white text-xs">
                                      {room.name[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                ) : (
                                  <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                    <Users className="h-4 w-4 text-white" />
                                  </div>
                                )}
                                <div>
                                  <p className="text-white font-medium text-sm">{room.name}</p>
                                  <p className="text-blue-200 text-xs">
                                    {room.type === 'group' ? `${room.participants.length} members` : 'Direct message'}
                                  </p>
                                </div>
                              </div>
                              {room.unreadCount > 0 && (
                                <Badge className="bg-red-500 text-white h-5 min-w-[20px] text-xs">
                                  {room.unreadCount}
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* Chat Window */}
                <Card className="flex-1 bg-white/10 border-white/20 flex flex-col">
                  {selectedChatRoom ? (
                    <>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {chatRooms.find(r => r.id === selectedChatRoom)?.type === 'individual' ? (
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={aiEmployees.find(e => chatRooms.find(r => r.id === selectedChatRoom)?.participants.includes(e.id))?.avatar} />
                                <AvatarFallback className="bg-blue-600 text-white">
                                  {chatRooms.find(r => r.id === selectedChatRoom)?.name[0]}
                                </AvatarFallback>
                              </Avatar>
                            ) : (
                              <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                <Users className="h-4 w-4 text-white" />
                              </div>
                            )}
                            <div>
                              <CardTitle className="text-white text-lg">
                                {chatRooms.find(r => r.id === selectedChatRoom)?.name}
                              </CardTitle>
                              <CardDescription className="text-blue-200">
                                {chatRooms.find(r => r.id === selectedChatRoom)?.type === 'group' 
                                  ? 'Group conversation' 
                                  : 'Individual chat'}
                              </CardDescription>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="flex-1 flex flex-col">
                        <ScrollArea className="flex-1 pr-4">
                          <div className="space-y-4">
                            {(messages[selectedChatRoom] || []).map((message) => (
                              <div
                                key={message.id}
                                className={`flex ${message.senderId === 'admin' ? 'justify-end' : 'justify-start'}`}
                              >
                                <div className={`max-w-[70%] rounded-lg p-3 ${
                                  message.senderId === 'admin'
                                    ? 'bg-blue-600 text-white'
                                    : message.type === 'system'
                                    ? 'bg-yellow-600/20 border border-yellow-500/30 text-yellow-200'
                                    : message.type === 'task'
                                    ? 'bg-purple-600/20 border border-purple-500/30 text-purple-200'
                                    : 'bg-white/20 text-white'
                                }`}>
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-medium">{message.sender}</span>
                                    <span className="text-xs opacity-70">{formatTime(message.timestamp)}</span>
                                  </div>
                                  <p className="text-sm">{message.content}</p>
                                </div>
                              </div>
                            ))}
                            <div ref={messagesEndRef} />
                          </div>
                        </ScrollArea>
                        
                        <div className="flex space-x-2 mt-4">
                          <Input
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-blue-200"
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          />
                          <Button onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-700">
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center text-white/60">
                        <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Select a chat room to start messaging</p>
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="tasks" className="h-full m-0">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white">Task Management</h3>
                    <p className="text-blue-200">Assign and track tasks for AI agents</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-40 bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Tasks</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4">
                  {tasks.map((task) => (
                    <Card key={task.id} className="bg-white/10 border-white/20">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              {getStatusIcon(task.status)}
                              <h4 className="font-semibold text-white">{task.title}</h4>
                              <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                              </Badge>
                            </div>
                            <p className="text-blue-200 text-sm mb-3">{task.description}</p>
                            <div className="flex items-center gap-4 text-xs text-blue-300">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Due: {new Date(task.dueDate).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Est: {task.estimatedTime}
                              </div>
                              <div className="flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                {task.category}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <div className="flex -space-x-2">
                              {task.assignedTo.map(employeeId => {
                                const employee = aiEmployees.find(e => e.id === employeeId);
                                return (
                                  <Avatar key={employeeId} className="h-8 w-8 border-2 border-white">
                                    <AvatarImage src={employee?.avatar} alt={employee?.name} />
                                    <AvatarFallback className="bg-blue-600 text-white text-xs">
                                      {employee?.name[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                );
                              })}
                            </div>
                            <div className="flex gap-1">
                              <Button size="sm" variant="outline" className="h-7 w-7 p-0 border-white/30 text-white hover:bg-white/20">
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline" className="h-7 w-7 p-0 border-white/30 text-white hover:bg-white/20">
                                <Edit className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="h-full m-0">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">AI Agent Performance Analytics</h3>
                  <p className="text-blue-200">Monitor efficiency and performance metrics</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-white/10 border-white/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-200 text-sm">Total Tasks Completed</p>
                          <p className="text-2xl font-bold text-white">
                            {aiEmployees.reduce((sum, emp) => sum + emp.tasksCompleted, 0)}
                          </p>
                        </div>
                        <CheckCircle className="h-8 w-8 text-green-400" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/10 border-white/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-200 text-sm">Active Tasks</p>
                          <p className="text-2xl font-bold text-white">
                            {aiEmployees.reduce((sum, emp) => sum + emp.currentTasks, 0)}
                          </p>
                        </div>
                        <Clock className="h-8 w-8 text-yellow-400" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/10 border-white/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-200 text-sm">Agents Online</p>
                          <p className="text-2xl font-bold text-white">
                            {aiEmployees.filter(emp => emp.status === 'online').length}/{aiEmployees.length}
                          </p>
                        </div>
                        <UserCheck className="h-8 w-8 text-blue-400" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/10 border-white/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-200 text-sm">Avg Response Time</p>
                          <p className="text-2xl font-bold text-white">1.8s</p>
                        </div>
                        <BrainCircuit className="h-8 w-8 text-purple-400" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-white/10 border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white">Individual Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {aiEmployees.map((employee) => (
                          <div key={employee.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={employee.avatar} alt={employee.name} />
                                <AvatarFallback className="bg-blue-600 text-white">
                                  {employee.name[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-white font-medium">{employee.name}</p>
                                <p className="text-blue-200 text-sm">{employee.role}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-white font-semibold">{employee.tasksCompleted} tasks</p>
                              <p className="text-blue-200 text-sm">{employee.responseTime} avg</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/10 border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white">Task Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {['Security', 'Analytics', 'Support', 'Financial', 'Monitoring'].map((category) => (
                          <div key={category} className="flex items-center justify-between">
                            <span className="text-blue-200">{category}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-20 h-2 bg-white/20 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                                  style={{ width: `${Math.random() * 80 + 20}%` }}
                                />
                              </div>
                              <span className="text-white text-sm w-8">{Math.floor(Math.random() * 50 + 10)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Employee Detail Modal */}
      {selectedEmployee && (
        <Dialog open={!!selectedEmployee} onOpenChange={() => setSelectedEmployee(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedEmployee.avatar} alt={selectedEmployee.name} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xl">
                    {selectedEmployee.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <DialogTitle className="text-xl">{selectedEmployee.name}</DialogTitle>
                  <DialogDescription className="text-lg">{selectedEmployee.role}</DialogDescription>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(selectedEmployee.status)}`} />
                    <span className="text-sm capitalize">{selectedEmployee.status}</span>
                  </div>
                </div>
              </div>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Personality Profile</h4>
                <p className="text-sm text-gray-600">{selectedEmployee.personality}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Specialties</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedEmployee.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Performance Stats</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Tasks Completed:</span>
                      <span className="font-medium">{selectedEmployee.tasksCompleted}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Current Tasks:</span>
                      <span className="font-medium">{selectedEmployee.currentTasks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Response Time:</span>
                      <span className="font-medium">{selectedEmployee.responseTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Active:</span>
                      <span className="font-medium">{selectedEmployee.lastActive}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => {
                        setSelectedChatRoom(`chat-${selectedEmployee.id}`);
                        setActiveTab('chat');
                        setSelectedEmployee(null);
                      }}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Start Chat
                    </Button>
                    <Button size="sm" variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Assign Task
                    </Button>
                    <Button size="sm" variant="outline" className="w-full justify-start">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
