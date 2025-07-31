import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useAuth } from "./AuthContext";
import {
  Bot,
  Gamepad2,
  Star,
  Trophy,
  Target,
  Zap,
  Crown,
  Sparkles,
  Code,
  Palette,
  Volume2,
  Settings,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  FileText,
  Download,
  Upload,
  RefreshCw,
  Lightbulb,
  Cpu,
  Database,
  Wrench,
  Eye,
  Edit,
  Trash2,
  Plus,
} from "lucide-react";

interface GameConcept {
  id: string;
  name: string;
  type: "slot" | "mini-game";
  category: string;
  description: string;
  mechanics: string[];
  theme: string;
  targetAudience: string;
  estimatedRTP: number;
  complexity: "Simple" | "Medium" | "Complex";
  marketAppeal: number;
  technicalScore: number;
  creativityScore: number;
  generatedAt: Date;
  status: "draft" | "pending_approval" | "approved" | "rejected" | "in_development" | "completed";
  approvedBy?: string;
  rejectionReason?: string;
  developmentProgress?: number;
}

interface AIEmployee {
  id: string;
  name: string;
  role: string;
  specialization: string[];
  experience: number;
  performanceRating: number;
  gamesCreated: number;
  successRate: number;
  lastActive: Date;
  status: "active" | "training" | "maintenance";
  personality: {
    creativity: number;
    logic: number;
    innovation: number;
    efficiency: number;
  };
}

interface DevelopmentTask {
  id: string;
  conceptId: string;
  taskType: "concept" | "design" | "development" | "testing" | "optimization";
  assignedTo: string;
  status: "pending" | "in_progress" | "completed" | "failed";
  progress: number;
  startedAt?: Date;
  completedAt?: Date;
  estimatedHours: number;
  actualHours?: number;
  notes: string;
}

