import React from 'react';
import { Megaphone, X } from 'lucide-react';
import { useAdminSettings } from '../hooks/useAdminSettings';

export function AnnouncementBanner() {
  const settings = useAdminSettings();
  const [isDismissed, setIsDismissed] = React.useState(false);

  // Reset dismissed state when announcement changes
  React.useEffect(() => {
    setIsDismissed(false);
  }, [settings.announcementBanner, settings.announcementBannerColor]);

  if (!settings.announcementBanner || isDismissed) {
    return null;
  }

  // Generate a lighter version of the color for gradient
  const bannerColor = settings.announcementBannerColor || '#f59e0b';
  
  return (
    <div 
      className="text-white"
      style={{ backgroundColor: bannerColor }}
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <Megaphone className="w-5 h-5 flex-shrink-0" />
            <p className="font-medium text-sm sm:text-base">{settings.announcementBanner}</p>
          </div>
          <button
            onClick={() => setIsDismissed(true)}
            className="flex-shrink-0 p-1 hover:bg-white/20 rounded transition-colors"
            aria-label="Dismiss announcement"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
