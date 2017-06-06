var gulp = require('gulp');
var tslint = require('gulp-tslint');
var ts = require('gulp-typescript');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var gulpSequence = require('gulp-sequence');
var karmaServer = require('karma').Server;
var browserSync = require('browser-sync');
var buffer = require('vinyl-buffer');

gulp.task('clean', function (cb) {
    del(['./temp'], function () {
        del(['./dist'], cb);
    });
});

gulp.task('copy:index', function (cb) {
    return gulp.src('./index.html')
        .pipe(gulp.dest('./dist'));
});

//代码格式检查
gulp.task('lint', function () {
    return gulp.src([
        './source/ts/**/**.ts',
        './test/**/**.test.ts'
    ]).pipe(tslint({
        formatter: "verbose"
    }))
        .pipe(tslint.report());
});

//项目编译
gulp.task('tsc', function () {
    var tsProject = ts.createProject({
        removeComments: true,
        noImplicitAny: true,
        target: 'ES5',
        module: 'commonjs',
        declarationFiles: false,
        emitDecoratorMetadata: true,
        experimentalDecorators:true
    });

    return gulp.src('./src/**/**.ts')
        .pipe(tsProject())
        .js
        .pipe(gulp.dest('./temp/src/js'));
});

gulp.task('tsc-tests', function () {
    var tsTestProject = ts.createProject({
        removeComments: true,
        noImplicitAny: true,
        target: 'ES5',
        module: 'commonjs',
        declarationFiles: false,
        emitDecoratorMetadata: true,
        experimentalDecorators:true
    });
    return gulp.src('./test/**/**.test.ts')
        .pipe(tsTestProject())
        .js
        .pipe(gulp.dest('./temp/test/'));
});

//代码打包及压缩
gulp.task('bundle-js', function () {
    return browserify({
        entries: './temp/src/js/app.js',
        debug: true
    }).bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/source/js/'));
});

gulp.task('bundle-test', function () {
    return browserify({
        entries: './temp/test/app.test.js',
        debug: true
    }).bundle()
        .pipe(source('bundle.test.js'))
        .pipe(gulp.dest('./dist/test/'));
});

//测试任务
gulp.task('karma', function (cb) {
    new karmaServer({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, cb).start();
});

gulp.task('build', function (cb) {
    gulpSequence(
        'lint',
        ['tsc', 'tsc-tests'],
        cb
    )
});

gulp.task('bundle', function (cb) {
    gulpSequence(
        'build',
        ['bundle-js', 'bundle-test'],
        'copy:index',
        cb
    );
});

gulp.task('test', function (cb) {
    gulpSequence(
        'bundle',
        ['karma'],
        cb
    );
});

gulp.task('browserSync', function () {
    browserSync({
        server: {
            baseDir: './dist'
        }
    });
    return gulp.watch([
        './dist/source/js/**/*.js',
        './dist/source/css/**.css',
        './dist/test/**/**.test.js',
        './dist/data/**/**',
        './index.html'
    ], [browserSync.reload]);
});

gulp.task('watch', ['test'], function () {
    gulp.watch('./src/**/**.ts', ['test']);
});

gulp.task('serve', function (cb) {
    gulpSequence(
        'watch',
        'browserSync',
        cb
    )
});

gulp.task('default', ['test']);
