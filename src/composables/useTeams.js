import { ref } from "vue";

export const useTeams = () => {
  const teams = ref({
    leagueId: "",
    teams: [],
  });

  function fetchTeamData(league) {
    const allTeams = localStorage.getItem("allTeams")
      ? JSON.parse(localStorage.getItem("allTeams"))
      : [];
    const currentTeam = allTeams.find((team) => team.leagueId === league.id);
    if (currentTeam) {
      teams.value = currentTeam;
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
      allTeams.push(teams.value);
      localStorage.setItem("allTeams", JSON.stringify(allTeams));
    }
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
