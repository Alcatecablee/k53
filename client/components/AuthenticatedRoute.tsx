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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-black-800 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-semibold uppercase tracking-wide">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!user && !offlineMode) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-4">
          <Auth onAuthSuccess={() => window.location.reload()} />

          {showOfflineOption && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader className="text-center pb-3">
                <div className="w-12 h-12 bg-orange-100 border-2 border-orange-300 flex items-center justify-center mx-auto mb-2">
                  <WifiOff className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle className="text-orange-800 text-lg">
                  Connection Issues?
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-orange-700 text-sm mb-4">
                  Having trouble connecting? You can still practice offline with
                  limited features.
                </p>
                <Button
                  onClick={() => setOfflineMode(true)}
                  variant="outline"
                  className="w-full border-orange-300 text-orange-700 hover:bg-orange-100"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Continue in Offline Mode
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
