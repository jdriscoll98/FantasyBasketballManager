<script setup>
import { ref, watch } from "vue";
import Button from "./Button.vue";
const emit = defineEmits(["reset", 'selectTeam', 'viewChanged']);
const props = defineProps({
  boardName: {
    type: String,
  },
  teams: {
    type: Array,
    required: true,
  },
  teamView: {
    type: String,
    required: true,
  },
});

watch(
  () => props.teamView, 
  (newView) => {
    view.value = viewOptions.find((option) => option.value === newView);
  }
)

const viewOptions = [
  { label: 'Draft order', value: 'draftOrder' },
  { label: 'By position', value: 'positionOrder' },
];
const view = ref(viewOptions.find((option) => option.value === props.teamView));


const onViewChanged = () => {
  emit('viewChanged', view.value.value)
}


</script>

<template>
  <div class="team-actions">
    <SelectButton v-model="view" :options="viewOptions" @change="onViewChanged" optionLabel="label" :unselectable="false"/>
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

@media screen and (max-width: 600px) {
  .desktop-only {
    display: none;
  }
}

@media screen and (min-width: 600px) {
  .mobile-only {
    display: none;
  }
}
</style>