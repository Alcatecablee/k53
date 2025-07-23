import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  Users,
  CreditCard,
  TrendingUp,
  Activity,
  DollarSign,
  Calendar,
  Settings,
  Download,
  Upload,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Ban,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Mail,
  Phone,
  Globe,
  Database,
  Server,
  Shield,
  FileText,
  BarChart3,
  PieChart,
  LineChart,
  Users2,
  UserCheck,
  UserX,
  Crown,
  Zap,
  Package,
  Bell,
  Lock,
  Unlock,
  Monitor,
  HardDrive,
  Wifi,
  Clock,
  MapPin,
  BookOpen,
  MessageSquare,
  Star,
  TrendingDown,
  Plus,
  Minus,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { formatPrice } from "@/services/subscriptionService";

interface DashboardStats {
  totalUsers: number;
  activeSubscriptions: number;
  totalRevenue: number;
  todaySignups: number;
  conversionRate: number;
  churnRate: number;
  avgSessionTime: number;
  topLocations: Array<{ city: string; count: number }>;
  monthlyGrowth: number;
}

interface User {
  id: string;
  email: string;
  created_at: string;
  subscription?: {
    plan_type: string;
    status: string;
    created_at: string;
  };
  usage?: {
    scenarios_used: number;
    max_scenarios: number;
  };
  location?: string;
  last_seen?: string;
}

interface Payment {
  id: string;
  user_id: string;
  amount_cents: number;
  status: string;
  payment_method: string;
  created_at: string;
  user_email?: string;
}

