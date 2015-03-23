var MapLayer = require('./MapLayer');
var util = require('util');
var biomes = require('../../mc/Biome');

const WARM = [
    biomes.biomeId.DESERT,
    biomes.biomeId.DESERT,
    biomes.biomeId.DESERT,
    biomes.biomeId.SAVANNA,
    biomes.biomeId.SAVANNA,
    biomes.biomeId.PLAINS
];
const WET = [
    biomes.biomeId.PLAINS,
    biomes.biomeId.PLAINS,
    biomes.biomeId.FOREST,
    biomes.biomeId.BIRCH_FOREST,
    biomes.biomeId.ROOFED_FOREST,
    biomes.biomeId.EXTREME_HILLS,
    biomes.biomeId.SWAMPLAND
];
const DRY = [
    biomes.biomeId.PLAINS,
    biomes.biomeId.FOREST,
    biomes.biomeId.TAIGA,
    biomes.biomeId.EXTREME_HILLS
];
const COLD = [
    biomes.biomeId.ICE_PLAINS,
    biomes.biomeId.ICE_PLAINS,
    biomes.biomeId.COLD_TAIGA
];
const WARM_LARGE = [
    biomes.biomeId.MESA_PLATEAU_FOREST,
    biomes.biomeId.MESA_PLATEAU_FOREST,
    biomes.biomeId.MESA_PLATEAU
];
const DRY_LARGE = [
    biomes.biomeId.MEGA_TAIGA
];
const WET_LARGE = [
    biomes.biomeId.JUNGLE
];

function BiomeMapLayer(seed, belowLayer) {
    BiomeMapLayer.super_.call(this, seed);
    this.belowLayer = belowLayer;
}
util.inherits(BiomeMapLayer, MapLayer);

BiomeMapLayer.prototype.generateValues = function(x, z, sizeX, sizeZ) {
    var values = this.belowLayer.generateValues(x, z, sizeX, sizeZ);
    var finalValues = [];
    for (var i = 0; i < sizeZ; i++) {
        for (var j = 0; j < sizeX; j++) {
            var val = values[j + i * sizeX];
            if (val != 0) {
                this.setCoordsSeed(x + j, z + i);
                switch (val) {
                    case 1:
                        val = DRY[this.random.nextInt(DRY.length)];
                        break;
                    case 2:
                        val = WARM[this.random.nextInt(WARM.length)];
                        break;
                    case 3:
                    case 1003:
                        val = COLD[this.random.nextInt(COLD.length)];
                        break;
                    case 4:
                        val = WET[this.random.nextInt(WET.length)];
                        break;
                    case 1001:
                        val = DRY_LARGE[this.random.nextInt(DRY_LARGE.length)];
                        break;
                    case 1002:
                        val = WARM_LARGE[this.random.nextInt(WARM_LARGE.length)];
                        break;
                    case 1004:
                        val = WET_LARGE[this.random.nextInt(WET_LARGE.length)];
                        break;
                    default:
                        val = 0;
                        break;
                }
            }
            finalValues[j + i * sizeX] = val;
        }
    }
    return finalValues;
};

module.exports = BiomeMapLayer;