var SimplexOctaveGenerator = require('../noise/SimplexOctaveGenerator');
var Random = require('../../utils/JavaRandom');
var MapLayer = require('./MapLayer');
var util = require('util');

function NoiseMapLayer(seed) {
    NoiseMapLayer.super_.call(this, seed);
    this.noiseGen = new SimplexOctaveGenerator(new Random(seed), 2);
}
util.inherits(NoiseMapLayer, MapLayer);

NoiseMapLayer.prototype.generateValues = function(x, z, sizeX, sizeZ) {
    var values = [];
    for(var i = 0; i < sizeZ; i++) {
        for(var j = 0; j < sizeX; j++) {
            var noise = this.noiseGen.noise(x + j, z + i, 0.175, 0.8, true) * 4;
            var val = 0;
            if(noise >= 0.05) {
                val = noise <= 0.2 ? 3 : 2;
            } else {
                this.setCoordsSeed(x + j, z + i);
                val = this.random.nextInt(2) == 0 ? 3 : 0;
            }
            values[j + i * sizeX] = val;
        }
    }
    return values;
};

module.exports = NoiseMapLayer;