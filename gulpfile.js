"use strict";

var gulp = require('gulp');
var connect = require('gulp-connect');
var open = require('gulp-open');

var browserify = require('browserify');
var reactify = require('reactify');

var source = require('vinyl-source-stream');
var concat = require('gulp-concat');
var eslint = require('gulp-eslint');

var config = {
    path: {
        html: './src/*.html',
        js: './src/**/*.js',
        css: [
            "node_modules/bootstrap/dist/css/bootstrap.min.css",
            "node_modules/bootstrap/dist/css/bootstrap-theme.min.css"
            ],
        dist: './dist',
        mainJs: './src/main.js'
    }
};

//Start a local dev server
gulp.task('connect-server', function(){
    connect.server({
        root: ['dist'],
        port: '9000',
        base: 'http://localhost',
        livereload: true
    })
});

//Open Web browser
gulp.task('open-web', ['connect-server'], function(){
    gulp.src('dist/index.html').pipe(open({uri:'http://localhost:9000/'}))
});

//Copy Html File from src to dist and reload
gulp.task('copy-html', function(){
    gulp.src(config.path.html)
        .pipe(gulp.dest(config.path.dist))
        .pipe(connect.reload());
});

//Copy Html File from src to dist and reload
gulp.task('copy-css', function(){
    gulp.src(config.path.css)
        .pipe(concat('bundle.css'))
        .pipe(gulp.dest(config.path.dist + '/css'));
});

//Copy Js File from Src to dist and reload
gulp.task('copy-js', function(){

    //Simple js file copy over
    gulp.src(config.path.js)
        .pipe(gulp.dest(config.path.dist))
        .pipe(connect.reload());
    
    //Bundle .js files and copy over
    browserify(config.path.mainJs)
            .transform(reactify)
            .bundle()
            .on('error', console.error.bind(console))
            .pipe(source('bundle.js'))
            .pipe(gulp.dest(config.path.dist + '/scripts'))
            .pipe(connect.reload())
});

//Link Javascript and JSX files
gulp.task('lint', function(){
    return gulp.src(config.path.js)
        .pipe(eslint({config: 'eslint.config.json'}))
        .pipe(eslint.format());    
});

//Watch html file changes on save.
gulp.task('watch', function(){
    gulp.watch(config.path.html,['copy-html'])
    gulp.watch(config.path.js,['copy-js','lint'])
});

//Run Default task to combain all the related tasks
gulp.task('default',['copy-html','copy-css','copy-js','open-web', 'watch']);