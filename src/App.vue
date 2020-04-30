<template>
  <div id="app">
    <div class="loading" v-if="!isInited">Loading...</div>
    <router-view v-else/>
  </div>
</template>

<script>
import Injector from "../mock/mockInjector";
import BXAPI from "./bxapi/api";
import VConsole from "vconsole";
import config from "@/config";
if (config.SHOW_CONSOLE_LOG) {
  new VConsole();
}
export default {
  name: "App",
  data() {
    return {
      isInited: false
    };
  },
  created() {
    if (Injector.execute) Injector.execute();
    BXAPI.onReady((code, data) => {
      console.log("Ready!");
      this.isInited = true;
    });
  }
};
</script>

<style>
html,
body {
  height: 100%;
  overflow: hidden;
  margin: 0px;
}
* {
   touch-action: pan-y;  
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}
</style>
