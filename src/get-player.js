const fs = require('fs');
const config = require('./config');
const writeAssignments = require('./write-assignments');

module.exports = function getPlayer(req, res, next) {
  const playerName = req.params.playerName;
  const playersPath = config.spigotDir + '/scriptcraft/players';
  fs.readdir(playersPath, (err, players) => {
    if (err) return void next(err);
    const isMissing = players.indexOf(playerName) === -1;
    if (isMissing) {
      return void res.render('home', { missingPlayerName: playerName });
    }

    writeAssignments(playerName, (err) => {
      if (err) return void next(err);

      fs.readdir(playersPath + '/' + playerName, (err, assignments) => {
        if (err) return void next(err);
        res.render('player', { playerName: playerName, assignments: assignments });
      });
    });
  });
};
