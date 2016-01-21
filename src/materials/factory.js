var ShadersLib = require('./Shaders');
var MaterialUtils = require('./utils');
var _ = require('./../../node_modules/lodash/dist/lodash.min');
function createBasicFakeHDR(overrides) {
	var basicFakeHDRShader = ShadersLib.basicFakeHDR;
	var params = {
		fragmentShader: basicFakeHDRShader.fragmentShader,
		vertexShader: basicFakeHDRShader.vertexShader,
		uniforms: THREE.UniformsUtils.clone(basicFakeHDRShader.uniforms),
		defines:{
			//METAL: true,
			USE_FRESNEL: true,
			USE_MAP: true,
			//USE_WAVE: true
		}
	};
	var material = new THREE.ShaderMaterial(
		MaterialUtils.prepare(_.extend(params, overrides))
	);
	material.name = "basicFakeHDR";
	return material;
};

function createPlastic(overrides) {
	var fresnelShader = ShadersLib.plastic;
	var params = {
		fragmentShader: fresnelShader.fragmentShader,
		vertexShader: fresnelShader.vertexShader,
		uniforms: THREE.UniformsUtils.clone(fresnelShader.uniforms),
		diffuse: new THREE.Color(0, 0, 0),
		lights: true,
		specular: 0x000000,
		ambient: 0x000000,

		shininess: 20,
		topCoatEnvMap: undefined,
		topCoatReflectivity:  .5,
		topCoatFresnel:  .5,
		vertexColors: THREE.VertexColors,
		defines:{
			//USE_COLORS: true,
			//METAL: true,
			USE_FRESNEL: true,
			USE_ENVMAP: true,
			//USE_WAVE: true
		},

		//side : THREE.BackSide
	};
	var material = new THREE.ShaderMaterial(
		MaterialUtils.prepare(_.extend(params, overrides))
	);
	material.name = "plastic";
	return material;
};

function createSkyBox(cubeMap) {
	var shader = ShadersLib['cubeGamma']; // init cube shader from built-in lib
	shader.uniforms['tCube'].value = cubeMap; // apply textures to shader

	// create shader material
	return new THREE.ShaderMaterial( {
		fragmentShader: shader.fragmentShader,
		vertexShader: shader.vertexShader,
		uniforms: shader.uniforms,
		depthWrite: false,
		side: THREE.BackSide,
		ambient: 0x000000,
		color: 0x000000
	});
};

function createRubber(overrides) {
	var fresnelShader = ShadersLib.plastic;
	var params = {
		fragmentShader: fresnelShader.fragmentShader,
		vertexShader: fresnelShader.vertexShader,
		uniforms: THREE.UniformsUtils.clone(fresnelShader.uniforms),
		diffuse: new THREE.Color(8, 8, 8),
		lights: true,
		specular: 0x000000,
		ambient: 0xffffff,

		shininess: 0,
		topCoatEnvMap: undefined,
		topCoatReflectivity:  .5,
		topCoatFresnel:  .5,
		vertexColors: THREE.VertexColors,
		defines:{
			USE_MAP: true,
			//USE_COLORS: true,
			METAL: true,
			USE_FRESNEL: true,
			USE_ENVMAP: true,
			//USE_WAVE: true
		},
		//side : THREE.BackSide
	};
	params = _.extend(params, overrides)
	params.defines.USE_MAP = !!params.map;
	var material = new THREE.ShaderMaterial(
		MaterialUtils.prepare(params)
	);
	material.name = "rubber";
	return material;
};

function createAnonymousBlack(overrides) {
	var params = {
		color: 0x000000,
		lights: true,
		specular: 0x000000,
		vertexColors: THREE.VertexColors,
		//metal: true,

		//side : THREE.BackSide
	};
	var material = new THREE.MeshPhongMaterial(_.extend(params, overrides));
	material.name = "AnonymousBlack"
	return material;
};

