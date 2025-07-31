import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  Camera,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  MapPin,
  Calendar,
  Phone,
  Mail,
  CreditCard,
  Shield,
  Eye,
  EyeOff,
  RefreshCw,
  Download,
  Clock,
  Bot,
  Star,
  Award,
  Lock,
  Unlock,
  Zap,
  Target,
  Users,
  Globe,
  Smartphone,
  Monitor,
  FileCheck,
  ScanLine,
  UserCheck,
  Home,
  Building,
  DollarSign,
  Banknote,
  Receipt,
  CircleCheck,
  AlertCircle,
  Info,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { useAuth } from './AuthContext';

interface KYCDocument {
  id: string;
  type: 'photo_id' | 'drivers_license' | 'passport' | 'utility_bill' | 'bank_statement' | 'address_proof';
  fileName: string;
  fileSize: number;
  uploadedAt: Date;
  status: 'pending' | 'verified' | 'rejected' | 'requires_review';
  front?: string; // base64 or URL
  back?: string; // base64 or URL for two-sided documents
  extractedData?: {
    name?: string;
    address?: string;
    dateOfBirth?: string;
    documentNumber?: string;
    expiryDate?: string;
    issueDate?: string;
  };
  aiAnalysis?: {
    confidence: number;
    issues: string[];
    riskScore: number;
  };
  rejectionReason?: string;
}

interface KYCProfile {
  id: string;
  userId: string;
  status: 'not_started' | 'in_progress' | 'pending_review' | 'verified' | 'rejected';
  personalInfo: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    phoneNumber: string;
    email: string;
    ssn?: string; // Last 4 digits only
  };
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  documents: KYCDocument[];
  verification: {
    identityVerified: boolean;
    addressVerified: boolean;
    phoneVerified: boolean;
    emailVerified: boolean;
    livenessCheck: boolean;
  };
  riskAssessment: {
    overallScore: number;
    factors: string[];
    recommendations: string[];
  };
  submittedAt?: Date;
  verifiedAt?: Date;
  rejectedAt?: Date;
  reviewNotes?: string;
  luckyAIInteractions: AIInteraction[];
}

interface AIInteraction {
  id: string;
  timestamp: Date;
  type: 'guidance' | 'verification' | 'assistance' | 'approval' | 'rejection';
  message: string;
  response?: string;
  helpful: boolean | null;
}

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  required: boolean;
  completed: boolean;
  component: string;
}

