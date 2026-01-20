import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  MoreVertical,
  Shield,
  Edit,
  Trash2,
  Lock,
  Unlock,
  Eye,
  Activity,
  Clock,
  CheckCircle,
  XCircle
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
import { Switch } from "@/components/ui/switch";

interface User {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Operations Manager" | "Guard" | "Client";
  status: "active" | "inactive" | "suspended";
  lastActive: string;
  department?: string;
  phone: string;
  createdAt: string;
  permissions: string[];
}

const roleColors = {
  "Admin": "text-destructive bg-destructive/10 border-destructive/30",
  "Operations Manager": "text-primary bg-primary/10 border-primary/30",
  "Guard": "text-success bg-success/10 border-success/30",
  "Client": "text-warning bg-warning/10 border-warning/30",
};

const statusConfig = {
  active: { color: "text-success", bg: "bg-success", label: "Active", icon: CheckCircle },
  inactive: { color: "text-muted-foreground", bg: "bg-muted-foreground", label: "Inactive", icon: XCircle },
  suspended: { color: "text-destructive", bg: "bg-destructive", label: "Suspended", icon: Lock },
};

const mockUsers: User[] = [
  {
    id: "USR001",
    name: "Sarah Johnson",
    email: "sarah.j@securityfirm.com",
    role: "Admin",
    status: "active",
    lastActive: "2 min ago",
    department: "Administration",
    phone: "+254 712 345 678",
    createdAt: "2024-01-15",
    permissions: ["all"]
  },
  {
    id: "USR002",
    name: "Michael Okonkwo",
    email: "m.okonkwo@securityfirm.com",
    role: "Operations Manager",
    status: "active",
    lastActive: "5 min ago",
    department: "Operations",
    phone: "+254 723 456 789",
    createdAt: "2024-02-10",
    permissions: ["view_reports", "manage_personnel", "create_deployments"]
  },
  {
    id: "USR003",
    name: "John Martinez",
    email: "j.martinez@securityfirm.com",
    role: "Guard",
    status: "active",
    lastActive: "15 min ago",
    department: "Field Operations",
    phone: "+254 734 567 890",
    createdAt: "2024-03-05",
    permissions: ["report_incidents", "view_schedule", "patrol_tracking"]
  },
  {
    id: "USR004",
    name: "David Kim",
    email: "d.kim@securityfirm.com",
    role: "Guard",
    status: "active",
    lastActive: "1 hour ago",
    department: "Field Operations",
    phone: "+254 745 678 901",
    createdAt: "2024-03-12",
    permissions: ["report_incidents", "view_schedule", "patrol_tracking"]
  },
  {
    id: "USR005",
    name: "Elena Rodriguez",
    email: "e.rodriguez@clientcorp.com",
    role: "Client",
    status: "active",
    lastActive: "3 hours ago",
    phone: "+254 756 789 012",
    createdAt: "2024-04-01",
    permissions: ["view_incidents", "view_cctv", "view_invoices"]
  },
  {
    id: "USR006",
    name: "James Peterson",
    email: "j.peterson@securityfirm.com",
    role: "Guard",
    status: "suspended",
    lastActive: "2 days ago",
    department: "Field Operations",
    phone: "+254 767 890 123",
    createdAt: "2024-02-20",
    permissions: ["report_incidents", "view_schedule"]
  },
  {
    id: "USR007",
    name: "Lisa Wang",
    email: "l.wang@securityfirm.com",
    role: "Operations Manager",
    status: "active",
    lastActive: "10 min ago",
    department: "Operations",
    phone: "+254 778 901 234",
    createdAt: "2024-01-25",
    permissions: ["view_reports", "manage_personnel", "create_deployments", "manage_incidents"]
  },
];

const rolePermissions = {
  "Admin": [
    "all", "manage_users", "manage_roles", "system_settings", "billing_access",
    "delete_records", "audit_logs", "manage_clients", "manage_contracts"
  ],
  "Operations Manager": [
    "view_reports", "manage_personnel", "create_deployments", "manage_incidents",
    "view_cctv", "patrol_tracking", "inventory_management", "approve_timesheets"
  ],
  "Guard": [
    "report_incidents", "view_schedule", "patrol_tracking", "check_in_out",
    "view_assigned_sites", "submit_reports"
  ],
  "Client": [
    "view_incidents", "view_cctv", "view_invoices", "submit_requests",
    "view_personnel", "view_reports"
  ]
};

