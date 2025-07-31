import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useAuth } from "./AuthContext";
import {
  BookOpen,
  Play,
  FileText,
  Video,
  HelpCircle,
  Star,
  Clock,
  Users,
  Target,
  Award,
  Shield,
  CreditCard,
  Gamepad2,
  Crown,
  Gift,
  TrendingUp,
  CheckCircle,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Save,
  Download,
  Upload,
  ExternalLink,
  BookMark,
  Zap,
  Lightbulb,
} from "lucide-react";

interface Guide {
  id: string;
  title: string;
  description: string;
  category:
    | "casino_basics"
    | "games"
    | "payments"
    | "vip"
    | "staff"
    | "admin"
    | "kyc"
    | "redemption"
    | "responsible_gaming";
  type: "guide" | "tutorial" | "video" | "faq" | "quick_tip";
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime: number; // in minutes
  content: string;
  steps?: {
    title: string;
    content: string;
    image?: string;
    tips?: string[];
  }[];
  relatedGuides: string[];
  tags: string[];
  isPublished: boolean;
  isFeatured: boolean;
  views: number;
  rating: number;
  lastUpdated: Date;
  author: string;
  videoUrl?: string;
  images?: string[];
}

interface GuideStats {
  totalGuides: number;
  publishedGuides: number;
  totalViews: number;
  averageRating: number;
  mostPopular: string;
  recentlyAdded: number;
}

