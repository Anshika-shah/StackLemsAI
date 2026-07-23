import React, { useState } from 'react';
import { X, GitBranch, Github, Code2, Plus, Sparkles } from 'lucide-react';
import { ProjectRepository } from '../types';

interface NewRepoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProject: (project: ProjectRepository) => void;
}

export const NewRepoModal: React.FC<NewRepoModalProps> = ({
  isOpen,
  onClose,
  onAddProject,
}) => {
  const [repoUrl, setRepoUrl] = useState('https://github.com/stacklens/auth-service-go');
  const [repoName, setRepoName] = useState('auth-service-go');
  const [description, setDescription] = useState('Go-based high concurrency OAuth token authority service');
  const [provider, setProvider] = useState<'github' | 'gitlab' | 'bitbucket' | 'local'>('github');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newProject: ProjectRepository = {
      id: `proj_${Date.now()}`,
      name: repoName || 'custom-microservice',
      owner: 'stacklens-user',
      description,
      provider,
      branch: 'main',
      healthScore: 88,
      stars: 12,
      lastScannedAt: 'Just now',
      stats: {
        filesCount: 18,
        linesOfCode: 4200,
        servicesCount: 1,
        endpointsCount: 4,
        databasesCount: 1,
        openIssuesCount: 0,
      },
      languages: ['Go', 'Docker', 'PostgreSQL'],
      files: [
        {
          path: 'main.go',
          language: 'go',
          importance: 'critical',
          content: `package main\n\nimport "fmt"\n\nfunc main() {\n\tfmt.Println("Auth Service Engine Ready")\n}`,
        },
      ],
      nodes: [
        { id: 'n_1', label: repoName, type: 'service', health: 'healthy', details: 'Imported microservice node' },
      ],
      edges: [],
      commits: [
        {
          hash: 'e891a22',
          shortHash: 'e891a22',
          message: 'initial commit: setup go module',
          author: 'User',
          date: 'Just now',
          filesChanged: 2,
          insertions: 34,
          deletions: 0,
          branch: 'main',
        },
      ],
      endpoints: [
        { id: 'ep_new_1', method: 'POST', path: '/api/v1/auth/token', handlerFile: 'main.go', authRequired: false, status: 'active', avgLatencyMs: 38, callsPerMin: 120, errorRatePct: 0.1 },
      ],
      databaseTables: [
        { name: 'oauth_tokens', type: 'PostgreSQL', rowCount: 1200, sizeMb: 4, hasIndex: true, status: 'healthy' },
      ],
      dockerfiles: [{ path: 'Dockerfile', content: 'FROM golang:1.22-alpine\nWORKDIR /app\nCOPY . .\nRUN go build -o app .', status: 'ok' }],
      cicdPipelines: [{ name: 'Go Test Suite', file: '.github/workflows/go-test.yml', lastRunStatus: 'success', durationSec: 32 }],
    };

    onAddProject(newProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="custom-card w-full max-w-lg p-6 space-y-5 bg-[var(--bg-card)] border-[var(--border-color)] relative shadow-2xl animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-indigo-400">
            <GitBranch className="w-4 h-4" />
            <span>Repository Connector</span>
          </div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Connect / Import Repository</h2>
          <p className="text-xs text-[var(--text-muted)]">
            StackLens will automatically index the file tree, AST structure, Dockerfiles, and endpoints.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Provider</label>
            <div className="grid grid-cols-4 gap-2">
              {(['github', 'gitlab', 'bitbucket', 'local'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setProvider(p)}
                  className={`p-2 rounded-xl text-xs font-bold capitalize transition border ${
                    provider === p
                      ? 'border-indigo-500 bg-indigo-500/15 text-indigo-400'
                      : 'border-[var(--border-color)] bg-[var(--bg-input)] text-[var(--text-muted)]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Repository URL</label>
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              required
              className="w-full custom-input p-2.5 rounded-lg text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Repository Name</label>
            <input
              type="text"
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
              required
              className="w-full custom-input p-2.5 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full custom-input p-2.5 rounded-lg text-xs resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Connect & Index Repository</span>
          </button>
        </form>
      </div>
    </div>
  );
};
