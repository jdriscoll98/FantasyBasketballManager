<script setup>
import { ref, computed, onMounted } from "vue";
import DraftGrid from "./components/DraftGrid.vue";
import DraftActions from "./components/DraftActions.vue";
import TeamGrid from "./components/TeamGrid.vue";
import TeamActions from "./components/TeamActions.vue";
import Tab from "./components/Tab.vue";
import { useTeams } from "./composables/useTeams.js";
import { usePlayers } from "./composables/usePlayers.js";
import { useDraftActions } from "./composables/useDraftActions.js";
import { useTeamActions } from "./composables/useTeamActions.js";
import { useDraft } from "./composables/useDraft.js";

const view = ref("team");

const {
  teams,
  fetchTeamData,
  setTeams,
  deletePlayer,
} = useTeams();

const { draftSettings, changeSetting, updateActiveTeam, search } =
  useDraftActions(teams);

const { allPlayers, fetchPlayerData, displayPlayers, sortedPlayersByAdp } =
  usePlayers(teams, search);

const { onDrafted } = useDraft(
  teams,
  setTeams,
  draftSettings,
  updateActiveTeam,
  sortedPlayersByAdp
);

const { activeTeamIndex, resetTeams, onSelectTeam, displayTeams } = useTeamActions(
  teams,
);

const teamView = ref('draftOrder');

const cols = computed(() => {
  return allPlayers.value.length > 0 ? Object.keys(allPlayers.value[0]) : [];
});

onMounted(() => {
  fetchPlayerData();
  fetchTeamData();
});
</script>

<template>
  <div class="app-heading">
    <h1>Fantasy Basketball Manager</h1>
  </div>
  <div class="tab-bar">
    <Tab label="Draft board" tab="draft" :active="view === 'draft'" @click="view = 'draft'" />
    <Tab label="Team board" tab="team" :active="view === 'team'" @click="view = 'team'" />
  </div>
  <div class="tab-actions">
    <DraftActions v-if="view === 'draft'" @search="search = $event"
      @changeSetting="changeSetting($event.key, $event.value)" :settings="draftSettings" :teams="teams" />
    <TeamActions v-if="view === 'team'" @reset="resetTeams" :teams="teams" :activeTeamIndex="activeTeamIndex"
      @selectTeam="onSelectTeam" @viewChanged="teamView = $event" :teamView="teamView" />
  </div>
  <div class="tab-content">
    <DraftGrid :players="displayPlayers" :cols="cols" v-if="view === 'draft'" @draftPlayer="onDrafted" />
    <TeamGrid :teams="displayTeams" v-else-if="view === 'team'" @deletePlayer="deletePlayer" :teamView="teamView" />
  </div>
</template>

<style scoped>
.tab-bar {
  background-color: #f1f1f1;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}


.tab-panel {
  display: grid;
  grid-template-rows: 3rem auto 1fr;
}

.tab-content {
  flex: 1;
}

.app-heading {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgb(0, 27, 85);
  color: white;
  font-size: .5rem;
  max-width: 100vw;
  height: 3rem;
}

@media screen and (min-width: 600px) {
  .app-heading {
    height: 3em;
    font-size: 1rem;
  }
}
</style>
