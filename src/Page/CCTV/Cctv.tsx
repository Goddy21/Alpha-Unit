import { Video } from "lucide-react";

export default function CCTVPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold flex items-center gap-2">
        <Video className="w-5 h-5 text-primary" />
        CCTV Monitoring & Alarm Events
      </h1>

      <div className="glass-card p-6 rounded-xl border border-border/50">
        <p className="text-muted-foreground">Live camera feeds will be integrated here…</p>
      </div>
    </div>
  );
}
