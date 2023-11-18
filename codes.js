Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], 'Builder1',
    { memory: { role: 'builder' } });
Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], 'Harvester1',
    { memory: { role: 'harvester' } });
Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], 'Builder1',
    { memory: { role: 'upgrader' } });


Game.rooms['W2N9'].createConstructionSite(27, 27, STRUCTURE_EXTENSION);