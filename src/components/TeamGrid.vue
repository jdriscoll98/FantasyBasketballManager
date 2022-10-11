<script setup>
import Team from "./Team.vue";
const props = defineProps({
  teams: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["deletePlayer"]);

</script>

<template>
  <div class="team-grid">
    <template v-for="team in props.teams" :key="team.name">
      <Team :team="team" />
    </template>
  </div>
</template>

<style>
.team-grid {
  display: flex;
  width: 100%;
  height: 100%;
}
</style>