export const KYCOnboarding: React.FC = () => {
  const [kycProfile, setKycProfile] = useState<KYCProfile | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<KYCDocument | null>(null);
  const [luckyAIVisible, setLuckyAIVisible] = useState(true);
  const [currentAIMessage, setCurrentAIMessage] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const [aiInteractions, setAIInteractions] = useState<AIInteraction[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const onboardingSteps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to KYC Verification',
      description: 'Let\'s verify your identity to ensure platform security',
      required: true,
      completed: false,
      component: 'Welcome'
    },
    {
      id: 'personal_info',
      title: 'Personal Information',
      description: 'Provide your basic personal details',
      required: true,
      completed: false,
      component: 'PersonalInfo'
    },
    {
      id: 'address',
      title: 'Address Information',
      description: 'Enter your current address details',
      required: true,
      completed: false,
      component: 'Address'
    },
    {
      id: 'photo_id',
      title: 'Photo ID Upload',
      description: 'Upload a government-issued photo ID (both sides)',
      required: true,
      completed: false,
      component: 'PhotoID'
    },
    {
      id: 'address_proof',
      title: 'Address Verification',
      description: 'Upload a recent utility bill or bank statement',
      required: true,
      completed: false,
      component: 'AddressProof'
    },
    {
      id: 'liveness',
      title: 'Liveness Verification',
      description: 'Take a selfie to verify you\'re a real person',
      required: true,
      completed: false,
      component: 'LivenessCheck'
    },
    {
      id: 'review',
      title: 'Review & Submit',
      description: 'Review your information and submit for approval',
      required: true,
      completed: false,
      component: 'Review'
    }
  ];

  useEffect(() => {
    initializeKYC();
    initializeLuckyAI();
  }, [user]);

  const initializeKYC = () => {
    // Initialize or load existing KYC profile
    const profile: KYCProfile = {
      id: `kyc_${user?.id || 'demo'}`,
      userId: user?.id || 'demo',
      status: 'not_started',
      personalInfo: {
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        phoneNumber: '',
        email: user?.email || '',
        ssn: ''
      },
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'United States'
      },
      documents: [],
      verification: {
        identityVerified: false,
        addressVerified: false,
        phoneVerified: false,
        emailVerified: false,
        livenessCheck: false
      },
      riskAssessment: {
        overallScore: 0,
        factors: [],
        recommendations: []
      },
      luckyAIInteractions: []
    };

    setKycProfile(profile);
  };

  const initializeLuckyAI = () => {
    const welcomeMessage: AIInteraction = {
      id: `ai_${Date.now()}`,
      timestamp: new Date(),
      type: 'guidance',
      message: `Hi there! 🍀 I'm LuckyAI, your personal KYC assistant. I'm here to guide you through the identity verification process step by step. This helps keep CoinKrazy secure for everyone! 

Don't worry - I'll make this as smooth as possible. Ready to get started?`,
      helpful: null
    };

    setAIInteractions([welcomeMessage]);
    setCurrentAIMessage(welcomeMessage.message);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, documentType: KYCDocument['type']) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
          throw new Error('File size must be less than 10MB');
        }

        if (!file.type.startsWith('image/')) {
          throw new Error('Only image files are allowed');
        }

        // Convert to base64
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });

        // Create document record
        const document: KYCDocument = {
          id: `doc_${Date.now()}_${i}`,
          type: documentType,
          fileName: file.name,
          fileSize: file.size,
          uploadedAt: new Date(),
          status: 'pending',
          front: base64,
          aiAnalysis: {
            confidence: Math.random() * 20 + 80, // Simulate 80-100% confidence
            issues: [],
            riskScore: Math.random() * 20 + 10 // Simulate 10-30 risk score
          }
        };

        // Simulate AI document analysis
        setTimeout(() => {
          const analysisResults = simulateDocumentAnalysis(document);
          document.extractedData = analysisResults.extractedData;
          document.aiAnalysis = analysisResults.aiAnalysis;
          document.status = analysisResults.aiAnalysis.riskScore < 50 ? 'verified' : 'requires_review';

          setKycProfile(prev => prev ? {
            ...prev,
            documents: [...prev.documents, document]
          } : null);

          // LuckyAI response
          addAIInteraction('verification', 
            `Great! I've analyzed your ${documentType.replace('_', ' ')}. ${
              document.status === 'verified' 
                ? '✅ Everything looks good! The document passed all security checks.'
                : '⚠️ The document needs manual review. Our team will check it within 24 hours.'
            }`
          );
        }, 2000);
      }
    } catch (error) {
      console.error('Upload error:', error);
      addAIInteraction('assistance', `❌ Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again or contact support.`);
    } finally {
      setIsUploading(false);
    }
  };

  const simulateDocumentAnalysis = (document: KYCDocument) => {
    // Simulate realistic document analysis
    const confidence = Math.random() * 15 + 85; // 85-100%
    const riskScore = Math.random() * 30 + 10; // 10-40

    const extractedData: KYCDocument['extractedData'] = {};
    const issues: string[] = [];

    if (document.type === 'photo_id' || document.type === 'drivers_license') {
      extractedData.name = 'John Doe'; // Would be extracted via OCR
      extractedData.dateOfBirth = '1990-01-01';
      extractedData.documentNumber = 'D123456789';
      extractedData.expiryDate = '2028-01-01';

      if (confidence < 90) {
        issues.push('Image quality could be better');
      }
      if (riskScore > 25) {
        issues.push('Document appears to have minor wear');
      }
    }

    if (document.type === 'utility_bill') {
      extractedData.name = 'John Doe';
      extractedData.address = '123 Main St, Anytown, ST 12345';
      extractedData.issueDate = '2024-01-01';

      if (confidence < 85) {
        issues.push('Address extraction confidence could be higher');
      }
    }

    return {
      extractedData,
      aiAnalysis: {
        confidence,
        issues,
        riskScore
      }
    };
  };

  const addAIInteraction = (type: AIInteraction['type'], message: string) => {
    const interaction: AIInteraction = {
      id: `ai_${Date.now()}`,
      timestamp: new Date(),
      type,
      message,
      helpful: null
    };

    setAIInteractions(prev => [...prev, interaction]);
    setCurrentAIMessage(message);
  };

  const sendMessageToAI = () => {
    if (!userMessage.trim()) return;

    // Add user message
    const userInteraction: AIInteraction = {
      id: `user_${Date.now()}`,
      timestamp: new Date(),
      type: 'assistance',
      message: userMessage,
      helpful: null
    };

    setAIInteractions(prev => [...prev, userInteraction]);

    // Simulate AI response based on user message
    setTimeout(() => {
      let aiResponse = '';
      const lowerMessage = userMessage.toLowerCase();

      if (lowerMessage.includes('help') || lowerMessage.includes('stuck')) {
        aiResponse = `I'm here to help! 🍀 Which step are you having trouble with? I can guide you through document uploads, explain requirements, or answer any questions about the verification process.`;
      } else if (lowerMessage.includes('document') || lowerMessage.includes('upload')) {
        aiResponse = `For document uploads, make sure your images are clear, well-lit, and show all corners of the document. I accept JPG, PNG, and PDF files up to 10MB. Need help with a specific document type?`;
      } else if (lowerMessage.includes('how long') || lowerMessage.includes('time')) {
        aiResponse = `The verification process typically takes 1-3 business days once you submit all required documents. I'll analyze most documents instantly, but some may need human review for extra security.`;
      } else if (lowerMessage.includes('secure') || lowerMessage.includes('safe')) {
        aiResponse = `Your documents are completely secure! 🔒 We use bank-level encryption and only store documents for compliance purposes. Your privacy and security are our top priorities.`;
      } else {
        aiResponse = `Thanks for your message! If you need specific help with the KYC process, feel free to ask about document requirements, upload issues, or verification timelines. I'm here to make this as smooth as possible! 🍀`;
      }

      addAIInteraction('assistance', aiResponse);
    }, 1000);

    setUserMessage('');
  };

  const completeStep = (stepId: string) => {
    const stepIndex = onboardingSteps.findIndex(step => step.id === stepId);
    if (stepIndex !== -1) {
      onboardingSteps[stepIndex].completed = true;
      if (stepIndex === currentStep && stepIndex < onboardingSteps.length - 1) {
        setCurrentStep(stepIndex + 1);
      }
    }
  };

  const submitKYCForReview = async () => {
    if (!kycProfile) return;

    setIsProcessing(true);

    try {
      // Simulate submission process
      await new Promise(resolve => setTimeout(resolve, 2000));

      const updatedProfile: KYCProfile = {
        ...kycProfile,
        status: 'pending_review',
        submittedAt: new Date(),
        riskAssessment: {
          overallScore: Math.random() * 30 + 70, // 70-100
          factors: ['Document quality', 'Address match', 'Identity verification'],
          recommendations: ['Approve for standard limits', 'Monitor initial activity']
        }
      };

      setKycProfile(updatedProfile);

      addAIInteraction('approval', 
        `🎉 Excellent! Your KYC verification has been submitted successfully. Our team will review your documents within 24-48 hours. You'll receive an email notification once approved. 

In the meantime, you can start exploring CoinKrazy with limited features. Welcome to the family! 🍀`
      );

      completeStep('review');

    } catch (error) {
      addAIInteraction('assistance', '❌ Submission failed. Please try again or contact support.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStepProgress = () => {
    const completedSteps = onboardingSteps.filter(step => step.completed).length;
    return (completedSteps / onboardingSteps.length) * 100;
  };

  const renderStepContent = () => {
    const step = onboardingSteps[currentStep];
    if (!step || !kycProfile) return null;

    switch (step.component) {
      case 'Welcome':
        return (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="text-center">
              <div className="text-6xl mb-4">🍀</div>
              <CardTitle className="text-white text-2xl">Welcome to CoinKrazy KYC</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300 text-center">
                To ensure platform security and comply with regulations, we need to verify your identity. 
                This process is quick, secure, and only takes a few minutes.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-700 rounded">
                  <Shield className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <h4 className="text-white font-semibold">Secure</h4>
                  <p className="text-sm text-gray-400">Bank-level encryption protects your data</p>
                </div>
                <div className="text-center p-4 bg-gray-700 rounded">
                  <Zap className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <h4 className="text-white font-semibold">Fast</h4>
                  <p className="text-sm text-gray-400">Most verifications complete in minutes</p>
                </div>
                <div className="text-center p-4 bg-gray-700 rounded">
                  <Bot className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <h4 className="text-white font-semibold">AI Assisted</h4>
                  <p className="text-sm text-gray-400">LuckyAI guides you through each step</p>
                </div>
              </div>

              <Button 
                onClick={() => completeStep('welcome')} 
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Start Verification Process
              </Button>
            </CardContent>
          </Card>
        );

      case 'PersonalInfo':
        return (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">First Name</Label>
                  <Input
                    value={kycProfile.personalInfo.firstName}
                    onChange={(e) => setKycProfile(prev => prev ? {
                      ...prev,
                      personalInfo: { ...prev.personalInfo, firstName: e.target.value }
                    } : null)}
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <Label className="text-white">Last Name</Label>
                  <Input
                    value={kycProfile.personalInfo.lastName}
                    onChange={(e) => setKycProfile(prev => prev ? {
                      ...prev,
                      personalInfo: { ...prev.personalInfo, lastName: e.target.value }
                    } : null)}
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div>
                <Label className="text-white">Date of Birth</Label>
                <Input
                  type="date"
                  value={kycProfile.personalInfo.dateOfBirth}
                  onChange={(e) => setKycProfile(prev => prev ? {
                    ...prev,
                    personalInfo: { ...prev.personalInfo, dateOfBirth: e.target.value }
                  } : null)}
                />
              </div>

              <div>
                <Label className="text-white">Phone Number</Label>
                <Input
                  type="tel"
                  value={kycProfile.personalInfo.phoneNumber}
                  onChange={(e) => setKycProfile(prev => prev ? {
                    ...prev,
                    personalInfo: { ...prev.personalInfo, phoneNumber: e.target.value }
                  } : null)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <Label className="text-white">Email Address</Label>
                <Input
                  type="email"
                  value={kycProfile.personalInfo.email}
                  disabled
                  className="bg-gray-600"
                />
                <p className="text-xs text-gray-400 mt-1">Using your account email</p>
              </div>

              <Button 
                onClick={() => {
                  completeStep('personal_info');
                  addAIInteraction('guidance', 'Perfect! Personal information saved. Now let\'s get your address details. 📍');
                }}
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={!kycProfile.personalInfo.firstName || !kycProfile.personalInfo.lastName || !kycProfile.personalInfo.dateOfBirth}
              >
                Continue to Address
              </Button>
            </CardContent>
          </Card>
        );

      case 'Address':
        return (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Address Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-white">Street Address</Label>
                <Input
                  value={kycProfile.address.street}
                  onChange={(e) => setKycProfile(prev => prev ? {
                    ...prev,
                    address: { ...prev.address, street: e.target.value }
                  } : null)}
                  placeholder="123 Main Street"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-white">City</Label>
                  <Input
                    value={kycProfile.address.city}
                    onChange={(e) => setKycProfile(prev => prev ? {
                      ...prev,
                      address: { ...prev.address, city: e.target.value }
                    } : null)}
                    placeholder="City"
                  />
                </div>
                <div>
                  <Label className="text-white">State</Label>
                  <Select
                    value={kycProfile.address.state}
                    onValueChange={(value) => setKycProfile(prev => prev ? {
                      ...prev,
                      address: { ...prev.address, state: value }
                    } : null)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="State" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CA">California</SelectItem>
                      <SelectItem value="NY">New York</SelectItem>
                      <SelectItem value="TX">Texas</SelectItem>
                      <SelectItem value="FL">Florida</SelectItem>
                      <SelectItem value="NV">Nevada</SelectItem>
                      {/* Add more states as needed */}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-white">ZIP Code</Label>
                  <Input
                    value={kycProfile.address.zipCode}
                    onChange={(e) => setKycProfile(prev => prev ? {
                      ...prev,
                      address: { ...prev.address, zipCode: e.target.value }
                    } : null)}
                    placeholder="12345"
                  />
                </div>
              </div>

              <Button 
                onClick={() => {
                  completeStep('address');
                  addAIInteraction('guidance', 'Great! Address saved. Next, we need to verify your identity with a photo ID. 📄');
                }}
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={!kycProfile.address.street || !kycProfile.address.city || !kycProfile.address.state || !kycProfile.address.zipCode}
              >
                Continue to Document Upload
              </Button>
            </CardContent>
          </Card>
        );

      case 'PhotoID':
        return (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Photo ID Upload
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Upload both sides of your government-issued photo ID (driver's license, passport, or state ID). 
                  Ensure the image is clear and all text is readable.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="w-full h-32 border-dashed border-2 border-gray-600 hover:border-blue-500"
                  >
                    <div className="text-center">
                      {isUploading ? (
                        <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
                      ) : (
                        <Upload className="h-8 w-8 mx-auto mb-2" />
                      )}
                      <p className="text-white">
                        {isUploading ? 'Uploading...' : 'Click to upload photo ID'}
                      </p>
                      <p className="text-xs text-gray-400">JPG, PNG up to 10MB</p>
                    </div>
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFileUpload(e, 'photo_id')}
                    className="hidden"
                  />
                </div>

                {/* Display uploaded documents */}
                {kycProfile.documents.filter(doc => doc.type === 'photo_id').map((doc) => (
                  <div key={doc.id} className="p-3 bg-gray-700 rounded border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">{doc.fileName}</span>
                      <Badge className={
                        doc.status === 'verified' ? 'bg-green-600' :
                        doc.status === 'pending' ? 'bg-yellow-600' :
                        doc.status === 'requires_review' ? 'bg-orange-600' : 'bg-red-600'
                      }>
                        {doc.status}
                      </Badge>
                    </div>
                    
                    {doc.aiAnalysis && (
                      <div className="text-sm">
                        <p className="text-gray-300">
                          Confidence: <span className="text-white">{doc.aiAnalysis.confidence.toFixed(1)}%</span>
                        </p>
                        {doc.aiAnalysis.issues.length > 0 && (
                          <p className="text-yellow-400">Issues: {doc.aiAnalysis.issues.join(', ')}</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <Button 
                onClick={() => {
                  completeStep('photo_id');
                  addAIInteraction('guidance', 'ID uploaded successfully! Now we need proof of address. 🏠');
                }}
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={kycProfile.documents.filter(doc => doc.type === 'photo_id').length === 0}
              >
                Continue to Address Proof
              </Button>
            </CardContent>
          </Card>
        );

      case 'AddressProof':
        return (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Home className="h-5 w-5" />
                Address Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Upload a recent utility bill, bank statement, or other official document showing your name and address. 
                  The document must be dated within the last 90 days.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (fileInputRef.current) {
                        fileInputRef.current.onchange = (e) => handleFileUpload(e as any, 'utility_bill');
                        fileInputRef.current.click();
                      }
                    }}
                    disabled={isUploading}
                    className="w-full h-32 border-dashed border-2 border-gray-600 hover:border-blue-500"
                  >
                    <div className="text-center">
                      {isUploading ? (
                        <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
                      ) : (
                        <Upload className="h-8 w-8 mx-auto mb-2" />
                      )}
                      <p className="text-white">
                        {isUploading ? 'Uploading...' : 'Click to upload address proof'}
                      </p>
                      <p className="text-xs text-gray-400">Utility bill, bank statement, etc.</p>
                    </div>
                  </Button>
                </div>

                {/* Display uploaded documents */}
                {kycProfile.documents.filter(doc => doc.type === 'utility_bill').map((doc) => (
                  <div key={doc.id} className="p-3 bg-gray-700 rounded border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">{doc.fileName}</span>
                      <Badge className={
                        doc.status === 'verified' ? 'bg-green-600' :
                        doc.status === 'pending' ? 'bg-yellow-600' :
                        doc.status === 'requires_review' ? 'bg-orange-600' : 'bg-red-600'
                      }>
                        {doc.status}
                      </Badge>
                    </div>
                    
                    {doc.extractedData && (
                      <div className="text-sm">
                        <p className="text-gray-300">
                          Extracted Address: <span className="text-white">{doc.extractedData.address}</span>
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <Button 
                onClick={() => {
                  completeStep('address_proof');
                  addAIInteraction('guidance', 'Address verification complete! One more step - liveness verification. 📸');
                }}
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={kycProfile.documents.filter(doc => doc.type === 'utility_bill').length === 0}
              >
                Continue to Liveness Check
              </Button>
            </CardContent>
          </Card>
        );

      case 'LivenessCheck':
        return (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Liveness Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Take a selfie to verify you're a real person. Look directly at the camera and ensure good lighting.
                </AlertDescription>
              </Alert>

              <div className="text-center">
                <div className="w-64 h-64 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
                  <Camera className="h-16 w-16 text-gray-500" />
                </div>
                
                <Button className="bg-green-600 hover:bg-green-700 mb-2">
                  <Camera className="h-4 w-4 mr-2" />
                  Take Selfie
                </Button>
                
                <p className="text-sm text-gray-400">
                  This helps us verify that you're the same person as in your photo ID
                </p>
              </div>

              <Button 
                onClick={() => {
                  // Simulate liveness check completion
                  setKycProfile(prev => prev ? {
                    ...prev,
                    verification: { ...prev.verification, livenessCheck: true }
                  } : null);
                  completeStep('liveness');
                  addAIInteraction('guidance', 'Perfect! Liveness check passed. Ready to review and submit? 🎉');
                }}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Complete Liveness Check
              </Button>
            </CardContent>
          </Card>
        );

      case 'Review':
        return (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Review & Submit
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-white font-semibold mb-3">Personal Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-400">Name:</span> <span className="text-white">{kycProfile.personalInfo.firstName} {kycProfile.personalInfo.lastName}</span></p>
                    <p><span className="text-gray-400">Date of Birth:</span> <span className="text-white">{kycProfile.personalInfo.dateOfBirth}</span></p>
                    <p><span className="text-gray-400">Phone:</span> <span className="text-white">{kycProfile.personalInfo.phoneNumber}</span></p>
                    <p><span className="text-gray-400">Email:</span> <span className="text-white">{kycProfile.personalInfo.email}</span></p>
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-3">Address</h4>
                  <div className="space-y-2 text-sm">
                    <p className="text-white">
                      {kycProfile.address.street}<br />
                      {kycProfile.address.city}, {kycProfile.address.state} {kycProfile.address.zipCode}<br />
                      {kycProfile.address.country}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-3">Uploaded Documents</h4>
                <div className="space-y-2">
                  {kycProfile.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                      <span className="text-white text-sm">{doc.fileName}</span>
                      <Badge className={
                        doc.status === 'verified' ? 'bg-green-600' :
                        doc.status === 'pending' ? 'bg-yellow-600' :
                        doc.status === 'requires_review' ? 'bg-orange-600' : 'bg-red-600'
                      }>
                        {doc.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  By submitting this verification, you confirm that all information provided is accurate and complete. 
                  Our team will review your submission within 24-48 hours.
                </AlertDescription>
              </Alert>

              <Button 
                onClick={submitKYCForReview}
                disabled={isProcessing}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Submit for Review
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  if (!kycProfile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Loading KYC verification...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-semibold">KYC Verification Progress</h3>
            <span className="text-gray-400 text-sm">{Math.round(getStepProgress())}% Complete</span>
          </div>
          <Progress value={getStepProgress()} className="mb-2" />
          <p className="text-gray-400 text-sm">
            Step {currentStep + 1} of {onboardingSteps.length}: {onboardingSteps[currentStep]?.title}
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {renderStepContent()}
        </div>

        {/* LuckyAI Assistant */}
        <div className="space-y-4">
          <Card className="bg-gradient-to-br from-green-900/30 to-blue-900/30 border-green-500/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <div className="text-2xl">🍀</div>
                  LuckyAI Assistant
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLuckyAIVisible(!luckyAIVisible)}
                >
                  {luckyAIVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </CardHeader>
            
            {luckyAIVisible && (
              <CardContent className="space-y-4">
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {aiInteractions.map((interaction) => (
                      <div
                        key={interaction.id}
                        className={`p-3 rounded-lg ${
                          interaction.message === currentAIMessage 
                            ? 'bg-green-500/20 border border-green-500/30' 
                            : 'bg-gray-700/50'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Bot className="h-4 w-4 text-green-400" />
                          <span className="text-green-400 text-sm font-medium">LuckyAI</span>
                          <span className="text-gray-400 text-xs">
                            {interaction.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-white text-sm whitespace-pre-wrap">
                          {interaction.message}
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ask LuckyAI for help..."
                      value={userMessage}
                      onChange={(e) => setUserMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessageToAI()}
                    />
                    <Button onClick={sendMessageToAI} size="sm">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="text-xs text-gray-400">
                    LuckyAI is here to help with any questions about the verification process.
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Navigation */}
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                  className="flex-1"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(Math.min(onboardingSteps.length - 1, currentStep + 1))}
                  disabled={currentStep === onboardingSteps.length - 1 || !onboardingSteps[currentStep].completed}
                  className="flex-1"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
