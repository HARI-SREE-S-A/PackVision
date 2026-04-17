'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertTriangle,
  Package,
  Server,
  Wrench,
  ChevronDown,
  ChevronRight,
  Plus,
  X,
  Send,
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  tower: 'packaging' | 'engineering' | 'operations';
  avatar: string;
  status: 'available' | 'busy' | 'away';
  activeTasks: Task[];
  capacity: number; // max tasks
}

interface Task {
  id: string;
  title: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'in_progress' | 'pending' | 'completed';
  dueDate: string;
  app?: string;
}

const towerConfig = {
  packaging: { label: 'App Packaging', icon: Package, color: 'accent-primary' },
  engineering: { label: 'Engineering', icon: Server, color: 'accent-secondary' },
  operations: { label: 'Operations', icon: Wrench, color: 'accent-warning' },
};

const mockTeam: TeamMember[] = [
  {
    id: 'm1', name: 'Arun Kumar', email: 'arun.kumar@company.com', role: 'Senior Packager',
    tower: 'packaging', avatar: 'AK', status: 'busy', capacity: 5,
    activeTasks: [
      { id: 't1', title: 'Package Adobe Acrobat 2024', priority: 'high', status: 'in_progress', dueDate: '2024-05-02', app: 'Adobe Acrobat' },
      { id: 't2', title: 'Repackage Zoom v6.0.21', priority: 'medium', status: 'in_progress', dueDate: '2024-05-04', app: 'Zoom Workplace' },
      { id: 't3', title: 'UAT validation for MS Project', priority: 'low', status: 'pending', dueDate: '2024-05-07', app: 'MS Project' },
    ],
  },
  {
    id: 'm2', name: 'Sophie Williams', email: 'sophie.williams@company.com', role: 'Packaging Engineer',
    tower: 'packaging', avatar: 'SW', status: 'available', capacity: 5,
    activeTasks: [
      { id: 't4', title: 'Firefox ESR conversion', priority: 'medium', status: 'in_progress', dueDate: '2024-05-03', app: 'Firefox ESR' },
    ],
  },
  {
    id: 'm3', name: 'Rahul Nair', email: 'rahul.nair@company.com', role: 'Intune Engineer',
    tower: 'engineering', avatar: 'RN', status: 'busy', capacity: 4,
    activeTasks: [
      { id: 't5', title: 'Configure Win11 Autopilot profile', priority: 'critical', status: 'in_progress', dueDate: '2024-05-01' },
      { id: 't6', title: 'Fix compliance policy - Finance OU', priority: 'high', status: 'in_progress', dueDate: '2024-05-02' },
      { id: 't7', title: 'Entra ID conditional access review', priority: 'medium', status: 'pending', dueDate: '2024-05-06' },
    ],
  },
  {
    id: 'm4', name: 'Emily Chen', email: 'emily.chen@company.com', role: 'Platform Engineer',
    tower: 'engineering', avatar: 'EC', status: 'available', capacity: 4,
    activeTasks: [
      { id: 't8', title: 'Graph API migration to v2', priority: 'high', status: 'in_progress', dueDate: '2024-05-05' },
    ],
  },
  {
    id: 'm5', name: 'David Osei', email: 'david.osei@company.com', role: 'L2 Support Lead',
    tower: 'operations', avatar: 'DO', status: 'busy', capacity: 6,
    activeTasks: [
      { id: 't9', title: 'Resolve BSOD cluster - Dell fleet', priority: 'critical', status: 'in_progress', dueDate: '2024-05-01' },
      { id: 't10', title: 'License harvest execution - AutoCAD', priority: 'medium', status: 'in_progress', dueDate: '2024-05-03', app: 'AutoCAD' },
      { id: 't11', title: 'Onboard 15 new hires - Finance', priority: 'high', status: 'pending', dueDate: '2024-05-02' },
      { id: 't12', title: 'Patch management - May cycle', priority: 'medium', status: 'pending', dueDate: '2024-05-08' },
    ],
  },
  {
    id: 'm6', name: 'Priya Menon', email: 'priya.menon@company.com', role: 'Operations Analyst',
    tower: 'operations', avatar: 'PM', status: 'away', capacity: 5,
    activeTasks: [
      { id: 't13', title: 'Monthly SLA report generation', priority: 'low', status: 'pending', dueDate: '2024-05-10' },
    ],
  },
];

