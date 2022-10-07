<script setup>
import { ref, computed, onMounted } from "vue";
import DraftGrid from "./components/DraftGrid.vue";
import TeamGrid from "./components/TeamGrid.vue";
const allPlayers = ref([]);
const cols = ref([]);

const displayPlayers = computed(() => {
  return allPlayers.value.filter((player) => {
    return (
      search.value === "" ||
      player.PLAYER.toLowerCase().includes(search.value.toLowerCase())
    );
  });
});

onMounted(() => {
  // load in data.csv from assets
  const savedData = localStorage.getItem("allPlayers");
  if (savedData) {
    allPlayers.value = JSON.parse(savedData);
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
            player[cols.value[j]] = currentline[j];
          }
          players.push(player);
        }
        allPlayers.value = players;
        localStorage.setItem("allPlayers", JSON.stringify(players));
      });
  }
});

const search = ref("");
const view = ref("team");
</script>

<template>
  <div class="app-heading">
    <h1>Draft Helper</h1>
    <div class="form">
      <input v-model="search" />
      <div class="form-actions">
        <button class="success">Draft</button>
      </div>
    </div>
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
    <DraftGrid :players="displayPlayers" :cols="cols" v-if="view === 'draft'" />
    <TeamGrid v-else-if="view === 'team'" />
  </div>
</template>

<style scoped>
button.success {
  background-color: #4caf50;
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 8px;
  font-weight: bold;
}
button.success:hover,
button.success:active {
  background-color: #3e8e41;
  transform: scale(1.05);
}

.tab-bar {
  background-color: #f1f1f1;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
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
</style>
