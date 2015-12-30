var gulp = require('gulp');
var uglify = require("gulp-uglifyjs");
var jsontomap = require('./index.js');

gulp.task("test",function(){
    return gulp.src("./tests/js/*.js")
      .pipe(jsontomap({
          file : "./tests/map/map.json",
          base : "./"
      }))
      .pipe(uglify({
        mangle: false,
        debug : true
      }))
      .pipe(gulp.dest("./tests/dist"))
});
