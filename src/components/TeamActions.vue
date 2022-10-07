<script setup>
import ResetButton from "./Button.vue";
const emit = defineEmits(["reset"]);
</script>

<template>
  <div class="team-actions">
    <ResetButton label="Reset teams" type="danger" @click="emit('reset')" />
  </div>
</template>

<style>
.team-actions {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  height: 3rem;
}
</style>