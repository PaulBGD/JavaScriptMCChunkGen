var Random = require('../../utils/JavaRandom');
var NoiseMapLayer = require('./NoiseMapLayer');
var WhittakerMapLayer = require('./WhittakerMapLayer');
var ZoomMapLayer = require('./ZoomMapLayer');
var ErosionMapLayer = require('./ErosionMapLayer');
var DeepOceanLayer = require('./DeepOceanLayer');

function MapLayer(seed) {
    this.random = new Random();
    this.seed = seed;
}

MapLayer.prototype.setCoordsSeed = function(x, z) {
    this.random.setSeed(this.seed);
    this.random.setSeed(x * this.random.nextLong() + z * this.random.nextLong() ^ this.seed);
};

MapLayer.initialize = function(seed, worldType) {
    if(!seed) {
        seed = Date.now();
    }
    var layer = new NoiseMapLayer(seed);
    layer = new WhittakerMapLayer(seed + 1, layer, WhittakerMapLayer.ClimateType.WARM_WET);
    layer = new WhittakerMapLayer(seed + 1, layer, WhittakerMapLayer.ClimateType.COLD_DRY);
    layer = new WhittakerMapLayer(seed + 2, layer, WhittakerMapLayer.ClimateType.LARGER_BIOMES);
    for(var i = 0; i < 2; i++) {
        layer = new ZoomMapLayer(seed + 100 + i, layer, ZoomMapLayer.ZoomType.BLURRY);
    }
    for(i = 0; i < 2; i++) {
        layer = new ErosionMapLayer(seed + 3 + i, layer);
    }
    layer = new DeepOceanLayer(seed + 4, layer);
};