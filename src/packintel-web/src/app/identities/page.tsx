'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Users,
  UserPlus,
  ShieldAlert,
  Bot,
  Laptop,
  CheckCircle,
  Briefcase,
  Play,
  Share2,
} from 'lucide-react';

interface RosterHire {
  id: string;
  name: string;
  title: string;
  department: string;
  startDate: string;
  status: 'pending' | 'provisioned';
  aiMapping: {
    hardware: string;
    apps: string[];
    adGroups: string[];
  };
}

const mockRoster: RosterHire[] = [
  {
    id: 'h1',
    name: 'Eleanor Shellstrop',
    title: 'Senior Financial Analyst',
    department: 'Finance',
    startDate: '2024-05-01',
    status: 'pending',
    aiMapping: {
      hardware: 'Lenovo ThinkPad T14s',
      apps: ['M365 Enterprise', 'PowerBI Pro', 'Bloomberg Terminal'],
      adGroups: ['SG-Finance-All', 'SG-VPN-Standard', 'SG-ERP-Access'],
    }
  },
  {
    id: 'h2',
    name: 'Chidi Anagonye',
    title: 'Lead Software Engineer',
    department: 'Engineering',
    startDate: '2024-05-03',
    status: 'pending',
    aiMapping: {
      hardware: 'MacBook Pro 16" M3 Max',
      apps: ['M365 Enterprise', 'Docker Desktop', 'JetBrains All Products', 'AWS CLI'],
      adGroups: ['SG-Engineering-Core', 'SG-AWS-Devs', 'SG-VPN-Split'],
    }
  },
  {
    id: 'h3',
    name: 'Tahani Al-Jamil',
    title: 'Marketing Director',
    department: 'Marketing',
    startDate: '2024-05-10',
    status: 'provisioned',
    aiMapping: {
      hardware: 'MacBook Air M3',
      apps: ['M365 Enterprise', 'Adobe CC All Apps', 'Figma Professional'],
      adGroups: ['SG-Marketing-All', 'SG-Design-Assets'],
    }
  }
];

export default function IdentitiesPage() {
  const [roster, setRoster] = useState(mockRoster);
  const [isProvisioning, setIsProvisioning] = useState<string | null>(null);

  const pendingCount = roster.filter(r => r.status === 'pending').length;

  const handleProvision = (id: string) => {
    setIsProvisioning(id);
    setTimeout(() => {
      setRoster(prev => prev.map(r => (id === 'all' || r.id === id) ? { ...r, status: 'provisioned' as 'provisioned' } : r));
      setIsProvisioning(null);
    }, 2500);
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Identity &amp; Access Hub</h1>
          <p className="text-muted-foreground">Zero-touch onboarding mapped straight from HR rosters</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-outline" onClick={() => window.location.reload()}>
            Sync Workday
          </button>
          <button className="btn btn-primary" onClick={() => handleProvision('all')} disabled={pendingCount === 0 || isProvisioning !== null}>
            <Play className="w-4 h-4" />
            Provision All Pending
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-4 flex items-center justify-between">
          <div>
             <p className="text-sm text-muted-foreground">Incoming Hires (Next 14 Days)</p>
             <h3 className="text-3xl font-bold mt-1 text-foreground">{pendingCount}</h3>
          </div>
          <div className="p-3 bg-accent-primary/10 rounded-full">
            <UserPlus className="w-6 h-6 text-accent-primary" />
          </div>
        </div>
        <div className="card p-4 flex items-center justify-between bg-gradient-to-br from-background-secondary to-background-tertiary">
          <div>
             <div className="flex items-center gap-2">
               <Bot className="w-4 h-4 text-accent-secondary" />
               <p className="text-sm font-semibold text-accent-secondary">AI Profile Mapper</p>
             </div>
             <p className="text-xs text-muted-foreground mt-2 max-w-[200px]">Analyzes title and department to instantly construct the Intune Persona (OOBE profiles, groups, devices).</p>
          </div>
        </div>
        <div className="card p-4 flex items-center justify-between">
          <div>
             <p className="text-sm text-muted-foreground">Active Identity Anomalies</p>
             <h3 className="text-3xl font-bold mt-1 text-accent-warning">0</h3>
          </div>
          <div className="p-3 bg-accent-warning/10 rounded-full flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-accent-warning" />
          </div>
        </div>
      </div>

      {/* Roster List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold border-b border-border pb-2">HR Roster Cohort</h2>
        
        <div className="grid gap-4">
          {roster.map(hire => (
            <div key={hire.id} className={cn('card p-5', hire.status === 'provisioned' ? 'opacity-60 border-accent-success/30' : 'border-border')}>
               <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                 {/* Identity Info */}
                 <div className="flex items-center gap-4 min-w-[250px]">
                    <div className="w-12 h-12 rounded-full bg-background-tertiary flex items-center justify-center font-bold text-lg">
                      {hire.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-bold text-md">{hire.name}</h4>
                      <p className="text-sm text-muted-foreground">{hire.title} &bull; {hire.department}</p>
                      <span className="text-xs text-accent-primary mt-1 inline-block">Starts: {hire.startDate}</span>
                    </div>
                 </div>

                 {/* AI Persona Mapping */}
                 <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 border-l border-border pl-6">
                    <div>
                      <h5 className="text-xs uppercase font-semibold text-muted-foreground mb-2 flex items-center gap-1"><Laptop className="w-3 h-3" /> Hardware</h5>
                      <p className="text-sm">{hire.aiMapping.hardware}</p>
                    </div>
                    <div>
                      <h5 className="text-xs uppercase font-semibold text-muted-foreground mb-2 flex items-center gap-1"><Briefcase className="w-3 h-3" /> Core Apps</h5>
                      <div className="flex flex-wrap gap-1">
                        {hire.aiMapping.apps.map((app, i) => (
                           <span key={i} className="px-2 py-1 bg-background-tertiary rounded text-[10px]">{app}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h5 className="text-xs uppercase font-semibold text-muted-foreground mb-2 flex items-center gap-1"><Share2 className="w-3 h-3" /> Entra ID Groups</h5>
                      <div className="flex flex-wrap gap-1">
                        {hire.aiMapping.adGroups.map((group, i) => (
                           <span key={i} className="px-2 py-1 bg-accent-secondary/10 text-accent-secondary rounded text-[10px]">{group}</span>
                        ))}
                      </div>
                    </div>
                 </div>

                 {/* Action */}
                 <div className="flex items-center justify-end min-w-[150px]">
                    {hire.status === 'provisioned' ? (
                       <span className="flex items-center gap-1 text-sm text-accent-success font-medium">
                         <CheckCircle className="w-5 h-5" /> Provisioned
                       </span>
                    ) : (
                       <button
                         onClick={() => handleProvision(hire.id)}
                         disabled={isProvisioning !== null}
                         className="btn btn-primary w-full justify-center"
                       >
                         {isProvisioning === hire.id ? <Play className="w-4 h-4 animate-spin" /> : 'Map & Create'}
                       </button>
                    )}
                 </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
