import { UserProfile, ProjectRepository, InvestigationReport, NotificationItem, ThemeMode, AccentColor } from '../types';
import { mockCurrentUser, mockProjects, mockRecentReports, mockNotifications } from '../data/mockProjects';

const USER_KEY = 'stacklens_user_profile_v1';
const PROJECTS_KEY = 'stacklens_projects_v1';
const REPORTS_KEY = 'stacklens_reports_v1';
const NOTIFS_KEY = 'stacklens_notifications_v1';

export function getStoredUser(): UserProfile {
  try {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : mockCurrentUser;
  } catch {
    return mockCurrentUser;
  }
}

export function saveUser(user: UserProfile) {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (e) {
    console.error('Failed to save user profile', e);
  }
}

export function getStoredProjects(): ProjectRepository[] {
  try {
    const data = localStorage.getItem(PROJECTS_KEY);
    return data ? JSON.parse(data) : mockProjects;
  } catch {
    return mockProjects;
  }
}

export function saveProjects(projects: ProjectRepository[]) {
  try {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  } catch (e) {
    console.error('Failed to save projects', e);
  }
}

export function getStoredReports(): InvestigationReport[] {
  try {
    const data = localStorage.getItem(REPORTS_KEY);
    return data ? JSON.parse(data) : mockRecentReports;
  } catch {
    return mockRecentReports;
  }
}

export function saveReports(reports: InvestigationReport[]) {
  try {
    localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
  } catch (e) {
    console.error('Failed to save reports', e);
  }
}

export function getStoredNotifications(): NotificationItem[] {
  try {
    const data = localStorage.getItem(NOTIFS_KEY);
    return data ? JSON.parse(data) : mockNotifications;
  } catch {
    return mockNotifications;
  }
}

export function saveNotifications(notifs: NotificationItem[]) {
  try {
    localStorage.setItem(NOTIFS_KEY, JSON.stringify(notifs));
  } catch (e) {
    console.error('Failed to save notifications', e);
  }
}

export function applyTheme(theme: ThemeMode, accent: AccentColor) {
  const root = document.documentElement;
  root.classList.remove('light', 'dark', 'amoled', 'high-contrast');

  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.add(prefersDark ? 'dark' : 'light');
  } else {
    root.classList.add(theme);
  }

  // Accent color mapping
  const accentColorMap: Record<AccentColor, { primary: string; hover: string; ring: string }> = {
    indigo: { primary: '#6366f1', hover: '#4f46e5', ring: '#818cf8' },
    emerald: { primary: '#10b981', hover: '#059669', ring: '#34d399' },
    amber: { primary: '#f59e0b', hover: '#d97706', ring: '#fbbf24' },
    rose: { primary: '#f43f5e', hover: '#e11d48', ring: '#fb7185' },
    violet: { primary: '#8b5cf6', hover: '#7c3aed', ring: '#a78bfa' },
    cyan: { primary: '#06b6d4', hover: '#0891b2', ring: '#22d3ee' },
  };

  const selectedAccent = accentColorMap[accent] || accentColorMap.indigo;
  root.style.setProperty('--accent-primary', selectedAccent.primary);
  root.style.setProperty('--accent-hover', selectedAccent.hover);
  root.style.setProperty('--accent-ring', selectedAccent.ring);
}
