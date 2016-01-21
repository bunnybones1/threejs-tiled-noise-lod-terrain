//environment maps
var MaterialFactory = require('../materials/factory');
var MeshModes = require('../loaders/MeshModes');

var degToRad = require('../utils/degToRad');

var signals = require('../vendor/signals');

var Scene = function(onNewMeshCallback) {
	this.onEnterFrame = this.onEnterFrame.bind(this);
	this.onNewMeshSignal = new signals.Signal();

	var scene = this.scene = new THREE.Scene();
	scene.fog = new THREE.Fog(0xe8e1d7, 0, 15000);

	this.camera = require('../cameras/standard')(0);

	this.lazySusan = new (require('../contraptions').LazySusan)({
		debug: false
	});

	//this.lazySusan.add(this.camera);
	this.scene.add(this.lazySusan);
	this.scene.add(this.camera);
	this.camera.position.x = 0;
	this.camera.position.z = 0;
	this.camera.horizontalVeocity = 0;	

	function environmentObjectCallback(object) {
		scene.add(object);
	};


	var environment = this.environment = new (require('../environments/Landscape'))(this.camera.position, environmentObjectCallback);

	var materials = require('../materials/libraries').basic.init();

	var materialsToTest = [
		materials.stone,
		materials.dirt,
		materials.sand,
		materials.water,
		materials.grass,
	];

	var spheres = this.spheres = require('../utils/MaterialTestFactory').createSpheresRing(materialsToTest);
	this.scene.add(spheres);
}

Scene.prototype = {
	initView: function(view) {
		this.environment.initView(view);
		for (var i = 0; i < this.spheres.children.length; i++) {
			var sphere = this.spheres.children[i];
			sphere.material.envMap = this.environment.cubeMap;
			this.onNewMeshSignal.dispatch(sphere);
		};
		this.testBall = new THREE.Mesh(
			new THREE.SphereGeometry(.2),
			new THREE.MeshBasicMaterial()
		)
		this.scene.add(this.testBall);
		this.camera.position.y = this.environment.landscape.simplex.noise2D(this.camera.position.x, this.camera.position.z) + 2;
	},
	onEnterFrame: function() {
		this.lazySusan.onEnterFrame();
		this.camera.horizontalVeocity -= .1;
		this.camera.position.y += this.camera.horizontalVeocity;
		var height = this.environment.landscape.simplex.noise2D(this.camera.position.x, -this.camera.position.z) + 2;
		if(this.camera.position.y < height) {
			this.camera.position.y = height;
			this.camera.horizontalVeocity = 0;
			if(this.camera.jump) this.camera.horizontalVeocity = 1;
		}
		this.testBall.position.set(this.camera.position.x, height, this.camera.position.z);
		//this.camera.position.y = 100;
		this.environment.landscape.updateCenter(this.camera.position);
	}
}
module.exports = Scene;