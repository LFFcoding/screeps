var roleMassAttackTroop = {

    /** @param {Creep} creep **/
    run: function (creep) {

        //se estiver na room inimiga
        if (creep.room == Game.rooms['W7N1'] && creep.pos.x > 0 && creep.pos.y > 0 && creep.pos.x < 49 && creep.pos.y < 49) {
            console.log('dentro da sala alvo');
            //identifique a classe
            if (creep.memory.class == 'soldier') {
                //verifique se há creeps inimigos
                var enemy = creep.room.find(FIND_HOSTILE_CREEPS);
                var enemyTowers = creep.room.find(FIND_HOSTILE_STRUCTURES);
                FIND_HOSTILE_CONSTRUCTION_SITES
                //caso exista creeps inimigos
                if (enemy.length > 0) {
                    let etg = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                    //ataque-os
                    if (creep.attack(etg) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(etg, { visualizePathStyle: { stroke: '#FF0000' } });
                    }
                } else if (enemyTowers.length > 0) {
                    ttg = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES);

                    //tente atacá-la e se falhar, chegue mais perto
                    if (creep.attack(ttg) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(ttg, { visualizePathStyle: { stroke: '#FF0000' } });
                    };

                } else {
                    cstg = creep.pos.findClosestByRange(FIND_HOSTILE_CONSTRUCTION_SITES);
                    console.log('alvo', cstg);

                    //tente atacá-la e se falhar, chegue mais perto
                    if (creep.attack(cstg) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(cstg, { visualizePathStyle: { stroke: '#FF0000' } });
                    };


                };
               /* var enemyTowers = creep.room.find(FIND_STRUCTURES, {
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

                }*/
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
                    };
                } else if (myCreeps.length == 0 && creep.hits < creep.hitsMax) {
                    creep.heal(creep)
                };
            };



            //caso não esteja na room inimiga    
        } else {
            //vá para a room inimiga

            creep.moveTo(new RoomPosition(32, 33, 'W7N1'));

        };
    }
};

module.exports = roleMassAttackTroop