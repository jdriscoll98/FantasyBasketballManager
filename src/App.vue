<script setup>
import { onMounted, ref, watch } from "vue";
import PlayerPanel from "./components/PlayerPanel.vue";
import TeamPanel from "./components/TeamPanel.vue";
import TradePanel from "./components/TradePanel.vue";
import { useTeams } from "./composables/useTeams.js";
import { usePlayers } from "./composables/usePlayers.js";
import { useTeamActions } from "./composables/useTeamActions.js";
import { useDraft } from "./composables/useDraft.js";
import { useTrades } from "./composables/useTrades.js";

import { addEventListeners } from "./utils/helpers.js"
const {
  teams,
  fetchTeamData,
  setTeams,
  deletePlayer,
} = useTeams();

const search = ref("");

const { fetchPlayerData, displayPlayers, sortedPlayersByTotal, cols } =
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
  fetchPlayerData();
  fetchTeamData();
  // league form listeners

});

const leagues = [{
  name: "My league",
  sport: "NBA",
}];
const selectedLeague = ref(null);

const showLeagueForm = ref(false);

const leagueName = ref("");
const selectedSport = ref("NBA");
const sports = ["NBA"];
const setShowLeagueForm = (val) => {
  showLeagueForm.value = val;
}

const addLeague = () => {
  leagues.push({
    name: leagueName.value,
    sport: selectedSport.value,
  });
  leagueName.value = "";
  setShowLeagueForm(false);
}

const selectLeague = (league) => {
  selectedLeague.value = league;
}


watch(() => showLeagueForm.value,
  () => {
    if (showLeagueForm.value) {
      // Workaround to fix the icon not showing up since it thinks its on dark
      setTimeout(() => {
        document.querySelector("#sport-select-container ukg-icon").classList.remove("ukg-icon-on-dark")
      }, 200)
      // End Workaround

      addEventListeners([
        {
          selector: "ukg-input#league-name-input",
          event: "ukgChange",
          handler: (e) => {
            leagueName.value = e.target.value;
          },
        }
      ])
    }

  })
</script>

<template>
  <ukg-ignite-shell default-translation-path>
    <ukg-nav-header disable-gradient :has-horizontal-divider="false" heading="Fantasy Basketball Manager"
      :show-menu-button="false"></ukg-nav-header>
    <ukg-tab-bar-panel v-if="selectedLeague">
      <ukg-tab-bar>
        <ukg-tab identifier="players" label="Players" is-active></ukg-tab>
        <ukg-tab identifier="teams" label="Teams"></ukg-tab>
        <ukg-tab identifier="trades" label="Trade"></ukg-tab>
      </ukg-tab-bar>
      <div id="players">
        <PlayerPanel :changeSetting="changeSetting" :players="displayPlayers" :cols="cols" @draftPlayer="onDrafted"
          :draftSettings="draftSettings" :teams="teams" @searchChanged="search = $event" />
      </div>
      <div id="teams">
        <TeamPanel :teams="teams" @deletePlayer="deletePlayer" :teamView="teamView" :resetTeams="resetTeams" />
      </div>
      <div id="trades">
        <TradePanel :teams="teams" @execute-trade="executeTrade" @find-trade="findTrade" />
      </div>
    </ukg-tab-bar-panel>
    <div class="league-page ukg_sys_color_brand_background" v-else>
      <div class="league-form" v-if="showLeagueForm">
        <h3 class="ukg_sys_text_display_sm_onDark">New league</h3>
        <ukg-label class="ukg_sys_text_subheading_lg_onDark">Name</ukg-label>
        <ukg-input-container>
          <ukg-input id="league-name-input"></ukg-input>
        </ukg-input-container>
        <ukg-label class="ukg_sys_text_subheading_lg_onDark">Sport</ukg-label>
        <ukg-input-container id="sport-select-container">
          <ukg-select>
            <template v-for="sport in sports">
              <ukg-select-option :value="sport" :label="sport" :selected="selectedSport === sport"></ukg-select-option>
            </template>
          </ukg-select>
        </ukg-input-container>
        <ukg-button @click="addLeague">Add league</ukg-button>
        <ukg-button @click="setShowLeagueForm(false)" emphasis="mid">Go back</ukg-button>
      </div>
      <div class="league-section" v-else>
        <h1 class="ukg_sys_text_display_sm_onDark">Leagues</h1>

        <h3 class="ukg_sys_text_subheading_lg_onDark" v-if="leagues.length === 0">No leagues found!</h3>
        <ukg-card>
          <ukg-list>
            <template v-for="league in leagues" :key="league.id">
              <ukg-list-item @click="selectLeague(league)">
                <ukg-avatar slot="left" initials="1"></ukg-avatar>
                <p class="ukg-line-primary">{{ league.name }}</p>
                <p class="ukg-line-secondary">{{ league.sport }}</p>
                <ukg-icon slot="right" name="go-forward">
                </ukg-icon>
              </ukg-list-item>
            </template>

          </ukg-list>
        </ukg-card>
        <ukg-button @click="setShowLeagueForm(true)">Add a league</ukg-button>
      </div>
    </div>
  </ukg-ignite-shell>
</template>

<style scoped>
.league-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  padding: 1rem;
}

.league-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
  gap: 1rem;
}

.league-form {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
}

@media screen and (min-width: 768px) {
  .league-form {
    align-items: center
  }
}
</style>
