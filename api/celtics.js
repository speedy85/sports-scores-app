export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const API_KEY = 'bc812243-8839-4458-8d9d-ea96cd3f371e';
  const BASE_URL = 'https://api.balldontlie.io/v1';

  try {
    // 1. Pobieramy 5 ostatnich meczów z sezonu 2025
    const gamesRes = await fetch(`${BASE_URL}/games?team_ids[]=2&seasons[]=2025&per_page=5&order_by=date&direction=desc`, {
      headers: { 'Authorization': API_KEY }
    });
    const gamesJson = await gamesRes.json();
    
    // Filtrujemy tylko te z wynikiem
    const lastThree = gamesJson.data
      .filter(g => g.home_team_score > 0)
      .slice(0, 3);

    // 2. Pobieramy statystyki (DODANO seasons[]=2025 dla stabilności)
    const gamesWithStats = await Promise.all(lastThree.map(async (game) => {
      try {
        // Dodanie seasons[]=2025 tutaj pomaga API szybciej przeszukać bazę zawodników
        const statsRes = await fetch(`${BASE_URL}/stats?game_ids[]=${game.id}&seasons[]=2025`, {
          headers: { 'Authorization': API_KEY }
        });
        const statsJson = await statsRes.json();

        const getTopScorers = (teamId) => {
          if (!statsJson.data) return [];
          return statsJson.data
            .filter(s => s.team.id === teamId && s.pts > 0)
            .sort((a, b) => b.pts - a.pts)
            .slice(0, 3)
            .map(s => ({
              name: `${s.player.first_name.charAt(0)}. ${s.player.last_name}`,
              pts: s.pts
            }));
        };

        return {
          ...game,
          home_top_scorers: getTopScorers(game.home_team.id),
          visitor_top_scorers: getTopScorers(game.visitor_team.id)
        };
      } catch (e) {
        return { ...game, home_top_scorers: [], visitor_top_scorers: [] };
      }
    }));

    return res.status(200).json({ data: gamesWithStats });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}