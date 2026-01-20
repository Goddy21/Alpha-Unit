import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  Plus,
  Search,
  Filter,
  MapPin,
  Clock,
  User,
  Eye,
  Edit,
  Trash2,
  Image as ImageIcon,
  FileText,
  Video,
  CheckCircle,
  XCircle,
  AlertCircle as AlertIcon
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

interface Incident {
  id: string;
  title: string;
  description: string;
  siteId: string;
  siteName: string;
  reportedBy: string;
  reportedById: string;
  timestamp: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "open" | "investigating" | "resolved" | "closed";
  category: string;
  location: string;
  gpsCoords: string;
  hasAttachments: boolean;
  attachmentCount: number;
  assignedTo?: string;
  resolvedAt?: string;
  responseTime?: string;
}

const severityConfig = {
  low: { color: "text-muted-foreground", bg: "bg-muted", label: "Low", border: "border-muted" },
  medium: { color: "text-warning", bg: "bg-warning/10", label: "Medium", border: "border-warning/30" },
  high: { color: "text-destructive", bg: "bg-destructive/10", label: "High", border: "border-destructive/30" },
  critical: { color: "text-destructive", bg: "bg-destructive/20", label: "Critical", border: "border-destructive" },
};

const statusConfig = {
  open: { color: "text-destructive", bg: "bg-destructive/10", label: "Open", icon: AlertIcon },
  investigating: { color: "text-warning", bg: "bg-warning/10", label: "Investigating", icon: Clock },
  resolved: { color: "text-success", bg: "bg-success/10", label: "Resolved", icon: CheckCircle },
  closed: { color: "text-muted-foreground", bg: "bg-muted", label: "Closed", icon: XCircle },
};

const mockIncidents: Incident[] = [
  {
    id: "INC001",
    title: "Unauthorized Access Attempt",
    description: "Individual attempted to enter restricted area without proper authorization. Security challenged and individual fled the scene.",
    siteId: "SITE002",
    siteName: "Westgate Mall - Parking Structure",
    reportedBy: "John Martinez",
    reportedById: "GRD001",
    timestamp: "2026-01-19 02:15:00",
    severity: "high",
    status: "investigating",
    category: "Security Breach",
    location: "Gate B, Level 2",
    gpsCoords: "-1.2693, 36.8103",
    hasAttachments: true,
    attachmentCount: 3,
    assignedTo: "Lisa Wang"
  },
  {
    id: "INC002",
    title: "Suspicious Package Found",
    description: "Unattended package discovered near entrance. Area evacuated and bomb squad notified.",
    siteId: "SITE001",
    siteName: "Westgate Mall - Main Building",
    reportedBy: "David Kim",
    reportedById: "GRD002",
    timestamp: "2026-01-18 14:30:00",
    severity: "critical",
    status: "resolved",
    category: "Suspicious Activity",
    location: "Main Entrance",
    gpsCoords: "-1.2692, 36.8105",
    hasAttachments: true,
    attachmentCount: 5,
    assignedTo: "Michael Okonkwo",
    resolvedAt: "2026-01-18 16:45:00",
    responseTime: "2h 15min"
  },
  {
    id: "INC003",
    title: "Medical Emergency",
    description: "Customer collapsed in food court. First aid administered, ambulance called.",
    siteId: "SITE001",
    siteName: "Westgate Mall - Main Building",
    reportedBy: "Sarah Njeri",
    reportedById: "GRD003",
    timestamp: "2026-01-18 11:20:00",
    severity: "medium",
    status: "closed",
    category: "Medical",
    location: "Food Court, Zone C",
    gpsCoords: "-1.2691, 36.8106",
    hasAttachments: false,
    attachmentCount: 0,
    resolvedAt: "2026-01-18 11:45:00",
    responseTime: "25min"
  },
  {
    id: "INC004",
    title: "Fire Alarm Activated",
    description: "Fire alarm triggered in server room. False alarm - no fire detected. System reset.",
    siteId: "SITE003",
    siteName: "SafariCom HQ - Data Center",
    reportedBy: "Michael Ochieng",
    reportedById: "GRD004",
    timestamp: "2026-01-17 22:05:00",
    severity: "high",
    status: "resolved",
    category: "Fire/Safety",
    location: "Server Room B",
    gpsCoords: "-1.2645, 36.8089",
    hasAttachments: true,
    attachmentCount: 2,
    resolvedAt: "2026-01-17 22:30:00",
    responseTime: "25min"
  },
  {
    id: "INC005",
    title: "Vehicle Break-in",
    description: "Attempted vehicle break-in detected. Guard intervened, suspect apprehended.",
    siteId: "SITE002",
    siteName: "Westgate Mall - Parking Structure",
    reportedBy: "John Martinez",
    reportedById: "GRD001",
    timestamp: "2026-01-17 03:40:00",
    severity: "medium",
    status: "closed",
    category: "Theft/Vandalism",
    location: "Parking Level 3, Section D",
    gpsCoords: "-1.2694, 36.8102",
    hasAttachments: true,
    attachmentCount: 4,
    resolvedAt: "2026-01-17 04:30:00",
    responseTime: "50min"
  },
];

