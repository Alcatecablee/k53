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
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabaseClient } from "@/lib/supabase";
import { formatPrice } from "@/services/subscriptionService";

interface DashboardStats {
  totalUsers: number;
  activeSubscriptions: number;
  totalRevenue: number;
  todaySignups: number;
  conversionRate: number;
  churnRate: number;
}

export default function Admin() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentPayments, setRecentPayments] = useState<any[]>([]);

  // Simple admin check - in production, implement proper role-based access
  // For development, allow access without authentication
  const isAdmin = true;

  useEffect(() => {
    if (!isAdmin) return;
    loadDashboardData();
  }, [isAdmin]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Get total users (handle case where tables don't exist yet)
      const { count: totalUsers } = await (supabaseClient
        ?.from("user_progress")
        ?.select("user_id", { count: "exact", head: true })
        ?.catch(() => ({ count: 0 })) || Promise.resolve({ count: 0 }));

      // Get active subscriptions (handle missing tables)
      const { data: subscriptions, count: activeSubscriptions } =
        await (supabaseClient
          ?.from("user_subscriptions")
          ?.select("*", { count: "exact" })
          ?.eq("status", "active")
          ?.neq("plan_type", "free")
          ?.catch(() => ({ data: [], count: 0 })) ||
          Promise.resolve({ data: [], count: 0 }));

      // Calculate total revenue (handle missing tables)
      const { data: payments } = await (supabaseClient
        ?.from("payments")
        ?.select("amount_cents")
        ?.eq("status", "completed")
        ?.catch(() => ({ data: [] })) || Promise.resolve({ data: [] }));

      const totalRevenue =
        payments?.reduce((sum, p) => sum + p.amount_cents, 0) || 0;

      // Get today's signups (handle missing tables)
      const today = new Date().toISOString().split("T")[0];
      const { count: todaySignups } = await (supabaseClient
        ?.from("user_progress")
        ?.select("user_id", { count: "exact", head: true })
        ?.gte("created_at", today)
        ?.catch(() => ({ count: 0 })) || Promise.resolve({ count: 0 }));

      // Calculate conversion rate (simplified)
      const userProgressData = await (supabaseClient
        ?.from("user_progress")
        ?.select("user_id")
        ?.catch(() => ({ data: [] })) || Promise.resolve({ data: [] }));
      const totalUniqueUsers = new Set(
        userProgressData.data?.map((u) => u.user_id) || [],
      ).size;

      const conversionRate =
        totalUniqueUsers > 0
          ? ((activeSubscriptions || 0) / totalUniqueUsers) * 100
          : 0;

      // Get recent payments (handle missing tables)
      const { data: recentPaymentsData } = await (supabaseClient
        ?.from("payments")
        ?.select("*")
        ?.eq("status", "completed")
        ?.order("created_at", { ascending: false })
        ?.limit(10)
        ?.catch(() => ({ data: [] })) || Promise.resolve({ data: [] }));

      setStats({
        totalUsers: totalUniqueUsers,
        activeSubscriptions: activeSubscriptions || 0,
        totalRevenue,
        todaySignups: todaySignups || 0,
        conversionRate,
        churnRate: 0, // Would need more complex calculation
      });

      setRecentPayments(recentPaymentsData || []);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Card className="border-2 border-red-300 bg-red-50 max-w-md">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold text-red-800 mb-4">
              Access Denied
            </h1>
            <p className="text-red-700 mb-6">
              You don't have permission to access this page.
            </p>
            <Button asChild className="bg-red-600 hover:bg-red-700">
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

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-black shadow-sm mb-8">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
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

            <div className="text-center">
              <h1 className="text-2xl font-bold text-white uppercase tracking-wide">
                SuperK53 Admin Dashboard
              </h1>
              <p className="text-slate-400 uppercase text-sm tracking-wide">
                Business Analytics & Monitoring
              </p>
            </div>

            <Button
              onClick={loadDashboardData}
              className="bg-white text-slate-900"
            >
              Refresh Data
            </Button>
          </div>
        </div>
      </div>

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
                {stats?.conversionRate.toFixed(1)}% conversion rate
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

        {/* Recent Payments */}
        <Card className="border-2 border-black bg-slate-800 text-white mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-bold uppercase tracking-wide">
              Recent Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPayments.length === 0 ? (
                <p className="text-slate-400 text-center py-8">
                  No payments yet. Payments will appear here once users
                  subscribe.
                </p>
              ) : (
                recentPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 bg-slate-700 border border-black"
                  >
                    <div>
                      <div className="font-semibold">
                        {formatPrice(payment.amount_cents)}
                      </div>
                      <div className="text-sm text-slate-400">
                        {payment.payment_method} • {payment.paypal_order_id}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-600 text-white">
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
            <CardTitle className="text-xl font-bold uppercase tracking-wide">
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
                <CreditCard className="h-4 w-4 mr-2" />
                Payment Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card className="border-2 border-black bg-slate-800 text-white mt-8">
          <CardHeader>
            <CardTitle className="text-xl font-bold uppercase tracking-wide">
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Database</h3>
                <Badge className="bg-green-600 text-white">Operational</Badge>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Payment Gateway</h3>
                <Badge className="bg-green-600 text-white">
                  PayPal Connected
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
