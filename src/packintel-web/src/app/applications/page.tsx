'use client';

import { useState } from 'react';
import {
  formatDate,
  formatPercent,
  getSeverityColor,
  getSeverityBgColor,
  cn,
} from '@/lib/utils';
import {
  Package,
  Search,
  Filter,
  Plus,
  MoreVertical,
  ChevronRight,
  ChevronDown,
  Clock,
  CheckCircle,
  AlertTriangle,
  Bot,
  GitBranch,
  X,
  Edit,
  Trash2,
  Eye,
} from 'lucide-react';

// Mock application data
const mockApplications = [
  {
    id: '1',
    name: 'Microsoft 365 Apps',
    vendor: 'Microsoft',
    version: '16.0.23801.2024',
    status: 'deployed' as const,
    criticality: 'critical' as const,
    owner: 'John Smith',
    businessUnit: 'Finance',
    region: 'UK',
    packageType: 'Msix' as const,
    aiConfidence: { overallScore: 94 },
    lastUpdated: '2024-04-15',
  },
  {
    id: '2',
    name: 'Zoom Workplace',
    vendor: 'Zoom',
    version: '6.0.20.2404',
    status: 'in_deployment' as const,
    criticality: 'high' as const,
    owner: 'Sarah Johnson',
    businessUnit: 'Operations',
    region: 'UK',
    packageType: 'Msi' as const,
    aiConfidence: { overallScore: 87 },
    lastUpdated: '2024-04-14',
  },
  {
    id: '3',
    name: 'AutoCAD 2024',
    vendor: 'Autodesk',
    version: '2024.1.2',
    status: 'testing' as const,
    criticality: 'high' as const,
    owner: 'Mike Chen',
    businessUnit: 'Engineering',
    region: 'UK',
    packageType: 'Exe' as const,
    aiConfidence: { overallScore: 72 },
    lastUpdated: '2024-04-12',
  },
  {
    id: '4',
    name: 'Salesforce CRM',
    vendor: 'Salesforce',
    version: 'Winter \'24',
    status: 'approved' as const,
    criticality: 'critical' as const,
    owner: 'Emily Davis',
    businessUnit: 'Sales',
    region: 'UK',
    packageType: 'Win32' as const,
    aiConfidence: { overallScore: 91 },
    lastUpdated: '2024-04-10',
  },
  {
    id: '5',
    name: 'Slack Desktop',
    vendor: 'Slack',
    version: '4.38.125',
    status: 'failed' as const,
    criticality: 'medium' as const,
    owner: 'David Wilson',
    businessUnit: 'IT',
    region: 'UK',
    packageType: 'Exe' as const,
    aiConfidence: { overallScore: 65 },
    lastUpdated: '2024-04-08',
  },
];

