var towerBrain = {
    run: function (room) {
        var hostiles = room.find(FIND_CREEPS, {
            filter: (creepfinded) => {
                return (creepfinded.owner.username == 'dawalishi122')
            }
        })
        var towers = room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_TOWER)
            }
        });
        if (towers.length > 0) {
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
        }
    }
};

module.exports = towerBrain