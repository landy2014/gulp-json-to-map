'use strict';

var fs = require('fs');
var pt = require('path');

var through = require('through2');
var gutil = require('gulp-util');

var PLUGIN_NAME = 'gulp-json-to-map';


//cover JSON to string
function coverJSON(data) {
  var mapArr = [];
  var tempStr = "seajs.config({ map : ";
  var tempLastStr = "});";

  //json 转换为数组
  Object.keys(data).forEach(function(key){
    mapArr.push([key,data[key]]);
  });

  //数组转换为字符串
  var mapStr = "[";
  var len = mapArr.length;

  for(var i=0; i<len; i++) {
    if(i===len-1) {
      mapStr += "[\"" + mapArr[i][0] + "\",\"" + mapArr[i][1] + "\"]]";
    }else{
      mapStr += "[\"" + mapArr[i][0] + "\",\"" + mapArr[i][1] + "\"],";
    }
  }

  //返回拼合的字符串
  return tempStr+mapStr+tempLastStr;
}

var plugin = function (opts) {

  var opts = opts || {};

  var sFile = opts.file || "./map/static-map.json";
  var base = opts.base || "./";

  var data = JSON.parse(fs.readFileSync(sFile,"utf8")); //要写入文件的json文件
  var tempData = coverJSON(data);                       //转换为要写入的字符串

  return through.obj(function (file, enc, cb) {

    if (file.isNull()) {
      cb(null, file);
      return;
    }

    if (file.isStream()) {
      cb(new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
      return;
    }

    var tempContent = file.contents;  //暂存文件内容

    file.contents = new Buffer(tempData+tempContent,"utf8"); //重写文件内容

    gutil.log("write file:"+ pt.basename(file.path) + " success!");        //输出是否写入成功

    this.push(file);  //输出到文件流

    cb();

  },function(cb) {
    console.log("cover done...");
    cb();
  });

};

module.exports = plugin;
