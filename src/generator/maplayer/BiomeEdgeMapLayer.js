var MapLayer = require('./MapLayer');
var util = require('util');
var biomes = require('../../mc/Biome');

const MEGA_EDGES = {};
MEGA_EDGES[biomes.biomeId.MESA_PLATEAU_FOREST] = biomes.biomeId.MESA;
MEGA_EDGES[biomes.biomeId.MESA_PLATEAU] = biomes.biomeId.MESA;

const MEGA_TAIGA_EDGES = {};
MEGA_TAIGA_EDGES[biomes.biomeId.MEGA_TAIGA] = biomes.biomeId.TAIGA;

const DESERT_EDGES = {};
DESERT_EDGES[biomes.biomeId.DESERT] = biomes.biomeId.EXTREME_HILLS_PLUS;

const SWAMP1_EDGES = {};
SWAMP1_EDGES[biomes.biomeId.SWAMPLAND] = biomes.biomeId.PLAINS;

const SWAMP2_EDGES = {};
SWAMP2_EDGES[biomes.biomeId.SWAMPLAND] = biomes.biomeId.JUNGLE_EDGE;

const EDGES = [
    {
        key: MEGA_EDGES,
        value: null
    },
    {
        key: MEGA_TAIGA_EDGES,
        value: null
    },
    {
        key: DESERT_EDGES,
        value: [
            biomes.biomeId.ICE_PLAINS
        ]
    },
    {
        key: SWAMP1_EDGES,
        value: [
            biomes.biomeId.DESERT,
            biomes.biomeId.COLD_TAIGA,
            biomes.biomeId.ICE_PLAINS
        ]
    },
    {
        key: SWAMP2_EDGES,
        value: [
            biomes.biomeId.JUNGLE
        ]
    }
];

function BiomeEdgeMapLayer(seed, belowLayer) {
    BiomeEdgeMapLayer.super_.call(this, seed);
    this.belowLayer = belowLayer;
}
util.inherits(BiomeEdgeMapLayer, MapLayer);

BiomeEdgeMapLayer.prototype.generateValues = function (x, z, sizeX, sizeZ) {
    var gridX = x - 1;
    var gridZ = z - 1;
    var gridSizeX = sizeX + 2;
    var gridSizeZ = sizeZ + 2;
    var values = this.belowLayer.generateValues(gridX, gridZ, gridSizeX, gridSizeZ);
    var finalValues = [];
    for (var i = 0; i < sizeZ; i++) {
        for (var j = 0; j < sizeX; j++) {
            var centerVal = values[j + 1 + (i + 1) * gridSizeX];
            var val = centerVal;
            for (var k = 0, max = EDGES.length; k < max; k++) {
                var entry = EDGES[k];
                var map = entry.key;
                if (map[String(centerVal)]) {
                    var upperVal = values[j + 1 + i * gridSizeX];
                    var lowerVal = values[j + 1 + (i + 2) * gridSizeX];
                    var leftVal = values[j + (i + 1) * gridSizeX];
                    var rightVal = values[j + 2 + (i + 1) * gridSizeX];
                    if (!entry.value && (!map[String(upperVal)] || !map[String(lowerVal)] || !map[String(leftVal)] || !map[String(rightVal)])) {
                        val = map[String(centerVal)];
                        break;
                    } else if (entry.value && (entry.value.indexOf(upperVal) > -1 || entry.value.indexOf(lowerVal) > -1 ||
                        entry.value.indexOf(leftVal) > -1 || entry.value.indexOf(rightVal) > -1)) {
                        val = map[String(centerVal)];
                        break;
                    }
                }
            }
            finalValues[j + i * sizeX] = val;
        }
    }
    return finalValues;
};

module.exports = BiomeEdgeMapLayer;
