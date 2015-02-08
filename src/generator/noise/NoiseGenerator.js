function NoiseGenerator() {

}

NoiseGenerator.prototype.perm = [];
NoiseGenerator.prototype.offsetX = 0;
NoiseGenerator.prototype.offsetY = 0;
NoiseGenerator.prototype.offsetZ = 0;

NoiseGenerator.prototype.noise = function (x, y, z, frequency, amplitude, normalized) {
    if (isFloat(x) && isFloat(y) && isFloat(z) && un(frequency) && un(amplitude) && un(normalized)) {
        throw new Error('Not implemented');
    }
    if (!number(x)) {
        throw new TypeError('x must be a number');
    }
    if (!number(frequency)) {
        throw new TypeError('Frequency must be a number');
    }
    if (!number(amplitude)) {
        throw new TypeError('Amplitude must be a number');
    }
    if (un(y)) {
        y = 0;
    }
    if (un(z)) {
        z = 0;
    }
    if (un(normalized)) {
        normalized = false;
    }
    var result = 0;
    var amp = 1;
    var freq = 1;
    var max = 0;

    for (var i = 0; i < this.octaves.length; i++) {
        result += this.noise(x * freq, y * freq, z * freq) * amp;
        max += amp;
        freq *= frequency;
        amp *= amplitude;
    }
    if (normalized) {
        result /= max;
    }
    return result;
};

NoiseGenerator.fade = function (x) {
    if (isFloat(x)) {
        return x * x * x * (x * (x * 6 - 15) + 10);
    }
    // fail silently, this is an internal method anyways
};

NoiseGenerator.lerp = function (x, y, z) {
    if (isFloat(x) && isFloat(y) && isFloat(z)) {
        return y + x * (z - y);
    }
    // fail silently, this is an internal method anyways
};

NoiseGenerator.grad = function(hash, x, y, z) {
    if(isFloat(x) && isFloat(y) && isFloat(z) && isFloat(hash)) {
        hash &= 15;
        var u = hash < 8 ? x : y;
        var v = hash < 4 ? y : hash == 12 || hash == 14 ? x : z;
        return ((hash & 1) == 0 ? u : -u) + ((hash & 2) == 0 ? v : -v);
    }
    // fail silently, this is an internal method anyways
};

function un(value) {
    return value === undefined;
}

function isFloat(n) {
    return n === +n && n !== (n|0);
}

module.exports = NoiseGenerator;