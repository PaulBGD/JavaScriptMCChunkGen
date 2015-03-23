var MapLayer = require('./maplayer/MapLayer');
var Random = require('../utils/JavaRandom');
var Long = require('long');

function DefaultChunkGen() {
}

DefaultChunkGen.prototype.generate = function (seed, x, z) {
    var random = new Random(Long.fromValue(x).multiply("341873128712").add(Long.fromValue(z).multiply("132897987541")));
    var biomeGrid = MapLayer.initialize(seed);
    var biomeValues = biomeGrid[0].generateValues(x * 16, z * 16, 16, 16);
    console.log(JSON.stringify(biomeValues));
};

module.exports = DefaultChunkGen;
