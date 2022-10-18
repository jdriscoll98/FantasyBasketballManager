<script setup>
import { onMounted, ref, watch } from "vue";
import PlayerPanel from "./components/PlayerPanel.vue";
import TeamPanel from "./components/TeamPanel.vue";
import TradePanel from "./components/TradePanel.vue";
import Leagues from "./components/Leagues.vue";
import { useTeams } from "./composables/useTeams.js";
import { usePlayers } from "./composables/usePlayers.js";
import { useTeamActions } from "./composables/useTeamActions.js";
import { useDraft } from "./composables/useDraft.js";
import { useTrades } from "./composables/useTrades.js";
import { useLeagues } from "./composables/useLeagues.js";

const { leagues, selectedLeague, fetchLeagueData, addLeague, selectLeague } = useLeagues();

const {
  teams,
  fetchTeamData,
  setTeams,
  deletePlayer,
} = useTeams();

const search = ref("");

const { allPlayers, fetchPlayerData, displayPlayers, sortedPlayersByTotal, cols } =
  usePlayers(teams, search);

const { onDrafted, changeSetting, draftSettings } = useDraft(
  teams,
  setTeams,
  sortedPlayersByTotal,
);

const { resetTeams, teamView } = useTeamActions(
  teams,
);

const { executeTrade, findTrade } = useTrades(teams, setTeams);


onMounted(() => {
  fetchLeagueData();
});

watch(() => selectedLeague.value, () => {
  fetchPlayerData(selectedLeague.value);
  fetchTeamData(selectedLeague.value, allPlayers);
});




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
        <PlayerPanel :changeSetting="changeSetting" :players="displayPlayers" :cols="cols" @draftPlayer="onDrafted"
          :draftSettings="draftSettings" :teams="teams.teams" @searchChanged="search = $event" />
      </div>
      <div id="teams">
        <TeamPanel :teams="teams.teams" @deletePlayer="deletePlayer" :teamView="teamView" :resetTeams="resetTeams" />
      </div>
      <div id="trades">
        <TradePanel :teams="teams.teams" @execute-trade="executeTrade" @find-trade="findTrade" />
      </div>
    </ukg-tab-bar-panel>
    <Leagues v-else :leagues="leagues" @add-league="addLeague" @select-league="selectLeague" />
  </ukg-ignite-shell>
</template>

<style scoped>

</style>
