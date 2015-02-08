var MapLayer = require('./MapLayer');
var util = require('util');
var biomes = require('../../mc/Biome');

const OCEANS = [biomes.biomeId[biomes.OCEAN], biomes.biomeId[biomes.DEEP_OCEAN]];
var SPECIAL_RIVERS = {};
SPECIAL_RIVERS[biomes.ICE_PLAINS] = biomes.biomeId[biomes.FROZEN_RIVER];
SPECIAL_RIVERS[biomes.MUSHROOM_ISLAND] = biomes.biomeId[biomes.MUSHROOM_SHORE];
SPECIAL_RIVERS[biomes.MUSHROOM_SHORE] = biomes.biomeId[biomes.MUSHROOM_SHORE];

function RiverMapLayer(seed, belowLayer, mergeLayer) {
    RiverMapLayer.super_.constructor.call(this, seed);
    this.belowLayer = belowLayer;
    this.mergeLayer = mergeLayer;
}
util.inherits(RiverMapLayer, MapLayer);

RiverMapLayer.prototype.generateValues = function(x, z, sizeX, sizeZ) {
    if(!this.mergeLayer) {
        return this.generateRivers(x, z, sizeX, sizeZ);
    }
    return this.mergeRivers(x, z, sizeX, sizeZ);
};

RiverMapLayer.prototype.generateRivers = function(x, z, sizeX, sizeZ) {
    var gridX = x - 1;
    var gridZ = z - 1;
    var gridSizeX = sizeX + 2;
    var gridSizeZ = sizeZ + 2;
    var values = this.belowLayer.generateValues(gridX, gridZ, gridSizeX, gridSizeZ);
    var finalValues = [];
    for (var i = 0; i < sizeZ; i++) {
        for (var j = 0; j < sizeX; j++) {
            var centerVal = values[j + 1 + (i + 1) * gridSizeX] & 1;
            var upperVal = values[j + 1 + i * gridSizeX] & 1;
            var lowerVal = values[j + 1 + (i + 2) * gridSizeX] & 1;
            var leftVal = values[j + (i + 1) * gridSizeX] & 1;
            var rightVal = values[j + 2 + (i + 1) * gridSizeX] & 1;
            var val = 0;
            if (centerVal != upperVal || centerVal != lowerVal || centerVal != leftVal || centerVal != rightVal) {
                val = 1;
            }
            finalValues[j + i * sizeX] = val;
        }
    }
    return finalValues;
};

RiverMapLayer.prototype.mergeRivers = function(x, z, sizeX, sizeZ) {
    var values = this.belowLayer.generateValues(x, z, sizeX, sizeZ);
    var mValues = this.mergeLayer.generateValues(x, z, sizeX, sizeZ);
    var finalValues = [];
    for (var i = 0; i < sizeX * sizeZ; i++) {
        var val = mValues[i];
        if (~OCEANS.indexOf(mValues[i])) {
            val = mValues[i];
        } else if (values[i] == 1) {
            if (SPECIAL_RIVERS[biomes.ids[mValues[i].toString()]]) {
                val = SPECIAL_RIVERS[biomes.ids[mValues[i].toString()]];
            } else {
                val = biomes.biomeId[biomes.RIVER];
            }
        }
        finalValues[i] = val;
    }
    return finalValues;
};

module.exports = RiverMapLayer;