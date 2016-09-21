const fs = require('fs');
const config = require('./config');

module.exports = function putAssignment(req, res, next) {
  const codeValue = req.body.codeValue;
  const playerName = req.params.playerName;
  const assignment = req.params.assignment;
  const path = config.spigotDir + '/scriptcraft/players/' + playerName + '/' + assignment;
  fs.writeFile(path, codeValue, (err) => {
    if (err) return void next(err);

    res.status(200).end();
  });
};
