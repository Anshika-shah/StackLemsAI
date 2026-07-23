import React, { useState } from 'react';
import { 
  X, Lock, Mail, User, Shield, Key, Github, Sparkles, Check
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
}) => {
  const [tab, setTab] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState(currentUser.email);
  const [password, setPassword] = useState('••••••••••••');
  const [name, setName] = useState(currentUser.name);
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentUser.role);
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === 'forgot') {
      setMessage('Password reset link sent to your email.');
      return;
    }

    const updatedUser: UserProfile = {
      ...currentUser,
      name: tab === 'register' ? name : currentUser.name,
      email,
      role: selectedRole,
    };

    onLoginSuccess(updatedUser);
    onClose();
  };

  const handleOAuthLogin = (provider: 'google' | 'github') => {
    const updatedUser: UserProfile = {
      ...currentUser,
      name: provider === 'google' ? 'Anshika Shah (Google)' : 'anshikashah (GitHub)',
      email: currentUser.email,
    };
    onLoginSuccess(updatedUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="custom-card w-full max-w-md p-6 space-y-5 bg-[var(--bg-card)] border-[var(--border-color)] relative shadow-2xl animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-black text-xl flex items-center justify-center mx-auto shadow-md">
            S
          </div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            {tab === 'login' ? 'Welcome Back' : tab === 'register' ? 'Create Account' : 'Reset Password'}
          </h2>
          <p className="text-xs text-[var(--text-muted)]">
            StackLens AI Authentication & Role-Based Access Control
          </p>
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
              required
              className="w-full custom-input p-2.5 rounded-lg text-xs"
            />
          </div>

          {tab !== 'forgot' && (
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Password</label>
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
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition"
          >
            {tab === 'login' ? 'Sign In' : tab === 'register' ? 'Register Account' : 'Send Reset Link'}
          </button>
        </form>

        {/* OAuth Dividers */}
        <div className="relative border-t border-[var(--border-color)] my-3">
          <span className="absolute left-1/2 -top-2.5 -translate-x-1/2 bg-[var(--bg-card)] px-2 text-[10px] text-[var(--text-muted)] uppercase">
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
                Register
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
