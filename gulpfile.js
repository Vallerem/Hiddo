const gulp        = require('gulp');
const rename      = require("gulp-rename");
const uglify      = require('gulp-uglify');
const babel       = require('gulp-babel');
const browserSync = require('browser-sync').create();
  
gulp.task('uglify', function() {
    return gulp.src('public/js/main.js')
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(uglify().on('error', function(e){
            console.log(e);
         }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('public/js'));
});

gulp.task('browserSync', function() {
    browserSync.init({
        proxy: "localhost:3000"
    });
});

gulp.task('dev', ['browserSync', 'uglify'], function() {
    gulp.watch('public/js/main.js', gulp.parallel('uglify','browserSync'));
    gulp.watch('views/**/*.ejs', browserSync.reload);
    gulp.watch('public/stylesheets/*.scss', browserSync.reload);
});

 

