<script setup>
import Team from "./Team.vue";
import TeamActions from "./TeamActions.vue"
const props = defineProps({
  teams: {
    type: Array,
    required: true,
  },
  teamView: {
    type: String,
    required: true,
  },
  resetTeams: {
    type: Function,
    required: true,
  },
});

const emit = defineEmits(["deletePlayer"]);

</script>

<template>
  <TeamActions @reset="resetTeams" :teams="teams" @viewChanged="teamView = $event" :teamView="teamView" />
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
  flex: 1;
  overflow-x: scroll
}
</style>