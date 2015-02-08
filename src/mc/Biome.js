const data = {
    SWAMPLAND: [0,6],
    FOREST: [1,4],
    TAIGA: [2,5],
    DESERT: [3,2],
    PLAINS: [4,1],
    HELL: [5,8],
    SKY: [6,9],
    OCEAN: [7,0],
    RIVER: [8,7],
    EXTREME_HILLS: [9,3],
    FROZEN_OCEAN: [10,10],
    FROZEN_RIVER: [11,11],
    ICE_PLAINS: [12,12],
    ICE_MOUNTAINS: [13,13],
    MUSHROOM_ISLAND: [14,14],
    MUSHROOM_SHORE: [15,15],
    BEACH: [16,16],
    DESERT_HILLS: [17,17],
    FOREST_HILLS: [18,18],
    TAIGA_HILLS: [19,19],
    SMALL_MOUNTAINS: [20,20],
    JUNGLE: [21,21],
    JUNGLE_HILLS: [22,22],
    JUNGLE_EDGE: [23,23],
    DEEP_OCEAN: [24,24],
    STONE_BEACH: [25,25],
    COLD_BEACH: [26,26],
    BIRCH_FOREST: [27,27],
    BIRCH_FOREST_HILLS: [28,28],
    ROOFED_FOREST: [29,29],
    COLD_TAIGA: [30,30],
    COLD_TAIGA_HILLS: [31,31],
    MEGA_TAIGA: [32,32],
    MEGA_TAIGA_HILLS: [33,33],
    EXTREME_HILLS_PLUS: [34,34],
    SAVANNA: [35,35],
    SAVANNA_PLATEAU: [36,36],
    MESA: [37,37],
    MESA_PLATEAU_FOREST: [38,38],
    MESA_PLATEAU: [39,39],
    SUNFLOWER_PLAINS: [40,129],
    DESERT_MOUNTAINS: [41,130],
    FLOWER_FOREST: [42,132],
    TAIGA_MOUNTAINS: [43,133],
    SWAMPLAND_MOUNTAINS: [44,134],
    ICE_PLAINS_SPIKES: [45,140],
    JUNGLE_MOUNTAINS: [46,149],
    JUNGLE_EDGE_MOUNTAINS: [47,151],
    COLD_TAIGA_MOUNTAINS: [48,158],
    SAVANNA_MOUNTAINS: [49,163],
    SAVANNA_PLATEAU_MOUNTAINS: [50,164],
    MESA_BRYCE: [51,165],
    MESA_PLATEAU_FOREST_MOUNTAINS: [52,166],
    MESA_PLATEAU_MOUNTAINS: [53,177],
    BIRCH_FOREST_MOUNTAINS: [54,155],
    BIRCH_FOREST_HILLS_MOUNTAINS: [55,156],
    ROOFED_FOREST_MOUNTAINS: [56,157],
    MEGA_SPRUCE_TAIGA: [57,160],
    EXTREME_HILLS_MOUNTAINS: [58,131],
    EXTREME_HILLS_PLUS_MOUNTAINS: [59,162],
    MEGA_SPRUCE_TAIGA_HILLS: [60,161]
};
var ordinals = [];
for(var i = 0; i < 61; i++) {
    for(var property in data) {
        if(data.hasOwnProperty(property)) {
            if(data[property][0] == i) {
                ordinals.push(property);
                break;
            }
        }
    }
}
var ids = {};
var biomeId = {};
var biomes = {};
for(property in data) {
    if(data.hasOwnProperty(property)) {
        ids[data[property][1].toString()] = property;
        biomes[property] = property;
        biomeId[property] = data[property][1];
    }
}
biomes.biomeId = biomeId;
biomes.ids = ids;
biomes.ordinals = ordinals;

module.exports = biomes;