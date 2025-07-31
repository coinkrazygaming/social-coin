import { DatabaseService } from "../../shared/database";
import { User } from "../../shared/database";

export async function createAdminAccount(email: string, password: string): Promise<boolean> {
  try {
    console.log(`Setting up admin account for ${email}...`);
    
    // Check if admin already exists
    const existingAdmin = await DatabaseService.getUserByEmail(email);
    
    if (existingAdmin) {
      console.log("Admin account already exists, updating role...");
      // Update existing user to admin role if needed
      if (existingAdmin.role !== "admin") {
        // This would require a database update method
        console.log("User exists but is not admin. Please update manually in database.");
        return false;
      }
      console.log("Admin account verified successfully");
      return true;
    }

    // Create new admin user
    const adminUser = await DatabaseService.createUser({
      email: email,
      username: "CoinKrazyAdmin",
      first_name: "CoinKrazy",
      last_name: "Admin",
      role: "admin",
      status: "active",
      kyc_status: "approved",
      preferences: {
        theme: "dark",
        notifications_enabled: true,
        sound_enabled: true,
        auto_play_enabled: false,
        currency_preference: "SC",
        language: "en",
        timezone: "UTC",
      },
      oauth_providers: ["email"],
    });

    if (adminUser) {
      console.log("Admin account created successfully!");
      console.log(`Admin ID: ${adminUser.id}`);
      console.log(`Admin Email: ${adminUser.email}`);
      console.log(`Admin Role: ${adminUser.role}`);
      
      // Initialize default admin would also create wallet
      await DatabaseService.initializeDefaultAdmin();
      
      return true;
    } else {
      console.error("Failed to create admin account");
      return false;
    }
  } catch (error) {
    console.error("Error setting up admin account:", error);
    return false;
  }
}

export async function setupOAuth2Environment() {
  console.log("Setting up OAuth2 environment...");
  
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error("Missing required environment variables for OAuth2:");
    missingVars.forEach(varName => {
      console.error(`- ${varName}`);
    });
    
    console.log("\nTo set up OAuth2 authentication:");
    console.log("1. Create a Supabase project at https://supabase.com");
    console.log("2. Go to Settings > API to get your URL and keys");
    console.log("3. Set the following environment variables:");
    console.log("   NEXT_PUBLIC_SUPABASE_URL=your-project-url");
    console.log("   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key");
    console.log("   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key");
    
    return false;
  }
  
  console.log("OAuth2 environment variables are configured ✓");
  return true;
}

export async function verifyDatabaseConnection() {
  try {
    console.log("Verifying database connection...");
    
    // Try to initialize default admin which tests the connection
    await DatabaseService.initializeDefaultAdmin();
    
    console.log("Database connection verified ✓");
    return true;
  } catch (error) {
    console.error("Database connection failed:", error);
    console.log("\nDatabase setup required:");
    console.log("1. Ensure Supabase project is created");
    console.log("2. Run the database migration scripts");
    console.log("3. Verify environment variables are correct");
    return false;
  }
}
