import { Users, Shield, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UsersPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          User & Roles Management
        </h1>
        <Button>
          <UserPlus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      <div className="glass-card border border-border/50 rounded-xl p-6">
        <p className="text-muted-foreground">User table will appear here…</p>
      </div>
    </div>
  );
}
