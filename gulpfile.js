const gulp   = require('gulp');
const rename = require("gulp-rename");
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();
  
gulp.task('minify-js', function() {
    return gulp.src('public/js/main.js')
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('public/js'))
});

gulp.task('browserSync', function() {
    browserSync.init({
        proxy: "localhost:3000"
    })
})

gulp.task('dev', ['browserSync', 'minify-js'], function() {
    gulp.watch('public/js/main.js', ['minify-js']);
    gulp.watch('views/*.ejs', browserSync.reload);
    gulp.watch('public/**/*.ejs', browserSync.reload);
});

 

