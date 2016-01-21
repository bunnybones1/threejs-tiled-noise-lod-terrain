var signals = require('../../vendor/signals');
var EventUtil = require('../../utils/Events');

var keyDownStates = [];
var onKeyDownSignals = [];
var onKeyUpSignals = [];
for (var i = 0; i < 256; i++) {
	keyDownStates[i] = false;
	onKeyDownSignals[i] = new signals.Signal();
	onKeyUpSignals[i] = new signals.Signal();
};
function onDocumentKeyDown( event ) {
	onKeyDownSignals[event.keyCode].dispatch(event.ctrlKey, event.altKey, event.shiftKey);
	keyDownStates[event.keyCode] = true;
};
function onDocumentKeyUp( event ) {
	onKeyUpSignals[event.keyCode].dispatch(event.ctrlKey, event.altKey, event.shiftKey);
	keyDownStates[event.keyCode] = false;
};

EventUtil.addEvent(document, 'keydown', onDocumentKeyDown );
EventUtil.addEvent(document, 'keyup', onDocumentKeyUp );

var KeyBoard = function() {
};

KeyBoard.prototype = {
	keyDownStates: keyDownStates,
	onKeyDownSignals: onKeyDownSignals,
	onKeyUpSignals: onKeyUpSignals,
};

module.exports = new KeyBoard();