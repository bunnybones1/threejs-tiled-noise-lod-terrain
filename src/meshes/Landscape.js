var SuperSimplex = require('../noise/SuperSimplex');
var SuperDuperSimplex = require('../noise/SuperDuperSimplex');
function seedFunction() {
	//return .026537;
	return .526537;
}
function seedFunction2() {
	//return .26537;
	return .846537;
}

var LandscapeLevelTile = function (tileScale, offsetX, offsetY, material, simplex, location, indexX, indexY, wrapIndex, last) {
	this.last = last;
	this.indexX = indexX;
	this.indexY = indexY;
	this.wrapIndex = wrapIndex;
	this.tileScale = tileScale;
	this.fullScale = tileScale * wrapIndex;
	this.unitGroupX = this.indexX <= 0 ? -.5 : 0;
	this.unitGroupY = this.indexY <= 0 ? -.5 : 0;
	this.fullTileX = this.indexX / wrapIndex;
	this.fullTileY = this.indexY / wrapIndex;
	this.halfTileOffset = 1/(2*wrapIndex);
	this.lastFlooredLocalGroupX = Infinity;
	this.lastFlooredLocalGroupY = Infinity;
	this.simplex = simplex;
	this.nextX = 0;
	this.nextY = 0;
	this.desiredVisibility = true;

	var segs = 16;
	/*
	material = new THREE.MeshPhongMaterial({
		color: ~~(0xffffff * Math.random()),
		ambient: 0x112244,
		specular: 0x553311,
		shininess: 10,
		wireframe: false,
		shading: THREE.FlatShading
	});
	*/
	var geometry = new THREE.PlaneGeometry(tileScale, tileScale, segs, segs);
	THREE.Mesh.call(this, geometry, material);
	this.position.y = offsetY;
}
LandscapeLevelTile.prototype = Object.create(THREE.Mesh.prototype);

LandscapeLevelTile.prototype.reposition = function(x, y) {
	if(this.position.x != this.nextX) this.position.x = this.nextX;
	if(this.position.y != this.nextY) this.position.y = this.nextY;
	if(this.desiredVisibility != this.visible) this.visible = this.desiredVisibility;
	var floatLocalX = x / this.fullScale;
	var floatLocalY = y / this.fullScale;
	var floatLocalGroupX = floatLocalX - this.unitGroupX + .25;
	var floatLocalGroupY = floatLocalY - this.unitGroupY + .25;
	var flooredLocalGroupX = Math.floor(floatLocalGroupX);
	var flooredLocalGroupY = Math.floor(floatLocalGroupY);
	var tileX = flooredLocalGroupX + this.fullTileX - this.halfTileOffset;
	var tileY = flooredLocalGroupY + this.fullTileY - this.halfTileOffset;
	var tileIndexPosX = tileX * this.wrapIndex;
	var tileIndexPosY = tileY * this.wrapIndex;
	var localPosInTileUnitX = Math.floor(floatLocalX * this.wrapIndex + .5);
	var localPosInTileUnitY = Math.floor(floatLocalY * this.wrapIndex + .5);
	var localDeltaX = localPosInTileUnitX - tileIndexPosX;
	var localDeltaY = localPosInTileUnitY - tileIndexPosY;
	if(!this.last && localDeltaX > -.51 && localDeltaX < .51 && localDeltaY > -.51 && localDeltaY < .51) {
	// if(!this.last && localDeltaX > -.51 && localDeltaX < .51) {
		this.desiredVisibility = false;
	} else {
		this.desiredVisibility = true;
	}
	if(flooredLocalGroupX == this.lastFlooredLocalGroupX && flooredLocalGroupY == this.lastFlooredLocalGroupY) return;
	// if(flooredLocalGroupX == this.lastFlooredLocalGroupX) return;
	this.lastFlooredLocalGroupX = flooredLocalGroupX;
	this.lastFlooredLocalGroupY = flooredLocalGroupY;
	// var y = this.position.y;
	var vertices = this.geometry.vertices;
	var simplex = this.simplex;
	var x = this.nextX = tileIndexPosX * this.tileScale;
	var y = this.nextY = tileIndexPosY * this.tileScale;
	for (var i = vertices.length - 1; i >= 0; i--) {
		vertices[i].z = simplex.noise2D((vertices[i].x + x), (vertices[i].y + y));
	};
	this.geometry.verticesNeedUpdate = true;
	this.geometry.normalsNeedUpdate = true;
	//this.geometry.tangentsNeedUpdate = true;
	this.geometry.computeFaceNormals();
	this.geometry.computeVertexNormals();
	this.geometry.computeBoundingBox();
	this.geometry.computeBoundingSphere();
}

