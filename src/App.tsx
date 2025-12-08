import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BillingPage from "./Page/Billing/Billing";
import { Cctv } from "lucide-react";
import ClientsPage from "./Page/Clients/Clients";
import DronesPage from "./Page/Drones/Drones";
import IncidentsPage from "./Page/Incidents/Incidents";
import InventoryPage from "./Page/Inventory/Inventory";
import PatrolPage from "./Page/Patrol/Patrol";
import PersonnelPage from "./Page/Personnel/Personnel";
import PortalPage from "./Page/Portal/Portal";
import ReportsPage from "./Page/Reports/Reports";
import SchedulingPage from "./Page/Scheduling/Scheduling";
import UsersPage from "./Page/Users/Users";
import NotificationsPage from "./Page/Notifications/Notifications";
import Layout from "./components/Layout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route element={<Layout />}>
            <Route path="/billing" element={<BillingPage />} />
            <Route path="/cctv" element={<Cctv />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/drones" element={<DronesPage />} />
            <Route path="/incidents" element={<IncidentsPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/patrol" element={<PatrolPage />} />
            <Route path="/personnel" element={<PersonnelPage />} />
            <Route path="/portal" element={<PortalPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/scheduling" element={<SchedulingPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
