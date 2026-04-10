import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Plus, History, User, Trophy, TrendingUp, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { QuickGuide } from '../components/QuickGuide';
import { AnnouncementBanner } from '../components/AnnouncementBanner';
import { AppLogo } from '../components/AppLogo';
import { listGamesFirestore } from '../firestoreService';
import { Game } from '../types';

export default function DashboardScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGames = async () => {
      if (!user) {
        setGames([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const allGames = await listGamesFirestore(user.id);
        setGames(allGames);
      } catch (error) {
        console.error('Failed to load games:', error);
        setGames([]);
      } finally {
        setLoading(false);
      }
    };

    loadGames();
  }, [user]);

  const userGames = games;
  const activeGames = userGames.filter(g => g.status === 'live');
  const finishedGames = userGames.filter(g => g.status === 'finished');

  const stats = {
    totalGames: userGames.length,
    activeGames: activeGames.length,
    completedGames: finishedGames.length,
    totalPlayers: new Set(
      userGames.flatMap(g => g.players.map(p => p.id))
    ).size,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <QuickGuide />
      <AnnouncementBanner />
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex items-center justify-between">
            <div>
              <AppLogo className="mb-2" />
              <p className="text-sm text-gray-600">Welcome back, {user?.name}!</p>
            </div>
            <Button
              onClick={() => navigate('/profile')}
              variant="outline"
              size="icon"
              className="rounded-full"
            >
              <User className="size-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="size-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Trophy className="size-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalGames}</p>
                <p className="text-xs text-gray-600">Total Games</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="size-10 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="size-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.activeGames}</p>
                <p className="text-xs text-gray-600">Active Games</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="size-10 bg-purple-100 rounded-full flex items-center justify-center">
                <History className="size-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.completedGames}</p>
                <p className="text-xs text-gray-600">Completed</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="size-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Users className="size-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalPlayers}</p>
                <p className="text-xs text-gray-600">Total Players</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h2 className="font-semibold text-lg">Quick Actions</h2>
          
          <Button
            onClick={() => navigate('/game/setup')}
            className="w-full h-14 bg-black text-white hover:bg-gray-800 gap-2 justify-start px-6"
          >
            <Plus className="size-5" />
            <span>Start New Game</span>
          </Button>

          {activeGames.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm font-medium text-blue-900 mb-2">
                You have {activeGames.length} active {activeGames.length === 1 ? 'game' : 'games'}
              </p>
              <Button
                onClick={() => navigate(`/game/${activeGames[0].id}`)}
                variant="outline"
                size="sm"
                className="border-blue-300"
              >
                Continue Game
              </Button>
            </div>
          )}
        </div>

        {/* Recent Games */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">Recent Games</h2>
            <Button
              onClick={() => navigate('/history')}
              variant="ghost"
              size="sm"
            >
              View All
            </Button>
          </div>

          {userGames.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center">
              <Trophy className="size-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 mb-4">No games yet</p>
              <Button
                onClick={() => navigate('/game/setup')}
                variant="outline"
              >
                Create Your First Game
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {userGames.slice(0, 3).map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function GameCard({ game }: { game: Game }) {
  const navigate = useNavigate();
  const isLive = game.status === 'live';

  return (
    <div
      onClick={() => navigate(isLive ? `/game/${game.id}` : `/history`)}
      className="bg-white rounded-xl p-4 border border-gray-200 cursor-pointer hover:border-gray-300 transition-colors"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isLive && (
            <div className="size-2 bg-red-500 rounded-full animate-pulse"></div>
          )}
          <span className="text-sm font-medium text-gray-600">
            {isLive ? 'LIVE' : 'FINISHED'}
          </span>
        </div>
        <span className="text-xs text-gray-500">
          {new Date(game.createdAt).toLocaleDateString()}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="font-medium">{game.teamA.name}</p>
          <p className="text-xs text-gray-500">
            {game.players.filter(p => p.teamId === game.teamA.id).length} players
          </p>
        </div>
        
        <div className="px-4 py-2 bg-gray-50 rounded-lg">
          <span className="text-xl font-bold" style={{ color: game.teamA.color }}>
            {game.scoreA}
          </span>
          <span className="text-gray-400 mx-2">-</span>
          <span className="text-xl font-bold" style={{ color: game.teamB.color }}>
            {game.scoreB}
          </span>
        </div>

        <div className="flex-1 text-right">
          <p className="font-medium">{game.teamB.name}</p>
          <p className="text-xs text-gray-500">
            {game.players.filter(p => p.teamId === game.teamB.id).length} players
          </p>
        </div>
      </div>
    </div>
  );
}