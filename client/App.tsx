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
import Index from "./pages/Index";
import Practice from "./pages/Practice";
import Progress from "./pages/Progress";
import Profile from "./pages/Profile";
import Pricing from "./pages/Pricing";
import DLTC from "./pages/DLTC";
import Documentation from "./pages/Documentation";
import AdminNew from "./pages/AdminNew";
import AdminPro from "./pages/AdminPro";
import NotFound from "./pages/NotFound";
import { addResourceHints } from "./utils/seoUtils";

const queryClient = new QueryClient();

// Initialize SEO resource hints
if (typeof window !== "undefined") {
  addResourceHints();
}

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <OfflineIndicator />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/practice" element={<Practice />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/dltc" element={<DLTC />} />
              <Route path="/docs" element={<Documentation />} />
              <Route path="/admin" element={<AdminPro />} />
              <Route path="/admin-old" element={<AdminNew />} />
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
