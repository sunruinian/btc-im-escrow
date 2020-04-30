export default {
  get(url, params, callback) {
    url = `http://localhost:3001/rest/v1${url}`;
    fetch(url, params)
      .then(res => {
        return res.json();
      })
      .then(data => {
        callback(data);
      });
  }
};
