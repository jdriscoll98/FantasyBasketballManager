
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

onMounted(() => {
    addEventListeners([{
        selector: `ukg-select#team-select-${props.isTeamA ? 'A' : 'B'}`,
        event: 'ukgChange',
        handler: (e) => {
            const team = currentTeams.value.find(team => team.name === e.detail.value);
            if (props.isTeamA) {
                currentTrade.value.teamA = team;
            } else {
                currentTrade.value.teamB = team;
            }
        },
    }, {
        selector: `ukg-select#player-select-${props.isTeamA ? 'A' : 'B'}`,
        event: 'ukgChange',
        handler: (e) => {
            const playerName = e.detail.value;
            const player = props.isTeamA ? currentTrade.value.teamA.players.find(player => player.Name === playerName) : currentTrade.value.teamB.players.find(player => player.Name === playerName);
            if (!player) {
                return;
            }
            if (props.isTeamA) {
                if (currentTrade.value.teamAPlayers.includes(player)) {
                    return;
                }
                currentTrade.value.teamAPlayers.push(player);
            } else {
                if (currentTrade.value.teamBPlayers.includes(player)) {
                    return;
                }
                currentTrade.value.teamBPlayers.push(player);
            }
            const select = document.querySelector(`ukg-select#player-select-${props.isTeamA ? 'A' : 'B'}`);
            select.value = '';

        },
    }
    ])
})

const getPlayers = () => {
    if (props.isTeamA) {
        return currentTrade.value.teamAPlayers || [];
    } else {
        return currentTrade.value.teamBPlayers || [];
    }
}

const getTeamPlayers = () => {
    if (props.isTeamA) {
        return currentTrade.value.teamA?.players.filter((p) => {
            return !currentTrade.value.teamAPlayers.find((player) => player.Name === p.Name);
        });
    } else {
        return currentTrade.value.teamB?.players.filter((p) => {
            return !currentTrade.value.teamBPlayers.find((player) => player.Name === p.Name);
        });;
    }
}

const isSelected = (name) => {
    if (props.isTeamA) {
        return name === currentTrade.value.teamA?.name;
    } else {
        return name === currentTrade.value.teamB?.name;
    }
}

const removePlayer = (player) => {
    if (props.isTeamA) {
        currentTrade.value.teamAPlayers = currentTrade.value.teamAPlayers.filter((p) => p.Name !== player.Name);
    } else {
        currentTrade.value.teamBPlayers = currentTrade.value.teamBPlayers.filter((p) => p.Name !== player.Name);
    }
}



</script>
<template>
    <div class="trade-team">
        <ukg-input-container>
            <ukg-label>Team</ukg-label>
            <ukg-select :id="`team-select-${props.isTeamA ? 'A' : 'B'}`">
                <template v-for="team in currentTeams" :key="team.name">
                    <ukg-select-option :label="team.name" :value="team.name" :selected="isSelected(team.name)">
                    </ukg-select-option>
                </template>
            </ukg-select>
        </ukg-input-container>
        <ukg-card non-actionable>
            <ukg-list>
                <template v-for="player in getPlayers()" :key="player?.Name">
                    <ukg-list-item has-divider>
                        <ukg-avatar slot='left' :initials="player?.RosterSlot"></ukg-avatar>
                        <p class="ukg-line-primary">{{ player?.Name }}</p>
                        <p class="ukg-line-secondary">EV: {{ player?.Total}}</p>
                        <ukg-button icon-only slot="right" parent-icon="delete" @click="removePlayer(player)">
                        </ukg-button>
                    </ukg-list-item>
                </template>

                <div class="empty-player">
                    <ukg-input-container>
                        <ukg-label>Player</ukg-label>
                        <ukg-select :id="`player-select-${isTeamA ? 'A' : 'B'}`">
                            <template v-for="player in getTeamPlayers()">
                                <ukg-select-option :label="player.Name" :value="player.Name">
                                </ukg-select-option>
                            </template>
                        </ukg-select>
                    </ukg-input-container>
                </div>

                <!-- conditional to change a class , hack since i can't use :class on custom components until i get vue bindings -->
                <ukg-list-item class="positive" v-if="getTradeValue(props.isTeamA) > 0">
                    <p class="ukg-line-primary result-line">Result: {{ getTradeValue(props.isTeamA) }}</p>
                </ukg-list-item>
                <ukg-list-item class="negative" v-if="getTradeValue(props.isTeamA) < 0">
                    <p class="ukg-line-primary result-line">Result: {{ getTradeValue(props.isTeamA) }}</p>
                </ukg-list-item>
            </ukg-list>
            <div class="add-player-section">
                <ukg-divider :has-margin="false"></ukg-divider>
                <ukg-button disabled parent-icon="generate" emphasis="low">Find a trade -
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