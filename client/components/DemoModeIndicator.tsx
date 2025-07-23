import { useState, useEffect } from "react";
import { AlertTriangle, X, Settings, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getEnvironmentStatus } from "@/lib/env";

export function DemoModeIndicator() {
  const [isDismissed, setIsDismissed] = useState(false);
  const [envStatus, setEnvStatus] = useState(() => getEnvironmentStatus());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Refresh environment status
  const refreshEnvironment = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const newStatus = getEnvironmentStatus();
      setEnvStatus(newStatus);
      setIsRefreshing(false);

      // If environment is now valid, auto-dismiss and reload page
      if (newStatus.isValid) {
        setIsDismissed(true);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    }, 1000);
  };

  // Auto-refresh on mount to catch environment changes
  useEffect(() => {
    const timer = setTimeout(() => {
      const newStatus = getEnvironmentStatus();
      setEnvStatus(newStatus);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Only show if environment is not configured and not dismissed
  if (envStatus.isValid || isDismissed) {
    return null;
  }

  return (
    <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-amber-400" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-amber-800">
            Demo Mode Active
          </h3>
          <div className="mt-2 text-sm text-amber-700">
            <p>
              You're experiencing SuperK53 in demo mode. Some features like user accounts,
              progress saving, and premium subscriptions are limited.
            </p>
            {envStatus.missingVars.length > 0 && (
              <p className="mt-2">
                <strong>Missing configuration:</strong> {envStatus.missingVars.join(', ')}
              </p>
            )}
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              className="bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200"
              asChild
            >
              <a
                href="https://github.com/your-repo/superk53#security-setup"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Settings className="h-4 w-4 mr-1" />
                Setup Guide
              </a>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsDismissed(true)}
              className="text-amber-600 hover:text-amber-800"
            >
              <X className="h-4 w-4 mr-1" />
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
