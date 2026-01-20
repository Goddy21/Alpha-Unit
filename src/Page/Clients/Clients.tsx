import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  Building2,
  Plus,
  Search,
  Filter,
  MapPin,
  Phone,
  Mail,
  FileText,
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Edit,
  Eye,
  Trash2,
  Download
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
import { Textarea } from "@/components/ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface Site {
  id: string;
  name: string;
  address: string;
  guardsRequired: number;
}

interface Contract {
  id: string;
  clientId: string;
  startDate: string;
  endDate: string;
  value: number;
  status: "active" | "pending" | "expired" | "terminated";
  billingCycle: "monthly" | "quarterly" | "annually";
  slaResponse: string;
  autoRenew: boolean;
}

interface Client {
  id: string;
  name: string;
  industry: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  sites: Site[];
  contract: Contract;
  createdAt: string;
  totalGuards: number;
  monthlyValue: number;
}

const contractStatusConfig = {
  active: { color: "text-success", bg: "bg-success/10", icon: CheckCircle, label: "Active" },
  pending: { color: "text-warning", bg: "bg-warning/10", icon: Clock, label: "Pending" },
  expired: { color: "text-destructive", bg: "bg-destructive/10", icon: AlertCircle, label: "Expired" },
  terminated: { color: "text-muted-foreground", bg: "bg-muted", icon: AlertCircle, label: "Terminated" },
};

const mockClients: Client[] = [
  {
    id: "CLI001",
    name: "Westgate Shopping Mall",
    industry: "Retail & Commercial",
    contactPerson: "Patricia Mwangi",
    email: "patricia@westgate.co.ke",
    phone: "+254 720 123 456",
    address: "Westlands, Nairobi",
    sites: [
      { id: "SITE001", name: "Main Mall Building", address: "Westlands, Nairobi", guardsRequired: 12 },
      { id: "SITE002", name: "Parking Structure", address: "Westlands, Nairobi", guardsRequired: 4 }
    ],
    contract: {
      id: "CNT001",
      clientId: "CLI001",
      startDate: "2024-01-01",
      endDate: "2025-12-31",
      value: 2400000,
      status: "active",
      billingCycle: "monthly",
      slaResponse: "15 minutes",
      autoRenew: true
    },
    createdAt: "2023-11-15",
    totalGuards: 16,
    monthlyValue: 200000
  },
  {
    id: "CLI002",
    name: "SafariCom HQ",
    industry: "Telecommunications",
    contactPerson: "James Kimani",
    email: "j.kimani@safaricom.co.ke",
    phone: "+254 733 456 789",
    address: "Westlands, Nairobi",
    sites: [
      { id: "SITE003", name: "Corporate Headquarters", address: "Westlands, Nairobi", guardsRequired: 8 },
      { id: "SITE004", name: "Data Center", address: "Industrial Area, Nairobi", guardsRequired: 6 }
    ],
    contract: {
      id: "CNT002",
      clientId: "CLI002",
      startDate: "2024-03-01",
      endDate: "2026-02-28",
      value: 3600000,
      status: "active",
      billingCycle: "monthly",
      slaResponse: "10 minutes",
      autoRenew: true
    },
    createdAt: "2024-01-20",
    totalGuards: 14,
    monthlyValue: 180000
  },
  {
    id: "CLI003",
    name: "Villa Rosa Kempinski",
    industry: "Hospitality",
    contactPerson: "Emily Odhiambo",
    email: "e.odhiambo@kempinski.com",
    phone: "+254 722 789 012",
    address: "Westlands, Nairobi",
    sites: [
      { id: "SITE005", name: "Hotel Main Building", address: "Westlands, Nairobi", guardsRequired: 10 }
    ],
    contract: {
      id: "CNT003",
      clientId: "CLI003",
      startDate: "2023-06-01",
      endDate: "2024-05-31",
      value: 1800000,
      status: "pending",
      billingCycle: "monthly",
      slaResponse: "20 minutes",
      autoRenew: false
    },
    createdAt: "2023-05-10",
    totalGuards: 10,
    monthlyValue: 150000
  },
  {
    id: "CLI004",
    name: "Kenya Power Industrial Park",
    industry: "Energy & Utilities",
    contactPerson: "David Wanjiru",
    email: "d.wanjiru@kenyapower.co.ke",
    phone: "+254 745 678 901",
    address: "Industrial Area, Nairobi",
    sites: [
      { id: "SITE006", name: "Power Station A", address: "Industrial Area, Nairobi", guardsRequired: 6 },
      { id: "SITE007", name: "Warehouse Complex", address: "Industrial Area, Nairobi", guardsRequired: 4 }
    ],
    contract: {
      id: "CNT004",
      clientId: "CLI004",
      startDate: "2024-01-15",
      endDate: "2025-01-14",
      value: 2160000,
      status: "active",
      billingCycle: "quarterly",
      slaResponse: "30 minutes",
      autoRenew: true
    },
    createdAt: "2023-12-01",
    totalGuards: 10,
    monthlyValue: 180000
  },
];

