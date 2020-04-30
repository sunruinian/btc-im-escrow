export default {
  getBills(data, callback) {
    return this._call("getBills", data, callback);
  },
  getBillDetail(data, callback) {
    return this._call("getBillDetail", data, callback);
  },
  getBillCategories(callback) {
    return this._call("getBillCategories", callback);
  },
  getBillCurencies(callback) {
    return this._call("getBillCategories", callback);
  }
};
