var roleCargo = {

    /** @param {Creep} creep **/
    run: function (creep) {
        /*
        creep.memory = {
            role: 'cargo',
            operação: 'vazio/carregado',
            workRoom: RoomObject
        }
        */

        function takeResourceFromClosestTombstoneFull() {
            let t = creep.pos.findClosestByRange(FIND_TOMBSTONES, {
                filter: (structure) => {
                    return (structure.store[RESOURCE_ENERGY] > 0);
                }
            });
            if (t !== null) {
                creep.room.visual.text(
                    "Take",
                    creep.pos.x + 1,
                    creep.pos.y,
                    { align: 'left', opacity: 0.8 }
                );
                if (creep.withdraw(t, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(t, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            } else {
            };
        };

        function takeClosestResourcesOnGround() {
            let t = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
            if (t !== null) {
                creep.room.visual.text(
                    "Take",
                    creep.pos.x + 1,
                    creep.pos.y,
                    { align: 'left', opacity: 0.8 }
                );
                if (creep.pickup(t) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(t, { visualizePathStyle: { stroke: '#ffffff' } });
                };
            } else {
            }
        };

        function takeResourcesFromClosestStorageFull() {
            let t = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) && (structure.store[RESOURCE_ENERGY] > 0);
                }
            });
            if (t !== null) {
                creep.room.visual.text(
                    "Take",
                    creep.pos.x + 1,
                    creep.pos.y,
                    { align: 'left', opacity: 0.8 }
                );
                if (creep.withdraw(t, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(t, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            } else {
            };
        };

        function putResourcesOnClosestTargetFree() {
            let t = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if (t !== null) {
                creep.room.visual.text(
                    "Put",
                    creep.pos.x + 1,
                    creep.pos.y,
                    { align: 'left', opacity: 0.8 }
                );
                if (creep.transfer(t, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(t, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            } else {
            };
        };

        function putResourcesOnClosestStorageFree() {
            let t = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_STORAGE) && (structure.store.getFreeCapacity() > 0);
                }
            });
            if (t !== null) {
                creep.room.visual.text(
                    "Put",
                    creep.pos.x + 1,
                    creep.pos.y,
                    { align: 'left', opacity: 0.8 }
                );
                if (creep.transfer(t, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(t, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            } else {
            };
        }





        if (creep.room == Game.rooms[creep.memory.workRoom.name] && creep.pos.x > 0 && creep.pos.y > 0 && creep.pos.x < 49 && creep.pos.y < 49) {

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
                        takeResourceFromClosestTombstoneFull();
                    } else if (ENERGY_ON_GROUND.length > 0) {
                        takeClosestResourcesOnGround();
                    } else if ((TARGETS_FREE.length > 0 && STORAGES_FULL.length > 0) && ENERGY_ON_GROUND.length == 0) {
                        if (creep.store.getFreeCapacity() > 0) {
                            takeResourcesFromClosestStorageFull();
                        }
                    }
                } else if (creep.store.getFreeCapacity() == 0) {
                    creep.memory.operacao = 'carregado'
                }
            } else if (creep.memory.operacao == 'carregado') {
                if (TARGETS_FREE.length > 0 && creep.store.getFreeCapacity() < creep.store.getCapacity()) {
                    putResourcesOnClosestTargetFree();
                } else if ((TARGETS_FREE.length == 0 && creep.store.getFreeCapacity() < creep.store.getCapacity()) && STORAGES_FREE.length > 0) {
                    putResourcesOnClosestStorageFree();
                } else if (creep.store.getFreeCapacity() == creep.store.getCapacity()) {
                    creep.memory.operacao = 'vazio'
                }
            }
        } else if (creep.room != creep.memory.workRoom) {
            creep.moveTo(new RoomPosition(33, 25, creep.memory.workRoom.name));
        }
    }
};


module.exports = roleCargo;