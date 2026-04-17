'use client';

import { useState } from 'react';
import { cn, formatDate } from '@/lib/utils';
import {
  Users,
  Shield,
  Plug,
  FileText,
  Search,
  Filter,
  Plus,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  RefreshCw,
  Settings,
  Key,
  Eye,
  EyeOff,
  Trash2,
  Edit,
  ChevronRight,
} from 'lucide-react';

// Mock integrations data
const mockIntegrations = [
  {
    id: '1',
    name: 'Microsoft Graph',
    type: 'MicrosoftGraph',
    status: 'connected' as const,
    endpoint: 'https://graph.microsoft.com',
    lastConnected: '2024-04-17T10:30:00',
    permissions: ['User.Read.All', 'DeviceManagement.Read.All', 'Directory.Read.All'],
    health: 'healthy' as const,
    tenantId: 'contoso.onmicrosoft.com',
  },
  {
    id: '2',
    name: 'Microsoft Intune',
    type: 'Intune',
    status: 'connected' as const,
    endpoint: 'https://graph.microsoft.com/beta/deviceManagement',
    lastConnected: '2024-04-17T10:28:00',
    permissions: ['DeviceManagementManagedDevices.Read.All'],
    health: 'healthy' as const,
    tenantId: 'contoso.onmicrosoft.com',
  },
  {
    id: '3',
    name: 'Azure OpenAI',
    type: 'AzureOpenAI',
    status: 'connected' as const,
    endpoint: 'https://packintel-openai.openai.azure.com',
    lastConnected: '2024-04-17T10:25:00',
    permissions: ['Aoai.Read'],
    health: 'healthy' as const,
    quotaUsed: 142500,
    quotaLimit: 1000000,
  },
  {
    id: '4',
    name: 'NIST NVD API',
    type: 'NvdApi',
    status: 'connected' as const,
    endpoint: 'https://api.nvd.nist.gov',
    lastConnected: '2024-04-17T10:20:00',
    permissions: ['NvdApiKey'],
    health: 'healthy' as const,
    cveCount: 234567,
  },
  {
    id: '5',
    name: 'CISA KEV',
    type: 'CisaKev',
    status: 'connected' as const,
    endpoint: 'https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json',
    lastConnected: '2024-04-17T09:00:00',
    permissions: [],
    health: 'healthy' as const,
    cveCount: 1193,
  },
  {
    id: '6',
    name: 'GitHub Copilot',
    type: 'GitHubCopilot',
    status: 'degraded' as const,
    endpoint: 'https://api.github.com',
    lastConnected: '2024-04-17T08:45:00',
    permissions: [],
    health: 'degraded' as const,
    error: 'Rate limit approaching',
  },
];

// Mock users data
const mockUsers = [
  {
    id: '1',
    displayName: 'Operations Lead',
    email: 'ops@contoso.com',
    role: 'Platform Admin',
    status: 'active' as const,
    lastLogin: '2024-04-17T09:30:00',
    department: 'IT Operations',
  },
  {
    id: '2',
    displayName: 'John Smith',
    email: 'john.smith@contoso.com',
    role: 'Packaging Engineer',
    status: 'active' as const,
    lastLogin: '2024-04-17T10:15:00',
    department: 'IT Operations',
  },
  {
    id: '3',
    displayName: 'Sarah Johnson',
    email: 'sarah.j@contoso.com',
    role: 'EUC Operator',
    status: 'active' as const,
    lastLogin: '2024-04-16T16:45:00',
    department: 'IT Operations',
  },
  {
    id: '4',
    displayName: 'Mike Chen',
    email: 'mike.chen@contoso.com',
    role: 'Engineering Lead',
    status: 'active' as const,
    lastLogin: '2024-04-17T08:00:00',
    department: 'Engineering',
  },
  {
    id: '5',
    displayName: 'Emily Davis',
    email: 'emily.d@contoso.com',
    role: 'Security Analyst',
    status: 'inactive' as const,
    lastLogin: '2024-04-10T11:00:00',
    department: 'Security',
  },
];

const mockAuditLogs = [
  { id: '1', action: 'User logged in', user: 'ops@contoso.com', timestamp: '2024-04-17T09:30:00', status: 'success' as const },
  { id: '2', action: 'CVE sync completed', user: 'system', timestamp: '2024-04-17T09:00:00', status: 'success' as const },
  { id: '3', action: 'Deployment triggered', user: 'john.smith@contoso.com', timestamp: '2024-04-17T08:45:00', status: 'success' as const },
  { id: '4', action: 'Integration credentials updated', user: 'ops@contoso.com', timestamp: '2024-04-16T17:30:00', status: 'success' as const },
  { id: '5', action: 'Failed login attempt', user: 'unknown', timestamp: '2024-04-16T17:25:00', status: 'failure' as const },
];

