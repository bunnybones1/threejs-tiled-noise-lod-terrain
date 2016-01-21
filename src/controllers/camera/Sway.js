var ParentUtils = require('../../utils/Parent');
var positionByAnglesAndDistance = require('../../utils/positionByAnglesAndDistance');
var Sway = function(props) {
	this.onEnterFrame = this.onEnterFrame.bind(this);
	this.swayStrength = props.swayStrength ? props.swayStrength : new THREE.Vector2(0.15, 0.05);
	this.swaySpeed = props.swaySpeed ? props.swaySpeed : .5;
	this.distance = props.distance ? props.distance : 8.50;
	this.camera = props.camera;
	this.lookAtTarget = props.lookAtTarget ? props.lookAtTarget : new THREE.Vector3();
	this.angle = props.angle !== undefined ? props.angle : new THREE.Vector2();
	this._angleOfSway = new THREE.Vector2();
	this._angle = new THREE.Vector2();
	this.targetAngle = new THREE.Vector2();
	this.onDollyInjected = this.onDollyInjected.bind(this);
	ParentUtils.injectObjectUnderObject({
		object3D: this.camera,
		callback: this.onDollyInjected
	});
};
var Mouse = require('../../user/inputs/Mouse');
Sway.prototype = {
	onEnterFrame: function() {
		this.targetAngle.y = -Mouse.position.x * this.swayStrength.x;
		this.targetAngle.x = -Mouse.position.y * this.swayStrength.y;
		this._angleOfSway.add(this.targetAngle.sub(this._angleOfSway).multiplyScalar(this.swaySpeed));
		this._angle.x = this._angleOfSway.x + this.angle.x;
		this._angle.y = this._angleOfSway.y + this.angle.y;
		positionByAnglesAndDistance(this.camera, this._angle, this.distance);
		this.camera.lookAt(this.lookAtTarget);
//		if(this.dolly) this.dolly.rotation.y += 0.01;
	},
	onDollyInjected: function(dolly) {
		this.dolly = dolly;
	}
}
module.exports = Sway;