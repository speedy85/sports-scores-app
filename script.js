async function getCelticsGames() {
    const resultsDiv = document.getElementById('results');
    // UWAGA: Tu wpisz adres swojej aplikacji na Vercel po jej wrzuceniu!
    const VERCEL_URL = 'https://sports-scores-app-two.vercel.app/api/celtics';

    try {
        const response = await fetch(VERCEL_URL);
        const json = await response.json();
        const games = json.data;

        resultsDiv.innerHTML = ''; // Czyścimy napis "Ładowanie"

        games.forEach(game => {
            const gameEl = document.createElement('div');
            gameEl.className = 'game';
            const date = new Date(game.date).toLocaleDateString('pl-PL');
            
            gameEl.innerHTML = `
                <p><strong>Data:</strong> ${date}</p>
                <p>${game.home_team.full_name} <strong>${game.home_team_score}</strong></p>
                <p>vs</p>
                <p>${game.visitor_team.full_name} <strong>${game.visitor_team_score}</strong></p>
            `;
            resultsDiv.appendChild(gameEl);
        });
    } catch (err) {
        resultsDiv.innerHTML = 'Błąd ładowania danych. Sprawdź konsolę.';
        console.error(err);
    }
}

getCelticsGames();