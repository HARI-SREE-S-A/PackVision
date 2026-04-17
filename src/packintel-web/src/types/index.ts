// Core domain types for PackIntel

export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';
export type Status = 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';

// ============ Vulnerability Intelligence ============

export interface VulnerabilityFeedItem {
  id: string;
  cveId: string;
  description: string;
  cvssScore: number;
  cvssVector: string;
  severity: Severity;
  epssScore?: number;
  isKnownExploited: boolean;
  publishedDate: string;
  lastModifiedDate: string;
  affectedProducts: string[];
  references: string[];
  patchReleaseDate?: string;
  recommendedPatch?: string;
  source: 'nvd' | 'cisakev' | 'epss';
  status: 'new' | 'under_investigation' | 'patch_available' | 'patch_deployed' | 'risk_accepted' | 'false_positive';
  lastSyncedAt: string;
}

export interface VulnerabilityMatch {
  id: string;
  vulnerabilityFeedItemId: string;
  vulnerabilityFeedItem?: VulnerabilityFeedItem;
  assetType: 'application' | 'device' | 'package';
  assetId: string;
  assetName: string;
  assetVersion: string;
  cpeMatch: string;
  confidence: 'low' | 'medium' | 'high';
  isResolved: boolean;
  resolvedAt?: string;
  resolution?: string;
}

export interface ExposureScore {
  id: string;
  entityType: 'application' | 'device' | 'region' | 'business_unit' | 'application_family';
  entityId: string;
  entityName: string;
  region?: string;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  overallScore: number;
  trendingScore: number;
  calculatedAt: string;
}

export interface RemediationTask {
  id: string;
  vulnerabilityMatchId?: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'waiting_approval' | 'blocked' | 'completed' | 'cancelled' | 'risk_accepted';
  assignedEngineerId: string;
  assignedEngineerName: string;
  dueDate?: string;
  completedAt?: string;
  workflowInstanceId?: string;
  changeRequestId?: string;
  notes?: string;
  actions: RemediationAction[];
}

export interface RemediationAction {
  id: string;
  remediationTaskId: string;
  actionType: string;
  description: string;
  targetResource: string;
  isCompleted: boolean;
  completedAt?: string;
  result?: string;
}

export interface VulnerabilityAlert {
  id: string;
  vulnerabilityFeedItemId: string;
  vulnerabilityFeedItem?: VulnerabilityFeedItem;
  title: string;
  message: string;
  severity: Severity;
  status: 'active' | 'acknowledged' | 'resolved' | 'dismissed';
  affectedAssetCount: number;
  affectedAssetNames: string[];
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  triggeredWorkflow: boolean;
  triggeredWorkflowId?: string;
}

export interface ThreatFeedConfig {
  id: string;
  feedName: string;
  feedType: 'nvd' | 'cisakev' | 'epss';
  endpoint: string;
  isEnabled: boolean;
  syncIntervalMinutes: number;
  lastSyncAt?: string;
  lastSyncStatus: 'never_synced' | 'success' | 'partial_success' | 'failed';
  lastSyncError?: string;
  cveCount: number;
}

// ============ Dashboard ============

export interface MetricSnapshot {
  id: string;
  metricName: string;
  metricValue: number;
  unit?: string;
  category: string;
  previousValue?: number;
  trendPercent?: number;
  capturedAt: string;
}

export interface RolloutActivity {
  id: string;
  applicationId: string;
  applicationName: string;
  packageId: string;
  packageVersion: string;
  status: 'planned' | 'in_progress' | 'paused' | 'completed' | 'failed' | 'cancelled' | 'rolled_back';
  totalDevices: number;
  completedDevices: number;
  failedDevices: number;
  inProgressDevices: number;
  startedAt?: string;
  estimatedCompletionAt?: string;
  completedAt?: string;
  currentStage?: string;
  failureHotspot?: string;
  stages: RolloutStage[];
}

export interface RolloutStage {
  id: string;
  stageName: string;
  sequenceOrder: number;
  targetDevices: number;
  completedDevices: number;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped';
  startedAt?: string;
  completedAt?: string;
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: Severity;
  category: 'vulnerability' | 'deployment' | 'infrastructure' | 'ai' | 'compliance' | 'performance' | 'security';
  relatedEntityId?: string;
  relatedEntityType?: string;
  source?: string;
  status: 'active' | 'acknowledged' | 'resolved';
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  resolvedAt?: string;
  resolution?: string;
  actions: AlertAction[];
}

export interface AlertAction {
  id: string;
  alertId: string;
  actionType: string;
  description: string;
  performedAt: string;
  performedBy: string;
}

// ============ Applications ============

export interface Application {
  id: string;
  name: string;
  description: string;
  vendor: string;
  version: string;
  status: 'requested' | 'in_packaging' | 'testing' | 'approved' | 'in_deployment' | 'deployed' | 'failed' | 'retired';
  criticality: 'critical' | 'high' | 'medium' | 'low';
  owner: string;
  ownerEmail: string;
  businessUnit: string;
  region: string;
  category: string;
  packageType: 'msix' | 'msi' | 'exe' | 'appv' | 'script' | 'manual';
  aiConfidence?: {
    packagingComplexity: number;
    deploymentRisk: number;
    testCoverage: number;
    overallScore: number;
  };
  packages: Package[];
  deploymentTargets: DeploymentTarget[];
}

