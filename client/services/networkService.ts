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
      // Check basic connectivity by testing if we can reach the domain
      // Using a simple GET request to avoid CORS and auth issues
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      // Check if we're online first
      if (!navigator.onLine) {
        this.status.isSupabaseReachable = false;
        this.status.lastChecked = new Date();
        this.notifyListeners();
        return;
      }

      // Use a lightweight connectivity test
      // Test DNS resolution and basic network connectivity
      const testUrl = "https://www.google.com/favicon.ico";
      const response = await fetch(testUrl, {
        method: "HEAD",
        signal: controller.signal,
        mode: "no-cors", // This is fine for general connectivity
      });

      clearTimeout(timeoutId);
      
      // If we can reach the internet, assume Supabase is reachable
      // The actual Supabase client will handle auth and connection issues
      this.status.isSupabaseReachable = true;
      
    } catch (error) {
      console.warn("Connectivity check failed:", error);
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
