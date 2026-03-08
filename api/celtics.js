  // api/celtics.js
export default async function handler(req, res) {
  // ID Boston Celtics w balldontlie to 2
  const API_URL = 'https://nba.balldontlie.io/api/v1/games?team_ids[]=2&per_page=3';
  
  try {
    const response = await fetch(API_URL, {
      headers: {
        // Jeśli masz klucz API, dodaj go tutaj:
        'Authorization': ' bc812243-8839-4458-8d9d-ea96cd3f371e' 
      }
    });
    const data = await response.json();
    
    // Dodajemy nagłówki CORS, żeby Twoja strona na GitHubie mogła to odczytać
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Błąd pobierania danych' });
  }
}  