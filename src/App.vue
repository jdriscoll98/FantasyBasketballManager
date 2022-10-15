<script setup>
import { onMounted, ref } from "vue";
import PlayerPanel from "./components/PlayerPanel.vue";
import TeamPanel from "./components/TeamPanel.vue";
import TradeList from "./components/TradeList.vue";
import { useTeams } from "./composables/useTeams.js";
import { usePlayers } from "./composables/usePlayers.js";
import { useTeamActions } from "./composables/useTeamActions.js";
import { useDraft } from "./composables/useDraft.js";

const {
  teams,
  fetchTeamData,
  setTeams,
  deletePlayer,
} = useTeams();

const search = ref("");

const { fetchPlayerData, displayPlayers, sortedPlayersByAdp, cols } =
  usePlayers(teams, search);

const { onDrafted, changeSetting, draftSettings } = useDraft(
  teams,
  setTeams,
  sortedPlayersByAdp,
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
  <ukg-ignite-shell default-translation-path>
    <ukg-nav-header heading="Fantasy Basketball Manager" :show-menu-button="false"></ukg-nav-header>
    <ukg-tab-bar-panel>
      <ukg-tab-bar>
        <ukg-tab identifier="players" label="Players"></ukg-tab>
        <ukg-tab identifier="teams" label="Teams"></ukg-tab>
        <ukg-tab identifier="trades" label="Trade" is-active></ukg-tab>
      </ukg-tab-bar>
      <div id="players">
        <PlayerPanel :changeSetting="changeSetting" :players="displayPlayers" :cols="cols" @draftPlayer="onDrafted"
          :draftSettings="draftSettings" :teams="teams" @searchChanged="search = $event" />
      </div>
      <div id="teams">
        <TeamPanel :teams="teams" @deletePlayer="deletePlayer" :teamView="teamView" :resetTeams="resetTeams" />
      </div>
      <div id="trades">
        <div class="trade-panel ukg_sys_color_surface_lightDarker_background">
          <TradeList :teams="teams" />

          <TradeList :teams="teams" />
        </div>
      </div>
    </ukg-tab-bar-panel>
  </ukg-ignite-shell>
</template>

<style scoped>
.trade-panel {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  height: 100%;
  padding: 1rem 0;
  flex-wrap: wrap;
}

.icon-section {
  display: flex;
  flex-direction: column;
}
</style>
