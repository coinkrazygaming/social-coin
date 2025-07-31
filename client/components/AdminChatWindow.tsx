import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Users,
  Mic,
  MicOff,
  Settings,
  Download,
  Trash2,
  Bot,
  User,
  Shield,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { aiEmployeeChat } from "../../shared/aiEmployeeChat";
import { AdminChatMessage, AIEmployee } from "../../shared/adminToolbarTypes";
import { useAuth } from "./AuthContext";

interface AdminChatWindowProps {
  onUnreadChange?: (count: number) => void;
}

export const AdminChatWindow: React.FC<AdminChatWindowProps> = ({
  onUnreadChange,
}) => {
  const [messages, setMessages] = useState<AdminChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [employees, setEmployees] = useState<AIEmployee[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Initialize chat system
    setMessages(aiEmployeeChat.getChatHistory());
    setEmployees(aiEmployeeChat.getEmployees());

    // Listen for new messages
    const handleNewMessage = (message: AdminChatMessage) => {
      setMessages((prev) => [...prev, message]);
      if (!isVisible && message.senderType === "ai_employee") {
        setUnreadCount((prev) => prev + 1);
      }
      scrollToBottom();
    };

    aiEmployeeChat.addMessageListener(handleNewMessage);

    return () => {
      aiEmployeeChat.removeMessageListener(handleNewMessage);
    };
  }, [isVisible]);

  useEffect(() => {
    if (onUnreadChange) {
      onUnreadChange(unreadCount);
    }
  }, [unreadCount, onUnreadChange]);

  useEffect(() => {
    if (isVisible) {
      setUnreadCount(0);
    }
  }, [isVisible]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !user) return;

    aiEmployeeChat.sendMessage(
      user.id,
      user.username || "Admin",
      "admin",
      newMessage,
    );

    setNewMessage("");
    scrollToBottom();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getMessageTypeColor = (message: AdminChatMessage) => {
    if (message.senderType === "admin") return "bg-blue-600";
    if (message.senderType === "staff") return "bg-green-600";
    return "bg-purple-600";
  };

  const getEmployeeStatus = (employee: AIEmployee) => {
    const colors = {
      online: "bg-green-500",
      busy: "bg-yellow-500",
      offline: "bg-gray-500",
    };
    return colors[employee.status];
  };

  const exportChat = () => {
    const chatData = aiEmployeeChat.exportChatHistory();
    const blob = new Blob([chatData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `admin-chat-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearChat = () => {
    if (confirm("Are you sure you want to clear the chat history?")) {
      aiEmployeeChat.clearChat();
      setMessages([]);
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[600px]">
      {/* AI Employees Status Bar */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Bot className="w-4 h-4" />
            AI Employees (
            {employees.filter((e) => e.status === "online").length} online)
          </h4>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={exportChat}
              title="Export Chat"
            >
              <Download className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              title="Clear Chat"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {employees.map((employee) => (
            <div
              key={employee.id}
              className="flex items-center gap-2 bg-white dark:bg-gray-700 rounded-lg px-2 py-1 text-xs"
            >
              <div className="relative">
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="text-xs bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                    {employee.avatar}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-700 ${getEmployeeStatus(employee)}`}
                />
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {employee.name}
                </div>
                <div className="text-gray-500 dark:text-gray-400">
                  {employee.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-3">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 ${message.senderType === "admin" ? "justify-end" : "justify-start"}`}
              >
                {message.senderType !== "admin" && (
                  <Avatar className="w-8 h-8 mt-1">
                    <AvatarFallback
                      className={`text-white text-xs ${getMessageTypeColor(message)}`}
                    >
                      {message.senderType === "ai_employee" ? (
                        employees.find((e) => e.id === message.senderId)
                          ?.avatar || "🤖"
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={`max-w-[80%] ${message.senderType === "admin" ? "order-first" : ""}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-gray-900 dark:text-white">
                      {message.senderName}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTimestamp(message.timestamp)}
                    </span>
                    {message.senderType === "ai_employee" && (
                      <Badge variant="secondary" className="text-xs">
                        AI
                      </Badge>
                    )}
                  </div>

                  <div
                    className={`p-3 rounded-lg ${
                      message.senderType === "admin"
                        ? "bg-blue-600 text-white ml-auto"
                        : message.senderType === "ai_employee"
                          ? "bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {message.message}
                    </p>
                  </div>
                </div>

                {message.senderType === "admin" && (
                  <Avatar className="w-8 h-8 mt-1">
                    <AvatarFallback className="bg-blue-600 text-white text-xs">
                      <Shield className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message to AI employees..."
              className="pr-10"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2"
              onClick={() => setIsRecording(!isRecording)}
              title={isRecording ? "Stop Recording" : "Voice Input"}
            >
              {isRecording ? (
                <MicOff className="w-4 h-4 text-red-500" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </Button>
          </div>

          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span>
            {employees.filter((e) => e.status === "online").length} AI agents
            online
          </span>
        </div>
      </div>

      {/* AI Employee Details Modal */}
      <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="text-xs text-blue-700 dark:text-blue-300">
          <strong>LuckyAI</strong> coordinates all operations and provides
          oversight. Ask about status, reports, or any casino operations.
        </div>
      </div>
    </div>
  );
};
