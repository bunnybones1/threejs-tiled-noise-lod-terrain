module.exports = function(uniforms, parameters) {
	for(var key in uniforms) {
		if(parameters[key] !== undefined) {
			if (uniforms[key].value instanceof THREE.Color)
				uniforms[key].value.set(parameters[key]);
			else
				uniforms[key].value = parameters[key];
		}
	}
};