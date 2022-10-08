import { ref, reactive } from "vue";

export const useDraftActions = (teams) => {
  const draftSettings = reactive({
    autoIncrementOnDraft: true,
    autoIncrementReverse: false,
    autoDraft: true,
    activeTeamIndex: 0,
  });

  const changeSetting = (setting, value) => {
    draftSettings[setting] = value;
  };

  const updateActiveTeam = () => {
    if (!draftSettings.autoIncrementOnDraft) return;
    if (
      draftSettings.activeTeamIndex === teams.value.length - 1 &&
      !draftSettings.autoIncrementReverse
    ) {
      draftSettings.autoIncrementReverse = true;
      return;
    }
    if (
      draftSettings.activeTeamIndex === 0 &&
      draftSettings.autoIncrementReverse
    ) {
      draftSettings.autoIncrementReverse = false;
      return;
    }
    if (draftSettings.autoIncrementReverse) {
      draftSettings.activeTeamIndex = draftSettings.activeTeamIndex - 1;
    } else {
      draftSettings.activeTeamIndex = draftSettings.activeTeamIndex + 1;
    }
  };

  const search = ref("");

  return {
    draftSettings,
    changeSetting,
    updateActiveTeam,
    search,
  };
};
