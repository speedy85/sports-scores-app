export default async function handler(req, res) {
  // Nagłówki CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const API_KEY = 'bc812243-8839-4458-8d9d-ea96cd3f371e';
  const BASE_URL = 'https://api.balldontlie.io/v1';

  try {
    // 1. Pobieramy mecze (tylko 3, żeby nie przeciążać funkcji)
    const gamesRes = await fetch(`${BASE_URL}/games?team_ids[]=2&seasons[]=2025&per_page=3&order_by=date&direction=desc`, {
      headers: { 'Authorization': API_KEY }
    });

    if (!gamesRes.ok) throw new Error(`Błąd meczów: ${gamesRes.status}`);
    const gamesJson = await gamesRes.json();

    // 2. Pobieramy statystyki dla każdego meczu po kolei (bezpieczniej niż Promise.all przy limitach API)
    const gamesWithStats = [];
    
    for (const game of gamesJson.data) {
      try {
        const statsRes = await fetch(`${BASE_URL}/stats?game_ids[]=${game.id}&per_page=50`, {
          headers: { 'Authorization': API_KEY }
        });
        
        if (!statsRes.ok) throw new Error('Błąd statystyk');
        const statsJson = await statsRes.json();

        const getTopScorers = (teamId) => {
          return statsJson.data
            .filter(s => s.team.id === teamId && s.pts !== null)
            .sort((a, b) => b.pts - a.pts)
            .slice(0, 3)
            .map(s => ({
              name: `${s.player.first_name.charAt(0)}. ${s.player.last_name}`,
              pts: s.pts
            }));
        };

        gamesWithStats.push({
          ...game,
          home_top_scorers: getTopScorers(game.home_team.id),
          visitor_top_scorers: getTopScorers(game.visitor_team.id)
        });
      } catch (err) {
        // Jeśli statystyki padną, dodajemy mecz bez nich zamiast wywalać cały serwer
        gamesWithStats.push({ ...game, home_top_scorers: [], visitor_top_scorers: [] });
      }
    }

    return res.status(200).json({ data: gamesWithStats });

  } catch (error) {
    console.error("BŁĄD VERCEL:", error.message);
    return res.status(500).json({ error: "Błąd serwera", details: error.message });
  }
}