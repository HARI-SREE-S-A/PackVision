'use client';

import { useState, useEffect } from 'react';
import {
  formatDate,
  formatPercent,
  getSeverityColor,
  getSeverityBgColor,
  formatRelativeTime,
  cn,
} from '@/lib/utils';
import {
  Shield,
  AlertTriangle,
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  CheckCircle,
  Clock,
  TrendingUp,
  Activity,
  GitBranch,
  Bell,
  ChevronRight,
  Zap,
  Eye,
  X,
} from 'lucide-react';

// Mock data for vulnerabilities
const mockCves = [
  {
    id: '1',
    cveId: 'CVE-2024-3094',
    description: 'XZ Utils backdoor allows remote code execution via SSH. Affects versions 5.6.0-5.6.1. Critical supply chain attack.',
    cvssScore: 10.0,
    severity: 'critical' as const,
    epssScore: 0.97,
    isKnownExploited: true,
    publishedDate: '2024-03-29',
    affectedProducts: ['cpe:2.3:a:tukaani:xz:5.6.0', 'cpe:2.3:a:tukaani:xz:5.6.1'],
    status: 'patch_available' as const,
    affectedAssetCount: 4,
    matchedAssets: ['Finance App v2.1', 'HR Portal v1.8', 'CRM Suite v3.2', 'Email Client v5.1'],
  },
  {
    id: '2',
    cveId: 'CVE-2024-23897',
    description: 'Jenkins CLI argument parsing flaw allows reading arbitrary files on the Jenkins server.',
    cvssScore: 9.8,
    severity: 'critical' as const,
    epssScore: 0.94,
    isKnownExploited: true,
    publishedDate: '2024-01-24',
    affectedProducts: ['cpe:2.3:a:jenkins:jenkins:2.442', 'cpe:2.3:a:jenkins:jenkins:2.441'],
    status: 'under_investigation' as const,
    affectedAssetCount: 12,
    matchedAssets: ['Build Server Dev', 'CI Pipeline Prod', 'Test Environment'],
  },
  {
    id: '3',
    cveId: 'CVE-2024-21762',
    description: 'FortiOS SSL VPN heap overflow vulnerability allowing RCE. Critical for network infrastructure.',
    cvssScore: 9.6,
    severity: 'critical' as const,
    epssScore: 0.89,
    isKnownExploited: true,
    publishedDate: '2024-02-12',
    affectedProducts: ['cpe:2.3:a:fortinet:fortios:*:*', 'cpe:2.3:a:fortinet:forticlient:*:*'],
    status: 'patch_deployed' as const,
    affectedAssetCount: 2,
    matchedAssets: ['VPN Gateway EU', 'Edge Firewall UK'],
  },
  {
    id: '4',
    cveId: 'CVE-2024-1709',
    description: 'ConnectWise ScreenConnect authentication bypass vulnerability.',
    cvssScore: 9.8,
    severity: 'critical' as const,
    epssScore: 0.91,
    isKnownExploited: true,
    publishedDate: '2024-02-19',
    affectedProducts: ['cpe:2.3:a:connectwise:screenconnect:*:*'],
    status: 'patch_available' as const,
    affectedAssetCount: 8,
    matchedAssets: ['Remote Support Server', 'Help Desk Systems'],
  },
  {
    id: '5',
    cveId: 'CVE-2023-48795',
    description: 'Fortinet FortiOS SSH vulnerability allows path traversal.',
    cvssScore: 7.8,
    severity: 'high' as const,
    epssScore: 0.76,
    isKnownExploited: false,
    publishedDate: '2024-02-16',
    affectedProducts: ['cpe:2.3:a:fortinet:fortios:7.4.0'],
    status: 'new' as const,
    affectedAssetCount: 15,
    matchedAssets: ['Multiple VPN Concentrators'],
  },
];

