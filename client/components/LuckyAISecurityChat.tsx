import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Send,
  MessageSquare,
  AlertTriangle,
  Shield,
  Eye,
  Zap,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Users,
  CreditCard,
  Ban,
  Flag,
  Activity,
  Settings,
  Minimize2,
  Maximize2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { useAuth } from "./AuthContext";

interface ChatMessage {
  id: string;
  sender: "admin" | "luckyai";
  content: string;
  timestamp: Date;
  type: "message" | "alert" | "recommendation" | "action";
  metadata?: {
    severity?: "low" | "medium" | "high" | "critical";
    category?: string;
    relatedUserId?: string;
    relatedLogId?: string;
    actionTaken?: string;
    confidence?: number;
  };
}

interface SecurityAlert {
  id: string;
  type: "fraud" | "suspicious_login" | "bot_activity" | "withdrawal_review" | "system_alert";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  userId?: string;
  username?: string;
  timestamp: Date;
  status: "new" | "acknowledged" | "investigating" | "resolved";
  aiRecommendation?: string;
  autoAction?: string;
}

interface LuckyAISecurityChatProps {
  isOpen: boolean;
  onToggle: () => void;
  alerts?: SecurityAlert[];
  onAlertAction?: (alertId: string, action: string) => void;
}

export const LuckyAISecurityChat: React.FC<LuckyAISecurityChatProps> = ({
  isOpen,
  onToggle,
  alerts = [],
  onAlertAction,
}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      initializeChat();
      // Focus input when chat opens
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Send new alerts to LuckyAI
    if (alerts.length > 0) {
      const latestAlert = alerts[alerts.length - 1];
      if (latestAlert.status === "new") {
        handleNewAlert(latestAlert);
      }
    }
  }, [alerts]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const initializeChat = () => {
    const welcomeMessage: ChatMessage = {
      id: "welcome_001",
      sender: "luckyai",
      content: `🛡️ Hello ${user?.username || "Admin"}! I'm LuckyAI, your intelligent security agent for CoinKrazy.com.

I'm actively monitoring the platform for:
• Fraudulent transactions and suspicious activity
• Bot detection and automated threats  
• Account security violations
• Unusual betting patterns
• Payment fraud attempts

I've analyzed ${Math.floor(Math.random() * 1000) + 500} security events in the last 24 hours and identified ${Math.floor(Math.random() * 20) + 5} items requiring attention.

How can I assist you with platform security today?`,
      timestamp: new Date(),
      type: "message",
      metadata: {
        confidence: 100,
        category: "introduction",
      },
    };

    setMessages([welcomeMessage]);
  };

  const handleNewAlert = (alert: SecurityAlert) => {
    const alertMessage: ChatMessage = {
      id: `alert_${alert.id}`,
      sender: "luckyai",
      content: generateAlertMessage(alert),
      timestamp: new Date(),
      type: "alert",
      metadata: {
        severity: alert.severity,
        category: alert.type,
        relatedUserId: alert.userId,
        confidence: 95,
      },
    };

    setMessages((prev) => [...prev, alertMessage]);
  };

  const generateAlertMessage = (alert: SecurityAlert): string => {
    const severityEmoji = {
      low: "🟡",
      medium: "🟠", 
      high: "🔴",
      critical: "🚨"
    };

    const typeDescriptions = {
      fraud: "Potential fraud detected",
      suspicious_login: "Suspicious login activity",
      bot_activity: "Automated bot behavior identified",
      withdrawal_review: "Large withdrawal requires review",
      system_alert: "System security alert"
    };

    return `${severityEmoji[alert.severity]} **${alert.severity.toUpperCase()} ALERT:** ${typeDescriptions[alert.type]}

**Details:** ${alert.description}
${alert.username ? `**User:** @${alert.username}` : ""}
**Time:** ${alert.timestamp.toLocaleString()}

${alert.aiRecommendation ? `**My Recommendation:** ${alert.aiRecommendation}` : ""}
${alert.autoAction ? `**Auto Action Taken:** ${alert.autoAction}` : ""}

Would you like me to investigate this further or take immediate action?`;
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: "admin",
      content: newMessage,
      timestamp: new Date(),
      type: "message",
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");
    setIsTyping(true);

    // Simulate LuckyAI processing time
    setTimeout(() => {
      const aiResponse = generateAIResponse(newMessage);
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const generateAIResponse = (userInput: string): ChatMessage => {
    const input = userInput.toLowerCase();

    let response = "";
    let messageType: "message" | "recommendation" | "action" = "message";
    let metadata = { confidence: 85 };

    if (input.includes("fraud") || input.includes("suspicious")) {
      response = `🔍 **Fraud Analysis Complete**

I've detected the following suspicious patterns in the last 24 hours:

• **3 accounts** with identical device fingerprints making large deposits
• **12 users** attempting withdrawals exceeding their deposit history by 300%+  
• **1 IP address** creating 7 different accounts in 2 hours
• **5 transactions** flagged for unusual timing patterns

**Immediate Actions Recommended:**
1. Review flagged withdrawals manually (Est. fraud prevention: $15,000)
2. Implement enhanced KYC for high-risk accounts
3. Temporarily limit new account registrations from flagged IP ranges

Shall I proceed with these protective measures?`;
      messageType = "recommendation";
      metadata.confidence = 92;
    } else if (input.includes("bot") || input.includes("automation")) {
      response = `🤖 **Bot Detection Report**

Current bot activity analysis:
• **127 confirmed bot accounts** identified and suspended
• **15% of traffic** shows non-human behavioral patterns
• **Bot success rate** at bypassing current defenses: 4.2%

**Active Countermeasures:**
✅ Behavioral analysis algorithms running
✅ CAPTCHA challenges deployed for suspicious patterns  
✅ Machine learning model updated with latest bot signatures

**Recommendation:** Deploy advanced challenge-response system for accounts with risk score >75. This will reduce bot effectiveness by an estimated 85%.`;
      messageType = "recommendation";
      metadata.confidence = 96;
    } else if (input.includes("user") || input.includes("account")) {
      response = `👤 **User Account Analysis**

I can help you investigate any user account. Please provide:
• Username or User ID
• Specific concern (login issues, transaction patterns, etc.)

**Quick Stats:**
• **2,847 active users** in last 24h
• **156 failed login attempts** (5.5% failure rate)
• **23 accounts** currently under review
• **892 unique users** with successful transactions

What specific user account would you like me to analyze?`;
    } else if (input.includes("transaction") || input.includes("payment")) {
      response = `💳 **Transaction Security Overview**

Recent transaction analysis:
• **1,205 successful transactions** processed
• **18 transactions flagged** for manual review (1.5% flag rate)
• **$247,890 total volume** processed safely
• **Average fraud loss per incident:** $2,100

**High-Risk Indicators I'm Monitoring:**
🔍 Rapid consecutive transactions
🔍 Unusual geographic patterns  
🔍 Mismatched payment methods
🔍 Velocity-based anomalies

**Current Protection Level:** 94.2% fraud prevention rate

Need me to investigate a specific transaction or user?`;
      messageType = "recommendation";
    } else if (input.includes("help") || input.includes("what") || input.includes("how")) {
      response = `🛡️ **LuckyAI Security Commands**

I can help you with:

**🔍 Investigation Commands:**
• "Check user [username]" - Full account analysis
• "Analyze transaction [ID]" - Transaction forensics  
• "Review fraud patterns" - Current fraud landscape
• "Bot detection status" - Automated threat overview

**⚡ Action Commands:**
• "Block user [username]" - Emergency account suspension
• "Flag IP [address]" - Add IP to watchlist
• "Freeze account [username]" - Temporary account hold
• "Approve withdrawal [ID]" - Manual approval override

**📊 Reporting Commands:**
• "Security summary" - 24h platform overview
• "Threat assessment" - Current risk levels
• "Generate report" - Comprehensive security report

**🚨 Emergency Commands:**
• "EMERGENCY" - Immediate critical alert investigation
• "LOCKDOWN" - Platform-wide security measures

What would you like me to help with?`;
    } else if (input.includes("block") || input.includes("ban") || input.includes("suspend")) {
      const username = extractUsername(input);
      if (username) {
        response = `🚫 **Account Action: ${username}**

**Pre-Action Security Scan:**
• Account created: 45 days ago
• Last login: 2 hours ago  
• Transaction history: 23 deposits, 1 withdrawal attempt
• Risk score: 87/100 (HIGH)
• Flagged activities: Multiple device logins, unusual bet patterns

**Recommended Actions:**
1. **Temporary Suspension** (24-48 hours) - Low impact
2. **Account Freeze** (Pending investigation) - Medium impact  
3. **Permanent Ban** (High confidence fraud) - High impact

**Evidence Summary:**
• Same payment method used on 3 other flagged accounts
• Login pattern indicates bot-like behavior
• Withdrawal request exceeds deposits by 400%

Shall I proceed with the suspension? I can also gather additional evidence first.`;
        messageType = "action";
        metadata.confidence = 89;
      } else {
        response = "Please specify which user account you'd like me to investigate for suspension. Use format: 'block user [username]'";
      }
    } else {
      // General AI assistant response
      const responses = [
        `I'm analyzing the platform security continuously. ${Math.floor(Math.random() * 50) + 20} security events processed in the last hour. Is there a specific security concern I can help investigate?`,
        
        `Current platform status: 🟢 SECURE. All monitoring systems operational. ${Math.floor(Math.random() * 15) + 5} minor flags under review. How can I assist with security operations?`,
        
        `I've updated my threat detection models based on the latest patterns. Bot detection improved by 12% and fraud prevention by 8% in the last update. What security task needs attention?`,
        
        `Security dashboard shows ${Math.floor(Math.random() * 10) + 3} items requiring admin review. I can prioritize these by risk level and provide detailed analysis. Which area interests you most?`
      ];
      
      response = responses[Math.floor(Math.random() * responses.length)];
    }

    return {
      id: `ai_${Date.now()}`,
      sender: "luckyai",
      content: response,
      timestamp: new Date(),
      type: messageType,
      metadata,
    };
  };

  const extractUsername = (input: string): string | null => {
    const match = input.match(/(?:user|block|ban|suspend)\s+[@]?(\w+)/i);
    return match ? match[1] : null;
  };

  const handleQuickAction = (action: string) => {
    setNewMessage(action);
    handleSendMessage();
  };

  const getMessageIcon = (message: ChatMessage) => {
    if (message.sender === "admin") return null;
    
    switch (message.type) {
      case "alert":
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case "recommendation":
        return <TrendingUp className="h-4 w-4 text-blue-400" />;
      case "action":
        return <Shield className="h-4 w-4 text-green-400" />;
      default:
        return <Bot className="h-4 w-4 text-purple-400" />;
    }
  };

  const formatMessageContent = (content: string) => {
    // Convert markdown-style formatting to JSX
    return content.split('\n').map((line, index) => {
      let formattedLine = line;
      
      // Bold text
      formattedLine = formattedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      // Bullet points  
      if (line.trim().startsWith('•')) {
        return (
          <div key={index} className="ml-4 flex items-start gap-2">
            <span className="text-gold mt-1">•</span>
            <span dangerouslySetInnerHTML={{ __html: formattedLine.replace(/^•\s*/, '') }} />
          </div>
        );
      }
      
      // Numbered lists
      if (/^\d+\./.test(line.trim())) {
        return (
          <div key={index} className="ml-4 flex items-start gap-2">
            <span className="text-blue-400 font-bold">{line.match(/^\d+/)?.[0]}.</span>
            <span dangerouslySetInnerHTML={{ __html: formattedLine.replace(/^\d+\.\s*/, '') }} />
          </div>
        );
      }
      
      return (
        <div key={index} dangerouslySetInnerHTML={{ __html: formattedLine }} />
      );
    });
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed bottom-4 right-4 z-50"
    >
      <Card className="w-96 h-[600px] bg-gray-900 border-purple-500/50 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Bot className="h-6 w-6" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              </div>
              <div>
                <CardTitle className="text-lg">LuckyAI Security</CardTitle>
                <div className="text-xs opacity-90">Intelligent Security Agent</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:bg-white/20"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={onToggle}
                className="text-white hover:bg-white/20"
              >
                ✕
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-[calc(600px-80px)]">
            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`flex ${message.sender === "admin" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-lg p-3 ${
                          message.sender === "admin"
                            ? "bg-blue-600 text-white"
                            : message.type === "alert"
                              ? "bg-red-900/50 border border-red-500/50 text-red-100"
                              : message.type === "recommendation" 
                                ? "bg-blue-900/50 border border-blue-500/50 text-blue-100"
                                : message.type === "action"
                                  ? "bg-green-900/50 border border-green-500/50 text-green-100"
                                  : "bg-gray-800 text-gray-100"
                        }`}
                      >
                        {message.sender === "luckyai" && (
                          <div className="flex items-center gap-2 mb-2">
                            {getMessageIcon(message)}
                            <span className="text-xs opacity-75">
                              LuckyAI {message.metadata?.confidence && `• ${message.metadata.confidence}% confidence`}
                            </span>
                          </div>
                        )}
                        
                        <div className="text-sm whitespace-pre-wrap">
                          {typeof message.content === 'string' ? formatMessageContent(message.content) : message.content}
                        </div>
                        
                        <div className="text-xs opacity-60 mt-2">
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-gray-800 text-gray-100 rounded-lg p-3 max-w-[85%]">
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4 text-purple-400" />
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Quick Actions */}
            <div className="p-2 border-t border-gray-700">
              <div className="flex flex-wrap gap-1 mb-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleQuickAction("Security summary")}
                  className="text-xs"
                >
                  📊 Summary
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleQuickAction("Review fraud patterns")}
                  className="text-xs"
                >
                  🔍 Fraud
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleQuickAction("Bot detection status")}
                  className="text-xs"
                >
                  🤖 Bots
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleQuickAction("Help")}
                  className="text-xs"
                >
                  ❓ Help
                </Button>
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-700">
              <div className="flex items-center gap-2">
                <Input
                  ref={inputRef}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Ask LuckyAI about security..."
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isTyping}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </motion.div>
  );
};