function IntegrationCard({ integration }: { integration: typeof mockIntegrations[0] }) {
  const [showSecret, setShowSecret] = useState(false);

  return (
    <div className="card p-4">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            'w-10 h-10 rounded-lg flex items-center justify-center',
            integration.health === 'healthy' ? 'bg-accent-success/10' : 'bg-severity-medium/10'
          )}>
            <Plug className={cn(
              'w-5 h-5',
              integration.health === 'healthy' ? 'text-accent-success' : 'text-severity-medium'
            )} />
          </div>
          <div>
            <h3 className="font-medium">{integration.name}</h3>
            <p className="text-xs text-muted-foreground">{integration.endpoint}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn(
            'status-dot',
            integration.health === 'healthy' ? 'status-dot-healthy' : 'status-dot-degraded'
          )} />
          <span className={cn(
            'badge',
            integration.health === 'healthy' ? 'badge-info' : 'badge-medium'
          )}>
            {integration.status}
          </span>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        {integration.permissions.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground mb-1">Permissions</p>
            <div className="flex flex-wrap gap-1">
              {integration.permissions.map((perm) => (
                <span key={perm} className="text-xs px-2 py-0.5 rounded bg-background-tertiary">
                  {perm}
                </span>
              ))}
            </div>
          </div>
        )}

        {integration.tenantId && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Tenant</span>
            <span className="text-xs">{integration.tenantId}</span>
          </div>
        )}

        {(integration as any).quotaUsed && (
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted-foreground">Quota Usage</span>
              <span>{(integration as any).quotaUsed.toLocaleString()} / {(integration as any).quotaLimit.toLocaleString()}</span>
            </div>
            <div className="h-2 bg-background-tertiary rounded-full overflow-hidden">
              <div
                className="h-full bg-accent-primary rounded-full"
                style={{ width: `${((integration as any).quotaUsed / (integration as any).quotaLimit) * 100}%` }}
              />
            </div>
          </div>
        )}

        {(integration as any).cveCount && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Records</span>
            <span className="text-xs font-medium">{(integration as any).cveCount.toLocaleString()} CVEs</span>
          </div>
        )}

        {integration.error && (
          <div className="p-2 rounded bg-severity-medium/10 border border-severity-medium/20">
            <p className="text-xs text-severity-medium">{integration.error}</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 pt-3 border-t border-border">
        <button className="btn btn-outline btn-sm flex-1">
          <Settings className="w-3 h-3" />
          Configure
        </button>
        <button className="btn btn-outline btn-sm">
          <RefreshCw className="w-3 h-3" />
        </button>
        <button className="btn btn-outline btn-sm">
          <Key className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

function UserTable() {
  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>User</th>
            <th>Role</th>
            <th>Department</th>
            <th>Status</th>
            <th>Last Login</th>
            <th className="w-12"></th>
          </tr>
        </thead>
        <tbody>
          {mockUsers.map((user) => (
            <tr key={user.id}>
              <td>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center">
                    <span className="text-white text-xs font-medium">
                      {user.displayName.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{user.displayName}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              </td>
              <td>
                <span className="badge bg-background-tertiary">{user.role}</span>
              </td>
              <td className="text-muted-foreground">{user.department}</td>
              <td>
                <span className={`badge ${user.status === 'active' ? 'badge-info' : 'badge-low'}`}>
                  {user.status}
                </span>
              </td>
              <td className="text-muted-foreground text-sm">{formatDate(user.lastLogin)}</td>
              <td>
                <button className="p-1.5 rounded hover:bg-background-tertiary">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AuditLogTable() {
  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Action</th>
            <th>User</th>
            <th>Timestamp</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {mockAuditLogs.map((log) => (
            <tr key={log.id}>
              <td className="font-medium">{log.action}</td>
              <td className="text-muted-foreground">{log.user}</td>
              <td className="text-muted-foreground text-sm">{formatDate(log.timestamp)}</td>
              <td>
                {log.status === 'success' ? (
                  <CheckCircle className="w-4 h-4 text-accent-success" />
                ) : (
                  <XCircle className="w-4 h-4 text-accent-danger" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'integrations' | 'audit'>('integrations');

  return (
    <div className="space-y-6 animate-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Administration</h1>
          <p className="text-muted-foreground">Manage users, integrations, and security settings</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-border">
        <button
          onClick={() => setActiveTab('users')}
          className={cn(
            'pb-3 px-1 text-sm font-medium border-b-2 transition-colors',
            activeTab === 'users'
              ? 'border-accent-primary text-accent-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          <Users className="w-4 h-4 inline mr-2" />
          Users
        </button>
        <button
          onClick={() => setActiveTab('integrations')}
          className={cn(
            'pb-3 px-1 text-sm font-medium border-b-2 transition-colors',
            activeTab === 'integrations'
              ? 'border-accent-primary text-accent-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          <Plug className="w-4 h-4 inline mr-2" />
          Integrations
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={cn(
            'pb-3 px-1 text-sm font-medium border-b-2 transition-colors',
            activeTab === 'audit'
              ? 'border-accent-primary text-accent-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
        >
          <FileText className="w-4 h-4 inline mr-2" />
          Audit Log
        </button>
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="text" placeholder="Search users..." className="input pl-10" />
            </div>
            <button className="btn btn-primary">
              <Plus className="w-4 h-4" />
              Add User
            </button>
          </div>
          <UserTable />
        </div>
      )}

      {/* Integrations Tab */}
      {activeTab === 'integrations' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="btn btn-outline">
                <RefreshCw className="w-4 h-4" />
                Sync All
              </button>
              <button className="btn btn-outline">
                <CheckCircle className="w-4 h-4" />
                Validate All
              </button>
            </div>
            <button className="btn btn-primary">
              <Plus className="w-4 h-4" />
              Add Integration
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockIntegrations.map((integration) => (
              <IntegrationCard key={integration.id} integration={integration} />
            ))}
          </div>
        </div>
      )}

      {/* Audit Log Tab */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <select className="input w-auto">
                <option value="">All Actions</option>
                <option value="login">Login</option>
                <option value="deployment">Deployment</option>
                <option value="change">Change</option>
                <option value="integration">Integration</option>
              </select>
              <select className="input w-auto">
                <option value="">All Status</option>
                <option value="success">Success</option>
                <option value="failure">Failure</option>
              </select>
            </div>
            <button className="btn btn-outline">
              <FileText className="w-4 h-4" />
              Export
            </button>
          </div>
          <AuditLogTable />
        </div>
      )}
    </div>
  );
}