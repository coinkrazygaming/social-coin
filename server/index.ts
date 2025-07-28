import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  handleRegister,
  handleLogin,
  handleGetBalance,
  handleUpdateBalance,
  handleGetTransactions,
  handleGetAllUsers,
  handleCheckCooldown,
  handleMiniGamePlay,
  handleGetMiniGameHistory,
  handleGetAllMiniGameHistory
} from "./routes/users";
import {
  handleGetPackages,
  handleCreatePayment,
  handleVerifyPayment,
  handleGetPayments,
  handleGetAllPayments,
  handlePayPalWebhook
} from "./routes/payments";
import {
  handleGetTickerItems,
  handleAddTickerItem,
  handleDeleteTickerItem,
  handleAddMiniGameWin
} from "./routes/ticker";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  return app;
}
