

// References:
//     https://github.com/gulpjs/gulp/blob/master/docs/README.md
//     http://webpack.github.io/docs/
//     https://github.com/shama/webpack-stream
//     http://www.browsersync.io/
//     http://www.ruanyifeng.com/blog/2015/02/strong-typing-javascript.html
//     http://babeljs.io/

// Webpack plugins
//     http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
//     http://webpack.github.io/docs/list-of-plugins.html#bannerplugin

var path  = require('path'),
    fs    = require('fs'),
    spawn = require('child_process').spawn;

var pkg           = require('./package.json'),
    gulp          = require('gulp'),
    gulpUtil      = require('gulp-util'),
    babel         = require('gulp-babel'),
    sync          = require('run-sequence'),
    webpackStream = require('webpack-stream');

process.env.PATH += ':./node_modules/.bin';

var paths = {
    watch: ['lib/**/*.{js,css,html}'],
    src: ['lib/**/*.js'],
    lib: './lib'
};


// ---------------------------------------------------
// Webpack

var banner = [
        '/*\n',
        ' ' + pkg.name + ' v' + pkg.version + '\n',
        ' ' + pkg.description + '\n',
        pkg.author ?   ' ' + pkg.author   + '\n' : '',
        pkg.homepage ? ' ' + pkg.homepage + '\n' : '',
        '*/\n'
    ].join('\n');


var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

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
        entry: {
            app: ['./lib/app.js']
        },
        debug: opts.debug,
        target: opts.target,
        externals: nodeModules,
        module: {
            loaders: [
            {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/
                },
                {
                    test: /\.json$/,
                    exclude: /node_modules/,
                    loader: 'json-loader'
                }
                //,
                // {
                //     test: /\.json$/,
                //    // exclude: /node_modules/,
                //     loader: 'file-loader'
                // }
            ]
        },
        output: {
            library: opts.library,
            filename: opts.filename
            ,
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

    if(opts.target === 'node') {
        webpackConfig.node = {
            __dirname: true,
            __filename: true
          };
    }

    // Banner
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





// ---------------------------------------------------
// gulp tasks

gulp.task('transpile', function() {
  return gulp
    .src(pkg.main)
    .pipe(buildWebpackConfig({
        debug: true,
        target: 'node',
        library: pkg.name,
        filename: pkg.name + '.js'
    }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('transpile:min', function() {
  return gulp
    .src(pkg.main)
    .pipe(buildWebpackConfig({
        debug: false,
        library: pkg.name,
        target: 'node',
        filename: pkg.name + '.min.js'
    }))
    .pipe(gulp.dest('./dist'));
});

// gulp.task('webserv', function() {
//     serv.init({
//         port: 8010,
//         open: false,
//         server: {
//             baseDir: 'www'
//         }
//     }, function(){

//     });
// });

// gulp.task('watch', function() {
//     gulp.watch(paths.watch, ['flow', serv.reload]);
// });

gulp.task('default', function(done) {
    sync( 'transpile', 'transpile:min', done);
});
