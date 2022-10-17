<script setup>
import { POSITION_ORDER } from "../utils/constants";
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
            return !player.empty ? acc + Number(player.Total) : acc;
        }, 0)
    );
};

const deleteSelectedPlayer = () => {
    console.log(props.team)
    const index = props.team.players.findIndex((p) => p.Name === selectedPlayer.value.Name);
    if (index > -1) {
        props.team.players[index] = { empty: true, position: "BN", Name: `Player ${index + 1}` };
        emit("deletePlayer", props.team, selectedPlayer);
    }
}

const getPosition = (position, index) => {
    if (props.teamView === 'draft' || index > 9) {
        return position ? position.replaceAll('"', '').split(" ")[0] : "BN";
    }
    else {
        return POSITION_ORDER[index]
    }
}


const getPlayers = (team) => {
    if (props.teamView === 'draft') {
        return team.players;
    }
    else {
        const players = Array(13).fill(0).map((_, i) => {
            return { empty: true, Position: POSITION_ORDER[i], Name: `Player ${i + 1}` };
        });
        const remainingPlayers = [...team.players.filter((p) => !p.empty)];
        POSITION_ORDER.forEach((pos, index) => {
            const player = remainingPlayers.find((player) => {
                return player.Position?.includes(pos)
            });
            if (player) {
                players[index] = player;
                remainingPlayers.splice(remainingPlayers.indexOf(player), 1);
            }
        })
        remainingPlayers.forEach((player) => {
            const emptyIndex = players.findIndex((p) => p.empty && p.Position === "BN");
            players[emptyIndex] = player;
        })
        return players;
    }
}


const presentMenu = (e, player) => {
    selectedPlayer.value = player;
    document.querySelector(`ukg-menu#player-options-${props.team.name.replace(' ', '')}`).present(e);
}
const selectedPlayer = ref(null);
"blue" | "default" | "green" | "orange" | "pink" | "purple" | "teal" | "yellow"
const getColor = (pos) => {
    const posToColor = {
        "PG": 'blue',
        "SF": 'pink',
        "SG": 'green',
        "G": 'orange',
        "PF": 'orange',
        "F": 'purple',
        "C": 'teal',
        "BN": 'default'
    }
    return posToColor[pos];
}

</script>

<template>
    <div class="team">
        <ukg-menu :id="`player-options-${team.name.replace(' ', '')}`">
            <ukg-menu-item icon="delete" @click="deleteSelectedPlayer">Delete</ukg-menu-item>
        </ukg-menu>
        <ukg-list class="ukg-surface-light team-list">
            <ukg-list-section>
                {{ props.team.name }}
            </ukg-list-section>
            <template v-for="(player, index) of getPlayers(props.team)">
                <ukg-list-item has-divider>
                    <ukg-avatar slot="left" :initials="getPosition(player.Position, index)"
                        :color="getColor(getPosition(player.Position, index))">
                    </ukg-avatar>
                    <p class="ukg-line-primary" :style="{'white-space': 'nowrap'}">{{ player.Name }}</p>
                    <p class="ukg-line-secondary">EV: {{ player.Total }}</p>
                    <ukg-button slot="right" icon-only parent-icon="menu-overflow" @click="presentMenu($event, player)">
                    </ukg-button>
                </ukg-list-item>
            </template>
        </ukg-list>
        <div class="team-footer-cell">
            Total EV: {{ getTeamEv(props.team) }}
        </div>
    </div>
</template>

<style>
.team-footer-cell {
    background-color: #eee;
    align-items: center;
    text-align: center;
    bottom: 0;
}

/* take up whole screen on mobile */
@media screen and (max-width: 768px) {
    .team-list {
        width: 100vw;
    }
}


.team {
    display: flex;
    flex-direction: column;
    flex: 1;
}
</style>