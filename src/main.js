import Vue from "vue";
import App from "./App";
import router from "./router";
import i18n from "@/utils/i18n/i18n";
import VueScroller from "@/components/vue-refresh-scroller";
Vue.use(VueScroller);
import bxlog from "@/utils/log/log.js"
Vue.prototype.BXLog = bxlog

new Vue({
  i18n,
  el: "#app",
  router,
  render: h => h(App)
});
