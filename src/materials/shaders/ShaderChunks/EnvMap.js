module.exports = {

	// ENVIRONMENT MAP

	pars_fragment: [

		"#ifdef USE_ENVMAP",

		//"	varying vec3 vReflect;",

		"#endif"

	].join("\n"),

	fragment: [

		"#ifdef USE_ENVMAP",

		"	vec3 reflectVec;",

		"	vec3 cameraToVertex = normalize( vWorldPosition - cameraPosition );",

			// http://en.wikibooks.org/wiki/GLSL_Programming/Applying_Matrix_Transformations
			// "Transforming Normal Vectors with the Inverse Transformation"

		"	vec3 worldNormal = normalize( vec3( vec4( normal, 0.0 ) * viewMatrix ) );",

		"	reflectVec = reflect( cameraToVertex, worldNormal );",

		"#endif"

	].join("\n"),

	pars_vertex: [

		"#if defined( USE_ENVMAP ) && ! defined( USE_BUMPMAP ) && ! defined( USE_NORMALMAP )",

		//"	varying vec3 vReflect;",

		"	uniform float refractionRatio;",
		"	uniform bool useRefract;",

		"#endif"

	].join("\n"),

	vertex : [

		"#if defined( USE_ENVMAP ) && ! defined( USE_BUMPMAP ) && ! defined( USE_NORMALMAP )",

		"	vec3 worldNormal = mat3( modelMatrix[ 0 ].xyz, modelMatrix[ 1 ].xyz, modelMatrix[ 2 ].xyz ) * objectNormal;",
		"	worldNormal = normalize( worldNormal );",

		"	vec3 cameraToVertex = normalize( worldPosition.xyz - cameraPosition );",

		"	if ( useRefract ) {",

		//"		vReflect = refract( cameraToVertex, worldNormal, refractionRatio );",

		"	} else {",

		//"		vReflect = reflect( cameraToVertex, worldNormal );",

		"	}",

		"#endif"

	].join("\n"),

};