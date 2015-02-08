var PerlinNoiseGenerator = require('./PerlinNoiseGenerator');
var util = require('util');

const SQRT_3 = Math.sqrt(3);
const SQRT_5 = Math.sqrt(5);
const F2 = 0.5 * (SQRT_3 - 1);
const G2 = (3 - SQRT_3) / 6;
const G22 = G2 * 2 - 1;
const F3 = 1 / 3;
const G3 = 1 / 6;
const F4 = (SQRT_5 - 1) / 4;
const G4 = (5 - SQRT_5) / 20;
const G42 = G4 * 2;
const G43 = G4 * 3;
const G44 = G4 * 4 - 1;

const simplex = [
    [0, 1, 2, 3], [0, 1, 3, 2], [0, 0, 0, 0], [0, 2, 3, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [1, 2, 3, 0],
    [0, 2, 1, 3], [0, 0, 0, 0], [0, 3, 1, 2], [0, 3, 2, 1], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [1, 3, 2, 0],
    [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0],
    [1, 2, 0, 3], [0, 0, 0, 0], [1, 3, 0, 2], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [2, 3, 0, 1], [2, 3, 1, 0],
    [1, 0, 2, 3], [1, 0, 3, 2], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [2, 0, 3, 1], [0, 0, 0, 0], [2, 1, 3, 0],
    [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0],
    [2, 0, 1, 3], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [3, 0, 1, 2], [3, 0, 2, 1], [0, 0, 0, 0], [3, 1, 2, 0],
    [2, 1, 0, 3], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [3, 1, 0, 2], [0, 0, 0, 0], [3, 2, 0, 1], [3, 2, 1, 0]
];
const grad4 = [
    [0, 1, 1, 1], [0, 1, 1, -1], [0, 1, -1, 1], [0, 1, -1, -1],
    [0, -1, 1, 1], [0, -1, 1, -1], [0, -1, -1, 1], [0, -1, -1, -1],
    [1, 0, 1, 1], [1, 0, 1, -1], [1, 0, -1, 1], [1, 0, -1, -1],
    [-1, 0, 1, 1], [-1, 0, 1, -1], [-1, 0, -1, 1], [-1, 0, -1, -1],
    [1, 1, 0, 1], [1, 1, 0, -1], [1, -1, 0, 1], [1, -1, 0, -1],
    [-1, 1, 0, 1], [-1, 1, 0, -1], [-1, -1, 0, 1], [-1, -1, 0, -1],
    [1, 1, 1, 0], [1, 1, -1, 0], [1, -1, 1, 0], [1, -1, -1, 0],
    [-1, 1, 1, 0], [-1, 1, -1, 0], [-1, -1, 1, 0], [-1, -1, -1, 0]
];

function SimplexNoiseGenerator(random) {
    SimplexNoiseGenerator.super_.constructor.call(this, random);
    this.offsetW = random.nextDouble() * 256;
}
util.inherits(SimplexNoiseGenerator, PerlinNoiseGenerator);

SimplexNoiseGenerator.prototype.noise = function(xin, yin, zin, w) {
    if(isFloat(xin) && isFloat(yin)) {
        if(isFloat(zin)){
            if(isFloat(w)) {
                // 4 params
                var x = xin + this.offsetX;
                var y = yin + this.offsetY;
                var z = zin + this.offsetZ;
                w += this.offsetW;

                var n0;
                var n1;
                var n2;
                var n3;
                var n4;

                var s = (x + y + z + w) * F4;
                var i = Math.floor(x + s);
                var j = Math.floor(y + s);
                var k = Math.floor(z + s);
                var l = Math.floor(w + s);

                var t = (i + j + k + l) * G4;
                var X0 = i - t;
                var Y0 = j - t;
                var Z0 = k - t;
                var W0 = l - t;
                var x0 = x - X0;
                var y0 = y - Y0;
                var z0 = z - Z0;
                var w0 = w - W0;

                var c1 = (x0 > y0) ? 32 : 0;
                var c2 = (x0 > z0) ? 16 : 0;
                var c3 = (y0 > z0) ? 8 : 0;
                var c4 = (x0 > w0) ? 4 : 0;
                var c5 = (y0 > w0) ? 2 : 0;
                var c6 = (z0 > w0) ? 1 : 0;
                var c = c1 + c2 + c3 + c4 + c5 + c6;
                var i1, j1, k1, l1;
                var i2, j2, k2, l2;
                var i3, j3, k3, l3;

                i1 = simplex[c][0] >= 3 ? 1 : 0;
                j1 = simplex[c][1] >= 3 ? 1 : 0;
                k1 = simplex[c][2] >= 3 ? 1 : 0;
                l1 = simplex[c][3] >= 3 ? 1 : 0;

                i2 = simplex[c][0] >= 2 ? 1 : 0;
                j2 = simplex[c][1] >= 2 ? 1 : 0;
                k2 = simplex[c][2] >= 2 ? 1 : 0;
                l2 = simplex[c][3] >= 2 ? 1 : 0;

                i3 = simplex[c][0] >= 1 ? 1 : 0;
                j3 = simplex[c][1] >= 1 ? 1 : 0;
                k3 = simplex[c][2] >= 1 ? 1 : 0;
                l3 = simplex[c][3] >= 1 ? 1 : 0;

                var x1 = x0 - i1 + G4;
                var y1 = y0 - j1 + G4;
                var z1 = z0 - k1 + G4;
                var w1 = w0 - l1 + G4;

                var x2 = x0 - i2 + G42;
                var y2 = y0 - j2 + G42;
                var z2 = z0 - k2 + G42;
                var w2 = w0 - l2 + G42;

                var x3 = x0 - i3 + G43;
                var y3 = y0 - j3 + G43;
                var z3 = z0 - k3 + G43;
                var w3 = w0 - l3 + G43;

                var x4 = x0 + G44;
                var y4 = y0 + G44;
                var z4 = z0 + G44;
                var w4 = w0 + G44;

                var ii = i & 255;
                var jj = j & 255;
                var kk = k & 255;
                var ll = j & 255;

                var gi0 = this.perm[ii + this.perm[jj + this.perm[kk + this.perm[ll]]]] % 32;
                var gi1 = this.perm[ii + i1 + this.perm[jj + j1 + this.perm[kk + k1 + this.perm[ll + l1]]]] % 32;
                var gi2 = this.perm[ii + i2 + this.perm[jj + j2 + this.perm[kk + k2 + this.perm[ll + l2]]]] % 32;
                var gi3 = this.perm[ii + i3 + this.perm[jj + j3 + this.perm[kk + k3 + this.perm[ll + l3]]]] % 32;
                var gi4 = this.perm[ii + 1 + this.perm[jj + 1 + this.perm[kk + 1 + this.perm[ll + 1]]]] % 32;

                var t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0 - w0 * w0;
                if (t0 < 0) {
                    n0 = 0.0;
                } else {
                    t0 *= t0;
                    n0 = t0 * t0 * dot(grad4[gi0], x0, y0, z0, w0);
                }
                var t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1 - w1 * w1;
                if (t1 < 0) {
                    n1 = 0.0;
                } else {
                    t1 *= t1;
                    n1 = t1 * t1 * dot(grad4[gi1], x1, y1, z1, w1);
                }
                var t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2 - w2 * w2;
                if (t2 < 0) {
                    n2 = 0.0;
                } else {
                    t2 *= t2;
                    n2 = t2 * t2 * dot(grad4[gi2], x2, y2, z2, w2);
                }
                var t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3 - w3 * w3;
                if (t3 < 0) {
                    n3 = 0.0;
                } else {
                    t3 *= t3;
                    n3 = t3 * t3 * dot(grad4[gi3], x3, y3, z3, w3);
                }
                var t4 = 0.6 - x4 * x4 - y4 * y4 - z4 * z4 - w4 * w4;
                if (t4 < 0) {
                    n4 = 0.0;
                } else {
                    t4 *= t4;
                    n4 = t4 * t4 * dot(grad4[gi4], x4, y4, z4, w4);
                }

                return 27 * (n0 + n1 + n2 + n3 + n4);
            } else {
                // 3 params
                xin += this.offsetX;
                yin += this.offsetY;
                zin += this.offsetZ;

                var n0;
                var n1;
                var n2;
                var n3;

                var s = (xin + yin + zin) * F3;
                var i = Math.floor(xin + s);
                var j = Math.floor(yin + s);
                var k = Math.floor(zin + s);
                var t = (i + j + k) * G3;
                var X0 = i - t;
                var Y0 = j - t;
                var Z0 = k - t;
                var x0 = xin - X0;
                var y0 = yin - Y0;
                var z0 = zin - Z0;

                var i1;
                var j1;
                var k1;
                var i2;
                var j2;
                var k2;
                if(x0 >= y0) {
                    if(y0 >= z0) {
                        i1 = 1;
                        j1 = 0;
                        k1 = 0;
                        i2 = 1;
                        j2 = 1;
                        k2 = 0;
                    } else if(x0 >= z0) {
                        i1 = 1;
                        j1 = 0;
                        k1 = 0;
                        i2 = 1;
                        j2 = 0;
                        k2 = 1;
                    } else {
                        i1 = 0;
                        j1 = 0;
                        k1 = 1;
                        i2 = 1;
                        j2 = 0;
                        k2 = 1;
                    }
                } else {
                    if(y0 < z0) {
                        i1 = 0;
                        j1 = 0;
                        k1 = 1;
                        i2 = 0;
                        j2 = 1;
                        k2 = 1;
                    } else if(x0 < z0) {
                        i1 = 0;
                        j1 = 1;
                        k1 = 0;
                        i2 = 0;
                        j2 = 1;
                        k2 = 1;
                    } else {
                        i1 = 0;
                        j1 = 1;
                        k1 = 0;
                        i2 = 1;
                        j2 = 1;
                        k2 = 0;
                    }
                }

                var x1 = x0 - i1 + G3;
                var y1 = y0 - j1 + G3;
                var z1 = z0 - k1 + G3;
                var x2 = x0 - i2 + 2 * G3;
                var y2 = y0 - j2 + 2 * G3;
                var z2 = z0 - k2 + 2 * G3;
                var x3 = x0 - 1 + 3 * G3;
                var y3 = y0 - 1 + 3 * G3;
                var z3 = z0 - 1 + 3 * G3;

                var ii = i & 255;
                var jj = j & 255;
                var kk = k & 255;
                var gi0 = this.perm[ii + this.perm[jj + this.perm[kk]]] % 12;
                var gi1 = this.perm[ii + i1 + this.perm[jj + j1 + this.perm[kk + k1]]] % 12;
                var gi2 = this.perm[ii + i2 + this.perm[jj + j2 + this.perm[kk + k2]]] % 12;
                var gi3 = this.perm[ii + 1 + this.perm[jj + 1 + this.perm[kk + 1]]] % 12;

                var t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
                if(t0 < 0) {
                    n0 = 0;
                } else {
                    t0 *= t0;
                    n0 = t0 * t0 * dot(PerlinNoiseGenerator.grad3[gi0], x0, y0, z0);
                }

                var t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
                if(t1 < 0) {
                    n1 = 0;
                } else {
                    t1 *= t1;
                    n1 = t1 * t1 * dot(PerlinNoiseGenerator.grad3[gi1], x1, y1, z1);
                }

                var t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
                if(t2 < 0) {
                    n2 = 0;
                } else {
                    t2 *= t2;
                    n2 = t2 * t2 * dot(PerlinNoiseGenerator.grad3[gi2], x2, y2, z2);
                }

                var t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
                if(t3 < 0) {
                    n3 = 0;
                } else {
                    t3 *= t3;
                    n3 = t3 * t3 * dot(PerlinNoiseGenerator.grad3[gi3], x3, y3, z3);
                }

                return 32 * (n0 + n1 + n2 + n3);
            }
        } else {
            // 2 params
            xin += this.offsetX;
            yin += this.offsetY;

            var n0;
            var n1;
            var n2;

            var s = (xin + yin) * F2;
            var i = Math.floor(xin + s);
            var j = Math.floor(yin + s);
            var t = (i + j) * G2;
            var X0 = i - t;
            var Y0 = j - t;
            var x0 = xin - X0;
            var y0 = yin - Y0;

            var i1;
            var j1;
            if(x0 > y0) {
                i1 = 1;
                j1 = 0;
            } else {
                i1 = 0;
                j1 = 1;
            }

            var x1 = x0 - i1 + G2;
            var y1 = y0 - j1 + G2;
            var x2 = x0 + G22;
            var y2 = y0 + G22;

            var ii = i & 255;
            var jj = j & 255;
            var gi0 = this.perm[ii + this.perm[jj]] % 12;
            var gi1 = this.perm[ii + i1 + this.perm[jj + j1]] % 12;
            var gi2 = this.perm[ii + 1 + this.perm[jj + 1]] % 12;

            var t0 = 0.5 - x0 * x0 - y0 * y0;
            if(t0 < 0) {
                n0 = 0;
            } else {
                t0 *= t0;
                n0 = t0 * t0 * dot(PerlinNoiseGenerator.grad3[gi0], x0, y0);
            }

            var t1 = 0.5 - x1 * x1 - y1 * y1;
            if(t1 < 0) {
                n1 = 0;
            } else {
                t1 *= t1;
                n1 = t1 * t1 * dot(PerlinNoiseGenerator.grad3[gi1], x1, y1);
            }

            var t2 = 0.5 - x2 * x2 - y2 * y2;
            if(t2 < 0) {
                n2 = 0;
            } else {
                t2 *= t2;
                n2 = t2 * t2 * dot(PerlinNoiseGenerator.grad3[gi2], x2, y2);
            }

            return 70 * (n0 + n1 + n2);
        }
    }
};

function dot(g, x, y, z, w) {
    if(Array.isArray(g) && isFloat(x) && isFloat(y)) {
        if(isFloat(z)) {
            if(isFloat(w)) {
                // 5 args
                return g[0] * x + g[1] * y + g[2] * z + g[3] * w;
            } else {
                // 4 args
                return g[0] * x + g[1] * y + g[2] * z;
            }
        } else {
            // 3 args
            return g[0] * x + g[1] * y;
        }
    }
}

function isFloat(n) {
    return n === +n && n !== (n|0);
}

module.exports = SimplexNoiseGenerator;