var MapLayer = require('./MapLayer');
var util = require('util');

function SmoothMapLayer(seed, belowLayer) {
    SmoothMapLayer.super_.constructor.call(this, seed);
    this.belowLayer = belowLayer;
}
util.inherits(SmoothMapLayer, MapLayer);

SmoothMapLayer.prototype.generateValues = function(x, z, sizeX, sizeZ) {
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
            if (upperVal == lowerVal && leftVal == rightVal) {
                this.setCoordsSeed(x + j, z + i);
                centerVal = this.random.nextInt(2) == 0 ? upperVal : leftVal;
            } else if (upperVal == lowerVal) {
                centerVal = upperVal;
            } else if (leftVal == rightVal) {
                centerVal = leftVal;
            }
            finalValues[j + i * sizeX] = centerVal;
        }
    }
    return finalValues;
};

module.exports = SmoothMapLayer;