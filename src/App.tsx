import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Console from "./pages/Console";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import { ProtectedAdminRoute } from "./components/ProtectedAdminRoute";
import { AdminDashboard } from "./pages/admin/Dashboard";
import { CandidatesManagement } from "./pages/admin/CandidatesManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Console />} />
            <Route path="/dev/:id" element={<Console />} />

            {/* Legacy redirects */}
            <Route path="/directory" element={<Navigate to="/" replace />} />
            <Route path="/candidates" element={<Navigate to="/" replace />} />
            <Route path="/profile/:id" element={<Navigate to="/" replace />} />
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

export default App;
