import BillAPI from "./bill";
import UserAPI from "./user";
import MessageAPI from "./message";
import BaseAPI from "./base";
let BXAPI_READYED = false;
if (!window.webJavascriptBridge) {
  function webJavascriptBridge() {
    let messageHandlers = {};
    let responseCallbacks = {};
    let uniqueId = 1;

    const JS_CALL_NATIVE = 1;
    const JS_CALLBACK_NATIVE = 2;
    const NATIVE_CALL_JS = 3;
    const NATIVE_CALLBACK_JS = 4;

    let getLatestId = () => `JavascriptCb${uniqueId++}`;

    function registerHandler(methodId, handler) {
      if (!handler) return;
      messageHandlers[methodId] = handler;
    }

    function callHandler(methodId, data, callback) {
      if (arguments.length == 2 && typeof data == "function") {
        callback = data;
        data = null;
      }
      let callbackId = getLatestId();
      responseCallbacks[callbackId] = callback;
      let message = {
        type: JS_CALL_NATIVE,
        methodId,
        callbackId,
        data
      };
      window.nativeSDK.postMessage(JSON.stringify(message));
    }
    

    function registerEventHandler(event, handler) {
      if (!handler) return;
      eventHandlers[event] = handler;
      let data = { event };
      callHandler("registerEventHandler", data, function(code, data) {
        console.log("Register ", event, " result:", code, data);
      });
    }

    function executeNativeHandler(message) {
      if (!message.callbackId) return;
      let callback = (code, data) => {
        const { methodId, callbackId } = message;
        let response = {
          type: JS_CALLBACK_NATIVE,
          methodId,
          callbackId,
          code,
          data
        };
        window.nativeSDK.postMessage(JSON.stringify(response));
      };
      let handler = messageHandlers[message.methodId];
      if (!handler) return hanlderExpection(message);
      handler(message.data);
    }

    function hanlderExpection(message) {
      console.log(
        "BXWebViewJavascriptBridge: WARNING: no handler for message from Native:",
        message
      );
    }

    function handleNativeMessage(messageJSON) {
      let message = JSON.parse(messageJSON);
      switch (message.type) {
        case NATIVE_CALL_JS:
          return executeNativeHandler(message);
        case NATIVE_CALLBACK_JS:
          let responseCallback = responseCallbacks[message.callbackId];
          if (!responseCallback) {
            return delete responseCallbacks[message.responseId];
          }
          responseCallback(message.code, message.data);
          return delete responseCallbacks[message.responseId];
        default:
          break;
      }
    }
    let bridge = {
      registerHandler,
      registerEventHandler,
      callHandler,
      handleNativeMessage
    };
    return bridge;
  }
  window.BXWebViewJavascriptBridge = new webJavascriptBridge();
}
// 鉴权函数
const availableCheck = function() {
  return BXAPI_READYED;
};
export default {
  _call: (eventName, data, callback) => {
    if (!availableCheck() && eventName != "onReady")
      throw new Error("invalid call");
    if (callback) {
      return BXWebViewJavascriptBridge.callHandler(eventName, data, callback);
    } else {
      callback = data;
      return BXWebViewJavascriptBridge.callHandler(eventName, callback);
    }
  },
  _bind: (eventName, callback) => {
    BXWebViewJavascriptBridge.registerHandler(eventName, callback);
  },
  onReady(callback) {
    return this._call("onReady", (code, data) => {
      BXAPI_READYED = true;
      callback(code, data);
    });
  },
  // 基础
  ...BaseAPI,
  // 媒体
  saveImageToPhotosAlbum(data, callback) {
    return this._call("saveImageToPhotosAlbum", data, callback);
  },
  // 设备
  scanCode(callback) {
    return this._call("scanCode", callback);
  },
  // 消息发送
  ...MessageAPI,
  // 账单API
  ...BillAPI,
  // 用户API
  ...UserAPI
};