var LandscapeLevel = function (scale, material, simplex, location, last, debug) {
	THREE.Object3D.call(this);
	this.tileScale = scale;
	this.tiles = [];
	this.fullX = scale * 6;
	this.relAnchorX = 0;
	this.jumpThreshold = scale * 3;
	for (var iy = 3; iy >= -2; iy--) {
		var iyHalf = iy - .5;
		var offsetY = scale * iyHalf;
		for (var ix = 3; ix >= -2; ix--) {
			var ixHalf = ix - .5;
			var offsetX = scale * ixHalf;

			var tile = new LandscapeLevelTile(scale, offsetX, offsetY, material, simplex, location, ix, iy, 6, last);

			//if((ix == 1 || ix == 0) && (iy == 0 || iy == 1) && !last) tile.visible = false;
			//else 
			this.add(tile);

			this.tiles.push(tile);
			if(debug && iy == 0) tile.debug = true;
		}
	}
}
LandscapeLevel.prototype = Object.create(THREE.Object3D.prototype);

LandscapeLevel.prototype.updateCenter = function(center) {
	for (var i = this.tiles.length - 1; i >= 0; i--) {
		var tile = this.tiles[i];
		tile.reposition(center.x, -center.z);
	}
}

var Landscape = function (size, totalLevels, location) {
	THREE.Object3D.call( this );
	this.levels= [];

	size = size === undefined ? 24000 : size;	//24000
	totalLevels = totalLevels === undefined ? 10 : totalLevels;

	var layers = [];
	for (var i = 16; i >= 0; i--) {
		var height = Math.pow(3, i);
		layers.push({
			scale: (1 / height) * 400,
			height: height * 0.0001,
			valley: -1,
			plateaux: 1,
			offset: 0,
			mode: SuperSimplex.DIP
		})
	};
	var simplex = new SuperSimplex(layers, seedFunction);
	layers = [];
	for (var i = 16; i >= 0; i--) {
		var height = Math.pow(3, i);
		layers.push({
			scale: (1 / height) * 40,
			height: height * 0.0003 + .015 * (Math.pow((i / 16), 3)) * 1000000,
			valley: -.001,
			plateaux: .001,
			offset: 0
		})
	};
	var simplex2 = new SuperSimplex(layers, seedFunction2);

	this.simplex = simplex;
	// this.simplex = simplex = new SuperDuperSimplex(simplex, simplex2, SuperDuperSimplex.MIN, -10);

	var material = new THREE.MeshPhongMaterial({
		color: 0x553322,
		ambient: 0x112244,
		specular: 0x553311,
		shininess: 10,
		wireframe: false
	});

	for (var ilevel = 1; ilevel <= totalLevels; ilevel++) {
		var scale = size / Math.pow(3, ilevel);
		var levelObject = new LandscapeLevel(scale, material, simplex, location, ilevel == totalLevels, ilevel == 2);
		this.add(levelObject);
		this.levels.push(levelObject);

	}
	//geometry.needsUpdate = true;
//	var segsX = 100;
//	var segsY = 100;
//	geometry.addAttribute("position", createAttrPositions(segsX, segsY));
//	geometry.addAttribute("index", createAttrIndex(segsX, segsY));
	this.rotation.x = Math.PI * -.5;
};

Landscape.prototype = Object.create( THREE.Object3D.prototype );

Landscape.prototype.updateCenter = function(center) {
	console.clear();
	for (var i = this.levels.length - 1; i >= 0; i--) {
		this.levels[i].updateCenter(center);
	};
}

module.exports = Landscape;