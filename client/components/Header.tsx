import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useAuth } from "./AuthContext";
import { AuthModal } from "./AuthModal";
import { RealTimeWallet } from "./RealTimeWallet";
import { NotificationCenter } from "./NotificationCenter";
import { AdminAlerts } from "./AdminAlerts";
import { AdminToolbar } from "./AdminToolbar";
import {
  Menu,
  X,
  User,
  Settings,
  LogOut,
  Coins,
  Star,
  Trophy,
  Gamepad2,
  Dice6,
  Target,
  Grid3X3,
  Crown,
  Shield,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "register">(
    "login",
  );
  const { user, balance, logout } = useAuth();

  const navigation = [
    { name: "Slots", href: "/slots", icon: Gamepad2 },
    { name: "Table Games", href: "/table-games", icon: Dice6 },
    { name: "Sportsbook", href: "/sportsbook", icon: Target },
    { name: "Bingo", href: "/bingo", icon: Grid3X3 },
    { name: "Mini Games", href: "/mini-games", icon: Trophy },
    { name: "Leaderboards", href: "/leaderboards", icon: Trophy },
  ];

  return (
    <>
      {/* Admin Toolbar - Only visible to admin users */}
      <AdminToolbar />

      <header className={`${user?.role === 'admin' ? 'mt-12' : ''} sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60`}>
      <div className="w-[95%] mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-gold to-yellow-400 rounded-lg">
            <Coins className="h-6 w-6 text-gold-foreground" />
          </div>
          <div className="hidden sm:block">
            <span className="text-xl font-bold bg-gradient-to-r from-gold to-yellow-400 bg-clip-text text-transparent neon-text">
              CoinKrazy
            </span>
            <div className="text-xs text-muted-foreground">.com</div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              {/* Real-time Wallet Display */}
              <div className="hidden sm:block">
                <RealTimeWallet compact />
              </div>

              {/* Notification Center */}
              <NotificationCenter />

              {/* Admin Alerts - Only visible to admins */}
              <AdminAlerts />

              {/* Buy Coins Button */}
              <Button
                size="sm"
                className="bg-gradient-to-r from-gold to-yellow-400 text-gold-foreground hover:from-yellow-400 hover:to-gold casino-glow"
                asChild
              >
                <Link to="/store">
                  <Coins className="h-4 w-4 mr-1" />
                  Buy GC
                </Link>
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-sweep to-purple-600 flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="hidden sm:block text-sm">
                      {user.username}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  {(user.role === "staff" || user.role === "admin") && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/staff" className="flex items-center">
                          <Shield className="h-4 w-4 mr-2" />
                          Staff Panel
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  {user.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center">
                        <Crown className="h-4 w-4 mr-2" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={logout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setAuthModalTab("login");
                  setIsAuthModalOpen(true);
                }}
              >
                Login
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-gold to-yellow-400 text-gold-foreground hover:from-yellow-400 hover:to-gold"
                onClick={() => {
                  setAuthModalTab("register");
                  setIsAuthModalOpen(true);
                }}
              >
                Sign Up
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border">
          <nav className="container px-4 py-4 space-y-2">
            {user && (
              <div className="flex items-center justify-between py-2 mb-4 border-b border-border">
                <div className="flex items-center space-x-3">
                  <Badge
                    variant="outline"
                    className="casino-glow border-gold text-gold"
                  >
                    <Coins className="h-3 w-3 mr-1" />
                    {balance?.goldCoins.toLocaleString() || "0"} GC
                  </Badge>
                  <Badge
                    variant="outline"
                    className="sweep-glow border-sweep text-sweep"
                  >
                    <Star className="h-3 w-3 mr-1" />
                    {balance?.sweepsCoins.toFixed(2) || "0.00"} SC
                  </Badge>
                </div>
              </div>
            )}
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultTab={authModalTab}
      />
    </header>
    </>
  );
}
