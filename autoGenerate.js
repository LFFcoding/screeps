var autoGenerate = {
    popWithWorkRoom(role, pworkRoom) {
        let unitsByRole = _.filter(Game.creeps, (creep) => creep.memory.role == role);
        let units = unitsByRole.filter((unit) => unit.memory.workRoom.name == pworkRoom.name);
        return units
    },
    pop(role) {
        var units = _.filter(Game.creeps, (creep) => creep.memory.role == role);
        return units
    },
    generate(units, role, minUnits, room, minEnergy, spawnName, bodyArray, passMemory) {
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
}
module.exports = autoGenerate