export const ClientsPage = () => {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterIndustry, setFilterIndustry] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [newClient, setNewClient] = useState({
    name: "",
    industry: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
  });

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = filterIndustry === "all" || client.industry === filterIndustry;
    const matchesStatus = filterStatus === "all" || client.contract.status === filterStatus;
    return matchesSearch && matchesIndustry && matchesStatus;
  });

  const handleAddClient = () => {
    const client: Client = {
      id: `CLI${String(clients.length + 1).padStart(3, '0')}`,
      ...newClient,
      sites: [],
      contract: {
        id: `CNT${String(clients.length + 1).padStart(3, '0')}`,
        clientId: `CLI${String(clients.length + 1).padStart(3, '0')}`,
        startDate: new Date().toISOString().split('T')[0],
        endDate: "",
        value: 0,
        status: "pending",
        billingCycle: "monthly",
        slaResponse: "30 minutes",
        autoRenew: false
      },
      createdAt: new Date().toISOString().split('T')[0],
      totalGuards: 0,
      monthlyValue: 0
    };
    setClients([...clients, client]);
    setIsAddClientOpen(false);
    setNewClient({
      name: "",
      industry: "",
      contactPerson: "",
      email: "",
      phone: "",
      address: "",
    });
  };

  const handleViewClient = (client: Client) => {
    setSelectedClient(client);
    setIsViewModalOpen(true);
  };

  const handleDeleteClient = (clientId: string) => {
    setClients(clients.filter(client => client.id !== clientId));
  };

  const stats = {
    total: clients.length,
    active: clients.filter(c => c.contract.status === "active").length,
    totalValue: clients.reduce((sum, c) => sum + c.contract.value, 0),
    monthlyRevenue: clients.reduce((sum, c) => sum + c.monthlyValue, 0),
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Building2 className="w-8 h-8 text-primary" />
              Clients & Contracts
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage client relationships and service contracts
            </p>
          </div>
          <Dialog open={isAddClientOpen} onOpenChange={setIsAddClientOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Client
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Client</DialogTitle>
                <DialogDescription>
                  Register a new client and configure their service details
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientName">Company Name</Label>
                    <Input
                      id="clientName"
                      value={newClient.name}
                      onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                      placeholder="ABC Corporation"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Input
                      id="industry"
                      value={newClient.industry}
                      onChange={(e) => setNewClient({...newClient, industry: e.target.value})}
                      placeholder="Retail & Commercial"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactPerson">Contact Person</Label>
                    <Input
                      id="contactPerson"
                      value={newClient.contactPerson}
                      onChange={(e) => setNewClient({...newClient, contactPerson: e.target.value})}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientEmail">Email</Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      value={newClient.email}
                      onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                      placeholder="contact@company.com"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientPhone">Phone Number</Label>
                    <Input
                      id="clientPhone"
                      value={newClient.phone}
                      onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
                      placeholder="+254 712 345 678"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientAddress">Address</Label>
                    <Input
                      id="clientAddress"
                      value={newClient.address}
                      onChange={(e) => setNewClient({...newClient, address: e.target.value})}
                      placeholder="Westlands, Nairobi"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddClientOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddClient}>Create Client</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass-card rounded-xl p-5 border border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Clients</p>
                <p className="text-3xl font-bold text-foreground mt-1">{stats.total}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
          
          <div className="glass-card rounded-xl p-5 border border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Contracts</p>
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
                <p className="text-sm text-muted-foreground">Total Contract Value</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  KES {(stats.totalValue / 1000000).toFixed(1)}M
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-warning" />
              </div>
            </div>
          </div>

          <div className="glass-card rounded-xl p-5 border border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  KES {(stats.monthlyRevenue / 1000).toFixed(0)}K
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="glass-card rounded-xl p-5 border border-border/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search clients..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Select value={filterIndustry} onValueChange={setFilterIndustry}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                <SelectItem value="Retail & Commercial">Retail & Commercial</SelectItem>
                <SelectItem value="Telecommunications">Telecommunications</SelectItem>
                <SelectItem value="Hospitality">Hospitality</SelectItem>
                <SelectItem value="Energy & Utilities">Energy & Utilities</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Contract status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Clients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredClients.map((client) => {
            const statusConf = contractStatusConfig[client.contract.status];
            const StatusIcon = statusConf.icon;
            
            return (
              <div
                key={client.id}
                className="glass-card rounded-xl p-6 border border-border/50 hover:border-primary/30 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{client.name}</h3>
                      <p className="text-xs text-muted-foreground font-mono">{client.id}</p>
                    </div>
                  </div>
                  <span className={cn(
                    "text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1",
                    statusConf.bg,
                    statusConf.color
                  )}>
                    <StatusIcon className="w-3 h-3" />
                    {statusConf.label}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">Industry:</span> {client.industry}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Mail className="w-3 h-3" />
                    {client.email}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Phone className="w-3 h-3" />
                    {client.phone}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {client.address}
                  </div>
                </div>

                <div className="border-t border-border/50 pt-4 mb-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-foreground">{client.sites.length}</p>
                      <p className="text-xs text-muted-foreground">Sites</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{client.totalGuards}</p>
                      <p className="text-xs text-muted-foreground">Guards</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-success">
                        {(client.monthlyValue / 1000).toFixed(0)}K
                      </p>
                      <p className="text-xs text-muted-foreground">Monthly</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border/50 pt-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Contract: {client.contract.startDate} - {client.contract.endDate}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleViewClient(client)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClient(client.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Client Details Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Client & Contract Details</DialogTitle>
              <DialogDescription>
                Complete information for {selectedClient?.name}
              </DialogDescription>
            </DialogHeader>
            {selectedClient && (
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="sites">Sites</TabsTrigger>
                  <TabsTrigger value="contract">Contract</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Client ID</Label>
                      <p className="font-mono text-sm mt-1">{selectedClient.id}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Industry</Label>
                      <p className="text-sm mt-1">{selectedClient.industry}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Contact Person</Label>
                      <p className="text-sm mt-1">{selectedClient.contactPerson}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Email</Label>
                      <p className="text-sm mt-1">{selectedClient.email}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Phone</Label>
                      <p className="text-sm mt-1">{selectedClient.phone}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Address</Label>
                      <p className="text-sm mt-1">{selectedClient.address}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Created</Label>
                      <p className="text-sm mt-1">{selectedClient.createdAt}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Total Guards Deployed</Label>
                      <p className="text-sm mt-1">{selectedClient.totalGuards}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="sites" className="space-y-4">
                  {selectedClient.sites.map((site) => (
                    <div key={site.id} className="p-4 rounded-lg bg-secondary/30 border border-border/50">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{site.name}</p>
                          <p className="text-sm text-muted-foreground font-mono">{site.id}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                            <MapPin className="w-4 h-4" />
                            {site.address}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-foreground">{site.guardsRequired}</p>
                          <p className="text-xs text-muted-foreground">Guards Required</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="contract" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Contract ID</Label>
                      <p className="font-mono text-sm mt-1">{selectedClient.contract.id}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Status</Label>
                      <p className="text-sm mt-1">{selectedClient.contract.status}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Start Date</Label>
                      <p className="text-sm mt-1">{selectedClient.contract.startDate}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">End Date</Label>
                      <p className="text-sm mt-1">{selectedClient.contract.endDate}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Contract Value</Label>
                      <p className="text-sm mt-1">KES {selectedClient.contract.value.toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Billing Cycle</Label>
                      <p className="text-sm mt-1 capitalize">{selectedClient.contract.billingCycle}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">SLA Response Time</Label>
                      <p className="text-sm mt-1">{selectedClient.contract.slaResponse}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Auto Renew</Label>
                      <p className="text-sm mt-1">{selectedClient.contract.autoRenew ? "Yes" : "No"}</p>
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
                Export Contract
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ClientsPage;