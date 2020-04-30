"use strict";
require("./check-versions")();

process.env.NODE_ENV = "production";
const {
  exec
} = require("child_process");
const ora = require("ora");
const rm = require("rimraf");
const path = require("path");
const chalk = require("chalk");
const webpack = require("webpack");
const config = require("../config");
const webpackConfig = require("./webpack.prod.conf");
const spinner = ora("building for production...");
const updatePkg = require("../upload/scripts/updatePkg");
spinner.start();

exec(`rm -rf dist`); //打包之前删除dist

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err;
  webpack(webpackConfig, (err, stats) => {
    spinner.stop();
    if (err) throw err;
    process.stdout.write(
      stats.toString({
        colors: true,
        modules: false,
        children: false, // if you are using ts-loader, setting this to true will make typescript errors show up during build
        chunks: false,
        chunkModules: false
      }) + "\n\n"
    );

    if (stats.hasErrors()) {
      console.log(chalk.red("  Build failed with errors.\n"));
      process.exit(1);
    }
    
    console.log(chalk.cyan("Build complete.\n"));
    let fileName = `${config.APPNAME}.zip`;
    exec(`rm -rf ./${fileName}`);
    exec(`zip -r ${fileName} dist`, (error, stdout, stderr) => {
      if (error) {
        console.error(`zip exec error: ${error}`);
        process.exit(1);
      }
      updatePkg.updatePkg(`./${fileName}`,(code,result)=>{
        if(!code){
          console.log(chalk.green("Success Publish\n"));
        }else{
          console.log(chalk.red("Error Publish\n"));
        }
      });
      //=====
    });
  });
});


