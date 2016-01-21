module.exports = {

	// ENVIRONMENT MAP

	pars_fragment: [

		"#ifdef USE_ENVMAP",

		"	uniform float reflectivity2;",
		"	uniform samplerCube envMap2;",
		"	uniform int combine2;",


		"#endif"

	].join("\n"),

	fragment: [

		"#ifdef USE_ENVMAP",

		"	vec3 vertexToCamera = normalize( -vWorldPosition + cameraPosition );",

		"	#ifdef DOUBLE_SIDED",

		"		vec4 cubeColor2 = textureCube( envMap2, flipNormal * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );",

		"	#else",

		"		vec4 cubeColor2 = textureCube( envMap2, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );",

		"	#endif",

		"	#ifdef GAMMA_INPUT",

		"		cubeColor2.xyz *= cubeColor2.xyz;",

		"	#endif",

		"	float fresnel = pow(1.0 - dot(worldNormal.xyz, vertexToCamera), 1.5);",

		"	cubeColor2.xyz *= fresnel;",

		//"	cubeColor2.xyz *= 0.0;",

		"	if ( combine2 == 1 ) {",

		"		gl_FragColor.xyz = mix( gl_FragColor.xyz, cubeColor2.xyz, specularStrength * reflectivity2 );",

		"	} else if ( combine2 == 2 ) {",

		"		gl_FragColor.xyz += cubeColor2.xyz * specularStrength * reflectivity2;",

		"	} else {",

		"		gl_FragColor.xyz = mix( gl_FragColor.xyz, gl_FragColor.xyz * cubeColor2.xyz, specularStrength * reflectivity2 );",

		"	}",

		"#endif"

	].join("\n"),

};