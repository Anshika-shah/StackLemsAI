import React, { useState } from 'react';
import { 
  User, Shield, GitBranch, FileText, Activity, CheckCircle2, 
  Calendar, Building, Mail, Github, Edit3, Sparkles, ExternalLink,
  Award, Clock, Check, X, Camera
} from 'lucide-react';
import { UserProfile, ProjectRepository, InvestigationReport } from '../types';

interface ProfileViewProps {
  currentUser: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
  projects: ProjectRepository[];
  reports: InvestigationReport[];
  onSelectProject: (proj: ProjectRepository) => void;
  onViewReport: (report: InvestigationReport) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  onUpdateUser,
  projects,
  reports,
  onSelectProject,
  onViewReport,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    role: currentUser.role,
    department: currentUser.department || 'Core Platform & Architecture',
    avatar: currentUser.avatar,
    githubUser: currentUser.email.split('@')[0] || 'alexmorgan',
    organization: 'StackLens Engineering Labs',
    bio: 'Lead Infrastructure Engineer specializing in multi-repo microservice topology analysis, distributed system tracing, and automated fault detection.',
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...currentUser,
      name: formData.name,
      email: formData.email,
      role: formData.role as any,
      department: formData.department,
      avatar: formData.avatar,
    };
    onUpdateUser(updated);
    setIsEditing(false);
  };

  const userReports = reports.filter((r) => r.investigatedBy.toLowerCase().includes('alex') || r.investigatedBy.toLowerCase().includes('anshika') || true);

  return (
    <div className="p-6 space-y-6 max-w-[1300px] mx-auto animate-fadeIn">
      {/* Top Banner & Header */}
      <div className="custom-card p-6 bg-[var(--bg-card)] border-[var(--border-color)] relative overflow-hidden rounded-2xl shadow-xl">
        {/* Decorative background glow */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-5">
            <div className="relative group">
              <img
                src={formData.avatar}
                alt={formData.name}
                className="w-24 h-24 rounded-2xl object-cover ring-2 ring-indigo-500/50 shadow-xl"
              />
              <button
                onClick={() => setIsEditing(true)}
                className="absolute -bottom-2 -right-2 p-1.5 rounded-lg bg-indigo-600 text-white shadow-md hover:bg-indigo-500 transition"
                title="Edit Avatar"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2.5 flex-wrap">
                <h1 className="text-2xl font-black text-[var(--text-primary)]">{formData.name}</h1>
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  {formData.role.replace('_', ' ')}
                </span>
                <span className="flex items-center space-x-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Verified SaaS Member</span>
                </span>
              </div>

              <p className="text-xs text-[var(--text-muted)] max-w-xl leading-relaxed">
                {formData.bio}
              </p>

              <div className="flex items-center space-x-4 pt-1 text-xs text-[var(--text-muted)] flex-wrap gap-y-1">
                <span className="flex items-center space-x-1">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{formData.email}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Github className="w-3.5 h-3.5 text-purple-400" />
                  <span>@{formData.githubUser}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Building className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{formData.department}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>Joined {currentUser.joinedDate || 'Jan 2026'}</span>
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition transform hover:scale-[1.02] shrink-0"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Investigation Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="custom-card p-4 bg-[var(--bg-card)] border-[var(--border-color)] rounded-2xl flex items-center space-x-4 hover:-translate-y-0.5 hover:shadow-lg transition-all">
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Total Investigations</div>
            <div className="text-2xl font-black text-[var(--text-primary)] mt-0.5">24 <span className="text-xs text-indigo-400 font-normal">cases</span></div>
          </div>
        </div>

        <div className="custom-card p-4 bg-[var(--bg-card)] border-[var(--border-color)] rounded-2xl flex items-center space-x-4 hover:-translate-y-0.5 hover:shadow-lg transition-all">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Critical Solved</div>
            <div className="text-2xl font-black text-emerald-400 mt-0.5">18 <span className="text-xs text-emerald-500 font-normal">bugs</span></div>
          </div>
        </div>

        <div className="custom-card p-4 bg-[var(--bg-card)] border-[var(--border-color)] rounded-2xl flex items-center space-x-4 hover:-translate-y-0.5 hover:shadow-lg transition-all">
          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Confidence Average</div>
            <div className="text-2xl font-black text-purple-400 mt-0.5">94.8%</div>
          </div>
        </div>

        <div className="custom-card p-4 bg-[var(--bg-card)] border-[var(--border-color)] rounded-2xl flex items-center space-x-4 hover:-translate-y-0.5 hover:shadow-lg transition-all">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Avg Resolution Time</div>
            <div className="text-2xl font-black text-amber-400 mt-0.5">2.4 <span className="text-xs text-amber-500 font-normal">mins</span></div>
          </div>
        </div>
      </div>

      {/* Main Grid: Connected Repos & Reports Generated */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Connected Repositories Section */}
        <div className="lg:col-span-6 custom-card p-5 bg-[var(--bg-card)] border-[var(--border-color)] rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
            <div className="flex items-center space-x-2">
              <GitBranch className="w-4 h-4 text-indigo-400" />
              <h3 className="font-bold text-sm text-[var(--text-primary)]">Connected Repositories ({projects.length})</h3>
            </div>
            <span className="text-xs text-indigo-400 font-mono">Sync Status: Active</span>
          </div>

          <div className="space-y-3">
            {projects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => onSelectProject(proj)}
                className="p-3.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-input)] hover:border-indigo-500/50 cursor-pointer transition flex items-center justify-between gap-3 group"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs text-[var(--text-primary)] group-hover:text-indigo-400 transition truncate">
                      {proj.name}
                    </span>
                    <span className="text-[10px] px-2 py-0.2 rounded bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                      Indexed
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {proj.languages.map((lang, idx) => (
                      <span key={idx} className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-[var(--text-muted)]">
                        {lang}
                      </span>
                    ))}
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)]">
                    {proj.stats.filesCount} files • {proj.stats.endpointsCount} APIs • Health: <span className="font-bold text-emerald-400">{proj.healthScore}%</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-[10px] text-[var(--text-muted)]">Last Investigation</div>
                  <div className="text-[11px] font-mono font-semibold text-indigo-400">15 mins ago</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Generated Reports Section */}
        <div className="lg:col-span-6 custom-card p-5 bg-[var(--bg-card)] border-[var(--border-color)] rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-purple-400" />
              <h3 className="font-bold text-sm text-[var(--text-primary)]">Reports Generated ({userReports.length})</h3>
            </div>
            <span className="text-xs text-purple-400 font-mono">Archive Indexed</span>
          </div>

          <div className="space-y-3">
            {userReports.slice(0, 4).map((rep) => (
              <div
                key={rep.id}
                onClick={() => onViewReport(rep)}
                className="p-3.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-input)] hover:border-purple-500/50 cursor-pointer transition flex items-center justify-between gap-3 group"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs text-[var(--text-primary)] group-hover:text-purple-400 transition truncate">
                      {rep.title}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-indigo-500/10 text-indigo-400">
                      {rep.confidenceScore}% Conf.
                    </span>
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)] truncate">{rep.rootCause}</div>
                </div>

                <ExternalLink className="w-4 h-4 text-purple-400 group-hover:scale-110 transition shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Timeline */}
      <div className="custom-card p-5 bg-[var(--bg-card)] border-[var(--border-color)] rounded-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-sm text-[var(--text-primary)]">Recent Activity Timeline</h3>
          </div>
          <span className="text-xs text-[var(--text-muted)]">Real-time audit log</span>
        </div>

        <div className="space-y-3.5 text-xs">
          <div className="flex items-start space-x-3">
            <div className="mt-1 w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
            <div>
              <div className="font-bold text-[var(--text-primary)]">Completed Login API 401 Investigation</div>
              <div className="text-[var(--text-muted)] mt-0.5">Identified RS256/HS256 JWT key algorithm mismatch in auth-service-go.</div>
              <div className="text-[10px] text-indigo-400 font-mono mt-1">Today at 14:22 • StackLens AI Studio</div>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="mt-1 w-2.5 h-2.5 rounded-full bg-indigo-400 shrink-0" />
            <div>
              <div className="font-bold text-[var(--text-primary)]">Connected Repository <code className="font-mono text-indigo-400">auth-service-go</code></div>
              <div className="text-[var(--text-muted)] mt-0.5">Indexed 18 AST files, 4 endpoints, and Docker compose files.</div>
              <div className="text-[10px] text-indigo-400 font-mono mt-1">Yesterday at 18:05 • System Sync</div>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="mt-1 w-2.5 h-2.5 rounded-full bg-purple-400 shrink-0" />
            <div>
              <div className="font-bold text-[var(--text-primary)]">Generated Architecture Dependency Topology</div>
              <div className="text-[var(--text-muted)] mt-0.5">Mapped 5 nodes, 4 directional RPC edges, and PostgreSQL data stores.</div>
              <div className="text-[10px] text-indigo-400 font-mono mt-1">2 days ago • Architecture Scanner</div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="custom-card w-full max-w-lg bg-[var(--bg-card)] border-[var(--border-color)] p-6 space-y-4 rounded-2xl relative shadow-2xl">
            <button
              onClick={() => setIsEditing(false)}
              className="absolute right-4 top-4 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-[var(--text-primary)]">Edit Profile</h2>

            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="block text-[var(--text-muted)] font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full custom-input p-2.5 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-[var(--text-muted)] font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full custom-input p-2.5 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--text-muted)] font-semibold mb-1">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full custom-input p-2.5 rounded-xl"
                  >
                    <option value="developer">Developer</option>
                    <option value="team_lead">Team Lead</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[var(--text-muted)] font-semibold mb-1">Department</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full custom-input p-2.5 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[var(--text-muted)] font-semibold mb-1">Avatar Image URL</label>
                <input
                  type="text"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  className="w-full custom-input p-2.5 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-[var(--text-muted)] font-semibold mb-1">Bio / Role Description</label>
                <textarea
                  rows={2}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full custom-input p-2.5 rounded-xl"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
