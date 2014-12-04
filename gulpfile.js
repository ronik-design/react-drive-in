var Gulp = require('gulp'),
    Deploy = require('gulp-gh-pages'),
    Gutil = require('gulp-util'),
    Shell = require('gulp-shell'),
    Less = require('gulp-less'),
    Header = require('gulp-header'),
    Rename = require('gulp-rename'),
    MinifyCSS = require('gulp-minify-css'),
    BrowserSync = require('browser-sync'),
    Webpack = require('webpack'),
    webpackConfig = require('./webpack.config.js'),
    argv = require('yargs').argv;

Gulp.task('webpack', function(callback) {
    var jsFilename = webpackConfig.output.filename;

    if (argv.production || argv.p) {
        webpackConfig.output.filename = Gutil.replaceExtension(jsFilename, '.min.js');
        webpackConfig.plugins = webpackConfig.plugins.concat(
            new Webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify('production')
                }
            }),
            new Webpack.optimize.DedupePlugin(),
            new Webpack.optimize.UglifyJsPlugin()
        );
    }

    Webpack(webpackConfig).run(function(err, stats) {
        if (err) {
            throw new Gutil.PluginError('webpack', err);
        }

        Gutil.log('[webpack]', stats.toString({
            colors: true
        }));
        callback();
    });
});

Gulp.task('css', function() {
    if (argv.production || argv.p) {
        return Gulp.src('./dist/react-video.css')
            .pipe(MinifyCSS())
            .pipe(Rename({
                suffix: '.min'
            }))
            .pipe(Header(require('./utils/banner')))
            .pipe(Gulp.dest('./dist'));
    } else {
        return Gulp.src('./lib/*.less')
            .pipe(Less())
            .pipe(Header(require('./utils/banner')))
            .pipe(Gulp.dest('./dist'));
    }
});

Gulp.task('server', function() {
    BrowserSync({
        browser: 'google chrome',
        server: {
            baseDir: ['example', 'dist']
        }
    });
});

Gulp.task('watch', function() {
    Gulp.watch('./lib/**/*.js?(x)', ['webpack', BrowserSync.reload]);
    Gulp.watch('./lib/*.less', ['css', BrowserSync.reload]);
});

Gulp.task('deploy', function() {
    Gulp.src('./docs/**/*')
        .pipe(deploy());
});

Gulp.task('bundle', Shell.task([
    'gulp webpack',
    'gulp webpack -p',
    'gulp css',
    'gulp css -p'
    // 'gulp deploy'
]));

Gulp.task('default', ['css', 'webpack', 'server', 'watch']);