export function GuidesAndTutorials() {
  const { user } = useAuth();
  const [guides, setGuides] = useState<Guide[]>([]);
  const [stats, setStats] = useState<GuideStats>({
    totalGuides: 47,
    publishedGuides: 42,
    totalViews: 15647,
    averageRating: 4.6,
    mostPopular: "How to Play Slots",
    recentlyAdded: 5,
  });

  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterDifficulty, setFilterDifficulty] = useState("all");

  const [newGuide, setNewGuide] = useState({
    title: "",
    description: "",
    category: "casino_basics" as const,
    type: "guide" as const,
    difficulty: "beginner" as const,
    estimatedTime: 5,
    content: "",
    tags: [] as string[],
    isPublished: false,
    isFeatured: false,
  });

  useEffect(() => {
    loadGuides();
    loadStats();
  }, []);

  const loadGuides = () => {
    const guideData: Guide[] = [
      // Casino Basics Guides
      {
        id: "guide_001",
        title: "Welcome to CoinKrazy Casino",
        description:
          "Complete beginner's guide to getting started with social casino gaming",
        category: "casino_basics",
        type: "guide",
        difficulty: "beginner",
        estimatedTime: 10,
        content: `# Welcome to CoinKrazy Casino! 🎰

## Getting Started

Welcome to the most exciting social casino experience! This guide will help you understand everything you need to know to start your journey.

### What is Social Casino Gaming?

Social casino gaming allows you to enjoy all the excitement of casino games without the risk of losing real money. You play with virtual currencies:

- **Gold Coins (GC)**: Used for fun play and can be purchased
- **Sweeps Coins (SC)**: Can be redeemed for prizes and are earned through gameplay

### Your First Steps

1. **Complete Your Profile**: Add your details and verify your email
2. **Claim Your Welcome Bonus**: Get free coins to start playing
3. **Explore the Games**: Try different slots, table games, and mini-games
4. **Join the Community**: Connect with other players and participate in tournaments

### Daily Bonuses

Log in every day to claim your free coins! The more consecutive days you log in, the bigger your bonus becomes.

### Safety and Security

Your safety is our priority. We use industry-standard encryption to protect your data and provide tools for responsible gaming.`,
        steps: [
          {
            title: "Create Your Account",
            content: "Sign up with your email and create a secure password",
            tips: [
              "Use a strong password",
              "Verify your email address",
              "Complete your profile",
            ],
          },
          {
            title: "Claim Welcome Bonus",
            content: "Get your free starter coins to begin playing",
            tips: [
              "Check your inbox for bonus codes",
              "Claim daily bonuses",
              "Follow us on social media for extra bonuses",
            ],
          },
          {
            title: "Choose Your First Game",
            content:
              "Start with beginner-friendly slots or try our tutorial games",
            tips: [
              "Start with lower bet amounts",
              "Read game rules",
              "Try demo mode first",
            ],
          },
        ],
        relatedGuides: ["guide_002", "guide_003"],
        tags: ["beginner", "welcome", "basics", "getting-started"],
        isPublished: true,
        isFeatured: true,
        views: 3247,
        rating: 4.8,
        lastUpdated: new Date("2024-01-15"),
        author: "CoinKrazy Team",
      },

      {
        id: "guide_002",
        title: "How to Play Slot Games",
        description:
          "Master the art of slot gaming with tips, strategies, and game mechanics",
        category: "games",
        type: "tutorial",
        difficulty: "beginner",
        estimatedTime: 15,
        content: `# How to Play Slot Games 🎰

## Understanding Slot Mechanics

Slot games are the heart of any casino. Here's everything you need to know:

### Basic Gameplay

1. **Choose Your Bet**: Select your coin value and bet level
2. **Spin the Reels**: Click the spin button or use auto-play
3. **Check for Wins**: Winning combinations are highlighted
4. **Collect Your Winnings**: Coins are automatically added to your balance

### Paylines and Symbols

- **Paylines**: Lines where winning combinations can occur
- **Wild Symbols**: Substitute for other symbols
- **Scatter Symbols**: Trigger bonus features
- **Bonus Symbols**: Activate special game features

### Special Features

- **Free Spins**: Get additional spins without using your coins
- **Multipliers**: Increase your winnings by 2x, 3x, or more
- **Bonus Rounds**: Interactive mini-games within the slot
- **Progressive Jackpots**: Ever-growing prize pools

### Tips for Success

1. **Manage Your Bankroll**: Set limits and stick to them
2. **Understand RTP**: Look for games with higher Return to Player percentages
3. **Try Different Games**: Each slot has unique features and themes
4. **Use Auto-Play Wisely**: Set loss limits when using auto-play`,
        steps: [
          {
            title: "Select Your Game",
            content:
              "Browse our slot collection and choose a game that appeals to you",
            tips: [
              "Check the RTP percentage",
              "Read the game description",
              "Try the demo version first",
            ],
          },
          {
            title: "Set Your Bet",
            content: "Choose your coin value and number of paylines",
            tips: [
              "Start with smaller bets",
              "Understand the minimum and maximum bets",
              "Consider your total bankroll",
            ],
          },
          {
            title: "Understand the Features",
            content: "Learn about wilds, scatters, and bonus rounds",
            tips: [
              "Read the paytable",
              "Know the bonus triggers",
              "Understand the special symbols",
            ],
          },
        ],
        relatedGuides: ["guide_003", "guide_004"],
        tags: ["slots", "gameplay", "tutorial", "features"],
        isPublished: true,
        isFeatured: true,
        views: 4851,
        rating: 4.7,
        lastUpdated: new Date("2024-01-20"),
        author: "SlotExpert",
        videoUrl: "https://example.com/slot-tutorial",
      },

      // Payment Guides
      {
        id: "guide_003",
        title: "Gold Coin Store Guide",
        description:
          "Everything you need to know about purchasing Gold Coin packages",
        category: "payments",
        type: "guide",
        difficulty: "beginner",
        estimatedTime: 8,
        content: `# Gold Coin Store Guide 💰

## Understanding Our Currencies

### Gold Coins (GC)
- Used for fun play across all games
- Can be purchased directly from our store
- Never expire and roll over between sessions
- Earn bonus GC through daily activities

### Sweeps Coins (SC)
- Earned through gameplay and purchases
- Can be redeemed for real prizes
- Subject to terms and conditions
- Minimum redemption amounts apply

## Making Your First Purchase

### Payment Methods
We accept various secure payment methods:
- PayPal (instant processing)
- Credit/Debit Cards via Stripe
- Google Pay (mobile users)
- Apple Pay (iOS users)

### Package Selection
Choose from our range of packages:
- **Starter Packs**: Perfect for new players
- **Value Packs**: Best coin-to-dollar ratio
- **Premium Packs**: Maximum coins with bonus SC
- **VIP Packs**: Exclusive high-roller options

### Security and Safety
- All transactions use SSL encryption
- No storing of payment details
- Instant delivery to your account
- 24/7 customer support

## Bonus Opportunities

### Daily Bonuses
- Login bonuses increase with consecutive days
- Special weekend multipliers
- Holiday bonus events

### Promotional Codes
- Follow our social media for codes
- Newsletter subscribers get exclusive offers
- Seasonal promotions and events`,
        relatedGuides: ["guide_001", "guide_010"],
        tags: ["payments", "gold-coins", "store", "packages"],
        isPublished: true,
        isFeatured: false,
        views: 2156,
        rating: 4.5,
        lastUpdated: new Date("2024-02-01"),
        author: "PaymentTeam",
      },

      // VIP Guides
      {
        id: "guide_004",
        title: "VIP Program Benefits",
        description:
          "Unlock exclusive rewards and benefits with our VIP membership program",
        category: "vip",
        type: "guide",
        difficulty: "intermediate",
        estimatedTime: 12,
        content: `# VIP Program Benefits 👑

## VIP Tier System

### Bronze VIP
- 5% bonus on all purchases
- Priority customer support
- Monthly loyalty bonus
- Early access to new games

### Silver VIP  
- 10% bonus on all purchases
- Dedicated VIP support line
- Weekly cashback rewards
- Exclusive tournament invitations

### Gold VIP
- 15% bonus on all purchases
- Personal account manager
- Daily VIP bonuses
- Higher withdrawal limits

### Platinum VIP
- 20% bonus on all purchases
- Premium support with priority queue
- Custom promotional offers
- Access to VIP-only events

### Diamond VIP
- 25% bonus on all purchases
- 24/7 personal concierge service
- Exclusive high-limit games
- Real-world VIP experiences

## How to Qualify

VIP status is based on your activity and loyalty:
- Total purchase amount
- Gameplay frequency
- Account tenure
- Responsible gaming practices

## VIP Calculator

Use our VIP calculator to see:
- Your current tier progress
- Benefits at each level
- Estimated time to next tier
- Exclusive offers available

## Special Perks

### RTP Boost Add-On
- Increase your Return to Player percentage
- Available for $10/hour
- Stack with VIP bonuses
- Available to Gold tier and above`,
        relatedGuides: ["guide_003", "guide_008"],
        tags: ["vip", "benefits", "tiers", "loyalty"],
        isPublished: true,
        isFeatured: true,
        views: 1834,
        rating: 4.9,
        lastUpdated: new Date("2024-01-25"),
        author: "VIPTeam",
      },

      // KYC Guide
      {
        id: "guide_005",
        title: "KYC Verification Process",
        description:
          "Step-by-step guide to completing your Know Your Customer verification",
        category: "kyc",
        type: "guide",
        difficulty: "beginner",
        estimatedTime: 15,
        content: `# KYC Verification Process 🔒

## What is KYC?

Know Your Customer (KYC) verification is a security process that helps us:
- Verify your identity
- Prevent fraud and money laundering
- Comply with legal regulations
- Protect your account

## Required Documents

### Primary ID (Choose One)
- Government-issued photo ID
- Driver's License
- Passport
- State ID Card

### Proof of Address (Choose One)
- Utility bill (within 90 days)
- Bank statement (within 90 days)
- Government correspondence
- Lease agreement

### Additional Requirements for Large Withdrawals
- Bank account verification
- Source of funds documentation
- Enhanced due diligence forms

## Step-by-Step Process

### Step 1: Document Preparation
- Ensure documents are clear and legible
- All corners must be visible
- No shadows or glare
- Original documents (no photocopies)

### Step 2: Upload Process
- Use our secure upload portal
- Take clear photos or scan documents
- Verify all information is readable
- Submit all required documents together

### Step 3: Verification Review
- Initial review within 24 hours
- Possible request for additional documents
- Email updates on status changes
- Final approval within 3-5 business days

## Common Issues and Solutions

### Document Rejected?
- Check image quality and clarity
- Ensure all corners are visible
- Verify document is not expired
- Contact support for assistance

### Processing Delays?
- Check for missing documents
- Verify email address for updates
- Allow full processing time
- Contact VIP support if urgent

## Benefits of Verification

- Higher withdrawal limits
- Faster processing times
- Enhanced account security
- Access to premium features`,
        relatedGuides: ["guide_006", "guide_003"],
        tags: ["kyc", "verification", "security", "documents"],
        isPublished: true,
        isFeatured: false,
        views: 1456,
        rating: 4.3,
        lastUpdated: new Date("2024-02-10"),
        author: "SecurityTeam",
      },

      // Redemption Guide
      {
        id: "guide_006",
        title: "Prize Redemption Process",
        description:
          "How to redeem your Sweeps Coins for real prizes and cash rewards",
        category: "redemption",
        type: "guide",
        difficulty: "intermediate",
        estimatedTime: 10,
        content: `# Prize Redemption Process 🏆

## Sweeps Coins Redemption

### Minimum Redemption Requirements
- Minimum 25 SC for cash redemption
- Minimum 50 SC for gift card redemption
- KYC verification must be complete
- Account must be in good standing

### Redemption Methods

#### Cash via PayPal
- Minimum: 25 SC ($25 value)
- Processing time: 3-5 business days
- Fee: None
- Requires verified PayPal account

#### Bank Transfer
- Minimum: 100 SC ($100 value)  
- Processing time: 5-7 business days
- Fee: $5 processing fee
- Requires bank account verification

#### Gift Cards
- Various retailers available
- Minimum: 50 SC
- Instant delivery via email
- No processing fees

### Redemption Process

#### Step 1: Verify Eligibility
- Check your SC balance
- Ensure KYC is complete
- Review account status
- Confirm redemption method

#### Step 2: Submit Request
- Navigate to redemption section
- Select redemption method
- Enter required details
- Review and confirm request

#### Step 3: Processing
- Initial review within 24 hours
- Verification of gameplay history
- Final approval and payment
- Email confirmation sent

## Important Terms

### Wagering Requirements
- SC must be earned through gameplay
- Purchase SC bonus has 1x wagering requirement
- Free SC bonuses have 10x wagering requirement
- Tournament winnings are immediately redeemable

### Limits and Restrictions
- Maximum $5,000 per month
- Maximum $1,000 per transaction
- 30-day cooling period between large redemptions
- Account history review for large amounts

## Troubleshooting

### Common Issues
- Insufficient SC balance
- Incomplete KYC verification
- Outstanding wagering requirements
- Invalid payment details

### Getting Help
- Contact customer support
- Live chat during business hours
- Email support with ticket number
- VIP support for premium members`,
        relatedGuides: ["guide_005", "guide_003"],
        tags: ["redemption", "sweeps-coins", "prizes", "cash"],
        isPublished: true,
        isFeatured: true,
        views: 2789,
        rating: 4.6,
        lastUpdated: new Date("2024-02-05"),
        author: "RedemptionTeam",
      },

      // Staff Panel Guide
      {
        id: "guide_007",
        title: "Staff Panel User Guide",
        description:
          "Comprehensive guide for staff members using the CoinKrazy staff panel",
        category: "staff",
        type: "guide",
        difficulty: "advanced",
        estimatedTime: 30,
        content: `# Staff Panel User Guide 👥

## Overview

The CoinKrazy Staff Panel is your central hub for managing player interactions, processing requests, and maintaining excellent customer service.

## Dashboard Navigation

### Main Sections
- **Player Support**: Handle tickets and live chat
- **Transaction Review**: Process payments and redemptions
- **Account Management**: User verification and modifications
- **Reports**: Generate and view performance reports
- **Communication**: Internal messaging and announcements

## Daily Responsibilities

### Morning Tasks (Start of Shift)
1. Review overnight tickets and priority issues
2. Check payment processing queue
3. Review escalated cases from previous shift
4. Update status and availability in system
5. Check for system announcements and updates

### Ongoing Responsibilities
- Respond to player inquiries within SLA
- Process routine transactions and verifications
- Monitor live chat queues
- Update ticket statuses and resolutions
- Escalate complex issues to supervisors

### End of Shift Tasks
1. Complete all active tickets or transfer properly
2. Update shift report with key metrics
3. Log any unresolved issues for next shift
4. Update personal availability status
5. Review performance metrics for the day

## Player Support Best Practices

### Communication Guidelines
- Always greet players professionally
- Use clear, friendly language
- Avoid technical jargon
- Confirm understanding before closing
- Follow up on complex issues

### Response Time Standards
- Live chat: Within 2 minutes
- Email tickets: Within 4 hours
- VIP issues: Within 1 hour
- Escalated cases: Within 30 minutes
- Payment issues: Within 2 hours

## Transaction Processing

### Standard Procedures
1. Verify player identity and account status
2. Check transaction details and documentation
3. Confirm compliance with terms and conditions
4. Process or escalate as appropriate
5. Document all actions and decisions
6. Notify player of status updates

### Escalation Triggers
- Transactions over $1,000
- Suspicious activity patterns
- Incomplete KYC documentation
- Technical system errors
- Player disputes or complaints

## Performance Metrics

### Key Performance Indicators
- Ticket resolution time
- Customer satisfaction scores
- First contact resolution rate
- Escalation percentage
- Attendance and punctuality

### Quality Assurance
- Regular ticket reviews
- Customer feedback monitoring
- Peer evaluations
- Supervisor coaching sessions
- Continuous training programs`,
        relatedGuides: ["guide_008", "guide_009"],
        tags: ["staff", "panel", "support", "procedures"],
        isPublished: true,
        isFeatured: false,
        views: 567,
        rating: 4.4,
        lastUpdated: new Date("2024-01-30"),
        author: "HRTeam",
      },

      // Quick Tips
      {
        id: "guide_008",
        title: "Daily Bonus Maximization Tips",
        description: "Quick tips to maximize your daily bonuses and free coins",
        category: "casino_basics",
        type: "quick_tip",
        difficulty: "beginner",
        estimatedTime: 3,
        content: `# Daily Bonus Maximization Tips ⚡

## Quick Tips for Maximum Bonuses

### Login Streak Rewards
- Log in every day to maintain your streak
- Bonuses increase with consecutive days
- Reset at midnight EST
- Set reminders to not miss a day

### Social Media Bonuses
- Follow us on Facebook, Twitter, Instagram
- Share posts for bonus codes
- Join our community groups
- Participate in social contests

### Email Promotions
- Subscribe to our newsletter
- Check promotional emails daily
- Use bonus codes before expiration
- Whitelist our email address

### Mobile App Benefits
- Download the mobile app for exclusive bonuses
- Enable push notifications
- Mobile-only daily bonuses
- Faster access to limited-time offers`,
        relatedGuides: ["guide_001", "guide_003"],
        tags: ["bonuses", "daily", "tips", "quick"],
        isPublished: true,
        isFeatured: false,
        views: 892,
        rating: 4.2,
        lastUpdated: new Date("2024-02-08"),
        author: "BonusTeam",
      },
    ];

    setGuides(guideData);
  };

  const loadStats = () => {
    // Stats are initialized in useState
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "casino_basics":
        return <BookOpen className="w-4 h-4" />;
      case "games":
        return <Gamepad2 className="w-4 h-4" />;
      case "payments":
        return <CreditCard className="w-4 h-4" />;
      case "vip":
        return <Crown className="w-4 h-4" />;
      case "staff":
        return <Shield className="w-4 h-4" />;
      case "admin":
        return <Award className="w-4 h-4" />;
      case "kyc":
        return <FileText className="w-4 h-4" />;
      case "redemption":
        return <Gift className="w-4 h-4" />;
      case "responsible_gaming":
        return <HelpCircle className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "guide":
        return <BookOpen className="w-4 h-4" />;
      case "tutorial":
        return <Play className="w-4 h-4" />;
      case "video":
        return <Video className="w-4 h-4" />;
      case "faq":
        return <HelpCircle className="w-4 h-4" />;
      case "quick_tip":
        return <Lightbulb className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-600";
      case "intermediate":
        return "bg-yellow-600";
      case "advanced":
        return "bg-red-600";
      default:
        return "bg-gray-600";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "casino_basics":
        return "bg-blue-600";
      case "games":
        return "bg-purple-600";
      case "payments":
        return "bg-green-600";
      case "vip":
        return "bg-yellow-600";
      case "staff":
        return "bg-indigo-600";
      case "admin":
        return "bg-red-600";
      case "kyc":
        return "bg-orange-600";
      case "redemption":
        return "bg-pink-600";
      case "responsible_gaming":
        return "bg-teal-600";
      default:
        return "bg-gray-600";
    }
  };

  const filteredGuides = guides.filter((guide) => {
    const matchesSearch =
      guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesCategory =
      filterCategory === "all" || guide.category === filterCategory;
    const matchesType = filterType === "all" || guide.type === filterType;
    const matchesDifficulty =
      filterDifficulty === "all" || guide.difficulty === filterDifficulty;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesType &&
      matchesDifficulty &&
      guide.isPublished
    );
  });

  const handleCreateGuide = () => {
    const guide: Guide = {
      id: `guide_${Date.now()}`,
      ...newGuide,
      steps: [],
      relatedGuides: [],
      views: 0,
      rating: 0,
      lastUpdated: new Date(),
      author: user?.username || "Admin",
    };

    setGuides((prev) => [guide, ...prev]);
    setShowCreateModal(false);
    setNewGuide({
      title: "",
      description: "",
      category: "casino_basics",
      type: "guide",
      difficulty: "beginner",
      estimatedTime: 5,
      content: "",
      tags: [],
      isPublished: false,
      isFeatured: false,
    });
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <BookOpen className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-500">
              {stats.totalGuides}
            </div>
            <div className="text-sm text-gray-400">Total Guides</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <Eye className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-500">
              {stats.totalViews.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">Total Views</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-500">
              {stats.averageRating.toFixed(1)}
            </div>
            <div className="text-sm text-gray-400">Average Rating</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-500">
              {stats.recentlyAdded}
            </div>
            <div className="text-sm text-gray-400">Recently Added</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="guides" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="guides">Browse Guides</TabsTrigger>
          <TabsTrigger value="featured">Featured Content</TabsTrigger>
          <TabsTrigger value="manage">Manage Content</TabsTrigger>
        </TabsList>

        <TabsContent value="guides" className="space-y-6">
          {/* Search and Filters */}
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search guides..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Select
                    value={filterCategory}
                    onValueChange={setFilterCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="casino_basics">
                        Casino Basics
                      </SelectItem>
                      <SelectItem value="games">Games</SelectItem>
                      <SelectItem value="payments">Payments</SelectItem>
                      <SelectItem value="vip">VIP Program</SelectItem>
                      <SelectItem value="kyc">KYC & Verification</SelectItem>
                      <SelectItem value="redemption">Redemption</SelectItem>
                      <SelectItem value="staff">Staff Guides</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="guide">Guides</SelectItem>
                      <SelectItem value="tutorial">Tutorials</SelectItem>
                      <SelectItem value="video">Videos</SelectItem>
                      <SelectItem value="faq">FAQ</SelectItem>
                      <SelectItem value="quick_tip">Quick Tips</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Select
                    value={filterDifficulty}
                    onValueChange={setFilterDifficulty}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Guide Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuides.map((guide) => (
              <Card
                key={guide.id}
                className="bg-gray-800 border-gray-700 hover:border-purple-500 transition-all duration-300"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(guide.category)}
                      <Badge className={getCategoryColor(guide.category)}>
                        {guide.category.replace("_", " ")}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      {getTypeIcon(guide.type)}
                      {guide.isFeatured && (
                        <Star className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-white text-lg">
                    {guide.title}
                  </CardTitle>
                  <p className="text-gray-400 text-sm">{guide.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge className={getDifficultyColor(guide.difficulty)}>
                      {guide.difficulty}
                    </Badge>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Clock className="w-4 h-4" />
                      {guide.estimatedTime} min
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Eye className="w-4 h-4" />
                      {guide.views.toLocaleString()} views
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-400">
                      <Star className="w-4 h-4 text-yellow-500" />
                      {guide.rating.toFixed(1)}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {guide.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => {
                      setSelectedGuide(guide);
                      setShowGuideModal(true);
                    }}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Read Guide
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="featured" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {guides
              .filter((g) => g.isFeatured && g.isPublished)
              .map((guide) => (
                <Card
                  key={guide.id}
                  className="bg-gray-800 border-gray-700 border-2 border-yellow-500"
                >
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <Badge className="bg-yellow-600">Featured</Badge>
                      <Badge className={getCategoryColor(guide.category)}>
                        {guide.category.replace("_", " ")}
                      </Badge>
                    </div>
                    <CardTitle className="text-white text-xl">
                      {guide.title}
                    </CardTitle>
                    <p className="text-gray-400">{guide.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-white font-bold">
                          {guide.views.toLocaleString()}
                        </div>
                        <div className="text-gray-400">Views</div>
                      </div>
                      <div className="text-center">
                        <div className="text-white font-bold">
                          {guide.rating.toFixed(1)}
                        </div>
                        <div className="text-gray-400">Rating</div>
                      </div>
                      <div className="text-center">
                        <div className="text-white font-bold">
                          {guide.estimatedTime}m
                        </div>
                        <div className="text-gray-400">Read Time</div>
                      </div>
                    </div>

                    <Button
                      className="w-full bg-yellow-600 hover:bg-yellow-700"
                      onClick={() => {
                        setSelectedGuide(guide);
                        setShowGuideModal(true);
                      }}
                    >
                      <Star className="w-4 h-4 mr-2" />
                      Read Featured Guide
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="manage" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">Content Management</h3>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Guide
            </Button>
          </div>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">All Guides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {guides.map((guide) => (
                  <div
                    key={guide.id}
                    className="flex items-center justify-between p-4 bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(guide.category)}
                        {getTypeIcon(guide.type)}
                      </div>
                      <div>
                        <div className="text-white font-medium">
                          {guide.title}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {guide.category.replace("_", " ")} • {guide.type}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={guide.isPublished ? "default" : "secondary"}
                      >
                        {guide.isPublished ? "Published" : "Draft"}
                      </Badge>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Guide Viewer Modal */}
      {showGuideModal && selectedGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="bg-gray-800 border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {getCategoryIcon(selectedGuide.category)}
                    <Badge className={getCategoryColor(selectedGuide.category)}>
                      {selectedGuide.category.replace("_", " ")}
                    </Badge>
                    <Badge
                      className={getDifficultyColor(selectedGuide.difficulty)}
                    >
                      {selectedGuide.difficulty}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-gray-400">
                      <Clock className="w-4 h-4" />
                      {selectedGuide.estimatedTime} min
                    </div>
                  </div>
                  <CardTitle className="text-white text-2xl">
                    {selectedGuide.title}
                  </CardTitle>
                  <p className="text-gray-400">{selectedGuide.description}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowGuideModal(false)}
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-gray-300">
                  {selectedGuide.content}
                </div>
              </div>

              {selectedGuide.steps && selectedGuide.steps.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white">
                    Step-by-Step Guide
                  </h3>
                  {selectedGuide.steps.map((step, index) => (
                    <Card key={index} className="bg-gray-700 border-gray-600">
                      <CardContent className="p-4">
                        <h4 className="text-white font-medium mb-2">
                          Step {index + 1}: {step.title}
                        </h4>
                        <p className="text-gray-300 mb-3">{step.content}</p>
                        {step.tips && step.tips.length > 0 && (
                          <div>
                            <div className="text-yellow-400 font-medium mb-2 flex items-center gap-2">
                              <Lightbulb className="w-4 h-4" />
                              Tips:
                            </div>
                            <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
                              {step.tips.map((tip, tipIndex) => (
                                <li key={tipIndex}>{tip}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-600">
                <div className="text-sm text-gray-400">
                  By {selectedGuide.author} • Last updated{" "}
                  {selectedGuide.lastUpdated.toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <BookMark className="w-4 h-4 mr-2" />
                    Bookmark
                  </Button>
                  <Button variant="outline" size="sm">
                    <Star className="w-4 h-4 mr-2" />
                    Rate Guide
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Create Guide Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="bg-gray-800 border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="text-white flex justify-between items-center">
                Create New Guide
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCreateModal(false)}
                >
                  ✕
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-white">Title</Label>
                <Input
                  value={newGuide.title}
                  onChange={(e) =>
                    setNewGuide((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-white">Description</Label>
                <Textarea
                  value={newGuide.description}
                  onChange={(e) =>
                    setNewGuide((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Category</Label>
                  <Select
                    value={newGuide.category}
                    onValueChange={(value: any) =>
                      setNewGuide((prev) => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="casino_basics">
                        Casino Basics
                      </SelectItem>
                      <SelectItem value="games">Games</SelectItem>
                      <SelectItem value="payments">Payments</SelectItem>
                      <SelectItem value="vip">VIP Program</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="kyc">KYC</SelectItem>
                      <SelectItem value="redemption">Redemption</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white">Type</Label>
                  <Select
                    value={newGuide.type}
                    onValueChange={(value: any) =>
                      setNewGuide((prev) => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="guide">Guide</SelectItem>
                      <SelectItem value="tutorial">Tutorial</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="faq">FAQ</SelectItem>
                      <SelectItem value="quick_tip">Quick Tip</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Difficulty</Label>
                  <Select
                    value={newGuide.difficulty}
                    onValueChange={(value: any) =>
                      setNewGuide((prev) => ({ ...prev, difficulty: value }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white">Estimated Time (minutes)</Label>
                  <Input
                    type="number"
                    value={newGuide.estimatedTime}
                    onChange={(e) =>
                      setNewGuide((prev) => ({
                        ...prev,
                        estimatedTime: parseInt(e.target.value) || 5,
                      }))
                    }
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label className="text-white">Content</Label>
                <Textarea
                  value={newGuide.content}
                  onChange={(e) =>
                    setNewGuide((prev) => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                  className="mt-1"
                  rows={6}
                  placeholder="Write your guide content in Markdown format..."
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={newGuide.isPublished}
                    onCheckedChange={(checked) =>
                      setNewGuide((prev) => ({ ...prev, isPublished: checked }))
                    }
                  />
                  <Label className="text-white">Publish immediately</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={newGuide.isFeatured}
                    onCheckedChange={(checked) =>
                      setNewGuide((prev) => ({ ...prev, isFeatured: checked }))
                    }
                  />
                  <Label className="text-white">Feature this guide</Label>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleCreateGuide}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={!newGuide.title || !newGuide.content}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Create Guide
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
