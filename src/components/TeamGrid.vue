<script setup>
const teams = Array(10).fill({
  name: "Team",
  players: Array(10).fill("player"),
});
</script>

<template>
  <div class="team-grid">
    <template v-for="team in teams" :key="team">
      <div class="team">
        <div class="team-header-cell">{{ team.name }}</div>
        <template v-for="player in team.players" :key="player">
          <div class="team-cell">{{ player }}</div>
        </template>
      </div>
    </template>
  </div>
</template>

<style>
.team-grid {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(10, 1fr);
}

.team-header-cell {
  background-color: #eee;
  display: flex;
  justify-content: center;
  align-items: center;
}

.team {
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-rows: repeat(13, 1fr);
}

.team-player {
  height: 3rem;
}
</style>