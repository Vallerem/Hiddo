const gulp        = require('gulp');
const minify      = require('gulp-minify');
  
gulp.task('compress', function() {
  gulp.src('public/js/*.js')
    .pipe(minify({
        ext:{
            src:'',
            min:'.min.js'
        },
        exclude: ['tasks'],
        ignoreFiles: ['.combo.js', '.min.js']
    })).pipe(gulp.dest('public/js'))
});

 

