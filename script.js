async function loadCelticsResults() {
  const container = document.getElementById('results');
  const VERCEL_URL = 'https://sports-scores-app-two.vercel.app/api/celtics';

  try {
    const response = await fetch(VERCEL_URL);
    const { data: games } = await response.json();

    container.innerHTML = '';

    games.forEach(game => {
      const date = new Date(game.date).toLocaleDateString('pl-PL');
      
      const gameHtml = `
        <div style="border: 1px solid #444; padding: 15px; margin-bottom: 20px; color: white; background: #1a1a1a; border-radius: 12px; font-family: sans-serif;">
          <div style="font-size: 0.8rem; color: #008348; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #333; padding-bottom: 5px;">${date}</div>
          
          <div style="display: flex; justify-content: space-between; font-size: 1.2rem; font-weight: bold; margin-bottom: 15px;">
            <div style="width: 45%;">${game.home_team.full_name} <br> <span style="font-size: 1.5rem;">${game.home_team_score}</span></div>
            <div style="width: 10%; align-self: center; color: #555;">VS</div>
            <div style="width: 45%; text-align: right;">${game.visitor_team.full_name} <br> <span style="font-size: 1.5rem;">${game.visitor_team_score}</span></div>
          </div>

          <div style="display: flex; justify-content: space-between; font-size: 0.85rem; background: #252525; padding: 10px; border-radius: 8px;">
            <div style="width: 48%;">
               <div style="color: #888; margin-bottom: 5px; text-decoration: underline;">Top Scorers:</div>
               ${game.home_top_scorers.map(p => `<div>${p.name}: <strong>${p.pts}</strong></div>`).join('')}
            </div>
            <div style="width: 48%; text-align: right; border-left: 1px solid #444;">
               <div style="color: #888; margin-bottom: 5px; text-decoration: underline;">Top Scorers:</div>
               ${game.visitor_top_scorers.map(p => `<div><strong>${p.pts}</strong> :${p.name}</div>`).join('')}
            </div>
          </div>
        </div>
      `;
      container.innerHTML += gameHtml;
    });
  } catch (err) {
    container.innerHTML = '<p style="color:red;">Błąd ładowania danych.</p>';
  }
}

loadCelticsResults();