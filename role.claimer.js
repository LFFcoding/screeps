var roleClaimer = {

    /** @param {Creep} creep **/
    run: function (creep) {
        var ROOM_CONTROLLER = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTROLLER);
            }
        });


        if (creep.room == Game.rooms['W7N2'] && creep.pos.x > 0 && creep.pos.y > 0 && creep.pos.x < 49 && creep.pos.y < 49) {
            if (ROOM_CONTROLLER.length > 0) {
                if (creep.attackController(ROOM_CONTROLLER[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(ROOM_CONTROLLER[0], { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
        } else if (creep.room != Game.rooms['W7N1'] || creep.pos.y <= 0) {
            creep.moveTo(new RoomPosition(25, 25, 'W7N2'))
        }
    }
}


module.exports = roleClaimer;