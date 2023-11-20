var roleUpgrader = require('role.upgrader');
var roleHarvester = require('role.harvester');
var roleBuilder = require('role.builder');
var roleTowerCharger = require('role.towerCharger');
var roleExplorer1 = require('role.explorer1');
var roleExplorer2 = require('role.explorer2');
var roleDefender = require('role.defender');
var roleIdleTroop = require('role.idleTroop');
var roleMassAttackTroop = require('role.massAttackTroop');
var roleCargo = require('role.cargo');

module.exports.loop = function () {
    console.log('############################################################################################')
    const MIN_TROOP = 0;
    const MIN_DEFENDER = 2;
    const MIN_CARGO = 3;
    const MIN_HARVESTER = 2;
    const MIN_UPGRADER = Memory.minUpgraders;
    const MIN_BUILDER = 2;
    const MIN_EXPLORER1 = 10;

    var MAIN_STORAGE = Game.rooms['W8N3'].find(FIND_MY_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_STORAGE);
        }
    });
    var MAIN_STORAGE_ENERGY = MAIN_STORAGE[0].store.energy;
    console.log('Energia armazenada: ' + MAIN_STORAGE_ENERGY);
    if (MAIN_STORAGE_ENERGY > 100000) {
        Memory.minUpgraders = 5
    } else if (MAIN_STORAGE_ENERGY < 50000) {
        Memory.minUpgraders = 3
    }

    var cargos = _.filter(Game.creeps, (creep) => creep.memory.role == 'cargo');
    console.log('cargos: ' + cargos.length);

    //verifique quantos idleTroops existem
    var idleTroops = _.filter(Game.creeps, (creep) => creep.memory.role == 'idleTroop');
    console.log('idleTroops: ' + idleTroops.length);


    // start modulo das torres
    var hostiles = Game.spawns['Spawn1'].room.find(FIND_CREEPS, {
        filter: (creepfinded) => {
            return (creepfinded.owner.username == 'dawalishi122')
        }
    })
    //dawalishi122

    var towers = Game.rooms['W8N3'].find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_TOWER)
        }
    });
    var closestDamagedStructure = towers[0].pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => structure.hits < structure.hitsMax
    });
    if (closestDamagedStructure) {
        for (var i in towers) {
            towers[i].repair(closestDamagedStructure)
        }
    }
    if (hostiles.length > 0) {
        for (var i in towers) {
            towers[i].attack(hostiles[0])
        }
    }
    // end modulo das torres

    //log da energia disponível
    console.log('Energia disponível: ' + Game.rooms['W8N3'].energyAvailable);

    for (var i in Memory.creeps) {
        if (!Game.creeps[i]) {
            delete Memory.creeps[i];
            console.log('Memory cleaned.')
        }
    };

    //verifica e loga quantos harvesters existem
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    console.log('Harvesters: ' + harvesters.length);

    var defenders = _.filter(Game.creeps, (creep) => creep.memory.role == 'defender');
    console.log('Defenders: ' + defenders.length)
    if (defenders.length < MIN_DEFENDER && Game.rooms['W8N3'].energyAvailable >= 790) {
        var newName = 'defender' + Game.time;
        console.log('Spawning new defender: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, TOUGH, MOVE, TOUGH, MOVE, TOUGH, MOVE, TOUGH, MOVE, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK], newName,
            {
                memory: {
                    role: 'defender',
                    operacao: 'idle'
                }
            }
        )
    };

    //Verifica se tem harvesters suficientes e ativa produção de builders e upgraders
    var popOfHarvestersIsOk
    if (harvesters.length >= MIN_HARVESTER) {
        popOfHarvestersIsOk = true
        console.log('Harvesters pop is Ok.')
    } else if (harvesters.length < MIN_HARVESTER) {
        popOfHarvestersIsOk = false
        console.log('Harvesters pop is not OK!!!')
    };

    var popOfDefendersIsOk
    if (defenders.length >= MIN_DEFENDER) {
        popOfDefendersIsOk = true
        console.log('Defenders pop is Ok.')
    } else if (defenders.length < MIN_DEFENDER) {
        popOfDefendersIsOk = false
        console.log('Defenders pop is not OK!!!')
    };

    var popOfCargoIsOk
    if (cargos.length >= MIN_CARGO) {
        popOfCargoIsOk = true
        console.log('Cargos pop is Ok.')
    } else if (cargos.length < MIN_CARGO) {
        popOfCargoIsOk = false
        console.log('Cargos pop is not OK!!!')
    };





    if (popOfHarvestersIsOk == true && popOfCargoIsOk == true) {

        //se houver menos idleTroopers que o necessário e houver energia suficiente para spawnar
        if (popOfDefendersIsOk == true) {
            if (idleTroops.length < MIN_TROOP) {
                //verifique quantos idleTroopsSoldier existem
                var soldiers = _.filter(Game.creeps, (creep) => (creep.memory.role == 'idleTroop' && creep.memory.class == 'soldier'));
                if (soldiers.length < 1 && Game.rooms['W8N3'].energyAvailable >= 1300) {

                    //spawne um idleTroop
                    var newName = 'Troop_Soldier_' + Game.time;
                    console.log('Spawning new Troop: ' + newName);
                    Game.spawns['Spawn1'].spawnCreep([TOUGH, MOVE, TOUGH, MOVE, TOUGH, MOVE, TOUGH, MOVE, TOUGH, MOVE, TOUGH, MOVE, TOUGH, MOVE, TOUGH, MOVE, TOUGH, MOVE, TOUGH, MOVE, TOUGH, MOVE, TOUGH, MOVE, TOUGH, MOVE, TOUGH, MOVE, TOUGH, MOVE, TOUGH, MOVE, TOUGH, MOVE, TOUGH, MOVE, TOUGH, MOVE, MOVE, ATTACK], newName,
                        {
                            memory: {
                                role: 'idleTroop',
                                class: 'soldier'
                            }
                        });
                }

                //verifique se os soldiers estão prontos e faça os healers
                if (soldiers.length == 1) {
                    var healers = _.filter(Game.creeps, (creep) => (creep.memory.role == 'idleTroop' && creep.memory.class == 'healer'));
                    if (healers.length < 3 && Game.rooms['W8N3'].energyAvailable >= 930) {

                        //spawne um idleTroop
                        var newName = 'Troop_Healer_' + Game.time;
                        console.log('Spawning new Troop: ' + newName);
                        Game.spawns['Spawn1'].spawnCreep([TOUGH, HEAL, MOVE, TOUGH, HEAL, MOVE, TOUGH, HEAL, MOVE], newName,
                            {
                                memory: {
                                    role: 'idleTroop',
                                    class: 'healer'
                                }
                            });
                    }
                }
            }
        }

        //auto renew creeps
        /*for (var i in Game.creeps) {
            if (Game.creeps[i].ticksToLive < 500) {
                Game.spawns['Spawn1'].renewCreep(Game.creeps[i])
                console.log('Creep reformado: ' + Game.creeps[i].name + 'tempo de vida: ' + Game.creeps[i].ticksToLive)
            }
        }*/
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        console.log('upgraders: ' + upgraders.length);

        if (upgraders.length < MIN_UPGRADER && Game.rooms['W8N3'].energyAvailable >= 1250) {
            var newName = 'upgrader' + Game.time;
            console.log('Spawning new upgrader: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE, MOVE], newName,
                { memory: { role: 'upgrader' } });
        }

        var towerChargers = _.filter(Game.creeps, (creep) => creep.memory.role == 'towerCharger');
        console.log('towerChargers: ' + towerChargers.length);

        if (towerChargers.length < 1 && Game.rooms['W8N3'].energyAvailable >= 600) {
            var newName = 'towerCharger' + Game.time;
            console.log('Spawning new towerCharger: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], newName,
                {
                    memory: {
                        role: 'towerCharger',
                        operacao: 'vazio'
                    }
                });
        }

        for (var creep in Game.creeps) {
            var constructions = Game.creeps[creep].room.find(FIND_CONSTRUCTION_SITES).length
        }

        if (constructions > 0) {
            var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
            if (builders.length < MIN_BUILDER) {
                console.log('Precisamos de mais construtores!')
                console.log('builders: ' + builders.length)
            }

            if (builders.length < MIN_BUILDER && Game.rooms['W8N3'].energyAvailable >= 1250) {
                var newName = 'builder' + Game.time;
                console.log('Spawning new builder: ' + newName);
                Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE, MOVE], newName,
                    { memory: { role: 'builder' } });
            }
        } else if (constructions == 0) {
            for (var creep in Game.creeps) {
                if (Game.creeps[creep].memory.role == 'builder') {
                    Game.creeps[creep].suicide()
                }
            }
        }

        var explorer1s = _.filter(Game.creeps, (creep) => creep.memory.role == 'explorer1');
        console.log('explorer1s: ' + explorer1s.length);

        if (explorer1s.length < MIN_EXPLORER1 && Game.rooms['W8N3'].energyAvailable >= 1250) {
            var newName = 'explorer1_' + Game.time;
            console.log('Spawning new explorer1: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE, MOVE], newName,
                {
                    memory: {
                        role: 'explorer1',
                        operacao: 'vazio'
                    }
                });
        }

        //verifica o explorers2 e spawna se precisar
        /*var explorer2s = _.filter(Game.creeps, (creep) => creep.memory.role == 'explorer2');
        console.log('explorer2s: ' + explorer2s.length);

        if (explorer2s.length < 10 && Game.rooms['W8N3'].energyAvailable >= 800) {
            var newName = 'explorer2_' + Game.time;
            console.log('Spawning new explorer2: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], newName,
                {
                    memory: {
                        role: 'explorer2',
                        operacao: 'vazio'
                    }
                });
        }*/
    }

    //spawn harvesters automaticamente
    if (harvesters.length < MIN_HARVESTER && Game.rooms['W8N3'].energyAvailable >= 1250) {
        var newName = 'Harvester' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE], newName,
            {
                memory: {
                    role: 'harvester',
                    operacao: 'vazio'
                }
            }
        );
    }

    if (cargos.length < MIN_CARGO && Game.rooms['W8N3'].energyAvailable >= 1000) {
        var newName = 'cargo' + Game.time;
        console.log('Spawning new cargos: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], newName,
            {
                memory: {
                    role: 'cargo',
                    operacao: 'vazio'
                }
            }
        );
    }



    //Spawn mostra qual unidade está spawnando
    if (Game.spawns['Spawn1'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            { align: 'left', opacity: 0.8 });
    }

    //seta as funções dos creeps de acordo com a role
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role == 'cargo') {
            roleCargo.run(creep);
        }
        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role == 'mechanic') {
            roleMechanic.run(creep);
        }
        if (creep.memory.role == 'towerCharger') {
            roleTowerCharger.run(creep);
        }
        if (creep.memory.role == 'explorer1') {
            roleExplorer1.run(creep);
        }
        if (creep.memory.role == 'explorer2') {
            roleExplorer2.run(creep);
        }
        if (creep.memory.role == 'defender') {
            roleDefender.run(creep);
        }
        if (creep.memory.role == 'idleTroop') {
            roleIdleTroop.run(creep);
        }
        if (creep.memory.role == 'idleTroop' && (idleTroops.length >= MIN_TROOP)) {
            creep.memory.role = 'massAttackTroop'
            roleMassAttackTroop.run(creep);
        }
        if (creep.memory.role == 'massAttackTroop') {
            roleMassAttackTroop.run(creep);
        }
    }
}