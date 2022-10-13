<script setup>
import { POSITION_ORDER } from "../utils/constants";
import { onMounted, onRenderTracked, ref, watch } from "vue";
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
        return position ? position.replaceAll('"', '').split(" ")[0] : "BN";
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
            return { empty: true, position: POSITION_ORDER[i], PLAYER: `Player ${i + 1}` };
        });
        const remainingPlayers = [...team.players.filter((p) => !p.empty)];
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

const getRanking = (player, index) => {
    if (player.empty || props.teamView === 'draftOrder') {
        return "";
    }
    const allTeams = document.querySelectorAll(".team")
    const allPlayersEv = Array.from(allTeams).map((team) => {
        return Array.from(team.querySelectorAll(".player-ev")).map((player) => {
            return player.innerText.replace("\r", "").replace("\n", "").replace("EV: ", "");
        })
    })
    const allPlayersAtIndex = allPlayersEv.map((team) => {
        return Number(team[index]);
    })

    const avg = allPlayersAtIndex.reduce((acc, ev) => {
        return acc + ev;
    }, 0) / allPlayersAtIndex.length;
    if (Number(player.TOTAL) / avg > 1.1) {
        return 'top';
    }
    else if (Number(player.TOTAL) / avg < 0.9) {
        return "bottom";
    }
    else {
        return "middle";
    }
}

</script>

<template>
    <div class="team">
        <Menu id="overlay_menu" ref="menu" :model="items" :popup="true" />

        <ukg-list class="ukg-surface-light">
            <ukg-list-section>
                {{ props.team.name }}
            </ukg-list-section>
            <template v-for="(player, index) of getPlayers(props.team)">
                <ukg-list-item has-divider>
                    <ukg-avatar slot="left" :initials="getPosition(player.POS, index)"></ukg-avatar>
                    <p class="ukg-line-primary" :style="{'white-space': 'nowrap'}">{{ player.PLAYER }}</p>
                    <p class="ukg-line-secondary">EV: {{ player.TOTAL }}</p>
                    <ukg-button slot="right" icon-only parent-icon="menu-overflow"></ukg-button>
                </ukg-list-item>
            </template>
        </ukg-list>
        <!-- <template v-for="(player, index) in getPlayers(props.team)" :key="player.PLAYER">
            <div class="team-cell" :data-player="player.PLAYER">
                <div class="position-box">{{ getPosition(player.POS, index) }}</div>
                <div class="player-box">
                    <span class="player-name" :class="{
                        'player-name--empty': player.empty,
                    }">{{ getPlayerName(player.PLAYER) }}</span>
                    <span class="player-ev" v-if="!player.empty">{{ player.TOTAL }}</span>
                </div>
                <Button icon="pi pi-ellipsis-v" class="p-button-rounded p-button-text p-button-plain"
                    @click="toggle($event, player)" />
            </div>
        </template> -->
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
    align-items: center;
    text-align: center;
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

.team-cell.top {
    background-color: rgba(0, 255, 0, 0.25);
}

.team-cell.middle {
    background-color: rgba(0, 255, 255, 0.25);
}

.team-cell.bottom {
    background-color: rgba(255, 0, 0, 0.25);
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

.player-box>.player-name:not(.player-name--empty) {
    font-weight: bold;
}
</style>