export const UsersPage = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // New user form state
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Guard" as User["role"],
    department: "",
    status: "active" as User["status"],
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus = filterStatus === "all" || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleAddUser = () => {
    const user: User = {
      id: `USR${String(users.length + 1).padStart(3, '0')}`,
      ...newUser,
      lastActive: "Just now",
      createdAt: new Date().toISOString().split('T')[0],
      permissions: rolePermissions[newUser.role] || []
    };
    setUsers([...users, user]);
    setIsAddUserOpen(false);
    setNewUser({
      name: "",
      email: "",
      phone: "",
      role: "Guard",
      department: "",
      status: "active",
    });
  };

  const handleToggleStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === "active" ? "inactive" : "active" }
        : user
    ));
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === "active").length,
    admins: users.filter(u => u.role === "Admin").length,
    guards: users.filter(u => u.role === "Guard").length,
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Users className="w-8 h-8 text-primary" />
              User & Role Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage user accounts, roles, and permissions
            </p>
          </div>
          <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <UserPlus className="w-4 h-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Create a new user account and assign role permissions
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={newUser.name}
                      onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={newUser.phone}
                      onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                      placeholder="+254 712 345 678"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={newUser.department}
                      onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                      placeholder="Operations"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={newUser.role}
                      onValueChange={(value) => setNewUser({...newUser, role: value as User["role"]})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Operations Manager">Operations Manager</SelectItem>
                        <SelectItem value="Guard">Guard</SelectItem>
                        <SelectItem value="Client">Client</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={newUser.status}
                      onValueChange={(value) => setNewUser({...newUser, status: value as User["status"]})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Permissions for {newUser.role}</Label>
                  <div className="p-3 rounded-lg bg-secondary/30 max-h-32 overflow-y-auto">
                    <div className="flex flex-wrap gap-2">
                      {rolePermissions[newUser.role]?.map((perm, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
                        >
                          {perm.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddUser}>Create User</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass-card rounded-xl p-5 border border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
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
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-3xl font-bold text-success mt-1">{stats.active}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                <Activity className="w-6 h-6 text-success" />
              </div>
            </div>
          </div>

          <div className="glass-card rounded-xl p-5 border border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Administrators</p>
                <p className="text-3xl font-bold text-destructive mt-1">{stats.admins}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-destructive" />
              </div>
            </div>
          </div>

          <div className="glass-card rounded-xl p-5 border border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Field Guards</p>
                <p className="text-3xl font-bold text-foreground mt-1">{stats.guards}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                <Users className="w-6 h-6 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="glass-card rounded-xl p-5 border border-border/50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search users by name, email, or ID..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Operations Manager">Operations Manager</SelectItem>
                <SelectItem value="Guard">Guard</SelectItem>
                <SelectItem value="Client">Client</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Users Table */}
        <div className="glass-card rounded-xl border border-border/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/30 border-b border-border/50">
                <tr>
                  <th className="px-5 py-4 text-left text-sm font-semibold text-foreground">User</th>
                  <th className="px-5 py-4 text-left text-sm font-semibold text-foreground">Role</th>
                  <th className="px-5 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                  <th className="px-5 py-4 text-left text-sm font-semibold text-foreground">Department</th>
                  <th className="px-5 py-4 text-left text-sm font-semibold text-foreground">Last Active</th>
                  <th className="px-5 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const StatusIcon = statusConfig[user.status].icon;
                  return (
                    <tr
                      key={user.id}
                      className="border-b border-border/30 hover:bg-secondary/20 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 flex items-center justify-center">
                            <span className="text-sm font-bold text-primary">
                              {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                            <p className="text-xs text-muted-foreground font-mono">{user.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={cn(
                          "text-xs font-medium px-3 py-1.5 rounded-full border",
                          roleColors[user.role]
                        )}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            statusConfig[user.status].bg
                          )} />
                          <span className={cn("text-sm font-medium", statusConfig[user.status].color)}>
                            {statusConfig[user.status].label}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm text-muted-foreground">
                          {user.department || "—"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {user.lastActive}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewUser(user)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(user.id)}
                          >
                            {user.status === "active" ? (
                              <Lock className="w-4 h-4" />
                            ) : (
                              <Unlock className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Details Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
              <DialogDescription>
                Complete information and permissions for {selectedUser?.name}
              </DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">User ID</Label>
                    <p className="font-mono text-sm mt-1">{selectedUser.id}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <p className="text-sm mt-1">{selectedUser.status}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Email</Label>
                    <p className="text-sm mt-1">{selectedUser.email}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Phone</Label>
                    <p className="text-sm mt-1">{selectedUser.phone}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Role</Label>
                    <p className="text-sm mt-1">{selectedUser.role}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Department</Label>
                    <p className="text-sm mt-1">{selectedUser.department || "—"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Created</Label>
                    <p className="text-sm mt-1">{selectedUser.createdAt}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Last Active</Label>
                    <p className="text-sm mt-1">{selectedUser.lastActive}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Permissions</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedUser.permissions.map((perm, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
                      >
                        {perm.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default UsersPage;