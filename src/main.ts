import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import VueGtag from "vue-gtag";

const Vue = createApp(App);
Vue.use(router).mount("#app");
Vue.use(VueGtag, {
  config: { id: "G-KB7T3J4T20" },
});
