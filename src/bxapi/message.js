export default {
  sendMessage(messageData, callback) {
    return this._call("sendMessage", messageData, callback);
  }
};
