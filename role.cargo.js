var roleCargo = {

    /** @param {Creep} creep **/
    run: function (creep) {

        if (creep.memory.operacao == 'vazio') {
            if (creep.store.getFreeCapacity() > 0) {
                const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
                if (target) {
                    if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                } else {
                    var targets = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_CONTAINER) &&
                                structure.store[RESOURCE_ENERGY] > 0;
                        }
                    });
                    if (targets.length > 0 && creep.store.getFreeCapacity() > 0) {
                        if (creep.withdraw(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
                        }
                    }
                }
            } else if (creep.store.getFreeCapacity() == 0) {
                creep.memory.operacao = 'carregado'
            }
        } else if (creep.memory.operacao == 'carregado') {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_TOWER) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if (targets.length > 0 && creep.store.getFreeCapacity() < creep.store.getCapacity()) {
                if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
                }
            } else if (targets.length == 0 && creep.store.getFreeCapacity() < creep.store.getCapacity()) {
                var targets2 = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
                })
                if (creep.transfer(targets2[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets2[0], { visualizePathStyle: { stroke: '#ffffff' } });
                }
            } else if (creep.store.getFreeCapacity() == creep.store.getCapacity()) {
                creep.memory.operacao = 'vazio'
            }
        }
    }
};


module.exports = roleCargo;