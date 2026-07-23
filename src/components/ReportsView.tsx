import React, { useState } from 'react';
import { 
  FileText, Download, Share2, ShieldCheck, Copy, Check, 
  Search, ArrowUpRight, Trash2, Calendar, User, Code2, AlertCircle
} from 'lucide-react';
import { InvestigationReport } from '../types';

interface ReportsViewProps {
  reports: InvestigationReport[];
  onViewReport: (report: InvestigationReport) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ reports, onViewReport }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filtered = reports.filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) || r.query.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || r.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1">
            <FileText className="w-4 h-4" />
            <span>AI Investigation Reports Archive</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
            Evidence-Backed Engineering Reports
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Export, share, and reference past investigation findings across your engineering team.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search reports..."
              className="pl-9 pr-3 py-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-input)] text-xs text-[var(--text-primary)] focus:outline-none w-48 md:w-64"
            />
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((report) => (
          <div
            key={report.id}
            onClick={() => onViewReport(report)}
            className="custom-card p-5 space-y-3 hover:border-indigo-500/50 cursor-pointer transition group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase px-2.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400">
                {report.category}
              </span>
              <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{report.confidenceScore}% Confidence</span>
              </span>
            </div>

            <div>
              <h3 className="font-bold text-base text-[var(--text-primary)] group-hover:text-indigo-400 transition line-clamp-2">
                {report.title}
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-2">
                {report.rootCause}
              </p>
            </div>

            <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-between text-xs text-[var(--text-muted)]">
              <span className="flex items-center space-x-1">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                <span>{report.investigatedBy}</span>
              </span>
              <span className="flex items-center space-x-1 text-indigo-400 font-semibold">
                <span>View Complete Report</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
