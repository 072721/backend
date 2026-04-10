import { Game } from '../types';

const GAMES_KEY = 'basketball_stats_games';

export const storage = {
  saveGame: (game: Game): void => {
    try {
      const games = storage.getAllGames();
      const index = games.findIndex(g => g.id === game.id);
      if (index >= 0) {
        games[index] = game;
      } else {
        games.push(game);
      }
      localStorage.setItem(GAMES_KEY, JSON.stringify(games));
    } catch (e) {
      console.error('Failed to save game:', e);
    }
  },

  getGame: (gameId: string): Game | null => {
    try {
      const games = storage.getAllGames();
      return games.find(g => g.id === gameId) || null;
    } catch (e) {
      console.error('Failed to get game:', e);
      return null;
    }
  },

  getGames: (userId: string | null): Game[] => {
    try {
      const games = storage.getAllGames();
      if (!userId) return games;
      return games.filter(g => g.userId === userId);
    } catch (e) {
      console.error('Failed to get games:', e);
      return [];
    }
  },

  getAllGames: (): Game[] => {
    try {
      const data = localStorage.getItem(GAMES_KEY);
      if (!data) return [];
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to get games:', e);
      return [];
    }
  },

  deleteGame: (gameId: string): void => {
    try {
      const games = storage.getAllGames().filter(g => g.id !== gameId);
      localStorage.setItem(GAMES_KEY, JSON.stringify(games));
    } catch (e) {
      console.error('Failed to delete game:', e);
    }
  },

  clearAll: (): void => {
    try {
      localStorage.removeItem(GAMES_KEY);
    } catch (e) {
      console.error('Failed to clear games:', e);
    }
  }
};
