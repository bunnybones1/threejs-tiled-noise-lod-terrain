var configureUniforms = require('./configureUniforms');
module.exports = function(parameters) {
	configureUniforms(parameters.uniforms, parameters);
	return parameters;
};