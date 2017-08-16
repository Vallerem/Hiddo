const gulp        = require('gulp');
const rename      = require("gulp-rename");
const uglify      = require('gulp-uglify');
const browserSync = require('browser-sync').create();
  
gulp.task('uglify', function() {
    return gulp.src('public/js/main.js')
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('public/js'));
});

gulp.task('browserSync', function() {
    browserSync.init({
        proxy: "localhost:3000"
    });
});

gulp.task('dev', ['browserSync', 'uglify'], function() {
    gulp.watch('public/js/main.js', ['uglify']);
    gulp.watch('views/*.ejs', browserSync.reload);
    gulp.watch('public/**/*.ejs', browserSync.reload);
});

 

