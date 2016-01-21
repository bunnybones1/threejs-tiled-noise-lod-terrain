var ShaderChunksLib = require('./ShaderChunks');
var UniformsLib = require('./Uniforms');

module.exports = {
	uniforms: { "tCube": { type: "t", value: null },
				"tFlip": { type: "f", value: -1 } },

	vertexShader: [

		"varying vec3 vWorldPosition;",

		THREE.ShaderChunk[ "logdepthbuf_pars_vertex" ],

		"void main() {",

		"	vec4 worldPosition = modelMatrix * vec4( position, 1.0 );",
		"	vWorldPosition = worldPosition.xyz;",

		"	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

			THREE.ShaderChunk[ "logdepthbuf_vertex" ],

		"}"

	].join("\n"),

	fragmentShader: [

		"uniform samplerCube tCube;",
		"uniform float tFlip;",

		"varying vec3 vWorldPosition;",

		THREE.ShaderChunk[ "logdepthbuf_pars_fragment" ],

		"void main() {",

		"	gl_FragColor = textureCube( tCube, vec3( tFlip * vWorldPosition.x, vWorldPosition.yz ) );",

		"	#ifdef GAMMA_INPUT",

		"		gl_FragColor.xyz = pow(gl_FragColor.xyz, vec3(4.0));",

		"	#endif",

			THREE.ShaderChunk[ "logdepthbuf_fragment" ],

		"}"

	].join("\n")

}