<script setup>
import TradeList from "./TradeList.vue";

const props = defineProps({
    teams: {
        type: Array,
        required: true,
    },
})

</script>

<template>
    <div class="trade-panel ukg_sys_color_surface_lightDarker_background">
        <TradeList :teams="teams" is-team-a />
        <TradeList :teams="teams" />
    </div>
</template>

<style>
.trade-panel {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    height: 100%;
    padding: 1rem 0;
    flex-wrap: wrap;
}

.icon-section {
    display: flex;
    flex-direction: column;
}
</style>