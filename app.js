// ================================================
// SPORTS SCORES APP — NBA + Barcelona
// ================================================

// ------------------ NBA Celtics ------------------
const nbaContainer = document.getElementById("nba-games")

async function loadNBAGames(){
  try{
    const res = await fetch("https://rest.nbaapi.com/v1/games")
    const data = await res.json()
    
    // Filtrujemy tylko mecze Celtics (id drużyny BOS = 1610612738)
    const celticsGames = data.filter(g => 
      g.home_team_id === 1610612738 || g.away_team_id === 1610612738
    )

    // Sortujemy po dacie i bierzemy 3 najnowsze
    celticsGames.sort((a,b)=>new Date(b.date)-new Date(a.date))
    const games = celticsGames.slice(0,3)

    nbaContainer.innerHTML = ""

    games.forEach(game=>{
      const home = game.home_team.abbreviation
      const away = game.away_team.abbreviation
      const score = `${game.home_score} : ${game.away_score}`

      const div = document.createElement("div")
      div.className="match"

      div.innerHTML=`
        <div class="team">${home} vs ${away}</div>
        <div class="score">${score}</div>
        <div class="details" id="nba-${game.id}"></div>
      `

      // pokaż szczegóły po kliknięciu
      div.onclick = ()=>loadNBADetails(game.id)

      nbaContainer.appendChild(div)
    })

  }catch(err){
    console.error("NBA Load Error:",err)
    nbaContainer.innerHTML="Error loading NBA games"
  }
}

async function loadNBADetails(gameId){
  try {
    const res = await fetch(`https://rest.nbaapi.com/v1/games/${gameId}`)
    const game = await res.json()

    const detailsDiv = document.getElementById("nba-"+gameId)

    detailsDiv.innerHTML = "<b>Top Scorers:</b><br>"

    // jeśli są statystyki graczy w odpowiedzi
    if(game.player_stats){
      // sortujemy po punktach
      const sorted = game.player_stats.sort((a,b)=>b.pts - a.pts)
      const top = sorted.slice(0,3)

      top.forEach(p=>{
        detailsDiv.innerHTML += `${p.player_name} — ${p.pts} pts<br>`
      })

    } else {
      detailsDiv.innerHTML += "No player stats available"
    }

  } catch(err){
    console.error("NBA Details Error:",err)
  }
}


// ------------------ Barcelona ------------------
const footballContainer = document.getElementById("football-games")
const FOOTBALL_API_KEY = "YOUR_API_KEY" // <-- Twój klucz

async function loadFootballGames(){
  try{
    const response = await fetch(
      "https://corsproxy.io/?https://api.football-data.org/v4/teams/81/matches",
      {
        headers:{
          "X-Auth-Token": FOOTBALL_API_KEY
        }
      }
    )
    const data = await response.json()

    footballContainer.innerHTML=""

    data.matches.slice(0,3).forEach(match=>{

      const home = match.homeTeam.name
      const away = match.awayTeam.name
      const score = `${match.score.fullTime.home} : ${match.score.fullTime.away}`

      let scorersHTML = ""
      if(match.goals){
        match.goals.forEach(goal=>{
          scorersHTML += `⚽ ${goal.player.name} ${goal.minute}'<br>`
        })
      }

      const div = document.createElement("div")
      div.className="match"
      div.innerHTML=`
        <div class="team">${home} vs ${away}</div>
        <div class="score">${score}</div>
        <div class="details">${scorersHTML}</div>
      `
      footballContainer.appendChild(div)
    })

  }catch(err){
    console.error(err)
    footballContainer.innerHTML="Error loading football games"
  }
}

// ------------------ LOAD ------------------
loadNBAGames()
loadFootballGames()