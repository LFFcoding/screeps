var roleDefender = {

    /** @param {Creep} creep **/
    run: function (creep) {

        var enemy = creep.room.find(FIND_HOSTILE_CREEPS);
        if (enemy.length > 0) {
            creep.memory.operacao = 'ativo'
            creep.memory.atacandoDesde = Game.time
        }

        if (creep.memory.atacandoDesde) {
            var atacandoHa = (Game.time - creep.memory.atacandoDesde)
            if (enemy.length == 0 && atacandoHa > 100) {
                creep.memory.operacao = 'idle'
                creep.memory.atacandoDesde = undefined
            }
            console.log('Atacando há ' + atacandoHa + ' ticks')
        }








        if (creep.memory.operacao == 'ativo') {
            if (enemy.length > 0) {
                creep.say('atacaar!', true);
                Memory.ultimoAlvo = ('último alvo foi o ' + enemy[0].name + ' do ' + enemy[0].owner.username + ' às ' + Game.time)
                if (creep.attack(enemy[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(enemy[0], { visualizePathStyle: { stroke: '#FF0000' } });
                }
            }
        }
        if (creep.memory.operacao == 'idle') {
            creep.moveTo(new RoomPosition(25, 25, creep.memory.putRoom.name));
        }
    }
};

module.exports = roleDefender;