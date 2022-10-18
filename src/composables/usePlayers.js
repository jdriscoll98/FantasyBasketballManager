import { ref, computed } from "vue";

export const usePlayers = (teams, search) => {
  const displayPlayers = computed(() => {
    return availablePlayers.value
      .filter((player) => {
        return (
          search.value === "" ||
          player.Name.toLowerCase().includes(search.value.toLowerCase())
        );
      })
      .sort((a, b) => {
        const aTotal = Number(a.Total);
        const bTotal = Number(b.Total);
        return bTotal - aTotal;
      })
      .slice(0, 200);
  });

  const availablePlayers = computed(() => {
    return allPlayers.value.filter((player) => {
      let drafted = false;
      teams.value.teams.forEach((team) => {
        return team.players.forEach((p) => {
          if (p.Name === player.Name) {
            drafted = true;
          }
        });
      });
      return !drafted;
    });
  });

  const sortedPlayersByTotal = computed(() => {
    return [...availablePlayers.value].sort((a, b) => {
      const aTotal = Number(a.Total);
      const bTotal = Number(b.Total);
      return bTotal - aTotal;
    });
  });

  return {
    displayPlayers,
    fetchPlayerData,
    sortedPlayersByTotal,
  };
};
