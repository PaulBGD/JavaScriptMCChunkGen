var MapLayer = require('./MapLayer');
var util = require('util');

const ClimateType = {
    WARM_WET: {
        value: 2,
        crossTypes: [
            3,
            1
        ],
        finalValue: 4
    },
    COLD_DRY: {
        value: 3,
        crossTypes: [
            2,
            4
        ],
        finalValue: 1
    },
    LARGER_BIOMES: {

    }
};

function WhittakerMapLayer(seed, belowLayer, type) {
    WhittakerMapLayer.super_.call(this, seed);
    this.belowLayer = belowLayer;
    this.type = type;
}
util.inherits(WhittakerMapLayer, MapLayer);

WhittakerMapLayer.prototype.generateValues = function(x, z, sizeX, sizeZ) {
    if(this.type == ClimateType.WARM_WET || this.type == ClimateType.COLD_DRY) {
        return this.swapValues(x, z, sizeX, sizeZ);
    } else {
        return this.modifyValue(x, z, sizeX, sizeZ);
    }
};

WhittakerMapLayer.prototype.swapValues = function(x, z, sizeX, sizeZ) {
    var gridX = x - 1;
    var gridZ = z - 1;
    var gridSizeX = sizeX + 2;
    var gridSizeZ = sizeZ + 2;
    var values = this.belowLayer.generateValues(gridX, gridZ, gridSizeX, gridSizeZ);
    var climate = this.type;
    var finalValues = [];
    for (var i = 0; i < sizeZ; i++) {
        for (var j = 0; j < sizeX; j++) {
            var centerVal = values[j + 1 + (i + 1) * gridSizeX];
            if (centerVal == climate.value) {
                var upperVal = values[j + 1 + i * gridSizeX];
                var lowerVal = values[j + 1 + (i + 2) * gridSizeX];
                var leftVal = values[j + (i + 1) * gridSizeX];
                var rightVal = values[j + 2 + (i + 1) * gridSizeX];
                for(var k = 0; k < climate.crossTypes.length; k++) {
                    var type = climate.crossTypes[k];
                    if (upperVal == type || lowerVal == type || leftVal == type || rightVal == type) {
                        centerVal = climate.finalValue;
                        break;
                    }
                }
            }
            finalValues[j + i * sizeX] = centerVal;
        }
    }
    return finalValues;
};

WhittakerMapLayer.prototype.modifyValue = function(x, z, sizeX, sizeZ) {
    var values = this.belowLayer.generateValues(x, z, sizeX, sizeZ);
    var finalValues = [];
    for (var i = 0; i < sizeZ; i++) {
        for (var j = 0; j < sizeX; j++) {
            var val = values[j + i * sizeX];
            if (val != 0) {
                this.setCoordsSeed(x + j, z + i);
                if (this.random.nextInt(13) == 0) {
                    val += 1000;
                }
            }
            finalValues[j + i * sizeX] = val;
        }
    }
    return finalValues;
};

WhittakerMapLayer.ClimateType = ClimateType;

module.exports = WhittakerMapLayer;