import React from 'react';
import { X, Keyboard, Command } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Ctrl + K', description: 'Open Global Command Palette' },
    { key: 'Ctrl + I', description: 'Launch AI Investigation Studio' },
    { key: 'Ctrl + B', description: 'Toggle Left Sidebar Navigation' },
    { key: 'Esc', description: 'Close active modal / dropdown' },
    { key: 'Ctrl + Shift + P', description: 'Go to User Profile' },
    { key: 'Ctrl + Shift + R', description: 'Refresh Repository Index' },
    { key: 'Ctrl + /', description: 'Open Keyboard Shortcuts Help' },
  ];

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
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Keyboard className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[var(--text-primary)]">Keyboard Shortcuts</h2>
            <p className="text-xs text-[var(--text-muted)]">Accelerate your navigation across StackLens AI</p>
          </div>
        </div>

        <div className="space-y-2 max-h-80 overflow-y-auto divide-y divide-[var(--border-color)]">
          {shortcuts.map((sc, idx) => (
            <div key={idx} className="pt-2.5 pb-1 flex items-center justify-between text-xs">
              <span className="text-[var(--text-primary)] font-medium">{sc.description}</span>
              <kbd className="px-2.5 py-1 rounded-lg bg-[var(--bg-input)] border border-[var(--border-color)] text-indigo-400 font-mono font-bold text-[11px]">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-[var(--border-color)] text-center text-xs text-[var(--text-muted)]">
          Press <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-input)] font-mono text-[10px]">Esc</kbd> to dismiss at any time
        </div>
      </div>
    </div>
  );
};