export interface Package {
  id: string;
  applicationId: string;
  version: string;
  format: 'msix' | 'msi' | 'exe' | 'appv' | 'script' | 'win32';
  installerPath: string;
  installerHash: string;
  installerSizeBytes: number;
  detectionRule: string;
  installCommand: string;
  uninstallCommand: string;
  installPath: string;
  requiresRestart: boolean;
  restartBehavior: string;
  dependencies: string[];
  conflicts: string[];
  validationResults: ValidationResult[];
  status: 'draft' | 'validating' | 'test_passed' | 'test_failed' | 'approved' | 'published' | 'retired';
  parentPackageId?: string;
}

export interface DeploymentTarget {
  id: string;
  applicationId: string;
  method: 'intune' | 'configmgr' | 'grouppolicy' | 'manual';
  targetName: string;
  assignmentGroup: string;
  deploymentRing: 'pilot' | 'fast' | 'broad';
  filterQuery?: string;
  autoUpdate: boolean;
  userNotification: boolean;
  installationIntent?: string;
  status: 'pending' | 'deployed' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
}

export interface ValidationResult {
  id: string;
  packageId: string;
  type: 'syntax_check' | 'dependency_check' | 'sandbox_execution' | 'compliance_scan' | 'device_readiness_check' | 'user_interaction_test';
  status: 'passed' | 'failed' | 'warning' | 'skipped' | 'error';
  testName: string;
  errorMessage?: string;
  executedAt: string;
  durationMs: number;
}

// ============ Workflows ============

export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  category: 'packaging' | 'deployment' | 'change_management' | 'communication' | 'vulnerability_remediation' | 'reporting' | 'custom';
  version: string;
  isActive: boolean;
  blocks: WorkflowBlockDefinition[];
  executionCount: number;
  averageExecutionTimeSeconds: number;
  successRate: number;
}

export interface WorkflowBlockDefinition {
  id: string;
  blockId: string;
  type: string;
  label: string;
  position: { x: number; y: number };
  config: Record<string, unknown>;
  inputBlockIds: string[];
  outputBlockIds: string[];
  timeoutSeconds: number;
  isRequired: boolean;
}

export interface WorkflowInstance {
  id: string;
  workflowDefinitionId: string;
  workflowDefinition?: WorkflowDefinition;
  name: string;
  status: 'pending' | 'running' | 'waiting_approval' | 'paused' | 'completed' | 'failed' | 'cancelled' | 'timed_out';
  triggerSource?: string;
  triggerPayload?: Record<string, unknown>;
  relatedEntityId?: string;
  relatedEntityType?: string;
  startedAt?: string;
  completedAt?: string;
  currentBlockId?: string;
  completedBlockCount: number;
  totalBlockCount: number;
  progressPercent: number;
  errorMessage?: string;
}

// ============ Changes ============

export interface ChangeRequest {
  id: string;
  changeId: string;
  title: string;
  description: string;
  type: 'standard' | 'normal' | 'emergency' | 'major';
  risk: 'low' | 'medium' | 'high' | 'critical';
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'rollback';
  category: 'application_deployment' | 'configuration_change' | 'security_patch' | 'infrastructure_change' | 'software_update' | 'network_change' | 'data_migration';
  relatedApplicationId?: string;
  relatedPackageId?: string;
  relatedWorkflowInstanceId?: string;
  implementationPlan: string;
  rollbackPlan: string;
  affectedScope: string;
  affectedRegions: string;
  businessOwner: string;
  businessOwnerEmail: string;
  maintenanceWindowStart?: string;
  maintenanceWindowEnd?: string;
  scheduledDate?: string;
  approvalCount: number;
  approvalRequired: number;
  cabNotes?: string;
  aiQualityScore?: {
    completeness: number;
    riskAssessment: number;
    rollbackAdequacy: number;
    approvalRouting: number;
    overallScore: number;
  };
  approvals: ChangeApproval[];
}

export interface ChangeApproval {
  id: string;
  changeId: string;
  approver: string;
  approverEmail: string;
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
  approvedAt?: string;
}

// ============ Users ============

export interface User {
  id: string;
  email: string;
  displayName: string;
  title?: string;
  department?: string;
  region?: string;
  status: 'active' | 'inactive' | 'on_leave' | 'terminated';
  role: Role;
  lastLoginAt?: string;
  lastActivityAt?: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  type: 'platform_admin' | 'euc_operator' | 'packaging_engineer' | 'engineering_lead' | 'service_desk_analyst' | 'approver' | 'auditor' | 'executive_viewer';
  permissions: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  action: string;
  resource: string;
}

// ============ API Response Types ============

export interface PagedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  error: string;
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}
