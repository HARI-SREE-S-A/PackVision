'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  Handle,
  Position,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { cn } from '@/lib/utils';
import {
  Plus,
  Save,
  Play,
  Pause,
  Settings,
  GitBranch,
  Zap,
  Bell,
  Shield,
  CheckCircle,
  Clock,
  Users,
  FileText,
  AlertTriangle,
  Search,
  Filter,
  ChevronRight,
  MoreVertical,
  Copy,
  Trash2,
  Download,
  Upload,
} from 'lucide-react';

// Node Components
function TriggerNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-3 rounded-lg bg-accent-primary/10 border-2 border-accent-primary/30 min-w-[180px]">
      <Handle type="target" position={Position.Top} className="w-3 h-3 border-2 border-accent-primary bg-background" />
      <div className="flex items-center gap-2 mb-2">
        <Zap className="w-4 h-4 text-accent-primary" />
        <span className="text-xs font-semibold text-accent-primary uppercase">Trigger</span>
      </div>
      <p className="font-medium text-sm">{data.label}</p>
      <p className="text-xs text-muted-foreground mt-1">{data.description}</p>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 border-2 border-accent-primary bg-background" />
    </div>
  );
}

function ActionNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-3 rounded-lg bg-accent-secondary/10 border-2 border-accent-secondary/30 min-w-[180px]">
      <Handle type="target" position={Position.Top} className="w-3 h-3 border-2 border-accent-secondary bg-background" />
      <div className="flex items-center gap-2 mb-2">
        <Play className="w-4 h-4 text-accent-secondary" />
        <span className="text-xs font-semibold text-accent-secondary uppercase">Action</span>
      </div>
      <p className="font-medium text-sm">{data.label}</p>
      <p className="text-xs text-muted-foreground mt-1">{data.description}</p>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 border-2 border-accent-secondary bg-background" />
    </div>
  );
}

function ConditionNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-3 rounded-lg bg-accent-tertiary/10 border-2 border-accent-tertiary/30 min-w-[180px]">
      <Handle type="target" position={Position.Top} className="w-3 h-3 border-2 border-accent-tertiary bg-background" />
      <div className="flex items-center gap-2 mb-2">
        <GitBranch className="w-4 h-4 text-accent-tertiary" />
        <span className="text-xs font-semibold text-accent-tertiary uppercase">Condition</span>
      </div>
      <p className="font-medium text-sm">{data.label}</p>
      <p className="text-xs text-muted-foreground mt-1">{data.description}</p>
      <div className="flex gap-2 mt-2">
        <span className="text-xs px-2 py-0.5 rounded bg-accent-success/20 text-accent-success">Yes</span>
        <span className="text-xs px-2 py-0.5 rounded bg-accent-danger/20 text-accent-danger">No</span>
      </div>
      <Handle type="source" position={Position.Bottom} style={{ left: '30%' }} className="w-3 h-3 border-2 border-accent-tertiary bg-background" />
      <Handle type="source" position={Position.Bottom} style={{ left: '70%' }} className="w-3 h-3 border-2 border-accent-tertiary bg-background" />
    </div>
  );
}

function AiNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-3 rounded-lg bg-severity-medium/10 border-2 border-severity-medium/30 min-w-[180px]">
      <Handle type="target" position={Position.Top} className="w-3 h-3 border-2 border-severity-medium bg-background" />
      <div className="flex items-center gap-2 mb-2">
        <Zap className="w-4 h-4 text-severity-medium" />
        <span className="text-xs font-semibold text-severity-medium uppercase">AI Evaluation</span>
      </div>
      <p className="font-medium text-sm">{data.label}</p>
      <p className="text-xs text-muted-foreground mt-1">{data.description}</p>
      <div className="mt-2 flex items-center gap-1">
        <div className="w-16 h-1.5 bg-background-tertiary rounded-full overflow-hidden">
          <div className="h-full bg-severity-medium rounded-full" style={{ width: `${data.confidence || 85}%` }} />
        </div>
        <span className="text-xs text-muted-foreground">{data.confidence || 85}%</span>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 border-2 border-severity-medium bg-background" />
    </div>
  );
}

function ApprovalNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-3 rounded-lg bg-accent-warning/10 border-2 border-accent-warning/30 min-w-[180px]">
      <Handle type="target" position={Position.Top} className="w-3 h-3 border-2 border-accent-warning bg-background" />
      <div className="flex items-center gap-2 mb-2">
        <Users className="w-4 h-4 text-accent-warning" />
        <span className="text-xs font-semibold text-accent-warning uppercase">Approval</span>
      </div>
      <p className="font-medium text-sm">{data.label}</p>
      <p className="text-xs text-muted-foreground mt-1">{data.approver || 'Awaiting approval'}</p>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 border-2 border-accent-warning bg-background" />
    </div>
  );
}

function NotificationNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-3 rounded-lg bg-accent-info/10 border-2 border-accent-info/30 min-w-[180px]">
      <Handle type="target" position={Position.Top} className="w-3 h-3 border-2 border-accent-info bg-background" />
      <div className="flex items-center gap-2 mb-2">
        <Bell className="w-4 h-4 text-accent-info" />
        <span className="text-xs font-semibold text-accent-info uppercase">Notification</span>
      </div>
      <p className="font-medium text-sm">{data.label}</p>
      <p className="text-xs text-muted-foreground mt-1">{data.channel || 'Email'}</p>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 border-2 border-accent-info bg-background" />
    </div>
  );
}

function ValidationNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-3 rounded-lg bg-accent-success/10 border-2 border-accent-success/30 min-w-[180px]">
      <Handle type="target" position={Position.Top} className="w-3 h-3 border-2 border-accent-success bg-background" />
      <div className="flex items-center gap-2 mb-2">
        <CheckCircle className="w-4 h-4 text-accent-success" />
        <span className="text-xs font-semibold text-accent-success uppercase">Validation</span>
      </div>
      <p className="font-medium text-sm">{data.label}</p>
      <p className="text-xs text-muted-foreground mt-1">{data.checkType || 'Compliance check'}</p>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 border-2 border-accent-success bg-background" />
    </div>
  );
}

const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  condition: ConditionNode,
  ai: AiNode,
  approval: ApprovalNode,
  notification: NotificationNode,
  validation: ValidationNode,
};

// Mock workflow data
const mockWorkflows = [
  {
    id: '1',
    name: 'Critical CVE Remediation',
    description: 'Automated workflow for critical vulnerability patching',
    category: 'Vulnerability Remediation',
    status: 'active',
    executionCount: 156,
    successRate: 94.2,
    lastRun: '2024-04-16',
  },
  {
    id: '2',
    name: 'Application Deployment Pipeline',
    description: 'Standard deployment with approval gates',
    category: 'Deployment',
    status: 'active',
    executionCount: 423,
    successRate: 97.8,
    lastRun: '2024-04-17',
  },
  {
    id: '3',
    name: 'Emergency Change Process',
    description: 'Fast-track change for critical issues',
    category: 'Change Management',
    status: 'draft',
    executionCount: 0,
    successRate: 0,
    lastRun: null,
  },
];

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'trigger',
    position: { x: 250, y: 0 },
    data: {
      label: 'New Critical CVE',
      description: 'Triggers when CVE severity = Critical AND KEV = True',
    },
  },
  {
    id: '2',
    type: 'ai',
    position: { x: 250, y: 120 },
    data: {
      label: 'Assess Impact',
      description: 'Analyze affected assets and risk score',
      confidence: 92,
    },
  },
  {
    id: '3',
    type: 'condition',
    position: { x: 250, y: 250 },
    data: {
      label: 'Risk Score > 70?',
      description: 'High risk requires emergency change',
    },
  },
  {
    id: '4',
    type: 'action',
    position: { x: 100, y: 380 },
    data: {
      label: 'Create Emergency Change',
      description: 'Generate TechLink change record',
    },
  },
  {
    id: '5',
    type: 'approval',
    position: { x: 400, y: 380 },
    data: {
      label: 'CAB Approval',
      description: 'Emergency approval routing',
      approver: 'Security Team',
    },
  },
  {
    id: '6',
    type: 'action',
    position: { x: 100, y: 500 },
    data: {
      label: 'Notify Application Owners',
      description: 'Send Teams notification',
    },
  },
  {
    id: '7',
    type: 'notification',
    position: { x: 400, y: 500 },
    data: {
      label: 'Update Service Desk',
      description: 'Create incident ticket',
      channel: 'Slack',
    },
  },
  {
    id: '8',
    type: 'validation',
    position: { x: 250, y: 620 },
    data: {
      label: 'Verify Patch Deployed',
      description: 'Check Intune compliance',
      checkType: 'Device Readiness',
    },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#3b82f6' } },
  { id: 'e2-3', source: '2', target: '3', animated: true, style: { stroke: '#3b82f6' } },
  { id: 'e3-4', source: '3', target: '4', label: 'Yes', style: { stroke: '#10b981' } },
  { id: 'e3-5', source: '3', target: '5', label: 'No', style: { stroke: '#ef4444' } },
  { id: 'e4-6', source: '4', target: '6', animated: true, style: { stroke: '#3b82f6' } },
  { id: 'e5-7', source: '5', target: '7', animated: true, style: { stroke: '#3b82f6' } },
  { id: 'e6-8', source: '6', target: '8', animated: true, style: { stroke: '#3b82f6' } },
  { id: 'e7-8', source: '7', target: '8', animated: true, style: { stroke: '#3b82f6' } },
];

