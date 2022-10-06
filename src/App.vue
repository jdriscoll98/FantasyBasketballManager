<script setup>
import { ref, computed, onMounted } from "vue";
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
    console.log("using local storage");
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
</script>

<template>
  <h1>Draft Helper</h1>
  <input v-model="search" />
  <div class="draft-grid">
    <!-- Header -->
    <template v-for="col in cols" :key="col">
      <div class="draft-header-cell">{{ col }}</div>
    </template>
    <!--  End Header -->
    <template v-for="player in displayPlayers" :key="player.name">
      <template v-for="col in cols" :key="col">
        <div class="draft-cell">{{ player[col] }}</div>
      </template>
    </template>
  </div>
</template>

<style scoped>
.draft-grid {
  display: grid;
  grid-template-columns: repeat(23, 1fr);
  grid-template-rows: repeat(16, 1fr);
  width: 100%;
}

.draft-header-cell {
  background-color: #f1f1f1;
  border: 1px solid #ddd;
  text-align: center;
}

.draft-cell {
  border: 1px solid #ddd;
  text-align: center;
}
</style>
