var roleMassAttackTroop = {

    /** @param {Creep} creep **/
    run: function (creep) {

        //se estiver na room inimiga
        if (creep.room == Game.rooms['W7N2'] && creep.pos.x > 0 && creep.pos.y > 0 && creep.pos.x < 49 && creep.pos.y < 49) {
            //identifique a classe
            if (creep.memory.class == 'soldier') {
                //identifique torres inimigas
                var enemyTowers = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_TOWER && structure.owner.username == 'dawalishi122')
                    }
                })

                //caso exista torre inimiga
                if (enemyTowers.length > 0) {

                    //tente atacá-la e se falhar, chegue mais perto
                    if (creep.attack(enemyTowers[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(enemyTowers[0], { visualizePathStyle: { stroke: '#FF0000' } });
                    }

                    //caso não tenha torres inimigas
                } else {

                    //verifique se há creeps inimigos
                    var enemy = creep.room.find(FIND_HOSTILE_CREEPS, {
                        filter: (creepfinded) => {
                            return (creepfinded.owner.username == 'dawalishi122')
                        }
                    })

                    //se houver creeps inimigos
                    if (enemy.length > 0 && enemy[0].owner.username == 'dawalishi122') {

                        //ataque-os
                        if (creep.attack(enemy[0]) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(enemy[0], { visualizePathStyle: { stroke: '#FF0000' } });
                        }

                    }

                }
            } else if (creep.memory.class == 'healer') {
                //identifique os creeps aliados
                var myCreeps = creep.room.find(FIND_MY_CREEPS, {
                    filter: (myCreep) => {
                        return ((myCreep.name != creep.name) && (myCreep.hits < myCreep.hitsMax))
                    }
                });
                if (myCreeps.length > 0) {
                    if (creep.heal(myCreeps[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(myCreeps[0].pos)
                    }
                } else if (myCreeps.length == 0 && creep.hits < creep.hitsMax) {
                    creep.heal(creep)
                }
            }



            //caso não esteja na room inimiga    
        } else {
            //vá para a room inimiga

            creep.moveTo(new RoomPosition(33, 25, 'W7N2'))

        }
    }
};

module.exports = roleMassAttackTroop