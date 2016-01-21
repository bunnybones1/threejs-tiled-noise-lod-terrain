module.exports = {

	fragment: [

		"#ifdef USE_MAP",

		"	if(gl_FragColor.x >= 0.93) {",

		"		gl_FragColor.xyz *= 150.0;",

//		"	} else {",

//		"		gl_FragColor.xyz *= 1.0;",

		"	}",

		"#endif"

	].join("\n"),

};