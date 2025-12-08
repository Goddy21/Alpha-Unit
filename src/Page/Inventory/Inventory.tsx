import { Package } from "lucide-react";

export default function InventoryPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold flex items-center gap-2">
        <Package className="w-5 h-5 text-primary" />
        Equipment & Inventory
      </h1>

      <div className="glass-card p-6 border border-border/50 rounded-xl">
        <p className="text-muted-foreground">Inventory tables will appear here…</p>
      </div>
    </div>
  );
}
