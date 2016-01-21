var configureUniforms = require('./configureUniforms');
module.exports = function(material, parameters){
	configureUniforms(material.uniforms, parameters);
}