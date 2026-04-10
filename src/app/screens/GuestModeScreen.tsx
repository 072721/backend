import { useNavigate } from 'react-router';
import { LogIn, CheckCircle, Lock, BarChart3 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';
import { AnnouncementBanner } from '../components/AnnouncementBanner';

const demoPlayers = [
  { name: 'LeBron James', points: 27, assists: 8, rebounds: 7 },
  { name: 'Stephen Curry', points: 32, assists: 6, rebounds: 5 },
  { name: 'Kevin Durant', points: 29, assists: 5, rebounds: 7 },
  { name: 'Giannis Antetokounmpo', points: 31, assists: 6, rebounds: 12 },
];

export default function GuestModeScreen() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogin = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      <AnnouncementBanner />
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-2 bg-orange-500 rounded-full animate-pulse"></div>
            <h1 className="font-semibold">Guest Mode</h1>
          </div>
          <Button
            onClick={handleLogin}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <LogIn className="size-4" />
            Login
          </Button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Success Cards */}
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="size-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <h3 className="font-medium text-green-900">View Demo Stats</h3>
                <p className="text-sm text-green-700 mt-1">
                  Explore sample player statistics
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="size-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <h3 className="font-medium text-green-900">Explore Features</h3>
                <p className="text-sm text-green-700 mt-1">
                  Test all app functionality
                </p>
              </div>
            </div>
          </div>

          {/* Warning Cards */}
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <Lock className="size-5 text-red-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-red-900">Limited Access</h3>
                <p className="text-sm text-red-700 mt-1">
                  Cannot save custom games
                </p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <Lock className="size-5 text-red-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-red-900">No Data Persistence</h3>
                <p className="text-sm text-red-700 mt-1">
                  Data resets on logout
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Player Stats Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="size-5 text-gray-700" />
            <h2 className="text-lg font-semibold">Demo Player Stats</h2>
          </div>

          <div className="space-y-4">
            {demoPlayers.map((player, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-4 border border-gray-100"
              >
                <h3 className="font-medium mb-4">{player.name}</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">POINTS</p>
                    <p className="text-2xl font-bold">{player.points}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">ASSISTS</p>
                    <p className="text-2xl font-bold">{player.assists}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">REBOUNDS</p>
                    <p className="text-2xl font-bold">{player.rebounds}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-gray-900 text-white rounded-2xl p-8 text-center">
          <h3 className="text-xl font-semibold mb-2">
            Want to track your own stats?
          </h3>
          <p className="text-gray-400 mb-6">
            Create an account to save games and track unlimited players
          </p>
          <Button
            onClick={handleLogin}
            className="bg-white text-black hover:bg-gray-100 h-12 px-8"
          >
            Create an Account
          </Button>
        </div>
      </div>
    </div>
  );
}