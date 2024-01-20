var roleClaimer = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.room.name == 'W7N1' && creep.pos.x > 0 && creep.pos.y > 0 && creep.pos.x < 49 && creep.pos.y < 49) {
            console.log('1estou na: ', creep.room.name, ' x: ', creep.pos.x, ' y: ', creep.pos.y, ' deveria estar na: ', 'W7N1');
            var ROOM_CONTROLLER = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTROLLER);
                }
            });
            if (ROOM_CONTROLLER) {
                if (creep.claimController(ROOM_CONTROLLER) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(ROOM_CONTROLLER, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
        } else {
            console.log('2estou na: ', creep.room.name, ' x: ', creep.pos.x, ' y: ', creep.pos.y, ' deveria estar na: ', Game.rooms['W7N1']);
            creep.moveTo(new RoomPosition(39, 3, 'W7N1'));
        };
    }
};


module.exports = roleClaimer;