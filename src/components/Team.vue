<script setup>
import { ref } from "vue";
import { useStore } from "../store/";
import { storeToRefs } from "pinia";

const store = useStore();
const { selectedLeague } = storeToRefs(store);

const props = defineProps({
    team: {
        type: Object,
        required: true,
    },
});

const getTeamEv = (team) => {
    // sum up each players total value
    return Math.round(
        team?.players.reduce((acc, player) => {
            return !player.empty ? acc + Number(player.Total) : acc;
        }, 0)
    );
};

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

const sortedByRosterOrder = (players) => {
    return players.sort((a, b) => {
        const rosterOrder = selectedLeague.value.rosterPositions;
        const aIndex = rosterOrder.indexOf(a.RosterSlot);
        const bIndex = rosterOrder.indexOf(b.RosterSlot);
        return aIndex - bIndex;
    })
}

</script>

<template>
    <div class="team">
        <ukg-menu :id="`player-options-${props.team.name.replace(' ', '')}`">
            <ukg-menu-item icon="delete" @click="deleteSelectedPlayer">Delete</ukg-menu-item>
        </ukg-menu>
        <ukg-list class="team-list">
            <ukg-list-section>
                {{ props.team.name }}
            </ukg-list-section>
            <template v-for="player of sortedByRosterOrder(props.team.players)">
                <ukg-list-item has-divider>
                    <ukg-avatar slot="left" :initials="player.RosterSlot" :color="getColor(player.RosterSlot)">
                    </ukg-avatar>
                    <p class="ukg-line-primary" :style="{'white-space': 'nowrap'}">{{ player.Name }}</p>
                    <p class="ukg-line-secondary">EV: {{ player.Total }}</p>
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