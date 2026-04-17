'use client';

import { useState } from 'react';
import { cn, formatNumber } from '@/lib/utils';
import {
  Server,
  MapPin,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Shield,
  Zap,
  Wifi,
  HardDrive,
  Users,
  Globe,
  RefreshCw,
  Maximize2,
} from 'lucide-react';

const mockRegions = [
  { id: 'uk-south', name: 'UK South', vmCount: 15234, activeCount: 14890, utilization: 78, criticalPatches: 3, status: 'healthy' as const },
  { id: 'uk-west', name: 'UK West', vmCount: 12456, activeCount: 12100, utilization: 72, criticalPatches: 5, status: 'healthy' as const },
  { id: 'uk-north', name: 'UK North', vmCount: 8934, activeCount: 8700, utilization: 65, criticalPatches: 2, status: 'healthy' as const },
  { id: 'uk-central', name: 'UK Central', vmCount: 8545, activeCount: 8340, utilization: 82, criticalPatches: 4, status: 'degraded' as const },
];

const mockPlatforms = [
  { name: 'Intune', status: 'healthy' as const, deviceCount: 45230, lastSync: '2 min ago', latency: 45 },
  { name: 'ConfigMgr', status: 'healthy' as const, deviceCount: 12890, lastSync: '5 min ago', latency: 120 },
  { name: 'Azure AD', status: 'healthy' as const, deviceCount: 52100, lastSync: '1 min ago', latency: 32 },
  { name: 'Graph API', status: 'degraded' as const, deviceCount: null, lastSync: '10 min ago', latency: 850 },
];

const mockAlerts = [
  { id: '1', message: 'Capacity pressure detected in UK Central', severity: 'high' as const, time: '15 min ago' },
  { id: '2', message: 'Graph API latency elevated', severity: 'medium' as const, time: '1 hour ago' },
  { id: '3', message: '3 devices failed compliance check', severity: 'low' as const, time: '2 hours ago' },
];

