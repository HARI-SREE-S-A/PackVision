'use client';

import { useState, useRef, useEffect } from 'react';
import { cn, formatRelativeTime } from '@/lib/utils';
import {
  Bot,
  Send,
  Minimize2,
  X,
  TrendingUp,
  Shield,
  GitBranch,
} from 'lucide-react';
import { useSettingsStore } from '@/store';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const quickActions = [
  { label: 'Check CVEs', icon: <Shield className="w-3 h-3" /> },
  { label: 'Deployment status', icon: <TrendingUp className="w-3 h-3" /> },
  { label: 'Blocked flows', icon: <GitBranch className="w-3 h-3" /> },
];

export function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      timestamp: new Date(),
      content: `Hello! I'm PackIntel AI. I can trigger deployments, execute SNOW tickets, and evaluate CVEs. How can I help?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { geminiApiKey, isMockMode } = useSettingsStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (textValue: string = input) => {
    if (!textValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: textValue,
      timestamp: new Date(),
    };

    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);
    if (textValue === input) setInput('');
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

      let buffer = '';
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        
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
            ? { ...m, content: m.content + '\n\n**[Error]** Failed to connect.' } 
            : m
        )
      );
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary shadow-2xl flex items-center justify-center hover:scale-105 transition-transform"
      >
        <Bot className="w-7 h-7 text-white" />
        <span className="absolute top-0 right-0 w-3 h-3 bg-accent-success rounded-full border-2 border-background" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[380px] h-[600px] max-h-[80vh] flex flex-col rounded-2xl border border-border shadow-2xl bg-background-secondary overflow-hidden animate-in fade-in slide-in-from-bottom-5">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-background border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">PackIntel AI</h3>
            <p className="text-xs text-accent-success">Online • MCP Enabled</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg hover:bg-background-tertiary transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isUser = message.role === 'user';
          return (
            <div key={message.id} className={cn('flex gap-2', isUser && 'flex-row-reverse')}>
              <div className={cn('max-w-[85%]', isUser && 'text-right')}>
                <div className={cn(
                  'rounded-2xl px-3 py-2 inline-block text-sm whitespace-pre-wrap',
                  isUser ? 'bg-accent-primary text-white rounded-br-sm' : 'bg-background-tertiary rounded-bl-sm'
                )}>
                  {message.content}
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 px-1">
                  {formatRelativeTime(message.timestamp)}
                </p>
              </div>
            </div>
          );
        })}
        {isTyping && (
          <div className="flex gap-2">
            <div className="rounded-2xl px-3 py-2 bg-background-tertiary rounded-bl-sm">
               <div className="flex gap-1 h-4 items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" />
                  <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.1s]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.2s]" />
               </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 bg-background border-t border-border">
        {messages.length <= 2 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {quickActions.map((action, i) => (
              <button
                key={i}
                onClick={() => handleSend(action.label)}
                className="btn btn-ghost btn-sm text-[10px] h-7 px-2"
              >
                {action.icon}
                {action.label}
              </button>
            ))}
          </div>
        )}
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask PackIntel AI..."
            className="input w-full pr-10 text-sm"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-white bg-accent-primary disabled:opacity-50 transition-opacity"
          >
            <Send className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
