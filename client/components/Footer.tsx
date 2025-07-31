import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { SweepstakesDisclaimer } from "./SweepstakesDisclaimer";
import { Shield, Mail, Phone, MapPin, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card/30 border-t border-border/40 mt-auto">
      <div className="container px-4 py-8">
        {/* Sweepstakes Disclaimer */}
        <div className="mb-8">
          <SweepstakesDisclaimer variant="compact" />
        </div>

        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gold">CoinKrazy</h3>
            <p className="text-sm text-muted-foreground">
              The premier sweepstakes gaming platform. Play responsibly, win
              real prizes.
            </p>
            <div className="flex space-x-2">
              <SweepstakesDisclaimer variant="modal" />
            </div>
          </div>

          {/* Legal & Support */}
          <div className="space-y-4">
            <h4 className="font-semibold">Legal & Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Button
                  variant="link"
                  className="p-0 h-auto text-muted-foreground hover:text-foreground"
                >
                  Terms & Conditions
                </Button>
              </li>
              <li>
                <Button
                  variant="link"
                  className="p-0 h-auto text-muted-foreground hover:text-foreground"
                >
                  Privacy Policy
                </Button>
              </li>
              <li>
                <Button
                  variant="link"
                  className="p-0 h-auto text-muted-foreground hover:text-foreground"
                >
                  Responsible Gaming
                </Button>
              </li>
              <li>
                <Button
                  variant="link"
                  className="p-0 h-auto text-muted-foreground hover:text-foreground"
                >
                  Contact Support
                </Button>
              </li>
              <li>
                <Button
                  variant="link"
                  className="p-0 h-auto text-muted-foreground hover:text-foreground"
                >
                  Age Verification
                </Button>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/slots"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Slot Games
                </Link>
              </li>
              <li>
                <Link
                  to="/table-games"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Table Games
                </Link>
              </li>
              <li>
                <Link
                  to="/mini-games"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Mini Games
                </Link>
              </li>
              <li>
                <Link
                  to="/sportsbook"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sportsbook
                </Link>
              </li>
              <li>
                <Link
                  to="/bingo"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Bingo Hall
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold">Contact Information</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  support@coinkrazy.com
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">1-800-COINKRAZY</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="text-muted-foreground">
                  <div>CoinKrazy LLC</div>
                  <div>1234 Casino Blvd</div>
                  <div>Las Vegas, NV 89123</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Compliance Notices */}
        <div className="border-t border-border/40 pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs text-muted-foreground">
            <div className="bg-muted/20 p-3 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="h-4 w-4 text-gold" />
                <span className="font-semibold text-gold">
                  Age Verification
                </span>
              </div>
              <p>
                Must be 18+ to participate. Valid ID required for redemptions.
              </p>
            </div>
            <div className="bg-muted/20 p-3 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <ExternalLink className="h-4 w-4 text-sweep" />
                <span className="font-semibold text-sweep">
                  Geographic Restrictions
                </span>
              </div>
              <p>
                Service not available in WA, ID, MI, NV and other restricted
                jurisdictions.
              </p>
            </div>
            <div className="bg-muted/20 p-3 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Mail className="h-4 w-4 text-blue-400" />
                <span className="font-semibold text-blue-400">Free Entry</span>
              </div>
              <p>
                No purchase necessary. Mail requests accepted for free Sweeps
                Coins.
              </p>
            </div>
          </div>

          {/* Bottom Notice */}
          <div className="text-center space-y-2">
            <div className="text-xs text-muted-foreground">
              <strong className="text-gold">IMPORTANT:</strong> This platform
              operates as a promotional sweepstakes where virtual currency is
              used for entertainment. Sweeps Coins can be redeemed for prizes.
              Virtual currency has no cash value and cannot be transferred
              between users.
            </div>
            <div className="text-xs text-muted-foreground">
              By using this site, you certify that you are 18+ years old and
              legally eligible to participate in promotional sweepstakes in your
              jurisdiction.
            </div>
            <div className="text-xs font-semibold text-gold">
              Remember: Play Responsibly • Must be 18+ • No Purchase Necessary •
              Void where prohibited
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center text-xs text-muted-foreground border-t border-border/20 pt-4">
            © 2024 CoinKrazy LLC. All rights reserved. Licensed sweepstakes
            operator.
          </div>
        </div>
      </div>
    </footer>
  );
}
