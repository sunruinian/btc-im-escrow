import Axios from "axios";
import BXJSSDKAPI from "@/bxapi/api"
export default {

  request(method, url, headers, parameters, body, callback) {
    let flag = ["testing","production"].indexOf(process.env.NODE_ENV) != -1;
    // console.log(flag)
    if (flag) {
      
      let urlStr = "https://graphqlsandboximb8.bixin.com" + url;
      // let urlStr = "https://teamwallet.bixin.com" + url;
      //native
      // headers["X-Graphql-Schema"]="e8b42b3ca606ebb092d6b4382f322433";
      let params = {
        url: urlStr,
        method: method,
        headers: headers,
        parameters: parameters,
        body: body,
        timeout: 15000
      }
      BXJSSDKAPI.nativeRequest(params, callback);
    } else {
      switch (method) {
        case "get":
          this.get(url, headers, parameters, body, callback);
          break;
        case "post":
          this.post(url, headers, parameters, body, callback);
          break;
      }
    }
  },

  get(url, headers, parameters, callback) {
    Axios({
        headers: headers,
        method: 'get',
        url: url,
        params: parameters,
      }).then(function (response) {

        callback(response.status, response.data);
      })
      .catch(function (error) {
        callback(error);
      });
  },

  

  post(url, headers, parameters, body, callback) {

    Axios({
        headers: headers,
        method: 'post',
        url: url,
        params: parameters,
        data: body
      }).then(function (response) {
        callback(reponse.status, response.data);
      })
      .catch(function (error) {
        callback(error);
      });
  }

}