const mockRemediationTasks = [
  {
    id: '1',
    title: 'Patch XZ Utils on Finance App servers',
    priority: 'critical' as const,
    status: 'in_progress' as const,
    assignedEngineerName: 'John Smith',
    dueDate: '2024-04-18',
    affectedAssets: 4,
  },
  {
    id: '2',
    title: 'Update Jenkins to latest version',
    priority: 'critical' as const,
    status: 'pending' as const,
    assignedEngineerName: 'Sarah Johnson',
    dueDate: '2024-04-19',
    affectedAssets: 12,
  },
  {
    id: '3',
    title: 'Deploy FortiOS hotfix',
    priority: 'high' as const,
    status: 'completed' as const,
    assignedEngineerName: 'Mike Chen',
    dueDate: '2024-04-15',
    affectedAssets: 2,
  },
];

const mockAlerts = [
  {
    id: '1',
    title: 'Critical CVE Detected: CVE-2024-3094',
    message: 'XZ Utils backdoor affects 4 applications in inventory',
    severity: 'critical' as const,
    createdAt: new Date().toISOString(),
    triggeredWorkflow: true,
  },
  {
    id: '2',
    title: 'KEV Alert: CVE-2024-1709',
    message: 'ConnectWise ScreenConnect being actively exploited',
    severity: 'critical' as const,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    triggeredWorkflow: false,
  },
];

