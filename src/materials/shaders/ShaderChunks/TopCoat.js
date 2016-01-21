module.exports = {

	// ENVIRONMENT MAP

	pars_fragment: [

		"	uniform float topCoatReflectivity;",
		"	uniform samplerCube topCoatEnvMap;",
		"	uniform float topCoatFlipEnvMap;",
		"	uniform float topCoatFresnel;",
		"	uniform float topCoatFresnelMin;",

	].join("\n"),

	fragment: [

		"#ifdef USE_ENVMAP",

		"	vec3 vertexToCamera = normalize( -vWorldPosition + cameraPosition );",

		"	#ifdef DOUBLE_SIDED",

		"		vec4 topCoatCubeColor = textureCube( topCoatEnvMap, flipNormal * vec3( topCoatFlipEnvMap * reflectVec.x, reflectVec.yz ) );",

		"	#else",

		"		vec4 topCoatCubeColor = textureCube( topCoatEnvMap, vec3( topCoatFlipEnvMap * reflectVec.x, reflectVec.yz ) );",

		"	#endif",

		"	#ifdef GAMMA_INPUT",

		"		topCoatCubeColor.xyz *= topCoatCubeColor.xyz;",

		"	#endif",
		
		"	#ifdef USE_FRESNEL",

		"		float fresnelBase = pow(1.0 - dot(worldNormal.xyz, vertexToCamera), topCoatFresnel);",

		"		float fresnel = fresnelBase * (1.0 - topCoatFresnelMin) + topCoatFresnelMin;",

		"		topCoatCubeColor.xyz *= fresnel;",

		"	#endif",
		
		"	#ifdef USE_COLOR",

		"		topCoatCubeColor.xyz *= vColor.xyz;",

		"	#endif",
		
		"	#ifdef METAL",

		"		gl_FragColor.xyz *= topCoatCubeColor.xyz * topCoatReflectivity;",

		"	#else",

		"		gl_FragColor.xyz += topCoatCubeColor.xyz * topCoatReflectivity;",
		
		"	#endif",

		"#endif"

	].join("\n"),

};