function RegionCard({ region, onSelect }: { region: typeof mockRegions[0]; onSelect: () => void }) {
  return (
    <div
      onClick={onSelect}
      className={cn(
        'card p-4 card-hover cursor-pointer',
        region.status === 'degraded' && 'border-severity-medium/50'
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            'w-10 h-10 rounded-lg flex items-center justify-center',
            region.status === 'healthy' ? 'bg-accent-success/10' : 'bg-severity-medium/10'
          )}>
            <MapPin className={cn(
              'w-5 h-5',
              region.status === 'healthy' ? 'text-accent-success' : 'text-severity-medium'
            )} />
          </div>
          <div>
            <h3 className="font-medium">{region.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={cn(
                'status-dot',
                region.status === 'healthy' ? 'status-dot-healthy' : 'status-dot-degraded'
              )} />
              <span className="text-xs text-muted-foreground capitalize">{region.status}</span>
            </div>
          </div>
        </div>
        <button className="p-1.5 rounded hover:bg-background-tertiary">
          <Maximize2 className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-muted-foreground">Total VMs</p>
          <p className="text-2xl font-bold">{formatNumber(region.vmCount)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Active</p>
          <p className="text-2xl font-bold text-accent-success">{formatNumber(region.activeCount)}</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-muted-foreground">Utilization</span>
          <span className={region.utilization > 80 ? 'text-severity-medium' : 'text-foreground'}>{region.utilization}%</span>
        </div>
        <div className="h-2 bg-background-tertiary rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all',
              region.utilization > 80 ? 'bg-severity-medium' : 'bg-accent-primary'
            )}
            style={{ width: `${region.utilization}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-severity-critical" />
          <span className="text-sm">
            <span className="font-medium">{region.criticalPatches}</span>
            <span className="text-muted-foreground"> critical patches</span>
          </span>
        </div>
        <TrendingUp className="w-4 h-4 text-accent-success" />
      </div>
    </div>
  );
}

function PlatformCard({ platform }: { platform: typeof mockPlatforms[0] }) {
  return (
    <div className="card p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={cn(
            'w-8 h-8 rounded-lg flex items-center justify-center',
            platform.status === 'healthy' ? 'bg-accent-success/10' : 'bg-severity-medium/10'
          )}>
            <Wifi className={cn(
              'w-4 h-4',
              platform.status === 'healthy' ? 'text-accent-success' : 'text-severity-medium'
            )} />
          </div>
          <div>
            <h3 className="font-medium">{platform.name}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={cn(
                'status-dot',
                platform.status === 'healthy' ? 'status-dot-healthy' : 'status-dot-degraded'
              )} />
              <span className="text-xs text-muted-foreground capitalize">{platform.status}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {platform.deviceCount && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Devices</span>
            <span className="text-sm font-medium">{formatNumber(platform.deviceCount)}</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Last Sync</span>
          <span className="text-sm">{platform.lastSync}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Latency</span>
          <span className={cn(
            'text-sm font-medium',
            platform.latency > 500 ? 'text-severity-medium' : 'text-accent-success'
          )}>
            {platform.latency}ms
          </span>
        </div>
      </div>
    </div>
  );
}

function QueuePressure() {
  const queues = [
    { name: 'Packaging Queue', count: 23, capacity: 50, trend: 'up' as const },
    { name: 'Deployment Queue', count: 156, capacity: 200, trend: 'down' as const },
    { name: 'Validation Queue', count: 8, capacity: 30, trend: 'stable' as const },
  ];

  return (
    <div className="card p-4">
      <h3 className="font-semibold mb-4">Queue Pressure</h3>
      <div className="space-y-4">
        {queues.map((queue, i) => {
          const utilization = (queue.count / queue.capacity) * 100;
          return (
            <div key={i}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">{queue.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{queue.count}/{queue.capacity}</span>
                  {queue.trend === 'up' && <TrendingUp className="w-3 h-3 text-severity-medium" />}
                  {queue.trend === 'down' && <TrendingDown className="w-3 h-3 text-accent-success" />}
                </div>
              </div>
              <div className="h-2 bg-background-tertiary rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full',
                    utilization > 80 ? 'bg-severity-medium' :
                    utilization > 50 ? 'bg-accent-warning' : 'bg-accent-primary'
                  )}
                  style={{ width: `${utilization}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EstateOverview() {
  const totalVMs = mockRegions.reduce((sum, r) => sum + r.vmCount, 0);
  const totalActive = mockRegions.reduce((sum, r) => sum + r.activeCount, 0);
  const avgUtilization = Math.round(
    mockRegions.reduce((sum, r) => sum + r.utilization, 0) / mockRegions.length
  );
  const totalCriticalPatches = mockRegions.reduce((sum, r) => sum + r.criticalPatches, 0);

  return (
    <div className="card p-4">
      <h3 className="font-semibold mb-4">VM Estate Overview</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 rounded-lg bg-background-tertiary">
          <Server className="w-8 h-8 mx-auto mb-2 text-accent-primary" />
          <p className="text-3xl font-bold">{formatNumber(totalVMs)}</p>
          <p className="text-xs text-muted-foreground">Total VMs</p>
        </div>
        <div className="text-center p-4 rounded-lg bg-background-tertiary">
          <Activity className="w-8 h-8 mx-auto mb-2 text-accent-success" />
          <p className="text-3xl font-bold">{formatNumber(totalActive)}</p>
          <p className="text-xs text-muted-foreground">Active</p>
        </div>
        <div className="text-center p-4 rounded-lg bg-background-tertiary">
          <TrendingUp className="w-8 h-8 mx-auto mb-2 text-accent-secondary" />
          <p className="text-3xl font-bold">{avgUtilization}%</p>
          <p className="text-xs text-muted-foreground">Avg Utilization</p>
        </div>
        <div className="text-center p-4 rounded-lg bg-background-tertiary">
          <Shield className="w-8 h-8 mx-auto mb-2 text-severity-critical" />
          <p className="text-3xl font-bold text-severity-critical">{totalCriticalPatches}</p>
          <p className="text-xs text-muted-foreground">Critical Patches</p>
        </div>
      </div>
    </div>
  );
}

function GeographicHeatmap() {
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Geographic Distribution</h3>
        <button className="btn btn-ghost text-xs">
          <RefreshCw className="w-3 h-3" />
          Refresh
        </button>
      </div>

      <div className="relative h-64 rounded-lg bg-background-tertiary overflow-hidden">
        {/* Simplified UK map representation */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="grid grid-cols-2 gap-4 p-8">
            {mockRegions.map((region) => (
              <div
                key={region.id}
                className={cn(
                  'w-32 h-20 rounded-lg flex flex-col items-center justify-center',
                  region.status === 'healthy'
                    ? 'bg-accent-success/20 border border-accent-success/30'
                    : 'bg-severity-medium/20 border border-severity-medium/30'
                )}
              >
                <span className="text-sm font-medium">{region.name}</span>
                <span className="text-2xl font-bold">{formatNumber(region.vmCount)}</span>
                <span className="text-xs text-muted-foreground">VMs</span>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-2 right-2 flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-accent-success" />
            <span>Healthy</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-severity-medium" />
            <span>Degraded</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InfrastructurePage() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  return (
    <div className="space-y-6 animate-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Infrastructure Monitor</h1>
          <p className="text-muted-foreground">Real-time VM estate visibility across UK regions</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-outline">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button className="btn btn-primary">
            <Zap className="w-4 h-4" />
            Capacity Planning
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-3 mb-2">
            <Server className="w-5 h-5 text-accent-primary" />
            <span className="text-sm text-muted-foreground">Total VMs</span>
          </div>
          <p className="text-3xl font-bold">{formatNumber(45169)}</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-5 h-5 text-accent-success" />
            <span className="text-sm text-muted-foreground">Active</span>
          </div>
          <p className="text-3xl font-bold">{formatNumber(44030)}</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3 mb-2">
            <HardDrive className="w-5 h-5 text-accent-secondary" />
            <span className="text-sm text-muted-foreground">Avg Utilization</span>
          </div>
          <p className="text-3xl font-bold">74%</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-5 h-5 text-severity-critical" />
            <span className="text-sm text-muted-foreground">Critical Patches</span>
          </div>
          <p className="text-3xl font-bold text-severity-critical">14</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Regions & Map */}
        <div className="lg:col-span-2 space-y-6">
          {/* Geographic Heatmap */}
          <GeographicHeatmap />

          {/* Region Cards */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Regional Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockRegions.map((region) => (
                <RegionCard
                  key={region.id}
                  region={region}
                  onSelect={() => setSelectedRegion(region.id)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Platform & Queue */}
        <div className="space-y-6">
          {/* Platform Health */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Platform Health</h2>
            <div className="space-y-4">
              {mockPlatforms.map((platform) => (
                <PlatformCard key={platform.name} platform={platform} />
              ))}
            </div>
          </div>

          {/* Queue Pressure */}
          <QueuePressure />

          {/* Real-time Alerts */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-accent-warning" />
                Live Alerts
              </h3>
              <span className="badge badge-medium">{mockAlerts.length}</span>
            </div>
            <div className="space-y-3">
              {mockAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={cn(
                    'p-3 rounded-lg border',
                    alert.severity === 'high' && 'bg-severity-high/10 border-severity-high/20',
                    alert.severity === 'medium' && 'bg-severity-medium/10 border-severity-medium/20',
                    alert.severity === 'low' && 'bg-background-tertiary border-border'
                  )}
                >
                  <div className="flex items-start justify-between">
                    <p className="text-sm">{alert.message}</p>
                    <span className={`badge badge-${alert.severity} text-xs`}>{alert.severity}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
