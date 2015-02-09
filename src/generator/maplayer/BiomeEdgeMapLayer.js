var MapLayer = require('./MapLayer');
var util = require('util');
var biomes = require('../../mc/Biome');

const MEGA_EDGES = {};
MEGA_EDGES[biomes.ids.MESA_PLATEAU_FOREST] = biomes.ids.MESA;
MEGA_EDGES[biomes.ids.MESA_PLATEAU] = biomes.ids.MESA;

const MEGA_TAIGA_EDGES = {};
MEGA_TAIGA_EDGES[biomes.ids.MEGA_TAIGA] = biomes.ids.TAIGA;

const DESERT_EDGES = {};
DESERT_EDGES[biomes.ids.DESERT] = biomes.ids.EXTREME_HILLS_PLUS;

const SWAMP1_EDGES = {};
SWAMP1_EDGES[biomes.ids.SWAMPLAND] = biomes.ids.PLAINS;

const SWAMP2_EDGES = {};
SWAMP2_EDGES[biomes.ids.SWAMPLAND] = biomes.ids.JUNGLE_EDGE;


function BiomeEdgeMapLayer(seed, belowLayer) {
    BiomeEdgeMapLayer.super_.constructor.call(this, seed);
    this.belowLayer = belowLayer;
}
util.inherits(BiomeEdgeMapLayer, MapLayer);

BiomeEdgeMapLayer.prototype.generateValues = function(x, z, sizeX, sizeZ) {
};

module.exports = BiomeEdgeMapLayer;