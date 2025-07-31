import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  FileText,
  Users,
  Shield,
  AlertTriangle,
  Book,
  Settings,
  Gamepad2,
  CreditCard,
  Scale,
  Eye,
  EyeOff,
  Download,
  Edit,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { DocumentationSection } from "../../shared/adminToolbarTypes";
import { useAuth } from "./AuthContext";

interface DocumentationViewerProps {
  className?: string;
}

export const DocumentationViewer: React.FC<DocumentationViewerProps> = ({
  className = "",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSection, setSelectedSection] =
    useState<DocumentationSection | null>(null);
  const [activeTab, setActiveTab] = useState<"user" | "staff" | "admin">(
    "user",
  );
  const [documentSections, setDocumentSections] = useState<
    DocumentationSection[]
  >([]);
  const { user, isAdmin, isStaff } = useAuth();

  useEffect(() => {
    loadDocumentationSections();
  }, []);

  const loadDocumentationSections = () => {
    const sections: DocumentationSection[] = [
      // User Documentation
      {
        id: "user-001",
        title: "Getting Started with Coin Krazy",
        category: "user",
        content: `# Welcome to Coin Krazy Social Casino!

## What is Coin Krazy?

Coin Krazy is a premier social casino platform where you can enjoy exciting casino games using virtual currencies. We offer two types of virtual currencies:

- **Gold Coins (GC)**: Used for social gaming and entertainment
- **Sweeps Coins (SC)**: Can be redeemed for prizes and cash rewards

## How to Get Started

1. **Create Your Account**: Sign up with a valid email address
2. **Verify Your Identity**: Complete age verification (18+ required)
3. **Claim Your Welcome Bonus**: Get free Gold Coins to start playing
4. **Choose Your Games**: Explore our extensive collection of slot games

## Account Setup

### Profile Information
- Complete your profile with accurate information
- Upload a profile picture (optional)
- Set your gaming preferences

### Responsible Gaming
We are committed to responsible gaming. Set your limits:
- Daily spending limits
- Session time limits
- Loss limits
- Self-exclusion options

## Game Types

### Slot Games
- Classic slots with traditional symbols
- Video slots with bonus features
- Progressive jackpot games
- Themed games with immersive graphics

### Table Games
- Blackjack variants
- Roulette games
- Poker variations
- Baccarat options

## Currency System

### Gold Coins (GC)
- Purchased with real money
- Used for entertainment gaming
- Cannot be redeemed for cash
- Available in packages starting at $4.99

### Sweeps Coins (SC)
- Received free with GC purchases
- Can be redeemed for cash prizes
- Minimum redemption: 50 SC
- Processing time: 3-5 business days

## How to Play

1. **Select a Game**: Browse our game library
2. **Choose Currency**: Select GC or SC mode
3. **Set Your Bet**: Adjust bet amount within limits
4. **Spin & Win**: Enjoy the game and potential rewards

## Withdrawal Process

### Sweeps Coins Redemption
1. Navigate to your wallet
2. Select "Redeem SC"
3. Choose redemption method (bank transfer or check)
4. Verify your identity
5. Submit redemption request

### Processing Times
- Bank Transfer: 3-5 business days
- Check by Mail: 7-14 business days
- Minimum redemption: $50 (50 SC)

## Customer Support

### Contact Methods
- Live Chat: Available 24/7
- Email: support@coinkrizy.com
- Phone: 1-800-COIN-KRZY

### Common Issues
- Account verification problems
- Payment processing delays
- Game technical issues
- Withdrawal questions

## Safety & Security

### Account Security
- Use strong passwords
- Enable two-factor authentication
- Never share login credentials
- Log out from shared devices

### Fair Gaming
- All games use certified Random Number Generators (RNG)
- Regular audits by independent testing labs
- Transparent Return to Player (RTP) rates
- No skill-based manipulation possible`,
        subcategories: ["account", "games", "currency", "support"],
        tags: ["beginner", "overview", "getting-started"],
        visibility: "public",
        lastUpdated: new Date("2024-01-15"),
        updatedBy: "admin",
        version: "2.1",
        attachments: [],
        relatedSections: ["user-002", "user-003"],
      },
      {
        id: "user-002",
        title: "Sweepstakes Rules & Terms",
        category: "user",
        content: `# Sweepstakes Rules & Terms of Service

## Important Legal Information

**READ CAREFULLY**: These terms govern your use of Coin Krazy Social Casino. By creating an account, you agree to these terms.

## Eligibility Requirements

### Age Restrictions
- Must be 18 years or older
- Must be 21+ in states where required by law
- Valid government ID required for verification

### Geographic Restrictions
- Available in most US states
- Prohibited in: Washington, Idaho, Montana, Nevada
- International players: Contact support for availability

### Account Limitations
- One account per person
- No duplicate accounts allowed
- Family sharing prohibited

## Virtual Currency Terms

### Gold Coins (GC)
- Virtual currency for entertainment only
- No cash value or monetary equivalent
- Cannot be transferred between accounts
- Expires after 12 months of inactivity

### Sweeps Coins (SC)
- Promotional currency with redemption value
- Earned through purchases or promotions
- Minimum 50 SC required for redemption
- Subject to redemption terms and conditions

## Sweepstakes Entry Methods

### No Purchase Necessary
- Free daily login bonus
- Social media promotions
- Mail-in requests (details below)
- Referral bonuses

### Mail-In Entry
Send a 3"x5" card with:
- Full name and address
- Date of birth
- Phone number
- Email address

Mail to:
Coin Krazy Social Casino
Attn: Free Entry
P.O. Box 12345
Las Vegas, NV 89101

## Prize Redemption Rules

### Minimum Requirements
- Account verified and in good standing
- Minimum 50 SC balance
- Valid redemption method on file
- No pending violations or disputes

### Redemption Methods
1. **Bank Transfer**
   - Minimum: $50 (50 SC)
   - Maximum: $500 per day
   - Processing: 3-5 business days
   - Fee: None

2. **Check by Mail**
   - Minimum: $50 (50 SC)
   - Maximum: $1,000 per request
   - Processing: 7-14 business days
   - Fee: $5 processing fee

### Tax Obligations
- Winners responsible for all taxes
- 1099 forms issued for winnings over $600
- Consult tax professional for advice

## Prohibited Activities

### Account Violations
- Creating multiple accounts
- Sharing account credentials
- Using bots or automated software
- Fraudulent payment methods

### Game Violations
- Exploiting technical glitches
- Collusion with other players
- Using unauthorized software
- Reverse engineering games

### Penalties
- Account suspension or termination
- Forfeiture of virtual currency balances
- Redemption restrictions
- Legal action if necessary

## Responsible Gaming

### Self-Control Tools
- Daily, weekly, monthly limits
- Loss limits and session timers
- Self-exclusion options (24 hours to permanent)
- Reality checks and notifications

### Problem Gaming Resources
- National Council on Problem Gambling: 1-800-522-4700
- Gamblers Anonymous: www.gamblersanonymous.org
- Additional resources: www.ncpgambling.org

### Age Verification
- Strict 18+ enforcement
- ID verification required
- Social Security verification
- Credit card validation

## Privacy & Data Protection

### Information Collection
- Personal identification information
- Gaming activity and preferences
- Payment and financial information
- Device and technical data

### Information Use
- Account management and verification
- Game development and improvement
- Marketing communications (opt-out available)
- Legal compliance and fraud prevention

### Information Sharing
- Never sold to third parties
- Shared with payment processors
- Required by law enforcement
- Service providers under contract

## Dispute Resolution

### Customer Complaints
1. Contact customer support first
2. Escalation to management
3. Independent arbitration if needed
4. Legal action as last resort

### Arbitration Terms
- Binding arbitration required
- Individual claims only (no class action)
- Arbitrator decision final
- Location: Las Vegas, Nevada

## Terms Modification

### Updates and Changes
- Terms may be updated periodically
- Users notified of material changes
- Continued use constitutes acceptance
- Prior version archived for reference

### Effective Date
These terms effective as of January 1, 2024

## Contact Information

**Legal Questions**: legal@coinkrizy.com
**Privacy Questions**: privacy@coinkrizy.com
**General Support**: support@coinkrizy.com`,
        subcategories: ["legal", "sweepstakes", "terms", "privacy"],
        tags: ["legal", "required-reading", "sweepstakes"],
        visibility: "public",
        lastUpdated: new Date("2024-01-01"),
        updatedBy: "legal-team",
        version: "3.2",
        attachments: [],
        relatedSections: ["user-003", "user-004"],
      },
      {
        id: "user-003",
        title: "Gaming Warnings & Safety",
        category: "user",
        content: `# Gaming Warnings & Player Safety

## ⚠️ Important Safety Information

Gaming should be fun and entertaining. Please read these important safety guidelines to ensure a positive experience.

## Responsible Gaming Commitment

### Our Promise
- Fair and transparent gaming
- Player protection tools
- 24/7 responsible gaming support
- Regular safety assessments

### Warning Signs
Watch for these signs of problem gaming:
- Spending more than intended
- Gaming to escape problems
- Lying about gaming activities
- Borrowing money to continue gaming
- Neglecting responsibilities

## Age Restrictions

### Strict 18+ Policy
- Must be 18 years or older in most states
- Must be 21+ in states requiring higher age
- Zero tolerance for underage gaming
- Immediate account closure for violations

### Verification Process
- Government-issued ID required
- Social Security verification
- Credit card validation
- Additional verification may be required

## Financial Safety

### Spending Limits
- Set daily, weekly, monthly limits
- Automatic enforcement of limits
- Cannot be increased immediately
- 24-hour cooling off period for increases

### Payment Protection
- Secure payment processing
- No stored payment information
- Fraud monitoring and alerts
- Chargeback protection policies

### Red Flags
Stop gaming if you experience:
- Chasing losses with bigger bets
- Gaming with money for bills/rent
- Hiding gaming activities
- Feeling anxious when not gaming

## Technical Safety

### Fair Gaming Guarantee
- Certified Random Number Generators
- Regular independent audits
- Published Return to Player rates
- No skill-based manipulation

### Game Integrity
- No predetermined outcomes
- Each spin completely independent
- Cannot be influenced by previous results
- Transparent mathematical models

## Account Security

### Password Safety
- Use unique, strong passwords
- Enable two-factor authentication
- Never share login credentials
- Regular password updates recommended

### Session Security
- Automatic logout after inactivity
- Secure connection (SSL encryption)
- Log out on shared devices
- Monitor account activity regularly

## Getting Help

### Self-Help Tools
- Reality checks every 30 minutes
- Session time limits
- Loss limit notifications
- Take-a-break reminders

### Professional Resources
- **National Problem Gambling Helpline**: 1-800-522-4700
- **Gamblers Anonymous**: www.gamblersanonymous.org
- **National Council on Problem Gambling**: www.ncpgambling.org
- **SAMHSA Helpline**: 1-800-662-4357

### Immediate Support
If you're experiencing gambling problems:
1. Use our self-exclusion tools immediately
2. Call the problem gambling helpline
3. Seek professional counseling
4. Remove payment methods from account

## Family Safety

### Parental Controls
- Secure your devices from children
- Use parental control software
- Monitor internet activity
- Keep login credentials private

### Household Protection
- Discuss gaming responsibly with family
- Set household gaming rules
- Monitor spending together
- Seek help if needed

## Legal Warnings

### Geographic Restrictions
- Not available in all states
- Check local laws before playing
- Compliance with state regulations required
- Account closure in restricted areas

### Tax Implications
- Winnings may be taxable
- Consult tax professional
- Keep records of activity
- Report winnings as required

## Medical Considerations

### Health Warnings
Gaming may not be suitable if you have:
- History of gambling addiction
- Impulse control disorders
- Financial stress or debt problems
- Mental health conditions affecting judgment

### Consultation Recommended
Speak with healthcare providers if:
- Taking medications affecting judgment
- Undergoing treatment for addiction
- Experiencing financial difficulties
- Having relationship problems related to gaming

## Emergency Procedures

### Immediate Account Protection
If you suspect account compromise:
1. Change password immediately
2. Contact customer support
3. Review recent activity
4. File dispute if necessary

### Crisis Resources
- **Crisis Text Line**: Text HOME to 741741
- **National Suicide Prevention Lifeline**: 988
- **Mental Health America**: www.mhanational.org

## Regular Safety Reminders

### Before Each Session
- Check your spending limits
- Confirm you're gaming for fun
- Ensure you have time available
- Verify you're in a good mental state

### After Each Session
- Review your activity
- Check remaining balances
- Assess your enjoyment level
- Take breaks between sessions

Remember: Gaming is entertainment, not an investment or income source.`,
        subcategories: ["safety", "responsible-gaming", "warnings", "health"],
        tags: ["safety", "warning", "health", "required"],
        visibility: "public",
        lastUpdated: new Date("2024-01-10"),
        updatedBy: "safety-team",
        version: "1.8",
        attachments: [],
        relatedSections: ["user-002", "user-004"],
      },
      // Staff Documentation
      {
        id: "staff-001",
        title: "Staff Panel Guide & Features",
        category: "staff",
        content: `# Staff Panel Guide & Features

## Staff Panel Overview

The Coin Krazy staff panel provides essential tools for managing player accounts, processing requests, and maintaining platform operations.

## Access Levels

### Staff Permissions
- Player account management
- Payment processing
- Customer support tools
- Basic reporting access

### Manager Permissions
- All staff permissions
- Staff performance monitoring
- Advanced reporting
- Policy enforcement

### Admin Permissions
- Full system access
- User management
- System configuration
- Security oversight

## Daily Operations

### Player Support
1. **Account Verification**
   - Review submitted documents
   - Verify identity information
   - Approve or reject applications
   - Document verification decisions

2. **Payment Processing**
   - Review withdrawal requests
   - Verify player eligibility
   - Process approved redemptions
   - Handle payment disputes

3. **Technical Support**
   - Investigate game issues
   - Assist with account problems
   - Escalate technical problems
   - Document support interactions

### Quality Assurance
- Monitor player communications
- Review account activities
- Identify suspicious behavior
- Report compliance violations

## Staff Panel Features

### Dashboard Overview
- Pending tasks counter
- Priority alerts
- Performance metrics
- Quick action buttons

### Player Management
- Search player accounts
- View account history
- Modify account settings
- Apply account restrictions

### Payment Center
- Process withdrawal requests
- Review payment methods
- Handle disputes
- Generate payment reports

### Communication Tools
- Internal messaging system
- Player communication logs
- Team collaboration features
- Escalation procedures

## Performance Standards

### Response Times
- Critical issues: 1 hour
- High priority: 4 hours
- Standard requests: 24 hours
- General inquiries: 48 hours

### Quality Metrics
- Customer satisfaction scores
- First contact resolution rate
- Escalation rate
- Processing accuracy

### Professional Standards
- Maintain player confidentiality
- Follow communication guidelines
- Document all interactions
- Escalate when appropriate

## Escalation Procedures

### When to Escalate
- Security concerns
- Legal questions
- Technical issues beyond scope
- Policy violations

### How to Escalate
1. Document the issue thoroughly
2. Select appropriate escalation level
3. Provide all relevant information
4. Follow up as required

## Training Requirements

### Initial Training
- Platform overview (8 hours)
- Customer service skills (4 hours)
- Security protocols (2 hours)
- Legal compliance (4 hours)

### Ongoing Education
- Monthly team meetings
- Quarterly policy updates
- Annual compliance training
- Skill development workshops

## Staff Policies

### Confidentiality
- Never share player information
- Secure handling of sensitive data
- Report security breaches immediately
- Follow data protection protocols

### Professional Conduct
- Maintain professional demeanor
- Respectful communication
- Punctual attendance
- Appropriate workplace behavior

### Technology Use
- Approved software only
- No personal use during work hours
- Report technical issues promptly
- Follow security guidelines`,
        subcategories: ["staff-tools", "procedures", "training", "policies"],
        tags: ["staff-only", "procedures", "training"],
        visibility: "staff_only",
        lastUpdated: new Date("2024-01-12"),
        updatedBy: "hr-team",
        version: "2.5",
        attachments: [],
        relatedSections: ["staff-002", "admin-001"],
      },
      {
        id: "staff-002",
        title: "Sweepstakes Staff Policies & Procedures",
        category: "staff",
        content: `# Sweepstakes Staff Policies & Procedures

## Legal Compliance Requirements

### Sweepstakes Laws
All staff must understand and comply with sweepstakes regulations:
- No purchase necessary requirements
- Proper entry methods and verification
- Prize fulfillment obligations
- Age and geographic restrictions

### Regulatory Compliance
- Monitor player eligibility daily
- Verify age and location requirements
- Maintain accurate redemption records
- Report suspicious activity immediately

## Staff Responsibilities

### Customer Support Staff
1. **Account Verification**
   - Verify player identity using government-issued ID
   - Check address verification documents
   - Confirm banking information for redemptions
   - Document all verification steps

2. **Redemption Processing**
   - Review withdrawal requests within 24 hours
   - Verify minimum balance requirements (50 SC)
   - Process approved redemptions within 3-5 business days
   - Handle redemption disputes professionally

3. **Player Education**
   - Explain sweepstakes rules clearly
   - Assist with redemption process
   - Provide guidance on responsible gaming
   - Answer questions about virtual currencies

### Security Team
1. **Fraud Prevention**
   - Monitor for multiple accounts
   - Detect suspicious betting patterns
   - Verify payment method ownership
   - Report fraud attempts to management

2. **Compliance Monitoring**
   - Daily age verification audits
   - Geographic restriction enforcement
   - Anti-money laundering checks
   - Responsible gaming limit monitoring

## Daily Procedures

### Morning Checklist
- [ ] Review overnight alerts and reports
- [ ] Check pending verification requests
- [ ] Process approved redemption requests
- [ ] Update staff on any policy changes

### Verification Process
1. **Identity Verification**
   - Government-issued photo ID required
   - Name must match account registration
   - Address verification with utility bill
   - Phone number verification via SMS

2. **Banking Verification**
   - Bank account ownership verification
   - Routing and account number validation
   - No third-party accounts allowed
   - Document verification method used

### Redemption Processing
1. **Eligibility Check**
   - Minimum 50 SC balance confirmed
   - Account in good standing
   - No pending disputes or violations
   - Geographic eligibility verified

2. **Processing Steps**
   - Generate redemption request ID
   - Deduct SC from player balance
   - Submit to payment processor
   - Send confirmation to player

## Quality Standards

### Response Times
- Account verification: 24 hours
- Redemption requests: 24 hours processing
- Customer inquiries: 4 hours maximum
- Dispute resolution: 48 hours

### Accuracy Requirements
- 99.5% verification accuracy
- Zero payment processing errors
- 100% compliance with regulations
- Complete documentation required

## Communication Guidelines

### Player Interactions
- Always professional and courteous
- Clear explanation of processes
- Empathetic to player concerns
- Escalate complex issues promptly

### Internal Communications
- Document all significant interactions
- Use appropriate escalation channels
- Share relevant information with team
- Maintain confidentiality always

## Prohibited Activities

### Absolutely Forbidden
- Sharing player personal information
- Processing requests without verification
- Accepting bribes or gifts from players
- Modifying redemption amounts without authorization

### Disciplinary Actions
- First violation: Written warning
- Second violation: Suspension
- Third violation: Termination
- Criminal activity: Immediate termination + legal action

## Training & Certification

### Required Certifications
- Sweepstakes law compliance (annual)
- Customer service excellence (biannual)
- Security protocols (quarterly)
- Platform technical training (ongoing)

### Ongoing Education
- Monthly compliance updates
- Quarterly skill assessments
- Annual policy review
- Special training for new features

## AI Employee Coordination

### Task Assignment Process
1. **AI Assessment**: LuckyAI evaluates task complexity and urgency
2. **Skill Matching**: Tasks assigned based on staff specialization
3. **Priority Queuing**: Urgent tasks escalated immediately
4. **Progress Tracking**: AI monitors completion and quality

### Collaboration Guidelines
- Respond to AI task assignments within 30 minutes
- Update task status regularly throughout process
- Escalate to AI if additional resources needed
- Provide feedback on AI recommendations

### Performance Integration
- AI tracks completion times and accuracy
- Provides real-time performance feedback
- Identifies training opportunities
- Assists with workload balancing

## Emergency Procedures

### Security Incidents
1. Immediately notify SecuritySentinel AI
2. Document all details thoroughly
3. Preserve evidence and logs
4. Follow incident response protocol

### System Outages
1. Switch to backup verification procedures
2. Notify players of delays immediately
3. Maintain manual processing logs
4. Resume normal operations when restored

### Compliance Violations
1. Stop all related processing immediately
2. Notify ComplianceOfficer AI and management
3. Preserve all relevant documentation
4. Await guidance before proceeding

## Job Duties by Role

### Customer Support Representative
- Process account verifications (20-30 per day)
- Handle player inquiries (50-75 per day)
- Assist with redemption requests
- Maintain 95%+ satisfaction rating

### Payment Processor
- Review and approve redemptions (15-25 per day)
- Verify banking information
- Process payment transfers
- Handle payment disputes

### Compliance Specialist
- Conduct daily compliance audits
- Monitor regulatory changes
- Train staff on new requirements
- Maintain compliance documentation

### Team Leader
- Supervise 5-8 staff members
- Monitor team performance metrics
- Handle escalated customer issues
- Coordinate with AI employee system`,
        subcategories: [
          "compliance",
          "procedures",
          "training",
          "ai-coordination",
        ],
        tags: ["staff-only", "sweepstakes", "compliance", "required"],
        visibility: "staff_only",
        lastUpdated: new Date("2024-01-14"),
        updatedBy: "compliance-team",
        version: "3.0",
        attachments: [],
        relatedSections: ["staff-001", "staff-003"],
      },
      {
        id: "staff-003",
        title: "AI Employee Coordination & Task Management",
        category: "staff",
        content: `# AI Employee Coordination & Task Management

## AI Employee System Overview

The Coin Krazy platform utilizes six specialized AI employees to assist staff with daily operations and provide 24/7 support across all casino functions.

## Meet Your AI Team

### LuckyAI - Operations Manager
- **Role**: Master coordinator and meeting host
- **Responsibilities**: Overall operations management, task assignment, performance reporting
- **When to Contact**: General questions, status updates, team coordination
- **Response Time**: Immediate

### SecuritySentinel - Security Manager
- **Role**: Platform security and fraud detection specialist
- **Responsibilities**: Fraud monitoring, security alerts, compliance checks
- **When to Contact**: Security concerns, suspicious activity, fraud reports
- **Response Time**: Immediate for critical issues

### GameMaster - Game Operations Specialist
- **Role**: Game mechanics and player experience expert
- **Responsibilities**: Game performance monitoring, RTP analysis, player behavior analysis
- **When to Contact**: Game issues, performance problems, player complaints about games
- **Response Time**: 5 minutes for game-breaking issues

### CustomerCare - Customer Support Lead
- **Role**: Player support and satisfaction specialist
- **Responsibilities**: Support ticket routing, satisfaction monitoring, escalation management
- **When to Contact**: Complex player issues, satisfaction concerns, support process questions
- **Response Time**: 2 minutes during business hours

### DataAnalyst - Analytics Specialist
- **Role**: Data analysis and business intelligence expert
- **Responsibilities**: Performance metrics, trend analysis, predictive modeling
- **When to Contact**: Reporting needs, data questions, trend analysis requests
- **Response Time**: 10 minutes for standard requests

### ComplianceOfficer - Compliance Manager
- **Role**: Regulatory compliance and legal oversight specialist
- **Responsibilities**: Regulatory monitoring, policy enforcement, audit preparation
- **When to Contact**: Compliance questions, regulatory concerns, policy clarifications
- **Response Time**: Immediate for compliance issues

## Task Assignment System

### Automatic Task Assignment
The AI system automatically assigns tasks based on:
- Staff specialization and expertise
- Current workload and availability
- Task priority and complexity
- Geographic and time zone considerations

### Manual Task Requests
Staff can request specific tasks or assistance:
1. Use the admin chat window
2. Tag the appropriate AI employee
3. Describe the task clearly
4. Specify urgency level
5. Provide relevant context

### Task Priority Levels
- **Urgent**: Immediate attention required (compliance, security, system outages)
- **High**: Complete within 1 hour (player disputes, payment issues)
- **Medium**: Complete within 4 hours (account verifications, general support)
- **Low**: Complete within 24 hours (documentation, routine maintenance)

## Daily Coordination Workflow

### Morning Briefing (9:00 AM)
- LuckyAI provides overnight summary
- AI employees report status and alerts
- Task assignments for the day
- Priority items and deadlines

### Midday Check-in (1:00 PM)
- Progress updates on morning tasks
- Afternoon task assignments
- Resource reallocation if needed
- Player volume and support needs

### Evening Wrap-up (6:00 PM)
- Daily completion summary
- Handoff to night shift
- Outstanding issues documentation
- Next day preparation

### Real-time Coordination
- Continuous monitoring and support
- Immediate escalation for urgent issues
- Dynamic task reassignment
- Performance feedback and coaching

## Communication Protocols

### Chat System Usage
1. **@LuckyAI** for general coordination and status updates
2. **@SecuritySentinel** for security concerns with HIGH priority
3. **@GameMaster** for game-related issues
4. **@CustomerCare** for player satisfaction concerns
5. **@DataAnalyst** for data and reporting requests
6. **@ComplianceOfficer** for regulatory questions

### Response Expectations
- Acknowledge AI task assignments within 5 minutes
- Provide status updates every 30 minutes for urgent tasks
- Complete tasks within assigned timeframes
- Report any blockers immediately

### Escalation Procedures
1. Try AI assistance first for standard issues
2. Escalate to human supervisor for complex decisions
3. Contact management for policy questions
4. Emergency escalation for critical issues

## Performance Monitoring

### AI-Tracked Metrics
- Task completion times
- Quality scores
- Customer satisfaction ratings
- Escalation rates
- Training needs identified

### Feedback Integration
- Real-time performance coaching
- Skill development recommendations
- Workload optimization
- Process improvement suggestions

### Recognition System
- AI identifies top performers
- Automated recognition messages
- Performance trends tracking
- Team achievement celebrations

## Staff Responsibilities

### Task Management
- Check AI task queue every 15 minutes
- Update task status in real-time
- Ask for help when needed
- Complete documentation requirements

### Quality Standards
- Follow AI recommendations
- Maintain accuracy standards
- Meet response time requirements
- Provide excellent customer service

### Collaboration
- Share relevant information with AI
- Provide feedback on AI suggestions
- Participate in team coordination
- Support fellow staff members

## AI Assistance Examples

### Account Verification
- AI pre-screens documents
- Flags potential issues
- Provides verification checklist
- Tracks completion status

### Payment Processing
- AI verifies eligibility
- Calculates processing fees
- Generates confirmation codes
- Monitors for fraud indicators

### Customer Support
- AI suggests response templates
- Provides player history context
- Recommends escalation when needed
- Tracks satisfaction scores

### Compliance Monitoring
- AI flags regulatory concerns
- Provides compliance checklists
- Monitors deadline adherence
- Generates audit reports

## Training & Support

### AI Training Modules
- Individual AI employee specializations
- Communication best practices
- Task management efficiency
- Quality improvement techniques

### Ongoing Support
- Daily coaching from AI employees
- Weekly performance reviews
- Monthly skill assessments
- Quarterly training updates

### Career Development
- AI identifies promotion opportunities
- Skill gap analysis and training plans
- Cross-training recommendations
- Leadership development paths

## Troubleshooting

### Common Issues
- AI not responding: Check chat connection
- Task not assigned: Contact LuckyAI
- Unclear instructions: Ask for clarification
- System errors: Report to technical support

### Emergency Procedures
- System failure: Revert to manual processes
- AI unavailable: Contact human supervisor
- Critical errors: Escalate immediately
- Data concerns: Stop processing and report

## Best Practices

### Effective Communication
- Be specific and clear in requests
- Provide complete context
- Ask follow-up questions
- Confirm understanding

### Efficiency Tips
- Use AI suggestions and templates
- Batch similar tasks together
- Prioritize urgent items first
- Document lessons learned

### Professional Development
- Learn from AI feedback
- Practice new skills regularly
- Seek additional training
- Share knowledge with team`,
        subcategories: [
          "ai-coordination",
          "task-management",
          "communication",
          "training",
        ],
        tags: ["staff-only", "ai-employees", "coordination", "required"],
        visibility: "staff_only",
        lastUpdated: new Date("2024-01-15"),
        updatedBy: "ai-team",
        version: "1.0",
        attachments: [],
        relatedSections: ["staff-001", "staff-002", "admin-001"],
      },
      // Admin Documentation
      {
        id: "admin-001",
        title: "Admin Panel Complete Guide",
        category: "admin",
        content: `# Admin Panel Complete Guide

## System Administration Overview

The Coin Krazy admin panel provides comprehensive control over all platform operations, from user management to system configuration.

## Core Admin Functions

### User Management
- Create/modify user accounts
- Set permission levels
- Monitor user activity
- Handle account violations

### System Configuration
- Platform settings
- Game configuration
- Payment processing setup
- Security parameters

### Reporting & Analytics
- Financial reports
- User behavior analytics
- Performance metrics
- Compliance reporting

## Advanced Features

### AI Employee Management
- Configure AI behavior
- Monitor AI performance
- Adjust response patterns
- Update knowledge bases

### Security Center
- Monitor suspicious activity
- Review security alerts
- Configure fraud detection
- Manage access controls

### Game Management
- Add/remove games
- Configure RTP settings
- Monitor game performance
- Handle game issues

## Administrative Workflows

### Daily Tasks
- Review overnight alerts
- Process urgent escalations
- Monitor system performance
- Update security protocols

### Weekly Tasks
- Generate performance reports
- Review staff performance
- Update system configurations
- Conduct security audits

### Monthly Tasks
- Financial reconciliation
- Compliance reporting
- Staff performance reviews
- System maintenance

## Emergency Procedures

### Security Incidents
1. Isolate affected systems
2. Document incident details
3. Notify relevant authorities
4. Implement containment measures

### Technical Failures
1. Assess impact scope
2. Activate backup systems
3. Notify affected users
4. Begin recovery procedures

### Compliance Issues
1. Document violation
2. Suspend affected accounts
3. Report to regulators
4. Implement corrective actions

## Administrative Tools

### Bulk Operations
- Mass user updates
- Bulk payment processing
- System-wide notifications
- Database maintenance

### Automation Features
- Scheduled reports
- Automated responses
- System monitoring
- Maintenance tasks

### Integration Management
- Third-party services
- Payment processors
- Compliance tools
- Analytics platforms

## Compliance & Regulations

### Regulatory Requirements
- Licensing compliance
- Age verification
- Anti-money laundering
- Responsible gaming

### Audit Procedures
- Regular compliance checks
- External audit preparation
- Documentation maintenance
- Corrective action plans

### Legal Considerations
- Terms of service updates
- Privacy policy changes
- Jurisdictional compliance
- Dispute resolution

## Performance Monitoring

### Key Metrics
- System uptime
- Response times
- Error rates
- User satisfaction

### Alerting System
- Critical system alerts
- Performance thresholds
- Security notifications
- Compliance warnings

### Reporting Dashboard
- Real-time metrics
- Historical trends
- Comparative analysis
- Predictive insights`,
        subcategories: ["system-admin", "security", "compliance", "monitoring"],
        tags: ["admin-only", "system", "security"],
        visibility: "admin_only",
        lastUpdated: new Date("2024-01-14"),
        updatedBy: "admin",
        version: "3.1",
        attachments: [],
        relatedSections: ["admin-002", "staff-001"],
      },
    ];

    setDocumentSections(sections);
  };

  const filteredSections = documentSections.filter((section) => {
    const matchesSearch =
      searchTerm === "" ||
      section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase()),
      );

    const matchesTab = section.category === activeTab;

    // Check visibility permissions
    const hasPermission =
      section.visibility === "public" ||
      (section.visibility === "staff_only" && (isStaff || isAdmin)) ||
      (section.visibility === "admin_only" && isAdmin);

    return matchesSearch && matchesTab && hasPermission;
  });

  const getCategoryIcon = (category: string) => {
    const icons = {
      user: Users,
      staff: Settings,
      admin: Shield,
    };
    return icons[category as keyof typeof icons] || FileText;
  };

  const getVisibilityIcon = (visibility: string) => {
    const icons = {
      public: Eye,
      staff_only: Users,
      admin_only: Shield,
    };
    return icons[visibility as keyof typeof icons] || Eye;
  };

  const exportSection = (section: DocumentationSection) => {
    const exportData = {
      ...section,
      exportedAt: new Date().toISOString(),
      exportedBy: user?.username || "admin",
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `doc-${section.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (selectedSection) {
    return (
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedSection(null)}
              className="mb-2"
            >
              ← Back to Docs
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportSection(selectedSection)}
              >
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
              {isAdmin && (
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {selectedSection.title}
            </h2>
            <Badge
              className={`${
                selectedSection.visibility === "public"
                  ? "bg-green-100 text-green-800"
                  : selectedSection.visibility === "staff_only"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-red-100 text-red-800"
              }`}
            >
              {selectedSection.visibility.replace("_", " ")}
            </Badge>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span>Version {selectedSection.version}</span>
            <span>
              Updated {selectedSection.lastUpdated.toLocaleDateString()}
            </span>
            <span>by {selectedSection.updatedBy}</span>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1 p-6">
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <div className="whitespace-pre-wrap">{selectedSection.content}</div>
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Documentation
        </h3>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search documentation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as any)}
        >
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="user" className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
            <TabsTrigger
              value="staff"
              className="flex items-center gap-1"
              disabled={!isStaff && !isAdmin}
            >
              <Settings className="w-4 h-4" />
              Staff
            </TabsTrigger>
            <TabsTrigger
              value="admin"
              className="flex items-center gap-1"
              disabled={!isAdmin}
            >
              <Shield className="w-4 h-4" />
              Admin
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Documentation List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          <AnimatePresence>
            {filteredSections.map((section) => {
              const CategoryIcon = getCategoryIcon(section.category);
              const VisibilityIcon = getVisibilityIcon(section.visibility);

              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedSection(section)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <CategoryIcon className="w-5 h-5 text-gray-500" />
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {section.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <VisibilityIcon className="w-4 h-4 text-gray-400" />
                      <Badge variant="outline" className="text-xs">
                        v{section.version}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {section.content.split("\n")[0].replace(/^#+ /, "")}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {section.tags.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {section.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{section.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {section.lastUpdated.toLocaleDateString()}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredSections.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No documentation found</p>
              {!isStaff && !isAdmin && (
                <p className="text-sm mt-2">
                  Some sections may require special permissions
                </p>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
