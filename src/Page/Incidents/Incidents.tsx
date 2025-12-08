import { AlertTriangle } from "lucide-react";

export default function IncidentsPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-primary" />
        Incident Management
      </h1>

      <div className="glass-card p-6 border border-border/50 rounded-xl">
        <p className="text-muted-foreground">Incident logs will display here…</p>
      </div>
    </div>
  );
}
