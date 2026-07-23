import React, { useState } from 'react';
import { 
  Database, Server, Zap, AlertTriangle, CheckCircle2, 
  ArrowUpRight, Clock, Activity, Search
} from 'lucide-react';
import { ProjectRepository } from '../types';

interface ApiDbProfilerViewProps {
  project: ProjectRepository;
}

export const ApiDbProfilerView: React.FC<ApiDbProfilerViewProps> = ({ project }) => {
  const [activeTab, setActiveTab] = useState<'api' | 'db'>('api');

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1">
          <Database className="w-4 h-4" />
          <span>API & Database Performance Profiler</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          Endpoint Latency & Database Index Inspector
        </h1>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">
          Monitor response times, error rates, slow queries, and missing database indexes.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-[var(--border-color)] pb-2">
        <button
          onClick={() => setActiveTab('api')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
            activeTab === 'api'
              ? 'bg-indigo-600 text-white'
              : 'bg-[var(--bg-input)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>REST API Endpoints ({project.endpoints.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('db')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
            activeTab === 'db'
              ? 'bg-indigo-600 text-white'
              : 'bg-[var(--bg-input)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Database Tables ({project.databaseTables.length})</span>
        </button>
      </div>

      {/* API Endpoints View */}
      {activeTab === 'api' && (
        <div className="custom-card overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[var(--bg-input)] text-[var(--text-muted)] uppercase tracking-wider font-semibold border-b border-[var(--border-color)]">
              <tr>
                <th className="p-3.5">Method & Path</th>
                <th className="p-3.5">Handler File</th>
                <th className="p-3.5">Avg Latency</th>
                <th className="p-3.5">Throughput</th>
                <th className="p-3.5">Error Rate</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {project.endpoints.map((ep) => (
                <tr key={ep.id} className="hover:bg-indigo-500/5 transition font-mono">
                  <td className="p-3.5">
                    <span
                      className={`font-bold px-2 py-0.5 rounded text-[10px] mr-2 ${
                        ep.method === 'GET'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : ep.method === 'POST'
                          ? 'bg-indigo-500/20 text-indigo-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {ep.method}
                    </span>
                    <span className="font-semibold text-[var(--text-primary)]">{ep.path}</span>
                  </td>
                  <td className="p-3.5 text-[var(--text-muted)]">{ep.handlerFile}</td>
                  <td className={`p-3.5 font-bold ${ep.avgLatencyMs > 1000 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {ep.avgLatencyMs} ms
                  </td>
                  <td className="p-3.5 text-[var(--text-primary)]">{ep.callsPerMin} req/min</td>
                  <td className={`p-3.5 font-bold ${ep.errorRatePct > 5 ? 'text-rose-400' : 'text-slate-400'}`}>
                    {ep.errorRatePct}%
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        ep.status === 'failing'
                          ? 'bg-rose-500/20 text-rose-400'
                          : 'bg-emerald-500/20 text-emerald-400'
                      }`}
                    >
                      {ep.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Database Tables View */}
      {activeTab === 'db' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {project.databaseTables.map((db, i) => (
            <div key={i} className="custom-card p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                <div>
                  <div className="text-xs text-[var(--text-muted)] font-mono">{db.type}</div>
                  <h3 className="font-bold text-base text-[var(--text-primary)]">{db.name}</h3>
                </div>

                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded ${
                    db.status === 'slow_queries'
                      ? 'bg-rose-500/20 text-rose-400'
                      : 'bg-emerald-500/20 text-emerald-400'
                  }`}
                >
                  {db.status.replace('_', ' ')}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded bg-[var(--bg-input)]">
                  <div className="text-[var(--text-muted)]">Record Count</div>
                  <div className="font-bold text-[var(--text-primary)] mt-0.5">{(db.rowCount / 1000).toFixed(0)}k rows</div>
                </div>
                <div className="p-2.5 rounded bg-[var(--bg-input)]">
                  <div className="text-[var(--text-muted)]">Table Size</div>
                  <div className="font-bold text-[var(--text-primary)] mt-0.5">{db.sizeMb} MB</div>
                </div>
                <div className="p-2.5 rounded bg-[var(--bg-input)]">
                  <div className="text-[var(--text-muted)]">Index Status</div>
                  <div className={`font-bold mt-0.5 ${db.hasIndex ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {db.hasIndex ? 'Indexed' : 'Missing Index'}
                  </div>
                </div>
              </div>

              {db.slowQueryText && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-amber-300 space-y-1">
                  <div className="font-bold text-amber-400 flex items-center space-x-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Slow Query Log (4.8s Execution Time)</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900 text-slate-300 overflow-x-auto">
                    <code>{db.slowQueryText}</code>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
