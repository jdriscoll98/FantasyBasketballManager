import { computed, reactive } from "vue";

export const useDraft = (teams, setTeams, sortedPlayersByAdp) => {
  const draftSettings = reactive({
    mockDraft: false,
    draftingTeamIndex: 0,
    autoIncrementOnSelection: true,
  });

  const changeSetting = (setting, value) => {
    draftSettings[setting] = value;
  };
  const draftRound = computed(() => {
    const draftedPlayers = teams.value.reduce(
      (acc, team) => acc + team.players.filter((p) => !p.empty).length,
      0
    );
    return Math.floor((draftedPlayers - 1) / teams.value.length) + 1;
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
    } else if (draftSettings.autoIncrementOnSelection) {
      if (draftRound.value % 2 === 0) {
        if (draftSettings.draftingTeamIndex === 0) {
          return;
        }
        // snake draft backward
        draftSettings.draftingTeamIndex = draftSettings.draftingTeamIndex - 1;
      } else {
        if (draftSettings.draftingTeamIndex === teams.value.length - 1) {
          return;
        }
        // snake draft forward
        draftSettings.draftingTeamIndex = draftSettings.draftingTeamIndex + 1;
      }
    }
  };

  const draftPlayer = (teamIndex, player) => {
    const team = teams.value[teamIndex];
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
