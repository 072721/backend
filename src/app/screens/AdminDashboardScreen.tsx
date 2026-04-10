import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  Shield, 
  LogOut, 
  Palette, 
  Upload, 
  Megaphone, 
  Database,
  Download,
  RefreshCw,
  Save,
  X,
  Check,
  FileText,
  Settings
} from 'lucide-react';
import { 
  adminLogout, 
  getAdminSettings, 
  saveAdminSettings,
  AdminSettings 
} from '../utils/adminStorage';
import { listGamesFirestore, updateGameFirestore } from '../firestoreService';
import { Game } from '../types';

export default function AdminDashboardScreen() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<AdminSettings>(getAdminSettings());
  const [games, setGames] = useState<Game[]>([]);
  const [activeTab, setActiveTab] = useState<'branding' | 'system'>('branding');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  
  // Branding states
  const [primaryColor, setPrimaryColor] = useState(settings.primaryColor);
  const [teamAColor, setTeamAColor] = useState(settings.teamAColor);
  const [teamBColor, setTeamBColor] = useState(settings.teamBColor);
  const [announcement, setAnnouncement] = useState(settings.announcementBanner);
  const [announcementBannerColor, setAnnouncementBannerColor] = useState(settings.announcementBannerColor || '#f59e0b');
  const [logoPreview, setLogoPreview] = useState<string | null>(settings.logoUrl);

  // Preset color options
  const bannerColorOptions = [
    { name: 'Amber', color: '#f59e0b' },
    { name: 'Red', color: '#ef4444' },
    { name: 'Blue', color: '#3b82f6' },
    { name: 'Green', color: '#22c55e' },
    { name: 'Purple', color: '#a855f7' },
    { name: 'Pink', color: '#ec4899' },
    { name: 'Orange', color: '#f97316' },
    { name: 'Teal', color: '#14b8a6' },
  ];

  // Force sync state
  const [editingGame, setEditingGame] = useState<string | null>(null);
  const [tempScoreA, setTempScoreA] = useState<number>(0);
  const [tempScoreB, setTempScoreB] = useState<number>(0);

  useEffect(() => {
    const loadGames = async () => {
      try {
        const allGames = await listGamesFirestore();
        setGames(allGames);
      } catch (error) {
        console.error('Failed to load admin games:', error);
        setGames([]);
      }
    };

    loadGames();
  }, []);

  const handleRefreshGames = async () => {
    try {
      const allGames = await listGamesFirestore();
      setGames(allGames);
    } catch (error) {
      console.error('Failed to refresh games:', error);
    }
  };

  const handleLogout = () => {
    adminLogout();
    navigate('/admin');
  };

  const handleSaveSettings = () => {
    setSaveStatus('saving');
    
    const newSettings: Partial<AdminSettings> = {
      primaryColor,
      teamAColor,
      teamBColor,
      announcementBanner: announcement,
      announcementBannerColor: announcementBannerColor,
      logoUrl: logoPreview,
    };

    saveAdminSettings(newSettings);
    setSettings({ ...settings, ...newSettings });

    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 500);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setLogoPreview(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
  };

  const handleExportPDF = () => {
    // Create an HTML report that can be printed as PDF
    const reportHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Basketball Stats Report</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; }
          h1 { color: #1e40af; margin-bottom: 10px; }
          .meta { color: #666; margin-bottom: 30px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background: #3b82f6; color: white; padding: 12px; text-align: left; }
          td { border: 1px solid #ddd; padding: 10px; }
          tr:nth-child(even) { background: #f9fafb; }
          .total { margin-top: 20px; font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>🏀 Basketball Stats Report</h1>
        <div class="meta">Generated: ${new Date().toLocaleString()}</div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Game</th>
              <th>Team A</th>
              <th>Score</th>
              <th>Team B</th>
              <th>Score</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            ${games.map((game, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${game.teamA.name} vs ${game.teamB.name}</td>
                <td>${game.teamA.name}</td>
                <td><strong>${game.scoreA}</strong></td>
                <td>${game.teamB.name}</td>
                <td><strong>${game.scoreB}</strong></td>
                <td>${game.status}</td>
                <td>${new Date(game.createdAt).toLocaleDateString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="total">Total Games: ${games.length}</div>
        <script>window.print();</script>
      </body>
      </html>
    `;

    // Open in new window and trigger print
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(reportHTML);
      printWindow.document.close();
    }
  };

  const handleExportCSV = () => {
    // Create CSV content
    const headers = ['Game', 'Team A', 'Score A', 'Team B', 'Score B', 'Status', 'Date'];
    const rows = games.map(game => [
      `${game.teamA.name} vs ${game.teamB.name}`,
      game.teamA.name,
      game.scoreA,
      game.teamB.name,
      game.scoreB,
      game.status,
      new Date(game.createdAt).toLocaleDateString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `basketball-stats-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleStartEditScore = (game: any) => {
    setEditingGame(game.id);
    setTempScoreA(game.scoreA || 0);
    setTempScoreB(game.scoreB || 0);
  };

  const handleSaveScore = async (gameId: string) => {
    const currentGame = games.find((g) => g.id === gameId);
    if (!currentGame) return;

    const updatedGame = {
      ...currentGame,
      scoreA: tempScoreA,
      scoreB: tempScoreB,
    };

    try {
      await updateGameFirestore(gameId, updatedGame);
      setGames((prevGames) => prevGames.map((g) => g.id === gameId ? updatedGame : g));
      setEditingGame(null);
    } catch (error) {
      console.error('Failed to save score:', error);
      alert('Unable to save score');
    }
  };

  const handleCancelEdit = () => {
    setEditingGame(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-purple-500/20 p-2 rounded-lg">
                <Shield className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Admin Control Panel</h1>
                <p className="text-sm text-purple-200/70">Full system control & management</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-red-200 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('branding')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'branding'
                ? 'bg-purple-500 text-white shadow-lg'
                : 'bg-white/10 text-purple-200 hover:bg-white/20'
            }`}
          >
            <Palette className="w-5 h-5" />
            Branding & Interface
          </button>
          <button
            onClick={() => setActiveTab('system')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'system'
                ? 'bg-purple-500 text-white shadow-lg'
                : 'bg-white/10 text-purple-200 hover:bg-white/20'
            }`}
          >
            <Settings className="w-5 h-5" />
            System Overrides
          </button>
        </div>

        {/* Branding Tab */}
        {activeTab === 'branding' && (
          <div className="space-y-6">
            {/* Theme Colors */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-purple-500/20 p-2 rounded-lg">
                  <Palette className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Theme Color Control</h2>
                  <p className="text-sm text-purple-200/70">Change colors for all users</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    Primary Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-16 h-12 rounded-lg cursor-pointer border-2 border-white/20"
                    />
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                    />
                  </div>
                  <p className="text-xs text-purple-200/50 mt-1">Used for buttons, links, highlights</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    Team A Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={teamAColor}
                      onChange={(e) => setTeamAColor(e.target.value)}
                      className="w-16 h-12 rounded-lg cursor-pointer border-2 border-white/20"
                    />
                    <input
                      type="text"
                      value={teamAColor}
                      onChange={(e) => setTeamAColor(e.target.value)}
                      className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                    />
                  </div>
                  <p className="text-xs text-purple-200/50 mt-1">Used for Team A in games</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    Team B Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={teamBColor}
                      onChange={(e) => setTeamBColor(e.target.value)}
                      className="w-16 h-12 rounded-lg cursor-pointer border-2 border-white/20"
                    />
                    <input
                      type="text"
                      value={teamBColor}
                      onChange={(e) => setTeamBColor(e.target.value)}
                      className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                    />
                  </div>
                  <p className="text-xs text-purple-200/50 mt-1">Used for Team B in games</p>
                </div>
              </div>

              {/* Color Preview */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <h3 className="text-sm font-medium text-purple-200 mb-3">Preview</h3>
                <div className="bg-white rounded-xl p-4">
                  <div className="flex items-center gap-4">
                    <button
                      className="px-4 py-2 rounded-lg text-white text-sm font-medium"
                      style={{ backgroundColor: primaryColor }}
                    >
                      Primary Button
                    </button>
                    <div 
                      className="px-4 py-2 rounded-lg text-white text-sm font-medium"
                      style={{ backgroundColor: teamAColor }}
                    >
                      Team A
                    </div>
                    <div 
                      className="px-4 py-2 rounded-lg text-white text-sm font-medium"
                      style={{ backgroundColor: teamBColor }}
                    >
                      Team B
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Logo Upload */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-purple-500/20 p-2 rounded-lg">
                  <Upload className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">League Logo</h2>
                  <p className="text-sm text-purple-200/70">Upload your league or team logo</p>
                </div>
              </div>

              <div className="space-y-4">
                {logoPreview ? (
                  <div className="relative inline-block">
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="w-32 h-32 object-contain bg-white/5 rounded-lg border border-white/20"
                    />
                    <button
                      onClick={handleRemoveLogo}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="inline-flex flex-col items-center justify-center w-full max-w-xs h-32 border-2 border-dashed border-purple-400/50 rounded-lg cursor-pointer hover:bg-purple-500/10 transition-colors">
                    <Upload className="w-8 h-8 text-purple-400 mb-2" />
                    <span className="text-sm text-purple-200">Click to upload logo</span>
                    <span className="text-xs text-purple-200/50 mt-1">PNG, JPG (max 2MB)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Announcement Banner */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-purple-500/20 p-2 rounded-lg">
                  <Megaphone className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Announcement Banner</h2>
                  <p className="text-sm text-purple-200/70">Show a message to all users</p>
                </div>
              </div>

              {/* Color Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  Banner Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {bannerColorOptions.map((option) => (
                    <button
                      key={option.color}
                      onClick={() => setAnnouncementBannerColor(option.color)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        announcementBannerColor === option.color
                          ? 'border-white scale-110'
                          : 'border-transparent hover:scale-105'
                      }`}
                      style={{ backgroundColor: option.color }}
                      title={option.name}
                    />
                  ))}
                </div>
              </div>

              <textarea
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
                placeholder="e.g., Game 2 starts at 5 PM!"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows={3}
              />
              
              {announcement && (
                <div 
                  className="mt-4 p-3 border rounded-lg text-white text-sm"
                  style={{ backgroundColor: `${announcementBannerColor}33`, borderColor: announcementBannerColor }}
                >
                  <strong>Preview:</strong> {announcement}
                </div>
              )}
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSaveSettings}
                disabled={saveStatus === 'saving'}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg font-semibold hover:from-green-700 hover:to-green-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {saveStatus === 'saving' ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : saveStatus === 'saved' ? (
                  <>
                    <Check className="w-5 h-5" />
                    Settings Saved!
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save All Settings
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* System Overrides Tab */}
        {activeTab === 'system' && (
          <div className="space-y-6">
            {/* Export Data */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-purple-500/20 p-2 rounded-lg">
                  <Download className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Export All Data</h2>
                  <p className="text-sm text-purple-200/70">Download complete statistics report</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleExportPDF}
                  className="flex items-center gap-2 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-red-200 transition-colors font-semibold"
                >
                  <FileText className="w-5 h-5" />
                  Export as PDF
                </button>
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-2 px-6 py-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 rounded-lg text-green-200 transition-colors font-semibold"
                >
                  <Database className="w-5 h-5" />
                  Export as CSV (Excel)
                </button>
              </div>

              <div className="mt-4 text-sm text-purple-200/70">
                Total games in system: <strong>{games.length}</strong>
              </div>
            </div>

            {/* Force Sync / Override Scores */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-purple-500/20 p-2 rounded-lg">
                  <RefreshCw className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Force Sync / Override Scores</h2>
                  <p className="text-sm text-purple-200/70">Manually adjust game scores if system hangs</p>
                </div>
              </div>

              <div className="space-y-3">
                {games.length === 0 ? (
                  <div className="text-center py-8 text-purple-200/50">
                    No games available
                  </div>
                ) : (
                  games.map((game) => (
                    <div
                      key={game.id}
                      className="bg-white/5 border border-white/10 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-white">{game.teamA.name} vs {game.teamB.name}</h3>
                          <p className="text-xs text-purple-200/50">
                            {new Date(game.createdAt).toLocaleString()} • {game.status}
                          </p>
                        </div>
                        {editingGame === game.id ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSaveScore(game.id)}
                              className="flex items-center gap-1 px-3 py-1 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 rounded text-green-200 text-sm transition-colors"
                            >
                              <Check className="w-4 h-4" />
                              Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="flex items-center gap-1 px-3 py-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded text-red-200 text-sm transition-colors"
                            >
                              <X className="w-4 h-4" />
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleStartEditScore(game)}
                            className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 rounded-lg text-purple-200 text-sm transition-colors"
                          >
                            Override
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                          <div className="text-xs text-blue-200/70 mb-1">Team A</div>
                          <div className="font-bold text-blue-200">{game.teamA.name}</div>
                          {editingGame === game.id ? (
                            <input
                              type="number"
                              value={tempScoreA}
                              onChange={(e) => setTempScoreA(parseInt(e.target.value) || 0)}
                              className="w-full mt-2 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-lg font-bold"
                            />
                          ) : (
                            <div className="text-2xl font-bold text-white mt-1">{game.scoreA}</div>
                          )}
                        </div>

                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                          <div className="text-xs text-red-200/70 mb-1">Team B</div>
                          <div className="font-bold text-red-200">{game.teamB.name}</div>
                          {editingGame === game.id ? (
                            <input
                              type="number"
                              value={tempScoreB}
                              onChange={(e) => setTempScoreB(parseInt(e.target.value) || 0)}
                              className="w-full mt-2 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-lg font-bold"
                            />
                          ) : (
                            <div className="text-2xl font-bold text-white mt-1">{game.scoreB}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}