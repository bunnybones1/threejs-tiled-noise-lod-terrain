var ShaderChunksLib = require('./ShaderChunks');
var UniformsLib = require('./Uniforms');

module.exports = {
	uniforms: THREE.UniformsUtils.merge( [

		THREE.UniformsLib[ "common" ],
		THREE.UniformsLib[ "fog" ],
		THREE.UniformsLib[ "shadowmap" ]

	] ),

	vertexShader: [

		THREE.ShaderChunk[ "map_pars_vertex" ],
		THREE.ShaderChunk[ "lightmap_pars_vertex" ],
		THREE.ShaderChunk[ "envmap_pars_vertex" ],
		THREE.ShaderChunk[ "color_pars_vertex" ],
		THREE.ShaderChunk[ "morphtarget_pars_vertex" ],
		THREE.ShaderChunk[ "skinning_pars_vertex" ],
		THREE.ShaderChunk[ "shadowmap_pars_vertex" ],
		THREE.ShaderChunk[ "logdepthbuf_pars_vertex" ],

		"void main() {",

			THREE.ShaderChunk[ "map_vertex" ],
			THREE.ShaderChunk[ "lightmap_vertex" ],
			THREE.ShaderChunk[ "color_vertex" ],
			THREE.ShaderChunk[ "skinbase_vertex" ],

		"	#ifdef USE_ENVMAP",

			THREE.ShaderChunk[ "morphnormal_vertex" ],
			THREE.ShaderChunk[ "skinnormal_vertex" ],
			THREE.ShaderChunk[ "defaultnormal_vertex" ],

		"	#endif",

			THREE.ShaderChunk[ "morphtarget_vertex" ],
			THREE.ShaderChunk[ "skinning_vertex" ],
			THREE.ShaderChunk[ "default_vertex" ],
			THREE.ShaderChunk[ "logdepthbuf_vertex" ],

			THREE.ShaderChunk[ "worldpos_vertex" ],
			THREE.ShaderChunk[ "envmap_vertex" ],
			THREE.ShaderChunk[ "shadowmap_vertex" ],

		"}"

	].join("\n"),

	fragmentShader: [

		"uniform vec3 diffuse;",
		"uniform float opacity;",

		THREE.ShaderChunk[ "color_pars_fragment" ],
		THREE.ShaderChunk[ "map_pars_fragment" ],
		THREE.ShaderChunk[ "lightmap_pars_fragment" ],
		THREE.ShaderChunk[ "envmap_pars_fragment" ],
		THREE.ShaderChunk[ "fog_pars_fragment" ],
		THREE.ShaderChunk[ "shadowmap_pars_fragment" ],
		THREE.ShaderChunk[ "specularmap_pars_fragment" ],
		THREE.ShaderChunk[ "logdepthbuf_pars_fragment" ],

		"void main() {",

		"	gl_FragColor = vec4( diffuse, opacity );",

			THREE.ShaderChunk[ "logdepthbuf_fragment" ],
			THREE.ShaderChunk[ "map_fragment" ],
			ShaderChunksLib[ "scaleColor" ].fragment,
			THREE.ShaderChunk[ "alphatest_fragment" ],
			THREE.ShaderChunk[ "specularmap_fragment" ],
			THREE.ShaderChunk[ "lightmap_fragment" ],
			THREE.ShaderChunk[ "color_fragment" ],
			THREE.ShaderChunk[ "envmap_fragment" ],
			THREE.ShaderChunk[ "shadowmap_fragment" ],

			THREE.ShaderChunk[ "linear_to_gamma_fragment" ],

			THREE.ShaderChunk[ "fog_fragment" ],

		"}"

	].join("\n")

}