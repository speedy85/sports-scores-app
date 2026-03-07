// ================================================
// SPORTS SCORES APP
// ================================================

// ------------------ NBA Celtics ------------------
const nbaContainer = document.getElementById("nba-games")

async function loadNBAGames() {
  const NBA_API = "https://api.allorigins.win/get?url=" +
    encodeURIComponent("https://www.balldontlie.io/api/v1/games?team_ids[]=2&per_page=3")

  try {
    const response = await fetch(NBA_API)
    const text = await response.text()
    const data = JSON.parse(JSON.parse(text).contents)

    nbaContainer.innerHTML = ""

    data.data.forEach(game => {
      const div = document.createElement("div")
      div.className = "match"

      div.innerHTML = `
        <div class="team">${game.home_team.full_name} vs ${game.visitor_team.full_name}</div>
        <div class="score">${game.home_team_score} : ${game.visitor_team_score}</div>
        <div class="details" id="game-${game.id}">Loading stats...</div>
      `

      div.onclick = () => loadNBADetails(game.id)

      nbaContainer.appendChild(div)
    })

  } catch (err) {
    console.error(err)
    nbaContainer.innerHTML = "Error loading NBA games"
  }
}

// Funkcja pokazująca top scorer
async function loadNBADetails(gameId) {
  const STATS_API = "https://api.allorigins.win/get?url=" +
    encodeURIComponent(`https://www.balldontlie.io/api/v1/stats?game_ids[]=${gameId}`)

  try {
    const response = await fetch(STATS_API)
    const text = await response.text()
    const data = JSON.parse(JSON.parse(text).contents)

    const players = data.data
    // top 3 punktujący
    players.sort((a, b) => b.pts - a.pts)
    const top = players.slice(0, 3)

    const details = document.getElementById("game-" + gameId)
    details.style.display = "block"
    details.innerHTML = "<b>Top scorers</b><br>"

    top.forEach(p => {
      details.innerHTML += `${p.player.first_name} ${p.player.last_name} — ${p.pts} pts<br>`
    })

  } catch (err) {
    console.error(err)
    const details = document.getElementById("game-" + gameId)
    details.innerHTML = "Error loading stats"
  }
}

// ------------------ Barcelona ------------------
const footballContainer = document.getElementById("football-games")
const FOOTBALL_API_KEY = "YOUR_API_KEY" // <--- wpisz tutaj swój klucz z football-data.org

async function loadFootballGames() {
  try {
    const response = await fetch(
      "https://corsproxy.io/?https://api.football-data.org/v4/teams/81/matches",
      {
        headers: {
          "X-Auth-Token": d9c875574fb7426eab05d3e355a67038
        }
      }
    )
    const data = await response.json()

    footballContainer.innerHTML = ""

    // 3 ostatnie mecze
    data.matches.slice(0, 3).forEach(match => {
      const home = match.homeTeam.name
      const away = match.awayTeam.name
      const score = `${match.score.fullTime.home} : ${match.score.fullTime.away}`

      const div = document.createElement("div")
      div.className = "match"

      // strzelcy goli
      let scorersHTML = ""
      if (match.score.penalties) {
        scorersHTML = "<i>Penalty info not available</i>"
      } else if (match.goals) {
        match.goals.forEach(goal => {
          scorersHTML += `⚽ ${goal.player.name} ${goal.minute}'<br>`
        })
      }

      div.innerHTML = `
        <div class="team">${home} vs ${away}</div>
        <div class="score">${score}</div>
        <div class="details">${scorersHTML}</div>
      `

      footballContainer.appendChild(div)
    })

  } catch (err) {
    console.error(err)
    footballContainer.innerHTML = "Error loading football games"
  }
}

// ------------------ LOAD ------------------
loadNBAGames()
loadFootballGames()