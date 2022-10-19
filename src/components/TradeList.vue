
<script setup>
import { onMounted } from "vue";
import { addEventListeners } from "../utils/helpers";

import { useStore } from "../store";
import { storeToRefs } from "pinia";

const store = useStore();
const { getTradeValue } = store;
const { currentTrade, currentTeams } = storeToRefs(store);

const props = defineProps({
    isTeamA: {
        type: Boolean,
        required: true,
    },
})


const emit = defineEmits(["playersUpdated", "teamsUpdated", "findTrade"]);



const addPlayer = () => {
    addEventListeners([{
        selector: `ukg-select#player-select-${props.isTeamA ? 'A' : 'B'}`,
        event: 'ukgChange',
        handler: (e) => {

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


onMounted(() => {
    addEventListeners([{
        selector: `ukg-select#team-select-${props.isTeamA ? 'A' : 'B'}`,
        event: 'ukgChange',
        handler: (e) => {
            console.log(e);
        },
    },
    ])
})


</script>
<template>
    <div class="trade-team">
        <ukg-input-container>
            <ukg-label>Team</ukg-label>
            <ukg-select :id="`team-select-${props.isTeamA ? 'A' : 'B'}`">
                <template v-for="(team, index) in currentTeams" :key="team.name">
                    <ukg-select-option :label="team.name" :value="team.name"
                        :selected="index === props.selectedTeamIndex">
                    </ukg-select-option>
                </template>
            </ukg-select>
        </ukg-input-container>
        <ukg-card non-actionable>
            <ukg-list>
                <template v-for="player in props.selectedPlayers" :key="player.Name">
                    <ukg-list-item v-if="!player.empty" has-divider>
                        <ukg-avatar slot='left' :initials="player.RosterSlot"></ukg-avatar>
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
                <ukg-list-item class="positive" v-if="getTradeValue(props.isTeamA) > 0">
                    <p class="ukg-line-primary result-line">Result: {{ getResult() }}</p>
                </ukg-list-item>
                <ukg-list-item class="negative" v-if="getTradeValue(props.isTeamA) < 0">
                    <p class="ukg-line-primary result-line">Result: {{ getResult() }}</p>
                </ukg-list-item>
            </ukg-list>
            <div class="add-player-section">
                <ukg-button :disabled="props.selectedTeamIndex === null" emphasis="low" parent-icon="add-circle-filled"
                    @click="addPlayer">Add player</ukg-button>
                <ukg-divider :has-margin="false" bg="light"></ukg-divider>
                <ukg-button disabled parent-icon="generate" emphasis="low" @click="emit('findTrade')">Find a trade -
                    Coming soon!
                </ukg-button>
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