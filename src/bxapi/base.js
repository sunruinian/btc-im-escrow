export default {
  getSystemInfo(callback) {
    return this._call("getSystemInfo", callback);
  },
  getClipboard(callback) {
    return this._call("getClipboard", callback);
  },
  setClipboard(data, callback) {
    return this._call("getClipboard", data, callback);
  }
};
