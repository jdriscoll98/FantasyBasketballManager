// Imported league helpers
export async function fetchTeamsFromSleeper(league, allPlayers) {
  const res = await fetch(
    `https://api.sleeper.app/v1/league/${league.id}/rosters`
  );
  const data = await res.json();
  const teams = [];
  for (const team of data) {
    const players = [];
    for (const playerId of team.players) {
      const rosterSlot = team.starters.findIndex(
        (starter) => starter === playerId
      );
      const p = allPlayers.find((p) => p.SleeperId === playerId);
      if (p) {
        players.push({
          Name: p.Name,
          Position: p.Position,
          Total: p.Total,
          RosterSlot:
            rosterSlot > -1 ? league.rosterPositions[rosterSlot] : "BN",
        });
      } else {
        players.push({
          Name: playerId,
          Position: "BN",
          RosterSlot: "BN",
        });
      }
    }
    if (players.length < league.rosterPositions.length) {
      for (let i = players.length; i < league.rosterPositions.length; i++) {
        players.push({
          Name: "Empty",
          Position: "BN",
          RosterSlot: league.rosterPositions[i],
          Total: 0,
        });
      }
    }
    const res2 = await fetch(
      `https://api.sleeper.app/v1/user/${team.owner_id}`
    );
    const data2 = await res2.json();
    const teamName = data2.display_name;
    teams.push({
      id: team.roster_id,
      name: teamName,
      players,
    });
  }
  return teams;
}

export async function importLeagueFromSleeper(importPayload) {
  const { platform, id } = importPayload;
  const res = await fetch(`https://api.sleeper.app/v1/league/${id}`);
  const data = await res.json();
  const numberOfTeams = data.total_rosters;
  const sport = data.sport;
  const scoringSettings = data.scoring_settings;
  const rosterPositions = data.roster_positions.concat(["IR"]);
  const name = data.name;
  const league = {
    name,
    sport,
    numberOfTeams,
    scoringSettings,
    rosterPositions,
    platform,
    id,
  };
  return league;
}
