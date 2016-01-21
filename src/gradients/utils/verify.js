module.exports = function(colorsAndPositions) {
	var valid = true;
	for (var i = colorsAndPositions.length - 1; i >= 0; i--) {
		if(colorsAndPositions[i].length != 2) return false;
	};
	colorsAndPositions.sort(function(a, b) {
		return a[1] - b[1];
	});
	return valid;
};