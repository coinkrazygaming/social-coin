import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { User, Balance } from "@shared/types";

interface AuthContextType {
  user: User | null;
  balance: Balance | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    email: string,
    username: string,
    password: string,
    agreeToTerms: boolean,
  ) => Promise<boolean>;
  logout: () => void;
  refreshBalance: () => Promise<void>;
  updateBalance: (
    goldCoins: number,
    sweepsCoins: number,
    type: string,
    description: string,
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [balance, setBalance] = useState<Balance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("coinkrezy_user");
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        refreshBalance(userData.id);
      } catch (error) {
        localStorage.removeItem("coinkrezy_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        localStorage.setItem("coinkrezy_user", JSON.stringify(data.user));
        await refreshBalance(data.user.id);

        // Role-based redirect
        setTimeout(() => {
          if (data.user.role === "admin") {
            navigate("/admin");
          } else if (data.user.role === "staff") {
            navigate("/staff");
          } else {
            navigate("/dashboard");
          }
        }, 500); // Small delay to allow state to update

        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const register = async (
    email: string,
    username: string,
    password: string,
    agreeToTerms: boolean,
  ): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password, agreeToTerms }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        localStorage.setItem("coinkrezy_user", JSON.stringify(data.user));
        await refreshBalance(data.user.id);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setBalance(null);
    localStorage.removeItem("coinkrezy_user");
  };

  const refreshBalance = async (userId?: string) => {
    const targetUserId = userId || user?.id;
    if (!targetUserId) return;

    try {
      const response = await fetch(`/api/users/${targetUserId}/balance`);
      if (response.ok) {
        const balanceData = await response.json();
        setBalance(balanceData);
      }
    } catch (error) {
      console.error("Error refreshing balance:", error);
    }
  };

  const updateBalance = async (
    goldCoins: number,
    sweepsCoins: number,
    type: string,
    description: string,
  ) => {
    if (!user) return;

    try {
      const response = await fetch(`/api/users/${user.id}/balance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goldCoins, sweepsCoins, type, description }),
      });

      if (response.ok) {
        const newBalance = await response.json();
        setBalance(newBalance);
      }
    } catch (error) {
      console.error("Error updating balance:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        balance,
        isLoading,
        login,
        register,
        logout,
        refreshBalance,
        updateBalance,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
