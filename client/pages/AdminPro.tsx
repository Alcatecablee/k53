import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  RefreshCw,
  Bell,
  BookOpen,
  Monitor,
  Database,
  Shield,
  Plus,
  AlertTriangle,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  Search,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { formatPrice } from "@/services/subscriptionService";

// Import our enterprise components
import { MetricChart, RealTimeMetric, ActivityFeed, ProgressRing } from "@/components/admin/Charts";
import { DataTable, DataTableColumn, StatusBadge } from "@/components/admin/DataTable";
import { UserDetailModal, SystemLogModal } from "@/components/admin/AdvancedModal";
import { FileUpload, CSVUpload } from "@/components/admin/FileUpload";

// Enhanced interfaces for enterprise data
interface EnhancedDashboardStats {
  totalUsers: number;
  activeSubscriptions: number;
  totalRevenue: number;
  todaySignups: number;
  conversionRate: number;
  churnRate: number;
  avgSessionTime: number;
  topLocations: Array<{ city: string; count: number }>;
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

export default function AdminPro() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState<EnhancedDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<EnhancedUser[]>([]);
  const [payments, setPayments] = useState<EnhancedPayment[]>([]);
  const [selectedUser, setSelectedUser] = useState<EnhancedUser | null>(null);
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [logType, setLogType] = useState<'database' | 'error' | 'access' | 'security'>('database');
  const [realTimeData, setRealTimeData] = useState<any[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Check if user has admin privileges
  const isAdmin = user?.email === "admin@superk53.com" || process.env.NODE_ENV === "development";

  // Enhanced data loading with real-time updates
  useEffect(() => {
    if (!isAdmin) return;
    loadAllData();
    
    if (autoRefresh) {
      const interval = setInterval(loadRealTimeData, 5000);
      return () => clearInterval(interval);
    }
  }, [isAdmin, autoRefresh]);

  const loadAllData = async () => {
    setLoading(true);
    await Promise.all([
      loadDashboardData(),
      loadUsers(),
      loadPayments(),
      loadRealTimeData(),
    ]);
    setLoading(false);
  };

  const loadDashboardData = async () => {
    try {
      const response = await fetch("/api/enterprise/dashboard-stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await fetch("/api/enterprise/users?limit=100");
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  const loadPayments = async () => {
    try {
      const response = await fetch("/api/enterprise/payments?limit=100");
      if (response.ok) {
        const data = await response.json();
        setPayments(data);
      }
    } catch (error) {
      console.error("Error loading payments:", error);
    }
  };

  const loadRealTimeData = async () => {
    try {
      const response = await fetch("/api/enterprise/realtime-metrics");
      if (response.ok) {
        const data = await response.json();
        setRealTimeData(data.metrics || []);
      }
    } catch (error) {
      console.error("Error loading real-time data:", error);
    }
  };

  // Enhanced user table columns
  const userColumns: DataTableColumn<EnhancedUser>[] = [
    {
      key: 'email',
      title: 'User',
      sortable: true,
      render: (email, user) => (
        <div>
          <div className="font-medium text-gray-900">{email}</div>
          <div className="text-sm text-gray-500">
            Joined {new Date(user.created_at).toLocaleDateString()}
          </div>
        </div>
      ),
    },
    {
      key: 'subscription.plan_type',
      title: 'Plan',
      sortable: true,
      filterable: true,
      render: (_, user) => (
        <StatusBadge 
          status={user.subscription?.plan_type || 'free'}
          variant={
            user.subscription?.plan_type === 'pro' ? 'success' :
            user.subscription?.plan_type === 'basic' ? 'info' : 'warning'
          }
        />
      ),
    },
    {
      key: 'totalSpent',
      title: 'Total Spent',
      sortable: true,
      render: (value) => formatPrice(value),
    },
    {
      key: 'sessionsToday',
      title: 'Sessions Today',
      sortable: true,
      align: 'center' as const,
    },
    {
      key: 'riskScore',
      title: 'Risk Score',
      sortable: true,
      render: (score) => (
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            score < 30 ? 'bg-green-400' :
            score < 70 ? 'bg-yellow-400' : 'bg-red-400'
          }`} />
          <span>{score}</span>
        </div>
      ),
    },
    {
      key: 'location',
      title: 'Location',
      sortable: true,
      filterable: true,
    },
  ];

  // Enhanced payment table columns
  const paymentColumns: DataTableColumn<EnhancedPayment>[] = [
    {
      key: 'id',
      title: 'Payment ID',
      render: (id) => (
        <span className="font-mono text-sm">{id.substring(0, 8)}...</span>
      ),
    },
    {
      key: 'user_email',
      title: 'Customer',
      sortable: true,
    },
    {
      key: 'amount_cents',
      title: 'Amount',
      sortable: true,
      render: (amount) => formatPrice(amount),
    },
    {
      key: 'fee_cents',
      title: 'Fee',
      sortable: true,
      render: (fee) => formatPrice(fee),
    },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      filterable: true,
      render: (status) => <StatusBadge status={status} />,
    },
    {
      key: 'country',
      title: 'Country',
      sortable: true,
      filterable: true,
    },
    {
      key: 'created_at',
      title: 'Date',
      sortable: true,
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ];

  // Activity feed data
  const activityItems = [
    {
      id: '1',
      type: 'user' as const,
      title: 'New user registration',
      description: 'john.doe@example.com signed up for Pro plan',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      severity: 'success' as const,
    },
    {
      id: '2',
      type: 'payment' as const,
      title: 'Payment processed',
      description: 'R120 payment completed successfully',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      severity: 'success' as const,
    },
    {
      id: '3',
      type: 'system' as const,
      title: 'Database backup completed',
      description: 'Automatic backup completed successfully',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      severity: 'info' as const,
    },
    {
      id: '4',
      type: 'system' as const,
      title: 'High CPU usage detected',
      description: 'Server CPU usage exceeded 85% threshold',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      severity: 'warning' as const,
    },
  ];

  // CSV upload handler
  const handleCSVUpload = async (data: any[]) => {
    console.log('Importing CSV data:', data);
    // Here you would send the data to your API
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing
    alert(`Successfully imported ${data.length} records!`);
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Card className="border border-red-200 bg-white max-w-md shadow-lg">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
              <Link to="/">Return Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Enhanced Header */}
      <div className="bg-slate-800 border-b border-slate-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button asChild variant="ghost" className="text-slate-300 hover:text-white">
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Portal
              </Link>
            </Button>

            <div className="text-center">
              <h1 className="text-2xl font-bold text-white">SuperK53 Admin Pro</h1>
              <p className="text-slate-400 text-sm">Enterprise Management Console</p>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                onClick={() => setAutoRefresh(!autoRefresh)}
                variant="outline"
                className={`border-slate-600 ${autoRefresh ? 'text-green-400' : 'text-slate-400'}`}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
                Auto-refresh
              </Button>
              <Button
                onClick={loadAllData}
                variant="outline"
                className="border-slate-600 text-slate-300"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Bell className="h-4 w-4 mr-2" />
                Alerts ({activityItems.filter(item => item.severity === 'warning').length})
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Enhanced Tab Navigation */}
          <TabsList className="grid w-full grid-cols-6 bg-slate-800 border border-slate-700">
            <TabsTrigger value="overview" className="text-slate-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <TrendingUp className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="text-slate-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="payments" className="text-slate-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <CreditCard className="h-4 w-4 mr-2" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="content" className="text-slate-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <BookOpen className="h-4 w-4 mr-2" />
              Content
            </TabsTrigger>
            <TabsTrigger value="system" className="text-slate-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Monitor className="h-4 w-4 mr-2" />
              System
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-slate-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Enhanced Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Real-time Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <RealTimeMetric
                title="Total Users"
                value={stats?.totalUsers || 0}
                change={stats?.monthlyGrowth || 0}
                trend="up"
                subtitle={`+${stats?.todaySignups || 0} today`}
              />
              <RealTimeMetric
                title="Revenue"
                value={stats?.totalRevenue || 0}
                change={15.2}
                trend="up"
                format="currency"
                subtitle="This month"
              />
              <RealTimeMetric
                title="Active Now"
                value={stats?.realtimeUsers || 0}
                change={8.5}
                trend="up"
                subtitle="Real-time users"
              />
              <RealTimeMetric
                title="Response Time"
                value={stats?.responseTime || 0}
                change={-12.3}
                trend="down"
                format="time"
                subtitle="Average latency"
              />
            </div>

            {/* Interactive Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MetricChart
                data={realTimeData}
                title="Real-time User Activity"
                type="area"
                height={300}
                color="#3B82F6"
                dataKey="users"
              />
              <MetricChart
                data={realTimeData}
                title="Revenue Trend"
                type="line"
                height={300}
                color="#10B981"
                dataKey="revenue"
              />
            </div>

            {/* Performance Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ActivityFeed items={activityItems} title="Live Activity Feed" />
              </div>
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">CPU Usage</span>
                      <ProgressRing 
                        progress={stats?.serverLoad || 0} 
                        size={60} 
                        color={stats?.serverLoad && stats.serverLoad > 80 ? "#EF4444" : "#10B981"}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Error Rate</span>
                      <span className={`text-lg font-bold ${
                        (stats?.errorRate || 0) > 3 ? 'text-red-600' : 'text-green-600'
                      }`}>
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
            <DataTable
              data={users}
              columns={userColumns}
              title="User Management"
              searchable={true}
              exportable={true}
              pageSize={15}
              onView={(user) => setSelectedUser(user)}
              onEdit={(user) => console.log('Edit user:', user)}
              onDelete={(user) => console.log('Delete user:', user)}
              loading={loading}
            />
          </TabsContent>

          {/* Enhanced Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <DataTable
              data={payments}
              columns={paymentColumns}
              title="Payment Management"
              searchable={true}
              exportable={true}
              pageSize={20}
              onView={(payment) => console.log('View payment:', payment)}
              loading={loading}
            />
          </TabsContent>

          {/* Enhanced Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    Content Import
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CSVUpload
                    onComplete={handleCSVUpload}
                    onError={(error) => alert(`Upload error: ${error}`)}
                  />
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    Content Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MetricChart
                    data={[
                      { name: 'Questions', value: 1247 },
                      { name: 'Scenarios', value: 224 },
                      { name: 'Study Materials', value: 89 },
                      { name: 'Videos', value: 156 },
                    ]}
                    title=""
                    type="pie"
                    height={250}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Enhanced System Tab */}
          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Button
                onClick={() => {
                  setLogType('database');
                  setLogModalOpen(true);
                }}
                className="h-24 bg-blue-600 hover:bg-blue-700 text-white flex flex-col items-center justify-center"
              >
                <Database className="h-8 w-8 mb-2" />
                Database Logs
              </Button>
              <Button
                onClick={() => {
                  setLogType('error');
                  setLogModalOpen(true);
                }}
                className="h-24 bg-red-600 hover:bg-red-700 text-white flex flex-col items-center justify-center"
              >
                <AlertTriangle className="h-8 w-8 mb-2" />
                Error Logs
              </Button>
              <Button
                onClick={() => {
                  setLogType('security');
                  setLogModalOpen(true);
                }}
                className="h-24 bg-purple-600 hover:bg-purple-700 text-white flex flex-col items-center justify-center"
              >
                <Shield className="h-8 w-8 mb-2" />
                Security Logs
              </Button>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">
                  System Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Advanced configuration options coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Advanced Modals */}
      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          onSave={async (user) => {
            console.log('Saving user:', user);
            // Here you would call your API to save the user
          }}
        />
      )}

      <SystemLogModal
        isOpen={logModalOpen}
        onClose={() => setLogModalOpen(false)}
        logType={logType}
      />
    </div>
  );
}
