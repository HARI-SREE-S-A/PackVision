'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useUIStore, useNotificationStore } from '@/store';
import {
  Search,
  Bell,
  Command,
  ChevronDown,
  Settings,
  LogOut,
  User,
  HelpCircle,
} from 'lucide-react';

interface HeaderProps {
  sidebarCollapsed: boolean;
}

export function Header({ sidebarCollapsed }: HeaderProps) {
  const router = useRouter();
  const { setCommandPaletteOpen } = useUIStore();
  const { unreadCount } = useNotificationStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header
      className={cn(
        'fixed top-0 right-0 z-30 h-16 bg-background-secondary/80 backdrop-blur-md border-b border-border transition-all duration-300',
        sidebarCollapsed ? 'left-16' : 'left-64'
      )}
    >
      <div className="h-full px-6 flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-xl">
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg bg-background-tertiary border border-border text-muted-foreground hover:border-accent-primary/50 transition-colors"
          >
            <Search className="w-4 h-4" />
            <span className="text-sm flex-1 text-left">Search or run a command...</span>
            <div className="flex items-center gap-1">
              <kbd className="px-2 py-0.5 rounded bg-background-elevated text-xs font-mono">
                <Command className="w-3 h-3 inline" />
              </kbd>
              <kbd className="px-2 py-0.5 rounded bg-background-elevated text-xs font-mono">K</kbd>
            </div>
          </button>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2 ml-4">
          {/* Help */}
          <button className="p-2 rounded-lg text-muted-foreground hover:bg-background-tertiary hover:text-foreground transition-colors">
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg text-muted-foreground hover:bg-background-tertiary hover:text-foreground transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-accent-danger text-white text-xs flex items-center justify-center font-medium">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-lg bg-background-elevated border border-border shadow-xl">
                <div className="p-4 border-b border-border">
                  <h3 className="font-semibold">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    No new notifications
                  </div>
                </div>
                <div className="p-2 border-t border-border">
                  <button className="w-full text-center text-sm text-accent-primary hover:underline">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
          <button className="p-2 rounded-lg text-muted-foreground hover:bg-background-tertiary hover:text-foreground transition-colors">
            <Settings className="w-5 h-5" />
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-background-tertiary transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center">
                <span className="text-white text-sm font-medium">OP</span>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-lg bg-background-elevated border border-border shadow-xl">
                <div className="p-4 border-b border-border">
                  <p className="font-medium">Operations Lead</p>
                  <p className="text-sm text-muted-foreground">admin@packintel.io</p>
                </div>
                <div className="p-2">
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-background-tertiary hover:text-foreground transition-colors">
                    <User className="w-4 h-4" />
                    Profile
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-background-tertiary hover:text-foreground transition-colors">
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-accent-danger hover:bg-accent-danger/10 transition-colors">
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
