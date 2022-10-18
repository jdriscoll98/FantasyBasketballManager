<script setup>
import { onMounted } from "vue";
// Pages
import Leagues from "./pages/League/LeaguePage.vue";
// Components
import PlayerPanel from "./components/PlayerPanel.vue";
import TeamPanel from "./components/TeamPanel.vue";
import TradePanel from "./components/TradePanel.vue";
// Stores
import { useStore } from "./store";
import { storeToRefs } from "pinia"

const { selectedLeague } = storeToRefs(useStore());

</script>

<template>
  <ukg-ignite-shell default-translation-path>

    <ukg-nav-header disable-gradient heading="Fantasy Basketball Manager" :show-menu-button="false"></ukg-nav-header>
    <ukg-tab-bar-panel v-if="selectedLeague">
      <ukg-tab-bar>
        <ukg-tab identifier="players" label="Players" is-active></ukg-tab>
        <ukg-tab identifier="teams" label="Teams"></ukg-tab>
        <ukg-tab identifier="trades" label="Trade"></ukg-tab>
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
    <Leagues />
  </ukg-ignite-shell>
</template>

<style scoped>

</style>
