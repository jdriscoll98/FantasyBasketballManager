<script setup>
const emit = defineEmits(["reset", 'viewChanged']);
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

const onViewChanged = (view) => {
  emit('viewChanged', view)
}


</script>

<template>
  <div class="team-actions">
    <ukg-button-toggle type="Single" value="position">
      <ukg-button is-toggle value="draft" @click="onViewChanged('draft')">Draft order</ukg-button>
      <ukg-button is-toggle value="position" @click="onViewChanged('position')" selected>Position order</ukg-button>
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
</style>