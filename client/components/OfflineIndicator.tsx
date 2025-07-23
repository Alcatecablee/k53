import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { WifiOff, Wifi, AlertTriangle } from "lucide-react";
import { onNetworkChange, getNetworkStatus } from "@/services/networkService";

export function OfflineIndicator() {
  const [networkStatus, setNetworkStatus] = useState(getNetworkStatus());

  useEffect(() => {
    const unsubscribe = onNetworkChange((status) => {
      setNetworkStatus(status);
    });

    return unsubscribe;
  }, []);

  if (networkStatus.isOnline && networkStatus.isSupabaseReachable) {
    return null; // Don't show indicator when everything is working
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <Badge
        variant="outline"
        className={`
          ${
            !networkStatus.isOnline
              ? "bg-red-100 text-red-800 border-red-300"
              : "bg-yellow-100 text-yellow-800 border-yellow-300"
          }
          px-3 py-2 shadow-lg
        `}
      >
        <div className="flex items-center space-x-2">
          {!networkStatus.isOnline ? (
            <WifiOff className="h-4 w-4" />
          ) : (
            <AlertTriangle className="h-4 w-4" />
          )}
          <span className="text-sm font-medium">
            {!networkStatus.isOnline ? "Offline Mode" : "Limited Connectivity"}
          </span>
        </div>
      </Badge>
    </div>
  );
}
