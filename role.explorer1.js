var roleExplorer1 = {

    /** @param {Creep} creep **/
    run: function (creep) {
        var SOURCES_FULL = creep.room.find(FIND_SOURCES, {
            filter: (source) => {
                return source.energy > 0;
            }
        });

        if (creep.memory.operacao == 'vazio') {
            if (creep.room == Game.rooms['W8N2'] && creep.pos.x > 0 && creep.pos.y > 0 && creep.pos.x < 49 && creep.pos.y < 49) {
                if (creep.store.getFreeCapacity() > 0) {
                    if (SOURCES_FULL.length > 0) {
                        if (creep.harvest(SOURCES_FULL[0]) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(SOURCES_FULL[0], { visualizePathStyle: { stroke: '#ffaa00' } })
                        }
                    }
                } else if (creep.store.getFreeCapacity() == 0) {
                    creep.memory.operacao = 'carregado'
                    creep.memory.indoPara = undefined
                }
            } else if (creep.room != Game.rooms['W8N2'] || creep.pos.y <= 0) {
                creep.moveTo(new RoomPosition(25, 25, 'W8N2'))
            }
        } else if (creep.memory.operacao == 'carregado') {
            if (creep.room == Game.rooms['W8N3'] && creep.pos.x > 0 && creep.pos.y > 0 && creep.pos.x < 49 && creep.pos.y < 49) {
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
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
                            return (structure.structureType == STRUCTURE_STORAGE) &&
                                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                        }
                    })
                    if (creep.transfer(targets2[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets2[0], { visualizePathStyle: { stroke: '#ffffff' } });
                    }
                } else if (creep.store.getFreeCapacity() == creep.store.getCapacity()) {
                    creep.memory.operacao = 'vazio'
                }
            } else if (creep.room != Game.rooms['W8N3'] || creep.pos.y >= 49) {
                creep.moveTo(new RoomPosition(15, 21, 'W8N3'))
            }
        }
    }
};

module.exports = roleExplorer1;