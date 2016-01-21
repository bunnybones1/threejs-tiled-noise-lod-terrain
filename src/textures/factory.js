function createGradient(colorsAndPositions) {
	require('../gradients/utils/verify')(colorsAndPositions);
	var width = 4;
	var height = 8;
	var texture = THREE.ImageUtils.generateDataTexture(width, height, new THREE.Color(0, .5, .25));
	var data = texture.image.data;
	for (var iy = height - 1; iy >= 0; iy--) {
		var ratio = iy / height;
		var r = ~~(ratio * 255);
		var g = ~~((1-ratio) * 255);
		var b = ~~((1-ratio) * 255);
		for (var ix = width - 1; ix >= 0; ix--) {
			var index = ix + iy * width;
			var i3 = index * 3;
			data[i3] = r;
			data[i3+1] = g;
			data[i3+2] = b;
		}
	};
	texture.needsUpdate = true;
	texture.format = THREE.RGBFormat;
	return texture;
}
module.exports = {
	createGradient: createGradient
};