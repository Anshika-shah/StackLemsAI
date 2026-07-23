import React, { useState } from 'react';
import { 
  Search, Shield, Bell, User, Sparkles, Moon, Sun, 
  ChevronDown, Check, GitBranch, Terminal, RefreshCw, LogIn, LogOut, UserPlus, UserCheck
} from 'lucide-react';
import { UserProfile, ProjectRepository, NotificationItem } from '../types';

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
  onOpenNewRepoModal: () => void;
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
  onOpenNewRepoModal,
}) => {
  const [showProjMenu, setShowProjMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="h-16 border-b border-[var(--border-color)] bg-[var(--bg-surface)] px-4 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Brand & Project Selector */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2.5 cursor-pointer select-none">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-emerald-500 flex items-center justify-center shadow-md text-white font-black text-lg tracking-wider">
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

        {/* Project Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProjMenu(!showProjMenu);
              setShowNotifMenu(false);
              setShowUserMenu(false);
            }}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-input)] hover:bg-slate-200 dark:hover:bg-slate-800 transition text-sm font-medium"
          >
            <GitBranch className="w-4 h-4 text-indigo-500" />
            <span className="max-w-[160px] truncate">{activeProject.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          </button>

          {showProjMenu && (
            <div className="absolute left-0 mt-2 w-72 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-xl py-2 z-50">
              <div className="px-3 py-1.5 text-xs font-semibold uppercase text-[var(--text-muted)] tracking-wider">
                Select Connected Repository
              </div>
              {projects.map((proj) => (
                <button
                  key={proj.id}
                  onClick={() => {
                    onSelectProject(proj);
                    setShowProjMenu(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-sm flex items-center justify-between hover:bg-indigo-500/10 transition ${
                    proj.id === activeProject.id ? 'font-semibold text-indigo-500' : ''
                  }`}
                >
                  <div className="truncate">
                    <div className="truncate">{proj.name}</div>
                    <div className="text-xs text-[var(--text-muted)]">{proj.stats.filesCount} files • Health: {proj.healthScore}%</div>
                  </div>
                  {proj.id === activeProject.id && <Check className="w-4 h-4 text-indigo-500 shrink-0" />}
                </button>
              ))}
              <div className="border-t border-[var(--border-color)] mt-2 pt-2 px-2">
                <button
                  onClick={() => {
                    setShowProjMenu(false);
                    onOpenNewRepoModal();
                  }}
                  className="w-full text-xs font-medium text-center text-indigo-500 hover:text-indigo-600 py-1 rounded hover:bg-indigo-500/10 transition"
                >
                  + Connect / Import Repository
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Global Action & Search */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenNewInvestigation}
          className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium text-sm shadow-sm transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span className="hidden sm:inline">Investigate Issue</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifMenu(!showNotifMenu);
              setShowProjMenu(false);
              setShowUserMenu(false);
            }}
            className="p-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-input)] hover:bg-slate-200 dark:hover:bg-slate-800 transition relative text-[var(--text-primary)]"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-xl py-2 z-50">
              <div className="px-3 py-1.5 border-b border-[var(--border-color)] flex items-center justify-between">
                <span className="font-semibold text-xs uppercase tracking-wider text-[var(--text-muted)]">
                  Notifications
                </span>
                <span className="text-xs text-indigo-500 cursor-pointer">Mark all read</span>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-[var(--border-color)]">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3 hover:bg-indigo-500/5 transition text-xs">
                    <div className="font-semibold text-[var(--text-primary)]">{n.title}</div>
                    <div className="text-[var(--text-muted)] mt-0.5">{n.message}</div>
                    <div className="text-[10px] text-slate-400 mt-1">{n.timestamp}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Role Profile & Auth Menu */}
        <div className="relative">
          {isLoggedIn ? (
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowProjMenu(false);
                setShowNotifMenu(false);
              }}
              className="flex items-center space-x-2 pl-2 pr-2.5 py-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-input)] hover:bg-slate-200 dark:hover:bg-slate-800 transition text-sm"
            >
              <img src={currentUser.avatar} alt={currentUser.name} className="w-6 h-6 rounded-full object-cover ring-1 ring-indigo-500" />
              <span className="font-medium max-w-[100px] truncate hidden md:inline">{currentUser.name}</span>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 hidden lg:inline">
                {currentUser.role.replace('_', ' ')}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            </button>
          ) : (
            <button
              onClick={() => onOpenAuth('login')}
              className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-sm transition"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In / Register</span>
            </button>
          )}

          {/* User Dropdown Menu */}
          {showUserMenu && isLoggedIn && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-2xl py-2 z-50 animate-fadeIn">
              {/* Profile Summary Header */}
              <div className="px-3.5 py-2.5 border-b border-[var(--border-color)] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--text-primary)] truncate">{currentUser.name}</span>
                  <span className="flex items-center space-x-1 text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Active</span>
                  </span>
                </div>
                <div className="text-[11px] text-[var(--text-muted)] truncate">{currentUser.email}</div>
                <div className="text-[10px] text-indigo-400 font-mono uppercase tracking-wider font-semibold">
                  Role: {currentUser.role.replace('_', ' ')}
                </div>
              </div>

              {/* Action Links */}
              <div className="py-1">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onOpenAuth('login');
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs font-medium text-[var(--text-primary)] hover:bg-indigo-500/10 flex items-center space-x-2.5 transition"
                >
                  <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Switch Account / Sign In</span>
                </button>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onOpenAuth('register');
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs font-medium text-[var(--text-primary)] hover:bg-purple-500/10 flex items-center space-x-2.5 transition"
                >
                  <UserPlus className="w-3.5 h-3.5 text-purple-400" />
                  <span>Register New Account</span>
                </button>
              </div>

              {/* Logout Option */}
              <div className="border-t border-[var(--border-color)] pt-1 mt-1">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onLogout();
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs font-bold text-rose-400 hover:bg-rose-500/10 flex items-center space-x-2.5 transition"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

