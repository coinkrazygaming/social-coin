import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  Download,
  QrCode,
  AlertTriangle,
  CheckCircle,
  Clock,
  X,
  Camera,
  FileText,
  User,
  Calendar,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { BugReport } from "../../shared/adminToolbarTypes";
import { useAuth } from "./AuthContext";

interface BugReportSystemProps {
  onPendingChange?: (count: number) => void;
}

export const BugReportSystem: React.FC<BugReportSystemProps> = ({
  onPendingChange,
}) => {
  const [reports, setReports] = useState<BugReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<BugReport[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [showNewReportModal, setShowNewReportModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<BugReport | null>(null);
  const { user } = useAuth();

  const [newReport, setNewReport] = useState({
    title: "",
    description: "",
    severity: "medium" as BugReport["severity"],
    category: "frontend" as BugReport["category"],
    reproductionSteps: [""],
    expectedBehavior: "",
    actualBehavior: "",
    environment: {
      browser: "",
      device: "",
      os: "",
      url: "",
    },
  });

  useEffect(() => {
    // Load existing reports
    loadReports();
  }, []);

  useEffect(() => {
    // Filter reports based on search and filters
    let filtered = reports;

    if (searchTerm) {
      filtered = filtered.filter(
        (report) =>
          report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.description.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((report) => report.status === filterStatus);
    }

    if (filterSeverity !== "all") {
      filtered = filtered.filter(
        (report) => report.severity === filterSeverity,
      );
    }

    setFilteredReports(filtered);

    // Update pending count
    const pendingCount = reports.filter(
      (r) => r.status === "open" || r.status === "investigating",
    ).length;
    if (onPendingChange) {
      onPendingChange(pendingCount);
    }
  }, [reports, searchTerm, filterStatus, filterSeverity, onPendingChange]);

  const loadReports = () => {
    // In a real implementation, this would fetch from the database
    const mockReports: BugReport[] = [
      {
        id: "bug_001",
        title: "Slot game freezes on spin",
        description:
          "The Lucky Sevens slot game freezes when spinning with maximum bet",
        severity: "high",
        status: "open",
        reportedBy: "user123",
        category: "frontend",
        reproductionSteps: [
          "Go to Lucky Sevens slot game",
          "Set bet to maximum amount",
          "Click spin button",
          "Game freezes after 2-3 seconds",
        ],
        expectedBehavior: "Game should complete spin and show results",
        actualBehavior: "Game freezes and becomes unresponsive",
        environment: {
          browser: "Chrome 118",
          device: "Desktop",
          os: "Windows 11",
          url: "/social-casino/lucky-sevens",
        },
        screenshots: [],
        logs: [],
        barcode: generateBarcode("bug_001"),
        createdAt: new Date("2024-01-15T10:30:00"),
        updatedAt: new Date("2024-01-15T14:20:00"),
        tags: ["high-priority", "game-breaking"],
        relatedIssues: [],
      },
      {
        id: "bug_002",
        title: "Balance not updating after wins",
        description:
          "Player balance does not update correctly after winning spins",
        severity: "critical",
        status: "investigating",
        reportedBy: "admin",
        assignedTo: "dev-team",
        category: "backend",
        reproductionSteps: [
          "Play any slot game",
          "Win a spin",
          "Check balance - it does not update",
          "Refresh page - balance still incorrect",
        ],
        expectedBehavior: "Balance should update immediately after win",
        actualBehavior: "Balance remains unchanged after wins",
        environment: {
          browser: "Firefox 119",
          device: "Mobile",
          os: "iOS 17",
          url: "/social-casino",
        },
        screenshots: [],
        logs: ["Error: Balance update failed", "Transaction ID: tx_12345"],
        barcode: generateBarcode("bug_002"),
        createdAt: new Date("2024-01-14T09:15:00"),
        updatedAt: new Date("2024-01-15T16:45:00"),
        tags: ["critical", "wallet", "payment"],
        relatedIssues: [],
      },
    ];

    setReports(mockReports);
  };

  const generateBarcode = (reportId: string): string => {
    // Generate a simple barcode/QR code string
    return `https://coinkrizy.com/admin/reports/${reportId}`;
  };

  const handleCreateReport = () => {
    if (!newReport.title || !newReport.description) return;

    const reportId = `bug_${Date.now()}`;
    const report: BugReport = {
      id: reportId,
      title: newReport.title,
      description: newReport.description,
      severity: newReport.severity,
      status: "open",
      reportedBy: user?.id || "admin",
      category: newReport.category,
      reproductionSteps: newReport.reproductionSteps.filter((step) =>
        step.trim(),
      ),
      expectedBehavior: newReport.expectedBehavior,
      actualBehavior: newReport.actualBehavior,
      environment: newReport.environment,
      screenshots: [],
      logs: [],
      barcode: generateBarcode(reportId),
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: [],
      relatedIssues: [],
    };

    setReports((prev) => [report, ...prev]);
    setShowNewReportModal(false);
    resetNewReport();
  };

  const resetNewReport = () => {
    setNewReport({
      title: "",
      description: "",
      severity: "medium",
      category: "frontend",
      reproductionSteps: [""],
      expectedBehavior: "",
      actualBehavior: "",
      environment: {
        browser: "",
        device: "",
        os: "",
        url: "",
      },
    });
  };

  const updateReportStatus = (
    reportId: string,
    status: BugReport["status"],
  ) => {
    setReports((prev) =>
      prev.map((report) =>
        report.id === reportId
          ? { ...report, status, updatedAt: new Date() }
          : report,
      ),
    );
  };

  const getSeverityColor = (severity: BugReport["severity"]) => {
    const colors = {
      low: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      medium:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
      high: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
      critical: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    };
    return colors[severity];
  };

  const getStatusColor = (status: BugReport["status"]) => {
    const colors = {
      open: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      investigating:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
      in_progress:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      resolved:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      closed:
        "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
    };
    return colors[status];
  };

  const getStatusIcon = (status: BugReport["status"]) => {
    const icons = {
      open: AlertTriangle,
      investigating: Clock,
      in_progress: Clock,
      resolved: CheckCircle,
      closed: CheckCircle,
    };
    const Icon = icons[status];
    return <Icon className="w-4 h-4" />;
  };

  const exportReport = (report: BugReport) => {
    const reportData = {
      ...report,
      exportedAt: new Date().toISOString(),
      exportedBy: user?.username || "admin",
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bug-report-${report.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Bug Reports
          </h3>
          <Dialog
            open={showNewReportModal}
            onOpenChange={setShowNewReportModal}
          >
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="bg-gradient-to-r from-red-600 to-orange-600"
              >
                <Plus className="w-4 h-4 mr-1" />
                New Report
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Bug Report</DialogTitle>
              </DialogHeader>
              <NewReportForm
                report={newReport}
                onChange={setNewReport}
                onSubmit={handleCreateReport}
                onCancel={() => setShowNewReportModal(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="investigating">Investigating</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterSeverity} onValueChange={setFilterSeverity}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          <AnimatePresence>
            {filteredReports.map((report) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedReport(report)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                      {report.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {report.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Badge className={getSeverityColor(report.severity)}>
                      {report.severity}
                    </Badge>
                    <Badge className={getStatusColor(report.status)}>
                      {getStatusIcon(report.status)}
                      <span className="ml-1">{report.status}</span>
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {report.reportedBy}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {report.createdAt.toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <QrCode className="w-3 h-3" />
                      {report.id}
                    </span>
                  </div>

                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        exportReport(report);
                      }}
                      title="Export Report"
                    >
                      <Download className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredReports.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No bug reports found</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Report Detail Modal */}
      {selectedReport && (
        <ReportDetailModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onStatusChange={updateReportStatus}
        />
      )}
    </div>
  );
};

// New Report Form Component
const NewReportForm: React.FC<{
  report: any;
  onChange: (report: any) => void;
  onSubmit: () => void;
  onCancel: () => void;
}> = ({ report, onChange, onSubmit, onCancel }) => {
  const addReproductionStep = () => {
    onChange({
      ...report,
      reproductionSteps: [...report.reproductionSteps, ""],
    });
  };

  const updateReproductionStep = (index: number, value: string) => {
    const steps = [...report.reproductionSteps];
    steps[index] = value;
    onChange({ ...report, reproductionSteps: steps });
  };

  const removeReproductionStep = (index: number) => {
    onChange({
      ...report,
      reproductionSteps: report.reproductionSteps.filter(
        (_: any, i: number) => i !== index,
      ),
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Title *</label>
        <Input
          value={report.title}
          onChange={(e) => onChange({ ...report, title: e.target.value })}
          placeholder="Brief description of the bug"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Severity</label>
          <Select
            value={report.severity}
            onValueChange={(value) => onChange({ ...report, severity: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <Select
            value={report.category}
            onValueChange={(value) => onChange({ ...report, category: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="frontend">Frontend</SelectItem>
              <SelectItem value="backend">Backend</SelectItem>
              <SelectItem value="database">Database</SelectItem>
              <SelectItem value="security">Security</SelectItem>
              <SelectItem value="performance">Performance</SelectItem>
              <SelectItem value="ui_ux">UI/UX</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description *</label>
        <Textarea
          value={report.description}
          onChange={(e) => onChange({ ...report, description: e.target.value })}
          placeholder="Detailed description of the bug"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Reproduction Steps
        </label>
        {report.reproductionSteps.map((step: string, index: number) => (
          <div key={index} className="flex gap-2 mb-2">
            <Input
              value={step}
              onChange={(e) => updateReproductionStep(index, e.target.value)}
              placeholder={`Step ${index + 1}`}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeReproductionStep(index)}
              disabled={report.reproductionSteps.length === 1}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={addReproductionStep}>
          <Plus className="w-4 h-4 mr-1" />
          Add Step
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Expected Behavior
          </label>
          <Textarea
            value={report.expectedBehavior}
            onChange={(e) =>
              onChange({ ...report, expectedBehavior: e.target.value })
            }
            placeholder="What should happen"
            rows={2}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Actual Behavior
          </label>
          <Textarea
            value={report.actualBehavior}
            onChange={(e) =>
              onChange({ ...report, actualBehavior: e.target.value })
            }
            placeholder="What actually happens"
            rows={2}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Browser</label>
          <Input
            value={report.environment.browser}
            onChange={(e) =>
              onChange({
                ...report,
                environment: { ...report.environment, browser: e.target.value },
              })
            }
            placeholder="e.g., Chrome 118"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Device</label>
          <Input
            value={report.environment.device}
            onChange={(e) =>
              onChange({
                ...report,
                environment: { ...report.environment, device: e.target.value },
              })
            }
            placeholder="e.g., Desktop, iPhone 15"
          />
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          disabled={!report.title || !report.description}
        >
          Create Report
        </Button>
      </div>
    </div>
  );
};

// Report Detail Modal Component
const ReportDetailModal: React.FC<{
  report: BugReport;
  onClose: () => void;
  onStatusChange: (id: string, status: BugReport["status"]) => void;
}> = ({ report, onClose, onStatusChange }) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {report.title}
            <Badge className={`ml-2 ${getSeverityColor(report.severity)}`}>
              {report.severity}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Management */}
          <div className="flex items-center gap-4">
            <label className="font-medium">Status:</label>
            <Select
              value={report.status}
              onValueChange={(value) =>
                onStatusChange(report.id, value as BugReport["status"])
              }
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="investigating">Investigating</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* QR Code */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <QrCode className="w-4 h-4" />
              <span className="font-medium">Report QR Code</span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-mono">
              {report.barcode}
            </div>
          </div>

          {/* Report Details */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Description</h4>
              <p className="text-gray-600 dark:text-gray-400">
                {report.description}
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Environment</h4>
              <div className="space-y-1 text-sm">
                <div>
                  <strong>Browser:</strong>{" "}
                  {report.environment.browser || "Not specified"}
                </div>
                <div>
                  <strong>Device:</strong>{" "}
                  {report.environment.device || "Not specified"}
                </div>
                <div>
                  <strong>OS:</strong>{" "}
                  {report.environment.os || "Not specified"}
                </div>
                <div>
                  <strong>URL:</strong>{" "}
                  {report.environment.url || "Not specified"}
                </div>
              </div>
            </div>
          </div>

          {/* Reproduction Steps */}
          <div>
            <h4 className="font-semibold mb-2">Reproduction Steps</h4>
            <ol className="list-decimal list-inside space-y-1 text-gray-600 dark:text-gray-400">
              {report.reproductionSteps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>

          {/* Expected vs Actual */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Expected Behavior</h4>
              <p className="text-gray-600 dark:text-gray-400">
                {report.expectedBehavior}
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Actual Behavior</h4>
              <p className="text-gray-600 dark:text-gray-400">
                {report.actualBehavior}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => exportReport(report)}>
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Helper function to get severity colors (duplicated for modal)
const getSeverityColor = (severity: BugReport["severity"]) => {
  const colors = {
    low: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    medium:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    high: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    critical: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  };
  return colors[severity];
};

const exportReport = (report: BugReport) => {
  const reportData = {
    ...report,
    exportedAt: new Date().toISOString(),
  };

  const blob = new Blob([JSON.stringify(reportData, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `bug-report-${report.id}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
