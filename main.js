var roleUpgrader = require('role.upgrader');
var roleHarvester = require('role.harvester');
var roleBuilder = require('role.builder');
var roleTowerCharger = require('role.towerCharger');
var roleExplorer1 = require('role.explorer1');
var roleExplorer2 = require('role.explorer2');
var roleDefender = require('role.defender');

module.exports.loop = function () {

    var hostiles = Game.spawns['Spawn1'].room.find(FIND_CREEPS, {
        filter: (creepfinded) => {
            return (creepfinded.owner.username == 'dawalishi122')
        }
    })
    if (hostiles.length > 0) {
        console.log(hostiles[0].owner.username)
    }
    //dawalishi122

    /*var tower = Game.getObjectById('6558cf5123a0d3353c7044a4');
    var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => structure.hits < structure.hitsMax
    });
    if (closestDamagedStructure) {
        tower.repair(closestDamagedStructure)
    }*/


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
    if (defenders.length < 5 && Game.rooms['W8N3'].energyAvailable >= 550) {
        var newName = 'defender' + Game.time;
        console.log('Spawning new defender: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH], newName,
            {
                memory: {
                    role: 'defender',
                    operacao: 'idle'
                }
            }
        );
    }



    //Verifica se tem harvesters suficientes e ativa produção de builders e upgraders
    var popOfHarvestersIsOk
    if (harvesters.length >= 5) {
        popOfHarvestersIsOk = true
        console.log('Harvesters pop is Ok.')
    } else if (harvesters.length < 5) {
        popOfHarvestersIsOk = false
        console.log('Harvesters pop is not OK!!!')
    }

    if (popOfHarvestersIsOk == true) {
        //auto renew creeps
        /*for (var i in Game.creeps) {
            if (Game.creeps[i].ticksToLive < 500) {
                Game.spawns['Spawn1'].renewCreep(Game.creeps[i])
                console.log('Creep reformado: ' + Game.creeps[i].name + 'tempo de vida: ' + Game.creeps[i].ticksToLive)
            }
        }*/
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        console.log('upgraders: ' + upgraders.length);

        if (upgraders.length < 10 && Game.rooms['W8N3'].energyAvailable >= 550) {
            var newName = 'upgrader' + Game.time;
            console.log('Spawning new upgrader: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], newName,
                { memory: { role: 'upgrader' } });
        }

        var towerChargers = _.filter(Game.creeps, (creep) => creep.memory.role == 'towerCharger');
        console.log('towerChargers: ' + towerChargers.length);

        if (towerChargers.length < 1 && Game.rooms['W8N3'].energyAvailable >= 800) {
            var newName = 'towerCharger' + Game.time;
            console.log('Spawning new towerCharger: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], newName,
                { memory: { role: 'towerCharger' } });
        }

        for (var creep in Game.creeps) {
            var constructions = Game.creeps[creep].room.find(FIND_CONSTRUCTION_SITES).length
        }

        if (constructions > 0) {
            var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
            if (builders.length < 5) {
                console.log('Precisamos de mais construtores!')
                console.log('builders: ' + builders.length)
            }

            if (builders.length < 5 && Game.rooms['W8N3'].energyAvailable >= 400) {
                var newName = 'builder' + Game.time;
                console.log('Spawning new builder: ' + newName);
                Game.spawns['Spawn1'].spawnCreep([WORK, WORK, CARRY, CARRY, MOVE, MOVE], newName,
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

        if (explorer1s.length < 10 && Game.rooms['W8N3'].energyAvailable >= 800) {
            var newName = 'explorer1_' + Game.time;
            console.log('Spawning new explorer1: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], newName,
                {
                    memory: {
                        role: 'explorer1',
                        operacao: 'vazio'
                    }
                });
        }
        var explorer2s = _.filter(Game.creeps, (creep) => creep.memory.role == 'explorer2');
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
        }
    }

    //spawn harvesters automaticamente
    if (harvesters.length < 5 && Game.rooms['W8N3'].energyAvailable >= 550) {
        var newName = 'Harvester' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], newName,
            {
                memory: {
                    role: 'harvester',
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
    }
}