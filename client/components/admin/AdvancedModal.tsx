import React, { useState, useEffect } from "react";
import { X, Download, Edit, Save, Copy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProgressRing } from "./Charts";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  size = "md",
  children,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
    full: "max-w-full mx-4",
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div
          className={`relative bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

interface UserDetailModalProps {
  user: any;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (user: any) => void;
}

export const UserDetailModal: React.FC<UserDetailModalProps> = ({
  user,
  isOpen,
  onClose,
  onSave,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setEditedUser(user);
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave?.(editedUser);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save user:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="User Details" size="lg">
      <div className="p-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </Label>
                  <div className="flex items-center space-x-2 mt-1">
                    {isEditing ? (
                      <Input
                        id="email"
                        value={editedUser?.email || ""}
                        onChange={(e) =>
                          setEditedUser((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        className="flex-1"
                      />
                    ) : (
                      <div className="flex-1 p-2 bg-gray-50 rounded text-gray-900">
                        {user?.email}
                      </div>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(user?.email || "")}
                      className="border-gray-300"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    User ID
                  </Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex-1 p-2 bg-gray-50 rounded text-gray-900 font-mono text-sm">
                      {user?.id}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(user?.id || "")}
                      className="border-gray-300"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Status
                  </Label>
                  <div className="mt-1">
                    <Badge
                      className={
                        user?.subscription?.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {user?.subscription?.status?.toUpperCase() || "UNKNOWN"}
                    </Badge>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Location
                  </Label>
                  <div className="mt-1">
                    {isEditing ? (
                      <Input
                        value={editedUser?.location || ""}
                        onChange={(e) =>
                          setEditedUser((prev) => ({
                            ...prev,
                            location: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      <div className="p-2 bg-gray-50 rounded text-gray-900">
                        {user?.location || "Not specified"}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Registration Date
                  </Label>
                  <div className="mt-1 p-2 bg-gray-50 rounded text-gray-900">
                    {user?.created_at
                      ? new Date(user.created_at).toLocaleDateString()
                      : "Unknown"}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Last Seen
                  </Label>
                  <div className="mt-1 p-2 bg-gray-50 rounded text-gray-900">
                    {user?.last_seen
                      ? new Date(user.last_seen).toLocaleDateString()
                      : "Never"}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Account Type
                  </Label>
                  <div className="mt-1">
                    <Badge className="bg-blue-100 text-blue-800">
                      {user?.subscription?.plan_type?.toUpperCase() || "FREE"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="subscription" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Current Plan
                </h3>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-semibold text-blue-900">
                      {user?.subscription?.plan_type?.toUpperCase() || "FREE"}
                    </span>
                    <Badge className="bg-blue-100 text-blue-800">
                      {user?.subscription?.status?.toUpperCase() || "INACTIVE"}
                    </Badge>
                  </div>
                  <p className="text-sm text-blue-700">
                    Since{" "}
                    {user?.subscription?.created_at
                      ? new Date(
                          user.subscription.created_at,
                        ).toLocaleDateString()
                      : "Unknown"}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Usage Limits
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Daily Scenarios
                    </span>
                    <span className="text-sm font-medium">
                      {user?.usage?.scenarios_used || 0} /{" "}
                      {user?.usage?.max_scenarios === -1
                        ? "∞"
                        : user?.usage?.max_scenarios || 5}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width:
                          user?.usage?.max_scenarios === -1
                            ? "100%"
                            : `${Math.min(100, ((user?.usage?.scenarios_used || 0) / (user?.usage?.max_scenarios || 5)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="usage" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <ProgressRing
                  progress={
                    user?.usage?.max_scenarios === -1
                      ? 100
                      : Math.min(
                          100,
                          ((user?.usage?.scenarios_used || 0) /
                            (user?.usage?.max_scenarios || 5)) *
                            100,
                        )
                  }
                  size={120}
                  color="#3B82F6"
                  label="Scenarios Used"
                />
              </div>

              <div className="col-span-2 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Usage Statistics
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">
                      {user?.usage?.scenarios_used || 0}
                    </div>
                    <div className="text-sm text-gray-600">Scenarios Today</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">
                      {user?.usage?.max_scenarios === -1
                        ? "∞"
                        : user?.usage?.max_scenarios || 5}
                    </div>
                    <div className="text-sm text-gray-600">Daily Limit</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6 mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Activity
              </h3>
              <div className="space-y-3">
                {[
                  {
                    action: "Completed scenario",
                    time: "2 hours ago",
                    type: "success",
                  },
                  {
                    action: "Started practice session",
                    time: "4 hours ago",
                    type: "info",
                  },
                  {
                    action: "Updated profile",
                    time: "1 day ago",
                    type: "info",
                  },
                  {
                    action: "Subscribed to Pro plan",
                    time: "3 days ago",
                    type: "success",
                  },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
                  >
                    <div
                      className={`w-3 h-3 rounded-full ${
                        activity.type === "success"
                          ? "bg-green-400"
                          : "bg-blue-400"
                      }`}
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        {activity.action}
                      </div>
                      <div className="text-xs text-gray-500">
                        {activity.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-6">
          <div className="flex items-center space-x-2">
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit User
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save Changes
                </Button>
                <Button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedUser(user);
                  }}
                  variant="outline"
                  className="border-gray-300"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" className="border-gray-300">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="border-gray-300"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

interface SystemLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  logType: "database" | "error" | "access" | "security";
}

export const SystemLogModal: React.FC<SystemLogModalProps> = ({
  isOpen,
  onClose,
  logType,
}) => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchLogs();
    }
  }, [isOpen, logType]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoRefresh && isOpen) {
      interval = setInterval(fetchLogs, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, isOpen]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const endpoints = {
        database: "/api/system/database/logs",
        error: "/api/system/logs/errors",
        access: "/api/system/logs/access",
        security: "/api/system/security/threats",
      };

      const response = await fetch(endpoints[logType]);
      const data = await response.json();
      setLogs(data.logs || data.threats || []);
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const getLogTitle = () => {
    switch (logType) {
      case "database":
        return "Database Logs";
      case "error":
        return "Error Logs";
      case "access":
        return "Access Logs";
      case "security":
        return "Security Threats";
      default:
        return "System Logs";
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getLogTitle()} size="xl">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              onClick={fetchLogs}
              disabled={loading}
              variant="outline"
              className="border-gray-300"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Refresh
            </Button>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Auto-refresh (5s)</span>
            </label>
          </div>

          <div className="text-sm text-gray-500">{logs.length} entries</div>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {logs.map((log, index) => (
            <div
              key={index}
              className="p-4 bg-gray-50 border border-gray-200 rounded-lg font-mono text-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-gray-500 text-xs mb-1">
                    [{new Date(log.timestamp).toLocaleString()}]
                  </div>
                  <div className="text-gray-900">
                    {log.message || log.description}
                  </div>
                  {log.data && (
                    <div className="text-gray-600 text-xs mt-1">
                      {JSON.stringify(log.data, null, 2)}
                    </div>
                  )}
                </div>
                {log.severity && (
                  <Badge
                    className={
                      log.severity === "critical"
                        ? "bg-red-100 text-red-800"
                        : log.severity === "error"
                          ? "bg-red-100 text-red-800"
                          : log.severity === "warning"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                    }
                  >
                    {log.severity.toUpperCase()}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};
