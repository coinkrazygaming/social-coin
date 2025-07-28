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
  handleGetAllMiniGameHistory,
  handleGetUserSettings,
  handleUpdateUserSettings,
} from "./routes/users";
import {
  handleGetPackages,
  handleCreatePayment,
  handleVerifyPayment,
  handleGetPayments,
  handleGetAllPayments,
  handlePayPalWebhook,
} from "./routes/payments";
import {
  handleGetTickerItems,
  handleAddTickerItem,
  handleDeleteTickerItem,
  handleAddMiniGameWin,
} from "./routes/ticker";
import {
  handleGetLeaderboard,
  handleGetCategories,
  handleGetUserPosition,
  handleGetUserStats,
  handleUpdateScore,
  handleGetAchievements,
  handleGetLiveUpdates,
} from "./routes/leaderboards";
import {
  handleGetRooms,
  handleGetRoomGames,
  handleGetGame,
  handleJoinGame,
  handleGetPlayerCards,
  handleMarkNumber,
  handleGetPatterns,
  handleStartGame,
  handleGetLiveUpdates as handleBingoLiveUpdates,
} from "./routes/bingo";
import {
  handleGetEvents,
  handleGetEvent,
  handlePlaceBet,
  handleGetUserBets,
  handleGetSports,
  handleGetLiveOdds,
  handleCashOut,
  handleGetPopularBets,
} from "./routes/sportsbook";
import {
  handleGetPackages as handleGetStorePackages,
  handleGetPackage,
  handleCreatePackage,
  handleUpdatePackage,
  handleDeletePackage,
  handlePurchasePackage,
  handleGetUserPurchases,
  handleGetStoreSettings,
  handleUpdateStoreSettings,
  handleGetAdminLogs,
  handleCreateRefundRequest,
  handleGetRefundRequests,
  handleProcessRefund,
  handleGetPaymentStats,
} from "./routes/store";

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

  // Leaderboard routes
  app.get("/api/leaderboards", handleGetLeaderboard);
  app.get("/api/leaderboards/categories", handleGetCategories);
  app.get(
    "/api/leaderboards/users/:userId/position/:category",
    handleGetUserPosition,
  );
  app.get("/api/leaderboards/users/:userId/stats", handleGetUserStats);
  app.post("/api/leaderboards/update-score", handleUpdateScore);
  app.get("/api/leaderboards/achievements", handleGetAchievements);
  app.get("/api/leaderboards/live-updates", handleGetLiveUpdates);

  // Bingo routes
  app.get("/api/bingo/rooms", handleGetRooms);
  app.get("/api/bingo/rooms/:roomId/games", handleGetRoomGames);
  app.get("/api/bingo/games/:gameId", handleGetGame);
  app.post("/api/bingo/games/:gameId/join", handleJoinGame);
  app.get("/api/bingo/games/:gameId/cards/:userId", handleGetPlayerCards);
  app.post("/api/bingo/cards/:cardId/mark", handleMarkNumber);
  app.get("/api/bingo/patterns", handleGetPatterns);
  app.post("/api/bingo/games/:gameId/start", handleStartGame);
  app.get("/api/bingo/games/:gameId/live-updates", handleBingoLiveUpdates);

  // Sportsbook routes
  app.get("/api/sportsbook/events", handleGetEvents);
  app.get("/api/sportsbook/events/:eventId", handleGetEvent);
  app.post("/api/sportsbook/bets", handlePlaceBet);
  app.get("/api/sportsbook/users/:userId/bets", handleGetUserBets);
  app.get("/api/sportsbook/sports", handleGetSports);
  app.get("/api/sportsbook/events/:eventId/odds", handleGetLiveOdds);
  app.post("/api/sportsbook/bets/:betId/cash-out", handleCashOut);
  app.get("/api/sportsbook/popular-bets", handleGetPopularBets);

  // Store routes
  app.get("/api/store/packages", handleGetStorePackages);
  app.get("/api/store/packages/:packageId", handleGetPackage);
  app.post("/api/store/packages", handleCreatePackage);
  app.put("/api/store/packages/:packageId", handleUpdatePackage);
  app.delete("/api/store/packages/:packageId", handleDeletePackage);
  app.post("/api/store/purchase", handlePurchasePackage);
  app.get("/api/store/users/:userId/purchases", handleGetUserPurchases);
  app.get("/api/store/settings", handleGetStoreSettings);
  app.put("/api/store/settings", handleUpdateStoreSettings);
  app.get("/api/store/admin-logs", handleGetAdminLogs);
  app.post("/api/store/refund-requests", handleCreateRefundRequest);
  app.get("/api/store/refund-requests", handleGetRefundRequests);
  app.post("/api/store/refund-requests/:refundId/process", handleProcessRefund);
  app.get("/api/store/payment-stats", handleGetPaymentStats);

  return app;
}
