var MapLayer = require('./MapLayer');
var util = require('util');
var biomes = require('../../mc/Biome');

function DeepOcean(seed, belowLayer) {
    DeepOcean.super_.constructor.call(this, seed);
    this.belowLayer = belowLayer;
}
util.inherits(DeepOcean, MapLayer);

DeepOcean.prototype.generateValues = function(x, z, sizeX, sizeZ) {
    var gridX = x - 1;
    var gridZ = z - 1;
    var gridSizeX = sizeX + 2;
    var gridSizeZ = sizeZ + 2;
    var values = this.belowLayer.generateValues(gridX, gridZ, gridSizeX, gridSizeZ);
    var finalValues = [];
    for (var i = 0; i < sizeZ; i++) {
        for (var j = 0; j < sizeX; j++) {
            var centerVal = values[j + 1 + (i + 1) * gridSizeX];
            if (centerVal == 0) {
                var upperVal = values[j + 1 + i * gridSizeX];
                var lowerVal = values[j + 1 + (i + 2) * gridSizeX];
                var leftVal = values[j + (i + 1) * gridSizeX];
                var rightVal = values[j + 2 + (i + 1) * gridSizeX];
                if (upperVal == 0 && lowerVal == 0 && leftVal == 0 && rightVal == 0) {
                    this.setCoordsSeed(x + j, z + i);
                    finalValues[j + i * sizeX] = this.random.nextInt(100) == 0 ? biomes.biomeId[biomes.MUSHROOM_ISLAND] : biomes.biomeId[biomes.DEEP_OCEAN];
                } else {
                    finalValues[j + i * sizeX] = centerVal;
                }
            } else {
                finalValues[j + i * sizeX] = centerVal;
            }
        }
    }
    return finalValues;
};

module.exports = DeepOcean;