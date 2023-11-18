var roleMechanic = {

    /** @param {Creep} creep **/
    run: function (creep) {
        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: object => object.hits < object.hitsMax
        });

        targets.sort((a, b) => a.hits - b.hits);

        if (targets.length > 0) {
            if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0]);
            }
        }
        if (creep.store.getFreeCapacity() > 0) {
            var sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }

    }
};

module.exports = roleMechanic;