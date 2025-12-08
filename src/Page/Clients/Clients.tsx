import { Building2, FileText, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ClientsPage() {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-xl font-semibold flex items-center gap-2">
        <Building2 className="w-5 h-5 text-primary" />
        Clients & Contracts
      </h1>

      <div className="glass-card border border-border/50 p-6 rounded-xl">
        <p className="text-muted-foreground">Client list will go here…</p>
      </div>
    </div>
  );
}
