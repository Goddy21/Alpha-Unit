import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  Users,
  UserPlus,
  Search,
  Shield,
  Award,
  Calendar,
  FileText,
  Edit,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Download,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface Certification {
  name: string;
  issueDate: string;
  expiryDate: string;
  status: "valid" | "expiring" | "expired";
}

interface Guard {
  id: string;
  name: string;
  employeeId: string;
  phone: string;
  email: string;
  psraLicense: string;
  psraExpiry: string;
  status: "active" | "on-leave" | "inactive" | "suspended";
  currentSite: string;
  joinDate: string;
  certifications: Certification[];
  trainingHours: number;
  rating: number;
  shiftsCompleted: number;
  incidentsReported: number;
}

const statusConfig = {
  active: { color: "text-success", bg: "bg-success/10", label: "Active" },
  "on-leave": { color: "text-warning", bg: "bg-warning/10", label: "On Leave" },
  inactive: { color: "text-muted-foreground", bg: "bg-muted", label: "Inactive" },
  suspended: { color: "text-destructive", bg: "bg-destructive/10", label: "Suspended" },
};

const certStatusConfig = {
  valid: { color: "text-success", bg: "bg-success/10" },
  expiring: { color: "text-warning", bg: "bg-warning/10" },
  expired: { color: "text-destructive", bg: "bg-destructive/10" },
};

const mockGuards: Guard[] = [
  {
    id: "GRD001",
    name: "John Martinez",
    employeeId: "EMP2024001",
    phone: "+254 712 345 678",
    email: "j.martinez@securityfirm.com",
    psraLicense: "PSRA/2024/001234",
    psraExpiry: "2025-12-31",
    status: "active",
    currentSite: "Westgate Mall - Main Building",
    joinDate: "2023-01-15",
    certifications: [
      { name: "First Aid", issueDate: "2024-01-10", expiryDate: "2026-01-10", status: "valid" },
      { name: "Fire Safety", issueDate: "2024-03-15", expiryDate: "2025-03-15", status: "valid" },
    ],
    trainingHours: 120,
    rating: 4.8,
    shiftsCompleted: 245,
    incidentsReported: 12
  },
  {
    id: "GRD002",
    name: "David Kim",
    employeeId: "EMP2024002",
    phone: "+254 723 456 789",
    email: "d.kim@securityfirm.com",
    psraLicense: "PSRA/2024/001235",
    psraExpiry: "2025-06-30",
    status: "active",
    currentSite: "SafariCom HQ - Data Center",
    joinDate: "2023-02-20",
    certifications: [
      { name: "First Aid", issueDate: "2024-02-01", expiryDate: "2026-02-01", status: "valid" },
      { name: "Advanced Security", issueDate: "2024-04-20", expiryDate: "2025-02-20", status: "expiring" },
    ],
    trainingHours: 145,
    rating: 4.9,
    shiftsCompleted: 220,
    incidentsReported: 8
  },
  {
    id: "GRD003",
    name: "Sarah Njeri",
    employeeId: "EMP2024003",
    phone: "+254 734 567 890",
    email: "s.njeri@securityfirm.com",
    psraLicense: "PSRA/2024/001236",
    psraExpiry: "2025-03-15",
    status: "on-leave",
    currentSite: "—",
    joinDate: "2023-03-10",
    certifications: [
      { name: "First Aid", issueDate: "2024-01-05", expiryDate: "2026-01-05", status: "valid" },
    ],
    trainingHours: 95,
    rating: 4.6,
    shiftsCompleted: 180,
    incidentsReported: 5
  },
  {
    id: "GRD004",
    name: "Michael Ochieng",
    employeeId: "EMP2024004",
    phone: "+254 745 678 901",
    email: "m.ochieng@securityfirm.com",
    psraLicense: "PSRA/2024/001237",
    psraExpiry: "2024-02-28",
    status: "active",
    currentSite: "Kenya Power - Power Station A",
    joinDate: "2023-04-05",
    certifications: [
      { name: "First Aid", issueDate: "2023-12-01", expiryDate: "2024-01-15", status: "expired" },
      { name: "Fire Safety", issueDate: "2024-01-20", expiryDate: "2025-01-20", status: "valid" },
    ],
    trainingHours: 110,
    rating: 4.5,
    shiftsCompleted: 200,
    incidentsReported: 15
  },
];

