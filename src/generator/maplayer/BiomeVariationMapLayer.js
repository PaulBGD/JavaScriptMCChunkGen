var MapLayer = require('./MapLayer');
var util = require('util');
var biomes = require('../../mc/Biome');

const ISLANDS = [biomes.biomeId[biomes.PLAINS], biomes.biomeId[biomes.FOREST]];

var VARIATIONS = {};
VARIATIONS[biomes.DESERT] = [biomes.biomeId[biomes.DESERT_HILLS]];
VARIATIONS[biomes.FOREST] = [biomes.biomeId[biomes.FOREST_HILLS]];
VARIATIONS[biomes.BIRCH_FOREST] = [biomes.biomeId[biomes.BIRCH_FOREST_HILLS]];
VARIATIONS[biomes.ROOFED_FOREST] = [biomes.biomeId[biomes.PLAINS]];
VARIATIONS[biomes.TAIGA] = [biomes.biomeId[biomes.TAIGA_HILLS]];
VARIATIONS[biomes.MEGA_TAIGA] = [biomes.biomeId[biomes.MEGA_TAIGA_HILLS]];
VARIATIONS[biomes.COLD_TAIGA] = [biomes.biomeId[biomes.COLD_TAIGA_HILLS]];
VARIATIONS[biomes.PLAINS] = [biomes.biomeId[biomes.FOREST], biomes.biomeId[biomes.FOREST_HILLS]];
VARIATIONS[biomes.ICE_PLAINS] = [biomes.biomeId[biomes.ICE_MOUNTAINS]];
VARIATIONS[biomes.JUNGLE] = [biomes.biomeId[biomes.JUNGLE_HILLS]];
VARIATIONS[biomes.OCEAN] = [biomes.biomeId[biomes.DEEP_OCEAN]];
VARIATIONS[biomes.EXTREME_HILLS] = [biomes.biomeId[biomes.EXTREME_HILLS_PLUS]];
VARIATIONS[biomes.SAVANNA] = [biomes.biomeId[biomes.SAVANNA_PLATEAU]];
VARIATIONS[biomes.MESA_PLATEAU_FOREST] = [biomes.biomeId[biomes.MESA]];
VARIATIONS[biomes.MESA_PLATEAU] = [biomes.biomeId[biomes.MESA]];
VARIATIONS[biomes.MESA] = [biomes.biomeId[biomes.MESA]];

function BiomeVariationMapLayer(seed, belowLayer, variationLayer) {
    BiomeVariationMapLayer.super_.call(this, seed);
    this.belowLayer = belowLayer;
    this.variationLayer = variationLayer;
}
util.inherits(BiomeVariationMapLayer, MapLayer);

BiomeVariationMapLayer.prototype.generateValues = function (x, z, sizeX, sizeZ) {
    if (!this.variationLayer) {
        return this.generateRandomValues(x, z, sizeX, sizeZ);
    }
    return this.mergeValues(x, z, sizeX, sizeZ);
};

BiomeVariationMapLayer.prototype.generateRandomValues = function (x, z, sizeX, sizeZ) {
    var values = this.belowLayer.generateValues(x, z, sizeX, sizeZ);
    var finalValues = [];
    for (var i = 0; i < sizeZ; i++) {
        for (var j = 0; j < sizeX; j++) {
            var val = values[j + i * sizeX];
            if (val > 0) {
                this.setCoordsSeed(x + j, z + i);
                val = this.random.nextInt(30) + 2;
            }
            finalValues[j + i * sizeX] = val;
        }
    }
    return finalValues;
};

BiomeVariationMapLayer.prototype.mergeValues = function (x, z, sizeX, sizeZ) {
    var gridX = x - 1;
    var gridZ = z - 1;
    var gridSizeX = sizeX + 2;
    var gridSizeZ = sizeZ + 2;
    var values = this.belowLayer.generateValues(gridX, gridZ, gridSizeX, gridSizeZ);
    var eValues = this.variationLayer.generateValues(gridX, gridZ, gridSizeX, gridSizeZ);
    var finalValues = [];
    for (var i = 0; i < sizeZ; i++) {
        for (var j = 0; j < sizeX; j++) {
            this.setCoordsSeed(x + j, z + i);
            var centerValue = values[j + 1 + (i + 1) * gridSizeX];
            var variationValue = eValues[j + 1 + (i + 1) * gridSizeX];
            if (centerValue != 0 && variationValue == 3 && centerValue < 128) {
                finalValues[j + i * sizeX] = biomes.ids[String(centerValue + 128)] ? centerValue + 128 : centerValue;
            } else if (variationValue == 2 || this.random.nextInt(3) == 0) {
                var val = centerValue;
                if (VARIATIONS[biomes.ids[String(centerValue)]]) {
                    val = VARIATIONS[biomes.ids[String(centerValue)]][this.random.nextInt(VARIATIONS[biomes.ids[String(centerValue)]].length)];
                } else if (centerValue == biomes.biomeId[biomes.DEEP_OCEAN] && this.random.nextInt(3) == 0) {
                    val = ISLANDS[this.random.nextInt(ISLANDS.length)];
                }
                if (variationValue == 2 && val != centerValue) {
                    val = biomes.ids[String(val + 128)] ? val + 128 : centerValue;
                }
                if (val != centerValue) {
                    var count = 0;
                    if (values[j + 1 + i * gridSizeX] == centerValue) { // upper value
                        count++;
                    }
                    if (values[j + 1 + (i + 2) * gridSizeX] == centerValue) { // lower value
                        count++;
                    }
                    if (values[j + (i + 1) * gridSizeX] == centerValue) { // left value
                        count++;
                    }
                    if (values[j + 2 + (i + 1) * gridSizeX] == centerValue) { // right value
                        count++;
                    }
                    finalValues[j + i * sizeX] = count < 3 ? centerValue : val;
                } else {
                    finalValues[j + i * sizeX] = val;
                }
            } else {
                finalValues[j + i * sizeX] = centerValue;
            }
        }
    }
    return finalValues;
};

module.exports = BiomeVariationMapLayer;