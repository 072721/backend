import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { User, LogOut, Trophy, Calendar, TrendingUp, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { listGamesFirestore } from '../firestoreService';
import { Game } from '../types';

export default function ProfileScreen() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [games, setGames] = useState<Game[]>([]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    const loadGames = async () => {
      if (!user) {
        setGames([]);
        return;
      }

      try {
        const allGames = await listGamesFirestore(user.id);
        setGames(allGames);
      } catch (error) {
        console.error('Failed to load profile games:', error);
        setGames([]);
      }
    };

    loadGames();
  }, [user]);

  const finishedGames = games.filter(g => g.status === 'finished');
  const totalPoints = games.reduce((sum, game) => {
    return sum + game.stats.reduce((s, stat) => s + stat.points, 0);
  }, 0);

  const stats = {
    totalGames: games.length,
    completedGames: finishedGames.length,
    totalPoints,
    avgPointsPerGame: games.length > 0 ? Math.round(totalPoints / games.length) : 0,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="size-6" />
              <h1 className="text-xl font-bold">Profile</h1>
            </div>
            <Button
              onClick={() => navigate('/dashboard')}
              variant="ghost"
              size="sm"
            >
              Dashboard
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* User Info Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center gap-4 mb-6">
            <div className="size-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user?.name}</h2>
              <div className="flex items-center gap-2 text-gray-600 mt-1">
                <Mail className="size-4" />
                <p className="text-sm">{user?.email}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="size-3" />
            <span>
              Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </span>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="size-5" />
            Your Statistics
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="size-5 text-blue-600" />
                <p className="text-sm text-blue-900 font-medium">Total Games</p>
              </div>
              <p className="text-3xl font-bold text-blue-900">{stats.totalGames}</p>
            </div>

            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="size-5 text-green-600" />
                <p className="text-sm text-green-900 font-medium">Completed</p>
              </div>
              <p className="text-3xl font-bold text-green-900">{stats.completedGames}</p>
            </div>

            <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="size-5 text-purple-600" />
                <p className="text-sm text-purple-900 font-medium">Total Points</p>
              </div>
              <p className="text-3xl font-bold text-purple-900">{stats.totalPoints}</p>
            </div>

            <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="size-5 text-orange-600" />
                <p className="text-sm text-orange-900 font-medium">Avg/Game</p>
              </div>
              <p className="text-3xl font-bold text-orange-900">{stats.avgPointsPerGame}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={() => navigate('/game/setup')}
            className="w-full h-12 bg-black hover:bg-gray-800"
          >
            Start New Game
          </Button>

          <Button
            onClick={() => navigate('/history')}
            variant="outline"
            className="w-full h-12"
          >
            View Game History
          </Button>

          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full h-12 text-red-600 border-red-300 hover:bg-red-50 gap-2"
          >
            <LogOut className="size-4" />
            Logout
          </Button>
        </div>

        {/* App Info */}
        <div className="bg-gray-100 rounded-2xl p-6 text-center">
          <p className="text-sm text-gray-600 italic mb-2">
            "Every play matters. Every stat counts."
          </p>
          <p className="text-xs text-gray-500">
            Basketball Stats Tracker v1.0
          </p>
        </div>
      </div>
    </div>
  );
}
