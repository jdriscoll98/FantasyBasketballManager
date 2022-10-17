import { ref } from "vue";
export const useLeagues = () => {
  const leagues = ref([]);
  const setLeagues = (newLeagues) => {
    leagues.value = newLeagues;
    localStorage.setItem("leagues", JSON.stringify(leagues.value));
  };
  const selectedLeague = ref(null);

  const selectLeague = (leagueId) => {
    selectedLeague.value = leagues.value.find(
      (league) => league.id === leagueId
    );
  };

  const addLeague = (league) => {
    league.id = Math.floor(Math.random() * 10000) + 1;
    setLeagues([...leagues.value, league]);
  };

  const fetchLeagueData = () => {
    // fetch data from local storage
    const data = localStorage.getItem("leagues");
    if (data) {
      leagues.value = JSON.parse(data);
    } else {
      setLeagues([]);
    }
  };

  return {
    leagues,
    setLeagues,
    selectedLeague,
    selectLeague,
    addLeague,
    fetchLeagueData,
  };
};
