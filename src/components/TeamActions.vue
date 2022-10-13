<script setup>
import { ref, watch } from "vue";
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
    <ukg-button-toggle type="Single">
      <ukg-button is-toggle value="draft">Draft order</ukg-button>
      <ukg-button is-toggle value="position">Position order</ukg-button>
    </ukg-button-toggle>
    <ukg-button emphasis="high" @click="emit('reset')">Reset teams</ukg-button>
  </div>
</template>

<style>
.team-actions {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
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