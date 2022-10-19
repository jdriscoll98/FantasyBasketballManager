<script setup>
import { onMounted, ref, watch } from "vue";
// Pages
import Leagues from "./pages/League/LeaguePage.vue";
import PlayerPanel from "./pages/Players/PlayerPanel.vue";
import TeamPanel from "./pages/Teams/TeamPanel.vue";
import TradePanel from "./pages/Trades/TradePanel.vue";
// Stores
import { useStore } from "./store";
import { storeToRefs } from "pinia"
import { addEventListeners } from "./utils/helpers";

const store = useStore();
const { fetchPlayers, fetchTeams } = store;
const { selectedLeague, activeTab } = storeToRefs(store);


const loading = ref(false);
onMounted(async () => {
  loading.value = true;
  await fetchPlayers();
  await fetchTeams();
  loading.value = false;

  addEventListeners([
    {
      selector: "ukg-tab-bar",
      event: "ukgTabSelected",
      handler: (e) => {
        activeTab.value = e.detail.identifier;
      },
    },
    {
      selector: "ukg-nav-header",
      event: "ukgNavBackButtonSelected",
      handler: () => {
        selectedLeague.value = null;
      },
    }
  ])
})

watch(() => selectedLeague.value, async () => {
  if (selectedLeague.value) {
    loading.value = true;
    await fetchPlayers();
    await fetchTeams();
    loading.value = false;
  }
})


</script>

<template>
  <ukg-ignite-shell default-translation-path>
    <ukg-nav-header show-back-button heading="Fantasy Basketball Manager" :show-menu-button="false"></ukg-nav-header>
    <ukg-tab-bar-panel v-if="selectedLeague && !loading">
      <ukg-tab-bar>
        <ukg-tab identifier="players" label="Players" :is-active="activeTab === 'players'"></ukg-tab>
        <ukg-tab identifier="teams" label="Teams" :is-active="activeTab === 'teams'"></ukg-tab>
        <ukg-tab identifier="trades" label="Trade" :is-active="activeTab === 'trades'"></ukg-tab>
      </ukg-tab-bar>
      <div id="players">
        <PlayerPanel />
      </div>
      <div id="teams">
        <TeamPanel />
      </div>
      <div id="trades">
        <TradePanel />
      </div>
    </ukg-tab-bar-panel>
    <Leagues v-else-if="!loading" />
    <div class="loading" v-else>
      <ukg-progress-circular indeterminate></ukg-progress-circular>
    </div>
  </ukg-ignite-shell>
</template>

<style scoped>
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  margin-top: 3rem;
}
</style>
