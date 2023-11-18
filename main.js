var roleUpgrader = require('role.upgrader');
var roleHarvester = require('role.harvester');
var roleBuilder = require('role.builder');
var roleMechanic = require('role.mechanic');

module.exports.loop = function () {



    //log da energia disponível
    console.log('Energia disponível: ' + Game.rooms['W2N9'].energyAvailable);

    for (var i in Memory.creeps) {
        if (!Game.creeps[i]) {
            delete Memory.creeps[i];
            console.log('Memory cleaned.')
        }
    };

    //verifica e loga quantos harvesters existem
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    console.log('Harvesters: ' + harvesters.length);

    //Verifica se tem harvesters suficientes e ativa produção de builders e upgraders
    var popOfHarvestersIsOk
    if (harvesters.length >= 10) {
        popOfHarvestersIsOk = true
        console.log('Harvesters pop is Ok.')
    } else if (harvesters.length < 10) {
        popOfHarvestersIsOk = false
        console.log('Harvesters pop is not OK!!!')
    }

    if (popOfHarvestersIsOk == true) {
        //auto renew creeps
        /*for (var i in Game.creeps) {
            if (Game.creeps[i].ticksToLive < 50) {
                Game.spawns['Spawn1'].renewCreep(Game.creeps[i])
                console.log('Creep reformado: ' + Game.creeps[i].name + 'tempo de vida: ' + Game.creeps[i].ticksToLive)
            }
        }*/
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        console.log('upgraders: ' + upgraders.length);

        if (upgraders.length < 2 && Game.rooms['W2N9'].energyAvailable >= 800) {
            var newName = 'upgrader' + Game.time;
            console.log('Spawning new upgrader: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], newName,
                { memory: { role: 'upgrader' } });
        }

        if (Game.spawns['Spawn1'].spawning) {
            var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
            Game.spawns['Spawn1'].room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                Game.spawns['Spawn1'].pos.x + 1,
                Game.spawns['Spawn1'].pos.y,
                { align: 'left', opacity: 0.8 });
        }

        for (var creep in Game.creeps) {
            var constructions = Game.creeps[creep].room.find(FIND_CONSTRUCTION_SITES).length
        }

        if (constructions > 0) {
            console.log('Precisamos de mais construtores!')
            var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
            console.log('builders: ' + builders.length);

            if (builders.length < 5 && Game.rooms['W2N9'].energyAvailable >= 800) {
                var newName = 'builder' + Game.time;
                console.log('Spawning new builder: ' + newName);
                Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], newName,
                    { memory: { role: 'builder' } });
            }

            if (Game.spawns['Spawn1'].spawning) {
                var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
                Game.spawns['Spawn1'].room.visual.text(
                    '🛠️' + spawningCreep.memory.role,
                    Game.spawns['Spawn1'].pos.x + 1,
                    Game.spawns['Spawn1'].pos.y,
                    { align: 'left', opacity: 0.8 });
            }
        } else if (constructions == 0) {
            for (var creep in Game.creeps) {
                if (Game.creeps[creep].memory.role == 'builder') {
                    Game.creeps[creep].suicide()
                }
            }
        }
    }

    //spawn harvesters automaticamente
    if (harvesters.length < 10 && Game.rooms['W2N9'].energyAvailable >= 800) {
        var newName = 'Harvester' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], newName,
            { memory: { role: 'harvester' } });
    }

    if (Game.spawns['Spawn1'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            { align: 'left', opacity: 0.8 });
    }

    /*var mechanics = _.filter(Game.creeps, (creep) => creep.memory.role == 'mechanic');
    console.log('mechanics: ' + mechanics.length);

    if (mechanics.length < 2 && Game.spawns['Spawn1'].store[RESOURCE_ENERGY] >= 200) {
        var newName = 'mechanic' + Game.time;
        console.log('Spawning new mechanic: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName,
            { memory: { role: 'mechanic' } });
    }

    if (Game.spawns['Spawn1'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            { align: 'left', opacity: 0.8 });
    }*/

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
    }
}