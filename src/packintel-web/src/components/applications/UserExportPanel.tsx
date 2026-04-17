'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Users,
  Download,
  Filter,
  Search,
  Send,
  CheckCircle,
  ArrowRight,
  RefreshCw,
  X,
  Mail,
  Monitor,
} from 'lucide-react';

interface AppUser {
  id: string;
  email: string;
  displayName: string;
  device: string;
  installedVersion: string;
  lastSeen: string;
  selected: boolean;
}

interface UserExportPanelProps {
  appName: string;
  latestVersion: string;
  appOwner: string;
  onClose: () => void;
}

function generateMockUsers(appName: string, latestVersion: string): AppUser[] {
  const names = [
    { name: 'James Wilson', email: 'james.wilson@company.com', device: 'LAPTOP-FIN-042' },
    { name: 'Priya Sharma', email: 'priya.sharma@company.com', device: 'LAPTOP-ENG-118' },
    { name: 'Maria Garcia', email: 'maria.garcia@company.com', device: 'LAPTOP-OPS-071' },
    { name: 'David Kim', email: 'david.kim@company.com', device: 'LAPTOP-MKT-033' },
    { name: 'Sarah Chen', email: 'sarah.chen@company.com', device: 'LAPTOP-FIN-089' },
    { name: 'Alex Thompson', email: 'alex.thompson@company.com', device: 'LAPTOP-IT-015' },
    { name: 'Fatima Al-Rashid', email: 'fatima.alrashid@company.com', device: 'LAPTOP-HR-027' },
    { name: 'Tom Roberts', email: 'tom.roberts@company.com', device: 'DESKTOP-ENG-201' },
    { name: 'Lisa Park', email: 'lisa.park@company.com', device: 'LAPTOP-SAL-044' },
    { name: 'Raj Patel', email: 'raj.patel@company.com', device: 'LAPTOP-FIN-056' },
    { name: 'Emma Brown', email: 'emma.brown@company.com', device: 'LAPTOP-OPS-098' },
    { name: 'Mike Johnson', email: 'mike.johnson@company.com', device: 'DESKTOP-ENG-205' },
  ];

  const oldVersions = [
    latestVersion,
    latestVersion.replace(/\d+$/, (m) => String(Math.max(0, parseInt(m) - 1))),
    latestVersion.replace(/\d+$/, (m) => String(Math.max(0, parseInt(m) - 5))),
    latestVersion.replace(/\.\d+\.\d+$/, '.0.1000'),
  ];

  return names.map((n, i) => ({
    id: 'u' + (i + 1),
    email: n.email,
    displayName: n.name,
    device: n.device,
    installedVersion: oldVersions[i % oldVersions.length],
    lastSeen: i < 4 ? '2 hours ago' : i < 8 ? '1 day ago' : '3 days ago',
    selected: false,
  }));
}

