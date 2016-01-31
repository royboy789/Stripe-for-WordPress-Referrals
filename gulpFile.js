var gulp = require('gulp'),
    watch = require('gulp-watch'),
    concat = require('gulp-concat');

var jsFileList = [
    'assets/js/stripe-wp-referrals.js',
    'assets/js/stripe-wp-referrals-directives.js',
];


gulp.task( 'js', function(){
    gulp.src(jsFileList)
        .pipe(concat('stripe-wp-referrals-scripts.js'))
        .pipe(gulp.dest('build/js/'));
});

gulp.task( 'watch', function(){
    gulp.watch(jsFileList, ['js'] );
});