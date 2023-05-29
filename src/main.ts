import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import { localize } from "@vee-validate/i18n";
import pt_BR from "@vee-validate/i18n/dist/locale/pt_BR.json";
import AllRules from "@vee-validate/rules";
import { configure, defineRule } from "vee-validate";

import "ui-shortcuts/dist/ui-shortcuts.css";

import "./assets/main.scss";
import "./assets/icons/style.css";

configure({
  generateMessage: localize({
    "pt-BR": pt_BR,
  }),
});

localize("pt-BR");

Object.keys(AllRules).forEach((rule) => {
  defineRule(rule, AllRules[rule]);
});

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");
