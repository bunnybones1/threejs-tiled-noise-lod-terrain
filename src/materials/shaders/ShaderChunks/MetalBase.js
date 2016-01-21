module.exports = {

	// ENVIRONMENT MAP

	pars_fragment: [

		"#ifdef USE_ENVMAP",

		"	uniform float metalBaseReflectivity;",
		"	uniform vec3 metalBaseColor;",
		"	uniform samplerCube metalBaseEnvMap;",
		"	uniform float metalBaseFlipEnvMap;",

		"#endif"

	].join("\n"),

	fragment: [

		"#ifdef USE_ENVMAP",

		"	#ifdef DOUBLE_SIDED",

		"		float flipNormal = ( -1.0 + 2.0 * float( gl_FrontFacing ) );",
		"		vec4 metalBaseCubeColor = textureCube( metalBaseEnvMap, flipNormal * vec3( metalBaseFlipEnvMap * reflectVec.x, reflectVec.yz ) );",

		"	#else",

		"		vec4 metalBaseCubeColor = textureCube( metalBaseEnvMap, vec3( metalBaseFlipEnvMap * reflectVec.x, reflectVec.yz ) );",

		"	#endif",

		"	#ifdef GAMMA_INPUT",

		"		metalBaseCubeColor.xyz *= metalBaseCubeColor.xyz;",

		"	#endif",

		"	#ifdef USE_COLOR",

		"		metalBaseCubeColor.xyz *= vColor.xyz;",

		"	#endif",
		//"	metalBaseCubeColor.xyz *= 0.0;",

		"	gl_FragColor.xyz += metalBaseCubeColor.xyz * metalBaseReflectivity * metalBaseColor;",


		"#endif"

	].join("\n")

	//'pars_vertex' and 'vertex' are not specific to this shader
	//this shader simply require's one inclusion of envmap's 'pars_vertex' and 'vertex' for it to work

};