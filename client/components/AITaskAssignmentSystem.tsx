import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Clock, CheckCircle, AlertTriangle, Users, Bot, ArrowRight, MessageCircle, Settings, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { AdminTask, AIEmployee, DEFAULT_AI_EMPLOYEES } from '../shared/adminToolbarTypes';
import { useAuth } from './AuthContext';

interface AITaskAssignmentSystemProps {
  className?: string;
}

export const AITaskAssignmentSystem: React.FC<AITaskAssignmentSystemProps> = ({ className = '' }) => {
  const [tasks, setTasks] = useState<AdminTask[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<AdminTask[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterAssignee, setFilterAssignee] = useState<string>('all');
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<AdminTask | null>(null);
  const [aiEmployees, setAiEmployees] = useState<AIEmployee[]>(DEFAULT_AI_EMPLOYEES);
  const { user, isAdmin } = useAuth();

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as AdminTask['priority'],
    category: 'maintenance' as AdminTask['category'],
    assignedTo: '',
    dueDate: '',
    tags: [] as string[],
    estimatedHours: 1
  });

  useEffect(() => {
    loadTasks();
    startAITaskGeneration();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, searchTerm, filterStatus, filterPriority, filterAssignee]);

  const loadTasks = () => {
    // Mock data - in real implementation, this would fetch from API
    const mockTasks: AdminTask[] = [
      {
        id: 'task_001',
        title: 'Investigate slot game freezing issue',
        description: 'Players report Lucky Sevens slot game freezing on max bet spins. Need immediate investigation.',
        priority: 'high',
        status: 'assigned',
        assignedTo: 'john_doe',
        assignedBy: 'ai_game_master',
        category: 'bug_fix',
        createdAt: new Date('2024-01-15T09:00:00'),
        dueDate: new Date('2024-01-15T17:00:00'),
        tags: ['urgent', 'game-breaking', 'player-impact'],
        estimatedHours: 4,
        actualHours: undefined,
        attachments: [],
        comments: [
          {
            id: 'comment_001',
            taskId: 'task_001',
            userId: 'ai_game_master',
            userName: 'GameMaster AI',
            message: 'Initial analysis suggests memory leak in bonus round calculations. Recommend immediate review of game engine.',
            timestamp: new Date('2024-01-15T09:05:00'),
            attachments: []
          }
        ]
      },
      {
        id: 'task_002',
        title: 'Update user documentation for new SC redemption process',
        description: 'New redemption process requires updated documentation and user guides.',
        priority: 'medium',
        status: 'pending',
        assignedBy: 'ai_compliance_officer',
        category: 'content',
        createdAt: new Date('2024-01-15T10:30:00'),
        dueDate: new Date('2024-01-16T16:00:00'),
        tags: ['documentation', 'user-guides', 'compliance'],
        estimatedHours: 6,
        attachments: []
      },
      {
        id: 'task_003',
        title: 'Review suspicious player activity - Account #2847',
        description: 'AI fraud detection flagged unusual betting patterns. Manual review required.',
        priority: 'urgent',
        status: 'in_progress',
        assignedTo: 'security_team',
        assignedBy: 'ai_security_sentinel',
        category: 'security',
        createdAt: new Date('2024-01-15T11:15:00'),
        dueDate: new Date('2024-01-15T15:00:00'),
        tags: ['fraud-detection', 'security', 'urgent'],
        estimatedHours: 2,
        actualHours: 1.5,
        attachments: []
      },
      {
        id: 'task_004',
        title: 'Optimize database queries for real-time stats',
        description: 'Real-time statistics dashboard showing slow load times. Database optimization needed.',
        priority: 'medium',
        status: 'completed',
        assignedTo: 'tech_team',
        assignedBy: 'ai_data_analyst',
        category: 'performance',
        createdAt: new Date('2024-01-14T14:20:00'),
        completedAt: new Date('2024-01-15T12:30:00'),
        dueDate: new Date('2024-01-16T14:20:00'),
        tags: ['performance', 'database', 'optimization'],
        estimatedHours: 8,
        actualHours: 6,
        attachments: []
      }
    ];

    setTasks(mockTasks);
  };

  const startAITaskGeneration = () => {
    // Simulate AI-generated tasks every few minutes
    setInterval(() => {
      generateAITask();
    }, 120000); // Every 2 minutes
  };

  const generateAITask = () => {
    const aiGeneratedTasks = [
      {
        title: 'Daily compliance audit review',
        description: 'Automated daily compliance audit identified items requiring human review.',
        priority: 'medium' as const,
        category: 'compliance' as const,
        assignedBy: 'ai_compliance_officer',
        estimatedHours: 2,
        tags: ['compliance', 'audit', 'daily']
      },
      {
        title: 'Player satisfaction survey analysis',
        description: 'New survey responses received. Analysis and action items needed.',
        priority: 'low' as const,
        category: 'content' as const,
        assignedBy: 'ai_customer_care',
        estimatedHours: 3,
        tags: ['survey', 'player-satisfaction', 'analysis']
      },
      {
        title: 'Game performance anomaly detected',
        description: 'Unusual RTP patterns detected in Mystic Fortune slot. Investigation required.',
        priority: 'high' as const,
        category: 'bug_fix' as const,
        assignedBy: 'ai_game_master',
        estimatedHours: 4,
        tags: ['game-analysis', 'rtp', 'anomaly']
      }
    ];

    const randomTask = aiGeneratedTasks[Math.floor(Math.random() * aiGeneratedTasks.length)];
    const newTaskId = `ai_task_${Date.now()}`;
    
    const task: AdminTask = {
      id: newTaskId,
      title: randomTask.title,
      description: randomTask.description,
      priority: randomTask.priority,
      status: 'pending',
      assignedBy: randomTask.assignedBy,
      category: randomTask.category,
      createdAt: new Date(),
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      tags: randomTask.tags,
      estimatedHours: randomTask.estimatedHours,
      attachments: []
    };

    setTasks(prev => [task, ...prev]);
  };

  const filterTasks = () => {
    let filtered = tasks;

    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(task => task.status === filterStatus);
    }

    if (filterPriority !== 'all') {
      filtered = filtered.filter(task => task.priority === filterPriority);
    }

    if (filterAssignee !== 'all') {
      if (filterAssignee === 'unassigned') {
        filtered = filtered.filter(task => !task.assignedTo);
      } else if (filterAssignee === 'ai_assigned') {
        filtered = filtered.filter(task => task.assignedBy.startsWith('ai_'));
      } else {
        filtered = filtered.filter(task => task.assignedTo === filterAssignee);
      }
    }

    setFilteredTasks(filtered);
  };

  const handleCreateTask = () => {
    if (!newTask.title || !newTask.description) return;

    const task: AdminTask = {
      id: `task_${Date.now()}`,
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      status: 'pending',
      assignedTo: newTask.assignedTo || undefined,
      assignedBy: user?.id || 'admin',
      category: newTask.category,
      createdAt: new Date(),
      dueDate: newTask.dueDate ? new Date(newTask.dueDate) : undefined,
      tags: newTask.tags,
      estimatedHours: newTask.estimatedHours,
      attachments: []
    };

    setTasks(prev => [task, ...prev]);
    setShowNewTaskModal(false);
    resetNewTask();

    // Notify AI system about new task
    setTimeout(() => {
      addAIComment(task.id, 'lucky-ai', 'Task received and added to priority queue. I\'ll coordinate with the appropriate AI specialist for assignment recommendations.');
    }, 2000);
  };

  const addAIComment = (taskId: string, aiId: string, comment: string) => {
    const aiEmployee = aiEmployees.find(ai => ai.id === aiId);
    if (!aiEmployee) return;

    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const newComment = {
          id: `comment_${Date.now()}`,
          taskId,
          userId: aiId,
          userName: aiEmployee.name,
          message: comment,
          timestamp: new Date(),
          attachments: []
        };

        return {
          ...task,
          comments: [...(task.comments || []), newComment]
        };
      }
      return task;
    }));
  };

  const resetNewTask = () => {
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      category: 'maintenance',
      assignedTo: '',
      dueDate: '',
      tags: [],
      estimatedHours: 1
    });
  };

  const updateTaskStatus = (taskId: string, status: AdminTask['status']) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId
        ? { 
            ...task, 
            status, 
            completedAt: status === 'completed' ? new Date() : undefined 
          }
        : task
    ));

    // Generate AI feedback based on status change
    if (status === 'completed') {
      setTimeout(() => {
        addAIComment(taskId, 'lucky-ai', '🎉 Excellent work! Task completed successfully. Performance metrics updated and team notified.');
      }, 1000);
    }
  };

  const assignTask = (taskId: string, assigneeId: string) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId
        ? { ...task, assignedTo: assigneeId, status: 'assigned' }
        : task
    ));

    // AI provides assignment confirmation
    setTimeout(() => {
      addAIComment(taskId, 'lucky-ai', `Task successfully assigned. I've notified the assignee and added this to their priority queue. Estimated completion by ${new Date(Date.now() + 4 * 60 * 60 * 1000).toLocaleTimeString()}.`);
    }, 1500);
  };

  const getPriorityColor = (priority: AdminTask['priority']) => {
    const colors = {
      low: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      high: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      urgent: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    };
    return colors[priority];
  };

  const getStatusColor = (status: AdminTask['status']) => {
    const colors = {
      pending: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
      assigned: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      in_progress: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    };
    return colors[status];
  };

  const getStatusIcon = (status: AdminTask['status']) => {
    const icons = {
      pending: Clock,
      assigned: Users,
      in_progress: ArrowRight,
      completed: CheckCircle,
      cancelled: AlertTriangle
    };
    const Icon = icons[status];
    return <Icon className="w-4 h-4" />;
  };

  const staffMembers = [
    { id: 'john_doe', name: 'John Doe', role: 'Senior Developer' },
    { id: 'jane_smith', name: 'Jane Smith', role: 'Customer Support Lead' },
    { id: 'mike_wilson', name: 'Mike Wilson', role: 'Security Specialist' },
    { id: 'sarah_johnson', name: 'Sarah Johnson', role: 'Compliance Officer' },
    { id: 'tech_team', name: 'Technical Team', role: 'Development Team' },
    { id: 'security_team', name: 'Security Team', role: 'Security Team' }
  ];

  const renderTaskCard = (task: AdminTask) => (
    <motion.div
      key={task.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => setSelectedTask(task)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 dark:text-white mb-1">{task.title}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{task.description}</p>
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
          <Badge className={getStatusColor(task.status)}>
            {getStatusIcon(task.status)}
            <span className="ml-1">{task.status}</span>
          </Badge>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          {task.assignedBy.startsWith('ai_') && (
            <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
              <Bot className="w-3 h-3" />
              <span>AI Generated</span>
            </div>
          )}
          
          {task.assignedTo && (
            <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
              <Users className="w-3 h-3" />
              <span>{staffMembers.find(s => s.id === task.assignedTo)?.name || task.assignedTo}</span>
            </div>
          )}
          
          {task.dueDate && (
            <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
              <Clock className="w-3 h-3" />
              <span>Due {task.dueDate.toLocaleDateString()}</span>
            </div>
          )}
        </div>
        
        <div className="flex gap-1">
          {task.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {task.tags.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{task.tags.length - 2}
            </Badge>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Bot className="w-5 h-5" />
            AI Task Assignment System
          </h3>
          <Dialog open={showNewTaskModal} onOpenChange={setShowNewTaskModal}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600">
                <Plus className="w-4 h-4 mr-1" />
                New Task
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
              </DialogHeader>
              <NewTaskForm
                task={newTask}
                onChange={setNewTask}
                onSubmit={handleCreateTask}
                onCancel={() => setShowNewTaskModal(false)}
                staffMembers={staffMembers}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterAssignee} onValueChange={setFilterAssignee}>
              <SelectTrigger>
                <SelectValue placeholder="Assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assignees</SelectItem>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                <SelectItem value="ai_assigned">AI Generated</SelectItem>
                {staffMembers.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          <AnimatePresence>
            {filteredTasks.map(renderTaskCard)}
          </AnimatePresence>

          {filteredTasks.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No tasks found</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* AI Performance Summary */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
          <div className="flex items-center justify-center gap-4">
            <span>📊 AI Generated: {tasks.filter(t => t.assignedBy.startsWith('ai_')).length}</span>
            <span>✅ Completed: {tasks.filter(t => t.status === 'completed').length}</span>
            <span>⏱️ Avg Completion: 4.2 hours</span>
          </div>
        </div>
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onStatusChange={updateTaskStatus}
          onAssign={assignTask}
          staffMembers={staffMembers}
          aiEmployees={aiEmployees}
        />
      )}
    </div>
  );
};

// New Task Form Component
const NewTaskForm: React.FC<{
  task: any;
  onChange: (task: any) => void;
  onSubmit: () => void;
  onCancel: () => void;
  staffMembers: any[];
}> = ({ task, onChange, onSubmit, onCancel, staffMembers }) => {
  const [tagInput, setTagInput] = useState('');

  const addTag = () => {
    if (tagInput.trim() && !task.tags.includes(tagInput.trim())) {
      onChange({
        ...task,
        tags: [...task.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange({
      ...task,
      tags: task.tags.filter((tag: string) => tag !== tagToRemove)
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Title *</label>
        <Input
          value={task.title}
          onChange={(e) => onChange({ ...task, title: e.target.value })}
          placeholder="Task title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description *</label>
        <Textarea
          value={task.description}
          onChange={(e) => onChange({ ...task, description: e.target.value })}
          placeholder="Detailed task description"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Priority</label>
          <Select value={task.priority} onValueChange={(value) => onChange({ ...task, priority: value })}>
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
          <label className="block text-sm font-medium mb-2">Category</label>
          <Select value={task.category} onValueChange={(value) => onChange({ ...task, category: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bug_fix">Bug Fix</SelectItem>
              <SelectItem value="feature">Feature</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="content">Content</SelectItem>
              <SelectItem value="security">Security</SelectItem>
              <SelectItem value="compliance">Compliance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Assign To</label>
          <Select value={task.assignedTo} onValueChange={(value) => onChange({ ...task, assignedTo: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Leave unassigned for AI recommendation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Unassigned (AI will recommend)</SelectItem>
              {staffMembers.map((member) => (
                <SelectItem key={member.id} value={member.id}>
                  {member.name} - {member.role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Due Date</label>
          <Input
            type="datetime-local"
            value={task.dueDate}
            onChange={(e) => onChange({ ...task, dueDate: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Tags</label>
        <div className="flex gap-2 mb-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Add a tag"
            onKeyPress={(e) => e.key === 'Enter' && addTag()}
          />
          <Button type="button" onClick={addTag} size="sm">
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-1">
          {task.tags.map((tag: string) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="ml-1 text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={onSubmit} disabled={!task.title || !task.description}>
          Create Task
        </Button>
      </div>
    </div>
  );
};

// Task Detail Modal Component
const TaskDetailModal: React.FC<{
  task: AdminTask;
  onClose: () => void;
  onStatusChange: (id: string, status: AdminTask['status']) => void;
  onAssign: (id: string, assigneeId: string) => void;
  staffMembers: any[];
  aiEmployees: AIEmployee[];
}> = ({ task, onClose, onStatusChange, onAssign, staffMembers, aiEmployees }) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {task.title}
            <Badge className={`ml-2 ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" className="mt-4">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="comments">Comments ({task.comments?.length || 0})</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Description</h4>
              <p className="text-gray-600 dark:text-gray-400">{task.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Task Information</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Status:</strong> {task.status}</div>
                  <div><strong>Priority:</strong> {task.priority}</div>
                  <div><strong>Category:</strong> {task.category}</div>
                  <div><strong>Created:</strong> {task.createdAt.toLocaleString()}</div>
                  {task.dueDate && <div><strong>Due:</strong> {task.dueDate.toLocaleString()}</div>}
                  {task.completedAt && <div><strong>Completed:</strong> {task.completedAt.toLocaleString()}</div>}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Assignment</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Assigned By:</strong> {
                    task.assignedBy.startsWith('ai_') 
                      ? aiEmployees.find(ai => ai.id === task.assignedBy)?.name || task.assignedBy
                      : task.assignedBy
                  }</div>
                  <div><strong>Assigned To:</strong> {
                    task.assignedTo 
                      ? staffMembers.find(s => s.id === task.assignedTo)?.name || task.assignedTo
                      : 'Unassigned'
                  }</div>
                  {task.estimatedHours && <div><strong>Estimated Hours:</strong> {task.estimatedHours}</div>}
                  {task.actualHours && <div><strong>Actual Hours:</strong> {task.actualHours}</div>}
                </div>
              </div>
            </div>

            {task.tags.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Tags</h4>
                <div className="flex flex-wrap gap-1">
                  {task.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="comments" className="space-y-3">
            {task.comments && task.comments.length > 0 ? (
              task.comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    {comment.userId.startsWith('ai_') && <Bot className="w-4 h-4 text-purple-500" />}
                    <span className="font-medium text-sm">{comment.userName}</span>
                    <span className="text-xs text-gray-500">{comment.timestamp.toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{comment.message}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">No comments yet</p>
            )}
          </TabsContent>

          <TabsContent value="actions" className="space-y-4">
            <div>
              <h4 className="font-semibold mb-3">Task Actions</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Change Status</label>
                  <Select value={task.status} onValueChange={(value) => onStatusChange(task.id, value as AdminTask['status'])}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="assigned">Assigned</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Assign To</label>
                  <Select value={task.assignedTo || ''} onValueChange={(value) => onAssign(task.id, value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      {staffMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name} - {member.role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Helper function for colors (duplicated for modal)
const getPriorityColor = (priority: AdminTask['priority']) => {
  const colors = {
    low: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    high: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    urgent: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
  };
  return colors[priority];
};
