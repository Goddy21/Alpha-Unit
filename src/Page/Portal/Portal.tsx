import { Globe } from "lucide-react";

export default function PortalPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold flex items-center gap-2">
        <Globe className="w-5 h-5 text-primary" />
        Client Portal Access
      </h1>

      <div className="glass-card p-6 border border-border/50 rounded-xl">
        <p className="text-muted-foreground">Portal tools will go here…</p>
      </div>
    </div>
  );
}
