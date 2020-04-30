const crypto = require('crypto');
const fs = require('fs');
const uploader = require("./uploader");
const request = require("request");
const chalk = require("chalk");
const config = require("../config");

module.exports = {
  updatePkg(localFilePath, callback) {
    let that = this;
    that.uploadFile2Qiniu(localFilePath, (code, result) => {
      let package_url = `${config.QINIU_HOST}${result.key}`;
      console.log(chalk.green("上传成功地址为：" + package_url));
      if (!code) {
        that.getToken((code, result) => {
          let token = result;
          if (!code) {
            that.postPkgInfo(localFilePath, package_url, token, callback);
          } else {
            console.log(chalk.red(result));
          }
        });
      } else {
        console.log(chalk.red(result));
      }
    });
  },

  getToken(callback) {
    console.log(chalk.green("正在获取token..."));
    let headers = {
      "Content-Type": "application/x-www-form-urlencoded"
    };
    let formData = {
      user_name: config.USER_NAME,
      password: config.PASSWORD,
      appid: config.APPID,
    };

    request({
      url: config.GET_TOKEN_URL,
      method: "POST",
      headers: headers,
      form: formData
    }, function (error, response, bodyString) {
      if (error) {
        callback(-1, "getToken Failed with errors.\n" + error);
      }
      if (response.statusCode == 200) {
        let body = JSON.parse(bodyString);
        if (body != undefined && body.data != undefined && body.data.token != undefined) {
          console.log(chalk.green("获取token成功:\n" + body.data.token + "\n" + "正在更新包信息...\n"));
          callback(0, body.data.token);
        } else {
          callback(-1, "getToken Failed.\n");
        }
      } else {
        callback(-1, "getToken Failed with errorCode.\n" + response.statusCode);
      }
    });
  },

  uploadFile2Qiniu(localFilePath, callback) {
    let d = new Date();
    let uuidString = this.uuid();
    let targetPath = `${config.APPID}/${d.getFullYear()}/${d.getMonth() +
        1}/${config.ENV}-${uuidString}.zip`;
    uploader.upload(
      localFilePath,
      targetPath,
      res => {
        console.log(chalk.green("SUCCESS UPLOADED TO QINIU!\n"));
        callback(0, res);
      },
      res => {
        console.log(chalk.red("FAIL UPLOADED TO QINIU with errors!\n" + res));
      }
    );
  },

  postPkgInfo(localFilePath, package_url, token, callback) {
    let md5String = this.FileMD5(localFilePath);
    let formData = {
      env: config.ENV, //debug
      md5_sum: md5String,
      package_url: package_url,
    };
    // env=release&md5_sum=&package_url=https:/xxx.xx/bbb.zip
    let headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-ACCESS-TOKEN": token,
      Appid: config.APPID
    };
    request({
      url: config.UPDATE_PKG_URL,
      method: "POST",
      headers: headers,
      form: formData
    },  function (
      error,
      response,
      body
    ) {
      if (error) {
        console.log(chalk.red("post pkg info with error\n" + error));
        callback(-1, error);
      }
      if (response.statusCode == 200) {
        console.log(chalk.green("post pkg info success\n"));
        callback(0, "post pkg info success");

      } else {
        console.log(chalk.red("post pkg info  error!\n" + response.statusCode));
        callback(-1, "post pkg info  error");

      }
    });
  },

  FileMD5(filepath) {
    let fshash = crypto.createHash('md5');
    let buffer = fs.readFileSync(filepath);
    fshash.update(buffer);
    let fileMd5 = fshash.digest('hex');
    return fileMd5;
  },
  uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
};
