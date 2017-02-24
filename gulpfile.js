const babel = require('gulp-babel');
const babelRegister = require('babel-register');
const del = require('del');
const eslint = require('gulp-eslint');
const gulp = require('gulp');
const mocha = require('gulp-mocha');

gulp.task('build', ['clean'], () =>
  gulp.src('src/*.js')
    .pipe(babel())
    .pipe(gulp.dest('dist')));

gulp.task('build:watch', () =>
  gulp.watch('src/*.js', ['build']));

gulp.task('clean', () => del('dist'));

gulp.task('lint', () =>
  gulp.src(['src/*.js', 'test/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError()));

gulp.task('test', () =>
  gulp.src('test/*.js')
  .pipe(mocha({compilers: babelRegister})));

gulp.task('test:watch', () =>
  gulp.watch(['src/*.js', 'test/*.js'], ['test']));
