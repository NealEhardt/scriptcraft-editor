const express = require('express');
const bodyParser = require('body-parser');

const getHome = require('./get-home');
const getPlayer = require('./get-player');
const getAssignment = require('./get-assignment');
const putAssignment = require('./put-assignment');

const app = express();
app.use(express.static('public'));
app.use('/codemirror', express.static('node_modules/codemirror/lib'));
app.use('/codemirror/mode', express.static('node_modules/codemirror/mode'));

app.set('view engine', 'pug');
app.use(bodyParser.json());                         // support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support URL-encoded bodies

app.get('/', getHome);
app.get('/:playerName', getPlayer);
app.get('/:playerName/:assignment', getAssignment);
app.put('/:playerName/:assignment', putAssignment);

const port = 8089;
app.listen(port, function () {
  console.log('ScriptCraft Editor serving on port', port);
});
