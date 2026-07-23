import React, { useState, useEffect } from 'react';
import { 
  getStoredUser, saveUser, getStoredProjects, saveProjects, 
  getStoredReports, saveReports, getStoredNotifications, saveNotifications, 
  applyTheme 
} from './lib/stateStore';
import { UserProfile, ProjectRepository, InvestigationReport, NotificationItem } from './types';
import { Navbar } from './components/Navbar';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { InvestigationStudioView } from './components/InvestigationStudioView';
import { ArchitectureMapView } from './components/ArchitectureMapView';
import { GitIntelligenceView } from './components/GitIntelligenceView';
import { DockerCicdView } from './components/DockerCicdView';
import { ApiDbProfilerView } from './components/ApiDbProfilerView';
import { CodeQualityView } from './components/CodeQualityView';
import { ReportsView } from './components/ReportsView';
import { AiChatView } from './components/AiChatView';
import { SettingsView } from './components/SettingsView';
import { AuthModal } from './components/AuthModal';
import { NewRepoModal } from './components/NewRepoModal';
import { InvestigationDetailModal } from './components/InvestigationDetailModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile>(getStoredUser());
  const [projects, setProjects] = useState<ProjectRepository[]>(getStoredProjects());
  const [activeProject, setActiveProject] = useState<ProjectRepository>(projects[0]);
  const [reports, setReports] = useState<InvestigationReport[]>(getStoredReports());
  const [notifications, setNotifications] = useState<NotificationItem[]>(getStoredNotifications());

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [studioInitialQuery, setStudioInitialQuery] = useState('');

  // Modals
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showNewRepoModal, setShowNewRepoModal] = useState(false);
  const [selectedReportForModal, setSelectedReportForModal] = useState<InvestigationReport | null>(null);

  // Apply Theme on load & user preference updates
  useEffect(() => {
    applyTheme(currentUser.preferences.theme, currentUser.preferences.accentColor);
  }, [currentUser.preferences.theme, currentUser.preferences.accentColor]);

  // Save changes to localStorage
  const handleUpdateUser = (updatedUser: UserProfile) => {
    setCurrentUser(updatedUser);
    saveUser(updatedUser);
  };

  const handleAddProject = (newProject: ProjectRepository) => {
    const updated = [newProject, ...projects];
    setProjects(updated);
    saveProjects(updated);
    setActiveProject(newProject);
  };

  const handleSaveReport = (newReport: InvestigationReport) => {
    const updated = [newReport, ...reports];
    setReports(updated);
    saveReports(updated);
  };

  const handleStartInvestigationWithPrompt = (promptQuery: string) => {
    setStudioInitialQuery(promptQuery);
    setActiveTab('investigation');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-200 selection:bg-indigo-500/30">
      {/* Top Navigation */}
      <Navbar
        currentUser={currentUser}
        projects={projects}
        activeProject={activeProject}
        onSelectProject={(p) => setActiveProject(p)}
        onOpenNewInvestigation={() => setActiveTab('investigation')}
        onOpenAuth={() => setShowAuthModal(true)}
        notifications={notifications}
        onOpenNewRepoModal={() => setShowNewRepoModal(true)}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
          activeProject={activeProject}
        />

        {/* Workspace View Router */}
        <main className="flex-1 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              project={activeProject}
              recentReports={reports}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onStartInvestigationWithPrompt={handleStartInvestigationWithPrompt}
              onViewReport={(rep) => setSelectedReportForModal(rep)}
            />
          )}

          {activeTab === 'investigation' && (
            <InvestigationStudioView
              project={activeProject}
              initialQuery={studioInitialQuery}
              onSaveReport={handleSaveReport}
              selectedModel={currentUser.preferences.preferredModel}
            />
          )}

          {activeTab === 'architecture' && (
            <ArchitectureMapView project={activeProject} />
          )}

          {activeTab === 'git' && (
            <GitIntelligenceView project={activeProject} />
          )}

          {activeTab === 'docker_cicd' && (
            <DockerCicdView project={activeProject} />
          )}

          {activeTab === 'api_db' && (
            <ApiDbProfilerView project={activeProject} />
          )}

          {activeTab === 'quality' && (
            <CodeQualityView project={activeProject} />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              reports={reports}
              onViewReport={(rep) => setSelectedReportForModal(rep)}
            />
          )}

          {activeTab === 'chat' && (
            <AiChatView
              project={activeProject}
              selectedModel={currentUser.preferences.preferredModel}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              currentUser={currentUser}
              onUpdateUser={handleUpdateUser}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        currentUser={currentUser}
        onLoginSuccess={handleUpdateUser}
      />

      <NewRepoModal
        isOpen={showNewRepoModal}
        onClose={() => setShowNewRepoModal(false)}
        onAddProject={handleAddProject}
      />

      <InvestigationDetailModal
        report={selectedReportForModal}
        onClose={() => setSelectedReportForModal(null)}
      />
    </div>
  );
}
