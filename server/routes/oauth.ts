import { RequestHandler } from "express";
import { DatabaseService, supabase } from "../../shared/database";
import { z } from "zod";

// OAuth2 validation schemas
const oauthCallbackSchema = z.object({
  code: z.string(),
  state: z.string().optional(),
  provider: z.enum(["google", "discord", "github", "facebook"]),
});

const oauthLoginSchema = z.object({
  provider: z.enum(["google", "discord", "github", "facebook"]),
  redirectUrl: z.string().url().optional(),
});

// Initialize OAuth2 providers
export const handleOAuthLogin: RequestHandler = async (req, res) => {
  try {
    const { provider, redirectUrl } = oauthLoginSchema.parse(req.body);

    if (!supabase) {
      return res.status(503).json({
        error: "OAuth2 service unavailable",
        message: "Database connection not configured",
      });
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo:
          redirectUrl ||
          `${process.env.FRONTEND_URL || "http://localhost:5173"}/auth/callback`,
      },
    });

    if (error) {
      console.error(`OAuth ${provider} login error:`, error);
      return res.status(400).json({ error: error.message });
    }

    res.json({
      success: true,
      authUrl: data.url,
      provider,
    });
  } catch (error) {
    console.error("OAuth login error:", error);
    res.status(400).json({ error: "Invalid OAuth login request" });
  }
};

// Handle OAuth2 callback
export const handleOAuthCallback: RequestHandler = async (req, res) => {
  try {
    const { code, state, provider } = oauthCallbackSchema.parse(req.query);

    if (!supabase) {
      return res.status(503).json({
        error: "OAuth2 service unavailable",
        message: "Database connection not configured",
      });
    }

    // Exchange code for session
    const { data: authData, error: authError } =
      await supabase.auth.exchangeCodeForSession(code);

    if (authError) {
      console.error("OAuth callback error:", authError);
      return res.status(400).json({ error: authError.message });
    }

    const { user: supabaseUser, session } = authData;

    if (!supabaseUser || !session) {
      return res.status(400).json({ error: "Failed to authenticate user" });
    }

    // Check if user exists in our system
    let user = await DatabaseService.getUserByEmail(supabaseUser.email!);

    if (!user) {
      // Create new user from OAuth data
      const userData = {
        email: supabaseUser.email!,
        username:
          supabaseUser.user_metadata?.full_name ||
          supabaseUser.user_metadata?.name ||
          supabaseUser.email!.split("@")[0],
        first_name: supabaseUser.user_metadata?.first_name || "",
        last_name: supabaseUser.user_metadata?.last_name || "",
        avatar_url: supabaseUser.user_metadata?.avatar_url,
        role: supabaseUser.email === "coinkrazy00@gmail.com" ? "admin" : "user",
        status: "active",
        kyc_status: "none",
        oauth_providers: [provider],
        preferences: {
          theme: "dark",
          notifications_enabled: true,
          sound_enabled: true,
          auto_play_enabled: false,
          currency_preference: "GC",
          language: "en",
          timezone: "UTC",
        },
      };

      user = await DatabaseService.createUser(userData);

      if (!user) {
        return res.status(500).json({ error: "Failed to create user account" });
      }

      console.log(`New OAuth user created: ${user.email} via ${provider}`);
    } else {
      // Update OAuth providers if not already included
      if (!user.oauth_providers.includes(provider)) {
        user.oauth_providers.push(provider);
        // Note: In a real implementation, you'd update this in the database
      }

      console.log(`Existing user logged in: ${user.email} via ${provider}`);
    }

    // Special handling for admin accounts
    if (user.email === "coinkrazy00@gmail.com" && user.role !== "admin") {
      user.role = "admin";
      user.status = "active";
      user.kyc_status = "approved";
      console.log("Admin privileges granted to coinkrazy00@gmail.com");
    }

    res.json({
      success: true,
      user: {
        ...user,
        password: undefined,
      },
      session: {
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_at: session.expires_at,
      },
      provider,
    });
  } catch (error) {
    console.error("OAuth callback processing error:", error);
    res.status(400).json({ error: "Invalid OAuth callback" });
  }
};

// Get user from session token
export const handleGetUserFromToken: RequestHandler = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No authorization token provided" });
    }

    const token = authHeader.substring(7);

    if (!supabase) {
      return res.status(503).json({
        error: "Authentication service unavailable",
      });
    }

    const { data: authData, error } = await supabase.auth.getUser(token);

    if (error || !authData.user) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const user = await DatabaseService.getUserByEmail(authData.user.email!);

    if (!user) {
      return res.status(404).json({ error: "User not found in system" });
    }

    res.json({
      user: {
        ...user,
        password: undefined,
      },
    });
  } catch (error) {
    console.error("Token validation error:", error);
    res.status(500).json({ error: "Token validation failed" });
  }
};

// Refresh OAuth2 session
export const handleRefreshSession: RequestHandler = async (req, res) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.status(400).json({ error: "Refresh token required" });
    }

    if (!supabase) {
      return res.status(503).json({
        error: "Authentication service unavailable",
      });
    }

    const { data: authData, error } = await supabase.auth.refreshSession({
      refresh_token,
    });

    if (error || !authData.session) {
      return res.status(401).json({ error: "Failed to refresh session" });
    }

    res.json({
      success: true,
      session: {
        access_token: authData.session.access_token,
        refresh_token: authData.session.refresh_token,
        expires_at: authData.session.expires_at,
      },
    });
  } catch (error) {
    console.error("Session refresh error:", error);
    res.status(500).json({ error: "Session refresh failed" });
  }
};

// OAuth2 logout
export const handleOAuthLogout: RequestHandler = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ") && supabase) {
      const token = authHeader.substring(7);
      await supabase.auth.getUser(token).then(({ data }) => {
        if (data.user) {
          return supabase.auth.signOut();
        }
      });
    }

    res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("OAuth logout error:", error);
    res.json({ success: true, message: "Logged out successfully" });
  }
};
