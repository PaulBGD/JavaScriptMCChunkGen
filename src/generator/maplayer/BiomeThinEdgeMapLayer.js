var MapLayer = require('./MapLayer');
var util = require('util');
var biomes = require('../../mc/Biome');

const OCEANS = [
    biomes.ids.OCEAN,
    biomes.ids.DEEP_OCEAN
];

const MESA_EDGES = {};
MESA_EDGES[biomes.ids.MESA] = biomes.ids.DESERT;
MESA_EDGES[biomes.ids.MESA_BRYCE] = biomes.ids.DESERT;
MESA_EDGES[biomes.ids.MESA_PLATEAU] = biomes.ids.DESERT;
MESA_EDGES[biomes.ids.MESA_PLATEAU_FOREST] = biomes.ids.DESERT;
MESA_EDGES[biomes.ids.MESA_PLATEAU_FOREST_MOUNTAINS] = biomes.ids.DESERT;
MESA_EDGES[biomes.ids.MESA_PLATEAU_MOUNTAINS] = biomes.ids.DESERT;

const JUNGLE_EDGES = {};
JUNGLE_EDGES[biomes.ids.JUNGLE] = biomes.ids.JUNGLE_EDGE;
JUNGLE_EDGES[biomes.ids.JUNGLE_HILLS] = biomes.ids.JUNGLE_EDGE;
JUNGLE_EDGES[biomes.ids.JUNGLE_MOUNTAINS] = biomes.ids.JUNGLE_EDGE;
JUNGLE_EDGES[biomes.ids.JUNGLE_EDGE_MOUNTAINS] = biomes.ids.JUNGLE_EDGE;

const EDGES = [
    {
        key: MESA_EDGES,
        value: null
    },
    {
        key: JUNGLE_EDGES,
        value: [
            biomes.ids.JUNGLE,
            biomes.ids.JUNGLE_HILLS,
            biomes.ids.JUNGLE_MOUNTAINS,
            biomes.ids.JUNGLE_EDGE_MOUNTAINS,
            biomes.ids.FOREST,
            biomes.ids.TAIGA
        ]
    }
];

function BiomeThinEdgeMapLayer(seed, belowLayer) {
    BiomeThinEdgeMapLayer.super_.call(this, seed);
    this.belowLayer = belowLayer;
}
util.inherits(BiomeThinEdgeMapLayer, MapLayer);

BiomeThinEdgeMapLayer.prototype.generateValues = function (x, z, sizeX, sizeZ) {
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
                    if (!entry.value && ((OCEANS.indexOf(upperVal) == -1 && !map[String(upperVal)]) ||
                        (OCEANS.indexOf(lowerVal) == -1 && !map[String(lowerVal)]) ||
                        (OCEANS.indexOf(leftVal) == -1 && !map[String(leftVal)]) ||
                        (OCEANS.indexOf(rightVal) == -1 && !map[String(rightVal)]))) {
                        val = map[String(centerVal)];
                        break;
                    } else if (entry.value && ((OCEANS.indexOf(upperVal) == -1 && entry.value.indexOf(upperVal) == -1) ||
                        (OCEANS.indexOf(lowerVal) == -1 && entry.value.indexOf(lowerVal) == -1) ||
                        (OCEANS.indexOf(leftVal) == -1 && entry.value.indexOf(leftVal) == -1) ||
                        (OCEANS.indexOf(rightVal) == -1 && entry.value.indexOf(rightVal) == -1))) {
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

module.exports = BiomeThinEdgeMapLayer;
