<script setup>
import { ref, computed, onMounted } from "vue";
import DraftGrid from "./components/DraftGrid.vue";
import DraftActions from "./components/DraftActions.vue";
import TeamGrid from "./components/TeamGrid.vue";
import TeamActions from "./components/TeamActions.vue";

const allPlayers = ref([]);
const cols = ref([]);

const displayPlayers = computed(() => {
  return availablePlayers.value.filter((player) => {
    return (
      search.value === "" ||
      player.PLAYER.toLowerCase().includes(search.value.toLowerCase())
    );
  });
});

onMounted(() => {
  // load in data.csv from assets
  fetchPlayerData();
  fetchTeamData();
});

function fetchPlayerData() {
  const savedPlayers = localStorage.getItem("allPlayers");
  if (savedPlayers) {
    allPlayers.value = JSON.parse(savedPlayers);
    cols.value = Object.keys(allPlayers.value[0]);
  } else {
    console.log("fetching");
    fetch("data.csv")
      .then((response) => response.text())
      .then((text) => {
        const lines = text.split("\n");
        cols.value = lines[0].split(",");
        const players = [];
        for (let i = 1; i < lines.length; i++) {
          const player = {};
          const line = lines[i].replace(/(".*),(.*")/gm, "$1 $2");
          const currentline = line.split(",");
          for (let j = 0; j < cols.value.length; j++) {
            player[cols.value[j].trim()] = currentline[j];
          }
          players.push(player);
        }
        allPlayers.value = players;
        localStorage.setItem("allPlayers", JSON.stringify(players));
      });
  }
}

function fetchTeamData() {
  const savedTeams = localStorage.getItem("allTeams");
  if (savedTeams) {
    teams.value = JSON.parse(savedTeams);
  } else {
    // generate empty teams
    teams.value = Array(10)
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
const search = ref("");
const view = ref("draft");

const teams = ref([]);
const activeTeamIndex = ref(0);
const autoIncrementOnDraft = ref(true);
const onSearchChange = (value) => {
  search.value = value;
};

const onDrafted = (player) => {
  const team = teams.value[activeTeamIndex.value];
  const emptyPlayer = team.players.find((p) => p.empty);
  if (emptyPlayer) {
    emptyPlayer.empty = false;
    Object.assign(emptyPlayer, player);
    player.drafted = true;
    allPlayers.value = [...allPlayers.value];
    teams.value = [...teams.value];
    localStorage.setItem("allPlayers", JSON.stringify(allPlayers.value));
    localStorage.setItem("allTeams", JSON.stringify(teams.value));
    if (autoIncrementOnDraft.value) {
      activeTeamIndex.value = (activeTeamIndex.value + 1) % teams.value.length;
    }
  }
};

function onAutoIncrementChange(event) {
  autoIncrementOnDraft.value = event.target.checked;
}

const availablePlayers = computed(() => {
  return allPlayers.value.filter((player) => !player.drafted);
});
const onSelectTeam = (e) => {
  activeTeamIndex.value = Number(e.target.value);
};
const resetTeams = () => {
  teams.value = teams.value.map((team) => {
    team.players = team.players.map((_, index) => {
      return {
        PLAYER: `Player ${index + 1}`,
        empty: true,
      };
    });
    return team;
  });
  allPlayers.value = allPlayers.value.map((player) => {
    player.drafted = false;
    return player;
  });
  localStorage.setItem("allPlayers", JSON.stringify(allPlayers.value));
  localStorage.setItem("allTeams", JSON.stringify(teams.value));
};
</script>

<template>
  <div class="app-heading">
    <h1>Fantasy Basketball Manager</h1>
  </div>
  <div class="tab-panel">
    <div class="tab-bar">
      <button
        :class="{
          tab: true,
          active: view === 'draft',
        }"
        @click="view = 'draft'"
      >
        Draft board
      </button>
      <button
        :class="{
          tab: true,
          active: view === 'team',
        }"
        @click="view = 'team'"
      >
        Team board
      </button>
    </div>
    <div class="tab-actions">
      <DraftActions
        v-if="view === 'draft'"
        @search="onSearchChange"
        @selectTeam="onSelectTeam"
        @changeAutoIncrement="onAutoIncrementChange"
        :autoIncrementOnDraft="autoIncrementOnDraft"
        :activeTeamIndex="activeTeamIndex"
        :teams="teams"
      />
      <TeamActions v-if="view === 'team'" @reset="resetTeams" />
    </div>
    <DraftGrid
      :players="displayPlayers"
      :cols="cols"
      v-if="view === 'draft'"
      @draftPlayer="onDrafted"
    />
    <TeamGrid :teams="teams" v-else-if="view === 'team'" />
  </div>
</template>

<style scoped>
.tab-bar {
  background-color: #f1f1f1;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  position: sticky;
  top: 5rem;
  height: 3rem;
}

.tab-actions {
  position: sticky;
  top: 8rem;
}

.tab {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-bottom: none;
  cursor: pointer;
}

.tab.active {
  background-color: white;
  border-bottom: 5px solid #4caf50;
}

.tab-panel {
  display: grid;
  grid-template-rows: 3rem auto 1fr;
}

.app-heading {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgb(0, 27, 85);
  color: white;
  position: sticky;
  top: 0;
}
</style>
