
// simd.js works on Firefox nightly only.
// It's time to write Matrix/Vector stuffs with SIMD.js

// gl-matrix began to support simd.js:
//    https://github.com/toji/gl-matrix

// Also see: 
//    http://jsperf.com/simdmat4
//    https://github.com/PeterJensen/ecmascript_simd
//    https://github.com/toji/gl-matrix/pull/172

var v1 = [1.0, 0.0, 0.0];
var v2 = [0.0, 1.0, 0.0];

function vec_add(v1, v2) {
    return [
        v1[0] + v2[0], 
        v1[1] + v2[1], 
        v1[2] + v2[2]
    ];
}

function vec_add_simd(v1, v2) {
    var sv1 = SIMD.Float32x4(v1[0], v1[1], v1[2]);
    var sv2 = SIMD.Float32x4(v2[0], v2[1], v2[2]);
    var sum = SIMD.Float32x4.add(sv1, sv2);

    return (
        SIMD.Float32x4.extractLane(sum, 0) +
        SIMD.Float32x4.extractLane(sum, 1) +
        SIMD.Float32x4.extractLane(sum, 2) ) / 3;
}

var t0 = Date.now();

for(var i = 0; i < 100000; i++) {
    vec_add(v1, v2);
}

var t1 = Date.now();

for(var i = 0; i < 100000; i++) {
    vec_add_simd(v1, v2);
}

var t2 = Date.now();

var diff = t2 - t1 - t1 + t0;

console.log("benchmark: " + (diff / (t2-t0)) + "%");