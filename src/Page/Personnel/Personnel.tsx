import { UserCog, Shield } from "lucide-react";

export default function PersonnelPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold flex items-center gap-2">
        <Shield className="w-5 h-5 text-primary" />
        Personnel Management
      </h1>

      <div className="glass-card p-6 rounded-xl border border-border/50">
        <p className="text-muted-foreground">Personnel data will be listed here…</p>
      </div>
    </div>
  );
}
