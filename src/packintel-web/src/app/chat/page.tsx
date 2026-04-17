'use client';

import { useState, useRef, useEffect } from 'react';
import { cn, formatRelativeTime } from '@/lib/utils';
import {
  Bot,
  Send,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Zap,
  MessageSquare,
  Settings,
  Minimize2,
  Maximize2,
  X,
  BarChart3,
  Shield,
  Server,
  GitBranch,
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  actions?: ActionButton[];
  chartData?: any;
}

interface ActionButton {
  label: string;
  icon: React.ReactNode;
  action: string;
  primary?: boolean;
}

const quickActions = [
  { label: 'Show critical CVEs', icon: <Shield className="w-4 h-4" /> },
  { label: 'Deployment status', icon: <TrendingUp className="w-4 h-4" /> },
  { label: 'AI service health', icon: <Bot className="w-4 h-4" /> },
  { label: 'Blocked workflows', icon: <GitBranch className="w-4 h-4" /> },
];

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex gap-3', isUser && 'flex-row-reverse')}>
      <div
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
          isUser ? 'bg-accent-primary' : 'bg-accent-secondary'
        )}
      >
        {isUser ? (
          <span className="text-white text-sm font-medium">OP</span>
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>

      <div className={cn('max-w-[70%]', isUser && 'text-right')}>
        <div
          className={cn(
            'rounded-2xl px-4 py-3',
            isUser ? 'bg-accent-primary text-white' : 'bg-background-tertiary'
          )}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>

        {message.chartData && (
          <div className="mt-3 card p-4">
            <p className="text-sm font-medium mb-2">{message.chartData.title}</p>
            <div className="space-y-2">
              {message.chartData.items?.map((item: any, i: number) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {message.actions && (
          <div className="mt-3 flex flex-wrap gap-2">
            {message.actions.map((action, i) => (
              <button
                key={i}
                className={cn(
                  'btn btn-sm',
                  action.primary ? 'btn-primary' : 'btn-outline'
                )}
              >
                {action.icon}
                {action.label}
              </button>
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground mt-1">
          {formatRelativeTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
}

function SuggestedActions() {
  return (
    <div className="p-4 border-t border-border">
      <p className="text-xs text-muted-foreground mb-2">Suggested actions:</p>
      <div className="flex flex-wrap gap-2">
        {quickActions.map((action, i) => (
          <button
            key={i}
            className="btn btn-ghost text-xs"
          >
            {action.icon}
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      timestamp: new Date(),
      content: `Hello! I'm your PackIntel AI Assistant. I can help you with:

• **Vulnerability Management** - "Show critical CVEs affecting our finance apps"
• **Deployment Operations** - "What's the status of the M365 rollout?"
• **Workflow Automation** - "Create a remediation workflow for critical CVEs"
• **Change Requests** - "Generate a change request for this vulnerability"
• **Analytics** - "What's our deployment success rate this month?"

What would you like to do?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let response: Message;

      const lowerInput = input.toLowerCase();

      if (lowerInput.includes('critical cve') || lowerInput.includes('vulnerability')) {
        response = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          timestamp: new Date(),
          content: `I've analyzed the vulnerability landscape for your organization:

**Critical CVEs Requiring Immediate Attention:**

| CVE | Affected Assets | Risk Score | Recommended Action |
|-----|-----------------|------------|-------------------|
| CVE-2024-3094 (XZ Utils) | 4 | 98 | Emergency patch |
| CVE-2024-23897 (Jenkins) | 12 | 95 | Urgent remediation |
| CVE-2024-21762 (FortiOS) | 2 | 92 | VPN gateway update |

**Recommended Next Steps:**
1. Create emergency change requests for affected assets
2. Trigger automated remediation workflows
3. Notify application owners immediately

Would you like me to create these workflows?`,
          actions: [
            { label: 'Create Workflow', icon: <GitBranch className="w-4 h-4" />, action: 'create_workflow', primary: true },
            { label: 'View Details', icon: <ExternalLink className="w-4 h-4" />, action: 'view_details' },
          ],
        };
      } else if (lowerInput.includes('deployment') || lowerInput.includes('rollout')) {
        response = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          timestamp: new Date(),
          content: `**Active Deployments:**

• **Microsoft 365 Apps** - 69% complete (3,100/4,500 devices)
  - Status: On track
  - ETA: 4 hours
  - Failures: 12 (0.27%)

• **Zoom Workplace** - 100% complete
  - Status: Completed successfully
  - User satisfaction: 4.2/5

Would you like me to pause, retry failed devices, or generate a deployment report?`,
          actions: [
            { label: 'Pause Deployment', icon: <Clock className="w-4 h-4" />, action: 'pause' },
            { label: 'Retry Failed', icon: <RefreshCw className="w-4 h-4" />, action: 'retry' },
            { label: 'Generate Report', icon: <BarChart3 className="w-4 h-4" />, action: 'report' },
          ],
        };
      } else if (lowerInput.includes('ai health') || lowerInput.includes('service health')) {
        response = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          timestamp: new Date(),
          content: `**AI Services Health:**

| Service | Status | Last Check | Latency |
|---------|--------|------------|---------|
| Azure OpenAI | Healthy | 2 min ago | 245ms |
| GitHub Copilot | Healthy | 5 min ago | 180ms |
| Microsoft Graph | Healthy | 1 min ago | 89ms |

**Token Usage Today:**
- Total: 142,500 tokens
- Cost: $3.42 USD
- Requests: 1,247

All AI services are operating normally.`,
          actions: [
            { label: 'View Details', icon: <ExternalLink className="w-4 h-4" />, action: 'ai_details' },
          ],
        };
      } else if (lowerInput.includes('workflow') || lowerInput.includes('blocked')) {
        response = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          timestamp: new Date(),
          content: `**Workflow Status:**

• **Running:** 12 workflows
• **Completed Today:** 47
• **Failed:** 2
• **Blocked:** 3

**Blocked Workflows:**

1. **CVE Remediation - Finance App** - Awaiting CAB approval
2. **M365 Deployment** - User interaction required
3. **Emergency Patch** - Integration timeout with Intune

Would you like me to investigate these blockers?`,
          actions: [
            { label: 'View Blockers', icon: <AlertTriangle className="w-4 h-4" />, action: 'view_blockers' },
            { label: 'Retry', icon: <RefreshCw className="w-4 h-4" />, action: 'retry' },
          ],
        };
      } else {
        response = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          timestamp: new Date(),
          content: `I understand you're asking about "${input}".

I can help with vulnerability management, deployment operations, workflow automation, change requests, and analytics.

Could you rephrase your question or try one of these:

• "Show critical CVEs"
• "What's the deployment status?"
• "Create a remediation workflow"
• "Generate this week's report"`,
        };
      }

      setMessages((prev) => [...prev, response]);
      setIsTyping(false);
    }, 1500);
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
        >
          <Bot className="w-7 h-7 text-white" />
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col animate-in">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">AI Assistant</h1>
          <p className="text-muted-foreground">Context-aware copilot for PackIntel operations</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-outline">
            <RefreshCw className="w-4 h-4" />
            Clear Chat
          </button>
          <button
            onClick={() => setIsMinimized(true)}
            className="btn btn-outline"
          >
            <Minimize2 className="w-4 h-4" />
            Minimize
          </button>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 flex gap-6">
        {/* Chat Window */}
        <div className="flex-1 flex flex-col rounded-xl border border-border bg-background-secondary overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-accent-secondary flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="rounded-2xl px-4 py-3 bg-background-tertiary">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.1s]" />
                    <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.2s]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Actions */}
          {messages.length <= 2 && <SuggestedActions />}

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about vulnerabilities, deployments, workflows..."
                className="input flex-1"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="btn btn-primary"
              >
                <Send className="w-4 h-4" />
                Send
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              AI responses are based on real-time data from PackIntel. Always verify critical actions.
            </p>
          </div>
        </div>

        {/* Context Panel */}
        <div className="w-80 space-y-4">
          <div className="card p-4">
            <h3 className="font-semibold mb-4">Current Context</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active Page</span>
                <span className="badge bg-background-tertiary text-xs">Overview</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Selected App</span>
                <span className="badge bg-background-tertiary text-xs">None</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active Workflow</span>
                <span className="badge bg-background-tertiary text-xs">None</span>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="font-semibold mb-4">Capabilities</h3>
            <div className="space-y-2">
              {[
                { icon: Shield, label: 'Vulnerability Analysis' },
                { icon: TrendingUp, label: 'Deployment Insights' },
                { icon: GitBranch, label: 'Workflow Creation' },
                { icon: MessageSquare, label: 'Communication Drafting' },
                { icon: BarChart3, label: 'Report Generation' },
                { icon: Zap, label: 'Automated Remediation' },
              ].map((cap, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-background-tertiary">
                  <cap.icon className="w-4 h-4 text-accent-secondary" />
                  <span className="text-sm">{cap.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="btn btn-outline w-full justify-start">
                <Zap className="w-4 h-4" />
                Create Emergency Change
              </button>
              <button className="btn btn-outline w-full justify-start">
                <GitBranch className="w-4 h-4" />
                Start Remediation Workflow
              </button>
              <button className="btn btn-outline w-full justify-start">
                <BarChart3 className="w-4 h-4" />
                Generate Weekly Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
