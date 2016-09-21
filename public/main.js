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
    persistToServer(value);
  });
  validateCode(cm.getValue());
}

function validateCode(codeValue) {
  var errorDiv = document.querySelector('.errorMessage');
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

var xhr = null;
var pendingPut = null;
var pendingTimeout = null;
var lastPutDate = null;
var debounceTimeMs = 1000;

function persistToServer(codeValue) {
  if (xhr || pendingTimeout !== null) {
    pendingPut = codeValue;
    return;
  }

  var date = new Date();
  var msSinceLastPut = date - lastPutDate;
  if (lastPutDate !== null && msSinceLastPut < debounceTimeMs) {
    pendingPut = codeValue;
    pendingTimeout = setTimeout(function () {
      pendingTimeout = null;
      persistToServer(pendingPut);
    }, debounceTimeMs - msSinceLastPut);
    return;
  }

  pendingPut = null;
  lastPutDate = date;
  xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        console.log('saved');
      } else {
        console.error('save error!', xhr.status);
      }

      xhr = null;
      if (pendingPut) {
        persistToServer(pendingPut);
      }
    }
  };
  xhr.open('put', window.location);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.send(JSON.stringify({ codeValue: codeValue }));
}
