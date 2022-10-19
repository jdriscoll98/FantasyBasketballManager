
<script setup>
// Components
import { LeagueForm, LeagueList } from "./components/"
// Stores
import { useStore } from "../../store";
import { storeToRefs } from "pinia"

const { showLeagueForm } = storeToRefs(useStore());
</script>

<template>
    <div class="league-page ">
        <LeagueForm v-if="showLeagueForm" />
        <LeagueList v-else />
    </div>
</template>

<style scoped>
.league-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
}
</style>