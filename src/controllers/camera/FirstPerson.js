var Mouse = require('../../user/inputs/Mouse');
var KeyBoard = require('../../user/inputs/KeyBoard');
var KeyCodes = require('../../user/inputs/KeyCodes');
var xTemp = new THREE.Vector3();
var yTemp = new THREE.Vector3();
var zTemp = new THREE.Vector3();
var rollMatrix = new THREE.Matrix4();
var FirstPerson = function(props) {
	this.update = this.update.bind(this);
	this.mouseDownToAim = props.mouseDownToAim ? props.mouseDownToAim : true;
	this.object = props.camera;
	this.init();
    this.lookSpeed = 0.8;
    this.movementSpeed = .2;
    this.noFly = true;
    this.lookVertical = true;
    this.constrainVertical = true;
    this.verticalMin = 0.1;
    this.verticalMax = 3.0;
    this.lon = 65;
    this.lat = -30;
    this.fast = false;
	this.attachInputs();
};
FirstPerson.prototype = {
	init: function() {

		this.target = new THREE.Vector3( 0, 0, 0 );

		this.movementSpeed = 1.0;
		this.lookSpeed = 0.015;

		this.lookVertical = true;
		this.autoForward = false;
		// this.invertVertical = false;

		this.activeLook = true;

		this.heightSpeed = false;
		this.heightCoef = 1.0;
		this.heightMin = 0.0;
		this.heightMax = 1.0;

		this.constrainVertical = false;
		this.verticalMin = 0;
		this.verticalMax = Math.PI;

		this.autoSpeedFactor = 0.0;

		this.mouseX = 0;
		this.mouseY = 0;

		this.lat = 0;
		this.lon = 0;
		this.phi = 0;
		this.theta = 0;

		this.moveForward = false;
		this.moveBackward = false;
		this.moveLeft = false;
		this.moveRight = false;
		this.freeze = false;

		this.mouseDragOn = false;
	},


	update: function( delta ) {

		this.moveForward = KeyBoard.keyDownStates[KeyCodes.KEY_W];
		this.moveBackward = KeyBoard.keyDownStates[KeyCodes.KEY_S];
		this.moveLeft = KeyBoard.keyDownStates[KeyCodes.KEY_A];
		this.moveRight = KeyBoard.keyDownStates[KeyCodes.KEY_D];
		this.moveUp = KeyBoard.keyDownStates[KeyCodes.KEY_R];
		this.moveDown = KeyBoard.keyDownStates[KeyCodes.KEY_F];
		this.fast = KeyBoard.keyDownStates[KeyCodes.SHIFT];
		this.object.jump = KeyBoard.keyDownStates[KeyCodes.SPACE];

		if ( this.freeze ) {

			return;

		}

		if ( this.heightSpeed ) {

			var y = THREE.Math.clamp( this.object.position.y, this.heightMin, this.heightMax );
			var heightDelta = y - this.heightMin;

			this.autoSpeedFactor = delta * ( heightDelta * this.heightCoef );

		} else {

			this.autoSpeedFactor = 0.0;

		}

		var actualMoveSpeed = delta * this.movementSpeed;
		if(this.fast) actualMoveSpeed *= 5;

		if ( this.moveForward || ( this.autoForward && !this.moveBackward ) ) this.object.translateZ( - ( actualMoveSpeed + this.autoSpeedFactor ) );
		if ( this.moveBackward ) this.object.translateZ( actualMoveSpeed );

		if ( this.moveLeft ) this.object.translateX( - actualMoveSpeed );
		if ( this.moveRight ) this.object.translateX( actualMoveSpeed );

		if ( this.moveUp ) this.object.translateY( actualMoveSpeed );
		if ( this.moveDown ) this.object.translateY( - actualMoveSpeed );

		var actualLookSpeed = delta * this.lookSpeed;

		if ( !this.activeLook ) {

			actualLookSpeed = 0;

		}

		var verticalLookRatio = 1;

		if ( this.constrainVertical ) {

			verticalLookRatio = Math.PI / ( this.verticalMax - this.verticalMin );

		}

		this.lon += this.mouseX * actualLookSpeed;
		if( this.lookVertical ) this.lat -= this.mouseY * actualLookSpeed * verticalLookRatio;

		this.lat = Math.max( - 85, Math.min( 85, this.lat ) );
		this.phi = THREE.Math.degToRad( 90 - this.lat );

		this.theta = THREE.Math.degToRad( this.lon );

		if ( this.constrainVertical ) {

			this.phi = THREE.Math.mapLinear( this.phi, 0, Math.PI, this.verticalMin, this.verticalMax );

		}

		var targetPosition = this.target,
			position = this.object.position;

		targetPosition.x = position.x + 100 * Math.sin( this.phi ) * Math.cos( this.theta );
		targetPosition.y = position.y + 100 * Math.cos( this.phi );
		targetPosition.z = position.z + 100 * Math.sin( this.phi ) * Math.sin( this.theta );

		this.object.lookAt( targetPosition );

	},

	attachInputs: function() {
		function onMouseMove( x, y ) {
			var dirX = x > 0 ? 1 : -1;
			var dirY = y > 0 ? 1 : -1;
			this.mouseX = (Math.pow(Math.abs(x), 2)) * dirX;
			this.mouseY = (Math.pow(Math.abs(y), 2)) * dirY;

		};

		Mouse.onMoveSignal.add(onMouseMove.bind(this));
	},

}
module.exports = FirstPerson;