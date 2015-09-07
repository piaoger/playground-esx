
'use strict';

// From: http://www.crmarsh.com/flow/

/* @flow */
function foo(x: string, y: number): string {
    return x.length * y;
}

foo("Hello", 6);

/**
@param {number} x
@return {number}
*/
function square(x) {
    return x * x;
}
square('ddd');


var kv: { [key:string]: number } = {
    'hello': 0,
    'world': 1
};

kv.goodbye = 2;
kv.seeya = 'bump';