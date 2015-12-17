var gulp = require('gulp');

var jsontomap = require('./index.js');

gulp.task("test",function(){
    gulp.src("./tests/map/*.json")
      .pipe(jsontomap({
          output : "./tests/dest",
          name   : "map.js"
      }))
      .pipe(gulp.dest("./dest"))
});
