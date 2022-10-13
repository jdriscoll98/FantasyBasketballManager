import { computed, reactive } from "vue";

export const useDraft = (teams, setTeams, sortedPlayersByAdp) => {
  const draftSettings = reactive({
    mockDraft: true,
    draftingTeamIndex: 0,
  });

  const changeSetting = (setting, value) => {
    draftSettings[setting] = value;
  };
  const draftRound = computed(() => {
    if (draftSettings.mockDraft) {
      const draftedPlayers = teams.value.reduce(
        (acc, team) => acc + team.players.filter((p) => !p.empty).length,
        0
      );
      return Math.floor(draftedPlayers - 1 / teams.value.length) + 1;
    }
    return 1;
  });
  const onDrafted = (player) => {
    draftPlayer(draftSettings.draftingTeamIndex, player);
    if (draftSettings.mockDraft) {
      const draftingTeamIndex = draftSettings.draftingTeamIndex;
      if (draftRound.value % 2 === 0) {
        // snake draft backward
        for (let i = draftingTeamIndex - 1; i >= 0; i--) {
          draftPlayer(i, getNextPlayer());
        }
        // snake draft forward
        for (let i = 0; i < draftingTeamIndex; i++) {
          console.log();
          draftPlayer(i, getNextPlayer());
        }
      } else {
        // snake draft forward
        for (let i = draftingTeamIndex + 1; i < teams.value.length; i++) {
          draftPlayer(i, getNextPlayer());
        }
        // snake draft backward
        for (let i = teams.value.length - 1; i > draftingTeamIndex; i--) {
          draftPlayer(i, getNextPlayer());
        }
      }
    }
  };

  const draftPlayer = (teamIndex, player) => {
    const team = teams.value[teamIndex];
    console.log(team);
    const emptyPlayer = team?.players.find((p) => p.empty);
    if (emptyPlayer) {
      emptyPlayer.empty = false;
      Object.assign(emptyPlayer, player);
    }
    setTeams([...teams.value]);
  };

  const getNextPlayer = () => {
    return sortedPlayersByAdp.value[0];
  };

  return {
    onDrafted,
    changeSetting,
    draftSettings,
  };
};