export function UserExportPanel({ appName, latestVersion, appOwner, onClose }: UserExportPanelProps) {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [versionFilter, setVersionFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [commsSent, setCommsSent] = useState(false);
  const [isSendingComms, setIsSendingComms] = useState(false);
  const [deploymentStarted, setDeploymentStarted] = useState(false);

  const startScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setUsers(generateMockUsers(appName, latestVersion));
      setIsScanning(false);
      setScanned(true);
    }, 2000);
  };

  const versions = Array.from(new Set(users.map(u => u.installedVersion)));
  const outdatedVersions = versions.filter(v => v !== latestVersion);

  const filteredUsers = users.filter(u => {
    const matchesVersion = versionFilter === 'all' ? true
      : versionFilter === 'outdated' ? u.installedVersion !== latestVersion
      : u.installedVersion === versionFilter;
    const matchesSearch = !searchQuery
      || u.displayName.toLowerCase().includes(searchQuery.toLowerCase())
      || u.email.toLowerCase().includes(searchQuery.toLowerCase())
      || u.device.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesVersion && matchesSearch;
  });

  const selectedCount = users.filter(u => u.selected).length;

  const toggleSelect = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, selected: !u.selected } : u));
  };

  const selectAllFiltered = () => {
    const filteredIds = new Set(filteredUsers.map(u => u.id));
    const allSelected = filteredUsers.every(u => u.selected);
    setUsers(prev => prev.map(u => filteredIds.has(u.id) ? { ...u, selected: !allSelected } : u));
  };

  const selectOutdated = () => {
    setUsers(prev => prev.map(u => u.installedVersion !== latestVersion ? { ...u, selected: true } : u));
  };

  const sendComms = () => {
    if (selectedCount === 0) return;
    setIsSendingComms(true);
    setTimeout(() => {
      setIsSendingComms(false);
      setCommsSent(true);
    }, 1500);
  };

  const startTargetedDeployment = () => {
    setDeploymentStarted(true);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-background-secondary border border-border w-full max-w-4xl rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent-secondary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-accent-secondary" />
            </div>
            <div>
              <h2 className="text-lg font-bold">User Export &amp; Targeted Deployment</h2>
              <p className="text-sm text-muted-foreground">{appName} &bull; Latest: v{latestVersion}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-background-tertiary rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Pre-scan state */}
          {!scanned && (
            <div className="text-center py-12">
              <Monitor className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Scan Intune for {appName} Users</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                This will query all managed devices for installations of {appName} and return version-level telemetry for each user.
              </p>
              <button onClick={startScan} disabled={isScanning} className="btn btn-primary">
                {isScanning ? (
                  <><RefreshCw className="w-4 h-4 animate-spin mr-2" /> Scanning Intune devices...</>
                ) : (
                  <><Search className="w-4 h-4 mr-2" /> Export User Data</>
                )}
              </button>
            </div>
          )}

          {/* Post-scan results */}
          {scanned && (
            <div className="space-y-4">
              {/* Summary bar */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-medium">{users.length} users found</span>
                <span className="text-xs text-muted-foreground">|</span>
                <span className="text-sm text-accent-warning font-medium">
                  {users.filter(u => u.installedVersion !== latestVersion).length} on outdated versions
                </span>
                <span className="text-xs text-muted-foreground">|</span>
                <span className="text-sm text-accent-primary font-medium">{selectedCount} selected</span>
                <div className="ml-auto flex gap-2">
                  <button onClick={selectOutdated} className="btn btn-outline btn-sm text-xs">
                    Select All Outdated
                  </button>
                  <button className="btn btn-outline btn-sm text-xs">
                    <Download className="w-3 h-3 mr-1" /> Export CSV
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, email, or device..."
                    className="input pl-9 text-sm h-9 w-full"
                  />
                </div>
                <select
                  value={versionFilter}
                  onChange={(e) => setVersionFilter(e.target.value)}
                  className="input w-auto text-sm h-9"
                >
                  <option value="all">All Versions</option>
                  <option value="outdated">Outdated Only</option>
                  {versions.map(v => (
                    <option key={v} value={v}>v{v}{v === latestVersion ? ' (latest)' : ''}</option>
                  ))}
                </select>
              </div>

              {/* User Table */}
              <div className="table-container border border-border rounded-lg overflow-hidden">
                <table className="table w-full text-left">
                  <thead>
                    <tr className="bg-background-tertiary/50">
                      <th className="px-3 py-2 w-10">
                        <input
                          type="checkbox"
                          checked={filteredUsers.length > 0 && filteredUsers.every(u => u.selected)}
                          onChange={selectAllFiltered}
                          className="rounded"
                        />
                      </th>
                      <th className="px-3 py-2 text-xs font-medium text-muted-foreground">User</th>
                      <th className="px-3 py-2 text-xs font-medium text-muted-foreground">Device</th>
                      <th className="px-3 py-2 text-xs font-medium text-muted-foreground">Installed Version</th>
                      <th className="px-3 py-2 text-xs font-medium text-muted-foreground">Last Seen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => {
                      const isOutdated = user.installedVersion !== latestVersion;
                      return (
                        <tr
                          key={user.id}
                          onClick={() => toggleSelect(user.id)}
                          className={cn(
                            'cursor-pointer transition-colors border-b border-border/30',
                            user.selected ? 'bg-accent-primary/5' : 'hover:bg-background-tertiary/30'
                          )}
                        >
                          <td className="px-3 py-2">
                            <input
                              type="checkbox"
                              checked={user.selected}
                              onChange={() => toggleSelect(user.id)}
                              className="rounded"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <p className="text-sm font-medium">{user.displayName}</p>
                            <p className="text-[10px] text-muted-foreground">{user.email}</p>
                          </td>
                          <td className="px-3 py-2 text-sm font-mono text-muted-foreground">{user.device}</td>
                          <td className="px-3 py-2">
                            <span className={cn(
                              'text-sm font-mono px-2 py-0.5 rounded',
                              isOutdated ? 'bg-accent-warning/10 text-accent-warning' : 'bg-accent-success/10 text-accent-success'
                            )}>
                              v{user.installedVersion}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-xs text-muted-foreground">{user.lastSeen}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Action Bar */}
              {selectedCount > 0 && (
                <div className="bg-background p-4 rounded-lg border border-accent-primary/30 space-y-3 animate-in">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">
                      <span className="text-accent-primary">{selectedCount}</span> users selected for action
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>App Owner: <strong className="text-foreground">{appOwner}</strong></span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Send Comms */}
                    <button
                      onClick={sendComms}
                      disabled={isSendingComms || commsSent}
                      className={cn(
                        'btn justify-center py-3 h-auto',
                        commsSent ? 'btn-outline border-accent-success/30 text-accent-success' : 'btn-outline'
                      )}
                    >
                      {commsSent ? (
                        <><CheckCircle className="w-4 h-4 mr-2" /> Comms Sent (CC: {appOwner})</>
                      ) : isSendingComms ? (
                        <><RefreshCw className="w-4 h-4 animate-spin mr-2" /> Sending...</>
                      ) : (
                        <><Mail className="w-4 h-4 mr-2" /> Send Upgrade Notification (CC: {appOwner})</>
                      )}
                    </button>

                    {/* Target Deployment */}
                    <button
                      onClick={startTargetedDeployment}
                      disabled={deploymentStarted}
                      className={cn(
                        'btn justify-center py-3 h-auto',
                        deploymentStarted ? 'btn-outline border-accent-success/30 text-accent-success' : 'btn-primary'
                      )}
                    >
                      {deploymentStarted ? (
                        <><CheckCircle className="w-4 h-4 mr-2" /> Deployment Queued via Intune</>
                      ) : (
                        <><ArrowRight className="w-4 h-4 mr-2" /> Deploy v{latestVersion} to Selected Users</>
                      )}
                    </button>
                  </div>

                  {commsSent && (
                    <div className="bg-background-tertiary p-3 rounded-lg text-xs space-y-1 mt-2">
                      <p className="font-medium text-muted-foreground">Email Preview:</p>
                      <p><strong>To:</strong> {selectedCount} selected users</p>
                      <p><strong>CC:</strong> {appOwner}</p>
                      <p><strong>Subject:</strong> [Action Required] {appName} upgrade to v{latestVersion}</p>
                      <p className="text-muted-foreground mt-1">
                        Dear User, your current version of {appName} will be upgraded to v{latestVersion} as part of our scheduled maintenance.
                        The update will be pushed to your device via Intune within the next 24 hours. Please save your work and restart when prompted.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
