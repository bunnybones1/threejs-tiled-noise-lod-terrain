var Mouse = require('../user/inputs/Mouse');
var degToRad = require('../utils/degToRad');

var LazySusan = function(props) {
	props = props || {};
	this.responsiveness = props.responsiveness || .05;
	this.angle = this.angleTarget = 0;
	THREE.Object3D.call( this );

	if(props.debug) this.debug();

	this.onMouseDragRelative = this.onMouseDragRelative.bind(this);

	Mouse.onDragRelativeSignal.add(this.onMouseDragRelative);

}

LazySusan.prototype = Object.create( THREE.Object3D.prototype );

LazySusan.prototype.debug = function() {
	var radius = 2.5;
	var thickness = .04;
	var platformGeometry = new THREE.CylinderGeometry(radius, radius, thickness, 64);
	var material1 = new THREE.MeshPhongMaterial({
		color: 0x113355
	});
	var material2 = new THREE.MeshPhongMaterial({
		color: 0x112233
	});
	var details = 8;
	var boxWidth = radius * .3;
	var boxHeight = thickness * 1.5;
	var boxDepth = radius * .05;
	var boxPosRadius = radius * .855;
	var detailGeometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
	for (var i = 0; i < details; i++) {
		var ratio = i / details;
		var angle = ratio * Math.PI * 2;
		var detailMesh = new THREE.Mesh(detailGeometry, material2);
		this.add(detailMesh);
		detailMesh.position.set(
			Math.cos(angle) * boxPosRadius,
			0,
			Math.sin(angle) * boxPosRadius
		);
		detailMesh.rotation.set(0, -angle, 0);
	};
	var debugMesh = new THREE.Mesh(platformGeometry, material1);
	this.add(debugMesh);
};

LazySusan.prototype.onEnterFrame = function() {
	this.angle -= (-this.angleTarget + this.angle) * this.responsiveness;
	this.rotation.set(0, this.angle, 0);
};

LazySusan.prototype.onMouseDragRelative = function(x, y) {
	this.angleTarget += x;
};

module.exports = LazySusan;