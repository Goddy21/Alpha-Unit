import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  Calendar as CalIcon,
  Plus,
  Filter,
  Clock,
  MapPin,
  User,
  Download,
  RefreshCw,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface Shift {
  id: string;
  guardId: string;
  guardName: string;
  siteId: string;
  siteName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "scheduled" | "ongoing" | "completed" | "missed";
  checkInTime?: string;
  checkOutTime?: string;
}

const shiftStatusConfig = {
  scheduled: { color: "text-primary", bg: "bg-primary/10", label: "Scheduled" },
  ongoing: { color: "text-warning", bg: "bg-warning/10", label: "Ongoing" },
  completed: { color: "text-success", bg: "bg-success/10", label: "Completed" },
  missed: { color: "text-destructive", bg: "bg-destructive/10", label: "Missed" },
};

const mockShifts: Shift[] = [
  {
    id: "SH001",
    guardId: "GRD001",
    guardName: "John Martinez",
    siteId: "SITE001",
    siteName: "Westgate Mall - Main Building",
    date: "2026-01-19",
    startTime: "06:00",
    endTime: "14:00",
    status: "ongoing",
    checkInTime: "05:58"
  },
  {
    id: "SH002",
    guardId: "GRD002",
    guardName: "David Kim",
    siteId: "SITE003",
    siteName: "SafariCom HQ",
    date: "2026-01-19",
    startTime: "14:00",
    endTime: "22:00",
    status: "scheduled"
  },
  {
    id: "SH003",
    guardId: "GRD004",
    guardName: "Michael Ochieng",
    siteId: "SITE006",
    siteName: "Kenya Power - Power Station A",
    date: "2026-01-19",
    startTime: "22:00",
    endTime: "06:00",
    status: "scheduled"
  },
  {
    id: "SH004",
    guardId: "GRD001",
    guardName: "John Martinez",
    siteId: "SITE001",
    siteName: "Westgate Mall - Main Building",
    date: "2026-01-18",
    startTime: "06:00",
    endTime: "14:00",
    status: "completed",
    checkInTime: "06:02",
    checkOutTime: "14:01"
  },
];

export const SchedulingPage = () => {
  const [shifts, setShifts] = useState<Shift[]>(mockShifts);
  const [filterDate, setFilterDate] = useState<string>("2026-01-19");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isAddShiftOpen, setIsAddShiftOpen] = useState(false);

  const filteredShifts = shifts.filter(shift => {
    const matchesDate = !filterDate || shift.date === filterDate;
    const matchesStatus = filterStatus === "all" || shift.status === filterStatus;
    return matchesDate && matchesStatus;
  });

  const stats = {
    today: shifts.filter(s => s.date === "2026-01-19").length,
    ongoing: shifts.filter(s => s.status === "ongoing").length,
    completed: shifts.filter(s => s.status === "completed").length,
    missed: shifts.filter(s => s.status === "missed").length,
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <CalIcon className="w-8 h-8 text-primary" />
              Deployment & Scheduling
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage guard shifts and duty assignments
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Auto-Generate
            </Button>
            <Dialog open={isAddShiftOpen} onOpenChange={setIsAddShiftOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Create Shift
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Shift</DialogTitle>
                  <DialogDescription>
                    Assign a guard to a site for a specific time period
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Guard</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select guard" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GRD001">John Martinez</SelectItem>
                          <SelectItem value="GRD002">David Kim</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Site</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select site" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SITE001">Westgate Mall</SelectItem>
                          <SelectItem value="SITE003">SafariCom HQ</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label>Start Time</Label>
                      <Input type="time" />
                    </div>
                    <div className="space-y-2">
                      <Label>End Time</Label>
                      <Input type="time" />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddShiftOpen(false)}>
                    Cancel
                  </Button>
                  <Button>Create Shift</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass-card rounded-xl p-5 border border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today's Shifts</p>
                <p className="text-3xl font-bold text-foreground mt-1">{stats.today}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <CalIcon className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
          
          <div className="glass-card rounded-xl p-5 border border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ongoing Now</p>
                <p className="text-3xl font-bold text-warning mt-1">{stats.ongoing}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-warning" />
              </div>
            </div>
          </div>

          <div className="glass-card rounded-xl p-5 border border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-3xl font-bold text-success mt-1">{stats.completed}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
            </div>
          </div>

          <div className="glass-card rounded-xl p-5 border border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Missed</p>
                <p className="text-3xl font-bold text-destructive mt-1">{stats.missed}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-destructive" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="glass-card rounded-xl p-5 border border-border/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Filter by Date</Label>
              <Input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Filter by Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="missed">Missed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Export Schedule
              </Button>
            </div>
          </div>
        </div>

        {/* Shifts List */}
        <div className="glass-card rounded-xl border border-border/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/30 border-b border-border/50">
                <tr>
                  <th className="px-5 py-4 text-left text-sm font-semibold text-foreground">Shift ID</th>
                  <th className="px-5 py-4 text-left text-sm font-semibold text-foreground">Guard</th>
                  <th className="px-5 py-4 text-left text-sm font-semibold text-foreground">Site</th>
                  <th className="px-5 py-4 text-left text-sm font-semibold text-foreground">Date & Time</th>
                  <th className="px-5 py-4 text-left text-sm font-semibold text-foreground">Check In/Out</th>
                  <th className="px-5 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredShifts.map((shift) => (
                  <tr
                    key={shift.id}
                    className="border-b border-border/30 hover:bg-secondary/20 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <p className="font-mono text-sm">{shift.id}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{shift.guardName}</p>
                          <p className="text-xs text-muted-foreground font-mono">{shift.guardId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm">{shift.siteName}</p>
                          <p className="text-xs text-muted-foreground font-mono">{shift.siteId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm">{shift.date}</p>
                      <p className="text-xs text-muted-foreground">
                        {shift.startTime} - {shift.endTime}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      {shift.checkInTime && (
                        <div className="text-sm">
                          <p className="text-success">In: {shift.checkInTime}</p>
                          {shift.checkOutTime && (
                            <p className="text-muted-foreground">Out: {shift.checkOutTime}</p>
                          )}
                        </div>
                      )}
                      {!shift.checkInTime && (
                        <p className="text-xs text-muted-foreground">—</p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={cn(
                        "text-xs font-medium px-3 py-1.5 rounded-full",
                        shiftStatusConfig[shift.status].bg,
                        shiftStatusConfig[shift.status].color
                      )}>
                        {shiftStatusConfig[shift.status].label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulingPage;