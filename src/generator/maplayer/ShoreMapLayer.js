var MapLayer = require('./MapLayer');
var biomes = require('../../mc/Biome');
var util = require('util');

const OCEANS = [
    biomes.biomeId.OCEAN,
    biomes.biomeId.DEEP_OCEAN
];
const SPECIAL_SHORES = {};
SPECIAL_SHORES[biomes.biomeId.EXTREME_HILLS] = biomes.biomeId.STONE_BEACH;
SPECIAL_SHORES[biomes.biomeId.EXTREME_HILLS_PLUS] = biomes.biomeId.STONE_BEACH;
SPECIAL_SHORES[biomes.biomeId.EXTREME_HILLS_MOUNTAINS] = biomes.biomeId.STONE_BEACH;
SPECIAL_SHORES[biomes.biomeId.EXTREME_HILLS_PLUS_MOUNTAINS] = biomes.biomeId.STONE_BEACH;
SPECIAL_SHORES[biomes.biomeId.ICE_PLAINS] = biomes.biomeId.COLD_BEACH;
SPECIAL_SHORES[biomes.biomeId.ICE_MOUNTAINS] = biomes.biomeId.COLD_BEACH;
SPECIAL_SHORES[biomes.biomeId.ICE_PLAINS_SPIKES] = biomes.biomeId.COLD_BEACH;
SPECIAL_SHORES[biomes.biomeId.COLD_TAIGA] = biomes.biomeId.COLD_BEACH;
SPECIAL_SHORES[biomes.biomeId.COLD_TAIGA_HILLS] = biomes.biomeId.COLD_BEACH;
SPECIAL_SHORES[biomes.biomeId.COLD_TAIGA_MOUNTAINS] = biomes.biomeId.COLD_BEACH;
SPECIAL_SHORES[biomes.biomeId.MUSHROOM_ISLAND] = biomes.biomeId.MUSHROOM_SHORE;
SPECIAL_SHORES[biomes.biomeId.SWAMPLAND] = biomes.biomeId.SWAMPLAND;
SPECIAL_SHORES[biomes.biomeId.MESA] = biomes.biomeId.MESA;
SPECIAL_SHORES[biomes.biomeId.MESA_PLATEAU_FOREST] = biomes.biomeId.MESA_PLATEAU_FOREST;
SPECIAL_SHORES[biomes.biomeId.MESA_PLATEAU_FOREST_MOUNTAINS] = biomes.biomeId.MESA_PLATEAU_FOREST_MOUNTAINS;
SPECIAL_SHORES[biomes.biomeId.MESA_PLATEAU] = biomes.biomeId.MESA_PLATEAU;
SPECIAL_SHORES[biomes.biomeId.MESA_PLATEAU_MOUNTAINS] = biomes.biomeId.MESA_PLATEAU_MOUNTAINS;
SPECIAL_SHORES[biomes.biomeId.MESA_BRYCE] = biomes.biomeId.MESA_BRYCE;

function ShoreMapLayer(seed, belowLayer) {
    ShoreMapLayer.super_.call(this, seed);
    this.belowLayer = belowLayer;
}
util.inherits(ShoreMapLayer, MapLayer);

ShoreMapLayer.prototype.generateValues = function (x, z, sizeX, sizeZ) {
    var gridX = x - 1;
    var gridZ = z - 1;
    var gridSizeX = sizeX + 2;
    var gridSizeZ = sizeZ + 2;
    var values = this.belowLayer.generateValues(gridX, gridZ, gridSizeX, gridSizeZ);
    var finalValues = [];
    for (var i = 0; i < sizeZ; i++) {
        for (var j = 0; j < sizeX; j++) {
            var upperVal = values[j + 1 + i * gridSizeX];
            var lowerVal = values[j + 1 + (i + 2) * gridSizeX];
            var leftVal = values[j + (i + 1) * gridSizeX];
            var rightVal = values[j + 2 + (i + 1) * gridSizeX];
            var centerVal = values[j + 1 + (i + 1) * gridSizeX];
            if (OCEANS.indexOf(centerVal) == -1 && (OCEANS.indexOf(upperVal) > -1 || OCEANS.indexOf(lowerVal) > -1 ||
                OCEANS.indexOf(leftVal) > -1 || OCEANS.indexOf(rightVal) > -1)) {
                finalValues[j + i * sizeX] = SPECIAL_SHORES[String(centerVal)] ? SPECIAL_SHORES[String(centerVal)] : biomes.ids.BEACH;
            } else {
                finalValues[j + i * sizeX] = centerVal;
            }
        }
    }
    return finalValues;
};

module.exports = ShoreMapLayer;
