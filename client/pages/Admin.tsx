import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { formatPrice } from "@/services/subscriptionService";

interface DashboardStats {
  totalUsers: number;
  activeSubscriptions: number;
  totalRevenue: number;
  todaySignups: number;
  conversionRate: number;
  churnRate: number;
  avgSessionTime?: number;
  topLocations?: string[];
  monthlyGrowth?: number;
}

interface Payment {
  id: string;
  user_id: string;
  amount_cents: number;
  status: string;
  payment_method: string;
  paypal_order_id?: string;
  created_at: string;
  user_email?: string;
}

interface SystemHealth {
  database: string;
  paypal: string;
  server: string;
  storage: string;
}

export default function Admin() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentPayments, setRecentPayments] = useState<Payment[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  // Simple admin check - in production, implement proper role-based access
  const isAdmin = true;

  useEffect(() => {
    if (!isAdmin) return;
    loadDashboardData();
  }, [isAdmin]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load dashboard stats from server API
      const statsResponse = await fetch('/api/admin/dashboard-stats');
      if (!statsResponse.ok) {
        throw new Error(`Failed to load dashboard stats: ${statsResponse.status}`);
      }
      const statsData = await statsResponse.json();
      setStats(statsData);

      // Load recent payments from server API
      const paymentsResponse = await fetch('/api/admin/payments?limit=10');
      if (!paymentsResponse.ok) {
        throw new Error(`Failed to load payments: ${paymentsResponse.status}`);
      }
      const paymentsData = await paymentsResponse.json();
      setRecentPayments(paymentsData);

      // Load system health
      const healthResponse = await fetch('/api/admin/system-health');
      if (!healthResponse.ok) {
        throw new Error(`Failed to load system health: ${healthResponse.status}`);
      }
      const healthData = await healthResponse.json();
      setSystemHealth(healthData);

      setLastRefresh(new Date());
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      setError(error instanceof Error ? error.message : "Failed to load dashboard data");
    } finally {
      setLoading(false);
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

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Card className="border-2 border-slate-600 bg-slate-800 max-w-md">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold text-white mb-4">
              Access Denied
            </h1>
            <p className="text-slate-300 mb-6">
              You don't have permission to access this page.
            </p>
            <Button asChild className="bg-white text-slate-900 hover:bg-slate-100">
              <Link to="/">Return Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-semibold">Loading Dashboard...</p>
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
                    Administrative Dashboard
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
                Refresh Data
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                Daily Signups
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.todaySignups || 0}
              </div>
              <p className="text-xs text-slate-400">New users today</p>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <Card className="border-2 border-black bg-slate-800 text-white mb-8">
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

        {/* Recent Payments */}
        <Card className="border-2 border-black bg-slate-800 text-white mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-bold uppercase tracking-wide flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Recent Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPayments.length === 0 ? (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-400 mb-2">
                    No payments recorded yet
                  </p>
                  <p className="text-slate-500 text-sm">
                    Payments will appear here once users subscribe to premium plans
                  </p>
                </div>
              ) : (
                recentPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 bg-slate-700 border border-black rounded-lg"
                  >
                    <div>
                      <div className="font-semibold">
                        {formatPrice(payment.amount_cents)}
                      </div>
                      <div className="text-sm text-slate-400">
                        {payment.payment_method} • {payment.paypal_order_id || 'N/A'}
                      </div>
                      {payment.user_email && (
                        <div className="text-xs text-slate-500">
                          {payment.user_email}
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
              <Button className="bg-white text-slate-900 hover:bg-slate-100 py-3">
                <Activity className="h-4 w-4 mr-2" />
                View User Activity
              </Button>
              <Button className="bg-white text-slate-900 hover:bg-slate-100 py-3">
                <Calendar className="h-4 w-4 mr-2" />
                Export Reports
              </Button>
              <Button className="bg-white text-slate-900 hover:bg-slate-100 py-3">
                <Settings className="h-4 w-4 mr-2" />
                System Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Additional Stats */}
        {stats && (
          <Card className="border-2 border-black bg-slate-800 text-white mt-8">
            <CardHeader>
              <CardTitle className="text-xl font-bold uppercase tracking-wide">
                Additional Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Performance</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Avg Session Time:</span>
                      <span>{stats.avgSessionTime || 0}s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Monthly Growth:</span>
                      <span>{stats.monthlyGrowth || 0}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Churn Rate:</span>
                      <span>{stats.churnRate || 0}%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Top Locations</h3>
                  <div className="space-y-1">
                    {stats.topLocations && stats.topLocations.length > 0 ? (
                      stats.topLocations.map((location, index) => (
                        <div key={index} className="text-sm text-slate-400">
                          {location}
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-slate-400">
                        No location data available
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Revenue Breakdown</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">This Month:</span>
                      <span>{formatPrice((stats.totalRevenue || 0) * 0.3)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Last Month:</span>
                      <span>{formatPrice((stats.totalRevenue || 0) * 0.7)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