function createPlasticXray(overrides) {
	var plasticShader = ShadersLib.plastic;
	var params = {
		fragmentShader: plasticShader.fragmentShader,
		vertexShader: plasticShader.vertexShader,
		uniforms: THREE.UniformsUtils.clone(plasticShader.uniforms),
		diffuse: new THREE.Color(.5, .5, .5),
		lights: true,
		specular: 0x000000,
		ambient: 0x000000,

		shininess: 20,
		topCoatEnvMap: undefined,
		topCoatReflectivity:  .5,
		topCoatFresnel:  .5,
		defines:{
			//METAL: true,
			USE_ENVMAP: true,
			//USE_WAVE: true
		},
		transparent: true,
		blending: THREE.AdditiveBlending,
		depthTest: false,
		depthWrite: false,

		//side : THREE.BackSide
	};
	var material = new THREE.ShaderMaterial(
		MaterialUtils.prepare(_.extend(params, overrides))
	);
	material.name ="plasticXray";
	return material;
};

function createChrome(overrides) {
	var params = {
		color: 0x000000,
		lights: true,
		specular: 0x000000,
		envMap: undefined,
		shininess: 220,
		reflectivity: 1,
		combine: THREE.AddOperation,
		vertexColors: THREE.VertexColors
		//metal: true,

		//side : THREE.BackSide
	};
	var material = new THREE.MeshPhongMaterial(_.extend(params, overrides));
	material.name = "chrome";
	return material;
};

function createChrome2(overrides) {
	var fresnelShader = ShadersLib.plastic;
	var params = {
		fragmentShader: fresnelShader.fragmentShader,
		vertexShader: fresnelShader.vertexShader,
		uniforms: THREE.UniformsUtils.clone(fresnelShader.uniforms),
		diffuse: new THREE.Color(0, 0, 0),
		lights: true,
		specular: 0x000000,
		ambient: 0x000000,

		shininess: 20,
		topCoatEnvMap: undefined,
		topCoatReflectivity:  1,
		topCoatFresnel:  .5,
		vertexColors: THREE.VertexColors,
		defines:{
			//USE_COLORS: true,
			//METAL: true,
			USE_ENVMAP: true,
			//USE_WAVE: true
		},

		//side : THREE.BackSide
	};
	var material = new THREE.ShaderMaterial(
		MaterialUtils.prepare(_.extend(params, overrides))
	);
	material.name = "chrome2";
	return material;
};

function createGlassTint(overrides) {
	var params = {
		color: 0x000000,
		lights: false,
		specular: 0x000000,

		shininess: 100,
		ambient: 0x000000,
		emissive: 0x557799,
		transparent: true,
		depthTest: true,
		depthWrite: false,
		blending: THREE.MultiplyBlending,

		side : THREE.DoubleSide
	};
	var material = new THREE.MeshPhongMaterial(_.extend(params, overrides));
	material.name = "glassTint";
	return material;
};

function createGlass(overrides) {
	var fresnelShader = ShadersLib.plastic;
	var params = {
		fragmentShader: fresnelShader.fragmentShader,
		vertexShader: fresnelShader.vertexShader,
		uniforms: THREE.UniformsUtils.clone(fresnelShader.uniforms),
		diffuse: new THREE.Color(0, 0, 0),
		lights: true,
		specular: 0x000000,
		ambient: 0x000000,
		shininess: 220,
		transparent: true,
		topCoatEnvMap: undefined,
		topCoatReflectivity:  3,
		topCoatFresnel:  1,
		topCoatFresnelMin:  .5,
		defines:{
			//METAL: true,
			USE_ENVMAP: true,
			USE_FRESNEL: true,
			//USE_WAVE: true
		},
		transparent: true,
		blending: THREE.AdditiveBlending,
		depthTest: true,
		depthWrite: false,

		//side : THREE.BackSide
	};
	var material = new THREE.ShaderMaterial(
		MaterialUtils.prepare(_.extend(params, overrides))
	);
	material.name = "glass";
	return material;
};

module.exports = {
	createBasicFakeHDR: createBasicFakeHDR,
	createPlastic: createPlastic,
	createRubber: createRubber,
	createAnonymousBlack: createAnonymousBlack,
	createPlasticXray: createPlasticXray,
	createChrome: createChrome,
	createChrome2: createChrome2,
	createGlassTint: createGlassTint,
	createGlass: createGlass,
	createSkyBox: createSkyBox
	
};