import { createApp } from "vue";
import PrimeVue from "primevue/config";
import "./style.css";
import App from "./App.vue";

import "primevue/resources/themes/saga-blue/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
// components
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import SelectButton from "primevue/selectbutton";

const app = createApp(App);
app.use(PrimeVue);
app.component("Button", Button);
app.component("Dropdown", Dropdown);
app.component("SelectButton", SelectButton);
app.mount("#app");
