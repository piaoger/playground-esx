

// References:
//     https://github.com/gulpjs/gulp/blob/master/docs/README.md
//     http://webpack.github.io/docs/
//     https://github.com/shama/webpack-stream
//     http://www.browsersync.io/
// Webpack plugins
//     http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
//     http://webpack.github.io/docs/list-of-plugins.html#bannerplugin

var pkg = require('./package.json'),
    gulp  = require('gulp'),
    gulpUtil = require('gulp-util'),
    sync  = require('run-sequence'),
    browserSync = require('browser-sync'),
    webpackStream = require('webpack-stream');

var serv = browserSync.create();

var paths = {
    watch: ['www/**/*.{js,css,html}']
};


var banner =
    '/*\n' +
    ' ' + pkg.name + ' v' + pkg.version + '\n' +
    ' ' + pkg.description + '\n' +
    ( pkg.author ? ' ' + pkg.author + '\n' : '') +
    ( pkg.homepage ? ' ' + pkg.homepage + '\n' : '')  +
    '*/\n';


// You can use an external webpack.config.js
// But build webpack config programtically is better as does in facebook libraries.
// option = {
//     debug: true,
//     library: 'libraryname',
//     filename: 'output.js'
// }
function buildWebpackConfig(opts) {

    var webpack = webpackStream.webpack;

    var webpackConfig = {
        debug: opts.debug,
        devtool: 'source-map',
        module: {
            loaders: [
                {test: /\.js$/, loader: 'babel'}
            ]
        },
        output: {
            library: opts.library,
            filename: opts.filename,
            libraryTarget: 'umd'
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(
                    opts.debug ? 'development' : 'production'
                )
            })
        ]
    };

        webpackConfig.plugins.push(
            new webpack.BannerPlugin(
                banner,
                {
                    entryOnly: true,
                    raw: true
                }
            )
        );
    if (!opts.debug) {
        webpackConfig.plugins.push(
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    hoist_vars: true,
                    screw_ie8: true,
                    warnings: false
                }
            }),
            new webpack.BannerPlugin(
                banner,
                {
                    entryOnly: true,
                    raw: true
                }
            )
        );
    }
  
    return webpackStream(webpackConfig, null, function(err, stats) {
        if (err) {
            throw new gulpUtil.PluginError('webpack', err);
        }
        if (stats.compilation.errors.length) {
            gulpUtil.log('webpack', '\n' + stats.toString({colors: true}));
        }
    });
}


gulp.task('transpile', function() {
  return gulp
    .src(pkg.main)
    .pipe(buildWebpackConfig({
        debug: true,
        library: pkg.name,
        filename: pkg.name + '.js'
    }))
    .pipe(gulp.dest('./www'));
});

gulp.task('transpile:min', function() {
  return gulp
    .src(pkg.main)
    .pipe(buildWebpackConfig({
        debug: false,
        library: pkg.name,
        filename: pkg.name + '.min.js'
    }))
    .pipe(gulp.dest('./www'));
});

gulp.task('webserv', function() {
    serv.init({
        port: 3000,
        open: false,
        server: {
            baseDir: 'www'
        }
    }, function(){

    });
});


gulp.task('watch', function() {
    gulp.watch(paths.watch, [serv.reload]);
});


gulp.task('default', function(done) {
    sync('transpile', 'transpile:min', 'webserv', 'watch', done);
});
