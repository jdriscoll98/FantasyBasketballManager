<script setup>
import { ref, computed, onMounted } from "vue";
import DraftGrid from "./components/DraftGrid.vue";
import TeamGrid from "./components/TeamGrid.vue";
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

const { resetTeams, teamView } = useTeamActions(
  teams,
);


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
  <div class="tab-content">
    <DraftGrid v-if="view === 'draft'" :changeSetting="changeSetting" :players="displayPlayers" :cols="cols"
      @draftPlayer="onDrafted" :draftSettings="draftSettings" :teams="teams" @searchChanged="search = $event" />
    <TeamGrid v-else-if="view === 'team'" :teams="teams" @deletePlayer="deletePlayer" :teamView="teamView"
      :resetTeams="resetTeams" />
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
  display: flex;
  flex-direction: column;
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
