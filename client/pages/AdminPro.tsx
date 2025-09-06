'use client';
import React from 'react';
import {  useState, useEffect, useMemo, useCallback  } from "react";
import {  Button  } from '@/components/ui/button';
import {  Card, CardContent, CardHeader, CardTitle  } from '@/components/ui/card';
import {  Tabs, TabsContent, TabsList, TabsTrigger  } from '@/components/ui/tabs';
import {  useToast  } from '@/hooks/use-toast';
import {  ArrowLeft, Users, CreditCard, TrendingUp, Activity, DollarSign, Calendar, Settings, RefreshCw, Bell, BookOpen, Monitor, Database, Shield, Plus, AlertTriangle, Download, Upload, Eye, Edit, Trash2, Search, Mail, FileText, CheckCircle  } from 'lucide-react';
import {  Link  } from 'react-router-dom';
import {  useAuth  } from '@/contexts/AuthContext';
import {  formatPrice  } from '@/services/subscriptionService';
import {  adminService  } from '@/services/adminService';

// Import our enterprise components
import {  MetricChart, RealTimeMetric, ActivityFeed, ProgressRing  } from '@/components/admin/Charts';
import {  DataTable, DataTableColumn, StatusBadge  } from '@/components/admin/DataTable';
import {  UserDetailModal, SystemLogModal  } from '@/components/admin/AdvancedModal';
import {  FileUpload, CSVUpload  } from '@/components/admin/FileUpload';
import {  SystemHealthMonitor  } from '@/components/admin/SystemHealthMonitor';
import {  ContentManager  } from '@/components/admin/ContentManager';
import {  AdminErrorBoundary  } from '@/components/admin/ErrorBoundary';
import {  Badge  } from '@/components/ui/badge';
import {  Select, SelectContent, SelectItem, SelectTrigger, SelectValue  } from '@/components/ui/select';

// Enhanced interfaces for enterprise data
interface EnhancedDashboardStats {
  totalUsers: number;
  activeSubscriptions: number;
  totalRevenue: number;
  todaySignups: number;
  conversionRate: number;
  churnRate: number;
  avgSessionTime: number;
  topLocations: Array<{city: string;count: number;}>;
  monthlyGrowth: number;
  // Real-time metrics
  realtimeUsers: number;
  serverLoad: number;
  responseTime: number;
  errorRate: number;
}

interface EnhancedUser {
  id: string;
  email: string;
  created_at: string;
  subscription: {
    plan_type: string;
    status: string;
    created_at: string;
  };
  usage: {
    scenarios_used: number;
    max_scenarios: number;
  };
  location: string;
  last_seen: string;
  totalSpent: number;
  sessionsToday: number;
  riskScore: number;
}

interface EnhancedPayment {
  id: string;
  user_id: string;
  user_email: string;
  amount_cents: number;
  status: string;
  payment_method: string;
  created_at: string;
  fee_cents: number;
  refunded: boolean;
  country: string;
}

// Safe fetch wrapper to handle network errors gracefully
const safeFetch = async (url: string, options?: RequestInit) => {
  try {
    const response = await fetch(url, options);
    return response;
  } catch (error) {
    console.warn(`Network error for ${url}:`, error);
    // Do not return mock responses; surface the error
    throw error;
  }
};

