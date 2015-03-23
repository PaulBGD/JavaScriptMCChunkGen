var Random = require('../../utils/JavaRandom');

if (!global._uniqueId) {
    global._uniqueId = 0;
}

function MapLayer(seed) {
    this.random = new Random();
    this.seed = seed;
    this._id = global._uniqueId++;
}

MapLayer.prototype.setCoordsSeed = function (x, z) {
    if (!this.random) {
        this.random = new Random();
    }
    this.random.setSeed(this.seed);
    this.random.setSeed(x * this.random.nextLong() + z * this.random.nextLong() ^ this.seed);
};

MapLayer.initialize = function (seed, worldType) {
    if (!seed) {
        seed = Date.now();
    }
    var layer = new NoiseMapLayer(seed);
    layer = new WhittakerMapLayer(seed + 1, layer, WhittakerMapLayer.ClimateType.WARM_WET);
    layer = new WhittakerMapLayer(seed + 1, layer, WhittakerMapLayer.ClimateType.COLD_DRY);
    layer = new WhittakerMapLayer(seed + 2, layer, WhittakerMapLayer.ClimateType.LARGER_BIOMES);
    for (var i = 0; i < 2; i++) {
        layer = new ZoomMapLayer(seed + 100 + i, layer, ZoomMapLayer.ZoomType.BLURRY);
    }
    for (i = 0; i < 2; i++) {
        layer = new ErosionMapLayer(seed + 3 + i, layer);
    }

    layer = new DeepOceanLayer(seed + 4, layer);
    var layerMountains = new BiomeVariationMapLayer(seed + 200, layer);
    for (i = 0; i < 2; i++) {
        layerMountains = new ZoomMapLayer(seed + 200 + 1, layerMountains);
    }
    layer = new BiomeMapLayer(seed + 5, layer);
    for (i = 0; i < 2; i++) {
        layer = new ZoomMapLayer(seed + 200 + i, layer);
    }
    layer = new BiomeEdgeMapLayer(seed + 200, layer);
    layer = new BiomeVariationMapLayer(seed + 200, layer, layerMountains);
    layer = new RarePlainsMapLayer(seed + 201, layer);
    layer = new ZoomMapLayer(seed + 300, layer);
    layer = new ErosionMapLayer(seed + 6, layer);
    layer = new ZoomMapLayer(seed + 400, layer);
    layer = new BiomeThinEdgeMapLayer(seed + 400, layer);
    layer = new ShoreMapLayer(seed + 7, layer);
    for (i = 0; i < 2; i++) {
        layer = new ZoomMapLayer(seed + 500 + i, layer);
    }
    var layerRiver = layerMountains;
    layerRiver = new ZoomMapLayer(seed + 300, layerRiver);
    layerRiver = new ZoomMapLayer(seed + 400, layerRiver);
    for (i = 0; i < 2; i++) {
        layerRiver = new ZoomMapLayer(seed + 500 + i, layerRiver);
    }
    layerRiver = new RiverMapLayer(seed + 10, layerRiver);

    layer = new RiverMapLayer(seed + 1000, layerRiver, layer);
    var layerLowerRes = layer;
    for (i = 0; i < 2; i++) {
        layer = new ZoomMapLayer(seed + 2000 + i, layer);
    }

    layer = new SmoothMapLayer(seed + 1001, layer);
    return [layer, layerLowerRes];
};


module.exports = MapLayer;

// imports at the bottom due to the prototype not loaded
var NoiseMapLayer = require('./NoiseMapLayer');
var WhittakerMapLayer = require('./WhittakerMapLayer');
var ZoomMapLayer = require('./ZoomMapLayer');
var ErosionMapLayer = require('./ErosionMapLayer');
var DeepOceanLayer = require('./DeepOceanLayer');
var BiomeVariationMapLayer = require('./BiomeVariationMapLayer');
var BiomeMapLayer = require('./BiomeMapLayer');
var BiomeEdgeMapLayer = require('./BiomeEdgeMapLayer');
var RarePlainsMapLayer = require('./RarePlainsMapLayer');
var BiomeThinEdgeMapLayer = require('./BiomeThinEdgeMapLayer');
var ShoreMapLayer = require('./ShoreMapLayer');
var RiverMapLayer = require('./RiverMapLayer');
var SmoothMapLayer = require('./SmoothMapLayer');
