import { ref } from "vue";

export const useTeamActions = (teams) => {
  const teamView = ref("position");

  const resetTeams = () => {
    teams.value = teams.value.map((team) => {
      team.players = team.players.map((_, index) => {
        return {
          PLAYER: `Player ${index + 1}`,
          empty: true,
        };
      });
      return team;
    });
    localStorage.setItem("allTeams", JSON.stringify(teams.value));
  };

  return {
    resetTeams,
    teamView,
  };
};
