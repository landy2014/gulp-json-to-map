var gulp = require('gulp');

var jsontomap = require('./index.js');

gulp.task("test",function(){
    gulp.src("./tests/js/*.js")
      .pipe(jsontomap({
          file : "./tests/map/static-map.json",
          base : "./",
          path   : "map.js"
      }))
      .pipe(gulp.dest("./dest"))
});
