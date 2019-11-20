const {gulp, src,watch ,series, parallel, dest} = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const del = require('delete');
const terser = require('gulp-terser');
const concat = require('gulp-concat');
const markdown = require('gulp-markdown');
const wrap = require('gulp-wrap');
const frontMatter = require('gulp-front-matter');


function css(){
   return src('app/ui/*.scss')
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(dest('prod/ui'));
}

function html(){
 return src('app/pages/**/*.md')
 .pipe(frontMatter())
 .pipe(markdown())
 .pipe(wrap({src:'app/templates/layout.html'}))
 .pipe(dest('prod'));
}

function js(){
  return src(['source/js/*.js', 'source/js/*.ts'])
  .pipe(terser())
  .pipe(concat('main.js'))
  .pipe(dest('prod/ui'));
}

function sync(cb){
  browserSync.init({
    server: {baseDir: 'prod/'}
  });
  cb();
}

function reload(cb){
  browserSync.reload();
  cb();
}

function img(){
  return src('app/images/*.jpg')
  .pipe(dest('prod/images'));
}


function watch_task(){
    watch('app/ui/*.scss', series(css,reload));
    watch('app/pages/*.md', series(html,reload));
    watch('app/js/**/*.js', series(js,reload));
};

function clean(cb){
  del('prod/**/*', cb);
}

exports.img = img;
exports.build = series(clean,parallel(css, html,img,js));
exports.dev = series(exports.build, sync, watch_task);
exports.css = css;
exports.watch = watch_task;
exports.clean = clean;