function ApplicationTableRow({
  app,
  onSelect,
}: {
  app: typeof mockApplications[0];
  onSelect: () => void;
}) {
  return (
    <tr
      onClick={onSelect}
      className="cursor-pointer hover:bg-background-tertiary/50 transition-colors"
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent-primary/10 flex items-center justify-center">
            <Package className="w-5 h-5 text-accent-primary" />
          </div>
          <div>
            <p className="font-medium">{app.name}</p>
            <p className="text-xs text-muted-foreground">{app.vendor}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="font-mono text-sm">{app.version}</span>
      </td>
      <td className="px-4 py-3">
        <span className={`badge ${`badge-${app.criticality}`}`}>{app.criticality}</span>
      </td>
      <td className="px-4 py-3">
        <span className="badge bg-accent-primary/10 text-accent-primary border border-accent-primary/20">
          {app.status.replace('_', ' ')}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-accent-secondary" />
          <div className="w-24 h-2 bg-background-tertiary rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent-secondary to-accent-primary rounded-full"
              style={{ width: `${app.aiConfidence.overallScore}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground">{app.aiConfidence.overallScore}%</span>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground">{app.owner}</td>
      <td className="px-4 py-3 text-sm text-muted-foreground">{app.businessUnit}</td>
      <td className="px-4 py-3 text-sm text-muted-foreground">{formatDate(app.lastUpdated)}</td>
      <td className="px-4 py-3">
        <button className="p-1.5 rounded hover:bg-background-tertiary">
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </td>
    </tr>
  );
}

function ApplicationDetailPanel({
  app,
  onClose,
}: {
  app: typeof mockApplications[0];
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed right-0 top-0 h-full w-full max-w-3xl bg-background-secondary border-l border-border overflow-y-auto animate-slide-up">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-accent-primary/10 flex items-center justify-center">
                <Package className="w-7 h-7 text-accent-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{app.name}</h2>
                <p className="text-muted-foreground">{app.vendor} • v{app.version}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-background-tertiary">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Status & Criticality */}
          <div className="flex items-center gap-3 mb-6">
            <span className={`badge ${`badge-${app.criticality}`}`}>{app.criticality} criticality</span>
            <span className="badge bg-accent-primary/10 text-accent-primary border border-accent-primary/20">
              {app.status.replace('_', ' ')}
            </span>
            <span className="badge bg-accent-secondary/10 text-accent-secondary border border-accent-secondary/20">
              {app.packageType}
            </span>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            <button className="btn btn-outline flex-col items-center py-3 h-auto">
              <GitBranch className="w-5 h-5 mb-1" />
              <span className="text-xs">Create Workflow</span>
            </button>
            <button className="btn btn-outline flex-col items-center py-3 h-auto">
              <Bot className="w-5 h-5 mb-1" />
              <span className="text-xs">Smart Package</span>
            </button>
            <button className="btn btn-outline flex-col items-center py-3 h-auto">
              <AlertTriangle className="w-5 h-5 mb-1" />
              <span className="text-xs">Scan Vulnerabilities</span>
            </button>
            <button className="btn btn-outline flex-col items-center py-3 h-auto">
              <Plus className="w-5 h-5 mb-1" />
              <span className="text-xs">New Version</span>
            </button>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="card p-4">
              <p className="text-sm text-muted-foreground mb-1">Owner</p>
              <p className="font-medium">{app.owner}</p>
            </div>
            <div className="card p-4">
              <p className="text-sm text-muted-foreground mb-1">Business Unit</p>
              <p className="font-medium">{app.businessUnit}</p>
            </div>
            <div className="card p-4">
              <p className="text-sm text-muted-foreground mb-1">Region</p>
              <p className="font-medium">{app.region}</p>
            </div>
            <div className="card p-4">
              <p className="text-sm text-muted-foreground mb-1">Last Updated</p>
              <p className="font-medium">{formatDate(app.lastUpdated)}</p>
            </div>
          </div>

          {/* AI Confidence */}
          <div className="card p-4 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Bot className="w-5 h-5 text-accent-secondary" />
              <h3 className="font-semibold">AI Confidence Score</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Overall Confidence</p>
                <p className="text-3xl font-bold">{app.aiConfidence.overallScore}%</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Packaging Complexity</span>
                  <span className="font-medium">92%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Deployment Risk</span>
                  <span className="font-medium">High</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Test Coverage</span>
                  <span className="font-medium">88%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-border mb-6">
            <div className="flex gap-4">
              {['Packages', 'Deployments', 'Validation', 'History'].map((tab) => (
                <button
                  key={tab}
                  className="pb-3 px-1 text-sm font-medium border-b-2 border-transparent hover:border-accent-primary data-[active]:border-accent-primary"
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="text-center py-12 text-muted-foreground">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Package history and details will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ApplicationsPage() {
  const [selectedApp, setSelectedApp] = useState<typeof mockApplications[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const filteredApps = mockApplications.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.vendor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Application Management</h1>
          <p className="text-muted-foreground">
            {mockApplications.length} applications • AI-driven packaging and deployment
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-outline">
            <Filter className="w-4 h-4" />
            Advanced Filter
          </button>
          <button className="btn btn-primary">
            <Plus className="w-4 h-4" />
            New Application
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="card p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search applications by name or vendor..."
              className="input pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input w-auto"
            >
              <option value="">All Statuses</option>
              <option value="requested">Requested</option>
              <option value="in_packaging">In Packaging</option>
              <option value="testing">Testing</option>
              <option value="approved">Approved</option>
              <option value="in_deployment">In Deployment</option>
              <option value="deployed">Deployed</option>
              <option value="failed">Failed</option>
            </select>
            <select className="input w-auto">
              <option value="">All Criticality</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select className="input w-auto">
              <option value="">All Business Units</option>
              <option value="finance">Finance</option>
              <option value="operations">Operations</option>
              <option value="engineering">Engineering</option>
              <option value="sales">Sales</option>
              <option value="it">IT</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th className="w-80">Application</th>
              <th>Version</th>
              <th>Criticality</th>
              <th>Status</th>
              <th>AI Confidence</th>
              <th>Owner</th>
              <th>Business Unit</th>
              <th>Last Updated</th>
              <th className="w-12"></th>
            </tr>
          </thead>
          <tbody>
            {filteredApps.map((app) => (
              <ApplicationTableRow
                key={app.id}
                app={app}
                onSelect={() => setSelectedApp(app)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredApps.length} of {mockApplications.length} applications
        </p>
        <div className="flex items-center gap-2">
          <button className="btn btn-outline btn-sm" disabled>
            Previous
          </button>
          <button className="btn btn-outline btn-sm">1</button>
          <button className="btn btn-outline btn-sm" disabled>
            Next
          </button>
        </div>
      </div>

      {/* Detail Panel */}
      {selectedApp && (
        <ApplicationDetailPanel
          app={selectedApp}
          onClose={() => setSelectedApp(null)}
        />
      )}
    </div>
  );
}
