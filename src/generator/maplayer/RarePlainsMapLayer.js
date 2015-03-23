var MapLayer = require('./MapLayer');
var Biomes = require('../../mc/Biome');
var util = require('util');

const RARE_PLAINS = {};
RARE_PLAINS[Biomes.biomeId.PLAINS] = Biomes.biomeId.SUNFLOWER_PLAINS;

function RarePlainsMapLayer(seed, belowLayer) {
    RarePlainsMapLayer.super_.call(this, seed);
    this.belowLayer = belowLayer;
}
util.inherits(RarePlainsMapLayer, MapLayer);

RarePlainsMapLayer.prototype.generateValues = function (x, z, sizeX, sizeZ) {
    var gridX = x - 1;
    var gridZ = z - 1;
    var gridSizeX = sizeX + 2;
    var gridSizeZ = sizeZ + 2;
    var values = this.belowLayer.generateValues(gridX, gridZ, gridSizeX, gridSizeZ);
    var finalValues = [];
    for (var i = 0; i < sizeZ; i++) {
        for (var j = 0; j < sizeX; j++) {
            this.random.setSeed(this.seed);
            this.random.setSeed(x * this.random.nextLong() + z * this.random.nextLong() ^ this.seed);
            this.setCoordsSeed(x + j, z + i);
            var centerValue = values[j + 1 + (i + 1) * gridSizeX];
            if (this.random.nextInt(57) == 0 && RARE_PLAINS[String(centerValue)]) {
                centerValue = RARE_PLAINS[String(centerValue)];
            }
            finalValues[j + i * sizeX] = centerValue;
        }
    }
    return finalValues;
};

module.exports = RarePlainsMapLayer;