export const PersonnelPage = () => {
  const [guards, setGuards] = useState<Guard[]>(mockGuards);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isAddGuardOpen, setIsAddGuardOpen] = useState(false);
  const [selectedGuard, setSelectedGuard] = useState<Guard | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [newGuard, setNewGuard] = useState({
    name: "",
    phone: "",
    email: "",
    psraLicense: "",
    psraExpiry: "",
    joinDate: "",
  });

  const filteredGuards = guards.filter(guard => {
    const matchesSearch = guard.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guard.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guard.psraLicense.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || guard.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddGuard = () => {
    const guard: Guard = {
      id: `GRD${String(guards.length + 1).padStart(3, '0')}`,
      employeeId: `EMP2024${String(guards.length + 1).padStart(3, '0')}`,
      ...newGuard,
      status: "active",
      currentSite: "—",
      certifications: [],
      trainingHours: 0,
      rating: 0,
      shiftsCompleted: 0,
      incidentsReported: 0
    };
    setGuards([...guards, guard]);
    setIsAddGuardOpen(false);
    setNewGuard({
      name: "",
      phone: "",
      email: "",
      psraLicense: "",
      psraExpiry: "",
      joinDate: "",
    });
  };

  const handleViewGuard = (guard: Guard) => {
    setSelectedGuard(guard);
    setIsViewModalOpen(true);
  };

  const handleDeleteGuard = (guardId: string) => {
    setGuards(guards.filter(g => g.id !== guardId));
  };

  const stats = {
    total: guards.length,
    active: guards.filter(g => g.status === "active").length,
    onLeave: guards.filter(g => g.status === "on-leave").length,
    expiringCerts: guards.filter(g => 
      g.certifications.some(c => c.status === "expiring" || c.status === "expired")
    ).length,
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Shield className="w-8 h-8 text-primary" />
              Personnel Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage guard records, certifications, and compliance
            </p>
          </div>
          <Dialog open={isAddGuardOpen} onOpenChange={setIsAddGuardOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <UserPlus className="w-4 h-4" />
                Add Guard
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Guard</DialogTitle>
                <DialogDescription>
                  Register a new security guard and their credentials
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="guardName">Full Name</Label>
                    <Input
                      id="guardName"
                      value={newGuard.name}
                      onChange={(e) => setNewGuard({...newGuard, name: e.target.value})}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guardPhone">Phone Number</Label>
                    <Input
                      id="guardPhone"
                      value={newGuard.phone}
                      onChange={(e) => setNewGuard({...newGuard, phone: e.target.value})}
                      placeholder="+254 712 345 678"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="guardEmail">Email</Label>
                    <Input
                      id="guardEmail"
                      type="email"
                      value={newGuard.email}
                      onChange={(e) => setNewGuard({...newGuard, email: e.target.value})}
                      placeholder="guard@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="joinDate">Join Date</Label>
                    <Input
                      id="joinDate"
                      type="date"
                      value={newGuard.joinDate}
                      onChange={(e) => setNewGuard({...newGuard, joinDate: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="psraLicense">PSRA License Number</Label>
                    <Input
                      id="psraLicense"
                      value={newGuard.psraLicense}
                      onChange={(e) => setNewGuard({...newGuard, psraLicense: e.target.value})}
                      placeholder="PSRA/2024/XXXXXX"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="psraExpiry">PSRA Expiry Date</Label>
                    <Input
                      id="psraExpiry"
                      type="date"
                      value={newGuard.psraExpiry}
                      onChange={(e) => setNewGuard({...newGuard, psraExpiry: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddGuardOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddGuard}>Add Guard</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass-card rounded-xl p-5 border border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Guards</p>
                <p className="text-3xl font-bold text-foreground mt-1">{stats.total}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
          
          <div className="glass-card rounded-xl p-5 border border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active On Duty</p>
                <p className="text-3xl font-bold text-success mt-1">{stats.active}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
            </div>
          </div>

          <div className="glass-card rounded-xl p-5 border border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">On Leave</p>
                <p className="text-3xl font-bold text-warning mt-1">{stats.onLeave}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-warning" />
              </div>
            </div>
          </div>

          <div className="glass-card rounded-xl p-5 border border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expiring Certs</p>
                <p className="text-3xl font-bold text-destructive mt-1">{stats.expiringCerts}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="glass-card rounded-xl p-5 border border-border/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, employee ID, or PSRA license..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="on-leave">On Leave</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Guards Table */}
        <div className="glass-card rounded-xl border border-border/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/30 border-b border-border/50">
                <tr>
                  <th className="px-5 py-4 text-left text-sm font-semibold text-foreground">Guard</th>
                  <th className="px-5 py-4 text-left text-sm font-semibold text-foreground">PSRA License</th>
                  <th className="px-5 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                  <th className="px-5 py-4 text-left text-sm font-semibold text-foreground">Current Site</th>
                  <th className="px-5 py-4 text-left text-sm font-semibold text-foreground">Rating</th>
                  <th className="px-5 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredGuards.map((guard) => (
                  <tr
                    key={guard.id}
                    className="border-b border-border/30 hover:bg-secondary/20 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-success/20 to-primary/20 border border-success/30 flex items-center justify-center">
                          <Shield className="w-5 h-5 text-success" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{guard.name}</p>
                          <p className="text-xs text-muted-foreground font-mono">{guard.employeeId}</p>
                          <p className="text-xs text-muted-foreground">{guard.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-mono text-foreground">{guard.psraLicense}</p>
                      <p className="text-xs text-muted-foreground">Exp: {guard.psraExpiry}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={cn(
                        "text-xs font-medium px-3 py-1.5 rounded-full",
                        statusConfig[guard.status].bg,
                        statusConfig[guard.status].color
                      )}>
                        {statusConfig[guard.status].label}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-muted-foreground">
                        {guard.currentSite}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-warning" />
                        <span className="text-sm font-medium">{guard.rating.toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewGuard(guard)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteGuard(guard.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Guard Details Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Guard Profile</DialogTitle>
              <DialogDescription>
                Complete details for {selectedGuard?.name}
              </DialogDescription>
            </DialogHeader>
            {selectedGuard && (
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="personal">Personal Info</TabsTrigger>
                  <TabsTrigger value="certifications">Certifications</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                </TabsList>
                
                <TabsContent value="personal" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Guard ID</Label>
                      <p className="font-mono text-sm mt-1">{selectedGuard.id}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Employee ID</Label>
                      <p className="font-mono text-sm mt-1">{selectedGuard.employeeId}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Name</Label>
                      <p className="text-sm mt-1">{selectedGuard.name}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Phone</Label>
                      <p className="text-sm mt-1">{selectedGuard.phone}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Email</Label>
                      <p className="text-sm mt-1">{selectedGuard.email}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Join Date</Label>
                      <p className="text-sm mt-1">{selectedGuard.joinDate}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">PSRA License</Label>
                      <p className="text-sm font-mono mt-1">{selectedGuard.psraLicense}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">PSRA Expiry</Label>
                      <p className="text-sm mt-1">{selectedGuard.psraExpiry}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Current Site</Label>
                      <p className="text-sm mt-1">{selectedGuard.currentSite}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Status</Label>
                      <p className="text-sm mt-1 capitalize">{selectedGuard.status}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="certifications" className="space-y-4">
                  <div className="space-y-3">
                    {selectedGuard.certifications.map((cert, idx) => (
                      <div key={idx} className="p-4 rounded-lg bg-secondary/30 border border-border/50">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{cert.name}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Issued: {cert.issueDate}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Expires: {cert.expiryDate}
                            </p>
                          </div>
                          <Badge className={cn(
                            certStatusConfig[cert.status].bg,
                            certStatusConfig[cert.status].color
                          )}>
                            {cert.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="performance" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-secondary/30">
                      <p className="text-sm text-muted-foreground">Training Hours</p>
                      <p className="text-3xl font-bold text-foreground mt-1">
                        {selectedGuard.trainingHours}
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-secondary/30">
                      <p className="text-sm text-muted-foreground">Rating</p>
                      <p className="text-3xl font-bold text-warning mt-1">
                        {selectedGuard.rating.toFixed(1)} / 5.0
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-secondary/30">
                      <p className="text-sm text-muted-foreground">Shifts Completed</p>
                      <p className="text-3xl font-bold text-foreground mt-1">
                        {selectedGuard.shiftsCompleted}
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-secondary/30">
                      <p className="text-sm text-muted-foreground">Incidents Reported</p>
                      <p className="text-3xl font-bold text-foreground mt-1">
                        {selectedGuard.incidentsReported}
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
                Close
              </Button>
              <Button>
                <Download className="w-4 h-4 mr-2" />
                Export Profile
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default PersonnelPage;