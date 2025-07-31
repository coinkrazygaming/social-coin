import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import { useAuth } from "./AuthContext";
import {
  Settings,
  MessageSquare,
  Edit,
  Layout,
  Code,
  Eye,
  Save,
  Plus,
  Trash2,
  Copy,
  Undo,
  Redo,
  Image,
  Type,
  Square,
  MousePointer,
  Move,
  Palette,
  Monitor,
  Smartphone,
  Tablet,
  Bot,
  Send,
  Mail,
  MailOpen,
  Maximize2,
  Minimize2,
  X,
  Crown,
  Zap,
  Target,
  Layers,
  Grid,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Link,
  List,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  Video,
  Upload,
  Github,
  Wand2,
  Sparkles,
  Database,
  Users,
  BarChart3,
  FileText,
  Globe,
  Shield,
  Bell,
  Search,
  Filter,
  Download,
  RefreshCw,
  ChevronDown,
} from "lucide-react";

interface AdminToolbarProps {
  className?: string;
}

interface AIMessage {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  read: boolean;
}

interface PageElement {
  id: string;
  type: "text" | "image" | "button" | "card" | "section";
  content: string;
  styles: Record<string, any>;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

interface SitePage {
  id: string;
  title: string;
  slug: string;
  content: PageElement[];
  isPublished: boolean;
  lastModified: Date;
  createdBy: string;
}

export const AdminToolbar: React.FC<AdminToolbarProps> = ({ className = "" }) => {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  const [activePanel, setActivePanel] = useState<"chat" | "editor" | "cms" | "aitools" | "analytics" | "users" | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  
  // AI Chat State
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([
    {
      id: "welcome",
      type: "ai",
      content: "Hello! I'm JoseyAI, your CoinKrazy admin assistant. I can help you with site management, content creation, user support, and analytics. What would you like to know?",
      timestamp: new Date(),
      read: true,
    },
  ]);
  const [chatMessage, setChatMessage] = useState("");
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  
  // CMS State
  const [sitePages, setSitePages] = useState<SitePage[]>([
    {
      id: "home",
      title: "Homepage",
      slug: "/",
      content: [],
      isPublished: true,
      lastModified: new Date(),
      createdBy: "admin",
    },
    {
      id: "slots",
      title: "Slots Page",
      slug: "/slots",
      content: [],
      isPublished: true,
      lastModified: new Date(),
      createdBy: "admin",
    },
    {
      id: "store",
      title: "Gold Coin Store",
      slug: "/store",
      content: [],
      isPublished: true,
      lastModified: new Date(),
      createdBy: "admin",
    },
  ]);
  
  const [currentPage, setCurrentPage] = useState<SitePage | null>(null);
  const [showNewPageModal, setShowNewPageModal] = useState(false);
  const [deviceView, setDeviceView] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishStatus, setPublishStatus] = useState<"idle" | "publishing" | "success" | "error">("idle");
  const [aiImagePrompt, setAiImagePrompt] = useState("");
  const [aiVideoPrompt, setAiVideoPrompt] = useState("");
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [generatedAssets, setGeneratedAssets] = useState<Array<{id: string, type: 'image' | 'video', url: string, prompt: string}>>([]);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Only show to admin users
  if (!user || user.role !== "admin") {
    return null;
  }

  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return;

    const userMessage: AIMessage = {
      id: `user_${Date.now()}`,
      type: "user",
      content: chatMessage,
      timestamp: new Date(),
      read: true,
    };

