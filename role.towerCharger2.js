var roleTowerCharger2 = {

    /** @param {Creep} creep **/
    run: function (creep) {
        var ROOM_WORK = creep.memory.roomWork;
        var ROOM_FONTE = creep.memory.roomFonte;




        /*var TOWER_FREE = new Array()
        for (controller in controllers) {
            TOWER_FREE.push(controllers[controller].room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_TOWER && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
                }
            }))
        };*/

        if (creep.memory.operacao == 'vazio') {
            if (creep.room == Game.rooms[ROOM_FONTE.name] && creep.pos.x > 0 && creep.pos.y > 0 && creep.pos.x < 49 && creep.pos.y < 49) {
                if (creep.store.getFreeCapacity() > 0) {

                    // start FindSources
                    var TARGETS_FULL = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) &&
                                structure.store[RESOURCE_ENERGY] > 0;
                        }
                    });


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
            } else {
                creep.moveTo(new RoomPosition(25, 25, ROOM_FONTE.name));
            }
        } else if (creep.memory.operacao == 'carregado') {
            if (creep.room == Game.rooms[ROOM_WORK.name] && creep.pos.x > 0 && creep.pos.y > 0 && creep.pos.x < 49 && creep.pos.y < 49) {
                var TOWER_FREE = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_TOWER) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
                });
                if (TOWER_FREE.length > 0 && creep.store.getFreeCapacity() < creep.store.getCapacity()) {
                    if (creep.transfer(TOWER_FREE[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(TOWER_FREE[0], { visualizePathStyle: { stroke: '#ffffff' } });
                    }
                } else if (TOWER_FREE.length == 0 && creep.store.getFreeCapacity() < creep.store.getCapacity()) {
                    creep.moveTo(27, 20)
                } else if (creep.store.getFreeCapacity() == creep.store.getCapacity()) {
                    creep.memory.operacao = 'vazio'
                }
            } else {
                creep.moveTo(new RoomPosition(25, 25, ROOM_WORK.name));
            }
        }
    }
};

module.exports = roleTowerCharger2;