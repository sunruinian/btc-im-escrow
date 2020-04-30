let injector = {};
import Request from "./request";
if (process.env.NODE_ENV == "development") {
  let execute = () => {
    window.nativeSDK = {
      postMessage(jsonStr) {
        let data = JSON.parse(jsonStr);
        this[data.methodId] && this[data.methodId](data);
      },
      tryExecute() {},
      onReady(data) {
        this.triggerCallback(
          {
            local_langue: "zh",
            bxVersion: "0.0.1",
            SDKVersion: "0.0.1"
          },
          data
        );
      },

      getBills(data, callback) {
        Request.get("/bills", data, result => {
          this.triggerCallback(result, data);
        });
      },
      getBillDetail(data, callback) {
        Request.get(`/bills/${data.id}`, data, callback);
      },
      getBillCategories(data,callback) {
        Request.get(`/bills/currencies`, data, callback);
      },
      getBillCurencies(callback) {
        Request.get(`/bills/categories`, data, callback);
      },

      // const NATIVE_CALLBACK_JS = 4;
      triggerCallback(data, { callbackId }) {
        data = Object.assign({ data, code: 10001 }, { type: 4, callbackId });
        window.BXWebViewJavascriptBridge.handleNativeMessage(
          JSON.stringify(data)
        );
      }
    };
  };
  injector = {
    execute
  };
}
export default injector;
