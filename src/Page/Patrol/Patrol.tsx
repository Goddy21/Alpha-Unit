import { MapPin } from "lucide-react";

export default function PatrolPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold flex items-center gap-2">
        <MapPin className="w-5 h-5 text-primary" />
        Patrol Routes & GPS Tracking
      </h1>

      <div className="glass-card p-6 rounded-xl border border-border/50">
        <p className="text-muted-foreground">Map and patrol logs will go here…</p>
      </div>
    </div>
  );
}
