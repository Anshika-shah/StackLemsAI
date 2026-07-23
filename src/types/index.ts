export type UserRole = 'admin' | 'team_lead' | 'developer';

export type ThemeMode = 'light' | 'dark' | 'amoled' | 'high-contrast' | 'system';
export type AccentColor = 'indigo' | 'emerald' | 'amber' | 'rose' | 'violet' | 'cyan';
export type ExplanationMode = 'beginner' | 'intermediate' | 'expert';
export type ResponseStyle = 'summary' | 'detailed' | 'step_by_step';

export interface UserPreferences {
  theme: ThemeMode;
  accentColor: AccentColor;
  preferredModel: string;
  explanationMode: ExplanationMode;
  responseStyle: ResponseStyle;
  fontSize: 'small' | 'medium' | 'large';
  notificationsEnabled: boolean;
  autoScanOnCommit: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  department: string;
  joinedDate: string;
  connectedIntegrations: {
    github: boolean;
    gitlab: boolean;
    docker: boolean;
    postgres: boolean;
    redis: boolean;
    slack: boolean;
  };
  preferences: UserPreferences;
}

export interface CodeFile {
  path: string;
  content: string;
  language: string;
  importance?: 'critical' | 'high' | 'medium' | 'low';
  sizeBytes?: number;
}

export interface DependencyNode {
  id: string;
  label: string;
  type: 'service' | 'database' | 'api' | 'middleware' | 'queue' | 'cache' | 'auth';
  health: 'healthy' | 'warning' | 'critical';
  details?: string;
  x?: number;
  y?: number;
}

export interface DependencyEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  status: 'normal' | 'latency' | 'failed';
}

export interface GitCommit {
  hash: string;
  shortHash: string;
  message: string;
  author: string;
  date: string;
  filesChanged: number;
  insertions: number;
  deletions: number;
  isBreaking?: boolean;
  branch: string;
}

export interface ApiEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  handlerFile: string;
  authRequired: boolean;
  status: 'active' | 'failing' | 'deprecated';
  avgLatencyMs: number;
  callsPerMin: number;
  errorRatePct: number;
}

export interface DatabaseTable {
  name: string;
  type: 'PostgreSQL' | 'MongoDB' | 'Redis';
  rowCount: number;
  sizeMb: number;
  hasIndex: boolean;
  status: 'healthy' | 'slow_queries' | 'missing_index';
  slowQueryText?: string;
}

export interface InvestigationEvidence {
  file: string;
  line?: string | number;
  snippet: string;
  rationale: string;
}

export interface InvestigationReport {
  id: string;
  projectId: string;
  projectName: string;
  query: string;
  title: string;
  category: 'auth' | 'performance' | 'build' | 'database' | 'api' | 'docker' | 'security' | 'general';
  status: 'scanning' | 'analyzing' | 'completed' | 'failed';
  rootCause: string;
  confidenceScore: number;
  affectedFiles: string[];
  evidence: InvestigationEvidence[];
  impactAnalysis: string;
  timelineCorrelation: string;
  suggestedFix: string;
  codeDiff?: string;
  relatedComponents?: string[];
  createdAt: string;
  investigatedBy: string;
  sharedWithTeam?: boolean;
}

export interface ProjectRepository {
  id: string;
  name: string;
  owner: string;
  description: string;
  provider: 'github' | 'gitlab' | 'bitbucket' | 'local';
  branch: string;
  healthScore: number;
  stars: number;
  lastScannedAt: string;
  stats: {
    filesCount: number;
    linesOfCode: number;
    servicesCount: number;
    endpointsCount: number;
    databasesCount: number;
    openIssuesCount: number;
  };
  languages: string[];
  files: CodeFile[];
  nodes: DependencyNode[];
  edges: DependencyEdge[];
  commits: GitCommit[];
  endpoints: ApiEndpoint[];
  databaseTables: DatabaseTable[];
  dockerfiles: { path: string; content: string; status: 'ok' | 'warning' | 'error' }[];
  cicdPipelines: { name: string; file: string; lastRunStatus: 'success' | 'failure'; durationSec: number }[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'investigation' | 'security' | 'build' | 'system';
  read: boolean;
  linkId?: string;
}
