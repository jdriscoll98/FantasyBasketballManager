<script setup>
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

</script>

<template>
  <div class="team-grid">
    <template v-for="team in props.teams" :key="team.name">
      <Team :team="team" @deletePlayer="emit('deletePlayer', team, $event)" :teamView="teamView" />
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