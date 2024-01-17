var roleUpgrader = require('role.upgrader');
var roleUpgrader2 = require('role.upgrader2');
var roleHarvester = require('role.harvester');
var roleBuilder = require('role.builder');
var roleTowerCharger = require('role.towerCharger');
var roleTowerCharger2 = require('role.towerCharger2');
var roleExplorer1 = require('role.explorer1');
var roleExplorer2 = require('role.explorer2');
var roleDefender = require('role.defender');
var roleIdleTroop = require('role.idleTroop');
var roleMassAttackTroop = require('role.massAttackTroop');
var roleCargo = require('role.cargo');
var roleClaimer = require('role.claimer');
var towerBrain = require('towerBrain');
var autoGenerate = require('autoGenerate');

module.exports.loop = function () {


    const MAIN_ROOM = Game.rooms['W8N3']
    const ROOM_ALVO = Game.rooms['W8N2']
    const MIN_TROOP = Memory.minTroop;
    const MIN_DEFENDER = 1;
    const MIN_CARGO = 3;
    const MIN_HARVESTER = 2;
    const MIN_UPGRADER = 1;
    const MIN_UPGRADER2 = 1;
    const MIN_BUILDER = 10;
    const MIN_EXPLORER1 = 5;
    const MIN_CLAIMER = 0;
    const MIN_TOWERCHARGER = 1;

    Memory.mainRoomSpawn = MAIN_ROOM.find(FIND_MY_SPAWNS);

    console.log('############################################################################################')

    var MAIN_STORAGE = MAIN_ROOM.find(FIND_MY_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_STORAGE);
        }
    });
    var MAIN_STORAGE_ENERGY = MAIN_STORAGE[0].store.energy;
    console.log('Energia armazenada: ' + MAIN_STORAGE_ENERGY);
    if (MAIN_STORAGE_ENERGY > 98000000) {
        Memory.minTroop = 24
    } else if (MAIN_STORAGE_ENERGY < 50000) {
        Memory.minTroop = 0
    }

    var cargoUnits = _.filter(Game.creeps, (creep) => creep.memory.role == 'cargo');

    // start modulo das torres
    towerBrain.run(MAIN_ROOM);
    towerBrain.run(ROOM_ALVO);
    // end modulo das torres

    //Limpeza de Memória
    for (var i in Memory.creeps) {
        if (!Game.creeps[i]) {
            delete Memory.creeps[i];
            console.log('Memory cleaned.')
        }
    };



    //função generate(units, role, minUnits, room, minEnergy, spawn, bodyArray, passMemory); em todas as unidades
    if (MIN_CLAIMER > 0) {
        var claimerUnits = autoGenerate.pop('claimer');
        autoGenerate.generate(claimerUnits, 'claimer', MIN_CLAIMER, MAIN_ROOM, 800, 'Spawn1', [MOVE, MOVE, MOVE, MOVE, CLAIM], { memory: { role: 'claimer', teste: 'ok' } });
    };

    //verifica quantos idleTroop existem e spawna se necessário
    if (MIN_TROOP > 0) {
        var idleTroopUnits = autoGenerate.pop('idleTroop');
        autoGenerate.generate(idleTroopUnits, 'idleTroop', MIN_TROOP, MAIN_ROOM, 430, 'Spawn1', [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK], { memory: { role: 'idleTroop', class: 'soldier' } });
    }

    //verifica quantos harvesterUnits existem e spawna se necessário
    if (MIN_HARVESTER > 0) {
        var harvesterUnits = autoGenerate.pop('harvester');
        autoGenerate.generate(harvesterUnits, 'harvester', MIN_HARVESTER, MAIN_ROOM, 1250, 'Spawn1', [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE], { memory: { role: 'harvester', operacao: 'vazio' } });
    }

    //verifica quantos defenderUnits existem e spawna se necessário
    if (MIN_DEFENDER > 0) {
        var defenderUnits = autoGenerate.pop('defender');
        autoGenerate.generate(defenderUnits, 'defender', MIN_DEFENDER, MAIN_ROOM, 790, 'Spawn1', [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, TOUGH, MOVE, TOUGH, MOVE, TOUGH, MOVE, TOUGH, MOVE, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK], { memory: { role: 'defender', operacao: 'idle' } });
    };

    //Verifica se tem creeps de classes prioritárias suficientes e ativa produção de classes menos prioritárias
    var popOfharvesterUnitsIsOk
    if (harvesterUnits.length >= MIN_HARVESTER) {
        popOfharvesterUnitsIsOk = true
        console.log('harvesterUnits is Ok.')
    } else if (harvesterUnits.length < MIN_HARVESTER) {
        popOfharvesterUnitsIsOk = false
        console.log('harvesterUnits is not OK!!!')
    };
    var popOfDefendersIsOk
    if (defenderUnits.length >= MIN_DEFENDER) {
        popOfDefendersIsOk = true
        console.log('defenderUnits is Ok.')
    } else if (defenderUnits.length < MIN_DEFENDER) {
        popOfDefendersIsOk = false
        console.log('defenderUnits is not OK!!!')
    };
    var popOfCargoIsOk
    if (cargoUnits.length >= MIN_CARGO) {
        popOfCargoIsOk = true
        console.log('cargoUnits is Ok.')
    } else if (cargoUnits.length < MIN_CARGO) {
        popOfCargoIsOk = false
        console.log('cargoUnits is not OK!!!')
    };

    if (popOfharvesterUnitsIsOk == true && popOfCargoIsOk == true && popOfDefendersIsOk == true) {

        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');

        if (upgraders.length < MIN_UPGRADER && MAIN_ROOM.energyAvailable >= 1250) {
            var newName = 'upgrader' + Game.time;
            console.log('Spawning new upgrader: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE, MOVE], newName,
                { memory: { role: 'upgrader' } });
        }

        var towerChargers1 = _.filter(Game.creeps, (creep) => (creep.memory.role == 'towerCharger'));

        if (towerChargers1.length < MIN_TOWERCHARGER && MAIN_ROOM.energyAvailable >= 600) {
            var newName = 'towerCharger1_' + Game.time;
            console.log('Spawning new towerCharger1_: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], newName,
                {
                    memory: {
                        role: 'towerCharger',
                        operacao: 'vazio',
                        roomFonte: MAIN_ROOM,
                        roomWork: MAIN_ROOM
                    }
                });
        }

        var towerChargers2 = _.filter(Game.creeps, (creep) => (creep.memory.role == 'towerCharger2'));

        if (towerChargers2.length < MIN_TOWERCHARGER && MAIN_ROOM.energyAvailable >= 600) {
            var newName = 'towerCharger2_' + Game.time;
            console.log('Spawning new towerCharger2_: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], newName,
                {
                    memory: {
                        role: 'towerCharger2',
                        operacao: 'vazio',
                        roomFonte: MAIN_ROOM,
                        roomWork: ROOM_ALVO
                    }
                });
        }

        var controllers = new Array();
        for (var room in Game.rooms) {
            controllers.push(Game.rooms[room].controller)
            console.log(Game.rooms[room].name)
        }
        Memory.controllers = controllers
        var constructions = new Array();
        if (controllers.length > 0) {
            for (var controller in controllers) {
                var finded_cs = controllers[controller].room.find(FIND_MY_CONSTRUCTION_SITES)
                if (finded_cs.length > 0) {
                    if (constructions) {
                        constructions.push(finded_cs)
                    } else {
                        constructions.push(finded_cs)
                    }
                }
            }
        }

        if (constructions.length > 0) {

            let builderUnits = autoGenerate.pop('builder');
            autoGenerate.generate(builderUnits, 'builder', MIN_BUILDER, MAIN_ROOM, 1250, 'Spawn1', [WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE, MOVE], { memory: { role: 'builder', roomFonte: MAIN_ROOM, roomWork: MAIN_ROOM } });
        }

        let explorer1Units = autoGenerate.pop('explorer1');
        autoGenerate.generate(explorer1Units, 'explorer1', MIN_EXPLORER1, MAIN_ROOM, 1250, 'Spawn1', [WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE, MOVE], { memory: { role: 'explorer1', operacao: 'vazio' } });
    };

    autoGenerate.generate(cargoUnits, 'cargo', MIN_CARGO, MAIN_ROOM, 1000, 'Spawn1', [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], { memory: { role: 'cargo', operacao: 'vazio', workRoom: MAIN_ROOM } });

    if (MIN_UPGRADER2 > 0) {
        var upgrader2Units = autoGenerate.pop('upgrader2');
        autoGenerate.generate(upgrader2Units, 'upgrader2', MIN_UPGRADER2, ROOM_ALVO, 300, 'Spawn2', [WORK, CARRY, MOVE, MOVE, MOVE], { memory: { role: 'upgrader2', roomWork: ROOM_ALVO } });
    };
    //Spawn mostra qual unidade está spawnando
    for (let spawn in Game.spawns) {
        if (Game.spawns[spawn].spawning) {
            var spawningCreep = Game.creeps[Game.spawns[spawn].spawning.name];
            Game.spawns[spawn].room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                Game.spawns[spawn].pos.x + 1,
                Game.spawns[spawn].pos.y,
                { align: 'left', opacity: 0.8 });
        } 
    }

    //seta as funções dos creeps de acordo com a role
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role == 'cargo') {
            creep.memory.roomWork = MAIN_ROOM;
            roleCargo.run(creep);
        }
        if (creep.memory.role == 'builder') {
            creep.memory.roomWork = ROOM_ALVO;
            creep.memory.roomFonte = MAIN_ROOM;
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
        if (creep.memory.role == 'towerCharger2') {
            roleTowerCharger2.run(creep);
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
        if (creep.memory.role == 'idleTroop' && (idleTroopUnits.length >= MIN_TROOP)) {
            console.log(idleTroopUnits.length, MIN_TROOP)
            creep.memory.role = 'massAttackTroop'
            roleMassAttackTroop.run(creep);
        }
        if (creep.memory.role == 'massAttackTroop') {
            roleMassAttackTroop.run(creep);
        }
        if (creep.memory.role == 'claimer') {
            roleClaimer.run(creep);
        }
        if (creep.memory.role == 'upgrader2') {
            creep.memory.roomWork = ROOM_ALVO
            roleUpgrader2.run(creep);
        }

    }
}