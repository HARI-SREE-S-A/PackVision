'use client';

import { useState } from 'react';
import { cn, formatDate, getSeverityColor, getSeverityBgColor } from '@/lib/utils';
import {
  FileText,
  Search,
  Filter,
  Plus,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  Bot,
  Send,
  Save,
  ArrowRight,
  Shield,
  Zap,
  Bell,
} from 'lucide-react';

const mockChanges = [
  {
    id: '1',
    changeId: 'CHG-2024-0892',
    title: 'Emergency Patch - CVE-2024-3094 (XZ Utils)',
    type: 'emergency' as const,
    risk: 'critical' as const,
    status: 'approved' as const,
    category: 'Security Patch',
    scheduledDate: '2024-04-18',
    affectedScope: '4 Finance applications',
    businessOwner: 'John Smith',
    approvals: [
      { name: 'Security Team', status: 'approved' as const, approvedAt: '2024-04-16' },
      { name: 'IT Lead', status: 'approved' as const, approvedAt: '2024-04-16' },
      { name: 'CAB', status: 'approved' as const, approvedAt: '2024-04-17' },
    ],
    aiQualityScore: 92,
  },
  {
    id: '2',
    changeId: 'CHG-2024-0891',
    title: 'Microsoft 365 Apps Feature Update',
    type: 'normal' as const,
    risk: 'medium' as const,
    status: 'in_progress' as const,
    category: 'Software Update',
    scheduledDate: '2024-04-20',
    affectedScope: '4,500 devices',
    businessOwner: 'Sarah Johnson',
    approvals: [
      { name: 'Business Owner', status: 'approved' as const, approvedAt: '2024-04-14' },
      { name: 'IT Lead', status: 'approved' as const, approvedAt: '2024-04-15' },
    ],
    aiQualityScore: 88,
  },
  {
    id: '3',
    changeId: 'CHG-2024-0890',
    title: 'Zoom Workplace Deployment',
    type: 'normal' as const,
    risk: 'low' as const,
    status: 'submitted' as const,
    category: 'Application Deployment',
    scheduledDate: '2024-04-22',
    affectedScope: '890 devices',
    businessOwner: 'Mike Chen',
    approvals: [
      { name: 'Business Owner', status: 'pending' as const, approvedAt: null },
    ],
    aiQualityScore: 95,
  },
  {
    id: '4',
    changeId: 'CHG-2024-0889',
    title: 'VPN Infrastructure Upgrade',
    type: 'standard' as const,
    risk: 'high' as const,
    status: 'draft' as const,
    category: 'Infrastructure Change',
    scheduledDate: '2024-04-25',
    affectedScope: 'All UK regions',
    businessOwner: 'Emily Davis',
    approvals: [],
    aiQualityScore: null,
  },
];

const mockActivities = [
  { id: '1', action: 'Change submitted', changeId: 'CHG-2024-0890', user: 'Mike Chen', time: '10 min ago' },
  { id: '2', action: 'Approval granted', changeId: 'CHG-2024-0891', user: 'IT Lead', time: '2 hours ago' },
  { id: '3', action: 'Emergency change approved', changeId: 'CHG-2024-0892', user: 'CAB', time: '4 hours ago' },
  { id: '4', action: 'Change created', changeId: 'CHG-2024-0889', user: 'Emily Davis', time: '1 day ago' },
];

