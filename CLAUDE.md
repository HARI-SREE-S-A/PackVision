# PackIntel - AI-Driven EUC Operations Platform

Enterprise application packaging, deployment, workflow orchestration, and EUC operations control platform.

## Tech Stack

- **Frontend**: React 18, Next.js 14 (App Router), TypeScript, Zustand, React Query, Tailwind CSS, shadcn/ui, React Flow, Recharts
- **Backend**: .NET 8, Clean Architecture, MediatR/CQRS, Entity Framework Core
- **Database**: SQL Server / Azure SQL
- **Integrations**: Microsoft Graph, Intune, Azure OpenAI, NIST NVD API, CISA KEV, EPSS

## Project Structure

```
D:\WORK\infrasphere\
├── packintel.sln                    # .NET Solution
├── src/
│   ├── PackIntel.Domain/           # Domain entities, interfaces (zero framework deps)
│   │   └── Entities/
│   │       ├── BaseEntity.cs       # AuditableEntity, ISoftDeletable, ITenantEntity
│   │       ├── Applications.cs     # Application, Package, DeploymentTarget
│   │       ├── Changes.cs          # ChangeRequest, ChangeApproval
│   │       ├── Communications.cs   # CommunicationPlan, StakeholderTarget
│   │       ├── Dashboard.cs        # MetricSnapshot, RolloutActivity, Alert
│   │       ├── Infrastructure.cs    # AIServiceStatus, VMEstateSnapshot, Integration
│   │       ├── Users.cs            # User, Role, Permission, AuditLog
│   │       ├── VulnerabilityIntelligence/
│   │       │   └── Cve.cs          # VulnerabilityFeedItem, VulnerabilityMatch, ExposureScore, RemediationTask, VulnerabilityAlert
│   │       └── Workflows.cs         # WorkflowDefinition, WorkflowInstance
│   │
│   ├── PackIntel.Application/       # Use cases, MediatR handlers, DTOs
│   │   ├── Behaviors/
│   │   │   └── PipelineBehaviors.cs  # Validation, Logging, Performance behaviors
│   │   └── Features/
│   │       └── VulnerabilityIntelligence/
│   │           └── VulnerabilityIntelligenceContracts.cs  # Commands/Queries
│   │
│   ├── PackIntel.Infrastructure/     # EF Core, Azure SDKs, external APIs
│   │   ├── Data/
│   │   │   └── PackIntelDbContext.cs  # EF Core context with temporal tables
│   │   ├── Services/
│   │   │   ├── AiService.cs          # Azure OpenAI integration
│   │   │   ├── CveMatcherService.cs   # CVE-to-asset correlation engine
│   │   │   ├── GraphService.cs        # Microsoft Graph API
│   │   │   └── VulnerabilitySyncService.cs  # NVD/CISA sync
│   │   └── Vulnerability/
│   │       └── NvdClient.cs          # NIST NVD API 2.0 client
│   │
│   └── PackIntel.Api/               # ASP.NET Core Web API
│       ├── Controllers/
│       ├── Extensions/
│       │   └── ServiceCollectionExtensions.cs  # DI configuration
│       ├── Middleware/
│       │   └── ExceptionHandlingMiddleware.cs
│       └── Program.cs
│
└── src/packintel-web/               # Next.js frontend
    └── src/
        ├── app/
        │   ├── layout.tsx           # Root layout
        │   ├── providers.tsx        # Query providers
        │   ├── page.tsx             # Overview Dashboard
        │   ├── applications/page.tsx    # Application Management
        │   ├── workflows/page.tsx        # Workflow Studio (React Flow)
        │   ├── changes/page.tsx          # Change Automation
        │   ├── communications/page.tsx   # Communications Orchestrator
        │   ├── vulnerabilities/page.tsx   # Vulnerability Intelligence Center
        │   ├── infrastructure/page.tsx     # Infrastructure Monitor
        │   ├── chat/page.tsx             # AI Assistant (MCP-powered)
        │   └── admin/page.tsx            # User & Integration Management
        │
        ├── components/
        │   ├── layout/
        │   │   ├── sidebar.tsx        # Navigation sidebar
        │   │   └── header.tsx        # Search, notifications, user menu
        │   └── ui/
        │
        ├── store/
        │   └── index.ts              # Zustand stores (auth, dashboard, vulnerability, workflow, etc.)
        │
        ├── types/
        │   └── index.ts              # TypeScript interfaces
        │
        ├── lib/
        │   └── utils.ts              # Utility functions (cn, formatDate, etc.)
        │
        └── styles/
            └── globals.css           # Tailwind + custom styles
```

## Key Modules

### 1. Vulnerability Intelligence Center
**Purpose**: Public CVE database integration with infrastructure correlation

**Features**:
- NVD (NIST), CISA KEV, EPSS feed integration via REST APIs
- CVSS + EPSS + KEV severity scoring
- Asset-to-CVE correlation engine (by product name, version, CPE)
- Exposure scoring by entity (application, device, region)
- Automated remediation task generation
- Real-time alerts for critical CVEs
- Workflow Studio integration for remediation automation

