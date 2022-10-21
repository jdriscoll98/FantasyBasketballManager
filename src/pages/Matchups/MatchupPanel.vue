<script setup>
import { onMounted, ref, watch } from "vue";

import { useStore } from "../../store";
import { storeToRefs } from "pinia";
import { addEventListeners } from "../../utils/helpers";

const store = useStore();

const { fetchMatchups } = store;
const { selectedWeek, currentTeams, matchupTeamId, matchupTeam } = storeToRefs(store);


onMounted(() => {
    fetchMatchups()

    addEventListeners([
        {
            selector: "ukg-select#team-select",
            event: "ukgChange",
            handler: (e) => {
                const team = currentTeams.find((team) => team.name === e.detail.value);
                matchupTeamId.value = team.id;
            }
        }
    ])
})

watch(() => selectedWeek.value, () => {
    fetchMatchups()
})



</script>

<template>
    <div class="matchup-page">
        <h1>Matchup</h1>
        <div class="matchup-week">
            <ukg-button-group>
                <ukg-button @click="selectedWeek > 1 ? selectedWeek-- : null" icon-only parent-icon="go-back">
                </ukg-button>
                <h2 class="ukg_sys_text_display_sm_onLight">Week {{ selectedWeek }}</h2>
                <ukg-button @click="selectedWeek < 18 ? selectedWeek++ : null" icon-only parent-icon="go-forward">
                </ukg-button>
            </ukg-button-group>
            <ukg-input-container>
                <ukg-label>Team</ukg-label>
                <ukg-select id="team-select">
                    <template v-for="team in currentTeams">
                        <ukg-select-option :label="team.name" :value="team.name" :selected="matchupTeamId === team.id">
                        </ukg-select-option>
                    </template>
                </ukg-select>
            </ukg-input-container>

            <h3>Points {{ matchupTeam.points }}</h3>
            <ukg-list>
                <template v-for="player in matchupTeam.players">
                    <ukg-list-item>
                        <p class="ukg-line-primary">{{ player.Name }}</p>
                        <p class="ukg-line-secondary">{{ player.playerPoints }}</p>
                    </ukg-list-item>
                </template>
            </ukg-list>
        </div>
    </div>
</template>

<style>
.matchup-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
}
</style>