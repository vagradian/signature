var gulp = require("gulp");
var sass = require("gulp-sass");
var pug = require("gulp-pug");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var mqpacker = require("css-mqpacker");
var minify = require("gulp-csso");
var rename = require("gulp-rename");
var svgstore = require("gulp-svgstore");
var svgmin = require("gulp-svgmin");
var path = require('path');
var browserSync = require("browser-sync");
var del = require("del");
var copy = require("gulp-contrib-copy");


// style tasks
gulp.task("style", function () {
    return gulp.src("src/scss/*.scss")
        .pipe(plumber())
        .pipe(sass())
        .pipe(postcss([
            autoprefixer ({browsers: [ "last 2 version"]}),
            mqpacker({
                 sort:true 
            })
        ]))
        .pipe(gulp.dest("src/css"))
        .pipe(browserSync.reload({
            stream:true
        }))
        .pipe(minify())
        .pipe(rename("style.min.css"))
        .pipe(gulp.dest("src/css"))
});

// pug task
gulp.task("pug", function () {
    return gulp.src("src/pug/index.pug")
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest("src/"))
});

// browser-sync tasks
gulp.task("browser-sync", function() {
    browserSync({
        server: {
            baseDir: "src"
        },
        notify: false
    });
});


gulp.task("build:serve", function() {
    browserSync({
        server: {
            baseDir: "build"
        },
        notify: false
    });
});


// task to clear all files and folders from build folder
gulp.task("build:clean", function() {
    del([
        "build/"
    ]);
});


// task to create build directory for all files
gulp.task("build:copy", ["build:clean"] , function() {
    return gulp.src("src/**/**/")
        .pipe(gulp.dest("build/"))
});


// task to remove unwanted build files
// list all files and directories here that you don't want to include
gulp.task("build:remove", ["build:copy"], function() {
    del([
        "build/scss/"
    ]);
});


// task to minify all images
gulp.task("build:images", ["build:remove"], function() {
    return gulp.src("build/img/*.png")
        .pipe(imagemin({ progressive: true}))
        .pipe(gulp.dest("build/img"));
});

// task to store and minify SVG
gulp.task("icons", function() {
    return gulp.src("src/img/icons/*.svg")
        .pipe(svgmin(function (file) {
            var prefix = path.basename(file.relative, path.extname(file.relative));
            return {
                plugins: [{
                    cleanupIDs: {
                        prefix: prefix + '-',
                        minify: true
                    }
                }]
            }
        }))
        .pipe(svgstore({
         inlineSvg: true
        }))
        .pipe(rename("sprite.svg"))
        .pipe(gulp.dest("src/img"));
});


// task to build
gulp.task("build", ["build:copy", "build:images"]);


// task to watch on all changes
gulp.task("watch", ["browser-sync", "style", "pug"] ,function() {
    gulp.watch("src/scss/**/*.scss", ["style"]);
    gulp.watch("src/pug/**/*.pug", ["pug"]);
    gulp.watch("src/*.html", browserSync.reload)
});