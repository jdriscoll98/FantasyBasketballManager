<script setup>
const props = defineProps({
  type: {
    type: String,
  },
  label: {
    type: String,
  },
});
</script>

<template>
  <button
    :class="{
      [`${props.type}`]: true,
    }"
  >
    {{ props.label }}
  </button>
</template>

<style scoped>
button {
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 8px;
  font-weight: bold;
}

button.success {
  background-color: #4caf50;
}
button.success:hover,
button.success:active {
  background-color: #3e8e41;
  transform: scale(1.05);
}

button.danger {
  background-color: #f44336;
}
button.danger:hover,
button.danger:active {
  background-color: #da251d;
  transform: scale(1.05);
}
</style>