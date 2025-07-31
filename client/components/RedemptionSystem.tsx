import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gift,
  DollarSign,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  FileText,
  Download,
  Upload,
  Mail,
  Phone,
  MapPin,
  Calendar,
  History,
  Smartphone,
  Award,
  Package,
  ShoppingCart,
  Star,
  Shield,
  Zap,
  Crown
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { useAuth } from './AuthContext';

interface RedemptionRequest {
  id: string;
  userId: string;
  type: 'cash' | 'gift_card' | 'prize';
  amount: number;
  scAmount: number;
  method: 'cash_app' | 'paypal' | 'zelle' | 'digital_gift_card';
  status: 'pending' | 'approved' | 'processing' | 'completed' | 'rejected' | 'cancelled';
  priority: 'standard' | 'vip' | 'urgent';
  requestDate: Date;
  approvalDate?: Date;
  completedDate?: Date;
  approvedBy?: string;
  rejectionReason?: string;
  paymentDetails: {
    cashAppTag?: string;
    paypalEmail?: string;
    zelleEmail?: string;
    giftCardProvider?: string;
    recipientName?: string;
    phoneNumber?: string;
  };
  verificationDocuments: {
    idDocument?: string;
    proofOfAddress?: string;
    additionalDocs?: string[];
  };
  metadata: {
    playerLevel: string;
    accountAge: number;
    totalDeposits: number;
    previousRedemptions: number;
    riskScore: number;
  };
  adminNotes?: string;
  automaticProcessing: boolean;
  estimatedProcessingTime: string;
}

interface Prize {
  id: string;
  name: string;
  description: string;
  category: 'electronics' | 'gift_cards' | 'experiences' | 'gaming' | 'luxury';
  scCost: number;
  retailValue: number;
  image: string;
  availability: number;
  popularity: number;
  isDigital: boolean;
  processingTime: string;
  features: string[];
}

interface RedemptionSystemProps {
  className?: string;
  isAdminView?: boolean;
}

