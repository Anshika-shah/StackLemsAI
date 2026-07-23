import React, { useState } from 'react';
import { 
  X, ShieldCheck, FileText, Code2, Copy, Check, Download, Share2, 
  Terminal, AlertCircle, FileCode, Calendar, User
} from 'lucide-react';
import { InvestigationReport } from '../types';

interface InvestigationDetailModalProps {
  report: InvestigationReport | null;
  onClose: () => void;
}

export const InvestigationDetailModal: React.FC<InvestigationDetailModalProps> = ({
  report,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!report) return null;

  const copyMarkdown = () => {
    const md = `# ${report.title}
**Project:** ${report.projectName}
**Confidence Score:** ${report.confidenceScore}%
**Investigated By:** ${report.investigatedBy}

## Root Cause
${report.rootCause}

## Evidence
${report.evidence.map((e) => `- **File:** ${e.file}:${e.line}\n  \`\`\`\n  ${e.snippet}\n  \`\`\`\n  *Rationale:* ${e.rationale}`).join('\n\n')}

## Recommended Fix
${report.suggestedFix}

## Code Diff
\`\`\`diff
${report.codeDiff || ''}
\`\`\`
`;

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="custom-card w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 space-y-6 bg-[var(--bg-card)] border-[var(--border-color)] relative shadow-2xl animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-2 border-b border-[var(--border-color)] pb-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-400">
              {report.category} Report
            </span>
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>{report.confidenceScore}% Confidence</span>
            </div>
          </div>

          <h2 className="text-xl font-bold text-[var(--text-primary)]">{report.title}</h2>

          <div className="flex items-center space-x-4 text-xs text-[var(--text-muted)]">
            <span className="flex items-center space-x-1">
              <User className="w-3.5 h-3.5 text-indigo-400" />
              <span>{report.investigatedBy}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>{report.createdAt.split('T')[0]}</span>
            </span>
          </div>
        </div>

        {/* Root Cause */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm space-y-2">
          <div className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center space-x-1.5">
            <AlertCircle className="w-4 h-4" />
            <span>Root Cause Analysis</span>
          </div>
          <p className="leading-relaxed">{report.rootCause}</p>
        </div>

        {/* Evidence */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-[var(--text-primary)] flex items-center space-x-2">
            <Code2 className="w-4 h-4 text-indigo-400" />
            <span>Collected Code Evidence ({report.evidence.length})</span>
          </h3>

          {report.evidence.map((ev, i) => (
            <div key={i} className="p-3.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-input)] space-y-2 text-xs">
              <div className="font-mono font-bold text-indigo-400 flex items-center justify-between">
                <span>{ev.file} : line {ev.line || '1'}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-950 text-emerald-400 font-mono overflow-x-auto border border-slate-800">
                <code>{ev.snippet}</code>
              </div>
              <p className="text-[var(--text-muted)] italic">{ev.rationale}</p>
            </div>
          ))}
        </div>

        {/* Code Diff */}
        {report.codeDiff && (
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-[var(--text-primary)] flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Patch Code Diff</span>
            </h3>
            <div className="p-3.5 rounded-xl bg-slate-950 font-mono text-xs overflow-x-auto border border-slate-800 text-slate-300">
              <pre>{report.codeDiff}</pre>
            </div>
          </div>
        )}

        {/* Export Action Bar */}
        <div className="pt-4 border-t border-[var(--border-color)] flex items-center justify-between">
          <button
            onClick={copyMarkdown}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Markdown' : 'Copy Full Markdown Report'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-input)] hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-semibold text-[var(--text-primary)]"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
