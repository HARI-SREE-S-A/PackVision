'use client';

import { useState } from 'react';
import { cn, formatDate } from '@/lib/utils';
import {
  MessageSquare,
  Search,
  Filter,
  Plus,
  Send,
  Users,
  Bell,
  Mail,
  Calendar,
  Clock,
  ChevronRight,
  Bot,
  Edit,
  Copy,
  Trash2,
  Play,
  Pause,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

const mockPlans = [
  {
    id: '1',
    name: 'M365 Apps Deployment Notification',
    description: 'User-facing communication for Microsoft 365 rollout',
    type: 'Deployment Notification' as const,
    status: 'scheduled' as const,
    scheduledAt: '2024-04-20T09:00:00',
    targetCount: 4500,
    deliveredCount: 0,
    openedCount: 0,
    audience: ['Business Users', 'All Regions'],
    relatedEntity: 'Microsoft 365 Apps v16.0',
    aiDrafted: true,
    stages: [
      { name: 'Pre-Deployment Notice', timing: 'PreDeployment' as const, status: 'ready' as const },
      { name: 'Deployment Day Alert', timing: 'DuringDeployment' as const, status: 'pending' as const },
      { name: 'Completion Summary', timing: 'PostDeployment' as const, status: 'pending' as const },
    ],
  },
  {
    id: '2',
    name: 'CVE-2024-3094 Advisory',
    description: 'Critical vulnerability notification to affected teams',
    type: 'Emergency Alert' as const,
    status: 'sending' as const,
    scheduledAt: '2024-04-17T14:00:00',
    targetCount: 45,
    deliveredCount: 32,
    openedCount: 18,
    audience: ['IT Security', 'Finance App Owners'],
    relatedEntity: 'CVE-2024-3094',
    aiDrafted: true,
    stages: [
      { name: 'Initial Alert', timing: 'OnIncident' as const, status: 'sent' as const },
      { name: 'Update Notice', timing: 'OnDelay' as const, status: 'pending' as const },
    ],
  },
  {
    id: '3',
    name: 'Zoom Deployment Completion',
    description: 'Post-deployment survey to all Zoom users',
    type: 'Post-Deployment Survey' as const,
    status: 'sent' as const,
    scheduledAt: '2024-04-15T10:00:00',
    targetCount: 890,
    deliveredCount: 890,
    openedCount: 423,
    audience: ['Zoom Users'],
    relatedEntity: 'Zoom Workplace v6.0',
    aiDrafted: false,
    stages: [
      { name: 'Completion Notice', timing: 'OnCompletion' as const, status: 'sent' as const },
      { name: 'Survey Request', timing: 'PostDeployment' as const, status: 'sent' as const },
    ],
  },
];

const mockAudienceGroups = [
  { name: 'All Users', count: 12500 },
  { name: 'Business Users', count: 8500 },
  { name: 'IT Teams', count: 450 },
  { name: 'Finance Department', count: 1200 },
  { name: 'Executive Team', count: 45 },
  { name: 'Remote Workers', count: 3200 },
];

function CommunicationCard({ plan, onClick }: { plan: typeof mockPlans[0]; onClick: () => void }) {
  const deliveryRate = plan.targetCount > 0 ? (plan.deliveredCount / plan.targetCount) * 100 : 0;
  const openRate = plan.targetCount > 0 ? (plan.openedCount / plan.targetCount) * 100 : 0;

  return (
    <div onClick={onClick} className="card p-4 card-hover cursor-pointer">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${
            plan.type === 'Emergency Alert' ? 'bg-accent-danger/10' :
            plan.type === 'Deployment Notification' ? 'bg-accent-primary/10' :
            'bg-accent-secondary/10'
          }`}>
            <Bell className={`w-5 h-5 ${
              plan.type === 'Emergency Alert' ? 'text-accent-danger' :
              plan.type === 'Deployment Notification' ? 'text-accent-primary' :
              'text-accent-secondary'
            }`} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              {plan.aiDrafted && (
                <span className="badge badge-info text-xs">
                  <Bot className="w-3 h-3 mr-1" />
                  AI Drafted
                </span>
              )}
              <span className="badge bg-background-tertiary text-xs">{plan.type}</span>
            </div>
            <h3 className="font-medium">{plan.name}</h3>
          </div>
        </div>
        <span className={`badge ${
          plan.status === 'sent' ? 'badge-info' :
          plan.status === 'scheduled' ? 'badge-medium' :
          plan.status === 'sending' ? 'badge-high' :
          'badge-low'
        }`}>
          {plan.status}
        </span>
      </div>

      <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>

      {/* Audience */}
      <div className="flex flex-wrap gap-1 mb-4">
        {plan.audience.map((a, i) => (
          <span key={i} className="text-xs px-2 py-0.5 rounded bg-background-tertiary">
            {a}
          </span>
        ))}
      </div>

      {/* Stats */}
      {plan.deliveredCount > 0 && (
        <div className="space-y-2 mb-4">
          <div>
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>Delivered</span>
              <span>{plan.deliveredCount} / {plan.targetCount}</span>
            </div>
            <div className="h-1.5 bg-background-tertiary rounded-full overflow-hidden">
              <div className="h-full bg-accent-success rounded-full" style={{ width: `${deliveryRate}%` }} />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>Opened</span>
              <span>{plan.openedCount} / {plan.targetCount}</span>
            </div>
            <div className="h-1.5 bg-background-tertiary rounded-full overflow-hidden">
              <div className="h-full bg-accent-primary rounded-full" style={{ width: `${openRate}%` }} />
            </div>
          </div>
        </div>
      )}

      {/* Schedule */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="w-3 h-3" />
          <span>
            {plan.status === 'sent'
              ? `Sent ${formatDate(plan.scheduledAt)}`
              : `Scheduled ${formatDate(plan.scheduledAt)}`
            }
          </span>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </div>
    </div>
  );
}

function AudienceSelector() {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleAudience = (name: string) => {
    setSelected(prev =>
      prev.includes(name) ? prev.filter(a => a !== name) : [...prev, name]
    );
  };

  return (
    <div className="card p-4">
      <h3 className="font-semibold mb-4">Target Audience</h3>
      <div className="space-y-2">
        {mockAudienceGroups.map((group) => (
          <label
            key={group.name}
            className={cn(
              'flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors',
              selected.includes(group.name)
                ? 'border-accent-primary bg-accent-primary/5'
                : 'border-border hover:border-accent-primary/50'
            )}
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={selected.includes(group.name)}
                onChange={() => toggleAudience(group.name)}
                className="rounded border-border"
              />
              <span className="text-sm">{group.name}</span>
            </div>
            <span className="text-xs text-muted-foreground">{group.count.toLocaleString()}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function MessageTemplateEditor() {
  const [selectedTemplate, setSelectedTemplate] = useState('business-user');

  const templates = [
    { id: 'business-user', name: 'Business User', tone: 'Simple, actionable' },
    { id: 'executive', name: 'Executive', tone: 'High-level summary' },
    { id: 'technical', name: 'Technical', tone: 'Detailed with metrics' },
    { id: 'service-desk', name: 'Service Desk', tone: 'With action items' },
  ];

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Message Template</h3>
        <button className="btn btn-ghost text-xs">
          <Bot className="w-3 h-3" />
          Regenerate with AI
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => setSelectedTemplate(template.id)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm transition-colors',
              selectedTemplate === template.id
                ? 'bg-accent-primary text-white'
                : 'bg-background-tertiary hover:bg-background-elevated'
            )}
          >
            {template.name}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Subject</label>
          <input
            type="text"
            defaultValue="Action Required: [Application Name] Update Scheduled"
            className="input mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Message Body</label>
          <textarea
            rows={8}
            defaultValue={`Dear Team,

An update to [Application Name] is scheduled for [Date] at [Time].

What this means for you:
• [Benefit/Feature 1]
• [Benefit/Feature 2]
• Minimal disruption to your work

What you need to do:
1. Save any open work before [Time] on [Date]
2. Your device may restart automatically
3. If you experience issues, contact the Service Desk

Thank you for your cooperation.

[IT Operations Team]`}
            className="input mt-1"
          />
        </div>
      </div>
    </div>
  );
}

export default function CommunicationsPage() {
  const [selectedPlan, setSelectedPlan] = useState<typeof mockPlans[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPlans = mockPlans.filter(plan =>
    plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plan.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Communications Orchestrator</h1>
          <p className="text-muted-foreground">AI-powered stakeholder communication with scheduling and tracking</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-outline">
            <MessageSquare className="w-4 h-4" />
            Templates
          </button>
          <button className="btn btn-primary">
            <Plus className="w-4 h-4" />
            New Communication
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <p className="text-sm text-muted-foreground">Scheduled</p>
          <p className="text-3xl font-bold">6</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-muted-foreground">Sent Today</p>
          <p className="text-3xl font-bold text-accent-success">12</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-muted-foreground">Avg Open Rate</p>
          <p className="text-3xl font-bold">47%</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-muted-foreground">AI Drafted</p>
          <p className="text-3xl font-bold">23</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Communication List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search */}
          <div className="card p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search communications..."
                className="input pl-10"
              />
            </div>
          </div>

          {/* Plan Cards */}
          <div className="space-y-4">
            {filteredPlans.map((plan) => (
              <CommunicationCard
                key={plan.id}
                plan={plan}
                onClick={() => setSelectedPlan(plan)}
              />
            ))}
          </div>
        </div>

        {/* Editor Sidebar */}
        <div className="space-y-4">
          <AudienceSelector />
          <MessageTemplateEditor />

          {/* Quick Actions */}
          <div className="card p-4">
            <h3 className="font-semibold mb-4">Quick Create</h3>
            <div className="space-y-2">
              <button className="btn btn-outline w-full justify-start">
                <Bell className="w-4 h-4" />
                Deployment Notice
              </button>
              <button className="btn btn-outline w-full justify-start">
                <AlertTriangle className="w-4 h-4" />
                Issue Advisory
              </button>
              <button className="btn btn-outline w-full justify-start">
                <CheckCircle className="w-4 h-4" />
                Completion Report
              </button>
              <button className="btn btn-outline w-full justify-start">
                <Users className="w-4 h-4" />
                Service Desk Briefing
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Detail/Edit Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-background-secondary border border-border rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-bold">{selectedPlan.name}</h2>
              <button className="p-2 rounded-lg hover:bg-background-tertiary">×</button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium">{selectedPlan.type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium">{selectedPlan.status}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Related Entity</p>
                  <p className="font-medium">{selectedPlan.relatedEntity}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Target Count</p>
                  <p className="font-medium">{selectedPlan.targetCount.toLocaleString()}</p>
                </div>
              </div>

              <AudienceSelector />
              <MessageTemplateEditor />

              <div className="flex gap-3">
                <button className="btn btn-primary flex-1">
                  <Send className="w-4 h-4" />
                  Send Now
                </button>
                <button className="btn btn-outline flex-1">
                  <Calendar className="w-4 h-4" />
                  Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
