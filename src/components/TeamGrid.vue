<script setup>
const props = defineProps({
  teams: {
    type: Array,
    required: true,
  },
});

const getTeamEv = (team) => {
  // sum up each players total value
  return Math.round(
    team.players.reduce((acc, player) => {
      return !player.empty ? acc + Number(player.TOTAL) : acc;
    }, 0)
  );
};
</script>

<template>
  <div class="team-grid">
    <template v-for="team in props.teams" :key="team.name">
      <div class="team">
        <div class="team-header-cell">{{ team.name }}</div>
        <template v-for="player in team.players" :key="player.PLAYER">
          <div class="team-cell">
            {{ player.PLAYER }}
          </div>
        </template>
        <div class="team-footer-cell">
          {{ team.name }} EV: {{ getTeamEv(team) }}
        </div>
      </div>
    </template>
  </div>
</template>

<style>
.team-grid {
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: 100%;
}

.team-header-cell {
  background-color: #eee;
  display: flex;
  align-items: center;
}

.team-footer-cell {
  background-color: #eee;
  display: flex;
  align-items: center;
  bottom: 0;
}

.team-cell {
  border: 1px solid #ddd;
  display: flex;
  align-items: center;
}

.team {
  width: 100%;
  display: grid;
  grid-template-rows: 2rem repeat(14, 3.5rem);
}

.team-player {
  height: 3rem;
}
</style>