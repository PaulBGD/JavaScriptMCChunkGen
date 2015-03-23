var util = require('util');
var OctaveGenerator = require('./OctaveGenerator');
var SimplexNoiseGenerator = require('./SimplexNoiseGenerator');

function SimplexOctaveGenerator(random, octives) {
    SimplexOctaveGenerator.super_.call(this, createOctives(random, octives));
    this.random = random;
}

util.inherits(SimplexOctaveGenerator, OctaveGenerator);

function createOctives(random, octives) {
    var result = [];
    for (var i = 0; i < octives; i++) {
        result.push(new SimplexNoiseGenerator(random));
    }
    return result;
}

module.exports = SimplexOctaveGenerator;
