import React from 'react';
import { 
  Settings, Moon, Sun, Monitor, Palette, Sparkles, Sliders, 
  ShieldCheck, User, Check, RefreshCw, Key, LogOut, UserPlus, LogIn
} from 'lucide-react';
import { UserProfile, ThemeMode, AccentColor, ExplanationMode, ResponseStyle, UserRole } from '../types';

interface SettingsViewProps {
  currentUser: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
  onLogout?: () => void;
  onOpenAuth?: (tab?: 'login' | 'register') => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ 
  currentUser, 
  onUpdateUser,
  onLogout,
  onOpenAuth,
}) => {
  const handleThemeChange = (theme: ThemeMode) => {
    onUpdateUser({
      ...currentUser,
      preferences: { ...currentUser.preferences, theme },
    });
  };

  const handleAccentChange = (accentColor: AccentColor) => {
    onUpdateUser({
      ...currentUser,
      preferences: { ...currentUser.preferences, accentColor },
    });
  };

  const handleModelChange = (preferredModel: string) => {
    onUpdateUser({
      ...currentUser,
      preferences: { ...currentUser.preferences, preferredModel },
    });
  };

  const handleModeChange = (explanationMode: ExplanationMode) => {
    onUpdateUser({
      ...currentUser,
      preferences: { ...currentUser.preferences, explanationMode },
    });
  };

  const handleStyleChange = (responseStyle: ResponseStyle) => {
    onUpdateUser({
      ...currentUser,
      preferences: { ...currentUser.preferences, responseStyle },
    });
  };

  const handleRoleChange = (role: UserRole) => {
    onUpdateUser({ ...currentUser, role });
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1">
          <Settings className="w-4 h-4" />
          <span>Settings & Workspace Preferences</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
          AI Model & Theme Personalization
        </h1>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">
          Configure preferred Gemini AI model, investigation response depth, RBAC role, and visual theme settings.
        </p>
      </div>

      {/* Account & Session Management */}
      <div className="custom-card p-6 space-y-4 border-indigo-500/20 bg-indigo-500/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-base flex items-center space-x-2 text-[var(--text-primary)]">
              <User className="w-5 h-5 text-indigo-400" />
              <span>User Account & Active Session</span>
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Signed in as <span className="font-semibold text-indigo-400">{currentUser.name}</span> ({currentUser.email}) • Role: <span className="uppercase font-mono font-bold text-indigo-300">{currentUser.role}</span>
            </p>
          </div>

          <div className="flex items-center space-x-2.5 shrink-0">
            {onOpenAuth && (
              <button
                onClick={() => onOpenAuth('login')}
                className="px-3.5 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-input)] hover:border-indigo-500 text-xs font-semibold text-[var(--text-primary)] flex items-center space-x-2 transition"
              >
                <LogIn className="w-3.5 h-3.5 text-indigo-400" />
                <span>Switch / Sign In</span>
              </button>
            )}

            {onOpenAuth && (
              <button
                onClick={() => onOpenAuth('register')}
                className="px-3.5 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-input)] hover:border-purple-500 text-xs font-semibold text-[var(--text-primary)] flex items-center space-x-2 transition"
              >
                <UserPlus className="w-3.5 h-3.5 text-purple-400" />
                <span>Register Account</span>
              </button>
            )}

            {onLogout && (
              <button
                onClick={onLogout}
                className="px-3.5 py-2 rounded-xl bg-rose-500/15 text-rose-400 hover:bg-rose-500/25 border border-rose-500/30 font-bold text-xs flex items-center space-x-2 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* AI Model Preferences */}
      <div className="custom-card p-6 space-y-4">
        <h3 className="font-bold text-base flex items-center space-x-2 text-[var(--text-primary)]">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <span>AI Model & Reasoning Preferences</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Model Selector */}
          <div>
            <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">
              Preferred AI Model
            </label>
            <select
              value={currentUser.preferences.preferredModel}
              onChange={(e) => handleModelChange(e.target.value)}
              className="w-full custom-input p-2.5 rounded-xl text-sm font-semibold"
            >
              <option value="gemini-3.6-flash">Google Gemini 3.6 Flash (Recommended - Ultra Fast)</option>
              <option value="gemini-3.1-pro-preview">Google Gemini 3.1 Pro (Deep Complex Reasoning)</option>
              <option value="claude-3-5-sonnet">Anthropic Claude 3.5 Sonnet (Local Bridge)</option>
              <option value="gpt-4o">OpenAI GPT-4o (Local Bridge)</option>
              <option value="ollama-deepseek-r1">Ollama DeepSeek-R1 (Self-Hosted Local)</option>
            </select>
          </div>

          {/* Explanation Mode */}
          <div>
            <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">
              Explanation Mode Depth
            </label>
            <select
              value={currentUser.preferences.explanationMode}
              onChange={(e) => handleModeChange(e.target.value as ExplanationMode)}
              className="w-full custom-input p-2.5 rounded-xl text-sm font-semibold"
            >
              <option value="beginner">Beginner (Simplified Overview & High-level Terms)</option>
              <option value="intermediate">Intermediate (Standard Architecture & Code Snippets)</option>
              <option value="expert">Expert (Deep AST, Call Stacks & Bytecode Analysis)</option>
            </select>
          </div>

          {/* Response Style */}
          <div>
            <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">
              Report Response Style
            </label>
            <select
              value={currentUser.preferences.responseStyle}
              onChange={(e) => handleStyleChange(e.target.value as ResponseStyle)}
              className="w-full custom-input p-2.5 rounded-xl text-sm font-semibold"
            >
              <option value="summary">Short Executive Summary</option>
              <option value="detailed">Detailed Multi-step Investigation Report</option>
              <option value="step_by_step">Step-by-Step Remediation Breakdown</option>
            </select>
          </div>

          {/* RBAC Role */}
          <div>
            <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">
              User Access Role (RBAC)
            </label>
            <select
              value={currentUser.role}
              onChange={(e) => handleRoleChange(e.target.value as UserRole)}
              className="w-full custom-input p-2.5 rounded-xl text-sm font-semibold"
            >
              <option value="admin">Admin (Full System & Integration Management)</option>
              <option value="team_lead">Team Lead (Investigation & Share Permissions)</option>
              <option value="developer">Developer (Standard Investigation Access)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Workspace Theme & Accent */}
      <div className="custom-card p-6 space-y-4">
        <h3 className="font-bold text-base flex items-center space-x-2 text-[var(--text-primary)]">
          <Palette className="w-5 h-5 text-purple-400" />
          <span>Workspace Theme & Personalization</span>
        </h3>

        {/* Theme Mode Grid */}
        <div>
          <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-2">
            Visual Color Theme
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { id: 'light', label: 'Light', icon: Sun },
              { id: 'dark', label: 'Dark Slate', icon: Moon },
              { id: 'amoled', label: 'AMOLED Black', icon: Monitor },
              { id: 'high-contrast', label: 'High Contrast', icon: Sliders },
              { id: 'system', label: 'System Default', icon: RefreshCw },
            ].map((th) => {
              const Icon = th.icon;
              const isSelected = currentUser.preferences.theme === th.id;
              return (
                <button
                  key={th.id}
                  onClick={() => handleThemeChange(th.id as ThemeMode)}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1.5 transition ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-500/15 font-bold text-indigo-400'
                      : 'border-[var(--border-color)] bg-[var(--bg-input)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs">{th.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Accent Colors */}
        <div>
          <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-2">
            Accent Brand Color
          </label>
          <div className="flex flex-wrap gap-3">
            {[
              { id: 'indigo', color: '#6366f1', label: 'Indigo' },
              { id: 'emerald', color: '#10b981', label: 'Emerald' },
              { id: 'amber', color: '#f59e0b', label: 'Amber' },
              { id: 'rose', color: '#f43f5e', label: 'Rose' },
              { id: 'violet', color: '#8b5cf6', label: 'Violet' },
              { id: 'cyan', color: '#06b6d4', label: 'Cyan' },
            ].map((acc) => {
              const isSelected = currentUser.preferences.accentColor === acc.id;
              return (
                <button
                  key={acc.id}
                  onClick={() => handleAccentChange(acc.id as AccentColor)}
                  className={`px-3 py-1.5 rounded-xl border flex items-center space-x-2 text-xs font-medium transition ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-500/10 text-[var(--text-primary)] font-bold'
                      : 'border-[var(--border-color)] bg-[var(--bg-input)] text-[var(--text-muted)]'
                  }`}
                >
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: acc.color }} />
                  <span>{acc.label}</span>
                  {isSelected && <Check className="w-3 h-3 text-indigo-400 ml-1" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