export const AIGameDeveloper: React.FC = () => {
  const { user } = useAuth();
  const [aiEmployees, setAiEmployees] = useState<AIEmployee[]>([]);
  const [gameConcepts, setGameConcepts] = useState<GameConcept[]>([]);
  const [developmentTasks, setDevelopmentTasks] = useState<DevelopmentTask[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showConceptDetails, setShowConceptDetails] = useState<GameConcept | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [productionStats, setProductionStats] = useState({
    dailyGeneration: true,
    todaysConcepts: 0,
    weeklyApprovals: 0,
    monthlyReleases: 0,
    averageScore: 0,
  });

  useEffect(() => {
    initializeAIEmployees();
    loadGameConcepts();
    loadDevelopmentTasks();
    startDailyGeneration();
  }, []);

  const initializeAIEmployees = () => {
    const employees: AIEmployee[] = [
      {
        id: "ai_dev_001",
        name: "SlotMaster AI",
        role: "Senior Slot Developer",
        specialization: ["Slot Mechanics", "RTP Calculation", "Bonus Features"],
        experience: 95,
        performanceRating: 4.8,
        gamesCreated: 847,
        successRate: 89.2,
        lastActive: new Date(),
        status: "active",
        personality: {
          creativity: 85,
          logic: 95,
          innovation: 78,
          efficiency: 92,
        },
      },
      {
        id: "ai_dev_002",
        name: "MiniGame Genius",
        role: "Mini-Game Specialist",
        specialization: ["Arcade Games", "Puzzle Games", "Quick Play"],
        experience: 88,
        performanceRating: 4.6,
        gamesCreated: 623,
        successRate: 91.5,
        lastActive: new Date(),
        status: "active",
        personality: {
          creativity: 96,
          logic: 82,
          innovation: 94,
          efficiency: 87,
        },
      },
      {
        id: "ai_dev_003",
        name: "ThemeWeaver AI",
        role: "Creative Director",
        specialization: ["Theme Design", "Visual Concepts", "Storytelling"],
        experience: 92,
        performanceRating: 4.7,
        gamesCreated: 534,
        successRate: 86.8,
        lastActive: new Date(),
        status: "active",
        personality: {
          creativity: 98,
          logic: 76,
          innovation: 93,
          efficiency: 81,
        },
      },
    ];

    setAiEmployees(employees);
  };

  const loadGameConcepts = () => {
    const concepts: GameConcept[] = [
      {
        id: "concept_001",
        name: "Cosmic Fortune Reels",
        type: "slot",
        category: "Space Theme",
        description: "An interstellar slot adventure with cascading reels and planetary bonus rounds. Features expanding wilds shaped like black holes and a progressive jackpot that grows with cosmic energy.",
        mechanics: ["Cascading Reels", "Expanding Wilds", "Progressive Jackpot", "Planetary Bonus"],
        theme: "Space/Cosmic",
        targetAudience: "Sci-fi enthusiasts, progressive players",
        estimatedRTP: 96.5,
        complexity: "Complex",
        marketAppeal: 87,
        technicalScore: 92,
        creativityScore: 89,
        generatedAt: new Date(Date.now() - 86400000),
        status: "pending_approval",
      },
      {
        id: "concept_002",
        name: "Dragon's Treasure Hunt",
        type: "mini-game",
        category: "Adventure",
        description: "A strategic mini-game where players navigate through a dragon's lair, collecting treasures while avoiding traps. Features real-time decision making and multiple paths to victory.",
        mechanics: ["Strategy", "Real-time choices", "Multiple paths", "Risk/Reward"],
        theme: "Fantasy/Medieval",
        targetAudience: "Strategy game lovers, fantasy fans",
        estimatedRTP: 94.2,
        complexity: "Medium",
        marketAppeal: 91,
        technicalScore: 85,
        creativityScore: 94,
        generatedAt: new Date(Date.now() - 172800000),
        status: "approved",
        approvedBy: "Admin",
        developmentProgress: 35,
      },
      {
        id: "concept_003",
        name: "Lucky Fruit Fiesta",
        type: "slot",
        category: "Classic",
        description: "A modern twist on classic fruit machines with multiplying symbols and a unique 'Fruit Frenzy' bonus mode where all fruits become wilds for massive wins.",
        mechanics: ["Multiplying Symbols", "Wild Transformation", "Classic Reels", "Bonus Mode"],
        theme: "Classic Fruits",
        targetAudience: "Traditional slot players, casual gamers",
        estimatedRTP: 95.8,
        complexity: "Simple",
        marketAppeal: 83,
        technicalScore: 88,
        creativityScore: 76,
        generatedAt: new Date(Date.now() - 259200000),
        status: "in_development",
        approvedBy: "Admin",
        developmentProgress: 78,
      },
    ];

    setGameConcepts(concepts);
  };

  const loadDevelopmentTasks = () => {
    const tasks: DevelopmentTask[] = [
      {
        id: "task_001",
        conceptId: "concept_002",
        taskType: "development",
        assignedTo: "ai_dev_002",
        status: "in_progress",
        progress: 35,
        startedAt: new Date(Date.now() - 86400000),
        estimatedHours: 48,
        actualHours: 16,
        notes: "Core game mechanics implemented. Working on UI polish and balance testing.",
      },
      {
        id: "task_002", 
        conceptId: "concept_003",
        taskType: "optimization",
        assignedTo: "ai_dev_001",
        status: "in_progress",
        progress: 78,
        startedAt: new Date(Date.now() - 172800000),
        estimatedHours: 32,
        actualHours: 25,
        notes: "Final RTP calibration and bonus feature testing. Nearly ready for deployment.",
      },
    ];

    setDevelopmentTasks(tasks);
  };

  const startDailyGeneration = () => {
    // Simulate daily generation schedule
    setInterval(() => {
      if (productionStats.dailyGeneration) {
        generateDailyConcepts();
      }
    }, 24 * 60 * 60 * 1000); // Every 24 hours

    // Initial generation for demo
    setTimeout(() => {
      generateDailyConcepts();
    }, 5000);
  };

  const generateDailyConcepts = async () => {
    setIsGenerating(true);

    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 3000));

    const gameTypes = ["slot", "mini-game"] as const;
    const themes = [
      "Ancient Egypt", "Underwater Adventure", "Wild West", "Futuristic Cyberpunk",
      "Magical Forest", "Pirates Treasure", "Norse Mythology", "Asian Garden",
      "Steampunk", "Safari Adventure", "Candy Kingdom", "Rock Concert"
    ];

    const slotMechanics = [
      "Free Spins", "Multipliers", "Wild Symbols", "Scatter Pays", 
      "Cascading Reels", "Expanding Reels", "Sticky Wilds", "Progressive Jackpot"
    ];

    const miniGameMechanics = [
      "Time Challenge", "Precision Aim", "Strategy Puzzle", "Memory Game",
      "Reflex Test", "Pattern Matching", "Resource Management", "Quick Decision"
    ];

    // Generate 1-2 concepts daily
    const conceptCount = Math.random() > 0.7 ? 2 : 1;
    const newConcepts: GameConcept[] = [];

    for (let i = 0; i < conceptCount; i++) {
      const gameType = gameTypes[Math.floor(Math.random() * gameTypes.length)];
      const theme = themes[Math.floor(Math.random() * themes.length)];
      const mechanics = gameType === "slot" ? slotMechanics : miniGameMechanics;
      
      const selectedMechanics = mechanics
        .sort(() => 0.5 - Math.random())
        .slice(0, 3 + Math.floor(Math.random() * 2));

      const concept: GameConcept = {
        id: `concept_${Date.now()}_${i}`,
        name: `${theme} ${gameType === "slot" ? "Slots" : "Challenge"}`,
        type: gameType,
        category: theme,
        description: `An innovative ${gameType} game set in ${theme} with ${selectedMechanics.join(", ").toLowerCase()}. Designed for maximum player engagement and retention.`,
        mechanics: selectedMechanics,
        theme,
        targetAudience: "General casino audience",
        estimatedRTP: 94 + Math.random() * 4, // 94-98%
        complexity: ["Simple", "Medium", "Complex"][Math.floor(Math.random() * 3)] as any,
        marketAppeal: 70 + Math.random() * 30,
        technicalScore: 75 + Math.random() * 25,
        creativityScore: 80 + Math.random() * 20,
        generatedAt: new Date(),
        status: "draft",
      };

      newConcepts.push(concept);
    }

    setGameConcepts(prev => [...newConcepts, ...prev]);
    setProductionStats(prev => ({
      ...prev,
      todaysConcepts: prev.todaysConcepts + conceptCount,
    }));

    setIsGenerating(false);

    // Auto-submit for approval after generation
    setTimeout(() => {
      setGameConcepts(prev => 
        prev.map(concept => 
          newConcepts.some(nc => nc.id === concept.id)
            ? { ...concept, status: "pending_approval" as const }
            : concept
        )
      );
    }, 2000);
  };

  const handleApproval = (conceptId: string, approved: boolean, reason?: string) => {
    setGameConcepts(prev => 
      prev.map(concept => 
        concept.id === conceptId
          ? {
              ...concept,
              status: approved ? "approved" : "rejected",
              approvedBy: approved ? user?.username : undefined,
              rejectionReason: reason,
            }
          : concept
      )
    );

    if (approved) {
      // Create development task
      const concept = gameConcepts.find(c => c.id === conceptId);
      if (concept) {
        const newTask: DevelopmentTask = {
          id: `task_${Date.now()}`,
          conceptId,
          taskType: "development",
          assignedTo: selectedEmployee || aiEmployees[0].id,
          status: "pending",
          progress: 0,
          estimatedHours: concept.complexity === "Simple" ? 24 : concept.complexity === "Medium" ? 48 : 72,
          notes: `Approved for development. Starting ${concept.type} implementation.`,
        };

        setDevelopmentTasks(prev => [...prev, newTask]);
      }
    }
  };

  const getStatusBadge = (status: GameConcept["status"]) => {
    const statusConfig = {
      draft: { color: "bg-gray-500/20 text-gray-400", label: "Draft" },
      pending_approval: { color: "bg-yellow-500/20 text-yellow-400", label: "Pending Approval" },
      approved: { color: "bg-green-500/20 text-green-400", label: "Approved" },
      rejected: { color: "bg-red-500/20 text-red-400", label: "Rejected" },
      in_development: { color: "bg-blue-500/20 text-blue-400", label: "In Development" },
      completed: { color: "bg-purple-500/20 text-purple-400", label: "Completed" },
    };

    const config = statusConfig[status];
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getEmployeeByRole = (role: string) => {
    return aiEmployees.find(emp => emp.role.includes(role)) || aiEmployees[0];
  };

  if (user?.role !== "admin") {
    return (
      <Card className="bg-red-500/10 border-red-500/20">
        <CardContent className="p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-400 mb-2">Access Denied</h3>
          <p className="text-gray-400">Only administrators can access the AI Game Developer.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">AI Game Developer</h2>
          <p className="text-gray-400">Automated game concept generation and development pipeline</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={generateDailyConcepts} 
            disabled={isGenerating}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Lightbulb className="w-4 h-4 mr-2" />
                Generate Concepts
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="concepts">Game Concepts</TabsTrigger>
          <TabsTrigger value="employees">AI Employees</TabsTrigger>
          <TabsTrigger value="development">Development</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Production Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-purple-400">Today's Concepts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{productionStats.todaysConcepts}</div>
                <p className="text-xs text-purple-400 mt-1">AI generated</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-green-400">Weekly Approvals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{gameConcepts.filter(c => c.status === "approved").length}</div>
                <p className="text-xs text-green-400 mt-1">Ready for development</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-blue-400">In Development</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{gameConcepts.filter(c => c.status === "in_development").length}</div>
                <p className="text-xs text-blue-400 mt-1">Active projects</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border-yellow-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-yellow-400">Avg Quality Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {gameConcepts.length > 0 
                    ? Math.round(gameConcepts.reduce((sum, c) => sum + c.creativityScore, 0) / gameConcepts.length)
                    : 0
                  }
                </div>
                <p className="text-xs text-yellow-400 mt-1">Creativity rating</p>
              </CardContent>
            </Card>
          </div>

          {/* AI Employee Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Bot className="w-5 h-5 text-blue-400" />
                AI Employee Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {aiEmployees.map((employee) => (
                  <div key={employee.id} className="bg-gray-800/50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-white">{employee.name}</h3>
                        <p className="text-sm text-gray-400">{employee.role}</p>
                      </div>
                      <Badge className={employee.status === "active" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}>
                        {employee.status}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Games Created:</span>
                        <span className="text-white">{employee.gamesCreated}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Success Rate:</span>
                        <span className="text-green-400">{employee.successRate}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Performance:</span>
                        <span className="text-white">{employee.performanceRating}/5.0</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-white">Recent AI Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {gameConcepts.slice(0, 5).map((concept) => (
                  <div key={concept.id} className="flex items-center justify-between bg-gray-800/50 p-3 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                        {concept.type === "slot" ? <Gamepad2 className="w-4 h-4 text-white" /> : <Target className="w-4 h-4 text-white" />}
                      </div>
                      <div>
                        <div className="font-medium text-white">{concept.name}</div>
                        <div className="text-sm text-gray-400">{concept.category} • {concept.type}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(concept.status)}
                      <span className="text-xs text-gray-500">{concept.generatedAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="concepts" className="space-y-6">
          {/* Concepts List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {gameConcepts.map((concept) => (
              <Card key={concept.id} className="bg-gray-800/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                        {concept.type === "slot" ? <Gamepad2 className="w-4 h-4 text-white" /> : <Target className="w-4 h-4 text-white" />}
                      </div>
                      <div>
                        <CardTitle className="text-white text-sm">{concept.name}</CardTitle>
                        <p className="text-xs text-gray-400">{concept.category}</p>
                      </div>
                    </div>
                    {getStatusBadge(concept.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-300">{concept.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">RTP:</span>
                      <span className="text-green-400">{concept.estimatedRTP.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Market Appeal:</span>
                      <span className="text-white">{concept.marketAppeal}/100</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Creativity:</span>
                      <span className="text-white">{concept.creativityScore}/100</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {concept.mechanics.slice(0, 3).map((mechanic) => (
                      <Badge key={mechanic} className="bg-blue-500/20 text-blue-400 text-xs">
                        {mechanic}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowConceptDetails(concept)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Details
                    </Button>
                    
                    {concept.status === "pending_approval" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleApproval(concept.id, true)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleApproval(concept.id, false, "Needs refinement")}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                  </div>

                  {concept.developmentProgress !== undefined && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Development Progress</span>
                        <span className="text-white">{concept.developmentProgress}%</span>
                      </div>
                      <Progress value={concept.developmentProgress} className="h-2" />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="employees" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {aiEmployees.map((employee) => (
              <Card key={employee.id} className="bg-gray-800/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">{employee.name}</CardTitle>
                    <Badge className={employee.status === "active" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}>
                      {employee.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400">{employee.role}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Experience:</span>
                      <span className="text-white">{employee.experience}/100</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Performance:</span>
                      <span className="text-green-400">{employee.performanceRating}/5.0</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Games Created:</span>
                      <span className="text-white">{employee.gamesCreated}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Success Rate:</span>
                      <span className="text-green-400">{employee.successRate}%</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-white">Personality Traits</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Creativity</span>
                        <span className="text-purple-400">{employee.personality.creativity}%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Logic</span>
                        <span className="text-blue-400">{employee.personality.logic}%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Innovation</span>
                        <span className="text-green-400">{employee.personality.innovation}%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Efficiency</span>
                        <span className="text-yellow-400">{employee.personality.efficiency}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-white">Specializations</h4>
                    <div className="flex flex-wrap gap-1">
                      {employee.specialization.map((spec) => (
                        <Badge key={spec} className="bg-purple-500/20 text-purple-400 text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="development" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-white">Active Development Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {developmentTasks.map((task) => {
                  const concept = gameConcepts.find(c => c.id === task.conceptId);
                  const employee = aiEmployees.find(e => e.id === task.assignedTo);
                  
                  return (
                    <div key={task.id} className="bg-gray-800/50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-medium text-white">{concept?.name}</h3>
                          <p className="text-sm text-gray-400">
                            {task.taskType} • Assigned to {employee?.name}
                          </p>
                        </div>
                        <Badge className={
                          task.status === "completed" ? "bg-green-500/20 text-green-400" :
                          task.status === "in_progress" ? "bg-blue-500/20 text-blue-400" :
                          "bg-yellow-500/20 text-yellow-400"
                        }>
                          {task.status.replace("_", " ")}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Progress</span>
                          <span className="text-white">{task.progress}%</span>
                        </div>
                        <Progress value={task.progress} className="h-2" />
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Estimated Hours:</span>
                          <span className="text-white">{task.estimatedHours}h</span>
                        </div>
                        {task.actualHours && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Actual Hours:</span>
                            <span className="text-white">{task.actualHours}h</span>
                          </div>
                        )}

                        {task.notes && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-300">{task.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-white">Concept Generation Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Slot Games</span>
                    <span className="text-white">{gameConcepts.filter(c => c.type === "slot").length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Mini Games</span>
                    <span className="text-white">{gameConcepts.filter(c => c.type === "mini-game").length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Approval Rate</span>
                    <span className="text-green-400">
                      {gameConcepts.length > 0 
                        ? Math.round((gameConcepts.filter(c => c.status === "approved").length / gameConcepts.length) * 100)
                        : 0
                      }%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-white">Quality Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Avg Creativity Score</span>
                    <span className="text-purple-400">
                      {gameConcepts.length > 0 
                        ? Math.round(gameConcepts.reduce((sum, c) => sum + c.creativityScore, 0) / gameConcepts.length)
                        : 0
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Avg Technical Score</span>
                    <span className="text-blue-400">
                      {gameConcepts.length > 0 
                        ? Math.round(gameConcepts.reduce((sum, c) => sum + c.technicalScore, 0) / gameConcepts.length)
                        : 0
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Avg Market Appeal</span>
                    <span className="text-green-400">
                      {gameConcepts.length > 0 
                        ? Math.round(gameConcepts.reduce((sum, c) => sum + c.marketAppeal, 0) / gameConcepts.length)
                        : 0
                      }
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Concept Details Modal */}
      <Dialog open={!!showConceptDetails} onOpenChange={() => setShowConceptDetails(null)}>
        <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">
              {showConceptDetails?.name}
            </DialogTitle>
          </DialogHeader>
          {showConceptDetails && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Type</Label>
                  <p className="text-white capitalize">{showConceptDetails.type}</p>
                </div>
                <div>
                  <Label className="text-gray-300">Theme</Label>
                  <p className="text-white">{showConceptDetails.theme}</p>
                </div>
                <div>
                  <Label className="text-gray-300">Complexity</Label>
                  <p className="text-white">{showConceptDetails.complexity}</p>
                </div>
                <div>
                  <Label className="text-gray-300">RTP</Label>
                  <p className="text-green-400">{showConceptDetails.estimatedRTP.toFixed(1)}%</p>
                </div>
              </div>

              <div>
                <Label className="text-gray-300">Description</Label>
                <p className="text-white mt-1">{showConceptDetails.description}</p>
              </div>

              <div>
                <Label className="text-gray-300">Game Mechanics</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {showConceptDetails.mechanics.map((mechanic) => (
                    <Badge key={mechanic} className="bg-blue-500/20 text-blue-400">
                      {mechanic}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-gray-300">Market Appeal</Label>
                  <div className="mt-1">
                    <Progress value={showConceptDetails.marketAppeal} className="h-2" />
                    <p className="text-sm text-white mt-1">{showConceptDetails.marketAppeal}/100</p>
                  </div>
                </div>
                <div>
                  <Label className="text-gray-300">Technical Score</Label>
                  <div className="mt-1">
                    <Progress value={showConceptDetails.technicalScore} className="h-2" />
                    <p className="text-sm text-white mt-1">{showConceptDetails.technicalScore}/100</p>
                  </div>
                </div>
                <div>
                  <Label className="text-gray-300">Creativity</Label>
                  <div className="mt-1">
                    <Progress value={showConceptDetails.creativityScore} className="h-2" />
                    <p className="text-sm text-white mt-1">{showConceptDetails.creativityScore}/100</p>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-gray-300">Target Audience</Label>
                <p className="text-white mt-1">{showConceptDetails.targetAudience}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
