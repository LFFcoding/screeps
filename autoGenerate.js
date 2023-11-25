var autoGenerate = {
    pop(role) {
        var units = _.filter(Game.creeps, (creep) => creep.memory.role == role);
        return units
    },
    generate(units, role, minUnits, room, minEnergy, spawnName, bodyArray, passMemory) {
        if (units.length < minUnits && room.energyAvailable >= minEnergy) {
            var newName = (role + '_' + Game.time);
            console.log('Spawning new ' + role + ': ' + newName);
            Game.spawns[spawnName].spawnCreep(bodyArray, newName, passMemory)
        };
    }
}
module.exports = autoGenerate