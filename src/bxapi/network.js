import router from "@/router";

function nativeRequest(data, callback) {
  this._call("native.request", data, (code, resp_data) => {
    console.log('resp_data ==', resp_data)
    if (resp_data && resp_data.status_code == 200) {
      // if(true){
         resp_data = resp_data.data;
      if (resp_data != undefined && resp_data.errors != undefined) {
        for (var index in resp_data.errors) {
          // token 过期判断
          let error_code = resp_data.errors[index].code
          if (error_code === 10002 || error_code === 10001) {
            // 告诉客户端刷新token
            // console.log('token 已过期')
            let that = this
            this._call("base.renew", data, (code, resp_data) => {
              that._call("native.request", data, (code, resp_data) => {
                callback(code, resp_data.data)
              })
            });
            return
          } else if (resp_data.errors[index].message.indexOf("ECONNREFUSED") !== -1) {
            gotoErrorPage()
          }
        }
        callback(code, resp_data)
      } else {
        callback(code, resp_data)
      } 
    } else {
      // window.EventBus.emit('first-event', "网络异常")
      // callback(code, {});
      gotoErrorPage()
    }
  })
}

function gotoErrorPage() {
  if (router.currentRoute.name !== 'error') {
    router.push({
        path:'/error'
    });
  }
}
export default {
  nativeRequest
};


