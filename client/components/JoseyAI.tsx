import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Bot,
  Send,
  Lightbulb,
  Code,
  Zap,
  MessageCircle,
  Sparkles,
  Brain,
  Settings,
  FileCode,
  Palette,
  Play,
} from "lucide-react";
import { JoseyAIResponse } from "@shared/slotTypes";

interface JoseyAIProps {
  context: "slot-editor" | "general" | "debugging";
  currentSlot?: any;
  onSuggestionApply?: (suggestion: string) => void;
  onCodeGenerate?: (code: string) => void;
}

interface ChatMessage {
  id: string;
  type: "user" | "ai";
  message: string;
  timestamp: Date;
  suggestions?: string[];
  codeExample?: string;
  nextSteps?: string[];
}

export function JoseyAI({
  context,
  currentSlot,
  onSuggestionApply,
  onCodeGenerate,
}: JoseyAIProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize with context-specific welcome message
    const welcomeMessage = getWelcomeMessage();
    setMessages([welcomeMessage]);
  }, [context]);

  const getWelcomeMessage = (): ChatMessage => {
    const baseMessage = {
      id: "welcome",
      type: "ai" as const,
      timestamp: new Date(),
    };

    switch (context) {
      case "slot-editor":
        return {
          ...baseMessage,
          message:
            "Hey there! I'm JoseyAI, your personal slot development assistant! 🎰✨\n\nI'm here to help you create amazing CoinKrazy in-house slot games. I can guide you through:\n\n• Symbol design and configuration\n• Reel setup and payline creation\n• RTP balancing and math modeling\n• Visual effects and animations\n• Theme development\n• Testing and optimization\n\nWhat would you like to work on first?",
          suggestions: [
            "Create a new slot machine",
            "Modify existing symbols",
            "Adjust RTP settings",
            "Add bonus features",
            "Preview current slot",
          ],
          nextSteps: [
            "Tell me about your slot theme idea",
            "Show me the current slot configuration",
            "Let's start with symbol design",
          ],
        };

      case "debugging":
        return {
          ...baseMessage,
          message:
            "I'm JoseyAI, ready to help debug your slot machine! 🔧\n\nI can help you identify and fix:\n\n• Payout calculation issues\n• Symbol probability problems\n• Animation glitches\n• Performance optimization\n• Logic errors\n\nWhat seems to be the issue?",
          suggestions: [
            "Check RTP calculations",
            "Debug symbol weights",
            "Fix animation issues",
            "Optimize performance",
          ],
        };

      default:
        return {
          ...baseMessage,
          message:
            "Hello! I'm JoseyAI, your CoinKrazy development assistant! 🚀\n\nI'm here to help with all aspects of your casino platform development. How can I assist you today?",
          suggestions: [
            "Slot machine development",
            "Mini game creation",
            "Platform optimization",
            "User experience improvements",
          ],
        };
    }
  };

  const generateAIResponse = async (
    userMessage: string,
  ): Promise<JoseyAIResponse> => {
    // Simulate AI processing time
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 2000),
    );

    // AI Response logic based on context and user input
    const lowerMessage = userMessage.toLowerCase();

    if (context === "slot-editor") {
      if (
        lowerMessage.includes("create") ||
        lowerMessage.includes("new slot")
      ) {
        return {
          message:
            "Excellent! Let's create a new slot machine for CoinKrazy! 🎰\n\nFirst, let's decide on the theme. Popular themes include:\n\n• **Video Game Adventures** - Retro gaming symbols with power-ups\n• **Crypto Fortune** - Digital coins, blockchains, and mining themes\n• **Space Odyssey** - Futuristic symbols with cosmic rewards\n• **Wild West Gold** - Cowboys, gold nuggets, and saloons\n• **Mystic Magic** - Wizards, potions, and magical creatures\n\nWhat theme appeals to you? I'll help you design symbols that fit perfectly!",
          suggestions: [
            "Video Game Adventure theme",
            "Crypto Fortune theme",
            "Space Odyssey theme",
            "Custom theme idea",
          ],
          nextSteps: [
            "Choose your preferred theme",
            "Design custom symbols",
            "Set up reel configuration",
          ],
          confidence: 0.95,
        };
      }

      if (lowerMessage.includes("symbol") || lowerMessage.includes("design")) {
        return {
          message:
            "Great choice! Symbol design is crucial for player engagement! 🎨\n\nFor CoinKrazy slots, I recommend:\n\n**High-Value Symbols (Rare):**\n• CoinKrazy Logo (Wild) - 1000x multiplier\n• Golden Bitcoin - 500x payout\n• Diamond Trophy - 250x payout\n\n**Medium-Value Symbols:**\n• Lucky 7s - 100x payout\n• Gold Bars - 75x payout\n• Gem Clusters - 50x payout\n\n**Low-Value Symbols:**\n• Playing Cards (A, K, Q, J) - 10-25x payout\n\nWant me to generate the symbol configuration code?",
          suggestions: [
            "Generate symbol code",
            "Customize symbol values",
            "Add special symbols",
            "Preview symbol design",
          ],
          codeExample: `const coinKrazySymbols: SlotSymbol[] = [
  {
    id: 'wild_logo',
    name: 'CoinKrazy Wild',
    image: '/symbols/coinkrazy_wild.png',
    value: 1000,
    rarity: 'legendary',
    multiplier: 2,
    color: '#FFD700',
    animation: 'sparkle_wild'
  },
  {
    id: 'golden_bitcoin',
    name: 'Golden Bitcoin', 
    image: '/symbols/golden_bitcoin.png',
    value: 500,
    rarity: 'epic',
    multiplier: 1,
    color: '#FFA500'
  }
];`,
          nextSteps: [
            "Apply symbol configuration",
            "Set up reel weights",
            "Configure paylines",
          ],
          confidence: 0.92,
        };
      }

      if (lowerMessage.includes("rtp") || lowerMessage.includes("payout")) {
        return {
          message:
            "RTP (Return to Player) is critical for balanced gameplay! 📊\n\nFor CoinKrazy slots, I recommend:\n\n**Target RTP: 94-96%** (industry standard)\n\n**RTP Breakdown:**\n• Base Game: 85-88%\n• Bonus Features: 6-8% \n• Jackpot: 2-3%\n\n**Volatility Settings:**\n• **Low**: More frequent small wins\n• **Medium**: Balanced win frequency\n• **High**: Rare but bigger wins\n\nCurrent slot RTP calculation needs symbol weights and payline setup. Want me to help calculate?",
          suggestions: [
            "Calculate current RTP",
            "Adjust symbol weights",
            "Balance payout table",
            "Set volatility level",
          ],
          codeExample: `const calculateRTP = (symbols: SlotSymbol[], weights: Record<string, number>) => {
  let totalPayout = 0;
  let totalWeight = 0;
  
  Object.entries(weights).forEach(([symbolId, weight]) => {
    const symbol = symbols.find(s => s.id === symbolId);
    if (symbol) {
      totalPayout += symbol.value * weight;
      totalWeight += weight;
    }
  });
  
  return (totalPayout / totalWeight) * 100;
};`,
          nextSteps: [
            "Run RTP calculation",
            "Adjust symbol weights if needed",
            "Test payout balance",
          ],
          confidence: 0.88,
        };
      }
    }

    // Default helpful response
    return {
      message:
        "I understand you're asking about: " +
        userMessage +
        "\n\nI'm still learning about this specific topic, but I can help you with:\n\n• Slot machine development and configuration\n• Symbol design and payout optimization\n• RTP calculations and balancing\n• Visual editor usage and tips\n• CoinKrazy branding integration\n\nCould you be more specific about what you'd like to accomplish?",
      suggestions: [
        "Explain slot basics",
        "Help with visual editor",
        "CoinKrazy branding guide",
        "Show me examples",
      ],
      nextSteps: [
        "Clarify your specific needs",
        "Explore available tools",
        "Start with a simple example",
      ],
      confidence: 0.6,
    };
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      message: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const aiResponse = await generateAIResponse(userMessage.message);

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        message: aiResponse.message,
        timestamp: new Date(),
        suggestions: aiResponse.suggestions,
        codeExample: aiResponse.codeExample,
        nextSteps: aiResponse.nextSteps,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        message:
          "Sorry, I encountered an error processing your request. Please try again!",
        timestamp: new Date(),
        suggestions: [
          "Try rephrasing",
          "Check connection",
          "Restart conversation",
        ],
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const applySuggestion = (suggestion: string) => {
    if (onSuggestionApply) {
      onSuggestionApply(suggestion);
    }
    setInput(suggestion);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    if (onCodeGenerate) {
      onCodeGenerate(code);
    }
  };

  return (
    <Card
      className={`transition-all duration-300 ${isExpanded ? "h-96" : "h-16"} border-gold/30 bg-gradient-to-br from-purple-900/20 to-blue-900/20`}
    >
      <CardHeader
        className="cursor-pointer bg-gradient-to-r from-gold/10 to-purple/10 border-b border-gold/20"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10 border-2 border-gold/50">
              <AvatarImage src="/joseyai-avatar.png" />
              <AvatarFallback className="bg-gradient-to-br from-gold to-purple text-white font-bold">
                <Bot className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg flex items-center">
                JoseyAI
                <Sparkles className="h-4 w-4 ml-2 text-gold animate-pulse" />
              </CardTitle>
              <CardDescription className="text-sm">
                Your CoinKrazy Development Assistant
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="border-gold/50 text-gold">
              <Brain className="h-3 w-3 mr-1" />
              {context === "slot-editor" ? "Slot Expert" : "General AI"}
            </Badge>
            <Button variant="ghost" size="sm">
              {isExpanded ? "−" : "+"}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="p-0 flex flex-col h-80">
          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] ${message.type === "user" ? "order-2" : "order-1"}`}
                  >
                    {message.type === "ai" && (
                      <div className="flex items-center mb-2">
                        <Bot className="h-4 w-4 text-gold mr-2" />
                        <span className="text-xs text-muted-foreground">
                          JoseyAI
                        </span>
                      </div>
                    )}

                    <div
                      className={`p-3 rounded-lg ${
                        message.type === "user"
                          ? "bg-gold/20 text-gold-foreground border border-gold/30"
                          : "bg-muted/50 border border-muted"
                      }`}
                    >
                      <div className="whitespace-pre-wrap text-sm">
                        {message.message}
                      </div>

                      {/* Code Example */}
                      {message.codeExample && (
                        <div className="mt-3 p-3 bg-black/50 rounded border border-gray-600">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-400 flex items-center">
                              <FileCode className="h-3 w-3 mr-1" />
                              Code Example
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyCode(message.codeExample!)}
                              className="h-6 text-xs"
                            >
                              <Code className="h-3 w-3 mr-1" />
                              Use Code
                            </Button>
                          </div>
                          <pre className="text-xs text-green-400 overflow-x-auto">
                            {message.codeExample}
                          </pre>
                        </div>
                      )}

                      {/* Suggestions */}
                      {message.suggestions &&
                        message.suggestions.length > 0 && (
                          <div className="mt-3 space-y-2">
                            <span className="text-xs text-muted-foreground flex items-center">
                              <Lightbulb className="h-3 w-3 mr-1" />
                              Quick Actions:
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {message.suggestions.map((suggestion, idx) => (
                                <Button
                                  key={idx}
                                  size="sm"
                                  variant="outline"
                                  onClick={() => applySuggestion(suggestion)}
                                  className="h-7 text-xs border-gold/30 hover:bg-gold/10"
                                >
                                  <Zap className="h-3 w-3 mr-1" />
                                  {suggestion}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}

                      {/* Next Steps */}
                      {message.nextSteps && message.nextSteps.length > 0 && (
                        <div className="mt-3">
                          <span className="text-xs text-muted-foreground">
                            Next Steps:
                          </span>
                          <ul className="text-xs mt-1 space-y-1">
                            {message.nextSteps.map((step, idx) => (
                              <li key={idx} className="flex items-center">
                                <span className="w-4 h-4 rounded-full bg-gold/20 text-gold text-xs flex items-center justify-center mr-2">
                                  {idx + 1}
                                </span>
                                {step}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="text-xs text-muted-foreground mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted/50 border border-muted p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-4 w-4 text-gold animate-pulse" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gold rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gold rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gold rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t border-muted p-4">
            <div className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask JoseyAI anything about slot development..."
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                className="flex-1 border-gold/30 focus:border-gold"
              />
              <Button
                onClick={sendMessage}
                disabled={!input.trim() || isTyping}
                className="bg-gradient-to-r from-gold to-yellow-400 text-gold-foreground hover:from-yellow-400 hover:to-gold"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <span className="flex items-center">
                  <MessageCircle className="h-3 w-3 mr-1" />
                  {messages.length - 1} messages
                </span>
                <span className="flex items-center">
                  <Settings className="h-3 w-3 mr-1" />
                  {context} mode
                </span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setMessages([getWelcomeMessage()])}
                className="text-xs"
              >
                Reset Chat
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
