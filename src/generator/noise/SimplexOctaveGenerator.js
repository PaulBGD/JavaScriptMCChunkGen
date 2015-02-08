var util = require('util');
var OctaveGenerator = require('./OctaveGenerator');
var SimplexNoiseGenerator = require('./SimplexNoiseGenerator');

function SimplexOctaveGenerator(random, octives) {
    SimplexOctaveGenerator.super_.prototype.constructor.apply(this, createOctives(octives));
    this.random = random;
}

util.inherits(SimplexOctaveGenerator, OctaveGenerator);

function createOctives(octives) {
    var result = [];
    for (var i = 0; i < octives; i++) {
        result.push(new SimplexNoiseGenerator(this.random));
    }
    return result;
}