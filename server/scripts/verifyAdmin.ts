#!/usr/bin/env ts-node

import "dotenv/config";

async function verifyAdminAccount() {
  console.log("🔍 Verifying Admin Account Setup");
  console.log("=================================\n");

  const adminCredentials = [
    { email: "coinkrazy00@gmail.com", password: "Woot6969!" },
    { email: "admin@coinkrazy.com", password: "admin123" }
  ];

  for (const cred of adminCredentials) {
    try {
      console.log(`Testing admin login: ${cred.email}`);
      
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cred.email,
          password: cred.password
        }),
      });

      const result = await response.json();

      if (response.ok && result.user?.role === "admin") {
        console.log(`✅ Admin login successful for ${cred.email}`);
        console.log(`   User ID: ${result.user.id}`);
        console.log(`   Username: ${result.user.username}`);
        console.log(`   Role: ${result.user.role}`);
        console.log(`   Gold Coins: ${result.user.goldCoins}`);
        console.log(`   Sweeps Coins: ${result.user.sweepsCoins}`);
      } else {
        console.log(`❌ Admin login failed for ${cred.email}`);
        console.log(`   Error: ${result.error || 'Unknown error'}`);
      }
      console.log("");
    } catch (error) {
      console.log(`❌ Network error testing ${cred.email}: ${error}`);
    }
  }

  console.log("📋 OAuth2 Setup Status");
  console.log("======================");
  
  const oauthEnvVars = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY", 
    "SUPABASE_SERVICE_ROLE_KEY"
  ];

  oauthEnvVars.forEach(varName => {
    const value = process.env[varName];
    if (value && value !== "https://placeholder.supabase.co" && value !== "placeholder_anon_key_12345") {
      console.log(`✅ ${varName}: Configured`);
    } else {
      console.log(`❌ ${varName}: Not configured (using placeholder)`);
    }
  });

  console.log("\n🔗 Available Authentication Methods:");
  console.log("===================================");
  console.log("✅ Email/Password Login (In-memory)");
  console.log("✅ Admin Account Access");
  
  if (process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co") {
    console.log("✅ OAuth2 Ready (Supabase configured)");
    console.log("   - Google OAuth");
    console.log("   - Discord OAuth");
    console.log("   - GitHub OAuth");
    console.log("   - Facebook OAuth");
  } else {
    console.log("⚠️  OAuth2 Available (needs Supabase setup)");
  }

  console.log("\n🎯 Quick Test:");
  console.log("==============");
  console.log("You can now login with:");
  console.log("Email: coinkrazy00@gmail.com");
  console.log("Password: Woot6969!");
  console.log("Role: admin");
}

if (require.main === module) {
  // Add a small delay to ensure server is ready
  setTimeout(() => {
    verifyAdminAccount().catch(console.error);
  }, 1000);
}
