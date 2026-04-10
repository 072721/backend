export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

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
  userId: string;
  teamA: Team;
  teamB: Team;
  players: Player[];
  stats: PlayerStats[];
  scoreA: number;
  scoreB: number;
  status: 'setup' | 'live' | 'finished';
  createdAt: string;
  finishedAt?: string;
}

export interface AuthContextType {
  user: User | null;
  isGuest: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, password: string, name: string) => Promise<User>;
  loginAsGuest: () => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}
