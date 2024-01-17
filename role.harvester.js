var roleHarvester = {

    /** @param {Creep} creep **/
    run: function (creep) {

        function takeResourcesFromClosestSourceFull() {
            let t = creep.pos.findClosestByRange(FIND_SOURCES, {
                filter: (structure) => {
                    return (structure.energy > 0);
                }
            });
            if (t !== null) {
                creep.room.visual.text(
                    "Mine",
                    creep.pos.x + 1,
                    creep.pos.y,
                    { align: 'left', opacity: 0.8 }
                );
                if (creep.harvest(t, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(t, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            } else {
                creep.room.visual.text(
                    "Sources empty",
                    creep.pos.x + 1,
                    creep.pos.y,
                    { align: 'left', opacity: 0.8 }
                );
            };
        };

        if (creep.room == Game.rooms[creep.memory.workRoom.name] && creep.pos.x > 0 && creep.pos.y > 0 && creep.pos.x < 49 && creep.pos.y < 49) {
            takeResourcesFromClosestSourceFull();
        } else if (creep.room != creep.memory.workRoom) {
            creep.moveTo(new RoomPosition(33, 25, creep.memory.workRoom.name));
        }
    }
};


module.exports = roleHarvester;