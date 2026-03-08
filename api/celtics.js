export default async function handler(req, res) {
  // 1. Nagłówki CORS (żeby strona na GitHubie mogła czytać dane)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // 2. Obsługa zapytania "testowego" OPTIONS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const API_KEY = 'bc812243-8839-4458-8d9d-ea96cd3f371e';
  const API_URL = 'https://api.balldontlie.io/v1/games?team_ids[]=2&per_page=3';

  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        // Balldontlie wymaga klucza w nagłówku 'Authorization'
        'Authorization': API_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API wróciło z błędem ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Błąd serwera:', error);
    res.status(500).json({ error: 'Błąd pobierania danych', details: error.message });
  }
}