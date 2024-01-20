var autoGenerate = {
    popWithRooms(role, takeRoom, putRoom) {

        let unitsByRole = _.filter(Game.creeps, (creep) => creep.memory.role == role);
        let unitsByTake = unitsByRole.filter((unit) => unit.memory.takeRoom.name == takeRoom.name);
        let units = unitsByTake.filter((unit) => unit.memory.putRoom.name == putRoom.name);
        console.log(units.length, 'unidades de ', role, ' com takeRoom: ', takeRoom.name, ' e putRoom: ', putRoom.name);
        return units
    },
    popWithWorkRoom(role, pworkRoom) {
        let unitsByRole = _.filter(Game.creeps, (creep) => creep.memory.role == role);
        let units = unitsByRole.filter((unit) => unit.memory.workRoom.name == pworkRoom.name);
        return units
    },
    pop(role) {
        var units = _.filter(Game.creeps, (creep) => creep.memory.role == role);
        return units
    },
    generate(units, role, minUnits, takeRoom, minEnergy, ignore, bodyArray, passMemory) {
        if (Game.rooms[takeRoom.name].energyAvailable >= minEnergy) {
            for (let spawn in Game.spawns) {
                if ((Game.spawns[spawn].room.name == takeRoom.name) && (Game.spawns[spawn].spawning === null)) {
                    if (units.length < minUnits && Game.spawns[spawn].room.energyAvailable >= minEnergy) {
                        var newName = (role + '_' + Game.time);
                        console.log('Spawning new ' + role + ': ' + newName);
                        Game.spawns[spawn].spawnCreep(bodyArray, newName, passMemory);
                    };
                    break;
                };
            };
        } else {
            for (let spawn in Game.spawns) {
                if (Game.spawns[spawn].spawning === null) {
                    if (units.length < minUnits && Game.spawns[spawn].room.energyAvailable >= minEnergy) {
                        var newName = (role + '_' + Game.time);
                        console.log('Spawning new ' + role + ': ' + newName);
                        Game.spawns[spawn].spawnCreep(bodyArray, newName, passMemory);
                    };
                    break;
                };
            };
        };
    },
    generateV2(units, role, minUnits, minEnergy, bodyArray, passMemory) {
        for (let spawn in Game.spawns) {
            if (Game.spawns[spawn].spawning === null) {
                if (units.length < minUnits && Game.spawns[spawn].room.energyAvailable >= minEnergy) {
                    var newName = (role + '_' + Game.time);
                    console.log('Spawning new ' + role + ': ' + newName);
                    Game.spawns[spawn].spawnCreep(bodyArray, newName, passMemory);
                };
                break;
            };
        };
    }
};
module.exports = autoGenerate;