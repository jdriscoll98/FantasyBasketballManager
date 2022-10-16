
<script setup>
import { onMounted, ref, watch } from "vue";
import { addEventListeners } from "../utils/helpers";

const props = defineProps({
    teams: {
        type: Array,
        required: true,
    },
    isTeamA: {
        type: Boolean,
        required: true,
    },
    receivingPlayers: {
        type: Array,
        required: true,
    },
    selectedPlayers: {
        type: Array,
        required: true,
    }
})


const emit = defineEmits(["playersUpdated", "teamsUpdated"]);


const selectedTeamIndex = ref(props.isTeamA ? 0 : 1);

const addPlayer = () => {
    addEventListeners([{
        selector: `ukg-select#player-select-${props.isTeamA ? 'A' : 'B'}`,
        event: 'ukgChange',
        handler: (e) => {
            const player = props.teams[selectedTeamIndex.value].players.find((p) => p.Name === e.detail.value);
            const index = props.selectedPlayers.findIndex(p => p.empty);
            if (index > -1) {
                props.selectedPlayers[index] = player;
            }
        },
    }])
    const emptyPlayer = {
        Name: "Player",
        Position: "NA",
        Total: "0",
        empty: true,
    }
    props.selectedPlayers.push(emptyPlayer)
    emit("playersUpdated", props.isTeamA, props.selectedPlayers);
}

const getPos = (position) => {
    return position ? position.replaceAll('"', '').split(" ")[0] : "BN";
}

const getResult = () => {
    const leavingPlayersTotal = props.selectedPlayers.reduce((acc, player) => {
        return !player.empty ? acc + Number(player.Total) : acc;
    }, 0);
    const receivingPlayersTotal = props.receivingPlayers.reduce((acc, player) => {
        return !player.empty ? acc + Number(player.Total) : acc;
    }, 0);
    // round to the nearest hundreds place
    const result = Math.trunc((receivingPlayersTotal - leavingPlayersTotal) * 1000) / 1000;
    return result;
}

const removePlayer = (player) => {
    const index = props.selectedPlayers.indexOf(player);
    if (index > -1) {
        props.selectedPlayers.splice(index, 1);
    }
    emit("playersUpdated", props.isTeamA, props.selectedPlayers);
}

const getPlayers = () => {
    return props.teams[selectedTeamIndex.value].players.filter((p) => !p.empty && !props.selectedPlayers.includes(p));
}

onMounted(() => {
    addEventListeners([{
        selector: `ukg-select#team-select-${props.isTeamA ? 'A' : 'B'}`,
        event: 'ukgChange',
        handler: (e) => {
            const teamIndex = props.teams.findIndex((t) => t.name === e.detail.value);
            selectedTeamIndex.value = teamIndex;
            props.selectedPlayers = [];
            emit("playersUpdated", props.isTeamA, []);
            emit('teamsUpdated', props.isTeamA, teamIndex);
        },
    },
    ])
})


</script>
<template>
    <div class="trade-team">
        <ukg-input-container>
            <ukg-label>Team</ukg-label>
            <ukg-select :id="`team-select-${isTeamA ? 'A' : 'B'}`">
                <template v-for="(team, index) in props.teams" :key="team.name">
                    <ukg-select-option :label="team.name" :value="team.name" :selected="index === selectedTeamIndex">
                    </ukg-select-option>
                </template>
            </ukg-select>
        </ukg-input-container>
        <ukg-card non-actionable>
            <ukg-list>
                <template v-for="player in props.selectedPlayers" :key="player.Name">
                    <ukg-list-item v-if="!player.empty" has-divider>
                        <ukg-avatar slot='left' :initials="getPos(player.Position)"></ukg-avatar>
                        <p class="ukg-line-primary">{{ player.Name }}</p>
                        <p class="ukg-line-secondary">EV: {{ player.Total}}</p>
                        <ukg-button icon-only slot="right" parent-icon="delete" @click="removePlayer(player)">
                        </ukg-button>
                    </ukg-list-item>
                    <div v-else class="empty-player">
                        <ukg-input-container>
                            <ukg-label>Player</ukg-label>
                            <ukg-select :id="`player-select-${isTeamA ? 'A' : 'B'}`">
                                <template v-for="player in getPlayers()">
                                    <ukg-select-option :label="player.Name" :value="player.Name">
                                    </ukg-select-option>
                                </template>
                            </ukg-select>
                        </ukg-input-container>
                    </div>

                </template>
                <!-- conditional to change a class , hack since i can't use :class on custom components until i get vue bindings -->
                <ukg-list-item class="positive" v-if="getResult() > 0">
                    <p class="ukg-line-primary result-line">Result: {{ getResult() }}</p>
                </ukg-list-item>
                <ukg-list-item class="negative" v-if="getResult() < 0">
                    <p class="ukg-line-primary result-line">Result: {{ getResult() }}</p>
                </ukg-list-item>
            </ukg-list>
            <div class="add-player-section">
                <ukg-button emphasis="low" parent-icon="add-circle-filled" @click="addPlayer">Add player</ukg-button>
                <ukg-divider :has-margin="false" bg="light"></ukg-divider>
                <ukg-button parent-icon="generate" emphasis="low" @click="findATrade">Find a trade</ukg-button>
            </div>
        </ukg-card>
    </div>
</template>

<style>
.add-player-section {
    display: flex;
    justify-content: center;
    flex-direction: column;
}

.trade-team {
    margin-top: 1rem;
}

.empty-player {
    padding: .5rem .5rem 0 .5rem;
}

.result-line {
    text-align: center;
    color: white !important;
}

.positive {
    background-color: var(--ukg_sys_color_success);
}

.negative {
    background-color: var(--ukg_sys_color_important);
}
</style>