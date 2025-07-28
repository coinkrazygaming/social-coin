export interface GoldCoinPackage {
  id: string;
  name: string;
  description: string;
  goldCoins: number;
  bonusSweepsCoins: number;
  price: number; // USD
  originalPrice?: number; // For showing discounts
  image: string;
  popular: boolean;
  bestValue: boolean;
  features: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PurchaseTransaction {
  id: string;
  userId: string;
  username: string;
  packageId: string;
  packageName: string;
  goldCoinsAwarded: number;
  sweepsCoinsBonus: number;
  amountPaid: number;
  paymentMethod: 'paypal' | 'stripe' | 'crypto';
  paymentReference: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  createdAt: Date;
  completedAt?: Date;
  failureReason?: string;
}

export interface StoreSettings {
  id: string;
  paypalEnabled: boolean;
  paypalClientId: string;
  paypalSandbox: boolean;
  stripeEnabled: boolean;
  stripePublishableKey: string;
  cryptoEnabled: boolean;
  supportedCryptos: string[];
  minPurchaseAmount: number;
  maxPurchaseAmount: number;
  purchaseLimits: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  taxSettings: {
    enabled: boolean;
    rate: number;
    includedInPrice: boolean;
  };
  bonusMultiplier: number; // Global bonus multiplier
  promotions: StorePromotion[];
  updatedAt: Date;
  updatedBy: string;
}

export interface StorePromotion {
  id: string;
  name: string;
  type: 'bonus_multiplier' | 'fixed_bonus' | 'discount_percentage' | 'buy_one_get_one';
  value: number;
  targetPackages: string[]; // Empty array means all packages
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  maxUses?: number;
  currentUses: number;
  description: string;
}

export interface AdminLog {
  id: string;
  adminId: string;
  adminUsername: string;
  action: 'package_created' | 'package_updated' | 'package_deleted' | 'settings_updated' | 'promotion_created' | 'transaction_refunded';
  targetId: string;
  targetType: 'package' | 'settings' | 'promotion' | 'transaction';
  oldValue?: any;
  newValue?: any;
  description: string;
  timestamp: Date;
  ipAddress?: string;
}

export interface UserPurchaseHistory {
  userId: string;
  transactions: PurchaseTransaction[];
  totalSpent: number;
  totalGoldCoins: number;
  totalSweepsCoins: number;
  firstPurchase: Date;
  lastPurchase: Date;
  vipStatus: 'none' | 'bronze' | 'silver' | 'gold' | 'platinum';
}

export interface PaymentProvider {
  id: string;
  name: string;
  type: 'paypal' | 'stripe' | 'crypto';
  enabled: boolean;
  config: Record<string, any>;
  processingFee: number; // Percentage
  minAmount: number;
  maxAmount: number;
}

export interface RefundRequest {
  id: string;
  transactionId: string;
  userId: string;
  username: string;
  reason: string;
  requestedAmount: number;
  status: 'pending' | 'approved' | 'denied' | 'processed';
  requestedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  reviewNotes?: string;
  processedAt?: Date;
}