    setAiMessages(prev => [...prev, userMessage]);
    setChatMessage("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: AIMessage = {
        id: `ai_${Date.now()}`,
        type: "ai",
        content: generateAIResponse(chatMessage),
        timestamp: new Date(),
        read: false,
      };
      setAiMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const generateAIResponse = (message: string): string => {
    const responses = {
      analytics: "I can help you analyze your casino performance. Current stats show 2,847 active users, $145,672 in total deposits this month, and a 96.8% payment success rate. Would you like me to dive deeper into any specific metrics?",
      users: "Your user management system shows 15,473 total users with 156 pending KYC verifications. I can help you process these or check for any flagged accounts. What specific user management task do you need assistance with?",
      payments: "Payment systems are running smoothly with PayPal, Stripe, and Google Pay all active. Recent transaction volume is up 12% from last week. Need me to check any specific payment issues or process any pending withdrawals?",
      content: "I can help you create and manage content across your site. Would you like me to generate new slot game descriptions, update promotional banners, or help with SEO optimization for your pages?",
      default: "I'm here to help with any admin tasks! I can assist with user management, payment processing, content creation, analytics review, or technical support. Just let me know what you need help with.",
    };

    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes("analytic") || lowerMessage.includes("stats") || lowerMessage.includes("data")) {
      return responses.analytics;
    } else if (lowerMessage.includes("user") || lowerMessage.includes("player") || lowerMessage.includes("kyc")) {
      return responses.users;
    } else if (lowerMessage.includes("payment") || lowerMessage.includes("transaction") || lowerMessage.includes("deposit")) {
      return responses.payments;
    } else if (lowerMessage.includes("content") || lowerMessage.includes("page") || lowerMessage.includes("edit")) {
      return responses.content;
    } else {
      return responses.default;
    }
  };

  const markAllAsRead = () => {
    setAiMessages(prev => prev.map(msg => ({ ...msg, read: true })));
  };

  const markAllAsUnread = () => {
    setAiMessages(prev => prev.map(msg => ({ ...msg, read: false })));
  };

  const unreadCount = aiMessages.filter(msg => !msg.read && msg.type === "ai").length;

  const handleElementSelect = (elementId: string) => {
    setSelectedElement(elementId);
  };

  const handleCreateNewPage = () => {
    const newPage: SitePage = {
      id: `page_${Date.now()}`,
      title: "New Page",
      slug: "/new-page",
      content: [],
      isPublished: false,
      lastModified: new Date(),
      createdBy: user.username,
    };
    setSitePages(prev => [...prev, newPage]);
    setCurrentPage(newPage);
    setShowNewPageModal(false);
  };

  const handlePublishToGitHub = async () => {
    setIsPublishing(true);
    setPublishStatus("publishing");

    try {
      // Simulate GitHub publish API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      setPublishStatus("success");

      // Reset status after 3 seconds
      setTimeout(() => {
        setPublishStatus("idle");
        setIsPublishing(false);
      }, 3000);
    } catch (error) {
      setPublishStatus("error");
      setTimeout(() => {
        setPublishStatus("idle");
        setIsPublishing(false);
      }, 3000);
    }
  };

  const handleGenerateAIImage = async () => {
    if (!aiImagePrompt.trim()) return;

    setIsGeneratingImage(true);
    try {
      // Simulate AI image generation
      await new Promise(resolve => setTimeout(resolve, 5000));

      const newImage = {
        id: `img_${Date.now()}`,
        type: 'image' as const,
        url: `https://picsum.photos/800/600?random=${Date.now()}`,
        prompt: aiImagePrompt
      };

      setGeneratedAssets(prev => [newImage, ...prev]);
      setAiImagePrompt("");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleGenerateAIVideo = async () => {
    if (!aiVideoPrompt.trim()) return;

    setIsGeneratingVideo(true);
    try {
      // Simulate AI video generation
      await new Promise(resolve => setTimeout(resolve, 8000));

      const newVideo = {
        id: `vid_${Date.now()}`,
        type: 'video' as const,
        url: `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`,
        prompt: aiVideoPrompt
      };

      setGeneratedAssets(prev => [newVideo, ...prev]);
      setAiVideoPrompt("");
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  const getPublishButtonText = () => {
    switch (publishStatus) {
      case "publishing": return "Publishing...";
      case "success": return "Published!";
      case "error": return "Error";
      default: return "Publish to GitHub";
    }
  };

  const getPublishButtonClass = () => {
    switch (publishStatus) {
      case "publishing": return "bg-blue-600 hover:bg-blue-700";
      case "success": return "bg-green-600 hover:bg-green-700";
      case "error": return "bg-red-600 hover:bg-red-700";
      default: return "bg-purple-600 hover:bg-purple-700";
    }
  };

  return (
    <div className={`fixed top-0 left-0 right-0 z-[100] ${className}`}>
      {/* Admin Toolbar */}
      <div className="bg-gradient-to-r from-red-900 to-red-800 border-b border-red-700 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-bold">Admin Tools</span>
                <Badge className="bg-yellow-600 text-black">LIVE</Badge>
              </div>
              
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant={activePanel === "chat" ? "secondary" : "ghost"}
                  onClick={() => setActivePanel(activePanel === "chat" ? null : "chat")}
                  className="text-white hover:bg-red-700"
                  title="AI Assistant Chat"
                >
                  <MessageSquare className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <Badge className="ml-1 bg-blue-600 text-white text-xs">{unreadCount}</Badge>
                  )}
                </Button>

                <Button
                  size="sm"
                  variant={isEditMode ? "secondary" : "ghost"}
                  onClick={() => {
                    setIsEditMode(!isEditMode);
                    setActivePanel(isEditMode ? null : "editor");
                  }}
                  className="text-white hover:bg-red-700"
                  title="Visual Page Editor"
                >
                  <Edit className="w-4 h-4" />
                </Button>

                <Button
                  size="sm"
                  variant={activePanel === "cms" ? "secondary" : "ghost"}
                  onClick={() => setActivePanel(activePanel === "cms" ? null : "cms")}
                  className="text-white hover:bg-red-700"
                  title="CMS Pages Manager"
                >
                  <Layout className="w-4 h-4" />
                </Button>

                <Button
                  size="sm"
                  variant={activePanel === "aitools" ? "secondary" : "ghost"}
                  onClick={() => setActivePanel(activePanel === "aitools" ? null : "aitools")}
                  className="text-white hover:bg-red-700"
                  title="AI Content Generator"
                >
                  <Wand2 className="w-4 h-4" />
                </Button>

                <Button
                  size="sm"
                  variant={activePanel === "analytics" ? "secondary" : "ghost"}
                  onClick={() => setActivePanel(activePanel === "analytics" ? null : "analytics")}
                  className="text-white hover:bg-red-700"
                  title="Analytics Dashboard"
                >
                  <BarChart3 className="w-4 h-4" />
                </Button>

                <Button
                  size="sm"
                  variant={activePanel === "users" ? "secondary" : "ghost"}
                  onClick={() => setActivePanel(activePanel === "users" ? null : "users")}
                  className="text-white hover:bg-red-700"
                  title="User Management"
                >
                  <Users className="w-4 h-4" />
                </Button>

                <Button
                  size="sm"
                  onClick={handlePublishToGitHub}
                  disabled={isPublishing}
                  className={`text-white ${getPublishButtonClass()}`}
                  title="Publish Changes to GitHub Repository"
                >
                  {isPublishing ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : publishStatus === "success" ? (
                    <Github className="w-4 h-4" />
                  ) : publishStatus === "error" ? (
                    <X className="w-4 h-4" />
                  ) : (
                    <Github className="w-4 h-4" />
                  )}
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-red-700"
                  title="System Settings"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-white text-sm">
                Logged in as: <span className="font-bold">{user.username}</span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsVisible(false)}
                className="text-white hover:bg-red-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Chat Panel */}
      <AnimatePresence>
        {activePanel === "chat" && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="absolute top-12 right-4 w-96 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50"
          >
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Bot className="w-5 h-5 text-blue-400" />
                    JoseyAI Assistant
                  </CardTitle>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={markAllAsRead}
                      className="text-gray-400 hover:text-white"
                      title="Mark all as read"
                    >
                      <MailOpen className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={markAllAsUnread}
                      className="text-gray-400 hover:text-white"
                      title="Mark all as unread"
                    >
                      <Mail className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsChatMinimized(!isChatMinimized)}
                      className="text-gray-400 hover:text-white"
                    >
                      {isChatMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {!isChatMinimized && (
                <CardContent className="space-y-4">
                  <div 
                    ref={chatContainerRef}
                    className="h-64 overflow-y-auto space-y-2 bg-gray-800 rounded p-3"
                  >
                    {aiMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] p-2 rounded-lg ${
                            message.type === "user"
                              ? "bg-blue-600 text-white"
                              : `bg-gray-700 text-white ${!message.read ? "ring-2 ring-blue-500" : ""}`
                          }`}
                        >
                          <div className="text-sm">{message.content}</div>
                          <div className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Input
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Ask me about analytics, users, payments..."
                      className="flex-1 bg-gray-800 border-gray-600 text-white"
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    />
                    <Button 
                      onClick={handleSendMessage}
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={!chatMessage.trim()}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {["Show user stats", "Payment summary", "Recent activity", "Site performance"].map((suggestion) => (
                      <Button
                        key={suggestion}
                        size="sm"
                        variant="outline"
                        onClick={() => setChatMessage(suggestion)}
                        className="text-xs border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Visual Editor Panel */}
      <AnimatePresence>
        {activePanel === "editor" && isEditMode && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="absolute top-12 left-4 w-80 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50"
          >
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Edit className="w-5 h-5 text-green-400" />
                    Page Editor
                  </CardTitle>
                  <Badge className="bg-green-600 text-white text-xs">LIVE EDIT</Badge>
                </div>
                <div className="text-xs text-gray-400">
                  Click any element on the page to edit instantly
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs defaultValue="elements" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="elements">Elements</TabsTrigger>
                    <TabsTrigger value="styles">Styles</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                  </TabsList>

                  <TabsContent value="elements" className="space-y-2">
                    <div className="text-sm text-gray-400 mb-2">Add Elements</div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button size="sm" variant="outline" className="flex flex-col gap-1 h-auto py-2">
                        <Type className="w-4 h-4" />
                        <span className="text-xs">Text</span>
                      </Button>
                      <Button size="sm" variant="outline" className="flex flex-col gap-1 h-auto py-2">
                        <Image className="w-4 h-4" />
                        <span className="text-xs">Image</span>
                      </Button>
                      <Button size="sm" variant="outline" className="flex flex-col gap-1 h-auto py-2">
                        <Square className="w-4 h-4" />
                        <span className="text-xs">Button</span>
                      </Button>
                      <Button size="sm" variant="outline" className="flex flex-col gap-1 h-auto py-2">
                        <Layout className="w-4 h-4" />
                        <span className="text-xs">Section</span>
                      </Button>
                    </div>

                    <div className="text-sm text-gray-400 mb-2 mt-4">Text Formatting</div>
                    <div className="grid grid-cols-3 gap-1">
                      <Button size="sm" variant="outline"><Bold className="w-4 h-4" /></Button>
                      <Button size="sm" variant="outline"><Italic className="w-4 h-4" /></Button>
                      <Button size="sm" variant="outline"><Underline className="w-4 h-4" /></Button>
                      <Button size="sm" variant="outline"><AlignLeft className="w-4 h-4" /></Button>
                      <Button size="sm" variant="outline"><AlignCenter className="w-4 h-4" /></Button>
                      <Button size="sm" variant="outline"><AlignRight className="w-4 h-4" /></Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="styles" className="space-y-3">
                    {selectedElement ? (
                      <>
                        <div className="text-sm text-gray-400">Element Styles</div>
                        <div className="space-y-2">
                          <div>
                            <Label className="text-white text-sm">Background Color</Label>
                            <div className="flex gap-2 mt-1">
                              <Input type="color" className="w-16 h-8" />
                              <Input placeholder="#ffffff" className="flex-1 h-8" />
                            </div>
                          </div>
                          <div>
                            <Label className="text-white text-sm">Text Color</Label>
                            <div className="flex gap-2 mt-1">
                              <Input type="color" className="w-16 h-8" />
                              <Input placeholder="#000000" className="flex-1 h-8" />
                            </div>
                          </div>
                          <div>
                            <Label className="text-white text-sm">Font Size</Label>
                            <Select>
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Select size" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="sm">Small</SelectItem>
                                <SelectItem value="md">Medium</SelectItem>
                                <SelectItem value="lg">Large</SelectItem>
                                <SelectItem value="xl">Extra Large</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center text-gray-400 py-4">
                        Select an element to edit its styles
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="settings" className="space-y-3">
                    <div className="text-sm text-gray-400">Device Preview</div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant={deviceView === "desktop" ? "default" : "outline"}
                        onClick={() => setDeviceView("desktop")}
                      >
                        <Monitor className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant={deviceView === "tablet" ? "default" : "outline"}
                        onClick={() => setDeviceView("tablet")}
                      >
                        <Tablet className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant={deviceView === "mobile" ? "default" : "outline"}
                        onClick={() => setDeviceView("mobile")}
                      >
                        <Smartphone className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button size="sm" variant="outline" className="w-full">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CMS Pages Panel */}
      <AnimatePresence>
        {activePanel === "cms" && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="absolute top-12 right-4 w-96 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50"
          >
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Layout className="w-5 h-5 text-purple-400" />
                    CMS Pages & Editor
                  </CardTitle>
                  <Button
                    size="sm"
                    onClick={() => setShowNewPageModal(true)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {sitePages.map((page) => (
                    <div
                      key={page.id}
                      className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
                    >
                      <div>
                        <div className="text-white font-medium">{page.title}</div>
                        <div className="text-gray-400 text-sm">{page.slug}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={page.isPublished ? "default" : "secondary"}>
                          {page.isPublished ? "Published" : "Draft"}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setCurrentPage(page)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {currentPage && (
                  <div className="border-t border-gray-700 pt-4">
                    <div className="text-white font-medium mb-2">
                      Editing: {currentPage.title}
                    </div>
                    <div className="space-y-2">
                      <Button size="sm" className="w-full">
                        <Edit className="w-4 h-4 mr-2" />
                        Open Visual Editor
                      </Button>
                      <Button size="sm" variant="outline" className="w-full">
                        <Code className="w-4 h-4 mr-2" />
                        View Source Code
                      </Button>
                      <Button size="sm" variant="outline" className="w-full">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview Page
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Tools Panel */}
      <AnimatePresence>
        {activePanel === "aitools" && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="absolute top-12 left-4 w-96 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50"
          >
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-white flex items-center gap-2">
                  <Wand2 className="w-5 h-5 text-purple-400" />
                  AI Content Generator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Tabs defaultValue="images" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="images">AI Images</TabsTrigger>
                    <TabsTrigger value="videos">AI Videos</TabsTrigger>
                  </TabsList>

                  <TabsContent value="images" className="space-y-4">
                    <div className="space-y-3">
                      <Label className="text-white text-sm">Generate AI Image</Label>
                      <Textarea
                        value={aiImagePrompt}
                        onChange={(e) => setAiImagePrompt(e.target.value)}
                        placeholder="Describe the image you want to generate..."
                        className="bg-gray-800 border-gray-600 text-white min-h-[80px]"
                      />
                      <Button
                        onClick={handleGenerateAIImage}
                        disabled={isGeneratingImage || !aiImagePrompt.trim()}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        {isGeneratingImage ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <ImageIcon className="w-4 h-4 mr-2" />
                            Generate Image
                          </>
                        )}
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="videos" className="space-y-4">
                    <div className="space-y-3">
                      <Label className="text-white text-sm">Generate AI Video</Label>
                      <Textarea
                        value={aiVideoPrompt}
                        onChange={(e) => setAiVideoPrompt(e.target.value)}
                        placeholder="Describe the video you want to generate..."
                        className="bg-gray-800 border-gray-600 text-white min-h-[80px]"
                      />
                      <Button
                        onClick={handleGenerateAIVideo}
                        disabled={isGeneratingVideo || !aiVideoPrompt.trim()}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                      >
                        {isGeneratingVideo ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Video className="w-4 h-4 mr-2" />
                            Generate Video
                          </>
                        )}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Generated Assets */}
                {generatedAssets.length > 0 && (
                  <div className="border-t border-gray-700 pt-4">
                    <div className="text-white font-medium mb-3">Recent Generations</div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {generatedAssets.slice(0, 5).map((asset) => (
                        <div key={asset.id} className="flex items-center gap-3 p-2 bg-gray-800 rounded">
                          <div className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center">
                            {asset.type === 'image' ? (
                              <ImageIcon className="w-6 h-6 text-gray-400" />
                            ) : (
                              <Video className="w-6 h-6 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-white text-sm truncate">{asset.prompt}</div>
                            <div className="text-gray-400 text-xs">{asset.type}</div>
                          </div>
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analytics Panel */}
      <AnimatePresence>
        {activePanel === "analytics" && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="absolute top-12 right-4 w-96 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50"
          >
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-400" />
                  Analytics Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-800 p-3 rounded">
                    <div className="text-gray-400 text-xs">Active Users</div>
                    <div className="text-white text-xl font-bold">2,847</div>
                    <div className="text-green-400 text-xs">+12%</div>
                  </div>
                  <div className="bg-gray-800 p-3 rounded">
                    <div className="text-gray-400 text-xs">Total Revenue</div>
                    <div className="text-white text-xl font-bold">$145K</div>
                    <div className="text-green-400 text-xs">+8%</div>
                  </div>
                  <div className="bg-gray-800 p-3 rounded">
                    <div className="text-gray-400 text-xs">Games Played</div>
                    <div className="text-white text-xl font-bold">18,392</div>
                    <div className="text-green-400 text-xs">+15%</div>
                  </div>
                  <div className="bg-gray-800 p-3 rounded">
                    <div className="text-gray-400 text-xs">Conversion</div>
                    <div className="text-white text-xl font-bold">96.8%</div>
                    <div className="text-red-400 text-xs">-0.2%</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                  <Button size="sm" variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Management Panel */}
      <AnimatePresence>
        {activePanel === "users" && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="absolute top-12 right-4 w-96 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50"
          >
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-orange-400" />
                    User Management
                  </CardTitle>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" title="Search users">
                      <Search className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" title="Filter users">
                      <Filter className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-gray-800 p-2 rounded">
                    <div className="text-white text-lg font-bold">15,473</div>
                    <div className="text-gray-400 text-xs">Total Users</div>
                  </div>
                  <div className="bg-gray-800 p-2 rounded">
                    <div className="text-white text-lg font-bold">2,847</div>
                    <div className="text-gray-400 text-xs">Online</div>
                  </div>
                  <div className="bg-gray-800 p-2 rounded">
                    <div className="text-white text-lg font-bold">156</div>
                    <div className="text-gray-400 text-xs">Pending KYC</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-gray-400">Quick Actions</div>
                  <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                    <Shield className="w-4 h-4 mr-2" />
                    Process KYC Queue
                  </Button>
                  <Button size="sm" variant="outline" className="w-full">
                    <Bell className="w-4 h-4 mr-2" />
                    Send Notifications
                  </Button>
                  <Button size="sm" variant="outline" className="w-full">
                    <Database className="w-4 h-4 mr-2" />
                    User Analytics
                  </Button>
                </div>

                <div className="border-t border-gray-700 pt-3">
                  <div className="text-sm text-gray-400 mb-2">Recent Activity</div>
                  <div className="space-y-1 text-xs">
                    <div className="text-gray-300">New user registration: player123</div>
                    <div className="text-gray-300">KYC approved: highroller99</div>
                    <div className="text-gray-300">Account suspended: spammer01</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Mode Overlay */}
      {isEditMode && (
        <div className="fixed inset-0 bg-blue-600/10 pointer-events-none z-40">
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
            <div className="flex items-center gap-2">
              <Edit className="w-4 h-4" />
              <span className="font-medium">Edit Mode Active</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditMode(false)}
                className="text-white hover:bg-blue-700 ml-2"
              >
                Exit
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Restore Button when hidden */}
      {!isVisible && (
        <motion.button
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => setIsVisible(true)}
          className="fixed top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg hover:shadow-xl transition-all z-50"
        >
          <Crown className="w-4 h-4 mr-1 inline" />
          Show Admin Tools
        </motion.button>
      )}
    </div>
  );
};
