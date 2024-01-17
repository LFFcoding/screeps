var roleCargo = {

    /** @param {Creep} creep **/
    run: function (creep) {
        console.log('Localização: room: ', creep.room, ' x: ', creep.pos.x, ' y: ', creep.pos.y);
        console.log('Room alvo: ', creep.memory.workRoom.name);
        if (creep.room == Game.rooms[creep.memory.workRoom.name] && creep.pos.x > 0 && creep.pos.y > 0 && creep.pos.x < 49 && creep.pos.y < 49) {
            console.log("Estou na room: ", creep.memory.workRoom.name, ", bora trabalhar!");

            var TARGETS_FREE = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            var STORAGES_FULL = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) && (structure.store[RESOURCE_ENERGY] > 0);
                }
            });
            var STORAGES_FREE = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_STORAGE) && (structure.store.getFreeCapacity() > 0);
                }
            });
            var TOMBS_FULL = creep.room.find(FIND_TOMBSTONES, {
                filter: (structure) => {
                    return (structure.store[RESOURCE_ENERGY] > 0);
                }
            });
            var ENERGY_ON_GROUND = creep.room.find(FIND_DROPPED_RESOURCES);

            if (creep.memory.operacao == 'vazio') {
                if (creep.store.getFreeCapacity() > 0) {
                    if (TOMBS_FULL.length > 0) {
                        console.log(creep.name + ': TOMBSTONE LOCALIZADA, INDO LIMPAR!')
                        if (creep.withdraw(TOMBS_FULL[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(TOMBS_FULL[0], { visualizePathStyle: { stroke: '#ffffff' } });
                        }
                    } else if (ENERGY_ON_GROUND.length > 0) {
                        if (creep.pickup(ENERGY_ON_GROUND[0]) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(ENERGY_ON_GROUND[0]);
                        }
                    } else if ((TARGETS_FREE.length > 0 && STORAGES_FULL.length > 0) && ENERGY_ON_GROUND.length == 0) {
                        if (creep.store.getFreeCapacity() > 0) {
                            if (creep.withdraw(STORAGES_FULL[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(STORAGES_FULL[0], { visualizePathStyle: { stroke: '#ffffff' } });
                            }
                        }
                    }
                } else if (creep.store.getFreeCapacity() == 0) {
                    creep.memory.operacao = 'carregado'
                }
            } else if (creep.memory.operacao == 'carregado') {
                if (TARGETS_FREE.length > 0 && creep.store.getFreeCapacity() < creep.store.getCapacity()) {
                    if (creep.transfer(TARGETS_FREE[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(TARGETS_FREE[0], { visualizePathStyle: { stroke: '#ffffff' } });
                    }
                } else if (TARGETS_FREE.length == 0 && creep.store.getFreeCapacity() < creep.store.getCapacity()) {
                    if (creep.transfer(STORAGES_FREE[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(STORAGES_FREE[0], { visualizePathStyle: { stroke: '#ffffff' } });
                    }
                } else if (creep.store.getFreeCapacity() == creep.store.getCapacity()) {
                    creep.memory.operacao = 'vazio'
                }
            }
        } else if (creep.room != creep.memory.workRoom) {
            console.log("room atual: ", creep.room.name);
            console.log("indo para minha room: ", creep.memory.workRoom.name);
            creep.moveTo(new RoomPosition(33, 25, creep.memory.workRoom.name));
        }
    }
};


module.exports = roleCargo;