module.exports = {

	pars_fragment: [

		"#ifdef USE_WAVE",

		"#endif"

	].join("\n"),

	fragment: [

		"#ifdef USE_WAVE",

		"#endif"

	].join("\n"),

	pars_vertex: [

		"#ifdef USE_WAVE",

			"uniform float time;",
			"uniform float timeSpeed;",
			"attribute vec3 waveNormal;",

		"#endif"

	].join("\n"),

	vertex : [

		"vec4 mvPosition;",

		"#ifdef USE_SKINNING",

			"mvPosition = modelViewMatrix * skinned;",

		"#endif",

		"#if !defined( USE_SKINNING ) && defined( USE_MORPHTARGETS ) && !defined( USE_WAVE )",

			"mvPosition = modelViewMatrix * vec4( morphed, 1.0 );",

		"#endif",

		"#if defined( USE_WAVE ) && !defined( USE_SKINNING ) && ! defined( USE_MORPHTARGETS )",

			"mvPosition = modelViewMatrix * vec4( position + normal * (sin(time * timeSpeed + position.y*0.1 + position.x*0.1) * 1.3 + 1.3), 1.0 );",

		"#endif",

		"#if !defined( USE_SKINNING ) && ! defined( USE_MORPHTARGETS ) && ! defined( USE_WAVE )",

			"mvPosition = modelViewMatrix * vec4( position, 1.0 );",

		"#endif",

		"gl_Position = projectionMatrix * mvPosition;"

	].join("\n")
};