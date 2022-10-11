import { ref } from "vue";

export const useTeamActions = (teams) => {
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
  const activeTeamIndex = ref(0);

  return {
    resetTeams,
    activeTeamIndex,
  };
};
