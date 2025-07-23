import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  // PayPal payment routes
  app.post("/api/paypal/create-order", createPayPalOrder);
  app.post("/api/paypal/capture-order", capturePayPalOrder);
  app.post("/api/paypal/cancel-subscription", cancelSubscription);
  app.get("/api/paypal/payment-history/:userId", getPaymentHistory);

  // Subscription enforcement routes
  app.get(
    "/api/subscriptions/validate-scenario-access",
    authenticatedValidateScenarioAccess,
  );
  app.post(
    "/api/subscriptions/record-scenario-usage",
    authenticatedRecordScenarioUsage,
  );
  app.get(
    "/api/subscriptions/details",
    authenticatedGetUserSubscriptionDetails,
  );
  app.get("/api/subscriptions/usage-stats", authenticatedGetUserUsageStats);

  // Admin routes
  app.get("/api/admin/dashboard-stats", getDashboardStats);
  app.get("/api/admin/users", getUsers);
  app.get("/api/admin/payments", getPayments);
  app.post("/api/admin/users/:userId/action", userAction);
  app.get("/api/admin/system-health", getSystemHealth);

  return app;
}
