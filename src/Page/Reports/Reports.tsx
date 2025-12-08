import { BarChart3 } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-primary" />
        Analytics & Reports
      </h1>

      <div className="glass-card p-6 border border-border/50 rounded-xl">
        <p className="text-muted-foreground">Charts and exports will be shown here…</p>
      </div>
    </div>
  );
}
