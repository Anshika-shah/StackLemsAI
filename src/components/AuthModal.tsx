import React, { useState, useEffect } from 'react';
import { 
  X, Lock, Mail, User, Shield, Key, Github, Sparkles, Check, LogOut, LogIn, UserPlus
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  isLoggedIn: boolean;
  initialTab?: 'login' | 'register' | 'forgot';
  onLoginSuccess: (user: UserProfile) => void;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  isLoggedIn,
  initialTab = 'login',
  onLoginSuccess,
  onLogout,
}) => {
  const [tab, setTab] = useState<'login' | 'register' | 'forgot'>(initialTab);
  const [email, setEmail] = useState(currentUser.email);
  const [password, setPassword] = useState('••••••••••••');
  const [name, setName] = useState(currentUser.name);
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentUser.role);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setTab(initialTab);
    setEmail(currentUser.email);
    setName(currentUser.name);
    setSelectedRole(currentUser.role);
    setMessage('');
  }, [initialTab, currentUser, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === 'forgot') {
      setMessage('Password reset link sent to your email.');
      return;
    }

    const updatedUser: UserProfile = {
      ...currentUser,
      name: tab === 'register' ? name : (name || currentUser.name),
      email,
      role: selectedRole,
    };

    setMessage('');
    onLoginSuccess(updatedUser);
    onClose();
  };

  const handleOAuthLogin = (provider: 'google' | 'github') => {
    const updatedUser: UserProfile = {
      ...currentUser,
      name: provider === 'google' ? 'Anshika Shah (Google)' : 'anshikashah (GitHub)',
      email: currentUser.email || 'user@company.com',
    };
    onLoginSuccess(updatedUser);
    onClose();
  };

  const handleModalLogout = () => {
    onLogout();
    setMessage('Logged out successfully. You are now in guest mode.');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="custom-card w-full max-w-md p-6 space-y-5 bg-[var(--bg-card)] border-[var(--border-color)] relative shadow-2xl animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-emerald-500 text-white font-black text-xl flex items-center justify-center mx-auto shadow-md">
            S
          </div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            {tab === 'login' ? 'Sign In to StackLens AI' : tab === 'register' ? 'Register New Account' : 'Reset Password'}
          </h2>
          <p className="text-xs text-[var(--text-muted)]">
            StackLens AI Authentication & Role-Based Access Control
          </p>
        </div>

        {/* Logged in status banner */}
        {isLoggedIn ? (
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <div className="font-bold text-[var(--text-primary)]">{currentUser.name}</div>
                <div className="text-[10px] text-[var(--text-muted)]">{currentUser.email} • {currentUser.role}</div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleModalLogout}
              className="px-2.5 py-1 rounded-lg bg-rose-500/15 text-rose-400 hover:bg-rose-500/25 border border-rose-500/30 font-semibold text-[11px] flex items-center space-x-1 transition"
            >
              <LogOut className="w-3 h-3" />
              <span>Log Out</span>
            </button>
          </div>
        ) : (
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-400 text-center font-medium">
            Currently in Guest Mode. Please Sign In or Register to manage workspace sessions.
          </div>
        )}

        {/* Auth Mode Tabs */}
        <div className="grid grid-cols-2 gap-1 bg-[var(--bg-input)] p-1 rounded-xl border border-[var(--border-color)]">
          <button
            type="button"
            onClick={() => setTab('login')}
            className={`py-1.5 text-xs font-bold rounded-lg transition flex items-center justify-center space-x-1.5 ${
              tab === 'login'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('register')}
            className={`py-1.5 text-xs font-bold rounded-lg transition flex items-center justify-center space-x-1.5 ${
              tab === 'register'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {tab === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Anshika Shah"
                required
                className="w-full custom-input p-2.5 rounded-lg text-xs"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. user@company.com"
              required
              className="w-full custom-input p-2.5 rounded-lg text-xs"
            />
          </div>

          {tab !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-[var(--text-muted)]">Password</label>
                {tab === 'login' && (
                  <button
                    type="button"
                    onClick={() => setTab('forgot')}
                    className="text-[11px] text-indigo-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full custom-input p-2.5 rounded-lg text-xs"
              />
            </div>
          )}

          {tab === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Target Organization Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="w-full custom-input p-2.5 rounded-lg text-xs font-semibold"
              >
                <option value="developer">Developer</option>
                <option value="team_lead">Team Lead</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}

          {message && <div className="text-xs text-emerald-400 font-semibold text-center">{message}</div>}

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition transform hover:scale-[1.01]"
          >
            {tab === 'login' ? 'Sign In to Workspace' : tab === 'register' ? 'Register Account & Enter' : 'Send Reset Link'}
          </button>
        </form>

        {/* OAuth Dividers */}
        <div className="relative border-t border-[var(--border-color)] my-3">
          <span className="absolute left-1/2 -top-2.5 -translate-x-1/2 bg-[var(--bg-card)] px-2 text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
            Or continue with
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleOAuthLogin('google')}
            className="p-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-input)] hover:border-indigo-500 text-xs font-semibold flex items-center justify-center space-x-2 text-[var(--text-primary)] transition"
          >
            <span>Google Login</span>
          </button>
          <button
            type="button"
            onClick={() => handleOAuthLogin('github')}
            className="p-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-input)] hover:border-indigo-500 text-xs font-semibold flex items-center justify-center space-x-2 text-[var(--text-primary)] transition"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub OAuth</span>
          </button>
        </div>

        {/* Bottom Switcher */}
        <div className="text-center text-xs text-[var(--text-muted)] pt-2 border-t border-[var(--border-color)]">
          {tab === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button onClick={() => setTab('register')} className="text-indigo-400 font-bold hover:underline">
                Register Account
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button onClick={() => setTab('login')} className="text-indigo-400 font-bold hover:underline">
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

