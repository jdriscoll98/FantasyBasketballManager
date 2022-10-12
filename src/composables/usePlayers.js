import { ref, computed } from "vue";

export const usePlayers = (teams, search) => {
  const allPlayers = ref([]);

  const displayPlayers = computed(() => {
    return availablePlayers.value
      .filter((player) => {
        return (
          search.value === "" ||
          player.PLAYER.toLowerCase().includes(search.value.toLowerCase())
        );
      })
      .sort((a, b) => {
        return Number(b.TOTAL) - Number(a.TOTAL);
      });
  });

  const availablePlayers = computed(() => {
    return allPlayers.value.filter((player) => {
      let drafted = false;
      teams.value.forEach((team) => {
        return team.players.forEach((p) => {
          if (p.PLAYER === player.PLAYER) {
            drafted = true;
          }
        });
      });
      return !drafted;
    });
  });

  const sortedPlayersByAdp = computed(() => {
    return [...availablePlayers.value].sort((a, b) => {
      const player1 = a.ADP === "" ? 1000 : Number(a.ADP);
      const player2 = b.ADP === "" ? 1000 : Number(b.ADP);
      return player1 - player2;
    });
  });

  function fetchPlayerData() {
    fetch("data.csv")
      .then((response) => response.text())
      .then((text) => {
        const lines = text.split("\n");
        const cols = lines[0].split(",");
        const players = [];
        for (let i = 1; i < lines.length; i++) {
          const player = {};
          const line = lines[i].replace(/(".*),(.*")/gm, "$1 $2");
          const currentline = line.split(",");
          for (let j = 0; j < cols.length; j++) {
            player[cols[j].trim()] = currentline[j].trim();
          }
          players.push(player);
        }
        allPlayers.value = players;
      });
  }

  const cols = computed(() => {
    return allPlayers.value.length > 0 ? Object.keys(allPlayers.value[0]) : [];
  });

  return {
    allPlayers,
    displayPlayers,
    fetchPlayerData,
    sortedPlayersByAdp,
    cols,
  };
};
