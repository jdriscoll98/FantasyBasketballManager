
<script setup>
import { ref, watch } from "vue";
import { addEventListeners } from "../utils/helpers.js";

const props = defineProps({
    leagues: {
        type: Array,
        required: true,
    }
})

const emit = defineEmits(["addLeague", "selectLeague"]);
const step = ref('start');
watch(() => step.value,
    () => {
        if (step.value === 'create') {
            // Workaround to fix the icon not showing up since it thinks its on dark
            const id = setInterval(() => {
                const element = document.querySelector("#sport-select-container ukg-icon");
                if (element) {
                    element.classList.remove("ukg-icon-on-dark")
                    clearInterval(id);
                }
            }, 50);
            const id2 = setInterval(() => {
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
                        leagueForm.value.name = e.target.value;
                    },
                },
                {
                    selector: "ukg-select#team-count-select",
                    event: "ukgChange",
                    handler: (e) => {
                        leagueForm.value.numberOfTeams = e.detail.value;
                    },
                },
            ])
        }
    })

const leagueForm = ref({
    name: "My League",
    sport: "NBA",
    numberOfTeams: "10",
});

const sports = ["NBA"];
const availableNumberOfTeams = ["8", "9", "10", "11", "12", "13", "14", "15", "16"];

const showLeagueForm = ref(false);

const validateAndSubmit = () => {
    if (leagueForm.value.name.length < 3) {
        alert("League name must be at least 3 characters");
        return;
    }
    emit("addLeague", leagueForm.value);
    showLeagueForm.value = false;
    step.value = 'start';
}
</script>

<template>
    <div class="league-page ukg_sys_color_brand_background">
        <div v-if="showLeagueForm">
            <template v-if="step == 'start'">
                <div class="start">
                    <h3 class="ukg_sys_text_display_sm_onDark">New league</h3>
                    <ukg-button-group>
                        <ukg-button parent-icon="add-circle-empty" @click="step = 'create'">Create new league
                        </ukg-button>
                        <ukg-button parent-icon="import">Import league</ukg-button>
                    </ukg-button-group>
                </div>
            </template>

            <template v-if="step === 'create'">
                <div class="league-form">
                    <h3 class="ukg_sys_text_display_sm_onDark">New league</h3>
                    <ukg-label class="ukg_sys_text_subheading_lg_onDark">Name</ukg-label>
                    <ukg-input-container>
                        <ukg-input id="league-name-input" :value="leagueForm.name"></ukg-input>
                    </ukg-input-container>
                    <ukg-label class="ukg_sys_text_subheading_lg_onDark">Sport</ukg-label>
                    <ukg-input-container id="sport-select-container">
                        <ukg-select id="sport-select">
                            <template v-for="sport in sports">
                                <ukg-select-option :value="sport" :label="sport" :selected="leagueForm.sport === sport">
                                </ukg-select-option>
                            </template>
                        </ukg-select>
                    </ukg-input-container>
                    <ukg-label class="ukg_sys_text_subheading_lg_onDark">Number of teams</ukg-label>
                    <ukg-input-container id="team-count-select-container">
                        <ukg-select id="team-count-select">
                            <template v-for="i in availableNumberOfTeams" :key="i">
                                <ukg-select-option :value="i" :label="i" :selected="leagueForm.numberOfTeams === i"
                                    :compareWith="compareFunc">
                                </ukg-select-option>
                            </template>
                        </ukg-select>
                    </ukg-input-container>
                    <ukg-button @click="validateAndSubmit">Add league</ukg-button>
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
                        <ukg-list-item @click="emit('selectLeague', league.id)">
                            <ukg-icon icon='person' has-badge :badge-value="league.numberOfTeams" slot="right">
                            </ukg-icon>
                            <p class="ukg-line-primary">{{ league.name }}</p>
                            <p class="ukg-line-secondary">{{ league.sport }}
                            </p>
                            <ukg-icon slot="left" name="go-forward">
                            </ukg-icon>
                        </ukg-list-item>
                    </template>
                </ukg-list>
            </ukg-card>
            <ukg-button @click="showLeagueForm = true">Add a league</ukg-button>
        </div>
    </div>
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