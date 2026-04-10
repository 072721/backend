// Admin authentication and settings storage utilities

const ADMIN_SESSION_KEY = 'admin_session';
const ADMIN_SETTINGS_KEY = 'admin_settings';

// Admin credentials (in production, this should be in a secure backend)
const ADMIN_CREDENTIALS = {
  email: 'mark.pogi@gmail.com',
  password: 'pogiparin2026',
};

export interface AdminSettings {
  primaryColor: string;
  teamAColor: string;
  teamBColor: string;
  logoUrl: string | null;
  announcementBanner: string;
  announcementBannerColor: string;
  lastUpdated: string;
}

const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  primaryColor: '#3b82f6', // blue-500
  teamAColor: '#3b82f6', // blue
  teamBColor: '#ef4444', // red
  logoUrl: null,
  announcementBanner: '',
  announcementBannerColor: '#f59e0b', // amber-500
  lastUpdated: new Date().toISOString(),
};

// Admin authentication
export const adminLogin = (email: string, password: string): boolean => {
  if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify({
      loggedIn: true,
      timestamp: new Date().toISOString(),
    }));
    return true;
  }
  return false;
};

export const adminLogout = (): void => {
  localStorage.removeItem(ADMIN_SESSION_KEY);
};

export const isAdminLoggedIn = (): boolean => {
  const session = localStorage.getItem(ADMIN_SESSION_KEY);
  if (!session) return false;
  
  try {
    const { loggedIn } = JSON.parse(session);
    return loggedIn === true;
  } catch {
    return false;
  }
};

// Admin settings management
export const getAdminSettings = (): AdminSettings => {
  const settings = localStorage.getItem(ADMIN_SETTINGS_KEY);
  if (!settings) {
    return DEFAULT_ADMIN_SETTINGS;
  }
  
  try {
    return JSON.parse(settings);
  } catch {
    return DEFAULT_ADMIN_SETTINGS;
  }
};

export const saveAdminSettings = (settings: Partial<AdminSettings>): void => {
  const currentSettings = getAdminSettings();
  const updatedSettings = {
    ...currentSettings,
    ...settings,
    lastUpdated: new Date().toISOString(),
  };
  localStorage.setItem(ADMIN_SETTINGS_KEY, JSON.stringify(updatedSettings));
  
  // Trigger a custom event to notify other components
  window.dispatchEvent(new CustomEvent('adminSettingsChanged', { detail: updatedSettings }));
};

export const resetAdminSettings = (): void => {
  saveAdminSettings(DEFAULT_ADMIN_SETTINGS);
};

// Export data utilities
export interface GameData {
  id: string;
  name: string;
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
  date: string;
  status: string;
  players: any[];
}

export const getAllGames = (): GameData[] => {
  const gamesData = localStorage.getItem('games');
  if (!gamesData) return [];
  
  try {
    return JSON.parse(gamesData);
  } catch {
    return [];
  }
};

export const updateGameScore = (gameId: string, scoreA: number, scoreB: number): boolean => {
  const games = getAllGames();
  const gameIndex = games.findIndex(g => g.id === gameId);
  
  if (gameIndex === -1) return false;
  
  games[gameIndex] = {
    ...games[gameIndex],
    scoreA,
    scoreB,
  };
  
  localStorage.setItem('games', JSON.stringify(games));
  window.dispatchEvent(new CustomEvent('gameDataChanged'));
  return true;
};
