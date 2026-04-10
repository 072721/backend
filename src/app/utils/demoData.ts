import { Game } from '../types';

export const DEMO_PLAYERS = [
  { name: 'LeBron James', points: 27, assists: 8, rebounds: 7 },
  { name: 'Stephen Curry', points: 32, assists: 6, rebounds: 5 },
  { name: 'Kevin Durant', points: 29, assists: 5, rebounds: 7 },
  { name: 'Giannis Antetokounmpo', points: 31, assists: 6, rebounds: 12 },
  { name: 'Luka Dončić', points: 28, assists: 9, rebounds: 8 },
  { name: 'Nikola Jokić', points: 24, assists: 10, rebounds: 11 },
  { name: 'Joel Embiid', points: 33, assists: 4, rebounds: 10 },
  { name: 'Jayson Tatum', points: 26, assists: 5, rebounds: 8 },
];

export function generateDemoGame(): Game {
  const demoGame: Game = {
    id: 'demo_game_1',
    userId: 'demo',
    teamA: {
      id: 'A',
      name: 'Lakers',
      color: '#2563eb',
    },
    teamB: {
      id: 'B',
      name: 'Bulls',
      color: '#dc2626',
    },
    players: [
      {
        id: 'player_1',
        name: 'LeBron James',
        teamId: 'A',
        teamName: 'Lakers',
      },
      {
        id: 'player_2',
        name: 'Anthony Davis',
        teamId: 'A',
        teamName: 'Lakers',
      },
      {
        id: 'player_3',
        name: 'DeMar DeRozan',
        teamId: 'B',
        teamName: 'Bulls',
      },
      {
        id: 'player_4',
        name: 'Zach LaVine',
        teamId: 'B',
        teamName: 'Bulls',
      },
    ],
    stats: [
      {
        playerId: 'player_1',
        playerName: 'LeBron James',
        teamId: 'A',
        teamName: 'Lakers',
        points: 27,
        rebounds: 7,
        assists: 8,
        fouls: 2,
      },
      {
        playerId: 'player_2',
        playerName: 'Anthony Davis',
        teamId: 'A',
        teamName: 'Lakers',
        points: 22,
        rebounds: 11,
        assists: 3,
        fouls: 3,
      },
      {
        playerId: 'player_3',
        playerName: 'DeMar DeRozan',
        teamId: 'B',
        teamName: 'Bulls',
        points: 24,
        rebounds: 5,
        assists: 6,
        fouls: 1,
      },
      {
        playerId: 'player_4',
        playerName: 'Zach LaVine',
        teamId: 'B',
        teamName: 'Bulls',
        points: 19,
        rebounds: 4,
        assists: 4,
        fouls: 2,
      },
    ],
    scoreA: 49,
    scoreB: 43,
    status: 'finished',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    finishedAt: new Date(Date.now() - 86400000 + 7200000).toISOString(), // 2 hours after start
  };

  return demoGame;
}

export function getRandomDemoPlayers(count: number = 4) {
  const shuffled = [...DEMO_PLAYERS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}