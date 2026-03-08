export default async function handler(req, res) {
  // 1. Ustawienia nagłówków (usuwają błędy CORS)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const API_KEY = 'bc812243-8839-4458-8d9d-ea96cd3f371e';
  // Pobieramy 10 ostatnich meczów, żeby mieć z czego filtrować
  const API_URL = 'https://api.balldontlie.io/v1/games?team_ids[]=2&per_page=10&order_by=date&direction=desc';

  try {
    const response = await fetch(API_URL, {
      headers: { 'Authorization': API_KEY }
    });
    const json = await response.json();

    // 2. Filtracja: zostawiamy tylko mecze zakończone (Final) lub te z punktami
    const lastThreeResults = json.data
      .filter(game => game.status === 'Final' || game.home_team_score > 0)
      .slice(0, 3); 

    // 3. Wysyłamy gotową paczkę do Twojej strony
    return res.status(200).json({ data: lastThreeResults });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}