var gulp = require('gulp');

var jsontomap = require('./index.js');

gulp.task("test",function(){
    gulp.src("./tests/map/*.json")
      .pipe(jsontomap({
          base : "./tests/dest",
          path   : "map.js"
      }))
      //.pipe(gulp.dest("./dest"))
});
