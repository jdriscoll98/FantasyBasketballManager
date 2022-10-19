<script setup>
import { useStore } from "../../store/";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import { addEventListeners } from "../../utils/helpers";

const store = useStore();
const { setPlayerSearch, fetchPlayers } = store;
const { players, playerTableColumns, filteredPlayers, selectedLeague } = storeToRefs(store);

onMounted(() => {
    addEventListeners([
        {
            selector: "ukg-searchbar#player-search",
            event: "ukgChange",
            handler: (e) => {
                setPlayerSearch(e.detail.value);
            },
        },
    ]);
    setPlayerSearch("");
})

const isColumnSticky = (col) => {
    if (window.innerWidth < 600) {
        return false;
    }
    if (col === "Name") {
        return "left";
    }
    else if (col === "Total") {
        return "right";
    }
    else {
        return false;
    }
}
</script>

<template>
    <ukg-data-table-container>
        <ukg-data-table :isEmpty="filteredPlayers.length === 0">
            <ukg-searchbar aria-label="searchbar" slot="right" id="player-search">
            </ukg-searchbar>
            <table>
                <thead>
                    <tr>
                        <template v-for="col in playerTableColumns">
                            <ukg-th :sticky="isColumnSticky(col)">{{ col }}</ukg-th>
                        </template>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="player in filteredPlayers" :key="player.Name">
                        <tr>
                            <template v-for="col in playerTableColumns" :key="player[col]">
                                <td>{{ player[col] }}</td>
                            </template>
                        </tr>
                    </template>
                </tbody>
            </table>
            <div class="ukg-empty-message">
                <p>No players found</p>
            </div>
        </ukg-data-table>

    </ukg-data-table-container>
</template>