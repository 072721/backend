import { useState, useEffect } from 'react';
import { getAdminSettings, AdminSettings } from '../utils/adminStorage';

/**
 * Hook to listen for admin settings changes
 * This allows the UI to reactively update when admin changes branding/settings
 */
export function useAdminSettings() {
  const [settings, setSettings] = useState<AdminSettings>(getAdminSettings());

  // Apply colors to CSS variables
  const applyColorsToCSS = (adminSettings: AdminSettings) => {
    const root = document.documentElement;
    if (adminSettings.primaryColor) {
      root.style.setProperty('--admin-primary-color', adminSettings.primaryColor);
    }
    if (adminSettings.teamAColor) {
      root.style.setProperty('--admin-team-a-color', adminSettings.teamAColor);
    }
    if (adminSettings.teamBColor) {
      root.style.setProperty('--admin-team-b-color', adminSettings.teamBColor);
    }
  };

  useEffect(() => {
    // Listen for custom events when admin saves settings
    const handleSettingsChange = (event: CustomEvent) => {
      setSettings(event.detail);
      applyColorsToCSS(event.detail);
    };

    window.addEventListener('adminSettingsChanged', handleSettingsChange as EventListener);

    // Check for settings on mount and apply colors
    const initialSettings = getAdminSettings();
    setSettings(initialSettings);
    applyColorsToCSS(initialSettings);

    return () => {
      window.removeEventListener('adminSettingsChanged', handleSettingsChange as EventListener);
    };
  }, []);

  return settings;
}
