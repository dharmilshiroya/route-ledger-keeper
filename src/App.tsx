
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { Navigation } from "./components/Navigation";
import Dashboard from "./pages/Dashboard";
import Vehicles from "./pages/Vehicles";
import Drivers from "./pages/Drivers";
import Trips from "./pages/Trips";
import Expenses from "./pages/Expenses";
import Reports from "./pages/Reports";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-right" />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/*" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                  <Navigation />
                  <main className="container mx-auto px-4 py-8 max-w-7xl">
                    <div className="animate-fade-in">
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/vehicles" element={<Vehicles />} />
                        <Route path="/drivers" element={<Drivers />} />
                        <Route path="/trips" element={<Trips />} />
                        <Route path="/expenses" element={<Expenses />} />
                        <Route path="/reports" element={<Reports />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </div>
                  </main>
                </div>
              </ProtectedRoute>
            } />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
