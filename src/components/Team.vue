<script setup>
import { POSITION_ORDER } from "../utils";
import { ref } from "vue";
const props = defineProps({
    team: {
        type: Object,
        required: true,
    },
    players: {
        type: Array,
        required: true,
    },
    teamView: {
        type: String,
        required: true,
    },
});

const emit = defineEmits(["deletePlayer"]);


const getTeamEv = (team) => {
    // sum up each players total value
    return Math.round(
        team?.players.reduce((acc, player) => {
            return !player.empty ? acc + Number(player.TOTAL) : acc;
        }, 0)
    );
};

const onDeletePlayer = (player) => {
    const index = props.team.players.findIndex((p) => p.PLAYER === player.PLAYER);
    emit("deletePlayer", index);
}
const getPlayerName = (name) => {
    const [firstName, lastName] = name.split(" ")
    if (lastName) {
        return `${firstName[0]}. ${lastName}`
    }
    else {
        return name;
    }

}

const getPosition = (position, index) => {
    if (props.teamView === 'draftOrder') {
        return position ? position.replaceAll('"', '') : "BN";
    }
    else {
        return POSITION_ORDER[index]
    }
}

const items = ref([
    {
        label: 'Options',
        items: [
            {
                label: 'Delete',
                icon: 'pi pi-times',
                command: () => {
                    onDeletePlayer(selectedPlayer.value)
                }

            }
        ]
    },
])

const menu = ref();
const selectedPlayer = ref("");
const toggle = (event, player) => {
    selectedPlayer.value = player;
    menu.value.toggle(event);
};

</script>

<template>
    <div class="team">
        <Menu id="overlay_menu" ref="menu" :model="items" :popup="true" />

        <div class="team-header-cell">{{ props.team.name }}</div>
        <template v-for="(player, index) in players" :key="player.PLAYER">
            <div class="team-cell">
                <div class="position-box">{{ getPosition(player.POS, index) }}</div>
                <div class="player-box">
                    <span class="player-name">{{ getPlayerName(player.PLAYER) }}</span>
                    <span class="player-ev">{{ player.TOTAL }}</span>
                </div>
                <Button icon="pi pi-ellipsis-v" class="p-button-rounded p-button-text p-button-plain"
                    @click="toggle($event, player)" />
                <!-- <button v-if="!player.empty" @click="onDeletePlayer(player)">
                    Delete
                </button> -->
            </div>
        </template>
        <div class="team-footer-cell">
            Total EV: {{ getTeamEv(props.team) }}
        </div>
    </div>
</template>

<style>
.team-header-cell {
    background-color: #eee;
    display: flex;
    align-items: center;
}

.team-footer-cell {
    background-color: #eee;
    display: flex;
    align-items: center;
    bottom: 0;
}

.team-cell {
    border: 1px solid #ddd;
    display: flex;
    align-items: center;
    justify-content: space-between;
    white-space: nowrap;
    flex: 1;
}

/* take up whole screen on mobile */
@media screen and (max-width: 768px) {
    .team-cell {
        width: 100vw;
    }
}


.team {
    display: flex;
    flex-direction: column;
    flex: 1;
}

.team-player {
    height: 3rem;
}

.position-box {
    min-width: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: .25rem;
    border-radius: .5rem;
    background-color: #ddd;
    margin: 0.5rem;
    font-weight: bold;
}

.team-cell:nth-child(2)>.position-box {
    color: red;
}

.team-cell:nth-child(3)>.position-box {
    color: blue;
}

.team-cell:nth-child(4)>.position-box,
.team-cell:nth-child(5)>.position-box {
    color: green;
}

.team-cell:nth-child(6)>.position-box {
    color: orange;
}

.team-cell:nth-child(7)>.position-box {
    color: purple;
}

.team-cell:nth-child(8)>.position-box,
.team-cell:nth-child(9)>.position-box {
    color: brown;
}

.team-cell:nth-child(10)>.position-box,
.team-cell:nth-child(11)>.position-box {
    color: yellowgreen;
}

.player-box {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    flex: 1;
}

.player-box>.player-name {
    font-weight: bold;
}
</style>