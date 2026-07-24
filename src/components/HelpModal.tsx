import React from 'react';
import { X, HelpCircle, BookOpen, MessageSquare, Terminal, ExternalLink } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="custom-card w-full max-w-lg bg-[var(--bg-card)] border-[var(--border-color)] p-6 space-y-5 rounded-2xl relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[var(--text-primary)]">StackLens AI Help & Guide</h2>
            <p className="text-xs text-[var(--text-muted)]">Autonomous Codebase Investigation & Diagnostics</p>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] space-y-1">
            <div className="font-bold text-indigo-400 flex items-center space-x-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>How Autonomous Investigation Works</span>
            </div>
            <p className="text-[var(--text-muted)] leading-relaxed">
              StackLens AI scans your multi-repo topology, parses AST code files, analyzes commit histories, and inspects database schemas to pinpoint root causes with precision.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] space-y-1">
            <div className="font-bold text-purple-400 flex items-center space-x-2">
              <Terminal className="w-3.5 h-3.5" />
              <span>Using the Command Palette</span>
            </div>
            <p className="text-[var(--text-muted)] leading-relaxed">
              Press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[10px]">Ctrl + K</kbd> anywhere in the application to search files, switch connected repositories, launch investigations, or navigate modules instantly.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] space-y-1">
            <div className="font-bold text-emerald-400 flex items-center space-x-2">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Copilot & AI Model Selection</span>
            </div>
            <p className="text-[var(--text-muted)] leading-relaxed">
              Switch AI models (Gemini Flash, Gemini Pro) in Settings to adjust reasoning speed or deep analysis depth.
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-[var(--border-color)] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};
