module.exports = {
	create : function(path) {
		return THREE.ImageUtils.loadTextureCube([
			path + 'cubemap0003.png',
			path + 'cubemap0002.png',
			path + 'cubemap0004.png',
			path + 'cubemap0005.png',
			path + 'cubemap0000.png',
			path + 'cubemap0001.png'
		]);
	}
}