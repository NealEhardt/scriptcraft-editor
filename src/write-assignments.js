const fs = require('fs-extra');
const async = require('async');
const config = require('./config');

module.exports = function writeAssignments(playerName, next) {
  const playersPath = config.spigotDir + '/scriptcraft/players';
  const assignmentsPath = playersPath + '/' + config.assignmentsDir;

  fs.mkdir(assignmentsPath, () => { // don't worry about errors
    fs.readdir(assignmentsPath, (err, masterAssignments) => {
      if (err) return void next(err);

      const playerPath = playersPath + '/' + playerName;
      fs.readdir(playerPath, (err, playerAssignments) => {
        if (err) return void next(err);

        const missingAssns = masterAssignments.filter(assn => playerAssignments.indexOf(assn) === -1);
        async.map(missingAssns, function (assn, cb) {
          fs.copy(assignmentsPath + '/' + assn, playerPath + '/' + assn, cb);
        }, next);
      });
    });
  });
};
