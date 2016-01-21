var Simplex = require('simplex-noise');

function SuperSimplex(layers, seedFunction) {
	var len = layers.length;
	for (var i = len - 1; i >= 0; i--) {
		layers[i].simplex = new Simplex(function(){
			return (seedFunction() + i/len) % 1;
		});
	};
	this.noise2D = this.noise2D.bind(this);
	this.layers = layers;
}

SuperSimplex.DIP = -1;
SuperSimplex.NORMAL = 0;
SuperSimplex.BOUNCE = 1;

SuperSimplex.prototype = {
	noise2D: function(x, y) {
		var val = 0;
		for (var i = this.layers.length - 1; i >= 0; i--) {;
			var layer = this.layers[i];
			var temp = (Math.max(layer.valley, Math.min(layer.plateaux, (layer.simplex.noise2D(x * layer.scale, y * layer.scale)))) + layer.offset) * layer.height;
			if(layer.mode == SuperSimplex.DIP) temp = 1-Math.abs(1-temp);
			else if(layer.mode == SuperSimplex.BOUNCE) temp = Math.abs(temp);
			val += temp;
		};
		return val;
	}
}
module.exports = SuperSimplex;
