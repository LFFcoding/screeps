var autoGenerate = {
    pop(role) {
        var units = _.filter(Game.creeps, (creep) => creep.memory.role == role);
        return units
    },
    generate(units, role, minUnits, room, minEnergy, spawnName, bodyArray, passMemory) {
        let spawnsInRoom = room.find(FIND_MY_SPAWNS);
        for (var i = 0; i < spawnsInRoom.length; i++) {
            if (spawnsInRoom[i].spawning === null) {
                let idleSpawn = spawnsInRoom[i];
                if (units.length < minUnits && room.energyAvailable >= minEnergy) {
                    console.log('idleSpawnEncontrado >>>>>', idleSpawn);
                    var newName = (role + '_' + Game.time);
                    console.log('Spawning new ' + role + ': ' + newName);
                    idleSpawn.spawnCreep(bodyArray, newName, passMemory);
                };
                break;
            };
        };
    }
}
module.exports = autoGenerate