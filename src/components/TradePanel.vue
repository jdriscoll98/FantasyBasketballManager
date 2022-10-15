<script setup>
import { ref } from "vue";
import TradeList from "./TradeList.vue";

const props = defineProps({
    teams: {
        type: Array,
        required: true,
    },
})

const emit = defineEmits(["executeTrade"]);

const teamAIndex = ref(0);
const teamBIndex = ref(1);

const teamASelectedPlayers = ref([]);
const teamBSelectedPlayers = ref([]);

const updatePlayers = (isTeamA, players) => {
    if (isTeamA) {
        teamASelectedPlayers.value = players;
    }
    else {
        teamBSelectedPlayers.value = players;
    }
}

const updateTeams = (isTeamA, teamIndex) => {
    if (isTeamA) {
        teamAIndex.value = teamIndex;
    }
    else {
        teamBIndex.value = teamIndex;
    }
}

const executeTrade = () => {
    const tradePayload = {
        teamAData: {
            index: teamAIndex.value,
            players: teamASelectedPlayers.value,
        },
        teamBData: {
            index: teamBIndex.value,
            players: teamBSelectedPlayers.value,
        }
    }
    emit("executeTrade", tradePayload);
    teamASelectedPlayers.value = [];
    teamBSelectedPlayers.value = [];

}



</script>

<template>
    <ukg-toolbar></ukg-toolbar>
    <div class="trade-panel">
        <TradeList @players-updated="updatePlayers" @teams-updated="updateTeams"
            :receivingPlayers="teamBSelectedPlayers" :teams="teams" is-team-a />
        <ukg-button @click="executeTrade">Execute trade</ukg-button>
        <TradeList @players-updated="updatePlayers" @teams-updated="updateTeams"
            :receivingPlayers="teamASelectedPlayers" :teams="teams" />
    </div>
</template>

<style scoped>
.trade-panel {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: flex-start;
    height: 100%;
    padding: 1rem 0;
}

@media screen and (max-width: 768px) {
    .trade-panel {
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }

    ukg-button {
        order: 3;
    }
}

.payoff-table {
    max-width: fit-content;
    margin: 0 auto;
}


.execute-trade-btn {
    margin: 1rem auto;
}
</style>