export default function AdminPro() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState<EnhancedDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<EnhancedUser[]>([]);
  const [payments, setPayments] = useState<EnhancedPayment[]>([]);
  const [selectedUser, setSelectedUser] = useState<EnhancedUser | null>(null);
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [logType, setLogType] = useState<
    "database" | "error" | "access" | "security">(
    "database");
  const [realTimeData, setRealTimeData] = useState<unknown[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [contentStats, setContentStats] = useState<any>(null);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [lastBackupTime, setLastBackupTime] = useState<string | null>(null);
  const [lastSecurityScan, setLastSecurityScan] = useState<string | null>(null);

  // New state for comprehensive data
  const [questionsData, setQuestionsData] = useState<unknown[]>([]);
  const [scenariosData, setScenariosData] = useState<unknown[]>([]);
  const [userProgressData, setUserProgressData] = useState<unknown[]>([]);
  const [userScenariosData, setUserScenariosData] = useState<unknown[]>([]);
  const [comprehensiveAnalytics, setComprehensiveAnalytics] = useState<any>(null);
  const [analyticsPeriod, setAnalyticsPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  // State for total counts from stats
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [totalScenarios, setTotalScenarios] = useState<number>(0);
  const [totalTestAttempts, setTotalTestAttempts] = useState<number>(0);
  const [totalScenarioAttempts, setTotalScenarioAttempts] = useState<number>(0);

  // Check if user has admin privileges
  const isAdmin =
  user?.email === "admin@superk53.com" ||
  process.env.NODE_ENV === "development";

  // Enhanced data loading with real-time updates
  useEffect(() => {
    if (!isAdmin) return;
    loadAllData();

    let interval: NodeJS.Timeout | null = null;
    if (autoRefresh) {
      interval = setInterval(loadRealTimeData, 5000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isAdmin, autoRefresh]);

  const loadAllData = async () => {
    setLoading(true);
    await Promise.all([
    loadDashboardData(),
    loadUsers(),
    loadPayments(),
    loadRealTimeData(),
    loadActivityFeed(),
    loadContentStats(),
    loadSystemStatus(),
    loadComprehensiveData(),
    loadComprehensiveAnalytics()]
    );
    setLoading(false);
  };

  const loadActivityFeed = async () => {
    try {
      // Load real activity from multiple sources with error handling
      const [usersRes, paymentsRes] = await Promise.allSettled([
      safeFetch("/api/enterprise/users?limit=5"),
      safeFetch("/api/enterprise/payments?limit=5")]
      );

      const recentUsers =
      usersRes.status === "fulfilled" && usersRes.value.ok ?
      await usersRes.value.json().catch(() => []) :
      [];
      const recentPayments =
      paymentsRes.status === "fulfilled" && paymentsRes.value.ok ?
      await paymentsRes.value.json().catch(() => []) :
      [];

      const activities = [];

      // Add recent user registrations
      recentUsers.slice(0, 3).forEach((user: unknown) => {
        activities.push({
          id: `user_${user.id}`,
          type: "user",
          title: "New user registration",
          description: `${user.email} joined with ${user.subscription?.plan_type || "free"} plan`,
          timestamp: user.created_at,
          severity: "success"
        });
      });

      // Add recent payments
      recentPayments.slice(0, 3).forEach((payment: unknown) => {
        activities.push({
          id: `payment_${payment.id}`,
          type: "payment",
          title: "Payment processed",
          description: `${formatPrice(payment.amount_cents)} payment ${payment.status}`,
          timestamp: payment.created_at,
          severity: payment.status === "completed" ? "success" : "warning"
        });
      });

      // Sort by timestamp and take latest
      activities.sort(
        (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setActivityItems(activities.slice(0, 6));
    } catch (error) {
      console.error("Error loading activity feed:", error);
      setActivityItems([]);
    }
  };

  const loadContentStats = async () => {
    try {
      const [questionsRes, scenariosRes] = await Promise.allSettled([
      safeFetch("/api/content/questions"),
      safeFetch("/api/content/scenarios")]
      );

      const questionsData =
      questionsRes.status === "fulfilled" && questionsRes.value.ok ?
      await questionsRes.value.
      json().
      catch(() => ({ stats: { total: 0 } })) :
      { stats: { total: 0 } };
      const scenariosData =
      scenariosRes.status === "fulfilled" && scenariosRes.value.ok ?
      await scenariosRes.value.
      json().
      catch(() => ({ stats: { total: 0 } })) :
      { stats: { total: 0 } };

      const stats = {
        questions: questionsData.stats?.total || 0,
        scenarios: scenariosData.stats?.total || 0,
        studyMaterials: 0, // Would come from materials API
        videos: 0 // Would come from videos API
      };

      setContentStats(stats);
    } catch (error) {
      console.error("Error loading content stats:", error);
      setContentStats({
        questions: 0,
        scenarios: 0,
        studyMaterials: 0,
        videos: 0
      });
    }
  };

  const loadDashboardData = async () => {
    try {
      const response = await safeFetch("/api/enterprise/dashboard-stats");
      if (response.ok) {
        const data = await response.json().catch(() => null);
        if (data) {
          setStats(data);
        }
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      // Set default empty stats to prevent UI errors
      setStats({
        totalUsers: 0,
        activeSubscriptions: 0,
        totalRevenue: 0,
        todaySignups: 0,
        conversionRate: 0,
        churnRate: 0,
        avgSessionTime: 0,
        topLocations: [],
        monthlyGrowth: 0,
        realtimeUsers: 0,
        serverLoad: 0,
        responseTime: 0,
        errorRate: 0
      });
    }
  };

  const loadUsers = async () => {
    try {
      const response = await safeFetch("/api/enterprise/users?limit=100");
      if (response.ok) {
        const data = await response.json().catch(() => []);
        setUsers(data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Error loading users:", error);
      setUsers([]);
    }
  };

  const loadPayments = async () => {
    try {
      const response = await safeFetch("/api/enterprise/payments?limit=100");
      if (response.ok) {
        const data = await response.json().catch(() => []);
        setPayments(data);
      } else {
        setPayments([]);
      }
    } catch (error) {
      console.error("Error loading payments:", error);
      setPayments([]);
    }
  };

  const loadRealTimeData = async () => {
    try {
      const response = await safeFetch("/api/enterprise/realtime-metrics");
      if (response.ok) {
        const data = await response.json().catch(() => ({ metrics: [] }));
        setRealTimeData(data.metrics || []);
      } else {
        setRealTimeData([]);
      }
    } catch (error) {
      console.error("Error loading real-time data:", error);
      setRealTimeData([]);
    }
  };

  const loadSystemStatus = async () => {
    try {
      const [maintenanceRes, backupRes, securityRes] = await Promise.allSettled([
      safeFetch("/api/enterprise/maintenance-mode"),
      safeFetch("/api/enterprise/last-backup"),
      safeFetch("/api/enterprise/last-security-scan")]
      );

      if (maintenanceRes.status === "fulfilled" && maintenanceRes.value.ok) {
        const maintenanceData = await maintenanceRes.value.json();
        setMaintenanceMode(maintenanceData.enabled);
      }

      if (backupRes.status === "fulfilled" && backupRes.value.ok) {
        const backupData = await backupRes.value.json();
        setLastBackupTime(new Date(backupData.timestamp).toLocaleDateString());
      }

      if (securityRes.status === "fulfilled" && securityRes.value.ok) {
        const securityData = await securityRes.value.json();
        setLastSecurityScan(new Date(securityData.timestamp).toLocaleDateString());
      }
    } catch (error) {
      console.error("Error loading system status:", error);
      setMaintenanceMode(false);
      setLastBackupTime(null);
      setLastSecurityScan(null);
    }
  };

  const loadComprehensiveData = async () => {
    try {
      const [questionsRes, scenariosRes, progressRes, userScenariosRes] = await Promise.allSettled([
      adminService.getContentData('questions', { limit: 50 }),
      adminService.getContentData('scenarios', { limit: 50 }),
      adminService.getContentData('user_progress', { limit: 50 }),
      adminService.getContentData('user_scenarios', { limit: 50 })]
      );

      if (questionsRes.status === "fulfilled") {
        setQuestionsData(questionsRes.value.data);
        setTotalQuestions(questionsRes.value.stats?.total || 0);
      }
      if (scenariosRes.status === "fulfilled") {
        setScenariosData(scenariosRes.value.data);
        setTotalScenarios(scenariosRes.value.stats?.total || 0);
      }
      if (progressRes.status === "fulfilled") {
        setUserProgressData(progressRes.value.data);
        setTotalTestAttempts(progressRes.value.stats?.total || 0);
      }
      if (userScenariosRes.status === "fulfilled") {
        setUserScenariosData(userScenariosRes.value.data);
        setTotalScenarioAttempts(userScenariosRes.value.stats?.total || 0);
      }
    } catch (error) {
      console.error("Error loading comprehensive data:", error);
    }
  };

  const loadComprehensiveAnalytics = async () => {
    try {
      const analytics = await adminService.getComprehensiveAnalytics(analyticsPeriod);
      setComprehensiveAnalytics(analytics);
    } catch (error) {
      console.error("Error loading comprehensive analytics:", error);
    }
  };

  // Real system functions
  const clearSystemCache = async () => {
    try {
      const response = await fetch("/api/admin/cache/clear", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "System cache cleared successfully!"
        });
        loadAllData(); // Refresh all data
      } else {
        toast({
          title: "Error",
          description: "Failed to clear cache. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error clearing cache:", error);
      toast({
        title: "Error",
        description: "Error clearing cache. Please try again.",
        variant: "destructive"
      });
    }
  };

  const triggerBackup = async () => {
    try {
      const response = await fetch("/api/admin/backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Database backup initiated successfully!"
        });
        loadSystemStatus(); // Refresh backup status
      } else {
        toast({
          title: "Error",
          description: "Failed to trigger backup. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error triggering backup:", error);
      toast({
        title: "Error",
        description: "Error triggering backup. Please try again.",
        variant: "destructive"
      });
    }
  };

  const runSecurityScan = async () => {
    try {
      const response = await fetch("/api/admin/security-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Security scan initiated successfully!"
        });
        loadSystemStatus(); // Refresh security scan status
      } else {
        toast({
          title: "Error",
          description: "Failed to run security scan. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error running security scan:", error);
      toast({
        title: "Error",
        description: "Error running security scan. Please try again.",
        variant: "destructive"
      });
    }
  };

  const toggleMaintenanceMode = async () => {
    try {
      const response = await fetch("/api/admin/maintenance-mode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !maintenanceMode })
      });

      if (response.ok) {
        const data = await response.json();
        setMaintenanceMode(data.enabled);
        toast({
          title: "Success",
          description: `Maintenance mode ${data.enabled ? 'enabled' : 'disabled'} successfully!`
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to toggle maintenance mode. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error toggling maintenance mode:", error);
      toast({
        title: "Error",
        description: "Error toggling maintenance mode. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Real user management functions
  const handleUserUpdate = async (userData: unknown) => {
    try {
      const response = await fetch(`/api/admin/users/${userData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "User updated successfully!"
        });
        loadUsers(); // Refresh user list
      } else {
        toast({
          title: "Error",
          description: "Failed to update user. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Error",
        description: "Error updating user. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleBulkOperation = async (operation: string, userIds: string[]) => {
    try {
      const response = await fetch("/api/admin/users/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operation, userIds })
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Bulk operation '${operation}' completed successfully!`
        });
        loadUsers(); // Refresh user list
      } else {
        toast({
          title: "Error",
          description: `Failed to perform bulk operation '${operation}'. Please try again.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error performing bulk operation:", error);
      toast({
        title: "Error",
        description: "Error performing bulk operation. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Real content management functions
  const addNewContent = async (type: string, contentData: unknown) => {
    try {
      const response = await fetch(`/api/content/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contentData)
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `${type.slice(0, -1)} added successfully!`
        });
        loadContentStats(); // Refresh content stats
      } else {
        toast({
          title: "Error",
          description: `Failed to add ${type.slice(0, -1)}. Please try again.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error(`Error adding ${type}:`, error);
      toast({
        title: "Error",
        description: `Error adding ${type.slice(0, -1)}. Please try again.`,
        variant: "destructive"
      });
    }
  };

  const importContent = async (type: string, file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await fetch(`/api/content/${type}/import`, {
        method: "POST",
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Success",
          description: `Successfully imported ${result.count} ${type}!`
        });
        loadContentStats(); // Refresh content stats
      } else {
        toast({
          title: "Error",
          description: `Failed to import ${type}. Please check your file format.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error(`Error importing ${type}:`, error);
      toast({
        title: "Error",
        description: `Error importing ${type}. Please try again.`,
        variant: "destructive"
      });
    }
  };

  // Real payment management functions
  const refundPayment = async (paymentId: string) => {
    try {
      const response = await fetch(`/api/admin/payments/${paymentId}/refund`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Payment refunded successfully!"
        });
        loadPayments(); // Refresh payment list
      } else {
        toast({
          title: "Error",
          description: "Failed to refund payment. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error refunding payment:", error);
      toast({
        title: "Error",
        description: "Error refunding payment. Please try again.",
        variant: "destructive"
      });
    }
  };



  // Enhanced user table columns
  const userColumns: DataTableColumn<EnhancedUser>[] = [
  {
    key: "email",
    title: "User",
    sortable: true,
    render: (email, user) =>
    <div>
          <div className="font-medium text-white">{email}</div>
          <div className="text-sm text-gray-500">
            Joined {new Date(user.created_at).toLocaleDateString()}
          </div>
        </div>

  },
  {
    key: "subscription.plan_type",
    title: "Plan",
    sortable: true,
    filterable: true,
    render: (_, user) =>
    <StatusBadge
      status={user.subscription?.plan_type || "free"}
      variant={
      user.subscription?.plan_type === "pro" ?
      "success" :
      user.subscription?.plan_type === "basic" ?
      "info" :
      "warning"
      } />


  },
  {
    key: "totalSpent",
    title: "Total Spent",
    sortable: true,
    render: (value) => formatPrice(value)
  },
  {
    key: "sessionsToday",
    title: "Sessions Today",
    sortable: true,
    align: "center" as const
  },
  {
    key: "riskScore",
    title: "Risk Score",
    sortable: true,
    render: (score) =>
    <div className="flex items-center space-x-2">
          <div
        className={`w-3 h-3 rounded-full ${
        score < 30 ?
        "bg-green-400" :
        score < 70 ?
        "bg-orange-400" :
        "bg-red-400"}`
        } />

          <span>{score}</span>
        </div>

  },
  {
    key: "location",
    title: "Location",
    sortable: true,
    filterable: true
  }];


  // Enhanced payment table columns
  const paymentColumns: DataTableColumn<EnhancedPayment>[] = [
  {
    key: "id",
    title: "Payment ID",
    render: (id) =>
    <span className="font-mono text-sm">{id.substring(0, 8)}...</span>

  },
  {
    key: "user_email",
    title: "Customer",
    sortable: true
  },
  {
    key: "amount_cents",
    title: "Amount",
    sortable: true,
    render: (amount) => formatPrice(amount)
  },
  {
    key: "fee_cents",
    title: "Fee",
    sortable: true,
    render: (fee) => formatPrice(fee)
  },
  {
    key: "status",
    title: "Status",
    sortable: true,
    filterable: true,
    render: (status) => <StatusBadge status={status} />
  },
  {
    key: "country",
    title: "Country",
    sortable: true,
    filterable: true
  },
  {
    key: "created_at",
    title: "Date",
    sortable: true,
    render: (date) => new Date(date).toLocaleDateString()
  }];


  // Real activity feed data from actual events
  const [activityItems, setActivityItems] = useState<unknown[]>([]);

  // Real CSV upload handler
  const handleCSVUpload = async (data: unknown[]) => {
    try {
      const response = await safeFetch("/api/content/questions/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csvData: data })
      });

      if (response.ok) {
        const result = await response.
        json().
        catch(() => ({ imported: 0, errors: 0 }));
        toast({
          title: "Success",
          description: `Successfully imported ${result.imported} records! ${result.errors} errors.`
        });
      } else {
        throw new Error(
          `Import failed: ${response.statusText || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("CSV upload error:", error);
      toast({
        title: "Error",
        description: `Import failed: ${error}`,
        variant: "destructive"
      });
    }
  };



  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [bulkAction, setBulkAction] = useState<string>("");
  const [showBulkActions, setShowBulkActions] = useState(false);

  const handleBulkAction = async () => {
    if (!bulkAction || selectedRows.size === 0) return;

    const selectedUsers = Array.from(selectedRows).map((index) => users[index]).filter(Boolean);
    if (selectedUsers.length === 0) {
      showError("No valid users selected", "Error");
      return;
    }

    const userIds = selectedUsers.map((user) => user.id).filter(Boolean);

    try {
      switch (bulkAction) {
        case "ban":
          await handleBulkOperation("ban", userIds);
          showSuccess(`Banned ${selectedUsers.length} users`);
          break;
        case "unban":
          await handleBulkOperation("unban", userIds);
          showSuccess(`Unbanned ${selectedUsers.length} users`);
          break;
        case "delete":
          if (confirm(`Are you sure you want to delete ${selectedUsers.length} users? This action cannot be undone.`)) {
            await handleBulkOperation("delete", userIds);
            showSuccess(`Deleted ${selectedUsers.length} users`);
          }
          break;
        case "export":
          const userData = selectedUsers.map((user) => ({
            id: user.id || '',
            email: user.email || '',
            created_at: user.created_at || '',
            subscription: user.subscription?.plan_type || "free",
            status: user.subscription?.status || "inactive"
          }));
          const csv = [
          "ID,Email,Created At,Subscription,Status",
          ...userData.map((user) =>
          `${user.id},${user.email},${user.created_at},${user.subscription},${user.status}`
          )].
          join('\n');
          downloadFile(csv, `users_export_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
          showSuccess(`Exported ${selectedUsers.length} users`);
          break;
        default:
          showError("Invalid bulk action selected", "Error");
          return;
      }

      setSelectedRows(new Set());
      setBulkAction("");
      loadUsers();
    } catch (error) {
      console.error("Bulk operation failed:", error);
      showError("Bulk operation failed. Please try again.", "Error");
    }
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const showSuccess = (message: string, title: string = "Success") => {
    // You can integrate with your toast system here
    console.log(`${title}: ${message}`);
  };

  const showError = (message: string, title: string = "Error") => {
    // You can integrate with your toast system here
    console.error(`${title}: ${message}`);
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Card className="border-2 border-black bg-slate-800 max-w-md">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold text-white mb-4">
              Access Denied
            </h1>
            <p className="text-slate-300 mb-6">
              You don't have permission to access this page.
            </p>
            <Button
              asChild
              className="bg-slate-800 text-white hover:bg-slate-700">

              <Link to="/">Return Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>);

  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-black sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Button
                asChild
                variant="ghost"
                className="text-slate-300 hover:text-white font-medium uppercase tracking-wide">

                <Link to="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Portal
                </Link>
              </Button>
              
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-slate-700 border border-black flex items-center justify-center">
                  <div className="text-white font-bold text-sm tracking-wider">
                    K53
                  </div>
                </div>
                <div className="border-l border-black pl-4">
                  <h1 className="text-xl font-bold text-white tracking-tight">
                    SUPERK53
                  </h1>
                  <p className="text-sm text-slate-400 font-medium uppercase tracking-wide">
                    Administrative Control Center
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-slate-500 text-xs">
                  Auto-refresh: {autoRefresh ? "ON" : "OFF"}
                </p>
              </div>
              <Button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className="bg-slate-800 text-white hover:bg-slate-700">

                <RefreshCw
                  className={`h-4 w-4 mr-2 ${autoRefresh ? "animate-spin" : ""}`} />

                Auto-refresh
              </Button>
              <Button
                onClick={loadAllData}
                className="bg-slate-800 text-white hover:bg-slate-700">

                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          {/* Tab Navigation */}
          <TabsList className="bg-slate-800 border border-black">
            <TabsTrigger value="overview" className="text-white data-[state=active]:bg-slate-800 data-[state=active]:text-white">
              <TrendingUp className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="text-white data-[state=active]:bg-slate-800 data-[state=active]:text-white">
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="payments" className="text-white data-[state=active]:bg-slate-800 data-[state=active]:text-white">
              <CreditCard className="h-4 w-4 mr-2" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="content" className="text-white data-[state=active]:bg-slate-800 data-[state=active]:text-white">
              <BookOpen className="h-4 w-4 mr-2" />
              Content
            </TabsTrigger>
            <TabsTrigger value="system" className="text-white data-[state=active]:bg-slate-800 data-[state=active]:text-white">
              <Monitor className="h-4 w-4 mr-2" />
              System
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-white data-[state=active]:bg-slate-800 data-[state=active]:text-white">
              <TrendingUp className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-white data-[state=active]:bg-slate-800 data-[state=active]:text-white">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            {/* Real-time Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <RealTimeMetric
                title="Total Users"
                value={stats?.totalUsers || 0}
                change={stats?.monthlyGrowth || 0}
                trend="up"
                subtitle={`+${stats?.todaySignups || 0} today`} />

              <RealTimeMetric
                title="Revenue"
                value={stats?.totalRevenue || 0}
                change={15.2}
                trend="up"
                format="currency"
                subtitle="This month" />

              <RealTimeMetric
                title="Active Now"
                value={stats?.realtimeUsers || 0}
                change={8.5}
                trend="up"
                subtitle="Real-time users" />

              <RealTimeMetric
                title="Response Time"
                value={stats?.responseTime || 0}
                change={-12.3}
                trend="down"
                format="time"
                subtitle="Average latency" />

            </div>

            {/* Interactive Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MetricChart
                data={realTimeData}
                title="Real-time User Activity"
                type="area"
                height={300}
                color="#3B82F6"
                dataKey="users" />

              <MetricChart
                data={realTimeData}
                title="Revenue Trend"
                type="line"
                height={300}
                color="#10B981"
                dataKey="revenue" />

            </div>

            {/* Performance Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ActivityFeed
                  items={activityItems}
                  title="Live Activity Feed" />

              </div>
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    System Health
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">CPU Usage</span>
                      <ProgressRing
                        progress={stats?.serverLoad || 0}
                        size={60}
                        color={
                        stats?.serverLoad && stats.serverLoad > 80 ?
                        "#EF4444" :
                        "#10B981"
                        } />

                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Error Rate</span>
                      <span
                        className={`text-lg font-bold ${
                        (stats?.errorRate || 0) > 3 ?
                        "text-red-600" :
                        "text-green-600"}`
                        }>

                        {(stats?.errorRate || 0).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Enhanced Users Tab with DataTable */}
          <TabsContent value="users" className="space-y-6">
            {/* Bulk Operations */}
            {selectedRows.size > 0 &&
            <div className="bg-slate-700 border-2 border-black rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-white font-medium">
                      {selectedRows.size} user(s) selected
                    </span>
                    <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedRows(new Set())}
                    className="border-black bg-slate-600 text-white hover:bg-slate-500">

                      Clear Selection
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Select
                    value={bulkAction}
                    onValueChange={setBulkAction}>

                      <SelectTrigger className="w-40 border-black bg-slate-600 text-white">
                        <SelectValue placeholder="Select action" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ban">Ban Users</SelectItem>
                        <SelectItem value="unban">Unban Users</SelectItem>
                        <SelectItem value="delete">Delete Users</SelectItem>
                        <SelectItem value="export">Export Selected</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                    onClick={handleBulkAction}
                    disabled={!bulkAction}
                    className="bg-red-600 text-white hover:bg-red-700">

                      Apply Action
                    </Button>
                  </div>
                </div>
              </div>
            }

            <DataTable
              data={users}
              columns={userColumns}
              title="User Management"
              searchable={true}
              exportable={true}
              pageSize={15}
              onView={(user) => setSelectedUser(user)}
              onEdit={async (user) => {
                const newEmail = prompt("Enter new email:", user.email);
                if (newEmail && newEmail !== user.email) {
                  try {
                    await handleUserUpdate({ ...user, email: newEmail });
                    toast({
                      title: "Success",
                      description: "User updated successfully!"
                    });
                  } catch (error) {
                    toast({
                      title: "Error",
                      description: "Failed to update user",
                      variant: "destructive"
                    });
                  }
                }
              }}
              onDelete={async (user) => {
                if (confirm(`Are you sure you want to delete ${user.email}?`)) {
                  try {
                    await handleBulkOperation("bulk_delete", [user.id]);
                    toast({
                      title: "Success",
                      description: "User deleted successfully!"
                    });
                  } catch (error) {
                    toast({
                      title: "Error",
                      description: "Failed to delete user",
                      variant: "destructive"
                    });
                  }
                }
              }}
              loading={loading} />

          </TabsContent>

          {/* Enhanced Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            {/* Payment Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-slate-800 border-2 border-black">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-sm text-gray-400">Total Payments</p>
                      <p className="text-2xl font-bold text-white">{payments.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-2 border-black">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="text-sm text-gray-400">Total Revenue</p>
                      <p className="text-2xl font-bold text-white">
                        {formatPrice(payments.reduce((sum, p) => sum + (p.amount_cents || 0), 0))}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-2 border-black">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="text-sm text-gray-400">Completed</p>
                      <p className="text-2xl font-bold text-white">
                        {payments.filter((p) => p.status === 'completed').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-2 border-black">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    <div>
                      <p className="text-sm text-gray-400">Failed</p>
                      <p className="text-2xl font-bold text-white">
                        {payments.filter((p) => p.status === 'failed').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <DataTable
              data={payments}
              columns={paymentColumns}
              title="Payment Management"
              searchable={true}
              exportable={true}
              pageSize={20}
              onView={(payment) => {
                toast({
                  title: "Payment Details",
                  description: `ID: ${payment.id}\nAmount: ${formatPrice(payment.amount_cents)}\nFee: ${formatPrice(payment.fee_cents)}\nStatus: ${payment.status}\nCountry: ${payment.country}\nDate: ${new Date(payment.created_at).toLocaleString()}`
                });
              }}
              onEdit={(payment) => {
                if (payment.status === 'completed') {
                  if (confirm(`Are you sure you want to refund this payment of ${formatPrice(payment.amount_cents)}?`)) {
                    refundPayment(payment.id);
                  }
                } else {
                  toast({
                    title: "Error",
                    description: "Only completed payments can be refunded",
                    variant: "destructive"
                  });
                }
              }}
              loading={loading} />

          </TabsContent>

          {/* Enhanced Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <Tabs defaultValue="questions" className="w-full">
              <TabsList className="bg-slate-800 border border-black">
                <TabsTrigger value="questions" className="text-white data-[state=active]:bg-slate-700 data-[state=active]:text-white">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Questions
                </TabsTrigger>
                <TabsTrigger value="scenarios" className="text-white data-[state=active]:bg-slate-700 data-[state=active]:text-white">
                  <FileText className="h-4 w-4 mr-2" />
                  Scenarios
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="questions" className="mt-6">
                <AdminErrorBoundary>
                  <ContentManager type="questions" />
                </AdminErrorBoundary>
              </TabsContent>
              
              <TabsContent value="scenarios" className="mt-6">
                <AdminErrorBoundary>
                  <ContentManager type="scenarios" />
                </AdminErrorBoundary>
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Enhanced System Tab */}
          <TabsContent value="system" className="space-y-6">
            <AdminErrorBoundary>
              <SystemHealthMonitor />
            </AdminErrorBoundary>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Button
                onClick={() => {
                  setLogType("database");
                  setLogModalOpen(true);
                }}
                className="h-24 bg-blue-600 hover:bg-blue-700 text-white flex flex-col items-center justify-center">

                <Database className="h-8 w-8 mb-2" />
                Database Logs
              </Button>
              <Button
                onClick={() => {
                  setLogType("error");
                  setLogModalOpen(true);
                }}
                className="h-24 bg-red-600 hover:bg-red-700 text-white flex flex-col items-center justify-center">

                <AlertTriangle className="h-8 w-8 mb-2" />
                Error Logs
              </Button>
              <Button
                onClick={() => {
                  setLogType("security");
                  setLogModalOpen(true);
                }}
                className="h-24 bg-purple-600 hover:bg-purple-700 text-white flex flex-col items-center justify-center">

                <Shield className="h-8 w-8 mb-2" />
                Security Logs
              </Button>
              <Button
                onClick={clearSystemCache}
                className="h-24 bg-green-600 hover:bg-green-700 text-white flex flex-col items-center justify-center">

                <RefreshCw className="h-8 w-8 mb-2" />
                Clear Cache
              </Button>
            </div>

            {/* System Management Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-800 border-2 border-black">
                <CardHeader>
                  <CardTitle className="text-white">System Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white">Maintenance Mode</span>
                    <Button
                      size="sm"
                      variant={maintenanceMode ? "destructive" : "outline"}
                      onClick={toggleMaintenanceMode}
                      className="border-black bg-slate-700 text-white hover:bg-slate-600">

                      {maintenanceMode ? "Disable" : "Enable"}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Database Backup</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={triggerBackup}
                      className="border-black bg-slate-700 text-white hover:bg-slate-600">

                      Backup Now
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Security Scan</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={runSecurityScan}
                      className="border-black bg-slate-700 text-white hover:bg-slate-600">

                      Scan Now
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-2 border-black">
                <CardHeader>
                  <CardTitle className="text-white">System Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white">Last Backup</span>
                    <span className="text-gray-400">{lastBackupTime || "Never"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Last Security Scan</span>
                    <span className="text-gray-400">{lastSecurityScan || "Never"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Cache Status</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            {/* Analytics Period Selector */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Comprehensive Analytics</h2>
              <div className="flex gap-2">
                <Button
                  variant={analyticsPeriod === '7d' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setAnalyticsPeriod('7d');
                    loadComprehensiveAnalytics();
                  }}>

                  7 Days
                </Button>
                <Button
                  variant={analyticsPeriod === '30d' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setAnalyticsPeriod('30d');
                    loadComprehensiveAnalytics();
                  }}>

                  30 Days
                </Button>
                <Button
                  variant={analyticsPeriod === '90d' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setAnalyticsPeriod('90d');
                    loadComprehensiveAnalytics();
                  }}>

                  90 Days
                </Button>
              </div>
            </div>

            {/* Analytics Summary Cards */}
            {comprehensiveAnalytics &&
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="border-2 border-black bg-slate-800 text-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{comprehensiveAnalytics.summary.totalRegistrations}</div>
                    <p className="text-xs text-slate-400">New users in {analyticsPeriod}</p>
                  </CardContent>
                </Card>
                
                <Card className="border-2 border-black bg-slate-800 text-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{comprehensiveAnalytics.summary.totalTests}</div>
                    <p className="text-xs text-slate-400">Test pass rate: {comprehensiveAnalytics.summary.testPassRate.toFixed(1)}%</p>
                  </CardContent>
                </Card>
                
                <Card className="border-2 border-black bg-slate-800 text-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Scenarios</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{comprehensiveAnalytics.summary.totalScenarios}</div>
                    <p className="text-xs text-slate-400">Accuracy: {comprehensiveAnalytics.summary.scenarioAccuracy.toFixed(1)}%</p>
                  </CardContent>
                </Card>
                
                <Card className="border-2 border-black bg-slate-800 text-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">R{comprehensiveAnalytics.summary.totalRevenue.toFixed(2)}</div>
                    <p className="text-xs text-slate-400">Revenue in {analyticsPeriod}</p>
                  </CardContent>
                </Card>
              </div>
            }

            {/* Analytics Charts */}
            {comprehensiveAnalytics &&
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-2 border-black bg-slate-800 text-white">
                  <CardHeader>
                    <CardTitle>Daily Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MetricChart
                    data={comprehensiveAnalytics.dailyData.map((day: unknown) => ({
                      name: new Date(day.date).toLocaleDateString(),
                      registrations: day.registrations,
                      tests: day.tests,
                      scenarios: day.scenarios,
                      revenue: day.revenue
                    }))}
                    title=""
                    type="line"
                    height={300}
                    dataKey="tests" />

                  </CardContent>
                </Card>

                <Card className="border-2 border-black bg-slate-800 text-white">
                  <CardHeader>
                    <CardTitle>Top Performers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Top Test Takers</h4>
                        <div className="space-y-2">
                          {comprehensiveAnalytics.topPerformers.byTests.slice(0, 5).map((user: unknown, index: number) =>
                        <div key={user.userId} className="flex justify-between items-center">
                              <span className="text-sm">{user.email}</span>
                              <Badge variant="outline">{user.count} tests</Badge>
                            </div>
                        )}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Top Revenue Generators</h4>
                        <div className="space-y-2">
                          {comprehensiveAnalytics.topPerformers.byRevenue.slice(0, 5).map((user: unknown, index: number) =>
                        <div key={user.userId} className="flex justify-between items-center">
                              <span className="text-sm">{user.email}</span>
                              <Badge variant="outline">R{user.amount.toFixed(2)}</Badge>
                            </div>
                        )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            }

            {!comprehensiveAnalytics &&
            <div className="text-center py-12">
                <p className="text-slate-400">Loading analytics data...</p>
              </div>
            }
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* System Configuration */}
              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    System Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Maintenance Mode
                      </label>
                      <div className="flex items-center space-x-3">
                        <Button
                          size="sm"
                          variant={maintenanceMode ? "destructive" : "outline"}
                          onClick={() => toggleMaintenanceMode()}>

                          {maintenanceMode ? "Disable" : "Enable"}
                        </Button>
                        <span className="text-sm text-gray-500">
                          {maintenanceMode ? "Site is in maintenance mode" : "Site is live"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Auto Backup
                      </label>
                      <div className="flex items-center space-x-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => triggerBackup()}>

                          Backup Now
                        </Button>
                        <span className="text-sm text-gray-500">
                          Last backup: {lastBackupTime || "Never"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Security Scan
                      </label>
                      <div className="flex items-center space-x-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => runSecurityScan()}>

                          Scan Now
                        </Button>
                        <span className="text-sm text-gray-500">
                          Last scan: {lastSecurityScan || "Never"}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Configuration */}
              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Payment Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        PayPal Integration
                      </label>
                      <div className="flex items-center space-x-3">
                        <Badge className="bg-green-100 text-green-800">
                          Connected
                        </Badge>
                        <Button size="sm" variant="outline">
                          Configure
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Currency
                      </label>
                      <select className="w-full p-2 border border-gray-300 rounded-md">
                        <option value="ZAR">South African Rand (ZAR)</option>
                        <option value="USD">US Dollar (USD)</option>
                        <option value="EUR">Euro (EUR)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tax Rate (%)
                      </label>
                      <input
                        type="number"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        defaultValue="15"
                        min="0"
                        max="100" />

                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Email Configuration */}
              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white flex items-center">
                    <Mail className="h-5 w-5 mr-2" />
                    Email Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        SMTP Server
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="smtp.gmail.com" />

                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        From Email
                      </label>
                      <input
                        type="email"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="noreply@superk53.com" />

                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Templates
                      </label>
                      <div className="space-y-2">
                        <Button size="sm" variant="outline" className="w-full justify-start">
                          Welcome Email
                        </Button>
                        <Button size="sm" variant="outline" className="w-full justify-start">
                          Payment Confirmation
                        </Button>
                        <Button size="sm" variant="outline" className="w-full justify-start">
                          Password Reset
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security Configuration */}
              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Session Timeout (minutes)
                      </label>
                      <input
                        type="number"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        defaultValue="30"
                        min="5"
                        max="480" />

                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Failed Login Attempts
                      </label>
                      <input
                        type="number"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        defaultValue="5"
                        min="3"
                        max="10" />

                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Two-Factor Authentication
                      </label>
                      <div className="flex items-center space-x-3">
                        <Button size="sm" variant="outline">
                          Configure
                        </Button>
                        <Badge className="bg-orange-100 text-orange-800">
                          Optional
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        IP Whitelist
                      </label>
                      <textarea
                        className="w-full p-2 border border-gray-300 rounded-md"
                        rows={3}
                        placeholder="Enter IP addresses (one per line)" />

                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Save Configuration Button */}
            <div className="flex justify-end">
              <Button
                onClick={() => {
                  // TODO: Implement configuration save functionality
                  console.log('Configuration save not implemented yet');
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white">

                Save Configuration
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Advanced Modals */}
      {selectedUser &&
      <UserDetailModal
        user={selectedUser}
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        onSave={handleUserUpdate} />

      }

      <SystemLogModal
        isOpen={logModalOpen}
        onClose={() => setLogModalOpen(false)}
        logType={logType} />

    </div>);

}