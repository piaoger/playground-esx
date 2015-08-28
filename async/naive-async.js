// naive-async.js


var Async = {

    debug: false,

    log: function(msg) {
        if(Async.debug)
        console.log('async: ' + msg);
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
            var runCount = eachCount;

            var elemDone = function() {
                if(remainElems <= 0) {
                    finished();
                    return;
                }

                if(runCount <= 0) {
                    Async.log('---> Next round ');
                    callback(ayncfn);
                }
            }

            var countInRound = elems.length >= eachCount ? eachCount : elems.length;
            for(var i = 0; i < countInRound; i++) {
                setTimeout( function() {
                    var elem = elems.shift();
                    fn(elem, function() {
                        runCount --;
                        remainElems --;
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

Async.debug = true;

function test_async_series() {
    var elements = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    var fn = function(elem, callback) {
        Async.log('processing item '  + elem);
        if(callback) callback();
    }

    var maxCount = 10;
    Async.series(elements, maxCount, fn, function(){
        Async.log('Run series done. please check if the last one is item ' + maxCount + '.');
    })();
}

function test_async_parallel() {
    var elements = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,16,17];
    var eachCount = 4;
    var maxCount = 14;
    var passes = [1,  2,  3, 4, 5, 6, 7, 8,9,10];
    var fn = function(elem, callback) {
           var idx = Math.floor((Math.random() * 10));
            setTimeout(function() {
            Async.log('processing item '  + elem  + '/' + passes[idx]* 100);
            if(callback) callback();
        }, passes[idx] * 100);
    };

    Async.parallel(elements, 4, maxCount, fn, function(){
        Async.log('Run parallel done. please check if the last one is item ' + maxCount + '.');
    })();
}

test_async_series();
test_async_parallel();
