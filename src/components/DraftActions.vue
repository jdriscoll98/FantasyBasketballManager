<script setup>
import { ref } from "vue";
const emit = defineEmits(["search", "selectTeam", "changeSetting", "draft"]);
const props = defineProps({
  teams: {
    type: Array,
    required: true,
  },
  settings: {
    type: Object,
    required: true,
  },
});
const search = ref("");
</script>

 <template >
  <div class="draft-actions">
    <div class="team-select-container">
      <label>Active team: </label>
      <select
        @change="
          emit('changeSetting', {
            key: 'activeTeamIndex',
            value: Number($event.target.value),
          })
        "
        class="draft-select"
      >
        <template v-for="(team, index) in props.teams" :key="team.name">
          <option
            :value="index"
            :selected="index === props.settings.activeTeamIndex"
          >
            {{ team.name }}
          </option>
        </template>
      </select>
      <div class="checkbox-container">
        <input
          @change="
            emit('changeSetting', {
              key: 'autoIncrementOnDraft',
              value: $event.target.checked,
            })
          "
          type="checkbox"
          :checked="props.settings.autoIncrementOnDraft"
        /><label>Auto increment on draft</label>
      </div>
      <div class="checkbox-container">
        <input
          @change="
            emit('changeSetting', {
              key: 'autoDraft',
              value: $event.target.checked,
            })
          "
          type="checkbox"
          :checked="props.settings.autoDraft"
        /><label>Auto draft other teams</label>
      </div>
    </div>
    <input
      class="filter-table-searchbar"
      v-model="search"
      placeholder="Search by name. . ."
      @input="emit('search', search)"
    />
  </div>
</template>

<style>
.draft-actions {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 3rem;
}

.filter-table-searchbar {
  margin: 0.5rem 0;
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
}

.draft-select {
  margin: 0.5rem 0;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
}

.team-select-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 1rem;
  gap: 0.5rem;
}

.checkbox-container {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
}
</style>