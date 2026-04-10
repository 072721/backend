// Utility to seed demo game data for testing admin features

export function seedDemoGames() {
  const existingGames = localStorage.getItem('games');
  
  // Only seed if there are no games
  if (existingGames) {
    const games = JSON.parse(existingGames);
    if (games.length > 0) return; // Already have data
  }

  const demoGames = [
    {
      id: 'demo-game-1',
      name: 'Championship Finals',
      teamA: 'Lakers',
      teamB: 'Warriors',
      scoreA: 105,
      scoreB: 98,
      status: 'finished',
      date: new Date('2026-03-15').toISOString(),
      players: [
        { id: 'p1', name: 'LeBron James', teamId: 'team-a', stats: { points: 32, assists: 8, rebounds: 7 } },
        { id: 'p2', name: 'Anthony Davis', teamId: 'team-a', stats: { points: 28, assists: 3, rebounds: 12 } },
        { id: 'p3', name: 'Stephen Curry', teamId: 'team-b', stats: { points: 35, assists: 7, rebounds: 5 } },
        { id: 'p4', name: 'Klay Thompson', teamId: 'team-b', stats: { points: 22, assists: 2, rebounds: 4 } },
      ],
    },
    {
      id: 'demo-game-2',
      name: 'Eastern Conference',
      teamA: 'Celtics',
      teamB: 'Heat',
      scoreA: 112,
      scoreB: 108,
      status: 'finished',
      date: new Date('2026-03-18').toISOString(),
      players: [
        { id: 'p5', name: 'Jayson Tatum', teamId: 'team-a', stats: { points: 38, assists: 6, rebounds: 9 } },
        { id: 'p6', name: 'Jaylen Brown', teamId: 'team-a', stats: { points: 25, assists: 4, rebounds: 6 } },
        { id: 'p7', name: 'Jimmy Butler', teamId: 'team-b', stats: { points: 30, assists: 8, rebounds: 7 } },
        { id: 'p8', name: 'Bam Adebayo', teamId: 'team-b', stats: { points: 18, assists: 5, rebounds: 11 } },
      ],
    },
    {
      id: 'demo-game-3',
      name: 'Playoffs Game 7',
      teamA: 'Bucks',
      teamB: 'Suns',
      scoreA: 92,
      scoreB: 95,
      status: 'live',
      date: new Date('2026-03-22').toISOString(),
      players: [
        { id: 'p9', name: 'Giannis Antetokounmpo', teamId: 'team-a', stats: { points: 40, assists: 6, rebounds: 15 } },
        { id: 'p10', name: 'Damian Lillard', teamId: 'team-a', stats: { points: 20, assists: 9, rebounds: 3 } },
        { id: 'p11', name: 'Kevin Durant', teamId: 'team-b', stats: { points: 42, assists: 5, rebounds: 8 } },
        { id: 'p12', name: 'Devin Booker', teamId: 'team-b', stats: { points: 28, assists: 7, rebounds: 4 } },
      ],
    },
  ];

  localStorage.setItem('games', JSON.stringify(demoGames));
  console.log('Demo game data seeded successfully!');
}

// Call this function in development to populate test data
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  // Auto-seed on localhost for easier testing
  // Remove this in production
  setTimeout(() => {
    const shouldSeed = !localStorage.getItem('demo_data_seeded');
    if (shouldSeed) {
      seedDemoGames();
      localStorage.setItem('demo_data_seeded', 'true');
    }
  }, 1000);
}
