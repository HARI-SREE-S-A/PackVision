'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  DollarSign,
  TrendingDown,
  Monitor,
  HardDrive,
  Download,
  AlertTriangle,
  RefreshCw,
  Search,
  Filter,
  CheckCircle,
  Package,
} from 'lucide-react';

// Mock License Data
interface License {
  id: string;
  user: string;
  app: string;
  costPerMonth: number;
  lastUsed: string;
  recommendation: 'Harvest' | 'Monitor';
  confidence: number;
  status: 'idle' | 'harvested';
}

const mockLicenses: License[] = [
  {
    id: 'l1',
    user: 'jason.bourne@company.com',
    app: 'AutoCAD 2024',
    costPerMonth: 235.00,
    lastUsed: '45 days ago',
    recommendation: 'Harvest',
    confidence: 94,
    status: 'idle',
  },
  {
    id: 'l2',
    user: 'sarah.connor@company.com',
    app: 'Adobe Creative Cloud',
    costPerMonth: 89.99,
    lastUsed: '60 days ago',
    recommendation: 'Harvest',
    confidence: 98,
    status: 'idle',
  },
  {
    id: 'l3',
    user: 'peter.parker@company.com',
    app: 'Microsoft Project Plan 3',
    costPerMonth: 30.00,
    lastUsed: '14 days ago',
    recommendation: 'Monitor',
    confidence: 65,
    status: 'idle',
  },
  {
    id: 'l4',
    user: 'bruce.wayne@company.com',
    app: 'Zoom Pro',
    costPerMonth: 14.99,
    lastUsed: '90 days ago',
    recommendation: 'Harvest',
    confidence: 99,
    status: 'idle',
  },
];

export default function AssetsPage() {
  const [licenses, setLicenses] = useState(mockLicenses);
  const [isHarvesting, setIsHarvesting] = useState<string | null>(null);

  const potentialSavings = licenses
    .filter(l => l.recommendation === 'Harvest' && l.status === 'idle')
    .reduce((acc, curr) => acc + curr.costPerMonth, 0);

  const handleHarvest = (id: string) => {
    setIsHarvesting(id);
    setTimeout(() => {
      setLicenses(prev => prev.map(l => l.id === id ? { ...l, status: 'harvested' } : l));
      setIsHarvesting(null);
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Asset &amp; License Optimization</h1>
          <p className="text-muted-foreground">Reclaim budget by harvesting unused software and hardware</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-outline">
            <Download className="w-4 h-4" />
            Export Report
          </button>
          <button className="btn btn-primary" onClick={() => handleHarvest('all')}>
            <TrendingDown className="w-4 h-4" />
            Harvest All Eligible
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">Potential Monthly Savings</p>
              <h3 className="text-2xl font-bold text-accent-success">{"$"}{potentialSavings.toFixed(2)}</h3>
            </div>
            <div className="p-2 rounded-lg bg-accent-success/10">
              <DollarSign className="w-5 h-5 text-accent-success" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-accent-success">
             <TrendingDown className="w-3 h-3 mr-1" />
             <span>Reduces OpEx by 4.2%</span>
          </div>
        </div>

        <div className="card p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">Idle Hardware Assets</p>
              <h3 className="text-2xl font-bold text-accent-warning">24 Devices</h3>
            </div>
            <div className="p-2 rounded-lg bg-accent-warning/10">
              <Monitor className="w-5 h-5 text-accent-warning" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">{"Offline > 30 days"}</p>
        </div>

        <div className="card p-4 flex flex-col justify-between lg:col-span-2 bg-gradient-to-br from-background-secondary to-background-tertiary">
          <div className="flex justify-between items-start">
             <div>
                <p className="text-sm text-muted-foreground">AI Fleet Assessment</p>
                <h3 className="text-lg font-bold mt-1">Optimization Ready</h3>
                <p className="text-xs text-muted-foreground mt-2 max-w-sm">PackIntel has identified idle AutoCAD and Adobe licenses that can be immediately reallocated via Intune grouping to zero out true-up costs.</p>
             </div>
             <div className="p-2 rounded-lg bg-accent-primary/10">
                <HardDrive className="w-5 h-5 text-accent-primary" />
             </div>
          </div>
        </div>
      </div>

      {/* Underutilized Licenses Table */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-4">
           <h3 className="font-semibold text-lg">Underutilized Software Candidates</h3>
           <div className="flex gap-2">
             <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="text" placeholder="Search user or app..." className="input pl-9 text-sm h-9" />
             </div>
             <button className="btn btn-outline btn-sm h-9">
               <Filter className="w-4 h-4" /> Filter
             </button>
           </div>
        </div>
        
        <div className="table-container">
          <table className="table w-full text-left">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-2 font-medium text-muted-foreground">User Identity</th>
                <th className="pb-2 font-medium text-muted-foreground">Application</th>
                <th className="pb-2 font-medium text-muted-foreground">Unit Cost</th>
                <th className="pb-2 font-medium text-muted-foreground">Last Telemetry</th>
                <th className="pb-2 font-medium text-muted-foreground">AI Confidence</th>
                <th className="pb-2 font-medium text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {licenses.map(license => (
                <tr key={license.id} className="border-b border-border/50 hover:bg-background-tertiary/30">
                   <td className="py-3 text-sm">{license.user}</td>
                   <td className="py-3 text-sm flex items-center gap-2">
                      <Package className="w-4 h-4 text-accent-secondary" />
                      {license.app}
                   </td>
                   <td className="py-3 text-sm">{"$"}{license.costPerMonth}{" /mo"}</td>
                   <td className="py-3 text-sm">
                      <span className="flex items-center gap-1 text-accent-warning">
                        <AlertTriangle className="w-3 h-3" />
                        {license.lastUsed}
                      </span>
                   </td>
                   <td className="py-3">
                      <div className="flex items-center gap-2">
                         <div className="w-16 h-1.5 bg-background-tertiary rounded-full overflow-hidden">
                           <div className="h-full bg-accent-primary rounded-full" style={{ width: license.confidence + '%' }} />
                         </div>
                         <span className="text-xs text-muted-foreground">{license.confidence}%</span>
                      </div>
                   </td>
                   <td className="py-3">
                     {license.status === 'harvested' ? (
                       <span className="flex items-center gap-1 text-xs text-accent-success font-medium">
                         <CheckCircle className="w-4 h-4" /> Harvested
                       </span>
                     ) : license.recommendation === 'Harvest' ? (
                       <button
                         onClick={() => handleHarvest(license.id)}
                         disabled={isHarvesting === license.id}
                         className="btn btn-primary btn-sm h-8 px-3 text-xs"
                       >
                         {isHarvesting === license.id ? <RefreshCw className="w-3 h-3 animate-spin" /> : 'Reclaim via Intune'}
                       </button>
                     ) : (
                       <span className="text-xs text-muted-foreground px-2 py-1 rounded-md bg-background-tertiary">Monitoring</span>
                     )}
                   </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
