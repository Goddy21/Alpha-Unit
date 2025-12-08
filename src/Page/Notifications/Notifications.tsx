import { Bell } from "lucide-react";

export default function NotificationsPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold flex items-center gap-2">
        <Bell className="w-5 h-5 text-primary" />
        Notifications Center
      </h1>

      <div className="glass-card p-6 border border-border/50 rounded-xl">
        <p className="text-muted-foreground">Alerts, updates & push messages will appear here…</p>
      </div>
    </div>
  );
}
