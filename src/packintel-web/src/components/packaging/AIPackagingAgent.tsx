'use client';

import { useState } from 'react';
import { Bot, UploadCloud, FileType, CheckCircle, X, GitBranch, Play, RefreshCw, Users, Shield, UserPlus, ArrowRight, AlertTriangle } from 'lucide-react';

interface AIPackagingAgentProps {
  onClose: () => void;
  appName?: string;
}

const STEPS = ['Upload', 'AI Package', 'UAT Setup', 'UAT Confirm', 'Production'];

export function AIPackagingAgent({ onClose, appName }: AIPackagingAgentProps) {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<string | null>(null);
  const [stream, setStream] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [snowTicket, setSnowTicket] = useState<string | null>(null);

  // UAT state
  const [adGroupName, setAdGroupName] = useState('');
  const [adGroupCreated, setAdGroupCreated] = useState(false);
  const [testUserEmail, setTestUserEmail] = useState('');
  const [testUserAdded, setTestUserAdded] = useState(false);
  const [uatConfirmed, setUatConfirmed] = useState(false);

  // Production state
  const [targetUserCount, setTargetUserCount] = useState(5);
  const needsChange = targetUserCount > 10;

  const displayName = appName || 'Custom Application';

  // Step 1: Upload
  const handleFileUpload = () => {
    setFile(displayName.replace(/\s+/g, '_') + '_installer.msi');
    setAdGroupName('SG-App-' + displayName.replace(/\s+/g, '-') + '-UAT');
    setTimeout(() => setStep(2), 800);
  };

  // Step 2: AI Packaging
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

  // Step 3: Create AD Group & assign to Intune app, then add test user
  const createAdGroup = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setAdGroupCreated(true);
      setIsProcessing(false);
    }, 1500);
  };

  const addTestUser = () => {
    if (!testUserEmail.trim()) return;
    setIsProcessing(true);
    setTimeout(() => {
      setTestUserAdded(true);
      setIsProcessing(false);
    }, 1200);
  };

  // Step 4: User confirms UAT
  const confirmUat = (success: boolean) => {
    if (success) {
      setUatConfirmed(true);
      setStep(5);
    } else {
      // Reset back to packaging step
      setStep(2);
      setStream([]);
      setAdGroupCreated(false);
      setTestUserAdded(false);
      setTestUserEmail('');
    }
  };

  // Step 5: Move to Production (with optional SNOW change)
  const moveToProduction = async () => {
    setIsProcessing(true);
    if (needsChange) {
      try {
        const res = await fetch('/api/servicenow/changes', {
          method: 'POST',
          body: JSON.stringify({
            title: 'Production Deploy: ' + displayName,
            description: 'Moving ' + displayName + ' from UAT to production ring for ' + targetUserCount + ' users. AD Group: ' + adGroupName.replace('-UAT', '-Prod'),
            risk: targetUserCount > 50 ? 'High' : 'Medium'
          })
        });
        const data = await res.json();
        if (data.success && data.data?.change_id) {
          setSnowTicket(data.data.change_id);
        }
      } catch (e) {}
    }
    setTimeout(() => {
      setIsProcessing(false);
      setStep(6);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-background-secondary border border-border w-full max-w-3xl rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">AI Packaging Factory</h2>
              <p className="text-sm text-muted-foreground">Full lifecycle: Package → UAT → Production</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-background-tertiary rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicators */}
        <div className="flex border-b border-border bg-background-tertiary/50 overflow-x-auto">
          {STEPS.map((label, idx) => {
            const stepNum = idx + 1;
            const isComplete = step > stepNum || step === 6;
            const isCurrent = step === stepNum;
            return (
              <div key={idx} className={
                'flex-1 text-center py-3 text-xs font-medium border-b-2 transition-colors whitespace-nowrap px-2 ' +
                (isComplete ? 'border-accent-success text-accent-success' :
                 isCurrent ? 'border-accent-primary text-accent-primary' :
                 'border-transparent text-muted-foreground')
              }>
                <span className={
                  'w-5 h-5 inline-flex items-center justify-center rounded-full border text-[10px] mr-1 ' +
                  (isComplete ? 'border-accent-success bg-accent-success/10' :
                   isCurrent ? 'border-accent-primary bg-accent-primary/10' : 'border-border')
                }>
                  {isComplete ? '✓' : stepNum}
                </span>
                {label}
              </div>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">

          {/* Step 1: Upload */}
          {step === 1 && (
            <div className="h-64 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-center cursor-pointer hover:border-accent-primary/50 transition-colors bg-background" onClick={handleFileUpload}>
              <UploadCloud className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg mb-1">Upload Installer Asset</h3>
              <p className="text-sm text-muted-foreground max-w-sm">Drag and drop your MSI, EXE, or MSIX package here for AI deep analysis.</p>
              {file && <p className="mt-4 text-accent-primary font-mono text-sm">{file}</p>}
            </div>
          )}

          {/* Step 2: AI Packaging */}
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
                    <span className="text-muted-foreground opacity-50 shrink-0">[{new Date().toISOString().split('T')[1].slice(0, -1)}]</span>
                    <span>{line}</span>
                  </div>
                ))}
                {isProcessing && <div className="text-muted-foreground animate-pulse">_</div>}
                {stream.length === 0 && !isProcessing && <div className="text-muted-foreground">Waiting to begin execution...</div>}
              </div>
            </div>
          )}

          {/* Step 3: UAT Setup — AD Group + Test User */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <FileType className="w-8 h-8 text-accent-success" />
                <div>
                  <h3 className="font-semibold text-lg">.intunewin Package Created</h3>
                  <p className="text-sm text-muted-foreground">Now setting up UAT deployment ring</p>
                </div>
              </div>

              {/* AD Group Creation */}
              <div className="bg-background p-4 rounded-lg border border-border space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Shield className="w-4 h-4 text-accent-primary" />
                  Step 3a: Create Entra ID Security Group
                </h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={adGroupName}
                    onChange={(e) => setAdGroupName(e.target.value)}
                    className="input flex-1 text-sm"
                    placeholder="SG-App-MyApp-UAT"
                    disabled={adGroupCreated}
                  />
                  <button
                    onClick={createAdGroup}
                    disabled={isProcessing || adGroupCreated || !adGroupName.trim()}
                    className="btn btn-primary btn-sm disabled:opacity-50"
                  >
                    {adGroupCreated ? (
                      <><CheckCircle className="w-4 h-4 mr-1" /> Created</>
                    ) : isProcessing ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : 'Create & Assign to App'}
                  </button>
                </div>
                {adGroupCreated && (
                  <p className="text-xs text-accent-success flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Group created in Entra ID and assigned to {displayName} in Intune
                  </p>
                )}
              </div>

              {/* Add Test User */}
              {adGroupCreated && (
                <div className="bg-background p-4 rounded-lg border border-border space-y-3 animate-in">
                  <h4 className="font-medium flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-accent-secondary" />
                    Step 3b: Add Test User to UAT Group
                  </h4>
                  <p className="text-xs text-muted-foreground">Add a pilot user to {adGroupName}. The app will deploy to their device via Intune.</p>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={testUserEmail}
                      onChange={(e) => setTestUserEmail(e.target.value)}
                      className="input flex-1 text-sm"
                      placeholder="testuser@company.com"
                      disabled={testUserAdded}
                    />
                    <button
                      onClick={addTestUser}
                      disabled={isProcessing || testUserAdded || !testUserEmail.trim()}
                      className="btn btn-primary btn-sm disabled:opacity-50"
                    >
                      {testUserAdded ? (
                        <><CheckCircle className="w-4 h-4 mr-1" /> Added</>
                      ) : isProcessing ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : 'Add to Group'}
                    </button>
                  </div>
                  {testUserAdded && (
                    <div className="mt-3 p-3 bg-accent-primary/5 border border-accent-primary/20 rounded-lg">
                      <p className="text-sm font-medium text-accent-primary flex items-center gap-2">
                        <ArrowRight className="w-4 h-4" />
                        App deploying to {testUserEmail} via Intune...
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Please ask the user to confirm the installation before proceeding.</p>
                      <button onClick={() => setStep(4)} className="btn btn-primary mt-3 w-full">
                        Proceed to UAT Confirmation
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 4: UAT Confirmation */}
          {step === 4 && (
            <div className="space-y-6 text-center py-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-accent-warning/10 flex items-center justify-center">
                <Users className="w-8 h-8 text-accent-warning" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">UAT Verification</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  The app has been deployed to <span className="text-foreground font-medium">{testUserEmail || 'test user'}</span> via the <span className="font-mono text-accent-primary text-sm">{adGroupName}</span> Intune assignment.
                </p>
              </div>

              <div className="max-w-md mx-auto bg-background p-4 rounded-lg border border-border text-left space-y-4">
                <h4 className="font-medium text-sm">Did the test user confirm the application is working correctly?</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => confirmUat(true)} className="btn btn-primary justify-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    UAT Passed
                  </button>
                  <button onClick={() => confirmUat(false)} className="btn btn-outline justify-center text-accent-danger border-accent-danger/30 hover:bg-accent-danger/10">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    UAT Failed
                  </button>
                </div>
                <p className="text-[10px] text-muted-foreground">If UAT fails, you will be sent back to the packaging step to regenerate.</p>
              </div>
            </div>
          )}

          {/* Step 5: Move to Production */}
          {step === 5 && (
            <div className="space-y-6 py-4">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-8 h-8 text-accent-success" />
                <div>
                  <h3 className="font-semibold text-lg">UAT Passed — Ready for Production</h3>
                  <p className="text-sm text-muted-foreground">Configure the production deployment ring</p>
                </div>
              </div>

              <div className="bg-background p-4 rounded-lg border border-border space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Target User Count for Production
                </h4>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    min={1}
                    value={targetUserCount}
                    onChange={(e) => setTargetUserCount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="input w-32 text-sm"
                  />
                  <span className="text-sm text-muted-foreground">users</span>
                </div>

                {needsChange ? (
                  <div className="p-3 bg-accent-warning/10 border border-accent-warning/20 rounded-lg">
                    <p className="text-sm font-medium text-accent-warning flex items-center gap-2">
                      <GitBranch className="w-4 h-4" />
                      ServiceNow Change Required
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Deploying to more than 10 users requires a SNOW Change Record for CAB approval.
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-accent-success/10 border border-accent-success/20 rounded-lg">
                    <p className="text-sm font-medium text-accent-success flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      No Change Required
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      User count is 10 or fewer — direct production deployment allowed.
                    </p>
                  </div>
                )}

                <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t border-border">
                  <p><strong>Production Group:</strong> {adGroupName.replace('-UAT', '-Prod')}</p>
                  <p><strong>Intune Assignment:</strong> Required (Available install)</p>
                  <p><strong>SNOW Change:</strong> {needsChange ? 'Will be auto-created' : 'Not required'}</p>
                </div>

                <button onClick={moveToProduction} disabled={isProcessing} className="btn btn-primary w-full mt-2">
                  {isProcessing ? (
                    <><RefreshCw className="w-4 h-4 animate-spin mr-2" /> Processing...</>
                  ) : needsChange ? (
                    <><GitBranch className="w-4 h-4 mr-2" /> Create SNOW Change & Deploy</>
                  ) : (
                    <><ArrowRight className="w-4 h-4 mr-2" /> Deploy to Production</>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 6: Complete */}
          {step === 6 && (
            <div className="space-y-6 text-center py-8">
              <CheckCircle className="w-16 h-16 text-accent-success mx-auto" />
              <div>
                <h3 className="text-xl font-bold mb-2">Production Deployment Complete</h3>
                {snowTicket && (
                  <p className="text-md text-accent-primary mb-2 font-mono">{snowTicket}</p>
                )}
                <p className="text-muted-foreground max-w-sm mx-auto">
                  {needsChange
                    ? 'A SNOW Change has been created. Deployment will proceed after CAB approval.'
                    : 'The application has been deployed directly to the production ring.'}
                </p>
              </div>

              <div className="max-w-sm mx-auto bg-background p-4 rounded-lg border border-border text-left text-xs space-y-2">
                <p><strong>App:</strong> {displayName}</p>
                <p><strong>UAT Group:</strong> {adGroupName}</p>
                <p><strong>Prod Group:</strong> {adGroupName.replace('-UAT', '-Prod')}</p>
                <p><strong>Target Users:</strong> {targetUserCount}</p>
                <p><strong>SNOW Change:</strong> {snowTicket || 'Not required'}</p>
                <p><strong>UAT Tester:</strong> {testUserEmail}</p>
              </div>

              <button onClick={onClose} className="btn btn-outline mt-4">Close Factory</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
