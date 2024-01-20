const creepsFunctions = {
    takeResourceFromClosestTombstoneFull: function (creep) {
        let t = creep.pos.findClosestByRange(FIND_TOMBSTONES, {
            filter: (structure) => {
                return (structure.store[RESOURCE_ENERGY] > 0);
            }
        });
        if (t !== null) {
            creep.room.visual.text(
                "Take",
                creep.pos.x + 1,
                creep.pos.y,
                { align: 'left', opacity: 0.8 }
            );
            if (creep.withdraw(t, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(t, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        } else {
            creep.room.visual.text(
                "no resource",
                creep.pos.x + 1,
                creep.pos.y,
                { align: 'left', opacity: 0.8 }
            );
        };
    },
    takeClosestResourcesOnGround: function (creep) {
        let t = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
        if (t !== null) {
            creep.room.visual.text(
                "Take",
                creep.pos.x + 1,
                creep.pos.y,
                { align: 'left', opacity: 0.8 }
            );
            if (creep.pickup(t) == ERR_NOT_IN_RANGE) {
                creep.moveTo(t, { visualizePathStyle: { stroke: '#ffffff' } });
            };
        } else {
            creep.room.visual.text(
                "no resource",
                creep.pos.x + 1,
                creep.pos.y,
                { align: 'left', opacity: 0.8 }
            );
        };
    },
    takeResourcesFromClosestStorageFull: function (creep) {
        let t = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) && (structure.store[RESOURCE_ENERGY] > 0);
            }
        });
        if (t !== null) {
            creep.room.visual.text(
                "Take",
                creep.pos.x + 1,
                creep.pos.y,
                { align: 'left', opacity: 0.8 }
            );
            if (creep.withdraw(t, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(t, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        } else {
            creep.room.visual.text(
                "no storage with resource",
                creep.pos.x + 1,
                creep.pos.y,
                { align: 'left', opacity: 0.8 }
            );
        };
    },
    takeResourcesFromClosestSourceFull: function (creep) {
        let t = creep.pos.findClosestByRange(FIND_SOURCES, {
            filter: (structure) => {
                return (structure.energy > 0);
            }
        });
        if (t !== null) {
            creep.room.visual.text(
                "Mine",
                creep.pos.x + 1,
                creep.pos.y,
                { align: 'left', opacity: 0.8 }
            );
            if (creep.harvest(t, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(t, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        } else {
            creep.room.visual.text(
                "Sources empty",
                creep.pos.x + 1,
                creep.pos.y,
                { align: 'left', opacity: 0.8 }
            );
        };
    },
    putResourcesOnClosestSpwOrExtFree: function (creep) {
        let t = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        if (t !== null) {
            creep.room.visual.text(
                "Put",
                creep.pos.x + 1,
                creep.pos.y,
                { align: 'left', opacity: 0.8 }
            );
            if (creep.transfer(t, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(t, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        } else {
            creep.room.visual.text(
                "no spw/ext free",
                creep.pos.x + 1,
                creep.pos.y,
                { align: 'left', opacity: 0.8 }
            );
        };
    },
    putResourcesOnClosestStgOrCtnFree: function (creep) {
        let t = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) && (structure.store.getFreeCapacity() > 0);
            }
        });
        if (t !== null) {
            creep.room.visual.text(
                "Put",
                creep.pos.x + 1,
                creep.pos.y,
                { align: 'left', opacity: 0.8 }
            );
            if (creep.transfer(t, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(t, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        } else {
            creep.room.visual.text(
                "no storage free",
                creep.pos.x + 1,
                creep.pos.y,
                { align: 'left', opacity: 0.8 }
            );
        };
    },
    upgradeControllerOfCurrentCreepRoom: function (creep) {
        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
        };
    }
};

module.exports = creepsFunctions;