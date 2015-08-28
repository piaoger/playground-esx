// It's a naive implementation of async workflow.


var Async = {

    // Enable/disable logging
    debug: false,

    // Simple wrapper of console.log.
    log: function(msg) {
        if(Async.debug) {
             console.log('async: ' + msg);
        }
    },

    // An utility to run funcations sequentially.
    series : function(elements, maxCount, fn, finished) {
        var elems = elements.slice(0, maxCount);

        var ayncfn = function(callback) {
            if(elems.length <= 0) {
                finished();
                return;
            }

            var elem = elems.shift();
            fn(elem, function() {
                callback(ayncfn);
            });        
        };

        return function() {
            ayncfn(ayncfn);
        }
    },

    // An utility to run funcations in parallel.
    parallel : function(elements, eachCount, maxCount, fn, finished) {
        var elems = elements.slice(0, maxCount);
        var remainElems = elems.length;

        var ayncfn = function(callback) {
            var countInRound = elems.length >= eachCount ? eachCount : elems.length;
            var remainCountInRound = countInRound;
            var elemDone = function() {
                remainCountInRound --;
                remainElems --;

                if(remainElems <= 0) {
                    finished();
                    return;
                }

                if(remainCountInRound <= 0) {
                    Async.log('---> Next round ');
                    callback(ayncfn);
                }
            }

            for(var i = 0; i < countInRound; i++) {
                setTimeout( function() {
                    var elem = elems.shift();
                    fn(elem, function() {
                        elemDone();
                    }); 
                }, 0);
            }
        };

        return function() {
            ayncfn(ayncfn);
        }
    }
};


// Enable Debugging
Async.debug = true;

function test_async_series() {
    var elements = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    var fn = function(elem, callback) {
        Async.log('processing item ' + elem);
        if(callback) callback();
    }

    var maxCount = 10;
    Async.series(elements, maxCount, fn, function(){
        Async.log('Run series done. please check if the last one is item ' + maxCount + '.');
    })();
}

function test_async_parallel() {
    var elements = [
        1,   2,  3,  4, 
        5,   6,  7,  8,
        9,  10, 11, 12,
        13, 14, 15, 16,
        17, 18, 19, 20
    ];
    var eachCount = 4;
    var maxCount = 19;

    var fn = function(elem, callback) {
        var passes = [1,  2,  3, 4, 5, 6, 7, 8, 9, 10];
        var idx = Math.floor((Math.random() * 10));
        var calcTime = passes[idx] * 100;
        setTimeout(function() {
            Async.log('processing item '  + elem  + '/' + passes[idx]* 100);
            if(callback) callback();
        }, calcTime);
    };

    Async.parallel(elements, 4, maxCount, fn, function(){
        Async.log('Run parallel done. please check if the last one is item ' + maxCount + '.');
    })();
}

test_async_series();
test_async_parallel();
