import { ref } from "vue";

export const useTeams = () => {
  const teams = ref([]);

  function fetchTeamData() {
    const savedTeams = localStorage.getItem("allTeams");
    if (savedTeams) {
      teams.value = JSON.parse(savedTeams);
    } else {
      // generate empty teams
      teams.value = Array(8)
        .fill(0)
        .map((_, i) => {
          const players = Array(13)
            .fill(0)
            .map((_, i) => {
              return {
                PLAYER: `Player ${i + 1}`,
                empty: true,
              };
            });
          return {
            name: `Team ${i + 1}`,
            players,
          };
        });
      localStorage.setItem("allTeams", JSON.stringify(teams.value));
    }
  }

  function setTeams(newTeams) {
    teams.value = newTeams;
    localStorage.setItem("allTeams", JSON.stringify(teams.value));
  }

  const deletePlayer = (team, index) => {
    const emptyPlayer = {
      empty: true,
      PLAYER: "Player" + (index + 1),
    };
    team.players[index] = emptyPlayer;
    setTeams([...teams.value]);
  };

  return {
    teams,
    fetchTeamData,
    setTeams,
    deletePlayer,
  };
};