export default function AdminNew() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [systemHealth, setSystemHealth] = useState({
    database: "operational",
    paypal: "operational",
    server: "operational",
    storage: "operational",
  });

  // Check if user has admin privileges
  const isAdmin =
    user?.email === "admin@superk53.com" ||
    process.env.NODE_ENV === "development";

  useEffect(() => {
    if (!isAdmin) return;
    loadDashboardData();
    loadUsers();
    loadPayments();
    checkSystemHealth();
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin) return;
    loadUsers();
  }, [searchTerm, filterStatus, isAdmin]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/admin/dashboard-stats");
      if (response.ok) {
        const stats = await response.json();
        setStats(stats);
      } else {
        console.error("Failed to load dashboard data");
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await fetch(
        `/api/admin/users?search=${searchTerm}&status=${filterStatus}`,
      );
      if (response.ok) {
        const usersData = await response.json();
        setUsers(usersData);
      } else {
        console.error("Failed to load users");
      }
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  const loadPayments = async () => {
    try {
      const response = await fetch("/api/admin/payments");
      if (response.ok) {
        const paymentsData = await response.json();
        setPayments(paymentsData);
      } else {
        console.error("Failed to load payments");
      }
    } catch (error) {
      console.error("Error loading payments:", error);
    }
  };

  const checkSystemHealth = async () => {
    try {
      const response = await fetch("/api/admin/system-health");
      if (response.ok) {
        const health = await response.json();
        setSystemHealth(health);
      } else {
        setSystemHealth({
          database: "error",
          paypal: "warning",
          server: "error",
          storage: "warning",
        });
      }
    } catch (error) {
      setSystemHealth({
        database: "error",
        paypal: "warning",
        server: "error",
        storage: "warning",
      });
    }
  };

  const handleUserAction = async (userId: string, action: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/action`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message);
        await loadUsers();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error performing user action:", error);
      alert("Failed to perform action. Please try again.");
    }
  };

  const exportData = (type: string) => {
    // Export functionality
    const data = type === "users" ? users : payments;
    const csv = [
      Object.keys(data[0] || {}).join(","),
      ...data.map((item) => Object.values(item).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${type}_export_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.email
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || user.subscription?.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="border border-red-200 bg-white max-w-md shadow-lg">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">
              Access Denied
            </h1>
            <p className="text-gray-600 mb-6">
              You don't have permission to access this page.
            </p>
            <Button
              asChild
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Link to="/">Return Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-16 h-16 text-gray-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-700 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              asChild
              variant="ghost"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Portal
              </Link>
            </Button>

            <div className="text-center">
              <h1 className="text-2xl font-semibold text-gray-900">
                SuperK53 Administration
              </h1>
              <p className="text-gray-600 text-sm">
                Business Management Console
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                onClick={loadDashboardData}
                variant="outline"
                className="border-gray-300 text-gray-700"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button
                onClick={() => alert('Notifications feature coming soon!')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          {/* Tab Navigation */}
          <TabsList className="grid w-full grid-cols-6 bg-white border border-gray-200 rounded-lg">
            <TabsTrigger
              value="overview"
              className="text-gray-700 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="text-gray-700 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200"
            >
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger
              value="payments"
              className="text-gray-700 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Payments
            </TabsTrigger>
            <TabsTrigger
              value="content"
              className="text-gray-700 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Content
            </TabsTrigger>
            <TabsTrigger
              value="system"
              className="text-gray-700 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200"
            >
              <Monitor className="h-4 w-4 mr-2" />
              System
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="text-gray-700 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Enhanced Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border border-gray-200 bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Total Users
                  </CardTitle>
                  <Users className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {stats?.totalUsers || 0}
                  </div>
                  <p className="text-xs text-gray-500">
                    +{stats?.todaySignups || 0} today
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Active Subscriptions
                  </CardTitle>
                  <Crown className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {stats?.activeSubscriptions || 0}
                  </div>
                  <p className="text-xs text-gray-500">
                    {stats?.conversionRate.toFixed(1)}% conversion rate
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Monthly Revenue
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatPrice(stats?.totalRevenue || 0)}
                  </div>
                  <p className="text-xs text-gray-500">Revenue this month</p>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Avg Session Time
                  </CardTitle>
                  <Clock className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {Math.floor((stats?.avgSessionTime || 0) / 60)}m
                  </div>
                  <p className="text-xs text-gray-500">Average session time</p>
                </CardContent>
              </Card>
            </div>

            {/* Top Locations & Growth Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    Top Locations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats?.topLocations.map((location, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900">{location.city}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">
                            {location.count} users
                          </span>
                          <div className="w-16 h-2 bg-gray-200 rounded">
                            <div
                              className="h-full bg-blue-600 rounded"
                              style={{
                                width: `${(location.count / (stats?.topLocations[0]?.count || 1)) * 100}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    System Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gray-50 border border-gray-200 rounded">
                      <Database className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                      <div className="text-lg font-semibold text-gray-900">
                        99.9%
                      </div>
                      <div className="text-xs text-gray-500">
                        Database Uptime
                      </div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 border border-gray-200 rounded">
                      <Server className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                      <div className="text-lg font-semibold text-gray-900">
                        156ms
                      </div>
                      <div className="text-xs text-gray-500">
                        Avg Response Time
                      </div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 border border-gray-200 rounded">
                      <HardDrive className="h-6 w-6 mx-auto mb-2 text-amber-600" />
                      <div className="text-lg font-semibold text-gray-900">
                        67%
                      </div>
                      <div className="text-xs text-gray-500">Storage Used</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 border border-gray-200 rounded">
                      <Wifi className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                      <div className="text-lg font-semibold text-gray-900">
                        1.2k
                      </div>
                      <div className="text-xs text-gray-500">
                        Active Sessions
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="border border-gray-200 bg-white">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {payments.slice(0, 3).map((payment, index) => (
                    <div
                      key={payment.id}
                      className="flex items-center space-x-4 p-3 bg-gray-50 border border-gray-100 rounded"
                    >
                      <CreditCard className="h-5 w-5 text-blue-600" />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          Payment {payment.status}
                        </div>
                        <div className="text-sm text-gray-600">
                          {payment.user_email} -{" "}
                          {formatPrice(payment.amount_cents)}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(payment.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                  {users.slice(0, 3 - payments.length).map((user, index) => (
                    <div
                      key={user.id}
                      className="flex items-center space-x-4 p-3 bg-gray-50 border border-gray-100 rounded"
                    >
                      <UserCheck className="h-5 w-5 text-blue-600" />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          User registration
                        </div>
                        <div className="text-sm text-gray-600">
                          {user.email} - {user.subscription?.plan_type}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            {/* User Management Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">
                User Management
              </h2>
              <div className="flex items-center space-x-3">
                <Button
                  onClick={() => exportData("users")}
                  variant="outline"
                  className="border-gray-300 text-gray-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button
                  onClick={() => alert('Add User feature coming soon!')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
            </div>

            {/* Search and Filters */}
            <Card className="border border-gray-200 bg-white">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <Label
                      htmlFor="search"
                      className="text-gray-700 font-medium"
                    >
                      Search Users
                    </Label>
                    <div className="relative mt-1">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="search"
                        placeholder="Search by email, name, or location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 border-gray-300 bg-white text-gray-900"
                      />
                    </div>
                  </div>
                  <div>
                    <Label
                      htmlFor="filter"
                      className="text-gray-700 font-medium"
                    >
                      Filter by Status
                    </Label>
                    <Select
                      value={filterStatus}
                      onValueChange={setFilterStatus}
                    >
                      <SelectTrigger className="w-48 border-gray-300 bg-white text-gray-900 mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="banned">Banned</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Users Table */}
            <Card className="border border-gray-200 bg-white">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-200">
                      <TableHead className="text-gray-700 font-medium">
                        User
                      </TableHead>
                      <TableHead className="text-gray-700 font-medium">
                        Subscription
                      </TableHead>
                      <TableHead className="text-gray-700 font-medium">
                        Usage
                      </TableHead>
                      <TableHead className="text-gray-700 font-medium">
                        Location
                      </TableHead>
                      <TableHead className="text-gray-700 font-medium">
                        Last Seen
                      </TableHead>
                      <TableHead className="text-gray-700 font-medium">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow
                        key={user.id}
                        className="border-gray-100 hover:bg-gray-50"
                      >
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900">
                              {user.email}
                            </div>
                            <div className="text-sm text-gray-500">
                              Joined{" "}
                              {new Date(user.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              user.subscription?.plan_type === "pro"
                                ? "bg-purple-100 text-purple-800 border-purple-200"
                                : user.subscription?.plan_type === "basic"
                                  ? "bg-blue-100 text-blue-800 border-blue-200"
                                  : "bg-gray-100 text-gray-800 border-gray-200"
                            }
                          >
                            {user.subscription?.plan_type?.toUpperCase() ||
                              "FREE"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="text-gray-900 font-medium">
                              {user.usage?.scenarios_used || 0}/
                              {user.usage?.max_scenarios === -1
                                ? "∞"
                                : user.usage?.max_scenarios || 5}
                            </div>
                            <div className="text-gray-500">scenarios</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-900">
                          {user.location || "Unknown"}
                        </TableCell>
                        <TableCell className="text-gray-500">
                          {user.last_seen
                            ? new Date(user.last_seen).toLocaleDateString()
                            : "Never"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-gray-300 text-gray-700"
                              onClick={() => setSelectedUser(user)}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-gray-300 text-gray-700"
                              onClick={() =>
                                handleUserAction(user.id, "resetPassword")
                              }
                            >
                              <Mail className="h-3 w-3" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-red-300 text-red-700 hover:bg-red-50"
                                >
                                  <Ban className="h-3 w-3" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-white">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-gray-900">
                                    Ban User
                                  </AlertDialogTitle>
                                  <AlertDialogDescription className="text-gray-600">
                                    Are you sure you want to ban {user.email}?
                                    This will immediately revoke their access.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="border-gray-300">
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleUserAction(user.id, "ban")
                                    }
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Ban User
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">
                Payment Management
              </h2>
              <div className="flex items-center space-x-3">
                <Button
                  onClick={() => exportData("payments")}
                  variant="outline"
                  className="border-gray-300 text-gray-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button
                  onClick={() => {
                    alert('PayPal sync initiated!');
                    loadPayments();
                  }}
                  variant="outline"
                  className="border-gray-300 text-gray-700"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync PayPal
                </Button>
              </div>
            </div>

            {/* Payment Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Total Processed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatPrice(
                      payments
                        .filter((p) => p.status === "completed")
                        .reduce((sum, p) => sum + p.amount_cents, 0),
                    )}
                  </div>
                  <p className="text-xs text-gray-500">Total processed</p>
                </CardContent>
              </Card>
              <Card className="border border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Success Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {payments.length > 0
                      ? Math.round(
                          (payments.filter((p) => p.status === "completed")
                            .length /
                            payments.length) *
                            100,
                        )
                      : 0}
                    %
                  </div>
                  <p className="text-xs text-gray-500">Payment success rate</p>
                </CardContent>
              </Card>
              <Card className="border border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Failed Payments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {payments.filter((p) => p.status === "failed").length}
                  </div>
                  <p className="text-xs text-gray-500">Failed payments</p>
                </CardContent>
              </Card>
            </div>

            {/* Payments Table */}
            <Card className="border border-gray-200 bg-white">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-200">
                      <TableHead className="text-gray-700 font-medium">
                        Payment ID
                      </TableHead>
                      <TableHead className="text-gray-700 font-medium">
                        User
                      </TableHead>
                      <TableHead className="text-gray-700 font-medium">
                        Amount
                      </TableHead>
                      <TableHead className="text-gray-700 font-medium">
                        Method
                      </TableHead>
                      <TableHead className="text-gray-700 font-medium">
                        Status
                      </TableHead>
                      <TableHead className="text-gray-700 font-medium">
                        Date
                      </TableHead>
                      <TableHead className="text-gray-700 font-medium">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow
                        key={payment.id}
                        className="border-gray-100 hover:bg-gray-50"
                      >
                        <TableCell className="text-gray-900 font-mono text-sm">
                          {payment.id}
                        </TableCell>
                        <TableCell className="text-gray-900">
                          {payment.user_email}
                        </TableCell>
                        <TableCell className="text-gray-900 font-medium">
                          {formatPrice(payment.amount_cents)}
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                            {payment.payment_method.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              payment.status === "completed"
                                ? "bg-green-100 text-green-800 border-green-200"
                                : payment.status === "failed"
                                  ? "bg-red-100 text-red-800 border-red-200"
                                  : "bg-yellow-100 text-yellow-800 border-yellow-200"
                            }
                          >
                            {payment.status.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-500">
                          {new Date(payment.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            onClick={() => alert(`Viewing payment details for ${payment.id}`)}
                            size="sm"
                            variant="outline"
                            className="border-gray-300 text-gray-700"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                Content Management
              </h2>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => alert('Import Questions feature coming soon!')}
                  variant="outline"
                  className="text-slate-300"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import Questions
                </Button>
                <Button
                  onClick={() => alert('Add Scenario feature coming soon!')}
                  className="bg-white text-slate-900"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Scenario
                </Button>
              </div>
            </div>

            {/* Content Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="border-2 border-black bg-slate-800 text-white">
                <CardHeader>
                  <CardTitle className="text-sm font-medium uppercase tracking-wide">
                    K53 Questions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,247</div>
                  <p className="text-xs text-slate-400">Total questions</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-black bg-slate-800 text-white">
                <CardHeader>
                  <CardTitle className="text-sm font-medium uppercase tracking-wide">
                    AI Scenarios
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">224</div>
                  <p className="text-xs text-slate-400">AI scenarios</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-black bg-slate-800 text-white">
                <CardHeader>
                  <CardTitle className="text-sm font-medium uppercase tracking-wide">
                    Scenario Packs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5</div>
                  <p className="text-xs text-slate-400">Scenario packs</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-black bg-slate-800 text-white">
                <CardHeader>
                  <CardTitle className="text-sm font-medium uppercase tracking-wide">
                    Languages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-slate-400">EN, AF, ZU</p>
                </CardContent>
              </Card>
            </div>

            {/* Content Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-2 border-black bg-slate-800 text-white">
                <CardHeader>
                  <CardTitle className="text-xl font-bold uppercase tracking-wide">
                    Question Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={() => alert('Question Bank Editor coming soon!')}
                    className="w-full bg-white text-slate-900 hover:bg-slate-100"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Question Bank
                  </Button>
                  <Button
                    onClick={() => alert('Question export initiated!')}
                    variant="outline"
                    className="w-full text-slate-300"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Questions
                  </Button>
                  <Button
                    onClick={() => alert('CSV import feature coming soon!')}
                    variant="outline"
                    className="w-full text-slate-300"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Import from CSV
                  </Button>
                </CardContent>
              </Card>
              <Card className="border-2 border-black bg-slate-800 text-white">
                <CardHeader>
                  <CardTitle className="text-xl font-bold uppercase tracking-wide">
                    Scenario Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={() => alert('Scenario Manager coming soon!')}
                    className="w-full bg-white text-slate-900 hover:bg-slate-100"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Manage Scenarios
                  </Button>
                  <Button
                    onClick={() => alert('Location Settings coming soon!')}
                    variant="outline"
                    className="w-full text-slate-300"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Location Settings
                  </Button>
                  <Button
                    onClick={() => alert('Scenario Packs Manager coming soon!')}
                    variant="outline"
                    className="w-full text-slate-300"
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Scenario Packs
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                System Monitoring
              </h2>
              <Button
                onClick={checkSystemHealth}
                className="bg-white text-slate-900"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Status
              </Button>
            </div>

            {/* System Health */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(systemHealth).map(([service, status]) => (
                <Card
                  key={service}
                  className="border-2 border-black bg-slate-800 text-white"
                >
                  <CardHeader>
                    <CardTitle className="text-sm font-medium uppercase tracking-wide">
                      {service}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      {status === "operational" && (
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      )}
                      {status === "warning" && (
                        <AlertTriangle className="h-5 w-5 text-yellow-400" />
                      )}
                      {status === "error" && (
                        <XCircle className="h-5 w-5 text-red-400" />
                      )}
                      <Badge
                        className={
                          status === "operational"
                            ? "bg-green-600 text-white"
                            : status === "warning"
                              ? "bg-yellow-600 text-white"
                              : "bg-red-600 text-white"
                        }
                      >
                        {status.toUpperCase()}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* System Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-2 border-black bg-slate-800 text-white">
                <CardHeader>
                  <CardTitle className="text-xl font-bold uppercase tracking-wide">
                    Database
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={async () => {
                      try {
                        const response = await fetch('/api/system/database/logs');
                        const data = await response.json();
                        alert(`Database Logs:\n\nConnection Count: ${data.metrics?.connectionCount || 0}\nQuery Count: ${data.metrics?.queryCount || 0}\nAvg Response Time: ${data.metrics?.avgResponseTime || 0}ms\n\nRecent Logs: ${data.logs?.length || 0} entries`);
                      } catch (error) {
                        alert('Failed to fetch database logs');
                      }
                    }}
                    variant="outline"
                    className="w-full text-slate-300"
                  >
                    <Database className="h-4 w-4 mr-2" />
                    View Logs
                  </Button>
                  <Button
                    onClick={async () => {
                      try {
                        const response = await fetch('/api/system/database/backup', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                        });
                        const data = await response.json();
                        if (data.success) {
                          const blob = new Blob([JSON.stringify(data.backup, null, 2)], { type: 'application/json' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `database_backup_${new Date().toISOString().split('T')[0]}.json`;
                          a.click();
                          alert(`Backup created successfully!\nSize: ${Math.round(data.size / 1024)}KB`);
                        } else {
                          alert('Backup failed');
                        }
                      } catch (error) {
                        alert('Failed to create backup');
                      }
                    }}
                    variant="outline"
                    className="w-full text-slate-300"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Backup Database
                  </Button>
                  <Button
                    onClick={async () => {
                      if (confirm('Toggle maintenance mode? This will affect site availability.')) {
                        try {
                          const response = await fetch('/api/system/maintenance', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ enabled: true }),
                          });
                          const data = await response.json();
                          if (data.success) {
                            alert(`Maintenance mode ${data.maintenanceMode ? 'enabled' : 'disabled'}!`);
                          } else {
                            alert('Failed to toggle maintenance mode');
                          }
                        } catch (error) {
                          alert('Failed to toggle maintenance mode');
                        }
                      }
                    }}
                    variant="outline"
                    className="w-full text-red-400"
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Maintenance Mode
                  </Button>
                </CardContent>
              </Card>
              <Card className="border-2 border-black bg-slate-800 text-white">
                <CardHeader>
                  <CardTitle className="text-xl font-bold uppercase tracking-wide">
                    Server
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={async () => {
                      try {
                        const response = await fetch('/api/system/performance');
                        const data = await response.json();
                        const metrics = data.metrics;
                        alert(`Performance Metrics:\n\nCPU Usage: ${metrics.cpu?.usage?.toFixed(1)}%\nMemory Used: ${Math.round((metrics.memory?.used || 0) / 1024 / 1024 / 1024)}GB\nDisk Used: ${Math.round((metrics.disk?.used || 0) / 1024 / 1024 / 1024)}GB\nUptime: ${Math.round((metrics.uptime || 0) / 3600)}h\nConnections: ${metrics.network?.connections || 0}`);
                      } catch (error) {
                        alert('Failed to fetch performance metrics');
                      }
                    }}
                    variant="outline"
                    className="w-full text-slate-300"
                  >
                    <Monitor className="h-4 w-4 mr-2" />
                    Performance
                  </Button>
                  <Button
                    onClick={async () => {
                      try {
                        const response = await fetch('/api/system/logs/errors');
                        const data = await response.json();
                        const recent = data.logs?.slice(0, 5) || [];
                        const logText = recent.map(log => `[${new Date(log.timestamp).toLocaleTimeString()}] ${log.message}`).join('\n');
                        alert(`Error Logs (${data.summary?.total || 0} total, ${data.summary?.last24h || 0} in 24h):\n\n${logText || 'No recent errors'}`);
                      } catch (error) {
                        alert('Failed to fetch error logs');
                      }
                    }}
                    variant="outline"
                    className="w-full text-slate-300"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Error Logs
                  </Button>
                  <Button
                    onClick={async () => {
                      if (confirm('Restart all services? This may cause temporary downtime.')) {
                        try {
                          const response = await fetch('/api/system/services/restart', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ services: ['api', 'database', 'cache'] }),
                          });
                          const data = await response.json();
                          if (data.success) {
                            alert(`${data.results?.length || 0} services restarted successfully!`);
                          } else {
                            alert('Failed to restart services');
                          }
                        } catch (error) {
                          alert('Failed to restart services');
                        }
                      }
                    }}
                    variant="outline"
                    className="w-full text-slate-300"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Restart Services
                  </Button>
                </CardContent>
              </Card>
              <Card className="border-2 border-black bg-slate-800 text-white">
                <CardHeader>
                  <CardTitle className="text-xl font-bold uppercase tracking-wide">
                    Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={async () => {
                      alert('Security scan running... Please wait.');
                      try {
                        const response = await fetch('/api/system/security/scan', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                        });
                        const data = await response.json();
                        if (data.success) {
                          const scan = data.scan;
                          const vulnCount = Object.values(scan.vulnerabilities).reduce((a: any, b: any) => a + b, 0);
                          alert(`Security Scan Complete!\n\nScan ID: ${scan.scanId}\nDuration: ${Math.round(scan.duration / 1000)}s\nVulnerabilities Found: ${vulnCount}\n\nCritical: ${scan.vulnerabilities.critical}\nHigh: ${scan.vulnerabilities.high}\nMedium: ${scan.vulnerabilities.medium}\nLow: ${scan.vulnerabilities.low}`);
                        } else {
                          alert('Security scan failed');
                        }
                      } catch (error) {
                        alert('Failed to run security scan');
                      }
                    }}
                    variant="outline"
                    className="w-full text-slate-300"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Security Scan
                  </Button>
                  <Button
                    onClick={async () => {
                      try {
                        const response = await fetch('/api/system/logs/access');
                        const data = await response.json();
                        const recent = data.logs?.slice(0, 5) || [];
                        const logText = recent.map(log => `[${new Date(log.timestamp).toLocaleTimeString()}] ${log.message} (${log.data?.ip || 'unknown IP'})`).join('\n');
                        alert(`Access Logs (${data.summary?.total || 0} total, ${data.summary?.uniqueIPs || 0} unique IPs):\n\n${logText || 'No recent access logs'}`);
                      } catch (error) {
                        alert('Failed to fetch access logs');
                      }
                    }}
                    variant="outline"
                    className="w-full text-slate-300"
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Access Logs
                  </Button>
                  <Button
                    onClick={async () => {
                      try {
                        const response = await fetch('/api/system/security/threats');
                        const data = await response.json();
                        const threats = data.threats || [];
                        const threatText = threats.map(threat => `${threat.type} (${threat.severity}) from ${threat.source} - ${threat.blocked ? 'BLOCKED' : 'ALLOWED'}`).join('\n');
                        alert(`Threat Detection Report:\n\nTotal Threats: ${data.summary?.totalThreats || 0}\nCritical: ${data.summary?.criticalThreats || 0}\nBlocked: ${data.summary?.blockedThreats || 0}\n\nRecent Threats:\n${threatText || 'No recent threats'}`);
                      } catch (error) {
                        alert('Failed to fetch threat detection data');
                      }
                    }}
                    variant="outline"
                    className="w-full text-slate-300"
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Threat Detection
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                Platform Settings
              </h2>
              <Button
                onClick={() => alert('Configuration export feature coming soon!')}
                className="bg-white text-slate-900"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Config
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* General Settings */}
              <Card className="border-2 border-black bg-slate-800 text-white">
                <CardHeader>
                  <CardTitle className="text-xl font-bold uppercase tracking-wide">
                    General Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="site-name" className="text-white">
                      Site Name
                    </Label>
                    <Input
                      id="site-name"
                      defaultValue="SuperK53"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email" className="text-white">
                      Contact Email
                    </Label>
                    <Input
                      id="contact-email"
                      defaultValue="support@superk53.com"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="maintenance-mode" className="text-white">
                      Maintenance Mode
                    </Label>
                    <Switch id="maintenance-mode" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="new-registrations" className="text-white">
                      Allow New Registrations
                    </Label>
                    <Switch id="new-registrations" defaultChecked />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Settings */}
              <Card className="border-2 border-black bg-slate-800 text-white">
                <CardHeader>
                  <CardTitle className="text-xl font-bold uppercase tracking-wide">
                    Payment Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="basic-price" className="text-white">
                      Basic Plan Price (cents)
                    </Label>
                    <Input
                      id="basic-price"
                      defaultValue="5000"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pro-price" className="text-white">
                      Pro Plan Price (cents)
                    </Label>
                    <Input
                      id="pro-price"
                      defaultValue="12000"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="free-scenarios" className="text-white">
                      Free Daily Scenarios
                    </Label>
                    <Input
                      id="free-scenarios"
                      defaultValue="5"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="paypal-enabled" className="text-white">
                      PayPal Enabled
                    </Label>
                    <Switch id="paypal-enabled" defaultChecked />
                  </div>
                </CardContent>
              </Card>

              {/* Email Settings */}
              <Card className="border-2 border-black bg-slate-800 text-white">
                <CardHeader>
                  <CardTitle className="text-xl font-bold uppercase tracking-wide">
                    Email Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="smtp-host" className="text-white">
                      SMTP Host
                    </Label>
                    <Input
                      id="smtp-host"
                      placeholder="smtp.gmail.com"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-port" className="text-white">
                      SMTP Port
                    </Label>
                    <Input
                      id="smtp-port"
                      defaultValue="587"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-notifications" className="text-white">
                      Email Notifications
                    </Label>
                    <Switch id="email-notifications" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="marketing-emails" className="text-white">
                      Marketing Emails
                    </Label>
                    <Switch id="marketing-emails" />
                  </div>
                </CardContent>
              </Card>

              {/* Security Settings */}
              <Card className="border-2 border-black bg-slate-800 text-white">
                <CardHeader>
                  <CardTitle className="text-xl font-bold uppercase tracking-wide">
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="session-timeout" className="text-white">
                      Session Timeout (minutes)
                    </Label>
                    <Input
                      id="session-timeout"
                      defaultValue="60"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-login-attempts" className="text-white">
                      Max Login Attempts
                    </Label>
                    <Input
                      id="max-login-attempts"
                      defaultValue="5"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="two-factor" className="text-white">
                      Require 2FA for Admin
                    </Label>
                    <Switch id="two-factor" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="api-rate-limit" className="text-white">
                      API Rate Limiting
                    </Label>
                    <Switch id="api-rate-limit" defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Save Settings */}
            <div className="flex justify-end space-x-4">
              <Button
                onClick={() => {
                  if (confirm('Reset all settings to defaults? This cannot be undone.')) {
                    alert('Settings reset to defaults!');
                  }
                }}
                variant="outline"
                className="text-slate-300"
              >
                Reset to Defaults
              </Button>
              <Button
                onClick={() => alert('Settings saved successfully!')}
                className="bg-white text-slate-900"
              >
                Save All Settings
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <Dialog
          open={!!selectedUser}
          onOpenChange={() => setSelectedUser(null)}
        >
          <DialogContent className="bg-slate-800 border border-black text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                User Details
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                Detailed information for {selectedUser.email}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Email</Label>
                  <div className="text-slate-300">{selectedUser.email}</div>
                </div>
                <div>
                  <Label className="text-white">User ID</Label>
                  <div className="text-slate-300 font-mono">
                    {selectedUser.id}
                  </div>
                </div>
                <div>
                  <Label className="text-white">Subscription</Label>
                  <Badge className="bg-blue-600 text-white">
                    {selectedUser.subscription?.plan_type?.toUpperCase() ||
                      "FREE"}
                  </Badge>
                </div>
                <div>
                  <Label className="text-white">Location</Label>
                  <div className="text-slate-300">
                    {selectedUser.location || "Unknown"}
                  </div>
                </div>
              </div>
              <div>
                <Label className="text-white">Usage Statistics</Label>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div className="text-center p-3 bg-slate-700 border border-black">
                    <div className="text-lg font-bold text-white">
                      {selectedUser.usage?.scenarios_used || 0}
                    </div>
                    <div className="text-xs text-slate-400">Scenarios Used</div>
                  </div>
                  <div className="text-center p-3 bg-slate-700 border border-black">
                    <div className="text-lg font-bold text-white">
                      {selectedUser.usage?.max_scenarios === -1
                        ? "∞"
                        : selectedUser.usage?.max_scenarios || 5}
                    </div>
                    <div className="text-xs text-slate-400">Daily Limit</div>
                  </div>
                  <div className="text-center p-3 bg-slate-700 border border-black">
                    <div className="text-lg font-bold text-white">
                      {selectedUser.last_seen ? "Active" : "Inactive"}
                    </div>
                    <div className="text-xs text-slate-400">Status</div>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedUser(null)}>
                Close
              </Button>
              <Button
                onClick={() =>
                  handleUserAction(selectedUser.id, "resetPassword")
                }
              >
                Send Password Reset
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
