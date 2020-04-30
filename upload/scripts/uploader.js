module.exports = {
  upload(fileToUpload, uploadPath, callbackSuccess, callbackError) {
    const qiniu = require("qiniu");
    //注意！此处如果要开放SDK，请将此upload api 改为后端API!
    const accessKey = "n7FA-UZCC4tRnYIcE4gUnULzaGKNfLNRpv-CPFn3";
    const secretKey = "OMcBWUQe6J7wu0R0lwt6JWyMJmSOX2i2jNJuElLz";
    const bucket = "bixinprod";
    var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    var options = {
      scope: bucket
    };
    var putPolicy = new qiniu.rs.PutPolicy(options);
    var uploadToken = putPolicy.uploadToken(mac);

    const config = new qiniu.conf.Config();
    config.zone = qiniu.zone.Zone_z0;
    config.useHttpsDomain = true;
    config.useCdnDomain = true;

    var localFile = fileToUpload;
    var formUploader = new qiniu.form_up.FormUploader(config);
    var putExtra = new qiniu.form_up.PutExtra();
    var key = "miniapps/" + uploadPath;

    console.log(`\r\n\r\n正在上传 ${localFile}\r\n保存为 ${key}\r\n`);

    // 文件上传
    formUploader.putFile(uploadToken, key, localFile, putExtra, function(
      respErr,
      respBody,
      respInfo
    ) {
      if (respErr) {
        callbackError(respBody);
        throw respErr;
      }
      if (respInfo.statusCode === 200) {
        console.log("Upload success!");
        callbackSuccess(respBody);
      } else {
        console.log(respInfo.statusCode);
        console.log(respBody);
      }
    });
  },
};
