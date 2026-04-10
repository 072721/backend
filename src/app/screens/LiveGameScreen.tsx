import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Minus, Plus, Trophy, Trash2, Flag, UserPlus, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { getGameFirestore, updateGameFirestore } from '../firestoreService';
import { Game, PlayerStats } from '../types';
import { toast } from 'sonner';

export default function LiveGameScreen() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);

  useEffect(() => {
    const loadGame = async () => {
      if (!gameId) return;

      const loadedGame = await getGameFirestore(gameId);
      if (loadedGame) {
        setGame(loadedGame);
      } else {
        toast.error('Game not found');
        navigate('/dashboard');
      }
    };

    loadGame();
  }, [gameId, navigate]);

  const saveGame = async (updatedGame: Game) => {
    setGame(updatedGame);
    try {
      const saved = await updateGameFirestore(updatedGame.id, updatedGame);
      if (saved) {
        setGame(saved);
      }
    } catch (error) {
      console.error('Failed to save game:', error);
      toast.error('Save failed');
    }
  };

  const updateStat = (playerId: string, stat: keyof Omit<PlayerStats, 'playerId' | 'playerName' | 'teamId' | 'teamName'>, delta: number) => {
    if (!game) return;

    const updatedStats = game.stats.map(s => {
      if (s.playerId === playerId) {
        const newValue = Math.max(0, s[stat] + delta);
        return { ...s, [stat]: newValue };
      }
      return s;
    });

    // Recalculate team scores from points
    const scoreA = updatedStats
      .filter(s => s.teamId === 'A')
      .reduce((sum, s) => sum + s.points, 0);
    const scoreB = updatedStats
      .filter(s => s.teamId === 'B')
      .reduce((sum, s) => sum + s.points, 0);

    const updatedGame = {
      ...game,
      stats: updatedStats,
      scoreA,
      scoreB,
    };

    saveGame(updatedGame);
  };

  const removePlayer = (playerId: string) => {
    if (!game) return;

    const updatedGame = {
      ...game,
      players: game.players.filter(p => p.id !== playerId),
      stats: game.stats.filter(s => s.playerId !== playerId),
    };

    saveGame(updatedGame);
    toast.success('Player removed');
  };

  const finishGame = async () => {
    if (!game) return;

    const updatedGame = {
      ...game,
      status: 'finished' as const,
      finishedAt: new Date().toISOString(),
    };

    await saveGame(updatedGame);
    toast.success('Game finished!');
    navigate('/history');
  };

  const [newPlayerName, setNewPlayerName] = useState('');
  const [addingToTeam, setAddingToTeam] = useState<string | null>(null);

  const addPlayer = (teamId: string) => {
    if (!game || !newPlayerName.trim()) return;

    const playerId = `player_${Date.now()}`;
    const newPlayer = {
      id: playerId,
      name: newPlayerName.trim(),
      teamId,
      teamName: teamId === 'A' ? game.teamA.name : game.teamB.name,
    };

    const newStat: PlayerStats = {
      playerId,
      playerName: newPlayerName.trim(),
      teamId,
      teamName: teamId === 'A' ? game.teamA.name : game.teamB.name,
      points: 0,
      rebounds: 0,
      assists: 0,
      fouls: 0,
    };

    const updatedGame = {
      ...game,
      players: [...game.players, newPlayer],
      stats: [...game.stats, newStat],
    };

    saveGame(updatedGame);
    setNewPlayerName('');
    setAddingToTeam(null);
    toast.success(`Added ${newPlayerName.trim()} to ${teamId === 'A' ? game.teamA.name : game.teamB.name}`);
  };

  const getTopPlayer = (teamId: string): PlayerStats | null => {
    const teamStats = game?.stats.filter(s => s.teamId === teamId) || [];
    if (teamStats.length === 0) return null;
    
    return teamStats.reduce((top, current) => {
      const topTotal = top.points + top.assists + top.rebounds;
      const currentTotal = current.points + current.assists + current.rebounds;
      return currentTotal > topTotal ? current : top;
    });
  };

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const teamAPlayers = game.players.filter(p => p.teamId === 'A');
  const teamBPlayers = game.players.filter(p => p.teamId === 'B');
  const topPlayerA = getTopPlayer('A');
  const topPlayerB = getTopPlayer('B');

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header with Score */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              onClick={() => navigate('/dashboard')}
              variant="ghost"
              size="sm"
            >
              ← Back
            </Button>
            <div className="flex items-center gap-2">
              <div className="size-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-600">LIVE</span>
            </div>
            <Button
              onClick={finishGame}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Flag className="size-4" />
              Finish
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <p className="font-medium text-sm text-gray-600 mb-1">{game.teamA.name}</p>
              <p className="text-4xl font-bold" style={{ color: game.teamA.color }}>
                {game.scoreA}
              </p>
            </div>
            <div className="px-6 text-2xl text-gray-400">-</div>
            <div className="text-center flex-1">
              <p className="font-medium text-sm text-gray-600 mb-1">{game.teamB.name}</p>
              <p className="text-4xl font-bold" style={{ color: game.teamB.color }}>
                {game.scoreB}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Team A Players */}
        {teamAPlayers.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-1 flex-1 rounded" style={{ backgroundColor: game.teamA.color }}></div>
              <h2 className="font-bold text-lg" style={{ color: game.teamA.color }}>
                {game.teamA.name}
              </h2>
              <div className="h-1 flex-1 rounded" style={{ backgroundColor: game.teamA.color }}></div>
            </div>

            <div className="space-y-3">
              {teamAPlayers.map((player) => {
                const stats = game.stats.find(s => s.playerId === player.id);
                const isTopPlayer = topPlayerA?.playerId === player.id;
                return (
                  <PlayerCard
                    key={player.id}
                    player={player}
                    stats={stats!}
                    teamColor={game.teamA.color}
                    isTopPlayer={isTopPlayer}
                    onUpdateStat={updateStat}
                    onRemove={removePlayer}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Add Player for Team A */}
        <div className="mt-4">
          {addingToTeam === 'A' ? (
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="font-semibold" style={{ color: game.teamA.color }}>
                  Add Player to {game.teamA.name}
                </span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  placeholder="Player name"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  onKeyDown={(e) => e.key === 'Enter' && addPlayer('A')}
                />
                <Button onClick={() => addPlayer('A')} size="sm">Add</Button>
                <Button onClick={() => { setAddingToTeam(null); setNewPlayerName(''); }} variant="ghost" size="sm">
                  <X className="size-4" />
                </Button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setAddingToTeam('A')}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-2"
            >
              <UserPlus className="size-5" />
              Add Player to {game.teamA.name}
            </button>
          )}
        </div>

        {/* Team B Players */}
        {teamBPlayers.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-1 flex-1 rounded" style={{ backgroundColor: game.teamB.color }}></div>
              <h2 className="font-bold text-lg" style={{ color: game.teamB.color }}>
                {game.teamB.name}
              </h2>
              <div className="h-1 flex-1 rounded" style={{ backgroundColor: game.teamB.color }}></div>
            </div>

            <div className="space-y-3">
              {teamBPlayers.map((player) => {
                const stats = game.stats.find(s => s.playerId === player.id);
                const isTopPlayer = topPlayerB?.playerId === player.id;
                return (
                  <PlayerCard
                    key={player.id}
                    player={player}
                    stats={stats!}
                    teamColor={game.teamB.color}
                    isTopPlayer={isTopPlayer}
                    onUpdateStat={updateStat}
                    onRemove={removePlayer}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Add Player for Team B */}
        <div className="mt-4">
          {addingToTeam === 'B' ? (
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="font-semibold" style={{ color: game.teamB.color }}>
                  Add Player to {game.teamB.name}
                </span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  placeholder="Player name"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                  onKeyDown={(e) => e.key === 'Enter' && addPlayer('B')}
                />
                <Button onClick={() => addPlayer('B')} size="sm">Add</Button>
                <Button onClick={() => { setAddingToTeam(null); setNewPlayerName(''); }} variant="ghost" size="sm">
                  <X className="size-4" />
                </Button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setAddingToTeam('B')}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-2"
            >
              <UserPlus className="size-5" />
              Add Player to {game.teamB.name}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

interface PlayerCardProps {
  player: { id: string; name: string; teamId: string };
  stats: PlayerStats;
  teamColor: string;
  isTopPlayer: boolean;
  onUpdateStat: (playerId: string, stat: keyof Omit<PlayerStats, 'playerId' | 'playerName' | 'teamId' | 'teamName'>, delta: number) => void;
  onRemove: (playerId: string) => void;
}

function PlayerCard({ player, stats, teamColor, isTopPlayer, onUpdateStat, onRemove }: PlayerCardProps) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-200">
      {/* Player Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className="size-3 rounded-full"
            style={{ backgroundColor: teamColor }}
          ></div>
          <span className="font-semibold">{stats.playerName}</span>
        </div>
        <div className="flex items-center gap-2">
          {isTopPlayer && (
            <div className="size-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <Trophy className="size-4 text-yellow-600" />
            </div>
          )}
          <Button
            onClick={() => onRemove(player.id)}
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatControl
          label="Points"
          value={stats.points}
          onIncrement={() => onUpdateStat(player.id, 'points', 1)}
          onDecrement={() => onUpdateStat(player.id, 'points', -1)}
        />
        <StatControl
          label="Rebounds"
          value={stats.rebounds}
          onIncrement={() => onUpdateStat(player.id, 'rebounds', 1)}
          onDecrement={() => onUpdateStat(player.id, 'rebounds', -1)}
        />
        <StatControl
          label="Assists"
          value={stats.assists}
          onIncrement={() => onUpdateStat(player.id, 'assists', 1)}
          onDecrement={() => onUpdateStat(player.id, 'assists', -1)}
        />
        <StatControl
          label="Fouls"
          value={stats.fouls}
          onIncrement={() => onUpdateStat(player.id, 'fouls', 1)}
          onDecrement={() => onUpdateStat(player.id, 'fouls', -1)}
        />
      </div>
    </div>
  );
}

interface StatControlProps {
  label: string;
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

function StatControl({ label, value, onIncrement, onDecrement }: StatControlProps) {
  return (
    <div className="bg-gray-50 rounded-xl p-3">
      <p className="text-xs text-gray-500 mb-2 uppercase">{label}</p>
      <div className="flex items-center justify-between gap-2">
        <Button
          onClick={onDecrement}
          variant="outline"
          size="sm"
          className="size-8 p-0 rounded-full"
        >
          <Minus className="size-4" />
        </Button>
        <span className="text-2xl font-bold min-w-[2ch] text-center">{value}</span>
        <Button
          onClick={onIncrement}
          variant="outline"
          size="sm"
          className="size-8 p-0 rounded-full"
        >
          <Plus className="size-4" />
        </Button>
      </div>
    </div>
  );
}
