<script setup>
import { ref, onMounted } from "vue";
import { addEventListeners } from "../../../utils/helpers";
// Stores
import { useStore } from "../../../store";

const store = useStore();
const { importLeague, toggleLeagueForm, availablePlatforms } = store;

const importPlatform = ref("sleeper");
const importLeagueId = ref("882805658884804608");

onMounted(() => {
    addEventListeners([{
        selector: "ukg-input#league-id-input",
        event: "ukgChange",
        handler: (e) => {
            importLeagueId.value = e.target.value;
        },
    },
    {
        selector: "ukg-select#import-platform-select",
        event: "ukgChange",
        handler: (e) => {
            importPlatform.value = e.detail.value;
        },
    }])
})

</script>

<template>
    <div class="import">
        <h3 class="ukg_sys_text_subheading_lg_onDark">Add league</h3>
        <ukg-input-container>
            <ukg-label>Platform</ukg-label>
            <ukg-select id="league-platform-select">
                <template v-for="platform in availablePlatforms">
                    <ukg-select-option :selected="platform === importPlatform" :value="platform" :label="platform">
                    </ukg-select-option>
                </template>
            </ukg-select>
        </ukg-input-container>
        <ukg-input-container>
            <ukg-label>League ID</ukg-label>
            <ukg-input :value="importLeagueId" id="league-id-input"></ukg-input>
        </ukg-input-container>
        <ukg-button-group>
            <ukg-button @click="importLeague({ platform: importPlatform, id: importLeagueId })">Import</ukg-button>
            <ukg-button @click="toggleLeagueForm(false)" emphasis="mid">Go back</ukg-button>
        </ukg-button-group>
    </div>
</template>
