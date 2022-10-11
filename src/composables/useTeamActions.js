import { ref, computed } from "vue";

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

  const onSelectTeam = (e) => {
    const index = teams.value.findIndex((team) => team.name === e.value.name);
    activeTeamIndex.value = index;
  };

  const displayTeams = computed(() => {
    if (window.innerWidth < 600) {
      return teams.value.filter((_, index) => index === activeTeamIndex.value);
    } else {
      return teams.value;
    }
  });

  return {
    resetTeams,
    activeTeamIndex,
    onSelectTeam,
    displayTeams,
  };
};
