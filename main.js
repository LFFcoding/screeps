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

const gameParams = {
    MAIN_ROOM: Game.rooms['W8N3'],
    ROOM_ALVO: Game.rooms['W8N2']
}

module.exports.loop = function () {


    const MAIN_ROOM = Game.rooms['W8N3']
    const ROOM_ALVO = Game.rooms['W8N2']
    const MIN_TROOP = Memory.minTroop;
    const MIN_DEFENDER = 1;
    const MIN_CARGO = 3;
    const MIN_HARVESTER = 2;
    const MIN_UPGRADER = Memory.MIN_UPGRADER;
    const MIN_UPGRADER2 = 1;
    const MIN_BUILDER = 10;
    const MIN_EXPLORER1 = 2;
    const MIN_CLAIMER = 0;
    const MIN_TOWERCHARGER = 1;
    let idleTroopUnits = autoGenerate.pop('idleTroop');

    Memory.mainRoomSpawn = MAIN_ROOM.find(FIND_MY_SPAWNS);

    console.log('############################################################################################')

    var MAIN_STORAGES = [];
    for (let room in Game.rooms) {
        let storage = Game.rooms[room].find(FIND_MY_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_CONTAINER);
            }
        });
        if (storage[0] !== undefined) {
            MAIN_STORAGES.push(storage[0]);
        };
    };

    var MAIN_STORAGE_ENERGY = 0;
    for (let i = 0; i < MAIN_STORAGES.length; i++) {
        console.log('Energia armazenada na room ', Game.rooms[MAIN_STORAGES[i].room.name], ': ', MAIN_STORAGES[i].store.energy);
        MAIN_STORAGE_ENERGY = MAIN_STORAGE_ENERGY + MAIN_STORAGES[i].store.energy;
    };

    console.log('Energia armazenada: ' + MAIN_STORAGE_ENERGY);
    if (MAIN_STORAGE_ENERGY > 980000) {
        Memory.EXTERNAL_UPGRADERS = 15;
        Memory.MIN_UPGRADER = 10;
        Memory.minTroop = 0
    } else if (MAIN_STORAGE_ENERGY < 50000) {
        Memory.EXTERNAL_UPGRADERS = 5;
        Memory.MIN_UPGRADER = 3;
        Memory.minTroop = 0
    };

    //verifica quantos cargo existem na MAIN_ROOM e spawna se necessário
    var cargoUnitsMainRoom = autoGenerate.popWithRooms('cargo', MAIN_ROOM, MAIN_ROOM);
    autoGenerate.generateV2(cargoUnitsMainRoom, 'cargo', MIN_CARGO, 1000, [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], { memory: { role: 'cargo', operacao: 'vazio', takeRoom: MAIN_ROOM, putRoom: MAIN_ROOM } });
    autoGenerate.generate(cargoUnitsMainRoom, 'cargo', MIN_CARGO, MAIN_ROOM, 1000, 'Spawn1', [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], { memory: { role: 'cargo', operacao: 'vazio', takeRoom: MAIN_ROOM, putRoom: MAIN_ROOM } });
    //verifica quantos cargo existem na ROOM_ALVO e spawna se necessário
    var cargoUnitsRoomAlvo = autoGenerate.popWithRooms('cargo', ROOM_ALVO, ROOM_ALVO);
    autoGenerate.generate(cargoUnitsRoomAlvo, 'cargo', MIN_CARGO, ROOM_ALVO, 1000, 'Spawn1', [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], { memory: { role: 'cargo', operacao: 'vazio', takeRoom: ROOM_ALVO, putRoom: ROOM_ALVO } });

    //verifica quantos cargo existem na w7n1 e spawna se necessário
    var cargoUnitsw7n1 = autoGenerate.popWithRooms('cargo', Game.rooms['W7N1'], Game.rooms['W7N1']);
    autoGenerate.generate(cargoUnitsw7n1, 'cargo', MIN_CARGO, Game.rooms['W7N1'], 1000, 'Spawn1', [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], { memory: { role: 'cargo', operacao: 'vazio', takeRoom: Game.rooms['W7N1'], putRoom: Game.rooms['W7N1'] } });

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

    //verifica quantos harvesterUnitsMainRoom existem na room principal e spawna se necessário
    if (MIN_HARVESTER > 0) {
        var harvesterUnitsMainRoom = autoGenerate.popWithRooms('harvester', MAIN_ROOM, MAIN_ROOM);
        autoGenerate.generate(harvesterUnitsMainRoom, 'harvester', MIN_HARVESTER, MAIN_ROOM, 1250, 'Spawn1', [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE], { memory: { role: 'harvester', operacao: 'vazio', takeRoom: MAIN_ROOM, putRoom: MAIN_ROOM } });

        var harvesterUnitsRoomAlvo = autoGenerate.popWithRooms('harvester', ROOM_ALVO, ROOM_ALVO);
        autoGenerate.generate(harvesterUnitsRoomAlvo, 'harvester', MIN_HARVESTER, ROOM_ALVO, 1250, 'Spawn1', [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE], { memory: { role: 'harvester', operacao: 'vazio', takeRoom: ROOM_ALVO, putRoom: ROOM_ALVO } });

        var harvesterUnitsw7n1 = autoGenerate.popWithRooms('harvester', Game.rooms['W7N1'], Game.rooms['W7N1']);
        autoGenerate.generate(harvesterUnitsw7n1, 'harvester', MIN_HARVESTER, Game.rooms['W7N1'], 1250, 'Spawn1', [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE], { memory: { role: 'harvester', operacao: 'vazio', takeRoom: Game.rooms['W7N1'], putRoom: Game.rooms['W7N1'] } });
    }

    //verifica quantos defenderUnits existem e spawna se necessário
    if (MIN_DEFENDER > 0) {
        var defenderUnits = autoGenerate.pop('defender');
        autoGenerate.generate(defenderUnits, 'defender', MIN_DEFENDER, MAIN_ROOM, 790, 'Spawn1', [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, TOUGH, MOVE, TOUGH, MOVE, TOUGH, MOVE, TOUGH, MOVE, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK], { memory: { role: 'defender', operacao: 'idle', takeRoom: MAIN_ROOM, putRoom: MAIN_ROOM } });
    };

    //Verifica se tem creeps de classes prioritárias suficientes e ativa produção de classes menos prioritárias
    var popOfharvesterUnitsMainRoomIsOk
    if ((harvesterUnitsMainRoom.length >= MIN_HARVESTER) && (harvesterUnitsRoomAlvo.length >= MIN_HARVESTER)) {
        popOfharvesterUnitsMainRoomIsOk = true
        console.log('harvesterUnitsMainRoom is Ok.')
    } else if ((harvesterUnitsMainRoom.length < MIN_HARVESTER) && (harvesterUnitsRoomAlvo.length < MIN_HARVESTER)) {
        popOfharvesterUnitsMainRoomIsOk = false
        console.log('harvesterUnitsMainRoom is not OK!!!')
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
    if ((cargoUnitsMainRoom.length >= MIN_CARGO) && (cargoUnitsRoomAlvo.length >= MIN_CARGO)) {
        popOfCargoIsOk = true
        console.log('cargoUnitsMainRoom is Ok.')
    } else if ((cargoUnitsMainRoom.length < MIN_CARGO) && (cargoUnitsRoomAlvo.length < MIN_CARGO)) {
        popOfCargoIsOk = false
        console.log('cargoUnitsMainRoom is not OK!!!')
    };

    if (popOfharvesterUnitsMainRoomIsOk == true && popOfCargoIsOk == true && popOfDefendersIsOk == true) {


        var upgraders = autoGenerate.popWithRooms('upgrader', MAIN_ROOM, MAIN_ROOM);

        if (upgraders.length < MIN_UPGRADER) {
            autoGenerate.generateV2(upgraders, 'upgrader', MIN_UPGRADER, 1250, [WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE, MOVE], { memory: { role: 'upgrader', upgrading: false, takeRoom: MAIN_ROOM, putRoom: MAIN_ROOM } });
        }

        var upgradersw7n1 = autoGenerate.popWithRooms('upgrader', ROOM_ALVO, Game.rooms['W7N1']);

        if (upgradersw7n1.length < Memory.EXTERNAL_UPGRADERS) {
            autoGenerate.generateV2(upgradersw7n1, 'upgrader', Memory.EXTERNAL_UPGRADERS, 1250, [WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE, MOVE], { memory: { role: 'upgrader', upgrading: false, takeRoom: ROOM_ALVO, putRoom: Game.rooms['W7N1'] } });
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
            console.log('Com acesso a room: ', Game.rooms[room].name);
        }
        Memory.controllers = controllers
        var roomWithCs = new Array();
        if (controllers.length > 0) {
            for (var controller in controllers) {
                if (controllers[controller].room.find(FIND_MY_CONSTRUCTION_SITES).length > 0) {
                    roomWithCs.push(controllers[controller].room); 
                }
            }
        }

        if (roomWithCs.length > 0) {
            console.log(roomWithCs[0]);

            let builderUnits = autoGenerate.pop('builder');
            autoGenerate.generate(builderUnits, 'builder', MIN_BUILDER, MAIN_ROOM, 1250, 'Spawn1', [WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE, MOVE], { memory: { role: 'builder', takeRoom: roomWithCs, putRoom: roomWithCs } });
        }

        let explorer1Units = autoGenerate.pop('explorer1');
        autoGenerate.generate(explorer1Units, 'explorer1', MIN_EXPLORER1, MAIN_ROOM, 1250, 'Spawn1', [WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE, MOVE], { memory: { role: 'explorer1', operacao: 'vazio' } });

        //verifica quantos idleTroop existem e spawna se necessário
        if (MIN_TROOP > 0) {
            console.log('idleTroops: ', idleTroopUnits.length);
            autoGenerate.generate(idleTroopUnits, 'idleTroop', MIN_TROOP, MAIN_ROOM, 430, 'Spawn1', [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK], { memory: { role: 'idleTroop', class: 'soldier' } });
        }
    };


    if (MIN_UPGRADER2 > 0) {
        var upgrader2Units = autoGenerate.pop('upgrader2');
        autoGenerate.generate(upgrader2Units, 'upgrader2', MIN_UPGRADER2, ROOM_ALVO, 300, 'Spawn2', [WORK, CARRY, MOVE, MOVE, MOVE], { memory: { role: 'upgrader2', workRoom: ROOM_ALVO } });
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
            roleCargo.run(creep);
        }
        if (creep.memory.role == 'builder') {
            if (roomWithCs !== undefined) {
            creep.memory.putRoom = roomWithCs[0];
            };
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
            creep.memory.role = 'massAttackTroop';
            roleMassAttackTroop.run(creep);
        }
        if (creep.memory.role == 'massAttackTroop') {
            roleMassAttackTroop.run(creep);
        }
        if (creep.memory.role == 'claimer') {
            roleClaimer.run(creep);
        }
        if (creep.memory.role == 'upgrader2') {
            creep.memory.workRoom = ROOM_ALVO
            roleUpgrader2.run(creep);
        }

    }
}