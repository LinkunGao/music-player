import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import VueGtag from "vue-gtag";

const a = createApp(App);
a.use(router).mount("#app");
a.use(VueGtag, {
  config: { id: "G-KB7T3J4T20" },
});
