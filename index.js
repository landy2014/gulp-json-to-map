'use strict';

var fs = require('fs');
var pt = require('path');
var File = require("vinyl-file");

var through = require('through2');
var gutil = require('gulp-util');

var PLUGIN_NAME = 'gulp-json-to-map';



function getMapFile(opts, cb) {
  File.read(opts.path, opts, function (err, mapFile) {
    if (err) {
      // not found
      if (err.code === 'ENOENT') {
        cb(null, new gutil.File(opts));

      } else {
        cb(err);
      }

      return;
    }
    cb(null, mapFile);
  });
}

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

var paths = [];

var plugin = function (opts) {


  var opts = opts || {};

  var sFile = opts.file || "./dest";
  var base = opts.base || "./";
  var path = opts.path || "map.js";



  return through.obj(function (file, enc, cb) {

    var that = this;

    if (file.isNull()) {
      cb(null, file);
      return;
    }

    if (file.isStream()) {
      cb(new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
      return;
    }

    var data = JSON.parse(fs.readFileSync(sFile,"utf8"));
    //console.log(data);
    getMapFile(opts, function(err, mapFile){

      if (err) {
        cb(err);
        return;
      }
      mapFile.contents = new Buffer(coverJSON(data), null, ' ff ');
      gutil.log("file " + mapFile.path + " created...");
      //that.push(mapFile);
      //paths.push(mapFile);

      fs.appendFile(file.path,mapFile.contents,{encoding : "utf8"},function(err){
        if(err) throw err;
        console.log(file);
      });

      that.push(file);


    });

    cb();

    //console.log(paths);


    //this.push(file);
    //cb();

  },function(cb) {

  });

};


module.exports = plugin;
