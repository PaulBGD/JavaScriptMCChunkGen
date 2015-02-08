var MapLayer = require('./MapLayer');
var util = require('util');

const ZoomType = {
    NORMAL: "NORMAL",
    BLURRY: "BLURRY"
};

function ZoomMapLayer(seed, belowLayer, zoomType) {
    ZoomMapLayer.super_.constructor.call(this, seed);
    if(!zoomType) {
        zoomType = ZoomType.BLURRY;
    }
    this.belowLayer = belowLayer;
    this.zoomType = zoomType;
}
util.inherits(ZoomMapLayer, MapLayer);

ZoomMapLayer.prototype.generateValues = function(x, z, sizeX, sizeZ) {
    var gridX = x >> 1;
    var gridZ = z >> 1;
    var gridSizeX = (sizeX >> 1) + 2;
    var gridSizeZ = (sizeZ >> 1) + 2;
    var values = this.belowLayer.generateValues(gridX, gridZ, gridSizeX, gridSizeZ);
    var zoomSizeX = (gridSizeX - 1) << 1;
    var tmpValues = [];
    for (var i = 0; i < gridSizeZ - 1; i++) {
        var n = (i * 2) * zoomSizeX;
        var upperLeftVal = values[i * gridSizeX];
        var lowerLeftVal = values[(i + 1) * gridSizeX];
        for (var j = 0; j < gridSizeX - 1; j++) {
            var upperRightVal = values[j + 1 + i * gridSizeX];
            var lowerRightVal = values[j + 1 + (i + 1) * gridSizeX];
            this.setCoordsSeed((gridX + j) << 1, (gridZ + i) << 1);
            tmpValues[n] = upperLeftVal;
            tmpValues[n + zoomSizeX] = this.random.nextInt(2) > 0 ? upperLeftVal : lowerLeftVal;
            tmpValues[n + 1] = this.random.nextInt(2) > 0 ? upperLeftVal : upperRightVal;
            tmpValues[n + 1 + zoomSizeX] = this.getNearest(upperLeftVal, upperRightVal, lowerLeftVal, lowerRightVal);
            upperLeftVal = upperRightVal;
            lowerLeftVal = lowerRightVal;
            n += 2;
        }
    }
    var finalValues = [];
    for (i = 0; i < sizeZ; i++) {
        for (j = 0; j < sizeX; j++) {
            finalValues[j + i * sizeX] = tmpValues[j + (i + (z & 1)) * zoomSizeX + (x & 1)];
        }
    }
    return finalValues;
};

ZoomMapLayer.prototype.getNearest = function(upperLeftVal, upperRightVal, lowerLeftVal, lowerRightVal) {
    if(this.zoomType == ZoomType.NORMAL) {
        if (upperRightVal == lowerLeftVal && lowerLeftVal == lowerRightVal) {
            return upperRightVal;
        } else if (upperLeftVal == upperRightVal && upperLeftVal == lowerLeftVal) {
            return upperLeftVal;
        } else if (upperLeftVal == upperRightVal && upperLeftVal == lowerRightVal) {
            return upperLeftVal;
        } else if (upperLeftVal == lowerLeftVal && upperLeftVal == lowerRightVal) {
            return upperLeftVal;
        } else if (upperLeftVal == upperRightVal && lowerLeftVal != lowerRightVal) {
            return upperLeftVal;
        } else if (upperLeftVal == lowerLeftVal && upperRightVal != lowerRightVal) {
            return upperLeftVal;
        } else if (upperLeftVal == lowerRightVal && upperRightVal != lowerLeftVal) {
            return upperLeftVal;
        } else if (upperRightVal == lowerLeftVal && upperLeftVal != lowerRightVal) {
            return upperRightVal;
        } else if (upperRightVal == lowerRightVal && upperLeftVal != lowerLeftVal) {
            return upperRightVal;
        } else if (lowerLeftVal == lowerRightVal && upperLeftVal != upperRightVal) {
            return lowerLeftVal;
        }
    }
    return arguments[this.random.nextInt(arguments.length)];
};

ZoomMapLayer.ZoomType = ZoomType;

module.exports = ZoomMapLayer;