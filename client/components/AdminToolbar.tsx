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
  const [activePanel, setActivePanel] = useState<"chat" | "editor" | "cms" | null>(null);
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
              
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant={activePanel === "chat" ? "secondary" : "ghost"}
                  onClick={() => setActivePanel(activePanel === "chat" ? null : "chat")}
                  className="text-white hover:bg-red-700"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  AI Assistant
                  {unreadCount > 0 && (
                    <Badge className="ml-2 bg-blue-600 text-white">{unreadCount}</Badge>
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
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Visual Editor
                </Button>

                <Button
                  size="sm"
                  variant={activePanel === "cms" ? "secondary" : "ghost"}
                  onClick={() => setActivePanel(activePanel === "cms" ? null : "cms")}
                  className="text-white hover:bg-red-700"
                >
                  <Layout className="w-4 h-4 mr-2" />
                  CMS Pages
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
                      <MarkMessageRead className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={markAllAsUnread}
                      className="text-gray-400 hover:text-white"
                      title="Mark all as unread"
                    >
                      <MarkMessageUnread className="w-4 h-4" />
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
                <CardTitle className="text-white flex items-center gap-2">
                  <Edit className="w-5 h-5 text-green-400" />
                  Visual Editor
                </CardTitle>
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
