var roleBuilder = {

    /** @param {Creep} creep **/
    run: function (creep) {

        var STORAGES_FULL = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_CONTAINER) && (structure.store[RESOURCE_ENERGY] > 0);
            }
        });



        if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('🔄 Collect');
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
                } else if (creep.store.getFreeCapacity() == creep.store.getCapacity()) {
                    console.log(creep.name + ', meu trabalho acabou...')
                    creep.suicide()
                }
            }
        } else {
            if (STORAGES_FULL.length > 0 && creep.store.getFreeCapacity() > 0) {
                if (creep.withdraw(STORAGES_FULL[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(STORAGES_FULL[0], { visualizePathStyle: { stroke: '#ffffff' } });
                }
            } else if (STORAGES_FULL.length == 0) {
                var target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
                if (target) {
                    if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                }
            }
        }
    }
};

module.exports = roleBuilder;