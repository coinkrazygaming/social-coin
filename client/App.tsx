import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MiniGames from "./pages/MiniGames";
import Store from "./pages/Store";
import AdminPanel from "./pages/AdminPanel";
import Slots from "./pages/Slots";
import { Header } from "./components/Header";
import { Ticker } from "./components/Ticker";
import { PlaceholderPage } from "./components/PlaceholderPage";
import { AuthProvider } from "./components/AuthContext";
import {
  Gamepad2,
  Dice6,
  Target,
  Grid3X3,
  Trophy,
  User,
  Settings,
} from "lucide-react";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen">
            <Ticker />
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/mini-games" element={<MiniGames />} />
                <Route path="/store" element={<Store />} />
                <Route path="/admin" element={<AdminPanel />} />

                {/* Casino Routes */}
                <Route
                  path="/slots"
                  element={
                    <PlaceholderPage
                      title="Slot Games Lobby"
                      description="Experience 500+ premium slot games with real-time jackpots"
                      icon={<Gamepad2 className="h-8 w-8 text-white" />}
                      features={[
                        "500+ slot games from top providers",
                        "Real-time jackpot tracking",
                        "GC and SC betting options",
                        "Live game thumbnails",
                        "Auto-sync with provider APIs",
                        "Progressive jackpots",
                        "Tournament modes",
                      ]}
                    />
                  }
                />

                <Route
                  path="/table-games"
                  element={
                    <PlaceholderPage
                      title="Table Games"
                      description="Classic casino table games with live dealers"
                      icon={<Dice6 className="h-8 w-8 text-white" />}
                      features={[
                        "Live Blackjack tables",
                        "Roulette (American & European)",
                        "Poker variants",
                        "Baccarat rooms",
                        "Separate GC and SC lobbies",
                        "Real-time player statistics",
                        "VIP high-limit tables",
                      ]}
                    />
                  }
                />

                <Route
                  path="/sportsbook"
                  element={
                    <PlaceholderPage
                      title="Live Sportsbook"
                      description="Bet on live sports with real-time odds"
                      icon={<Target className="h-8 w-8 text-white" />}
                      features={[
                        "NFL, NBA, MLB, NHL betting",
                        "Live in-game odds",
                        "Moneyline, spread, totals",
                        "Player props",
                        "Real-time game data",
                        "Bet history tracking",
                        "GC and SC wagering",
                      ]}
                    />
                  }
                />

                <Route
                  path="/bingo"
                  element={
                    <PlaceholderPage
                      title="Bingo Hall"
                      description="Community bingo games with countdown timers"
                      icon={<Grid3X3 className="h-8 w-8 text-white" />}
                      features={[
                        "Scheduled bingo rounds",
                        "Free GC-only games",
                        "Premium SC games",
                        "Real-time countdown timers",
                        "Community chat",
                        "Progressive prizes",
                        "Auto-daub features",
                      ]}
                    />
                  }
                />

                <Route
                  path="/leaderboards"
                  element={
                    <PlaceholderPage
                      title="Leaderboards"
                      description="Compete with players across all games"
                      icon={<Trophy className="h-8 w-8 text-white" />}
                      features={[
                        "Slot game leaderboards",
                        "Table game rankings",
                        "Sports betting leaders",
                        "Daily/weekly/monthly boards",
                        "Prize pools",
                        "Achievement system",
                        "Player statistics",
                      ]}
                    />
                  }
                />

                {/* User Routes */}
                <Route
                  path="/profile"
                  element={
                    <PlaceholderPage
                      title="Player Profile"
                      description="Manage your account and view statistics"
                      icon={<User className="h-8 w-8 text-white" />}
                      features={[
                        "Account information",
                        "Game history",
                        "Balance management",
                        "KYC verification",
                        "Withdrawal requests",
                        "Bonus tracking",
                        "Responsible gaming tools",
                      ]}
                    />
                  }
                />

                <Route
                  path="/settings"
                  element={
                    <PlaceholderPage
                      title="Account Settings"
                      description="Customize your gaming experience"
                      icon={<Settings className="h-8 w-8 text-white" />}
                      features={[
                        "Notification preferences",
                        "Privacy settings",
                        "Game preferences",
                        "Sound and display options",
                        "Security settings",
                        "Communication preferences",
                        "Responsible gaming limits",
                      ]}
                    />
                  }
                />

                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
