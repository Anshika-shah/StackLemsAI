import React, { useState } from 'react';
import { 
  Search, Shield, Bell, User, Sparkles, Moon, Sun, 
  ChevronDown, Check, GitBranch, Terminal, RefreshCw, LogIn, LogOut, UserPlus, UserCheck,
  FolderGit2, Key, Sliders, Palette, Building, Keyboard, HelpCircle, ArrowRight,
  CheckCircle2, AlertTriangle, ShieldAlert
} from 'lucide-react';
import { UserProfile, ProjectRepository, NotificationItem } from '../types';
import { ActiveTab } from './Sidebar';

interface NavbarProps {
  currentUser: UserProfile;
  isLoggedIn: boolean;
  projects: ProjectRepository[];
  activeProject: ProjectRepository;
  onSelectProject: (proj: ProjectRepository) => void;
  onOpenNewInvestigation: () => void;
  onOpenAuth: (initialTab?: 'login' | 'register') => void;
  onLogout: () => void;
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
  onMarkAllNotificationsRead: () => void;
  onOpenNewRepoModal: () => void;
  onOpenCommandPalette: () => void;
  onOpenShortcuts: () => void;
  onOpenHelp: () => void;
  onNavigateTab: (tab: ActiveTab) => void;
  onStartInvestigationWithPrompt?: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  isLoggedIn,
  projects,
  activeProject,
  onSelectProject,
  onOpenNewInvestigation,
  onOpenAuth,
  onLogout,
  notifications,
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
  onOpenNewRepoModal,
  onOpenCommandPalette,
  onOpenShortcuts,
  onOpenHelp,
  onNavigateTab,
  onStartInvestigationWithPrompt,
}) => {
  const [showProjMenu, setShowProjMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Recently opened repositories tracking
  const [recentRepoIds, setRecentRepoIds] = useState<string[]>(() => {
    return [activeProject.id, ...projects.filter((p) => p.id !== activeProject.id).map((p) => p.id)];
  });

  const handleSwitchProject = (proj: ProjectRepository) => {
    onSelectProject(proj);
    setRecentRepoIds((prev) => [proj.id, ...prev.filter((id) => id !== proj.id)]);
    setShowProjMenu(false);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'investigation':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
      case 'security':
        return <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />;
      case 'build':
        return <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />;
      default:
        return <Bell className="w-4 h-4 text-indigo-400 shrink-0" />;
    }
  };

  return (
    <header className="h-16 border-b border-[var(--border-color)] bg-[var(--bg-surface)] px-4 flex items-center justify-between sticky top-0 z-30 shadow-xs selection:bg-indigo-500/30">
      {/* Brand & Smart Repository Selector */}
      <div className="flex items-center space-x-4">
        <div 
          onClick={() => onNavigateTab('dashboard')} 
          className="flex items-center space-x-2.5 cursor-pointer select-none group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-emerald-500 flex items-center justify-center shadow-md text-white font-black text-lg tracking-wider group-hover:scale-105 transition-transform">
            S
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 bg-clip-text text-transparent">
              StackLens<span className="text-[var(--text-primary)] font-normal ml-1">AI</span>
            </span>
            <div className="text-[10px] text-[var(--text-muted)] tracking-widest uppercase font-semibold">
              Autonomous Investigation Platform
            </div>
          </div>
        </div>

        <div className="h-6 w-px bg-[var(--border-color)] hidden md:block" />

        {/* Smart Repository Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProjMenu(!showProjMenu);
              setShowNotifMenu(false);
              setShowUserMenu(false);
            }}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-input)] hover:border-indigo-500/50 transition text-xs font-semibold"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
            <span className="max-w-[140px] truncate">{activeProject.name}</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 hidden sm:inline">
              Indexed
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          </button>

          {showProjMenu && (
            <div className="absolute left-0 mt-2 w-80 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-2xl py-2 z-50 animate-fadeIn divide-y divide-[var(--border-color)]">
              {/* Current Active Repository */}
              <div className="p-3 bg-indigo-500/5">
                <div className="text-[10px] font-extrabold uppercase text-[var(--text-muted)] tracking-wider mb-1.5">
                  Current Repository
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs text-[var(--text-primary)] flex items-center space-x-1.5">
                      <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{activeProject.name}</span>
                    </div>
                    <div className="text-[10px] text-[var(--text-muted)] mt-0.5">
                      {activeProject.stats.filesCount} files • Health: <span className="font-bold text-emerald-400">{activeProject.healthScore}%</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                    Indexed
                  </span>
                </div>
              </div>

              {/* Recently Opened Repositories */}
              <div className="p-2 space-y-1">
                <div className="px-2 pt-1 text-[10px] font-extrabold uppercase text-[var(--text-muted)] tracking-wider">
                  Recent Repositories
                </div>
                {projects.map((proj) => {
                  const isCurrent = proj.id === activeProject.id;
                  return (
                    <button
                      key={proj.id}
                      onClick={() => handleSwitchProject(proj)}
                      className={`w-full p-2 rounded-xl text-left text-xs flex items-center justify-between transition ${
                        isCurrent ? 'bg-indigo-600/10 font-bold text-indigo-400' : 'hover:bg-indigo-500/10 text-[var(--text-primary)]'
                      }`}
                    >
                      <div className="truncate space-y-0.5">
                        <div className="truncate flex items-center space-x-2">
                          <span className="truncate">{proj.name}</span>
                          <span className="text-[9px] font-mono px-1 rounded bg-slate-200 dark:bg-slate-800 text-[var(--text-muted)]">
                            {proj.languages[0]}
                          </span>
                        </div>
                        <div className="text-[10px] text-[var(--text-muted)] flex items-center space-x-2">
                          <span>Score: {proj.healthScore}%</span>
                          <span>•</span>
                          <span>Synced 10m ago</span>
                        </div>
                      </div>
                      {isCurrent && <Check className="w-4 h-4 text-indigo-400 shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>

              {/* Connect Repository Trigger */}
              <div className="pt-2 px-2 pb-1">
                <button
                  onClick={() => {
                    setShowProjMenu(false);
                    onOpenNewRepoModal();
                  }}
                  className="w-full py-2 px-3 rounded-xl text-xs font-bold text-indigo-400 hover:text-white bg-indigo-500/10 hover:bg-indigo-600 transition flex items-center justify-center space-x-2"
                >
                  <span>+ Connect Repository</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Center Search Trigger (Command Palette Trigger) */}
      <div className="hidden lg:flex items-center flex-1 max-w-xs mx-6">
        <button
          onClick={onOpenCommandPalette}
          className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-input)] hover:border-indigo-500/50 transition text-xs text-[var(--text-muted)]"
        >
          <div className="flex items-center space-x-2">
            <Search className="w-3.5 h-3.5 text-indigo-400" />
            <span>Search or type command...</span>
          </div>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[10px] font-mono font-bold">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Global Actions: Investigate, Notifications, User Menu */}
      <div className="flex items-center space-x-2.5">
        {/* Mobile Search Button */}
        <button
          onClick={onOpenCommandPalette}
          className="lg:hidden p-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-input)] hover:border-indigo-500/50 transition text-[var(--text-primary)]"
          title="Command Palette (Ctrl + K)"
        >
          <Search className="w-4 h-4 text-indigo-400" />
        </button>

        {/* Investigate Issue Button */}
        <button
          onClick={onOpenNewInvestigation}
          className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-md transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span className="hidden sm:inline">Investigate Issue</span>
        </button>

        {/* Notification Center */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifMenu(!showNotifMenu);
              setShowProjMenu(false);
              setShowUserMenu(false);
            }}
            className="p-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-input)] hover:border-indigo-500/50 transition relative text-[var(--text-primary)]"
            title="Notifications"
          >
            <Bell className="w-4 h-4 text-[var(--text-primary)]" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center animate-pulse shadow-sm">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-88 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-2xl py-2 z-50 animate-fadeIn">
              <div className="px-4 py-2 border-b border-[var(--border-color)] flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="font-extrabold text-xs uppercase tracking-wider text-[var(--text-primary)]">
                    Notifications Center
                  </span>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={onMarkAllNotificationsRead}
                    className="text-[11px] font-bold text-indigo-400 hover:underline"
                  >
                    Mark All Read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-[var(--border-color)]">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => onMarkNotificationRead(n.id)}
                    className={`p-3.5 hover:bg-indigo-500/5 transition text-xs space-y-1.5 cursor-pointer ${
                      n.read ? 'opacity-60 bg-[var(--bg-surface)]' : 'bg-indigo-500/5'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        {getNotificationIcon(n.type)}
                        <span className="font-bold text-[var(--text-primary)]">{n.title}</span>
                      </div>
                      <span className="text-[10px] font-mono text-[var(--text-muted)] shrink-0">{n.timestamp}</span>
                    </div>

                    <p className="text-[var(--text-muted)] text-[11px] leading-relaxed pl-6">
                      {n.message}
                    </p>

                    <div className="pl-6 pt-1 flex items-center justify-between">
                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400">
                        {n.type}
                      </span>

                      {onStartInvestigationWithPrompt && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onMarkNotificationRead(n.id);
                            onStartInvestigationWithPrompt(`Investigate notification alert: ${n.title}`);
                            setShowNotifMenu(false);
                          }}
                          className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
                        >
                          <span>Investigate</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-2 border-t border-[var(--border-color)] text-center">
                <button
                  onClick={() => {
                    setShowNotifMenu(false);
                    onNavigateTab('reports');
                  }}
                  className="text-xs font-bold text-indigo-400 hover:underline"
                >
                  View All Notifications & Reports →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          {isLoggedIn ? (
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowProjMenu(false);
                setShowNotifMenu(false);
              }}
              className="flex items-center space-x-2 pl-2 pr-2.5 py-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-input)] hover:border-indigo-500/50 transition text-xs font-semibold"
            >
              <img src={currentUser.avatar} alt={currentUser.name} className="w-6 h-6 rounded-full object-cover ring-1 ring-indigo-500" />
              <span className="font-bold max-w-[90px] truncate hidden md:inline">{currentUser.name}</span>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 hidden lg:inline">
                {currentUser.role.replace('_', ' ')}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            </button>
          ) : (
            <button
              onClick={() => onOpenAuth('login')}
              className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

          {/* User Profile Dropdown Menu */}
          {showUserMenu && isLoggedIn && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-2xl py-2 z-50 animate-fadeIn text-xs">
              {/* Profile Summary Header */}
              <div 
                onClick={() => {
                  setShowUserMenu(false);
                  onNavigateTab('profile');
                }}
                className="px-3.5 py-2.5 border-b border-[var(--border-color)] space-y-1 cursor-pointer hover:bg-indigo-500/5 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[var(--text-primary)] truncate">{currentUser.name}</span>
                  <span className="flex items-center space-x-1 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Active</span>
                  </span>
                </div>
                <div className="text-[11px] text-[var(--text-muted)] truncate">{currentUser.email}</div>
              </div>

              {/* Enterprise Dropdown Items */}
              <div className="py-1">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onNavigateTab('profile');
                  }}
                  className="w-full px-3.5 py-2 text-left hover:bg-indigo-500/10 flex items-center space-x-2.5 font-medium transition"
                >
                  <User className="w-3.5 h-3.5 text-indigo-400" />
                  <span>👤 My Profile</span>
                </button>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onOpenNewRepoModal();
                  }}
                  className="w-full px-3.5 py-2 text-left hover:bg-indigo-500/10 flex items-center space-x-2.5 font-medium transition"
                >
                  <FolderGit2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>📂 Connected Repositories</span>
                </button>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onNavigateTab('settings');
                  }}
                  className="w-full px-3.5 py-2 text-left hover:bg-indigo-500/10 flex items-center space-x-2.5 font-medium transition"
                >
                  <Key className="w-3.5 h-3.5 text-amber-400" />
                  <span>🔑 API Keys</span>
                </button>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onNavigateTab('settings');
                  }}
                  className="w-full px-3.5 py-2 text-left hover:bg-indigo-500/10 flex items-center space-x-2.5 font-medium transition"
                >
                  <Bell className="w-3.5 h-3.5 text-emerald-400" />
                  <span>🔔 Notification Preferences</span>
                </button>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onNavigateTab('settings');
                  }}
                  className="w-full px-3.5 py-2 text-left hover:bg-indigo-500/10 flex items-center space-x-2.5 font-medium transition"
                >
                  <Palette className="w-3.5 h-3.5 text-rose-400" />
                  <span>🎨 Theme & Personalization</span>
                </button>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onNavigateTab('settings');
                  }}
                  className="w-full px-3.5 py-2 text-left hover:bg-indigo-500/10 flex items-center space-x-2.5 font-medium transition"
                >
                  <Building className="w-3.5 h-3.5 text-indigo-400" />
                  <span>🏢 Workspace Settings</span>
                </button>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onOpenShortcuts();
                  }}
                  className="w-full px-3.5 py-2 text-left hover:bg-indigo-500/10 flex items-center space-x-2.5 font-medium transition"
                >
                  <Keyboard className="w-3.5 h-3.5 text-purple-400" />
                  <span>⌨ Keyboard Shortcuts</span>
                </button>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onOpenHelp();
                  }}
                  className="w-full px-3.5 py-2 text-left hover:bg-indigo-500/10 flex items-center space-x-2.5 font-medium transition"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>❓ Help & Documentation</span>
                </button>
              </div>

              {/* Logout Option */}
              <div className="border-t border-[var(--border-color)] pt-1 mt-1">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onLogout();
                  }}
                  className="w-full px-3.5 py-2 text-left font-bold text-rose-400 hover:bg-rose-500/10 flex items-center space-x-2.5 transition"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  <span>🚪 Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
