export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const API_KEY = 'bc812243-8839-4458-8d9d-ea96cd3f371e';
  const BASE_URL = 'https://api.balldontlie.io/v1';

  try {
    // DODANO: &seasons[]=2025 - to wyrzuci mecze z 1946 roku
    const gamesRes = await fetch(`${BASE_URL}/games?team_ids[]=2&seasons[]=2025&per_page=10&order_by=date&direction=desc`, {
      headers: { 'Authorization': API_KEY }
    });
    
    const gamesJson = await gamesRes.json();
    
    // Jeśli z jakiegoś powodu sezon 2025 jest pusty (np. przerwa), funkcja nie wywali błędu
    if (!gamesJson.data || gamesJson.data.length === 0) {
        return res.status(200).json({ data: [], message: "Brak meczów w bieżącym sezonie" });
    }

    const lastThree = gamesJson.data
      .filter(g => g.status === 'Final' || g.home_team_score > 0)
      .slice(0, 3);

    const gamesWithStats = await Promise.all(lastThree.map(async (game) => {
      const statsRes = await fetch(`${BASE_URL}/stats?game_ids[]=${game.id}`, {
        headers: { 'Authorization': API_KEY }
      });
      const statsJson = await statsRes.json();

      const getTopScorers = (teamId) => {
        return statsJson.data
          .filter(s => s.team.id === teamId)
          .sort((a, b) => b.pts - a.pts)
          .slice(0, 3)
          .map(s => ({ 
            name: `${s.player.first_name} ${s.player.last_name}`, 
            pts: s.pts || 0 
          }));
      };

      return {
        ...game,
        home_top_scorers: getTopScorers(game.home_team.id),
        visitor_top_scorers: getTopScorers(game.visitor_team.id)
      };
    }));

    return res.status(200).json({ data: gamesWithStats });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}