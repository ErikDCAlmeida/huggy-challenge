import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import "ui-shortcuts/dist/ui-shortcuts.css";

import "./assets/main.scss";
import "./assets/icons/style.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");
