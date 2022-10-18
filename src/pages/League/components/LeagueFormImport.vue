
<script setup>
import { ref, onMounted } from "vue";
import { addEventListeners } from "../../../utils/helpers";

// Stores
import { useStore } from "../../../store";

const store = useStore();
const { importLeague, setLeagueFormStep } = store;

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
        <h3 class="ukg_sys_text_display_sm_onDark">Import league</h3>
        <ukg-input-container>
            <ukg-label>Platform</ukg-label>
            <ukg-select id="league-platform-select">
                <ukg-select-option selected value="sleeper" label="Sleeper"></ukg-select-option>
            </ukg-select>
        </ukg-input-container>
        <ukg-input-container>
            <ukg-label>League ID</ukg-label>
            <ukg-input :value="importLeagueId" id="league-id-input"></ukg-input>
        </ukg-input-container>
        <ukg-button-group>
            <ukg-button @click="importLeague({ platform: importPlatform, id: importLeagueId })">Import</ukg-button>
            <ukg-button @click="setLeagueFormStep('start')" emphasis="mid">Go back</ukg-button>
        </ukg-button-group>
    </div>
</template>