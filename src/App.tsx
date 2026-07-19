import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Landing from "./pages/Landing";
import Talent from "./pages/Talent";
import CandidateProfile from "./pages/CandidateProfile";
import Compare from "./pages/Compare";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import { ProtectedAdminRoute } from "./components/ProtectedAdminRoute";
import { AdminDashboard } from "./pages/admin/Dashboard";
import { CandidatesManagement } from "./pages/admin/CandidatesManagement";
import { CandidatesImport } from "./pages/admin/CandidatesImport";
import { RolesManagement } from "./pages/admin/RolesManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/talent" element={<Talent />} />
            <Route path="/talent/:id" element={<CandidateProfile />} />
            <Route path="/compare" element={<Compare />} />

            {/* Legacy redirects */}
            <Route path="/dev/:id" element={<LegacyDevRedirect />} />
            <Route path="/directory" element={<Navigate to="/talent" replace />} />
            <Route path="/candidates" element={<Navigate to="/talent" replace />} />
            <Route path="/profile/:id" element={<Navigate to="/talent" replace />} />
            <Route path="/login" element={<Navigate to="/admin/login" replace />} />
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

// Preserve deep links from the old /dev/:id scheme.
import { useParams } from "react-router-dom";
const LegacyDevRedirect = () => {
  const { id } = useParams();
  return <Navigate to={`/talent/${id ?? ""}`} replace />;
};

export default App;
