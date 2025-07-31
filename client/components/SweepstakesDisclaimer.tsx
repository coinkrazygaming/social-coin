import { useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  AlertTriangle,
  Info,
  Shield,
  Scale,
  Users,
  Clock,
  Coins,
} from "lucide-react";

interface SweepstakesDisclaimerProps {
  variant?: "full" | "compact" | "modal";
  className?: string;
}

export function SweepstakesDisclaimer({
  variant = "compact",
  className = "",
}: SweepstakesDisclaimerProps) {
  const [showFullDisclaimer, setShowFullDisclaimer] = useState(false);

  if (variant === "modal") {
    return (
      <Dialog open={showFullDisclaimer} onOpenChange={setShowFullDisclaimer}>
        <DialogTrigger asChild>
          <Button variant="outline" className="text-xs">
            <Info className="h-3 w-3 mr-1" />
            Sweepstakes Terms
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-gold" />
              <span>Sweepstakes Gaming Platform - Legal Compliance</span>
            </DialogTitle>
            <DialogDescription>
              Important legal information regarding sweepstakes gaming
              participation
            </DialogDescription>
          </DialogHeader>
          <FullDisclaimerContent />
        </DialogContent>
      </Dialog>
    );
  }

  if (variant === "compact") {
    return (
      <Card className={`border-gold/20 bg-gold/5 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-gold mt-0.5 flex-shrink-0" />
            <div className="space-y-2 text-sm">
              <p className="font-semibold text-gold">
                Sweepstakes Gaming Platform
              </p>
              <p className="text-muted-foreground">
                This platform operates as a sweepstakes gaming site. No purchase
                necessary. Virtual currency cannot be redeemed for cash. Must be
                18+ and located in eligible states.
              </p>
              <Button
                variant="link"
                className="p-0 h-auto text-gold text-xs"
                onClick={() => setShowFullDisclaimer(true)}
              >
                View Full Terms & Conditions
              </Button>
            </div>
          </div>
        </CardContent>

        <Dialog open={showFullDisclaimer} onOpenChange={setShowFullDisclaimer}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-gold" />
                <span>Sweepstakes Gaming Platform - Legal Compliance</span>
              </DialogTitle>
            </DialogHeader>
            <FullDisclaimerContent />
          </DialogContent>
        </Dialog>
      </Card>
    );
  }

  return (
    <div className={className}>
      <FullDisclaimerContent />
    </div>
  );
}

function FullDisclaimerContent() {
  return (
    <div className="space-y-6">
      {/* Main Disclaimer */}
      <Card className="border-gold/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-gold">
            <AlertTriangle className="h-5 w-5" />
            <span>Important Legal Notice</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg border-l-4 border-gold">
            <p className="font-semibold mb-2">
              THIS IS A SWEEPSTAKES GAMING PLATFORM
            </p>
            <p className="text-sm text-muted-foreground">
              CoinKrazy, operated by Howes Networks, LLC, operates as a promotional sweepstakes platform where
              virtual currency is used for entertainment purposes only. This
              platform complies with applicable sweepstakes and promotional
              gaming laws.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Key Points */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-sm">
              <Users className="h-4 w-4 text-gold" />
              <span>Eligibility Requirements</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>• Must be 18 years of age or older</p>
            <p>• Must be legally residing in an eligible state/jurisdiction</p>
            <p>• Valid ID verification may be required</p>
            <p>• Employees of CoinKrazy and affiliates are ineligible</p>
            <p>• One account per person/household</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-sm">
              <Coins className="h-4 w-4 text-sweep" />
              <span>Virtual Currency Rules</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>• Gold Coins (GC) are for entertainment only</p>
            <p>• Sweeps Coins (SC) can be redeemed for prizes</p>
            <p>• Virtual currency has no cash value</p>
            <p>• Cannot be transferred between users</p>
            <p>• May expire according to terms</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-sm">
              <Shield className="h-4 w-4 text-blue-400" />
              <span>No Purchase Necessary</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>• Free Sweeps Coins available daily</p>
            <p>• Mail-in requests accepted for free SC</p>
            <p>• Social media promotions provide free currency</p>
            <p>• Purchasing GC packages is optional</p>
            <p>• Free and paid players have equal winning odds</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-sm">
              <Clock className="h-4 w-4 text-green-400" />
              <span>Redemption Process</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>• Minimum redemption: 100 SC</p>
            <p>• Processing time: 2-7 business days</p>
            <p>• Identity verification required</p>
            <p>• Gift cards and cash prizes available</p>
            <p>• Tax responsibilities may apply</p>
          </CardContent>
        </Card>
      </div>

      {/* Legal Sections */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Scale className="h-5 w-5 text-gold" />
            <span>Legal Compliance</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <h4 className="font-semibold mb-2">State Restrictions</h4>
            <p className="text-muted-foreground">
              This platform is not available in Washington, Idaho, Michigan,
              Nevada, or any other jurisdiction where promotional sweepstakes
              are prohibited by law. Geographic restrictions are enforced.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Age Verification</h4>
            <p className="text-muted-foreground">
              All users must be 18+ years of age. Age verification may be
              required at any time. Accounts found to be under 18 will be
              immediately suspended.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Responsible Gaming</h4>
            <p className="text-muted-foreground">
              We promote responsible gaming practices. Users can set daily,
              weekly, and monthly spending limits. Self-exclusion options are
              available. If you feel you have a gambling problem, please seek
              help.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Anti-Money Laundering</h4>
            <p className="text-muted-foreground">
              CoinKrazy complies with all applicable AML/KYC regulations.
              Suspicious activity will be reported to relevant authorities.
              Large redemptions may require additional verification.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Free Entry Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="text-gold">Free Entry Methods</CardTitle>
          <CardDescription>
            Multiple ways to obtain free Sweeps Coins without purchase
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-semibold">Daily Bonuses</h5>
              <p className="text-muted-foreground">
                Log in daily to receive free Sweeps Coins
              </p>
            </div>
            <div>
              <h5 className="font-semibold">Social Media</h5>
              <p className="text-muted-foreground">
                Follow our social accounts for promotional SC
              </p>
            </div>
            <div>
              <h5 className="font-semibold">Mail-In Request</h5>
              <p className="text-muted-foreground">
                Send written request to our mailing address
              </p>
            </div>
            <div>
              <h5 className="font-semibold">Contests & Promotions</h5>
              <p className="text-muted-foreground">
                Participate in special events for free SC
              </p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <h5 className="font-semibold mb-2">Mail-In Address:</h5>
            <p className="text-muted-foreground">
              CoinKrazy Free Sweeps Coins Request
              <br />
              Howes Networks, LLC
              <br />
              228 Blondeau St
              <br />
              Keokuk, IA 52632
              <br />
              <br />
              Include: Full name, mailing address, email, and phone number
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Footer Notice */}
      <div className="text-xs text-muted-foreground space-y-2 border-t pt-4">
        <p>
          <strong>Void where prohibited.</strong> This promotion is subject to
          all applicable federal, state, and local laws.
        </p>
        <p>
          By using this platform, you acknowledge that you have read,
          understood, and agree to be bound by these terms and all applicable
          laws and regulations.
        </p>
        <p>
          For questions regarding sweepstakes rules or compliance, contact:
          legal@coinkrazy.com
        </p>
        <p className="text-center font-semibold">
          Remember: Play Responsibly. Must be 18+. No Purchase Necessary.
        </p>
      </div>
    </div>
  );
}

export default SweepstakesDisclaimer;
