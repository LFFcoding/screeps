const towerBrain = require('towerBrain');
const autoGenerate = require('autoGenerate');

const MIN_CARGO = 3;
const MIN_HARVESTER = 2;
const MIN_UPGRADER = 5;
const MIN_TOWERCHARGER = 2;
const MIN_BUILDER = 2;
var roomManagement = {
    run: function (id, takeRoom, PutRoom, mainRoom) {
        towerBrain.run(putRoom);
    }
};

module.exports = roomManagement;