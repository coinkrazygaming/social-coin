import { Toaster } from "@/components/ui/toaster";
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
import { UserDashboard } from "./pages/UserDashboard";
import { AccountSettings } from "./pages/AccountSettings";
import { StaffPanel } from "./pages/StaffPanel";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { PlaceholderPage } from "./components/PlaceholderPage";
import { AuthProvider } from "./components/AuthContext";
import Sportsbook from "./pages/Sportsbook";
import EnhancedTableGames from "./pages/EnhancedTableGames";
import { EnhancedAdminPanel } from "./components/EnhancedAdminPanel";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/mini-games" element={<MiniGames />} />
                <Route path="/store" element={<Store />} />
                <Route path="/admin" element={<EnhancedAdminPanel />} />
                <Route path="/staff" element={<StaffPanel />} />

                {/* Casino Routes */}
                <Route path="/slots" element={<Slots />} />
                <Route path="/table-games" element={<EnhancedTableGames />} />
                <Route path="/sportsbook" element={<Sportsbook />} />
                <Route path="/bingo" element={<Bingo />} />
                <Route path="/leaderboards" element={<Leaderboards />} />

                {/* User Routes */}
                <Route path="/profile" element={<UserDashboard />} />
                <Route path="/dashboard" element={<UserDashboard />} />

                <Route path="/settings" element={<AccountSettings />} />

                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
