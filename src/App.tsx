import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import CreateInterview from "./pages/CreateInterview";
import ScheduledInterview from "./pages/ScheduledInterview";
import InterviewDetail from "./pages/InterviewDetail";
import CandidateInterview from "./pages/interview/CandidateInterview";
import { DashboardLayout } from "./components/DashboardLayout";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

import Billing from "./pages/Billing";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/interview/:id" element={<CandidateInterview />} />
            <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/create-interview" element={<CreateInterview />} />
              <Route path="/scheduled" element={<ScheduledInterview />} />
              <Route path="/interview-detail/:id" element={<InterviewDetail />} />
              <Route path="/interviews" element={<Dashboard />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