function CVECard({ cve, onClick }: { cve: typeof mockCves[0]; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="card card-hover p-4 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-sm font-semibold text-accent-primary">{cve.cveId}</span>
            {cve.isKnownExploited && (
              <span className="badge badge-critical">
                <Zap className="w-3 h-3 mr-1" />
                KEV
              </span>
            )}
          </div>
          <span className={`badge ${`badge-${cve.severity}`}`}>{cve.severity}</span>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">{cve.cvssScore}</p>
          <p className="text-xs text-muted-foreground">CVSS</p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{cve.description}</p>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {formatDate(cve.publishedDate)}
        </span>
        <span className="flex items-center gap-1">
          <Activity className="w-3 h-3" />
          EPSS: {formatPercent(cve.epssScore * 100)}
        </span>
      </div>

      <div className="mt-3 pt-3 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm">
            <span className="font-medium">{cve.affectedAssetCount}</span> assets affected
          </span>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}

function CVEFilters() {
  return (
    <div className="card p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search CVEs by ID, product, or description..."
              className="input pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <select className="input w-auto">
            <option value="">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select className="input w-auto">
            <option value="">All Sources</option>
            <option value="nvd">NVD</option>
            <option value="kev">CISA KEV</option>
          </select>
          <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-background-tertiary cursor-pointer">
            <input type="checkbox" className="rounded" />
            <span className="text-sm">KEV Only</span>
          </label>
          <button className="btn btn-outline">
            <Filter className="w-4 h-4" />
            More Filters
          </button>
        </div>
      </div>
    </div>
  );
}

function FeedStatus() {
  const feeds = [
    { name: 'NIST NVD', status: 'healthy' as const, cveCount: 234567, lastSync: '15 min ago' },
    { name: 'CISA KEV', status: 'healthy' as const, cveCount: 1193, lastSync: '1 hour ago' },
    { name: 'EPSS', status: 'healthy' as const, cveCount: 198432, lastSync: '30 min ago' },
  ];

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Threat Feed Status</h3>
        <button className="btn btn-ghost text-xs">
          <RefreshCw className="w-3 h-3" />
          Sync All
        </button>
      </div>
      <div className="space-y-3">
        {feeds.map((feed) => (
          <div key={feed.name} className="flex items-center justify-between py-2 border-b border-border last:border-0">
            <div className="flex items-center gap-3">
              <span className={`status-dot status-dot-${feed.status}`} />
              <div>
                <p className="text-sm font-medium">{feed.name}</p>
                <p className="text-xs text-muted-foreground">{feed.cveCount.toLocaleString()} CVEs</p>
              </div>
            </div>
            <span className="text-xs text-muted-foreground">{feed.lastSync}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AlertPanel() {
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Bell className="w-4 h-4 text-accent-danger" />
          Live Alerts
        </h3>
        <span className="badge badge-critical">{mockAlerts.length}</span>
      </div>
      <div className="space-y-3">
        {mockAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-3 rounded-lg ${getSeverityBgColor(alert.severity)}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-sm">{alert.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{alert.message}</p>
              </div>
              {alert.triggeredWorkflow && (
                <span className="badge badge-info text-xs">
                  <GitBranch className="w-3 h-3 mr-1" />
                  Workflow
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RemediationTaskBoard() {
  const statusGroups = {
    pending: mockRemediationTasks.filter((t) => t.status === 'pending'),
    in_progress: mockRemediationTasks.filter((t) => t.status === 'in_progress'),
    completed: mockRemediationTasks.filter((t) => t.status === 'completed'),
  };

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Remediation Tasks</h3>
        <button className="btn btn-primary text-sm">
          <Zap className="w-4 h-4" />
          Auto-generate Tasks
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Pending */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground uppercase">Pending</div>
          {statusGroups.pending.map((task) => (
            <div key={task.id} className="p-3 rounded-lg bg-background-tertiary border border-border">
              <span className={`badge badge-${task.priority} text-xs mb-2`}>{task.priority}</span>
              <p className="text-sm font-medium line-clamp-2">{task.title}</p>
              <p className="text-xs text-muted-foreground mt-2">{task.affectedAssets} assets</p>
            </div>
          ))}
        </div>

        {/* In Progress */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-severity-medium uppercase">In Progress</div>
          {statusGroups.in_progress.map((task) => (
            <div key={task.id} className="p-3 rounded-lg bg-severity-medium/10 border border-severity-medium/20">
              <span className={`badge badge-${task.priority} text-xs mb-2`}>{task.priority}</span>
              <p className="text-sm font-medium line-clamp-2">{task.title}</p>
              <div className="mt-2">
                <div className="h-1 bg-background-tertiary rounded-full overflow-hidden">
                  <div className="h-full w-1/2 bg-severity-medium rounded-full" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">50% complete</p>
            </div>
          ))}
        </div>

        {/* Completed */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-accent-success uppercase">Completed</div>
          {statusGroups.completed.map((task) => (
            <div key={task.id} className="p-3 rounded-lg bg-accent-success/10 border border-accent-success/20">
              <CheckCircle className="w-4 h-4 text-accent-success mb-2" />
              <p className="text-sm font-medium line-clamp-2">{task.title}</p>
              <p className="text-xs text-muted-foreground mt-2">Completed {formatRelativeTime(new Date().toISOString())}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CVEDetailPanel({ cve, onClose }: { cve: typeof mockCves[0]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-background-secondary border-l border-border overflow-y-auto animate-slide-up">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="font-mono text-xl font-bold text-accent-primary">{cve.cveId}</span>
              <div className="flex items-center gap-2 mt-2">
                <span className={`badge badge-${cve.severity}`}>{cve.severity}</span>
                {cve.isKnownExploited && <span className="badge badge-critical">Known Exploited</span>}
                <span className="badge badge-info">{cve.status.replace('_', ' ')}</span>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-background-tertiary">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="card p-4 bg-background-tertiary">
              <p className="text-sm text-muted-foreground">CVSS Score</p>
              <p className="text-4xl font-bold">{cve.cvssScore}</p>
            </div>
            <div className="card p-4 bg-background-tertiary">
              <p className="text-sm text-muted-foreground">EPSS Score</p>
              <p className="text-4xl font-bold">{formatPercent(cve.epssScore * 100)}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-sm text-muted-foreground">{cve.description}</p>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Affected Assets ({cve.affectedAssetCount})</h3>
            <div className="space-y-2">
              {cve.matchedAssets.map((asset, i) => (
                <div key={i} className="flex items-center gap-2 p-3 rounded-lg bg-background-tertiary border border-border">
                  <Activity className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{asset}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Affected Products (CPE)</h3>
            <div className="space-y-1">
              {cve.affectedProducts.map((product, i) => (
                <code key={i} className="block text-xs p-2 rounded bg-background-tertiary text-muted-foreground">
                  {product}
                </code>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button className="btn btn-primary flex-1">
              <Zap className="w-4 h-4" />
              Create Remediation Task
            </button>
            <button className="btn btn-outline">
              <GitBranch className="w-4 h-4" />
              Create Workflow
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VulnerabilitiesPage() {
  const [selectedCve, setSelectedCve] = useState<typeof mockCves[0] | null>(null);
  const [cves, setCves] = useState(mockCves);
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    const es = new EventSource('/api/vulnerabilities/stream');
    setIsStreaming(true);
    
    es.onmessage = (event) => {
      if (event.data === '[DONE]') return;
      try {
        const payload = JSON.parse(event.data);
        setCves(prev => {
          if (prev.find(c => c.id === payload.id)) return prev;
          
          // Generate realistic mock matched assets if it's a new simulated stream
          if (!payload.matchedAssets) {
             payload.matchedAssets = ['Enterprise Core Router', 'Employee Portal'];
             payload.affectedAssetCount = 2;
          }
          
          return [payload, ...prev];
        });
      } catch (e) {}
    };

    es.onerror = () => {
      setIsStreaming(false);
      es.close();
    };

    return () => {
      setIsStreaming(false);
      es.close();
    };
  }, []);

  return (
    <div className="space-y-6 animate-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Vulnerability Intelligence Center</h1>
          <p className="text-muted-foreground">NVD integration with infrastructure correlation and automated remediation</p>
        </div>
        <div className="flex items-center gap-3">
          {isStreaming ? (
            <span className="badge badge-success animate-pulse border-accent-success px-3 py-1.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent-success block" />
              Live Feed Active
            </span>
          ) : (
            <button className="btn btn-outline" onClick={() => window.location.reload()}>
              <RefreshCw className="w-4 h-4" />
              Reconnect Feed
            </button>
          )}
          <button className="btn btn-primary shadow-lg shadow-accent-primary/20">
            <Zap className="w-4 h-4" />
            Run Correlation Engine
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4 glass">
          <p className="text-sm text-muted-foreground">Total CVEs</p>
          <p className="text-3xl font-bold">{(234567 + (cves.length - mockCves.length)).toLocaleString()}</p>
          <p className="text-xs text-accent-success flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> +{(1234 + (cves.length - mockCves.length)).toLocaleString()} this week
          </p>
        </div>
        <div className="card p-4 glass">
          <p className="text-sm text-muted-foreground">Critical CVEs</p>
          <p className="text-3xl font-bold text-severity-critical">{cves.filter(c => c.severity === 'critical').length + 7}</p>
          <p className="text-xs text-muted-foreground mt-1">4 with KEV status</p>
        </div>
        <div className="card p-4 glass">
          <p className="text-sm text-muted-foreground">Matched Assets</p>
          <p className="text-3xl font-bold">{234 + (cves.length - mockCves.length) * 2}</p>
          <p className="text-xs text-severity-high mt-1">12 critical exposure</p>
        </div>
        <div className="card p-4 glass">
          <p className="text-sm text-muted-foreground">Active Remediation</p>
          <p className="text-3xl font-bold">7</p>
          <p className="text-xs text-accent-success mt-1">3 completing today</p>
        </div>
      </div>

      {/* CVE List */}
      <CVEFilters />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CVE Grid - Showing top 10 to prevent layout blow up if left streaming */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cves.slice(0, 10).map((cve) => (
              <div key={cve.id} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <CVECard cve={cve} onClick={() => setSelectedCve(cve)} />
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <FeedStatus />
          <AlertPanel />
        </div>
      </div>

      {/* Remediation Task Board */}
      <RemediationTaskBoard />

      {/* CVE Detail Panel */}
      {selectedCve && (
        <CVEDetailPanel cve={selectedCve} onClose={() => setSelectedCve(null)} />
      )}
    </div>
  );
}