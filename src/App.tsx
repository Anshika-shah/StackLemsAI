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
import { ProfileView } from './components/ProfileView';
import { AuthModal } from './components/AuthModal';
import { NewRepoModal } from './components/NewRepoModal';
import { InvestigationDetailModal } from './components/InvestigationDetailModal';
import { CommandPaletteModal } from './components/CommandPaletteModal';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { HelpModal } from './components/HelpModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile>(getStoredUser());
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('stacklens_is_logged_in') !== 'false';
  });
  const [projects, setProjects] = useState<ProjectRepository[]>(getStoredProjects());
  const [activeProject, setActiveProject] = useState<ProjectRepository>(projects[0]);
  const [reports, setReports] = useState<InvestigationReport[]>(getStoredReports());
  const [notifications, setNotifications] = useState<NotificationItem[]>(getStoredNotifications());

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [studioInitialQuery, setStudioInitialQuery] = useState('');

  // Modals & Drawers
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const [showNewRepoModal, setShowNewRepoModal] = useState(false);
  const [selectedReportForModal, setSelectedReportForModal] = useState<InvestigationReport | null>(null);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Apply Theme on load & user preference updates
  useEffect(() => {
    applyTheme(currentUser.preferences.theme, currentUser.preferences.accentColor);
  }, [currentUser.preferences.theme, currentUser.preferences.accentColor]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette((prev) => !prev);
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
        e.preventDefault();
        setActiveTab('investigation');
      } else if (e.key === '?' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setShowShortcutsModal(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auth Handlers
  const handleUpdateUser = (updatedUser: UserProfile) => {
    setCurrentUser(updatedUser);
    saveUser(updatedUser);
    setIsLoggedIn(true);
    localStorage.setItem('stacklens_is_logged_in', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('stacklens_is_logged_in', 'false');
  };

  const handleOpenAuth = (initialTab: 'login' | 'register' = 'login') => {
    setAuthModalTab(initialTab);
    setShowAuthModal(true);
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

  const handleMarkNotificationRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    setNotifications(updated);
    saveNotifications(updated);
  };

  const handleMarkAllNotificationsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    saveNotifications(updated);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-200 selection:bg-indigo-500/30">
      {/* Top Navigation */}
      <Navbar
        currentUser={currentUser}
        isLoggedIn={isLoggedIn}
        projects={projects}
        activeProject={activeProject}
        onSelectProject={(p) => setActiveProject(p)}
        onOpenNewInvestigation={() => setActiveTab('investigation')}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
        onOpenNewRepoModal={() => setShowNewRepoModal(true)}
        onOpenCommandPalette={() => setShowCommandPalette(true)}
        onOpenShortcuts={() => setShowShortcutsModal(true)}
        onOpenHelp={() => setShowHelpModal(true)}
        onNavigateTab={(tab) => setActiveTab(tab)}
        onStartInvestigationWithPrompt={handleStartInvestigationWithPrompt}
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

          {activeTab === 'profile' && (
            <ProfileView
              currentUser={currentUser}
              onUpdateUser={handleUpdateUser}
              projects={projects}
              reports={reports}
              onSelectProject={(p) => setActiveProject(p)}
              onViewReport={(rep) => setSelectedReportForModal(rep)}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              currentUser={currentUser}
              onUpdateUser={handleUpdateUser}
              onLogout={handleLogout}
              onOpenAuth={handleOpenAuth}
            />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        currentUser={currentUser}
        isLoggedIn={isLoggedIn}
        initialTab={authModalTab}
        onLoginSuccess={handleUpdateUser}
        onLogout={handleLogout}
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

      <CommandPaletteModal
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        onNavigateTab={(tab) => setActiveTab(tab)}
        onStartInvestigation={handleStartInvestigationWithPrompt}
        projects={projects}
        activeProject={activeProject}
        onSelectProject={(p) => setActiveProject(p)}
        recentReports={reports}
        onViewReport={(rep) => setSelectedReportForModal(rep)}
      />

      <KeyboardShortcutsModal
        isOpen={showShortcutsModal}
        onClose={() => setShowShortcutsModal(false)}
      />

      <HelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />
    </div>
  );
}
