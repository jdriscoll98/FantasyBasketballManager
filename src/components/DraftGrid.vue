<script setup>
import { computed } from "vue";
import DraftButton from "./Button.vue";
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

const emit = defineEmits(["draftPlayer"]);

function handleCheckboxChanged(e, player) {
  player.selected = e.target.checked;
}

function onDraftButtonClicked(player) {
  emit("draftPlayer", player);
}

const excludedCols = ["drafted"];

const filterdCols = computed(() => {
  return props.cols.filter((col) => !excludedCols.includes(col));
});
</script>

<template>
  <div class="draft-grid">
    <!-- Header -->
    <div class="draft-header-cell"></div>
    <template v-for="col in filterdCols" :key="col">
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
        <DraftButton
          @click="onDraftButtonClicked(player)"
          label="Draft"
          type="success"
        />
      </div>
      <template v-for="col in filterdCols" :key="col">
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
  grid-template-rows: repeat(20, min-content);
  width: 100%;
  height: calc(100vh - 11rem);
  overflow-y: scroll;
}

.draft-header-cell {
  background-color: #f1f1f1;
  border: 1px solid #ddd;
  text-align: center;
  position: sticky;
  top: 0;
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