function WorkflowList() {
  return (
    <div className="space-y-4">
      {mockWorkflows.map((workflow) => (
        <div key={workflow.id} className="card p-4 card-hover cursor-pointer">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-accent-primary/10">
                <GitBranch className="w-5 h-5 text-accent-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{workflow.name}</h3>
                  <span className={`badge ${workflow.status === 'active' ? 'badge-info' : 'badge-medium'}`}>
                    {workflow.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{workflow.description}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                  <span className="badge bg-background-tertiary">{workflow.category}</span>
                  <span>{workflow.executionCount} runs</span>
                  <span className="text-accent-success">{workflow.successRate}% success</span>
                </div>
              </div>
            </div>
            <button className="p-2 rounded-lg hover:bg-background-tertiary">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function BlockPalette({ onDragStart }: { onDragStart: (event: React.DragEvent, nodeType: string) => void }) {
  const blocks = [
    { type: 'trigger', icon: Zap, label: 'Trigger', color: 'accent-primary', description: 'Start workflow' },
    { type: 'action', icon: Play, label: 'Action', color: 'accent-secondary', description: 'Execute task' },
    { type: 'condition', icon: GitBranch, label: 'Condition', color: 'accent-tertiary', description: 'Branch logic' },
    { type: 'ai', icon: Zap, label: 'AI Evaluation', color: 'severity-medium', description: 'AI decision' },
    { type: 'approval', icon: Users, label: 'Approval', color: 'accent-warning', description: 'Human gate' },
    { type: 'notification', icon: Bell, label: 'Notification', color: 'accent-info', description: 'Send alert' },
    { type: 'validation', icon: CheckCircle, label: 'Validation', color: 'accent-success', description: 'Check compliance' },
  ];

  return (
    <div className="w-64 border-r border-border p-4 bg-background-secondary overflow-y-auto">
      <h3 className="font-semibold mb-4">Block Library</h3>
      <div className="space-y-2">
        {blocks.map((block) => (
          <div
            key={block.type}
            draggable
            onDragStart={(e) => onDragStart(e, block.type)}
            className="p-3 rounded-lg border border-border bg-background-tertiary hover:border-accent-primary/50 cursor-grab active:cursor-grabbing transition-colors"
          >
            <div className="flex items-center gap-2 mb-1">
              <block.icon className={`w-4 h-4 text-${block.color}`} />
              <span className="text-sm font-medium">{block.label}</span>
            </div>
            <p className="text-xs text-muted-foreground">{block.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PropertiesPanel({ selectedNode, onClose }: { selectedNode: Node | null; onClose: () => void }) {
  if (!selectedNode) return null;

  return (
    <div className="w-80 border-l border-border p-4 bg-background-secondary overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Properties</h3>
        <button onClick={onClose} className="p-1 rounded hover:bg-background-tertiary">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Label</label>
          <input
            type="text"
            defaultValue={selectedNode.data.label}
            className="input mt-1"
            placeholder="Enter label..."
          />
        </div>

        <div>
          <label className="text-sm font-medium">Description</label>
          <textarea
            defaultValue={selectedNode.data.description}
            className="input mt-1"
            rows={3}
            placeholder="Enter description..."
          />
        </div>

        {selectedNode.type === 'ai' && (
          <div>
            <label className="text-sm font-medium">Confidence Threshold</label>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="range"
                min="0"
                max="100"
                defaultValue={selectedNode.data.confidence || 85}
                className="flex-1"
              />
              <span className="text-sm font-medium w-12">{selectedNode.data.confidence || 85}%</span>
            </div>
          </div>
        )}

        {selectedNode.type === 'approval' && (
          <div>
            <label className="text-sm font-medium">Approver</label>
            <select className="input mt-1">
              <option>Security Team</option>
              <option>IT Lead</option>
              <option>CAB</option>
              <option>Business Owner</option>
            </select>
          </div>
        )}

        {selectedNode.type === 'notification' && (
          <div>
            <label className="text-sm font-medium">Channel</label>
            <select className="input mt-1">
              <option>Email</option>
              <option>Teams</option>
              <option>Slack</option>
              <option>SMS</option>
            </select>
          </div>
        )}

        <div className="pt-4 border-t border-border">
          <button className="btn btn-danger w-full">
            <Trash2 className="w-4 h-4" />
            Delete Block
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WorkflowsPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showBuilder, setShowBuilder] = useState(false);
  const [activeTab, setActiveTab] = useState<'list' | 'builder'>('list');

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#3b82f6' } }, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const nodeType = event.dataTransfer.getData('application/reactflow');
      if (!nodeType) return;

      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const position = {
        x: event.clientX - reactFlowBounds.left - 90,
        y: event.clientY - reactFlowBounds.top - 30,
      };

      const newNode: Node = {
        id: `${Date.now()}`,
        type,
        position,
        data: { label: `New ${nodeType}`, description: 'Configure...' },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [setNodes]
  );

  return (
    <div className="h-full flex flex-col animate-in">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Workflow Studio</h1>
          <p className="text-muted-foreground">Visual automation for EUC operations</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-outline">
            <Download className="w-4 h-4" />
            Import
          </button>
          <button className="btn btn-primary">
            <Plus className="w-4 h-4" />
            New Workflow
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-border mb-6">
        <button
          onClick={() => setActiveTab('list')}
          className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'list'
              ? 'border-accent-primary text-accent-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Workflows
        </button>
        <button
          onClick={() => setActiveTab('builder')}
          className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'builder'
              ? 'border-accent-primary text-accent-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Builder
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'templates'
              ? 'border-accent-primary text-accent-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Blueprint Library
        </button>
      </div>

      {activeTab === 'list' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="font-semibold mb-4">Active Workflows</h2>
            <WorkflowList />
          </div>
          <div>
            <h2 className="font-semibold mb-4">Recent Executions</h2>
            <div className="card p-4">
              <div className="space-y-3">
                {[
                  { name: 'Critical CVE Remediation', status: 'completed', time: '2 min ago' },
                  { name: 'Application Deployment', status: 'running', time: 'In progress' },
                  { name: 'Emergency Change', status: 'failed', time: '15 min ago' },
                ].map((exec, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-background-tertiary">
                    <div className="flex items-center gap-3">
                      {exec.status === 'completed' && <CheckCircle className="w-4 h-4 text-accent-success" />}
                      {exec.status === 'running' && <Clock className="w-4 h-4 text-accent-medium" />}
                      {exec.status === 'failed' && <AlertTriangle className="w-4 h-4 text-accent-danger" />}
                      <span className="text-sm">{exec.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{exec.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'builder' && (
        <div className="flex-1 flex rounded-lg overflow-hidden border border-border">
          <BlockPalette
            onDragStart={(e, nodeType) => {
              e.dataTransfer.setData('application/reactflow', nodeType);
            }}
          />

          <div className="flex-1 relative">
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
              <button className="btn btn-primary btn-sm">
                <Play className="w-3 h-3" />
                Execute
              </button>
              <button className="btn btn-outline btn-sm">
                <Save className="w-3 h-3" />
                Save
              </button>
            </div>

            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={(_, node) => setSelectedNode(node)}
              onDrop={onDrop}
              onDragOver={onDragOver}
              nodeTypes={nodeTypes}
              fitView
              className="bg-background"
            >
              <Controls className="bg-background-secondary border border-border rounded-lg" />
              <MiniMap
                className="bg-background-secondary border border-border rounded-lg"
                nodeColor={(node) => {
                  switch (node.type) {
                    case 'trigger': return '#3b82f6';
                    case 'action': return '#14b8a6';
                    case 'condition': return '#8b5cf6';
                    default: return '#6b7280';
                  }
                }}
              />
              <Background variant={BackgroundVariant.Dots} gap={20} size={1} className="bg-background" />
            </ReactFlow>
          </div>

          <PropertiesPanel selectedNode={selectedNode} onClose={() => setSelectedNode(null)} />
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'Standard App Release', desc: 'Deploy app with approval gates', category: 'Deployment' },
            { name: 'Emergency Patch', desc: 'Critical CVE remediation flow', category: 'Vulnerability' },
            { name: 'Pilot Ring Rollout', desc: 'Test → Pilot → Fast → Broad', category: 'Deployment' },
            { name: 'Package Retirement', desc: 'Graceful app deprecation', category: 'Lifecycle' },
            { name: 'Unsupported Software', desc: 'Detect and remediate old apps', category: 'Compliance' },
            { name: 'Post-Deployment Report', desc: 'Automated delivery report', category: 'Reporting' },
          ].map((template, i) => (
            <div key={i} className="card p-4 card-hover cursor-pointer">
              <span className="badge bg-background-tertiary text-xs mb-2">{template.category}</span>
              <h3 className="font-medium mt-2">{template.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{template.desc}</p>
              <button className="btn btn-outline btn-sm w-full mt-3">
                <Copy className="w-3 h-3" />
                Use Template
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
