'use strict';
var gulp = require('gulp'),
    gulpIf = require('gulp-if'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    browserify = require('gulp-browserify'),
    stringify = require('stringify'),
    uglify = require('gulp-uglify'),
    cssmin = require('gulp-clean-css'),

    env = process.env.NODE_ENV || 'development',
    outputClientDir = 'www',
    inputDir = 'app',

    options = {
        libjs: []
    };

var onError = function(err) {
    notify.onError({
        title: 'Gulp',
        subtitle: 'Failure!',
        message: 'Error: <%= error.message %>',
        sound: 'Beep'
    })(err);

    this.emit('end');
};

gulp.task('html', function() {
    return gulp.src(inputDir + '/index.html')
        .pipe(gulp.dest(outputClientDir));
});


gulp.task('css', function() {
    gulp.src(inputDir + '/style.css')
        .pipe(cssmin())
        .pipe(concat('vendor.min.css'))
        .pipe(gulp.dest(outputClientDir + '/css'));
});

gulp.task('js', function() {
    return gulp.src(inputDir + '/app.js', {
            read: false
        })
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(browserify({
            transform: stringify({
                extensions: ['.html', '.tpl'],
                minify: false
            })
        }))
        // .pipe(gulpIf(env !== 'development', uglify()))
        // .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(outputClientDir + '/js'))
        .pipe(notify({
            title: 'Gulp',
            subtitle: 'success',
            message: 'Js task completed',
            sound: 'Pop'
        }));
});

gulp.task('watch', function() {
    gulp.watch(inputDir + '/*.js', ['js']);
    gulp.watch(inputDir + '/*.html', ['js']);
    gulp.watch(inputDir + '/index.html', ['html']);
    gulp.watch(inputDir + '/*.css', ['css']);

});

gulp.task('default', ['html', 'js', 'css', 'watch']);
gulp.task('build', ['html', 'js', 'css']);
