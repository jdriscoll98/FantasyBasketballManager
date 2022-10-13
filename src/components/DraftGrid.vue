<script setup>
import DraftActions from "./DraftActions.vue"
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

function onDraftButtonClicked(player) {
  emit("draftPlayer", player);
}

const isColumnSticky = (col) => {
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

const toolbarButtons = [
  {
    icon: 'person-add',
    label: "Draft",
    emphasis: 'mid',
    clickHandler: () => {
      console.log('Draft button clicked');
    },
  },
  {
    icon: 'settings',
    label: "Settings",
    emphasis: 'mid',
    clickHandler: () => {
      console.log('Settings button clicked');
    },
  },
]

</script>

<template>
  <ukg-data-table-container>
    <ukg-data-table>
      <ukg-toolbar slot="left" id="toolbar" :leftButtons="toolbarButtons"></ukg-toolbar>
      <ukg-searchbar aria-label="searchbar" slot="right" has-filter>
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
              <td>
                <ukg-checkbox-icon></ukg-checkbox-icon>
              </td>
              <template v-for="col in props.cols" :key="player[col]">
                <td>{{ player[col] }}</td>
              </template>
            </tr>
          </template>
        </tbody>
      </table>
    </ukg-data-table>
  </ukg-data-table-container>
</template>

<style scoped>
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