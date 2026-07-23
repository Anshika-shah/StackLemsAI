import React, { useState } from 'react';
import { 
  Container, Layers, AlertCircle, CheckCircle2, Terminal, 
  FileCode, Cpu, ShieldCheck, Play, ArrowRight, RefreshCw
} from 'lucide-react';
import { ProjectRepository } from '../types';

interface DockerCicdViewProps {
  project: ProjectRepository;
}

export const DockerCicdView: React.FC<DockerCicdViewProps> = ({ project }) => {
  const [activeTab, setActiveTab] = useState<'docker' | 'cicd'>('docker');

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1">
          <Container className="w-4 h-4" />
          <span>Docker & CI/CD Pipeline Investigator</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          Containerization & Build Failure Debugger
        </h1>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">
          Scan Dockerfiles, docker-compose.yml, and GitHub Actions build steps for environment conflicts or image layer mismatches.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-[var(--border-color)] pb-2">
        <button
          onClick={() => setActiveTab('docker')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
            activeTab === 'docker'
              ? 'bg-indigo-600 text-white'
              : 'bg-[var(--bg-input)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Container className="w-4 h-4" />
          <span>Dockerfile & Compose ({project.dockerfiles.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('cicd')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
            activeTab === 'cicd'
              ? 'bg-indigo-600 text-white'
              : 'bg-[var(--bg-input)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>GitHub Actions Pipelines ({project.cicdPipelines.length})</span>
        </button>
      </div>

      {/* Docker View */}
      {activeTab === 'docker' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {project.dockerfiles.map((file, i) => (
            <div key={i} className="custom-card p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                <div className="flex items-center space-x-2 font-mono text-sm font-bold text-indigo-400">
                  <FileCode className="w-4 h-4" />
                  <span>{file.path}</span>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                  Syntax Verified
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 font-mono text-xs text-slate-300 border border-slate-800 overflow-x-auto max-h-72">
                <pre>{file.content}</pre>
              </div>

              <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300">
                <span className="font-bold">Layer Recommendation:</span> Multi-stage build configured properly using Node 20 Alpine image. Reduces image size by 68%.
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CI/CD View */}
      {activeTab === 'cicd' && (
        <div className="space-y-4">
          {project.cicdPipelines.map((pipe, i) => (
            <div key={i} className="custom-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-[var(--text-primary)]">{pipe.name}</h3>
                  <div className="text-xs text-[var(--text-muted)] font-mono">{pipe.file}</div>
                </div>

                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
                    pipe.lastRunStatus === 'success'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-rose-500/20 text-rose-400'
                  }`}
                >
                  Last Run: {pipe.lastRunStatus} ({pipe.durationSec}s)
                </span>
              </div>

              {pipe.lastRunStatus === 'failure' && (
                <div className="p-4 rounded-xl bg-slate-950 border border-rose-500/30 text-xs font-mono text-rose-300 space-y-2">
                  <div className="font-bold text-rose-400 flex items-center space-x-1.5">
                    <AlertCircle className="w-4 h-4" />
                    <span>Failed Step: Integration Test Suite (JWT Token Auth)</span>
                  </div>
                  <p className="text-slate-400">
                    FAIL src/auth/jwtMiddleware.test.ts
                    <br />
                    Expected token algorithm RS256 but received HS256 algorithm.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
