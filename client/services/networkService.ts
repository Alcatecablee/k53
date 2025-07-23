// Network status detection and offline mode handling

interface NetworkStatus {
  isOnline: boolean;
  isSupabaseReachable: boolean;
  lastChecked: Date;
}

class NetworkService {
  private status: NetworkStatus = {
    isOnline: navigator.onLine,
    isSupabaseReachable: false,
    lastChecked: new Date(),
  };

  private listeners: ((status: NetworkStatus) => void)[] = [];

  constructor() {
    // Listen for browser online/offline events
    window.addEventListener("online", this.handleOnline.bind(this));
    window.addEventListener("offline", this.handleOffline.bind(this));

    // Initial Supabase connectivity check
    this.checkSupabaseConnectivity();
  }

  private handleOnline() {
    this.status.isOnline = true;
    this.status.lastChecked = new Date();
    this.checkSupabaseConnectivity();
    this.notifyListeners();
  }

  private handleOffline() {
    this.status.isOnline = false;
    this.status.isSupabaseReachable = false;
    this.status.lastChecked = new Date();
    this.notifyListeners();
  }

  private async checkSupabaseConnectivity() {
    try {
      // Simple connectivity test to Supabase
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(
        "https://lxzwakeusanxquhshcph.supabase.co/rest/v1/",
        {
          method: "HEAD",
          signal: controller.signal,
          mode: "no-cors", // Avoid CORS issues for connectivity test
        },
      );

      clearTimeout(timeoutId);
      this.status.isSupabaseReachable = true;
    } catch (error) {
      console.warn("Supabase connectivity check failed:", error);
      this.status.isSupabaseReachable = false;
    }

    this.status.lastChecked = new Date();
    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => {
      try {
        listener(this.status);
      } catch (error) {
        console.warn("Network status listener error:", error);
      }
    });
  }

  public getStatus(): NetworkStatus {
    return { ...this.status };
  }

  public isOfflineMode(): boolean {
    return !this.status.isOnline || !this.status.isSupabaseReachable;
  }

  public addListener(listener: (status: NetworkStatus) => void) {
    this.listeners.push(listener);

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  public async recheckConnectivity(): Promise<NetworkStatus> {
    await this.checkSupabaseConnectivity();
    return this.getStatus();
  }
}

// Export singleton instance
export const networkService = new NetworkService();

// Helper functions
export const isOfflineMode = () => networkService.isOfflineMode();
export const getNetworkStatus = () => networkService.getStatus();
export const onNetworkChange = (listener: (status: NetworkStatus) => void) =>
  networkService.addListener(listener);
