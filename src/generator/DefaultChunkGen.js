var MapLayer = require('./maplayer/MapLayer');
var JavaUtils = require('../utils/JavaUtils');
var Random = require('../utils/JavaRandom');
var BiomeGrid = require('./BiomeGrid');
var Long = require('long');

function DefaultChunkGen() {
}

DefaultChunkGen.prototype.generate = function (seed, x, z) {
    if (isNaN(seed) || (x | 0) !== x) {
        seed = JavaUtils.hashCode(seed);
    }
    var random = new Random(Long.fromValue(x).multiply("341873128712").add(Long.fromValue(z).multiply("132897987541")));
    var biomeGrid = MapLayer.initialize(seed);
    var biomes = new BiomeGrid();
    biomes.biomes = biomeGrid[0].generateValues(x * 16, z * 16, 16, 16);


};

module.exports = DefaultChunkGen;
