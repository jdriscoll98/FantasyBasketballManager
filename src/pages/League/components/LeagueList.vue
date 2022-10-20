<script setup>
// Stores
import { useStore } from "../../../store/";
import { storeToRefs } from "pinia";

const store = useStore();
const { selectLeague, toggleLeagueForm } = store
const { leagues } = storeToRefs(store)

</script>

<template>
    <div class="league-list">
        <h1 class="ukg_sys_text_display_sm_onDark">Leagues</h1>
        <h3 class="ukg_sys_text_subheading_lg_onDark" v-if="leagues.length === 0">No leagues found!</h3>
        <ukg-card>
            <ukg-list>
                <template v-for="league in leagues" :key="league.id">
                    <ukg-list-item @click="selectLeague(league)">
                        <ukg-icon icon='person' has-badge :badge-value="league.numberOfTeams" slot="right">
                        </ukg-icon>
                        <p class="ukg-line-primary">{{ league.name }}</p>
                        <p class="ukg-line-secondary">{{ league.sport }}
                        </p>
                        <ukg-icon slot="left" name="go-forward">
                        </ukg-icon>
                    </ukg-list-item>
                </template>
            </ukg-list>
        </ukg-card>
        <ukg-button @click="toggleLeagueForm(true)">Add a league</ukg-button>
    </div>
</template>

<style scoped>
.league-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 600px;
    gap: 1rem;
}
</style>