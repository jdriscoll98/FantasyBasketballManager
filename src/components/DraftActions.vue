<script setup>
import { ref } from "vue";
const emit = defineEmits(["search", "selectTeam", "changeSetting", "draft"]);
const props = defineProps({
  teams: {
    type: Array,
    required: true,
  },
  settings: {
    type: Object,
    required: true,
  },
});
const search = ref("");

const toggleMenu = () => {
  const menu = document.querySelector(".team-select-container");
  menu.classList.toggle("show");
}
</script>

<template>
  <div class="draft-actions">

    <div class="toolbar">
      <Button icon="pi pi-cog" class="p-button-rounded p-button-text" @click="toggleMenu()" />
      <input class="filter-table-searchbar" v-model="search" placeholder="Search by name. . ."
        @input="emit('search', search)" />
    </div>
    <div class="team-select-container">
      <label class="team-select-label">Active team: </label>
      <select @change="
        emit('changeSetting', {
          key: 'activeTeamIndex',
          value: Number($event.target.value),
        })
      " class="draft-select">
        <template v-for="(team, index) in props.teams" :key="team.name">
          <option :value="index" :selected="index === props.settings.activeTeamIndex">
            {{ team.name }}
          </option>
        </template>
      </select>
      <div class="checkbox-container">
        <input @change="
          emit('changeSetting', {
            key: 'autoIncrementOnDraft',
            value: $event.target.checked,
          })
        " type="checkbox" :checked="props.settings.autoIncrementOnDraft" /><label>Auto increment on draft</label>
      </div>
      <div class="checkbox-container">
        <input @change="
          emit('changeSetting', {
            key: 'autoDraft',
            value: $event.target.checked,
          })
        " type="checkbox" :checked="props.settings.autoDraft" /><label>Auto draft other teams</label>
      </div>
    </div>


  </div>
</template>

<style>
.draft-actions {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 1rem;
}

.filter-table-searchbar {
  margin: 0.5rem 0;
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
}

.draft-select {
  margin: 0.5rem 0;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
}

.team-select-container:not(.show) {
  display: none;
}

.toolbar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

@media screen and (min-width: 600x) {
  .team-select-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>