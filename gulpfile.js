var gulp = require('gulp')
var concat = require('gulp-concat')
var htmlmin = require('gulp-htmlmin')
var obfuscate = require('gulp-obfuscate')
var uglify = require('gulp-uglify')
var cleanCSS = require('gulp-clean-css')
var imagemin = require('gulp-imagemin')
var pngquant = require('imagemin-pngquant')

gulp.task('html', function() {
  return gulp.src('./source/*.html')
  .pipe(htmlmin({
    collapseWhitespace: true
  }))
  .pipe(gulp.dest('./public'))
})

gulp.task('styles', function() {
  return gulp.src('./source/css/*.css')
  .pipe(concat('style.css'))
  .pipe(cleanCSS())
  .pipe(gulp.dest('./public/css'))
})

gulp.task('scripts', function() {
  return gulp.src('./source/js/*.js')
  .pipe(concat('core.js'))
  .pipe(uglify())
  .pipe(gulp.dest('./public/js'))
})

gulp.task('images', function() {
  return gulp.src('./source/images/*')
  .pipe(imagemin({
    progressive: true,
    svgoPlugins: [{removeViewBox: false}],
    use: [pngquant()]
  }))
  .pipe(gulp.dest('./public/images'))
})

gulp.task('data', function() {
  return gulp.src('./source/data/*.json').pipe(gulp.dest('./public/data'))
})

gulp.task('watch', function() {
    gulp.watch([
      './source/js/*.js',
      './source/css/*.css',
      './source/*.html',
      './source/data/*.json'
    ], gulp.series('default'))
});

gulp.task('default', gulp.parallel(['html', 'styles','scripts', 'images', 'data']))
