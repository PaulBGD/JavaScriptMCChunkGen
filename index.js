if (process.env.NODE_ENV !== 'production'){
    Error.stackTraceLimit = 20;
}

var DefaultChunkGen = require('./src/generator/DefaultChunkGen');

var chunkGen = new DefaultChunkGen();
chunkGen.generate("myseed", 0, 0);
