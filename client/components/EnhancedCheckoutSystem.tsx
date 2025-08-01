import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { 
  CreditCard, 
  Lock, 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  DollarSign, 
  Star, 
  Gift, 
  Smartphone, 
  Coins,
  Wallet,
  Receipt,
  FileText,
  Eye,
  EyeOff,
  Info,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Calendar,
  Globe,
  Phone,
  Mail,
  MapPin,
  User,
  Building,
  CreditCardIcon,
  AlertCircle,
  Zap,
  Crown,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { GoldCoinPackage } from '@shared/storeTypes';

interface CheckoutStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  processingTime: string;
  fees: string;
  description: string;
  enabled: boolean;
}

interface BillingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentInfo {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  saveCard: boolean;
}

interface PurchaseSummary {
  subtotal: number;
  tax: number;
  processingFee: number;
  discount: number;
  total: number;
  goldCoins: number;
  bonusSweepsCoins: number;
  vipPointsEarned: number;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'paypal',
    name: 'PayPal',
    icon: <CreditCard className="h-5 w-5" />,
    processingTime: 'Instant',
    fees: 'No fees',
    description: 'Pay securely with your PayPal account',
    enabled: true
  },
  {
    id: 'card',
    name: 'Credit/Debit Card',
    icon: <CreditCardIcon className="h-5 w-5" />,
    processingTime: 'Instant',
    fees: '2.9% + $0.30',
    description: 'Visa, Mastercard, American Express accepted',
    enabled: true
  },
  {
    id: 'apple-pay',
    name: 'Apple Pay',
    icon: <Smartphone className="h-5 w-5" />,
    processingTime: 'Instant',
    fees: 'No fees',
    description: 'Pay with Touch ID or Face ID',
    enabled: true
  },
  {
    id: 'google-pay',
    name: 'Google Pay',
    icon: <Smartphone className="h-5 w-5" />,
    processingTime: 'Instant',
    fees: 'No fees',
    description: 'Pay with your Google account',
    enabled: true
  },
  {
    id: 'crypto',
    name: 'Cryptocurrency',
    icon: <Coins className="h-5 w-5" />,
    processingTime: '10-30 minutes',
    fees: 'Network fees apply',
    description: 'Bitcoin, Ethereum, USDC accepted',
    enabled: false
  }
];

const termsAndConditions = {
  purchase: `
**GOLD COIN STORE TERMS AND CONDITIONS**

By purchasing Gold Coins from CoinKrazy.com, you agree to the following terms:

**1. VIRTUAL CURRENCY**
• Gold Coins are virtual currency for entertainment purposes only
• Gold Coins have no monetary value and cannot be exchanged for cash
• All sales are final - no refunds or exchanges

**2. BONUS SWEEPS COINS**
• Sweeps Coins are promotional currency included with Gold Coin purchases
• Sweeps Coins can be redeemed for prizes subject to availability
• Redemption requires account verification and compliance with all terms

**3. PAYMENT PROCESSING**
• All payments are processed securely through our payment partners
• PayPal payments go to: corey@coinkrazy.com
• We do not store payment information on our servers
• Processing fees may apply depending on payment method

**4. ACCOUNT REQUIREMENTS**
• You must be 18+ years old to make purchases
• Valid email address required for transaction confirmation
• Account verification may be required for large purchases

**5. TECHNICAL ISSUES**
• If technical issues occur during purchase, contact support immediately
• Coins will be credited within 24 hours of successful payment
• Keep payment confirmation for your records

**6. PROHIBITED USE**
• Gold Coins cannot be transferred between accounts
• Commercial use of coins is prohibited
• Any attempt to manipulate the system will result in account closure

**7. LIMITATION OF LIABILITY**
• CoinKrazy.com is not responsible for technical failures
• Maximum liability limited to purchase amount
• No warranties expressed or implied

By clicking "I Agree," you acknowledge that you have read, understood, and agree to be bound by these terms and conditions.
  `,
  privacy: `
**PRIVACY POLICY - PAYMENT PROCESSING**

**Information We Collect:**
• Billing name and address for payment verification
• Payment method information (encrypted)
• Transaction history and purchase records
• Device and browser information for security

**How We Use Information:**
• Process payments and deliver virtual currency
• Prevent fraud and maintain security
• Send transaction confirmations and receipts
• Comply with legal and regulatory requirements

**Information Sharing:**
• We do not sell or share personal information
• Payment data is shared only with payment processors
• Information may be disclosed if required by law

**Data Security:**
• All payment data is encrypted using SSL technology
• We are PCI DSS compliant for payment security
• Regular security audits and monitoring

**Your Rights:**
• Access your payment and purchase history
• Request deletion of account information
• Opt out of marketing communications
• Contact support with privacy concerns

Contact: privacy@coinkrazy.com for questions about this privacy policy.
  `,
  responsible: `
**RESPONSIBLE GAMING COMMITMENT**

CoinKrazy.com is committed to promoting responsible gaming:

**Spending Limits:**
• Set daily, weekly, or monthly purchase limits
• Automatic spending alerts and notifications
• Cool-down periods for large purchases

**Self-Exclusion:**
• Temporary or permanent account suspension options
• Immediate effect upon request
• Support resources for problem gambling

**Age Verification:**
• Strict 18+ age verification required
• ID verification for account activation
• Monitoring for underage access attempts

**Support Resources:**
• National Problem Gambling Helpline: 1-800-522-4700
• Gamblers Anonymous: www.gamblersanonymous.org
• Support chat available 24/7

**Warning Signs:**
• Spending more than you can afford
• Gambling to escape problems or emotions
• Lying about gambling activities
• Neglecting responsibilities

If you're experiencing gambling problems, please seek help immediately.
  `
};

