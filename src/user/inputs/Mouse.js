var signals = require('../../vendor/signals');
var EventUtil = require('../../utils/Events');

var lastX, lastY, relX, relY, windowHalfX, windowHalfY, isDown;
var position = {
	x: 0,
	y: 0
}

//for convenience, move has 3 modes:
//drag when mouse is down
//hover when mouse is up
//move for both
var onMoveSignal = new signals.Signal();
var onMoveRelativeSignal = new signals.Signal();
var onDragSignal = new signals.Signal();
var onDragRelativeSignal = new signals.Signal();
var onHoverSignal = new signals.Signal();
var onHoverRelativeSignal = new signals.Signal();
var onDownSignal = new signals.Signal();
var onUpSignal = new signals.Signal();
var onOutSignal = new signals.Signal();

var start = true;
function onDocumentMouseMove( event ) {
	position.x = ( event.clientX - windowHalfX ) / windowHalfX;
	position.y = ( event.clientY - windowHalfY ) / windowHalfY;
	
	onMoveSignal.dispatch(position.x, position.y);
	if(isDown) {
		onDragSignal.dispatch(position.x, position.y);
	} else {
		onHoverSignal.dispatch(position.x, position.y);
	}

	if(start) {
		start = false;
	} else {
		relX = position.x - lastX;
		relY = position.y - lastY;
		onMoveRelativeSignal.dispatch(relX, relY);
		if(isDown) {
			onDragRelativeSignal.dispatch(relX, relY);
		} else {
			onHoverRelativeSignal.dispatch(relX, relY);
		}
	}
	lastX = position.x;
	lastY = position.y;
};

function onDocumentMouseDown( event ) {
	isDown = true;
	onDownSignal.dispatch(position.x, position.y);
};

function onDocumentMouseUp( event ) {
	isDown = false;
	onUpSignal.dispatch(position.x, position.y);
};

function onDocumentMouseOut( event ) {
	isDown = false;
	onOutSignal.dispatch();
};

function onDocumentResize( event ) {
	windowHalfX = window.innerWidth * .5;
	windowHalfY = window.innerHeight * .5;
};

EventUtil.addEvent(document, 'mousemove', onDocumentMouseMove );
EventUtil.addEvent(document, 'mousedown', onDocumentMouseDown );
EventUtil.addEvent(document, 'mouseup', onDocumentMouseUp );
EventUtil.addEvent(document, 'mouseout', onDocumentMouseOut );

var Mouse = function() {
	EventUtil.addEvent(window, 'resize', onDocumentResize);
	onDocumentResize();
};

Mouse.prototype = {
	position: position,
	onMoveSignal : onMoveSignal,
	onMoveRelativeSignal : onMoveRelativeSignal,
	onDragSignal : onDragSignal,
	onDragRelativeSignal : onDragRelativeSignal,
	onHoverSignal : onHoverSignal,
	onHoverRelativeSignal : onHoverRelativeSignal,
	onDragSignal : onDragSignal,
	onDownSignal : onDownSignal,
	onUpSignal : onUpSignal,
	onOutSignal : onOutSignal
};

module.exports = new Mouse();