'use strict';

var fs = require('fs');
var path = require('path');

var through = require('through2');
var gutil = require('gulp-util');

var PLUGIN_NAME = 'gulp-json-to-map';

module.exports = function (opts) {


  var opts = opts || {};

  var dest = opts.dest || "./dest";
  var base = opts.base || "./";
  var output = opts.output || "./dest/";
  var name   = opts.name || "map.js";

  var paths = [];



  return through.obj(function (file, encoding, cb) {
    //console.log(this,file);
    //console.log(output, name, path.resolve(output, name));
    //return ;
    var that = this;

    if (file.isNull()) {
      cb(null, file);
      return;
    }

    if (file.isStream()) {
      cb(new gutil.PluginError('gulp-rev', 'Streaming not supported'));
      return;
    }

    paths.push(path.resolve(base,file.path));


    var data = JSON.parse(fs.readFileSync(paths[0],"utf8"));

    //coverJSON(data);

    var mapFile = fs.writeFile(path.resolve(output,name),coverJSON(data),function(err){
        if(err) throw err;
        console.log("done...");

    });


    this.push(file);

    cb();

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
