import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import RFPQuoteLog from "./pages/RFPQuoteLog";
import RFPDetail from "./pages/RFPDetail";
import EmailIntake from "./pages/EmailIntake";
import EmailDetail from "./pages/EmailDetail";
import DocumentUpload from "./pages/DocumentUpload";
import CensusProcessing from "./pages/CensusProcessing";
import PlanDesign from "./pages/PlanDesign";
import RatingEngine from "./pages/RatingEngine";
import AIUnderwriting from "./pages/AIUnderwriting";
import Proposals from "./pages/Proposals";
import PolicyAdmin from "./pages/PolicyAdmin";
import Renewals from "./pages/Renewals";
import Analytics from "./pages/Analytics";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/rfps" element={<RFPQuoteLog />} />
            <Route path="/rfps/new" element={<RFPDetail />} />
            <Route path="/rfps/:id" element={<RFPDetail />} />
            <Route path="/email-intake" element={<EmailIntake />} />
            <Route path="/email-intake/:id" element={<EmailDetail />} />
            <Route path="/documents" element={<DocumentUpload />} />
            <Route path="/census" element={<CensusProcessing />} />
            <Route path="/plan-design" element={<PlanDesign />} />
            <Route path="/rating" element={<RatingEngine />} />
            <Route path="/proposals" element={<Proposals />} />
            <Route path="/policies" element={<PolicyAdmin />} />
            <Route path="/renewals" element={<Renewals />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
