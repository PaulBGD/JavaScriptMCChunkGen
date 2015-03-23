var biomes = require('../mc/Biome');

function BiomeGrid() {
    this.biomes = [];
}

BiomeGrid.prototype.getBiome = function (x, z) {
    return biomes.ids[this.biomes[x | (z << 4)] & 0xFF];
};

BiomeGrid.prototype.setBiome = function (x, z, biome) {
    this.biomes[x | (z << 4)] = biomes.biomeId[biome];
};

module.exports = BiomeGrid;
