import { defineStore } from "pinia";

import { fetchTeamsFromSleeper } from "../utils/integrations";

// One big store for now, but we can split it up later
export const useStore = defineStore("store", {
  state: () => ({
    // App state
    activeTab: "players",
    // League state
    leagues: [],
    selectedLeague: null,
    // League form state
    showLeagueForm: false,
    // Player state
    players: [],
    playerSearch: "",
    // Team state
    allTeams: [],
    currentTeams: [],
    // Trade state
    currentTrade: {
      teamA: null,
      teamB: null,
      teamAPlayers: [],
      teamBPlayers: [],
    },
  }),
  getters: {
    // League getters
    // League form getters
    availableSports() {
      return ["NBA"];
    },
    availableNumberOfTeams() {
      return ["8", "10", "12", "14", "16"];
    },
    // League import getters
    availablePlatforms() {
      return ["sleeper"];
    },
    // Player getters
    availablePlayers() {
      // return players that aren't on any team
      return this.players.filter((player) => {
        return !this.currentTeams.some((team) => {
          return team.players.some((p) => {
            return p.Name === player.Name;
          });
        });
      });
    },
    filteredPlayers() {
      return this.availablePlayers
        .filter((player) => {
          return player.Name.toLowerCase().includes(
            this.playerSearch.toLowerCase()
          );
        })
        .sort((a, b) => {
          const aTotal = Number(a.Total);
          const bTotal = Number(b.Total);
          return bTotal - aTotal;
        })
        .slice(0, 100);
    },
    sortedPlayers(sortKey = "Total") {},
    playerTableColumns() {
      return this.players[0]
        ? Object.keys(this.players[0]).filter((col) => {
            return col !== "SleeperId";
          })
        : [];
    },
    // Team getters
    // Trade getters
    getTradeValue() {
      return (isTeamA) => {
        const teamAValue = this.currentTrade.teamAPlayers.reduce(
          (acc, player) => {
            return acc + Number(player.Total);
          },
          0
        );
        const teamBValue = this.currentTrade.teamBPlayers.reduce(
          (acc, player) => {
            return acc + Number(player.Total);
          },
          0
        );
        return isTeamA ? teamBValue - teamAValue : teamAValue - teamBValue;
      };
    },
  },
  actions: {
    // League actions
    async fetchLeagues() {
      //  TODO: Fetch leagues from API
    },
    async addLeague(newLeague) {
      // TODO: Post league to API and add to store
      // Until then generate a random id
      if (!newLeague.id) {
        newLeague.id = Math.floor(Math.random() * 1000000);
      }
      if (!newLeague.scoringSettings) {
        this.addDefaultScoringSettings(newLeague);
      }
      if (!newLeague.rosterPositions) {
        this.addDefaultRosterPositions(newLeague);
      }
      this.leagues.push(newLeague);
      return true;
    },
    addDefaultRosterPositions(league) {
      league.rosterPositions = [
        "PG",
        "SG",
        "G",
        "SF",
        "PF",
        "F",
        "C",
        "UTIL",
        "UTIL",
        "UTIL",
        "BE",
        "BE",
        "BE",
      ];
    },
    addDefaultScoringSettings(league) {
      league.scoringSettings = {
        PTS: 0.5,
        REB: 1,
        AST: 1,
        STL: 2,
        BLK: 2,
        TO: -1,
        DD: 1,
        TD: 2,
        TF: -1,
        FF: -2,
        FG3M: 0.5,
        Bonus40: 2,
        Bonus50: 2,
      };
    },
    async importLeague(importPayload) {
      const { platform } = importPayload;
      if (platform === "sleeper") {
        const { id } = importPayload;
        const res = await fetch(`https://api.sleeper.app/v1/league/${id}`);
        const data = await res.json();
        const numberOfTeams = data.total_rosters;
        const sport = data.sport;
        const scoringSettings = data.scoring_settings;
        const rosterPositions = data.roster_positions;
        const name = data.name;
        const league = {
          name,
          sport,
          numberOfTeams,
          scoringSettings,
          rosterPositions,
          platform,
          id,
          imported: true,
        };
        await this.addLeague(league);
        this.toggleLeagueForm(false);
      }
    },
    async selectLeague(league) {
      this.selectedLeague = league;
    },
    // League form actions
    async toggleLeagueForm(show) {
      this.showLeagueForm = show;
    },
    // Team actions
    async fetchTeams() {
      if (this.selectedLeague?.platform === "sleeper") {
        this.currentTeams = await fetchTeamsFromSleeper(
          this.selectedLeague,
          this.players
        );
      }
    },

    async updateTeams(newTeams) {},
    async removePlayerFromTeam(team, player) {},
    async resetTeams() {},
    async tradePlayers(teamA, teamB, playersA, playersB) {},

    // Player actions
    async fetchPlayers() {
      if (this.selectedLeague?.sport.toLowerCase() === "nba") {
        // TODO: Fetch players from API
        await fetch("data.csv")
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
              player.Total = Math.round(
                0.5 * Number(player.Points) +
                  1 * Number(player.Rebounds) +
                  1 * Number(player.Assists) +
                  2 * Number(player.Steals) +
                  2 * Number(player.Blocks) -
                  1 * Number(player.TO) +
                  0.5 * Number(player.TPM) +
                  1 * Number(player.DD) +
                  2 * Number(player.TD)
              );
              players.push(player);
            }
            cols.push("Total");
            this.players = players;
          });
      }
    },
    async setPlayerSearch(search) {
      this.playerSearch = search;
    },
    // Trade actions
    async setTradeTeams(team, isTeamA) {
      if (isTeamA) {
        this.tradeTeamA = team;
      } else {
        this.tradeTeamB = team;
      }
    },
    async addPlayersToTrade(players, isTeamA) {
      if (isTeamA) {
        this.playersA = players;
      } else {
        this.playersB = players;
      }
    },
  },
  persist: {
    enabled: true,
  },
});
