var roleExplorer2 = {

    /** @param {Creep} creep **/
    run: function (creep) {

        if (creep.memory.operacao == 'vazio') {
            if (creep.room == Game.rooms['W8N2'] && creep.pos.y > 0) {
                if (creep.store.getFreeCapacity() > 0) {
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
                } else if (creep.store.getFreeCapacity() == 0) {
                    creep.memory.operacao = 'carregado'
                    creep.memory.indoPara = undefined
                }
            } else if (creep.room != Game.rooms['W8N2'] || creep.pos.y <= 0) {
                creep.moveTo(new RoomPosition(25, 25, 'W8N2'))
            }
        } else if (creep.memory.operacao == 'carregado') {
            if (creep.room == Game.rooms['W8N3'] && creep.pos.y < 49) {
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
                    creep.moveTo(new RoomPosition(27, 17, 'W8N3'))
                } else if (creep.store.getFreeCapacity() == creep.store.getCapacity()) {
                    creep.memory.operacao = 'vazio'
                }
            } else if (creep.room != Game.rooms['W8N3'] || creep.pos.y >= 49) {
                creep.moveTo(new RoomPosition(15, 21, 'W8N3'))
            }
        }
    }
};

module.exports = roleExplorer2;