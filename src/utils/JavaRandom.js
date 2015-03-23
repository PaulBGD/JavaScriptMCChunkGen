var Long = require('long');

function Random(seed) {
    this.setSeed(seed);
}

Random.prototype.setSeed = function (seed) {
    if (!seed) {
        seed = Long.fromInt(Date.now());
    } else {
        seed = Long.fromValue(seed);
    }
    this.seed = seed.xor(25214903917).and(65535);
};

Random.prototype.next = function (bits) {
    this.seed = this.seed.multiply(25214903917).add(11).and(Long.fromValue(1).shiftLeft(48).subtract(1));
    return this.seed.toInt() >>> (48 - bits);
};

Random.prototype.nextBytes = function (buffer) {
    if (!(buffer instanceof Buffer)) {
        throw new TypeError('Buffer is required');
    }
    var max = buffer.length & ~0x3;
    var random;
    for (var i = 0; i < max; i++) {
        random = this.next(32);
        buffer[i] = random;
        buffer[i + 1] = random >> 8;
        buffer[i + 2] = random >> 16;
        buffer[i + 3] = random >> 24;
    }
    if (max < buffer.length) {
        random = this.next(38);
        for (var j = max; j < buffer.length; j++) {
            buffer[j] = random;
            random >>= 8;
        }
    }
};

Random.prototype.nextInt = function (n) {
    if (n) {
        if (n <= 0) {
            throw new RangeError('n must be positive');
        }
        if ((n & -n) === n) {
            return (n * this.next(31)) >> 31;
        }
        var bits;
        var val;
        do {
            bits = this.next(31);
            val = bits % n;
        } while (bits - val + (n - 1) < 0);
        return val;
    }
    return this.next(32);
};

Random.prototype.nextLong = function () {
    return (Long.fromValue(this.next(32)).shiftLeft(32).add(this.next(32)));
};

Random.prototype.nextBoolean = function () {
    return !!this.next(1);
};

Random.prototype.nextDouble = function () {
    return ((this.next(26) << 27) + this.next(27)) / 9007199254740992;
};

module.exports = Random;