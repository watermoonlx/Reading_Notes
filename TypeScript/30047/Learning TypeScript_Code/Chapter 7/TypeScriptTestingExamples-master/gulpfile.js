"use strict";

//******************************************************************************
//* DEPENDENCIES
//******************************************************************************
// Check out package.json for full list of dependencies!
var gulp        = require("gulp"),
    browserify  = require("browserify"),
    source      = require("vinyl-source-stream"),
    buffer      = require("vinyl-buffer"),
    run         = require("gulp-run"),
    nightwatch  = require('gulp-nightwatch'),
    tslint      = require("gulp-tslint"),
    tsc         = require("gulp-typescript"),
    browserSync = require('browser-sync'),
    karma       = require("karma").server,
    uglify      = require("gulp-uglify"),
    docco       = require("gulp-docco"),
    runSequence = require("run-sequence"),
    header      = require("gulp-header"),
    pkg         = require(__dirname + "/package.json");

//******************************************************************************
//* LINT
//******************************************************************************
// lint app and test code
gulp.task("lint", function() {
  return gulp.src([
                __dirname + "/source/**/**.ts",
                __dirname + "/test/**/**.test.ts"
              ])
             .pipe(tslint())
             .pipe(tslint.report("verbose"));
});

//******************************************************************************
//* BUILD
//******************************************************************************
// The TypeScript compiler settings
var tsProject = tsc.createProject({
  removeComments : false,
  noImplicitAny : false,
  target : "ES5",
  module : "commonjs",
  declarationFiles : false
});

// compile app code
gulp.task("build-source", function() {
  return gulp.src(__dirname + "/source/*.ts")
             .pipe(tsc(tsProject))
             .js.pipe(gulp.dest(__dirname + "/build/source/"));
});

var tsTestProject = tsc.createProject({
  removeComments : false,
  noImplicitAny : false,
  target : "ES5",
  module : "commonjs",
  declarationFiles : false
});

// compile test code
gulp.task("build-test", function() {
  return gulp.src(__dirname + "/test/*.test.ts")
             .pipe(tsc(tsTestProject))
             .js.pipe(gulp.dest(__dirname + "/build/test/"));
});

//******************************************************************************
//* BUNDLE
//******************************************************************************
// bundle source test to be able to run them on a web browser
gulp.task("bundle-source", function () {
  var b = browserify({
    standalone : 'demos',
    entries: __dirname + "/build/source/demos.js",
    debug: true
  });

  return b.bundle()
    .pipe(source("demos.js"))
    .pipe(buffer())
    .pipe(gulp.dest(__dirname + "/bundled/source/"));
});

// bundle unit test to be able to run them on a web browser
gulp.task("bundle-test", function () {

  // in this demo we will only execute the bdd tests
  // but tdd examples are available in the /test directory

  var b = browserify({
    standalone : 'test',
    entries: __dirname + "/build/test/bdd.test.js",
    debug: true
  });

  return b.bundle()
    .pipe(source("bdd.test.js"))
    .pipe(buffer())
    .pipe(gulp.dest(__dirname + "/bundled/test/"));
});

// bundle e2e test to be able to run them on a web browser
gulp.task("bundle-e2e-test", function () {

  // in this demo we will only execute the bdd tests
  // but tdd examples are available in the /test directory

  var b = browserify({
    standalone : 'test',
    entries: __dirname + "/build/test/e2e.test.js",
    debug: true
  });

  return b.bundle()
    .pipe(source("e2e.test.js"))
    .pipe(buffer())
    .pipe(gulp.dest(__dirname + "/bundled/e2e-test/"));
});

//******************************************************************************
//* DOCUMENT
//******************************************************************************
/*
* Create annotated source code documentation website
* normally we will only do this for app code not test code but because this is
* a repo for learning how to test we will also document tests
*
* build and bundle the code:
* $ gulp build-source
* $ gulp build-test
*
* And then document it:
* $ gulp document
*/
gulp.task("document", function () {
  return gulp.src(__dirname + "/build/*/*.js")
             .pipe(docco())
             .pipe(gulp.dest(__dirname + "/documentation"));
});

//******************************************************************************
//* TEST
//******************************************************************************

// run unit test
gulp.task("run-unit-test", function(cb) {
  karma.start({
    configFile : __dirname + "/karma.conf.js",
    singleRun: true
  }, cb);
});

/*
* Run itegration (e2e) test
* Before you can execute the e2e test:
* $ gulp run-e2e-test
*
* We need to run the application:
* $ gulp serve
*
* and start karma:
* $ npm install selenium-standalone@latest -g
* $ selenium-standalone install
* $ selenium-standalone start
*
* https://www.npmjs.com/package/selenium-standalone
*/
gulp.task('run-e2e-test', function(){
  return gulp.src('')
    .pipe(nightwatch({
      configFile: __dirname + '/nightwatch.json'
    }));
});

//******************************************************************************
//* BAKE
//******************************************************************************
// Compress your application to increase performance
gulp.task("compress", function() {
  return gulp.src(__dirname + "/bundled/source/demos.js")
             .pipe(uglify({ preserveComments : false }))
             .pipe(gulp.dest(__dirname + "/dist/"))
});

// Add copyright details to the top of the minified file
gulp.task("header", function() {

  var pkg = require(__dirname + "/package.json");

  var banner = ["/**",
    " * <%= pkg.name %> v.<%= pkg.version %> - <%= pkg.description %>",
    " * Copyright (c) 2015 <%= pkg.author %>",
    " * <%= pkg.license %>",
    " * <%= pkg.homepage %>",
    " */",
    ""].join("\n");

  return gulp.src(__dirname + "/dist/demos.js")
             .pipe(header(banner, { pkg : pkg } ))
             .pipe(gulp.dest(__dirname + "/dist/"));
});

//******************************************************************************
//* SERVE
//******************************************************************************
// Run the application in a local web server
gulp.task('serve', function(cb) {
    browserSync({
        port: 8080,
        server: {
            baseDir: "./"
        }
    });

    gulp.watch([
      "./**/*.js",
      "./**/*.css",
      "./index.html"
    ], browserSync.reload, cb);
});

//******************************************************************************
//* HELPERS AND DEFAULT
//******************************************************************************
// run tests
gulp.task('run', function (cb) {
  runSequence(
    "lint",
    ["build-source", "build-test"],
    ["bundle-source", "bundle-test", "bundle-e2e-test"],
    ["run-unit-test"],
    "serve",
    cb);
});

// Run E2E tests:
// selenium-standalone start (in a second console)
// gulp run-e2e-test (in a third console)
