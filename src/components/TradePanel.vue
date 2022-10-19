<script setup>
import TradeList from "./TradeList.vue";

</script>

<template>
    <div class="trade-panel">
        <TradeList is-team-a />
        <TradeList />
    </div>
</template>

<style scoped>
.trade-panel {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: flex-start;
    height: 100%;
    padding: 1rem 0;
}

@media screen and (max-width: 768px) {
    .trade-panel {
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }
}
</style>