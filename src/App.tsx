import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { ThemeProvider } from "next-themes";
import Home from "./pages/Home";
import Directory from "./pages/Directory";
import DevProfile from "./pages/DevProfile";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import { ProtectedAdminRoute } from "./components/ProtectedAdminRoute";
import { AdminDashboard } from "./pages/admin/Dashboard";
import { CandidatesManagement } from "./pages/admin/CandidatesManagement";

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const location = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [location.pathname]);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/directory" element={<Directory />} />
            <Route path="/dev/:id" element={<DevProfile />} />

            {/* Legacy redirects — public auth retired */}
            <Route path="/candidates" element={<Navigate to="/directory" replace />} />
            <Route path="/profile/:id" element={<LegacyProfileRedirect />} />
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/signup" element={<Navigate to="/" replace />} />
            <Route path="/profile" element={<Navigate to="/" replace />} />
            <Route path="/about" element={<Navigate to="/" replace />} />
            <Route path="/contact" element={<Navigate to="/" replace />} />

            {/* Admin */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
            <Route path="/admin/candidates" element={<ProtectedAdminRoute><CandidatesManagement /></ProtectedAdminRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

// Translate old /profile/:id → /dev/:id
import { useParams } from "react-router-dom";
const LegacyProfileRedirect = () => {
  const { id } = useParams();
  return <Navigate to={`/dev/${id}`} replace />;
};

export default App;
