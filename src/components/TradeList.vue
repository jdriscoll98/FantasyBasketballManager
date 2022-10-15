
<script setup>
import { onMounted, ref } from "vue";
import { addEventListeners } from "../utils/helpers";

const props = defineProps({
    teams: {
        type: Array,
        required: true,
    },
    isTeamA: {
        type: Boolean,
        required: true,
    }
})

const selectedPlayers = ref([]);

const selectedTeamIndex = ref(0);

const addPlayer = () => {
    addEventListeners([{
        selector: `ukg-select#player-select-${props.isTeamA ? 'A' : 'B'}`,
        event: 'ukgChange',
        handler: (e) => {
            const player = props.teams[selectedTeamIndex.value].players.find((p) => p.PLAYER === e.detail.value);
            const index = selectedPlayers.value.findIndex(p => p.empty);
            if (index > -1) {
                selectedPlayers.value[index] = player;
            }
        },
    }])
    const emptyPlayer = {
        PLAYER: "Player",
        POS: "NA",
        EV: "0",
        empty: true,
    }
    selectedPlayers.value.push(emptyPlayer)
}

const getPos = (position) => {
    return position ? position.replaceAll('"', '').split(" ")[0] : "BN";
}

onMounted(() => {
    addEventListeners([{
        selector: `ukg-select#team-select-${props.isTeamA ? 'A' : 'B'}`,
        event: 'ukgChange',
        handler: (e) => {
            selectedTeamIndex.value = e.detail.value;
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
                <template v-for="(team, index) in props.teams">
                    <ukg-select-option :label="team.name" :value="team.name" :selected="index === selectedTeamIndex">
                    </ukg-select-option>
                </template>
            </ukg-select>
        </ukg-input-container>
        <ukg-card non-actionable>
            <ukg-list>
                <template v-for="player in selectedPlayers">
                    <ukg-list-item v-if="!player.empty">
                        <ukg-avatar slot='left' :initials="getPos(player.POS)"></ukg-avatar>
                        <p class="ukg-line-primary">{{ player.PLAYER }}</p>
                        <p class="ukg-line-secondary">EV: {{ player.TOTAL}}</p>
                        <ukg-button icon-only slot="right" parent-icon="delete"></ukg-button>
                    </ukg-list-item>
                    <div v-else class="empty-player">
                        <ukg-input-container>
                            <ukg-label>Player</ukg-label>
                            <ukg-select :id="`player-select-${isTeamA ? 'A' : 'B'}`">
                                <template v-for="player in props.teams[selectedTeamIndex].players">
                                    <ukg-select-option :label="player.PLAYER" :value="player.PLAYER">
                                    </ukg-select-option>
                                </template>
                            </ukg-select>
                        </ukg-input-container>
                    </div>
                </template>

            </ukg-list>
            <div class="add-player-section">
                <ukg-button emphasis="low" parent-icon="add-circle-filled" @click="addPlayer">Add player</ukg-button>
                <ukg-divider :has-margin="false" bg="light"></ukg-divider>
                <ukg-button parent-icon="generate" emphasis="low">Find a trade</ukg-button>
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
    padding: .5rem;
}
</style>