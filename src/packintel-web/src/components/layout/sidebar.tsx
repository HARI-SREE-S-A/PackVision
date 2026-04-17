'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Package,
  GitBranch,
  FileText,
  MessageSquare,
  Shield,
  Server,
  BarChart3,
  Users,
  Plug,
  Bot,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const navigation = [
  { name: 'Overview', href: '/', icon: LayoutDashboard },
  { name: 'Applications', href: '/applications', icon: Package },
  { name: 'Workflows', href: '/workflows', icon: GitBranch },
  { name: 'Changes', href: '/changes', icon: FileText },
  { name: 'Identities', href: '/identities', icon: Users },
  { name: 'Assets & Licensing', href: '/assets', icon: Package },
  { name: 'Communications', href: '/communications', icon: MessageSquare },
  { name: 'Vulnerabilities', href: '/vulnerabilities', icon: Shield },
  { name: 'Infrastructure', href: '/infrastructure', icon: Server },
];

const adminNavigation = [
  { name: 'Admin Dashboard', href: '/admin', icon: Plug },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-background-secondary border-r border-border transition-all duration-300 flex flex-col',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center">
              <span className="text-white font-bold text-sm">PI</span>
            </div>
            <span className="font-semibold text-foreground">PackIntel</span>
          </Link>
        )}
        {collapsed && (
          <Link href="/" className="mx-auto">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center">
              <span className="text-white font-bold text-sm">PI</span>
            </div>
          </Link>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 overflow-y-auto">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group',
                    isActive
                      ? 'bg-accent-primary/10 text-accent-primary'
                      : 'text-muted-foreground hover:bg-background-tertiary hover:text-foreground'
                  )}
                >
                  <item.icon className={cn('w-5 h-5 flex-shrink-0', collapsed && 'mx-auto')} />
                  {!collapsed && <span className="text-sm font-medium">{item.name}</span>}
                  {isActive && !collapsed && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-primary" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Admin Section */}
        <div className="mt-8">
          {!collapsed && (
            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Admin
            </p>
          )}
          <ul className="space-y-1">
            {adminNavigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                      isActive
                        ? 'bg-accent-primary/10 text-accent-primary'
                        : 'text-muted-foreground hover:bg-background-tertiary hover:text-foreground'
                    )}
                  >
                    <item.icon className={cn('w-5 h-5 flex-shrink-0', collapsed && 'mx-auto')} />
                    {!collapsed && <span className="text-sm font-medium">{item.name}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Collapse Toggle */}
      <div className="p-4 border-t border-border">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:bg-background-tertiary hover:text-foreground transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