export const RedemptionSystem: React.FC<RedemptionSystemProps> = ({
  className = '',
  isAdminView = false
}) => {
  const [redemptionRequests, setRedemptionRequests] = useState<RedemptionRequest[]>([]);
  const [availablePrizes, setAvailablePrizes] = useState<Prize[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<RedemptionRequest | null>(null);
  const [isNewRedemption, setIsNewRedemption] = useState(false);
  const [redemptionType, setRedemptionType] = useState<'cash' | 'gift_card' | 'prize'>('cash');
  const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null);
  const [userSweepCoins, setUserSweepCoins] = useState(150.50);
  const [filter, setFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');
  const [showVerification, setShowVerification] = useState(false);
  const { user } = useAuth();

  // Form states
  const [cashAmount, setCashAmount] = useState(100);
  const [paymentMethod, setPaymentMethod] = useState<'cash_app' | 'paypal' | 'zelle'>('cash_app');
  const [cashAppTag, setCashAppTag] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');
  const [zelleEmail, setZelleEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [idDocument, setIdDocument] = useState<File | null>(null);
  const [proofOfAddress, setProofOfAddress] = useState<File | null>(null);

  useEffect(() => {
    loadRedemptionData();
    loadAvailablePrizes();
  }, []);

  const loadRedemptionData = () => {
    const mockRequests: RedemptionRequest[] = [
      {
        id: 'red_001',
        userId: user?.id || 'user_123',
        type: 'cash',
        amount: 500,
        scAmount: 2500,
        method: 'cash_app',
        status: 'approved',
        priority: 'vip',
        requestDate: new Date(Date.now() - 86400000),
        approvalDate: new Date(Date.now() - 3600000),
        approvedBy: 'admin_001',
        paymentDetails: {
          cashAppTag: '$DiamondQueen22',
          recipientName: 'Sarah Johnson',
          phoneNumber: '+1-555-0123'
        },
        verificationDocuments: {
          idDocument: 'id_12345.pdf',
          proofOfAddress: 'utility_bill.pdf'
        },
        metadata: {
          playerLevel: 'Diamond VIP',
          accountAge: 245,
          totalDeposits: 2500,
          previousRedemptions: 3,
          riskScore: 15
        },
        automaticProcessing: true,
        estimatedProcessingTime: '24-48 hours'
      },
      {
        id: 'red_002',
        userId: user?.id || 'user_123',
        type: 'gift_card',
        amount: 100,
        scAmount: 500,
        method: 'digital_gift_card',
        status: 'completed',
        priority: 'standard',
        requestDate: new Date(Date.now() - 172800000),
        approvalDate: new Date(Date.now() - 86400000),
        completedDate: new Date(Date.now() - 3600000),
        approvedBy: 'admin_002',
        paymentDetails: {
          giftCardProvider: 'Amazon',
          recipientName: 'Sarah Johnson'
        },
        verificationDocuments: {},
        metadata: {
          playerLevel: 'Diamond VIP',
          accountAge: 245,
          totalDeposits: 2500,
          previousRedemptions: 2,
          riskScore: 15
        },
        automaticProcessing: true,
        estimatedProcessingTime: '2-4 hours'
      },
      {
        id: 'red_003',
        userId: user?.id || 'user_123',
        type: 'cash',
        amount: 250,
        scAmount: 1250,
        method: 'cash_app',
        status: 'pending',
        priority: 'standard',
        requestDate: new Date(Date.now() - 7200000),
        paymentDetails: {
          cashAppTag: '$DiamondQueen22',
          recipientName: 'Sarah Johnson',
          phoneNumber: '+1-555-0123'
        },
        verificationDocuments: {
          idDocument: 'id_12345.pdf'
        },
        metadata: {
          playerLevel: 'Diamond VIP',
          accountAge: 245,
          totalDeposits: 2500,
          previousRedemptions: 3,
          riskScore: 15
        },
        automaticProcessing: false,
        estimatedProcessingTime: '48-72 hours'
      }
    ];

    setRedemptionRequests(mockRequests);
  };

  const loadAvailablePrizes = () => {
    const prizes: Prize[] = [
      {
        id: 'prize_001',
        name: 'Apple iPhone 15 Pro',
        description: '128GB Titanium smartphone with A17 Pro chip',
        category: 'electronics',
        scCost: 5000,
        retailValue: 999,
        image: '/prizes/iphone15pro.jpg',
        availability: 5,
        popularity: 95,
        isDigital: false,
        processingTime: '7-14 business days',
        features: ['Latest Model', 'Free Shipping', 'Warranty Included']
      },
      {
        id: 'prize_002',
        name: 'Amazon Gift Card',
        description: 'Digital gift card for Amazon.com',
        category: 'gift_cards',
        scCost: 500,
        retailValue: 100,
        image: '/prizes/amazon-gc.jpg',
        availability: 999,
        popularity: 88,
        isDigital: true,
        processingTime: '1-2 hours',
        features: ['Instant Delivery', 'No Expiration', 'Digital Code']
      },
      {
        id: 'prize_003',
        name: 'PlayStation 5',
        description: 'Gaming console with 1TB SSD storage',
        category: 'gaming',
        scCost: 2500,
        retailValue: 499,
        image: '/prizes/ps5.jpg',
        availability: 3,
        popularity: 92,
        isDigital: false,
        processingTime: '5-10 business days',
        features: ['Latest Model', 'Free Games Bundle', 'Express Shipping']
      },
      {
        id: 'prize_004',
        name: 'Las Vegas Experience Package',
        description: '3-day 2-night Vegas getaway with hotel and shows',
        category: 'experiences',
        scCost: 7500,
        retailValue: 1500,
        image: '/prizes/vegas-package.jpg',
        availability: 10,
        popularity: 85,
        isDigital: false,
        processingTime: '14-21 business days',
        features: ['Hotel Included', 'Show Tickets', 'Dining Credits']
      },
      {
        id: 'prize_005',
        name: 'Rolex Submariner',
        description: 'Luxury dive watch in stainless steel',
        category: 'luxury',
        scCost: 40000,
        retailValue: 8000,
        image: '/prizes/rolex.jpg',
        availability: 1,
        popularity: 78,
        isDigital: false,
        processingTime: '21-30 business days',
        features: ['Authentic', 'Warranty', 'Luxury Packaging']
      }
    ];

    setAvailablePrizes(prizes);
  };

  const submitRedemptionRequest = async () => {
    const newRequest: RedemptionRequest = {
      id: `red_${Date.now()}`,
      userId: user?.id || 'guest',
      type: redemptionType,
      amount: redemptionType === 'cash' ? cashAmount : (selectedPrize?.retailValue || 0),
      scAmount: redemptionType === 'cash' ? cashAmount * 5 : (selectedPrize?.scCost || 0),
      method: redemptionType === 'cash' ? paymentMethod : 'digital_gift_card',
      status: 'pending',
      priority: getUserPriority(),
      requestDate: new Date(),
      paymentDetails: getPaymentDetails(),
      verificationDocuments: {
        idDocument: idDocument?.name,
        proofOfAddress: proofOfAddress?.name
      },
      metadata: {
        playerLevel: 'Diamond VIP',
        accountAge: 245,
        totalDeposits: 2500,
        previousRedemptions: redemptionRequests.length,
        riskScore: 15
      },
      automaticProcessing: shouldAutoProcess(),
      estimatedProcessingTime: getEstimatedProcessingTime()
    };

    setRedemptionRequests(prev => [newRequest, ...prev]);
    setIsNewRedemption(false);
    
    // Reset form
    setCashAmount(100);
    setCashAppTag('');
    setPaypalEmail('');
    setZelleEmail('');
    setRecipientName('');
    setPhoneNumber('');
    setSelectedPrize(null);
  };

  const getUserPriority = (): 'standard' | 'vip' | 'urgent' => {
    // VIP players get higher priority
    return 'vip';
  };

  const shouldAutoProcess = (): boolean => {
    // Auto-process for VIP players with low risk scores under $500
    return cashAmount <= 500 && getUserPriority() === 'vip';
  };

  const getEstimatedProcessingTime = (): string => {
    if (shouldAutoProcess()) return '2-4 hours';
    if (redemptionType === 'cash') return '24-72 hours';
    return '1-2 hours';
  };

  const getPaymentDetails = () => {
    switch (paymentMethod) {
      case 'cash_app':
        return { cashAppTag, recipientName, phoneNumber };
      case 'paypal':
        return { paypalEmail, recipientName };
      case 'zelle':
        return { zelleEmail, recipientName, phoneNumber };
      default:
        return {};
    }
  };

  const approveRequest = (requestId: string) => {
    setRedemptionRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { 
            ...req, 
            status: 'approved', 
            approvalDate: new Date(),
            approvedBy: user?.id || 'admin'
          }
        : req
    ));
  };

  const rejectRequest = (requestId: string, reason: string) => {
    setRedemptionRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { 
            ...req, 
            status: 'rejected', 
            rejectionReason: reason,
            approvalDate: new Date(),
            approvedBy: user?.id || 'admin'
          }
        : req
    ));
  };

  const markAsCompleted = (requestId: string) => {
    setRedemptionRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { 
            ...req, 
            status: 'completed', 
            completedDate: new Date()
          }
        : req
    ));
  };

  const filteredRequests = redemptionRequests.filter(req => {
    if (filter === 'all') return true;
    if (filter === 'pending') return req.status === 'pending';
    if (filter === 'approved') return req.status === 'approved';
    if (filter === 'completed') return req.status === 'completed';
    if (filter === 'rejected') return req.status === 'rejected';
    return req.type === filter;
  });

  const sortedRequests = [...filteredRequests].sort((a, b) => {
    switch (sortBy) {
      case 'date': return b.requestDate.getTime() - a.requestDate.getTime();
      case 'amount': return b.amount - a.amount;
      case 'status': return a.status.localeCompare(b.status);
      case 'priority': 
        const priorityOrder = { urgent: 3, vip: 2, standard: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      default: return 0;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'approved': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'processing': return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
      case 'completed': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'rejected': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'cancelled': return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'vip': return 'text-gold bg-gold/10 border-gold/20';
      case 'standard': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getPrizeIcon = (category: string) => {
    switch (category) {
      case 'electronics': return Smartphone;
      case 'gift_cards': return CreditCard;
      case 'experiences': return Star;
      case 'gaming': return Gamepad2;
      case 'luxury': return Crown;
      default: return Gift;
    }
  };

  if (!isAdminView) {
    return (
      <div className={`w-full ${className}`}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Redemption Center
                <Badge variant="outline">
                  {userSweepCoins.toFixed(2)} SC Available
                </Badge>
              </CardTitle>
              <Button onClick={() => setIsNewRedemption(true)}>
                <DollarSign className="h-4 w-4 mr-2" />
                New Redemption
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="history" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="history">My Redemptions</TabsTrigger>
                <TabsTrigger value="prizes">Prize Shop</TabsTrigger>
                <TabsTrigger value="cash">Cash Out</TabsTrigger>
              </TabsList>

              <TabsContent value="history" className="space-y-4">
                <div className="flex items-center gap-4">
                  <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  {sortedRequests.map((request) => (
                    <Card key={request.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedRequest(request)}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${getStatusColor(request.status)}`}>
                              {request.type === 'cash' ? <DollarSign className="h-4 w-4" /> : <Gift className="h-4 w-4" />}
                            </div>
                            <div>
                              <h4 className="font-semibold text-white">
                                {request.type === 'cash' ? `$${request.amount} Cash Out` : 
                                 request.type === 'gift_card' ? `$${request.amount} Gift Card` :
                                 'Prize Redemption'}
                              </h4>
                              <p className="text-sm text-gray-400">
                                {request.requestDate.toLocaleDateString()} • {request.scAmount} SC
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(request.status)}>
                              {request.status.toUpperCase()}
                            </Badge>
                            {request.priority === 'vip' && (
                              <Badge className={`ml-2 ${getPriorityColor(request.priority)}`}>
                                VIP
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="prizes" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availablePrizes.map((prize) => {
                    const Icon = getPrizeIcon(prize.category);
                    const canAfford = userSweepCoins * 5 >= prize.scCost; // Convert SC to redemption rate

                    return (
                      <Card key={prize.id} className={`cursor-pointer transition-all ${canAfford ? 'hover:shadow-lg hover:border-gold/50' : 'opacity-50'}`}>
                        <CardContent className="p-4">
                          <div className="aspect-video bg-gradient-to-br from-purple-900 to-blue-900 rounded-lg mb-3 flex items-center justify-center">
                            <Icon className="h-12 w-12 text-white/50" />
                          </div>
                          
                          <h3 className="font-semibold text-white mb-1">{prize.name}</h3>
                          <p className="text-sm text-gray-400 mb-3 line-clamp-2">{prize.description}</p>
                          
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <span className="text-lg font-bold text-gold">{prize.scCost} SC</span>
                              <span className="text-sm text-gray-400 ml-2">(${prize.retailValue})</span>
                            </div>
                            <Badge variant="outline">{prize.availability} left</Badge>
                          </div>

                          <div className="flex flex-wrap gap-1 mb-3">
                            {prize.features.slice(0, 2).map((feature, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>

                          <Button 
                            className="w-full" 
                            disabled={!canAfford}
                            onClick={() => {
                              setSelectedPrize(prize);
                              setRedemptionType('prize');
                              setIsNewRedemption(true);
                            }}
                          >
                            {canAfford ? 'Redeem Prize' : 'Insufficient SC'}
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="cash" className="space-y-4">
                <Alert>
                  <DollarSign className="h-4 w-4" />
                  <AlertDescription>
                    Cash redemptions require 5 SC per $1. Minimum redemption: $20 (100 SC)
                  </AlertDescription>
                </Alert>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Cash Out</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Cash Amount (USD)</Label>
                      <Input
                        type="number"
                        value={cashAmount}
                        onChange={(e) => setCashAmount(Number(e.target.value))}
                        min={20}
                        max={userSweepCoins / 5}
                      />
                      <p className="text-sm text-gray-400 mt-1">
                        Requires: {cashAmount * 5} SC (Available: {userSweepCoins.toFixed(2)} SC)
                      </p>
                    </div>

                    <div>
                      <Label>Payment Method</Label>
                      <Select value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash_app">Cash App (Instant)</SelectItem>
                          <SelectItem value="paypal">PayPal (24 hours)</SelectItem>
                          <SelectItem value="zelle">Zelle (Same day)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button 
                      className="w-full" 
                      onClick={() => setIsNewRedemption(true)}
                      disabled={cashAmount * 5 > userSweepCoins || cashAmount < 20}
                    >
                      Request Cash Out - ${cashAmount}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* New Redemption Modal */}
        <Dialog open={isNewRedemption} onOpenChange={setIsNewRedemption}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {redemptionType === 'cash' ? 'Cash Redemption Request' :
                 redemptionType === 'prize' ? 'Prize Redemption Request' :
                 'Gift Card Request'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Payment Details Form */}
              <div className="space-y-4">
                <div>
                  <Label>Full Name</Label>
                  <Input
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Enter your full legal name"
                  />
                </div>

                {redemptionType === 'cash' && (
                  <>
                    {paymentMethod === 'cash_app' && (
                      <div>
                        <Label>Cash App Tag</Label>
                        <Input
                          value={cashAppTag}
                          onChange={(e) => setCashAppTag(e.target.value)}
                          placeholder="$YourCashAppTag"
                        />
                      </div>
                    )}

                    {paymentMethod === 'paypal' && (
                      <div>
                        <Label>PayPal Email</Label>
                        <Input
                          type="email"
                          value={paypalEmail}
                          onChange={(e) => setPaypalEmail(e.target.value)}
                          placeholder="your@email.com"
                        />
                      </div>
                    )}

                    {paymentMethod === 'zelle' && (
                      <div>
                        <Label>Zelle Email</Label>
                        <Input
                          type="email"
                          value={zelleEmail}
                          onChange={(e) => setZelleEmail(e.target.value)}
                          placeholder="your@email.com"
                        />
                      </div>
                    )}
                  </>
                )}

                <div>
                  <Label>Phone Number</Label>
                  <Input
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1-555-0123"
                  />
                </div>
              </div>

              {/* Document Upload */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Verification Documents</h3>
                
                <div>
                  <Label>Government ID (Required)</Label>
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setIdDocument(e.target.files?.[0] || null)}
                  />
                  <p className="text-sm text-gray-400 mt-1">
                    Upload a clear photo of your driver's license or passport
                  </p>
                </div>

                <div>
                  <Label>Proof of Address (For amounts over $100)</Label>
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setProofOfAddress(e.target.files?.[0] || null)}
                  />
                  <p className="text-sm text-gray-400 mt-1">
                    Utility bill or bank statement from last 90 days
                  </p>
                </div>
              </div>

              {/* Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Redemption Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <span className="capitalize">{redemptionType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Amount:</span>
                      <span>${redemptionType === 'cash' ? cashAmount : selectedPrize?.retailValue || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>SC Required:</span>
                      <span>{redemptionType === 'cash' ? cashAmount * 5 : selectedPrize?.scCost || 0} SC</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Processing Time:</span>
                      <span>{getEstimatedProcessingTime()}</span>
                    </div>
                    {shouldAutoProcess() && (
                      <div className="flex justify-between text-green-400">
                        <span>VIP Auto-Processing:</span>
                        <span>✓ Enabled</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setIsNewRedemption(false)}>
                  Cancel
                </Button>
                <Button onClick={submitRedemptionRequest} className="flex-1">
                  Submit Redemption Request
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Request Details Modal */}
        <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
          <DialogContent className="max-w-2xl">
            {selectedRequest && (
              <>
                <DialogHeader>
                  <DialogTitle>Redemption Request Details</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Request ID</Label>
                      <p className="text-sm font-mono">{selectedRequest.id}</p>
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Badge className={getStatusColor(selectedRequest.status)}>
                        {selectedRequest.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div>
                      <Label>Amount</Label>
                      <p className="text-lg font-semibold">${selectedRequest.amount}</p>
                    </div>
                    <div>
                      <Label>SC Used</Label>
                      <p className="text-lg font-semibold">{selectedRequest.scAmount} SC</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Timeline</Label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Request submitted: {selectedRequest.requestDate.toLocaleString()}</span>
                      </div>
                      {selectedRequest.approvalDate && (
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Approved: {selectedRequest.approvalDate.toLocaleString()}</span>
                        </div>
                      )}
                      {selectedRequest.completedDate && (
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Completed: {selectedRequest.completedDate.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedRequest.rejectionReason && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Rejection Reason:</strong> {selectedRequest.rejectionReason}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div>
                    <Label>Estimated Processing Time</Label>
                    <p className="text-sm">{selectedRequest.estimatedProcessingTime}</p>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Admin view for managing redemptions
  return (
    <div className={`w-full ${className}`}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Redemption Management
              <Badge variant="outline">
                {redemptionRequests.filter(r => r.status === 'pending').length} Pending
              </Badge>
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Requests</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="amount">Amount</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {sortedRequests.map((request) => (
              <Card key={request.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${getStatusColor(request.status)}`}>
                        {request.type === 'cash' ? <DollarSign className="h-4 w-4" /> : <Gift className="h-4 w-4" />}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">
                          {request.type === 'cash' ? `$${request.amount} Cash Out` : 
                           request.type === 'gift_card' ? `$${request.amount} Gift Card` :
                           'Prize Redemption'}
                        </h4>
                        <p className="text-sm text-gray-400">
                          {request.paymentDetails.recipientName} • {request.metadata.playerLevel}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(request.priority)}>
                        {request.priority.toUpperCase()}
                      </Badge>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-gray-400">Amount:</span>
                      <span className="text-white ml-2">${request.amount}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">SC Used:</span>
                      <span className="text-white ml-2">{request.scAmount} SC</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Method:</span>
                      <span className="text-white ml-2 capitalize">{request.method.replace('_', ' ')}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Risk Score:</span>
                      <span className={`ml-2 ${request.metadata.riskScore > 50 ? 'text-red-400' : 'text-green-400'}`}>
                        {request.metadata.riskScore}/100
                      </span>
                    </div>
                  </div>

                  {request.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => approveRequest(request.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => rejectRequest(request.id, 'Insufficient verification')}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setSelectedRequest(request)}>
                        <Eye className="h-4 w-4 mr-1" />
                        Review
                      </Button>
                    </div>
                  )}

                  {request.status === 'approved' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => markAsCompleted(request.id)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Zap className="h-4 w-4 mr-1" />
                        Mark Completed
                      </Button>
                      <Button size="sm" variant="outline">
                        <Mail className="h-4 w-4 mr-1" />
                        Send Payment
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {sortedRequests.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <Gift className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No redemption requests found</p>
                <p className="text-sm">Requests will appear here when users submit them</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
