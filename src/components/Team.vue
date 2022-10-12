<script setup>
import { POSITION_ORDER } from "../utils";
import { ref } from "vue";
const props = defineProps({
    team: {
        type: Object,
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
    if (index > -1) {
        props.team.players[index] = { empty: true, position: player.position, PLAYER: `Player ${index + 1}` };
        emit("deletePlayer", props.team, player);
    }
}
const getPlayerName = (name) => {
    const [firstName, lastName] = name.split(" ")
    if (firstName !== "Player" && lastName) {
        return `${firstName[0]}. ${lastName}`
    }
    else {
        return name;
    }

}

const getPosition = (position, index) => {
    if (props.teamView === 'draftOrder' || index > 9) {
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

const getPlayers = (team) => {
    if (props.teamView === 'draftOrder') {
        return team.players;
    }
    else {
        const players = Array(13).fill(0).map((_, i) => {
            const player = team.players.find((p) => p.position === POSITION_ORDER[i]);
            return player ? player : { empty: true, position: POSITION_ORDER[i], PLAYER: `Player ${i + 1}` };
        });
        const remainingPlayers = [...team.players];
        POSITION_ORDER.forEach((pos, index) => {
            const player = remainingPlayers.find((player) => player.POS?.includes(pos));
            if (player) {
                players[index] = player;
                remainingPlayers.splice(remainingPlayers.indexOf(player), 1);
            }
        })
        remainingPlayers.forEach((player) => {
            const emptyIndex = players.findIndex((p) => p.empty && p.position === "BN");
            players[emptyIndex] = player;
        })
        return players;
    }
}

</script>

<template>
    <div class="team">
        <Menu id="overlay_menu" ref="menu" :model="items" :popup="true" />

        <div class="team-header-cell">{{ props.team.name }}</div>
        <template v-for="(player, index) in getPlayers(props.team)" :key="player.PLAYER">
            <div class="team-cell">
                <div class="position-box">{{ getPosition(player.POS, index) }}</div>
                <div class="player-box">
                    <span class="player-name">{{ getPlayerName(player.PLAYER) }}</span>
                    <span class="player-ev">{{ player.TOTAL }}</span>
                </div>
                <Button icon="pi pi-ellipsis-v" class="p-button-rounded p-button-text p-button-plain"
                    @click="toggle($event, player)" />
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

.team-cell:nth-child(12) {
    border-top: 5px solid #ddd;
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