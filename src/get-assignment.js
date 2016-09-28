const fs = require('fs');
const config = require('./config');
const writeAssignments = require('./write-assignments');

module.exports = function getAssignment(req, res, next) {
  const playerName = req.params.playerName;
  const assignment = req.params.assignment;

  writeAssignments(playerName, (err) => {
    if (err) return void next(err);

    const path = config.spigotDir + '/scriptcraft/players/' + playerName + '/' + assignment;
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) return void next(err);

      res.render('assignment', {
        assignment: req.params.assignment,
        playerName: req.params.playerName,
        codeValue: data
      });
    });
  });
};
