var roleIdleTroop = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.memory.class == 'soldier') {
            creep.moveTo(new RoomPosition(40, 10, 'W8N2'));
        } else if (creep.memory.class == 'healer') {
            creep.moveTo(new RoomPosition(40, 10, 'W8N2'));
        };
    }
};

module.exports = roleIdleTroop