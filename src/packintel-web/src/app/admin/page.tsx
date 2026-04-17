'use client';

import { useState } from 'react';
import { cn, formatDate } from '@/lib/utils';
import { useSettingsStore } from '@/store';
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
  const {
    azureTenantId,
    azureClientId,
    azureClientSecret,
    intuneEndpoint,
    geminiApiKey,
    serviceNowInstanceUrl,
    serviceNowApiKey,
    mcpAccessToken,
    isMockMode,
    updateSetting,
  } = useSettingsStore();
  const [showSecrets, setShowSecrets] = useState({ azure: false, gemini: false, snow: false, mcp: false });

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
        <div className="space-y-6 animate-slide-up">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <div>
              <h2 className="text-lg font-semibold gradient-text">Integration Settings</h2>
              <p className="text-sm text-muted-foreground mt-1">Configure your real-time API integrations</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Mock Mode</span>
              <button
                onClick={() => updateSetting('isMockMode', !isMockMode)}
                className={cn(
                  'w-11 h-6 rounded-full transition-colors relative flex items-center px-1',
                  isMockMode ? 'bg-accent-primary' : 'bg-background-tertiary'
                )}
              >
                <div
                  className={cn(
                    'w-4 h-4 rounded-full bg-white transition-transform',
                    isMockMode ? 'translate-x-5' : 'translate-x-0'
                  )}
                />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Azure AD Card */}
            <div className="card glass hover:border-accent-primary/50 transition-colors relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-primary/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform" />
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-accent-primary/10">
                  <Plug className="w-5 h-5 text-accent-primary" />
                </div>
                <h3 className="font-semibold text-lg">Azure AD / Entra ID</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Tenant ID</label>
                  <input
                    type="text"
                    value={azureTenantId}
                    onChange={(e) => updateSetting('azureTenantId', e.target.value)}
                    placeholder="e.g. contoso.onmicrosoft.com"
                    className="input mt-1 bg-background"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Client ID</label>
                  <input
                    type="text"
                    value={azureClientId}
                    onChange={(e) => updateSetting('azureClientId', e.target.value)}
                    placeholder="Application ID"
                    className="input mt-1 bg-background"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Client Secret</label>
                  <div className="relative mt-1">
                    <input
                      type={showSecrets.azure ? 'text' : 'password'}
                      value={azureClientSecret}
                      onChange={(e) => updateSetting('azureClientSecret', e.target.value)}
                      placeholder="Enter secret..."
                      className="input bg-background pr-10"
                    />
                    <button
                      onClick={() => setShowSecrets(s => ({ ...s, azure: !s.azure }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showSecrets.azure ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Microsoft Intune Card */}
            <div className="card glass hover:border-accent-secondary/50 transition-colors relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-secondary/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform" />
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-accent-secondary/10">
                  <Shield className="w-5 h-5 text-accent-secondary" />
                </div>
                <h3 className="font-semibold text-lg">Microsoft Intune</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Graph API Endpoint</label>
                  <input
                    type="text"
                    value={intuneEndpoint}
                    onChange={(e) => updateSetting('intuneEndpoint', e.target.value)}
                    placeholder="https://graph.microsoft.com/beta/..."
                    className="input mt-1 bg-background"
                  />
                </div>
              </div>
            </div>

            {/* Google Gemini API Card */}
            <div className="card glass hover:border-accent-tertiary/50 transition-colors relative overflow-hidden group lg:col-span-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-tertiary/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform" />
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-accent-tertiary/10">
                  <Key className="w-5 h-5 text-accent-tertiary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Generative AI (Google Gemini)</h3>
                  <p className="text-xs text-muted-foreground">Powers automated chatbot answering and Intune remediation script generation</p>
                </div>
              </div>
              <div className="space-y-4 max-w-xl">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">API Key</label>
                  <div className="relative mt-1">
                    <input
                      type={showSecrets.gemini ? 'text' : 'password'}
                      value={geminiApiKey}
                      onChange={(e) => updateSetting('geminiApiKey', e.target.value)}
                      placeholder="AIzaSy..."
                      className="input bg-background pr-10"
                    />
                    <button
                      onClick={() => setShowSecrets(s => ({ ...s, gemini: !s.gemini }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showSecrets.gemini ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ServiceNow Card */}
            <div className="card glass hover:border-accent-success/50 transition-colors relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-success/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform" />
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-accent-success/10">
                  <FileText className="w-5 h-5 text-accent-success" />
                </div>
                <h3 className="font-semibold text-lg">ServiceNow ITSM</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Instance URL</label>
                  <input
                    type="text"
                    value={serviceNowInstanceUrl}
                    onChange={(e) => updateSetting('serviceNowInstanceUrl', e.target.value)}
                    placeholder="https://dev12345.service-now.com"
                    className="input mt-1 bg-background"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">API Token</label>
                  <div className="relative mt-1">
                    <input
                      type={showSecrets.snow ? 'text' : 'password'}
                      value={serviceNowApiKey}
                      onChange={(e) => updateSetting('serviceNowApiKey', e.target.value)}
                      placeholder="Enter token..."
                      className="input bg-background pr-10"
                    />
                    <button
                      onClick={() => setShowSecrets(s => ({ ...s, snow: !s.snow }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showSecrets.snow ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* MCP Context Servers */}
            <div className="card glass hover:border-severity-medium/50 transition-colors relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-severity-medium/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform" />
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-severity-medium/10">
                  <Server className="w-5 h-5 text-severity-medium" />
                </div>
                <h3 className="font-semibold text-lg">MCP API Server</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Access Token</label>
                  <div className="relative mt-1">
                    <input
                      type={showSecrets.mcp ? 'text' : 'password'}
                      value={mcpAccessToken}
                      onChange={(e) => updateSetting('mcpAccessToken', e.target.value)}
                      placeholder="MCP access token..."
                      className="input bg-background pr-10"
                    />
                    <button
                      onClick={() => setShowSecrets(s => ({ ...s, mcp: !s.mcp }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showSecrets.mcp ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">URL: <code>https://packintel/api/mcp</code></p>
              </div>
            </div>
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