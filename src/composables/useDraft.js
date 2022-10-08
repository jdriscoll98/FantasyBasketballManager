export const useDraft = (teams, setTeams) => {
  const draftPlayer = (player) => {
    const team = teams.value[draftSettings.activeTeamIndex];
    const emptyPlayer = team.players.find((p) => p.empty);
    if (emptyPlayer) {
      emptyPlayer.empty = false;
      Object.assign(emptyPlayer, player);
      setTeams([...teams.value]);
      if (!draftSettings.autoDraft) {
        updateActiveTeam();
      } else {
        draftOtherTeams();
      }
    }
  };

  function draftOtherTeams() {
    const currentTeamIndex = draftSettings.activeTeamIndex;
    updateActiveTeam();
    while (draftSettings.activeTeamIndex !== currentTeamIndex) {
      const team = teams.value[draftSettings.activeTeamIndex];
      const emptyPlayer = team.players.find((p) => p.empty);
      if (emptyPlayer) {
        draftPlayer(emptyPlayer, getNextPlayer());
        updateActiveTeam();
      } else {
        break;
      }
    }
  }

  function getNextPlayer() {
    // random number between 0 and 3
    const random = Math.floor(Math.random() * 4);
    return sortedPlayersByAdp.value[random];
  }

  return {
    draftPlayer,
  };
};
