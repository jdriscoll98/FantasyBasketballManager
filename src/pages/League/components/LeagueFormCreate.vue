<script setup>
import { ref, onMounted } from "vue";
import { addEventListeners } from "../../../utils/helpers.js";
import { useStore } from "../../../store/";

const store = useStore();
const { availableSports, availableNumberOfTeams, setLeagueFormStep, toggleLeagueForm, addLeague } = store;

const leagueName = ref("My League");
const selectedSport = ref("NBA");
const numberOfTeams = ref("10");

const validateAndSubmit = () => {
    if (leagueName.value.length < 3) {
        alert("League name must be at least 3 characters");
        return;
    }
    const league = {
        name: leagueName.value,
        sport: selectedSport.value,
        numberOfTeams: numberOfTeams.value,
    }
    addLeague(league).then((success) => {
        if (success) {
            toggleLeagueForm(false);
        }
    })
}

onMounted(() => {
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
                numberOfTeams.value = e.detail.value;
            },
        },
        {
            selector: "ukg-select#sport-select",
            event: "ukgChange",
            handler: (e) => {
                selectedSport.value = e.detail.value;
            },
        },
    ])
})
</script>

<template>
    <div class="league-form">
        <h3 class="ukg_sys_text_display_sm_onDark">New league</h3>
        <ukg-label class="ukg_sys_text_subheading_lg_onDark">Name</ukg-label>
        <ukg-input-container>
            <ukg-input id="league-name-input" :value="leagueName"></ukg-input>
        </ukg-input-container>
        <ukg-label class="ukg_sys_text_subheading_lg_onDark">Sport</ukg-label>
        <ukg-input-container id="sport-select-container">
            <ukg-select id="sport-select">
                <template v-for="sport in availableSports">
                    <ukg-select-option :value="sport" :label="sport" :selected="sport === selectedSport">
                    </ukg-select-option>
                </template>
            </ukg-select>
        </ukg-input-container>
        <ukg-label class="ukg_sys_text_subheading_lg_onDark">Number of teams</ukg-label>
        <ukg-input-container id="team-count-select-container">
            <ukg-select id="team-count-select">
                <template v-for="i in availableNumberOfTeams" :key="i">
                    <ukg-select-option :value="i" :label="i" :selected="numberOfTeams === i" :compareWith="compareFunc">
                    </ukg-select-option>
                </template>
            </ukg-select>
        </ukg-input-container>
        <ukg-button @click="validateAndSubmit">Add league</ukg-button>
        <ukg-button @click="setLeagueFormStep('start')" emphasis="mid">Go back</ukg-button>
    </div>
</template>