function ChangeCard({ change, onClick }: { change: typeof mockChanges[0]; onClick: () => void }) {
  return (
    <div onClick={onClick} className="card p-4 card-hover cursor-pointer">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-sm text-accent-primary">{change.changeId}</span>
            <span className={`badge ${`badge-${change.risk}`}`}>{change.risk} risk</span>
            <span className={`badge ${change.type === 'emergency' ? 'badge-critical' : 'badge-info'}`}>
              {change.type}
            </span>
          </div>
          <h3 className="font-medium">{change.title}</h3>
        </div>
        <span className={`badge ${
          change.status === 'approved' ? 'badge-info' :
          change.status === 'in_progress' ? 'badge-medium' :
          change.status === 'submitted' ? 'badge-info' :
          'badge-low'
        }`}>
          {change.status.replace('_', ' ')}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-muted-foreground">Category</p>
          <p className="text-sm">{change.category}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Scheduled</p>
          <p className="text-sm">{formatDate(change.scheduledDate)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Scope</p>
          <p className="text-sm">{change.affectedScope}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Owner</p>
          <p className="text-sm">{change.businessOwner}</p>
        </div>
      </div>

      {change.aiQualityScore && (
        <div className="flex items-center gap-2 pt-3 border-t border-border">
          <Bot className="w-4 h-4 text-accent-secondary" />
          <span className="text-sm">AI Quality Score</span>
          <div className="flex-1 h-2 bg-background-tertiary rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                change.aiQualityScore >= 90 ? 'bg-accent-success' :
                change.aiQualityScore >= 70 ? 'bg-severity-medium' :
                'bg-accent-danger'
              }`}
              style={{ width: `${change.aiQualityScore}%` }}
            />
          </div>
          <span className="text-sm font-medium">{change.aiQualityScore}%</span>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {change.approvals.map((approval, i) => (
            <div key={i} className="flex items-center gap-1">
              {approval.status === 'approved' ? (
                <CheckCircle className="w-4 h-4 text-accent-success" />
              ) : (
                <Clock className="w-4 h-4 text-severity-medium" />
              )}
              <span className="text-xs text-muted-foreground">{approval.name}</span>
            </div>
          ))}
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </div>
    </div>
  );
}

function ChangeDetailPanel({ change, onClose }: { change: typeof mockChanges[0]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed right-0 top-0 h-full w-full max-w-3xl bg-background-secondary border-l border-border overflow-y-auto animate-slide-up">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-accent-primary" />
              </div>
              <div>
                <span className="font-mono text-lg font-semibold text-accent-primary">{change.changeId}</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`badge ${`badge-${change.risk}`}`}>{change.risk} risk</span>
                  <span className={`badge ${change.type === 'emergency' ? 'badge-critical' : 'badge-info'}`}>
                    {change.type}
                  </span>
                  <span className="badge bg-accent-primary/10 text-accent-primary border border-accent-primary/20">
                    {change.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-background-tertiary">
              ×
            </button>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold mb-6">{change.title}</h2>

          {/* Quick Actions */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            <button className="btn btn-primary flex-col items-center py-3 h-auto">
              <Send className="w-5 h-5 mb-1" />
              <span className="text-xs">Submit</span>
            </button>
            <button className="btn btn-outline flex-col items-center py-3 h-auto">
              <CheckCircle className="w-5 h-5 mb-1" />
              <span className="text-xs">Approve</span>
            </button>
            <button className="btn btn-outline flex-col items-center py-3 h-auto">
              <Shield className="w-5 h-5 mb-1" />
              <span className="text-xs">CAB Review</span>
            </button>
            <button className="btn btn-outline flex-col items-center py-3 h-auto">
              <Zap className="w-5 h-5 mb-1" />
              <span className="text-xs">Create Workflow</span>
            </button>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="card p-4">
              <p className="text-sm text-muted-foreground mb-1">Category</p>
              <p className="font-medium">{change.category}</p>
            </div>
            <div className="card p-4">
              <p className="text-sm text-muted-foreground mb-1">Scheduled Date</p>
              <p className="font-medium">{formatDate(change.scheduledDate)}</p>
            </div>
            <div className="card p-4">
              <p className="text-sm text-muted-foreground mb-1">Business Owner</p>
              <p className="font-medium">{change.businessOwner}</p>
            </div>
            <div className="card p-4">
              <p className="text-sm text-muted-foreground mb-1">Affected Scope</p>
              <p className="font-medium">{change.affectedScope}</p>
            </div>
          </div>

          {/* AI Quality Score */}
          {change.aiQualityScore && (
            <div className="card p-4 mb-6 bg-accent-secondary/5 border-accent-secondary/20">
              <div className="flex items-center gap-2 mb-3">
                <Bot className="w-5 h-5 text-accent-secondary" />
                <h3 className="font-semibold">AI Change Quality Analysis</h3>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Completeness</p>
                  <p className="text-2xl font-bold text-accent-success">{change.aiQualityScore + 2}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Risk Assessment</p>
                  <p className="text-2xl font-bold text-accent-success">{change.aiQualityScore - 3}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Rollback Plan</p>
                  <p className="text-2xl font-bold text-severity-medium">{change.aiQualityScore - 8}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Overall</p>
                  <p className="text-2xl font-bold">{change.aiQualityScore}%</p>
                </div>
              </div>
            </div>
          )}

          {/* Approval Chain */}
          <div className="mb-6">
            <h3 className="font-semibold mb-4">Approval Chain</h3>
            <div className="space-y-3">
              {change.approvals.map((approval, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    approval.status === 'approved'
                      ? 'bg-accent-success/20 text-accent-success'
                      : 'bg-severity-medium/20 text-severity-medium'
                  }`}>
                    {approval.status === 'approved' ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Clock className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{approval.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {approval.status === 'approved' && approval.approvedAt
                        ? `Approved on ${formatDate(approval.approvedAt)}`
                        : 'Pending approval'}
                    </p>
                  </div>
                  <span className={`badge ${
                    approval.status === 'approved' ? 'badge-info' : 'badge-medium'
                  }`}>
                    {approval.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Implementation Plan */}
          <div className="mb-6">
            <h3 className="font-semibold mb-4">Implementation Plan</h3>
            <div className="card p-4 bg-background-tertiary">
              <p className="text-sm text-muted-foreground">
                Detailed implementation steps would appear here. The AI can help generate
                this based on the change type and affected scope.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button className="btn btn-primary flex-1">
              <CheckCircle className="w-4 h-4" />
              Approve Change
            </button>
            <button className="btn btn-outline flex-1">
              <AlertTriangle className="w-4 h-4" />
              Request More Info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChangesPage() {
  const [selectedChange, setSelectedChange] = useState<typeof mockChanges[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChanges = mockChanges.filter(change =>
    change.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    change.changeId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Change Automation</h1>
          <p className="text-muted-foreground">TechLink change management with AI-powered quality scoring</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-outline">
            <FileText className="w-4 h-4" />
            Export
          </button>
          <button className="btn btn-primary">
            <Plus className="w-4 h-4" />
            New Change Request
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <p className="text-sm text-muted-foreground">Pending Approval</p>
          <p className="text-3xl font-bold">8</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-muted-foreground">In Progress</p>
          <p className="text-3xl font-bold text-severity-medium">5</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-muted-foreground">Completed (30d)</p>
          <p className="text-3xl font-bold text-accent-success">47</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-muted-foreground">Emergency Changes</p>
          <p className="text-3xl font-bold text-severity-critical">3</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Change List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search */}
          <div className="card p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search changes by title or ID..."
                className="input pl-10"
              />
            </div>
          </div>

          {/* Change Cards */}
          <div className="space-y-4">
            {filteredChanges.map((change) => (
              <ChangeCard
                key={change.id}
                change={change}
                onClick={() => setSelectedChange(change)}
              />
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div>
          <h2 className="font-semibold mb-4">Recent Activity</h2>
          <div className="card p-4">
            <div className="space-y-4">
              {mockActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-accent-primary" />
                  </div>
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">{activity.action}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.changeId} • {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Create */}
          <div className="card p-4 mt-6">
            <h3 className="font-semibold mb-4">Quick Create</h3>
            <div className="space-y-2">
              <button className="btn btn-outline w-full justify-start">
                <Zap className="w-4 h-4" />
                Emergency Change (from CVE)
              </button>
              <button className="btn btn-outline w-full justify-start">
                <FileText className="w-4 h-4" />
                Standard Change Request
              </button>
              <button className="btn btn-outline w-full justify-start">
                <Shield className="w-4 h-4" />
                Security Patch Change
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Panel */}
      {selectedChange && (
        <ChangeDetailPanel
          change={selectedChange}
          onClose={() => setSelectedChange(null)}
        />
      )}
    </div>
  );
}
