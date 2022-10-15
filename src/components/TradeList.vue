
<script setup>
import { ref } from "vue";

const props = defineProps({
    teams: {
        type: Array,
        required: true,
    },
})

const selectedPlayers = ref([]);
</script>
<template>
    <div class="trade-team">
        <ukg-input-container>
            <ukg-label>Team</ukg-label>
            <ukg-select>
                <template v-for="team in props.teams">
                    <ukg-select-option :label="team.name" :value="team.name"></ukg-select-option>
                </template>
            </ukg-select>
        </ukg-input-container>
        <ukg-card non-actionable>
            <ukg-list>
                <ukg-list-item v-for="player in selectedPlayers">
                    <ukg-avatar slot='left' initials="PG"></ukg-avatar>
                    <p class="ukg-line-primary">Player 1</p>
                    <p class="ukg-line-secondary">EV: 42.04</p>
                    <ukg-button icon-only slot="right" parent-icon="delete"></ukg-button>
                </ukg-list-item>

            </ukg-list>
            <div class="add-player-section">
                <ukg-button emphasis="low" parent-icon="add-circle-filled">Add player</ukg-button>
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
</style>