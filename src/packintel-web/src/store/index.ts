import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  User,
  MetricSnapshot,
  Alert,
  RolloutActivity,
  VulnerabilityAlert,
  ThreatFeedConfig,
} from '@/types';

// ============ Auth Store ============

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  token: null,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setToken: (token) => set({ token }),
  logout: () => set({ user: null, isAuthenticated: false, token: null }),
}));

// ============ Dashboard Store ============

interface DashboardState {
  metrics: MetricSnapshot[];
  rollouts: RolloutActivity[];
  alerts: Alert[];
  criticalVulnerabilityAlerts: VulnerabilityAlert[];
  aiHealthStatus: {
    azureOpenAI: 'healthy' | 'degraded' | 'unhealthy';
    copilot: 'healthy' | 'degraded' | 'unhealthy';
    graph: 'healthy' | 'degraded' | 'unhealthy';
  };
  isLoading: boolean;
  lastUpdated: Date | null;
  setMetrics: (metrics: MetricSnapshot[]) => void;
  setRollouts: (rollouts: RolloutActivity[]) => void;
  setAlerts: (alerts: Alert[]) => void;
  setCriticalVulnerabilityAlerts: (alerts: VulnerabilityAlert[]) => void;
  setAiHealthStatus: (status: DashboardState['aiHealthStatus']) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  metrics: [],
  rollouts: [],
  alerts: [],
  criticalVulnerabilityAlerts: [],
  aiHealthStatus: {
    azureOpenAI: 'healthy',
    copilot: 'healthy',
    graph: 'healthy',
  },
  isLoading: true,
  lastUpdated: null,
  setMetrics: (metrics) => set({ metrics, lastUpdated: new Date() }),
  setRollouts: (rollouts) => set({ rollouts, lastUpdated: new Date() }),
  setAlerts: (alerts) => set({ alerts, lastUpdated: new Date() }),
  setCriticalVulnerabilityAlerts: (criticalVulnerabilityAlerts) => set({ criticalVulnerabilityAlerts }),
  setAiHealthStatus: (aiHealthStatus) => set({ aiHealthStatus }),
  setLoading: (isLoading) => set({ isLoading }),
}));

// ============ Vulnerability Store ============