interface EnhancedCheckoutSystemProps {
  selectedPackage: GoldCoinPackage;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (transaction: any) => void;
  userBalance?: {
    goldCoins: number;
    sweepsCoins: number;
  };
}

export const EnhancedCheckoutSystem: React.FC<EnhancedCheckoutSystemProps> = ({
  selectedPackage,
  isOpen,
  onClose,
  onComplete,
  userBalance = { goldCoins: 0, sweepsCoins: 0 }
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('paypal');
  const [billingInfo, setBillingInfo] = useState<BillingInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  });
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    saveCard: false
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [agreedToResponsible, setAgreedToResponsible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCvv, setShowCvv] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [selectedTermsTab, setSelectedTermsTab] = useState('purchase');

  const steps: CheckoutStep[] = [
    {
      id: 'package',
      title: 'Package Selection',
      description: 'Review your selected package',
      completed: true,
      current: currentStep === 0
    },
    {
      id: 'billing',
      title: 'Billing Information',
      description: 'Enter your billing details',
      completed: currentStep > 1,
      current: currentStep === 1
    },
    {
      id: 'payment',
      title: 'Payment Method',
      description: 'Choose your payment method',
      completed: currentStep > 2,
      current: currentStep === 2
    },
    {
      id: 'review',
      title: 'Review & Terms',
      description: 'Review order and accept terms',
      completed: currentStep > 3,
      current: currentStep === 3
    },
    {
      id: 'confirmation',
      title: 'Confirmation',
      description: 'Payment confirmation',
      completed: false,
      current: currentStep === 4
    }
  ];

  const calculateSummary = (): PurchaseSummary => {
    const subtotal = selectedPackage.price;
    const processingFee = selectedPaymentMethod === 'card' ? Math.round((subtotal * 0.029 + 0.30) * 100) / 100 : 0;
    const tax = 0; // No tax on virtual currency
    const discount = promoDiscount;
    const total = subtotal + processingFee + tax - discount;
    
    return {
      subtotal,
      tax,
      processingFee,
      discount,
      total,
      goldCoins: selectedPackage.goldCoins,
      bonusSweepsCoins: selectedPackage.bonusSweepsCoins,
      vipPointsEarned: Math.floor(total * 10) // 10 VIP points per dollar
    };
  };

  const validateBillingInfo = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!billingInfo.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!billingInfo.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!billingInfo.email.trim()) newErrors.email = 'Email is required';
    if (!billingInfo.email.includes('@')) newErrors.email = 'Please enter a valid email';
    if (!billingInfo.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!billingInfo.address.trim()) newErrors.address = 'Address is required';
    if (!billingInfo.city.trim()) newErrors.city = 'City is required';
    if (!billingInfo.state.trim()) newErrors.state = 'State is required';
    if (!billingInfo.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePaymentInfo = (): boolean => {
    if (selectedPaymentMethod !== 'card') return true;
    
    const newErrors: { [key: string]: string } = {};
    
    if (!paymentInfo.cardNumber.replace(/\s/g, '').match(/^\d{13,19}$/)) {
      newErrors.cardNumber = 'Please enter a valid card number';
    }
    if (!paymentInfo.expiryDate.match(/^\d{2}\/\d{2}$/)) {
      newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
    }
    if (!paymentInfo.cvv.match(/^\d{3,4}$/)) {
      newErrors.cvv = 'Please enter a valid CVV';
    }
    if (!paymentInfo.cardholderName.trim()) {
      newErrors.cardholderName = 'Cardholder name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateTerms = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!agreedToTerms) newErrors.terms = 'You must agree to the Terms and Conditions';
    if (!agreedToPrivacy) newErrors.privacy = 'You must agree to the Privacy Policy';
    if (!agreedToResponsible) newErrors.responsible = 'You must acknowledge the Responsible Gaming policy';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    let isValid = true;
    
    switch (currentStep) {
      case 1:
        isValid = validateBillingInfo();
        break;
      case 2:
        isValid = validatePaymentInfo();
        break;
      case 3:
        isValid = validateTerms();
        break;
    }
    
    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      setErrors({});
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setErrors({});
    }
  };

  const handlePromoCode = () => {
    // Simulate promo code validation
    const promoCodes = {
      'WELCOME10': 0.10,
      'NEWPLAYER': 0.15,
      'VIP20': 0.20,
      'LUCKY25': 0.25
    };
    
    const discount = promoCodes[promoCode.toUpperCase() as keyof typeof promoCodes];
    if (discount) {
      setPromoDiscount(selectedPackage.price * discount);
      setErrors({ ...errors, promo: '' });
    } else {
      setPromoDiscount(0);
      setErrors({ ...errors, promo: 'Invalid promo code' });
    }
  };

  const processPayment = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const summary = calculateSummary();
      
      const transaction = {
        id: transactionId,
        packageId: selectedPackage.id,
        packageName: selectedPackage.name,
        amountPaid: summary.total,
        goldCoinsAwarded: summary.goldCoins,
        sweepsCoinsBonus: summary.bonusSweepsCoins,
        vipPointsEarned: summary.vipPointsEarned,
        paymentMethod: selectedPaymentMethod,
        status: 'completed',
        createdAt: new Date().toISOString(),
        billingInfo,
        summary
      };
      
      // Move to confirmation step
      setCurrentStep(4);
      
      // Call completion handler after a brief delay
      setTimeout(() => {
        onComplete(transaction);
      }, 2000);
      
    } catch (error) {
      console.error('Payment failed:', error);
      setErrors({ payment: 'Payment failed. Please try again.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const renderPackageReview = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-4xl mb-4">
          {selectedPackage.name.includes('Starter') ? '🌟' :
           selectedPackage.name.includes('Value') ? '💎' :
           selectedPackage.name.includes('Premium') ? '👑' :
           selectedPackage.name.includes('Mega') ? '🚀' :
           selectedPackage.name.includes('Ultimate') ? '💯' : '🪙'}
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">{selectedPackage.name}</h3>
        <p className="text-gray-400">{selectedPackage.description}</p>
      </div>

      <Card className="bg-gradient-to-r from-yellow-600/20 to-green-600/20 border-yellow-500/30">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-1">
                {selectedPackage.goldCoins.toLocaleString()}
              </div>
              <div className="text-sm text-gray-300">Gold Coins</div>
              <div className="text-xs text-yellow-500 mt-1">For fun gaming</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-1">
                +{selectedPackage.bonusSweepsCoins}
              </div>
              <div className="text-sm text-gray-300">Bonus Sweeps Coins</div>
              <div className="text-xs text-green-500 mt-1">Redeemable for prizes</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4 text-center">
            <Wallet className="h-8 w-8 text-blue-400 mx-auto mb-2" />
            <div className="text-white font-medium">Current Balance</div>
            <div className="text-sm text-gray-400">
              {userBalance.goldCoins.toLocaleString()} GC • {userBalance.sweepsCoins.toFixed(2)} SC
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-purple-400 mx-auto mb-2" />
            <div className="text-white font-medium">After Purchase</div>
            <div className="text-sm text-gray-400">
              {(userBalance.goldCoins + selectedPackage.goldCoins).toLocaleString()} GC • {(userBalance.sweepsCoins + selectedPackage.bonusSweepsCoins).toFixed(2)} SC
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedPackage.features && (
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-lg">Package Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {selectedPackage.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300 text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderBillingForm = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-white mb-4">Billing Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName" className="text-white">First Name *</Label>
            <Input
              id="firstName"
              value={billingInfo.firstName}
              onChange={(e) => setBillingInfo(prev => ({ ...prev, firstName: e.target.value }))}
              className={`bg-white/10 border-white/20 text-white ${errors.firstName ? 'border-red-500' : ''}`}
            />
            {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>}
          </div>
          <div>
            <Label htmlFor="lastName" className="text-white">Last Name *</Label>
            <Input
              id="lastName"
              value={billingInfo.lastName}
              onChange={(e) => setBillingInfo(prev => ({ ...prev, lastName: e.target.value }))}
              className={`bg-white/10 border-white/20 text-white ${errors.lastName ? 'border-red-500' : ''}`}
            />
            {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email" className="text-white">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={billingInfo.email}
            onChange={(e) => setBillingInfo(prev => ({ ...prev, email: e.target.value }))}
            className={`bg-white/10 border-white/20 text-white ${errors.email ? 'border-red-500' : ''}`}
          />
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
        </div>
        <div>
          <Label htmlFor="phone" className="text-white">Phone Number *</Label>
          <Input
            id="phone"
            value={billingInfo.phone}
            onChange={(e) => setBillingInfo(prev => ({ ...prev, phone: e.target.value }))}
            className={`bg-white/10 border-white/20 text-white ${errors.phone ? 'border-red-500' : ''}`}
          />
          {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="address" className="text-white">Street Address *</Label>
        <Input
          id="address"
          value={billingInfo.address}
          onChange={(e) => setBillingInfo(prev => ({ ...prev, address: e.target.value }))}
          className={`bg-white/10 border-white/20 text-white ${errors.address ? 'border-red-500' : ''}`}
        />
        {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="city" className="text-white">City *</Label>
          <Input
            id="city"
            value={billingInfo.city}
            onChange={(e) => setBillingInfo(prev => ({ ...prev, city: e.target.value }))}
            className={`bg-white/10 border-white/20 text-white ${errors.city ? 'border-red-500' : ''}`}
          />
          {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
        </div>
        <div>
          <Label htmlFor="state" className="text-white">State *</Label>
          <Input
            id="state"
            value={billingInfo.state}
            onChange={(e) => setBillingInfo(prev => ({ ...prev, state: e.target.value }))}
            className={`bg-white/10 border-white/20 text-white ${errors.state ? 'border-red-500' : ''}`}
          />
          {errors.state && <p className="text-red-400 text-xs mt-1">{errors.state}</p>}
        </div>
        <div>
          <Label htmlFor="zipCode" className="text-white">ZIP Code *</Label>
          <Input
            id="zipCode"
            value={billingInfo.zipCode}
            onChange={(e) => setBillingInfo(prev => ({ ...prev, zipCode: e.target.value }))}
            className={`bg-white/10 border-white/20 text-white ${errors.zipCode ? 'border-red-500' : ''}`}
          />
          {errors.zipCode && <p className="text-red-400 text-xs mt-1">{errors.zipCode}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="country" className="text-white">Country</Label>
        <Select value={billingInfo.country} onValueChange={(value) => setBillingInfo(prev => ({ ...prev, country: value }))}>
          <SelectTrigger className="bg-white/10 border-white/20 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="US">United States</SelectItem>
            <SelectItem value="CA">Canada</SelectItem>
            <SelectItem value="GB">United Kingdom</SelectItem>
            <SelectItem value="AU">Australia</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderPaymentMethod = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-white mb-4">Choose Payment Method</h3>
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <Card
              key={method.id}
              className={`cursor-pointer transition-all duration-200 ${
                selectedPaymentMethod === method.id
                  ? 'bg-blue-600/20 border-blue-500'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              } ${!method.enabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => method.enabled && setSelectedPaymentMethod(method.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${selectedPaymentMethod === method.id ? 'bg-blue-600' : 'bg-white/10'}`}>
                      {method.icon}
                    </div>
                    <div>
                      <div className="text-white font-medium">{method.name}</div>
                      <div className="text-gray-400 text-sm">{method.description}</div>
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <div className="text-green-400">{method.processingTime}</div>
                    <div className="text-gray-500">{method.fees}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {selectedPaymentMethod === 'card' && (
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Card Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="cardNumber" className="text-white">Card Number *</Label>
              <Input
                id="cardNumber"
                value={paymentInfo.cardNumber}
                onChange={(e) => setPaymentInfo(prev => ({ ...prev, cardNumber: formatCardNumber(e.target.value) }))}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                className={`bg-white/10 border-white/20 text-white ${errors.cardNumber ? 'border-red-500' : ''}`}
              />
              {errors.cardNumber && <p className="text-red-400 text-xs mt-1">{errors.cardNumber}</p>}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate" className="text-white">Expiry Date *</Label>
                <Input
                  id="expiryDate"
                  value={paymentInfo.expiryDate}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, '');
                    if (value.length >= 2) {
                      value = value.substring(0, 2) + '/' + value.substring(2, 4);
                    }
                    setPaymentInfo(prev => ({ ...prev, expiryDate: value }));
                  }}
                  placeholder="MM/YY"
                  maxLength={5}
                  className={`bg-white/10 border-white/20 text-white ${errors.expiryDate ? 'border-red-500' : ''}`}
                />
                {errors.expiryDate && <p className="text-red-400 text-xs mt-1">{errors.expiryDate}</p>}
              </div>
              <div>
                <Label htmlFor="cvv" className="text-white flex items-center gap-2">
                  CVV *
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0"
                    onClick={() => setShowCvv(!showCvv)}
                  >
                    {showCvv ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  </Button>
                </Label>
                <Input
                  id="cvv"
                  type={showCvv ? 'text' : 'password'}
                  value={paymentInfo.cvv}
                  onChange={(e) => setPaymentInfo(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '') }))}
                  placeholder="123"
                  maxLength={4}
                  className={`bg-white/10 border-white/20 text-white ${errors.cvv ? 'border-red-500' : ''}`}
                />
                {errors.cvv && <p className="text-red-400 text-xs mt-1">{errors.cvv}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="cardholderName" className="text-white">Cardholder Name *</Label>
              <Input
                id="cardholderName"
                value={paymentInfo.cardholderName}
                onChange={(e) => setPaymentInfo(prev => ({ ...prev, cardholderName: e.target.value }))}
                placeholder="John Doe"
                className={`bg-white/10 border-white/20 text-white ${errors.cardholderName ? 'border-red-500' : ''}`}
              />
              {errors.cardholderName && <p className="text-red-400 text-xs mt-1">{errors.cardholderName}</p>}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="saveCard"
                checked={paymentInfo.saveCard}
                onCheckedChange={(checked) => setPaymentInfo(prev => ({ ...prev, saveCard: checked as boolean }))}
              />
              <Label htmlFor="saveCard" className="text-gray-300 text-sm">
                Save this card for future purchases
              </Label>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Promotional Code</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              placeholder="Enter promo code"
              className="bg-white/10 border-white/20 text-white"
            />
            <Button onClick={handlePromoCode} variant="outline">
              Apply
            </Button>
          </div>
          {errors.promo && <p className="text-red-400 text-xs mt-1">{errors.promo}</p>}
          {promoDiscount > 0 && (
            <div className="text-green-400 text-sm mt-2 flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />
              Promo code applied! You save ${promoDiscount.toFixed(2)}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderReviewAndTerms = () => {
    const summary = calculateSummary();
    
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Order Summary</h3>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Package</span>
                  <span className="text-white">{selectedPackage.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Subtotal</span>
                  <span className="text-white">${summary.subtotal.toFixed(2)}</span>
                </div>
                {summary.processingFee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-300">Processing Fee</span>
                    <span className="text-white">${summary.processingFee.toFixed(2)}</span>
                  </div>
                )}
                {summary.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-300">Discount</span>
                    <span className="text-green-400">-${summary.discount.toFixed(2)}</span>
                  </div>
                )}
                <Separator className="bg-white/20" />
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-white">${summary.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <h3 className="text-xl font-bold text-white mb-4">You Will Receive</h3>
          <div className="grid grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-yellow-600/20 to-yellow-500/20 border-yellow-500/30">
              <CardContent className="p-4 text-center">
                <Coins className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-yellow-400">
                  {summary.goldCoins.toLocaleString()}
                </div>
                <div className="text-xs text-gray-300">Gold Coins</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-600/20 to-green-500/20 border-green-500/30">
              <CardContent className="p-4 text-center">
                <Gift className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-green-400">
                  +{summary.bonusSweepsCoins}
                </div>
                <div className="text-xs text-gray-300">Bonus Sweeps Coins</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-600/20 to-purple-500/20 border-purple-500/30">
              <CardContent className="p-4 text-center">
                <Star className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-purple-400">
                  {summary.vipPointsEarned}
                </div>
                <div className="text-xs text-gray-300">VIP Points</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-white mb-4">Terms and Conditions</h3>
          <div className="space-y-4">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                    className={errors.terms ? 'border-red-500' : ''}
                  />
                  <div className="flex-1">
                    <Label htmlFor="terms" className="text-white cursor-pointer">
                      I agree to the{' '}
                      <Button
                        variant="link"
                        className="text-blue-400 p-0 h-auto underline"
                        onClick={() => { setSelectedTermsTab('purchase'); setShowTermsModal(true); }}
                      >
                        Terms and Conditions
                      </Button>
                    </Label>
                    {errors.terms && <p className="text-red-400 text-xs mt-1">{errors.terms}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="privacy"
                    checked={agreedToPrivacy}
                    onCheckedChange={(checked) => setAgreedToPrivacy(checked as boolean)}
                    className={errors.privacy ? 'border-red-500' : ''}
                  />
                  <div className="flex-1">
                    <Label htmlFor="privacy" className="text-white cursor-pointer">
                      I agree to the{' '}
                      <Button
                        variant="link"
                        className="text-blue-400 p-0 h-auto underline"
                        onClick={() => { setSelectedTermsTab('privacy'); setShowTermsModal(true); }}
                      >
                        Privacy Policy
                      </Button>
                    </Label>
                    {errors.privacy && <p className="text-red-400 text-xs mt-1">{errors.privacy}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="responsible"
                    checked={agreedToResponsible}
                    onCheckedChange={(checked) => setAgreedToResponsible(checked as boolean)}
                    className={errors.responsible ? 'border-red-500' : ''}
                  />
                  <div className="flex-1">
                    <Label htmlFor="responsible" className="text-white cursor-pointer">
                      I acknowledge the{' '}
                      <Button
                        variant="link"
                        className="text-blue-400 p-0 h-auto underline"
                        onClick={() => { setSelectedTermsTab('responsible'); setShowTermsModal(true); }}
                      >
                        Responsible Gaming Policy
                      </Button>
                    </Label>
                    {errors.responsible && <p className="text-red-400 text-xs mt-1">{errors.responsible}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="bg-blue-600/10 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-400 mt-0.5" />
              <div>
                <div className="text-white font-medium mb-1">Secure Payment Guarantee</div>
                <div className="text-blue-200 text-sm">
                  Your payment information is encrypted with 256-bit SSL security. We never store your payment details on our servers.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderConfirmation = () => (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
          <CheckCircle className="h-8 w-8 text-white" />
        </div>
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-white mb-2">Payment Successful!</h3>
        <p className="text-gray-400">Your Gold Coins have been added to your account</p>
      </div>

      <Card className="bg-gradient-to-r from-green-600/20 to-blue-600/20 border-green-500/30">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-1">
                +{selectedPackage.goldCoins.toLocaleString()}
              </div>
              <div className="text-sm text-gray-300">Gold Coins Added</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-1">
                +{selectedPackage.bonusSweepsCoins}
              </div>
              <div className="text-sm text-gray-300">Bonus Sweeps Coins</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-sm text-gray-400">
        <p>A confirmation email has been sent to {billingInfo.email}</p>
        <p>You can start playing with your new coins immediately!</p>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderPackageReview();
      case 1:
        return renderBillingForm();
      case 2:
        return renderPaymentMethod();
      case 3:
        return renderReviewAndTerms();
      case 4:
        return renderConfirmation();
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="bg-gray-900 border-gray-700 w-full max-w-4xl max-h-[95vh] overflow-hidden">
        <CardHeader className="border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white text-2xl">Secure Checkout</CardTitle>
              <CardDescription className="text-gray-400">Complete your Gold Coin purchase</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={isProcessing}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </Button>
          </div>

          {/* Progress Steps */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-medium ${
                    step.completed 
                      ? 'bg-green-600 border-green-600 text-white'
                      : step.current
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-gray-600 text-gray-400'
                  }`}>
                    {step.completed ? <CheckCircle className="h-4 w-4" /> : index + 1}
                  </div>
                  <div className="ml-2 hidden md:block">
                    <div className={`text-sm font-medium ${step.current ? 'text-white' : 'text-gray-400'}`}>
                      {step.title}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-12 h-0.5 mx-4 ${step.completed ? 'bg-green-600' : 'bg-gray-600'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardHeader>

        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <CardContent className="p-6">
              {renderStepContent()}
            </CardContent>
          </div>

          {/* Order Summary Sidebar */}
          {currentStep < 4 && (
            <div className="w-80 border-l border-gray-700 bg-gray-800/50">
              <div className="p-6">
                <h4 className="text-white font-medium mb-4">Order Summary</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">
                      {selectedPackage.name.includes('Starter') ? '🌟' :
                       selectedPackage.name.includes('Value') ? '💎' :
                       selectedPackage.name.includes('Premium') ? '👑' :
                       selectedPackage.name.includes('Mega') ? '🚀' :
                       selectedPackage.name.includes('Ultimate') ? '💯' : '🪙'}
                    </div>
                    <div>
                      <div className="text-white font-medium">{selectedPackage.name}</div>
                      <div className="text-gray-400 text-sm">${selectedPackage.price}</div>
                    </div>
                  </div>

                  <Separator className="bg-gray-600" />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Gold Coins</span>
                      <span className="text-yellow-400">{selectedPackage.goldCoins.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Bonus Sweeps Coins</span>
                      <span className="text-green-400">+{selectedPackage.bonusSweepsCoins}</span>
                    </div>
                    {calculateSummary().vipPointsEarned > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">VIP Points</span>
                        <span className="text-purple-400">+{calculateSummary().vipPointsEarned}</span>
                      </div>
                    )}
                  </div>

                  <Separator className="bg-gray-600" />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Subtotal</span>
                      <span className="text-white">${calculateSummary().subtotal.toFixed(2)}</span>
                    </div>
                    {calculateSummary().processingFee > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Processing Fee</span>
                        <span className="text-white">${calculateSummary().processingFee.toFixed(2)}</span>
                      </div>
                    )}
                    {calculateSummary().discount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Discount</span>
                        <span className="text-green-400">-${calculateSummary().discount.toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  <Separator className="bg-gray-600" />

                  <div className="flex justify-between font-medium">
                    <span className="text-white">Total</span>
                    <span className="text-white text-lg">${calculateSummary().total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-700 p-6">
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0 || isProcessing || currentStep === 4}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            {currentStep < 3 ? (
              <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
                Continue
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : currentStep === 3 ? (
              <Button 
                onClick={processPayment} 
                disabled={isProcessing || !agreedToTerms || !agreedToPrivacy || !agreedToResponsible}
                className="bg-green-600 hover:bg-green-700 min-w-32"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Complete Purchase
                  </>
                )}
              </Button>
            ) : (
              <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700">
                Start Playing!
              </Button>
            )}
          </div>

          {errors.payment && (
            <div className="mt-4 p-3 bg-red-600/20 border border-red-500/30 rounded-lg">
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle className="h-4 w-4" />
                {errors.payment}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Terms Modal */}
      <Dialog open={showTermsModal} onOpenChange={setShowTermsModal}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Legal Terms and Policies</DialogTitle>
            <DialogDescription>
              Please review our terms and policies before completing your purchase
            </DialogDescription>
          </DialogHeader>
          <Tabs value={selectedTermsTab} onValueChange={setSelectedTermsTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="purchase">Terms & Conditions</TabsTrigger>
              <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
              <TabsTrigger value="responsible">Responsible Gaming</TabsTrigger>
            </TabsList>
            <TabsContent value="purchase">
              <ScrollArea className="h-96 w-full">
                <div className="prose prose-sm max-w-none text-gray-300">
                  <pre className="whitespace-pre-wrap text-sm">{termsAndConditions.purchase}</pre>
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="privacy">
              <ScrollArea className="h-96 w-full">
                <div className="prose prose-sm max-w-none text-gray-300">
                  <pre className="whitespace-pre-wrap text-sm">{termsAndConditions.privacy}</pre>
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="responsible">
              <ScrollArea className="h-96 w-full">
                <div className="prose prose-sm max-w-none text-gray-300">
                  <pre className="whitespace-pre-wrap text-sm">{termsAndConditions.responsible}</pre>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
};
