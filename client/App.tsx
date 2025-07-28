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
import { Store } from "./pages/Store";
import { AdminPanel } from "./pages/AdminPanel";
import Slots from "./pages/Slots";
import TableGames from "./pages/TableGames";
import Leaderboards from "./pages/Leaderboards";
import Bingo from "./pages/Bingo";
import { Sportsbook } from "./pages/Sportsbook";
import { UserDashboard } from "./pages/UserDashboard";
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
                  element={<Slots />}
                />

                <Route
                  path="/table-games"
                  element={<TableGames />}
                />

                <Route path="/sportsbook" element={<Sportsbook />} />

                <Route path="/bingo" element={<Bingo />} />

                <Route path="/leaderboards" element={<Leaderboards />} />

                {/* User Routes */}
                <Route path="/profile" element={<UserDashboard />} />
                <Route path="/dashboard" element={<UserDashboard />} />

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
