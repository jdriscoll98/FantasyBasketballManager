import { defineStore } from "pinia";

// One big store for now, but we can split it up later
export const useStore = defineStore("store", {
  state: () => ({
    // League state
    leagues: [],
    selectedLeague: null,
    // League form state
    showLeagueForm: false,
    leagueFormStep: "start",
    // Player state
    players: [],
    playerSearch: "",
    playerTableColumns: [],
    // Team state
    teams: [],
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
    // Player getters
    filteredPlayers() {},
    sortedPlayers(sortKey = "Total") {},
    // Team getters
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
      this.leagues.push(newLeague);
      return true;
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
      if (!show) {
        this.leagueFormStep = "start";
      }
    },
    async setLeagueFormStep(step) {
      this.leagueFormStep = step;
    },
    // Team actions
    async fetchTeams() {},
    async updateTeams(newTeams) {},
    async removePlayerFromTeam(team, player) {},
    async resetTeams() {},
    async tradePlayers(teamA, teamB, playersA, playersB) {},
    // Player actions
    async fetchPlayers() {},
  },
  persist: {
    enabled: true,
  },
});
