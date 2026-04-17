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
import { useSettingsStore } from '@/store';

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

  const { geminiApiKey, isMockMode } = useSettingsStore();

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);
    setInput('');
    setIsTyping(true);

    const assistantMessageId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      { id: assistantMessageId, role: 'assistant', content: '', timestamp: new Date() }
    ]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: currentMessages,
          apiKey: geminiApiKey,
          isMockMode
        })
      });

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ') && !line.includes('[DONE]')) {
            const dataStr = line.replace('data: ', '');
            try {
              const data = JSON.parse(dataStr);
              const textChunk = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
              if (textChunk) {
                setMessages((prev) => 
                  prev.map((m) => 
                    m.id === assistantMessageId 
                      ? { ...m, content: m.content + textChunk } 
                      : m
                  )
                );
              }
            } catch (e) {}
          }
        }
      }
    } catch (error) {
      setMessages((prev) => 
        prev.map((m) => 
          m.id === assistantMessageId 
            ? { ...m, content: m.content + '\n\n**[Connection Error]** Could not stream response.' } 
            : m
        )
      );
    } finally {
      setIsTyping(false);
    }
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
