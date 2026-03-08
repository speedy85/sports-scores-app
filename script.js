async function loadCelticsResults() {
  const container = document.getElementById('results');
  const VERCEL_URL = 'https://sports-scores-app-two.vercel.app/api/celtics';

  try {
    const response = await fetch(VERCEL_URL);
    const json = await response.json();
    const games = json.data;

    container.innerHTML = '';

    games.forEach(game => {
      const date = new Date(game.date).toLocaleDateString('pl-PL');
      
      // Funkcja pomocnicza do generowania listy punktujących
      const renderScorers = (scorers) => {
        if (!scorers || scorers.length === 0) return '<div style="color: #666;">Brak statystyk</div>';
        return scorers.map(p => `<div>${p.name}: <strong>${p.pts} pkt</strong></div>`).join('');
      };

      const gameHtml = `
        <div style="border: 1px solid #444; padding: 15px; margin-bottom: 20px; color: white; background: #1a1a1a; border-radius: 12px;">
          <div style="font-size: 0.8rem; color: #008348; font-weight: bold; margin-bottom: 10px;">${date}</div>
          
          <div style="display: flex; justify-content: space-between; font-size: 1.1rem; font-weight: bold;">
            <span>${game.home_team.full_name}</span>
            <span>${game.home_team_score}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 1.1rem; font-weight: bold; margin-bottom: 15px;">
            <span>${game.visitor_team.full_name}</span>
            <span>${game.visitor_team_score}</span>
          </div>

          <div style="display: flex; justify-content: space-between; font-size: 0.8rem; background: #252525; padding: 10px; border-radius: 8px;">
            <div style="width: 48%;">
               ${renderScorers(game.home_top_scorers)}
            </div>
            <div style="width: 48%; text-align: right; border-left: 1px solid #444;">
               ${renderScorers(game.visitor_top_scorers)}
            </div>
          </div>
        </div>
      `;
      container.innerHTML += gameHtml;
    });
  } catch (err) {
    container.innerHTML = '<p style="color:red;">Błąd ładowania danych.</p>';
    console.error(err);
  }
}

loadCelticsResults();