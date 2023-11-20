var roleHarvester = {

    /** @param {Creep} creep **/
    run: function (creep) {
        var sources = creep.room.find(FIND_SOURCES);


        if (creep.memory.indoPara) {
            if (sources[creep.memory.indoPara].energy > 0) {
                if (creep.harvest(sources[creep.memory.indoPara]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[creep.memory.indoPara], { visualizePathStyle: { stroke: '#ffaa00' } });
                }
            }
        }
        if (sources[0].energy > 0) {
            if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.memory.indoPara = 0
                creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } })
            }
        } else if (sources.length > 1 && sources[1].energy > 0) {
            if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                creep.memory.indoPara = 1
                creep.moveTo(sources[1], { visualizePathStyle: { stroke: '#ffaa00' } })
            }
        }
    }
};


module.exports = roleHarvester;