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
  settings: {
    teamCount: 8,
  }
}];
const selectedLeague = ref(null);

const showLeagueForm = ref(false);

const leagueName = ref("");
const selectedSport = ref("NBA");
const selectedTeamCount = ref('12');
const sports = ["NBA"];
const teamCounts = ['8', '9', '10', '11', '12', '13', '14', '15', '16'];
const setShowLeagueForm = (val) => {
  showLeagueForm.value = val;
}

const addLeague = () => {
  leagues.push({
    name: leagueName.value,
    sport: selectedSport.value,
    settings: {
      teamCount: selectedTeamCount.value,
    }
  });
  leagueName.value = "";
  setShowLeagueForm(false);
}

const selectLeague = (league) => {
  selectedLeague.value = league;
}

const step = ref('start');


watch(() => step.value,
  () => {
    if (step.value === 'create') {
      // Workaround to fix the icon not showing up since it thinks its on dark
      const id = setInterval(() => {
        console.log("fixing icon")
        const element = document.querySelector("#sport-select-container ukg-icon");
        if (element) {
          element.classList.remove("ukg-icon-on-dark")
          clearInterval(id);
        }
      }, 50);
      const id2 = setInterval(() => {
        console.log("fixing icon")
        const element = document.querySelector("#team-count-select-container ukg-icon");
        if (element) {
          element.classList.remove("ukg-icon-on-dark")
          clearInterval(id2);
        }
      }, 50);
      // End Workaround

      addEventListeners([
        {
          selector: "ukg-input#league-name-input",
          event: "ukgChange",
          handler: (e) => {
            leagueName.value = e.target.value;
          },
        },
        {
          selector: "ukg-select#team-count-select",
          event: "ukgChange",
          handler: (e) => {
            selectedTeamCount.value = e.detail.value;
          },
        },
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
      <div v-if="showLeagueForm">

        <template v-if="step == 'start'">
          <div class="start">
            <h3 class="ukg_sys_text_display_sm_onDark">New league</h3>
            <ukg-button-group>
              <ukg-button parent-icon="add-circle-empty" @click="step = 'create'">Create new league</ukg-button>
              <ukg-button parent-icon="import">Import league</ukg-button>
            </ukg-button-group>
          </div>

        </template>

        <template v-if="step === 'create'">
          <div class="league-form">
            <h3 class="ukg_sys_text_display_sm_onDark">New league</h3>
            <ukg-label class="ukg_sys_text_subheading_lg_onDark">Name</ukg-label>
            <ukg-input-container>
              <ukg-input id="league-name-input"></ukg-input>
            </ukg-input-container>
            <ukg-label class="ukg_sys_text_subheading_lg_onDark">Sport</ukg-label>
            <ukg-input-container id="sport-select-container">
              <ukg-select id="sport-select">
                <template v-for="sport in sports">
                  <ukg-select-option :value="sport" :label="sport" :selected="selectedSport === sport">
                  </ukg-select-option>
                </template>
              </ukg-select>
            </ukg-input-container>
            <ukg-label class="ukg_sys_text_subheading_lg_onDark">Number of teams</ukg-label>
            <ukg-input-container id="team-count-select-container">
              <ukg-select id="team-count-select">
                <template v-for="i in teamCounts" :key="i">
                  <ukg-select-option :value="i" :label="i" :selected="selectedTeamCount === i"
                    :compareWith="compareFunc">
                  </ukg-select-option>
                </template>
              </ukg-select>
            </ukg-input-container>
            <ukg-button @click=" addLeague">Add league</ukg-button>
            <ukg-button @click="step = 'start'" emphasis="mid">Go back</ukg-button>
          </div>
        </template>


      </div>

      <div class="league-section" v-else>
        <h1 class="ukg_sys_text_display_sm_onDark">Leagues</h1>

        <h3 class="ukg_sys_text_subheading_lg_onDark" v-if="leagues.length === 0">No leagues found!</h3>
        <ukg-card>
          <ukg-list>
            <template v-for="league in leagues" :key="league.id">
              <ukg-list-item @click="selectLeague(league)">
                <ukg-icon icon='person' has-badge :badge-value="league.settings.teamCount" slot="right"></ukg-icon>
                <p class="ukg-line-primary">{{ league.name }}</p>
                <p class="ukg-line-secondary">{{ league.sport }}
                </p>
                <ukg-icon slot="left" name="go-forward">
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

.start {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 1rem;
}
</style>
