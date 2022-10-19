<script setup>
import Team from "./Team.vue";
import { useStore } from "../../store";
import { storeToRefs } from "pinia";

const store = useStore();
const { currentTeams } = storeToRefs(store);

</script>

<template>
  <div class="team-grid">
    <template v-for="team in currentTeams" :key="team.name">
      <Team :team="team" />
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