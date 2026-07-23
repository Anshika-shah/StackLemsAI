import React from 'react';
import { 
  ShieldAlert, AlertTriangle, CheckCircle2, FileCode, Zap, 
  Trash2, GitFork, ArrowRight
} from 'lucide-react';
import { ProjectRepository } from '../types';

interface CodeQualityViewProps {
  project: ProjectRepository;
}

export const CodeQualityView: React.FC<CodeQualityViewProps> = ({ project }) => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1">
          <ShieldAlert className="w-4 h-4" />
          <span>Code Quality & Security Auditor</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          Code Smells, Dead Code & Security Audit
        </h1>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">
          Automated static analysis scanning for dead code, circular imports, complexity spikes, and key exposure vulnerabilities.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="custom-card p-4">
          <div className="text-xs text-[var(--text-muted)] font-medium">Quality Score</div>
          <div className="text-2xl font-bold mt-1 text-emerald-400">84 / 100</div>
          <div className="text-[11px] text-slate-400 mt-1">Passing standard thresholds</div>
        </div>
        <div className="custom-card p-4">
          <div className="text-xs text-[var(--text-muted)] font-medium">Dead Files Detected</div>
          <div className="text-2xl font-bold mt-1 text-amber-400">2 files</div>
          <div className="text-[11px] text-slate-400 mt-1">Unused exports in src/legacy/</div>
        </div>
        <div className="custom-card p-4">
          <div className="text-xs text-[var(--text-muted)] font-medium">Security Smells</div>
          <div className="text-2xl font-bold mt-1 text-rose-400">1 Warning</div>
          <div className="text-[11px] text-rose-400 mt-1">Algorithm mismatch in Auth</div>
        </div>
      </div>

      <div className="custom-card p-5 space-y-4">
        <h3 className="font-bold text-sm text-[var(--text-primary)]">Code Quality Audit Findings</h3>

        <div className="space-y-3">
          <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/5 flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold text-rose-400">
                <ShieldAlert className="w-4 h-4" />
                <span>SECURITY SWELL: Hardcoded JWT Algorithm Requirement</span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                src/auth/jwtMiddleware.ts mandates RS256 algorithm signature verification, rejecting valid HS256 tokens issued by Auth Service.
              </p>
            </div>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-400">
              HIGH IMPACT
            </span>
          </div>

          <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold text-amber-400">
                <AlertTriangle className="w-4 h-4" />
                <span>DEAD CODE: Unreferenced Module</span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                src/legacy/oldTokenUtils.ts is no longer imported anywhere in the project graph. Safe to delete.
              </p>
            </div>
            <button className="text-xs text-amber-400 hover:underline flex items-center space-x-1 font-semibold">
              <Trash2 className="w-3.5 h-3.5" />
              <span>Safe Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
