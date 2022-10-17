import { ref, computed } from "vue";

export const usePlayers = (teams, search) => {
  const allPlayers = ref([]);

  const displayPlayers = computed(() => {
    return availablePlayers.value
      .filter((player) => {
        return (
          search.value === "" ||
          player.Name.toLowerCase().includes(search.value.toLowerCase())
        );
      })
      .sort((a, b) => {
        // sort by 50% total and 50% adp
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

  function fetchPlayerData(league) {
    if (league.sport === "NBA") {
      fetch("data.csv")
        .then((response) => response.text())
        .then((text) => {
          const lines = text.split("\n");
          const cols = lines[0].split(",");
          const players = [];
          for (let i = 1; i < lines.length; i++) {
            const player = {};
            const line = lines[i];
            const currentline = line.split(",");
            for (let j = 0; j < cols.length; j++) {
              player[cols[j]] = currentline[j];
            }
            // calculate total
            player.Total = getTotal(player);
            players.push(player);
          }
          cols.push("Total");
          allPlayers.value = players;
        });
    }
  }

  const getTotal = (player) => {
    const total =
      0.5 * Number(player.Points) +
      1 * Number(player.Rebounds) +
      1 * Number(player.Assists) +
      2 * Number(player.Steals) +
      2 * Number(player.Blocks) -
      1 * Number(player.TO) +
      0.5 * Number(player.TPM) +
      1 * Number(player.DD) +
      2 * Number(player.TD);
    return Math.round(total);
  };

  const cols = computed(() => {
    return allPlayers.value.length > 0 ? Object.keys(allPlayers.value[0]) : [];
  });

  return {
    allPlayers,
    displayPlayers,
    fetchPlayerData,
    sortedPlayersByTotal,
    cols,
  };
};
