import { createApp } from "vue";
import PrimeVue from "primevue/config";
import "./style.css";
import App from "./App.vue";

import "primevue/resources/themes/saga-blue/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
// components
import Button from "primevue/Button";
import Dropdown from "primevue/dropdown";

const app = createApp(App);
app.use(PrimeVue);
app.component("Button", Button);
app.component("Dropdown", Dropdown);
app.mount("#app");
