"use strict";

let gulp = require("gulp");
let jshint = require("gulp-jshint");

gulp.task("validate", () => {
    return gulp.src(["examples/**/*.js", "lib/**/*.js", "test/**/*.js", "index.js"])
               .pipe(jshint())
               .pipe(jshint.reporter("jshint-stylish"));
});
