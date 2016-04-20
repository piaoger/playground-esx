
// stacktrace support in javascript
// see stacktrace library below but I think they are overengineering;
//   https://github.com/felixge/node-stack-trace
//   https://github.com/stacktracejs/stacktrace.js


// -------------------------------------------------------
// test

// result
// [
//   "Object.parse (native)",
//   "makeError (/home/piaoger/playground-esx/fundmental/stacktrace.js:86:12)",
//   "funcB (/home/piaoger/playground-esx/fundmental/stacktrace.js:90:7)",
//   "nocatch (/home/piaoger/playground-esx/fundmental/stacktrace.js:102:7)",
//   "null._onTimeout (/home/piaoger/playground-esx/fundmental/stacktrace.js:118:7)",
//   "Timer.listOnTimeout (timers.js:92:15)"
// ]
// -------------------------------------------------------

// function printStacktrace(err) {
//     var stack = stacktrace(err);
//     console.log(JSON.stringify(stack));
// }

// function makeError() {
//     JSON.parse('{badjson');
// }

// function funcB() {
//     makeError();
// }

// function trycatch() {
//     try{
//         funcB();
//     } catch(ex) {
//         printStacktrace(ex);
//     }
// }

// function nocatch() {
//     funcB();
// }

// // node.js
// if(process) {
//     process.on('uncaughtException', function(err) {
//         printStacktrace(err);
//     });
// }

// // Aync
// setTimeout(function(){
//     // caught exception
//     trycatch();

//     // uncaught exception
//     nocatch();
// }, 1000);


if(Error.stackTraceLimit) {
    Error.stackTraceLimit = 15;
}

function stacktrace(err) {
    var stack = [],
        message = '';

    if(err) {
        if (err.message) {
            message = err.message;
        }
    }

    // default tracelimit in node/chrome is 10?
    // Error.stackTraceLimit is defined in v8 but not firefox.
    if(err && err.stack) {

        // chrome, v8
        stack = err.stack
            .replace(/^[^\(]+?[\n$]/gm, '')
            .replace(/^\s+at\s+/gm, '')
            .replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@')
            .split('\n');

        // firefox
        // stack = err.stack.replace(/(?:\n@:0)?\s+$/m, '').replace(/^\(/gm, '{anonymous}(').split('\n')
    }

    return {
        msg: message,
        stack: stack
    };
}
