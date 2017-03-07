const fs = require('fs-extra');
const async = require('async');
const config = require('./config');

module.exports = function writeAssignments(playerName, next) {
  const playersPath = config.spigotDir + '/scriptcraft/players';
  const assignmentsPath = config.assignmentsDir;

  fs.mkdir(assignmentsPath, () => { // don't worry about errors
    fs.readdir(assignmentsPath, (err, masterAssignments) => {
      if (err) return void next(err);

      const playerPath = playersPath + '/' + playerName;
      fs.readdir(playerPath, (err, playerAssignments) => {
        if (err) return void next(err);

        const missingAssns = masterAssignments.filter(assn => playerAssignments.indexOf(assn) === -1);

        // Copy assignments in 2 steps or else ScriptCraft won't load their contents.

        // First touch the files
        missingAssns.map(assn => {
          fs.closeSync(fs.openSync(playerPath + '/' + assn, 'w'));
        });

        // Second copy the data
        async.map(missingAssns, (assn, cb) => {
          fs.copy(assignmentsPath + '/' + assn, playerPath + '/' + assn, cb);
        }, next);
      });
    });
  });
};
