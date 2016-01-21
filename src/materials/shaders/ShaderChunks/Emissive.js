module.exports = {

	fragment: [

		"#ifdef USE_ENVMAP",

		"	#ifdef USE_FRESNEL",

		"		float fresnelEmissive = fresnelBase * fresnelBase * 5.0;",

		"		gl_FragColor.xyz += emissive.xyz * fresnelEmissive;",

		"	#endif",

		"#endif"

	].join("\n"),

};