interface VulnerabilityState {
  cves: VulnerabilityFeedItem[];
  selectedCve: VulnerabilityFeedItem | null;
  matches: VulnerabilityMatch[];
  exposureScores: ExposureScore[];
  remediationTasks: RemediationTask[];
  alerts: VulnerabilityAlert[];
  feedConfigs: ThreatFeedConfig[];
  filters: {
    severity: string[];
    isKnownExploited: boolean | null;
    minCvss: number | null;
    keyword: string;
    dateRange: { start: Date | null; end: Date | null };
  };
  isLoading: boolean;
  setCves: (cves: VulnerabilityFeedItem[]) => void;
  setSelectedCve: (cve: VulnerabilityFeedItem | null) => void;
  setMatches: (matches: VulnerabilityMatch[]) => void;
  setExposureScores: (scores: ExposureScore[]) => void;
  setRemediationTasks: (tasks: RemediationTask[]) => void;
  setAlerts: (alerts: VulnerabilityAlert[]) => void;
  setFeedConfigs: (configs: ThreatFeedConfig[]) => void;
  setFilters: (filters: Partial<VulnerabilityState['filters']>) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useVulnerabilityStore = create<VulnerabilityState>((set) => ({
  cves: [],
  selectedCve: null,
  matches: [],
  exposureScores: [],
  remediationTasks: [],
  alerts: [],
  feedConfigs: [],
  filters: {
    severity: [],
    isKnownExploited: null,
    minCvss: null,
    keyword: '',
    dateRange: { start: null, end: null },
  },
  isLoading: true,
  setCves: (cves) => set({ cves }),
  setSelectedCve: (selectedCve) => set({ selectedCve }),
  setMatches: (matches) => set({ matches }),
  setExposureScores: (exposureScores) => set({ exposureScores }),
  setRemediationTasks: (remediationTasks) => set({ remediationTasks }),
  setAlerts: (alerts) => set({ alerts }),
  setFeedConfigs: (feedConfigs) => set({ feedConfigs }),
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  setLoading: (isLoading) => set({ isLoading }),
}));

// ============ Workflow Store ============

interface WorkflowState {
  definitions: WorkflowDefinition[];
  instances: WorkflowInstance[];
  selectedDefinition: WorkflowDefinition | null;
  selectedInstance: WorkflowInstance | null;
  isExecuting: boolean;
  setDefinitions: (definitions: WorkflowDefinition[]) => void;
  setInstances: (instances: WorkflowInstance[]) => void;
  setSelectedDefinition: (definition: WorkflowDefinition | null) => void;
  setSelectedInstance: (instance: WorkflowInstance | null) => void;
  setExecuting: (isExecuting: boolean) => void;
}

export const useWorkflowStore = create<WorkflowState>((set) => ({
  definitions: [],
  instances: [],
  selectedDefinition: null,
  selectedInstance: null,
  isExecuting: false,
  setDefinitions: (definitions) => set({ definitions }),
  setInstances: (instances) => set({ instances }),
  setSelectedDefinition: (selectedDefinition) => set({ selectedDefinition }),
  setSelectedInstance: (selectedInstance) => set({ selectedInstance }),
  setExecuting: (isExecuting) => set({ isExecuting }),
}));

// ============ Application Store ============

interface ApplicationState {
  applications: Application[];
  selectedApplication: Application | null;
  filters: {
    status: string[];
    criticality: string[];
    owner: string;
    search: string;
  };
  isLoading: boolean;
  setApplications: (applications: Application[]) => void;
  setSelectedApplication: (application: Application | null) => void;
  setFilters: (filters: Partial<ApplicationState['filters']>) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useApplicationStore = create<ApplicationState>((set) => ({
  applications: [],
  selectedApplication: null,
  filters: {
    status: [],
    criticality: [],
    owner: '',
    search: '',
  },
  isLoading: true,
  setApplications: (applications) => set({ applications }),
  setSelectedApplication: (selectedApplication) => set({ selectedApplication }),
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  setLoading: (isLoading) => set({ isLoading }),
}));

// ============ Notification Store ============

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (notification: AppNotification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  category: 'vulnerability' | 'deployment' | 'workflow' | 'system';
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications].slice(0, 100),
      unreadCount: state.unreadCount + (notification.isRead ? 0 : 1),
    })),
  markAsRead: (id) =>
    set((state) => {
      const notification = state.notifications.find((n) => n.id === id);
      if (notification && !notification.isRead) {
        return {
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        };
      }
      return state;
    }),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    })),
  removeNotification: (id) =>
    set((state) => {
      const notification = state.notifications.find((n) => n.id === id);
      return {
        notifications: state.notifications.filter((n) => n.id !== id),
        unreadCount:
          notification && !notification.isRead
            ? Math.max(0, state.unreadCount - 1)
            : state.unreadCount,
      };
    }),
  clearAll: () => set({ notifications: [], unreadCount: 0 }),
}));

// ============ UI Store ============

interface UIState {
  sidebarCollapsed: boolean;
  commandPaletteOpen: boolean;
  activeModal: string | null;
  theme: 'dark' | 'light';
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setActiveModal: (modal: string | null) => void;
  setTheme: (theme: 'dark' | 'light') => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  commandPaletteOpen: false,
  activeModal: null,
  theme: 'dark',
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
  setCommandPaletteOpen: (commandPaletteOpen) => set({ commandPaletteOpen }),
  setActiveModal: (activeModal) => set({ activeModal }),
  setTheme: (theme) => set({ theme }),
}));

// Re-export types for convenience
export type { VulnerabilityFeedItem, VulnerabilityMatch, ExposureScore, RemediationTask, VulnerabilityAlert } from '@/types';
export type { WorkflowDefinition, WorkflowInstance } from '@/types';
export type { Application } from '@/types';
