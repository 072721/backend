// src/app/firestoreService.ts
// Service layer that uses backend API instead of Firebase SDK directly
import { gamesApi, Game as ApiGame, toFrontendGame } from "./utils/api";
import { Game } from "./types";

// Re-export types for backward compatibility
export type { Game };

function normalizeApiGame(game: ApiGame, userId: string): Game {
  const teamA =
    game.teamA ??
    (typeof game.homeTeam === "string"
      ? { id: "1", name: game.homeTeam, color: "#FF5733" }
      : { id: "1", name: "Team A", color: "#FF5733" });

  const teamB =
    game.teamB ??
    (typeof game.awayTeam === "string"
      ? { id: "2", name: game.awayTeam, color: "#33C3FF" }
      : { id: "2", name: "Team B", color: "#33C3FF" });

  const status =
    game.status === "live"
      ? "live"
      : game.status === "finished"
      ? "finished"
      : "setup";

  return {
    id: game.id,
    userId: game.userId || userId,
    teamA,
    teamB,
    players: game.players || [],
    stats: game.stats || [],
    scoreA: game.scoreA ?? game.homeScore ?? 0,
    scoreB: game.scoreB ?? game.awayScore ?? 0,
    status,
    createdAt: game.createdAt,
    finishedAt: game.finishedAt,
  };
}

// create a game via backend API
export async function createGameFirestore(
  userId: string,
  teamA: { id: string; name: string; color: string },
  teamB: { id: string; name: string; color: string }
): Promise<Game> {
  const game = await gamesApi.createGame(teamA, teamB);
  return normalizeApiGame(game, userId);
}

// get one game
export async function getGameFirestore(gameId: string): Promise<Game | null> {
  try {
    const game = await gamesApi.getGame(gameId);
    if (!game) return null;

    return normalizeApiGame(game, "");
  } catch (error) {
    console.error("Error fetching game:", error);
    return null;
  }
}

// update game
export async function updateGameFirestore(
  gameId: string,
  data: Partial<Game>
): Promise<Game | null> {
  const updateData: any = {};
  if (data.scoreA !== undefined) updateData.homeScore = data.scoreA;
  if (data.scoreB !== undefined) updateData.awayScore = data.scoreB;
  if (data.status) updateData.status = data.status;
  if (data.teamA) updateData.teamA = data.teamA;
  if (data.teamB) updateData.teamB = data.teamB;
  if (data.players) updateData.players = data.players;
  if (data.stats) updateData.stats = data.stats;
  if (data.finishedAt !== undefined) updateData.finishedAt = data.finishedAt;

  await gamesApi.updateGame(gameId, updateData);
  return getGameFirestore(gameId);
}

// list games for user
export async function listGamesFirestore(userId?: string): Promise<Game[]> {
  const games = await gamesApi.getAllGames();
  return games.map(game => normalizeApiGame(game, userId || ""));
}

export async function deleteGameFirestore(gameId: string): Promise<void> {
  await gamesApi.deleteGame(gameId);
}

// Add game event via backend API
export async function addGameEvent(
  gameId: string,
  event: { type: string; team: "HOME" | "AWAY"; player: string; points: number }
): Promise<{ homeScore: number; awayScore: number }> {
  return gamesApi.addEvent(gameId, {
    type: event.type,
    team: event.team,
    player: event.player,
    points: event.points
  });
}

// realtime listener (using polling as fallback since backend doesn't support websockets)
// Note: For production, consider adding WebSocket support to backend
export function subscribeGameFirestore(gameId: string, cb: (g: Game | null) => void) {
  // Poll every 2 seconds as a simple realtime alternative
  const intervalId = setInterval(async () => {
    const game = await getGameFirestore(gameId);
    cb(game);
  }, 2000);

  // Initial fetch
  getGameFirestore(gameId).then(cb);

  // Return cleanup function
  return () => clearInterval(intervalId);
}
