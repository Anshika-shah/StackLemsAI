import React from 'react';
import { 
  Sparkles, AlertTriangle, ShieldCheck, Activity, Cpu, Database, 
  GitBranch, CheckCircle2, ArrowUpRight, ArrowRight, Play, Server, Clock, Zap, FileCode, Check
} from 'lucide-react';
import { ProjectRepository, InvestigationReport } from '../types';
import { ActiveTab } from './Sidebar';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardViewProps {
  project: ProjectRepository;
  recentReports: InvestigationReport[];
  onNavigateTab: (tab: ActiveTab) => void;
  onStartInvestigationWithPrompt: (query: string) => void;
  onViewReport: (report: InvestigationReport) => void;
}

const latencyChartData = [
  { time: '00:00', latency: 45, errors: 2 },
  { time: '04:00', latency: 42, errors: 1 },
  { time: '08:00', latency: 310, errors: 12 },
  { time: '12:00', latency: 4820, errors: 42 },
  { time: '16:00', latency: 850, errors: 18 },
  { time: '20:00', latency: 60, errors: 3 },
];

export const DashboardView: React.FC<DashboardViewProps> = ({
  project,
  recentReports,
  onNavigateTab,
  onStartInvestigationWithPrompt,
  onViewReport,
}) => {
  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      {/* Top Banner & Active Investigation Case */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Active Investigation Case #4812 */}
        <div className="lg:col-span-8 custom-card p-5 bg-[#121217] border border-white/10 flex flex-col justify-between space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-3">
            <div>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Active Investigation Case #4812
              </span>
              <h2 className="text-xl font-bold text-white mt-0.5">
                Why is Login API returning 401 Unauthorized?
              </h2>
            </div>
            <div className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded text-xs font-mono font-bold border border-emerald-500/20 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>CAUSE_IDENTIFIED</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-3">
              <div className="bg-white/5 p-3.5 rounded-lg border-l-4 border-indigo-500 text-xs">
                <h3 className="font-bold text-white mb-1">Root Cause Summary</h3>
                <p className="text-slate-300 leading-relaxed">
                  The <code className="font-mono text-[11px] bg-black/40 px-1.5 py-0.5 rounded text-indigo-300">JWT_SECRET</code> environment configuration mandates RS256 algorithm verification in <code className="font-mono text-[11px] text-indigo-300">jwtMiddleware.ts</code>, mismatching the HS256 secret key issued by auth authority.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                <div className="bg-white/5 p-2.5 rounded-lg border border-white/5">
                  <div className="text-[10px] text-slate-400 uppercase">Confidence Score</div>
                  <div className="text-xl font-bold text-white mt-0.5">96<span className="text-xs opacity-50">%</span></div>
                </div>
                <div className="bg-white/5 p-2.5 rounded-lg border border-white/5">
                  <div className="text-[10px] text-slate-400 uppercase">Evidence Sources</div>
                  <div className="text-xl font-bold text-white mt-0.5">07 <span className="text-xs opacity-50">pts</span></div>
                </div>
                <div className="bg-white/5 p-2.5 rounded-lg border border-white/5">
                  <div className="text-[10px] text-slate-400 uppercase">Files Impacted</div>
                  <div className="text-xl font-bold text-indigo-400 mt-0.5">03</div>
                </div>
              </div>
            </div>

            {/* Evidence Stream */}
            <div className="bg-black/30 rounded-lg p-3 border border-white/5 flex flex-col justify-between">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-2 flex items-center justify-between">
                  <span>Evidence Stream</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="space-y-1.5 text-[11px] font-mono">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <span className="opacity-40 text-white">[1]</span>
                    <span className="truncate">Scanned .env.example</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <span className="opacity-40 text-white">[2]</span>
                    <span className="truncate">Parsed jwtMiddleware.ts</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <span className="opacity-40 text-white">[3]</span>
                    <span className="truncate">Log: JWT Signature Error</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-400">
                    <span className="opacity-40 text-white">[4]</span>
                    <span className="truncate">Diff commit #a98f12c</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onStartInvestigationWithPrompt('Why is Login API returning 401 Unauthorized for valid credentials?')}
                className="mt-3 w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded transition text-center"
              >
                Inspect Case Details
              </button>
            </div>
          </div>
        </div>

        {/* Health Index Card */}
        <div className="lg:col-span-4 custom-card p-5 bg-[#121217] border border-white/10 flex flex-col items-center justify-center text-center">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90">
              <circle cx="64" cy="64" r="54" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
              <circle
                cx="64"
                cy="64"
                r="54"
                fill="none"
                stroke="#4f46e5"
                strokeWidth="8"
                strokeDasharray="339"
                strokeDashoffset={339 - (339 * project.healthScore) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-white">{project.healthScore}</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Health Score</span>
            </div>
          </div>

          <div className="mt-3 text-xs">
            <div className="font-semibold text-white">Infrastructure: <span className="text-emerald-400">Stable</span></div>
            <div className="text-[11px] text-slate-400 mt-0.5">2 critical issues indexed for review</div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 w-full text-center text-[11px] font-mono border-t border-white/5 pt-3">
            <div className="bg-white/5 p-1.5 rounded">
              <span className="text-slate-400 text-[10px] block">SERVICES</span>
              <span className="text-white font-bold">{project.stats.servicesCount} Nodes</span>
            </div>
            <div className="bg-white/5 p-1.5 rounded">
              <span className="text-slate-400 text-[10px] block">ENDPOINTS</span>
              <span className="text-indigo-400 font-bold">{project.stats.endpointsCount} Routes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Autonomous Scenarios & Quick Launch */}
      <div className="custom-card p-5 bg-[#121217] border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-widest font-bold text-amber-400">Autonomous Diagnostics</span>
            <h3 className="text-base font-bold text-white">Recommended Investigation Scenarios</h3>
          </div>
          <button
            onClick={() => onNavigateTab('investigation')}
            className="text-xs text-indigo-400 hover:underline font-bold flex items-center gap-1"
          >
            <span>Launch Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div
            onClick={() => onStartInvestigationWithPrompt('Why is Login API returning 401 Unauthorized for valid credentials?')}
            className="p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/10 cursor-pointer transition group"
          >
            <div className="flex items-center justify-between text-[11px] font-bold text-rose-400 mb-1">
              <span>CRITICAL AUTH BUG</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
            <div className="font-semibold text-xs text-white">JWT Signature 401 Mismatch</div>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
              Gateway enforces RS256 while Auth service signs using HS256 algorithm.
            </p>
          </div>

          <div
            onClick={() => onStartInvestigationWithPrompt('Why is /api/v1/payments/process experiencing high latency (4.8s)?')}
            className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 cursor-pointer transition group"
          >
            <div className="flex items-center justify-between text-[11px] font-bold text-amber-400 mb-1">
              <span>LATENCY DEGRADATION</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
            <div className="font-semibold text-xs text-white">Slow SQL Query on Payments</div>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
              Sequential table scan over 1.4M rows due to missing B-Tree index.
            </p>
          </div>

          <div
            onClick={() => onStartInvestigationWithPrompt('Why is Docker container build failing on node-alpine step?')}
            className="p-3.5 rounded-xl border border-indigo-500/30 bg-indigo-500/5 hover:bg-indigo-500/10 cursor-pointer transition group"
          >
            <div className="flex items-center justify-between text-[11px] font-bold text-indigo-400 mb-1">
              <span>CONTAINER BUILD FAILURE</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
            <div className="font-semibold text-xs text-white">Docker Multi-Stage Build Fail</div>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
              Incompatible Alpine libc libraries in multi-stage Dockerfile.
            </p>
          </div>
        </div>
      </div>

      {/* Topology Flow & Telemetry Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Architecture Topology Preview */}
        <div className="lg:col-span-8 custom-card p-5 bg-[#121217] border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Dependency Flow Architecture</span>
              <h3 className="text-sm font-bold text-white">Service & Storage Mesh</h3>
            </div>
            <button
              onClick={() => onNavigateTab('architecture')}
              className="text-[11px] text-indigo-400 uppercase font-bold hover:underline"
            >
              Open Interactive Topology
            </button>
          </div>

          <div className="my-6 flex items-center justify-center gap-4 sm:gap-6 flex-wrap font-mono text-xs">
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-lg text-indigo-300">
              Frontend Client
            </div>
            <div className="text-slate-500 font-bold">➔</div>
            <div className="p-3 bg-indigo-600 border border-indigo-400 rounded-lg text-white font-bold ring-4 ring-indigo-500/20 shadow-lg">
              API Gateway
            </div>
            <div className="text-slate-500 font-bold">➔</div>
            <div className="flex flex-col gap-2">
              <div className="p-2.5 bg-rose-500/10 border border-rose-500/40 rounded text-rose-300">
                Auth Service (401 Error)
              </div>
              <div className="p-2.5 bg-amber-500/10 border border-amber-500/40 rounded text-amber-300">
                Payment API (Slow Query)
              </div>
            </div>
            <div className="text-slate-500 font-bold">➔</div>
            <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-300">
              PostgreSQL / Redis
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-white/5 pt-3 text-xs font-mono">
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Uptime SLA</span>
              <span className="text-white font-bold">99.98%</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Avg Latency</span>
              <span className="text-rose-400 font-bold">310ms</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Throughput</span>
              <span className="text-white font-bold">1,240 req/m</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Topology Status</span>
              <span className="text-emerald-400 font-bold">Operational</span>
            </div>
          </div>
        </div>

        {/* Telemetry Chart */}
        <div className="lg:col-span-4 custom-card p-5 bg-[#121217] border border-white/10 space-y-3">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Telemetry Profile</span>
              <h3 className="text-sm font-bold text-white">Latency & Error Spikes</h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-400">
              Spike @ 12:00
            </span>
          </div>

          <div className="h-44 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={latencyChartData}>
                <defs>
                  <linearGradient id="latencyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f0f12',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
                <Area type="monotone" dataKey="latency" stroke="#6366f1" fillOpacity={1} fill="url(#latencyGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Activity Timeline & Reports Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Activity Stream */}
        <div className="lg:col-span-5 custom-card p-5 bg-[#121217] border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Recent Project Activity</h3>
            <span className="text-xs text-indigo-400 font-mono">Git & CI Sync</span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="flex items-start gap-3">
              <div className="mt-1 w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
              <div>
                <div className="font-bold text-white flex items-center gap-2">
                  <span>Commit <code className="font-mono text-indigo-400">#a98f12c</code></span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-400">BREAKING</span>
                </div>
                <div className="text-slate-400 text-[11px] mt-0.5">Enforced explicit JWT algorithm verification</div>
                <div className="text-[10px] text-indigo-400 mt-1">2 hours ago • DevOps Lead</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 w-2 h-2 rounded-full bg-rose-500 shrink-0" />
              <div>
                <div className="font-bold text-white">CI Pipeline Build Failure</div>
                <div className="text-slate-400 text-[11px] mt-0.5">Integration test suite failed on staging environment</div>
                <div className="text-[10px] text-indigo-400 mt-1">3 hours ago • GitHub Actions</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <div>
                <div className="font-bold text-white">Database Scan Completed</div>
                <div className="text-slate-400 text-[11px] mt-0.5">Scanned PostgreSQL payments table (1.4M records)</div>
                <div className="text-[10px] text-indigo-400 mt-1">5 hours ago • StackLens Profiler</div>
              </div>
            </div>
          </div>
        </div>

        {/* Saved Investigation Reports */}
        <div className="lg:col-span-7 custom-card p-5 bg-[#121217] border border-white/10 space-y-3">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Indexed AI Investigation Reports</h3>
            <button
              onClick={() => onNavigateTab('reports')}
              className="text-xs text-indigo-400 hover:underline font-bold"
            >
              View All ({recentReports.length})
            </button>
          </div>

          <div className="space-y-2.5">
            {recentReports.map((report) => (
              <div
                key={report.id}
                onClick={() => onViewReport(report)}
                className="p-3.5 rounded-xl border border-white/5 bg-white/5 hover:border-indigo-500/50 cursor-pointer transition flex items-center justify-between gap-3"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-indigo-400">{report.confidenceScore}% Confidence</span>
                    <span className="text-[10px] text-slate-400 uppercase font-mono px-2 py-0.5 bg-black/40 rounded">
                      {report.category}
                    </span>
                  </div>
                  <div className="font-semibold text-xs text-white truncate">{report.title}</div>
                  <div className="text-[11px] text-slate-400 truncate">{report.rootCause}</div>
                </div>

                <ArrowUpRight className="w-4 h-4 text-indigo-400 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

