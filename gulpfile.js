var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    qunit = require('gulp-qunit');
    
gulp.task('dist', function() {
  return gulp.src(['src/**/*.js'])
  	  .pipe(concat('formbuilder.js'))
  	  .pipe(gulp.dest('dist'))
      .pipe(concat('formbuilder.min.js'))
      .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
  gulp.watch(['src/**/*.js'], ['dist']);
});

gulp.task('jshint', function() {
  return gulp.src(['src/**/*.js', 'spec/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('qunit', function() {
    return gulp.src('./spec/test-runner.html')
        .pipe(qunit());
});

gulp.task('test', ['jshint', 'qunit']);
gulp.task('default', ['test', 'dist']);