var MapLayer = require('./MapLayer');
var util = require('util');

function ErosionMapLayer(seed, belowLayer) {
    ErosionMapLayer.super_.call(this, seed);
    this.belowLayer = belowLayer;
}
util.inherits(ErosionMapLayer, MapLayer);

ErosionMapLayer.prototype.generateValues = function(x, z, sizeX, sizeZ) {
    var gridX = x - 1;
    var gridZ = z - 1;
    var gridSizeX = sizeX + 2;
    var gridSizeZ = sizeZ + 2;
    var values = this.belowLayer.generateValues(gridX, gridZ, gridSizeX, gridSizeZ);
    var finalValues = [];
    for (var i = 0; i < sizeZ; i++) {
        for (var j = 0; j < sizeX; j++) {
            var upperLeftVal = values[j + i * gridSizeX];
            var lowerLeftVal = values[j + (i + 2) * gridSizeX];
            var upperRightVal = values[j + 2 + i * gridSizeX];
            var lowerRightVal = values[j + 2 + (i + 2) * gridSizeX];
            var centerVal = values[j + 1 + (i + 1) * gridSizeX];
            this.setCoordsSeed(x + j, z + i);
            if (centerVal != 0 && (upperLeftVal == 0 || upperRightVal == 0 || lowerLeftVal == 0 || lowerRightVal == 0)) {
                finalValues[j + i * sizeX] = this.random.nextInt(5) == 0 ? 0 : centerVal;
            } else if (centerVal == 0 && (upperLeftVal != 0 || upperRightVal != 0 || lowerLeftVal != 0 || lowerRightVal != 0)) {
                if (this.random.nextInt(3) == 0) {
                    finalValues[j + i * sizeX] = upperLeftVal;
                } else {
                    finalValues[j + i * sizeX] = 0;
                }
            } else {
                finalValues[j + i * sizeX] = centerVal;
            }
        }
    }
    return finalValues;
};

module.exports = ErosionMapLayer;