var roleTowerCharger = {

    /** @param {Creep} creep **/
    run: function (creep) {

        var TARGETS_FULL = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        var TOWER_FREE = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_TOWER) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });

        if (creep.memory.operacao == 'vazio') {
            if (creep.store.getFreeCapacity() > 0) {

                // start FindSources
                const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
                if (target) {
                    if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                } else {
                    if (creep.withdraw(TARGETS_FULL[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(TARGETS_FULL[0], { visualizePathStyle: { stroke: '#ffffff' } });
                    }
                }
                // end FindSources


            } else if (creep.store.getFreeCapacity() == 0) {
                creep.memory.operacao = 'carregado'
            }
        } else if (creep.memory.operacao == 'carregado') {
            if (TOWER_FREE.length > 0 && creep.store.getFreeCapacity() < creep.store.getCapacity()) {
                if (creep.transfer(TOWER_FREE[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(TOWER_FREE[0], { visualizePathStyle: { stroke: '#ffffff' } });
                }
            } else if (TOWER_FREE.length == 0 && creep.store.getFreeCapacity() < creep.store.getCapacity()) {
                creep.moveTo(27, 20)
            } else if (creep.store.getFreeCapacity() == creep.store.getCapacity()) {
                creep.memory.operacao = 'vazio'
            }
        }
    }
};

module.exports = roleTowerCharger;