const priorityColors: Record<string, string> = {
  critical: 'bg-severity-critical/10 text-severity-critical border-severity-critical/20',
  high: 'bg-severity-high/10 text-severity-high border-severity-high/20',
  medium: 'bg-accent-warning/10 text-accent-warning border-accent-warning/20',
  low: 'bg-background-tertiary text-muted-foreground border-border',
};

const statusIcons: Record<string, React.ReactNode> = {
  in_progress: <Clock className="w-3 h-3 text-accent-primary" />,
  pending: <AlertTriangle className="w-3 h-3 text-accent-warning" />,
  completed: <CheckCircle className="w-3 h-3 text-accent-success" />,
};

export default function TeamsPage() {
  const [team, setTeam] = useState(mockTeam);
  const [towerFilter, setTowerFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedMember, setExpandedMember] = useState<string | null>(null);
  const [showAssignModal, setShowAssignModal] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'critical' | 'high' | 'medium' | 'low'>('medium');

  const filtered = team.filter(m => {
    const matchTower = towerFilter === 'all' || m.tower === towerFilter;
    const matchSearch = !searchQuery || m.name.toLowerCase().includes(searchQuery.toLowerCase())
      || m.email.toLowerCase().includes(searchQuery.toLowerCase())
      || m.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTower && matchSearch;
  });

  const towerGroups = {
    packaging: filtered.filter(m => m.tower === 'packaging'),
    engineering: filtered.filter(m => m.tower === 'engineering'),
    operations: filtered.filter(m => m.tower === 'operations'),
  };

  const totalTasks = team.reduce((sum, m) => sum + m.activeTasks.filter(t => t.status !== 'completed').length, 0);
  const criticalTasks = team.reduce((sum, m) => sum + m.activeTasks.filter(t => t.priority === 'critical' && t.status !== 'completed').length, 0);

  const assignTask = (memberId: string) => {
    if (!newTaskTitle.trim()) return;
    setTeam(prev => prev.map(m => {
      if (m.id !== memberId) return m;
      const newTask: Task = {
        id: 'tnew-' + Date.now(),
        title: newTaskTitle,
        priority: newTaskPriority,
        status: 'pending',
        dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      };
      return { ...m, activeTasks: [...m.activeTasks, newTask], status: 'busy' as const };
    }));
    setNewTaskTitle('');
    setShowAssignModal(null);
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">EUC Team Workload</h1>
          <p className="text-muted-foreground">Track tower assignments and balance capacity across teams</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <p className="text-sm text-muted-foreground">Team Members</p>
          <h3 className="text-3xl font-bold mt-1">{team.length}</h3>
        </div>
        <div className="card p-4">
          <p className="text-sm text-muted-foreground">Active Tasks</p>
          <h3 className="text-3xl font-bold mt-1 text-accent-primary">{totalTasks}</h3>
        </div>
        <div className="card p-4">
          <p className="text-sm text-muted-foreground">Critical Tasks</p>
          <h3 className="text-3xl font-bold mt-1 text-severity-critical">{criticalTasks}</h3>
        </div>
        <div className="card p-4">
          <p className="text-sm text-muted-foreground">Avg Utilization</p>
          <h3 className="text-3xl font-bold mt-1 text-accent-warning">
            {Math.round(team.reduce((s, m) => s + (m.activeTasks.filter(t => t.status !== 'completed').length / m.capacity) * 100, 0) / team.length)}%
          </h3>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 max-w-xs">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search team members..." className="input pl-9 text-sm h-9 w-full" />
        </div>
        <div className="flex gap-1">
          {['all', 'packaging', 'engineering', 'operations'].map(t => (
            <button key={t} onClick={() => setTowerFilter(t)} className={cn('btn btn-sm text-xs h-9', towerFilter === t ? 'btn-primary' : 'btn-outline')}>
              {t === 'all' ? 'All Towers' : towerConfig[t as keyof typeof towerConfig].label}
            </button>
          ))}
        </div>
      </div>

      {/* Tower Groups */}
      {(Object.entries(towerGroups) as [keyof typeof towerConfig, TeamMember[]][])
        .filter(([_, members]) => members.length > 0)
        .map(([tower, members]) => {
          const config = towerConfig[tower];
          const TowerIcon = config.icon;
          return (
            <div key={tower}>
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 border-b border-border pb-2">
                <TowerIcon className={cn('w-5 h-5', 'text-' + config.color)} />
                {config.label} Tower
                <span className="text-sm font-normal text-muted-foreground ml-2">({members.length} members)</span>
              </h2>

              <div className="grid gap-3">
                {members.map(member => {
                  const activeTasks = member.activeTasks.filter(t => t.status !== 'completed');
                  const utilization = Math.round((activeTasks.length / member.capacity) * 100);
                  const isExpanded = expandedMember === member.id;

                  return (
                    <div key={member.id} className="card overflow-hidden">
                      {/* Member Row */}
                      <div
                        className="p-4 flex items-center gap-4 cursor-pointer hover:bg-background-tertiary/30 transition-colors"
                        onClick={() => setExpandedMember(isExpanded ? null : member.id)}
                      >
                        {/* Avatar */}
                        <div className={cn(
                          'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0',
                          member.status === 'available' ? 'bg-accent-success/10 text-accent-success' :
                          member.status === 'busy' ? 'bg-accent-warning/10 text-accent-warning' :
                          'bg-background-tertiary text-muted-foreground'
                        )}>
                          {member.avatar}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-sm">{member.name}</h4>
                            <span className={cn(
                              'w-2 h-2 rounded-full shrink-0',
                              member.status === 'available' ? 'bg-accent-success' :
                              member.status === 'busy' ? 'bg-accent-warning' : 'bg-muted-foreground'
                            )} />
                            <span className="text-[10px] text-muted-foreground capitalize">{member.status}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{member.role}</p>
                        </div>

                        {/* Capacity Bar */}
                        <div className="hidden md:flex items-center gap-3 min-w-[200px]">
                          <div className="flex-1">
                            <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                              <span>{activeTasks.length}/{member.capacity} tasks</span>
                              <span>{utilization}%</span>
                            </div>
                            <div className="h-1.5 bg-background-tertiary rounded-full overflow-hidden">
                              <div
                                className={cn('h-full rounded-full', utilization > 80 ? 'bg-severity-high' : utilization > 50 ? 'bg-accent-warning' : 'bg-accent-success')}
                                style={{ width: utilization + '%' }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Assign Button */}
                        <button
                          onClick={(e) => { e.stopPropagation(); setShowAssignModal(member.id); }}
                          className="btn btn-outline btn-sm text-xs h-8 shrink-0"
                        >
                          <Plus className="w-3 h-3 mr-1" /> Assign
                        </button>

                        {isExpanded ? <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />}
                      </div>

                      {/* Expanded Tasks */}
                      {isExpanded && (
                        <div className="px-4 pb-4 border-t border-border bg-background-tertiary/20">
                          <div className="pt-3 space-y-2">
                            {member.activeTasks.length === 0 ? (
                              <p className="text-sm text-muted-foreground py-4 text-center">No active tasks</p>
                            ) : (
                              member.activeTasks.map(task => (
                                <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-background-tertiary/50">
                                  {statusIcons[task.status]}
                                  <span className={cn('text-xs px-2 py-0.5 rounded border', priorityColors[task.priority])}>{task.priority}</span>
                                  <span className="text-sm flex-1">{task.title}</span>
                                  {task.app && <span className="text-[10px] px-2 py-0.5 bg-accent-primary/10 text-accent-primary rounded">{task.app}</span>}
                                  <span className="text-[10px] text-muted-foreground">{task.dueDate}</span>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      )}

                      {/* Assign Modal */}
                      {showAssignModal === member.id && (
                        <div className="px-4 pb-4 border-t border-accent-primary/30 bg-accent-primary/5">
                          <div className="pt-3 space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-semibold">Assign Task to {member.name}</h4>
                              <button onClick={() => setShowAssignModal(null)} className="p-1 hover:bg-background-tertiary rounded">
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            <input
                              type="text"
                              value={newTaskTitle}
                              onChange={e => setNewTaskTitle(e.target.value)}
                              placeholder="Task description..."
                              className="input text-sm w-full"
                              onKeyDown={e => e.key === 'Enter' && assignTask(member.id)}
                            />
                            <div className="flex gap-2">
                              <select value={newTaskPriority} onChange={e => setNewTaskPriority(e.target.value as any)} className="input text-sm w-auto">
                                <option value="critical">Critical</option>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                              </select>
                              <button onClick={() => assignTask(member.id)} disabled={!newTaskTitle.trim()} className="btn btn-primary btn-sm flex-1 disabled:opacity-50">
                                <Send className="w-3 h-3 mr-1" /> Assign Task
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
    </div>
  );
}
