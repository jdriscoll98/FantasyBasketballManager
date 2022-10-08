<script setup>
const emit = defineEmits(["select-tab"]);
const props = defineProps({
  active: {
    type: Boolean,
    default: false,
  },
  tab: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <button
    :class="{
      tab: true,
      active: props.active,
    }"
    @click="emit('select-tab', props.tab)"
  >
    {{ props.label }}
  </button>
</template>

<style scoped>
.tab {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-bottom: none;
  cursor: pointer;
}

.active {
  background-color: white;
  border-bottom: 5px solid #4caf50;
}
</style>