import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  databaseHealthCheck,
  getDatabaseStats,
  upsertUser,
  getUser,
  deleteUser,
  testTables,
} from "./routes/database";
import {
  getDashboardStats,
  getUsers,
  getPayments,
  getSystemHealth,
  userAction,
} from "./routes/admin";
import {
  authenticatedValidateScenarioAccess,
  authenticatedRecordScenarioUsage,
} from "./routes/subscriptions";
import {
  createPayPalOrder,
  capturePayPalOrder,
} from "./routes/paypal";
import {
  getMaterial,
  listMaterials,
} from "./routes/materials";
import {
  getDatabaseLogs,
  backupDatabase,
  toggleMaintenanceMode,
  getPerformanceMetrics,
  getErrorLogs,
  restartServices,
  runSecurityScan,
  getAccessLogs,
  getThreatDetection,
  logAccess,
} from "./routes/system";
import {
  getQuestionBank,
  exportQuestions,
  importQuestions,
  getScenarios,
  addScenario,
  updateScenario,
  getContentStats,
} from "./routes/content";

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

  // Database routes
  app.get("/api/db/health", databaseHealthCheck);
  app.get("/api/db/stats", getDatabaseStats);
  app.get("/api/db/test-tables", testTables);
  app.post("/api/db/users", upsertUser);
  app.get("/api/db/users/:userId", getUser);
  app.delete("/api/db/users/:userId", deleteUser);

  // Admin routes
  app.get("/api/admin/dashboard-stats", getDashboardStats);
  app.get("/api/admin/users", getUsers);
  app.get("/api/admin/payments", getPayments);
  app.get("/api/admin/system-health", getSystemHealth);
  app.post("/api/admin/users/:userId/action", userAction);

  // Subscription routes
  app.get("/api/subscriptions/validate-scenario-access", authenticatedValidateScenarioAccess);
  app.post("/api/subscriptions/record-scenario-usage", authenticatedRecordScenarioUsage);

  // PayPal routes
  app.post("/api/paypal/create-order", createPayPalOrder);
  app.post("/api/paypal/capture-order", capturePayPalOrder);

  // Materials routes
  app.get("/api/materials", listMaterials);
  app.get("/api/materials/:materialId", getMaterial);

  // System management routes
  app.get("/api/system/database/logs", getDatabaseLogs);
  app.post("/api/system/database/backup", backupDatabase);
  app.post("/api/system/maintenance", toggleMaintenanceMode);
  app.get("/api/system/performance", getPerformanceMetrics);
  app.get("/api/system/logs/errors", getErrorLogs);
  app.post("/api/system/services/restart", restartServices);
  app.post("/api/system/security/scan", runSecurityScan);
  app.get("/api/system/logs/access", getAccessLogs);
  app.get("/api/system/security/threats", getThreatDetection);

  // Content management routes
  app.get("/api/content/questions", getQuestionBank);
  app.get("/api/content/questions/export", exportQuestions);
  app.post("/api/content/questions/import", importQuestions);
  app.get("/api/content/scenarios", getScenarios);
  app.post("/api/content/scenarios", addScenario);
  app.put("/api/content/scenarios/:scenarioId", updateScenario);
  app.get("/api/content/stats", getContentStats);

  return app;
}
