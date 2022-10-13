<script setup>
import { ref, computed, onMounted } from "vue";
import DraftGrid from "./components/DraftGrid.vue";
import TeamGrid from "./components/TeamGrid.vue";
import { useTeams } from "./composables/useTeams.js";
import { usePlayers } from "./composables/usePlayers.js";
import { useDraftActions } from "./composables/useDraftActions.js";
import { useTeamActions } from "./composables/useTeamActions.js";
import { useDraft } from "./composables/useDraft.js";
import { addEventListeners } from "./utils/helpers.js"

const {
  teams,
  fetchTeamData,
  setTeams,
  deletePlayer,
} = useTeams();

const { draftSettings, changeSetting, updateActiveTeam, search } =
  useDraftActions(teams);

const { fetchPlayerData, displayPlayers, sortedPlayersByAdp, cols } =
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

onMounted(() => {
  fetchPlayerData();
  fetchTeamData();
});

</script>

<template>
  <ukg-nav-header heading="Fantasy Basketball Manager"></ukg-nav-header>
  <ukg-tab-bar-panel>
    <ukg-tab-bar>
      <ukg-tab identifier="draft" label="Draft board" is-active></ukg-tab>
      <ukg-tab identifier="team" label="Team board"></ukg-tab>
    </ukg-tab-bar>
    <div id="draft">
      <DraftGrid id="draft" :changeSetting="changeSetting" :players="displayPlayers" :cols="cols"
        @draftPlayer="onDrafted" :draftSettings="draftSettings" :teams="teams" @searchChanged="search = $event" />
    </div>
    <div id="team">
      <TeamGrid id="team" :teams="teams" @deletePlayer="deletePlayer" :teamView="teamView" :resetTeams="resetTeams" />
    </div>
  </ukg-tab-bar-panel>
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
  color: white;
  font-size: .5rem;
  max-width: 100vw;
  min-height: 3rem;
}

@media screen and (min-width: 600px) {
  .app-heading {
    min-height: 3em;
    font-size: 1rem;
  }
}
</style>
