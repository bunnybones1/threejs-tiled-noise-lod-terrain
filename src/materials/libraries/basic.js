var MaterialFactory = require('../factory');
var URLParams = require('../../utils/URLParams');
var materials = {};
function init() {
	var stone = new THREE.MeshPhongMaterial({
		combine: THREE.MixOperation,
		reflectivity: .15,
		color: 0x555555,
		ambient: 0x554433,
		shininess: 0,

	});
	var dirt = new THREE.MeshPhongMaterial({
		combine: THREE.MixOperation,
		reflectivity: .15,
		color: 0x996622,
		ambient: 0x775533,
		shininess: 0
	});
	var sand = new THREE.MeshPhongMaterial({
		combine: THREE.MixOperation,
		reflectivity: .15,
		color: 0xffffff,
		ambient: 0xffdd66,
		shininess: 0
	});
	var water = new THREE.MeshPhongMaterial({
		combine: THREE.AddOperation,
		reflectivity: .6,
		color: 0x000000,
		specular: 0x44aadd,
		ambient: 0x3366bb,
		shininess: 250
	});
	var grass = new THREE.MeshPhongMaterial({
		combine: THREE.MixOperation,
		reflectivity: .35,
		color: 0x33ee22,
		specular: 0x554422,
		ambient: 0x33bb33,
		shininess: 20
	});
	var ass = new THREE.MeshPhongMaterial({
		combine: THREE.MixOperation,
		reflectivity: 0,
		color: 0xffcebd,
		specular: 0x200a03,
		ambient: 0xfc7748,
		shininess: 20
	});
	materials.stone = stone;
	materials.dirt = dirt;
	materials.sand = sand;
	materials.water = water;
	materials.grass = grass;
	materials.ass = ass;

	delete materials.init;

	return materials;
}

materials.init = init;

module.exports = materials;

