<script setup>
import { POSITION_ORDER } from "../utils";
import Team from "./Team.vue";
const props = defineProps({
  teams: {
    type: Array,
    required: true,
  },
  teamView: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["deletePlayer"]);
const getPlayers = (team) => {
  if (props.teamView === 'draftOrder') {
    return team.players;
  }
  else {
    const players = [];
    const remainingPlayers = [...team.players];
    POSITION_ORDER.forEach((pos) => {
      const player = remainingPlayers.find((player) => player.POS?.includes(pos));
      if (player) {
        players.push(player);
        remainingPlayers.splice(remainingPlayers.indexOf(player), 1);
      }
    })
    if (remainingPlayers.length) {
      players.push(...remainingPlayers);
    }
    return players;
  }
}
</script>

<template>
  <div class="team-grid">
    <template v-for="team in props.teams" :key="team.name">
      <Team :team="team" :players="getPlayers(team)" @delete-player="emit('deletePlayer', team, $event)"
        :teamView="teamView" />
    </template>
  </div>
</template>

<style>
.team-grid {
  display: flex;
  width: 100%;
  height: 100%;
  overflow-x: scroll
}
</style>