var Simplex = require('simplex-noise');

function SuperDuperSimplex(simplex1, simplex2, mode, offset) {
	this.simplex1 = simplex1;
	this.simplex2 = simplex2;
	this.mode = mode;
	this.offset = offset;
}

SuperDuperSimplex.MIN = -1;
SuperDuperSimplex.ADD = 0;
SuperDuperSimplex.MAX = 1;

SuperDuperSimplex.prototype = {
	noise2D: function(x, y) {
		if(this.mode == SuperDuperSimplex.MIN) return Math.min(this.simplex1.noise2D(x, y), this.simplex2.noise2D(x, y) + this.offset);
		else if(this.mode == SuperDuperSimplex.MAX) return Math.max(this.simplex1.noise2D(x, y), this.simplex2.noise2D(x, y) + this.offset);
		else return this.simplex1.noise2D(x, y) + this.simplex2.noise2D(x, y) + this.offset;
	}
}
module.exports = SuperDuperSimplex;
