//environment maps
var MaterialFactory = require('../materials/factory');
var MeshModes = require('../loaders/MeshModes');

var degToRad = require('../utils/degToRad');

var signals = require('../vendor/signals');

var Scene = function(onNewMeshCallback) {
	this.onEnterFrame = this.onEnterFrame.bind(this);
	this.onNewMeshSignal = new signals.Signal();

	var scene = this.scene = new THREE.Scene();

	this.camera = require('../cameras/standard')();
	
	this.lazySusan = new (require('../contraptions').LazySusan)({
		debug: false
	});

	this.lazySusan.add(this.camera);
	this.scene.add(this.lazySusan);

	function environmentObjectCallback(object) {
		scene.add(object);
	};


	var environment = this.environment = new (require('../environments/Basic'))(environmentObjectCallback);

	var materials = require('../materials/libraries').basic.init();

	var materialsToTest = [
		materials.stone,
		materials.dirt,
		materials.sand,
		materials.water,
		materials.grass,
		materials.ass
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
		};
	},
	onEnterFrame: function() {
		this.lazySusan.onEnterFrame();
	}
}
module.exports = Scene;