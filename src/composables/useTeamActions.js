import { ref } from "vue";

export const useTeamActions = (teams) => {
  const teamView = ref("position");

  const resetTeams = () => {
    teams.value.teams = teams.value.teams.map((team) => {
      team.players = team.players.map((_, index) => {
        return {
          Name: `Player ${index + 1}`,
          empty: true,
        };
      });
      return team;
    });
    const allTeams = localStorage.getItem("allTeams")
      ? JSON.parse(localStorage.getItem("allTeams"))
      : [];
    const currentTeam = allTeams.find(
      (team) => team.leagueId === teams.value.leagueId
    );
    currentTeam.teams = teams.value.teams;
    localStorage.setItem("allTeams", JSON.stringify(allTeams));
  };

  return {
    resetTeams,
    teamView,
  };
};
