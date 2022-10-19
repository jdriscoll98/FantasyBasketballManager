<script setup>
import { onMounted, watch } from "vue";
// Pages
import Leagues from "./pages/League/LeaguePage.vue";
// Components
import PlayerPanel from "./pages/Players/PlayerPanel.vue";
import TeamPanel from "./components/TeamPanel.vue";
import TradePanel from "./components/TradePanel.vue";
// Stores
import { useStore } from "./store";
import { storeToRefs } from "pinia"

const store = useStore();
const { fetchPlayers, fetchTeams } = store;
const { selectedLeague } = storeToRefs(store);

onMounted(async () => {
  await fetchPlayers();
  await fetchTeams();
})

</script>

<template>
  <ukg-ignite-shell default-translation-path>
    <ukg-nav-header disable-gradient heading="Fantasy Basketball Manager" :show-menu-button="false"></ukg-nav-header>
    <ukg-tab-bar-panel v-if="selectedLeague">
      <ukg-tab-bar>
        <ukg-tab identifier="players" label="Players"></ukg-tab>
        <ukg-tab identifier="teams" label="Teams" is-active></ukg-tab>
        <!-- <ukg-tab identifier="trades" label="Trade"></ukg-tab> -->
      </ukg-tab-bar>
      <div id="players">
        <PlayerPanel />
      </div>
      <div id="teams">
        <TeamPanel />
      </div>
      <!--   <div id="trades">
        <TradePanel />
      </div> -->
    </ukg-tab-bar-panel>
    <Leagues v-else />
  </ukg-ignite-shell>
</template>

<style scoped>

</style>
