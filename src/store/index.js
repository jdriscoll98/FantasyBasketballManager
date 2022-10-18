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
    // League import getters
    availablePlatforms() {
      return ["sleeper"];
    },
    // Player getters
    availablePlayers() {
      // return players that aren't on any team
      return this.players.filter((player) => {
        return !this.teams.some((team) => {
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
      return this.players
        ? Object.keys(this.players[0]).filter((col) => {
            return col !== "SleeperId";
          })
        : [];
    },
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
    async fetchPlayers(sport) {
      if (sport.toLowerCase() === "nba") {
        // TODO: Fetch players from API
        fetch("data.csv")
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
              player.Total = getTotal(player);
              players.push(player);
            }
            cols.push("Total");
            this.players = players;
          });
      }

      const getTotal = (player) => {
        // TODO: Use league scoring settings to calculate total
        const total =
          0.5 * Number(player.Points) +
          1 * Number(player.Rebounds) +
          1 * Number(player.Assists) +
          2 * Number(player.Steals) +
          2 * Number(player.Blocks) -
          1 * Number(player.TO) +
          0.5 * Number(player.TPM) +
          1 * Number(player.DD) +
          2 * Number(player.TD);
        return Math.round(total);
      };
    },
    async setPlayerSearch(search) {
      this.playerSearch = search;
    },
  },
  persist: {
    enabled: true,
  },
});
