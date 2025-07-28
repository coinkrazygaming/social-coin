import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Coins, 
  Star, 
  CreditCard, 
  Gift,
  CheckCircle,
  AlertCircle,
  Loader2,
  Sparkles
} from 'lucide-react';

interface Package {
  id: string;
  name: string;
  price: number;
  goldCoins: number;
  bonusSC: number;
}

interface PaymentStatus {
  status: 'idle' | 'processing' | 'success' | 'error';
  message?: string;
}

export default function Store() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>({ status: 'idle' });
  const [isLoading, setIsLoading] = useState(true);
  
  // Mock user data - replace with actual auth
  const userId = 'user_demo123';

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/payments/packages');
      const data = await response.json();
      setPackages(data);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchase = async (pkg: Package) => {
    setSelectedPackage(pkg);
    setPaymentStatus({ status: 'processing', message: 'Redirecting to PayPal...' });

    try {
      // In a real implementation, you would integrate with PayPal SDK
      // For demo purposes, we'll simulate the PayPal flow
      
      // Simulate PayPal transaction ID
      const paypalTransactionId = `PAYPAL_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      
      // Create payment record
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          packageId: pkg.id,
          paypalTransactionId
        })
      });

      if (!response.ok) {
        throw new Error('Payment creation failed');
      }

      const payment = await response.json();
      
      // Simulate PayPal processing time
      setTimeout(async () => {
        try {
          // Verify payment (simulate successful PayPal payment)
          const verifyResponse = await fetch(`/api/payments/${payment.id}/verify`, {
            method: 'POST'
          });
          
          if (verifyResponse.ok) {
            // Update user balance
            await fetch(`/api/users/${userId}/balance`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                goldCoins: pkg.goldCoins,
                sweepsCoins: pkg.bonusSC,
                type: 'purchase',
                description: `Purchase: ${pkg.name}`
              })
            });

            setPaymentStatus({ 
              status: 'success', 
              message: `Successfully purchased ${pkg.goldCoins.toLocaleString()} GC + ${pkg.bonusSC} SC!` 
            });
            
            // Reset after 3 seconds
            setTimeout(() => {
              setPaymentStatus({ status: 'idle' });
              setSelectedPackage(null);
            }, 3000);
          } else {
            throw new Error('Payment verification failed');
          }
        } catch (error) {
          setPaymentStatus({ 
            status: 'error', 
            message: 'Payment verification failed. Please contact support.' 
          });
        }
      }, 2000);

    } catch (error) {
      setPaymentStatus({ 
        status: 'error', 
        message: 'Payment failed. Please try again.' 
      });
    }
  };

  const getPackageValue = (pkg: Package) => {
    const baseValue = pkg.goldCoins / 1000 * 4.99; // Base rate: $4.99 per 1000 GC
    const savings = baseValue - pkg.price;
    const savingsPercent = Math.round((savings / baseValue) * 100);
    return { savings, savingsPercent };
  };

  const getMostPopular = () => {
    // Return the package with best value (typically mid-tier)
    return packages.find(p => p.id === 'gc_10000') || packages[3];
  };

  const getBestValue = () => {
    // Return the largest package
    return packages[packages.length - 1];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-gold to-yellow-400 rounded-2xl flex items-center justify-center mr-4 casino-glow">
                <Coins className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Gold Coin Store</h1>
                <p className="text-muted-foreground text-lg">
                  Purchase Gold Coins and get FREE Sweeps Coins!
                </p>
              </div>
            </div>
            
            <Alert className="max-w-2xl mx-auto bg-gradient-to-r from-gold/20 to-sweep/20 border-gold/30">
              <Gift className="h-4 w-4" />
              <AlertDescription className="text-center font-medium">
                🎉 <strong>BONUS OFFER:</strong> Get the same value in Sweeps Coins FREE with every purchase!
                PayPal payments go to <strong>corey@coinkrazy.com</strong>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </section>

      {/* Payment Status */}
      {paymentStatus.status !== 'idle' && (
        <div className="container px-4 mb-8">
          <Alert className={`max-w-2xl mx-auto ${
            paymentStatus.status === 'success' ? 'bg-casino-green/20 border-casino-green/30' :
            paymentStatus.status === 'error' ? 'bg-casino-red/20 border-casino-red/30' :
            'bg-blue-500/20 border-blue-500/30'
          }`}>
            {paymentStatus.status === 'processing' && <Loader2 className="h-4 w-4 animate-spin" />}
            {paymentStatus.status === 'success' && <CheckCircle className="h-4 w-4" />}
            {paymentStatus.status === 'error' && <AlertCircle className="h-4 w-4" />}
            <AlertDescription className="font-medium">
              {paymentStatus.message}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Packages Grid */}
      <section className="py-16">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {packages.map((pkg) => {
              const { savings, savingsPercent } = getPackageValue(pkg);
              const isMostPopular = pkg.id === getMostPopular()?.id;
              const isBestValue = pkg.id === getBestValue()?.id;
              const isProcessing = selectedPackage?.id === pkg.id && paymentStatus.status === 'processing';
              
              return (
                <Card 
                  key={pkg.id}
                  className={`relative group transition-all duration-300 hover:scale-105 ${
                    isMostPopular ? 'ring-2 ring-gold shadow-lg' :
                    isBestValue ? 'ring-2 ring-sweep shadow-lg' : ''
                  } ${isProcessing ? 'opacity-50' : ''}`}
                >
                  {/* Popular/Best Value Badges */}
                  {isMostPopular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                      <Badge className="bg-gold text-gold-foreground casino-glow px-3 py-1">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  {isBestValue && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                      <Badge className="bg-sweep text-sweep-foreground sweep-glow px-3 py-1">
                        <Star className="h-3 w-3 mr-1" />
                        Best Value
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pt-8">
                    <div className="text-4xl mb-3">
                      <Coins className="h-12 w-12 mx-auto text-gold" />
                    </div>
                    <CardTitle className="text-xl">{pkg.name}</CardTitle>
                    <div className="text-3xl font-bold text-gold">
                      ${pkg.price}
                    </div>
                    {savingsPercent > 0 && (
                      <div className="text-sm text-casino-green">
                        Save {savingsPercent}%
                      </div>
                    )}
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* What You Get */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gold/10 rounded-lg border border-gold/20">
                        <div className="flex items-center">
                          <Coins className="h-5 w-5 text-gold mr-2" />
                          <span className="font-medium">Gold Coins</span>
                        </div>
                        <span className="font-bold text-gold">
                          {pkg.goldCoins.toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-sweep/10 rounded-lg border border-sweep/20">
                        <div className="flex items-center">
                          <Star className="h-5 w-5 text-sweep mr-2" />
                          <span className="font-medium">Sweeps Coins</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-sweep">
                            {pkg.bonusSC.toLocaleString()}
                          </span>
                          <div className="text-xs text-casino-green">FREE!</div>
                        </div>
                      </div>
                    </div>

                    {/* Total Value */}
                    <div className="text-center p-2 bg-muted/20 rounded-lg">
                      <div className="text-sm text-muted-foreground">Total Value</div>
                      <div className="font-semibold">
                        {pkg.goldCoins.toLocaleString()} GC + {pkg.bonusSC} SC
                      </div>
                    </div>

                    {/* Purchase Button */}
                    <Button 
                      onClick={() => handlePurchase(pkg)}
                      disabled={paymentStatus.status === 'processing'}
                      className={`w-full text-white ${
                        isMostPopular ? 'bg-gradient-to-r from-gold to-yellow-400 hover:from-yellow-400 hover:to-gold casino-glow' :
                        isBestValue ? 'bg-gradient-to-r from-sweep to-purple-600 hover:from-purple-600 hover:to-sweep sweep-glow' :
                        'bg-gradient-to-r from-gold to-yellow-400 hover:from-yellow-400 hover:to-gold'
                      }`}
                      size="lg"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-4 w-4 mr-2" />
                          Buy with PayPal
                        </>
                      )}
                    </Button>
                    
                    <div className="text-center text-xs text-muted-foreground">
                      Secure payment via PayPal
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-card/30">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">How It Works</h2>
            <p className="text-muted-foreground mt-2">Simple, secure, and instant</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold">Choose Package</h3>
              <p className="text-muted-foreground">
                Select your preferred Gold Coin package. Bigger packages = better value!
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold">Secure Payment</h3>
              <p className="text-muted-foreground">
                Pay securely with PayPal. All payments go to corey@coinkrazy.com
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-casino-green to-green-600 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold">Instant Coins</h3>
              <p className="text-muted-foreground">
                Get your Gold Coins + FREE Sweeps Coins instantly in your account!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Terms */}
      <section className="py-8 bg-muted/20">
        <div className="container px-4">
          <div className="text-center text-sm text-muted-foreground max-w-4xl mx-auto">
            <p className="mb-2">
              * Sweeps Coins are awarded as a FREE bonus with every Gold Coin purchase. 
              Gold Coins have no cash value. Sweeps Coins can be redeemed for prizes subject to terms and conditions.
            </p>
            <p>
              By purchasing, you agree to our Terms of Service and acknowledge that this is a social casino 
              for entertainment purposes only. Must be 21+ to play.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
