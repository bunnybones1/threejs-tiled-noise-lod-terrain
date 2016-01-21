var SuperSimplex = require('../noise/SuperSimplex');
function seedFunction() {
	//return .026537;
	return .126537;
}
function seedFunction2() {
	//return .26537;
	return .46537;
}
var Mesh = function ( ) {
	THREE.Object3D.call( this );

	var layers = [];
	for (var i = 10; i >= 0; i--) {
		var height = Math.pow(3, i);
		layers.push({
			scale: (1 / height) * 4000,
			height: height * 0.000001,
			valley: -1,
			plateaux: 1,
			offset: 0,
			mode: SuperSimplex.DIP
		})
	};
	var simplex = new SuperSimplex(layers, seedFunction);

	var material = new THREE.MeshPhongMaterial({
		color: 0x3377ff,
		ambient: 0x557799,
		specular: 0xffffff,
		shininess: 200,
		side: THREE.DoubleSide,
		//wireframe: true
	});

	var heightScale = 1;
	for (var ilevel = 1; ilevel <= 6; ilevel++) {
		var scale = 24000 / Math.pow(5, ilevel);
		for (var iy = 2; iy >= -2; iy--) {
			var offsetY = scale * iy;
			for (var ix = 2; ix >= -2; ix--) {
				if(ix == 0 && iy == 0 && ilevel != 8) continue;
				var offsetX = scale * ix;
				var lookupScale = 1/scale;
				var geometry = new THREE.PlaneGeometry(scale, scale, 32, 32);
				var height;
				var vertices = geometry.vertices;
				for (var i = vertices.length - 1; i >= 0; i--) {
					vertices[i].z = (simplex.noise2D((vertices[i].x + offsetX), (vertices[i].y + offsetY)) + 1) * heightScale;
					if(vertices[i].x == 0 && vertices[i].y == 0){
						height = vertices[i].z;
					}
				};
				geometry.computeFaceNormals();
				geometry.computeVertexNormals();
				var mesh = new THREE.Mesh(geometry, material);
				mesh.position.x = offsetX;
				mesh.position.y = offsetY;
				this.add(mesh);
			}
		}
	}
	//geometry.needsUpdate = true;
//	var segsX = 100;
//	var segsY = 100;
//	geometry.addAttribute("position", createAttrPositions(segsX, segsY));
//	geometry.addAttribute("index", createAttrIndex(segsX, segsY));
	this.position.y = -2-(simplex.noise2D(0, 0) + 1) * heightScale;
	this.rotation.x = Math.PI * -.5;
};

Mesh.prototype = Object.create( THREE.Object3D.prototype );

module.exports = Mesh;