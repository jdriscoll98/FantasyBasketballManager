
<script setup>
// Components
import { LeagueForm, LeagueList } from "./components/"
// Stores
import { useStore } from "../../store";
import { storeToRefs } from "pinia"

const { showLeagueForm } = storeToRefs(useStore());
</script>

<template>
    <div class="league-page ukg_sys_color_brand_background">
        <LeagueForm v-if="showLeagueForm" />
        <LeagueList v-else />
    </div>
</template>

<style>
.league-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
    padding: 1rem;
}

.league-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 600px;
    gap: 1rem;
}

.league-form {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
}

@media screen and (min-width: 768px) {
    .league-form {
        align-items: center
    }
}

.start {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    gap: 1rem;
}
</style>