// src/app/utils/api.ts
// Frontend API client to communicate with backend server

const API_BASE_URL = (
  (import.meta as unknown as { env: { VITE_API_URL?: string } }).env.VITE_API_URL || ""
);

// Token storage
const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Frontend Game type (same as src/app/types/index.ts Game)
export interface Team {
  id: string;
  name: string;
  color: string;
}

export interface Player {
  id: string;
  name: string;
  teamId: string;
  teamName: string;
}

export interface PlayerStats {
  playerId: string;
  playerName: string;
  teamId: string;
  teamName: string;
  points: number;
  rebounds: number;
  assists: number;
  fouls: number;
}

export interface Game {
  id: string;
  userId?: string;
  ownerId?: string;
  teamA?: Team;
  teamB?: Team;
  homeTeam?: Team | string;
  awayTeam?: Team | string;
  players?: Player[];
  stats?: PlayerStats[];
  scoreA?: number;
  scoreB?: number;
  homeScore?: number;
  awayScore?: number;
  status?: 'setup' | 'live' | 'finished' | 'SCHEDULED';
  events?: GameEvent[];
  createdAt: string;
  finishedAt?: string;
}

export interface GameEvent {
  type: string;
  team: string;
  player: string;
  points: number;
  at: string;
}

// Helper to convert API game to frontend game format
export function toFrontendGame(apiGame: Game): Game {
  // Handle different formats from API
  let teamA: Team;
  let teamB: Team;
  let scoreA: number;
  let scoreB: number;

  // Handle string team names (from backend)
  if (typeof apiGame.homeTeam === 'string') {
    teamA = { id: '1', name: apiGame.homeTeam, color: '#FF5733' };
  } else if (apiGame.teamA) {
    teamA = apiGame.teamA;
  } else {
    teamA = { id: '1', name: 'Team A', color: '#FF5733' };
  }

  if (typeof apiGame.awayTeam === 'string') {
    teamB = { id: '2', name: apiGame.awayTeam, color: '#33C3FF' };
  } else if (apiGame.teamB) {
    teamB = apiGame.teamB;
  } else {
    teamB = { id: '2', name: 'Team B', color: '#33C3FF' };
  }

  scoreA = apiGame.homeScore ?? apiGame.scoreA ?? 0;
  scoreB = apiGame.awayScore ?? apiGame.scoreB ?? 0;

  // Map SCHEDULED to setup
  let status: 'setup' | 'live' | 'finished' = 'setup';
  if (apiGame.status === 'live') status = 'live';
  else if (apiGame.status === 'finished') status = 'finished';

  return {
    id: apiGame.id,
    userId: apiGame.userId || apiGame.ownerId,
    ownerId: apiGame.ownerId,
    teamA,
    teamB,
    players: apiGame.players || [],
    stats: apiGame.stats || [],
    scoreA,
    scoreB,
    status,
    events: apiGame.events || [],
    createdAt: apiGame.createdAt,
    finishedAt: apiGame.finishedAt,
  };
}

// Get stored token
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

// Get stored user
export function getStoredUser(): User | null {
  const userStr = localStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
}

// Generic fetch wrapper with auth
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: "include",
    });
  } catch (error) {
    throw new Error("Network error: could not reach backend server");
  }

  if (!response.ok) {
    let errorMessage = "Request failed";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || `HTTP ${response.status}`;
    } catch {
      errorMessage = `HTTP ${response.status}`;
    }
    const error = new Error(errorMessage);
    (error as any).response = { status: response.status, data: {} };
    throw error;
  }

  return response.json();
}

// Auth API
export const authApi = {
  register: async (email: string, password: string, name: string): Promise<AuthResponse> => {
    const response = await fetchApi<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    });
    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    return response;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await fetchApi<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    return response;
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getCurrentUser: (): User | null => {
    return getStoredUser();
  },

  isAuthenticated: (): boolean => {
    return !!getToken();
  },
};

// Games API
export const gamesApi = {
  createGame: async (
    teamA: { id: string; name: string; color: string },
    teamB: { id: string; name: string; color: string }
  ): Promise<Game> => {
    const response = await fetchApi<Game>("/api/games", {
      method: "POST",
      body: JSON.stringify({ 
        homeTeam: teamA.name, 
        awayTeam: teamB.name,
        teamA,
        teamB
      }),
    });
    return toFrontendGame(response);
  },

  getAllGames: async (): Promise<Game[]> => {
    const games = await fetchApi<Game[]>("/api/games");
    return games.map(toFrontendGame);
  },

  getGame: async (gameId: string): Promise<Game> => {
    const response = await fetchApi<Game>(`/api/games/${gameId}`);
    return toFrontendGame(response);
  },

  updateGame: async (
    gameId: string,
    data: {
      homeScore?: number;
      awayScore?: number;
      status?: string;
      players?: Player[];
      stats?: PlayerStats[];
      teamA?: Team;
      teamB?: Team;
      finishedAt?: string | null;
    }
  ): Promise<{ message: string }> => {
    return fetchApi<{ message: string }>(`/api/games/${gameId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  deleteGame: async (gameId: string): Promise<{ message: string }> => {
    return fetchApi<{ message: string }>(`/api/games/${gameId}`, {
      method: "DELETE",
    });
  },

  addEvent: async (
    gameId: string,
    event: { type: string; team: string; player: string; points: number }
  ): Promise<{ message: string; homeScore: number; awayScore: number }> => {
    return fetchApi<{ message: string; homeScore: number; awayScore: number }>(
      `/api/games/${gameId}/events`,
      {
        method: "POST",
        body: JSON.stringify(event),
      }
    );
  },
};
