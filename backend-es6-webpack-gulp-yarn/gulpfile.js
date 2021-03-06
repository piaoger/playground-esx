

// borrowed from yarn and lodash
//  https://github.com/lodash/lodash-webpack-plugin
//  https://github.com/yarnpkg/yarn
//  https://github.com/piaoger/playground-esx
//  https://github.com/caolan/async

'use strict';

const argv = require('yargs').argv;
const plumber = require('gulp-plumber');
const newer = require('gulp-newer');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const watch = require('gulp-watch');
const gutil = require('gulp-util');
const gulpif = require('gulp-if');
const gulp = require('gulp');
const path = require('path');
const fs = require('fs');

const babelRc = JSON.parse(fs.readFileSync(path.join(__dirname, '.babelrc'), 'utf8'));

function build(lib, opts) {
  return gulp.src('src/**/*')
    .pipe(plumber({
      errorHandler(err) {
        gutil.log(err.stack);
      },
    }))
    .pipe(newer(lib))
    .pipe(gulpif(argv.sourcemaps, sourcemaps.init()))
    .pipe(babel(opts))
    .pipe(gulpif(argv.sourcemaps, sourcemaps.write('.')))
    .pipe(gulp.dest(lib));
}

gulp.task('default', ['build']);

gulp.task('build', ['build-modern', 'build-legacy']);

gulp.task('build-modern', () => {
  return build('lib', babelRc.env.node5);
});

gulp.task('build-legacy', () => {
  return build('lib-legacy', babelRc.env['pre-node5']);
});

gulp.task('watch', ['build'], () => {
  watch('src/**/*', () => {
    gulp.start('build');
  });
});