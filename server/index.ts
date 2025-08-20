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
  checkAdminStatus,
  getUserDetails,
  updateUser,
  banUser,
  unbanUser,
  refundPayment,
  getSystemSettings,
  updateSystemSetting,
  getMaintenanceMode,
  toggleMaintenanceMode,
  getSystemNotifications,
  createSystemNotification,
  updateSystemNotification,
  deleteSystemNotification,
  getAnalytics,
  getErrorLogs,
  resolveErrorLog,
  getAuditLog,
  getUserBans,
  exportData,
  clearCache,
  getCacheStats,
  getRealTimeMetrics,
} from "./routes/admin";
import {
  authenticatedValidateScenarioAccess,
  authenticatedRecordScenarioUsage,
} from "./routes/subscriptions";
import { createPayPalOrder, capturePayPalOrder } from "./routes/paypal";
import { getMaterial, listMaterials } from "./routes/materials";
import {
  getDatabaseLogs,
  backupDatabase,
  toggleMaintenanceMode as toggleSystemMaintenanceMode,
  getPerformanceMetrics,
  getErrorLogs as getSystemErrorLogs,
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
  createScenario,
  updateScenario,
  getContentStats,
} from "./routes/content";
import {
  getEnhancedDashboardStats,
  getEnhancedUsers,
  getEnhancedPayments,
  getRealTimeMetrics as getEnterpriseRealTimeMetrics,
  updateEnhancedUser,
  bulkUserOperation,
  clearCache as clearEnterpriseCache,
  getCacheStats as getEnterpriseCacheStats,
  getMaintenanceMode as getEnterpriseMaintenanceMode,
  toggleMaintenanceMode as toggleEnterpriseMaintenanceMode,
  triggerBackup,
  getLastBackup,
  runSecurityScan as runEnterpriseSecurityScan,
  getLastSecurityScan,
  saveConfiguration,
  getConfiguration,
} from "./routes/enterprise";

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

  // Admin routes - Core functionality
  app.get("/api/admin/check-status", checkAdminStatus);
  app.get("/api/admin/dashboard-stats", getDashboardStats);
  app.get("/api/admin/users", getUsers);
  app.get("/api/admin/users/:userId", getUserDetails);
  app.put("/api/admin/users/:userId", updateUser);
  app.post("/api/admin/users/:userId/ban", banUser);
  app.post("/api/admin/users/:userId/unban", unbanUser);
  app.get("/api/admin/payments", getPayments);
  app.post("/api/admin/payments/:paymentId/refund", refundPayment);
  app.get("/api/admin/system-health", getSystemHealth);

  // Admin routes - System management
  app.get("/api/admin/settings", getSystemSettings);
  app.put("/api/admin/settings/:key", updateSystemSetting);
  app.get("/api/admin/maintenance-mode", getMaintenanceMode);
  app.post("/api/admin/maintenance-mode", toggleMaintenanceMode);

  // Admin routes - Notifications
  app.get("/api/admin/notifications", getSystemNotifications);
  app.post("/api/admin/notifications", createSystemNotification);
  app.put("/api/admin/notifications/:id", updateSystemNotification);
  app.delete("/api/admin/notifications/:id", deleteSystemNotification);

  // Admin routes - Analytics and monitoring
  app.get("/api/admin/analytics", getAnalytics);
  app.get("/api/admin/error-logs", getErrorLogs);
  app.post("/api/admin/error-logs/:id/resolve", resolveErrorLog);
  app.get("/api/admin/audit-log", getAuditLog);
  app.get("/api/admin/user-bans", getUserBans);

  // Admin routes - Data export and cache
  app.get("/api/admin/export/:type", exportData);
  app.post("/api/admin/cache/clear", clearCache);
  app.get("/api/admin/cache/stats", getCacheStats);
  app.get("/api/admin/realtime-metrics", getRealTimeMetrics);

  // Legacy admin routes (for backward compatibility)
  // app.post("/api/admin/users/:userId/action", userAction); // Removed - use ban/unban instead

  // Subscription routes
  app.get(
    "/api/subscriptions/validate-scenario-access",
    authenticatedValidateScenarioAccess,
  );
  app.post(
    "/api/subscriptions/record-scenario-usage",
    authenticatedRecordScenarioUsage,
  );

  // PayPal routes
  app.post("/api/paypal/create-order", createPayPalOrder);
  app.post("/api/paypal/capture-order", capturePayPalOrder);

  // Materials routes
  app.get("/api/materials", listMaterials);
  app.get("/api/materials/:materialId", getMaterial);

  // System management routes
  app.get("/api/system/database/logs", getDatabaseLogs);
  app.post("/api/system/database/backup", backupDatabase);
  app.post("/api/system/maintenance", toggleSystemMaintenanceMode);
  app.get("/api/system/performance", getPerformanceMetrics);
  app.get("/api/system/logs/errors", getSystemErrorLogs);
  app.post("/api/system/services/restart", restartServices);
  app.post("/api/system/security/scan", runSecurityScan);
  app.get("/api/system/logs/access", getAccessLogs);
  app.get("/api/system/security/threats", getThreatDetection);

  // Content management routes
  app.get("/api/content/questions", getQuestionBank);
  app.get("/api/content/questions/export", exportQuestions);
  app.post("/api/content/questions/import", importQuestions);
  app.get("/api/content/scenarios", getScenarios);
  app.post("/api/content/scenarios", createScenario);
  app.put("/api/content/scenarios/:scenarioId", updateScenario);
  app.get("/api/content/stats", getContentStats);

  // Additional routes for client compatibility
  app.get("/api/progress", (_req, res) => {
    res.json({ progress: [] });
  });

  app.get("/api/achievements", (_req, res) => {
    res.json({ achievements: [] });
  });

  app.get("/api/scenarios", (_req, res) => {
    res.json({ scenarios: [] });
  });

  app.post("/api/push/subscribe", (_req, res) => {
    res.json({ success: true });
  });

  // Enterprise admin routes
  app.get("/api/enterprise/dashboard-stats", getEnhancedDashboardStats);
  app.get("/api/enterprise/users", getEnhancedUsers);
  app.get("/api/enterprise/payments", getEnhancedPayments);
  app.get("/api/enterprise/realtime-metrics", getEnterpriseRealTimeMetrics);
  app.put("/api/enterprise/users/:userId", updateEnhancedUser);
  app.post("/api/enterprise/users/bulk", bulkUserOperation);
  app.post("/api/enterprise/cache/clear", clearEnterpriseCache);
  app.get("/api/enterprise/cache/stats", getEnterpriseCacheStats);

  // Enterprise system configuration routes
  app.get("/api/enterprise/maintenance-mode", getEnterpriseMaintenanceMode);
  app.post("/api/enterprise/maintenance-mode", toggleEnterpriseMaintenanceMode);
  app.post("/api/enterprise/backup", triggerBackup);
  app.get("/api/enterprise/last-backup", getLastBackup);
  app.post("/api/enterprise/security-scan", runEnterpriseSecurityScan);
  app.get("/api/enterprise/last-security-scan", getLastSecurityScan);
  app.post("/api/enterprise/configuration", saveConfiguration);
  app.get("/api/enterprise/configuration", getConfiguration);

  return app;
}
