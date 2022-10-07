<script setup>
import { computed } from "vue";
const props = defineProps({
  players: {
    type: Array,
    required: true,
  },
  cols: {
    type: Array,
    required: true,
  },
});

function handleCheckboxChanged(e, player) {
  player.selected = e.target.checked;
}
</script>

<template>
  <div class="draft-grid">
    <!-- Header -->
    <div class="draft-header-cell"></div>
    <template v-for="col in cols" :key="col">
      <div class="draft-header-cell">{{ col }}</div>
    </template>
    <!--  End Header -->
    <!--  Player Rows -->
    <template v-for="player in props.players" :key="player.name">
      <div
        :class="{
          'draft-cell': true,
          'draft-cell--selected': player.selected,
        }"
      >
        <input
          type="checkbox"
          @change="handleCheckboxChanged($event, player)"
        />
      </div>
      <template v-for="col in cols" :key="col">
        <div
          :class="{
            'draft-cell': true,
            'draft-cell--selected': player.selected,
          }"
        >
          {{ player[col] }}
        </div>
      </template>
    </template>
    <!--  End Player Rows -->
  </div>
</template>

<style scoped>
.draft-grid {
  display: grid;
  grid-template-columns: repeat(24, 1fr);
  grid-template-rows: repeat(16, 1fr);
  width: 100%;
}

.draft-header-cell {
  background-color: #f1f1f1;
  border: 1px solid #ddd;
  text-align: center;
}

.draft-cell {
  border: 1px solid #ddd;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.draft-cell--selected {
  background-color: #8bc6f783;
  border: none;
}
</style>