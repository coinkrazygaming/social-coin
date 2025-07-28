import { RequestHandler } from "express";
import { PayPalPayment, Transaction } from "@shared/types";
import { z } from "zod";

// In-memory storage (replace with real database)
const payments: Map<string, PayPalPayment> = new Map();

// PayPal packages with pricing
const packages = [
  { id: 'gc_1000', name: '1,000 Gold Coins', price: 4.99, goldCoins: 1000, bonusSC: 1 },
  { id: 'gc_2500', name: '2,500 Gold Coins', price: 9.99, goldCoins: 2500, bonusSC: 2.5 },
  { id: 'gc_5000', name: '5,000 Gold Coins', price: 19.99, goldCoins: 5000, bonusSC: 5 },
  { id: 'gc_10000', name: '10,000 Gold Coins', price: 34.99, goldCoins: 10000, bonusSC: 10 },
  { id: 'gc_25000', name: '25,000 Gold Coins', price: 79.99, goldCoins: 25000, bonusSC: 25 },
  { id: 'gc_50000', name: '50,000 Gold Coins', price: 149.99, goldCoins: 50000, bonusSC: 50 },
  { id: 'gc_100000', name: '100,000 Gold Coins', price: 279.99, goldCoins: 100000, bonusSC: 100 }
];

const createPaymentSchema = z.object({
  userId: z.string(),
  packageId: z.string(),
  paypalTransactionId: z.string()
});

function generatePaymentId(): string {
  return 'pay_' + Math.random().toString(36).substring(2, 15);
}

// Get available packages
export const handleGetPackages: RequestHandler = (req, res) => {
  res.json(packages);
};

// Create PayPal payment
export const handleCreatePayment: RequestHandler = (req, res) => {
  try {
    const { userId, packageId, paypalTransactionId } = createPaymentSchema.parse(req.body);
    
    const selectedPackage = packages.find(p => p.id === packageId);
    if (!selectedPackage) {
      return res.status(400).json({ error: 'Invalid package selected' });
    }

    const payment: PayPalPayment = {
      id: generatePaymentId(),
      userId,
      amount: selectedPackage.price,
      goldCoinsAwarded: selectedPackage.goldCoins,
      sweepsCoinsBonus: selectedPackage.bonusSC,
      paypalTransactionId,
      status: 'pending',
      createdAt: new Date()
    };

    payments.set(payment.id, payment);

    // In a real implementation, you would verify the PayPal transaction here
    // For demo purposes, we'll auto-approve
    setTimeout(() => {
      payment.status = 'completed';
      payments.set(payment.id, payment);
    }, 2000);

    res.json(payment);
  } catch (error) {
    res.status(400).json({ error: 'Invalid payment data' });
  }
};

// Verify PayPal payment (webhook simulation)
export const handleVerifyPayment: RequestHandler = (req, res) => {
  const paymentId = req.params.paymentId;
  const payment = payments.get(paymentId);
  
  if (!payment) {
    return res.status(404).json({ error: 'Payment not found' });
  }

  // Simulate PayPal verification
  payment.status = 'completed';
  payments.set(paymentId, payment);

  res.json({ 
    success: true, 
    payment,
    message: 'Payment verified and coins awarded'
  });
};

// Get payment history
export const handleGetPayments: RequestHandler = (req, res) => {
  const userId = req.params.userId;
  const userPayments = Array.from(payments.values())
    .filter(p => p.userId === userId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  res.json(userPayments);
};

// Get all payments (admin)
export const handleGetAllPayments: RequestHandler = (req, res) => {
  const allPayments = Array.from(payments.values())
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  res.json(allPayments);
};

// Process PayPal webhook (for real PayPal integration)
export const handlePayPalWebhook: RequestHandler = (req, res) => {
  // This would handle real PayPal webhook events
  // For now, it's a placeholder for the actual PayPal integration
  
  const { event_type, resource } = req.body;
  
  if (event_type === 'PAYMENT.CAPTURE.COMPLETED') {
    // Find payment by PayPal transaction ID
    const payment = Array.from(payments.values()).find(
      p => p.paypalTransactionId === resource.id
    );
    
    if (payment) {
      payment.status = 'completed';
      payments.set(payment.id, payment);
      
      // Here you would also update the user's balance
      // This is handled in the frontend for demo purposes
    }
  }
  
  res.status(200).json({ received: true });
};
