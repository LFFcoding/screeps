var roleIdleTroop = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.memory.class == 'soldier') {
            creep.moveTo(34, 45)
        } else if (creep.memory.class == 'healer') {
            creep.moveTo(34, 44)
        }
    }
};

module.exports = roleIdleTroop