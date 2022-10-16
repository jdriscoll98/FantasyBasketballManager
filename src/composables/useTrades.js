export const useTrades = (teams, setTeams) => {
  const executeTrade = (tradePayload) => {
    const { teamAData, teamBData } = tradePayload;
    const teamA = teams.value[teamAData.index];
    const teamB = teams.value[teamBData.index];
    const teamAPlayers = teamAData.players;
    const teamBPlayers = teamBData.players;
    if (teamAPlayers.length !== teamBPlayers.length) {
      return;
    }
    // remove players
    teamA.players = teamA.players.filter(
      (player) => !teamAPlayers.includes(player)
    );
    teamB.players = teamB.players.filter(
      (player) => !teamBPlayers.includes(player)
    );
    // add new players
    teamA.players = [...teamA.players, ...teamBPlayers];
    teamB.players = [...teamB.players, ...teamAPlayers];
    setTeams([...teams.value]);
  };

  const findTrade = (tradePayload) => {
    //  To be implemented
  };

  return {
    executeTrade,
    findTrade,
  };
};
