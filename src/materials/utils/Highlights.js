var selectedUnformsToAlter = {
	basic: {
		useUniforms: false,
		properties: [
			'color'
		]
	},
	phong: {
		useUniforms: false,
		properties: [
			'emissive'
		]
	},
	default: {
		useUniforms: true,
		properties: [
			'emissive'
		]
	}
};

var selectedMaterialsByMaterials = new Hashtable();
var materialsBySelectedMaterials = new Hashtable();

function highlight(object) {
	var propertiesToAlter;
	var original = object.material;
	var clone = original.clone();
	if(clone.uniforms && clone.uniforms.emissive) {
		propertiesToAlter = selectedUnformsToAlter['default'];
	} else if(clone.emissive) {
		propertiesToAlter = selectedUnformsToAlter['phong'];
	} else {
		propertiesToAlter = selectedUnformsToAlter['basic'];
	}
	for (var i = propertiesToAlter.properties.length - 1; i >= 0; i--) {
		var propertyName = propertiesToAlter.properties[i];
		var property;
		if(propertiesToAlter.useUniforms) {
			property = clone.uniforms[propertyName].value;
		} else {
			property = clone[propertyName];
		}
		if(!property) continue;
		property.setRGB(
			property.r + .25,
			property.g + .25,
			property.b + .15
		);
	};
	selectedMaterialsByMaterials.put(original, clone);
	materialsBySelectedMaterials.put(clone, original);
	object.material = clone;
}

function unhighlight(object) {
	var original = materialsBySelectedMaterials.get(object.material);
	materialsBySelectedMaterials.remove(original);
	selectedMaterialsByMaterials.remove(object.material);
	object.material = original;
}

module.exports = {
	highlight: highlight,
	unhighlight: unhighlight
}