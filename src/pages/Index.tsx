import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { StatCard } from "@/components/dashboard/StatCard";
import { IncidentCard } from "@/components/dashboard/IncidentCard";
import { PersonnelStatus } from "@/components/dashboard/PersonnelStatus";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { SiteMap } from "@/components/dashboard/SiteMap";
import { 
  Shield, 
  AlertTriangle, 
  Users, 
  MapPin, 
  Video, 
  CheckCircle 
} from "lucide-react";

const incidents = [
  { id: "INC-001", title: "Unauthorized access attempt at main entrance", location: "Site A - Main Gate", time: "10 min ago", severity: "high" as const, status: "investigating" as const },
  { id: "INC-002", title: "Fence alarm triggered in Sector 2", location: "Site C - Perimeter", time: "25 min ago", severity: "critical" as const, status: "open" as const },
  { id: "INC-003", title: "Suspicious vehicle reported near loading dock", location: "Site B - Warehouse", time: "1 hour ago", severity: "medium" as const, status: "investigating" as const },
];

const Index = () => {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Operations Dashboard</h1>
            <p className="text-muted-foreground text-sm">Real-time security operations overview</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
            <StatCard 
              title="Active Sites" 
              value={12} 
              change="+2 this month"
              changeType="positive"
              icon={MapPin}
              variant="primary"
            />
            <StatCard 
              title="Guards On Duty" 
              value={48} 
              change="92% coverage"
              changeType="positive"
              icon={Users}
              variant="success"
            />
            <StatCard 
              title="Open Incidents" 
              value={7} 
              change="+3 today"
              changeType="negative"
              icon={AlertTriangle}
              variant="destructive"
            />
            <StatCard 
              title="Patrols Active" 
              value={16} 
              icon={Shield}
            />
            <StatCard 
              title="Cameras Online" 
              value={142} 
              change="2 offline"
              changeType="negative"
              icon={Video}
              variant="warning"
            />
            <StatCard 
              title="Resolved Today" 
              value={23} 
              change="+15%"
              changeType="positive"
              icon={CheckCircle}
              variant="success"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
            {/* Map & Quick Actions */}
            <div className="xl:col-span-2 space-y-6">
              <SiteMap />
              <QuickActions />
            </div>

            {/* Activity Feed */}
            <div>
              <ActivityFeed />
            </div>
          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Incidents */}
            <div className="glass-card rounded-xl border border-border/50 overflow-hidden">
              <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  <h3 className="font-semibold text-foreground">Recent Incidents</h3>
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-destructive/10 text-destructive">
                  7 Open
                </span>
              </div>
              <div className="p-4 space-y-3">
                {incidents.map((incident) => (
                  <IncidentCard key={incident.id} {...incident} />
                ))}
              </div>
            </div>

            {/* Personnel Status */}
            <PersonnelStatus />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