export const IncidentsPage = () => {
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isAddIncidentOpen, setIsAddIncidentOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.siteName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = filterSeverity === "all" || incident.severity === filterSeverity;
    const matchesStatus = filterStatus === "all" || incident.status === filterStatus;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const handleViewIncident = (incident: Incident) => {
    setSelectedIncident(incident);
    setIsViewModalOpen(true);
  };

  const handleDeleteIncident = (incidentId: string) => {
    setIncidents(incidents.filter(inc => inc.id !== incidentId));
  };

  const stats = {
    total: incidents.length,
    open: incidents.filter(i => i.status === "open").length,
    critical: incidents.filter(i => i.severity === "critical").length,
    avgResponseTime: "1h 45min",
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-primary" />
              Incident Reporting
            </h1>
            <p className="text-muted-foreground mt-1">
              Track and manage security incidents in real-time
            </p>
          </div>
          <Dialog open={isAddIncidentOpen} onOpenChange={setIsAddIncidentOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Report Incident
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Report New Incident</DialogTitle>
                <DialogDescription>
                  Document a security incident with location and details
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Incident Title</Label>
                    <Input placeholder="Brief description of incident" />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="security">Security Breach</SelectItem>
                        <SelectItem value="suspicious">Suspicious Activity</SelectItem>
                        <SelectItem value="medical">Medical</SelectItem>
                        <SelectItem value="fire">Fire/Safety</SelectItem>
                        <SelectItem value="theft">Theft/Vandalism</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
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
                  <div className="space-y-2">
                    <Label>Severity</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input placeholder="Specific area" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Detailed Description</Label>
                  <Textarea
                    placeholder="Provide comprehensive details of the incident..."
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Attachments (Photos/Videos)</Label>
                  <Input type="file" multiple accept="image/*,video/*" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddIncidentOpen(false)}>
                  Cancel
                </Button>
                <Button>Submit Report</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass-card rounded-xl p-5 border border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Incidents</p>
                <p className="text-3xl font-bold text-foreground mt-1">{stats.total}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
          
          <div className="glass-card rounded-xl p-5 border border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Open Cases</p>
                <p className="text-3xl font-bold text-destructive mt-1">{stats.open}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center">
                <AlertIcon className="w-6 h-6 text-destructive" />
              </div>
            </div>
          </div>

          <div className="glass-card rounded-xl p-5 border border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical</p>
                <p className="text-3xl font-bold text-destructive mt-1">{stats.critical}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-destructive/20 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-destructive animate-pulse" />
              </div>
            </div>
          </div>

          <div className="glass-card rounded-xl p-5 border border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Response</p>
                <p className="text-2xl font-bold text-foreground mt-1">{stats.avgResponseTime}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-success" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="glass-card rounded-xl p-5 border border-border/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search incidents..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterSeverity} onValueChange={setFilterSeverity}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="investigating">Investigating</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Incidents List */}
        <div className="space-y-4">
          {filteredIncidents.map((incident) => {
            const StatusIcon = statusConfig[incident.status].icon;
            
            return (
              <div
                key={incident.id}
                className={cn(
                  "glass-card rounded-xl p-5 border transition-all duration-300 hover:border-primary/30",
                  severityConfig[incident.severity].border
                )}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={cn(
                      "w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0",
                      severityConfig[incident.severity].bg
                    )}>
                      <AlertTriangle className={cn("w-6 h-6", severityConfig[incident.severity].color)} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-semibold text-foreground">{incident.title}</h3>
                            <span className={cn(
                              "text-xs font-medium px-2 py-1 rounded-full",
                              severityConfig[incident.severity].bg,
                              severityConfig[incident.severity].color
                            )}>
                              {severityConfig[incident.severity].label}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground font-mono mb-2">{incident.id}</p>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {incident.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{incident.siteName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(incident.timestamp).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{incident.reportedBy}</span>
                        </div>
                        {incident.hasAttachments && (
                          <div className="flex items-center gap-1">
                            <ImageIcon className="w-3 h-3" />
                            <span>{incident.attachmentCount} files</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-3">
                    <span className={cn(
                      "text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1",
                      statusConfig[incident.status].bg,
                      statusConfig[incident.status].color
                    )}>
                      <StatusIcon className="w-3 h-3" />
                      {statusConfig[incident.status].label}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewIncident(incident)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteIncident(incident.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>

                {incident.resolvedAt && (
                  <div className="border-t border-border/50 pt-3 mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <div>
                      <span className="font-medium">Resolved:</span> {incident.resolvedAt}
                    </div>
                    <div>
                      <span className="font-medium">Response Time:</span> {incident.responseTime}
                    </div>
                    {incident.assignedTo && (
                      <div>
                        <span className="font-medium">Assigned to:</span> {incident.assignedTo}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* View Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Incident Details</DialogTitle>
              <DialogDescription>
                Complete information for {selectedIncident?.id}
              </DialogDescription>
            </DialogHeader>
            {selectedIncident && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Incident ID</Label>
                    <p className="font-mono text-sm mt-1">{selectedIncident.id}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Severity</Label>
                    <p className="text-sm mt-1 capitalize">{selectedIncident.severity}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <p className="text-sm mt-1 capitalize">{selectedIncident.status}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Category</Label>
                    <p className="text-sm mt-1">{selectedIncident.category}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Site</Label>
                    <p className="text-sm mt-1">{selectedIncident.siteName}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Location</Label>
                    <p className="text-sm mt-1">{selectedIncident.location}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Reported By</Label>
                    <p className="text-sm mt-1">{selectedIncident.reportedBy}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Timestamp</Label>
                    <p className="text-sm mt-1">{selectedIncident.timestamp}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">GPS Coordinates</Label>
                    <p className="text-sm font-mono mt-1">{selectedIncident.gpsCoords}</p>
                  </div>
                  {selectedIncident.assignedTo && (
                    <div>
                      <Label className="text-muted-foreground">Assigned To</Label>
                      <p className="text-sm mt-1">{selectedIncident.assignedTo}</p>
                    </div>
                  )}
                </div>
                <div>
                  <Label className="text-muted-foreground">Description</Label>
                  <p className="text-sm mt-2 p-3 rounded-lg bg-secondary/30">
                    {selectedIncident.description}
                  </p>
                </div>
                {selectedIncident.hasAttachments && (
                  <div>
                    <Label className="text-muted-foreground">Attachments ({selectedIncident.attachmentCount})</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {[...Array(selectedIncident.attachmentCount)].map((_, idx) => (
                        <div key={idx} className="aspect-video rounded-lg bg-secondary/30 flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
                Close
              </Button>
              <Button>Generate Report</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default IncidentsPage;