var roleUpgrader2 = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.room == creep.memory.workRoom && creep.pos.x > 0 && creep.pos.y > 0 && creep.pos.x < 49 && creep.pos.y < 49) {
            if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
                creep.memory.upgrading = false;
                creep.say('🔄 harvest');
            }
            if (!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
                creep.memory.upgrading = true;
                creep.say('⚡ upgrade');
            }

            if (creep.memory.upgrading) {
                if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
            else {
                var source = creep.pos.findClosestByRange(FIND_SOURCES);
                if (source.energy > 0) {
                    if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
                    }
                }
            }
        } else {
            creep.moveTo(new RoomPosition(25, 25, creep.memory.workRoom.name))
        }
    }
}

module.exports = roleUpgrader2;