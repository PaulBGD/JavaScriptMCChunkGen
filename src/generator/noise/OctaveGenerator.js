function OctaveGenerator(octaves) {
    this.octaves = octaves;
    this.setScale(0);
}

OctaveGenerator.prototype.setScale = function (scale) {
    if (!number(scale)) {
        throw new TypeError('Scale must be a number');
    }
    this.setXScale(scale);
    this.setYScale(scale);
    this.setZScale(scale);
};

OctaveGenerator.prototype.setXScale = function (scale) {
    if (typeof scale != 'number') {
        throw new TypeError('Scale must be a number');
    }
    this.xScale = scale;
};

OctaveGenerator.prototype.setYScale = function (scale) {
    if (typeof scale != 'number') {
        throw new TypeError('Scale must be a number');
    }
    this.yScale = scale;
};

OctaveGenerator.prototype.setZScale = function (scale) {
    if (typeof scale != 'number') {
        throw new TypeError('Scale must be a number');
    }
    this.zScale = scale;
};

OctaveGenerator.prototype.noise = function (x, y, z, frequency, amplitude, normalized) {
    if(number(x) && number(y) && number(z)) {
        frequency = y;
        amplitude = z;
        normalized = false;
    } else if(number(x) && number(y) && number(z) && number(frequency) && (amplitude === true || amplitude === false)) {
        normalized = amplitude;
        amplitude = frequency;
        frequency = z;
        z = 0;
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

    x *= this.xScale;
    y *= this.yScale;
    z *= this.zScale;

    for (var i = 0; i < this.octaves.length; i++) {
        result += this.octaves[i].noise(x * freq, y * freq, z * freq) * amp;
        max += amp;
        freq *= frequency;
        amp *= amplitude;
    }
    if(normalized) {
        result /= max;
    }
    return result;
};

function un(value) {
    return value === undefined;
}

function number(value) {
    return value % 1 == 0;
}