**Backend Files**:
- `PackIntel.Domain/Entities/VulnerabilityIntelligence/Cve.cs`
- `PackIntel.Application/Features/VulnerabilityIntelligence/VulnerabilityIntelligenceContracts.cs`
- `PackIntel.Infrastructure/Vulnerability/NvdClient.cs`
- `PackIntel.Infrastructure/Services/VulnerabilitySyncService.cs`
- `PackIntel.Infrastructure/Services/CveMatcherService.cs`

**Frontend Files**:
- `src/app/vulnerabilities/page.tsx`

---

### 2. Application Management
**Purpose**: Central hub for all package-related activity

**Features**:
- Sortable/filterable application table with AI confidence scores
- Package lineage tracking (parent/child relationships)
- Deployment target configuration (Intune, SCCM)
- Smart Package assistant for AI-assisted packaging
- Vulnerability scanning integration

**Frontend Files**:
- `src/app/applications/page.tsx`

---

### 3. Workflow Studio
**Purpose**: Visual automation workflow designer with React Flow

**Features**:
- Drag-and-drop workflow design canvas
- 7 block types: Trigger, Action, Condition, AI Evaluation, Approval, Notification, Validation
- Blueprint library with reusable templates
- Real-time execution monitoring
- Workflow triggers for vulnerability detection

**Frontend Files**:
- `src/app/workflows/page.tsx`

---

### 4. Change Automation
**Purpose**: TechLink change management with AI-powered quality scoring

**Features**:
- Change request creation and management
- AI-generated change quality analysis
- Approval routing and tracking
- Emergency change workflows
- Integration with Workflow Studio

**Frontend Files**:
- `src/app/changes/page.tsx`

---

### 5. Communications Orchestrator
**Purpose**: AI-powered stakeholder communication management

**Features**:
- Audience targeting by user groups, departments, regions
- Multi-stage message sequencing
- AI-drafted messages with audience-aware variants
- Delivery tracking with open/click metrics
- Template library

**Frontend Files**:
- `src/app/communications/page.tsx`

---

### 6. AI Control Center
**Purpose**: Operational transparency into AI-driven features

**Features** (integrated in other modules):
- Azure OpenAI, Copilot, Graph health monitoring
- Decision logging with confidence scores
- Feature toggles for AI capabilities
- Human-in-the-loop governance

---

### 7. Infrastructure Monitor
**Purpose**: Real-time VM estate visibility

**Features**:
- Regional health dashboard (UK South, West, North, Central)
- Platform health (Intune, ConfigMgr, Azure AD, Graph)
- Queue pressure monitoring
- Geographic heatmap visualization
- Live alerts stream

**Frontend Files**:
- `src/app/infrastructure/page.tsx`

---

### 8. AI Assistant (MCP-Powered)
**Purpose**: Context-aware conversational copilot

**Features**:
- Context-aware responses based on current page/selection
- Action buttons for common operations
- Chart rendering for analytics
- Quick actions for common tasks

**Frontend Files**:
- `src/app/chat/page.tsx`

---

### 9. Administration
**Purpose**: User and integration management

**Features**:
- User management with RBAC
- Integration configuration (Graph, Intune, OpenAI, NVD, KEV)
- API key management with expiry monitoring
- Audit log viewer

**Frontend Files**:
- `src/app/admin/page.tsx`

---

## Design System

### Colors
```
Background:    #0a0a0f (primary), #12121a (secondary), #1a1a24 (tertiary)
Border:        #2a2a36
Accent:        #3b82f6 (blue), #14b8a6 (teal), #8b5cf6 (violet)
Severity:      Critical #ef4444, High #f97316, Medium #f59e0b, Low #22c55e
```

### Typography
- Font: Inter (sans), JetBrains Mono (mono)
- Headings: Bold, tight tracking
- Body: 14px default

### Components
- Card-based layouts with hover states
- Badge system for status/criticality
- Skeleton loaders
- Toast notifications
- Command palette (Cmd+K)

---

## Development Commands

### Backend
```bash
cd src/PackIntel.Api
dotnet build
dotnet run
# Health check: GET http://localhost:5000/health
```

### Frontend
```bash
cd src/packintel-web
npm install
npm run dev
# Opens at http://localhost:3000
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|--------------|
| GET | /api/v1/health | Health check |
| GET | /api/v1/vulnerabilities | CVE list with filters |
| GET | /api/v1/vulnerabilities/{cveId} | CVE details |
| POST | /api/v1/vulnerabilities/sync | Sync from feeds |
| GET | /api/v1/applications | Application list |
| GET | /api/v1/workflows | Workflow definitions |
| POST | /api/v1/workflows/execute/{id} | Execute workflow |

---

## Key Design Patterns

1. **Clean Architecture**: Domain → Application → Infrastructure → API layers
2. **CQRS with MediatR**: Commands/Queries with pipeline behaviors
3. **Multi-tenancy**: Row-level security with tenant ID filters
4. **Temporal Tables**: Audit history via EF Core 8
5. **Feature Flags**: Azure App Configuration integration

---

## Status

**Phase 1**: ✅ Complete (Foundation, core modules)
**Phase 2**: ✅ Complete (Workflows, Changes, Communications, Infrastructure, Chat, Admin)

**Next Steps**:
- Analytics & Reporting module
- Real-time WebSocket updates
- API controller implementations
- Unit tests
- Database migrations
