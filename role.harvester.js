const creepsFunctions = require('creepsFunctions');
const roleHarvester = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.room.name == creep.memory.takeRoom.name && creep.pos.x > 0 && creep.pos.y > 0 && creep.pos.x < 49 && creep.pos.y < 49) {
            creepsFunctions.takeResourcesFromClosestSourceFull(creep);
        } else {
            creep.moveTo(new RoomPosition(33, 25, creep.memory.takeRoom.name));
        }
    }
};


module.exports = roleHarvester;