<script setup>
import { ref } from "vue";
import Button from "./Button.vue";
const emit = defineEmits(["reset"]);
const props = defineProps({
  boardName: {
    type: String,
  },
});
const onSaveTeams = () => {
  emit("saveTeams");
};
</script>

<template>
  <div class="team-actions">
    <Button label="Reset teams" type="danger" @click="emit('reset')" />
  </div>
</template>

<style>
.team-actions {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 3rem;
}

.team-name-input {
  width: 10rem;
  height: 2rem;
  margin: 0.5rem;
}
</style>