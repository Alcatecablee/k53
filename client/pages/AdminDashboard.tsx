import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Users,
  CreditCard,
  TrendingUp,
  Activity,
  DollarSign,
  Calendar,
  Settings,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Shield,
  FileText,
  MapPin,
  Phone,
  Car,
  Cog,
  Layers,
  ChartBarStacked,
  MapIcon,
  User,
  LogOut,
  Clock,
  Award,
  RefreshCw,
  Bell,
  BookOpen,
  Monitor,
  Database,
  Plus,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  Search,
  Mail,
  Wrench,
  AlertCircle,
  Info,
  X,
  Save,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { formatPrice } from "@/services/subscriptionService";
import { adminService, type DashboardStats, type User, type Payment, type SystemHealth, type SystemSetting, type MaintenanceMode, type SystemNotification } from "@/services/adminService";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  // Dashboard data
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [systemSettings, setSystemSettings] = useState<SystemSetting[]>([]);
  const [maintenanceMode, setMaintenanceMode] = useState<MaintenanceMode | null>(null);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);

  // UI states
  const [searchTerm, setSearchTerm] = useState("");
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState("");
  const [notificationData, setNotificationData] = useState({
    title: "",
    message: "",
    type: "info" as const,
    target_audience: "all" as const,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        statsData,
        usersData,
        paymentsData,
        healthData,
        settingsData,
        maintenanceData,
        notificationsData,
      ] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getUsers({ limit: 50 }),
        adminService.getPayments({ limit: 20 }),
        adminService.getSystemHealth(),
        adminService.getSystemSettings(),
        adminService.getMaintenanceMode(),
        adminService.getSystemNotifications(),
      ]);

      setStats(statsData);
      setUsers(usersData);
      setPayments(paymentsData);
      setSystemHealth(healthData);
      setSystemSettings(settingsData);
      setMaintenanceMode(maintenanceData);
      setNotifications(notificationsData);
      setLastRefresh(new Date());
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      setError(error instanceof Error ? error.message : "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async (userId: string, reason: string) => {
    try {
      await adminService.banUser(userId, reason);
      await loadDashboardData(); // Refresh data
    } catch (error) {
      console.error("Error banning user:", error);
      setError("Failed to ban user");
    }
  };

  const handleUnbanUser = async (userId: string) => {
    try {
      await adminService.unbanUser(userId);
      await loadDashboardData(); // Refresh data
    } catch (error) {
      console.error("Error unbanning user:", error);
      setError("Failed to unban user");
    }
  };

  const handleToggleMaintenance = async () => {
    try {
      const newMode = await adminService.toggleMaintenanceMode(
        !maintenanceMode?.is_active,
        maintenanceMessage
      );
      setMaintenanceMode(newMode);
      setShowMaintenanceModal(false);
      setMaintenanceMessage("");
    } catch (error) {
      console.error("Error toggling maintenance mode:", error);
      setError("Failed to toggle maintenance mode");
    }
  };

  const handleCreateNotification = async () => {
    try {
      await adminService.createNotification(notificationData);
      await loadDashboardData(); // Refresh data
      setShowNotificationModal(false);
      setNotificationData({
        title: "",
        message: "",
        type: "info",
        target_audience: "all",
      });
    } catch (error) {
      console.error("Error creating notification:", error);
      setError("Failed to create notification");
    }
  };

  const handleExportData = async (type: 'users' | 'payments' | 'analytics') => {
    try {
      const blob = await adminService.exportData(type, 'csv');
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error exporting data:", error);
      setError("Failed to export data");
    }
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'bg-slate-600';
      case 'error':
        return 'bg-slate-600';
      case 'warning':
        return 'bg-slate-600';
      default:
        return 'bg-slate-600';
    }
  };

  const getHealthStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="h-4 w-4" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white font-semibold">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Card className="border-2 border-slate-600 bg-slate-800 max-w-md">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold text-white mb-4">
              Dashboard Error
            </h1>
            <p className="text-slate-300 mb-6">{error}</p>
            <Button onClick={loadDashboardData} className="bg-white text-slate-900 hover:bg-slate-100">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
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
                className="text-slate-300 hover:text-white font-medium uppercase tracking-wide"
              >
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
                {lastRefresh && (
                  <p className="text-slate-500 text-xs">
                    Last updated: {lastRefresh.toLocaleTimeString()}
                  </p>
                )}
              </div>
              <Button
                onClick={loadDashboardData}
                className="bg-white text-slate-900 hover:bg-slate-100"
              >
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
          <TabsList className="bg-slate-800 border border-black">
            <TabsTrigger value="dashboard" className="text-white data-[state=active]:bg-white data-[state=active]:text-slate-900">
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="users" className="text-white data-[state=active]:bg-white data-[state=active]:text-slate-900">
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="payments" className="text-white data-[state=active]:bg-white data-[state=active]:text-slate-900">
              <CreditCard className="h-4 w-4 mr-2" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="system" className="text-white data-[state=active]:bg-white data-[state=active]:text-slate-900">
              <Settings className="h-4 w-4 mr-2" />
              System
            </TabsTrigger>
            <TabsTrigger value="notifications" className="text-white data-[state=active]:bg-white data-[state=active]:text-slate-900">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-2 border-black bg-slate-800 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium uppercase tracking-wide">
                    Total Users
                  </CardTitle>
                  <Users className="h-4 w-4 text-slate-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
                  <p className="text-xs text-slate-400">
                    +{stats?.todaySignups || 0} today
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-black bg-slate-800 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium uppercase tracking-wide">
                    Active Subscriptions
                  </CardTitle>
                  <CreditCard className="h-4 w-4 text-slate-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats?.activeSubscriptions || 0}
                  </div>
                  <p className="text-xs text-slate-400">
                    {stats?.conversionRate?.toFixed(1) || 0}% conversion rate
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-black bg-slate-800 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium uppercase tracking-wide">
                    Total Revenue
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-slate-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatPrice(stats?.totalRevenue || 0)}
                  </div>
                  <p className="text-xs text-slate-400">Lifetime earnings</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-black bg-slate-800 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium uppercase tracking-wide">
                    Real-time Users
                  </CardTitle>
                  <Activity className="h-4 w-4 text-slate-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats?.realtimeUsers || 0}
                  </div>
                  <p className="text-xs text-slate-400">Currently active</p>
                </CardContent>
              </Card>
            </div>

            {/* System Status */}
            <Card className="border-2 border-black bg-slate-800 text-white">
              <CardHeader>
                <CardTitle className="text-xl font-bold uppercase tracking-wide flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="flex items-center space-x-3">
                    {getHealthStatusIcon(systemHealth?.database || 'unknown')}
                    <div>
                      <h3 className="font-semibold">Database</h3>
                      <Badge className={`${getHealthStatusColor(systemHealth?.database || 'unknown')} text-white`}>
                        {systemHealth?.database || 'Unknown'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getHealthStatusIcon(systemHealth?.paypal || 'unknown')}
                    <div>
                      <h3 className="font-semibold">Payment Gateway</h3>
                      <Badge className={`${getHealthStatusColor(systemHealth?.paypal || 'unknown')} text-white`}>
                        {systemHealth?.paypal || 'Unknown'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getHealthStatusIcon(systemHealth?.server || 'unknown')}
                    <div>
                      <h3 className="font-semibold">Server</h3>
                      <Badge className={`${getHealthStatusColor(systemHealth?.server || 'unknown')} text-white`}>
                        {systemHealth?.server || 'Unknown'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getHealthStatusIcon(systemHealth?.storage || 'unknown')}
                    <div>
                      <h3 className="font-semibold">Storage</h3>
                      <Badge className={`${getHealthStatusColor(systemHealth?.storage || 'unknown')} text-white`}>
                        {systemHealth?.storage || 'Unknown'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-2 border-black bg-slate-800 text-white">
              <CardHeader>
                <CardTitle className="text-xl font-bold uppercase tracking-wide flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    onClick={() => setShowMaintenanceModal(true)}
                    className="bg-white text-slate-900 hover:bg-slate-100 py-3"
                  >
                    <Wrench className="h-4 w-4 mr-2" />
                    {maintenanceMode?.is_active ? 'Disable' : 'Enable'} Maintenance
                  </Button>
                  <Button 
                    onClick={() => setShowNotificationModal(true)}
                    className="bg-white text-slate-900 hover:bg-slate-100 py-3"
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Send Notification
                  </Button>
                  <Button 
                    onClick={() => handleExportData('users')}
                    className="bg-white text-slate-900 hover:bg-slate-100 py-3"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Users
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="border-2 border-black bg-slate-800 text-white">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold uppercase tracking-wide flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    User Management
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-slate-700 border border-black rounded text-white placeholder-slate-400"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-400">No users found</p>
                    </div>
                  ) : (
                    users
                      .filter(user => 
                        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.location.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between p-4 bg-slate-700 border border-black rounded-lg"
                        >
                          <div className="flex items-center space-x-4">
                            <div>
                              <div className="font-semibold">{user.email}</div>
                              <div className="text-sm text-slate-400">
                                {user.location} • {user.subscription.plan_type}
                              </div>
                              <div className="text-xs text-slate-500">
                                Joined: {new Date(user.created_at).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={`${
                              user.subscription.status === 'active' ? 'bg-slate-600' : 
                              user.subscription.status === 'banned' ? 'bg-slate-600' : 'bg-slate-600'
                            } text-white`}>
                              {user.subscription.status}
                            </Badge>
                            {user.subscription.status === 'active' ? (
                              <Button
                                onClick={() => handleBanUser(user.id, 'Admin action')}
                                size="sm"
                                className="bg-white text-slate-900 hover:bg-slate-100"
                              >
                                Ban
                              </Button>
                            ) : (
                              <Button
                                onClick={() => handleUnbanUser(user.id)}
                                size="sm"
                                className="bg-white text-slate-900 hover:bg-slate-100"
                              >
                                Unban
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <Card className="border-2 border-black bg-slate-800 text-white">
              <CardHeader>
                <CardTitle className="text-xl font-bold uppercase tracking-wide flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Records
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {payments.length === 0 ? (
                    <div className="text-center py-8">
                      <CreditCard className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-400">No payments recorded yet</p>
                      <p className="text-slate-500 text-sm">
                        Payments will appear here once users subscribe to premium plans
                      </p>
                    </div>
                  ) : (
                    payments.map((payment) => (
                      <div
                        key={payment.id}
                        className="flex items-center justify-between p-4 bg-slate-700 border border-black rounded-lg"
                      >
                        <div>
                          <div className="font-semibold">
                            {formatPrice(payment.amount_cents)}
                          </div>
                          <div className="text-sm text-slate-400">
                            {payment.payment_method} • {payment.user_email}
                          </div>
                          {payment.paypal_order_id && (
                            <div className="text-xs text-slate-500">
                              Order: {payment.paypal_order_id}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <Badge className={`${
                            payment.status === 'completed' ? 'bg-slate-600' : 
                            payment.status === 'pending' ? 'bg-slate-600' : 'bg-slate-600'
                          } text-white`}>
                            {payment.status}
                          </Badge>
                          <div className="text-xs text-slate-400 mt-1">
                            {new Date(payment.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            <Card className="border-2 border-black bg-slate-800 text-white">
              <CardHeader>
                <CardTitle className="text-xl font-bold uppercase tracking-wide flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  System Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Maintenance Mode */}
                  <div className="border border-black p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Maintenance Mode</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-400">
                          Status: {maintenanceMode?.is_active ? 'Active' : 'Inactive'}
                        </p>
                        {maintenanceMode?.message && (
                          <p className="text-sm text-slate-400 mt-1">
                            Message: {maintenanceMode.message}
                          </p>
                        )}
                      </div>
                      <Button
                        onClick={() => setShowMaintenanceModal(true)}
                        className="bg-white text-slate-900 hover:bg-slate-100"
                      >
                        {maintenanceMode?.is_active ? 'Disable' : 'Enable'}
                      </Button>
                    </div>
                  </div>

                  {/* System Settings */}
                  <div className="border border-black p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">System Settings</h3>
                    <div className="space-y-2">
                      {systemSettings.map((setting) => (
                        <div key={setting.id} className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">{setting.setting_key}</p>
                            <p className="text-xs text-slate-400">{setting.description}</p>
                          </div>
                          <Badge className={setting.is_public ? 'bg-slate-600' : 'bg-slate-600'}>
                            {setting.is_public ? 'Public' : 'Private'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="border-2 border-black bg-slate-800 text-white">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold uppercase tracking-wide flex items-center">
                    <Bell className="h-5 w-5 mr-2" />
                    System Notifications
                  </CardTitle>
                  <Button
                    onClick={() => setShowNotificationModal(true)}
                    className="bg-white text-slate-900 hover:bg-slate-100"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Notification
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.length === 0 ? (
                    <div className="text-center py-8">
                      <Bell className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-400">No notifications created yet</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="flex items-center justify-between p-4 bg-slate-700 border border-black rounded-lg"
                      >
                        <div>
                          <div className="font-semibold">{notification.title}</div>
                          <div className="text-sm text-slate-400">{notification.message}</div>
                          <div className="text-xs text-slate-500 mt-1">
                            Target: {notification.target_audience} • Type: {notification.type}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={`${
                            notification.type === 'success' ? 'bg-slate-600' : 
                            notification.type === 'warning' ? 'bg-slate-600' : 
                            notification.type === 'error' ? 'bg-slate-600' : 'bg-slate-600'
                          } text-white`}>
                            {notification.type}
                          </Badge>
                          <Badge className={notification.is_active ? 'bg-slate-600' : 'bg-slate-600'}>
                            {notification.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Maintenance Mode Modal */}
      {showMaintenanceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="border-2 border-black bg-slate-800 text-white max-w-md w-full mx-4">
            <CardHeader>
              <CardTitle className="text-xl font-bold uppercase tracking-wide">
                {maintenanceMode?.is_active ? 'Disable' : 'Enable'} Maintenance Mode
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Message (optional)</label>
                <textarea
                  value={maintenanceMessage}
                  onChange={(e) => setMaintenanceMessage(e.target.value)}
                  placeholder="Enter maintenance message..."
                  className="w-full p-3 bg-slate-700 border border-black rounded text-white placeholder-slate-400"
                  rows={3}
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={handleToggleMaintenance}
                  className="bg-white text-slate-900 hover:bg-slate-100"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {maintenanceMode?.is_active ? 'Disable' : 'Enable'}
                </Button>
                <Button
                  onClick={() => setShowMaintenanceModal(false)}
                  variant="outline"
                  className="border-white text-white hover:bg-slate-700"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Notification Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="border-2 border-black bg-slate-800 text-white max-w-md w-full mx-4">
            <CardHeader>
              <CardTitle className="text-xl font-bold uppercase tracking-wide">
                Create System Notification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={notificationData.title}
                  onChange={(e) => setNotificationData({ ...notificationData, title: e.target.value })}
                  placeholder="Notification title..."
                  className="w-full p-3 bg-slate-700 border border-black rounded text-white placeholder-slate-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  value={notificationData.message}
                  onChange={(e) => setNotificationData({ ...notificationData, message: e.target.value })}
                  placeholder="Notification message..."
                  className="w-full p-3 bg-slate-700 border border-black rounded text-white placeholder-slate-400"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <select
                    value={notificationData.type}
                    onChange={(e) => setNotificationData({ ...notificationData, type: e.target.value as any })}
                    className="w-full p-3 bg-slate-700 border border-black rounded text-white"
                  >
                    <option value="info">Info</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Target Audience</label>
                  <select
                    value={notificationData.target_audience}
                    onChange={(e) => setNotificationData({ ...notificationData, target_audience: e.target.value as any })}
                    className="w-full p-3 bg-slate-700 border border-black rounded text-white"
                  >
                    <option value="all">All Users</option>
                    <option value="users">Free Users</option>
                    <option value="premium">Premium Users</option>
                    <option value="admins">Admins Only</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={handleCreateNotification}
                  className="bg-white text-slate-900 hover:bg-slate-100"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Create
                </Button>
                <Button
                  onClick={() => setShowNotificationModal(false)}
                  variant="outline"
                  className="border-white text-white hover:bg-slate-700"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 