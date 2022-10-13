import { POSITION_ORDER, POSITION_COUNT } from "../utils/constants";

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
    const team = teams.value[draftSettings.activeTeamIndex];
    const remainingPositions = [];
    POSITION_ORDER.forEach((pos) => {
      const numOfPlayers = team.players.filter((player) =>
        player.POS?.includes(pos)
      ).length;
      if (numOfPlayers < POSITION_COUNT[pos]) {
        remainingPositions.push(pos);
      }
    });
    const nextPlayer = sortedPlayersByAdp.value.find((p) => {
      const positions = p.POS.replaceAll('"', "").split(" ");
      return positions.some((pos) => remainingPositions.includes(pos));
    });
    return nextPlayer ?? sortedPlayersByAdp.value[0];
  }

  return {
    onDrafted,
  };
};
