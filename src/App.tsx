import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
 import LandingPage from "./pages/Landing";
import MapDiscoverPage from "./pages/MapDiscover";
import SwipeMatchPage from "./pages/SwipeMatch";
import MyVolunteeringPage from "./pages/MyVolunteering";
 import NotFound from "./pages/NotFound";
 import ReferencePage from "./pages/Reference";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Navigation />
          <Routes>
           <Route path="/" element={<LandingPage />} />
           <Route path="/discover" element={<MapDiscoverPage />} />
            <Route path="/swipe" element={<SwipeMatchPage />} />
            <Route path="/list" element={<MyVolunteeringPage />} />
           <Route path="/reference" element={<ReferencePage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
