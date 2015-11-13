var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');

var paths = {
  scripts: ['src/**/*.js'],
};

gulp.task('dist', function() {
  return gulp.src(paths.scripts)
  	  .pipe(concat('formbuilder.js'))
  	  .pipe(gulp.dest('dist'))
      .pipe(concat('formbuilder.min.js'))
      .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['dist']);
});

gulp.task('jshint', function() {
  return gulp.src(paths.scripts)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('test', ['jshint']);
gulp.task('default', ['test', 'dist']);