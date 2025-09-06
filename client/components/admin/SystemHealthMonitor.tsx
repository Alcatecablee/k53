'use client';
import React, { useState, useEffect } from "react";
import {  Card, CardContent, CardHeader, CardTitle  } from '@/components/ui/card';
import {  Button  } from '@/components/ui/button';
import {  Badge  } from '@/components/ui/badge';
import {  Activity, Database, Server, AlertTriangle, CheckCircle, Clock, RefreshCw  } from 'lucide-react';

interface SystemHealth {
  server: {
    status: "healthy" | "warning" | "error";
    responseTime: number;
    uptime: number;
    cpuUsage: number;
    memoryUsage: number;
  };
  database: {
    status: "healthy" | "warning" | "error";
    connections: number;
    queryTime: number;
    size: number;
  };
  storage: {
    status: "healthy" | "warning" | "error";
    used: number;
    total: number;
    available: number;
  };
  lastCheck: string;
}

interface SystemHealthMonitorProps {
  onRefresh?: () => void;
}

export function SystemHealthMonitor({ onRefresh }: SystemHealthMonitorProps) {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchSystemHealth = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/system-health");
      if (response.ok) {
        const data = await response.json();
        setHealth(data);
        setLastUpdate(new Date());
      } else {
        // Handle API endpoint not found or other errors
        console.warn("System health endpoint not available, using fallback data");
        setHealth({
          server: {
            status: "warning",
            responseTime: 0,
            uptime: 0,
            cpuUsage: 0,
            memoryUsage: 0
          },
          database: {
            status: "warning",
            connections: 0,
            queryTime: 0,
            size: 0
          },
          storage: {
            status: "warning",
            used: 0,
            total: 0,
            available: 0
          },
          lastCheck: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error("Failed to fetch system health:", error);
      // Set fallback data on error
      setHealth({
        server: {
          status: "error",
          responseTime: 0,
          uptime: 0,
          cpuUsage: 0,
          memoryUsage: 0
        },
        database: {
          status: "error",
          connections: 0,
          queryTime: 0,
          size: 0
        },
        storage: {
          status: "error",
          used: 0,
          total: 0,
          available: 0
        },
        lastCheck: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (isMounted) {
        await fetchSystemHealth();
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Update every 30 seconds

    return () => {
      isMounted = false;
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-500";
      case "warning":
        return "bg-yellow-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "error":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor(seconds % 86400 / 3600);
    const minutes = Math.floor(seconds % 3600 / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  const formatBytes = (bytes: number) => {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes === 0) return "0 Bytes";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + " " + sizes[i];
  };

  if (loading && !health) {
    return (
      <Card className="bg-slate-800 border-2 border-black">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            System Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-slate-600 rounded"></div>
            <div className="h-4 bg-slate-600 rounded w-3/4"></div>
            <div className="h-4 bg-slate-600 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>);

  }

  return (
    <Card className="bg-slate-800 border-2 border-black">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            System Health
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchSystemHealth}
              disabled={loading}
              className="border-black bg-slate-700 text-white hover:bg-slate-600">
              
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Badge variant="outline" className="text-xs">
              <Clock className="w-3 h-3 mr-1" />
              {lastUpdate.toLocaleTimeString()}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {health ?
        <>
            {/* Server Status */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Server className="w-4 h-4 text-blue-400" />
                  <span className="text-white font-medium">Server</span>
                  {getStatusIcon(health.server?.status || "unknown")}
                </div>
                <Badge className={getStatusColor(health.server?.status || "unknown")}>
                  {(health.server?.status || "unknown").toUpperCase()}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Response Time:</span>
                  <span className="text-white ml-2">{health.server?.responseTime || 0}ms</span>
                </div>
                <div>
                  <span className="text-gray-400">Uptime:</span>
                  <span className="text-white ml-2">{formatUptime(health.server?.uptime || 0)}</span>
                </div>
                <div>
                  <span className="text-gray-400">CPU Usage:</span>
                  <span className="text-white ml-2">{health.server?.cpuUsage || 0}%</span>
                </div>
                <div>
                  <span className="text-gray-400">Memory Usage:</span>
                  <span className="text-white ml-2">{health.server?.memoryUsage || 0}%</span>
                </div>
              </div>
            </div>

            {/* Database Status */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Database className="w-4 h-4 text-green-400" />
                  <span className="text-white font-medium">Database</span>
                  {getStatusIcon(health.database?.status || "unknown")}
                </div>
                <Badge className={getStatusColor(health.database?.status || "unknown")}>
                  {(health.database?.status || "unknown").toUpperCase()}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Connections:</span>
                  <span className="text-white ml-2">{health.database?.connections || 0}</span>
                </div>
                <div>
                  <span className="text-gray-400">Query Time:</span>
                  <span className="text-white ml-2">{health.database?.queryTime || 0}ms</span>
                </div>
                <div>
                  <span className="text-gray-400">Size:</span>
                  <span className="text-white ml-2">{formatBytes(health.database?.size || 0)}</span>
                </div>
              </div>
            </div>

            {/* Storage Status */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-purple-400" />
                  <span className="text-white font-medium">Storage</span>
                  {getStatusIcon(health.storage?.status || "unknown")}
                </div>
                <Badge className={getStatusColor(health.storage?.status || "unknown")}>
                  {(health.storage?.status || "unknown").toUpperCase()}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Used:</span>
                  <span className="text-white">{formatBytes(health.storage?.used || 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Available:</span>
                  <span className="text-white">{formatBytes(health.storage?.available || 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total:</span>
                  <span className="text-white">{formatBytes(health.storage?.total || 0)}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{
                    width: `${health.storage?.total ? (health.storage?.used || 0) / health.storage.total * 100 : 0}%`
                  }}>
                </div>
                </div>
              </div>
            </div>
          </> :

        <div className="text-center text-gray-400">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
            <p>Unable to fetch system health data</p>
          </div>
        }
      </CardContent>
    </Card>);

}
