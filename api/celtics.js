export default async function handler(req, res) {
  // 1. USTAWIANIE NAGŁÓWKÓW CORS (Kluczowe dla Twojego błędu)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); // Pozwala na dostęp z dowolnego miejsca
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // 2. OBSŁUGA ZAPYTANIA "PREFLIGHT" (Przeglądarka pyta o to przed właściwym pobraniem)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 3. KONFIGURACJA API
  const API_KEY = 'bc812243-8839-4458-8d9d-ea96cd3f371e';
  // Ważne: Zmieniony URL na api.balldontlie.io (wymagany dla Twojego klucza)
  const API_URL = 'https://api.balldontlie.io/v1/games?team_ids[]=2&per_page=3';

  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Authorization': API_KEY, // Twój klucz API
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.text();
      return res.status(response.status).json({ 
        error: `API NBA odrzuciło zapytanie: ${response.status}`,
        details: errorData 
      });
    }

    const data = await response.json();

    // 4. WYCHODZĄCA ODPOWIEDŹ DO TWOJEJ STRONY
    return res.status(200).json(data);

  } catch (error) {
    console.error('Błąd wykonania funkcji:', error);
    return res.status(500).json({ 
      error: 'Błąd wewnętrzny serwera Vercel', 
      message: error.message 
    });
  }
}