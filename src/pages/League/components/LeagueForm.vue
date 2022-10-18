<script setup>

import LeagueFormStart from "./LeagueFormStart.vue";
import LeagueFormCreate from "./LeagueFormCreate.vue";
import LeagueFormImport from "./LeagueFormImport.vue"

import { useStore } from "../../../store";
import { storeToRefs } from "pinia";

const store = useStore();
const { leagueFormStep } = storeToRefs(store);

</script>

<template>
    <LeagueFormStart v-if="leagueFormStep === 'start'" />
    <LeagueFormCreate v-else-if="leagueFormStep === 'create'" />
    <LeagueFormImport v-else-if="leagueFormStep === 'import'" />
</template>