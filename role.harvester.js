var roleHarvester = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.store.getFreeCapacity() > 0) {
            var sources = creep.room.find(FIND_SOURCES);
            const randomNumber = Math.floor(Math.random() * sources.length);
            if (creep.harvest(sources[randomNumber]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[randomNumber], { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if (targets.length > 0) {
                if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
                }
            } else if (targets.length == 0) {
                creep.moveTo(15, 21, 'W2N9')
            }
        }
    }
};

module.exports = roleHarvester;