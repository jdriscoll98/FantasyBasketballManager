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
  activeTeamIndex: {
    type: Number,
    required: true,
  },
  teamView: {
    type: String,
    required: true,
  },
});

function onDropdownChange(e) {
  emit('selectTeam', selectedTeam);
}

const selectedTeam = ref(props.teams[props.activeTeamIndex]);

watch(
  () => props.teams,
  (newTeams) => {
    selectedTeam.value = newTeams[props.activeTeamIndex];
  }
);

watch(
  () => props.teamView, 
  (newView) => {
    view.value = viewOptions.find((option) => option.value === newView);
  }
)

const viewOptions = [
  { label: 'Draft order', value: 'draftOrder' },
  { label: 'By position', value: 'teamActions' },
];
const view = ref(viewOptions.find((option) => option.value === props.teamView));


const onViewChanged = () => {
  emit('viewChanged', view.value.value)
}


</script>

<template>
  <div class="team-actions">
    <SelectButton v-model="view" :options="viewOptions" @change="onViewChanged" optionLabel="label" :unselectable="false"/>
    <div class="mobile-only">
      <Dropdown @change="onDropdownChange($event)" :options="teams" optionLabel="name" v-model="selectedTeam" />
    </div>
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