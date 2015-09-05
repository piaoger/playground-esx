

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
    spawn = require('child_process').spawn;

var pkg           = require('./package.json'),
    gulp          = require('gulp'),
    gulpUtil      = require('gulp-util'),
    flatten       = require('gulp-flatten'),
    babel         = require('gulp-babel'),
    sync          = require('run-sequence'),
    browserSync   = require('browser-sync'),
    webpackStream = require('webpack-stream'),
    flowbin       = require('flow-bin');

var serv = browserSync.create();

var paths = {
    watch: ['www/**/*.{js,css,html}'],
    src: ['www/**/*.js'],
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
// flow


process.env.PATH += ':./node_modules/.bin';

// Start up flow server
!function(){

    var flowServer = spawn(flowbin, ['server'], {
        cwd: path.resolve(__dirname),
        env: process.env
    });

    flowServer.stdout.on('data', function(data){
        console.log(data);
    });

    process.on('SIGINT', function() {
        flowServer.kill();
        process.exit();
    });

}();


// Query typecheck status from flow server
function checkstatus() {

    var errfmt = ' '; // --json';

    var child = spawn(flowbin,  ['status'], {
            cwd: path.resolve(__dirname),
            env: process.env
        });

    child.on('exit', function(code) {
    });

    child.stdout.on('data', function(data){

        if(errfmt == '--json') {
            var errdata;
            try {
                errdata = JSON.parse(data);
            }
            catch(e) {
                errdata = data.toString();
            }

             // TODO: customize error message to make it more readable.
             console.log(errdata);
 
        } else {
            // remove dirname from long path names.
            var regex = new RegExp(path.resolve(__dirname), "g");
            var errmsg = data.toString().replace(regex, '');
            console.log(errmsg);
        }

    });

}

// ---------------------------------------------------
// Bebel

// http://babeljs.io/docs/usage/options/
var babelOpts = {
    // enable jsx and flow
    nonStandard: true,
    loose: [
        'es6.classes'
    ],
    stage: 1,
    optional: ['runtime'],
    plugins: []
};



// ---------------------------------------------------
// gulp tasks


gulp.task('flow', function() {
    checkstatus();
});

gulp.task('lib', function() {
  return gulp
    .src(paths.src)
    .pipe(babel(babelOpts))
    .pipe(flatten())
    .pipe(gulp.dest(paths.lib));
});


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
        port: 8010,
        open: false,
        server: {
            baseDir: 'www'
        }
    }, function(){

    });
});

gulp.task('watch', function() {
    gulp.watch(paths.watch, ['flow', serv.reload]);
});

gulp.task('default', function(done) {
    sync('flow', 'lib', 'transpile', 'transpile:min', 'webserv', 'watch', done);
});
