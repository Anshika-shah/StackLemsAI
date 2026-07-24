import React, { useState, useEffect } from 'react';
import { 
  Search, SearchCode, GitFork, GitCommitHorizontal, Container, Database, 
  ShieldAlert, FileText, Bot, Settings, User, Sparkles, X, ChevronRight,
  GitBranch, ArrowRight
} from 'lucide-react';
import { ProjectRepository, InvestigationReport } from '../types';
import { ActiveTab } from './Sidebar';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: ActiveTab) => void;
  onStartInvestigation: (query: string) => void;
  projects: ProjectRepository[];
  activeProject: ProjectRepository;
  onSelectProject: (proj: ProjectRepository) => void;
  recentReports: InvestigationReport[];
  onViewReport: (report: InvestigationReport) => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onStartInvestigation,
  projects,
  activeProject,
  onSelectProject,
  recentReports,
  onViewReport,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setQuery('');
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickNavItems: { id: ActiveTab; title: string; category: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', title: 'Go to Dashboard', category: 'Navigation', icon: Search },
    { id: 'investigation', title: 'Open AI Investigation Studio', category: 'Navigation', icon: SearchCode },
    { id: 'architecture', title: 'View Architecture & Graph', category: 'Navigation', icon: GitFork },
    { id: 'git', title: 'Explore Git Intelligence', category: 'Navigation', icon: GitCommitHorizontal },
    { id: 'docker_cicd', title: 'Inspect Docker & CI/CD', category: 'Navigation', icon: Container },
    { id: 'api_db', title: 'Profile API & Database', category: 'Navigation', icon: Database },
    { id: 'quality', title: 'Code Quality & Security Scan', category: 'Navigation', icon: ShieldAlert },
    { id: 'reports', title: 'View Reports Archive', category: 'Navigation', icon: FileText },
    { id: 'chat', title: 'Chat with Engineering Copilot', category: 'Navigation', icon: Bot },
    { id: 'profile', title: 'View My Profile', category: 'Navigation', icon: User },
    { id: 'settings', title: 'Workspace Settings & Theme', category: 'Navigation', icon: Settings },
  ];

  const quickPrompts = [
    { title: 'Investigate Login API returning 401 Unauthorized', prompt: 'Why is Login API returning 401 Unauthorized?' },
    { title: 'Find JWT authentication middleware implementation', prompt: 'Where is JWT authentication middleware implemented?' },
    { title: 'Inspect payment processing query latency (4.8s)', prompt: 'Why is payment processing query experiencing 4.8s latency?' },
    { title: 'Explain authentication and token verification flow', prompt: 'Explain the authentication flow in this repository' },
    { title: 'Inspect Docker build failure on node-alpine step', prompt: 'Why is Docker container build failing?' },
    { title: 'Audit API endpoints for security vulnerabilities', prompt: 'Audit API endpoints for security vulnerabilities' },
  ];

  const filteredNav = quickNavItems.filter((i) =>
    i.title.toLowerCase().includes(query.toLowerCase())
  );

  const filteredPrompts = quickPrompts.filter((p) =>
    p.title.toLowerCase().includes(query.toLowerCase())
  );

  const filteredProjects = projects.filter((pr) =>
    pr.name.toLowerCase().includes(query.toLowerCase())
  );

  const filteredReports = recentReports.filter((r) =>
    r.title.toLowerCase().includes(query.toLowerCase()) || r.query.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelectTab = (tab: ActiveTab) => {
    onNavigateTab(tab);
    onClose();
  };

  const handleRunInvestigation = (prompt: string) => {
    onStartInvestigation(prompt);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-start justify-center pt-20 p-4 animate-fadeIn">
      <div className="custom-card w-full max-w-2xl bg-[var(--bg-card)] border-[var(--border-color)] shadow-2xl overflow-hidden rounded-2xl flex flex-col max-h-[80vh]">
        {/* Search Bar Input Header */}
        <div className="p-4 border-b border-[var(--border-color)] flex items-center space-x-3 bg-[var(--bg-input)]">
          <Search className="w-5 h-5 text-indigo-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, search code, investigate issue, or navigate..."
            className="w-full bg-transparent border-none text-sm font-medium focus:outline-none text-[var(--text-primary)] placeholder-[var(--text-muted)]"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]">
              Clear
            </button>
          )}
          <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[10px] font-mono font-semibold text-[var(--text-muted)] border border-[var(--border-color)]">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-3 space-y-4 text-xs divide-y divide-[var(--border-color)]">
          {/* Autonomous Investigation Scenarios */}
          {(filteredPrompts.length > 0 || !query) && (
            <div className="space-y-1.5">
              <div className="px-2 pt-1 text-[10px] uppercase font-bold tracking-wider text-indigo-400 flex items-center space-x-1.5">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                <span>AI Investigation Commands</span>
              </div>
              {filteredPrompts.slice(0, 4).map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleRunInvestigation(p.prompt)}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-indigo-500/10 flex items-center justify-between transition group border border-transparent hover:border-indigo-500/20"
                >
                  <div className="flex items-center space-x-2.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span className="font-semibold text-[var(--text-primary)] group-hover:text-indigo-400">
                      {p.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-indigo-400 opacity-0 group-hover:opacity-100 transition flex items-center space-x-1">
                    <span>Investigate</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Connected Repositories */}
          {(filteredProjects.length > 0 || !query) && (
            <div className="pt-3 space-y-1.5">
              <div className="px-2 text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)] flex items-center space-x-1.5">
                <GitBranch className="w-3 h-3 text-indigo-400" />
                <span>Repositories</span>
              </div>
              {filteredProjects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    onSelectProject(p);
                    onClose();
                  }}
                  className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between transition border ${
                    p.id === activeProject.id
                      ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 font-bold'
                      : 'border-transparent hover:bg-indigo-500/5 text-[var(--text-primary)]'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <GitBranch className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-[10px] text-[var(--text-muted)]">
                        {p.stats.filesCount} files • Health: {p.healthScore}%
                      </div>
                    </div>
                  </div>
                  {p.id === activeProject.id ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400">Active</span>
                  ) : (
                    <span className="text-[10px] text-[var(--text-muted)]">Switch ➔</span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Quick Navigation Items */}
          <div className="pt-3 space-y-1.5">
            <div className="px-2 text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)]">
              System Views & Modules
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              {filteredNav.map((nav) => {
                const Icon = nav.icon;
                return (
                  <button
                    key={nav.id}
                    onClick={() => handleSelectTab(nav.id)}
                    className="text-left p-2.5 rounded-xl hover:bg-indigo-500/10 flex items-center justify-between transition group border border-transparent hover:border-indigo-500/20"
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon className="w-3.5 h-3.5 text-indigo-400 group-hover:text-indigo-500" />
                      <span className="font-medium text-[var(--text-primary)]">{nav.title}</span>
                    </div>
                    <ChevronRight className="w-3 h-3 text-[var(--text-muted)] group-hover:text-indigo-400 transition" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recent Reports */}
          {filteredReports.length > 0 && (
            <div className="pt-3 space-y-1.5">
              <div className="px-2 text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)] flex items-center space-x-1.5">
                <FileText className="w-3 h-3 text-indigo-400" />
                <span>Recent Reports</span>
              </div>
              {filteredReports.slice(0, 3).map((rep) => (
                <button
                  key={rep.id}
                  onClick={() => {
                    onViewReport(rep);
                    onClose();
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-indigo-500/10 flex items-center justify-between transition group"
                >
                  <div className="truncate">
                    <div className="font-semibold text-[var(--text-primary)] truncate">{rep.title}</div>
                    <div className="text-[10px] text-[var(--text-muted)] truncate">{rep.rootCause}</div>
                  </div>
                  <span className="text-[10px] text-indigo-400 font-bold shrink-0 ml-2">{rep.confidenceScore}%</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-[var(--border-color)] bg-[var(--bg-input)] flex items-center justify-between text-[11px] text-[var(--text-muted)]">
          <div className="flex items-center space-x-3">
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[10px]">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[10px]">K</kbd> anytime</span>
          </div>
          <span>StackLens AI Command Palette</span>
        </div>
      </div>
    </div>
  );
};
