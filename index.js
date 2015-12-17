'use strict';

var fs = require('fs');
var pt = require('path');
var File = require("vinyl-file");

var through = require('through2');
var gutil = require('gulp-util');

var PLUGIN_NAME = 'gulp-json-to-map';

module.exports = function (opts) {


  var opts = opts || {};

  var dest = opts.dest || "./dest";
  var base = opts.base || "./";
  var path = opts.path || "map.js";

  var paths = [];

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

  return through.obj(function (file, enc, cb) {
    //console.log(this,file);
    //console.log(output, name, path.resolve(output, name));
    //return ;
    var that = this;

    if (file.isNull()) {
      cb(null, file);
      return;
    }

    if (file.isStream()) {
      cb(new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
      return;
    }

    //paths.push(path.resolve(base,file.path));


    var data = JSON.parse(fs.readFileSync(pt.resolve(base,file.path),"utf8"));

    getMapFile(opts, function(err, mapFile){

      if (err) {
        cb(err);
        return;
      }
      mapFile.contents = new Buffer(coverJSON(data), null, ' ff ');
      gutil.log("file path:"+mapFile.contents);
      that.push(mapFile);

    });

    cb();

  },function(cb) {

  });

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

};
