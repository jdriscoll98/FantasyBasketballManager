export const useDraft = (
  teams,
  setTeams,
  draftSettings,
  updateActiveTeam,
  sortedPlayersByAdp
) => {
  const onDrafted = (player) => {
    draftPlayer(player);
    if (!draftSettings.autoDraft) {
      updateActiveTeam();
    } else {
      draftOtherTeams();
    }
  };
  const draftPlayer = (player) => {
    const team = teams.value[draftSettings.activeTeamIndex];
    const emptyPlayer = team.players.find((p) => p.empty);
    if (emptyPlayer) {
      emptyPlayer.empty = false;
      Object.assign(emptyPlayer, player);
      setTeams([...teams.value]);
    }
  };

  function draftOtherTeams() {
    const currentTeamIndex = draftSettings.activeTeamIndex;
    updateActiveTeam();
    while (draftSettings.activeTeamIndex !== currentTeamIndex) {
      draftPlayer(getNextPlayer());
      updateActiveTeam();
    }
  }

  function getNextPlayer() {
    // random number between 0 and 3
    const random = Math.floor(Math.random() * 3);
    return sortedPlayersByAdp.value[random];
  }

  return {
    onDrafted,
  };
};
