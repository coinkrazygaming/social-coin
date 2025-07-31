#!/usr/bin/env ts-node

import "dotenv/config";
import { createAdminAccount, setupOAuth2Environment, verifyDatabaseConnection } from "../utils/adminSetup";

async function main() {
  console.log("🔧 CoinKrazy Admin Setup Tool");
  console.log("================================\n");

  // Check OAuth2 environment
  const envSetup = await setupOAuth2Environment();
  if (!envSetup) {
    console.log("\n❌ OAuth2 environment setup incomplete");
    process.exit(1);
  }

  // Verify database connection
  const dbConnection = await verifyDatabaseConnection();
  if (!dbConnection) {
    console.log("\n❌ Database connection failed");
    process.exit(1);
  }

  // Create admin account
  const adminEmail = "coinkrazy00@gmail.com";
  const adminPassword = "Woot6969!";
  
  console.log(`\nCreating admin account: ${adminEmail}`);
  const adminCreated = await createAdminAccount(adminEmail, adminPassword);
  
  if (adminCreated) {
    console.log("\n✅ Admin setup completed successfully!");
    console.log("\nAdmin Account Details:");
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log(`Role: admin`);
    console.log("\nYou can now login with these credentials.");
  } else {
    console.log("\n❌ Admin setup failed");
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error("Setup failed:", error);
    process.exit(1);
  });
}
