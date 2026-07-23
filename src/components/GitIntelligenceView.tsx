import React, { useState } from 'react';
import { 
  GitCommitHorizontal, GitBranch, GitPullRequest, AlertOctagon, 
  User, Calendar, FileCode, ArrowRight, ShieldAlert, CheckCircle2
} from 'lucide-react';
import { ProjectRepository, GitCommit } from '../types';

interface GitIntelligenceViewProps {
  project: ProjectRepository;
}

export const GitIntelligenceView: React.FC<GitIntelligenceViewProps> = ({ project }) => {
  const [selectedCommit, setSelectedCommit] = useState<GitCommit | null>(project.commits[0] || null);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1">
          <GitCommitHorizontal className="w-4 h-4" />
          <span>Git Intelligence & Timeline Analysis</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          Code Evolution & Breaking Changes Detector
        </h1>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">
          Correlate bug reports directly to breaking commits, author changes, and pull requests.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Commit List */}
        <div className="custom-card p-5 space-y-3 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
            <h3 className="font-bold text-sm text-[var(--text-primary)] flex items-center space-x-2">
              <GitBranch className="w-4 h-4 text-indigo-400" />
              <span>Recent Commit History ({project.branch})</span>
            </h3>
            <span className="text-xs text-[var(--text-muted)]">{project.commits.length} commits indexed</span>
          </div>

          <div className="space-y-2">
            {project.commits.map((commit) => {
              const isSelected = selectedCommit?.hash === commit.hash;
              return (
                <div
                  key={commit.hash}
                  onClick={() => setSelectedCommit(commit)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-500/10'
                      : commit.isBreaking
                      ? 'border-rose-500/40 bg-rose-500/5 hover:border-rose-500'
                      : 'border-[var(--border-color)] bg-[var(--bg-input)] hover:border-indigo-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <div className="flex items-center space-x-2 font-mono">
                      <span className="font-bold text-indigo-400">{commit.shortHash}</span>
                      {commit.isBreaking && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 flex items-center">
                          <AlertOctagon className="w-3 h-3 mr-1" />
                          BREAKING CHANGE
                        </span>
                      )}
                    </div>
                    <span className="text-[var(--text-muted)]">{commit.date}</span>
                  </div>

                  <div className="font-medium text-sm text-[var(--text-primary)]">
                    {commit.message}
                  </div>

                  <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mt-2">
                    <span className="flex items-center space-x-1">
                      <User className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{commit.author}</span>
                    </span>
                    <span>
                      {commit.filesChanged} files changed • <span className="text-emerald-400">+{commit.insertions}</span> <span className="text-rose-400">-{commit.deletions}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Commit Breakdown */}
        <div className="custom-card p-5 space-y-4">
          {selectedCommit ? (
            <div className="space-y-4">
              <div className="border-b border-[var(--border-color)] pb-3">
                <span className="text-xs font-mono text-indigo-400 font-bold">Commit {selectedCommit.hash}</span>
                <h3 className="font-bold text-base text-[var(--text-primary)] mt-1">{selectedCommit.message}</h3>
                <div className="text-xs text-[var(--text-muted)] mt-1">
                  Authored by <span className="font-semibold text-slate-200">{selectedCommit.author}</span>
                </div>
              </div>

              {selectedCommit.isBreaking && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs space-y-1">
                  <div className="font-bold flex items-center space-x-1">
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    <span>StackLens Intelligence Warning</span>
                  </div>
                  <p>
                    This commit modified security verification parameters in jwtMiddleware.ts. Correlates directly with recent 401 login issue.
                  </p>
                </div>
              )}

              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Affected Components</span>
                <div className="space-y-1.5 mt-2">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 flex items-center justify-between">
                    <span>src/auth/jwtMiddleware.ts</span>
                    <span className="text-rose-400 font-bold">+12 -4</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 flex items-center justify-between">
                    <span>.env.example</span>
                    <span className="text-emerald-400 font-bold">+2 -0</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-[var(--text-muted)] text-sm">
              Select a commit to view diff details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
