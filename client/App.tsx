import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { PWAInstaller } from "@/components/PWAInstaller";
import { PWAStatus } from "@/components/PWAStatus";
import { SkipToMainContent, LiveRegion } from "@/components/ui/accessibility";
import { ScrollToTop } from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Practice from "./pages/Practice";
import Progress from "./pages/Progress";
import Profile from "./pages/Profile";
import Pricing from "./pages/Pricing";
import DLTC from "./pages/DLTC";
import Documentation from "./pages/Documentation";
import AdminNew from "./pages/AdminNew";
import AdminPro from "./pages/AdminPro";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import { addResourceHints } from "./utils/seoUtils";

const queryClient = new QueryClient();

// Initialize SEO resource hints
if (typeof window !== "undefined") {
  addResourceHints();

  // Global error handler for unhandled fetch failures
  window.addEventListener("unhandledrejection", (event) => {
    if (
      event.reason?.message?.includes("Failed to fetch") ||
      event.reason?.name === "TypeError" ||
      (event.reason?.stack && event.reason.stack.includes("AdminPro"))
    ) {
      console.warn(
        "Unhandled fetch error caught and suppressed:",
        event.reason,
      );
      event.preventDefault(); // Prevent the error from being thrown
    }
  });

  // Enhanced error tracking for AdminPro
  window.addEventListener("error", (event) => {
    if (
      event.error?.message?.includes("Failed to fetch") ||
      event.filename?.includes("AdminPro")
    ) {
      console.warn("AdminPro error caught and suppressed:", event.error);
      event.preventDefault();
    }
  });
}

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <OfflineIndicator />
          <PWAInstaller />
          <SkipToMainContent />
          <LiveRegion aria-live="polite">
            <div id="live-announcements" />
          </LiveRegion>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/practice" element={<Practice />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/dltc" element={<DLTC />} />
              <Route path="/docs" element={<Documentation />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin-old" element={<AdminNew />} />
              <Route path="/admin-pro" element={<AdminPro />} />
              <Route path="/pwa-status" element={<PWAStatus />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

const container = document.getElementById("root")!;

// Check if root is already created to avoid React 18 warning
if (!(container as any)._reactRoot) {
  (container as any)._reactRoot = createRoot(container);
}

(container as any)._reactRoot.render(<App />);
