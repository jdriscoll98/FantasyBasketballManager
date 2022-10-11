<script setup>
const props = defineProps({
    team: {
        type: Object,
        required: true,
    },
    players: {
        type: Array,
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

const onDeletePlayer = (player) =>{ 
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

</script>

<template>
    <div class="team">
        <div class="team-header-cell">{{ props.team.name }}</div>
        <template v-for="(player, index) in players" :key="player.PLAYER">
            <div class="team-cell">
                <strong>{{ player.POS }}</strong> {{ getPlayerName(player.PLAYER) }}
                <button v-if="!player.empty" @click="onDeletePlayer(player)">
                    Delete
                </button>
            </div>
        </template>
        <div class="team-footer-cell">
           EV: {{ getTeamEv(props.team) }}
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
    flex: 1;
}

.team-cell button {
    border: none;
    cursor: pointer;
    margin: 0 0.5rem;
    text-decoration: underline;
    color: red;
}

.team {
    display: flex;
    flex-direction: column;
    flex: 1;
}

.team-player {
    height: 3rem;
}
</style>