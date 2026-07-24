import React from 'react';
import { 
  LayoutDashboard, SearchCode, GitFork, GitCommitHorizontal, 
  Container, Database, ShieldAlert, FileText, Bot, Settings,
  User, Zap
} from 'lucide-react';
import { ProjectRepository } from '../types';

export type ActiveTab = 
  | 'dashboard' 
  | 'investigation' 
  | 'architecture' 
  | 'git' 
  | 'docker_cicd' 
  | 'api_db' 
  | 'quality' 
  | 'reports' 
  | 'chat' 
  | 'settings'
  | 'profile';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  activeProject: ProjectRepository;
}

interface MenuSection {
  title: string;
  items: {
    id: ActiveTab;
    label: string;
    icon: React.FC<{ className?: string }>;
    badge?: string;
  }[];
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, activeProject }) => {
  const sections: MenuSection[] = [
    {
      title: 'OVERVIEW',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'investigation', label: 'Investigation Studio', icon: SearchCode, badge: 'AI' },
      ],
    },
    {
      title: 'ANALYSIS',
      items: [
        { id: 'architecture', label: 'Architecture Map', icon: GitFork },
        { id: 'git', label: 'Git Intelligence', icon: GitCommitHorizontal },
        { id: 'docker_cicd', label: 'Docker & CI/CD', icon: Container },
        { id: 'api_db', label: 'API & Database', icon: Database },
        { id: 'quality', label: 'Quality & Security', icon: ShieldAlert },
      ],
    },
    {
      title: 'AI',
      items: [
        { id: 'chat', label: 'Engineering Copilot', icon: Bot, badge: 'Agent' },
        { id: 'reports', label: 'Reports Archive', icon: FileText },
      ],
    },
    {
      title: 'SETTINGS',
      items: [
        { id: 'profile', label: 'My Profile', icon: User },
        { id: 'settings', label: 'Workspace Settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside className="w-64 border-r border-[var(--border-color)] bg-[var(--bg-surface)] flex flex-col justify-between shrink-0 hidden md:flex selection:bg-indigo-500/30">
      {/* Navigation Links Grouped into Sections */}
      <div className="p-3 space-y-4 overflow-y-auto">
        {sections.map((sec, sIdx) => (
          <div key={sIdx} className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-extrabold tracking-wider uppercase text-[var(--text-muted)] opacity-80">
              {sec.title}
            </div>
            {sec.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium text-xs transition-all duration-200 group ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 font-bold'
                      : 'text-[var(--text-muted)] hover:bg-indigo-500/10 hover:text-[var(--text-primary)]'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-indigo-400 group-hover:text-indigo-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                      isActive ? 'bg-white/20 text-white' : 'bg-indigo-500/20 text-indigo-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Repository Status Footer Widget */}
      <div className="p-3 border-t border-[var(--border-color)]">
        <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-2xs hover:border-indigo-500/30 transition">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-[var(--text-muted)] font-medium text-[11px]">Health Index</span>
            <span className={`font-bold text-xs ${activeProject.healthScore > 80 ? 'text-emerald-500' : 'text-amber-500'}`}>
              {activeProject.healthScore}/100
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mb-2">
            <div
              className={`h-full transition-all duration-500 ${
                activeProject.healthScore > 80 ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
              style={{ width: `${activeProject.healthScore}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)]">
            <span>{activeProject.stats.endpointsCount} Endpoints</span>
            <span>{activeProject.stats.servicesCount} Services</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
