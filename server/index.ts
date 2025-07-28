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

  // User routes
  app.post("/api/auth/register", handleRegister);
  app.post("/api/auth/login", handleLogin);
  app.get("/api/users/:userId/balance", handleGetBalance);
  app.post("/api/users/:userId/balance", handleUpdateBalance);
  app.get("/api/users/:userId/transactions", handleGetTransactions);
  app.get("/api/users", handleGetAllUsers);

  // Mini game routes
  app.get("/api/mini-games/:userId/:gameType/cooldown", handleCheckCooldown);
  app.post("/api/mini-games/play", handleMiniGamePlay);
  app.get("/api/mini-games/:userId/history", handleGetMiniGameHistory);
  app.get("/api/mini-games/history", handleGetAllMiniGameHistory);

  // Payment routes
  app.get("/api/payments/packages", handleGetPackages);
  app.post("/api/payments/create", handleCreatePayment);
  app.post("/api/payments/:paymentId/verify", handleVerifyPayment);
  app.get("/api/payments/:userId", handleGetPayments);
  app.get("/api/payments", handleGetAllPayments);
  app.post("/api/payments/paypal-webhook", handlePayPalWebhook);

  // Ticker routes
  app.get("/api/ticker", handleGetTickerItems);
  app.post("/api/ticker", handleAddTickerItem);
  app.delete("/api/ticker/:itemId", handleDeleteTickerItem);
  app.post("/api/ticker/mini-game", handleAddMiniGameWin);

  return app;
}
