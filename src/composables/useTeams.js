import { ref } from "vue";

export const useTeams = () => {
  const teams = ref({
    leagueId: "",
    teams: [],
  });

  async function fetchTeamData(league, allPlayers) {
    const allTeams = localStorage.getItem("allTeams")
      ? JSON.parse(localStorage.getItem("allTeams"))
      : [];
    const currentTeam = allTeams.find((team) => team.leagueId === league.id);
    if (currentTeam) {
      if (league.imported) {
        if (league.platform === "sleeper") {
          currentTeam.teams = await fetchTeamsFromSleeper(league, allPlayers);
        }
        localStorage.setItem("allTeams", JSON.stringify(allTeams));
      }
      teams.value = currentTeam;
    } else {
      if (league.imported) {
        if (league.platform === "sleeper") {
          const res = await fetchTeamsFromSleeper(league, allPlayers);
          teams.value = {
            leagueId: league.id,
            teams: res,
          };
        }
      } else {
        // generate empty teams
        teams.value = {
          leagueId: league.id,
          teams: Array(Number(league.numberOfTeams))
            .fill(0)
            .map((_, i) => {
              const players = Array(13)
                .fill(0)
                .map((_, i) => {
                  return {
                    Name: `Player ${i + 1}`,
                    empty: true,
                  };
                });
              return {
                name: `Team ${i + 1}`,
                players,
              };
            }),
        };
      }
      allTeams.push(teams.value);
      localStorage.setItem("allTeams", JSON.stringify(allTeams));
    }
  }

  async function fetchTeamsFromSleeper(league, allPlayers) {
    const res = await fetch(
      `https://api.sleeper.app/v1/league/${league.id}/rosters`
    );
    const data = await res.json();
    const teams = [];
    for (const team of data) {
      const players = [];
      for (const playerId of team.players) {
        const p = allPlayers.value.find((p) => p.SleeperId === playerId);
        if (p) {
          players.push(p);
        } else {
          players.push({
            Name: playerId,
            Position: "BN",
            empty: true,
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

  function setTeams(newTeams) {
    teams.value.teams = newTeams;
    const allTeams = localStorage.getItem("allTeams")
      ? JSON.parse(localStorage.getItem("allTeams"))
      : [];
    const currentTeam = allTeams.find(
      (team) => team.leagueId === teams.value.leagueId
    );
    currentTeam.teams = teams.value.teams;
    localStorage.setItem("allTeams", JSON.stringify(allTeams));
  }

  const deletePlayer = (team, index) => {
    const emptyPlayer = {
      empty: true,
      Name: `Player ${index + 1}`,
    };
    team.players[index] = emptyPlayer;
    setTeams([...teams.value.teams]);
  };

  return {
    teams,
    fetchTeamData,
    setTeams,
    deletePlayer,
  };
};
