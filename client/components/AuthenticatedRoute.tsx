import { ReactNode, useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Auth } from "@/components/Auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, WifiOff } from "lucide-react";

interface AuthenticatedRouteProps {
  children: ReactNode;
}

export function AuthenticatedRoute({ children }: AuthenticatedRouteProps) {
  const { user, loading } = useAuth();
  const [showOfflineOption, setShowOfflineOption] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);

  useEffect(() => {
    // Show offline option after 3 seconds if still loading or no user
    const timer = setTimeout(() => {
      if (!user) {
        setShowOfflineOption(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [user]);

  if (loading && !showOfflineOption) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300 font-semibold uppercase tracking-wide">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!user && !offlineMode) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-4">
          <Auth onAuthSuccess={() => window.location.reload()} />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
