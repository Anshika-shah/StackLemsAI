import { ProjectRepository, UserProfile, InvestigationReport, NotificationItem } from '../types';

export const mockCurrentUser: UserProfile = {
  id: 'usr_882910',
  name: 'Anshika Shah',
  email: 'anshika2004shah@gmail.com',
  role: 'team_lead',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  department: 'Core Platform & Architecture',
  joinedDate: '2025-01-15',
  connectedIntegrations: {
    github: true,
    gitlab: true,
    docker: true,
    postgres: true,
    redis: true,
    slack: true,
  },
  preferences: {
    theme: 'dark',
    accentColor: 'indigo',
    preferredModel: 'gemini-3.6-flash',
    explanationMode: 'intermediate',
    responseStyle: 'detailed',
    fontSize: 'medium',
    notificationsEnabled: true,
    autoScanOnCommit: true,
  },
};

export const mockProjects: ProjectRepository[] = [
  {
    id: 'proj_fintech_auth',
    name: 'fintech-payment-auth-gateway',
    owner: 'stacklens-org',
    description: 'High-throughput payment gateway & auth microservices suite with PostgreSQL & Redis cache',
    provider: 'github',
    branch: 'main',
    healthScore: 78,
    stars: 342,
    lastScannedAt: '10 mins ago',
    stats: {
      filesCount: 142,
      linesOfCode: 28450,
      servicesCount: 4,
      endpointsCount: 18,
      databasesCount: 2,
      openIssuesCount: 3,
    },
    languages: ['TypeScript', 'Go', 'PostgreSQL', 'Docker'],
    files: [
      {
        path: 'src/auth/jwtMiddleware.ts',
        language: 'typescript',
        importance: 'critical',
        sizeBytes: 3420,
        content: `import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// BUG IDENTIFIED IN INVESTIGATION:
// Middleware expects RS256 algorithm signature, but auth service signed with HS256!
export function verifyJwtToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header' });
  }

  const token = authHeader.split(' ')[1];
  const secretKey = process.env.JWT_SECRET || 'fallback_secret_key_v1';

  try {
    // DISCREPANCY: Token signed using HS256 algorithm by auth-server
    // but gateway forced { algorithms: ['RS256'] }, throwing JsonWebTokenError!
    const decoded = jwt.verify(token, secretKey, {
      algorithms: ['RS256'] // ❌ ROOT CAUSE: Mismatch algorithm!
    });
    
    (req as any).user = decoded;
    next();
  } catch (err: any) {
    console.error('[AuthGateway] JWT Verification Failed:', err.message);
    return res.status(401).json({
      error: 'Unauthorized access token',
      reason: err.message
    });
  }
}`,
      },
      {
        path: 'src/services/paymentService.ts',
        language: 'typescript',
        importance: 'critical',
        sizeBytes: 4210,
        content: `import { pool } from '../db/postgres';

export async function processPaymentTransaction(userId: string, amount: number, currency: string) {
  console.log(\`[PaymentService] Processing payment of \${amount} \${currency} for user \${userId}\`);

  // SLOW QUERY DETECTED: Missing index on payments.user_id table causes 4.8s sequential scan
  const query = \`
    SELECT id, status, created_at 
    FROM payments 
    WHERE user_id = $1 AND status = 'PENDING'
    ORDER BY created_at DESC 
    LIMIT 1;
  \`;

  const result = await pool.query(query, [userId]);
  return result.rows[0];
}`,
      },
      {
        path: 'Dockerfile',
        language: 'dockerfile',
        importance: 'high',
        sizeBytes: 1120,
        content: `# Base Image Mismatch Issue
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm prune --production
EXPOSE 3000
CMD ["node", "dist/server.cjs"]`,
      },
      {
        path: '.env.example',
        language: 'properties',
        importance: 'medium',
        sizeBytes: 450,
        content: `PORT=3000
DATABASE_URL=postgres://user:pass@postgres:5432/fintech_db
REDIS_URL=redis://redis:6379
JWT_SECRET=production_super_secret_key_2026
JWT_ALGORITHM=HS256`,
      },
    ],
    nodes: [
      { id: 'node_gateway', label: 'API Gateway (Express)', type: 'service', health: 'critical', details: 'JWT Verification 401 Error' },
      { id: 'node_auth', label: 'Auth Service (Node)', type: 'auth', health: 'healthy', details: 'Signs tokens with HS256' },
      { id: 'node_payment', label: 'Payment API', type: 'service', health: 'warning', details: 'Slow SQL query (4.8s)' },
      { id: 'node_postgres', label: 'PostgreSQL DB', type: 'database', health: 'warning', details: 'Missing index on payments.user_id' },
      { id: 'node_redis', label: 'Redis Cache', type: 'cache', health: 'healthy', details: '99.4% cache hit ratio' },
    ],
    edges: [
      { id: 'edge_1', source: 'node_gateway', target: 'node_auth', label: 'Token Verification', status: 'failed' },
      { id: 'edge_2', source: 'node_gateway', target: 'node_payment', label: 'Forward Request', status: 'normal' },
      { id: 'edge_3', source: 'node_payment', target: 'node_postgres', label: 'SQL Query', status: 'latency' },
      { id: 'edge_4', source: 'node_payment', target: 'node_redis', label: 'Session Lookup', status: 'normal' },
    ],
    commits: [
      {
        hash: 'a98f12c',
        shortHash: 'a98f12c',
        message: 'security(gateway): enforce explicit JWT algorithm verification',
        author: 'DevOps Lead',
        date: '2 hours ago',
        filesChanged: 3,
        insertions: 14,
        deletions: 4,
        isBreaking: true,
        branch: 'main',
      },
      {
        hash: 'b45c91a',
        shortHash: 'b45c91a',
        message: 'feat(payments): add pending payment status check query',
        author: 'Senior Engineer',
        date: '1 day ago',
        filesChanged: 2,
        insertions: 42,
        deletions: 8,
        isBreaking: false,
        branch: 'main',
      },
    ],
    endpoints: [
      { id: 'ep_1', method: 'POST', path: '/api/v1/auth/login', handlerFile: 'src/auth/jwtMiddleware.ts', authRequired: false, status: 'failing', avgLatencyMs: 310, callsPerMin: 1240, errorRatePct: 42.1 },
      { id: 'ep_2', method: 'POST', path: '/api/v1/payments/process', handlerFile: 'src/services/paymentService.ts', authRequired: true, status: 'active', avgLatencyMs: 4820, callsPerMin: 320, errorRatePct: 2.4 },
      { id: 'ep_3', method: 'GET', path: '/api/v1/users/profile', handlerFile: 'src/controllers/userController.ts', authRequired: true, status: 'active', avgLatencyMs: 45, callsPerMin: 2100, errorRatePct: 0.1 },
    ],
    databaseTables: [
      { name: 'payments', type: 'PostgreSQL', rowCount: 1420500, sizeMb: 384, hasIndex: false, status: 'slow_queries', slowQueryText: 'SELECT * FROM payments WHERE user_id = $1 AND status = "PENDING"' },
      { name: 'users', type: 'PostgreSQL', rowCount: 89000, sizeMb: 42, hasIndex: true, status: 'healthy' },
      { name: 'user_sessions', type: 'Redis', rowCount: 12400, sizeMb: 18, hasIndex: true, status: 'healthy' },
    ],
    dockerfiles: [
      { path: 'Dockerfile', content: 'FROM node:20-alpine\nWORKDIR /app\n...', status: 'ok' },
      { path: 'docker-compose.yml', content: 'version: "3.8"\nservices:\n  gateway:\n    build: .\n    ports:\n      - "3000:3000"', status: 'ok' },
    ],
    cicdPipelines: [
      { name: 'Deploy & Integration Tests', file: '.github/workflows/deploy.yml', lastRunStatus: 'failure', durationSec: 142 },
    ],
  },
  {
    id: 'proj_ecommerce_suite',
    name: 'ecommerce-microservices-suite',
    owner: 'stacklens-org',
    description: 'Distributed inventory, cart, and payment processing microservices with RabbitMQ & MongoDB',
    provider: 'github',
    branch: 'main',
    healthScore: 92,
    stars: 512,
    lastScannedAt: '1 hour ago',
    stats: {
      filesCount: 210,
      linesOfCode: 41200,
      servicesCount: 6,
      endpointsCount: 32,
      databasesCount: 3,
      openIssuesCount: 1,
    },
    languages: ['TypeScript', 'Python', 'MongoDB', 'Docker', 'Redis'],
    files: [
      {
        path: 'services/inventory/stockWorker.py',
        language: 'python',
        importance: 'high',
        sizeBytes: 2890,
        content: `import redis
import time

r = redis.Redis(host='localhost', port=6379, db=0)

def reserve_item_stock(item_id, qty):
    lock_key = f"lock:stock:{item_id}"
    # Race condition: lock expiration time is 500ms, but database write takes 800ms
    acquired = r.set(lock_key, "locked", nx=True, px=500)
    if not acquired:
        raise Exception("Failed to acquire inventory lock")
    
    # Simulate DB work exceeding lock duration
    time.sleep(0.8) 
    r.delete(lock_key)`,
      },
    ],
    nodes: [
      { id: 'node_cart', label: 'Cart API (Node.js)', type: 'service', health: 'healthy' },
      { id: 'node_inv', label: 'Inventory Worker (Python)', type: 'service', health: 'warning', details: 'Redis Lock Timeout Race Condition' },
      { id: 'node_mongo', label: 'MongoDB Products', type: 'database', health: 'healthy' },
      { id: 'node_mq', label: 'RabbitMQ Message Bus', type: 'queue', health: 'healthy' },
    ],
    edges: [
      { id: 'e1', source: 'node_cart', target: 'node_mq', label: 'Publish Event', status: 'normal' },
      { id: 'e2', source: 'node_mq', target: 'node_inv', label: 'Consume Stock Reservation', status: 'latency' },
      { id: 'e3', source: 'node_inv', target: 'node_mongo', label: 'Update Stock', status: 'normal' },
    ],
    commits: [
      {
        hash: 'c8712df',
        shortHash: 'c8712df',
        message: 'fix(inventory): decrease lock TTL to improve concurrency',
        author: 'Backend Dev',
        date: '3 hours ago',
        filesChanged: 1,
        insertions: 2,
        deletions: 2,
        isBreaking: true,
        branch: 'main',
      },
    ],
    endpoints: [
      { id: 'ep_cart_1', method: 'POST', path: '/api/v2/cart/checkout', handlerFile: 'services/cart/checkout.ts', authRequired: true, status: 'active', avgLatencyMs: 220, callsPerMin: 890, errorRatePct: 0.8 },
    ],
    databaseTables: [
      { name: 'orders', type: 'MongoDB', rowCount: 840000, sizeMb: 210, hasIndex: true, status: 'healthy' },
    ],
    dockerfiles: [],
    cicdPipelines: [
      { name: 'Inventory CI Test Suite', file: '.github/workflows/python-test.yml', lastRunStatus: 'success', durationSec: 88 },
    ],
  },
];

