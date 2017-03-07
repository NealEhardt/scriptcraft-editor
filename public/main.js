'use strict';

function onSubmitPlayerName(form) {
  var playerName = form.elements.playerName.value;
  window.location = '/'+playerName;
  return false;
}

function setupCodeMirror(codeValue) {
  var cm = CodeMirror(document.body, {
    value: codeValue,
    lineNumbers: true,
    mode: 'javascript'
  });
  cm.on('change', function() {
    var value = cm.getValue();
    validateCode(value);
    saveCode(value);
  });
  validateCode(cm.getValue());
}

function validateCode(codeValue) {
  var errorDiv = document.querySelector('div.errorMessage');
  try {
    var require = function () {};
    var exports = {};
    eval(codeValue);
  } catch (e) {
    errorDiv.textContent = e.name + ': ' + e.message;
    errorDiv.style.visibility = 'visible';
    return;
  }
  errorDiv.style.visibility = 'hidden';
}

var lastActivityDate = null;

function saveCode(codeValue) {
  lastActivityDate = new Date();
  persistToServer(codeValue);
}

var xhr = null;
var pendingPut = null;
var pendingTimeout = null;
var debounceTimeMs = 1000;

function persistToServer(codeValue) {
  if (xhr || pendingTimeout !== null) {
    pendingPut = codeValue;
    return;
  }

  var saveDiv = document.querySelector('div.saveMessage');
  saveDiv.className = 'saveMessage';
  saveDiv.textContent = 'Saving...';

  var date = new Date();
  var waitTime = debounceTimeMs - (date - lastActivityDate);
  if (waitTime > 0) {
    pendingPut = codeValue;
    pendingTimeout = setTimeout(function () {
      pendingTimeout = null;
      persistToServer(pendingPut);
    }, waitTime);
    return;
  }

  pendingPut = null;
  lastActivityDate = date;
  xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        saveDiv.className = 'saveMessage hidden';
        saveDiv.textContent = '✔ Saved';
      } else {
        saveDiv.className = 'saveMessage';
        saveDiv.textContent = 'Save error! ' + xhr.status;
      }

      xhr = null;
      if (pendingPut) {
        console.log('pending put persist');
        persistToServer(pendingPut);
      }
    }
  };
  xhr.open('put', window.location);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.send(JSON.stringify({ codeValue: codeValue }));
}
