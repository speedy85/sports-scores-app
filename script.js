async function loadCelticsResults() {
  const container = document.getElementById('results');
  // Upewnij się, że ten adres URL jest poprawny dla Twojego projektu na Vercel!
  const VERCEL_URL = 'https://sports-scores-app-two.vercel.app/api/celtics';

  try {
    const response = await fetch(VERCEL_URL);
    const json = await response.json();
    const games = json.data;

    container.innerHTML = ''; // Czyścimy napis "Ładowanie"

    games.forEach(game => {
      const date = new Date(game.date).toLocaleDateString('pl-PL');
      
      const gameHtml = `
        <div style="border-bottom: 1px solid #444; padding: 15px; margin-bottom: 10px; color: white; background: #222; border-radius: 8px;">
          <div style="font-size: 0.8rem; color: #008348; margin-bottom: 5px; font-weight: bold;">${date}</div>
          <div style="display: flex; justify-content: space-between;">
            <span>${game.home_team.full_name}</span>
            <strong>${game.home_team_score}</strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>${game.visitor_team.full_name}</span>
            <strong>${game.visitor_team_score}</strong>
          </div>
        </div>
      `;
      container.innerHTML += gameHtml;
    });
  } catch (err) {
    container.innerHTML = '<p style="color:red;">Błąd ładowania danych.</p>';
    console.error('Szczegóły błędu:', err);
  }
}

// Odpalamy funkcję
loadCelticsResults();