import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PersonaProvider } from "@/contexts/PersonaContext";
import { AppLayout } from "@/components/layout/AppLayout";

// Kept pages
import Dashboard from "./pages/Dashboard";
import PipelineDashboard from "./pages/PipelineDashboard";
import RFPQuoteLog from "./pages/RFPQuoteLog";
import EmailIntake from "./pages/EmailIntake";
import EmailDetail from "./pages/EmailDetail";
import FactorLookup from "./pages/FactorLookup";
import RatingManualManager from "./pages/RatingManualManager";
import PolicyAdmin from "./pages/PolicyAdmin";
import Analytics from "./pages/Analytics";
import CarrierCapacity from "./pages/CarrierCapacity";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

// NEW: The Quote Workspace (replaces 12+ standalone pages)
import QuoteWorkspace from "./pages/QuoteWorkspace";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <PersonaProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppLayout>
            <Routes>
              {/* Home & Pipeline */}
              <Route path="/" element={<Dashboard />} />
              <Route path="/pipeline" element={<PipelineDashboard />} />

              {/* Quote List & Workspace */}
              <Route path="/rfps" element={<RFPQuoteLog />} />
              <Route path="/quote/new" element={<QuoteWorkspace />} />
              <Route path="/quote/:id" element={<QuoteWorkspace />} />

              {/* Email Intake (standalone) */}
              <Route path="/email-intake" element={<EmailIntake />} />
              <Route path="/email-intake/:id" element={<EmailDetail />} />

              {/* UW Reference Tools (standalone) */}
              <Route path="/factor-lookup" element={<FactorLookup />} />

              {/* Policy List (standalone) */}
              <Route path="/policies" element={<PolicyAdmin />} />

              {/* Analytics & Admin (standalone) */}
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/carrier-capacity" element={<CarrierCapacity />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/rating-manuals" element={<RatingManualManager />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </PersonaProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
