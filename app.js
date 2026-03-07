const nbaContainer = document.getElementById("nba-games")

async function loadNBAGames(){

const response = await fetch(
"https://corsproxy.io/?https://www.balldontlie.io/api/v1/games?team_ids[]=2&per_page=3"
)

const data = await response.json()

nbaContainer.innerHTML = ""

data.data.slice(0,3).forEach(game=>{

const home = game.home_team.full_name
const visitor = game.visitor_team.full_name

const score = `${game.home_team_score} : ${game.visitor_team_score}`

const div = document.createElement("div")
div.className="match"

div.innerHTML = `

<div class="team">
${home} vs ${visitor}
</div>

<div class="score">
${score}
</div>

<div class="details" id="game-${game.id}">
Loading stats...
</div>

`

div.onclick = ()=>loadNBADetails(game.id)

nbaContainer.appendChild(div)

})

}

loadNBAGames()

async function loadNBADetails(gameId){

const stats = await fetch(
`https://corsproxy.io/?https://www.balldontlie.io/api/v1/stats?game_ids[]=${gameId}`
)

const data = await stats.json()

let players = data.data

players.sort((a,b)=>b.pts-a.pts)

const top = players.slice(0,3)

const details = document.getElementById("game-"+gameId)

details.style.display="block"

details.innerHTML="<b>Top scorers</b><br>"

top.forEach(p=>{

details.innerHTML +=
`${p.player.first_name} ${p.player.last_name} — ${p.pts} pts<br>`

})

}

const footballContainer = document.getElementById("football-games")

async function loadFootballGames(){

const response = await fetch(
"https://corsproxy.io/?https://api.football-data.org/v4/teams/81/matches",
{
headers:{
"X-Auth-Token":"d9c875574fb7426eab05d3e355a67038"
}
}
)

const data = await response.json()

footballContainer.innerHTML=""

data.matches.slice(0,3).forEach(match=>{

const home = match.homeTeam.name
const away = match.awayTeam.name

const score = `${match.score.fullTime.home} : ${match.score.fullTime.away}`

const div = document.createElement("div")
div.className="match"

div.innerHTML=`

<div class="team">
${home} vs ${away}
</div>

<div class="score">
${score}
</div>

`

footballContainer.appendChild(div)

})

}

loadFootballGames()