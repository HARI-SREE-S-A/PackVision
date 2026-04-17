'use client';

import { useDashboardStore, useVulnerabilityStore } from '@/store';
import Link from 'next/link';
import {
  formatNumber,
  formatPercent,
  getSeverityColor,
  getSeverityBgColor,
  formatRelativeTime,
} from '@/lib/utils';
import {
  Activity,
  Package,
  TrendingUp,
  CheckCircle,
  DollarSign,
  Shield,
  AlertTriangle,
  Server,
  Bot,
  Clock,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  ChevronRight,
} from 'lucide-react';

// Mock data for demonstration
const mockMetrics = [
  { name: 'Active VMs', value: 45230, previousValue: 44820, unit: '', category: 'vm', href: '/infrastructure' },
  { name: 'Daily Throughput', value: 47, previousValue: 42, unit: 'apps', category: 'throughput', href: '/applications' },
  { name: 'Deployment Success', value: 97.3, previousValue: 96.8, unit: '%', category: 'success', href: '/workflows' },
  { name: 'Monthly Savings', value: 127500, previousValue: 115000, unit: '$', category: 'savings', href: '/assets' },
];

const mockAlerts = [
  {
    id: '1',
    title: 'Critical CVE-2024-3094 (XZ Utils)',
    message: '4 critical applications affected requiring immediate patching',
    severity: 'critical' as const,
    status: 'active' as const,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Deployment Paused: Finance App Update',
    message: 'Failure rate exceeded 5% threshold in UK region',
    severity: 'high' as const,
    status: 'active' as const,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '3',
    title: 'High EPSS Score Detected',
    message: 'CVE-2024-23897 has EPSS score of 0.94',
    severity: 'high' as const,
    status: 'acknowledged' as const,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
];

const mockRollouts = [
  {
    id: '1',
    applicationName: 'Microsoft 365 Apps',
    packageVersion: '16.0.23801.2024',
    status: 'in_progress' as const,
    totalDevices: 4500,
    completedDevices: 3100,
    failedDevices: 12,
    inProgressDevices: 1388,
    estimatedCompletionAt: new Date(Date.now() + 3600000 * 4).toISOString(),
    currentStage: 'Broad Deployment',
  },
  {
    id: '2',
    applicationName: 'Zoom Workplace',
    packageVersion: '6.0.20.2404',
    status: 'in_progress' as const,
    totalDevices: 890,
    completedDevices: 890,
    failedDevices: 3,
    inProgressDevices: 0,
    estimatedCompletionAt: new Date(Date.now() - 3600000).toISOString(),
    currentStage: 'Completed',
  },
];

const mockAiHealth = {
  azureOpenAI: { status: 'healthy' as const, lastCheck: '2 min ago' },
  copilot: { status: 'healthy' as const, lastCheck: '5 min ago' },
  graph: { status: 'healthy' as const, lastCheck: '1 min ago' },
};

function KPICard({
  title,
  value,
  previousValue,
  unit,
  icon: Icon,
  href,
}: {
  title: string;
  value: number;
  previousValue?: number;
  unit: string;
  icon: React.ElementType;
  href: string;
}) {
  const trend = previousValue ? ((value - previousValue) / previousValue) * 100 : 0;

  return (
    <Link href={href}>
      <div className="card p-4 card-hover cursor-pointer group">
        <div className="flex items-center justify-between mb-3">
          <div className="p-2 rounded-lg bg-accent-primary/10">
            <Icon className="w-5 h-5 text-accent-primary" />
          </div>
          <div className="flex items-center gap-2">
            {trend !== 0 && (
              <div className={`flex items-center gap-1 text-xs font-medium ${trend > 0 ? 'text-accent-success' : 'text-accent-danger'}`}>
                {trend > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {formatPercent(Math.abs(trend))}
              </div>
            )}
            <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
        <p className="kpi-label">{title}</p>
        <p className="kpi-value">
          {unit === '$' ? `$${formatNumber(value)}` : unit === '%' ? formatPercent(value) : formatNumber(value)}
          {unit && unit !== '$' && unit !== '%' && <span className="text-sm text-muted-foreground ml-1">{unit}</span>}
        </p>
      </div>
    </Link>
  );
}

function AlertCard({ alert }: { alert: typeof mockAlerts[0] }) {
  return (
    <Link href="/vulnerabilities">
      <div className={`p-4 rounded-lg border cursor-pointer hover:opacity-80 transition-opacity ${getSeverityBgColor(alert.severity)}`}>
        <div className="flex items-start gap-3">
          <AlertTriangle className={`w-5 h-5 mt-0.5 ${getSeverityColor(alert.severity)}`} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className={`badge ${`badge-${alert.severity}`}`}>{alert.severity}</span>
              <span className="text-xs text-muted-foreground">{formatRelativeTime(alert.createdAt)}</span>
            </div>
            <p className="font-medium mt-1">{alert.title}</p>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{alert.message}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

function RolloutCard({ rollout }: { rollout: typeof mockRollouts[0] }) {
  const progress = (rollout.completedDevices / rollout.totalDevices) * 100;

  return (
    <Link href="/applications">
      <div className="card p-4 card-hover cursor-pointer">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-medium">{rollout.applicationName}</p>
            <p className="text-sm text-muted-foreground">v{rollout.packageVersion}</p>
          </div>
          <span className={`badge ${rollout.status === 'in_progress' ? 'badge-medium' : 'badge-info'}`}>
            {rollout.status.replace('_', ' ')}
          </span>
        </div>

        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>{formatNumber(rollout.completedDevices)} / {formatNumber(rollout.totalDevices)} devices</span>
            <span>{formatPercent(progress, 0)}</span>
          </div>
          <div className="h-2 bg-background-tertiary rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {rollout.failedDevices > 0 && (
            <span className="flex items-center gap-1 text-accent-danger">
              <AlertTriangle className="w-3 h-3" /> {rollout.failedDevices} failed
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> ETA: {new Date(rollout.estimatedCompletionAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </Link>
  );
}

function AIHealthWidget() {
  const services = [
    { name: 'Azure OpenAI', ...mockAiHealth.azureOpenAI },
    { name: 'GitHub Copilot', ...mockAiHealth.copilot },
    { name: 'Microsoft Graph', ...mockAiHealth.graph },
  ];

  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 mb-4">
        <Bot className="w-5 h-5 text-accent-secondary" />
        <h3 className="font-semibold">AI Services Health</h3>
      </div>

      <div className="space-y-3">
        {services.map((service) => (
          <div key={service.name} className="flex items-center justify-between">
            <span className="text-sm">{service.name}</span>
            <div className="flex items-center gap-2">
              <span className={`status-dot status-dot-${service.status}`} />
              <span className="text-xs text-muted-foreground">{service.lastCheck}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuickActions() {
  const actions = [
    { label: 'Create Package', icon: Package, href: '/applications' },
    { label: 'AI Assistant', icon: Bot, href: '#chat' },
    { label: 'Workflow Studio', icon: Zap, href: '/workflows' },
    { label: 'Team Workload', icon: Users, href: '/teams' },
  ];

  return (
    <div className="card p-4">
      <h3 className="font-semibold mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-2">
        {actions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background-tertiary hover:bg-accent-primary/10 text-foreground hover:text-accent-primary transition-colors"
          >
            <action.icon className="w-4 h-4" />
            <span className="text-sm font-medium">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-6 animate-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">Overview Dashboard</h1>
        <p className="text-muted-foreground">Real-time operational visibility and business impact</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Active VMs" value={mockMetrics[0].value} previousValue={mockMetrics[0].previousValue} unit="" icon={Server} href="/infrastructure" />
        <KPICard title="Daily Throughput" value={mockMetrics[1].value} previousValue={mockMetrics[1].previousValue} unit="apps" icon={Package} href="/applications" />
        <KPICard title="Deployment Success" value={mockMetrics[2].value} previousValue={mockMetrics[2].previousValue} unit="%" icon={CheckCircle} href="/workflows" />
        <KPICard title="Monthly Savings" value={mockMetrics[3].value} previousValue={mockMetrics[3].previousValue} unit="$" icon={DollarSign} href="/assets" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Alerts & Rollouts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Rollouts */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Activity className="w-5 h-5 text-accent-primary" />
                Active Rollouts
              </h2>
              <Link href="/applications" className="text-sm text-accent-primary hover:underline flex items-center gap-1">
                View all <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockRollouts.map((rollout) => (
                <RolloutCard key={rollout.id} rollout={rollout} />
              ))}
            </div>
          </div>

          {/* Critical Alerts */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Shield className="w-5 h-5 text-accent-danger" />
                Critical Alerts
              </h2>
              <Link href="/vulnerabilities" className="text-sm text-accent-primary hover:underline flex items-center gap-1">
                View all <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {mockAlerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - AI Health & Quick Actions */}
        <div className="space-y-6">
          <AIHealthWidget />
          <QuickActions />

          {/* Vulnerability Summary */}
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-severity-high" />
              <h3 className="font-semibold">Vulnerability Exposure</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Critical CVEs</span>
                <span className="badge badge-critical">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">High Risk CVEs</span>
                <span className="badge badge-high">47</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">KEV Vulnerabilities</span>
                <span className="badge badge-critical">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">At-Risk Devices</span>
                <span className="font-medium">234</span>
              </div>
            </div>
            <Link href="/vulnerabilities" className="w-full btn btn-outline mt-4 text-sm inline-flex justify-center">
              View Vulnerability Center
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
