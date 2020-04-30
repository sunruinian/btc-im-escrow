import config from "@/config"

function log(...values) {
  if (config.SHOW_CONSOLE_LOG) {
    console.log(...values);
  }
}

export default {
  log
};
/*
usage:
let params = {"23":"32423"};
this.BXLog.log("23423",423423,params);
*/
