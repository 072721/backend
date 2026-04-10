import React from 'react';
import { useAdminSettings } from '../hooks/useAdminSettings';
import { Trophy } from 'lucide-react';

interface AppLogoProps {
  className?: string;
  showFallback?: boolean;
}

export function AppLogo({ className = '', showFallback = true }: AppLogoProps) {
  const settings = useAdminSettings();

  if (settings.logoUrl) {
    return (
      <img
        src={settings.logoUrl}
        alt="App Logo"
        className={`object-contain ${className}`}
      />
    );
  }

  if (showFallback) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Trophy className="w-6 h-6" />
        <span className="font-bold">Basketball Tracker</span>
      </div>
    );
  }

  return null;
}
