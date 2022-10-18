<script setup>
import { useStore } from "../../../store/";

const store = useStore();
const { setLeagueFormStep, toggleLeagueForm } = store;
</script>

<template>
    <div class="start">
        <h3 class="ukg_sys_text_display_sm_onDark">New league</h3>
        <ukg-button-group>
            <ukg-button parent-icon="add-circle-empty" @click="setLeagueFormStep('create')">Create new league
            </ukg-button>
            <ukg-button parent-icon="import" @click="setLeagueFormStep('import')">Import league</ukg-button>
        </ukg-button-group>
        <ukg-button @click="toggleLeagueForm(false)">Cancel</ukg-button>
    </div>
</template>