export const mockRecentReports: InvestigationReport[] = [
  {
    id: 'rep_902181',
    projectId: 'proj_fintech_auth',
    projectName: 'fintech-payment-auth-gateway',
    query: 'Why is Login API returning 401 Unauthorized for valid credentials?',
    title: 'JWT Token Signature Algorithm Mismatch between Gateway and Auth Server',
    category: 'auth',
    status: 'completed',
    rootCause: 'The API Gateway JWT middleware was updated to mandate RS256 algorithm verification ({ algorithms: ["RS256"] }), whereas the Auth Microservice continues to issue tokens signed using the HS256 HMAC secret algorithm.',
    confidenceScore: 96,
    affectedFiles: ['src/auth/jwtMiddleware.ts', '.env.example'],
    evidence: [
      {
        file: 'src/auth/jwtMiddleware.ts',
        line: 18,
        snippet: 'jwt.verify(token, secretKey, { algorithms: ["RS256"] })',
        rationale: 'Specifies RS256 algorithm enforcement, rejecting valid HS256 tokens signed by the auth authority.',
      },
      {
        file: '.env.example',
        line: 5,
        snippet: 'JWT_ALGORITHM=HS256',
        rationale: 'Environment specification declares HS256 as the primary signing scheme.',
      },
    ],
    impactAnalysis: 'All downstream API requests authenticated via API Gateway fail with 401 Unauthorized errors, preventing user login and authenticated transactions.',
    timelineCorrelation: 'Commit a98f12c ("security(gateway): enforce explicit JWT algorithm verification") was merged 2 hours ago by DevOps Lead.',
    suggestedFix: 'Update jwtMiddleware.ts to pull the algorithm dynamically from process.env.JWT_ALGORITHM || "HS256" or allow both HS256 and RS256 in the allowed algorithms array.',
    codeDiff: `--- src/auth/jwtMiddleware.ts (Before)
+++ src/auth/jwtMiddleware.ts (After)
@@ -16,7 +16,8 @@
   try {
-    const decoded = jwt.verify(token, secretKey, {
-      algorithms: ['RS256']
-    });
+    const allowedAlgo = (process.env.JWT_ALGORITHM as jwt.Algorithm) || 'HS256';
+    const decoded = jwt.verify(token, secretKey, {
+      algorithms: [allowedAlgo]
+    });
     (req as any).user = decoded;
     next();`,
    relatedComponents: ['API Gateway (Express)', 'Auth Service', 'JWT Token Store'],
    createdAt: '2026-07-23T11:30:00Z',
    investigatedBy: 'Anshika Shah',
    sharedWithTeam: true,
  },
  {
    id: 'rep_902182',
    projectId: 'proj_fintech_auth',
    projectName: 'fintech-payment-auth-gateway',
    query: 'Why is /api/v1/payments/process experiencing high latency (4.8s)?',
    title: 'Missing Database Index on payments.user_id Column',
    category: 'database',
    status: 'completed',
    rootCause: 'The SQL query executing inside processPaymentTransaction performs a sequential scan over 1.4 million records in the payments PostgreSQL table due to a missing B-Tree index on (user_id, status).',
    confidenceScore: 94,
    affectedFiles: ['src/services/paymentService.ts', 'db/migrations/004_create_payments.sql'],
    evidence: [
      {
        file: 'src/services/paymentService.ts',
        line: 12,
        snippet: 'SELECT id, status, created_at FROM payments WHERE user_id = $1 AND status = \'PENDING\' ORDER BY created_at DESC',
        rationale: 'Query filters by user_id and status on an unindexed table containing 1.4M rows.',
      },
    ],
    impactAnalysis: 'Checkout requests take ~4.8 seconds to respond, causing transaction timeouts under concurrent load.',
    timelineCorrelation: 'Payment table grew past 1M records following recent customer onboarding spike.',
    suggestedFix: 'Execute migration to add composite index: CREATE INDEX CONCURRENTLY idx_payments_user_status ON payments (user_id, status, created_at DESC);',
    codeDiff: `+ CREATE INDEX CONCURRENTLY idx_payments_user_status 
+ ON payments (user_id, status, created_at DESC);`,
    relatedComponents: ['Payment API', 'PostgreSQL DB'],
    createdAt: '2026-07-23T09:15:00Z',
    investigatedBy: 'StackLens Autonomous AI',
    sharedWithTeam: true,
  },
];

export const mockNotifications: NotificationItem[] = [
  {
    id: 'notif_1',
    title: 'Investigation Completed',
    message: 'Root cause identified for 401 Unauthorized Login issue (Confidence: 96%)',
    timestamp: '15 mins ago',
    type: 'investigation',
    read: false,
    linkId: 'rep_902181',
  },
  {
    id: 'notif_2',
    title: 'Breaking Commit Detected',
    message: 'Commit a98f12c in fintech-payment-auth-gateway introduced 1 security mismatch warning.',
    timestamp: '2 hours ago',
    type: 'security',
    read: false,
  },
  {
    id: 'notif_3',
    title: 'CI Pipeline Failed',
    message: 'Deploy & Integration Tests failed on main branch',
    timestamp: '3 hours ago',
    type: 'build',
    read: true,
  },
];
