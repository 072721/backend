import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { listGamesFirestore, deleteGameFirestore } from "../firestoreService";
import { Game, PlayerStats } from "../types";
import { Button } from "../components/ui/button";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  History, 
  Eye, 
  X, 
  Trophy,
  Award,
  Users
} from "lucide-react";

export default function GameHistoryScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [showModal, setShowModal] = useState(false);

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
        const sortedGames = allGames.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setGames(sortedGames);
      } catch (e) {
        console.error(e);
        setGames([]);
      } finally {
        setLoading(false);
      }
    };

    loadGames();
  }, [user]);

  const handleViewDetails = (game: Game) => {
    setSelectedGame(game);
    setShowModal(true);
  };

  const handleDelete = async (gameId: string) => {
    if (!confirm('Delete this game? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteGameFirestore(gameId);
      setGames((current) => current.filter((game) => game.id !== gameId));
      if (selectedGame?.id === gameId) {
        closeModal();
      }
    } catch (e) {
      console.error(e);
      alert('Failed to delete game');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedGame(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading games...</div>
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Game History</h1>
            <Button 
              onClick={() => navigate('/dashboard')}
              variant="outline"
              size="sm"
            >
              <ArrowLeft className="size-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          
          <div className="flex flex-col items-center justify-center py-16">
            <History className="size-16 text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No Games Yet</h2>
            <p className="text-gray-500 text-center">Start tracking your basketball games to see them here.</p>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown date';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  // Get players for a specific team
  const getTeamPlayers = (teamId: string) => {
    if (!selectedGame?.stats) return [];
    return selectedGame.stats
      .filter(stat => stat.teamId === teamId)
      .sort((a, b) => b.points - a.points);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Game History</h1>
          <Button 
            onClick={() => navigate('/dashboard')}
            variant="outline"
            size="sm"
          >
            <ArrowLeft className="size-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        
        <div className="space-y-4">
          {games.map((game) => (
            <div key={game.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="size-4" />
                  <span>{formatDate(game.createdAt)}</span>
                  <Clock className="size-4 ml-2" />
                  <span>{formatTime(game.createdAt)}</span>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  game.status === 'finished' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {game.status === 'finished' ? 'Completed' : 'Live'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-center flex-1">
                  <div 
                    className="text-lg font-bold"
                    style={{ color: game.teamA.color }}
                  >
                    {game.teamA.name}
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{game.scoreA}</div>
                </div>
                <div className="px-4 text-gray-400 font-medium">vs</div>
                <div className="text-center flex-1">
                  <div 
                    className="text-lg font-bold"
                    style={{ color: game.teamB.color }}
                  >
                    {game.teamB.name}
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{game.scoreB}</div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                {game.players && game.players.length > 0 && (
                  <p className="text-sm text-gray-500">
                    <Users className="size-4 inline mr-1" />
                    {game.players.length} player{game.players.length !== 1 ? 's' : ''} tracked
                  </p>
                )}
                <div className="flex items-center gap-2 ml-auto">
                  <Button
                    onClick={() => handleDelete(game.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:bg-red-50"
                  >
                    <X className="size-4 mr-1" />
                    Delete
                  </Button>
                  <Button 
                    onClick={() => handleViewDetails(game)}
                    variant="outline"
                    size="sm"
                  >
                    <Eye className="size-4 mr-1" />
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Game Details Modal */}
      {showModal && selectedGame && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Game Details</h2>
              <button 
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="size-5 text-gray-500" />
              </button>
            </div>

            {/* Game Summary */}
            <div className="p-4">
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                  <Calendar className="size-4" />
                  {formatDate(selectedGame.createdAt)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="size-4" />
                  {formatTime(selectedGame.createdAt)}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  selectedGame.status === 'finished' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {selectedGame.status === 'finished' ? 'Completed' : 'Live'}
                </span>
              </div>

              {/* Score Display */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div className="text-center flex-1">
                    <div 
                      className="text-2xl font-bold"
                      style={{ color: selectedGame.teamA.color }}
                    >
                      {selectedGame.teamA.name}
                    </div>
                    <div className="text-5xl font-bold text-gray-900 mt-2">{selectedGame.scoreA}</div>
                  </div>
                  <div className="px-6 text-gray-400 text-2xl font-medium">vs</div>
                  <div className="text-center flex-1">
                    <div 
                      className="text-2xl font-bold"
                      style={{ color: selectedGame.teamB.color }}
                    >
                      {selectedGame.teamB.name}
                    </div>
                    <div className="text-5xl font-bold text-gray-900 mt-2">{selectedGame.scoreB}</div>
                  </div>
                </div>
              </div>

              {/* Team A Players */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Trophy className="size-5" style={{ color: selectedGame.teamA.color }} />
                  <h3 className="font-bold text-lg" style={{ color: selectedGame.teamA.color }}>
                    {selectedGame.teamA.name} Players
                  </h3>
                </div>
                {getTeamPlayers('A').length === 0 ? (
                  <p className="text-gray-500 text-sm">No player stats recorded</p>
                ) : (
                  <div className="space-y-2">
                    {getTeamPlayers('A').map((stat, index) => (
                      <div key={stat.playerId} className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {index === 0 && <Award className="size-4 text-yellow-500" />}
                          <span className="font-medium text-gray-900">{stat.playerName}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="text-center">
                            <div className="font-bold text-lg">{stat.points}</div>
                            <div className="text-xs text-gray-500">PTS</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-lg">{stat.rebounds}</div>
                            <div className="text-xs text-gray-500">REB</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-lg">{stat.assists}</div>
                            <div className="text-xs text-gray-500">AST</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Team B Players */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Trophy className="size-5" style={{ color: selectedGame.teamB.color }} />
                  <h3 className="font-bold text-lg" style={{ color: selectedGame.teamB.color }}>
                    {selectedGame.teamB.name} Players
                  </h3>
                </div>
                {getTeamPlayers('B').length === 0 ? (
                  <p className="text-gray-500 text-sm">No player stats recorded</p>
                ) : (
                  <div className="space-y-2">
                    {getTeamPlayers('B').map((stat, index) => (
                      <div key={stat.playerId} className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {index === 0 && <Award className="size-4 text-yellow-500" />}
                          <span className="font-medium text-gray-900">{stat.playerName}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="text-center">
                            <div className="font-bold text-lg">{stat.points}</div>
                            <div className="text-xs text-gray-500">PTS</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-lg">{stat.rebounds}</div>
                            <div className="text-xs text-gray-500">REB</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-lg">{stat.assists}</div>
                            <div className="text-xs text-gray-500">AST</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
              <Button 
                onClick={closeModal}
                variant="outline"
                className="w-full"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}