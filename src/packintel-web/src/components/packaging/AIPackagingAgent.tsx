'use client';

import { useState } from 'react';
import { Bot, UploadCloud, FileType, CheckCircle, ChevronRight, X, GitBranch, Play, Server, ServerCrash, RefreshCw } from 'lucide-react';

interface AIPackagingAgentProps {
  onClose: () => void;
  appName?: string;
}

export function AIPackagingAgent({ onClose, appName }: AIPackagingAgentProps) {
  const [step, setStep] = useState<number>(1);
  const [file, setFile] = useState<string | null>(null);
  const [stream, setStream] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [snowTicket, setSnowTicket] = useState<string | null>(null);
  
  const handleFileUpload = () => {
    setFile(appName ? `${appName.replace(/\s+/g, '_')}_installer.msi` : 'custom_app_v2.exe');
    setTimeout(() => setStep(2), 800);
  };

  const startAIPackaging = () => {
    setIsProcessing(true);
    setStream([]);
    const es = new EventSource('/api/packaging/deploy');
    es.onmessage = (event) => {
      if (event.data === '[DONE]') {
        es.close();
        setIsProcessing(false);
        setStep(3);
        return;
      }
      try {
        const payload = JSON.parse(event.data);
        if (payload.message) {
           setStream(prev => [...prev, payload.message]);
        }
      } catch (e) {}
    };
    es.onerror = () => {
      es.close();
      setIsProcessing(false);
    };
  };

  const createSnowChange = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/servicenow/changes', {
        method: 'POST',
        body: JSON.stringify({
          title: `Deploy ${appName || 'Custom Application'}`,
          description: 'Automated AI Intunewin deployment via PackIntel',
          risk: 'Low'
        })
      });
      const data = await res.json();
      if (data.success && data.data.change_id) {
        setSnowTicket(data.data.change_id);
      }
    } finally {
      setIsProcessing(false);
      setStep(4);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-background-secondary border border-border w-full max-w-3xl rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-border flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
             </div>
             <div>
               <h2 className="text-xl font-bold">AI Packaging Factory</h2>
               <p className="text-sm text-muted-foreground">Automated Intunewin conversion & deployment</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-background-tertiary rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Steps */}
        <div className="flex border-b border-border bg-background-tertiary/50">
           {['Upload Media', 'AI Analysis', 'ITSM Change', 'Deploy'].map((label, idx) => (
             <div key={idx} className={`flex-1 text-center py-3 text-sm font-medium border-b-2 transition-colors ${step > idx + 1 ? 'border-accent-success text-accent-success' : step === idx + 1 ? 'border-accent-primary text-accent-primary' : 'border-transparent text-muted-foreground'}`}>
               <span className="w-5 h-5 inline-flex items-center justify-center rounded-full border text-xs mr-2 border-inherit">{idx + 1}</span>
               {label}
             </div>
           ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {step === 1 && (
            <div className="h-64 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-center cursor-pointer hover:border-accent-primary/50 transition-colors bg-background" onClick={handleFileUpload}>
              <UploadCloud className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg mb-1">Upload Installer Asset</h3>
              <p className="text-sm text-muted-foreground max-w-sm">Drag and drop your MSI, EXE, or MSIX package here for AI deep analysis.</p>
              {file && <p className="mt-4 text-accent-primary font-mono text-sm">{file}</p>}
            </div>
          )}

          {step === 2 && (
             <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <h3 className="font-semibold">AI Feature Extraction</h3>
                   <button onClick={startAIPackaging} disabled={isProcessing} className="btn btn-primary disabled:opacity-50">
                     {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                     {isProcessing ? 'Generating...' : 'Start Extraction'}
                   </button>
                </div>
                <div className="bg-black/50 border border-border rounded-lg p-4 h-64 overflow-y-auto font-mono text-sm space-y-2">
                  {stream.map((line, i) => (
                     <div key={i} className="flex gap-3 text-emerald-400">
                       <span className="text-muted-foreground opacity-50 shrink-0">[{new Date().toISOString().split('T')[1].slice(0,-1)}]</span>
                       <span>{line}</span>
                     </div>
                  ))}
                  {isProcessing && <div className="text-muted-foreground animate-pulse">_</div>}
                  {stream.length === 0 && !isProcessing && <div className="text-muted-foreground">Waiting to begin execution...</div>}
                </div>
             </div>
          )}

          {step === 3 && (
             <div className="space-y-6 text-center py-8">
               <FileType className="w-16 h-16 text-accent-primary mx-auto" />
               <div>
                  <h3 className="text-xl font-bold mb-2">Package Successfully Created</h3>
                  <p className="text-muted-foreground">The `.intunewin` package passes all compliance checks.</p>
               </div>
               
               <div className="max-w-md mx-auto bg-background p-4 rounded-lg border border-border text-left space-y-3">
                 <h4 className="font-medium flex items-center gap-2"><GitBranch className="w-4 h-4" /> ITSM Integration Request</h4>
                 <p className="text-sm text-muted-foreground">Automated applications require a ServiceNow Change Record before pushing to pilot rings.</p>
                 <button onClick={createSnowChange} disabled={isProcessing} className="btn btn-primary w-full">
                    {isProcessing ? 'Requesting...' : 'Create SNOW Change Ticket'}
                 </button>
               </div>
             </div>
          )}

          {step === 4 && (
             <div className="space-y-6 text-center py-8">
               <CheckCircle className="w-16 h-16 text-accent-success mx-auto" />
               <div>
                  <h3 className="text-xl font-bold mb-2">Deployment Intent Scheduled</h3>
                  {snowTicket && <p className="text-md text-accent-primary mb-2 font-mono">{snowTicket}</p>}
                  <p className="text-muted-foreground max-w-sm mx-auto">The deployment will begin automatically once CAB approval is cleared in ServiceNow.</p>
               </div>
               <button onClick={onClose} className="btn btn-outline mt-4">Close Factory</button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
