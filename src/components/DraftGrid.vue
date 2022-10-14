<script setup>
import { onMounted, ref, computed } from "vue";
import { addEventListeners } from "../utils/helpers";
const props = defineProps({
  players: {
    type: Array,
    required: true,
  },
  cols: {
    type: Array,
    required: true,
  },
  changeSetting: {
    type: Function,
    required: true,
  },
  draftSettings: {
    type: Object,
    required: true,
  },
  teams: {
    type: Array,
    required: true,
  }
});

const emit = defineEmits(["draftPlayer", "searchChanged"]);

function draftPlayer(player) {
  emit("draftPlayer", player);
}

const isColumnSticky = (col) => {
  if (window.innerWidth < 600) {
    return false;
  }
  if (col === "PLAYER" || col === "ADP") {
    return "left";
  }
  else if (col === "TOTAL") {
    return "right";
  }
  else {
    return false;
  }
}

const selectedPlayers = ref([]);


const toolbarButtons = computed(() => {
  const buttons = [
    {
      icon: 'person-add',
      label: "Draft",
      emphasis: 'mid',
      clickHandler: () => {
        document.querySelector("ukg-dialog#draft-dialog").present();
      },
    },
    {
      icon: 'settings',
      label: "Settings",
      emphasis: 'mid',
      clickHandler: () => {
        document.querySelector("ukg-modal#settings-modal").present();
      },
    },
  ]
  if (props.draftSettings.mockDraft) {
    return buttons.filter((button) => button.label !== "Draft");
  }
  return buttons;
})

const draftDialogButtonsHandler = (button) => {
  if (button === "Ok") {
    selectedPlayers.value.forEach((player) => {
      draftPlayer(player);
    });
    selectedPlayers.value = [];
  }
}

onMounted(() => {
  addEventListeners([
    {
      selector: "ukg-data-table",
      event: "ukgCheckboxChanged",
      handler: (e) => {
        const playerName = e.target.getAttribute("data-player");
        const player = props.players.find((p) => p.PLAYER === playerName);
        if (selectedPlayers.value.includes(player)) {
          selectedPlayers.value = selectedPlayers.value.filter((p) => p.PLAYER !== player.PLAYER);
        }
        else {
          selectedPlayers.value = [...selectedPlayers.value, player];
        }
      },
    },
    {
      selector: "ukg-switch#mock-draft-switch",
      event: "ukgChange",
      handler: (e) => {
        props.changeSetting("mockDraft", e.target.checked);
      },
    },
    {
      selector: "ukg-select#drafting-team-select",
      event: "ukgChange",
      handler: (e) => {
        const index = props.teams.findIndex((team) => team.name === e.detail.value);
        props.changeSetting("draftingTeamIndex", index);
      },
    },
    {
      selector: "ukg-nav-header#draft-settings-header",
      event: "ukgNavCloseButtonSelected",
      handler: () => {
        document.querySelector("ukg-modal#settings-modal").dismiss();
      },
    },
    {
      selector: "ukg-searchbar#player-search",
      event: "ukgChange",
      handler: (e) => {
        emit('searchChanged', e.detail.value);
      },
    }
  ])
})

</script>

<template>
  <ukg-dialog header-divider header="Draft players" id="draft-dialog" content-type="custom" with-button-group
    :ready-ok="selectedPlayers.length !== 0" :buttonsHandler="draftDialogButtonsHandler">
    <div style="width: 100%">
      <div v-if="selectedPlayers.length !== 0">
        <ukg-list>
          <template v-for="player in selectedPlayers" :key="player.PLAYER">
            <ukg-list-item has-divider>
              <p class="ukg-line-primary">{{ player.PLAYER }}</p>
            </ukg-list-item>
          </template>
        </ukg-list>
      </div>
      <div v-else>
        <p style="text-align: center">No players selected</p>

      </div>

    </div>

  </ukg-dialog>
  <ukg-modal id="settings-modal">
    <ukg-nav-header id="draft-settings-header" is-overlay :show-menu-button="false" show-close-button
      heading="Draft settings"></ukg-nav-header>
    <ukg-list>
      <ukg-list-item>
        <p class="ukg-line-primary">Mock draft mode</p>
        <ukg-switch slot="right" id="mock-draft-switch" :checked="draftSettings.mockDraft"></ukg-switch>
      </ukg-list-item>
      <ukg-list-item>
        <p class="ukg-line-primary">Drafting team</p>
        <ukg-input-container slot="right">
          <ukg-select id="drafting-team-select">
            <template v-for="(team, index) in teams" :key="team.name">
              <ukg-select-option :value="team.name" :label="team.name"
                :selected="index === draftSettings.draftingTeamIndex"></ukg-select-option>
            </template>
          </ukg-select>
        </ukg-input-container>

      </ukg-list-item>

    </ukg-list>
  </ukg-modal>
  <ukg-data-table-container>
    <ukg-data-table :isEmpty="props.players.length === 0">

      <ukg-toolbar slot="left" id="toolbar" :leftButtons="toolbarButtons"></ukg-toolbar>
      <ukg-searchbar aria-label="searchbar" slot="right" has-filter id="player-search">
        <ukg-button slot="filter" icon-only>
          <ukg-icon slot="icon-only" name="filter"></ukg-icon>
        </ukg-button>
      </ukg-searchbar>
      <table>
        <thead>
          <tr>
            <ukg-th type="empty" sticky="left"></ukg-th>
            <template v-for="col in props.cols">
              <ukg-th :sticky="isColumnSticky(col)">{{ col }}</ukg-th>
            </template>
          </tr>
        </thead>
        <tbody>
          <template v-for="player in props.players" :key="player.PLAYER">
            <tr>
              <td class="ukg-table-column-checkbox">
                <ukg-button class="ukg-data-table-checkbox-button" icon-only parent-icon="person-add"
                  v-if="draftSettings.mockDraft" @click="draftPlayer(player)"></ukg-button>
                <ukg-button class="ukg-data-table-checkbox-button" role="checkbox" icon-only v-else>
                  <ukg-checkbox-icon :data-player="`${player.PLAYER}`">
                  </ukg-checkbox-icon>
                </ukg-button>
              </td>
              <template v-for="col in props.cols" :key="player[col]">
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

<style scoped>
ukg-data-table {
  --ukg-table-cells-align: center;
}


.draft-grid {
  display: grid;
  grid-template-columns: repeat(24, 1fr);
  grid-template-rows: repeat(20, min-content);
  width: 100%;
  height: calc(100vh - 8rem);
  overflow: scroll;
  max-width: 100vw;
}

@media (min-width: 600px) {
  .draft-grid {
    height: calc(100vh - 11rem);
  }
}

.draft-header-cell {
  background-color: #f1f1f1;
  border: 1px solid #ddd;
  text-align: center;
  position: sticky;
  top: 0;
}

.draft-cell {
  border: 1px solid #ddd;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.draft-cell--selected {
  background-color: #8bc6f783;
  border: none;
}
</style>