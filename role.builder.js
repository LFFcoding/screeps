var roleBuilder = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }

        if (creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (targets.length > 0) {
                if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
                }
            } else if (targets.length == 0) {
                if (creep.store.getFreeCapacity() < creep.store.getCapacity()) {
                    var targets2 = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                        }
                    });
                    if (targets2.length > 0) {
                        if (creep.transfer(targets2[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(targets2[0], { visualizePathStyle: { stroke: '#ffffff' } });
                        }
                    }
                } else {
                    console.log(creep.name + ', meu trabalho acabou...')
                    creep.suicide()
                }
            }
        }
        else {
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
            } else if (sources.length > 2 && sources[2].energy > 0) {
                if (creep.harvest(sources[2]) == ERR_NOT_IN_RANGE) {
                    creep.memory.indoPara = 2
                    creep.moveTo(sources[2], { visualizePathStyle: { stroke: '#ffaa00' } })
                }
            }
        }
    }
};

module.exports = roleBuilder;